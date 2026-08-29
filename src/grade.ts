import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, extname, isAbsolute, join, relative, resolve } from "node:path";
import { type Command } from "commander";
import yaml from "js-yaml";
import { collectResolvedDeliverables, loadCatalogDocs } from "./catalog-build.js";
import { resolveBasePath } from "./catalog-paths.js";
import { resolveViewpointsDoc } from "./review-plan.js";
import type { GradeRubric, ReviewViewpoint, ReviewViewpointsDoc } from "./review-types.js";
import {
  getProjectCatalogPath,
  getProjectViewpointsPath,
  loadConfig,
  specdojoRootDir,
  type SpecDojoProjectConfig,
} from "./specdojo-config.js";
import { listFilesRecursive } from "./exec-shared.js";

export type GradeTarget = "kata" | "deliverable";
export type GradeSeverity = "blocker" | "major" | "minor" | "note";

export type GradeFindingInput = {
  id?: string;
  severity: GradeSeverity;
  message: string;
  line?: number;
};

export type GradeViewpointInput = {
  id: string;
  level: number;
  findings?: GradeFindingInput[];
};

export type GradeDocumentInput = {
  path: string;
  viewpoints: GradeViewpointInput[];
};

export type GradeSubmission = {
  rubric: string;
  graded_by: string;
  documents: GradeDocumentInput[];
};

export type GradeValidationIssue = { path: string; message: string };

type MarkdownDocument = {
  data: Record<string, unknown>;
  body: string;
};

const FINDING_RE =
  /^[ \t]*<!--[ \t]*specdojo:finding[ \t]+id=([^ \t]+)[ \t]+severity=(blocker|major|minor|note)[ \t]+rule=([^ \t]+)[ \t]+(.*?)[ \t]*-->[ \t]*(?:\r?\n|$)/gm;
const KATA_DIRS = ["rulebooks", "recipes", "samples", "templates"] as const;
const SEVERITY_LEVEL_CAP: Record<GradeSeverity, number> = {
  blocker: 0,
  major: 2,
  minor: 3,
  note: 4,
};

function levelCapForFindings(findings: readonly GradeFindingInput[]): number {
  const majorCount = findings.filter((finding) => finding.severity === "major").length;
  const severityCap = findings.reduce(
    (current, finding) => Math.min(current, SEVERITY_LEVEL_CAP[finding.severity]),
    4,
  );
  return majorCount >= 2 ? Math.min(severityCap, 1) : severityCap;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseMarkdown(content: string, path: string): MarkdownDocument {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) throw new Error(`${path}: Markdown frontmatter is required`);
  const parsed = yaml.load(match[1]);
  if (!isRecord(parsed) || !isRecord(parsed.specdojo)) {
    throw new Error(`${path}: frontmatter must contain a specdojo mapping`);
  }
  return { data: parsed, body: (match[2] ?? "").replace(/^(?:\r?\n)+/, "") };
}

function serializeMarkdown(document: MarkdownDocument): string {
  return `---\n${yaml.dump(document.data, { lineWidth: 120, noRefs: true }).trimEnd()}\n---\n\n${document.body.replace(/^\n+/, "")}`;
}

function withoutFindingComments(body: string): string {
  return body.replace(FINDING_RE, "");
}

function stableContentHash(document: MarkdownDocument): string {
  const cloned = structuredClone(document.data);
  const specdojo = isRecord(cloned.specdojo) ? cloned.specdojo : {};
  delete specdojo.grade;
  return createHash("sha256")
    .update(yaml.dump(cloned, { sortKeys: true, noRefs: true, lineWidth: -1 }))
    .update("\n")
    .update(withoutFindingComments(document.body))
    .digest("hex");
}

function sanitizeCommentText(value: string): string {
  return value
    .replace(/--+/g, "—")
    .replace(/[\r\n]+/g, " ")
    .trim();
}

function findingComment(
  finding: Required<Pick<GradeFindingInput, "id">> & GradeFindingInput,
  rule: string,
): string {
  return `<!-- specdojo:finding id=${finding.id} severity=${finding.severity} rule=${rule} ${sanitizeCommentText(finding.message)} -->`;
}

