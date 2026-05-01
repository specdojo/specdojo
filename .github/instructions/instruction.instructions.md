---
applyTo: 'docs/ja/specdojo/instructions/**/*-instruction.md'
---

# Instruction 記述ルール

`docs/ja/specdojo/instructions` 配下の `*-instruction.md` を作成/更新するための記述ルールです。

## 1. 目的と適用範囲

- 目的は、`*-instruction.md` の章構成と記述品質を統一し、生成 AI が一貫した成果物を出力できるようにすること。
- 本ルールは `docs/ja/specdojo/instructions/` 配下の `*-instruction.md` に適用する。

## 2. 入力情報

- 対応 rulebook: `docs/ja/specdojo/rulebooks/<prefix>-rulebook.md`
- Frontmatter スキーマ: `docs/specdojo/schemas/v1/instruction-frontmatter.schema.yaml`
- メタ情報標準: `docs/ja/specdojo/standards/instruction-metadata-standard.md`
- `<prefix>` は rulebook と同一（例: `bes-index-rulebook.md` → `bes-index-instruction.md`）

## 3. 出力仕様（Frontmatter と命名）

- ファイル名は `<prefix>-instruction.md` とする。
- ファイル先頭に YAML Frontmatter を置き、最低限 `id` / `type` / `status` / `rulebook` を含める。
- instruction の Frontmatter は `docs/ja/specdojo/standards/instruction-metadata-standard.md` に従う。
- `id` は英小文字・数字・ハイフンのみを使用し、一意にする。
- H1 はファイル内で 1 つだけとし、タイトルとして使用する。

```yaml
---
id: <prefix>-instruction
type: instruction
status: draft
rulebook: <prefix>-rulebook
---
```

## 4. 標準章構成（必須）

- 章番号は `## 1.` からの連番とし、スキップしない。
- 不要章を省略する場合は、省略理由を本文に明記する。

| 章番号 | 章タイトル       | 必須 |
| ------ | ---------------- | ---- |
| 1      | 目的と前提       | ○    |
| 2      | 入力情報         | ○    |
| 3      | 出力フォーマット | ○    |
| 4      | 記述ルール       | ○    |
| 5      | 禁止事項         | ○    |
| 6      | 最終チェック     | ○    |

## 5. 記述ルール

- rulebook をそのまま複製せず、**生成 AI への実行指示**として再構成する。
- ルールの必須要件（見出し順、必須表、禁止事項、最終チェック）を落とさない。
- 参照元 rulebook の語彙と整合する（`index`/`overview` などの命名ゆれを持ち込まない）。
- 曖昧語（十分/適切/問題ない）を避け、判定可能な指示にする。
- 章への参照は章番号ではなく章タイトルで記載する（例: `出力フォーマット`）。
- 未確定事項や仮置き情報は、本文中に次の共通ラベルで記述する。
  - `_TODO_:` 後で人または生成 AI が確認・追記・修正する必要がある事項
  - `_UNDECIDED_:` 意思決定が未了で未確定の事項
  - `_ASSUMPTION_:` 現時点で仮置きしている前提・仮説

### 5.1. 章ごとの最小要件

- `目的と前提`: 生成対象、目的、対象外を簡潔に示す。
- `入力情報`: 生成に必要な情報と、未確定時の扱いを示す。
- `出力フォーマット`: Frontmatter 要件と、`target_format` に応じた出力構造を示す。
- `記述ルール`: 必須要素、表カラム、判定条件を rulebook と整合させて示す。

### 5.2. rulebook との整合と更新手順（作成・更新時）

1. 対応 `<prefix>-rulebook.md` を読み込み、`target_format`・必須章・禁止事項を把握する。
2. `<prefix>-instruction.md` の存在を確認し、新規作成またはアップサートを選択する。
3. Frontmatter を `instruction-metadata-standard.md` に従って記述する。
4. 標準章構成に従い、rulebook の内容を生成 AI への実行指示として再構成する。
5. rulebook 側で追加された「必須章」「必須表」「責務分担」を instruction 側へ反映する。
6. rulebook 側の「生成 AI への指示テンプレート」章には、`*-instruction.md` へのリンクのみを記載し、指示本文は instruction 側へ集約する。
7. `target_format: yaml` / `json` の場合は、先頭メタ項目・ルートキー・必須キー・型制約・検証手順を instruction 側に反映する。
8. `npm run -s lint:md` を実行し、エラーがないことを確認する。

## 6. 禁止事項

- 章番号なし見出し（例: `## 目的と前提`）を使用しない。
- 章番号末尾の `.` を省略しない。
- rulebook の本文をそのまま複製して instruction に貼り付けない。
- 実装詳細（SQL 全文、具体クラス名、詳細 API 設計）を記述しない。
- 曖昧語（適切に、十分に）を根拠なく使用しない。
- `_TODO_:` / `_UNDECIDED_:` / `_ASSUMPTION_:` 以外の独自ラベルを共通ルール未定義のまま追加しない。

## 7. 最終チェック

- Frontmatter が `id` / `type` / `status` / `rulebook` を満たしている。
- 章構成が `## 1.` からの連番で必須章が欠落していない。
- 禁止事項に該当する記述がない。
- `npm run -s lint:md` を実行し、エラーがない。
