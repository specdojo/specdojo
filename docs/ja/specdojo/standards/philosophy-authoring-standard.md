---
specdojo:
  id: philosophy-authoring-standard
  type: standard
  status: draft
  based_on:
    - document-metadata-standard
    - id-and-file-naming-standard
---

# Philosophy 記述標準

Philosophy Authoring Standard

`docs/ja/specdojo/philosophy/` 配下の各 `*-philosophy.md` が従うべき構成・記述ルール・Frontmatter 規約・禁止事項・運用ルールを定義します。Frontmatter の共通原則は [document-metadata-standard.md](document-metadata-standard.md) に従い、機械検証は参照スキーマに従います。

## 1. 目的・適用範囲

- 対象: `docs/ja/specdojo/philosophy/` 配下のすべての `*-philosophy.md`
- 目的: SpecDojo の規約が依拠する考え方（方針・概念）を、規範や手順と混ぜずに記述する
- 位置づけ: philosophy は standard と rulebook の上流にあり、なぜその規約なのか、迷ったときに何を基準に判断するかを扱う。判定可能な規約は standard、成果物ごとの記述規則は rulebook、操作と手順は guide を正本とする
- Frontmatter 共通原則: [document-metadata-standard.md](document-metadata-standard.md)
- 参照スキーマ: [philosophy-frontmatter.schema.yaml](../../../specdojo/schemas/v1/philosophy-frontmatter.schema.yaml)
- ファイル名・ID 規則: [id-and-file-naming-standard.md](id-and-file-naming-standard.md)

## 2. 基本方針

- philosophy は規範（must）を定義しない。読み手が自分で判断できるように、原則・概念とその理由を示す。
- 判定可能な条件、値、必須項目を philosophy で定義しない。定義が必要になった時点で standard、rulebook、または schema へ置き、philosophy からは参照する。
- 操作手順、コマンド、設定例を主目的にしない。これらは guide の責務とする。
- 原則・概念は、それを守らなかった場合に何が起きるかとあわせて示す。理由のない原則は判断に使えないため。

## 3. 構成の原則

- `#` はタイトルのみ。章は `##` から開始する。
- 章番号は 1 始まりの連番とし、末尾に `.` を付ける。章への参照は章タイトルで記載する。
- タイトル直下に英語名（1行）を置き、その直下に目的・概要（1〜3文）を置く。
- 目的・概要には、本書が規範ではないことと、判定可能な規約の正本がどこかを明示する。
- 定義する原則または概念の全体像を、本文の早い段階で一覧表として示す。
- 個々の原則・概念は、テーマ単位で章または小見出しに分ける。
- 固定の標準章構成は設けない。扱う対象（方針か概念か）によって適切な章立てが異なるため。

| 章の役割     | 必須 | 説明                                                         |
| ------------ | ---- | ------------------------------------------------------------ |
| 全体一覧     | ○    | 定義する原則または概念を表で一覧する                         |
| 個別の説明   | ○    | 原則・概念ごとに、意味、目的、適用範囲を示す                 |
| 典型的な誤り | ○    | 原則・概念を取り違えた場合に起きることを示す                 |
| 正本への導線 | ○    | 判定可能な規約を持つ standard / rulebook / schema を参照する |

## 4. 導入ブロック

目的・概要の直下、最初の `##` 見出しより前に、次の3ブロックをこの順で置きます。guide と同じ3ブロックを用います。

| ラベル               | 書く内容                                                           |
| -------------------- | ------------------------------------------------------------------ |
| 対象読者             | この philosophy を読む役割・立場                                   |
| この文書で分かること | 読み終えたときに得られる判断材料の範囲                             |
| 次に読む文書         | この philosophy の直後に進む文書（2〜3件）。網羅的な一覧は置かない |

- 目的別の横断一覧は [specdojo-overview-guide.md](../guides/specdojo-overview-guide.md) の `目的別の次の読み物` を唯一の正本とし、複製しない。
- `この文書が扱わないこと` は任意で追加してよい。
- 機械検証は [philosophy-content.schema.yaml](../schemas/v1/philosophy-content.schema.yaml) を SSOT とし、`npm run lint:fm` で検証する。

## 5. Frontmatter 規約

- ファイル名は `<subject>-philosophy.md` とする。
- `id` / `type` / `status` を必須とし、共通原則は [document-metadata-standard.md](document-metadata-standard.md) に従う。
- `type` は `philosophy` 固定とする。
- `id` は `<subject>-philosophy` 形式とし、所属を表す接頭辞を付けない（[id-and-file-naming-standard.md](id-and-file-naming-standard.md) の `フレームワーク文書のID` に従う）。
- `status` は `draft` / `ready` / `deprecated` のいずれかとする。

| 項目       | 必須 | 説明                                 |
| ---------- | ---- | ------------------------------------ |
| id         | ○    | `<subject>-philosophy` 形式の一意 ID |
| type       | ○    | `philosophy` 固定                    |
| status     | ○    | `draft` / `ready` / `deprecated`     |
| based_on   | 任意 | 根拠ドキュメント                     |
| supersedes | 任意 | 置き換え関係                         |

記述例:

```yaml
---
specdojo:
  id: documentation-philosophy
  type: philosophy
  status: draft
---
```

## 6. 記述ガイド

- 文体は「です・ます」体を既定とする。standard / rulebook の規範文（「である」体）と役割を分ける。
- 原則・概念には、名称、短い定義、SpecDojo 上の意味を含める。
- 比較・対応・区別など、見比べる情報は表に置く。
- 例を用いる場合は、[sample-authoring-standard.md](sample-authoring-standard.md) の `共通サンプル文脈` に合わせる。
- 未確定事項や仮置き情報は、`_TODO_` / `_UNDECIDED_` / `_ASSUMPTION_` のラベルで記述する。

## 7. 禁止事項

- 章番号なし見出し（例: `## 基本方針`）を使用しない。
- 章番号末尾の `.` を省略しない。
- 判定可能な規約（必須項目、列挙値、しきい値、命名パターン）を philosophy で新規に定義しない。
- 操作手順、コマンド列、設定例を主内容にしない。
- 他の standard / rulebook / schema が正本とする値を複製しない。参照に留める。
- 曖昧語（十分、適切、問題ない）を根拠なく使用しない。
- `導入ブロック` の3ブロックを省略しない。ラベル名を変えない。順序を入れ替えない。

## 8. 運用ルール

- philosophy の原則を変更した場合は、その原則に依拠する standard / rulebook との整合を確認する。
- philosophy に判定可能な規約を書きたくなった場合は、先に対応する standard または schema を更新し、philosophy からは参照する。
- 同じ考え方を扱う文書が増えた場合は、文書を分けるか統合するかを、読み手が判断に使う単位で決める。
