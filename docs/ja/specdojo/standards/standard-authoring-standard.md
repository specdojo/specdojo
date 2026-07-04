---
specdojo:
  id: standard-authoring-standard
  type: standard
  status: draft
---

# Standard 記述標準

Standard Authoring Standard

`docs/ja/specdojo/standards/` 配下の各 `*-standard.md` が従うべき章立て・記述ルール・Frontmatter 規約・禁止事項・運用ルールを定義します。Frontmatter の共通原則は [document-metadata-standard.md](document-metadata-standard.md) に従い、機械検証は参照スキーマに従います。

## 1. 適用範囲

- 対象: `docs/ja/specdojo/standards/` 配下のすべての `*-standard.md`
- 目的: standard の章構成・記述品質を統一し、判定可能な規範を定義する
- 位置づけ: standard は規範（must / 規約）を定義する。判断や検証に使える基準を扱い、手順や使い方は guide に委譲する
- Frontmatter 共通原則: [document-metadata-standard.md](document-metadata-standard.md)
- 参照スキーマ: [standard-frontmatter.schema.yaml](../../../specdojo/schemas/v1/standard-frontmatter.schema.yaml)
- ファイル名・ID 規則: [docs-structure-guide.md](../guides/docs-structure-guide.md)

## 2. 見出しレベルと章番号の原則

- `#` はタイトルのみ。章は `##` から開始する。
- 章番号は 1 始まりの連番。スキップしない（例: `## 1.`, 次は `## 2.`）。
- 章番号末尾には必ず `.` を付ける。
- 章への参照は章番号ではなく章タイトルで記載する。
- タイトル直下に **英語名（1行）** を置き、その直下に **目的・概要（1〜3文）** を置く。

## 3. Frontmatter 規約

- ファイル名は `<name>-standard.md` とする。
- `id` / `type` / `status` を必須とし、共通原則は [document-metadata-standard.md](document-metadata-standard.md) に従う。
- `type` は `standard` 固定とする。
- `id` は英小文字・数字・ハイフンで構成し、一意にする（正確な制約は参照スキーマに従う）。
- `status` は `draft` / `ready` / `deprecated` のいずれかとする。

| 項目       | 必須 | 説明                             |
| ---------- | ---- | -------------------------------- |
| id         | ○    | `<name>-standard` 形式の一意 ID  |
| type       | ○    | `standard` 固定                  |
| status     | ○    | `draft` / `ready` / `deprecated` |
| based_on   | 任意 | 上位規約や根拠ドキュメント       |
| supersedes | 任意 | 置き換え関係                     |

- 機械検証は [standard-frontmatter.schema.yaml](../../../specdojo/schemas/v1/standard-frontmatter.schema.yaml) を SSOT とする。

記述例:

```yaml
---
specdojo:
  id: id-and-file-naming-standard
  type: standard
  status: draft
---
```

## 4. 標準章構成（`*-standard.md`）

章構成は以下を原則とする。不要な章は省略可だが、省略理由を記載することを推奨する。

| 章番号 | 章タイトル         | 必須 | 説明                                               |
| ------ | ------------------ | ---- | -------------------------------------------------- |
| 1      | 目的・適用範囲     | ○    | 何を規定する標準か、適用対象を示す                 |
| 2      | 基本方針           | ○    | 標準が依拠する原則・前提を示す                     |
| 3      | 規範本体           | ○    | 判定可能な規約・ルールを定義する（複数章に分割可） |
| 4      | 値制約・判定基準   | 任意 | 列挙値・パターン・しきい値など判定基準を示す       |
| 5      | 記述例             | 任意 | 規約に沿った最小例を示す                           |
| 6      | 禁止事項           | ○    | してはいけない記述・違反パターンを列挙する         |
| 7      | 運用・見直しルール | 任意 | 変更時の手順、見直し条件、バリデーション方法       |

## 5. 記述ガイド

- 各規範は判定可能に書く（`must` / `should` の別と条件を明確にする）。
- 抽象語（十分、適切）で終わらせず、満たすべき条件・基準を示す。
- 推奨表のカラム定義（例: 項目、必須、説明、判定基準）を 1 つ以上提示する。
- 機械検証できる事項は対応する schema を SSOT とし、本文では schema を二重定義せず参照に留める。
- 共通事項は上位の標準（ハブ）を SSOT とし、重複記載を避ける。
- 未確定事項や仮置き情報は、本文中に次の共通ラベルで記述する。
  - `_TODO_:` 後で人または生成 AI が確認・追記・修正する必要がある事項
  - `_UNDECIDED_:` 情報不足ではなく、意思決定が未了で未確定の事項
  - `_ASSUMPTION_:` 現時点で仮置きしている前提・仮説

## 6. 内容充実化（薄いドキュメント防止）

- 各必須章には、最低 3 つ以上の具体項目（箇条書きまたは表項目）を置く。
- 規範本体には、判定基準を伴う規約を具体的に示す。
- 少なくとも 1 つは、判定基準を含む推奨表を提示する。
- 禁止事項には、違反例または理由を添えて判定可能にする。
- ただし、実装依存の詳細（SQL 全文、具体クラス名、詳細 API 設計）には踏み込まない。

## 7. 禁止事項

- 章番号なし見出し（例: `## 目的`）を使用しない。
- 章番号末尾の `.` を省略しない。
- 章参照を番号のみ（例: `§3` / `第3章`）で記述しない。
- 手順・操作・使い方など guide が担う説明を standard の主目的にしない。
- 曖昧語（十分、適切、問題ない）を根拠なく使用しない。
- schema で機械検証する制約を本文に二重定義し、両者を乖離させない。
- `_TODO_:` / `_UNDECIDED_:` / `_ASSUMPTION_:` 以外の独自ラベルを、共通ルール未定義のまま追加しない。

## 8. 運用ルール

- 章構成や規範を変更する際は、依存する rulebook / guide / schema との整合を確認する。
- 機械検証の根拠となる schema を変更する場合は、本文の参照と齟齬がないか確認する。
- 表は必要に応じて整形スクリプト（`Format Markdown Table` タスク）で揃える。