function insertFindings(body: string, viewpoints: GradeViewpointInput[]): string {
  const lines = withoutFindingComments(body).split("\n");
  const insertions = new Map<number, string[]>();
  const usedIds = new Set(
    viewpoints.flatMap((viewpoint) =>
      (viewpoint.findings ?? []).flatMap((finding) => (finding.id ? [finding.id] : [])),
    ),
  );
  let sequence = 0;
  for (const viewpoint of viewpoints) {
    for (const finding of viewpoint.findings ?? []) {
      let id = finding.id?.trim();
      if (!id) {
        do {
          sequence += 1;
          id = `F${String(sequence).padStart(3, "0")}`;
        } while (usedIds.has(id));
        usedIds.add(id);
      }
      const index = Math.max(0, Math.min(lines.length, (finding.line ?? 1) - 1));
      const existing = insertions.get(index) ?? [];
      existing.push(findingComment({ ...finding, id }, viewpoint.id));
      insertions.set(index, existing);
    }
  }
  const output: string[] = [];
  for (let index = 0; index <= lines.length; index += 1) {
    output.push(...(insertions.get(index) ?? []));
    if (index < lines.length) output.push(lines[index]);
  }
  return output.join("\n").replace(/^\n+/, "");
}

function resolveProject(projectOption?: string): {
  id: string;
  project: SpecDojoProjectConfig;
} {
  const { config } = loadConfig();
  if (!config) throw new Error("grade commands require .specdojo/specdojo.config.json");
  const id =
    projectOption?.trim() || config.current_project || Object.keys(config.projects)[0] || "";
  const project = config.projects[id];
  if (!project) throw new Error(`Unknown project: ${id}`);
  return { id, project };
}

function loadViewpoints(projectOption?: string): ReviewViewpointsDoc {
  const { project } = resolveProject(projectOption);
  const path = getProjectViewpointsPath(project);
  if (!path) throw new Error("viewpoints_path is required for grade");
  return resolveViewpointsDoc(resolve(specdojoRootDir(), path));
}

function assertRubric(doc: ReviewViewpointsDoc): GradeRubric {
  const rubric = doc.grade_rubric;
  if (!rubric) throw new Error("Resolved viewpoints do not define grade_rubric");
  return rubric;
}

function repoRelativePath(path: string): string {
  return relative(specdojoRootDir(), path).replace(/\\/g, "/");
}

function resolveSafeMarkdownPath(input: string): string {
  const root = specdojoRootDir();
  const absolute = resolve(root, input);
  const rel = repoRelativePath(absolute);
  if (rel.startsWith("../") || isAbsolute(rel))
    throw new Error(`Path is outside repository: ${input}`);
  if (extname(absolute).toLowerCase() !== ".md") {
    throw new Error(`${input}: grade currently writes inline findings only for Markdown`);
  }
  if (!existsSync(absolute)) throw new Error(`Document not found: ${input}`);
  return absolute;
}

function resolveSafeRepositoryPath(input: string, option: string): string {
  const root = specdojoRootDir();
  const absolute = resolve(root, input);
  const rel = relative(root, absolute);
  if (rel.startsWith("../") || isAbsolute(rel)) {
    throw new Error(`${option} must be inside the repository`);
  }
  return absolute;
}

export function discoverGradeTargets(opts: {
  target: GradeTarget;
  project?: string;
  paths?: string[];
  changedOnly?: boolean;
}): string[] {
  const root = specdojoRootDir();
  let candidates: string[];
  if (opts.paths && opts.paths.length > 0) {
    candidates = opts.paths.map(resolveSafeMarkdownPath);
  } else if (opts.target === "kata") {
    candidates = KATA_DIRS.flatMap((dir) =>
      listFilesRecursive(join(root, "docs/ja/specdojo", dir)).filter((path) =>
        path.endsWith(".md"),
      ),
    );
  } else {
    const { project } = resolveProject(opts.project);
    const catalog = getProjectCatalogPath(project);
    if (!catalog) throw new Error("catalog_path is required for deliverable grading");
    const paths = new Set<string>();
    for (const loaded of loadCatalogDocs(resolve(root, catalog))) {
      const resolved: Parameters<typeof collectResolvedDeliverables>[2] = [];
      collectResolvedDeliverables(
        loaded.doc.groups,
        resolveBasePath("", loaded.doc.base_path),
        resolved,
      );
      for (const item of resolved) {
        if (item.item.kind !== "generated" && item.item.path && item.resolvedPath.endsWith(".md")) {
          const path = resolve(root, item.resolvedPath);
          if (existsSync(path)) paths.add(path);
        }
      }
    }
    candidates = [...paths];
  }
  const unique = [...new Set(candidates)].sort();
  if (!opts.changedOnly) return unique;
  return unique.filter((path) => {
    const parsed = parseMarkdown(readFileSync(path, "utf8"), repoRelativePath(path));
    const specdojo = parsed.data.specdojo as Record<string, unknown>;
    const grade = isRecord(specdojo.grade) ? specdojo.grade : {};
    return grade.content_hash !== stableContentHash(parsed);
  });
}

