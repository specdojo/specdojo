---
specdojo:
  id: prj-0001:xer-t-kata-wave-5-imp-data-sample-050-20261123t133745z-aa607fee
  type: exec-result
  task_id: T-KATA-WAVE-5-imp-data-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-5-imp-data-sample-050/T-KATA-WAVE-5-imp-data-sample-050-20261123T133745Z-aa607fee/plan.md
  started_at: "2026-11-23T13:37:55.369Z"
  completed_at: "2026-11-23T13:59:04.692Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:imp-data-sample
    - specdojo:imp-data-sample
---

# Edit Result

## 1. 実施内容

- 既存の `docs/ja/specdojo/samples/imp-data-sample.md` を、rulebook の要求事項および `sample-authoring-standard.md` に基づいて刷新しました。
- 「狙い」への成功条件の追記、評価観点の定義（整合性・可用性・移行難易度・利用者影響）と境界値の追加を行いました。
- 「対応方針」の表に、受入確認（手順と期待結果）の列を追加し、各項目に判断根拠（構造・整合性、検証・テスト、実装影響）を具体化しました。
- 「未解決事項」の表に、判断や対応への影響、決定条件、および転記先を整理し、関係者の表記を Role code に統一しました。
- Prettier による整形を実行しました。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/imp-data-sample.md`: rulebook の 6 章で定められた必須項目（成功条件、評価観点の境界値、4 観点に基づく判断根拠、受入確認の手順と合格条件、波及先成果物 ID、未解決事項の判断条件）をすべて網羅するように構成を刷新しました。また、担当者の表記を人物名から Role code に統一し、未解決事項の管理方法を整備しました。

## 3. 申し送り

- rulebook の推奨 Frontmatter 項目の変更案: `based_on` に変更要求の個票 ID（`PJR-XXXX`）を求めているが、`common-frontmatter.schema.yaml` の `idRef` パターン（`^[a-z0-9][a-z0-9-:]*$`）は英大文字を許さず、`PJR-XXXX` を書くと schema 違反になる。sample では `specdojo:imp-business-sample` と既存の `cr-2026-004` を記載した。rulebook の記述と schema のどちらに合わせるかの決定が必要（F019 の一部）。
- F003（承認責任者の明記）と F026（確定の承認者）は PJR-76N9 の決まりにより本文へ承認する役割を書かなかった。代わりに、未解決事項に確定の条件（不足情報がそろい、影響度と期限を見直した時点）と転記先の登録項目を記載した。承認は登録簿の個票で追う。
- 利用者が決める値: 閉店後の移行作業に使える時間（許容停止時間の上限）は `_UNDECIDED_` のまま残した（店主代表が決める。未解決事項 `PJR-D4Q3`）。切替日 2026-06-01 は imp-test-sample と同じ `_ASSUMPTION_`。
- 関連 sample の整合の申し送り: imp-business-sample と imp-test-sample は、承認の記述（imp-test の「`PO` の承認を受ける」）や人物名・旧列名（imp-business）が残っており、本 sample の書き方と食い違う。それぞれの sample のタスクで見直す候補。
- rulebook の推奨 Frontmatter 項目の変更案: `based_on` に変更要求の個票 ID（`PJR-XXXX`）を求めているが、common-frontmatter.schema.yaml の `idRef` パターン（`^[a-z0-9][a-z0-9-:]*$`）は英大文字を許さず、`PJR-XXXX` を書くと schema 違反になる。sample では `specdojo:imp-business-sample` と既存の `cr-2026-004` を記載した。rulebook の記述と schema のどちらに合わせるかの決定が必要（F019 の一部）。
- 適用外の検証: `npm run validate:history-links`（変更ファイルは docs/ja/specdojo/samples/imp-data-sample.md だけで、plan・result・個票などの履歴蓄積ファイルを含まない）
- 適用外の検証: `npm run validate:schema:file`（変更した `*.yaml` / `*.yml` ファイルがない）

## 4. 進め方と実践の型の適用

判明した `finding` に基づき、`docs/ja/specdojo/samples/imp-data-sample.md` を `docs/ja/specdojo/standards/sample-authoring-standard.md` に準拠した形式に更新しました。具体的には、成功条件、評価観点の境界値、判断根拠（構造・検証・影響）、受入確認の合格条件、波及先成果物 ID を各行へ追加し、table 構造を rulebook に沿って再定義しました。また、担当者の表記を Role code へ置換し、未解決事項の定義を明確化しています。
