---
specdojo:
  id: prj-0001:pjr-3p4w-job-routine-split
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: low
  owner: DEV
  registered_at: "2026-10-14T21:26:24Z"
  due_on: null
---

# PJR-3P4W job.ts・routine.ts を分ける

## 1. 概要

Job と routine の処理（合わせて 2,644 行）を責務ごとのモジュールへ移す。 動作は変えない

## 2. 完了条件

[[prj-0001:pjr-y8p9-large-source-files-split]] を分けた 1 件である（2026-10-15、利用者が承認）。

対象: `src/job.ts`（1,542 行）、`src/routine.ts`（1,102 行）。定期実行が使うため、統合の後に orchestrator が `routine run --dry-run` 相当の読み取りの確認を行い、次の定期実行の結果を確かめる。

比べるコマンド: `job` とそのサブコマンド（`where`・`validate`・`list`）、`routine` とそのサブコマンド（`where`・`validate`・`list`・`run`）

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

| No  | 作業                                                                | 担当 | 状態 | メモ                    |
| --- | ------------------------------------------------------------------- | ---- | ---- | ----------------------- |
| 1   | 分割の前の `--help` の出力を `tmp/` に保存する                      | DEV  | done | 9 コマンドを保存        |
| 2   | 責務ごとのモジュールへ移し、元のファイルから明示的に再 export する  | DEV  | done | 定義解析を分離          |
| 3   | 分割の後の `--help` の出力と比べ、テストと検証を通す                | DEV  | done | 9 コマンドで差分なし    |
| 4   | result に、移したものの対応表と残った行数、見つけた改善点を記録する | DEV  | done | reporter へ証跡を引継ぎ |

## 4. 対応結果

- `src/job.ts` から型、Job Definition の解析・読込、入力とテンプレートの処理を `src/job-definition.ts` へ移した。`src/job.ts` は Job Run の生成・完了と CLI 登録を担い、従来の公開名だけを明示的に再 export する façade とした。
- `src/routine.ts` から型、interval・cron 判定、Routine Definition の解析・読込を `src/routine-definition.ts` へ移した。`src/routine.ts` は状態・lock・action 実行と CLI 登録を担い、従来の公開名だけを明示的に再 export する façade とした。
- 分割後の行数は `src/job.ts` 680 行、`src/job-definition.ts` 927 行、`src/routine.ts` 616 行、`src/routine-definition.ts` 535 行で、すべて 1,000 行以下である。
- `job`・`routine` と指定された全サブコマンド、合計 9 コマンドの `--help` を分割前後で比較し、差分がないことを確認した。Job 8 件と routine 9 件の定義検証、および `routine run --id rtn-dashboard-refresh --dry-run` の読み取り確認も成功した。
- 分割中に別途対応が必要な不具合・改善点は見つからなかった。親検証は pipeline runner が実行する。

## 5. 関連ドキュメント

- [[prj-0001:pjr-y8p9-large-source-files-split]]: 親の項目。
- [[prj-0001:pjr-k6kb-grade-module-split]]・[[prj-0001:pjr-gbpx-exec-run-split-register]]: 同じ条件で行った分割。
