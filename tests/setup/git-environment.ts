import { removeGitLocalEnvironment } from "../../src/git-environment.js";

// Git hook から Vitest を起動した場合でも、各 worker が test module を読み込む前に
// repository の位置を決める環境変数を除去し、子プロセスには cwd から再解決させる。
removeGitLocalEnvironment(process.env);
