import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { isAbsolute, join, posix, relative } from "node:path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import { collectDocIndexEntries } from "../../docs/doc-index.js";
import { authoredKataPath, authoringKind, isAuthoringApproach } from "../../kata/authoring.js";
import type { Approach } from "../../shared/agent-types.js";
import { readSpecdojoNamespace } from "../../docs/frontmatter-namespace.js";
import { gitEnvironment } from "../../shared/git-environment.js";
import { resolveDeliverableByDocId, targetReferenceDirsForApproach } from "../plans-core.js";
import {
  delay,
  isLiveLock,
  readLockOwner,
  releaseLock,
  tryAcquireLock,
  type LockHandle,
  type WaitOptions,
} from "../slot-lock.js";
import { execLocksDir } from "./lock.js";

export type ChangeScope = { paths: string[]; unknown: boolean };
export type UnknownScopePolicy = "parallel" | "serialize";
export type ScopeWait = { item: string; blocker: string; overlap: string; at: string };

export function parseUnknownScopePolicy(value?: string): UnknownScopePolicy {
  if (value === undefined || value === "parallel" || value === "serialize")
    return value ?? "parallel";
  throw new Error("--unknown-scope must be parallel or serialize");
}

// No filesystem access: declarations may name a file that does not exist yet. Glob prefixes
// conservatively reserve their parent directory; line/function suffixes reserve the whole file.
export function normalizeScopePath(value: string): string | undefined {
  const text = value
    .trim()
    .replaceAll("\\", "/")
    .replace(/#.*$|:\d+(?::\d+)?$/g, "");
  if (!text || text.startsWith("/") || text.includes("://")) return undefined;
  const match = text.match(/^(?:([a-zA-Z][\w-]*):)?(.*)$/);
  if (!match) return undefined;
  const repo = match[1] ?? "project";
  let path = match[2]!;
  const glob = path.search(/[*?{[]/);
  if (glob >= 0) path = path.slice(0, glob).replace(/[^/]*$/, "");
  path = posix.normalize(path).replace(/\/$/, "");
  if (path === ".." || path.startsWith("../")) return undefined;
  return `${repo}:${path}`;
}

// Generated plans mix task inputs with shared operating instructions. Read only task-specific
// sections, including findings nested under the otherwise shared procedure section. Parse real
// headings so headings in fenced examples cannot change which sections are selected.
function scopeInputText(text: string): string {
  const isPlan = readSpecdojoNamespace(text).type === "exec-plan" || /^# .*Plan:/m.test(text);
  const body = text.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
  const headings = unified()
    .use(remarkParse)
    .parse(body)
    .children.filter((node) => node.type === "heading");
  const parts: string[] = [];
  let include = true;
  let start = 0;
  let currentSection = "";
  for (const heading of headings) {
    const offset = heading.position!.start.offset!;
    if (include) parts.push(body.slice(start, offset));
    const title = body
      .slice(offset, heading.position!.end.offset!)
      .replace(/^#+\s+(?:\d+(?:\.\d+)*\.\s*)?/, "")
      .trim();
    if (heading.depth === 2) {
      if (/^(?:対応結果|関連ドキュメント|共通|変更範囲による実行待ち)/.test(title)) {
        include = false;
        break;
      }
      include =
        !isPlan ||
        /^(?:この.*行うこと|対象|個票の(?:入力|追加完了条件)|概要|入力|完了条件|完了の狙い|作業内容|制約|根拠となる成果物と編集対象|新しく作る実践の型)/.test(
          title,
        );
    } else if (isPlan && heading.depth === 3) {
      // Findings are item-specific even when embedded in common instructions.
      if (
        /^(?:grade result から展開された finding|成果物から届いた Kata が原因の finding)$/.test(
          title,
        )
      )
        include = true;
      else if (/^進め方$/.test(currentSection)) include = false;
    }
    if (heading.depth === 2) currentSection = title;
    start = offset;
  }
  if (include) parts.push(body.slice(start));
  return parts.join("\n");
}

// Exclude only prose clauses that explicitly say not to edit their paths. Do not blacklist
// protected filenames: a positive mention elsewhere or an explicit target must still reserve
// them. Keep inline code intact so punctuation in paths cannot split a clause.
function scopeChangeText(text: string): string {
  const unchanged =
    /(?:変え(?:ない|ず)|(?:変更|編集|更新|修正)(?:し(?:ない|ません|なく)|せず)|触ら(?:ない|ず))(?:こと)?(?:が)?(?:\s*[（(][^（）()]*[）)])?\s*$/;
  const continuedAction = /(?:変更|編集|更新|修正|追加|削除)(?:し|して|する|します)(?:が)?\s*$/;
  const parts: string[] = [];
  let clause = "";
  const flush = () => {
    if (!unchanged.test(clause)) parts.push(clause);
    clause = "";
  };
  for (const [token] of text.matchAll(/`[^`\n]+`|[。;；\n|、,]|[^`。;；\n|、,]+|`/g)) {
    if (/^[。;；\n|]$/.test(token)) {
      flush();
    } else if (/^[、,]$/.test(token) && (unchanged.test(clause) || continuedAction.test(clause))) {
      // Split after a predicate, but keep comma-separated path lists with their predicate.
      flush();
    } else {
      clause += token;
    }
  }
  flush();
  return parts.join("\n");
}

export function inferChangeScope(params: {
  targets?: readonly string[];
  targetPath?: string;
  approach?: Approach;
  text?: string | readonly string[];
  projectId: string;
  repoRoot: string;
  catalogPath?: string;
  schedulePath?: string;
  documentPaths?: Record<string, string>;
}): ChangeScope {
  const paths = new Set<string>();
  let unresolved = false;
  const add = (path: string) => {
    const normalized = normalizeScopePath(path);
    if (!normalized) {
      unresolved = true;
      return;
    }
    if (!/(?:^|\/)generated(?:\/|$)/.test(normalized.split(":")[1]!)) paths.add(normalized);
  };
  const configPath = (path: string) => (isAbsolute(path) ? relative(params.repoRoot, path) : path);
  let index = params.documentPaths;
  const targets = isAuthoringApproach(params.approach)
    ? params.targets?.slice(0, 1)
    : params.targets;
  for (const target of targets ?? []) {
    if (
      params.approach === "catalog-planning" &&
      /^domain:[\w-]+$/.test(target) &&
      params.catalogPath
    ) {
      // Every domain may also update the shared dct-index.yaml.
      add(configPath(params.catalogPath));
      continue;
    }
    if (
      params.approach === "strategy-planning" &&
      /^track:[\w-]+$/.test(target) &&
      params.schedulePath
    ) {
      const track = target.slice("track:".length);
      add(join(configPath(params.schedulePath), `sch-strategy-${track}.yaml`));
      add(join(configPath(params.schedulePath), `sch-track-${track}.yaml`));
      continue;
    }
    if (target.includes("/") || /\.(?:md|tsx?|jsx?|json|ya?ml)$/.test(target)) {
      add(target);
      continue;
    }
    if (params.targetPath && target === targets?.[0]) {
      add(params.targetPath);
      continue;
    }
    index ??= collectDocIndexEntries(join(params.repoRoot, "docs"), params.repoRoot);
    const indexed = index[target]?.replace(/:\d+$/, "");
    if (indexed) {
      add(indexed);
      continue;
    }
    const kind = authoringKind(params.approach);
    if (kind) {
      add(authoredKataPath(target, kind));
      continue;
    }
    try {
      add(
        resolveDeliverableByDocId(
          params.catalogPath ?? "",
          params.projectId,
          target,
          params.repoRoot,
        ).info.resolvedPath,
      );
    } catch {
      unresolved = true;
    }
  }
  if (params.targetPath) add(params.targetPath);
  for (const path of targetReferenceDirsForApproach(params.approach)) add(path);
  // Backticks support root files; prose supports src/foo.ts.
  const texts = typeof params.text === "string" ? [params.text] : (params.text ?? []);
  const body = texts.map((text) => scopeChangeText(scopeInputText(text))).join("\n");
  const addTextPath = (path: string) => {
    // Per-item bookkeeping is already serialized by lifecycle and same-item locks. Its presence
    // in a generated plan must not make an otherwise unknown implementation scope look known.
    if (
      /(?:^|\/)execution\/(?:runs|exec|conventions)\/|(?:^|\/)controls\/project-register\/pjr-[^/]+\.md$/.test(
        path,
      )
    )
      return;
    add(path);
  };
  for (const match of body.matchAll(/`([^`\n]+)`/g)) {
    const value = match[1]!.replace(/#.*$|:\d+(?::\d+)?$/g, "");
    if (
      /^(?:[\w-]+:)?(?:\.?\/?[\w@.-]+\/)+[\w@.*?{}[\]/-]*$/.test(value) ||
      /^[\w.-]+\.[a-z0-9]+$/i.test(value)
    )
      addTextPath(value);
  }
  for (const match of body.matchAll(
    /(?:^|[\s`（(・])((?:[\w-]+:)?(?:[\w@.-]+\/)+[\w@.*?{}[\]/-]+)/gm,
  )) {
    const value = match[1]!;
    // A slash in prose can also mean alternatives (executor/reporter). Accept filenames,
    // explicit directory/glob syntax, or an existing repository path rather than every slash.
    const normalized = normalizeScopePath(value);
    if (
      /\/[^/]*\.[\w]+$|\/$|[*?{[]/.test(value) ||
      (normalized?.startsWith("project:") &&
        existsSync(join(params.repoRoot, normalized.slice("project:".length))))
    )
      addTextPath(value);
  }
  // Ignore derived views even when their layout predates generated/. Keep candidates if Git
  // cannot verify ignore rules (for example, a project not yet initialized as a repository).
  const candidates = [...paths]
    .filter((path) => path.startsWith("project:"))
    .map((path) => path.slice("project:".length));
  if (candidates.length) {
    const ignored = spawnSync("git", ["check-ignore", "-z", "--stdin"], {
      cwd: params.repoRoot,
      env: gitEnvironment(),
      input: `${candidates.join("\0")}\0`,
      encoding: "utf8",
      timeout: 10_000,
    });
    if (!ignored.error && (ignored.status === 0 || ignored.status === 1))
      for (const path of ignored.stdout.split("\0").filter(Boolean))
        paths.delete(`project:${path}`);
  }
  return { paths: [...paths].sort(), unknown: unresolved || paths.size === 0 };
}

export function scopeOverlap(a: ChangeScope, b: ChangeScope): string | undefined {
  if (a.unknown || b.unknown) return "unknown scope (serialize)";
  for (const left of a.paths)
    for (const right of b.paths) {
      const root = (value: string) => (value.endsWith(":.") ? value.slice(0, -1) : `${value}/`);
      if (left === right || left.startsWith(root(right)) || right.startsWith(root(left)))
        return `${left} <> ${right}`;
    }
  return undefined;
}

type Reservation = { item: string; scope: ChangeScope; state: "running" | "blocked" };
function writeReservation(path: string, record: Reservation): void {
  writeFileSync(`${path}.tmp`, JSON.stringify(record));
  renameSync(`${path}.tmp`, path);
}
export type ChangeScopeLease = {
  waits: ScopeWait[];
  finish: (integrated: boolean) => Promise<void>;
};

// The short registry mutex protects check+reserve as one operation, including across --join
// processes. Per-item heartbeat locks cover setup, agents, validation AND integration. Failed
// or crashed reservations remain barriers until that same item is retried/resumed.
export class ChangeScopeGate {
  private readonly directory: string;
  private readonly waits = new Map<string, ScopeWait[]>();
  constructor(
    executionPath: string,
    private readonly policy: UnknownScopePolicy = "parallel",
    private readonly options: WaitOptions = {},
  ) {
    this.directory = join(execLocksDir(executionPath), "change-scopes");
  }

  private async registry<T>(action: () => T): Promise<T> {
    mkdirSync(this.directory, { recursive: true });
    let handle: LockHandle | null;
    while (
      !(handle = tryAcquireLock(
        join(this.directory, "registry.lock"),
        { actor: "change-scope" },
        this.options,
      ))
    )
      await delay(this.options.pollMs ?? 200);
    try {
      return action();
    } finally {
      releaseLock(handle);
    }
  }

  async tryAcquire(item: string, scope: ChangeScope): Promise<ChangeScopeLease | null> {
    return this.registry(() => {
      const effective = { ...scope, unknown: scope.unknown && this.policy === "serialize" };
      const key = createHash("sha256").update(item).digest("hex");
      const recordPath = join(this.directory, `${key}.json`);
      const lockPath = join(this.directory, `${key}.lock`);
      if (existsSync(recordPath)) {
        const prior = JSON.parse(readFileSync(recordPath, "utf8")) as Reservation;
        effective.paths = [...new Set([...prior.scope.paths, ...effective.paths])];
        effective.unknown ||= prior.scope.unknown;
      }
      for (const name of readdirSync(this.directory).filter((name) =>
        /^[a-f0-9]{64}\.json$/.test(name),
      )) {
        const record = JSON.parse(readFileSync(join(this.directory, name), "utf8")) as Reservation;
        const live = isLiveLock(
          join(this.directory, name.replace(/\.json$/, ".lock")),
          this.options.staleMs,
        );
        if (record.item === item && !live) continue;
        const overlap = record.item === item ? "same item" : scopeOverlap(effective, record.scope);
        if (!overlap) continue;
        const waits = this.waits.get(item) ?? [];
        if (!waits.some((wait) => wait.blocker === record.item && wait.overlap === overlap)) {
          const wait = { item, blocker: record.item, overlap, at: new Date().toISOString() };
          waits.push(wait);
          this.waits.set(item, waits);
          appendFileSync(join(this.directory, "waits.jsonl"), `${JSON.stringify(wait)}\n`);
          process.stdout.write(`  [scope] waiting: ${item} — ${record.item}: ${overlap}\n`);
        }
        if (record.state === "blocked" || !live)
          throw new Error(
            `[scope] ${item} blocked by unintegrated ${record.item}: ${overlap}; resume/retry ${record.item} first`,
          );
        return null;
      }
      const handle = tryAcquireLock(lockPath, { actor: "change-scope", label: item }, this.options);
      if (!handle) return null;
      try {
        writeReservation(recordPath, { item, scope: effective, state: "running" });
      } catch (error) {
        releaseLock(handle);
        throw error;
      }
      const waits = this.waits.get(item) ?? [];
      this.waits.delete(item);
      let finished = false;
      return {
        waits,
        finish: async (integrated: boolean) => {
          await this.registry(() => {
            if (finished) return;
            if (readLockOwner(lockPath)?.token !== handle.token) {
              releaseLock(handle);
              finished = true;
              return;
            }
            if (integrated) rmSync(recordPath, { force: true });
            else writeReservation(recordPath, { item, scope: effective, state: "blocked" });
            releaseLock(handle);
            finished = true;
          });
        },
      };
    });
  }

  async acquire(item: string, scope: ChangeScope): Promise<ChangeScopeLease> {
    while (true) {
      const lease = await this.tryAcquire(item, scope);
      if (lease) return lease;
      await delay(this.options.pollMs ?? 200);
    }
  }

  async clearIntegrated(item: string): Promise<void> {
    await this.registry(() => {
      const key = createHash("sha256").update(item).digest("hex");
      // Batch leases are released by the worker. Standalone schedule resumes run under the
      // exclusive project lock and clear the retained failure barrier after integration.
      if (!isLiveLock(join(this.directory, `${key}.lock`), this.options.staleMs))
        rmSync(join(this.directory, `${key}.json`), { force: true });
    });
  }
}

export function appendScopeWaitNotes(
  planPath: string,
  waits: readonly ScopeWait[] | undefined,
): void {
  if (!waits?.length || !existsSync(planPath)) return;
  const plan = readFileSync(planPath, "utf8");
  // Convention expansion and checkpoint discovery require the snapshot reference to remain
  // the final paragraph. Insert runner notes before it, including for legacy plan references.
  const reference =
    /\n(?:`共通規約 sha256:[a-f0-9]{64}` `[^`\r\n]+`|\[共通規約 sha256:[a-f0-9]{64}\]\([^\s)]+\))\s*$/.exec(
      plan,
    );
  const offset = reference?.index ?? plan.length;
  const notes = `## 変更範囲による実行待ち\n\n${waits.map((wait) => `- ${wait.at}: \`${wait.item}\` は \`${wait.blocker}\` の統合を待った。重複: \`${wait.overlap}\`。`).join("\n")}\n`;
  writeFileSync(planPath, `${plan.slice(0, offset).trimEnd()}\n\n${notes}${plan.slice(offset)}`);
}

export function scopePlanMetadata(text: string): { targets?: string[]; approach?: Approach } {
  const metadata = readSpecdojoNamespace(text);
  return {
    targets: Array.isArray(metadata.targets)
      ? metadata.targets.filter((v): v is string => typeof v === "string")
      : undefined,
    approach: metadata.approach as Approach | undefined,
  };
}
