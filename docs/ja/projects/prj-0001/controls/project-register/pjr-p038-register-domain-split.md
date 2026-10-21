---
specdojo:
  id: prj-0001:pjr-p038-register-domain-split
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: low
  owner: DEV
  registered_at: "2026-10-14T21:25:56Z"
  due_on: null
  completed_at: "2026-10-14T21:49:34Z"
  conclusion: register.ts の残りのドメインの処理を core・migration・renumber・update・views の 5 モジュールへ移し、register.ts は 2,418 行から 629 行になった。--help と export は分割の前後で一致した
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

| No  | 作業                                                                | 担当 | 状態 | メモ                |
| --- | ------------------------------------------------------------------- | ---- | ---- | ------------------- |
| 1   | 分割の前の `--help` の出力を `tmp/` に保存する                      | DEV  | done | 15 コマンド分を保存 |
| 2   | 責務ごとのモジュールへ移し、元のファイルから明示的に再 export する  | DEV  | done | 5 モジュールへ分割  |
| 3   | 分割の後の `--help` の出力と比べ、テストと検証を通す                | DEV  | done | help 差分なし       |
| 4   | result に、移したものの対応表と残った行数、見つけた改善点を記録する | DEV  | open | reporter が記録する |

## 4. 対応結果

- `src/register.ts` に残っていた処理を、共通基盤、旧一覧移行、派生ビュー、項目更新、再採番・topic 変更の責務へ分割した。
- 移動先は、共通基盤が `src/register-core.ts`、旧一覧移行が `src/register-migration.ts`、派生ビューが `src/register-views.ts`、項目更新が `src/register-update.ts`、再採番・topic 変更が `src/register-renumber.ts` である。
- `src/register.ts` は従来の公開名を明示的に再 export し、コマンド統合を担う façade とした。
- 分割前後で `register` と全 14 サブコマンドの `--help` を比較し、差分がないことを確認した。
- 各対象ファイルは 1,000 行以下であり、新規モジュールから `src/register.ts` への import はない。
- 残課題はない。result の記入と親検証結果の反映は reporter / runner が行う。

## 5. 関連ドキュメント

- [[prj-0001:pjr-y8p9-large-source-files-split]]: 親の項目。
- [[prj-0001:pjr-k6kb-grade-module-split]]・[[prj-0001:pjr-gbpx-exec-run-split-register]]: 同じ条件で行った分割。
