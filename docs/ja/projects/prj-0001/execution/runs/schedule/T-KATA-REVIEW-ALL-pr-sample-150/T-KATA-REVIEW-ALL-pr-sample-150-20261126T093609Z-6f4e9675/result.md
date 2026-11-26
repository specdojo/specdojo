---
specdojo:
  id: prj-0001:xer-t-kata-review-all-pr-sample-150-20261126t093609z-6f4e9675
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-pr-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-pr-sample-150/T-KATA-REVIEW-ALL-pr-sample-150-20261126T093609Z-6f4e9675/plan.md
  started_at: "2026-11-26T09:36:19.075Z"
  completed_at: "2026-11-26T09:45:23.071Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:pr-sample
    - specdojo:pr-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R5（整合）として、`pr-sample.md` を mm-sample、pm-communication-plan-sample、pr-rulebook と照合し、食い違い 2 か所を sample 側で直した。
- 相手側の sample と用語集に直すべき点は変更せず、直す案を findings に残した。grade の F001 は R5 の観点に当たらないため sample を変えず、要判断として findings に残した。
- `npx prettier --write` で整形した。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` は成功した。そのほかの検査は変更種別により非適用だった。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R5 | docs/ja/specdojo/samples/pr-sample.md 完了事項 No.2 | 「欠品の日次記録を開始し」とあるが、mm-sample の 2026-04-19 の定例ではすでに前の週の欠品 7 回を見直している。今回の期間に記録を始めたという記述と食い違う。 | 「欠品を 5 営業日すべてで日次記録した。」に変えた（反映済み）。 | specdojo:mm-sample の議題と決定事項、vp-qe-kata-conformance | - |
| 2 | R5 | docs/ja/specdojo/samples/pr-sample.md リスク・課題 `PJR-KP22` の対応方針 | 「2026-04-21 の定例で」とあるが、mm-sample の定例は 2026-04-19 と 04-26 である。pm-communication-plan-sample は定例会議を置かないとしており、04-21 の定例はどの sample にもない。 | 「2026-04-21 までに、6 品目それぞれの補充責任者を `PO` が決める。」に変えた（反映済み。次期予定 No.1 の期日と同じ）。 | specdojo:mm-sample の会議情報、specdojo:pm-communication-plan-sample の冒頭、vp-qe-kata-conformance | - |
| 3 | R5 | docs/ja/specdojo/samples/mm-sample.md の議題「週次の欠品状況レビュー（2026-04-12〜04-18）」と決定事項の「欠品は7回」 | 週の区切りが pr-sample の報告期間（rulebook に従う 2026-04-13〜04-19）と 1 日ずれている。件数も 7 回と 9 回で合わない。 | 相手側なので変えていない。mm-sample の区切りを 2026-04-13〜04-19 にして件数を pr-sample の 9 回に揃えるか、pr-sample の件数を mm-sample に合わせるかを決め、片方を直す。 | specdojo:pr-rulebook の「報告期間」、vp-qe-kata-conformance、vp-dev-change-impact | 要判断 |
| 4 | R5 | docs/ja/specdojo/samples/mm-sample.md（定例会議）と docs/ja/specdojo/samples/pm-communication-plan-sample.md（定例会議は置かない） | 相手の 2 つの sample の間で、定例会議があるかどうかが食い違っている。 | 相手側なので変えていない。コミュニケーション計画に在庫補充フロー改善の定例を足すか、議事録の会議を判断依頼の打ち合わせとして書き直すかを決める。 | 両 sample の該当箇所、vp-qe-kata-conformance | 要判断 |
| 5 | R5 | docs/ja/product/010-business-specs/060-glossary/gl-common.yaml の tm-progress-report | 用語集は進捗報告を「関係者に報告するビュー」と定義している。pr-sample は人が書く報告文書であり、意味の範囲が合わない。 | 相手側なので変えていない。用語集の定義を、生成するビューと人が書く報告文書の両方を含むように広げるか、製品用語として今のまま区別するかを決める。 | gl-common.yaml の tm-progress-report、specdojo:pr-rulebook の「全体方針」 | 要判断 |
| 6 | R5 | grade の F001（line=3 の導入文、vp-ba-stakeholder-clarity） | 報告者・報告先を書くよう求める指摘だが、kata ガイドの「kata の観点の組」は vp-ba-stakeholder-clarity を段のレビューでは使わない観点としており、R5 の観点にも当たらない。rulebook も報告者・報告先を必須にしていない。 | sample は変えない。必要なら rulebook の本文要件に報告者・報告先を足すかを別に判断する。 | docs/ja/specdojo/guides/kata-guide.md の「kata の観点の組」、specdojo:pr-rulebook の「本文要件」 | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/pr-sample.md`: 完了事項 No.2 の表現を mm-sample の記述と合わせた。リスク・課題 `PJR-KP22` の対応方針は、存在しない「2026-04-21 の定例で」を「2026-04-21 までに」に直し、次期予定 No.1 の期日と揃えた。prettier で表の列幅を整えた。

