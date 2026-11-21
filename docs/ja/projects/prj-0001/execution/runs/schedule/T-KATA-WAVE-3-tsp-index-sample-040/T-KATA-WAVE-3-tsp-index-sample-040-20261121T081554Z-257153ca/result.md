---
specdojo:
  id: prj-0001:xer-t-kata-wave-3-tsp-index-sample-040-20261121t081554z-257153ca
  type: exec-result
  task_id: T-KATA-WAVE-3-tsp-index-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-3-tsp-index-sample-040/T-KATA-WAVE-3-tsp-index-sample-040-20261121T081554Z-257153ca/plan.md
  started_at: "2026-11-21T08:16:00.990Z"
  completed_at: "2026-11-21T08:23:23.164Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - specdojo:tsp-index-sample
    - specdojo:tsp-index-rulebook
---

# Edit Result

## 1. 実施内容

- rulebook を簡潔化し、品質ゲートの判定者に関する定義や、非機能要件（NFR/SAC）との接続、テストレベル名称の統一を行いました。
- 既存のサンプル章および「よくある誤りと対策」の表を削除し、章ごとの判断基準や良い例・悪い例を含む記述ガイドの形式へと再構成しました。
- F001〜F006、F008〜F010 の finding を解消しました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/tsp-index-rulebook.md`: 完成例の章（旧サンプル章）と「よくある誤りと対策」の表を削除しました。代わりに、判定者列や前提列の定義を含む本文要件の構成と、各章の判断基準・良い例・悪い例を記述するガイドへの再構成を行いました。

## 3. 申し送り

- F007（sample が説明書で実例になっていない）は本段の対象外（plan: sample はこの段で変更しない）のため未解消。後続の sample-maintenance で、削除した旧サンプル章の内容（テストレベル一覧・スコープ・環境・入口／出口条件・自動化方針・メモ）を新しい本文要件（判定者列、NFR/SAC 接続、5 レベル名称）に沿って tsp-index-sample.md へ移す。
- DEC は PJR-HVQZ で非推奨のため、`based_on` の根拠例から外した（旧記述は BAC/NFR/SAC/DEC）。
- 章名を「本文構成（標準テンプレ）」から Rulebook 記述標準と同じ「本文要件」へ変更した。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/rulebooks/tsp-index-rulebook.md のみで、plan/result/個票を変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルに `*.yaml` / `*.yml` がない）
- 適用外の検証: `specdojo catalog validate`（変更は docs/ja/specdojo/ 配下のみで docs/ja/projects/ に及ばない）

## 4. 進め方と実践の型の適用

rulebook-maintenance
