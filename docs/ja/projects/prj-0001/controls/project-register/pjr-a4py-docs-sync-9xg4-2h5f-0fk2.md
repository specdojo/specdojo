---
specdojo:
  id: prj-0001:pjr-a4py-docs-sync-9xg4-2h5f-0fk2
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-09-29T11:48:50Z"
---

# PJR-A4PY 9XG4・2H5F・0FK2 の変更を利用者向けドキュメントへ反映する

## 1. 概要

PJR-F346 と PJR-G8TB に続き、2026-09-29 に入れた次の 3 つの機能を、利用者向けのドキュメントへ揃える。

| 項目     | 変更                                                                                                                                                                      |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PJR-9XG4 | `register` の記帳コマンドの `--commit`。`register lifecycle` の枠を取って記帳・`register build`・commit を行い、run と並行して安全に記帳できる                            |
| PJR-2H5F | `specdojo devcontainer scaffold`。指定した provider の agent CLI を入れた最小構成の `.devcontainer/` を生成する。ollama・cron・tmux はオプション                          |
| PJR-0FK2 | `config scaffold --provider antigravity --global`。利用者のグローバル設定へ差分表示・バックアップ付きで permission rule をマージする。allow は読み取りの git コマンドだけ |

## 2. 完了条件

- 上表の 3 機能について、`docs/ja/specdojo/guides/`（とくに `specdojo-overview-guide.md`、`quick-start-guide.md`、`register-operation-guide.md`、`exec-config-guide.md`、`orchestrator-operation-guide.md`、`remote-host-development-guide.md`）、`docs/ja/specdojo/references/`、リポジトリの `README.md` を確認し、実装と食い違う記述を直している。
- devcontainer は任意の手順として示し、既存の `.devcontainer/` を上書きしないことと、認証情報がボリュームに保存されることを書く。
- `--global` は、利用者のすべてのリポジトリに効くことと、`--dry-run` で差分を確認してから使う手順を書く。
- 各項目の個票に書かれた仕様を正とし、ドキュメントに合わせて実装を変えない。判断できない食い違いは変更せずに対応結果へ列挙する。
- `npm run -s lint:md` が成功する。
- 変更したドキュメントと、確認したが変更不要だったドキュメントを対応結果に一覧で記録する。

## 3. 作業内容

| No  | 作業                                               | 担当 | 状態 | メモ                 |
| --- | -------------------------------------------------- | ---- | ---- | -------------------- |
| 1   | 3 機能に関係する記述を検索し、食い違いを一覧にする | DEV  | open | -                    |
| 2   | ガイド・リファレンス・README を直す                | DEV  | open | 個票の仕様を正とする |
| 3   | lint を通し、対応結果に一覧を記録する              | DEV  | open | -                    |

## 4. 対応結果

-

## 5. 関連ドキュメント

- PJR-9XG4、PJR-2H5F、PJR-0FK2、PJR-F346、PJR-G8TB
