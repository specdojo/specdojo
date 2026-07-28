---
specdojo:
  id: reference-authoring-standard
  type: standard
  status: draft
  based_on:
    - document-metadata-standard
    - id-and-file-naming-standard
---

# リファレンス記述標準

Reference Authoring Standard

SpecDojo のリファレンス文書を、一貫して検索・参照できる形で作成・更新するための標準を定義します。

## 1. 目的と適用範囲

本標準は `docs/ja/specdojo/references/` 配下の `*-reference.md` に適用します。

リファレンスは、成果物、コマンド、設定項目などを一覧・比較・確認するための文書です。読者が特定の項目を素早く引けることを目的とし、背景から順に理解させる guide や、遵守事項を定める standard とは役割を分けます。

exec plan における「参考資料」は rulebook / recipe / sample / template を指します。本標準の `reference` は文書種別であり、exec plan が参照する資料種別を追加・変更するものではありません。

## 2. 基本方針

- リファレンスは、一覧、比較表、コマンド表、対応表など、目的の情報へ直接到達できる構成にする。
- 規約・値・仕様の正本が rulebook、standard、スキーマ、CLI 実装などにある場合は、その正本を明示してリンクする。リファレンスを重複した正本にしない。
- 操作の背景、判断基準、手順の説明は guide に委ね、リファレンスには必要最小限の導線を置く。
- 生成物の静的な複製を置く場合は、生成元または更新責任を明記する。
- 項目名、ID、コマンド名、ファイル名は、参照先の正本と同じ表記を使う。

## 3. Frontmatter とファイル名

Frontmatter は [ドキュメントメタ情報標準](document-metadata-standard.md) に従い、`id`、`type`、`status` を必須とします。

```yaml
---
specdojo:
  id: specdojo-command-reference
  type: reference
  status: draft
---
```

- `type` は必ず `reference` とする。
- ファイル名は原則として `<id>.md` とし、ID は `*-reference` で終える。
- 置換前の文書がある場合は、`supersedes` に旧IDを記録する。
- スキーマの正本は [reference-frontmatter.schema.yaml](../../../specdojo/schemas/v1/reference-frontmatter.schema.yaml) とする。

## 4. 導入ブロック

H1 と概要文の直下、最初の `##` 見出しより前に、次の3ブロックをこの順で置きます。各ブロックは `**ラベル**` だけの段落で始め、内容は箇条書きで書きます。guide の `対象読者` / `この文書で分かること` / `次に読む文書` と対になる構成です。

| ラベル           | 書く内容                                               |
| ---------------- | ------------------------------------------------------ |
| 対象範囲         | このリファレンスが扱う対象の範囲（何を網羅しているか） |
| ここで引けるもの | 引ける項目の種類（一覧、比較軸、値、導線）             |
| 詳細の参照先     | 背景・判断・手順を委ねる guide や、規約の正本          |

```markdown
**対象範囲**

- `specdojo` CLI の主要コマンド

**ここで引けるもの**

- コマンドごとの用途と実行例、共通オプション

**詳細の参照先**

- CLI 全体の流れは [CLI概要ガイド](../guides/cli-overview-guide.md) を参照してください。
```

機械検証は [reference-content.schema.yaml](../../../specdojo/schemas/v1/reference-content.schema.yaml) を SSOT とし、`npm run lint:fm` で検証します。

## 5. 本文構成

リファレンスに一律の章構成は設けません。対象を引きやすい単位で、見出しと表を構成します。

- 文体は「です・ます」体を既定とします。guide と同じ読み手向けの説明文書として統一し、1 つのリファレンス内で「である」体と混在させません。
- 一覧表には、少なくとも項目の識別子または名称と、その意味・用途を含める。
- 複数の類似項目を扱う場合は、比較に必要な観点を同じ列で示す。
- 参照先が多い場合は、対象領域ごとに見出しを分け、見出しだけで探せるようにする。

## 6. 更新と正本の管理

- 正本となる規約、スキーマ、CLI の公開インターフェースを変更したときは、対応するリファレンスも同じ変更で見直す。
- リファレンスにしか存在しない値や規則を追加しない。必要なら先に standard、rulebook、スキーマ、または実装の正本を更新する。
- リファレンスの追加・移動・改名時は、リンク元、VitePress サイドバー、文書インデックスを更新する。
- 廃止したリファレンスは削除前に `supersedes` と参照リンクを移行する。

## 7. 禁止事項

- リファレンスを、規約の唯一の正本として扱わない。
- 一連の作業手順や判断理由を長文で重複記述しない。
- 更新元が不明な静的コピーを、最新の一覧や仕様として掲載しない。
- `reference` を exec plan の `reference_materials` の種別として扱わない。
- `導入ブロック` の3ブロックを省略しない。ラベル名を変えない。順序を入れ替えない。
