---
specdojo:
  id: prj-0001:xer-t-kata-wave-5-mip-index-sample-050-20261123t061252z-a217a299
  type: exec-result
  task_id: T-KATA-WAVE-5-mip-index-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-5-mip-index-sample-050/T-KATA-WAVE-5-mip-index-sample-050-20261123T061252Z-a217a299/plan.md
  started_at: "2026-11-23T06:13:04.152Z"
  completed_at: "2026-11-23T06:26:51.565Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:mip-index-sample
    - specdojo:mip-index-sample
---

# Edit Result

## 1. 実施内容

- sample 文書である `docs/ja/specdojo/samples/mip-index-sample.md` を、grade による指摘事項（F001〜F006）に基づいて更新し、完成例としての厚みを持たせました。
- 主な修正内容は以下の通りです：
- 業務停止時間に関する前提と成功条件の矛盾を解消するため、切替日の午前を臨時休業（正午開店）とする前提を `_ASSUMPTION_` として追加
- 業務停止時間の証跡を、開始・終了時刻から「通常の開店時刻どおりに販売を受け付けたかの記録」へ変更
- 個人情報の取り扱い（転記用表の保管・廃棄）に関する法務/セキュリティ制約を追加
- 対象一覧の表に「機能」および「I/F（なし）」の行を追加
- ハイパーケア体制に「店舗運営アドバイザー」の役割と責務、連絡先を追加
- 正本切替の伝達先を、体制表の役割名に合わせて「家族利用者代表」に統一

## 2. 変更ファイル

- `docs/ja/specdojo/samples/mip-index-sample.md`: grade による指摘（F001〜F006）に基づき、切替日の午前休業の前提追加、業務停止時間の証跡変更、個人情報保護の制約追加、対象一覧の機能/I/F行の追加、ハイパーケア体制の拡充、および正本切替の伝達先名称の統一を行いました。

## 3. 申し送り

- 切替日の午前を臨時休業にして正午に開店するという前提は `_ASSUMPTION_` として置いた仮の値。利用者が店の営業時間に合わせて確定する必要がある。
- 切替日は `_UNDECIDED_` のまま残した（移行リハーサルの結果を見て店主代表が決める値）。
- rulebook と合わせて直すべき点はない。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/ 配下の sample だけで、pjr 個票・plan・result を変更していない）

## 4. 進め方と実践の型の適用

sample を共通サンプルの完成例として厚くするため、grade の指摘事項をすべて解消し、実現的な値（一部 `_UNDECIDED_` を含む）で構成された成果物を作成しました。
