---
specdojo:
  id: template-authoring-standard
  type: standard
  status: draft
---

# Template 記述標準

Template Authoring Standard

`docs/ja/specdojo/templates/` 配下の各 `*-template.(md|yaml)` が従うべき構成・プレースホルダ規約・禁止事項・運用ルールを定義します。プレースホルダを埋めた結果が満たすべき Frontmatter 規約は [document-metadata-standard.md](document-metadata-standard.md) を正本とし、本書では雛形側の記述方法を定義します。

## 1. 適用範囲

- 対象: `docs/ja/specdojo/templates/` 配下のすべての `*-template.(md|yaml)`
- 目的: テンプレートの構成・プレースホルダ記法を統一し、埋めるだけで成果物の雛形が完成する状態を提供する
- 成果物構造の正本: 対応する `docs/ja/specdojo/rulebooks/<prefix>-rulebook.md`
- 完成後の Frontmatter 規約の正本: [document-metadata-standard.md](document-metadata-standard.md)
- ファイル名・ID 規則: [docs-structure-guide.md](../guides/docs-structure-guide.md)

## 2. 出力フォーマットと命名

- ファイル名は `<prefix>-template.md` / `<prefix>-template.yaml` とし、対応 rulebook の `target_format` に合わせる。
- Markdown テンプレートは、見出し構成を対象成果物の `本文構成（標準テンプレ）` に対応させる。
- YAML テンプレートは、対象成果物のルートキー・必須キー・型を雛形として示す。
- テンプレートファイル自身の Frontmatter も `specdojo:` 名前空間配下に実値で記述する（`specdojo.id: <prefix>-template`、`specdojo.type: template`、`specdojo.status: draft`）。生成物の Frontmatter は自身 Frontmatter とは別に表現する。表現方法は [document-metadata-standard.md](document-metadata-standard.md) の `テンプレート自身のメタ情報と生成物 Frontmatter の分離` に従い、Markdown 成果物テンプレートは `specdojo:` 配下の `frontmatter_template` フィールド（中身は `specdojo:` ラッパー込みの生成物 Frontmatter）、exec / result テンプレートは本文先頭の `_FRONTMATTER_` を用いる。

## 3. プレースホルダ規約

- プレースホルダは前後をアンダースコアで囲む大文字スネークケース（例: `_TASK_ID_`、`_DELIVERABLE_NAME_`）で記述する。
- 未記入や後続作業を表す箇所は共通ラベル `_TODO_` を使う。
- プレースホルダ名は埋める内容が分かる名称にし、1 テンプレート内で意味を統一する。
- 固定値（変更しない記述）はプレースホルダにせず、そのまま記述する。
- すべてのプレースホルダは、埋めれば成果物として成立する粒度にする。

| 記法                   | 用途                                                                      | 例                     |
| ---------------------- | ------------------------------------------------------------------------- | ---------------------- |
| `_UPPER_SNAKE_`        | 埋めるべき可変項目（記入プレースホルダ）                                  | `_RISK_TITLE_`         |
| `_TODO_`               | 後で記入・判断する箇所（記入プレースホルダ）                              | 担当 / 期限など        |
| `_PROJECT_ID_`         | 生成時に置換するプロジェクト ID（生成時プレースホルダ）                   | `_PROJECT_ID_:pm-plan` |
| `frontmatter_template` | 生成物 Frontmatter 雛形（Markdown 成果物テンプレート自身 Frontmatter 内） | —                      |
| `_FRONTMATTER_`        | 生成処理が注入する Frontmatter（exec / result テンプレート本文先頭）      | —                      |

## 4. 構成の原則

- Markdown の見出しは `##` から開始し、章番号は 1 始まりの連番、末尾に `.` を付ける。
- 章構成は対応成果物の rulebook が定める本文構成に対応させ、テンプレート独自の章立てを作らない。
- YAML はキー構造・必須キー・型制約を、対象成果物の schema と整合する形で示す。
- 埋めた結果が対象 `type` のメタ情報標準（[document-metadata-standard.md](document-metadata-standard.md)）を満たすようにする。

## 5. 記述ガイド

- テンプレートは「何をどこに書くか」を示す雛形であり、内容の作り方（問い・観点）は recipe に委譲する。
- 各セクションには、何を記入するかが分かる見出し・キー・プレースホルダを置く。
- 記入例が必要な場合は、プレースホルダと区別できる形（コメントや補足行）で添える。
- 推奨表のカラム定義（例: 項目、必須、説明）を 1 つ以上提示する。
- 文書へのリンクは、対象文書が存在する場合は `[[id|title]]` 形式（`id` は project 修飾 doc id）で記載する。まだ存在しない場合は `` `id` `` または `` `filename` `` のようにバッククォートで仮置きする。

## 6. 禁止事項

- 章番号なし見出し（例: `## 基本情報`）を使用しない（Markdown の場合）。
- 章番号末尾の `.` を省略しない。
- 実在のプロジェクト固有データや個人情報・機密情報を雛形に埋め込まない。
- 埋めずに成果物として成立しない曖昧なプレースホルダを残さない。
- プレースホルダ記法（`_UPPER_SNAKE_` / `_TODO_` / `_PROJECT_ID_` / `_FRONTMATTER_`）および `frontmatter_template` フィールド以外の独自記法を、共通ルール未定義のまま追加しない。
- テンプレート本文に実装詳細（SQL 全文、具体クラス名、詳細 API 設計）を書かない。

## 7. 運用ルール

- 対応成果物の rulebook 本文構成や schema が変わった場合は、テンプレートの構成・キーを追従させる。
- プレースホルダ名を変更する場合は、対応する recipe / 生成処理との整合を確認する。
- 表は必要に応じて整形スクリプト（`Format Markdown Table` タスク）で揃える。
