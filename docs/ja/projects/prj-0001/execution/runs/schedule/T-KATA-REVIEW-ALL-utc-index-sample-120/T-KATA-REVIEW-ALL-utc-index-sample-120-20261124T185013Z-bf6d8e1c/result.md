---
specdojo:
  id: prj-0001:xer-t-kata-review-all-utc-index-sample-120-20261124t185013z-bf6d8e1c
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-utc-index-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-utc-index-sample-120/T-KATA-REVIEW-ALL-utc-index-sample-120-20261124T185013Z-bf6d8e1c/plan.md
  started_at: "2026-11-24T18:50:21.535Z"
  completed_at: "2026-11-24T19:02:24.473Z"
  agent: sol-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:utc-index-sample
    - specdojo:utc-index-sample
---

# Edit Result

## 1. 実施内容

- R2（構成）として `utc-index-sample` を見直した。分割基準を括り方の表の前へ移し、grade の F006・F007・F008 の内部不整合を修正した。
- 整形（prettier）と `git diff --check` は通過した。親 runner の `lint:md:changed`、`lint:fm:changed`、`validate:schema`、`test:docs` なども passed だった。
- F001・F003・F004 は R4、F002 は R3 の担当として未変更とした。F005 と F009 も今回は変更していない。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/utc-index-sample.md`: 「テスト対象の括り方と分割基準」で、分割基準の箇条書きを括り方の表の前へ移した。つけ残高の計算を P0 に含め、採用理由と優先度規則を一致させた（F006）。条件の立て方の例を「記録サービス Stub の保存失敗」にそろえた（F007）。ケース表の記入例の `証跡` に、架空のテストファイル `tests/unit/sales-checkout.test.ts` とテスト名を追加し、未同梱の例であることを明記した（F008）。

## 3. 申し送り

- R2 の指摘一覧。No: R2-1 / 段: R2 / 箇所: テスト対象の括り方と分割基準 / 指摘: 括り方の表の後に分割基準があり、判断の前提が結果より後になっていた。 / 直した案: 分割基準を表の前へ移した。 / 根拠: `vp-arc-document-structure`、kata-guide、utc-index-rulebook / 印: -。
- No: R2-2 / 段: R2 / 箇所: 観点/条件の採用基準と対象別への分配方針、ケース表の共通カラム / 指摘: F006。つけ残高の誤計算を請求・入金の誤りとしながら、優先度は P1 だった。 / 直した案: つけ残高の計算を P0 に含めた。 / 根拠: `vp-qe-omissions-consistency`、utc-index-rulebook / 印: -。
- No: R2-3 / 段: R2 / 箇所: 条件の立て方（共通）、単体テスト共通の境界/依存の扱い / 指摘: F007。保存失敗の条件例が Fake、共通方針が Stub と食い違っていた。 / 直した案: 条件例を Stub にそろえた。 / 根拠: `vp-qe-omissions-consistency`、utc-index-rulebook の Stub の使い分け / 印: -。
- No: R2-4 / 段: R2 / 箇所: ケース表の共通カラム / 指摘: F008。`証跡` の方針ではテストコードの位置も書くが、記入例にはなかった。 / 直した案: 記入例にテストファイルとテスト名を追加し、架空例であることを明記した。 / 根拠: `vp-qe-omissions-consistency`、utc-index-rulebook、Sample 記述標準 / 印: -。
- F005 は参照先の判定可能性と CI 整備前の確認方法を R4 で確認する。F009 は kata-guide で ready 化の観点として今回の段の対象外とされているため、R1 の扱いを維持した。
- No: R2-1 / 段: R2 / 箇所: 2. テスト対象の括り方と分割基準 / 指摘: 括り方の表の後に分割基準が置かれ、判断の前提が結果より後になっていた。 / 直した案: 分割基準の箇条書きを表の前へ移し、基準から括り方を読む順にした。 / 根拠: `vp-arc-document-structure`、kata-guide 第6.1節、utc-index-rulebook 第5章・第6.2節。 / 印: -
- No: R2-2 / 段: R2 / 箇所: 6. 観点/条件の採用基準と対象別への分配方針（共通）、8. ケース表の共通カラム / 指摘: F006。つけ残高の誤計算を請求・入金の誤りにつながるとしながら、誤課金を P0 とする優先度規則では P1 にしていた。 / 直した案: つけ残高の計算を P0 に含め、採用理由と優先度を一致させた。 / 根拠: `vp-qe-omissions-consistency`、保存済み grade F006、対象 sample 第6章の業務影響、utc-index-rulebook 第6.6節・第6.8節。P1 を維持するための請求前照合などの前提は追加していない。 / 印: -
- No: R2-3 / 段: R2 / 箇所: 5. 条件の立て方（共通）、7. 単体テスト共通の境界/依存の扱い / 指摘: F007。記録サービスの保存失敗を条件例では Fake、共通方針では Stub としていた。 / 直した案: 条件例を記録サービス Stub の保存失敗にそろえた。 / 根拠: `vp-qe-omissions-consistency`、保存済み grade F007、utc-index-rulebook 第6.7節の Stub の使い分け、対象 sample 第7章。 / 印: -
- No: R2-4 / 段: R2 / 箇所: 8. ケース表の共通カラム / 指摘: F008。証跡には CI 実行結果とテストコードの位置を記す方針だが、記入例にコードの位置がなかった。 / 直した案: 証跡セルに `tests/unit/sales-checkout.test.ts` とテスト名 `ut-sales-checkout-stock-allocation-020` を追加し、未同梱の架空例であることを明記した。 / 根拠: `vp-qe-omissions-consistency`、保存済み grade F008、utc-index-rulebook 第6.8節、対象 sample 第8章の証跡方針、Sample 記述標準 第6〜7章。 / 印: -
- reporter 向け判断根拠（result の「進め方と実践の型の適用」へ記載）: kata-guide 第6章、utc-index-rulebook、Sample 記述標準、共通レビュー観点、対象 sample、tsp-index-sample、保存済み grade result、R1 の result、共通規約を確認した。見出し1〜9の名称と固定順序は rulebook に一致しており維持した。rulebook の `recipe`・`template` は `undecided` で、対応ファイルも存在しないため、構成判断は rulebook を正とした。代表ケース1行は R1 の判断を引き継いで維持した。修正後、必須章・表の10カラム・章間の整合を再確認した。
- 後続段への引き継ぎ: F002 は R3、F001・F003・F004 は R4 の担当として未変更。F005 は R1 で品質ゲートの転記が削除されており、参照先の判定可能性と CI 整備前の確認方法を R4 で確認する。F009 は kata-guide 第6.3節で対象外とする ready 化の観点であり、R1 の扱いを維持した。condense 由来の記録はない。
- 変更ファイルは `docs/ja/specdojo/samples/utc-index-sample.md` のみ。result の記入は reporter に委ねる。親 runner の指定検証は重複実行していない。
- 適用外の検証: `npm run validate:schema:file`（変更したのは Markdown のみで、YAML ファイルの変更がない。）
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/specdojo/samples/ 配下のみで、docs/ja/projects/ 配下の成果物を変更していない。）
- 適用外の検証: `npm run validate:history-links`（登録簿・plan・result などの履歴ファイルを変更していない。）

## 4. 進め方と実践の型の適用

kata-guide の R2 の定めと utc-index-rulebook を正として構成を見直した。Sample 記述標準、共通レビュー観点、対象 sample、tsp-index-sample、保存済み grade result、R1 の result、共通規約も確認した。見出し1〜9の名称と順序は rulebook に一致していたため維持した。rulebook の `recipe` と `template` は `undecided` で対応ファイルがないため、構成判断は rulebook を正とした。代表ケース1行は R1 の判断を引き継いで維持した。修正後に必須章、表の10カラム、章間の整合を再確認した。condense 由来の記録はなかった。rulebook など sample 以外は変更していない。
