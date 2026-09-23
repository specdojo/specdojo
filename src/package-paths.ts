import path from "node:path";
import { fileURLToPath } from "node:url";

// このモジュールは開発時は src/、npm 配布時は dist/ 直下にある。
// どちらの場合もモジュールの親ディレクトリが SpecDojo package のルートになる。
//
// SPECDOJO_PACKAGE_ROOT は参照先の package を明示的に差し替える。利用リポジトリに kata を
// 持たない構成では、モジュール位置から求めた package が自動で参照されるため、単体テストの
// 一時ディレクトリが開発リポジトリの kata へ解決されてしまう。テストと検証では、この変数へ
// 一時ディレクトリを指定して解決範囲を閉じる。
export function specdojoPackageRootDir(): string {
  const override = process.env.SPECDOJO_PACKAGE_ROOT;
  if (override && override.trim() !== "") return path.resolve(override);
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
}
