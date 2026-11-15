---
specdojo:
  id: prj-0001:xer-pjr-jfrx-20261115t165136z-2ce5ab63
  type: exec-result
  task_id: PJR-JFRX
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-JFRX/pjr-jfrx-20261115T165136Z-2ce5ab63/plan.md
  started_at: "2026-11-15T16:59:25.180Z"
  completed_at: "2026-11-15T17:27:17.234Z"
  agent: opus-executor
  approach: fully-guided
  targets:
    - bds-progress-report
---

# Edit Result

## 1. 実施内容

- bds-progress-report を grade の指摘 F001〜F016 で手直しした。報告期間を前週金曜17時〜当週金曜17時（Asia/Tokyo、終点を含まない）に決め、表示項目・算出ルール・例外を合わせた。未決の目印は本文の決定か、判断点を 140 とする留保（登録簿で追跡）に置き換えた。status は draft のまま。個票の「対応結果」に、決めた内容と理由を記入した。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/040-user-interface-model/bds-progress-report.md`: 変更、+34 / -31 行

## 3. 申し送り

- 期間の終わりの境界は executor が決めた: 期間は前週金曜 17 時から当週金曜 17 時（`Asia/Tokyo`）で、始点を含み終点を含まず、名前は起動予定時刻が属する ISO 週とする。理由は、作成時点で期間内の記録が揃い、各記録が 1 件の報告にだけ入り、作成後に補う必要がないため。PO が T-KATA-WAVE-2-bds-progress-report-140 でこの範囲を承認するかを判断する。
- ファイル名と期間の案（日付に当週金曜を使い、再出力は連番を増やさず同じファイルを更新する）は、正本である進捗報告の rulebook への反映が要る。PM が 140 までに採否を決める。
- 統合前の確認の案（Job の `task.review` で統合前 review を宣言する）は `job-weekly-report.yaml` への反映が要る。ARC が経路を確認し、定期起動の有効化の前に PM が要否を決める。
- 「定期起動の有効化」「ファイル名と期間」「統合前の確認」「記録欠落時の停止」「登録簿の状態変化の配置」の 5 件は、PM が 140 までに登録簿へ起票して追跡する（未起票）。
- 個票の完了条件にある `grade run --target deliverable` での再 grade は、agent の起動を伴うため executor の段では実行していない。人が再 grade し、結果を個票の「対応結果」に追記する必要がある。
- 削除・統合の判断: 「期間の終点」の行は決めたため削除した。「出力の時期と契機」の `enabled: false` の `_ASSUMPTION_` は「定期起動の有効化」の行と重複するため、参照に置き換えた。
- 人の確認が必要: `grade run --target deliverable`（agent を起動して再 grade し、結果を個票の「対応結果」に追記する）

## 4. 進め方と実践の型の適用

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
