---
specdojo:
  id: prj-0001:xer-t-kata-wave-5-dmd-index-sample-040-20261123t065115z-c9513b4e
  type: exec-result
  task_id: T-KATA-WAVE-5-dmd-index-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-5-dmd-index-sample-040/T-KATA-WAVE-5-dmd-index-sample-040-20261123T065115Z-c9513b4e/plan.md
  started_at: "2026-11-23T06:51:21.904Z"
  completed_at: "2026-11-23T07:12:23.243Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - specdojo:dmd-index-sample
    - specdojo:dmd-index-rulebook
---

# Edit Result

## 1. 実施内容

- rulebook を簡潔に整え、F001（配置先 060-migration-planning/ と `docs-structure-guide` への参照）、F002（`recipe`・`template` の `undecided` を PJR-WYTX とともに明記）、F003（「担当」列は Role code）を解消しました。
- 章立てを標準に揃え、記述ガイドを章ごとの判断の基準と良い例・悪い例に構成し直しました。
- 「位置づけ」「推奨 Frontmatter 項目」「禁止事項」は、冗長さや他の型との重複の指摘がなかったため、そのまま維持しています。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/dmd-index-rulebook.md`: rulebook の章構成を `rulebook-authoring-standard.md` に準拠した形式に整え、各章に判断の基準、良い例、悪い例を追加しました。また、`recipe` と `template` が `undecided` であることを明記し、対象一覧の「担当」列に記載すべき値（Role code）の基準を定義しました。

## 3. 申し送り

- sample (`docs/ja/specdojo/samples/dmd-index-sample.md`) の対象一覧の「担当」列が独自の略称 `Mig` のままです。このフェーズでは sample を変更しない制約があるため、後の sample 見直し工程で Role code（例: `DEV`）へ修正する必要があります。
- 「位置づけ」「推奨 Frontmatter 項目」「禁止事項」は、grade の指摘や冗長さの観点から修正の必要がないと判断し、維持しました。
- sample（docs/ja/specdojo/samples/dmd-index-sample.md）の対象一覧の「担当」列が独自の略称 `Mig` のまま。この段では sample を変えない決まりのため、後の sample の見直しで Role code（例: `DEV`）へ直す。
- 変えなかった箇所と理由: 「位置づけ」「推奨 Frontmatter 項目」「禁止事項」は grade の指摘も冗長さもほかの型との重なりもないため維持した。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/rulebooks/ 配下の rulebook のみで、pjr 個票・plan・result を変更していない）

## 4. 進め方と実践の型の適用

rulebook-maintenance
