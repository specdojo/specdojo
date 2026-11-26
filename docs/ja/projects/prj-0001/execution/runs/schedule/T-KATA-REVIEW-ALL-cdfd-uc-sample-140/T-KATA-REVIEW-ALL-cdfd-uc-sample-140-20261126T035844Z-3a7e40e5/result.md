---
specdojo:
  id: prj-0001:xer-t-kata-review-all-cdfd-uc-sample-140-20261126t035844z-3a7e40e5
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-cdfd-uc-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-cdfd-uc-sample-140/T-KATA-REVIEW-ALL-cdfd-uc-sample-140-20261126T035844Z-3a7e40e5/plan.md
  started_at: "2026-11-26T03:58:54.944Z"
  completed_at: "2026-11-26T04:02:26.943Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:cdfd-uc-sample
    - specdojo:cdfd-uc-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として、`cdfd-uc-sample` の主張 11 件を schema、rulebook、全体概要 sample、D2 記法ルールと突き合わせた。11 件すべてが一致し、直すべき誤りはなかった。
- そのため sample は変更していない。確かめの表は executor の handoff に記録されている。D2 の描画確認は親 runner の `lint:d2` に任せ、`lint:d2` は passed だった。
- 全体概要との食い違い 1 件は R4 では直さず、R5 への申し送りとした。

## 2. 変更ファイル

- なし

## 3. 申し送り

- R5 への申し送りは executor の handoff に記載されている。発注単位を扱うグループが全体概要と食い違う件である。この申し送りに追加の補足はない。
- R4 の確かめの表（列: No / 主張（本文の箇所） / 正本 / 確かめ方 / 結果 / 根拠）。1: frontmatter の `type: flow` / `docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml`、`cdfd-uc-rulebook.md` / 読み取り / 一致 / type の列挙値に flow があり、rulebook の `deliverable_type: flow`。2: `status: draft`、`based_on`・`supersedes` の配列 / `common-frontmatter.schema.yaml` / 読み取り / 一致 / status の列挙値が draft・ready・deprecated で、`based_on`・`supersedes` は `idRefArray`。3: `rulebook: specdojo:cdfd-uc-rulebook` / `common-frontmatter.schema.yaml` の `rulebookRef`、rulebook の frontmatter / 読み取り / 一致 / pattern `^(?:[a-z][a-z0-9-]*:)?[a-z0-9][a-z0-9-]*-rulebook$` に合い、rulebook が `sample: specdojo:cdfd-uc-sample` を宣言している。4: ケース `C-02`「欠品から補充まで」、通過順 在庫 → 仕入 → 販売、product ID `cdfd-uc-replenishment` / `docs/ja/specdojo/samples/cdfd-overview-sample.md` の「ユースケース別 CDFD」 / 読み取り / 一致 / 表の `C-02` の行。5: 領域 ID の範囲（`P-05`〜`P-06`、`P-01`〜`P-02`、`P-03`〜`P-04`）と参照先 `cdfd-inventory`・`cdfd-purchasing`・`cdfd-sales` / 全体概要の「プロセスグループ別 CDFD」 / 読み取り / 一致 / 表の在庫・仕入・販売の行。6: 開始イベント「在庫が補充基準を下回った」 / 全体概要の「在庫（P-05〜P-06）」の表 / 読み取り / 一致 / `P-06` の起点イベントと同じ文言。7: データストア名と区分（商品台帳はマスタ・構成データ、在庫記録・仕入記録はトランザクションデータ、売場棚は物理保管として併記） / 全体概要の「データストア」 / 読み取り / 一致 / 同じ名称・区分で、売場棚を例外として併記する説明もある。8: D2 の class 定義（process・event・`store_master`・`store_transaction`・`physical_store`・`material_flow` の形状と色） / 全体概要の「凡例（本プロダクト共通）」、`cdfd-d2-rulebook.md` / 読み取り / 一致 / 凡例の D2 の class の値と同じ。9: `direction: down`、戻りの線を `a &lt;- b` で書くこと / `cdfd-d2-rulebook.md` の「エッジ」、`cdfd-uc-rulebook.md` の「概念データフロー」 / 読み取り / 一致 / 例外時の戻りの図は上にあるノードを左辺にしている。10: 参照先の見出し「凡例（本プロダクト共通）」 / 全体概要 / 読み取り / 一致 / 同じ見出しがある。11: `stsd-product` をインラインコードで仮置き / `cdfd-uc-rulebook.md` の参照先列の規定、`cdfd-sample.md` / 読み取り・grep / 一致 / 未作成の文書はインラインコードで仮置きする規定で、`cdfd-sample.md` も同じ ID を使っている。D2 の描画は親 runner の lint:d2 に任せた。
- R5 への申し送り（要判断・R4 では未修正）: 発注単位をどのグループが扱うかが全体概要と食い違う。sample では在庫が「発注単位に合う数量を確定」し（3.1 の役割表）、図の線が `item_master -&gt; inventory: "補充基準・発注単位"`、データストアの表の商品台帳の行は関連が在庫だけである。全体概要では `P-01`（仕入）が「補充対象と数量を発注単位に合わせて確定し、仕入先へ発注する」とし、線は `product_master -&gt; purchasing: "仕入先・発注単位"` と `product_master -&gt; inventory: "補充基準"` である。直す案: 在庫が受け取る線を「補充基準」だけにし、`item_master -&gt; purchasing: "発注単位"` を足す。3.1・3.2 の役割と、商品台帳の行（関連を「在庫、仕入」、利用を「在庫が補充基準を、仕入が発注単位を参照する」）も合わせて直す。
- 適用外の検証: `npx prettier --check docs/ja/specdojo/samples/cdfd-uc-sample.md`（executor は sample を含むどのファイルも変更していないため、Prettier の適用条件（変更した `*.md` など）を満たさない）
- 適用外の検証: `npm run validate:history-links`（plan・result・個票などの履歴ファイルを変更していない）

## 4. 進め方と実践の型の適用

sample-maintenance の R4（正しさ）として、sample の事実の主張を schema、rulebook、全体概要 sample と突き合わせた。誤りは見つからず、sample は据え置きとした。grade と condense 由来の finding はなかった。
