---
specdojo:
  id: prj-0001:pjr-078k-yaml-schema-modeline-ssot
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  owner: ARC
  registered_at: "2026-08-27T13:50:22Z"
  due_on: "2026-09-30"
  block_reason: "agent exited with non-zero code: agent exited with non-zero code: agent-config-write: protected configuration changes detected; paths=.specdojo/exec-defaults.yaml, package.json; agent must record the …"
---

# PJR-078K YAMLのschema定義をmodelineへ集約する

## 1. 概要

YAML の schema 対応が3か所に分散している。.vscode/settings.json の yaml.schemas が13パターン、package.json の検証スクリプトが13本、rulebook frontmatter の schema 宣言が2本である。前二者は同じ対応を別形式で持ち、既に6件が片方にしか存在しない。rulebook 経由の解決は106本中2本しか宣言がなく、未宣言だと plan から schema 検証の指示が落ちる。yaml-language-server の modeline を正本とし、各 YAML が自身の schema を宣言する形へ集約する。_SCHEMA_REF_ も modeline から展開する。VS Code のライブ検証はツール側が modeline を優先するため設定なしで効き、他のツールからも同じ宣言を読める。

## 2. 完了条件

- `docs/` 配下の YAML 成果物が `# yaml-language-server: $schema=` の modeline を持つ。対象は89件である。schema 検証が不要なものは、その旨が判別できる。
- **modeline を持たない YAML を検出できる**。書き忘れたファイルが黙って検証対象から外れる状態を作らない。現在はグロブ指定のため新規ファイルも自動的に対象になっており、移行でカバレッジを下げない。
- **modeline のパスが実在する schema を指すことを検証できる**。パスが誤っていてもエディタは黙って検証しないだけで気づけないため、機械的に確認する。
- YAML テンプレート30本が modeline を持ち、`deliverable scaffold` で生成されるファイルへ引き継がれる。新規ファイルが最初から modeline を持つ。
- `_SCHEMA_REF_` が対象ファイルの modeline から解決される。rulebook frontmatter の `schema` 宣言に依存しない。未宣言により plan から schema 検証の指示が落ちる現状を解消する。
- `package.json` の schema 検証スクリプトが集約される。全 YAML を走査して各自の modeline で検証する形とし、schema とグロブの対応をスクリプト側に持たない。
- `.vscode/settings.json` の `yaml.schemas` をどう扱うかを判断する。modeline が優先されるため削除できるが、modeline 未付与ファイルの保険として残す選択もある。判断した理由を記録する。
- 現在 `settings.json` と検証スクリプトで食い違っている6件（`dct` / `pm-roles` / `sch-defaults` がエディタのみ、`exec-defaults` / `job-run` / `sch-assessment` が CI のみ）が解消する。
- `rulebook` frontmatter の `schema` 宣言をどうするか判断する。役割を失うため削除できるが、残す場合は modeline との関係を明示する。schema は実践の型ではないため、PJR-3N21 の決定とは矛盾しない。
- `npm run validate:schema`、`npm run lint:md`、`npm run lint:fm`、`npm run test:unit`、`npm run test:integration` が成功する。

### 調査済みの事実

- `.vscode/settings.json` の `yaml.schemas` は13パターン、`package.json` の `validate:schema:*` は13本で、同じ対応を別形式で保持している。両者を突き合わせると6件が片方にしか存在しない。
- `src/kata.ts` は rulebook frontmatter の `schema` を正としているが、宣言している rulebook は106本中2本のみで、うち1本は `none` である。
- `src/exec-plans.ts` のコメントに「The agent cannot derive the schema path on its own (it would have to hunt for it and risks burning its turn)」とあり、agent が自力で schema を特定できない前提で `_SCHEMA_REF_` の埋め込みが設計されている。解決できない場合は schema 検証の指示自体が plan から削除される。
- `redhat.vscode-yaml` は devcontainer に含まれ、`yaml.validate` / `completion` / `hover` はいずれも有効である。modeline は `yaml.schemas` より優先されるため、段階的な移行の間も検証が途切れない。
- 単一ファイルを検証する `validate:schema:file` は既に存在する。
- 対象は `docs/` 配下の YAML 89件、テンプレート30件である。

## 3. 作業内容

| No  | 作業                                                   | 担当 | 状態 | メモ                             |
| --- | ------------------------------------------------------ | ---- | ---- | -------------------------------- |
| 1   | テンプレートへ modeline を追加する                     | ARC  | open | 新規ファイルが継承する           |
| 2   | 既存 YAML へ modeline を付与する                       | ARC  | open | 89件。相対パスは機械的に算出する |
| 3   | modeline の欠落とパスの誤りを検出する検証を追加する    | ARC  | open | カバレッジを下げない歯止め       |
| 4   | `_SCHEMA_REF_` の解決を modeline からに変更する        | ARC  | open | rulebook 依存を解消する          |
| 5   | 検証スクリプトを集約し、settings.json の扱いを判断する | ARC  | open | 食い違い6件の解消を含む          |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- 文書メタデータの規約: [[specdojo:document-metadata-standard|文書メタデータ標準]]
- 実践の型の正本を定めた決定: [[prj-0001:pjr-3n21-kata-declaration-ssot-split|PJR-3N21 実践の型の要否と所在の正本を分ける]]
- 実装: `src/kata.ts`（schema の解決）、`src/exec-plans.ts`（`_SCHEMA_REF_` の埋め込み）、`tools/docs/src/validate-yaml-schema.ts`
- 対象設定: `.vscode/settings.json` の `yaml.schemas`、`package.json` の `validate:schema:*`
