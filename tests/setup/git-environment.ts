import { removeGitLocalEnvironment } from "../../src/shared/git-environment.js";

// Git hook から Vitest を起動した場合でも、各 worker が test module を読み込む前に
// repository の位置を決める環境変数を除去し、子プロセスには cwd から再解決させる。
removeGitLocalEnvironment(process.env);

// orchestrator の対象 project を fixture に持ち込まない。テスト自身が設定する
// SPECDOJO_PROJECT はこの後で有効になり、CLI の project 選択の検証にも使える。
delete process.env.SPECDOJO_PROJECT;
