import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { describe, expect, it } from "vitest";
import { GIT_LOCAL_ENV_VARS, removeGitLocalEnvironment } from "../../src/git-environment.js";
import { TEST_GIT_ENVIRONMENT } from "../helpers/git-environment.js";

// git フック（lefthook の pre-commit など）の下でテストやツールを実行すると、親の git が
// GIT_DIR / GIT_INDEX_FILE / GIT_WORK_TREE を環境変数へ設定する。それを引き継いだまま git を
// 起動すると、一時ディレクトリで完結させたつもりの init / add / commit が実リポジトリへ適用され、
// core.bare の書き換えや不正なコミットが起きる（PJR-X3E8 / PJR-A99J / PJR-TPY9 で3度再発）。
// Vitest の入口で環境を無害化したうえで、直接起動箇所も gitEnvironment() 経由に限定する。
const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const SCAN_DIRS = ["src", "tests", "tools", "scripts"];
const GIT_LAUNCHERS = new Set(["spawnSync", "spawn", "execFileSync", "execFile"]);

function collectTypeScriptFiles(dir: string): string[] {
  const files: string[] = [];
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return files;
  }
  for (const entry of entries) {
    if (entry === "node_modules" || entry.startsWith(".")) continue;
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) files.push(...collectTypeScriptFiles(path));
    else if (entry.endsWith(".ts")) files.push(path);
  }
  return files;
}

function propertyNameText(name: ts.PropertyName | undefined): string | undefined {
  if (name && (ts.isIdentifier(name) || ts.isStringLiteral(name))) return name.text;
  return undefined;
}

function collectVariableInitializers(sourceFile: ts.SourceFile): Map<string, ts.Expression> {
  const initializers = new Map<string, ts.Expression>();
  function visit(node: ts.Node): void {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
      initializers.set(node.name.text, node.initializer);
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return initializers;
}

function unwrapExpression(expression: ts.Expression): ts.Expression {
  if (
    ts.isParenthesizedExpression(expression) ||
    ts.isAsExpression(expression) ||
    ts.isSatisfiesExpression(expression) ||
    ts.isNonNullExpression(expression) ||
    ts.isTypeAssertionExpression(expression)
  ) {
    return unwrapExpression(expression.expression);
  }
  return expression;
}

function derivesFromGitEnvironment(
  expression: ts.Expression,
  initializers: Map<string, ts.Expression>,
  seen = new Set<string>(),
): boolean {
  const current = unwrapExpression(expression);
  if (
    ts.isCallExpression(current) &&
    ts.isIdentifier(current.expression) &&
    current.expression.text === "gitEnvironment"
  ) {
    return true;
  }
  if (ts.isObjectLiteralExpression(current)) {
    return current.properties.some(
      (property) =>
        ts.isSpreadAssignment(property) &&
        derivesFromGitEnvironment(property.expression, initializers, seen),
    );
  }
  if (!ts.isIdentifier(current) || seen.has(current.text)) return false;
  const initializer = initializers.get(current.text);
  if (!initializer) return false;
  const nextSeen = new Set(seen).add(current.text);
  return derivesFromGitEnvironment(initializer, initializers, nextSeen);
}

function launcherName(expression: ts.LeftHandSideExpression): string | undefined {
  if (ts.isIdentifier(expression)) return expression.text;
  if (ts.isPropertyAccessExpression(expression)) return expression.name.text;
  return undefined;
}

function hasIsolatedEnvironment(
  options: ts.Expression | undefined,
  initializers: Map<string, ts.Expression>,
): boolean {
  if (!options) return false;
  const current = unwrapExpression(options);
  if (!ts.isObjectLiteralExpression(current)) return false;
  for (const property of current.properties) {
    if (ts.isPropertyAssignment(property) && propertyNameText(property.name) === "env") {
      return derivesFromGitEnvironment(property.initializer, initializers);
    }
    if (ts.isShorthandPropertyAssignment(property) && property.name.text === "env") {
      return derivesFromGitEnvironment(property.name, initializers);
    }
  }
  return false;
}

function findGitLaunchOffenders(sourceText: string, fileName: string): string[] {
  const sourceFile = ts.createSourceFile(
    fileName,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const initializers = collectVariableInitializers(sourceFile);
  const offenders: string[] = [];

  function visit(node: ts.Node): void {
    if (
      ts.isCallExpression(node) &&
      GIT_LAUNCHERS.has(launcherName(node.expression) ?? "") &&
      node.arguments[0] &&
      ts.isStringLiteral(node.arguments[0]) &&
      node.arguments[0].text === "git" &&
      !hasIsolatedEnvironment(node.arguments[2], initializers)
    ) {
      const line = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
      offenders.push(`${fileName}:${line}`);
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return offenders;
}

describe("git 起動の環境隔離", () => {
  it("repository 固有変数だけを共通一覧から除去する", () => {
    const environment: NodeJS.ProcessEnv = { ...TEST_GIT_ENVIRONMENT };
    for (const name of GIT_LOCAL_ENV_VARS) environment[name] = `/poison/${name}`;

    removeGitLocalEnvironment(environment);

    expect(GIT_LOCAL_ENV_VARS.filter((name) => environment[name] !== undefined)).toEqual([]);
    expect(environment).toMatchObject(TEST_GIT_ENVIRONMENT);
  });

  it("Vitest worker から repository 固有の Git 環境変数を除去する", () => {
    expect(GIT_LOCAL_ENV_VARS.filter((name) => process.env[name] !== undefined)).toEqual([]);
  });

  it("Git fixture の identity と署名無効化を維持する", () => {
    for (const [name, value] of Object.entries(TEST_GIT_ENVIRONMENT)) {
      expect(process.env[name], name).toBe(value);
    }
  });

  it("env: process.env は隔離済みと判定しない", () => {
    const source = 'spawnSync("git", ["status"], { env: process.env });';

    expect(findGitLaunchOffenders(source, "unsafe.ts")).toEqual(["unsafe.ts:1"]);
  });

  it("gitEnvironment() から作った環境だけを隔離済みと判定する", () => {
    const source = `
const direct = spawnSync("git", ["status"], { env: gitEnvironment() });
const env = gitEnvironment();
const shorthand = execFileSync("git", ["status"], { env });
const fixtureEnvironment = { ...gitEnvironment(), GIT_AUTHOR_NAME: "SpecDojo Test" };
const extended = execFile("git", ["status"], { env: fixtureEnvironment });
`;

    expect(findGitLaunchOffenders(source, "safe.ts")).toEqual([]);
  });

  it("TypeScript から git を起動する箇所はすべて gitEnvironment() を使う", () => {
    const offenders: string[] = [];
    for (const dir of SCAN_DIRS) {
      for (const path of collectTypeScriptFiles(join(ROOT, dir))) {
        offenders.push(...findGitLaunchOffenders(readFileSync(path, "utf8"), relative(ROOT, path)));
      }
    }
    expect(offenders, `gitEnvironment() を使っていない git 起動: ${offenders.join(", ")}`).toEqual(
      [],
    );
  });
});
