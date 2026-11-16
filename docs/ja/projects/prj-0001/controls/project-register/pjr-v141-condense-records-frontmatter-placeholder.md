---
specdojo:
  id: prj-0001:pjr-v141-condense-records-frontmatter-placeholder
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  registered_at: "2026-11-09T13:38:48Z"
  derived_from:
    - PJR-2GD6
---

# PJR-V141 runner が executor の condense の記録を result の frontmatter へ書き写すとき、山括弧をそのまま入れて lint-fm を落とす

## 1. 課題内容

condense の段の result の frontmatter に、executor の condense_records の理由の文がそのまま入り、むき出しの `<provider>` が lint-fm の山括弧の検査で失敗した。develop に入ったため、後の run の親の検証がそろって落ちた。書き写すときにコードの書式にするか、frontmatter に入れる前に検査する

## 2. 入力

- 2026-11-09、T-BUSINESS-SPECS-REPS-ifx-cmd-ai-provider-cli-080 の result の frontmatter（condense の記録の reason）に `providers.<provider>.command_template` がむき出しで入った。本文の表ではコードの書式になっていた。
- この後に流した review の段の 5 件が lint-fm でそろって止まった。orchestrator が develop の frontmatter の 1 か所をコードの書式に直し（fa15f29c3）、各 worktree にも入れて再開した（indie が承認）。

## 3. 影響範囲

| 観点         | 影響   |
| ------------ | ------ |
| スコープ     | _TODO_ |
| スケジュール | _TODO_ |
| コスト       | _TODO_ |
| 品質         | _TODO_ |
| 関係者       | _TODO_ |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | _TODO_                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 対応策   | _TODO_                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 依存事項 | _TODO_                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 完了条件 | executor 由来の文を result の frontmatter へ書き写すとき、`<provider>` のような山括弧の語で lint-fm が落ちない（コードの書式で包む、または書き込む前に検査する）。condense_records の reason のほかに executor の文を frontmatter へ書き写す箇所を洗い出し、同じ扱いにする。`providers.<provider>.command_template` を含む reason から生成した result の frontmatter が lint-fm を通ることを回帰テストで確かめる。迷った点は executor が決め、決めた内容と理由を個票の対応結果に書き、報告の `handoff` にも書く。`CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く（影響がなければ「なし」、PJR-EPQ3）。保護された設定（`.specdojo/`・`package.json`・`.agents/`・`.claude/`・`.codex/`・`lefthook.yml` など）は変えず、変更が要る場合は案を個票の対応結果と `handoff` に書く。`npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通る。 |

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
