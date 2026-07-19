---
specdojo:
  id: recipe-authoring-standard
  type: standard
  status: draft
---

# Recipe 記述標準

Recipe Authoring Standard

`docs/ja/specdojo/recipes/` 配下の各 `*-recipe.md` が従うべき章立て・記述ルール・禁止事項・運用ルールを定義します。成果物の構造・必須項目・禁止事項は対応する rulebook を正本とし、本書は「良い内容を書くための作り方」の記述方法を定義します。

## 1. 適用範囲

- 対象: `docs/ja/specdojo/recipes/` 配下のすべての `*-recipe.md`
- 目的: recipe の章構成・記述品質を統一し、書き手が良い内容を再現可能に作成できるようにする
- 成果物構造の正本: 対応する `docs/ja/specdojo/rulebooks/<prefix>-rulebook.md`
- Frontmatter 共通原則: [document-metadata-standard.md](document-metadata-standard.md)
- 成果物 Frontmatter の構築: template の `frontmatter_template` から構築する（[document-metadata-standard.md](document-metadata-standard.md) の `生成物 Frontmatter 雛形`）。この手順を recipe 本文に複製しない。
- 参照スキーマ: [recipe-frontmatter.schema.yaml](../../../specdojo/schemas/v1/recipe-frontmatter.schema.yaml)
- ファイル名・ID 規則: [docs-structure-guide.md](../guides/docs-structure-guide.md)

## 2. 見出しレベルと章番号の原則

- `#` はタイトルのみ。章は `##` から開始する。
- 章番号は 1 始まりの連番。スキップしない（例: `## 1.`, 次は `## 2.`）。
- 章番号末尾には必ず `.` を付ける。
- 章への参照は章番号ではなく章タイトルで記載する（例: `各章の書き方`）。
- タイトル直下に **英語名（1行）** を置き、その直下に **目的・概要（1〜3文）** を置く。

## 3. Frontmatter 規約

- ファイル名は `<prefix>-recipe.md` とする。
- `id` / `type` / `status` を必須とし、共通原則は [document-metadata-standard.md](document-metadata-standard.md) に従う。
- `type` は `recipe` 固定とする。
- 対応する成果物の根拠を示すため、`rulebook` と `sample`（存在する場合）を記載する。

| 項目     | 必須 | 説明                                       |
| -------- | ---- | ------------------------------------------ |
| id       | ○    | `<prefix>-recipe` 形式の一意 ID            |
| type     | ○    | `recipe` 固定                              |
| status   | ○    | `draft` / `ready` / `deprecated`           |
| rulebook | ○    | 構造の正本となる `<prefix>-rulebook` の ID |
| sample   | 任意 | 粒度・文体の参照となる `<prefix>-sample`   |

## 4. 標準章構成（`*-recipe.md`）

章構成は以下を原則とする。不要な章は省略可だが、省略理由を記載することを推奨する。

| 章番号 | 章タイトル         | 必須 | 説明                                                        |
| ------ | ------------------ | ---- | ----------------------------------------------------------- |
| 1      | このレシピの使い方 | ○    | このレシピを使う順序と確認の進め方を示す                    |
| 2      | 作成前に集める情報 | ○    | 着手前に短いメモで集める入力情報を表で示す                  |
| 3      | 全体の作成手順     | ○    | 完成までの手順を番号付きで示す                              |
| 4      | 各章の書き方       | ○    | 章ごとの問い・具体化のコツ・良い例/避けたい例を示す         |
| 5      | 深掘り手順         | 任意 | 内容が浅いときに具体化を進める順序を示す                    |
| 6      | 良い例 / 悪い例    | ○    | 観点ごとに良い例と悪い例を対比する                          |
| 7      | レビュー観点       | ○    | 作成後に確認する観点を表で示す                              |
| 8      | 仕上げチェック     | ○    | recipe 内の記述だけで判定できる整合・公開適性の最終確認項目 |

## 5. 記述ガイド

- recipe は「成果物が成立するか」ではなく「内容が良いか」を高める作り方を扱う。構造・必須項目・禁止事項の正本は対応 rulebook とし、その規約一覧を recipe 側で再定義しない。
- rulebook / sample との対応関係は frontmatter の `rulebook` / `sample` だけで示す。本文には rulebook / sample への参照（wikilink や「〜と同程度」などの照合指示）を置かない。recipe-guided 実行では recipe だけが読み込まれるため、本文中の参照は実行不能な指示になる。
- recipe 単体で成果物を組み立てられるよう、成果物の章立ては「全体の作成手順」と「各章の書き方」で recipe 自身の言葉で示す。
- 各章の書き方には、書き手が答えるべき問いを置き、抽象論で終わらせない。
- 良い例と悪い例は同じ観点で対比し、何が良し悪しを分けるかを判定可能にする。
- 推奨表のカラム（例: 観点、確認内容、良い例、悪い例）を 1 つ以上提示する。
- 未確定事項や仮置き情報は、本文中に次の共通ラベルで記述する。
  - _TODO_: 後で人または生成 AI が確認・追記・修正する必要がある事項
  - _UNDECIDED_: 情報不足ではなく、意思決定が未了で未確定の事項
  - _ASSUMPTION_: 現時点で仮置きしている前提・仮説
- リンクはファイルがある場合に記載し、ない場合はバッククォートで仮置きする。

## 6. 内容充実化（薄いドキュメント防止）

- 各必須章には、最低 3 つ以上の具体項目（箇条書き・表項目・問い）を置く。
- 「適切に」「十分に」などの抽象語だけで終わらせず、判断可能な条件を書く。
- 少なくとも 1 つの章で、対応 rulebook の本文構成と章を対応付けて書き方を示す。
- 数値目標を扱う章では、測定方法と判定タイミングまで踏み込む。
- ただし、実装依存の詳細（SQL 全文、具体クラス名、詳細 API 設計）には踏み込まない。

## 7. 禁止事項

- 章番号なし見出し（例: `## このレシピの使い方`）を使用しない。
- 章番号末尾の `.` を省略しない。
- 章参照を番号のみ（例: `§4` / `第4章`）で記述しない。
- rulebook の構造・必須項目・禁止事項を recipe 側で再定義しない。
- 本文に rulebook / sample への wikilink や照合指示（「rulebook の本文構成に従っている」「sample と同程度の粒度」など）を書かない。対応関係は frontmatter で示す。
- rulebook / recipe / sample / template の種別ごとの役割分担表を recipe 本文に置かない（参考資料全体の役割は [specdojo-reference-materials-guide.md](../guides/specdojo-reference-materials-guide.md) が扱う）。
- 曖昧語（十分、適切、問題ない）を根拠なく使用しない。
- recipe 本文に実装詳細（SQL 全文、具体クラス名、詳細 API 設計）を書かない。
- _TODO_: / _UNDECIDED_: / _ASSUMPTION_: 以外の独自ラベルを、共通ルール未定義のまま追加しない。

## 8. 運用ルール

- 対応 rulebook の本文構成が変わった場合は、recipe の各章の書き方を追従させる。
- 大量のケース列挙や実データは recipe ではなく対象成果物側に置く。recipe では「作り方」を定義する。
- 表は必要に応じて整形スクリプト（`Format Markdown Table` タスク）で揃える。
