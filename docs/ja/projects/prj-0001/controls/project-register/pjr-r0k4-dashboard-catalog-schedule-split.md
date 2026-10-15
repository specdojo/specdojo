---
specdojo:
  id: prj-0001:pjr-r0k4-dashboard-catalog-schedule-split
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: low
  owner: DEV
  registered_at: "2026-10-14T21:26:32Z"
  due_on: null
---

# PJR-R0K4 dashboard.ts・catalog-build.ts・schedule-strategy-generate.ts を分ける

## 1. 概要

dashboard、カタログの build、schedule の戦略の生成（合わせて 3,832 行）を責務ごとのモジュールへ移す。 動作は変えない

## 2. 完了条件

[[prj-0001:pjr-y8p9-large-source-files-split]] を分けた 1 件である（2026-10-15、利用者が承認）。

対象: `src/dashboard.ts`（1,485 行）、`src/catalog-build.ts`（1,268 行）、`src/schedule-strategy-generate.ts`（1,079 行）。生成物を作る処理であるため、分割の前後で `specdojo build`（または `dashboard build`・`catalog build`・`schedule build`）の生成物に差分がないことも確かめ、result に記録する。

比べるコマンド: `dashboard`・`dashboard build`、`catalog` とそのサブコマンド、`schedule` とそのサブコマンド

条件:

- 移すだけにし、ロジックは変えない。分割の途中で不具合や改善点を見つけても直さず、result に書く。
- 分割の前に対象のファイルが export していた名前は、すべて同じ名前で元のファイルから import できる。再 export は `export *` を使わず、分割の前に export していた名前だけを明示的に再 export する。既存のテストは import のパスを含めて変更せずに通る。テストの追加は妨げない。
- 分割の前後で、下記の「比べるコマンド」の `--help` の出力が一致する。前後の出力を `tmp/` に保存して比べ、比べたコマンドの一覧と差分がないことを result に記録する。比べるコマンドがない場合は、その旨を result に書く。
- 分割の後、対象のファイルと新しく作るモジュールはそれぞれ 1,000 行以下とする。1 つの関数が大きいなどで超える場合は、理由を result に書く。関数の中身の分割は本件では行わない。
- 新しい循環 import を作らない。移した先のモジュールから元のファイルを import しない。
- 新しいモジュールのファイル名は、元のファイル名で始める（例: `src/register-migration.ts`）。
- モジュールの構成に触れている設計書（[[sysd-index]] など）があれば更新する。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通すこと。PJR-K6KB・PJR-3W2N・PJR-13M6・PJR-3P4W では、移した後の import の抜けや未使用の import を残したまま終え、親の検証で失敗した。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。

## 3. 作業内容

| No  | 作業                                                                | 担当 | 状態 | メモ                     |
| --- | ------------------------------------------------------------------- | ---- | ---- | ------------------------ |
| 1   | 分割の前の `--help` の出力を `tmp/` に保存する                      | DEV  | open | 比べるコマンドがある場合 |
| 2   | 責務ごとのモジュールへ移し、元のファイルから明示的に再 export する  | DEV  | open | 移すだけ                 |
| 3   | 分割の後の `--help` の出力と比べ、テストと検証を通す                | DEV  | open | 差分なし                 |
| 4   | result に、移したものの対応表と残った行数、見つけた改善点を記録する | DEV  | open | -                        |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-y8p9-large-source-files-split]]: 親の項目。
- [[prj-0001:pjr-k6kb-grade-module-split]]・[[prj-0001:pjr-gbpx-exec-run-split-register]]: 同じ条件で行った分割。
