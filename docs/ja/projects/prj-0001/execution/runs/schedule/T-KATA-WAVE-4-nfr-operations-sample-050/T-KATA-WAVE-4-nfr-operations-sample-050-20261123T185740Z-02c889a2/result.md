---
specdojo:
  id: prj-0001:xer-t-kata-wave-4-nfr-operations-sample-050-20261123t185740z-02c889a2
  type: exec-result
  task_id: T-KATA-WAVE-4-nfr-operations-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-4-nfr-operations-sample-050/T-KATA-WAVE-4-nfr-operations-sample-050-20261123T185740Z-02c889a2/plan.md
  started_at: "2026-11-23T18:57:48.656Z"
  completed_at: "2026-11-23T19:03:52.136Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:nfr-operations-sample
    - specdojo:nfr-operations-sample
---

# Edit Result

## 1. 実施内容

- rulebook の必須 5 章の構成に従い、`docs/ja/specdojo/samples/nfr-operations-sample.md` を駄菓子屋きぬやの運用要件の完成例として厚く書き直しました。
- `nfr-ops-001` から `nfr-ops-009` までの要件を定義し、監視・バックアップ・手順・体制の達成基準、および測定・検証方法、関連ドキュメントへの導線を整備しました。
- 指標やしきい値など、利用者が決定すべき値については `_UNDECIDED_` を用いて記述しています。
- prettier および markdownlint による検証を実施し、エラーがないことを確認しました。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/nfr-operations-sample.md`: rulebook の必須構成（概要、適用範囲・体制前提、運用要件一覧、測定・検証方法、関連ドキュメント導線）に基づき、具体的な運用要件（`nfr-ops-001`〜`nfr-ops-009`）や、測定基準、関連文書へのリンクを含む完成例として内容を大幅に拡充しました。

## 3. 申し送り

- 利用者が決める値として `_UNDECIDED_` で残した: バックアップ成功率の目標（`nfr-ops-003`）、営業時間外の緊急連絡手段（`nfr-ops-009`）。
- `_ASSUMPTION_` で置いた値の確認が必要: 営業時間 10:00〜18:00（`opd-index` と同じ）、`OPS` は 1 名、外部の死活監視が 1 分ごとに確かめる、MTTD は 10 分以内（`nfr-ops-001`）、切替訓練は年 2 回（`nfr-ops-007`）。
- rulebook の変更案: 本文要件が 5 章固定のため「未決事項」の章を置けず、未決の値は表の中に `_UNDECIDED_` として書いた。可用性の sample のように任意章として認めるか、登録簿へ引き継ぐ手順を本文要件に書くかを判断する（F002・F005 に関係）。
- rulebook の変更案: 判定者の欄（Role code）は文書の中身として扱う役割（業務の担当）だが、PJR-76N9 の文書の役割の割り当てとの境界を記述ガイドに明記するとよい。F021（リリース承認者のロール）は PJR-76N9 に従い本文に足していない。
- rulebook の `_UNDECIDED_` にある「sample が 5 章に揃っていない」は今回解消したので、`recipe`・`template` の要否の判断に進める。
- `sac-operations` はまだないためバッククォートで仮置きした。

## 4. 進め方と実践の型の適用

rulebook に基づき、既存の sample を完成例として厚くする作業を行いました。具体的には、findings で指摘された「構成の不足」「具体的な指標・基準の欠如」「ステークホルダーや技術的前提の不足」を解消するため、rulebook の必須 5 章の構成に従って、具体的な運用要件（`nfr-ops-001`〜`nfr-ops-009`）や、達成基準、検証方法を定義しました。
