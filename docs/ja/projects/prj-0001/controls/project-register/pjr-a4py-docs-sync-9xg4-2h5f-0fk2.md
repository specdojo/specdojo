---
specdojo:
  id: prj-0001:pjr-a4py-docs-sync-9xg4-2h5f-0fk2
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
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

| No  | 作業                                               | 担当 | 状態 | メモ                            |
| --- | -------------------------------------------------- | ---- | ---- | ------------------------------- |
| 1   | 3 機能に関係する記述を検索し、食い違いを一覧にする | DEV  | done | 旧 Antigravity 権限フラグを検出 |
| 2   | ガイド・リファレンス・README を直す                | DEV  | done | 個票の仕様を正として反映        |
| 3   | lint を通し、対応結果に一覧を記録する              | DEV  | done | executor 検証を実施             |

## 4. 対応結果

- PJR-9XG4: [[specdojo:register-operation-guide|登録簿運用ガイド]] と [[specdojo:command-reference|CLIコマンドリファレンス]] の既存記述が、`--commit` の対象コマンド、`register lifecycle` 枠、pathspec 限定 commit、既存差分がある場合の停止、`--dry-run` の挙動を実装どおり説明していることを確認した。README、[[specdojo:quick-start-guide|Quick Startガイド]]、[[specdojo:specdojo-overview-guide|全体概要ガイド]]にも利用場面を追記した。
- PJR-2H5F: README、[[specdojo:quick-start-guide|Quick Startガイド]]、[[specdojo:orchestrator-operation-guide|オーケストレーター運用ガイド]]、[[specdojo:remote-host-development-guide|常時稼働ホスト運用ガイド]]、[[specdojo:command-reference|CLIコマンドリファレンス]]へ、任意手順、対応 provider、既存 `.devcontainer/` の非上書き、`--dry-run` / `--force`、provider 設定用の名前付きボリューム、ホストの秘密情報をマウントしない既定、Ollama・cron・tmux の任意指定を追記した。
- PJR-0FK2: README、[[specdojo:quick-start-guide|Quick Startガイド]]、[[specdojo:exec-config-guide|exec設定ガイド]]、[[specdojo:orchestrator-operation-guide|オーケストレーター運用ガイド]]、[[specdojo:command-reference|CLIコマンドリファレンス]]へ、`--global` が利用者のすべてのリポジトリに効くこと、dry-run 後に適用する手順、既存設定の保持とバックアップ、allow を読み取り Git コマンドに限定することを反映した。[[specdojo:exec-config-guide|exec設定ガイド]] に残っていた `--dangerously-skip-permissions` を必須とする旧記述とコマンド例を削除した。
- 確認したが変更不要だった文書は、[[specdojo:register-operation-guide|登録簿運用ガイド]]である。対象のリファレンスは [[specdojo:command-reference|CLIコマンドリファレンス]]のみで、3機能のオプションと安全条件を上記のとおり更新した。
- 実装と設計の差異として、Antigravity の認証先は [[sysd-antigravity-agent-settings|Antigravity CLI エージェント設定]]で `~/.gemini` とされている一方、`src/devcontainer-scaffold.ts` が生成する名前付きボリュームの mount 先は `/home/node/.config/antigravity` である。個票の制約に従って実装は変更せず、利用者向け文書では生成設定が provider ごとの設定ディレクトリを名前付きボリュームへ保存することと、ホストの認証情報を直接 mount しないことまでを記載した。Antigravity の認証情報がコンテナ再作成後も保持されるよう、mount 先を別タスクで整合させる必要がある。

## 5. 関連ドキュメント

- PJR-9XG4、PJR-2H5F、PJR-0FK2、PJR-F346、PJR-G8TB
