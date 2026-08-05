#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import fg from "fast-glob";
import { findForbiddenLinks } from "./history-links.js";

// 履歴蓄積ファイル（plan / result / pjr-NNNN-<topic> 等）の既定 glob。
// pjr-index.md は個票セルを Markdown リンクで参照する登録簿本体のため対象外にする。
const DEFAULT_PATTERNS = [
  "docs/ja/projects/**/exec/plans/**/*.md",
  "docs/ja/projects/**/exec/results/**/*.md",
  "docs/ja/projects/**/controls/project-register/pjr-*.md",
];
const DEFAULT_IGNORE = ["**/pjr-index.md"];

function parseArgs(): { patterns: string[]; ignore: string[] } {
  const args = process.argv.slice(2);
  const patterns: string[] = [];
  const ignore: string[] = [];

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--data") {
      const p = args[++i];
      if (p) patterns.push(p);
    } else if (args[i] === "--ignore") {
      const p = args[++i];
      if (p) ignore.push(p);
    } else {
      patterns.push(args[i]);
    }
  }

  return {
    patterns: patterns.length > 0 ? patterns : DEFAULT_PATTERNS,
    ignore: ignore.length > 0 ? ignore : DEFAULT_IGNORE,
  };
}

function main(): void {
  const { patterns, ignore } = parseArgs();

  const files = fg
    .sync(patterns, { absolute: false, onlyFiles: true, ignore })
    .sort((a, b) => a.localeCompare(b));

  if (files.length === 0) {
    console.warn(`警告: 対象ファイルが見つかりません: ${patterns.join(", ")}`);
    return;
  }

  let hasError = false;

  for (const filePath of files) {
    const content = readFileSync(resolve(filePath), "utf8");
    const findings = findForbiddenLinks(content);

    if (findings.length === 0) {
      console.log(`${filePath}: valid`);
      continue;
    }

    hasError = true;
    console.error(`${filePath}: invalid`);
    for (const finding of findings) {
      console.error(`  - ${filePath}:${finding.line}:${finding.column}: ${finding.reason}`);
    }
  }

  if (hasError) process.exitCode = 1;
}

main();
