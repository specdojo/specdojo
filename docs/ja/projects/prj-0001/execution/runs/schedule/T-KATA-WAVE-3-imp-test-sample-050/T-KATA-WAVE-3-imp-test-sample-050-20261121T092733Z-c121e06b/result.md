---
specdojo:
  id: prj-0001:xer-t-kata-wave-3-imp-test-sample-050-20261121t092733z-c121e06b
  type: exec-result
  task_id: T-KATA-WAVE-3-imp-test-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-3-imp-test-sample-050/T-KATA-WAVE-3-imp-test-sample-050-20261121T092733Z-c121e06b/plan.md
  started_at: "2026-11-21T09:27:40.211Z"
  completed_at: "2026-11-21T09:37:32.757Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:imp-test-sample
    - specdojo:imp-test-sample
---

# Edit Result

## 1. 実施内容

- rulebook の 6 章構成と必須列に従い、`docs/ja/specdojo/samples/imp-test-sample.md` を更新しました。
- 成功条件、評価観点ごとの尺度定義、集約規則、`Role code` による担当の明記、および未解決事項の 7 列化を行い、`F001` 〜 `F030` の指摘事項をすべて解消しました。
- 対象期間の追加、リリース予定日の明記、および「影響度」や「期限」といった用語の整合性を整えました。
- Prettier による整形と `docs:build` によるビルドの通過を確認しています。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/imp-test-sample.md`: rulebook に基づき、成功条件、評価観点ごとの尺度、集約規則、`Role code` による担当、および未解決事項の 7 列を具体的な値で埋め、指摘事項（`F001`〜`F030`）を解消した完成例へと更新しました。

## 3. 申し送り

- F001〜F030 はすべて sample 本文の修正で解消しました。主な対応は、対象期間（2026-05-07〜05-28）と予定リリース日 2026-06-01（`_ASSUMPTION_`）、成功条件3つと判定方法、評価観点ごとの高・中・低の条件と最大値の集約規則、行単位を「テストレベル／テスト観点」にしたこと、列名を rulebook に合わせたこと（影響度・期限）、担当を Role code にしたこと、`PO` の決定記録による代替・見送りと受入確認の手順、未解決事項の7列化と転記先（`risk`/`question`）、`PM` への報告と確定扱いの条件、`part_of: []` です。
- sample 内の `PJR-T5D1` / `PJR-T5R2` / `PJR-T5Q3` / `PJR-T5Q4` は例示用の架空の登録項目 ID で、インラインコードで書いています。
- 兄弟 sample（imp-business / imp-interface / imp-operations / imp-data）には、`part_of: [prj-0001]` と個人名入りの担当欄がまだ残っています。同じ指摘を受ける可能性があるため、別タスクで直す必要があります（今回は範囲外のため未編集）。
- rulebook の変更案はない。今回の sample は現行の imp-test-rulebook と矛盾しない。
- F001〜F030 はすべて sample 本文の修正で解消した。主な対応は、対象期間（2026-05-07〜05-28）と予定リリース日 2026-06-01（`_ASSUMPTION_`）、成功条件3つと判定方法、評価観点ごとの高・中・低の条件と最大値の集約規則、行単位を「テストレベル／テスト観点」にしたこと、列名を rulebook に合わせたこと（影響度・期限）、担当を Role code にしたこと、`PO` の決定記録による代替・見送りと受入確認の手順、未解決事項の7列化と転記先（`risk`/`question`）、`PM` への報告と確定扱いの条件、`part_of: []`。
- sample 内の `PJR-T5D1` / `PJR-T5R2` / `PJR-T5Q3` / `PJR-T5Q4` は例示用の架空の登録項目 ID で、インラインコードで書いている。
- 兄弟 sample（imp-business / imp-interface / imp-operations / imp-data）には、`part_of: [prj-0001]` と個人名入りの担当欄がまだ残っている。同じ指摘を受ける可能性があるため、別タスクで直す必要がある（今回は範囲外のため未編集）。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples 配下の sample だけで、plan / result / 個票を変更していない）

## 4. 進め方と実践の型の適用

rulebook の構成に従い、`docs/ja/specdojo/samples/imp-test-sample.md` を「駄菓子屋のプロジェクト」の完成例として厚くしました。具体的には、`F001` 〜 `F030` の `finding` で指摘された、対象期間の欠落、成功条件の定性的な記述、評価尺度の不足、担当者名の個人名使用、および未解決事項の列不足といった問題すべてを、具体的な値を用いて解決しています。また、`part_of: []` とすることで、特定のプロジェクトに依存しない共通サンプルとしての責務を明確にしました。
