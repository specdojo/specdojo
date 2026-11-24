---
specdojo:
  id: prj-0001:xer-t-kata-review-all-mip-index-sample-120-20261124t141648z-521d7844
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-mip-index-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-mip-index-sample-120/T-KATA-REVIEW-ALL-mip-index-sample-120-20261124T141648Z-521d7844/plan.md
  started_at: "2026-11-24T14:16:57.719Z"
  completed_at: "2026-11-24T14:28:23.048Z"
  agent: sol-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:mip-index-sample
    - specdojo:mip-index-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R2（構成）を `docs/ja/specdojo/samples/mip-index-sample.md` に対して実施した。R1 の修正は維持し、章の粒度と表・本文の配置を見直した。指摘は 2 件で、どちらも sample 内の章の分割で解消した。 | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | - | - | - | - | - | - | - | | R2-1 | R2 | 5. 成功条件・受入基準 | 項目別の受入基準と GO/NO-GO の最低条件が、同じ章内で見出しによって区別されていない | 5.1「項目ごとの受入基準」と 5.2「GO/NO-GO の最低条件」に分け、表から判断条件へ読む順序を明示した | `vp-arc-document-structure`。[[specdojo:mip-index-rulebook\|移行計画 作成ルール]] 第 5 章は受入基準の表と GO の最低条件を求める。[[specdojo:kata-guide\|実践の型活用ガイド]] 6.1 の R2 は章の粒度と表・本文の配置を確認対象とする | - | | R2-2 | R2 | 8. カットオーバー概要 | 判定点の表とロールバック方針の区切りが本文ラベルに留まり、当日の詳細手順への参照もロールバック方針の箇条書きに混在している | 8.1「タイムラインと判定点」と 8.2「ロールバック方針」に分け、`cop-index` への参照を 8.1 の表の前へ移した | `vp-arc-document-structure`、`vp-qe-omissions-consistency`。[[specdojo:mip-index-rulebook\|移行計画 作成ルール]] 第 5 章・6.3 は判定点の表とロールバック方針を求め、詳細手順は COP に委ねる | - | 要判断の印を付ける指摘はない。rulebook など sample 以外は変更していない。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/mip-index-sample.md`: 5 章を 5.1「項目ごとの受入基準」と 5.2「GO/NO-GO の最低条件」に、8 章を 8.1「タイムラインと判定点」と 8.2「ロールバック方針」に分けた。`cop-index` への参照は 8.1 の表の前へ移した。必須 9 章の順序、必須表の列・内容、R1 の修正は維持した。差分は 8 行追加、3 行削除。

## 3. 申し送り

- plan に展開された finding と既存 grade の指摘はなく、根拠不足による見送りや未解決事項はない。
- rulebook の `recipe` と `template` は `undecided` のため、宣言された参照先はなく、rulebook の本文構成を正として照合した。
- R2-1: R2 / 5. 成功条件・受入基準 / 項目別の受入基準と GO/NO-GO の最低条件が、同じ章内で見出しによって区別されていない / 5.1「項目ごとの受入基準」と 5.2「GO/NO-GO の最低条件」に分け、表から判断条件へ読む順序を明示した / `vp-arc-document-structure`。[[specdojo:mip-index-rulebook|移行計画 作成ルール]] 第 5 章は受入基準の表と GO の最低条件を求める。[[specdojo:kata-guide|実践の型活用ガイド]] 6.1 の R2 は章の粒度と表・本文の配置を確認対象とする / -
- R2-2: R2 / 8. カットオーバー概要 / 判定点の表とロールバック方針の区切りが本文ラベルに留まり、当日の詳細手順への参照もロールバック方針の箇条書きに混在している / 8.1「タイムラインと判定点」と 8.2「ロールバック方針」に分け、`cop-index` への参照を 8.1 の表の前へ移した / `vp-arc-document-structure`、`vp-qe-omissions-consistency`。[[specdojo:mip-index-rulebook|移行計画 作成ルール]] 第 5 章・6.3 は判定点の表とロールバック方針を求め、詳細手順は COP に委ねる / -
- reporter 向け（実施内容・変更ファイル）: 変更は docs/ja/specdojo/samples/mip-index-sample.md のみ。上記 2 件を実施内容に Markdown 表として 1 回だけ記載し、申し送りに表を重ねない。result、rulebook、grade サイドカー、保護された設定は編集していない。
- reporter 向け（進め方と実践の型の適用）: 共通規約 2 文書、[[specdojo:kata-guide|実践の型活用ガイド]] 第 6 章、[[specdojo:sample-authoring-standard|Sample 記述標準]]、[[specdojo:mip-index-rulebook|移行計画 作成ルール]]、共通レビュー観点の R2 対象と `vp-arc-conciseness`、先行 R1（110）の result、先行 090 の review result、sample の既存 grade を確認した。rulebook の `recipe` と `template` は `undecided` のため、宣言された参照先はなく、rulebook の本文構成を正として照合した。plan に展開された finding はなく、既存 grade も指摘なしだった。
- reporter 向け（維持判断・確認）: 必須 9 章の順序、全必須表の列・内容、業務上の条件、R1 の修正を維持した。移行元の紙媒体という前提は、移行方式の前に読める 2 章に維持した。修正後の差分と見出しを照合し、構造・判断情報の欠落がないことを確認した。根拠不足による見送りと未解決事項はない。親 runner 指定の検査は重複実行していない。
- 適用外の検証: `npm run validate:schema:file`（変更は Markdown のみで、YAML ファイルの変更がない。）
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/specdojo/samples/ 配下のみで、docs/ja/projects/ 配下の成果物を変更していない。）
- 適用外の検証: `npm run validate:history-links`（executor は履歴ファイル、plan、result を変更していない。）

## 4. 進め方と実践の型の適用

根拠として、共通規約 2 文書、[[specdojo:kata-guide|実践の型活用ガイド]] 第 6 章、[[specdojo:sample-authoring-standard|Sample 記述標準]]、[[specdojo:mip-index-rulebook|移行計画 作成ルール]]、共通レビュー観点の R2 対象と `vp-arc-conciseness`、先行 R1（110）の result、先行 090 の review result、sample の既存 grade を確認した。rulebook の `recipe` と `template` は `undecided` で参照先がないため、rulebook の本文構成を正として照合した。維持した記述は、必須 9 章の順序、全必須表の列・内容、業務上の条件、R1 の修正である。移行元の紙媒体という前提は、移行方式の前に読める 2 章に維持した。5 章と 8 章は、表と判断条件・方針の区切りを小節にして、前提から結論の順に読めるようにした。修正後の差分と見出しを照合し、構造・判断情報の欠落がないことを確認した。rulebook と矛盾する箇所はなく、rulebook を正として直した箇所もない。
