---
specdojo:
  id: prj-0001:xer-t-kata-review-all-cdt-sample-140-20261126t124912z-496ae239
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-cdt-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-cdt-sample-140/T-KATA-REVIEW-ALL-cdt-sample-140-20261126T124912Z-496ae239/plan.md
  started_at: "2026-11-26T12:49:22.754Z"
  completed_at: "2026-11-26T12:57:07.023Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:cdt-sample
    - specdojo:cdt-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として、`cdt-sample` に書かれた事実の主張 13 件を、schema・関連 sample・rulebook と突き合わせた。
- 不一致は 1 件で、「4. 関連仕様との関係」の `gl-sample` への wikilink の表示名が、参照先の title と食い違っていた。表示名を参照先の title に合わせて直した。残る 12 件は一致した。
- F001（`vp-ops-operability`）は kata の段のレビューでは使わない観点で R4 の対象外とした。現行本文には、適用日までに棚札を新しい取扱区分の表示名へ貼り替える担当がすでに書かれており、指摘は解消済みと判断した。
- runner の検証では `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が成功した。変更種別に該当しない検査は `not_applicable` だった。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R4-1 | R4 | 4. 関連仕様との関係 / `gl-sample` への wikilink の表示名 | 表示名「用語集 在庫・調達」が、参照先の title「用語集（駄菓子屋きぬやの販売・在庫・つけ管理）」と食い違っていた。 | 表示名を参照先の title に合わせた。 | `vp-qe-verifiability`。正本は docs/ja/specdojo/samples/gl-sample.yaml 5 行目の `title`。 | - |
| R4-2 | R4 | 2.3. 棚札タグ | rulebook の「分類定義」は、動的分類の正本参照に業務データ辞書のエンティティを参照する例を挙げている。本 sample は紙の商品台帳を管理元とし、業務データ辞書に未定義であることを明記している。事実の誤りではなく rulebook への準拠の問題のため、R4 では直さない。 | - | `vp-qe-kata-conformance`（R5 で扱う）。docs/ja/specdojo/rulebooks/cdt-rulebook.md の「分類定義」の参照方式の表。 | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/cdt-sample.md`: 「4. 関連仕様との関係」の `gl-sample` への wikilink の表示名を、参照先の title「用語集（駄菓子屋きぬやの販売・在庫・つけ管理）」に合わせた。あわせて prettier により表の列幅を整形した（6 行追加、6 行削除）。

## 3. 申し送り

- R4-2 は要判断として残る。rulebook の「分類定義」は動的分類の正本参照に業務データ辞書のエンティティを挙げている。一方、本 sample は紙の商品台帳を管理元とし、業務データ辞書に未定義であることを明記している。事実の誤りではないため R4 では直していない。R5（`vp-qe-kata-conformance`）で、現行の書き方を維持する案と、業務データ辞書に管理元のエンティティを足す案から選ぶ。
- R4-1: R4 / 4. 関連仕様との関係 / gl-sample への wikilink の表示名「用語集 在庫・調達」が、参照先の title「用語集（駄菓子屋きぬやの販売・在庫・つけ管理）」と食い違う / 表示名を参照先の title に合わせた / `vp-qe-verifiability`（正本 docs/ja/specdojo/samples/gl-sample.yaml 5 行目の `title`） / -
- R4-2: R4 / 2.3. 棚札タグ / rulebook の「分類定義」は動的分類の正本参照に業務データ辞書のエンティティを参照する例を挙げているが、本 sample は紙の商品台帳を管理元とし、業務データ辞書に未定義であることを明記している。事実の誤りではなく rulebook への準拠の問題のため、R4 では直さない / - / `vp-qe-kata-conformance`（R5 で扱う）。docs/ja/specdojo/rulebooks/cdt-rulebook.md の「分類定義」の参照方式の表 / 要判断（「良い例」は推奨であり、BDD が未定義の段階で紙台帳を管理元とする現行の書き方を維持する案と、BDD に管理元のエンティティを足す案がある）
- F001（`vp-ops-operability`、75 行目）: kata の段のレビューでは使わない観点（kata-guide の「kata の観点の組」）であり、R4 の対象外。現行の本文 87 行目には、適用日までに棚札を新しい取扱区分の表示名へ貼り替える担当がすでに書かれており、指摘は解消済みと判断した
- 確かめの表（No / 主張 / 正本 / 確かめ方 / 結果 / 根拠）: (1) 対象エンティティ `product` / bdd-sample.yaml / grep / 一致 / 11 行目 `physical_name: product`。(2) 発注点 `reorder_point` を参照 / bdd-sample.yaml / grep / 一致 / 43 行目。(3) 分類属性（`product_type`・`handling_type`・`shelf_tags`）は辞書に未定義 / bdd-sample.yaml / grep / 一致 / 該当なし。(4) bdd-sample の表示名「業務データ辞書（駄菓子屋の販売管理）」 / bdd-sample.yaml / 読み取り / 一致 / 4 行目の `title`。(5) gl-sample の表示名 / gl-sample.yaml / 読み取り / 不一致→修正 / 5 行目の `title`。(6) 用語集に「定番商品」「発注点」がある / gl-sample.yaml / grep / 一致 / 13・24 行目。(7) 発注点は定番商品だけに設定する（`staple` の成立条件） / gl-sample.yaml / 読み取り / 一致 / 18 行目の notes。(8) 在庫不足判定は定番商品と発注点で判定する / br-sample.md / grep / 一致 / 11・18 行目。(9) 発注点の未設定をゼロと読み替えない / br-sample.md / grep / 一致 / 29 行目「0 も有効な値で、未設定の代用にしない」。(10) uis-sample は販売登録画面の画面仕様 / uis-sample.md / 読み取り / 一致 / 11 行目の H1。(11) 種別の値（業務分類・動的分類） / cdt-rulebook.md / 読み取り / 一致 / 「分類定義の要件」の表。(12) 分類定義の 5 項目と、スタンドアロン定義の値・分類名・表示名・説明の列 / cdt-rulebook.md / 読み取り / 一致 / 「分類定義の要件」「スタンドアロン定義」。(13) frontmatter の `rulebook: specdojo:cdt-rulebook`、`supersedes: specdojo:cld-sample` / cdt-rulebook.md の `sample`、docs/ja/specdojo/samples/cld-sample.md / ls・grep / 一致 / rulebook 8 行目 `sample: specdojo:cdt-sample`、cld-sample.md は実在する

## 4. 進め方と実践の型の適用

根拠とした規範は `cdt-rulebook` の「分類定義の要件」「スタンドアロン定義」、関連する `bdd-sample`、`gl-sample`、`br-sample`、`uis-sample` である。sample の事実の主張ごとに正本と突き合わせ、一致したものは維持し、不一致の 1 件（`gl-sample` の表示名）だけを直した。rulebook と sample の矛盾は事実の誤りではないため、R4 では直さず R5 へ申し送った。F001 は R4 の観点外で、本文にすでに担当が書かれているため解消済みと判断した。
