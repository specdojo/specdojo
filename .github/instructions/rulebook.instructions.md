---
applyTo: 'docs/ja/specdojo/rulebooks/**/*-rulebook.md'
---

# Rulebook 記述ルール

`docs/ja/specdojo/rulebooks` 配下の `*-rulebook.md` を作成/更新するための記述ルールです。

## 1. 目的と適用範囲

- 目的は、`*-rulebook.md` の章構成と記述品質を統一し、参照・保守を容易にすること。
- 本ルールは `docs/ja/specdojo/rulebooks/` 配下の `*-rulebook.md` に適用する。

## 2. 入力情報

- 対象ファイル: `docs/ja/specdojo/rulebooks/<prefix>-rulebook.md`
- 構成基準: `docs/ja/specdojo/standards/rulebook-structure-standard.md`
- ファイル名・ディレクトリ構成基準: `docs/ja/specdojo/guidelines/docs-structure-guide.md`
- Frontmatter スキーマ: `docs/specdojo/schemas/v1/rulebook-frontmatter.schema.yaml`
- 参照先（必要に応じて）: `[*-sample](../samples/*-sample.md)`、`[*-instruction](../instructions/*-instruction.md)`

## 3. 出力仕様（Frontmatter と命名）

- ファイル名は `<prefix>-rulebook.md` とする。
- ファイル先頭に YAML Frontmatter を置き、最低限 `id` / `type` / `status` を含める。
- rulebook の Frontmatter は `docs/ja/specdojo/standards/rulebook-metadata-standard.md` に従う。
- `id` は英小文字・数字・ハイフンのみを使用し、一意にする。
- H1 はファイル内で 1 つだけとし、タイトルとして使用する。
- タイトル直下に英語名（1行）と目的・概要（1〜3文）を置く。
- `target_format` がある場合は、本文ルール、サンプルリンク、記述例を対象フォーマットに合わせる。
- `target_format` が未記載の場合は、サンプル拡張子、本文の記述例、用語から推測する。

## 4. 標準章構成（必須）

- `docs/ja/specdojo/standards/rulebook-structure-standard.md` の標準章構成に従う。
- 章番号は `## 1.` からの連番とし、スキップしない。
- 不要章を省略する場合は、省略理由を本文に明記する。

| 章番号 | 章タイトル                   | 必須 |
| ------ | ---------------------------- | ---- |
| 1      | 全体方針                     | ○    |
| 2      | 位置づけと用語定義           | 任意 |
| 3      | ファイル命名・ID規則         | ○    |
| 4      | 推奨 Frontmatter 項目        | 任意 |
| 5      | 本文構成（標準テンプレ）     | ○    |
| 6      | 記述ガイド                   | ○    |
| 7      | 禁止事項                     | ○    |
| 8      | サンプル                     | ○    |
| 9      | 生成 AI への指示テンプレート | ○    |

- `位置づけと用語定義` は、用語定義がない場合のみ `位置づけ` としてよい。

## 5. 記述ルール

- 各章は「何を定義する章か」が判定できる粒度で記述する。
- `本文構成（標準テンプレ）` には、対象ドキュメントの章構成を表で示し、必須/任意を明示する。
- `記述ガイド` には、章ごとの書き方、推奨表、記載例を置く。
- 共通事項は上位ドキュメントを SSOT とし、重複記載を避ける。
- 章への参照は章番号ではなく章タイトルで記載する（例: `本文構成（標準テンプレ）` のようにタイトルで参照する）。
- 用語はファイル内で統一し、`index` / `overview` などの命名ゆれを持ち込まない。
- 未確定事項や仮置き情報は、本文中に次の共通ラベルで記述する。
  - `_TODO_:` 後で人または生成 AI が確認・追記・修正する必要がある事項
  - `_UNDECIDED_:` 情報不足ではなく、意思決定が未了で未確定の事項
  - `_ASSUMPTION_:` 現時点で仮置きしている前提・仮説
- `推奨 Frontmatter 項目` は `docs/ja/specdojo/standards/deliverable-metadata-standard.md` に従う。
- `target_format: yaml` / `json` の場合は、Frontmatter と同等の先頭メタ項目、ルートキー、必須キー、型制約を実装可能な粒度で定義する。
- `ファイル命名・ID規則` は `docs/ja/specdojo/guidelines/docs-structure-guide.md` に従う。
- `サンプル` には、ファイルが存在する場合は `target_format` に合わせて次のいずれかでリンクを記載する。
  - Markdown の場合: `- 参照先: [<prefix>-sample](../samples/<prefix>-sample.md)`
  - YAML の場合: `- 参照先: [<prefix>-sample](../samples/<prefix>-sample.yaml)`
  - JSON の場合: `- 参照先: [<prefix>-sample](../samples/<prefix>-sample.json)`
    存在しない場合は「サンプル未作成。作成後にリンクを追記する」と記載する。
- `生成 AI への指示テンプレート` には、ファイルが存在する場合は、`- 参照先: [<prefix>-instruction](../instructions/<prefix>-instruction.md)`でリンクを記載する。
  存在しない場合は「instruction 未作成。作成後にリンクを追記する」と記載する。

### 5.1. 内容充実化ルール（薄いドキュメント防止）

- 各必須章には、最低 3 つ以上の具体項目（箇条書きまたは表項目）を置く。
- 「適切に」「十分に」などの抽象語だけで終わらせず、判断可能な条件を書く。
- 少なくとも 1 つは、推奨表のカラム定義（例: ID、目的、条件、判定基準、担当）を提示する。
- 要求、品質特性、テスト/受入、運用/保守、トレーサビリティの欠落有無を確認する。
- docs-contents-guide の記述が短い場合でも、類似 rulebook、一般的開発知見、PMBOK 成果物観点で必要観点を補完する。
- ただし、実装依存の詳細（SQL 全文、具体クラス名、詳細 API 設計）には踏み込まない。

## 6. 禁止事項

- 章番号なし見出し（例: `## 全体方針`）を使用しない。
- 章番号末尾の `.` を省略しない。
- 章参照を番号のみ（例: `§5` / `第5章`）で記述しない。
- rules 本文に実装詳細（SQL 全文、具体クラス名、詳細 API 設計）を書かない。
- 曖昧語（十分、適切、問題ない）を根拠なく使用しない。
- `_TODO_:` / `_UNDECIDED_:` / `_ASSUMPTION_:` 以外の独自ラベルを、共通ルール未定義のまま追加しない。
- 確定済みの内容をラベル付きのまま放置したり、ラベルを本文の代替として多用したりしない。

## 7. 作成・更新手順

1. 対象 `*-rulebook.md` を特定し、既存ファイル有無を確認する。
2. 構成基準（`docs/ja/specdojo/standards/rulebook-structure-standard.md`）との差分を洗い出す。
3. 新規作成またはアップサートで章構成と記述を反映する。
4. sampleファイルが存在する場合は、サンプルリンクを更新する。
5. instructionファイルが存在する場合は、instruction リンクを更新する。
6. 変更点を要約し、最終チェック結果を記録する。

## 8. 最終チェック

- Frontmatter がスキーマ要件（`id` / `type` / `status`）を満たしている。
- 章構成が `## 1.` からの連番で、必須章が欠落していない。
- `サンプル` と `生成 AI への指示テンプレート` が存在し、リンクが有効。
- 禁止事項に該当する記述がない。
- `npm run -s lint:md` を実行し、エラーがない。
- `target_format` が `yaml` / `json` の場合は、対応する sample が schema と整合することを確認する。
  - schema がある場合は `npm run validate:schema:file -- --schema <schema-path> --data <sample-path>` を実行する。
