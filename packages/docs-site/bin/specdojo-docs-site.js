#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const PACKAGE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const COMMANDS = new Set(["build", "dev", "mermaid", "preview"]);

function usage() {
  console.log(`Usage: specdojo-docs-site <command> [workspace-root] [options]

Commands:
  build     Build the VitePress site
  dev       Start the VitePress development server
  mermaid   Generate Mermaid SVG files only
  preview   Preview the built site`);
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
  const forwardedArgs = hasRoot ? rest : [maybeRoot, ...rest].filter(Boolean);
  const env = { ...process.env, SPECDOJO_DOCS_ROOT: workspaceRoot };

  let executable;
  let args;
  if (command === "mermaid") {
    executable = process.execPath;
    args = [
      "--import",
      require.resolve("tsx"),
      path.join(PACKAGE_ROOT, "src", "gen-mermaid-svg.ts"),
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
