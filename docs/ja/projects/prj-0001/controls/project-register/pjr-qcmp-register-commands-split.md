---
specdojo:
  id: prj-0001:pjr-qcmp-register-commands-split
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-10-02T12:14:24Z"
---

# PJR-QCMP register.ts のサブコマンドごとの分割

## 1. 概要

src/register.ts の registerRegisterCommands（752 行）をサブコマンドごとのモジュールへ分ける。動作は変えない（v0.3.0 の公開後）

## 2. 完了条件

リファクタリングの段取り（2026-10-14、利用者が承認）の段 2 として、分割の完了条件と agent の振る舞いを確かめる試行を兼ねる。対象は `src/register.ts` の `registerRegisterCommands`（2026-10-14 時点で 781 行、15 のサブコマンド）であり、同じファイルにある登録簿のドメインの処理（約 2,400 行）は本件では動かさない。

- `registerRegisterCommands` の中身を、サブコマンドの登録ごと、または関係の深いサブコマンドの組ごとのモジュールへ移す。組の例: 起票と更新（`add`・`update`）、状態の遷移（`close`・`reject`・`defer`・`reopen`・`start`・`wait`・`review`）、保守（`scaffold`・`build`・`migrate`・`history`・`renumber`）。ファイル名は既存の `src/register-*.ts` の命名に揃える。
- 移すだけにし、ロジックは変えない。分割の途中で不具合や改善点を見つけても直さず、result に書く。
- `registerRegisterCommands` は `src/register.ts` から引き続き export し、各モジュールの登録関数を呼ぶだけの関数にする（目安 150 行以下）。`src/specdojo.ts` の呼び出しは変えない。
- `src/register.ts` が現在 export しているものは、すべて同じ名前で `src/register.ts` から import できる。既存のテストは import のパスを含めて変更せずに通る。テストの追加は妨げない。
- 分割の前後で、`register` とその全サブコマンドの `--help` の出力が一致する。前後の出力を `tmp/` に保存して比べ、比べたコマンドの一覧と差分がないことを result に記録する。
- 新しく作るモジュールはそれぞれ 1,000 行以下とし、新しい循環 import を作らない（`src/register.ts` と新しいモジュールが互いに import し合わないよう、共通に使う関数は `src/register.ts` 側に残すか別のモジュールへ移す）。
- モジュールの構成に触れている設計書があれば更新する。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。

## 3. 作業内容

| No  | 作業                                                                | 担当 | 状態 | メモ                           |
| --- | ------------------------------------------------------------------- | ---- | ---- | ------------------------------ |
| 1   | 分割の前の `--help` の出力を `tmp/` に保存する                      | DEV  | open | `register` と全サブコマンド    |
| 2   | サブコマンドの登録をモジュールへ移す                                | DEV  | open | 移すだけ                       |
| 3   | 分割の後の `--help` の出力と比べ、テストと検証を通す                | DEV  | open | 差分なし                       |
| 4   | result に、移したものの対応表と残った行数、見つけた改善点を記録する | DEV  | open | 後続の K6KB の条件の調整に使う |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-k6kb-grade-module-split]]: 段 3。本件の結果を見て完了条件を調整する。
- [[prj-0001:pjr-y8p9-large-source-files-split]]: `src/register.ts` に残るドメインの処理の分割を扱う。
- [[prj-0001:pjr-th4b-eslint-max-lines-guard]]: 分割後の行数の上限。
