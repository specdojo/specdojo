---
specdojo:
  id: rulebook-authoring-standard
  type: standard
  status: ready
---

# Rulebook 記述標準

Rulebook Authoring Standard

`docs/ja/specdojo/rulebooks/` 配下の各 `*-rulebook.md` が従うべき章立て・記述ルール・Frontmatter 規約・禁止事項・運用ルールを定義します。Frontmatter の共通原則は [document-metadata-standard.md](document-metadata-standard.md) に従い、機械検証は参照スキーマに従います。

## 1. 適用範囲

- 対象: `docs/ja/specdojo/rulebooks/` 配下のすべての `*-rulebook.md`
- 目的: 章構成・見出しレベル・記述品質・Frontmatter を統一し、参照・保守を容易にする
- Frontmatter 共通原則: [document-metadata-standard.md](document-metadata-standard.md)
- 参照スキーマ: [rulebook-frontmatter.schema.yaml](../../../specdojo/schemas/v1/rulebook-frontmatter.schema.yaml)
- ファイル名・ID 規則: [docs-structure-guide.md](../guides/docs-structure-guide.md)

## 2. 見出しレベルと章番号の原則

- `#` はタイトルのみ。章は `##` から開始する。
- 章番号は 1 始まりの連番。スキップしない（例: `## 1.`, 次は `## 2.`）。
- 章番号末尾には必ず `.` を付ける。
- 章への参照は章番号ではなく章タイトルで記載する（例: `本文構成（標準テンプレ）`）。
- タイトル直下に **英語名（1行）** を置き、その直下に **目的・概要（1〜3文）** を置く。

## 3. Frontmatter 規約

- ファイル名は `<prefix>-rulebook.md` とする。
- `id` / `type` / `status` を必須とし、共通原則は [document-metadata-standard.md](document-metadata-standard.md) に従う。
- `type` は `rulebook` 固定とする。
- `id` は英小文字・数字・ハイフンで構成し、一意にする（正確な制約は参照スキーマに従う）。
- `status` は `draft` / `ready` / `deprecated` のいずれかとする。

| 項目          | 必須 | 説明                                                              |
| ------------- | ---- | ----------------------------------------------------------------- |
| id            | ○    | `<prefix>-rulebook` 形式の一意 ID                                 |
| type          | ○    | `rulebook` 固定                                                   |
| status        | ○    | `draft` / `ready` / `deprecated`                                  |
| target_format | 任意 | 対象ドキュメントのフォーマット（`yaml` / `json` / `markdown`）    |
| recipe        | 任意 | 対応する recipe の ID（`<prefix>-recipe`）。該当なしは `none`     |
| sample        | 任意 | 対応する sample の ID（`<prefix>-sample`）。該当なしは `none`     |
| template      | 任意 | 対応する template の ID（`<prefix>-template`）。該当なしは `none` |
| based_on      | 任意 | 上位規約や根拠ドキュメント                                        |
| supersedes    | 任意 | 置き換え関係                                                      |

- `target_format` が未記載の場合は markdown を対象とみなす。
- `recipe` / `sample` / `template` は ID 参照であり、`fully-guided` / `recipe-guided` の plan 生成で参照先パスの解決に使う（rulebook を参照ハブとする）。命名規約に従う場合も明示的に宣言し、宣言された参照先ファイルが存在しないと `exec validate` が警告する。`sample` の拡張子は `target_format` に従う。
- 機械検証は [rulebook-frontmatter.schema.yaml](../../../specdojo/schemas/v1/rulebook-frontmatter.schema.yaml) を SSOT とする。

記述例:

```yaml
---
specdojo:
  id: imp-business-rulebook
  type: rulebook
  status: draft
---
```

## 4. 標準章構成（`*-rulebook.md`）

章構成は以下を原則とする。不要な章は省略可だが、省略理由を記載することを推奨する。

| 章番号 | 章タイトル               | 必須 | 説明                                                                                                               |
| ------ | ------------------------ | ---- | ------------------------------------------------------------------------------------------------------------------ |
| 1      | 全体方針                 | ○    | 目的・適用範囲・記載レベルの方針をまとめる                                                                         |
| 2      | 位置づけと用語定義       | 任意 | Mermaid などで関係を示し、複数の解釈を防ぐ必要がある用語だけを定義する。用語定義が不要な場合は章を`位置づけ`とする |
| 3      | ファイル命名・ID規則     | ○    | id / ファイル名 / 命名規則                                                                                         |
| 4      | 推奨 Frontmatter 項目    | 任意 | スキーマと必須/任意の項目                                                                                          |
| 5      | 本文構成（標準テンプレ） | ○    | 対象ドキュメントの標準章構成                                                                                       |
| 6      | 記述ガイド               | ○    | 各章の書き方、推奨表、例など                                                                                       |
| 7      | 禁止事項                 | ○    | してはいけない記述、スキーマ違反など                                                                               |
| 8      | サンプル                 | 任意 | 最小例を rulebook 内にコードブロックで自己完結して埋め込む（別ファイルへのリンクにしない）                         |

