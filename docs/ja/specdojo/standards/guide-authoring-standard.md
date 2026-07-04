---
specdojo:
  id: guide-authoring-standard
  type: standard
  status: draft
---

# Guide 記述標準

Guide Authoring Standard

`docs/ja/specdojo/guides/` 配下の各 `*-guide.md` が従うべき構成・記述ルール・Frontmatter 規約・禁止事項・運用ルールを定義します。Frontmatter の共通原則は [document-metadata-standard.md](document-metadata-standard.md) に従い、機械検証は参照スキーマに従います。

## 1. 適用範囲

- 対象: `docs/ja/specdojo/guides/` 配下のすべての `*-guide.md`
- 目的: guide の構成・記述品質を統一し、読み手が考え方・手順・使い方を理解して実行できる説明文書を提供する
- 位置づけ: guide は規範（must）ではなく、理解・操作・判断を助ける説明と手順を扱う。規範事項は対応する standard / rulebook を正本とする
- Frontmatter 共通原則: [document-metadata-standard.md](document-metadata-standard.md)
- 参照スキーマ: [guide-frontmatter.schema.yaml](../../../specdojo/schemas/v1/guide-frontmatter.schema.yaml)
- ファイル名・ID 規則: [docs-structure-guide.md](../guides/docs-structure-guide.md)

## 2. 見出しレベルと章番号の原則

- `#` はタイトルのみ。章は `##` から開始する。
- 章番号は 1 始まりの連番。スキップしない（例: `## 1.`, 次は `## 2.`）。
- 章番号末尾には必ず `.` を付ける。
- 章への参照は章番号ではなく章タイトルで記載する。
- タイトル直下に **英語名（1行）** を置き、その直下に **目的・概要（1〜3文）** を置く。

## 3. Frontmatter 規約

- ファイル名は `<name>-guide.md` とする。
- `id` / `type` / `status` を必須とし、共通原則は [document-metadata-standard.md](document-metadata-standard.md) に従う。
- `type` は `guide` 固定とする。
- `id` は英小文字・数字・ハイフンで構成し、一意にする（正確な制約は参照スキーマに従う）。
- `status` は `draft` / `ready` / `deprecated` のいずれかとする。

| 項目       | 必須 | 説明                             |
| ---------- | ---- | -------------------------------- |
| id         | ○    | `<name>-guide` 形式の一意 ID     |
| type       | ○    | `guide` 固定                     |
| status     | ○    | `draft` / `ready` / `deprecated` |
| based_on   | 任意 | 根拠ドキュメント                 |
| supersedes | 任意 | 置き換え関係                     |

- 機械検証は [guide-frontmatter.schema.yaml](../../../specdojo/schemas/v1/guide-frontmatter.schema.yaml) を SSOT とする。

記述例:

```yaml
---
specdojo:
  id: docs-structure-guide
  type: guide
  status: draft
---
```

## 4. 構成の原則

- guide は固定の標準章構成を持たず、テーマ単位で章立てする。
- 冒頭（H1 と概要）で、目的・対象読者・前提が読み取れるようにする。
- 手順は番号付きリストで示し、操作・設定はコマンドや設定例などの具体物を添える。
- 規範事項（must）は対応する standard / rulebook へリンクし、guide 側で再定義しない。
- 章が長くなる場合は、テーマ単位の小見出し（`###`）で分割する。

## 5. 記述ガイド

- 読み手が再現できる粒度で手順を書き、前提と結果を明示する。
- スクリーンショット、コマンド、設定例、画面名など、操作に必要な具体物を活用する。
- 用語は対応する standard / rulebook と整合させ、命名ゆれを持ち込まない。
- 推奨表のカラム定義（例: 操作、目的、手順、注意点）を 1 つ以上提示する。
- 未確定事項や仮置き情報は、本文中に次の共通ラベルで記述する。
  - `_TODO_:` 後で人または生成 AI が確認・追記・修正する必要がある事項
  - `_UNDECIDED_:` 情報不足ではなく、意思決定が未了で未確定の事項
  - `_ASSUMPTION_:` 現時点で仮置きしている前提・仮説
- リンクはファイルがある場合に記載し、ない場合はバッククォートで仮置きする。

## 6. 禁止事項

- 章番号なし見出し（例: `## 基本操作`）を使用しない。
- 章番号末尾の `.` を省略しない。
- 規範（must ルール・規約）を guide で新規に定義しない。standard / rulebook を正本とする。
- 曖昧語（十分、適切、問題ない）を根拠なく使用しない。
- デッドリンクを記載しない。
- `_TODO_:` / `_UNDECIDED_:` / `_ASSUMPTION_:` 以外の独自ラベルを、共通ルール未定義のまま追加しない。

## 7. 運用ルール

- 参照先の standard / rulebook / ツール仕様が変わった場合は、guide の手順・記述を追従させる。
- 操作手順や画面が変わった場合は、具体物（コマンド・設定例・画面名）の整合を確認する。
- 表は必要に応じて整形スクリプト（`Format Markdown Table` タスク）で揃える。
