---
specdojo:
  id: prj-0001:pjr-v141-condense-records-frontmatter-placeholder
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
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

| 観点         | 影響                                                                |
| ------------ | ------------------------------------------------------------------- |
| スコープ     | runner が result の frontmatter を書く `src/exec/results.ts` に限る |
| スケジュール | 影響なし                                                            |
| コスト       | 影響なし                                                            |
| 品質         | executor の文に山括弧があっても、result が lint-fm で落ちなくなる   |
| 関係者       | orchestrator（親の検証が develop でそろって落ちる事態がなくなる）   |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | `renderReporterResult` と `serializeFrontmatter` が `condense_records` を加工せずに YAML へ出していた。本文の表は `inlineCode` で包んでいたため、frontmatter だけが lint-fm の山括弧の検査で落ちた                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 対応策   | frontmatter へ書き写す前に、コードスパン外の山括弧の語をコードの書式で包む                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| 依存事項 | なし                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 完了条件 | executor 由来の文を result の frontmatter へ書き写すとき、`<provider>` のような山括弧の語で lint-fm が落ちない（コードの書式で包む、または書き込む前に検査する）。condense_records の reason のほかに executor の文を frontmatter へ書き写す箇所を洗い出し、同じ扱いにする。`providers.<provider>.command_template` を含む reason から生成した result の frontmatter が lint-fm を通ることを回帰テストで確かめる。迷った点は executor が決め、決めた内容と理由を個票の対応結果に書き、報告の `handoff` にも書く。`CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く（影響がなければ「なし」、PJR-EPQ3）。保護された設定（`.specdojo/`・`package.json`・`.agents/`・`.claude/`・`.codex/`・`lefthook.yml` など）は変えず、変更が要る場合は案を個票の対応結果と `handoff` に書く。`npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通る。 |

## 5. 対応結果

- 解決内容:
  - `src/shared/text.ts` に `inlineCodeFrontmatterAnglePlaceholders` を足した。コードスパン外の山括弧の語をコードの書式で包む。本文用の `inlineCodeAnglePlaceholders` と違い、`<https://...>` も包む。lint-fm は frontmatter の autolink も拒否するためである。正規表現の置換は共通の関数にまとめた。
  - `src/exec/results.ts` で、condense の記録（`location`・`reason`・`cause.location`）を frontmatter へ書く 2 か所（`renderReporterResult` と `serializeFrontmatter`）に、この関数を通すようにした。`serializeFrontmatter` は `updateResultStatus`・`resetResultForClaim` からも呼ばれる。
  - executor の文を frontmatter へ書き写す箇所を洗い出した。ほかには `block_reason`（executor の stderr の `blocked: <reason>` など）があり、`serializeFrontmatter` で同じ扱いにした。result の frontmatter のほかの項目（id・`task_id`・targets など）は runner が決める値で、executor の文ではない。本文の表（`renderCondenseRecords`）は、もとから `inlineCode` で包んでいる。
- 決めたこと:
  - lint で検査して止めるのではなく、書き写すときに包む方にした。止めると、executor の正しい記録が書式だけで失われるためである。すでにコードの書式の語は変えないので、何度シリアライズしても値は変わらない。
  - frontmatter の記録の値にはバッククォートが入る。Kata 保守への申し送り（`plans-condense-findings.ts`）は表示に `inlineCode` を使っており、バッククォートを含む値も正しく表示する。
- 確認結果: `tests/src/exec/condense.test.ts` に回帰テストを足した。`providers.<provider>.command_template` を含む reason から生成した result と、山括弧を含む block 理由で更新した result に、lint-fm の山括弧の検査（`remark-no-unescaped-angle-placeholder`）をかけ、指摘が 0 件であることを確かめる。`npx vitest run` で condense・results・register-plan-escape の 3 ファイル（109 件）が通った。
- 再発防止策: executor の文を frontmatter へ書き写すときは、上の関数を通す。
- CHANGELOG に書く事項:
  - 区分: Fixed
  - 行の文案: condense の段の result の frontmatter に executor の記録の山括弧（例: `<provider>`）がそのまま入り、lint-fm で落ちていた不具合を直した。block 理由の山括弧も同様にコードの書式にする（PJR-V141）。

## 6. 関連ドキュメント

- 由来: PJR-2GD6
- 変更箇所: `src/exec/results.ts`、`src/shared/text.ts`、`tests/src/exec/condense.test.ts`
