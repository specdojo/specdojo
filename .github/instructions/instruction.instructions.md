---
applyTo: 'docs/ja/specdojo/instructions/**/*-instruction.md'
---

# Instruction 作成運用ルール

`docs/ja/specdojo/instructions` 配下の `*-instruction.md` を作成/更新するための共通運用ルールです。

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
- タイトル直下に英語名（1行）と目的・概要（1〜3文）を置く。

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

### 5.1. 章ごとの記述方針

**目的と前提**

- 何を生成するか、出力対象の成果物種別と目的を1〜3文で明示する。
- 記載粒度（例: 業務担当者が合意できるレベル）を指定する。
- 対象外事項（実装詳細など）を列挙する。

**入力情報**

- 生成に必要な情報（ID、関係者、制約、依存成果物など）を箇条書きで列挙する。
- 未確定時の扱い（未解決事項として明示する等）を記載する。

**出力フォーマット**

- Frontmatter の必須項目・値制約・記述例を示す。
- 対応 rulebook の `target_format` に応じて以下を区別する。
  - `markdown` の場合: 本文見出し順を章番号付きリストで示す。
  - `yaml` / `json` の場合: ルートキー、必須キー、ネスト構造、型制約（`enum` / `pattern` / `required`）を示す。
- 見出し名称は rulebook の章タイトルと整合させる。

**記述ルール**

- 章ごとの必須要素（必須表・カラム定義・記述条件）を指示する。
- 最低 3 つ以上の具体項目を置き、抽象語だけで終わらせない。
- `index` 系の場合は「共通原則」「採用基準」「分配方針」の有無を確認する。

**禁止事項**

- 実装依存情報（SQL 全文、具体クラス名、詳細 API 設計）を追加しない。
- 曖昧語（適切に、十分に）を根拠なく使用しない。
- rulebook 側の記述をそのまま転記しない。

**最終チェック**

- Frontmatter がスキーマ要件（`id` / `type` / `status` / `rulebook`）を満たしていることを確認する。
- 章構成が `## 1.` からの連番で必須章が欠落していないことを確認する。
- `target_format: yaml` / `json` の場合は、対応 sample が schema と整合することを確認する。
- `npm run -s lint:md` を実行しエラーがないことを確認する。

### 5.2. rulebook との整合チェック（作成・更新時）

- rulebook 側で追加された「必須章」「必須表」「責務分担」を instruction 側へ反映する。
- rulebook 側の「生成 AI への指示テンプレート」章には、対応する `*-instruction.md` へのリンクのみを記載し、指示本文は instruction 側へ集約する。
- `target_format: yaml` / `json` の rulebook では、instruction 側に以下が反映されていることを確認する。
  - 先頭メタ項目
  - ルートキーと必須キー
  - 命名規則・参照規則・型制約
  - sample / schema による検証手順

## 6. 禁止事項

- 章番号なし見出し（例: `## 目的と前提`）を使用しない。
- 章番号末尾の `.` を省略しない。
- rulebook の本文をそのまま複製して instruction に貼り付けない。
- 実装詳細（SQL 全文、具体クラス名、詳細 API 設計）を記述しない。
- `_TODO_:` / `_UNDECIDED_:` / `_ASSUMPTION_:` 以外の独自ラベルを共通ルール未定義のまま追加しない。

## 7. 作成・更新手順

1. 対応 `<prefix>-rulebook.md` を読み込み、`target_format`・必須章・禁止事項を把握する。
2. `<prefix>-instruction.md` の存在を確認し、新規作成またはアップサートを選択する。
3. Frontmatter を `instruction-metadata-standard.md` に従って記述する。
4. 標準章構成に従い、rulebook の内容を生成 AI への実行指示として再構成する。
5. rulebook 側の「生成 AI への指示テンプレート」章のリンクを更新する。
6. `npm run -s lint:md` を実行しエラーがないことを確認する。

## 8. 最終チェック

- Frontmatter が `id` / `type` / `status` / `rulebook` を満たしている。
- 章構成が `## 1.` からの連番で必須章が欠落していない。
- 禁止事項に該当する記述がない。
- `npm run -s lint:md` を実行し、エラーがない。
