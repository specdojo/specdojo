---
specdojo:
  id: prj-0001:xer-t-kata-wave-4-nfr-reliability-sample-040-20261123t053111z-e9167705
  type: exec-result
  task_id: T-KATA-WAVE-4-nfr-reliability-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-4-nfr-reliability-sample-040/T-KATA-WAVE-4-nfr-reliability-sample-040-20261123T053111Z-e9167705/plan.md
  started_at: "2026-11-23T05:31:19.251Z"
  completed_at: "2026-11-23T05:43:33.702Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - specdojo:nfr-reliability-sample
    - specdojo:nfr-reliability-rulebook
---

# Edit Result

## 1. 実施内容

- nfr-reliability-rulebook を簡潔に書き直しました。
- rulebook 内の完成例（sample 章）を削除し、完成例は `docs/ja/specdojo/samples/nfr-reliability-sample.md` に委ねる構成に変更しました。
- grade の指摘（`F001`, `F004`, `F005`, `F007`, `F008`, `F012`, `F014`, `F017`, `F019`, `F022` 等）に基づき、可用性との境界、配置先ディレクトリとファイル名の明記、関連ドキュメントの導線、指標における分母の定義、未達時の記録先と見直し契機を記述ガイドおよび禁止事項へ反映しました。
- frontmatter の `recipe` および `template` について、要否判断の論点を `undecided` として明記しました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/nfr-reliability-rulebook.md`: rulebook 内の完成例の章を削除し、記述ガイドに「可用性との境界」「配置先とファイル名」「指標の定義（分母）」「未達時の記録先と見直し契機」を追加しました。また、禁止事項に「実装設定値の記述」や「可用性 rulebook との関係」に関する規定を加え、`recipe` と `template` の判断の論点を整理しました。

## 3. 申し送り

- F013（文書 ID を `&lt;project-id&gt;:nfr-reliability` で修飾する）は採用しませんでした。PJR-E4MW でプロダクト文書の `id` を名前空間なしに統一した決定に合わせ、rulebook には「名前空間を付けない」と明記しました。
- F018 (`major`)、F003、F009、F015、F016、F020、F023 は `sample` 側の修正事項です。この段では `sample` を変更しないため、後続のタスクで `sample` の構成を標準テンプレの 5 章に揃え、判定者を人の `Role code`（例: `QE`・`OPS`）に置き換え、障害率に分母と算出式を書き、少なくとも 1 件はテストでの判定（`sac-*` / `stc-*` との対応）を例示し、「3回まで再試行」を品質基準の表現に直し、用語を「自動回復」に揃える必要があります。
- F021 に関して、`ready` にする前に `sample` の構成準拠と `recipe`・`template` の要否判断を行う必要があります。追跡する個票は起票されていないため、必要に応じてオーケストレーターが登録簿に起票してください。
- サンプル章の削除は `rulebook-authoring-standard` の「個別の改訂で先行して削除しない」という経過措置と抵触しますが、plan の「rulebook に完成例の章を置かず、完成例は sample に任せる」という指示を優先しました。
- F013（文書 ID を `&lt;project-id&gt;:nfr-reliability` で修飾する）は採用しなかった。PJR-E4MW でプロダクト文書の id を名前空間なしに統一した決定に合わせ、rulebook には「名前空間を付けない」と明記した。
- F018（major）・F003・F009・F015・F016・F020・F023 は sample 側の修正である。この段では sample を変更しないため、後の段で sample を本文構成（標準テンプレ）の 5 章に揃え、判定者を人の Role code（例: QE・OPS）に、障害率に分母と算出式を書き、少なくとも 1 件はテストでの判定（`sac-*`／`stc-*`）を例示し、「3回まで再試行」を品質基準の表現に直し、用語を「自動回復」に揃える必要がある。
- F021: ready にする前に、sample の構成準拠と `recipe`・`template` の要否判断を行う。追跡する個票は起票していないため、必要ならオーケストレーターが登録簿に起票する。
- サンプル章の削除は rulebook-authoring-standard の「個別の改訂で先行して削除しない」という経過措置の記述と緊張関係にあるが、plan の「rulebook に完成例の章を置かず、完成例は sample に任せる」という指示を優先した。

## 4. 進め方と実践の型の適用

rulebook-maintenance
