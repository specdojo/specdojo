---
specdojo:
  id: prj-0001:pjr-cjmn-ifx-cmd-git-github
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: ARC
  registered_at: "2026-11-15T09:55:52Z"
  commit_type: docs
  commit_scope: ifx
---

# PJR-CJMN Git・GitHub の外部コマンド連携仕様（ifx-cmd-git-cli・ifx-cmd-github-cli）を作る

## 1. 概要

Git と GitHub CLI の連携仕様を ifx-cmd の型で作り、ifx-index と ifd-specdojo からつなぐ

## 2. 入力

- kata-wave-1 で ifx-index と ifd-specdojo を確定するとき、Git・GitHub 連携の詳細仕様が未着手のため期限付きの留保とした（indie が 2026-11-15 に承認、PJR-TN43）
- ifx-index の Git と GitHub の 2 件（詳細契約は未着手）と、ifd-specdojo の PATH-07（GitHub 接続の経路・認証・失敗後の保持範囲）をまとめて扱う。手本は ifx-cmd-ai-provider-cli

## 3. 完了条件

- `ifx-cmd` の型（rulebook と sample）に従い、Git の外部コマンド連携仕様（`ifx-cmd-git-cli`）と GitHub CLI の外部コマンド連携仕様（`ifx-cmd-github-cli`）を新しく作る。手本は `ifx-cmd-ai-provider-cli` とする。どちらも `status: draft` で作る。
- 中身は実装（`src/` の git と gh の呼び出し）と設定を読んで書き、根拠のファイルを示す。分からない点は `_UNDECIDED_` で残し、推測で埋めない。
- `ifx-cmd-github-cli` に、ifd-specdojo の PATH-07 の論点（GitHub 接続の経路・認証・失敗後の保持範囲）を扱う章を置く。
- 2 文書をカタログへ登録する（利用者の決定、2026-11-22、indie）。
- `ifx-index` の Git と GitHub の 2 件と、ifd-specdojo の PATH-07 の留保の追跡先を、新しい 2 文書へ付け替える。変えるのは留保と参照の行だけとし、ready の文書の `status` は変えない。
- 型の grade は統合の後に orchestrator が流す。executor は grade を実行しない。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。影響がなければ「なし」と書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
