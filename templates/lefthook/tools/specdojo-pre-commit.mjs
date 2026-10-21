import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join, posix } from "node:path";

const repoRoot = process.cwd();
const command = process.argv[2];
const files = process.argv.slice(3);

function cleanGitEnvironment() {
  const env = { ...process.env };
  for (const name of [
    "GIT_ALTERNATE_OBJECT_DIRECTORIES",
    "GIT_COMMON_DIR",
    "GIT_DIR",
    "GIT_GRAFT_FILE",
    "GIT_IMPLICIT_WORK_TREE",
    "GIT_INDEX_FILE",
    "GIT_NAMESPACE",
    "GIT_NO_REPLACE_OBJECTS",
    "GIT_OBJECT_DIRECTORY",
    "GIT_PREFIX",
    "GIT_QUARANTINE_PATH",
    "GIT_REPLACE_REF_BASE",
    "GIT_SHALLOW_FILE",
    "GIT_WORK_TREE",
  ]) {
    delete env[name];
  }
  return env;
}

function runNode(entry, args) {
  if (!existsSync(entry)) {
    process.stdout.write(`[specdojo-hook] skipped: ${entry} is unavailable; run npm install.\n`);
    return 0;
  }
  const result = spawnSync(process.execPath, [entry, ...args], {
    cwd: repoRoot,
    env: cleanGitEnvironment(),
    stdio: "inherit",
  });
  if (result.error) throw result.error;
  return result.status ?? 1;
}

function stagedFiles() {
  const result = spawnSync("git", ["diff", "--cached", "--name-only", "-z", "--diff-filter=ACMR"], {
    cwd: repoRoot,
    env: cleanGitEnvironment(),
    encoding: "utf8",
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    process.stderr.write(result.stderr || "Unable to inspect staged files.\n");
    process.exit(result.status ?? 1);
  }
  return result.stdout
    .split("\0")
    .filter(Boolean)
    .map((file) => file.replaceAll("\\", "/"));
}

function configuredProjects() {
  const configPath = join(repoRoot, ".specdojo", "specdojo.config.json");
  if (!existsSync(configPath)) return [];
  const config = JSON.parse(readFileSync(configPath, "utf8"));
  if (!config.projects || typeof config.projects !== "object") return [];
  return Object.entries(config.projects).map(([id, project]) => ({ id, project }));
}

function configuredPath(project, key) {
  const relativePath = typeof project[key] === "string" ? project[key].trim() : "";
  if (!relativePath) return undefined;
  const basePath = typeof project.base_path === "string" ? project.base_path.trim() : "";
  return posix
    .normalize(
      basePath
        ? `${basePath.replaceAll("\\", "/")}/${relativePath.replaceAll("\\", "/")}`
        : relativePath.replaceAll("\\", "/"),
    )
    .replace(/^\.\//, "");
}

function isWithin(file, directory) {
  return file === directory || file.startsWith(`${directory}/`);
}

function runSpecDojoForChangedProjects(key, args) {
  const changed = stagedFiles();
  const projects = configuredProjects().filter(({ project }) => {
    const directory = configuredPath(project, key);
    return directory && changed.some((file) => isWithin(file, directory));
  });
  if (projects.length === 0) return 0;
  const specdojoCli = join(repoRoot, "node_modules", "specdojo", "dist", "specdojo.js");
  for (const { id } of projects) {
    const status = runNode(specdojoCli, [...args, "--project", id]);
    if (status !== 0) return status;
  }
  return 0;
}

let status;
switch (command) {
  case "prettier":
    status =
      files.length === 0
        ? 0
        : runNode(join(repoRoot, "node_modules", "prettier", "bin", "prettier.cjs"), [
            "--write",
            "--",
            ...files,
          ]);
    break;
  case "markdownlint":
    status =
      files.length === 0
        ? 0
        : runNode(join(repoRoot, "node_modules", "markdownlint-cli", "markdownlint.js"), [
            "--",
            ...files,
          ]);
    break;
  case "register-build":
    status = runSpecDojoForChangedProjects("project_register_path", ["register", "build"]);
    break;
  case "catalog-validate":
    status = runSpecDojoForChangedProjects("catalog_path", ["catalog", "validate"]);
    break;
  default:
    process.stderr.write(`Unknown SpecDojo hook command: ${command ?? "(missing)"}\n`);
    status = 1;
}
process.exit(status);
