---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-sysd-critical-flows-040-20261118t080247z-c87a061c
  type: exec-result
  task_id: T-KATA-SLIM-2-sysd-critical-flows-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-sysd-critical-flows-040/T-KATA-SLIM-2-sysd-critical-flows-040-20261118T080247Z-c87a061c/plan.md
  started_at: "2026-11-18T08:02:54.897Z"
  completed_at: "2026-11-18T08:31:50.147Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - sysd-critical-flows
    - specdojo:sysd-critical-flows-rulebook
---

# Edit Result

## 1. 実施内容

- `sysd-critical-flows-rulebook` から、どの成果物にも共通する文書運用の記述を外し、共通の正本への参照に置き換えた。
- 章構成と必須・条件付きの区分、frontmatter は変更していない。型固有の判断基準、受入確認、未決事項の論点と影響は維持した。
- 空白を除いた文字数は、変更前の4,474字から変更後の3,546字（79.26%）になり、目安の8割以下を満たした。
- executor の検査（prettier、`git diff --check`、秘密情報検査）は passed だった。runner の `lint:fm`、`lint:md`、`lint:mermaid`、`lint:d2`、`validate:schema`、`test:unit`、`test:integration` も passed だった。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/sysd-critical-flows-rulebook.md`: 共通の文書運用の記述を外し、正本への参照にした。全体方針に「共通の運用」を1項目置き、役割は適用先のメンバー定義、status・承認・改訂と廃止・未決事項の引き継ぎは `document-metadata-standard` を参照する形にした。役割の表と段落、承認条件、文書品質検査を受入条件に入れる記述、未決事項の管理台帳の列と登録の段落を削除した。最大5フロー、一覧と詳細の ID 一致、永続化・冪等・再実行・補償、境界と相関、ITC/ETC、受入確認の手順と合格条件などの型固有の記述は維持した。混同を防ぐため用語定義も維持した。差分は51行追加、60行削除。

## 3. 申し送り

- recipe・template・sample は本タスクの対象外のため変更していない。executor の変更案（recipe の共通承認・台帳管理の記述整理、template/sample の管理記録への引渡し、未決事項の担当・判断時期・登録先、承認対象と公開前条件、役割説明の整理）は、別段で扱う。
- 共通の正本への変更案は本タスクでは未反映である。`document-metadata-standard` の未決事項の引き継ぎを新規作成にも適用すること、外部公開の人間承認と対象差分の証跡を明記することを提案する。`rulebook-authoring-standard` の役割分担の定義を求める記述も、適用先のメンバー定義への参照と整合させる必要がある。
- result 記載事項: 変更ファイルは docs/ja/specdojo/rulebooks/sysd-critical-flows-rulebook.md のみ。成果物本体・recipe・template・sample・result・評価サイドカーは変更していない。includes の指定はなく、記法 rulebook の追加編集は不要。
- 判断根拠: SLD 試行個票の「他の型へ広げるときの一覧」、改訂済み sld-rulebook、rulebook-authoring-standard、document-metadata-standard、共通規約、`vp-arc-conciseness`、対象成果物・設計索引・依存 CDFD・宣言された recipe/template/sample を確認。既存 rulebook の評価サイドカーには finding がなかった。
- 維持した要件: 最大5フロー、一覧と詳細の ID 一致、選定理由と対象者への影響、永続化・冪等・再実行・補償、境界と相関、実装動作と人間の一次対応、ITC/ETC、受入確認の実行方法・期待結果・失敗判定、未決事項の論点と影響。用語定義は要求送信と保存、再実行と冪等、補償と履歴削除の混同を防ぐため維持。見出しと全章必須の区分、frontmatter は変更していない。
- 別段の変更案: recipe の概要・関連ドキュメント導線・レビュー・仕上げチェックから共通の承認と台帳管理を外す。template/sample の管理記録への引渡し、未決事項の担当・判断時期・登録先、承認対象と公開前条件、役割説明を同様に整理する。業務上の人間介入・復旧条件は維持し、構造・必須項目・禁止事項は改訂した rulebook を正とする。
- 共通正本の変更案: document-metadata-standard の未決事項の引継ぎを改訂・廃止以外の新規作成にも適用する旨と、外部公開の人間承認・対象差分の証跡を明記する。rulebook-authoring-standard の各型に役割分担の定義を求める記述も、適用先のメンバー定義への参照と整合させる。本タスクでは変更していない。
- 文字数は frontmatter を含む全文から空白文字を除去して計測した。変更前4,474字、変更後3,546字、79.26%（20.74%削減）。親 runner が担当する lint・schema・型検査・テストは executor 内で実行していない。
- 適用外の検証: `npm run validate:schema:file`（変更したファイルは Markdown のみで、YAML ファイルの変更がない。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は docs/ja/specdojo/rulebooks/ 配下のみで、docs/ja/projects/ 配下に及ばない。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票および既存の plan/result を変更していない。）

## 4. 進め方と実践の型の適用

実践の型メンテナンス（rulebook-maintenance）として、`sysd-critical-flows-rulebook` を見直した。根拠は executor evidence に記載のある次の資料である。SLD 試行個票の「他の型へ広げるときの一覧」、改訂済み `sld-rulebook`、`rulebook-authoring-standard`、`document-metadata-standard`、共通規約、`vp-arc-conciseness`、対象成果物、設計索引、依存 CDFD、宣言された recipe・template・sample。この rulebook の評価サイドカーには finding がなく、成果物から届いた Kata 起因の finding もなかった。そのため、finding 起点の修正はなく、一覧に沿った簡潔化に限った。共通運用の記述は正本参照へ置き換え、型固有の判断基準と受入確認は維持した。frontmatter に `includes` の指定がないため、記法 rulebook の追加編集は不要と判断した。