function continuousViewpoints(doc: ReviewViewpointsDoc, target: GradeTarget): ReviewViewpoint[] {
  return (doc.viewpoints ?? []).filter(
    (viewpoint) =>
      viewpoint.continuous === true &&
      viewpoint.evaluation !== "human" &&
      (viewpoint.grade_targets === undefined || viewpoint.grade_targets.includes(target)),
  );
}

function agentViewpoints(doc: ReviewViewpointsDoc, target: GradeTarget): ReviewViewpoint[] {
  return continuousViewpoints(doc, target).filter((viewpoint) => viewpoint.evaluation === "agent");
}

function deterministicResults(
  document: MarkdownDocument,
  definitions: ReviewViewpointsDoc,
  target: GradeTarget,
): GradeViewpointInput[] {
  const results: GradeViewpointInput[] = [];
  for (const viewpoint of continuousViewpoints(definitions, target).filter(
    (item) => item.evaluation === "deterministic",
  )) {
    const findings: GradeFindingInput[] = [];
    const specdojo = document.data.specdojo as Record<string, unknown>;
    if (viewpoint.id === "vp-arc-document-structure") {
      for (const key of ["id", "type", "status"] as const) {
        if (typeof specdojo[key] !== "string" || !String(specdojo[key]).trim()) {
          findings.push({
            severity: "major",
            message: `Frontmatter の specdojo.${key} が未設定です。`,
            line: 1,
          });
        }
      }
      if (!/^#\s+\S/m.test(document.body)) {
        findings.push({ severity: "major", message: "本文に H1 見出しがありません。", line: 1 });
      }
    }
    if (viewpoint.id === "vp-qe-config-validity") {
      const placeholderLine = document.body
        .split("\n")
        .findIndex((line) => /(?:_TODO_|_ASSUMPTION_)/.test(line));
      if (placeholderLine >= 0) {
        findings.push({
          severity: "major",
          message: "未解決の _TODO_ / _ASSUMPTION_ が残っています。",
          line: placeholderLine + 1,
        });
      }
    }
    const cap = levelCapForFindings(findings);
    results.push({ id: viewpoint.id, level: cap, findings });
  }
  return results;
}

export function renderGradePrompt(opts: {
  target: GradeTarget;
  paths: string[];
  viewpoints: ReviewViewpointsDoc;
}): string {
  const rubric = assertRubric(opts.viewpoints);
  const viewpoints = agentViewpoints(opts.viewpoints, opts.target);
  const lines = [
    "# SpecDojo grade assessment",
    "",
    `rubric: ${rubric.id}`,
    `target: ${opts.target}`,
    "",
    "各文書を共通 viewpoint と category rubric で 0-4 判定してください。level 3 以下には finding が必須です。deterministic viewpoint は CLI が判定するため出力に含めません。",
    "finding は severity（blocker / major / minor / note）、対象直前の本文行番号、具体的な修正理由を含めます。line は Frontmatter を除く本文の1始まり（通常は H1 が1行目）です。",
    "出力は GradeSubmission JSON のみとし、facts である path と rubric は変更しません。",
    "",
    "## Output JSON",
    "",
    "```json",
    JSON.stringify(
      {
        rubric: rubric.id,
        graded_by: "<agent-id>",
        documents: opts.paths.map((path) => ({
          path: repoRelativePath(path),
          viewpoints: viewpoints.map((viewpoint) => ({
            id: viewpoint.id,
            level: 4,
            findings: [],
          })),
        })),
      },
      null,
      2,
    ),
    "```",
    "",
    "## Rubric",
    "",
    ...rubric.levels.map(
      (level) =>
        `- ${level.level} (${level.name}, review=${level.review_verdict}): ${level.description}`,
    ),
    "",
    "## Viewpoints",
    "",
    ...viewpoints.map(
      (viewpoint) =>
        `- ${viewpoint.id} [${viewpoint.category}/${viewpoint.evaluation}]: ${viewpoint.check} Evidence: ${viewpoint.evidence}`,
    ),
  ];
  for (const path of opts.paths) {
    const rel = repoRelativePath(path);
    const document = parseMarkdown(readFileSync(path, "utf8"), rel);
    lines.push(
      "",
      `## Document: ${rel}`,
      "",
      "Frontmatter（CLI の決定的判定対象）:",
      "",
      "```yaml",
      yaml.dump(document.data, { lineWidth: 120, noRefs: true }).trimEnd(),
      "```",
      "",
      "本文（finding.line は次の H1 を1行目として数える）:",
      "",
      "```markdown",
      document.body.replace(/^\n+/, ""),
      "```",
    );
  }
  return `${lines.join("\n")}\n`;
}

