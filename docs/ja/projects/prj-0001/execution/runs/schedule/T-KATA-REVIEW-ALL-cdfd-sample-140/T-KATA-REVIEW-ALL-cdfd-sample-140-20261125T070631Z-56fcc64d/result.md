---
specdojo:
  id: prj-0001:xer-t-kata-review-all-cdfd-sample-140-20261125t070631z-56fcc64d
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-cdfd-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-cdfd-sample-140/T-KATA-REVIEW-ALL-cdfd-sample-140-20261125T070631Z-56fcc64d/plan.md
  started_at: "2026-11-25T07:06:40.852Z"
  completed_at: "2026-11-25T07:20:55.900Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:cdfd-sample
    - specdojo:cdfd-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として `docs/ja/specdojo/samples/cdfd-sample.md` の事実を schema・rulebook・関連 sample と突き合わせた。誤りは見つからず、sample の変更はない。
- F001（`vp-arc-conciseness`）と F002（`vp-qe-omissions-consistency`）は、現在の版で解消済みと executor が確認した。`P-02-04` の入力は「受入品、確定済みの入荷数量・受入結果」で、`P-02-05` の入力は「返品対象商品、返品対象の検品結果」であり、5.2 の図の線と一致する。
- 確かめの表（主張・正本・確かめ方・結果・根拠）は、下の `approach` に Markdown の表として 1 回だけ記す。
- 確かめられなかった主張が 2 件ある。`stsd-purchase` の参照先と d2 の図が描けることで、この段では確認できなかった。

## 2. 変更ファイル

- なし

## 3. 申し送り

- `stsd-purchase` は `docs/ja` 配下のどこにも定義がなく、この sample の中にしか出てこない。`stsd-rulebook` の命名規則 `stsd-&lt;term&gt;` には合うため、まだない product 成果物 ID の仮置きとして直していない。確かめるには発注の STSD sample が必要である。
- d2 の図が描けることは、この段で未実行である。親 runner の `lint-d2` の結果（passed）を正とする。
- R4 確かめの表（reporter が result の実施内容に 1 回だけ表として書く。列は No／主張／正本／確かめ方／結果／根拠）: 1 frontmatter の type: flow・rulebook: specdojo:cdfd-rulebook ／ docs/ja/specdojo/rulebooks/cdfd-rulebook.md の『推奨 Frontmatter 項目』 ／ 読み取り ／ 一致 ／ 『type は flow、rulebook は specdojo:cdfd-rulebook』
- R4 確かめの表 2: frontmatter の `based_on`・supersedes ／ docs/specdojo/schemas/v1/common-frontmatter.schema.yaml ／ grep ／ 一致 ／ 72 行目に `based_on`、75 行目に supersedes がある
- R4 確かめの表 3: 成果物 ID cdfd-purchasing、プロセス ID P-nn-nn、例外 ID E-nn-nn ／ cdfd-rulebook の『ファイル命名・ID規則』、cdfd-overview-sample の『プロセスグループ別 CDFD』 ／ 読み取り ／ 一致 ／ 全体概要の表に『仕入 P-01〜P-02 cdfd-purchasing』がある
- R4 確かめの表 4: 委譲先 cdfd-inventory・cdfd-sales・cdfd-uc-replenishment ／ cdfd-overview-sample の詳細 CDFD 一覧 ／ 読み取り ／ 一致 ／ 在庫・販売のグループ別 CDFD と C-02 のユースケース別 CDFD の ID が同じ
- R4 確かめの表 5: P-01 の担当が店主代表、P-02 の担当が家族利用者代表（管理責任: 店主代表） ／ cdfd-overview-sample の『仕入（P-01〜P-02）』 ／ 読み取り ／ 一致 ／ 36〜37 行目
- R4 確かめの表 6: データストアの区分（商品台帳はマスタ、仕入記録・在庫記録はトランザクション、売場棚は物理保管でトランザクションの表に例外として載せる） ／ cdfd-overview-sample の『データストア』 ／ 読み取り ／ 一致 ／ 75・82・91・92・96 行目
- R4 確かめの表 7: 商品台帳から仕入先・発注単位を読む ／ cdfd-overview-sample の商品台帳の行 ／ 読み取り ／ 一致 ／ 項目に『仕入先、発注単位』がある
- R4 確かめの表 8: D2 の classes（色・形・border-radius 8/20）、`material_flow` の太線、戻りの &lt;- ／ cdfd-overview-sample の『凡例（本プロダクト共通）』、docs/ja/specdojo/rulebooks/cdfd-d2-rulebook.md ／ 読み取り ／ 一致 ／ 凡例の表の色コードと形が同じ。D2 rulebook の 39・40・129 行目
- R4 確かめの表 9: 本文の必須章と、状態遷移・主要例外・委譲の表の列 ／ cdfd-rulebook の『本文要件』と 6.6・6.7 ／ 読み取り ／ 一致 ／ 列名が rulebook と同じ。未決事項は任意の章なので、ないことは誤りではない
- R4 確かめの表 10: 6.1・6.2 の入出力表と 5.1・5.2 の図の線の名前（全プロセス） ／ 本書の d2 ブロック ／ 読み取り ／ 一致 ／ 照合済みの納品・検品結果は起点イベントを通って渡る。F001・F002 の指摘箇所は今の版で図と同じ名前になっている
- R4 確かめの表 11: 状態遷移の参照先 stsd-product ／ docs/ja/specdojo/samples/stsd-sample.md ／ 読み取り ／ 一致 ／ 商品の納品から販売・返品までを扱う
- R4 確かめの表 12: 状態遷移の参照先 stsd-purchase ／ docs/ja 配下全体 ／ grep -rln stsd-purchase ／ 確かめられない ／ この sample の中にしか出てこない。stsd-rulebook の命名規則 stsd-&lt;term&gt; には合うので、まだない product 成果物 ID の仮置きとして直していない。確かめるには発注の STSD sample が要る
- R4 確かめの表 13: d2 の図が描けること ／ npm run lint:d2 ／ 親 runner が実行する ／ 確かめられない（この段では未実行） ／ 親 runner の lint-d2 の結果を正とする
- R5 への申し送り: 仕入計画の起動条件が、cdfd-overview-sample では『在庫から補充依頼を受けた』、cdfd-sample では『在庫グループから補充依頼を受けた』で表記が少し違う。R4 の誤りではないため直していない。
- F001（vp-arc-conciseness）・F002（vp-qe-omissions-consistency）は今の版で解消済み。grade の行番号 245・246 は前の版のもので、今の版では 259・260 行目に当たる。sample は変更していない。
- 適用外の検証: `npm run validate:history-links`（plan・result・個票のどれも executor が変更していないため）
- 適用外の検証: `npm run validate:schema:file`（変更した `*.yaml` / `*.yml` ファイルがないため）

