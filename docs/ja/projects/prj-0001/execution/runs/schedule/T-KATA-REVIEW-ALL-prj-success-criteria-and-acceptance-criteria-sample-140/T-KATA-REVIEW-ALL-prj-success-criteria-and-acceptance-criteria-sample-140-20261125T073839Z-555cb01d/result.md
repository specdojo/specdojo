---
specdojo:
  id: prj-0001:xer-t-kata-review-all-prj-success-criteria-and-acceptance-criteria-sample-140-20261125t073839z-555cb01d
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-prj-success-criteria-and-acceptance-criteria-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-prj-success-criteria-and-acceptance-criteria-sample-140/T-KATA-REVIEW-ALL-prj-success-criteria-and-acceptance-criteria-sample-140-20261125T073839Z-555cb01d/plan.md
  started_at: "2026-11-25T07:38:48.861Z"
  completed_at: "2026-11-25T07:53:11.034Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:prj-success-criteria-and-acceptance-criteria-sample
    - specdojo:prj-success-criteria-and-acceptance-criteria-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）のレビューを行い、sample の事実を正本と照合した。frontmatter の type と rulebook、`based_on` と wikilink 先の id、Role code、表の列構成、閾値と判定時期はすべて正本と一致した。
- R4 の観点の finding F001（SC-06 の「必須記録と引き継ぎ」が未定義）は、判定基準と測定方法を具体化して解消した。
- F002（例外表の列構成が template と異なる）は前の段で解消済みだった。今の列は template と同じ「論点・判定への影響・当面の扱い」で、R4 の観点でもないため、この段では扱っていない。
- 確かめの表（R4）では、確かめた主張を C1〜C7 の 7 件に分けた。主張、正本、確かめ方、結果、根拠は handoff の C1〜C7 に 1 件ずつ書いた。確かめられなかった主張はない。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/prj-success-criteria-and-acceptance-criteria-sample.md`: SC-06 の判定基準を「その日の販売・在庫・つけの記録と、未完了事項を店主代表へ渡す引き継ぎメモの記入を完了する」に、測定方法を「3種の記録の有無と引き継ぎメモの記入を店番日ごとに確認する」に具体化した。1 行の差分（1 挿入、1 削除）で、判定者によって合否がぶれる問題を解消した。

## 3. 申し送り

- R4-1 は要判断の項目。3種の記録は prj-overview-sample の店舗継続指標に基づく。引き継ぎメモは正本のない業務上の仮定で、共通サンプル文脈と食い違わない。R5 で prj-overview-sample に引き継ぎメモの説明を足してそろえるかを決める。選ばなかった案は、引き継ぎを定義せず3種の記録だけで判定する案。
- R4-1: R4 / 2. 成功基準（SC-06） / 「必須記録と引き継ぎ」の中身が定義されておらず、判定者によって合否がぶれる（F001） / 判定基準を「その日の販売・在庫・つけの記録と、未完了事項を店主代表へ渡す引き継ぎメモの記入を完了する」に、測定方法を「3種の記録の有無と引き継ぎメモの記入を店番日ごとに確認する」に直した / vp-qe-verifiability。3種の記録は specdojo:prj-overview-sample の店舗継続指標（家族が販売・在庫・つけ管理を完了）による。引き継ぎメモは正本のない業務上の仮定で、共通サンプル文脈と食い違わない / 要判断（R5 で prj-overview-sample に引き継ぎメモの説明を足してそろえるかを決める。選ばなかった案は、引き継ぎを定義せず3種の記録だけで判定する案）
- R4-2: R4 / 5. 例外条件と未解決事項 / F002（列構成が template と違う）は前の段で直っており、今の列は template と同じ「論点・判定への影響・当面の扱い」になっている / - / vp-qe-kata-conformance は R1・R5 の観点で、R4 では扱わない / -
- 確かめの表 C1: 主張=frontmatter の type: project / 正本=docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml / 確かめ方=grep / 結果=一致 / 根拠=7行目の列挙値 project
- 確かめの表 C2: 主張=frontmatter の rulebook: specdojo:prj-success-criteria-and-acceptance-criteria-rulebook / 正本=docs/ja/specdojo/rulebooks/prj-success-criteria-and-acceptance-criteria-rulebook.md / 確かめ方=id の grep / 結果=一致 / 根拠=同じ id があり、そのファイルの sample 宣言が本 sample を指す
- 確かめの表 C3: 主張`=based_on` と wikilink（prj-scope-sample、prj-overview-sample、pm-change-request-log-sample、dec-sample） / 正本=docs/ja/specdojo/samples/ / 確かめ方=id の grep / 結果=一致 / 根拠=4つとも id があるファイルが存在する
- 確かめの表 C4: 主張=Role code の PO・BA・DEV / 正本=docs/ja/specdojo/samples/pm-roles-sample.yaml / 確かめ方=grep code: / 結果=一致 / 根拠=19・25・31行目
- 確かめの表 C5: 主張=業務価値・成功基準・受入条件・例外表の列構成 / 正本=docs/ja/specdojo/templates/prj-success-criteria-and-acceptance-criteria-template.md / 確かめ方=表ヘッダの照合 / 結果=一致 / 根拠=template の24・30・36・52行目
- 確かめの表 C6: 主張=SC-02〜SC-10 の閾値と判定時期（90%、10分、50%、20%、2週間、6か月、12か月、3回以上、月0件、1分以内） / 正本=docs/ja/specdojo/samples/prj-overview-sample.md / 確かめ方=grep / 結果=一致 / 根拠=67〜91行目の指標表と84行目の判定時期
- 確かめの表 C7: 主張=確認者の店主代表・家族利用者代表・開発担当の役割 / 正本=docs/ja/specdojo/samples/prj-scope-sample.md / 確かめ方=grep / 結果=一致 / 根拠=29〜31行目と95行目
- 適用外の検証: `npm run validate:history-links`（変更したのは sample だけで、plan・result・個票を変更していないため）

## 4. 進め方と実践の型の適用

根拠とした規範は、kata-guide の R4 の段、rulebook、template、prj-overview-sample、prj-scope-sample、pm-roles-sample、deliverable-frontmatter の schema である。F001 は vp-qe-verifiability の判定根拠に照らし、SC-06 の判定基準と測定方法を具体化して解消した。表や他の SC の記述は正本と整合していたため維持した。rulebook との矛盾はなく、矛盾時に rulebook を正とした箇所はない。F002 は前の段で解消済みで、R4 の観点でもないため扱っていない。引き継ぎメモの定義は正本のない仮定のため、R5 での判断に回した。
