---
specdojo:
  id: prj-0001:xer-t-kata-wave-3-stc-sample-050-20261121t111237z-9f006389
  type: exec-result
  task_id: T-KATA-WAVE-3-stc-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-3-stc-sample-050/T-KATA-WAVE-3-stc-sample-050-20261121T111237Z-9f006389/plan.md
  started_at: "2026-11-21T11:12:43.613Z"
  completed_at: "2026-11-21T11:23:41.470Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:stc-sample
    - specdojo:stc-sample
---

# Edit Result

## 1. 実施内容

- `docs/ja/specdojo/samples/stc-sample.md` を、駄菓子屋の店頭での現金販売（`stc-cash-sale`）を題材とした具体的な総合テストカタログの完成例として改訂しました。
- `stc-rulebook.md` の規定に従い、見出し構成を 6 章の順序へ修正し、H1 を規定の形式（`# 総合テストカタログ: ＜対象名＞`）に変更しました。
- 指示されていた `based_on` 項目（`specdojo:tsp-index-sample` および `specdojo:stc-index-sample`）を frontmatter に追加しました。
- テストケースの具体的な判定基準（期待される値や状態）を明示し、検証可能性を高めました。
- 未解決事項や仮置きの前提について、意思決定者と次のアクションを含む形で具体的な情報を記載しました。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/stc-sample.md`: 駄菓子屋の店頭販売における具体的なテストシナリオ、前提条件、期待結果、および未解決事項を含む、実戦的なサンプル文書へと更新しました。

## 3. 申し送り

- rulebook 変更案: `stc-rulebook` 全体方針の `_UNDECIDED_` のうち「sample は本文要件の見出し構成へ未整合」は今回の sample 改訂で解消したため削除候補です（recipe・template の要否の記述は残します）。
- rulebook 変更案: 本文要件の 6 章には未決事項・仮置き前提を置く場所がありません。sample では「境界/環境/依存」の章に判断者と次の手を付けた表で入れました。置き場所を rulebook に書くか、任意の章「メモ / 将来課題」を認めるかを QE が判断する必要があります。
- rulebook 変更案: 観点見出しの配下で `perspective_key` をどう書くかが規定されていません。sample では見出し直下に `perspective_key`: `flow-success` の形で 1 行書きました。書き方を記述ガイドの観点の節で定めるかを検討してください。
- F001〜F027 はすべて sample の改訂で対応しました。F019 の `based_on` は sample の id (`specdojo:tsp-index-sample`, `specdojo:stc-index-sample`) で記載しました。
- rulebook 変更案: stc-rulebook 全体方針の `_UNDECIDED_` のうち「sample は本文要件の見出し構成へ未整合」は今回の sample 改訂で解消したため削除候補（recipe・template の要否の記述は残す）。
- rulebook 変更案: 本文要件の6章には未決事項・仮置き前提を置く場所がない。sample では「境界/環境/依存」の章に判断者と次の手を付けた表で入れた。置き場所を rulebook に書くか、任意の章「メモ / 将来課題」を認めるかを QE が判断する必要がある。
- rulebook 変更案: 観点見出しの配下で `perspective_key` をどう書くかが規定されていない。sample では見出し直下に `perspective_key`: `flow-success` の形で1行書いた。書き方を記述ガイドの観点の節で定めるかを検討する。
- F001〜F027 はすべて sample の改訂で対応した。F019 の `based_on` は sample の id（`specdojo:tsp-index-sample`、`specdojo:stc-index-sample`）で記載した。
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/samples/stc-sample.md だけで、pjr 個票・plan・result などの履歴蓄積ファイルに当たらない）
- 適用外の検証: `npm run validate:catalog`（変更が docs/ja/projects/ 配下に及んでいない（docs/ja/specdojo/samples/ の sample だけ））

## 4. 進め方と実践の型の適用

`stc-rulebook.md` で定義された必須の章構成と、`sample-authoring-standard.md` の執筆ルールに基づき、既存の `stc-sample.md` を大幅に書き換えました。具体的には、抽象的な説明を排除し、駄菓子屋の業務シナリオに基づいた具体的なテストケース（前提、データ、判定基準、完了条件）を網羅することで、実践の型としての完成度を高めました。また、以前のレビューで見つかった `based_on` の欠落や、H1 の命名規則違反などの問題もあわせて解消しています。
