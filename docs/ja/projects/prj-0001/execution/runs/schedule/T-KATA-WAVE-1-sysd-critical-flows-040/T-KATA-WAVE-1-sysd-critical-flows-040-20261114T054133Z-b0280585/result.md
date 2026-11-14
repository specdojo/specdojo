---
specdojo:
  id: prj-0001:xer-t-kata-wave-1-sysd-critical-flows-040-20261114t054133z-b0280585
  type: exec-result
  task_id: T-KATA-WAVE-1-sysd-critical-flows-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-1-sysd-critical-flows-040/T-KATA-WAVE-1-sysd-critical-flows-040-20261114T054133Z-b0280585/plan.md
  started_at: "2026-11-14T05:41:48.594Z"
  completed_at: "2026-11-14T07:06:52.873Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - sysd-critical-flows
    - specdojo:sysd-critical-flows-rulebook
---

# Edit Result

## 1. 実施内容

- `docs/ja/specdojo/rulebooks/sysd-critical-flows-rulebook.md` を更新し、記述ガイドの明確化および正本規範との整合性を確保しました。
- 最大5件というフロー数の上限を厳守させ、6件以上の追加を禁止する形に修正しました（F002, F004 解消）。
- `specdojo:` 名前空間の必須キーとして `id`, `type`, `status`, `rulebook` を明示し、未定義の `title` を禁止することで正本のスキーマに合わせました（F003 解消）。
- フロー別の相関キーおよび追跡範囲の記述を明確化し、境界や主要識別子を示す図の良否例を補強しました（F006, F008 解消）。
- テスト表記を正本の `ITC`/`ETC` および `itc-`/`etc-` 系に統一しました（F011 解消）。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/sysd-critical-flows-rulebook.md`: 最大5件の上限遵守、Frontmatter 必須項目（`specdojo:` 名前空間）の正本整合、図・相関情報の判断例補強、および ITC/ETC 表記の統一を行いました。

## 3. 申し送り

- reporter は result の実施内容・変更ファイル・進め方と実践の型の適用へ本報告を反映してください。変更ファイルは docs/ja/specdojo/rulebooks/sysd-critical-flows-rulebook.md のみです。成果物本体、sample・recipe・template、grade サイドカー、result は編集していません。
- 判断根拠は rulebook-authoring-standard, document-metadata-standard, deliverable-frontmatter.schema.yaml と common-frontmatter.schema.yaml, docs-structure-guide, 共通レビュー観点の該当判定根拠, deliverables-reference, PJR-2GD6, sysd-index, sysd-critical-flows, 宣言先 recipe・sample・template, clis-sample, rulebook・成果物・sample の grade result です。依存3件の旧 CDFD は archive/ja/product/trash/ の deprecated 文書であることを確認し、現行規範としては採用していません。
- F002／F004 は整理後も総数5件以内, 例外なし, 6件以上は禁止として解消しました。F003 は `specdojo:` 配下の必須キーを `id`・`type`・`status`・`rulebook` と明示し, 未定義の `specdojo.title` を禁止, 文書名を H1 に置くよう修正しました。成果物 grade の F016 が求める `title` 追加は schema と矛盾するため採用しませんでした。
- F001／F010 は現行の本文要件と判断基準・良否例の分担が成立しているため維持しました。F005 は見出しの骨組みを template に委譲する現行規定を維持しました。F006／F008 はフロー別の相関キー・追跡範囲を明確化し, 境界・主要識別子を示す図と trace 代替手段の良否例を補強しました。F009 の埋め込み完成例は現行では存在せず, sample の Frontmatter は名前空間と `rulebook` を備えています。F011 は正本の ITC／ETC と `itc-`／`etc-` 系を明記しました。
- F007 の現行 sample は会計照合と印字回復の2フローについて, 図, 永続化, 失敗・再開, 受入, 検証, 未決事項, 承認条件を持つ完成例でした。sample・recipe・template の整合は指定どおり後続段へ委ね, 特に trace 非採用理由の明示を確認してください。旧 grade の finding に対する正式な解消判定は再評価で確認してください。
- recipe は事故候補の選定から保存境界・失敗条件・検証への引渡しを判断する手順に必要, template は見出し順・表・記入欄の骨組みに必要と判断し, 既存の完全 ID 宣言を維持しました。完成例は sample を正本とし, rulebook にサンプル章を追加していません。4種とも sidebar-config.ts に登録済みで, 新規作成もないためメニュー変更は不要でした。PJR-2GD6 に従い, 実装・値・構文・schema の詳細を再掲せず参照へ委ねる方針を維持しました。
- 判断根拠は rulebook-authoring-standard、document-metadata-standard、deliverable-frontmatter.schema.yaml と common-frontmatter.schema.yaml、docs-structure-guide、共通レビュー観点の該当判定根拠、deliverables-reference、PJR-2GD6、sysd-index、sysd-critical-flows、宣言先 recipe・sample・template、clis-sample、rulebook・成果物・sample の grade result です。依存3件の旧 CDFD は archive/ja/product/trash/ の deprecated 文書であることを確認し、現行規範としては採用していません。
- F002／F004 は整理後も総数5件以内、例外なし、6件以上は禁止として解消しました。F003 は `specdojo:` 配下の必須キーを `id`・`type`・`status`・`rulebook` と明示し、未定義の `specdojo.title` を禁止、文書名を H1 に置くよう修正しました。成果物 grade の F016 が求める `title` 追加は schema と矛盾するため採用しませんでした。
- F001／F010 は現行の本文要件と判断基準・良否例の分担が成立しているため維持しました。F005 は見出しの骨組みを template に委譲する現行規定を維持しました。F006／F008 はフロー別の相関キー・追跡範囲を明確化し、境界・主要識別子を示す図と trace 代替手段の良否例を補強しました。F009 の埋め込み完成例は現行では存在せず、sample の Frontmatter は名前空間と `rulebook` を備えています。F011 は正本の ITC／ETC と `itc-`／`etc-` 系を明記しました。
- F007 の現行 sample は会計照合と印字回復の2フローについて、図、永続化、失敗・再開、受入、検証、未決事項、承認条件を持つ完成例でした。sample・recipe・template の整合は指定どおり後続段へ委ね、特に trace 非採用理由の明示を確認してください。旧 grade の finding に対する正式な解消判定は再評価で確認してください。
- recipe は事故候補の選定から保存境界・失敗条件・検証への引渡しを判断する手順に必要、template は見出し順・表・記入欄の骨組みに必要と判断し、既存の完全 ID 宣言を維持しました。完成例は sample を正本とし、rulebook にサンプル章を追加していません。4種とも sidebar-config.ts に登録済みで、新規作成もないためメニュー変更は不要でした。PJR-2GD6 に従い、実装・値・構文・schema の詳細を再掲せず参照へ委ねる方針を維持しました。
- 適用外の検証: `npm run validate:schema:file`（変更は Markdown のみで、YAML ファイルの変更がありません。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は docs/ja/specdojo/rulebooks/ のみで、docs/ja/projects/ 配下への変更がありません。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票、既存 plan、result などの履歴ファイルを変更していません。）

## 4. 進め方と実践の型の適用

rulebook-maintenance
