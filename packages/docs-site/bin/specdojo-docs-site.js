#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const PACKAGE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const COMMANDS = new Set(["build", "dev", "mermaid", "d2", "preview", "generate"]);

function usage() {
  console.log(`Usage: specdojo-docs-site <command> [workspace-root] [options]

Commands:
  build     Build the VitePress site
  dev       Start the VitePress development server
            --with-exec-records  include execution records (excluded by default in dev)
  mermaid   Generate Mermaid SVG files only
  d2        Generate D2 SVG files only (requires d2 v0.9.0)
  preview   Preview the built site
  generate  Run specdojo build in the workspace (uses dist when it is newer than src)
            --skip-if-fresh  skip when .specdojo/doc-index.json is newer than docs/`);
}

function newestMtime(directory) {
  let newest = 0;
  if (!existsSync(directory)) return newest;
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    const time = entry.isDirectory() ? newestMtime(target) : statSync(target).mtimeMs;
    if (time > newest) newest = time;
  }
  return newest;
}

// dist が src より古いときは tsx で流す（古い dist で生成物が古い実装のままになるのを防ぐ）。
function runGenerate(workspaceRoot, args, env) {
  if (args.includes("--skip-if-fresh")) {
    const index = path.join(workspaceRoot, ".specdojo", "doc-index.json");
    if (
      existsSync(index) &&
      statSync(index).mtimeMs >= newestMtime(path.join(workspaceRoot, "docs"))
    ) {
      console.log("specdojo-docs-site: generated files are newer than docs/, skip generate");
      return 0;
    }
  }
  const dist = path.join(workspaceRoot, "dist", "specdojo.js");
  const source = path.join(workspaceRoot, "src");
  const useDist = existsSync(dist) && statSync(dist).mtimeMs >= newestMtime(source);
  const generateArgs = useDist
    ? [dist, "build"]
    : ["--import", require.resolve("tsx"), path.join(source, "specdojo.ts"), "build"];
  if (!useDist) console.log("specdojo-docs-site: dist is missing or older than src, using tsx");
  const result = spawnSync(process.execPath, generateArgs, {
    cwd: workspaceRoot,
    env,
    stdio: "inherit",
  });
  return result.status ?? 1;
}

const [command, maybeRoot, ...rest] = process.argv.slice(2);
if (command === "--help" || command === "-h") {
  usage();
  process.exit(0);
}
if (!command || !COMMANDS.has(command)) {
  usage();
  process.exitCode = 1;
} else {
  const hasRoot = maybeRoot !== undefined && !maybeRoot.startsWith("-");
  const workspaceRoot = path.resolve(hasRoot ? maybeRoot : process.cwd());
  const allArgs = hasRoot ? rest : [maybeRoot, ...rest].filter(Boolean);
  const withExecRecords = allArgs.includes("--with-exec-records");
  const forwardedArgs = allArgs.filter((arg) => arg !== "--with-exec-records");
  const env = {
    ...process.env,
    SPECDOJO_DOCS_ROOT: workspaceRoot,
    SPECDOJO_DOCS_COMMAND: command,
    SPECDOJO_DOCS_WITH_EXEC_RECORDS: withExecRecords ? "1" : "0",
  };

  let executable;
  let args;
  if (command === "generate") {
    process.exit(runGenerate(workspaceRoot, forwardedArgs, env));
  } else if (command === "mermaid" || command === "d2") {
    executable = process.execPath;
    args = [
      "--import",
      require.resolve("tsx"),
      path.join(PACKAGE_ROOT, "src", `gen-${command}-svg.ts`),
      ...forwardedArgs,
    ];
  } else {
    const vitepressPackage = require.resolve("vitepress/package.json");
    executable = process.execPath;
    args = [
      path.join(path.dirname(vitepressPackage), "bin", "vitepress.js"),
      command,
      PACKAGE_ROOT,
      ...forwardedArgs,
    ];
  }

  const result = spawnSync(executable, args, { cwd: workspaceRoot, env, stdio: "inherit" });
  if (result.error) {
    console.error(`specdojo-docs-site: ${result.error.message}`);
    process.exitCode = 1;
  } else if (result.signal) {
    console.error(`specdojo-docs-site: child process terminated by ${result.signal}`);
    process.exitCode = 1;
  } else {
    process.exitCode = result.status ?? 1;
  }
}
