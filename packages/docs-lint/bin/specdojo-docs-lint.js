#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const commands = new Map([
  ["yaml-schema", "validate-yaml-schema.ts"],
  ["rulebook-schema-enums", "validate-rulebook-schema-enums.ts"],
  ["history-links", "validate-history-links.ts"],
  ["md-content", "validate-md-content.ts"],
]);

function usage() {
  console.log(`Usage: specdojo-docs-lint <command> [options]

Commands:
  yaml-schema             Validate YAML or JSON files against SpecDojo schemas
  rulebook-schema-enums   Check ready rulebooks for schema enum coverage
  history-links           Reject rename-fragile Markdown links in history files
  md-content              Validate Markdown content against a content schema
  markdownlint            Run markdownlint-cli from this package
  remark                  Run remark-cli from this package`);
}

function run(executable, args, env = process.env) {
  const result = spawnSync(executable, args, {
    cwd: process.cwd(),
    env,
    stdio: "inherit",
  });
  if (result.error) {
    console.error(`specdojo-docs-lint: ${result.error.message}`);
    return 1;
  }
  if (result.signal) {
    console.error(`specdojo-docs-lint: child process terminated by ${result.signal}`);
    return 1;
  }
  return result.status ?? 1;
}

const [command, ...args] = process.argv.slice(2);
if (command === "--help" || command === "-h") {
  usage();
} else if (commands.has(command)) {
  process.exitCode = run(process.execPath, [
    "--import",
    require.resolve("tsx"),
    path.join(packageRoot, "src", commands.get(command)),
    ...args,
  ]);
} else if (command === "markdownlint" || command === "remark") {
  const executableDirectory = path.join(packageRoot, "node_modules", ".bin");
  const env = {
    ...process.env,
    PATH: [executableDirectory, process.env.PATH].filter(Boolean).join(path.delimiter),
  };
  process.exitCode = run(command, args, env);
} else {
  usage();
  process.exitCode = 1;
}
