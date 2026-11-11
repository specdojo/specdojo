---
specdojo:
  id: prj-0001:pjr-1vf0-kata-validation-commands
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: low
  difficulty: medium
  owner: sol-executor
  registered_at: "2026-11-10T12:27:05Z"
  derived_from:
    - PJR-T88P
  autopilot: approved
---

# PJR-1VF0 ccd と ifx-cmd の型に、規則の検査を流すコマンドを書く

## 1. 概要

ccd-mermaid-rulebook と ifx-cmd-rulebook の grade（2026-11-10）が、規則にある Markdown・Frontmatter・Mermaid・YAML schema の検査をどのコマンドで流すかが書かれていないと指摘した。検査の手順とコマンドを書く

## 2. 入力

- grade の run id kata-bsk-20261110 の minor の指摘から。軽い指摘は型を確定したうえで後で直す（indie が決定）。

## 3. 完了条件

- `docs/ja/specdojo/rulebooks/ccd-mermaid-rulebook.md` の検証セクションに、Markdown・Frontmatter・Mermaid の静的検査コマンド例（`npm run lint:md`、`npm run lint:fm`、`npm run lint:mermaid`）、実行手順、期待結果、移行先リポジトリでの代替定義の扱いが明記されていること。
- `docs/ja/specdojo/rulebooks/ifx-cmd-rulebook.md` の本文要件および記述ガイドに、`ifx-cmd.schema.yaml` を用いた個別スキーマ検証・modeline 検証・全体検証の手順・コマンド（`npm run validate:schema:file`、`npm run validate:schema` 等）および期待結果が明記されていること。
- 変更した rulebook および個票が Prettier、静的検査、および規約に適合していること。

## 4. 作業内容

| No  | 作業                                                        | 担当         | 状態 | メモ     |
| --- | ----------------------------------------------------------- | ------------ | ---- | -------- |
| 1   | ccd-mermaid-rulebook への静的検査コマンド・手順の追記       | sol-executor | done | F001解消 |
| 2   | ifx-cmd-rulebook への YAML スキーマ検査コマンド・手順の追記 | sol-executor | done | F001解消 |
| 3   | 静的検査・整形確認の実行と個票の更新                        | sol-executor | done | -        |

## 5. 対応結果

- 実施内容:
  - `docs/ja/specdojo/rulebooks/ccd-mermaid-rulebook.md` の「6.6. 検証と改訂時の確認」を小節構成（「6.6.1. 静的検査の手順とコマンド」「6.6.2. 整合性の手動照合と改訂時の確認」）に再編し、Markdown（`lint:md`）、Frontmatter（`lint:fm`）、Mermaid（`lint:mermaid`）の実行コマンド例、期待結果、移行先リポジトリでの代替定義許容、検証の限界を明記した。
  - `docs/ja/specdojo/rulebooks/ifx-cmd-rulebook.md` の第5章冒頭に検証手順への参照を追加し、第6章に「6.9. 成果物の検証手順」（「6.9.1. 個別のスキーマ・modeline 検証」「6.9.2. 全体検証と整形確認」）を追加して、`ifx-cmd.schema.yaml` による検証コマンド（`npm run validate:schema:file`）、modeline 検証、全体検証（`npm run validate:schema`）、整形確認（`prettier --check`）、期待結果を明記した。
- 成果物:
  - `docs/ja/specdojo/rulebooks/ccd-mermaid-rulebook.md`
  - `docs/ja/specdojo/rulebooks/ifx-cmd-rulebook.md`
- 残課題・申し送り:
  - grade 指摘 F001（静的検査コマンド・検証手順の明記）は本対応で解消。F002（ccd の `based_on` 整合性、ifx-cmd の `files` 契約要件）は別課題（本タスクスコープ外）。

## 6. 関連ドキュメント

- [[specdojo:ccd-mermaid-rulebook|Mermaid を用いた概念クラス図（CCD）作成ルール]]
- [[specdojo:ifx-cmd-rulebook|外部コマンド連携仕様作成ルール]]
- [[specdojo:bdd-rulebook|業務データ辞書 作成ルール]]
