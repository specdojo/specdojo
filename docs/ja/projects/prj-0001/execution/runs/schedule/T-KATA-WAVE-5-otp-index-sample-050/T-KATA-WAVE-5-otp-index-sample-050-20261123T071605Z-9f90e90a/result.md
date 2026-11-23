---
specdojo:
  id: prj-0001:xer-t-kata-wave-5-otp-index-sample-050-20261123t071605z-9f90e90a
  type: exec-result
  task_id: T-KATA-WAVE-5-otp-index-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-5-otp-index-sample-050/T-KATA-WAVE-5-otp-index-sample-050-20261123T071605Z-9f90e90a/plan.md
  started_at: "2026-11-23T07:16:16.577Z"
  completed_at: "2026-11-23T07:31:25.476Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:otp-index-sample
    - specdojo:otp-index-sample
---

# Edit Result

## 1. 実施内容

- sample である `docs/ja/specdojo/samples/otp-index-sample.md` を、駄菓子屋「きぬや」の共通サンプル文脈に沿った完成例として厚くしました。
- F001〜F018 で指摘された 18 項目の finding 全てに対応しました。具体的には、概要への目的・適用範囲の追記、クローズ条件の判定タイミングと承認者の明記、障害対応における判断・連絡・復旧・報告の流れの記述、バックアップの保管先および検証方法の追記、権限移行の検証条件、問合せ窓口のエスカレーション条件、および文脈に合わせた体制（Ops/Biz）から店主・家族への変更などを行っています。
- Frontmatter に `based_on` を追加し、前段の成果物への依存関係を示しました。
- Prettier による整形および markdownlint による静的検査をパスしています。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/otp-index-sample.md`: 駄菓子屋「きぬや」の文脈に合わせて、概要（運用目的・適用範囲）、権限移行の検証条件、バックアップの保管先と検証方法、障害対応フローの詳細（判断・連絡・復旧・報告）、問合せ窓口のエスカレーション条件、およびクローズ条件における判定タイミングと承認者を追記し、体制を家族経営の規模に最適化しました。

## 3. 申し送り

- 決める必要のある値（`_UNDECIDED_`）: 画面の応答が遅いとみなす閾値（ハイパーケア初週の様子を見て店主代表が決める）、旧ノートを参照できる期間（`dmd-index` の保管期間に合わせる）。
- 仮定した値（`_ASSUMPTION_`）: 端末のバッテリーの閾値 20%、バックアップの保管先を店頭タブレットとは別の USB メモリとして鍵付きの引き出しに保管する点。
- 店の営業時間はほかの sample にも定義がないため、時刻ではなく「営業時間中」「閉店後」で書いた。共通サンプル文脈に営業時間を加える場合は本書も直す。
- 合わせて直すべき点: `otp-sample`（対象別の分冊）は Ops2 + Biz1 など一般的な IT 運用の例のままで、共通サンプル文脈と本書に食い違う。別タスクで駄菓子屋の文脈へ揃える必要がある。
- rulebook の変更案: 記述ガイドの良い例（重大障害 0 件が 30 日継続、2 名・夜間オンコール）は一般的な IT 運用の値であり、sample（P1 0 件が 14 日継続、店番 2 名）と食い違う。rulebook の例を題材に依存しない書き方へ直すか、sample と揃えることを検討する。
- 参照の仮置き: `otp-hypercare`、`opr-sales`、`opr-credit`、`opr-daily-closing`、`opr-shift-handover`、`opr-index`、`dmd-index` は文書がないためバッククォートで仮置きした。
- PJR-76N9 に従い、文書の役割の割り当てと承認の進み具合は本文に書いていない。クローズ判断者・障害時の指揮系統は、rulebook が求める文書の中身（体制）として書いた。

## 4. 進め方と実践の型の適用

参照の向きを「成果物 → sample」に切り替え、対象成果物に紐づく sample を「見直す対象」として編集しました。F001〜F018 の各 finding が示す不足事項（適用範囲、クローズ条件の判定/承認、障害対応の段階、バックアップの保管先、権限移行の検証、問合せのエスカレーション、および共通文脈への不整合）を、rulebook および執筆標準に従って解消しました。未存在の文書については、backtick を用いて `id` で仮置きしています。
