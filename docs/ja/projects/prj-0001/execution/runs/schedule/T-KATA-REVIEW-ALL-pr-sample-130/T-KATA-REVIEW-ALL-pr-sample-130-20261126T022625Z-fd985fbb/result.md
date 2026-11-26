---
specdojo:
  id: prj-0001:xer-t-kata-review-all-pr-sample-130-20261126t022625z-fd985fbb
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-pr-sample-130
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-pr-sample-130/T-KATA-REVIEW-ALL-pr-sample-130-20261126T022625Z-fd985fbb/plan.md
  started_at: "2026-11-26T02:26:35.429Z"
  completed_at: "2026-11-26T02:33:36.867Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:pr-sample
    - specdojo:pr-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R3（読みやすさ）として、`docs/ja/specdojo/samples/pr-sample.md` の文を W1・W3・W5・W9 に沿って 4 か所直した。意味・判断に要る背景・制約は変えていない。
- grade の F001（`vp-ba-stakeholder-clarity`、報告者・報告先の明記）は、kata-guide の「kata の観点の組」で kata の段のレビューに使わない観点とされているため R3 では直さず、R1・R5 の `vp-qe-kata-conformance` に任せた。
- 検査では、executor の prettier と markdownlint、runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が通った。ほかの検査は変更種別により非適用だった。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R3-1 | R3 | 導入文 / 2 文目 | 「要約し、参照する」に主語がない。 | 「本報告は期間内の結果を要約し、」にした。 | W1 | - |
| R3-2 | R3 | 3. 進行中事項 / 表の前の 1 文 | 「確かめられる量で示した」が「進み具合」と後の項目のどちらにかかるか読めない。 | 「未完了の作業ごとに、進み具合（確かめられる量で示す）・遅れの有無・完了見込みを示す」にした。 | W5 | - |
| R3-3 | R3 | 4. リスク・課題 / 影響度の基準の文 | 読点が 4 つあり、3 段階の基準を 1 文に詰めている。 | 「影響度は次の 3 段階で判定した。」と、`高`・`中`・`低` の箇条書きに分けた。 | W3, W9 | - |
| R3-4 | R3 | 4. リスク・課題 / リスクの対応方針 | 「遅れる場合は当日中に `PM` へ連絡する」で、誰が連絡するかが読めない。 | 「入力が遅れる担当は当日中に `PM` へ連絡する」にした。 | W1 | - |
| R3-5 | R3 | 導入文（grade F001） | 報告者と報告先（定期レビューの参加者）が書かれていない。 | - | `vp-ba-stakeholder-clarity` は kata-guide の「kata の観点の組」で kata の段のレビューに使わない観点とされている。sample の業務の中身として R1 と R5 の `vp-qe-kata-conformance` に任せ、要るかどうかは pr-rulebook の求めで判断する。 | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/pr-sample.md`: 導入文の主語を補い、進行中事項の表前文の係りを明確にした。リスク・課題の影響度基準を 3 段階の箇条書きに分け、リスク対応方針の連絡主体を明記した（10 行追加・4 行削除）。

## 3. 申し送り

- F001（報告者・報告先の明記）は R3 では未対応。R1・R5 の `vp-qe-kata-conformance` で、pr-rulebook の求めに照らして要否を判断すること。
- R3-1: R3 / 導入文 / 2 文目の「要約し、参照する」に主語がない / 「本報告は期間内の結果を要約し、」にした / W1 / -
- R3-2: R3 / 3. 進行中事項 / 表の前の 1 文で「確かめられる量で示した」が「進み具合」と後の項目のどちらにかかるか読めない / 「未完了の作業ごとに、進み具合（確かめられる量で示す）・遅れの有無・完了見込みを示す」にした / W5 / -
- R3-3: R3 / 4. リスク・課題 / 影響度の基準の文は読点が 4 つあり、3 段階の基準を 1 文に詰めている / 「影響度は次の 3 段階で判定した。」と、`高`・`中`・`低` の箇条書きに分けた / W3, W9 / -
- R3-4: R3 / 4. リスク・課題（リスクの対応方針） / 「遅れる場合は当日中に `PM` へ連絡する」で、誰が連絡するかが読めない / 「入力が遅れる担当は当日中に `PM` へ連絡する」にした / W1 / -
- R3-5: R3 / 導入文（grade F001） / 報告者と報告先（定期レビューの参加者）が書かれていない / - / 根拠の観点 `vp-ba-stakeholder-clarity` は kata-guide の『kata の観点の組』で kata の段のレビューに使わない観点とされている。sample の業務の中身として R1 と R5 の `vp-qe-kata-conformance` に任せ、要るかどうかは pr-rulebook の求めで判断する / -
- 適用外の検証: `npm run validate:history-links`（変更したのは sample だけで、plan・result・個票は変更していない）

## 4. 進め方と実践の型の適用

根拠として kata-guide の「kata を agent でレビューする」「文章のチェック項目」（W1〜W10）と、plan に展開された grade の finding F001 を使った。直したのは文の読みやすさに当たる箇所だけで、前の段の指摘は繰り返していない。F001 は R3 の観点に当たらないため扱わず、理由と次のアクションを finding の欄と handoff に残した。