## 4. 進め方と実践の型の適用

kata-guide の「kata を agent でレビューする」の R4（正しさ）に従った。sample の事実を正本と突き合わせたが、誤りはなく、sample は変更していない。 確かめの表: | No | 主張 | 正本 | 確かめ方 | 結果 | 根拠 | | --- | --- | --- | --- | --- | --- | | 1 | frontmatter の `type: flow`、`rulebook: specdojo:cdfd-rulebook` | `docs/ja/specdojo/rulebooks/cdfd-rulebook.md` の「推奨 Frontmatter 項目」 | 読み取り | 一致 | type は flow、rulebook は `specdojo:cdfd-rulebook` | | 2 | frontmatter の `based_on`・`supersedes` | `docs/specdojo/schemas/v1/common-frontmatter.schema.yaml` | grep | 一致 | 72 行目に `based_on`、75 行目に `supersedes` がある | | 3 | 成果物 ID `cdfd-purchasing`、プロセス ID `P-nn-nn`、例外 ID `E-nn-nn` | cdfd-rulebook の「ファイル命名・ID規則」、`cdfd-overview-sample` の「プロセスグループ別 CDFD」 | 読み取り | 一致 | 全体概要の表に「仕入 P-01〜P-02 `cdfd-purchasing`」がある | | 4 | 委譲先 `cdfd-inventory`・`cdfd-sales`・`cdfd-uc-replenishment` | `cdfd-overview-sample` の詳細 CDFD 一覧 | 読み取り | 一致 | 在庫・販売のグループ別 CDFD と C-02 のユースケース別 CDFD の ID が同じ | | 5 | P-01 の担当が店主代表、P-02 の担当が家族利用者代表（管理責任: 店主代表） | `cdfd-overview-sample` の「仕入（P-01〜P-02）」 | 読み取り | 一致 | 36〜37 行目 | | 6 | データストアの区分（商品台帳はマスタ、仕入記録・在庫記録はトランザクション、売場棚は物理保管でトランザクションの表に例外として載せる） | `cdfd-overview-sample` の「データストア」 | 読み取り | 一致 | 75・82・91・92・96 行目 | | 7 | 商品台帳から仕入先・発注単位を読む | `cdfd-overview-sample` の商品台帳の行 | 読み取り | 一致 | 項目に「仕入先、発注単位」がある | | 8 | D2 の classes（色・形・border-radius 8/20）、`material_flow` の太線、戻りの `&lt;-` | `cdfd-overview-sample` の「凡例（本プロダクト共通）」、`docs/ja/specdojo/rulebooks/cdfd-d2-rulebook.md` | 読み取り | 一致 | 凡例の表の色コードと形が同じ。D2 rulebook の 39・40・129 行目 | | 9 | 本文の必須章と、状態遷移・主要例外・委譲の表の列 | cdfd-rulebook の「本文要件」と 6.6・6.7 | 読み取り | 一致 | 列名が rulebook と同じ。未決事項は任意の章なので、ないことは誤りではない | | 10 | 6.1・6.2 の入出力表と 5.1・5.2 の図の線の名前（全プロセス） | 本書の d2 ブロック | 読み取り | 一致 | 照合済みの納品・検品結果は起点イベントを通って渡る。F001・F002 の指摘箇所は現在の版で図と同じ名前になっている | | 11 | 状態遷移の参照先 `stsd-product` | `docs/ja/specdojo/samples/stsd-sample.md` | 読み取り | 一致 | 商品の納品から販売・返品までを扱う | | 12 | 状態遷移の参照先 `stsd-purchase` | `docs/ja` 配下全体 | `grep -rln stsd-purchase` | 確かめられない | この sample の中にしか出てこない。命名規則には合うため仮置きとして残した | | 13 | d2 の図が描けること | `npm run lint:d2` | 親 runner が実行する | 確かめられない（この段では未実行） | 親 runner の `lint-d2` の結果（passed）を正とする | F001・F002 の行番号 245・246 は前の版のもので、現在の版では 259・260 行目に当たる。両方とも解消済みなので、根拠不足による見送りには当たらない。 R5 への申し送りが 1 件ある。仕入計画の起動条件が、`cdfd-overview-sample` では「在庫から補充依頼を受けた」、本 sample では「在庫グループから補充依頼を受けた」で、表記が少し違う。R4 の誤りではないので直していない。
