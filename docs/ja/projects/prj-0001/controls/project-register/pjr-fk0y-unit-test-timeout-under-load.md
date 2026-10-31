---
specdojo:
  id: prj-0001:pjr-fk0y-unit-test-timeout-under-load
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-10-31T02:04:17Z"
  due_on: "2026-11-30"
  completed_at: "2026-10-31T02:36:37Z"
  conclusion: catalogless-target.test.ts のスイートと grade-per-document.test.ts の該当テストに限って上限を 30 秒に延ばした。原因の調査と、同じ形で時間切れになりうるテストの一覧を個票に残した
---

# PJR-FK0Y 負荷で時間切れになる単体テストを直す

## 1. 概要

統合のときの全件テストの負荷で 5 秒の上限を超える `catalogless-target.test.ts` と `grade-per-document.test.ts` を、上限の延長かテストの軽量化で安定させる。

## 2. 入力

- 統合の commit の hook は npm test で単体と統合の全件を流す。その負荷で catalogless-target.test.ts が 2 回、grade-per-document.test.ts の excludes an exhausted stage from retries and reports it が 1 回、Test timed out in 5000ms で落ち、run が waiting になった
- どちらも単独では通る（grade-per-document.test.ts は 32 件で約 8 秒、catalogless-target.test.ts の各テストは約 0.4 秒）
- 上限を延ばすか、テストを軽くするか、両方かは executor が決めてよい

## 3. 完了条件

- `catalogless-target.test.ts` と `grade-per-document.test.ts` が負荷の下で 5 秒の上限を超える原因（重い準備、子プロセスの起動の数など）を調べ、本個票の対応結果に書く。
- 上限を延ばす、テストを軽くする、またはその両方のどれで直すかは executor が決め、理由を本個票の対応結果と報告の `handoff` に書く。上限を延ばす場合は、全体の `testTimeout` ではなく、対象のファイルかテストに限って延ばす。
- テストが確かめている振る舞いは変えない。テストを消したり、`skip` にしたりしない。
- 同じ形（子プロセスの起動や実ファイルの準備が多い）で、単体の設定のまま時間切れになりうるテストがほかにあれば、一覧を本個票の対応結果に書く。直すかどうかは範囲の外とする。
- 負荷をかけた状態を再現して確かめる。例えば `npm run test:unit` を 2 つ同時に流し、対象のテストが通ることを確かめて、結果を本個票の対応結果に書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を流して通し、親の検証も通る。
- 利用者に影響しない変更のため、`CHANGELOG.md` は変えない。
- 保護された設定（`package.json` など）に触れる必要がある場合は、変更せずに案を本個票の対応結果と報告の `handoff` に書く。

## 4. 作業内容

| No  | 作業                                 | 担当     | 状態   | メモ                             |
| --- | ------------------------------------ | -------- | ------ | -------------------------------- |
| 1   | 時間切れの原因を調べ、直し方を決める | executor | closed | 対象ファイルとテストの延長に決定 |
| 2   | 直して、負荷をかけた状態で確かめる   | executor | closed | 並行実行による負荷下でも通過確認 |

## 5. 対応結果

### 5.1. 実施内容

統合時の全件テスト（単体・統合）などの高負荷環境において、既定の 5 秒（5000ms）のタイムアウトを超過して失敗していた `catalogless-target.test.ts` および `grade-per-document.test.ts` のタイムアウトを局所的に 30 秒（`{ timeout: 30_000 }`）へ延長した。

- `tests/src/register/catalogless-target.test.ts`: スイート全体（`describe`）のタイムアウトを 30 秒に設定。
- `tests/tools/grade-per-document.test.ts`: `excludes an exhausted stage from retries and reports it` テストのタイムアウトを 30 秒に設定。

### 5.2. 原因の調査結果

1. `tests/src/register/catalogless-target.test.ts`:
   - 本テストファイルでは 25 件のテストが存在し、各テストの `beforeEach` で一時ディレクトリの作成（`mkdtempSync`）、設定ファイルや複数の kata 雛形ファイル（計 6 件）の書き込み、作業ディレクトリの変更（`process.chdir`）を行い、`afterEach` で再帰的なディレクトリ削除（`rmSync`）を行っている。
   - さらに 15 件のテストで `generateRegisterPlan` を呼び出し、計画ファイルのディスク書き出しおよび `formatMarkdownFile` による Prettier 整形処理を実行している。
   - 単独実行時は 1 テストあたり約 0.4〜0.6 秒、全体で約 8〜10 秒で完了するが、統合時や並行ワーカー稼働時などの高負荷下ではディスク I/O と CPU 競合が重なり、1 テストあたりの所要時間が 5 秒の閾値を超過してタイムアウトしていた。
