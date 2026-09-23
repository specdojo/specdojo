import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export const ORCHESTRATOR_SOURCE = ".agents/specdojo-orchestrator.agent.md";

export const ORCHESTRATOR_WRAPPERS = [
  { path: ".claude/agents/specdojo-orchestrator.md", format: "markdown" },
  { path: ".github/agents/specdojo-orchestrator.md", format: "markdown" },
  { path: ".opencode/agents/gemma-orchestrator.md", format: "markdown" },
  { path: ".opencode/agents/qwen-orchestrator.md", format: "markdown" },
  { path: ".codex/agents/specdojo-orchestrator.toml", format: "toml" },
];

export function extractMarkdownBody(source, filePath = "Markdown wrapper") {
  const frontmatter = /^---\r?\n[\s\S]*?^---\r?\n/mu.exec(source);
  if (!frontmatter || frontmatter.index !== 0) {
    throw new Error(`${filePath}: frontmatter の終端を特定できません`);
  }
  return source.slice(frontmatter[0].length).replace(/^\r?\n/u, "");
}

export function extractTomlBody(source, filePath = "TOML wrapper") {
  const instructions = /^developer_instructions\s*=\s*"""\r?\n(?<body>[\s\S]*?)^"""\s*$/mu.exec(
    source,
  );
  if (!instructions?.groups) {
    throw new Error(`${filePath}: developer_instructions の複数行文字列を特定できません`);
  }
  return instructions.groups.body;
}

function firstDifference(expected, actual) {
  const limit = Math.min(expected.length, actual.length);
  let offset = 0;
  while (offset < limit && expected[offset] === actual[offset]) offset += 1;
  const line = expected.slice(0, offset).split("\n").length;
  return { line, offset };
}

export function validateOrchestratorSync(rootDir = process.cwd()) {
  const canonical = readFileSync(resolve(rootDir, ORCHESTRATOR_SOURCE), "utf8");
  const mismatches = [];

  for (const wrapper of ORCHESTRATOR_WRAPPERS) {
    const wrapperSource = readFileSync(resolve(rootDir, wrapper.path), "utf8");
    const body =
      wrapper.format === "markdown"
        ? extractMarkdownBody(wrapperSource, wrapper.path)
        : extractTomlBody(wrapperSource, wrapper.path);

    if (body !== canonical) {
      mismatches.push({ path: wrapper.path, ...firstDifference(canonical, body) });
    }
  }

  return mismatches;
}

export function runValidateOrchestratorSync({
  rootDir = process.cwd(),
  report = (message) => process.stderr.write(message),
  confirm = (message) => process.stdout.write(message),
} = {}) {
  try {
    const mismatches = validateOrchestratorSync(rootDir);
    if (mismatches.length === 0) {
      confirm(`orchestrator body sync: OK (${ORCHESTRATOR_WRAPPERS.length} wrappers)\n`);
      return 0;
    }

    for (const mismatch of mismatches) {
      report(
        `orchestrator body sync: MISMATCH ${mismatch.path} ` +
          `(line ${mismatch.line}, byte ${mismatch.offset})\n`,
      );
    }
    return 1;
  } catch (error) {
    report(`orchestrator body sync: ERROR ${error instanceof Error ? error.message : error}\n`);
    return 1;
  }
}

const isEntryPoint =
  process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isEntryPoint) {
  process.exitCode = runValidateOrchestratorSync();
}
