---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-tsd-index-040-20261118t015043z-61915074
  type: exec-result
  task_id: T-KATA-SLIM-2-tsd-index-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-tsd-index-040/T-KATA-SLIM-2-tsd-index-040-20261118T015043Z-61915074/plan.md
  started_at: "2026-11-18T01:51:02.179Z"
  completed_at: "2026-11-18T03:53:23.008Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - tsd-index
    - specdojo:tsd-index-rulebook
---

# Edit Result

## 1. 実施内容

- tsd-index rulebook から、どの成果物にも共通する文書運用の記述を外し、共通の正本への参照に置き換えました。
- 全体方針に「共通の運用」を1項目だけ置きました。役割は適用先のメンバー定義、`status`・承認・改訂と廃止・未決事項の引き継ぎはドキュメントメタ情報標準を参照します。
- 空白を除いた文字数は 3,831 字から 3,049 字になり、残存率は 79.6% です。目安の 8 割以下に収まっています。
- 技術区分、標準 6 列、版の粒度と正本、必須と任意の区別、詳細文書への導線、技術変更時の整合確認は維持しました。章名と必須・条件付きの区分は変えていません。
- 成果物本体、sample、recipe、template、grade サイドカーは変更していません。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/tsd-index-rulebook.md`: 全体方針に「共通の運用」を 1 項目置き、共通の運用の記述を参照に置き換えました。役割の記述、`status` と承認、改訂・廃止の手順、未決事項の台帳の記述、共通規約と重複する禁止事項を外しています。整形・lint は業務の受入確認から分離し、重複説明を短縮しました。型固有の判断条件と標準列は残しています。「API キー、トークン、秘密鍵、機密の接続情報を記載しない」の禁止は型に依存しないため外しました。

## 3. 申し送り

- 共通正本への変更案: 「API キー、トークン、秘密鍵、機密の接続情報を記載しない」に相当する規定が `docs/ja/specdojo/standards/document-metadata-standard.md` に見当たりません。共通の成果物記述規約への追記を提案します。本段では共通標準を編集していません。
- 旧 Frontmatter 項目表では `rulebook` が推奨でした。今後の必須性は共通標準に従います。
- result 記載用: 編集したのは docs/ja/specdojo/rulebooks/tsd-index-rulebook.md のみ。全体方針に「共通の運用」を1項目設け、役割は適用先のメンバー定義、`status`・承認・改訂と廃止・未決事項の引き継ぎはドキュメントメタ情報標準を参照した。整形・lint は業務の受入確認から分離した。
- 判断根拠: rulebook-authoring-standard.md、document-metadata-standard.md、sld-rulebook.md、PJR-8S4T の「他の型へ広げるときの一覧」、共通レビュー観点 `vp-arc-conciseness`、tsd-index.md、tsd-index-sample.md、両対象の既存 grade を確認した。技術区分・標準6列・版の粒度と正本・必須と任意の区別・詳細文書への導線・技術変更時の整合確認を維持し、重複説明を短縮した。
- 大きさと構造: Frontmatter を含む全文の空白除外文字数は3,831字→3,049字、残存率79.6%、削減率20.4%。章名・本文要件と標準列の必須／条件付き区分・rulebook 自身の Frontmatter は変更していない。Frontmatter 項目表の共通定義は標準へ委任し、旧表で推奨だった `rulebook` の必須性は共通標準に従う。
- 共通正本への変更案: 型に依存しない「API キー、トークン、秘密鍵、機密の接続情報を記載しない」を禁止事項から外した。document-metadata-standard.md には同等の規定が見当たらないため、共通の成果物記述規約への追記を提案する。本段では共通標準を編集していない。
- 関連資産: `recipe`・`template` は `not-needed`、`includes` は未宣言。sample は変更後の列・本文要件と矛盾せず、合わせて直す点はない。成果物本体と grade サイドカーは未変更。成果物 grade は現行ハッシュと一致し、版不整合や採用技術欠落の指摘は成果物側の不備として残る。今回の plan に展開された finding はなく、業務の判断条件を弱める変更は行っていない。
- executor 指示に従い result は更新していない。開始時点から存在した result・evidence 等の変更も維持した。親 runner 指定の lint・schema・型検査・テストは重複実行せず、親検証に委ねる。
- 対象 `tsd-index` は未変更: 根拠成果物 docs/ja/product/030-architecture/020-infrastructure/tsd-index.md を確認した。plan が成果物本体の変更を対象外としているため維持した。
- 適用外の検証: `npm run validate:schema:file`（executor が変更したファイルは Markdown の rulebook のみで、変更した YAML ファイルがない。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は docs/ja/specdojo/rulebooks/ 配下のみで、docs/ja/projects/ 配下は変更していない。）
- 適用外の検証: `npm run validate:history-links`（executor 自身は登録簿個票や既存 plan／result を変更していない。）

## 4. 進め方と実践の型の適用

根拠にしたのは、`rulebook-authoring-standard.md`、`document-metadata-standard.md`、改訂済みの `sld-rulebook.md`、PJR-8S4T の「他の型へ広げるときの一覧」、`vp-arc-conciseness`、`tsd-index.md`、`tsd-index-sample.md` と両対象の既存 grade です。共通運用の記述は参照に置き換え、型固有の判断基準・標準列・業務の受入確認は維持しました。plan に展開された finding はなく、業務の判断条件を弱める変更もしていません。成果物 grade の版不整合や採用技術欠落の指摘は、成果物側の不備として残ります。`recipe` と `template` は `not-needed`、`includes` は未宣言で、sample は変更後の rulebook と矛盾しません。
