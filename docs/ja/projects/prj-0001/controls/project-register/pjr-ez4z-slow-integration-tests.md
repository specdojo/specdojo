---
specdojo:
  id: prj-0001:pjr-ez4z-slow-integration-tests
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-22T13:34:28Z"
  due_on: "2026-11-30"
---

# PJR-EZ4Z 遅い統合テストを見つけて速くする

## 1. 概要

統合テストの全件の時間を縮めるため、親の検証の記録にテストのファイルごとの時間を残し、上位のファイルの準備（Git の fixture など）を速くする。確かめる内容は変えない。

## 2. 入力

- 2026-11-22 の集計で、parent-validation-metrics.jsonl には検証ごとの時間だけがあり、テストのファイルごとの時間がない。記録には tests/helpers/parent-validation-reporter.ts を使っている。
- 利用者の承認（2026-11-22、indie）で起票した。担当 DEV、期限 2026-11-30。

## 3. 完了条件

- 親の検証の記録（`parent-validation-metrics.jsonl`）に、統合テストと単体テストのファイルごとの時間を残す。`tests/helpers/parent-validation-reporter.ts` を使う。記録の形は既存の検証ごとの記録と見分けられるようにし、schema があれば直す。
- 統合テストを手元で 1 回流してファイルごとの時間を測り、上位 5 ファイルとその時間を個票の対応結果に書く。
- 上位のファイルのうち、準備（一時リポジトリの作成、Git の fixture、子プロセスの起動など）を共有や作り置きで速くできるものを直す。確かめる内容（期待値・テストの数）は変えない。テスト間で状態を共有するときは、テストの独立を保つ理由を書く。
- 直した前後の時間を、ファイルごとに個票の対応結果に書く。
- 統合テストの時間切れ（`testTimeout`）は延ばさない。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`package.json` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業                                                      | 担当 | 状態 | メモ                                                       |
| --- | --------------------------------------------------------- | ---- | ---- | ---------------------------------------------------------- |
| 1   | reporter と親の検証でテストのファイルごとの時間を記録する | DEV  | done | `validation-test-files` 記録を追加。単体テストで確認       |
| 2   | 統合テストを 1 回流して上位 5 ファイルを測る              | DEV  | done | 全 440 件成功、ファイル時間の合計 392 秒                   |
| 3   | 上位ファイルの fixture 準備を作り置きで速くする           | DEV  | done | `register-pipeline-e2e` の初期リポジトリを一度だけ作り複製 |
| 4   | 前後の時間と CHANGELOG 文案を記録する                     | DEV  | done | 本節の対応結果に記載                                       |

## 5. 対応結果

### 5.1. 記録の追加

- `tests/helpers/parent-validation-reporter.ts` の終了通知に `duration_ms` を足した。
- `src/exec/validation-metrics.ts` の `ValidationTestFiles` が終了通知の時間を集め、`durationsSnapshot()` で遅い順に返す。
- `src/exec/parent-validation.ts` が検証の子プロセスの終了時に、`event: "validation-test-files"` の記録（`id` と `files: [{ file, duration_ms }]`）を `parent-validation-metrics.jsonl` へ 1 行追記する。既存の `validation-start` / `validation-end` とは `event` で見分けられる。単体テストと統合テストの両方で使われる reporter なので、どちらにも出る。
- schema は該当するものが無かったため変更していない。

### 5.2. 統合テストの上位 5 ファイル（手元 1 回、直す前）

| 順位 | ファイル                                    | 時間（秒） | テスト数 |
| ---- | ------------------------------------------- | ---------- | -------- |
| 1    | `register-pipeline-e2e.integration.test.ts` | 120.4      | 54       |
| 2    | `pipeline-e2e.integration.test.ts`          | 65.1       | 30       |
| 3    | `register-resume.integration.test.ts`       | 40.5       | 13       |
| 4    | `job-worktree.integration.test.ts`          | 24.6       | 14       |
| 5    | `task-repos.integration.test.ts`            | 19.9       | 50       |

### 5.3. 直した内容と前後の時間

- `register-pipeline-e2e.integration.test.ts`: テストごとにファイルを作って `git init` / `add -A` / `commit` していた準備を、初期リポジトリを一度だけ作り置いて `cpSync` で複製する形にした。作り置きのパスは仮のルートで、複製後に実パスへ置き換えて `git commit --amend` で取り込む。期待値とテストの数（54）は変えていない。
- 状態共有について: 共有するのは読み取り専用の作り置き元だけで、各テストは複製した独立の `.git` と作業ツリーを使う。テスト間で書き込み状態は共有しないため、独立は保たれる。作り置き元は `afterAll` で削除する。
- 時間: 直す前 120.4 秒、直した後 109.3 秒（このファイルだけを 1 回流した値）。約 11 秒短縮。計測が 1 回ずつで負荷の差があるため目安である。
- 他の上位ファイルは時間の大半がテスト本体（子プロセスの CLI 起動）にあり、準備の共有で縮む余地が小さいと判断して今回は触っていない。
- `testTimeout` は変えていない。

### 5.4. CHANGELOG に書く事項

- 区分: 変更（内部・テスト基盤）
- 文案: 親の検証の記録（`parent-validation-metrics.jsonl`）に、テストのファイルごとの時間（`validation-test-files`）を残すようにしました。あわせて、遅い統合テストの準備（初期リポジトリの作成）を作り置きにして速くしました（PJR-EZ4Z）。

### 5.5. 申し送り

- 保護された設定の変更は不要だった。
- 判断: 上位 2 位以下は準備の共有効果が小さいため触らなかった。次の短縮はテスト本体の CLI 起動の回数削減が候補。
- 統合テストは executor の sandbox で 1 回実行して測定した（親の検証でも別途実行される）。

## 6. 関連ドキュメント

- 根拠・影響先は `tests/` と `src/exec/` 配下の実装に限られ、参照すべき docs 文書は無い。
