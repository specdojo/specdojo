import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { GIT_OUTPUT_MAX_BUFFER, gitEnvironment, gitOutput, gitResult } from "../shared/git.js";
import {
  resolveRegisterBranchTarget,
  type RegisterBranchTarget,
} from "../shared/register-branch.js";
import { validateRegisterEventDocs } from "./events.js";
import { validateRegisterItemDocs } from "./item.js";

const ZERO_OBJECT = /^0+$/u;

export type RegisterPushCheckInput = {
  /** 検査する commit（push する先端）。 */
  commit: string;
  /** push 先の現在の先端。省略または全 0 のときは、リモートにまだない commit だけを調べる。 */
  base?: string;
  /** push 先の ref（`refs/heads/...`）。指定し、register のブランチと違うときは検査しない。 */
  remoteRef?: string;
};

export type RegisterPushCheckResult =
  | { status: "disabled" }
  | { status: "skipped"; reason: string }
  | { status: "checked"; scopeViolations: string[]; shapeViolations: string[] };

/** register の範囲（個票・イベントの置き場）の外にあるパスを返す。 */
export function findOutOfScopePaths(
  target: Pick<RegisterBranchTarget, "registerPath" | "eventsPath">,
  paths: readonly string[],
): string[] {
  const prefixes = [target.registerPath, target.eventsPath];
  return paths.filter((path) => !prefixes.some((prefix) => path.startsWith(`${prefix}/`)));
}

/** 個票とイベントの対応・イベントの形・個票の形を検査する。`registerDir` は個票の置き場。 */
export function validateRegisterShape(registerDir: string, timeZone: string): string[] {
  return [
    ...validateRegisterItemDocs(registerDir).errors,
    ...validateRegisterEventDocs(registerDir, timeZone),
  ];
}

function splitPaths(output: string): string[] {
  return output.split("\0").filter(Boolean);
}

function commitsToCheck(target: RegisterBranchTarget, input: RegisterPushCheckInput): string[] {
  const range =
    input.base && !ZERO_OBJECT.test(input.base)
      ? [`${input.base}..${input.commit}`]
      : [input.commit, "--not", `--remotes=${target.remote}`];
  const lines = gitOutput(target.repoRoot, ["rev-list", "--parents", ...range, "--"]).trim();
  return lines ? lines.split("\n") : [];
}

function scopeViolations(target: RegisterBranchTarget, input: RegisterPushCheckInput): string[] {
  const violations: string[] = [];
  for (const line of commitsToCheck(target, input)) {
    const [commit, firstParent] = line.split(" ") as [string, string | undefined];
    // commit ごとに調べる。正味の差分では、無関係な変更とその取り消しが隠れてしまう。
    const changed = splitPaths(
      gitOutput(
        target.repoRoot,
        firstParent
          ? ["diff", "--name-only", "-z", "--no-renames", firstParent, commit]
          : ["diff-tree", "--root", "--no-commit-id", "--name-only", "-r", "-z", commit],
      ),
    );
    for (const path of findOutOfScopePaths(target, changed)) {
      violations.push(`${commit.slice(0, 12)}: ${path}`);
    }
  }
  return violations;
}

function shapeViolations(target: RegisterBranchTarget, commit: string, timeZone: string): string[] {
  if (
    gitResult(target.repoRoot, ["cat-file", "-e", `${commit}:${target.registerPath}`]).status !== 0
  ) {
    return [];
  }
  const archive = spawnSync(
    "git",
    ["-C", target.repoRoot, "archive", "--format=tar", commit, "--", target.registerPath],
    { env: gitEnvironment(), maxBuffer: GIT_OUTPUT_MAX_BUFFER },
  );
  if (archive.status !== 0) {
    throw new Error(`git archive ${commit} failed: ${String(archive.stderr ?? "")}`.trim());
  }
  const directory = mkdtempSync(join(tmpdir(), "specdojo-register-push-"));
  try {
    const extract = spawnSync("tar", ["-x", "-C", directory], { input: archive.stdout });
    if (extract.status !== 0) {
      throw new Error(`tar extract failed: ${String(extract.stderr ?? "")}`.trim());
    }
    return validateRegisterShape(join(directory, target.registerPath), timeZone);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

/**
 * register のブランチへ push する commit を検査する（4a）。範囲の外のファイルを含む commit と、
 * 先端の個票・イベントの形の違反を返す。hook（pre-push）と CI の両方がこの関数を使う。
 */
export function checkRegisterPush(
  projectId: string,
  timeZone: string,
  input: RegisterPushCheckInput,
): RegisterPushCheckResult {
  const target = resolveRegisterBranchTarget(projectId);
  if (!target) return { status: "disabled" };
  if (input.remoteRef && input.remoteRef !== `refs/heads/${target.branch}`) {
    return { status: "skipped", reason: `${input.remoteRef} is not ${target.branch}` };
  }
  return {
    status: "checked",
    scopeViolations: scopeViolations(target, input),
    shapeViolations: shapeViolations(target, input.commit, timeZone),
  };
}

/** 違反ごとに、どのファイルのどこが違うかと直し方を添えた報告を組み立てる。 */
export function formatRegisterPushReport(
  target: Pick<RegisterBranchTarget, "registerPath" | "eventsPath" | "branch">,
  result: { scopeViolations: readonly string[]; shapeViolations: readonly string[] },
): string {
  const lines: string[] = [];
  if (result.scopeViolations.length) {
    lines.push(
      `register の範囲の外のファイルを含む commit があります（<commit>: <path>）:`,
      ...result.scopeViolations.map((violation) => `  ${violation}`),
      `直し方: ${target.branch} には ${target.registerPath}/ と ${target.eventsPath}/ の配下だけを含められます。`,
      "  該当ファイルを commit から外し（git rebase -i で分ける）、feature ブランチと PR で develop へ入れてください。",
    );
  }
  if (result.shapeViolations.length) {
    lines.push(
      `個票とイベントの形の違反があります（${target.registerPath}/ 配下の <file>: <内容>）:`,
      ...result.shapeViolations.map((violation) => `  ${violation}`),
      "直し方: 個票を手で編集せず `specdojo register update|start|...` で遷移し、event を追記し直してください。",
      "  event の欠落・不一致は、該当 PJR-ID の events/pjr-XXXX.yaml と個票の item_status をそろえます。",
    );
  }
  return lines.join("\n");
}
