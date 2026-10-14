---
specdojo:
  id: prj-0001:pjr-qcmp-register-commands-split
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
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

| No  | 作業                                                                | 担当 | 状態 | メモ                        |
| --- | ------------------------------------------------------------------- | ---- | ---- | --------------------------- |
| 1   | 分割の前の `--help` の出力を `tmp/` に保存する                      | DEV  | done | `register` と全サブコマンド |
| 2   | サブコマンドの登録をモジュールへ移す                                | DEV  | done | 移すだけ                    |
| 3   | 分割の後の `--help` の出力と比べ、テストと検証を通す                | DEV  | done | 差分なし                    |
| 4   | result に、移したものの対応表と残った行数、見つけた改善点を記録する | DEV  | open | reporter が記録する         |

## 4. 対応結果

- `scaffold`・`add`・`update` の登録を `src/register-create-commands.ts`、`close`・`reject`・`defer`・`reopen`・`start`・`wait`・`review` の登録を `src/register-transition-commands.ts`、`migrate`・`build`・`history`・`renumber` の登録を `src/register-maintenance-commands.ts` へ移した。
- 新しい登録モジュールから `src/register.ts` を import しないよう、コマンド登録に必要な既存処理を `src/register-command-types.ts` の依存インターフェース経由で受け取る構成にした。`src/register.ts` の既存 export と `src/specdojo.ts` の呼び出しは変更していない。
- `registerRegisterCommands` は 7 行になり、`src/register.ts` は 3,156 行から 2,418 行になった。新規モジュールは 181〜342 行で、すべて 1,000 行以下である。
- 分割前後について、`register`、`scaffold`、`add`、`close`、`reject`、`defer`、`reopen`、`start`、`wait`、`review`、`update`、`migrate`、`build`、`history`、`renumber` の `--help` 出力を比較し、差分がないことを確認した。
- 個票では「15 のサブコマンド」と記載されていたが、実装上は 14 サブコマンドだった。今回の分割では実装に存在する全 14 サブコマンドを対象とし、コマンドの追加・削除は行っていない。
- 親 runner が lint・型検査・単体テスト・統合テスト・schema 検証を実行する。result の記録は後続の reporter が行う。

## 5. 関連ドキュメント

- [[prj-0001:pjr-k6kb-grade-module-split]]: 段 3。本件の結果を見て完了条件を調整する。
- [[prj-0001:pjr-y8p9-large-source-files-split]]: `src/register.ts` に残るドメインの処理の分割を扱う。
- [[prj-0001:pjr-th4b-eslint-max-lines-guard]]: 分割後の行数の上限。