export function parseGradeSubmission(raw: string): GradeSubmission {
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch (error) {
    throw new Error(
      `Grade submission must be JSON: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  if (
    !isRecord(value) ||
    typeof value.rubric !== "string" ||
    typeof value.graded_by !== "string" ||
    !Array.isArray(value.documents)
  ) {
    throw new Error("Grade submission requires rubric, graded_by, and documents[]");
  }
  return value as GradeSubmission;
}

export function validateGradeSubmission(
  submission: GradeSubmission,
  doc: ReviewViewpointsDoc,
  target: GradeTarget,
): GradeValidationIssue[] {
  const issues: GradeValidationIssue[] = [];
  const rubric = assertRubric(doc);
  if (submission.rubric !== rubric.id)
    issues.push({ path: "$", message: `rubric must be ${rubric.id}` });
  if (!submission.graded_by.trim())
    issues.push({ path: "$", message: "graded_by must not be empty" });
  const required = agentViewpoints(doc, target);
  const allowed = new Map(required.map((viewpoint) => [viewpoint.id, viewpoint]));
  const paths = new Set<string>();
  for (const [documentIndex, document] of submission.documents.entries()) {
    const where = `documents[${documentIndex}]`;
    if (!document || typeof document.path !== "string" || !Array.isArray(document.viewpoints)) {
      issues.push({ path: where, message: "path and viewpoints[] are required" });
      continue;
    }
    if (paths.has(document.path))
      issues.push({ path: where, message: `duplicate path: ${document.path}` });
    paths.add(document.path);
    const ids = new Set<string>();
    const findingIds = new Set<string>();
    for (const [viewpointIndex, result] of document.viewpoints.entries()) {
      const resultPath = `${where}.viewpoints[${viewpointIndex}]`;
      if (!result || !allowed.has(result.id)) {
        issues.push({
          path: resultPath,
          message: `unknown or non-continuous viewpoint: ${result?.id ?? ""}`,
        });
        continue;
      }
      if (ids.has(result.id))
        issues.push({ path: resultPath, message: `duplicate viewpoint: ${result.id}` });
      ids.add(result.id);
      if (!Number.isInteger(result.level) || result.level < 0 || result.level > 4) {
        issues.push({ path: resultPath, message: "level must be an integer from 0 to 4" });
      }
      const findings = result.findings ?? [];
      if (!Array.isArray(findings)) {
        issues.push({ path: resultPath, message: "findings must be an array" });
        continue;
      }
      if (result.level < 4 && findings.length === 0) {
        issues.push({ path: resultPath, message: "level 0-3 requires at least one finding" });
      }
      for (const [findingIndex, finding] of findings.entries()) {
        if (
          !finding ||
          !Object.hasOwn(SEVERITY_LEVEL_CAP, finding.severity) ||
          typeof finding.message !== "string" ||
          !finding.message.trim()
        ) {
          issues.push({
            path: `${resultPath}.findings[${findingIndex}]`,
            message: "severity and non-empty message are required",
          });
          continue;
        }
        if (finding.id !== undefined) {
          if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(finding.id)) {
            issues.push({
              path: `${resultPath}.findings[${findingIndex}].id`,
              message: "id must contain only letters, digits, dot, underscore, or hyphen",
            });
          } else if (findingIds.has(finding.id)) {
            issues.push({
              path: `${resultPath}.findings[${findingIndex}].id`,
              message: `duplicate finding id: ${finding.id}`,
            });
          }
          findingIds.add(finding.id);
        }
        if (finding.line !== undefined && (!Number.isInteger(finding.line) || finding.line < 1)) {
          issues.push({
            path: `${resultPath}.findings[${findingIndex}].line`,
            message: "line must be a positive integer",
          });
        }
      }
      const cap = levelCapForFindings(findings);
      if (result.level > cap)
        issues.push({ path: resultPath, message: `finding severity caps level at ${cap}` });
    }
    for (const viewpoint of required) {
      if (!ids.has(viewpoint.id)) {
        issues.push({ path: where, message: `missing agent viewpoint: ${viewpoint.id}` });
      }
    }
  }
  return issues;
}

function scoreDocument(
  input: GradeDocumentInput,
  rubric: GradeRubric,
  doc: ReviewViewpointsDoc,
  target: GradeTarget,
) {
  const definitions = new Map((doc.viewpoints ?? []).map((viewpoint) => [viewpoint.id, viewpoint]));
  const categoryLevels = new Map<string, number[]>();
  const counts: Record<GradeSeverity, number> = { blocker: 0, major: 0, minor: 0, note: 0 };
  const viewpointOutput: Record<string, { level: number; score: number }> = {};
  for (const result of input.viewpoints) {
    const definition = definitions.get(result.id)!;
    const values = categoryLevels.get(definition.category) ?? [];
    values.push(result.level);
    categoryLevels.set(definition.category, values);
    viewpointOutput[result.id] = { level: result.level, score: result.level * 25 };
    for (const finding of result.findings ?? []) counts[finding.severity] += 1;
  }
  const categories: Record<string, { score: number }> = {};
  let weighted = 0;
  let totalWeight = 0;
  for (const [category, levels] of categoryLevels) {
    const score = Math.round((levels.reduce((sum, level) => sum + level, 0) / levels.length) * 25);
    categories[category] = { score };
    const weight = rubric.weights[target][category] ?? 0;
    weighted += score * weight;
    totalWeight += weight;
  }
  const score = totalWeight > 0 ? Math.round(weighted / totalWeight) : 0;
  const verdict =
    counts.blocker > 0
      ? "fail"
      : counts.major > 0 || score < rubric.pass_score
        ? "needs-work"
        : "pass";
  return { score, verdict, categories, viewpoints: viewpointOutput, findings: counts };
}

export function applyGradeSubmission(opts: {
  submission: GradeSubmission;
  viewpoints: ReviewViewpointsDoc;
  target: GradeTarget;
  dryRun?: boolean;
  now?: Date;
}): string[] {
  const issues = validateGradeSubmission(opts.submission, opts.viewpoints, opts.target);
  if (issues.length > 0)
    throw new Error(issues.map((issue) => `${issue.path}: ${issue.message}`).join("\n"));
  const changed: string[] = [];
  for (const input of opts.submission.documents) {
    const absolute = resolveSafeMarkdownPath(input.path);
    const rel = repoRelativePath(absolute);
    const current = readFileSync(absolute, "utf8");
    const next = gradeMarkdownContent({
      content: current,
      path: rel,
      input,
      viewpoints: opts.viewpoints,
      target: opts.target,
      gradedBy: opts.submission.graded_by,
      now: opts.now,
    });
    if (next !== current) {
      changed.push(rel);
      if (!opts.dryRun) writeFileSync(absolute, next, "utf8");
    }
  }
  return changed;
}

export function gradeMarkdownContent(opts: {
  content: string;
  path: string;
  input: GradeDocumentInput;
  viewpoints: ReviewViewpointsDoc;
  target: GradeTarget;
  gradedBy: string;
  now?: Date;
}): string {
  const document = parseMarkdown(opts.content, opts.path);
  const specdojo = document.data.specdojo as Record<string, unknown>;
  const evaluated = {
    ...opts.input,
    viewpoints: [
      ...opts.input.viewpoints,
      ...deterministicResults(document, opts.viewpoints, opts.target),
    ],
  };
  const rubric = assertRubric(opts.viewpoints);
  const summary = scoreDocument(evaluated, rubric, opts.viewpoints, opts.target);
  const body = insertFindings(document.body, evaluated.viewpoints);
  specdojo.grade = {
    rubric: rubric.id,
    target: opts.target,
    verdict: summary.verdict,
    score: summary.score,
    graded_at: (opts.now ?? new Date()).toISOString(),
    graded_by: opts.gradedBy,
    content_hash: stableContentHash({ data: document.data, body }),
    categories: summary.categories,
    viewpoints: summary.viewpoints,
    findings: summary.findings,
  };
  return serializeMarkdown({ data: document.data, body });
}

export function validateGradedDocument(path: string): string[] {
  const absolute = resolveSafeMarkdownPath(path);
  const rel = repoRelativePath(absolute);
  return validateGradedMarkdown(readFileSync(absolute, "utf8"), rel);
}

export function validateGradedMarkdown(content: string, path: string): string[] {
  const document = parseMarkdown(content, path);
  const specdojo = document.data.specdojo as Record<string, unknown>;
  const grade = isRecord(specdojo.grade) ? specdojo.grade : null;
  if (!grade) return [`${path}: specdojo.grade is missing`];
  const findings = isRecord(grade.findings) ? grade.findings : {};
  const actual: Record<GradeSeverity, number> = { blocker: 0, major: 0, minor: 0, note: 0 };
  for (const match of document.body.matchAll(FINDING_RE)) actual[match[2] as GradeSeverity] += 1;
  const errors: string[] = [];
  for (const severity of Object.keys(actual) as GradeSeverity[]) {
    if (findings[severity] !== actual[severity])
      errors.push(
        `${path}: findings.${severity}=${String(findings[severity])}, comments=${actual[severity]}`,
      );
  }
  if (grade.content_hash !== stableContentHash(document))
    errors.push(`${path}: content changed after the last grade`);
  return errors;
}

function collectPathOption(value: string, previous: string[]): string[] {
  return [...previous, value];
}

function requireTarget(value: string): GradeTarget {
  if (value !== "kata" && value !== "deliverable")
    throw new Error("--target must be kata or deliverable");
  return value;
}

function commandError(error: unknown): void {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}

export function registerGradeCommand(program: Command): void {
  const grade = program
    .command("grade")
    .description("Continuously assess Kata and deliverable content quality");
  const addSelection = (command: Command) =>
    command
      .requiredOption("--target <target>", "kata or deliverable")
      .option("--project <projectId>", "Project id in specdojo.config.json")
      .option(
        "--path <path>",
        "Grade only this Markdown document (repeatable)",
        collectPathOption,
        [],
      )
      .option("--changed-only", "Select documents changed since their latest grade", false);

  addSelection(
    grade.command("prompt").description("Render the shared-rubric prompt for an assessment agent"),
  )
    .option("--out <path>", "Write the prompt to a repository-relative path")
    .action((options) => {
      try {
        const target = requireTarget(options.target);
        const viewpoints = loadViewpoints(options.project);
        const paths = discoverGradeTargets({
          target,
          project: options.project,
          paths: options.path,
          changedOnly: options.changedOnly,
        });
        const prompt = renderGradePrompt({ target, paths, viewpoints });
        if (options.out) {
          const output = resolveSafeRepositoryPath(options.out, "--out");
          if (!existsSync(dirname(output)))
            throw new Error(`Output directory not found: ${dirname(output)}`);
          writeFileSync(output, prompt, "utf8");
        } else process.stdout.write(prompt);
      } catch (error) {
        commandError(error);
      }
    });

  addSelection(
    grade
      .command("apply")
      .description("Validate agent JSON, calculate scores, and update documents"),
  )
    .requiredOption("--from <path>", "GradeSubmission JSON produced by the assessment agent")
    .option("--dry-run", "Validate and list updates without writing", false)
    .action((options) => {
      try {
        const target = requireTarget(options.target);
        const viewpoints = loadViewpoints(options.project);
        const submission = parseGradeSubmission(
          readFileSync(resolveSafeRepositoryPath(options.from, "--from"), "utf8"),
        );
        const selected = new Set(
          discoverGradeTargets({
            target,
            project: options.project,
            paths: options.path,
            changedOnly: options.changedOnly,
          }).map(repoRelativePath),
        );
        for (const document of submission.documents)
          if (!selected.has(repoRelativePath(resolve(specdojoRootDir(), document.path))))
            throw new Error(`${document.path}: not selected by the current grade filters`);
        const changed = applyGradeSubmission({
          submission,
          viewpoints,
          target,
          dryRun: options.dryRun,
        });
        for (const path of changed)
          process.stdout.write(`${options.dryRun ? "would update" : "updated"}: ${path}\n`);
        process.stdout.write(
          `Graded: ${submission.documents.length}, updated: ${changed.length}\n`,
        );
      } catch (error) {
        commandError(error);
      }
    });

  addSelection(
    grade.command("validate").description("Validate stored grade hashes and finding counts"),
  ).action((options) => {
    try {
      const target = requireTarget(options.target);
      const paths = discoverGradeTargets({
        target,
        project: options.project,
        paths: options.path,
        changedOnly: false,
      });
      const errors = paths.flatMap(validateGradedDocument);
      for (const error of errors) process.stderr.write(`ERROR: ${error}\n`);
      process.stdout.write(`Validated: ${paths.length} document(s), ${errors.length} error(s)\n`);
      if (errors.length > 0) process.exitCode = 1;
    } catch (error) {
      commandError(error);
    }
  });
}
