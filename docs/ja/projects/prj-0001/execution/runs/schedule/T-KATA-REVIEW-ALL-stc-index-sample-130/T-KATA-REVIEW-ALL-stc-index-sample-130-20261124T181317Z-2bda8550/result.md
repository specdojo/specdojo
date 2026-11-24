---
specdojo:
  id: prj-0001:xer-t-kata-review-all-stc-index-sample-130-20261124t181317z-2bda8550
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-stc-index-sample-130
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-stc-index-sample-130/T-KATA-REVIEW-ALL-stc-index-sample-130-20261124T181317Z-2bda8550/plan.md
  started_at: "2026-11-24T18:13:24.989Z"
  completed_at: "2026-11-24T18:24:56.506Z"
  agent: sol-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:stc-index-sample
    - specdojo:stc-index-sample
---

# Edit Result

## 1. 実施内容

- kata レビュー段 R3（読みやすさ）として `docs/ja/specdojo/samples/stc-index-sample.md` を修正しました。意味・数値・合格基準を維持したまま、長い文の分割、略語への名称付与、表の導入文の追加、手順の箇条書き化を行いました。
- 指摘（R3-1〜R3-11）は次の表のとおりです。 | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | R3-1 | R3 | 1. 本ドキュメントの目的と適用対象 | 適用対象・共通方針・TSP の対象範囲が長い文に重なっている | 適用対象、共通方針、対象範囲を文と段落に分けた | W3、`vp-ux-readability` | - | | R3-2 | R3 | 1〜3章、5章、7章 | 略語の初出に正式名がなく、読み手が意味を補う必要がある | TSP・BAC・テストレベル・NFR・SC・AC・CI・Role code に名称を添え、DB・I/F・UI は日本語に置き換えた | W8、`vp-ux-language-consistency`。名称は関連 rulebook、テストドキュメントスコープ定義標準、`tsp-index-sample`、`pm-roles-sample` で確認した | - | | R3-3 | R3 | 1章、3章、5章、9章 | 表の前に対応関係を示す導入文がない | 各表が示す責任境界、除外と例外、条件の差分、未決事項の扱いを1文で示した | `vp-ux-readability`、Sample 記述標準 第6章 | - | | R3-4 | R3 | 1. 本ドキュメントの目的と適用対象 | 責任境界のセルで他レベルの責務と ST の責務が一文に続いている | 他レベルへ委ねる内容と ST で確認する内容を別の文にした | W3 | - | | R3-5 | R3 | 5. 条件の立て方（共通） | 条件を追加する順序が矢印を連ねた本文に埋もれている | 代表シナリオ、重要分岐、重大例外の順序を番号付き箇条書きにした | W9 | - | | R3-6 | R3 | 5. 条件の立て方（共通） | 直積を作らない方針、在庫超過の確認条件、その理由が一文に重なっている | 直積の方針を独立させ、店番の役割で判定が変わらない理由を確認条件の前に置いた | W3、W5 | - | | R3-7 | R3 | 6.1. 採用基準（共通） | 「採用は1観点＝1合否命題」という主語と述語の対応が読みにくい | 観点と合否命題、条件と差分の対応を明示し、採用根拠の要件を別の文にした | W2 | - | | R3-8 | R3 | 6.2. 対象別への分配方針（共通） | 改訂条件、影響対象の列挙、追従作業が長い一文に続いている | 影響対象の列挙と、その対象への追従作業を別の文にした | W3、W4 | - | | R3-9 | R3 | 7.1. 境界・環境の共通方針 | 画面キャプチャの条件と保存先の説明が長い括弧内に分かれている | 「取引番号が写る静止画を ST レポートに添付」とまとめた | W5、`vp-arc-conciseness` | - | | R3-10 | R3 | 7.1. 境界・環境の共通方針 | QE の担当が実施・照合と合否判定に分かれて繰り返されている | QE の実施・証跡照合・合否判定をまとめ、環境準備と例外承認の責任は維持した | `vp-arc-conciseness` | - | | R3-11 | R3 | 8. ケース表の共通カラム | カラム順と1行の意味が一文に重なり、「条件と期待値が一意」の係りが読みにくい | カラム順の指定と、条件・期待値の組が一意に決まる1テストという行の定義を分けた | W3、W5 | - |
- executor は `npx --no-install prettier --write` と `git diff --check` を実行し、どちらも passed でした。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も passed です。`lint:ts`、`lint:md`、`lint:fm`、`test:integration`、`typecheck`、`test:unit` は変更種別により `not_applicable` でした。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/stc-index-sample.md`: 読みやすさ（R3）の観点で文章を直しました。長文の分割、略語への名称付与、表前の導入文の追加、条件を追加する順序の番号付き箇条書き化、採用基準・分配方針・環境方針・ケース表カラムの文の整理が主な内容です。差分は 49 行追加・33 行削除です。必須章、表の列、数値、例外、合格基準、期待値の例、`based_on`、`status: draft` は維持しました。

## 3. 申し送り

- 段外の grade finding の扱いは次のとおりです。F001（PJR の引継ぎ先）は kata-guide 6.3 の除外観点のため、要否を R5 に委ねます。F002（性能ケースの P0 定義）は R4、F004（対象別の観点名）は R5 に委ねます。F003 は R2 で扱い済み、F005 の概要側の重複は R1 で解消済みのため、再修正していません。grade サイドカーは変更していません。
- R3-1: R3 / 1. 本ドキュメントの目的と適用対象 / 適用対象・共通方針・TSP の対象範囲が長い文に重なっている / 適用対象、共通方針、対象範囲を文と段落に分けた / W3、`vp-ux-readability` / -
- R3-2: R3 / 1〜3章、5章、7章 / 略語の初出に正式名がなく、読み手が意味を補う必要がある / TSP・BAC・テストレベル・NFR・SC・AC・CI・Role code に名称を添え、DB・I/F・UI は日本語に置き換えた / W8、`vp-ux-language-consistency`。名称は関連 rulebook、テストドキュメントスコープ定義標準、tsp-index-sample、pm-roles-sample で確認した / -
- R3-3: R3 / 1. 本ドキュメントの目的と適用対象、3. 対象外・除外理由（共通）、5. 条件の立て方（共通）、9. メモ / 将来課題 / 表の前に対応関係を示す導入文がない / 各表が示す責任境界、除外と例外、条件の差分、未決事項の扱いを1文で示した / `vp-ux-readability`。Sample 記述標準 第6章 / -
- R3-4: R3 / 1. 本ドキュメントの目的と適用対象 / 責任境界のセルで他レベルの責務と ST の責務が一文に続いている / 他レベルへ委ねる内容と ST で確認する内容を別の文にした / W3 / -
- R3-5: R3 / 5. 条件の立て方（共通） / 条件を追加する順序が矢印を連ねた本文に埋もれている / 代表シナリオ、重要分岐、重大例外の順序を番号付き箇条書きにした / W9 / -
- R3-6: R3 / 5. 条件の立て方（共通） / 直積を作らない方針、在庫超過の確認条件、その理由が一文に重なっている / 直積の方針を独立させ、店番の役割で判定が変わらない理由を確認条件の前に置いた / W3、W5 / -
- R3-7: R3 / 6.1. 採用基準（共通） / 「採用は1観点＝1合否命題」という主語と述語の対応が読みにくい / 観点と合否命題、条件と差分の対応を明示し、採用根拠の要件を別の文にした / W2 / -
- R3-8: R3 / 6.2. 対象別への分配方針（共通） / 改訂条件、影響対象の列挙、追従作業が長い一文に続いている / 影響対象の列挙と、その対象への追従作業を別の文にした / W3、W4 / -
- R3-9: R3 / 7.1. 境界・環境の共通方針 / 画面キャプチャの条件と保存先の説明が長い括弧内に分かれている / 「取引番号が写る静止画を ST レポートに添付」とまとめた / W5、`vp-arc-conciseness` / -
- R3-10: R3 / 7.1. 境界・環境の共通方針 / QE の担当が実施・照合と合否判定に分かれて繰り返されている / QE の実施・証跡照合・合否判定をまとめ、環境準備と例外承認の責任は維持した / `vp-arc-conciseness` / -
- R3-11: R3 / 8. ケース表の共通カラム / カラム順と1行の意味が一文に重なり、「条件と期待値が一意」の係りが読みにくい / カラム順の指定と、条件・期待値の組が一意に決まる1テストという行の定義を分けた / W3、W5 / -
- 変更ファイル: `docs/ja/specdojo/samples/stc-index-sample.md` のみ。result は編集していない。reporter は各指摘を実施内容の Markdown 表へ1回だけ記載し、申し送りには重ねないこと。
- 進め方と実践の型の適用用: kata-guide 6.1〜6.5、SpecDojo の考え方 3.6、Rulebook 記述標準 第5章、Sample 記述標準、stc-index-rulebook、共通レビュー観点一覧、成果物カタログの対象項目、grade result、R1・R2 result、関連 sample と用語集を確認した。W1〜W10 に照らして見直した。rulebook の `recipe`・`template` は `not-needed`。必須章・表の列、数値、例外、合格基準、期待値の例、`based_on`、`status: draft` と前段の修正を維持した。
- 段外 finding: grade F001 は kata-guide 6.3 の除外観点であり、引継ぎ先の要否は R5 へ委ねる。F002 の性能ケースの P0 定義は R4、F004 の対象別観点名は R5 へ委ねる。F003 は R2、F005 の概要側の重複は R1 で解消済みのため再修正していない。condense 由来の記録はない。grade サイドカーは変更していない。
- 親 runner 指定の lint・テスト・schema 検査は重複実行していない。
- 適用外の検証: `npm run validate:schema:file`（変更対象は Markdown sample のみで、YAML ファイルの変更がない。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は docs/ja/specdojo/samples/ 配下のみで、docs/ja/projects/ 配下に達していない。）
- 適用外の検証: `npm run validate:history-links`（executor は履歴ファイル、plan、result を変更していない。）

## 4. 進め方と実践の型の適用

参照の向きを成果物から sample に切り替え、既存の `stc-index-sample` を見直しました。kata-guide 6.1〜6.5、SpecDojo の考え方 3.6、Rulebook 記述標準 第5章、Sample 記述標準、`stc-index-rulebook`、共通レビュー観点一覧、成果物カタログの対象項目、grade result、R1・R2 result、関連 sample と用語集を確認し、W1〜W10 に照らして直しました。rulebook の `recipe` と `template` は `not-needed` です。意味と判断に要る背景・例外・制約は変えず、前段の修正も維持しました。condense 由来の記録はありません。根拠不足で見送った finding もありません。