補足:

- 本文構成（標準テンプレ）は、対象ドキュメント（例: `uts-index`, `utd-<term>`）の章構成を表で示し、必須/任意も明示する。
- 記述ガイドには、章ごとの書き方と例（表・サンプル）を置き、重複を避けるため共通事項は上位（index）を SSOT とする方針を記載する。
- sample / recipe / template との対応関係は Frontmatter の `sample` / `recipe` / `template` だけで示す。本文にリンク章（`サンプル` / `作成レシピ` / `テンプレート`）や wikilink を置かない。fully-guided 実行では rulebook と recipe だけが読み込まれるため、sample / template への本文中のリンクは実行不能な指示になる。
- 用語定義は、ドメイン固有語や同じ語に複数の解釈がある場合だけ置く。本文構成（標準テンプレ）や記述ガイドで見出し・用語の意味を十分に定義できる場合は、重複を避けて用語定義を省略する。

## 5. 記述ガイド

- 各章は「何を定義する章か」が判定できる粒度で記述する。
- `本文構成（標準テンプレ）` には、対象ドキュメントの章構成を表で示し、必須/任意を明示する。
- `記述ガイド` には、章ごとの書き方、推奨表、記載例を置く。
- 共通事項は上位ドキュメントを SSOT とし、重複記載を避ける。
- 用語はファイル内で統一し、`index` / `overview` などの命名ゆれを持ち込まない。
- 用語定義を置く場合は、本文構成の見出し名や記述ガイドを単に言い換えて重複させない。重複になる場合は用語定義を省略する。
- `推奨 Frontmatter 項目` の記述は [document-metadata-standard.md](document-metadata-standard.md) に従う。
- `ファイル命名・ID規則` は [docs-structure-guide.md](../guides/docs-structure-guide.md) に従う。
- `target_format` がある場合は、本文ルール・記述例を対象フォーマットに合わせる。未記載の場合は markdown を対象とみなす（`Frontmatter 規約` 参照）。
- `target_format: yaml` / `json` の場合は、Frontmatter と同等の先頭メタ項目、ルートキー、必須キー、型制約を実装可能な粒度で定義する。
- 未確定事項や仮置き情報は、本文中に次の共通ラベルで記述する。
  - _TODO_: 後で人または生成 AI が確認・追記・修正する必要がある事項
  - _UNDECIDED_: 情報不足ではなく、意思決定が未了で未確定の事項
  - _ASSUMPTION_: 現時点で仮置きしている前提・仮説
- `サンプル` 章を置く場合は、最小例をコードブロックで本文内に自己完結して埋め込む。sample ファイルの有無は Frontmatter の `sample`（該当なしは `none`）で宣言し、本文にリンクを記載しない。
- template がない場合は、Frontmatter の `template` を省略するか `none` を宣言する。

## 6. 内容充実化（薄いドキュメント防止）

- 各必須章には、最低 3 つ以上の具体項目（箇条書きまたは表項目）を置く。
- 「適切に」「十分に」などの抽象語だけで終わらせず、判断可能な条件を書く。
- 少なくとも 1 つは、推奨表のカラム定義（例: ID、目的、条件、判定基準、担当）を提示する。
- 要求、品質特性、テスト/受入、運用/保守、トレーサビリティの欠落有無を確認する。
- docs-contents-guide の記述が短い場合でも、類似 rulebook、一般的開発知見、PMBOK 成果物観点で必要観点を補完する。
- ただし、実装依存の詳細（SQL 全文、具体クラス名、詳細 API 設計）には踏み込まない。

## 7. 禁止事項

- 章番号なし見出し（例: `## 全体方針`）を使用しない。
- 章番号末尾の `.` を省略しない。
- 章参照を番号のみ（例: `§5` / `第5章`）で記述しない。
- 本文に sample / recipe / template への wikilink・リンク章を置かない。対応関係は Frontmatter の `sample` / `recipe` / `template` で示す。
- rulebook 本文に実装詳細（SQL 全文、具体クラス名、詳細 API 設計）を書かない。
- 曖昧語（十分、適切、問題ない）を根拠なく使用しない。
- _TODO_: / _UNDECIDED_: / _ASSUMPTION_: 以外の独自ラベルを、共通ルール未定義のまま追加しない。
- 確定済みの内容をラベル付きのまま放置したり、ラベルを本文の代替として多用したりしない。

## 8. 運用ルール

- 章構成を変更する際は、本書の表を更新し、既存の `*-rulebook.md` と整合させる。
- 実データや大量のケース列挙は本書ではなく対象ドキュメント側に置く。本書では「書き方・構成」を定義する。
- 表は必要に応じて整形スクリプト（`Format Markdown Table` タスク）で揃える。
