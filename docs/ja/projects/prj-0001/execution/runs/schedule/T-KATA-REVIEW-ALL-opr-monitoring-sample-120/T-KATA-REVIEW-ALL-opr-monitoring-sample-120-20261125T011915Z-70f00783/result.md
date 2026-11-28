---
specdojo:
  id: prj-0001:xer-t-kata-review-all-opr-monitoring-sample-120-20261125t011915z-70f00783
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-opr-monitoring-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-opr-monitoring-sample-120/T-KATA-REVIEW-ALL-opr-monitoring-sample-120-20261125T011915Z-70f00783/plan.md
  started_at: "2026-11-25T01:19:25.133Z"
  completed_at: "2026-11-25T01:31:37.327Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opr-monitoring-sample
    - specdojo:opr-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R2（構成）として `opr-monitoring-sample.md` を見直し、2 か所を直した（2 行追加、4 行削除）。
- 日次・週次・月次点検の導入文に、週次の点検を置かないことを明記した。
- 証跡の導入文では、`opr-index` と共有する記録と本書で足す記録を書き分けた。重複していた 1 文は削った。
- アラート対応手順の補足の並びは、前提から結論の順に読めるため維持した。
- `opr-sample.md`、rulebook、template は変更していない。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opr-monitoring-sample.md`: 「日次・週次・月次点検手順」の導入文に、共通の点検は `opr-index` 参照とし、本書で足す点検は 3 つで週次は置かないと明記した。「証跡」の導入文では、障害記録・変更記録・月次点検の記録は `opr-index` と同じ記録に本書の識別子を足すもの、通知の履歴は本書で足す証跡と書き分けた。未決の保管期間は `opr-index` の未決事項を参照する形にし、重複していた 1 文を削った。

## 3. 申し送り

- 指摘一覧（No・段・箇所・指摘・直した案・根拠・印）。
- | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | 1 | R2 | 「日次・週次・月次点検手順」の導入文 | 週次の点検を置くかどうかが書かれておらず、rulebook の必須の範囲に抜けがあるように読める | 「共通の日次・月次点検は `opr-index` 参照とする。本書の手順のために足す点検は次の 3 つで、週次の点検は置かない。」に直した | opr-rulebook の本文要件、opr-sample と opr-incident-sample の同じ章の書き方 | sample に反映済み | | 2 | R2 | 「証跡」の導入文と表の後の 1 文 | 「保存先と保管期間は `opr-index` に従う」と書いた直後の表で同じ値を書き直していた。`opr-index` にない「通知の履歴」も同じ扱いで食い違っていた。表の後の保管期間の 1 文も `opr-index` の未決事項と同内容だった | 記録を `opr-index` と共有するものと本書で足すものに書き分け、未決の保管期間は `opr-index` の概要を参照する形にして重複の 1 文を削った | `vp-qe-omissions-consistency`、`vp-arc-conciseness` | sample に反映済み | | 3 | R2 | 「アラート対応手順」の補足の並び | 停止の判断の表と誤検知の扱いは、段階の表の行と同じ順で、前提から結論の順に読める | 変更なし | opr-template のアラート対応手順 | 維持 | | 4 | R2 | 「障害対応手順」 | 表の列が template の 6 列と違う。分冊は `opr-index` に処理を渡すまでを扱い、rulebook も「`opr-index` 参照」と理由を書く形を認めているため、構成の問題とは見なさなかった | 変更なし。分冊でも template の列にそろえるかは人が決める | opr-rulebook の本文要件 | 要判断 |
- grade の F001（`vp-po-decision-readiness`）と F004（`vp-ops-release-readiness`）は、kata-guide の「kata の観点の組」で kata のレビューに使わないと決められた観点のため扱っていない。kata の承認と ready 化は登録簿で追う。
- grade の F002（`vp-qe-verifiability`、保管期間の判定値）は R4、F003（`vp-qe-kata-conformance`、関連導線の id と分冊の書き方。`opr-sample` 側の記述）は R1 または R5 で扱う。
- plan の編集対象は rulebook の sample 宣言から `opr-sample.md` と解決されていた。このタスクのレビュー対象（task id）は `opr-monitoring-sample` のため、そちらを直した。`opr-sample.md` は変更していない。
- No: 1 / 段: R2 / 箇所: opr-monitoring-sample の「日次・週次・月次点検手順」の導入文 / 指摘: 週次の点検を置くかどうかが書かれておらず、rulebook の必須の範囲（日次・週次・月次）に抜けがあるように読める / 直した案: 「共通の日次・月次点検は `opr-index` 参照とする。本書の手順のために足す点検は次の 3 つで、週次の点検は置かない。」に直した / 根拠: opr-rulebook の本文要件、opr-sample と opr-incident-sample の同じ章の書き方 / 印: sample に反映済み
- No: 2 / 段: R2 / 箇所: opr-monitoring-sample の「証跡」の導入文と表の後の 1 文 / 指摘: 「保存先と保管期間は `opr-index` に従う」と書いた直後の表で同じ値を書き直していた。さらに `opr-index` にない「通知の履歴」も同じ扱いにしていて食い違っていた。表の後の「保管期間が決まるまでは証跡を消さない」も `opr-index` の未決事項の表と同じ内容だった / 直した案: 障害記録・変更記録・月次点検の記録は `opr-index` と同じ記録に本書の識別子を足すもの、通知の履歴は本書で足す証跡と書き分けた。未決の保管期間は `opr-index` の概要の未決事項を参照するように直し、重複していた 1 文は削った / 根拠: `vp-qe-omissions-consistency`、`vp-arc-conciseness` / 印: sample に反映済み
- No: 3 / 段: R2 / 箇所: opr-monitoring-sample の「アラート対応手順」の補足の並び / 指摘: 停止の判断の表と誤検知の扱いの箇条書きは、段階の表の行（暫定対応 → 誤検知）と同じ順で、前提から結論の順に読めることを確かめた / 直した案: 変更なし / 根拠: opr-template のアラート対応手順 / 印: 維持
- No: 4 / 段: R2 / 箇所: opr-monitoring-sample の「障害対応手順」 / 指摘: 表の列が template の 6 列（優先度・初動目標・切り分け・一次対応・復旧・エスカレーション）と違う。分冊は `opr-index` に処理を渡すまでを扱い、rulebook も「`opr-index` 参照」と理由を書く形を認めているので、構成の問題とは見なさなかった / 直した案: 変更なし。分冊でも template の列にそろえるかは人が決める / 根拠: opr-rulebook の本文要件 / 印: 要判断
- grade の指摘のうち、F001（`vp-po-decision-readiness`）と F004（`vp-ops-release-readiness`）は kata-guide の「kata の観点の組」で kata のレビューに使わないと決められた観点のため、扱わない。kata の承認と ready 化は登録簿で追う。
- grade の指摘 F002（`vp-qe-verifiability`、保管期間の判定値）は R4、F003（`vp-qe-kata-conformance`、関連導線の id と分冊の書き方。opr-sample 側の記述）は R1 または R5 で扱う。
- plan の編集対象は rulebook の sample の宣言から opr-sample.md と解決されていたが、このタスクのレビュー対象（task id）は opr-monitoring-sample なので、そちらを直した。直前の opr-incident-sample の R2 も個別の sample を直していた。opr-sample.md は変更していない。
- 適用外の検証: `npm run validate:history-links`（plan・result・個票を変更していないため適用条件を満たさない）
- 適用外の検証: `npm run validate:schema:file`（変更した `*.yaml` / `*.yml` ファイルがないため）

## 4. 進め方と実践の型の適用

sample-maintenance の R2（構成）として、章の順・粒度・表と本文の配置が rulebook の本文構成と template に沿っているかを確かめた。根拠にしたのは opr-rulebook の本文要件、opr-template のアラート対応手順、同系列の opr-sample と opr-incident-sample の章の書き方、`vp-qe-omissions-consistency`、`vp-arc-conciseness`。週次点検の有無の明記と証跡の重複・食い違いの解消を反映し、アラート対応手順の並びは維持した。障害対応手順の表の列構成は、人が決める「要判断」として残した。grade の F001 と F004 は kata のレビューに使わない観点のため扱わない。F002 は R4、F003 は R1 または R5 に任せた。検証は、runner の `lint-md-changed`、`lint-fm-changed`、`lint-mermaid`、`lint-d2`、`test-docs`、`validate-schema` と executor の prettier チェックがいずれも通った。
