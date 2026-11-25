---
specdojo:
  id: prj-0001:xer-t-kata-review-all-sysd-index-sample-110-20261125t152854z-325b55b5
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-sysd-index-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-sysd-index-sample-110/T-KATA-REVIEW-ALL-sysd-index-sample-110-20261125T152854Z-325b55b5/plan.md
  started_at: "2026-11-25T15:29:04.317Z"
  completed_at: "2026-11-25T15:41:03.912Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:sysd-index-sample
    - specdojo:sysd-index-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R1（目的の過不足）として `docs/ja/specdojo/samples/sysd-index-sample.md` だけを修正しました。目的に要らない文書の役割割り当てと承認進捗の記述を削り、不足していた利用者と利用目的、未決事項の当面の扱いと解消後の更新先を補いました。
- rulebook など sample 以外は変更していません。Markdown の整形と lint、runner の親検証（`lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema`）は通過しています。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R1-1 | R1 | 冒頭（H1 直後の文） | 索引の利用者と利用目的が開発担当だけで、`done_criteria` にある QE（テスト設計の SSOT）と OPS（運用・監視設定）の利用目的が読めない。 | 開発担当・同行レビュー担当・店舗運営アドバイザーがそれぞれ探すものを書いた。 | sysd-index-rulebook の本文要件「対象と責任」（利用者と利用目的）、`done_criteria`、`vp-po-purpose-alignment` | - |
| R1-2 | R1 | 1. 概要（対象範囲・更新責任） | 索引の作成・確認・承認の役割の表（PO の公開可否承認、PM の後続作業管理を含む）と、設計の振る舞いの文（会計確定と印字完了の区別ほか）が、索引の目的に要らない。 | 表と振る舞いの文を削り、更新責任の列にあるロールの略語を略語の文で展開した。 | Sample 記述標準の記述ガイド（文書の役割の割り当て・承認の進み具合を書かない）、template の概要の指示（更新責任は SSOT 一覧に記す）、rulebook の禁止事項（第二の仕様書にしない）、`vp-arc-single-responsibility` | - |
| R1-3 | R1 | 2. SSOT 一覧（表形式）、5. 関連ドキュメント導線 | 「PO 承認待ち」「有人確認の負担と運用可否が承認待ち」が承認の進み具合を書いている。 | 未決事項への参照と、当面の代替参照（操作仕様の停止時の引継ぎ）に置き換えた。 | Sample 記述標準の禁止事項、rulebook の関連仕様（未作成文書の代替参照）、`vp-qe-kata-conformance` | - |
| R1-4 | R1 | 4. 変更の入口（典型ケース） | 正本の移動・廃止の行に、PM の後続作業管理という変更経路に要らない役割の割り当てがある。 | 「PM は後続作業を更新する」を削った。 | Sample 記述標準の記述ガイド、`vp-arc-single-responsibility` | - |
| R1-5 | R1 | 6. 未決事項・変更影響・公開前確認 | 未決事項の表に template にない「担当ロール」の列と、作る人・承認の記述がある。一方で rulebook が求める当面の扱いと解消後の更新先が一部の行で欠けている。 | 列を削り、各行に当面の扱いと解消後の更新先を足した。公開・昇格前の確認条件を、役割・承認の文から確かめる条件の文に直し、本文の「draft のまま」の記述（frontmatter の `status: ready` と食い違う）を削った。 | rulebook の本文要件「留保事項」、template の 6.1・6.2、Sample 記述標準の禁止事項。列の削除は R2（構成）に近いが、禁止記述を除く目的で R1 で行った。列を残して中身だけ消す案は、template と食い違うため採らなかった。 | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/sysd-index-sample.md`: 冒頭に開発担当・同行レビュー担当・店舗運営アドバイザーの利用目的を追記しました。概要の役割表と振る舞いの文、承認待ちの記述、変更の入口にある PM の後続作業管理を削除しました。未決事項の表から「担当ロール」列を削り、各行に当面の扱いと解消後の更新先を補いました。公開・昇格前の確認条件は、確かめられる条件の文に直しました。

## 3. 申し送り

- R1-1: R1 / 冒頭（H1 直後の文） / 索引の利用者と利用目的が開発担当だけで、`done_criteria` の QE（テスト設計の SSOT）と OPS（運用・監視設定）の利用目的が読めない / 開発担当・同行レビュー担当・店舗運営アドバイザーそれぞれが探すものを書いた / sysd-index-rulebook の本文要件「対象と責任」（利用者と利用目的）、`done_criteria`、vp-po-purpose-alignment / -
- R1-2: R1 / 1. 概要（対象範囲・更新責任） / 索引の作成・確認・承認の役割の表（PO の公開可否承認、PM の後続作業管理を含む）と、設計の振る舞いの文（会計確定と印字完了の区別ほか）が、索引の目的に要らない / 表と振る舞いの文を削り、更新責任の列にあるロールの略語を略語の文で展開した / Sample 記述標準の記述ガイド（文書の役割の割り当て・承認の進み具合を書かない）、template の概要の指示（更新責任は SSOT 一覧に記す）、rulebook の禁止事項（第二の仕様書にしない）、vp-arc-single-responsibility / -
- R1-3: R1 / 2. SSOT 一覧（表形式）、5. 関連ドキュメント導線 / 「PO 承認待ち」「有人確認の負担と運用可否が承認待ち」が承認の進み具合を書いている / 未決事項への参照と、当面の代替参照（操作仕様の停止時の引継ぎ）に置き換えた / Sample 記述標準の禁止事項、rulebook の関連仕様（未作成文書の代替参照）、vp-qe-kata-conformance / -
- R1-4: R1 / 4. 変更の入口（典型ケース） / 正本の移動・廃止の行に、PM の後続作業管理という変更経路に要らない役割の割り当てがある / 「PM は後続作業を更新する」を削った / Sample 記述標準の記述ガイド、vp-arc-single-responsibility / -
- R1-5: R1 / 6. 未決事項・変更影響・公開前確認 / 未決事項の表に template にない「担当ロール」の列と、作る人・承認の記述がある。一方で rulebook が求める当面の扱いと解消後の更新先が一部の行で欠けている / 列を削り、各行に当面の扱いと解消後の更新先を足した。公開・昇格前の確認条件を、役割・承認の文から確かめる条件の文に直し、本文の「draft のまま」の記述（frontmatter の status: ready と食い違う）を削った / rulebook の本文要件「留保事項」、template の 6.1・6.2、Sample 記述標準の禁止事項。列の削除は R2（構成）に近いが、禁止記述を除く目的で R1 で行った。列を残して中身だけ消す案は、template と食い違うため採らなかった / 要判断
- 適用外の検証: `npm run validate:history-links`（plan・result・個票を変更しておらず、変更は sample だけのため）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルは Markdown の sample だけで、yaml・yml の変更がないため）

## 4. 進め方と実践の型の適用

根拠は sysd-index-rulebook の本文要件（対象と責任、留保事項）、`done_criteria`、Sample 記述標準の記述ガイドと禁止事項、template の 6.1・6.2、`vp-po-purpose-alignment`、`vp-arc-single-responsibility`、`vp-qe-kata-conformance` です。構造や必須項目で矛盾する場合は rulebook を正としました。担当ロール列は残して中身だけ消す案もありましたが、template と食い違うため採らず、列ごと削りました。この判断は要判断として findings に残しています。
