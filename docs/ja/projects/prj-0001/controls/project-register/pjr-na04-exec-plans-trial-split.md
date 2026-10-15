---
specdojo:
  id: prj-0001:pjr-na04-exec-plans-trial-split
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: low
  owner: DEV
  registered_at: "2026-10-14T21:26:16Z"
  due_on: null
---

# PJR-NA04 exec-plans.ts・exec.ts・exec-trial.ts を分ける

## 1. 概要

exec の plan の生成、exec のコマンドの登録、trial（合わせて 4,045 行）を責務ごとのモジュールへ移す。 動作は変えない

## 2. 完了条件

[[prj-0001:pjr-y8p9-large-source-files-split]] を分けた 1 件である（2026-10-15、利用者が承認）。

対象: `src/exec-plans.ts`（1,375 行）、`src/exec.ts`（1,364 行）、`src/exec-trial.ts`（1,306 行）。`src/exec.ts` は exec のサブコマンドの登録を含む。runner の plan の生成を含むため、統合の後に orchestrator が `exec run --register` を 1 回流し、統合まで終わることを確かめる（本件の close の条件）。

比べるコマンド: `exec` とそのサブコマンド（`validate`・`refresh`・`plan`・`archive`・`scheduler`・`scaffold`・`status`・`where`・`run`・`cycle`・`resume`・`trial`）、`exec trial` のサブコマンド（`run`・`status`・`rate`・`adopt`・`discard`）

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

| No  | 作業                                                                | 担当     | 状態 | メモ                    |
| --- | ------------------------------------------------------------------- | -------- | ---- | ----------------------- |
| 1   | 分割の前の `--help` の出力を `tmp/` に保存する                      | DEV      | done | 18 コマンドを保存       |
| 2   | 責務ごとのモジュールへ移し、元のファイルから明示的に再 export する  | DEV      | done | 7 モジュールへ移動      |
| 3   | 分割の後の `--help` の出力と比べ、テストと検証を通す                | DEV      | done | 18 コマンドとも差分なし |
| 4   | result に、移したものの対応表と残った行数、見つけた改善点を記録する | reporter | open | reporter stage で記録   |

## 4. 対応結果

`src/exec-plans.ts` は plan の共通組み立てを `src/exec-plans-core.ts`、plan 生成を
`src/exec-plans-generation.ts`、保存・archive・frontmatter 解析を
`src/exec-plans-storage.ts` へ移した。`src/exec.ts` は状態遷移の共通処理を
`src/exec-core.ts`、CLI 登録を `src/exec-commands.ts` へ移した。`src/exec-trial.ts` は
比較記録の型・生成・共通処理を `src/exec-trial-core.ts`、試行の実行・評価・採否と CLI
登録を `src/exec-trial-commands.ts` へ移した。元の 3 ファイルは分割前に公開していた名前だけを
明示的に再 export する façade とした。

対象ファイルと新規モジュールは 2〜873 行で、すべて 1,000 行以下である。分割前後で
`exec` と指定された全サブコマンド、および `exec trial` と指定された全サブコマンドの
`--help`（計 18 コマンド）を比較し、差分がないことを確認した。移動した 127 関数の本体は
空白を除いて分割前と一致し、新規モジュールを含む循環 import はない。分割中に別タスクで
扱うべき不具合や改善点は見つからなかった。統合後の `exec run --register` による実動作確認は、
完了条件どおり orchestrator が行う。

## 5. 関連ドキュメント

- [[prj-0001:pjr-y8p9-large-source-files-split]]: 親の項目。
- [[prj-0001:pjr-k6kb-grade-module-split]]・[[prj-0001:pjr-gbpx-exec-run-split-register]]: 同じ条件で行った分割。
