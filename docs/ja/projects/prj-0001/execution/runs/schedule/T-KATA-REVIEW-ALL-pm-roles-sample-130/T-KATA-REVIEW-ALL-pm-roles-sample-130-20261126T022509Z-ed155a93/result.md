---
specdojo:
  id: prj-0001:xer-t-kata-review-all-pm-roles-sample-130-20261126t022509z-ed155a93
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-pm-roles-sample-130
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-pm-roles-sample-130/T-KATA-REVIEW-ALL-pm-roles-sample-130-20261126T022509Z-ed155a93/plan.md
  started_at: "2026-11-26T02:25:21.435Z"
  completed_at: "2026-11-26T02:31:50.255Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - prj-0001:pm-roles-sample
    - specdojo:pm-roles-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R3（読みやすさ）として `pm-roles-sample.yaml` の文を 2 か所直した。PO の `project_note` を 2 文に分け、冒頭コメントの共通責務の行を他の行と同じ「正本:」の書き方にそろえた。意味と判断に要る背景・例外・制約は変えていない。
- schema 検査と Prettier の整形チェックは通った。runner の lint:md:changed、lint:fm:changed、lint:mermaid、lint:d2、test:docs、validate:schema も通った。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R3-1 | R3 | roles の PO の `project_note` | 前半に主語がなく途中で「人間が」が出るため、誰が優先し誰が判断するのかがねじれている。 | 「…記録を優先する。範囲・費用・参加時間の上限、受入、公開・継続は人間が最終判断する。」の 2 文に分けた。 | W1、W2、W3 | - |
| R3-2 | R3 | 冒頭コメント（共通責務の行） | 「共通責務は `based_on` の上位標準を参照する」は主語と述語がねじれており、ほかの行の「〜の正本: …」の書き方とも食い違う。 | 「共通責務の正本: `based_on` の上位標準。」にした。 | W2、`vp-ux-language-consistency` | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/pm-roles-sample.yaml`: PO の `project_note` を主語のねじれがない 2 文に分けた。冒頭コメントの共通責務の行を「共通責務の正本: `based_on` の上位標準。」の書き方にそろえた。差分は 2 行の追加と 2 行の削除。

## 3. 申し送り

- R3-1: R3 / roles の PO の `project_note` / 前半に主語がなく途中で『人間が』が出るため、誰が優先し誰が判断するのかがねじれている / 『…記録を優先する。範囲・費用・参加時間の上限、受入、公開・継続は人間が最終判断する。』の 2 文に分けた / W1、W2、W3 / -
- R3-2: R3 / 冒頭コメント（共通責務の行） / 『共通責務は `based_on` の上位標準を参照する』は主語と述語がねじれており、ほかの行の『〜の正本: …』の書き方とも食い違う / 『共通責務の正本: `based_on` の上位標準。』にした / W2、vp-ux-language-consistency / -
- 適用外の検証: `npm run validate:history-links`（変更したのは sample の YAML だけで、plan / result / 個票は変更していない）

## 4. 進め方と実践の型の適用

R3 の観点として、kata-guide の文章のチェック項目 W1〜W3 と、文体の一貫性を見る `vp-ux-language-consistency` を適用した。plan に展開された grade と condense の finding はなかった。対象 sample の schema `pm-roles.schema.yaml` に従い、検査で valid を確認した。ほかの記述は根拠と整合するため維持した。
