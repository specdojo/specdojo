---
specdojo:
  id: prj-0001:xer-t-kata-review-all-pm-quality-management-plan-sample-110-20261125t143549z-084c0376
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-pm-quality-management-plan-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-pm-quality-management-plan-sample-110/T-KATA-REVIEW-ALL-pm-quality-management-plan-sample-110-20261125T143549Z-084c0376/plan.md
  started_at: "2026-11-25T14:35:58.628Z"
  completed_at: "2026-11-25T14:46:13.295Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:pm-quality-management-plan-sample
    - specdojo:pm-quality-management-plan-sample
---

# Edit Result

## 1. 実施内容

- R1（目的の過不足）の確かめとして、sample の「未決事項と保留」の表を直した。rulebook と recipe が未決事項ごとに求める「決定後に直す条件・証跡」が3行すべてになかったため足した。
- 表の前に表の内容を示す1文を足した。品質ゲートの章と重なる記述は削った。
- grade の F001・F002 は R1 で使わない観点（`vp-po-decision-readiness`、`vp-pm-plan-feasibility`）なので扱っていない。F003 は rulebook と template の列構成の食い違いで、sample 以外は変更していないため要判断として残した。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R1 | 見直し条件と未決事項 &gt; 未決事項と保留（表） | rulebook の「見直し条件と未決事項」は未決事項ごとに決定時に直す条件・証跡を特定するよう求め、recipe も「決まったとき直す条件を添える」としている。sample の3行にはその記述がなかった。 | 3行それぞれの「影響・未決中に保留する判定」の列に、決定後に更新する条件・証跡を足した。準備着手の上限と試用日は品質ゲートの時期と `kinuya-schedule`、オフライン時の運用は初期受入の合格条件と `kinuya-acceptance-record`、人気商品の対象範囲は基準値の採取対象と `kinuya-trial-log` の引き継ぎ項目とした。sample に反映済み。 | rulebook の記述ガイド「見直し条件と未決事項」、recipe の「見直し条件と未決事項」のコツ | - |
| 2 | R1 | 見直し条件と未決事項 &gt; 未決事項と保留（表の前） | 表の前に、何を示す表かを説明する1文がなかった。 | 「未決の論点ごとに、未決中に保留する判定と、決定後に直す条件・証跡を次に示す。」を足した。sample に反映済み。 | Sample 記述標準の「記述ガイド」にある、表の前に1文を書く規定 | - |
| 3 | R1 | 見直し条件と未決事項 &gt; 未決事項と保留（人気商品の行） | 「運用後の SC-04 の合否は初期受入に含めない」は、品質ゲートの章の「SC-04〜SC-06 は初期受入の合否に含めず」と同じ内容である。 | 未決事項の表の側を削った。sample に反映済み。 | `vp-arc-conciseness`（同じ主張を繰り返さない） | - |
| 4 | R1 | 見直し条件と未決事項 &gt; 未決事項と保留（列の構成。grade の F003） | template は未決事項の表を4列（論点・正本と判断材料の担当・決定時期・判断者・未決中に保留する判定・作業）とする。rulebook の記述ガイドは「論点」「影響・未決中に保留する判定」の2列と定めている。kata どうしが食い違っており、sample は rulebook に合わせて2列のままにした。 | sample 以外は変えていない。案 A は、rulebook の本文要件と記述ガイドに、判断材料の担当 Role code と決定時期・判断者を加え、template に合わせる。案 B は、template を rulebook の2列に戻す。どちらかに決めた後、sample の列をそろえる。担当と時期を未決事項に持たせるかは、ドキュメントメタ情報標準の「未決事項・課題の PJR への引き継ぎ」（担当 Role code を明記する）との関係で判断が要る。 | rulebook の記述ガイド「見直し条件と未決事項」、template の「未決事項と保留」、sample の構造は rulebook を正とする plan の指示 | 要判断 |
| 5 | R1 | 見直し条件と未決事項 &gt; 未決事項と保留（オフライン時の運用の行。grade の F001・F002） | 判断材料を整える担当・PO へ示す時期、未決を解く作業の担当と完了条件を求める finding である。ただし `vp-po-decision-readiness` と `vp-pm-plan-feasibility` は、kata ガイドの「kata の観点の組」が段のレビューから外している観点である。 | R1 では扱わず、sample にも反映していない。担当や時期を足す場合は、No 4 の結論（案 A）に従って一緒に直す。 | kata ガイドの「kata の観点の組」にある、使わない観点の表 | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/pm-quality-management-plan-sample.md`: 「未決事項と保留」で、表の前に表の内容を示す1文を足した。3行それぞれに、決定後に更新する条件・証跡を足した。対象は品質ゲートの時期と `kinuya-schedule`、初期受入の合格条件と `kinuya-acceptance-record`、基準値の採取対象と `kinuya-trial-log` の引き継ぎ項目。人気商品の行にあった、品質ゲートの章と重なる SC-04 の記述は削った。列は rulebook に合わせて2列のままにした。

## 3. 申し送り

- `prettier` と `markdownlint` は passed。runner の `lint:md:changed`、`lint:fm:changed`、`validate:schema` などの検証も passed。
- 要判断が2件ある。No 4 は、rulebook の2列と template の4列の食い違いをどう解消するかの判断である。No 5 は、No 4 の結論に従って担当・時期を足すかの判断である。
- No: 1 / 段: R1 / 箇所: 見直し条件と未決事項 &gt; 未決事項と保留（表） / 指摘: rulebook の「見直し条件と未決事項」は未決事項ごとに決定時に直す条件・証跡を特定するよう求め、recipe も「決まったとき直す条件を添える」としているが、sample の 3 行にその記述がなかった / 直した案: 3 行それぞれの「影響・未決中に保留する判定」の列に、決定後に更新する条件・証跡を足した（準備着手の上限と試用日→品質ゲートの時期と `kinuya-schedule`、オフライン時の運用→初期受入の合格条件と `kinuya-acceptance-record`、人気商品の対象範囲→基準値の採取対象と `kinuya-trial-log` の引き継ぎ項目）。sample に反映済み / 根拠: rulebook の記述ガイド「見直し条件と未決事項」、recipe の「見直し条件と未決事項」のコツ / 印: なし
- No: 2 / 段: R1 / 箇所: 見直し条件と未決事項 &gt; 未決事項と保留（表の前） / 指摘: 表の前に、何を示す表かを説明する 1 文がなかった / 直した案: 「未決の論点ごとに、未決中に保留する判定と、決定後に直す条件・証跡を次に示す。」を足した。sample に反映済み / 根拠: Sample 記述標準の「記述ガイド」にある、表の前に 1 文を書く規定 / 印: なし
- No: 3 / 段: R1 / 箇所: 見直し条件と未決事項 &gt; 未決事項と保留（人気商品の行） / 指摘: 「運用後の SC-04 の合否は初期受入に含めない」は、品質ゲートの章の「SC-04〜SC-06 は初期受入の合否に含めず」と同じ内容である / 直した案: 未決事項の表の側を削った。sample に反映済み / 根拠: `vp-arc-conciseness`（同じ主張を繰り返さない） / 印: なし
- No: 4 / 段: R1 / 箇所: 見直し条件と未決事項 &gt; 未決事項と保留（列の構成。grade の F003） / 指摘: template は未決事項の表を 4 列（論点・正本と判断材料の担当・決定時期・判断者・未決中に保留する判定・作業）とするが、rulebook の記述ガイドは「論点」「影響・未決中に保留する判定」の 2 列と定めている。kata どうしが食い違っており、sample は rulebook に合わせて 2 列のままにした / 直した案: sample 以外は変えていない。案 A: rulebook の本文要件と記述ガイドに、判断材料の担当 Role code と決定時期・判断者を加え、template に合わせる。案 B: template を rulebook の 2 列に戻す。どちらかに決めた後、sample の列をそろえる。担当と時期を未決事項に持たせるかは、ドキュメントメタ情報標準の「未決事項・課題の PJR への引き継ぎ」（担当 Role code を明記する）との関係で判断が要る / 根拠: rulebook の記述ガイド「見直し条件と未決事項」、template の「未決事項と保留」、sample の構造は rulebook を正とする plan の指示 / 印: 要判断
- No: 5 / 段: R1 / 箇所: 見直し条件と未決事項 &gt; 未決事項と保留（オフライン時の運用の行。grade の F001・F002） / 指摘: 判断材料を整える担当・PO へ示す時期、未決を解く作業の担当と完了条件を求める finding である。ただし `vp-po-decision-readiness` と `vp-pm-plan-feasibility` は、kata ガイドの「kata の観点の組」が段のレビューから外している観点である / 直した案: R1 では扱わず、sample にも反映していない。担当や時期を足す場合は、No 4 の結論（案 A）に従って一緒に直す / 根拠: kata ガイドの「kata の観点の組」にある、使わない観点の表 / 印: 要判断
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/samples/ 配下の sample だけで、plan・result・個票は変更していないため）

## 4. 進め方と実践の型の適用

根拠は、rulebook の記述ガイド「見直し条件と未決事項」、recipe の同名のコツ、Sample 記述標準、`vp-arc-conciseness`、kata ガイドの「kata の観点の組」。構造は rulebook を正とし、sample は2列を維持した。F001・F002 は R1 の観点に当たらないため扱わず、F003 は rulebook と template の食い違いなので要判断として申し送った。