## 3. 申し送り

- findings No.3 から No.6 は、相手側の sample・用語集・rulebook に関わるため変更していない。いずれも要判断として挙げた。
- No: 1 / 段: R5 / 箇所: docs/ja/specdojo/samples/pr-sample.md 完了事項 No.2 / 指摘: 「欠品の日次記録を開始し」とあるが、mm-sample の 2026-04-19 の定例では、すでに前の週（2026-04-12〜04-18）の欠品 7 回を見直しており、今回の期間に記録を始めたことと食い違う / 直した案: 「欠品を 5 営業日すべてで日次記録した。」に変えた（反映済み） / 根拠: specdojo:mm-sample の「議題」と「決定事項」、vp-qe-kata-conformance / 印: なし
- No: 2 / 段: R5 / 箇所: docs/ja/specdojo/samples/pr-sample.md リスク・課題 `PJR-KP22` の対応方針 / 指摘: 「2026-04-21 の定例で」とあるが、mm-sample の定例は 2026-04-19 と 04-26 で、pm-communication-plan-sample は「定例会議は置かない」としており、04-21 の定例はどの sample にもない / 直した案: 「2026-04-21 までに、6 品目それぞれの補充責任者を `PO` が決める。」に変えた（反映済み。次期予定 No.1 の期日と同じ） / 根拠: specdojo:mm-sample の会議情報、specdojo:pm-communication-plan-sample の冒頭、vp-qe-kata-conformance / 印: なし
- No: 3 / 段: R5 / 箇所: docs/ja/specdojo/samples/mm-sample.md の議題「週次の欠品状況レビュー（2026-04-12〜04-18）」と決定事項の「欠品は7回」 / 指摘: 週の区切りが pr-sample の報告期間（rulebook に従う 2026-04-13〜04-19）と 1 日ずれており、件数も 7 回と 9 回で合わない / 直す案（相手側なので変えていない）: mm-sample の区切りを 2026-04-13〜04-19 にし、件数を pr-sample の 9 回にそろえるか、pr-sample の件数を mm-sample に合わせるかを決めて、片方を直す / 根拠: specdojo:pr-rulebook の「報告期間」、vp-qe-kata-conformance、vp-dev-change-impact / 印: 要判断
- No: 4 / 段: R5 / 箇所: docs/ja/specdojo/samples/mm-sample.md（定例会議）と docs/ja/specdojo/samples/pm-communication-plan-sample.md（定例会議は置かない） / 指摘: 相手の 2 つの sample の間で、定例会議があるかどうかが食い違っている / 直す案（相手側なので変えていない）: コミュニケーション計画に在庫補充フロー改善の定例を足すか、議事録の会議を判断依頼の打ち合わせとして書き直すかを決める / 根拠: 両 sample の該当箇所、vp-qe-kata-conformance / 印: 要判断
- No: 5 / 段: R5 / 箇所: docs/ja/product/010-business-specs/060-glossary/gl-common.yaml の tm-progress-report / 指摘: 用語集は進捗報告を「関係者に報告するビュー」と定義しているが、pr-sample は人が書く報告文書であり、意味の範囲が合わない / 直す案（相手側なので変えていない）: 用語集の定義を、生成するビューと人が書く報告文書の両方を含むように広げるか、製品用語として今のまま区別するかを決める / 根拠: gl-common.yaml の tm-progress-report、specdojo:pr-rulebook の「全体方針」 / 印: 要判断
- No: 6 / 段: R5 / 箇所: grade の F001（line=3 の導入文、vp-ba-stakeholder-clarity） / 指摘: 報告者・報告先を書くよう求める指摘だが、kata ガイドの「kata の観点の組」は vp-ba-stakeholder-clarity を段のレビューでは使わない観点としており、R5 の観点にも当たらない。rulebook も報告者・報告先を必須にしていない / 直した案: sample は変えない。必要なら rulebook の本文要件に報告者・報告先を足すかを別に判断する / 根拠: docs/ja/specdojo/guides/kata-guide.md の「kata の観点の組」、specdojo:pr-rulebook の「本文要件」 / 印: 要判断

## 4. 進め方と実践の型の適用

報告の向きを成果物から sample へ切り替え、pr-sample を mm-sample、pm-communication-plan-sample、pr-rulebook、用語集、kata ガイドと照合した。食い違いのうち pr-sample 側で直せるものは直し、相手側の分は直す案だけを残した。grade の F001（`vp-ba-stakeholder-clarity`）は kata ガイドの観点の組で段のレビューに使わない観点とされているため、扱わなかった。