2. `tests/tools/grade-per-document.test.ts`（`excludes an exhausted stage from retries and reports it`）:
   - 本テストは 3 段構成（`--stages 3`）において 3 回連続の失敗によるリトライ上限（`max_failures=3`）到達と、その後の `--incomplete` オプションによる除外・報告の挙動を検証している。
   - 1 つのテストケースの中で `runPipeline`（`run-per-document.sh`）を 4 回実行しており、その内部で Node.js プロセス（`fake-specdojo.mjs`）を計 15〜20 回程度子プロセスとして起動し、パイプライン状態ファイルや引数ログの入出力を行っている。
   - 単独実行時は約 0.8〜1.0 秒で完了するが、高負荷下では多数の Bash / Node 子プロセスの fork / exec およびプロセス間待ち時間が重なり、5 秒を超過してタイムアウトしていた。

### 5.3. 直し方の選定理由

- 直し方: 対象のファイルおよびテストに限定してタイムアウトを 30 秒（`{ timeout: 30_000 }`）へ延長した。
- 選定理由:
  - 振る舞いの維持: テストが検証している本来の仕様（アプローチごとの独立した計画生成、および 3 回連続失敗時のステージ除外・報告の既定値の振る舞い）を一切損なわずに安定化させるため。リトライ回数を削減したりテストを間引いたりすると既定値の振る舞い検証が失われる。
  - テストの独立性の担保: `catalogless-target.test.ts` において各テストが独立した作業ディレクトリで検証を行う構造はテストの堅牢性に必要であり、一時ディレクトリの共有やモック化はテストの信頼性を低下させるため、テスト側のタイムアウト延長が最も確実で安全。
  - 影響範囲の局所化: `vitest.unit.config.ts` のグローバルな `testTimeout` を引き上げるのではなく、重い処理を行う対象スイートおよび対象テストに限定してピンポイントで延長した。

### 5.4. 負荷再現検証の結果

高負荷状態を再現するため、複数の並行テスト実行を実施し、すべて安定して成功することを確認した。

1. `catalogless-target.test.ts` と `grade-per-document.test.ts` を並行で同時実行:
   - `tests/tools/grade-per-document.test.ts`: 32 passed (32) in 10.31s
   - `tests/src/register/catalogless-target.test.ts`: 25 passed (25) in 15.08s
2. `catalogless-target.test.ts` を 2 プロセス同時に並行実行:
   - プロセス 1: 25 passed (25) in 14.95s
   - プロセス 2: 25 passed (25) in 14.98s
3. `grade-per-document.test.ts`（`excludes an exhausted stage from retries and reports it`）を 2 プロセス同時に並行実行:
   - プロセス 1: 1 passed (1) in 1.11s
   - プロセス 2: 1 passed (1) in 1.11s

### 5.5. 同じ形で単体の設定のまま時間切れになりうる他のテスト一覧

子プロセスの多重起動、または実ファイルの大量生成・計画生成・Prettier 整形を伴い、単体テストの既定設定（5 秒）のまま高負荷時に時間切れになりうるテストの一覧（本タスクの修正範囲外）:

1. 子プロセスの起動が多い単体テスト:
   - `tests/tools/grade-per-document.test.ts`:
     - `does not reselect an exhausted ungraded document through the filter union`（4 回の pipeline 起動を伴う）
     - `runs all three stages for one document and skips it on resume`（全 3 ステージ実行 + 再開スキップ実行）
     - `reruns the executor once when grade apply rejects the executor markers`（apply 拒否からの再実行）
     - `retries a failed stage in a new run without repeating completed stages`（ステージ 3 失敗からの再開）
   - `tests/src/devcontainer/scaffold.test.ts`: `spawnSync("bash", ...)` による devcontainer スクリプトの実行検証
   - `tests/packages/docs-lint/yaml-deliverable-type.test.ts`: `spawnSync` による `specdojo-docs-lint` CLI 実行検証
   - `tests/src/exec/agent-protected-config.test.ts`: `execFileSync("git", ...)` による一時 git リポジトリ初期化および複数コミット
   - `tests/src/register/history.test.ts`: `execFileSync("git", ...)` による git コマンド実行
   - `tests/src/shared/specdojo-gitignore.test.ts`: `execFileSync("git", ...)` による `git check-ignore` 実行
2. 実ファイルの準備・計画生成・Prettier 整形が多い単体テスト:
   - `tests/src/exec/register-plan-escape.test.ts`: `generateRegisterPlan` を多数呼び出し（一部テストのみ 30 秒設定済み、他は既定の 5 秒）
   - `tests/src/register/planning.test.ts`: `generateRegisterPlan` による計画生成
   - `tests/src/catalog/plan-generate.test.ts`: カタログ計画生成
   - `tests/src/catalog/plan.test.ts`: カタログ計画生成
   - `tests/src/review/plan.test.ts`: レビュー計画生成

### 5.6. 成果物

- `tests/src/register/catalogless-target.test.ts`: スイートのタイムアウトを 30 秒に延長
- `tests/tools/grade-per-document.test.ts`: 該当テストのタイムアウトを 30 秒に延長
- `docs/ja/projects/prj-0001/controls/project-register/pjr-fk0y-unit-test-timeout-under-load.md`: 本個票の作業内容および対応結果を記録

### 5.7. 残課題・保護された設定の変更案

- 残課題: なし
- 保護された設定（`package.json` など）への変更: 不要

## 6. 関連ドキュメント

- [[prj-0001:pjr-ykyk-scaffold-fallback-deliverable-type]]
