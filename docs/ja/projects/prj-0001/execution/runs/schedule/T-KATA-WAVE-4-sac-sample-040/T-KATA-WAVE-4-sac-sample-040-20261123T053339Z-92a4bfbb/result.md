---
specdojo:
  id: prj-0001:xer-t-kata-wave-4-sac-sample-040-20261123t053339z-92a4bfbb
  type: exec-result
  task_id: T-KATA-WAVE-4-sac-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-4-sac-sample-040/T-KATA-WAVE-4-sac-sample-040-20261123T053339Z-92a4bfbb/plan.md
  started_at: "2026-11-23T05:33:46.068Z"
  completed_at: "2026-11-23T05:52:07.476Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - specdojo:sac-sample
    - specdojo:sac-rulebook
---

# Edit Result

## 1. 実施内容

- sac-rulebook を簡潔に整理しました。
- 完成例（サンプル）の章を削除し、`docs/ja/specdojo/samples/sac-sample.md` 側へ一本化することを推奨する形にしました。
- 受入条件の見出しを連番形式に変更し、Markdown 規約との整合性を確保しました。
- Frontmatter の `based_on` を必須項目から推奨項目へ整理し、`recipe` と `template` の区別を明確にしました。
- 位置づけの章に、下位のテスト設計や NFR/BAC との境界、および参照先の情報を追加しました。
- 記述ガイドとして、区分ごとの観点表を拡充しました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/sac-rulebook.md`: rulebook の簡潔化を行いました。具体的には、完成例の章を削除、受入条件の見出しを連番化、Frontmatter の 項目分類の修正、および位置づけの章への参照情報の拡充、記述ガイドへの観点表の追加を行いました。

## 3. 申し送り

- F010: `sac-sample` はサンプルの解説書で、SAC の実例になっていない。後続の `sample` の段で、受入対象（例: 性能）を決め、本文要件の章立て（概要、受入条件と連番見出し、メモ / 将来課題）と名前空間なしの `id` `sac-&lt;term&gt;` で作り直す。`sample` にある必須観点の「責任者」は `PJR-76N9` に従い入れない。
- F011・F015: Frontmatter の `recipe` と `template` は `undecided` のまま。作るか `not-needed` にするかを決め、`ready` にする前に Fronttext を直す必要がある。決めるのは orchestrator か利用者。
- F001・F003: `PJR-76N9` に従い、受入判定者や文書の作成・確認者の Role code を本文に求めないよう直した。判定方法には合否の境界と観測先を書く。BAC の rulebook は判定方法で確認者を求めているので、SAC との違いを型の横並びで確認したほうがよい。
- F005・F012: plan の指示に従い、rulebook から完成例（サンプル）の章を削った。`rulebook-authoring-standard` は既存の完成例の章を経過措置として残し、個別の改訂で先に削らないとしており、今回の変更はこれと食い違う。どちらを正とするか確認が要る。
- F009: SAC は `docs/ja/product/070-system-acceptance-criteria` に置くプロダクト文書のため、`PJR-PHY7` と `id-and-file-naming-standard` に従い、文書 ID は名前空間なしの `sac-&lt;term&gt;` のまま残した（指摘の project 修飾の形は採らない）。
- F007: `based_on` がつながるかの確認に `npm run lint:fm` を挙げたが、`lint:fm` がこれを実際に検査しているかは確かめていない。
- F010: sac-sample はサンプルの解説書で、SAC の実例になっていない。後続の sample の段で、受入対象（例: 性能）を決め、本文要件の章立て（概要、受入条件と連番見出し、メモ / 将来課題）と名前空間なしの id `sac-&lt;term&gt;` で作り直す。sample にある必須観点の「責任者」は PJR-76N9 に従い入れない。
- F011・F015: Frontmatter の `recipe` と `template` は `undecided` のまま。作るか `not-needed` にするかを決め、ready にする前に Frontmatter を直す必要がある。決めるのは orchestrator か利用者。
- F001・F003: PJR-76N9 に従い、受入判定者や文書の作成・確認者の Role code を本文に求めないよう直した。判定方法には合否の境界と観測先を書く。BAC の rulebook は判定方法で確認者を求めているので、SAC との違いを型の横並びで確認したほうがよい。
- F005・F012: plan の指示に従い、rulebook から完成例（サンプル）の章を削った。rulebook-authoring-standard は既存の完成例の章を経過措置として残し、個別の改訂で先に削らないとしており、今回の変更はこれと食い違う。どちらを正とするか確認が要る。
- F009: SAC は `docs/ja/product/070-system-acceptance-criteria` に置くプロダクト文書のため、PJR-PHY7 と id-and-file-naming-standard に従い、文書 ID は名前空間なしの `sac-&lt;term&gt;` のまま残した（指摘の project 修飾の形は採らない）。
- F007: `based_on` がつながるかの確認に `npm run lint:fm` を挙げたが、lint:fm がこれを実際に検査しているかは確かめていない。
- 適用外の検証: `npm run validate:history-links`（変更は rulebook だけで、plan・result・個票を変えていない）
- 適用外の検証: `npm run validate:schema:file`（変更したのは `*.md` だけ）

## 4. 進め方と実践の型の適用

対象の `sac-rulebook` を、指摘事項（finding）に基づいて修正しました。具体的には、重複していたサンプル記述の削除、見出しの連番化による規約適合、Frontmatter の整理、および位置づけの明確化を行いました。また、存在しない `recipe` や `template` の状態（`undecided`）については、申し送り事項として記録しています。
