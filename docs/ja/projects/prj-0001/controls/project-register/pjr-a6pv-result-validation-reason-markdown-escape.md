---
specdojo:
  id: prj-0001:pjr-a6pv-result-validation-reason-markdown-escape
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-10-18T18:07:57Z"
  derived_from:
    - PJR-8WBN
---

# PJR-A6PV result に書く検査の理由の文で * などがエスケープされず、統合の前に止まる

## 1. 課題内容

2026-10-19 03:07 の PJR-EVAX で、executor が validate:schema:file の not_applicable の理由に「No `*.yaml` or `*.yml` files were changed」と書き、runner がそれをそのまま result に描いたため、_.yaml or * が強調と読まれて markdownlint の MD037 に当たり、統合の前の記法の検査で止まった。8WBN・Z104 の後は executor が not_applicable の理由を書くことが増えたため起きやすい

## 2. 影響範囲

| 観点         | 影響                                                              |
| ------------ | ----------------------------------------------------------------- |
| スコープ     | `src/exec/results.ts`（result に描く自由記述の文の無害化）        |
| スケジュール | 中。executor が検査の理由に記号を含む文を書くと、統合の前で止まる |
| コスト       | 人が result を直して再開する手間                                  |
| 品質         | result の Markdown が規約に合わない                               |
| 関係者       | exec run の利用者、夜間の自動実行                                 |

## 3. 対応方針

| 項目     | 内容                                                                                                               |
| -------- | ------------------------------------------------------------------------------------------------------------------ |
| 原因     | runner は、executor が書いた検査の理由（`reason`）や要約を、強調などの Markdown の記号を無害化せずに result に描く |
| 対応策   | result に描く自由記述の文で、Markdown の強調などに読まれる記号を無害化する                                         |
| 依存事項 | なし                                                                                                               |
| 完了条件 | 下記の完了条件を満たす                                                                                             |

### 3.1. 完了条件

- result に描く検査の `reason`・`summary` などの自由記述の文で、アスタリスクやアンダースコアなど強調に読まれる記号を、文の意味を変えずに無害化する（エスケープする、glob のような語をコードの書式にする、など）。どの形にしたかと理由を result に書く。
- 既にコードの書式で囲まれた部分は、二重に変えない。
- 単体テストで、アスタリスクを含む理由（例: 拡張子の glob を 2 つ並べた文）から作った result が markdownlint を通ることを確かめる。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- runner のコードを変えるため、統合の後に `exec run --register` を 1 回流して動作を確かめる（PJR-JSEY）。
- CHANGELOG の `## [0.4.1] - 未定` の節に書く。公開済みの版の節は変えない。

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-8wbn-conditional-not-applicable-rejected]]（元の項目）
