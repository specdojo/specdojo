---
specdojo:
  id: prj-0001:pjr-p038-register-domain-split
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: low
  owner: DEV
  registered_at: "2026-10-14T21:25:56Z"
  due_on: null
  block_reason: "integrate failed: project: git commit failed: format: docs/ja/projects/prj-0001/execution/exec/evidence/PJR-P038/20261014T212729066Z-81d2c320/evidence.json 31ms (unchanged); FAIL  /unit/ tests/src/doc…"
---

# PJR-P038 register.ts の残りのドメインの処理を分ける

## 1. 概要

src/register.ts（2,418 行）に残る登録簿のドメインの処理（移行・番号の振り直し・派生ビュー・項目の更新など）を責務ごとのモジュールへ移す。 動作は変えない

## 2. 完了条件

[[prj-0001:pjr-y8p9-large-source-files-split]] を分けた 1 件である（2026-10-15、利用者が承認）。

対象: `src/register.ts`（2026-10-15 時点で 2,418 行）。コマンドの登録は PJR-QCMP で分けた。残るドメインの処理（`planRegisterMigration`・`applyRegisterMigrationPlan` などの移行、`renumberPjrItem`・`planRenumber` などの番号の振り直し、`generateDerivedViewFiles` などの派生ビュー、`applyItemUpdate`・`buildRegisterItemContent` などの項目の更新）を責務ごとに分ける。

比べるコマンド: `register` とその全サブコマンド（`scaffold`・`add`・`close`・`reject`・`defer`・`reopen`・`start`・`wait`・`review`・`update`・`migrate`・`build`・`history`・`renumber`）

条件:

- 移すだけにし、ロジックは変えない。分割の途中で不具合や改善点を見つけても直さず、result に書く。
- 分割の前に対象のファイルが export していた名前は、すべて同じ名前で元のファイルから import できる。再 export は `export *` を使わず、分割の前に export していた名前だけを明示的に再 export する。既存のテストは import のパスを含めて変更せずに通る。テストの追加は妨げない。
- 分割の前後で、下記の「比べるコマンド」の `--help` の出力が一致する。前後の出力を `tmp/` に保存して比べ、比べたコマンドの一覧と差分がないことを result に記録する。比べるコマンドがない場合は、その旨を result に書く。
- 分割の後、対象のファイルと新しく作るモジュールはそれぞれ 1,000 行以下とする。1 つの関数が大きいなどで超える場合は、理由を result に書く。関数の中身の分割は本件では行わない。
- 新しい循環 import を作らない。移した先のモジュールから元のファイルを import しない。
- 新しいモジュールのファイル名は、元のファイル名で始める（例: `src/register-migration.ts`）。
- モジュールの構成に触れている設計書（[[sysd-index]] など）があれば更新する。
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
