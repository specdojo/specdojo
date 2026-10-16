#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";

const entryPath = fileURLToPath(import.meta.url);

export function missingCatalogProject(output) {
  const match = output.match(
    /^catalog_path not set for project '([^']+)' in .+\.\nAdd "catalog_path": "<path>" to the project config\.\n/u,
  );
  return match?.[1];
}

async function resolveCatalog() {
  const { resolveCatalogPath } = await import("../src/catalog/catalog.ts");
  return resolveCatalogPath({});
}

async function validateCatalog() {
  const [{ Command }, { registerCatalogCommands }] = await Promise.all([
    import("commander"),
    import("../src/catalog/catalog.ts"),
  ]);
  const previousExitCode = process.exitCode;
  process.exitCode = undefined;
  try {
    const program = new Command();
    program.exitOverride();
    registerCatalogCommands(program);
    await program.parseAsync(["catalog", "validate"], { from: "user" });
    return typeof process.exitCode === "number" ? process.exitCode : 0;
  } finally {
    process.exitCode = previousExitCode;
  }
}

export async function runCatalogValidateIfConfigured({
  resolvePath = resolveCatalog,
  runValidation = validateCatalog,
  writeStdout = (message) => process.stdout.write(message),
} = {}) {
  try {
    await resolvePath();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const projectId = missingCatalogProject(message);
    if (projectId) {
      writeStdout(
        `[catalog-validate] skipped: catalog_path is not configured for project '${projectId}'.\n`,
      );
      return 0;
    }
    writeStdout(`${message}\n`);
    return 1;
  }

  return runValidation();
}

if (process.argv[1] && path.resolve(process.argv[1]) === entryPath) {
  process.exitCode = await runCatalogValidateIfConfigured();
}
