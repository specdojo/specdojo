---
specdojo:
  id: prj-0001:xer-t-kata-review-all-opr-access-control-sample-120-20261125t063434z-7a01cb02
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-opr-access-control-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-opr-access-control-sample-120/T-KATA-REVIEW-ALL-opr-access-control-sample-120-20261125T063434Z-7a01cb02/plan.md
  started_at: "2026-11-25T06:34:43.513Z"
  completed_at: "2026-11-25T06:48:48.601Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opr-access-control-sample
    - specdojo:opr-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R2（構成）として、`docs/ja/specdojo/samples/opr-sample.md` の本文の並びを 3 か所直した。章の移動・分割・統合はしていない。
- 12 章の見出しと順は opr-rulebook の本文要件と opr-template に一致していた。rulebook と template は変更していない。
- prettier・markdownlint・runner の `lint:md:changed`・`lint:fm:changed`・`lint:mermaid`・`lint:d2`・`test:docs`・`validate:schema` は通った。
- grade の finding F001〜F004 は、R2 では扱わない観点（F001・F004 は kata の段では使わない観点、F002 は R4、F003 は R5）のため、この段では対応していない。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opr-sample.md`: 日次・週次・月次点検手順の表の後の 2 段落を、表の行の順に合わせて日次の現金の差、月次の指標の報告の順へ入れ替えた。運用変更作業では、適用前の確認の文を表の前から表の後の段落の頭へ移した。表の後は適用前の確認、ロールバック、事前周知の順に並べ、表の前には表の説明の 1 文だけを残した。証跡では、受入確認の模擬の手順と模擬結果の記録先が割れていた 2 段落を 1 段落にまとめた。

## 3. 申し送り

- 指摘一覧（No・段・箇所・指摘・直した案・根拠・印）は executor の handoff に記載済み。上記 summary にはその内容を重ねて書いていない。
- No.5 は「要判断」。タスク名は `opr-access-control-sample` のレビューだが、plan の編集対象と grade の finding の行番号は `opr-sample.md` を指していた。R1 との一貫性も考え、`opr-sample.md` を直し、`opr-access-control-sample.md` は変更していない。選ばなかった案は、`opr-access-control-sample.md` を R2 の対象にすること。編集対象の解決のしかたは人が確認する必要がある。
- grade の F001（決定者と期限の列）・F004（ready 化の前に解消すべき項目）は R2 の範囲外。F002（証跡の保管期間）は R4、F003（関連導線の分冊の記述と id の不整合）は R5 の段で扱う想定。
- 1: R2 / 日次・週次・月次点検手順 / 表の後の 2 段落が、月次（指標の報告）→日次（現金の差）の順になっていて、表の行の順（日次→月次）と逆になっている / 2 段落を入れ替え、日次の現金の差→月次の指標の報告の順にした / `vp-arc-document-structure`（表と本文の配置） / -
- 2: R2 / 運用変更作業 / 適用前の確認（検証用の環境で販売・在庫・つけを各 1 件記録できることを確かめてから承認を求める）が表の前の 1 文に混ざっている。template は表の後に実施手順（適用前の確認、適用、ロールバックの操作）を置く / 該当の文を表の後の段落の頭へ移し、適用前の確認→ロールバック→事前周知の順に並べた。表の前には表の説明の 1 文だけを残した / `vp-arc-document-structure`（opr-template「運用変更作業」の TODO の順） / -
- 3: R2 / 証跡 / 受入確認の模擬の手順と、模擬結果の記録先が別々の段落に分かれていて、1 つの手順が 2 段落に割れている / 2 段落を 1 段落にまとめた / `vp-arc-document-structure`（段落の粒度）、opr-rulebook「運用作業の受入確認」 / -
- 4: R2 / 全体の章構成 / 12 章の見出しと順は opr-rulebook「本文要件」と opr-template に一致し、各章で表と本文の分担も template の骨組みに沿っていたため、章の移動・分割・統合はしなかった / - / `vp-arc-document-structure`、`vp-qe-omissions-consistency` / -
- 5: R2 / 対象の解決 / タスクは opr-access-control-sample のレビューだが、plan の編集対象は rulebook の sample 宣言の先頭から解決された opr-sample.md で、grade の finding F001〜F004 の行も opr-sample.md を指している。R1（T-KATA-REVIEW-ALL-opr-access-control-sample-110）と同じく opr-sample.md を直し、opr-access-control-sample.md は変更していない / - / plan「根拠となる成果物と編集対象」、kata-guide「段と渡す材料」 / 要判断（選ばなかった案は opr-access-control-sample.md を R2 の対象にすること。plan の編集対象・finding の行番号・R1 との一貫性を優先した。編集対象の解決のしかたを確かめる必要がある）
- 6: R2 / 概要・証跡・関連ドキュメント導線 / grade の finding F001・F004（`vp-po-decision-readiness`・`vp-ops-release-readiness`）は kata の段では使わない観点、F002（`vp-qe-verifiability`）は R4、F003（`vp-qe-kata-conformance`）は R5 の観点で、R2 では扱わない / - / kata-guide「kata の観点の組」 / -
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/opr-sample.md だけで、plan・result・個票の履歴ファイルを変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルに `*.yaml` / `*.yml` がない）

## 4. 進め方と実践の型の適用

sample メンテナンスの進め方に沿い、plan の編集対象 `docs/ja/specdojo/samples/opr-sample.md` を読み込んだ。R2 の観点（章の順・粒度・表と本文の配置）で opr-rulebook の本文要件と opr-template の骨組みに照合した。章構成は一致していたため維持し、表と本文の配置のずれ 3 か所だけを直した。rulebook など sample 以外は変更していない。grade result のサイドカーも編集していない。F001〜F004 は R2 の観点に当たらないため未対応とし、扱う段を handoff に記した。
