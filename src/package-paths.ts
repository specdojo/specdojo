import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// このモジュールは開発時は src/、npm 配布時は dist/ 直下にある。
// どちらの場合もモジュールの親ディレクトリが SpecDojo package のルートになる。
//
// SPECDOJO_PACKAGE_ROOT は参照先の package を明示的に差し替える。利用リポジトリに kata を
// 持たない構成では、モジュール位置から求めた package が自動で参照されるため、単体テストの
// 一時ディレクトリが開発リポジトリの kata へ解決されてしまう。テストと検証では、この変数へ
// 一時ディレクトリを指定して解決範囲を閉じる。
function moduleRelativePackageRoot(): string {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
}

export function specdojoPackageRootDir(): string {
  const override = process.env.SPECDOJO_PACKAGE_ROOT;
  if (override && override.trim() !== "") return path.resolve(override);
  return moduleRelativePackageRoot();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// CLI が報告する版。`package.json` を唯一の出所とし、`npm version` の更新へ自動で追従する。
// SPECDOJO_PACKAGE_ROOT は kata の参照先を差し替えるための変数であり、実行中の CLI 自身の
// 版とは無関係なため、ここでは参照しない。
export function specdojoPackageVersion(): string {
  const packageJsonPath = path.join(moduleRelativePackageRoot(), "package.json");
  const parsed: unknown = JSON.parse(readFileSync(packageJsonPath, "utf8"));
  if (isRecord(parsed) && typeof parsed.version === "string" && parsed.version !== "") {
    return parsed.version;
  }
  throw new Error(`version を読み取れません: ${packageJsonPath}`);
}
