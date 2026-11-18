---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-sysd-index-060-20261118t222651z-99e5f419
  type: exec-result
  task_id: T-KATA-SLIM-2-sysd-index-060
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-sysd-index-060/T-KATA-SLIM-2-sysd-index-060-20261118T222651Z-99e5f419/plan.md
  started_at: "2026-11-18T22:27:05.357Z"
  completed_at: "2026-11-18T22:53:38.377Z"
  agent: opus-executor
  execution: agent
  approach: recipe-maintenance
  targets:
    - sysd-index
    - specdojo:sysd-index-recipe
---

# Edit Result

## 1. 実施内容

- `docs/ja/specdojo/recipes/sysd-index-recipe.md` から、共通の文書運用記述、未決事項台帳の列定義、rulebook と重複する判断基準の言い直し、および冗長な確認事項を削除し、記述をスリム化した。

## 2. 変更ファイル

- `docs/ja/specdojo/recipes/sysd-index-recipe.md`: 文書の運用（役割分担・承認フロー等）、台帳の列定義、rulebook の重複記述、および仕上げチェックと深掘り手順で重複していた確認項目を削除。一方で、「このレシピの使い方」の集約、情報取り出し元の明記、章作成順の理由追加、各節の問いとコツへの再構成、深掘り手順の整理を行い、Recipe 記述標準に準拠した形式に更新した。

## 3. 申し送り

- 大きさ（空白・改行を除き、表の区切り行も除く）: 前 3,239 字、後 2,265 字、比 69.9%。区切り行を含むと 3,554 字から 2,548 字、バイトは 10,039 B から 6,899 B。
- 外した記述: DEV・QE・PO の分担、兼務時の確認と承認の分け方、公開前に PO が留保の可否を判断する例、良い例 / 悪い例の改訂・廃止行、レビュー観点の運用・承認行（いずれも共通の運用）。台帳の列（担当・判断時機・解消後の更新先）と「責任と留保」の入力行。正本候補に並べた 7 つの設計領域の列挙、非該当には理由と代替正本が要るという規則、4.2 の RDBMS の例（rulebook の言い直し）。4.4 の分離テストの例は良い例 / 悪い例の表にまとめた。仕上げチェックの変更経路の確認は深掘り手順の最初の項目と同じ確認のため外した。
- 残した・足した記述: 「このレシピの使い方」を Why・What・How・Trace の 1 項目にした。「作成前に集める情報」に取り出し元の列を足した。全体の作成手順に章の順番の理由を入れた。各節を問い 2 つとコツ（聞き方、つまずきやすい点、背景は写さず上位文書への参照に置き換える）にした。深掘り手順を対応のない主張を探す 3 つの順序に書き換えた。Recipe 記述標準の 8 章の構成は保ち、本文に rulebook・sample への参照は書いていない。
- rulebook・sample・template への変更案: なし。rulebook の「全体方針」に共通の運用の記述がすでにあるため、外した運用の記述はそちらで扱われる。
- 適用外の検証: `npm run validate:history-links`（executor が変えたのは recipe だけで、plan・result・個票は変えていない）

## 4. 進め方と実践の型の適用

Recipe 記述標準および `docs/ja/specdojo/guides/ryu-guide.md` に基づき、rulebook と重複する判断基準や共通の運用記述を排除し、書き手が迷わないための「問い」と「コツ」に重点を置いた構成へのスリム化を実施した。
