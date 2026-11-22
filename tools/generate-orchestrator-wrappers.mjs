// オーケストレーター規範の SSOT 本文を、各環境のラッパーと配布テンプレートへ書き戻す。
//
// 本文はバイト一致で保守する。手で複数箇所を直すと必ずずれるため、変更は SSOT だけに行い、
// このスクリプトで反映する。validate-orchestrator-sync.mjs は反映漏れを検出する側であり、
// 対象一覧はそちらを唯一の出所として共有する。
//
// 各ラッパー固有の頭（Markdown の frontmatter、TOML の設定行）は保持する。新しい対象を
// 増やす場合は、先に頭だけを持つファイルを作ってから対象一覧へ加える。頭の内容は provider
// ごとに異なり機械的に導けないため、このスクリプトでは生成しない。

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import {
  ORCHESTRATOR_SOURCE,
  ORCHESTRATOR_WRAPPERS,
  SKILL_COPIES,
} from "./validate-orchestrator-sync.mjs";

const MARKDOWN_FRONTMATTER = /^---\r?\n[\s\S]*?^---\r?\n/mu;
const TOML_INSTRUCTIONS = /^(developer_instructions\s*=\s*"""\r?\n)[\s\S]*?(^""")/mu;

function applyMarkdownBody(source, canonical, filePath) {
  const frontmatter = MARKDOWN_FRONTMATTER.exec(source);
  if (!frontmatter || frontmatter.index !== 0) {
    throw new Error(`${filePath}: frontmatter の終端を特定できません`);
  }
  const head = source.slice(0, frontmatter[0].length);
  // frontmatter 直後の空行は extractMarkdownBody が読み飛ばすため、既存の有無を保つ。
  const separator = /^\r?\n/u.exec(source.slice(frontmatter[0].length))?.[0] ?? "";
  return `${head}${separator}${canonical}`;
}

function applyTomlBody(source, canonical, filePath) {
  if (!TOML_INSTRUCTIONS.test(source)) {
    throw new Error(`${filePath}: developer_instructions の複数行文字列を特定できません`);
  }
  return source.replace(TOML_INSTRUCTIONS, (_match, open, close) => `${open}${canonical}${close}`);
}

export function generateOrchestratorWrappers(rootDir = process.cwd()) {
  const canonical = readFileSync(resolve(rootDir, ORCHESTRATOR_SOURCE), "utf8");
  const updated = [];

  for (const wrapper of ORCHESTRATOR_WRAPPERS) {
    const wrapperPath = resolve(rootDir, wrapper.path);
    const source = readFileSync(wrapperPath, "utf8");
    const next =
      wrapper.format === "raw"
        ? canonical
        : wrapper.format === "markdown"
          ? applyMarkdownBody(source, canonical, wrapper.path)
          : applyTomlBody(source, canonical, wrapper.path);
    if (next === source) continue;
    writeFileSync(wrapperPath, next, "utf8");
    updated.push(wrapper.path);
  }

  // skill の写しは正本のファイル全体をそのまま置く。写し先がなければ作る。
  for (const copy of SKILL_COPIES) {
    const content = readFileSync(resolve(rootDir, copy.source), "utf8");
    const copyPath = resolve(rootDir, copy.path);
    if (existsSync(copyPath) && readFileSync(copyPath, "utf8") === content) continue;
    mkdirSync(dirname(copyPath), { recursive: true });
    writeFileSync(copyPath, content, "utf8");
    updated.push(copy.path);
  }

  return updated;
}

export function runGenerateOrchestratorWrappers({
  rootDir = process.cwd(),
  report = (message) => process.stderr.write(message),
  confirm = (message) => process.stdout.write(message),
} = {}) {
  try {
    const updated = generateOrchestratorWrappers(rootDir);
    if (updated.length === 0) {
      confirm(
        `orchestrator body sync: already up to date (${ORCHESTRATOR_WRAPPERS.length + SKILL_COPIES.length} targets)\n`,
      );
      return 0;
    }
    for (const path of updated) confirm(`orchestrator body sync: updated ${path}\n`);
    return 0;
  } catch (error) {
    report(`orchestrator body sync: ERROR ${error instanceof Error ? error.message : error}\n`);
    return 1;
  }
}

const isEntryPoint =
  process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isEntryPoint) {
  process.exitCode = runGenerateOrchestratorWrappers();
}
