---
specdojo:
  id: prj-0001:xer-t-kata-review-all-dmd-index-sample-130-20261124t190140z-960a41a8
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-dmd-index-sample-130
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-dmd-index-sample-130/T-KATA-REVIEW-ALL-dmd-index-sample-130-20261124T190140Z-960a41a8/plan.md
  started_at: "2026-11-24T19:01:48.788Z"
  completed_at: "2026-11-24T19:13:38.554Z"
  agent: sol-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:dmd-index-sample
    - specdojo:dmd-index-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R3（読みやすさ）として、`docs/ja/specdojo/samples/dmd-index-sample.md` に文章の直し3件を反映しました。意味・制約と前段（R1・R2）の修正は維持しています。必須6章・表・判定基準・再実行期限・除外条件・未決事項に変更はありません。
- 実施内容（指摘一覧） | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | R3-1 | R3 | 1. 概要（index） | 移行の説明と本書の目的、対象範囲と詳細の委譲先がそれぞれ一文に詰まっている | 移行の流れ・本書の目的・対象範囲・詳細の委譲先を4文に分けた | W3。[[specdojo:specdojo-philosophy\|SpecDojo の考え方]] 第3.6節の一文一主張に従い、再現性・照合・対象範囲の意味を維持 | - | | R3-2 | R3 | 1. 概要（index） | DMD の正式名がなく、後続の「対応DMD」と文書名の関係を読み手が補う必要がある | 対象別設計の初出に「データ移行設計（Data Migration Design: DMD）」を添えた | W8。[[specdojo:dmd-index-rulebook\|データ移行設計 作成ルール]] の名称と英文表題に整合 | - | | R3-3 | R3 | 4. 検証の共通方針（種別/基準/証跡/保管） | 「全角と半角、長音記号の違いだけの差」は修飾の関係が追いにくい | 「商品名の全角・半角の違いと長音記号の違いだけを許容する」にした | W5。許容する差の種類、許容する理由、金額・個数・つけ残高には許容差を設けない条件を維持 | - |
- runner の検証では `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が成功しました。executor の `prettier --write` と `git diff --check` も成功しました。変更の種類による適用外の検査は、各検査の記録に従います。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/dmd-index-sample.md`: R3（読みやすさ）の文の直し3件を反映しました。概要章では、移行の流れ・本書の目的・対象範囲・詳細の委譲先を4文に分け、対象別設計の初出に「データ移行設計（Data Migration Design: DMD）」を添えました。検証の共通方針では、許容する差の書き方を「商品名の全角・半角の違いと長音記号の違いだけを許容する」に直しました。2行追加・2行削除の差分で、意味・判定基準・制約は変えていません。

## 3. 申し送り

- F001（`source=grade`、`vp-ba-stakeholder-clarity`、判定者の Role code 併記）は、executor の確認では R3 の対象外です。根拠は `kata-guide` 第6.3節で、この観点が独立評価から除外されている点です。本タスクでは修正していません。R1・R2 の申し送りを継続し、R5 で参照先 `mip-index` との整合と Role code 併記の要否を確認する必要があります。`source=condense` の finding はありません。
- recipe と template は undecided のため、rulebook の本文要件を正としました。規範との矛盾はなく、W1〜W10 の残りに追加の修正事項は認められませんでした。result と grade サイドカーは編集していません。
- R3-1: R3 / 1. 概要（index） / 移行の説明と本書の目的、対象範囲と詳細の委譲先がそれぞれ一文に詰まっている / 移行の流れ・本書の目的・対象範囲・詳細の委譲先を4文に分けた / W3。[[specdojo:specdojo-philosophy|SpecDojo の考え方]] 第3.6節の一文一主張に従い、再現性・照合・対象範囲の意味を維持 / -
- R3-2: R3 / 1. 概要（index） / DMD の正式名がなく、後続の「対応DMD」と文書名の関係を読み手が補う必要がある / 対象別設計の初出に「データ移行設計（Data Migration Design: DMD）」を添えた / W8。[[specdojo:dmd-index-rulebook|データ移行設計 作成ルール]] の名称と英文表題に整合 / -
- R3-3: R3 / 4. 検証の共通方針（種別/基準/証跡/保管） / 「全角と半角、長音記号の違いだけの差」は修飾の関係が追いにくい / 「商品名の全角・半角の違いと長音記号の違いだけを許容する」にした / W5。許容する差の種類、許容する理由、金額・個数・つけ残高には許容差を設けない条件を維持 / -
- 進め方と実践の型の適用への記録: [[specdojo:kata-guide|実践の型活用ガイド]] 第6章の W1〜W10、[[specdojo:specdojo-philosophy|SpecDojo の考え方]] 第3.6節、[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]] 第5章、[[specdojo:sample-authoring-standard|Sample 記述標準]]、[[specdojo:dmd-index-rulebook|データ移行設計 作成ルール]]、[[specdojo:pm-review-viewpoints|共通レビュー観点一覧]] の読みやすさ・用語統一・簡潔性・関係者明確性を確認した。成果物は対象 sample、mip-index-sample、dmd-sample、用語集の関連語検索、対象の grade 結果、R1・R2 result を確認した。recipe・template は undecided のため rulebook の本文要件を正とした。必須6章・表・判定基準・再実行期限・除外条件・未決事項を維持し、規範との矛盾はない。W1〜W10 の残りに追加の修正事項は認めなかった。
- F001（source=grade）は、message・判定根拠・第4章の該当箇所と mip-index-sample の判定者を確認した。kata-guide 第6.3節で `vp-ba-stakeholder-clarity` は独立評価から除外されており、R3 の対象外である。R1・R2 の申し送りを継続し、R5 で参照先との整合と Role code 併記の必要性を確認する。今回の新規指摘表には重ねない。source=condense の finding はない。
- 変更ファイルは docs/ja/specdojo/samples/dmd-index-sample.md のみ。result と grade サイドカーは編集していない。reporter は R3-1〜R3-3 を実施内容の Markdown 表に各1行で1回だけ掲載し、申し送りに表を重ねない。指定された親検証は runner に委ねる。
- 適用外の検証: `npm run validate:schema:file`（変更は Markdown のみで、YAML ファイルを変更していない。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は docs/ja/specdojo/samples/ 配下のみで、docs/ja/projects/ 配下を変更していない。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票、既存の plan・result を変更していない。）

## 4. 進め方と実践の型の適用

sample-maintenance の進め方に従い、参照の向きを「成果物 → sample」に切り替えて対象 sample を見直しました。根拠にした規範は、`kata-guide` 第6章の W1〜W10、`specdojo-philosophy` 第3.6節、`rulebook-authoring-standard` 第5章、`sample-authoring-standard`、`dmd-index-rulebook`、`pm-review-viewpoints`（読みやすさ・用語統一・簡潔性・関係者明確性）です。成果物としては、対象 sample、`mip-index-sample`、`dmd-sample`、用語集の関連語検索、対象の grade 結果、R1・R2 の result を確認しました。改訂したのは R3-1〜R3-3 の3件です。必須6章・表・判定基準・再実行期限・除外条件・未決事項は整合しているため維持しました。rulebook と矛盾する箇所はなく、rulebook を正として覆した箇所もありません。F001 は上記の理由で R3 では未対応です（次のアクションは R5 での確認）。根拠不足による見送りはありません。
