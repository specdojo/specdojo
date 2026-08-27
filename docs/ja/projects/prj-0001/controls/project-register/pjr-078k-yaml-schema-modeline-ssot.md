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
  block_reason: "agent exited with non-zero code: runner validation `test-unit`（`npm run test:unit`）が exit 1 で失敗している。88テストファイル中1件、1298テスト中2件が失敗しており、modeline を正とした schema パス解決と rulebook frontmatter 非依存の挙動を検証する tests/sr…"
---

# PJR-078K YAMLのschema定義をmodelineへ集約する

## 1. 概要

YAML の schema 対応が3か所に分散している。.vscode/settings.json の yaml.schemas が13パターン、package.json の検証スクリプトが13本、rulebook frontmatter の schema 宣言が2本である。前二者は同じ対応を別形式で持ち、既に6件が片方にしか存在しない。rulebook 経由の解決は106本中2本しか宣言がなく、未宣言だと plan から schema 検証の指示が落ちる。yaml-language-server の modeline を正本とし、各 YAML が自身の schema を宣言する形へ集約する。_SCHEMA_REF_ も modeline から展開する。VS Code のライブ検証はツール側が modeline を優先するため設定なしで効き、他のツールからも同じ宣言を読める。

## 2. 完了条件

- `docs/` 配下の YAML 成果物が `# yaml-language-server: $schema=` の modeline を持つ。対象は89件である。schema 検証が不要なものは、その旨が判別できる。
- **テンプレート（`docs/ja/specdojo/templates/`）は schema 検証の対象外とする**。`_PROJECT_ID_` などのプレースホルダを含み、そのままでは schema を満たさないためである。ただし modeline は付与する。生成される成果物へ引き継がれ、かつ編集時にエディタの補完が効くためである。検証対象から外れることが機械的に判別できる形にする。
- **サンプル（`docs/ja/specdojo/samples/`）は schema 検証の対象とする**。完成例であり schema を満たすべきものである。現時点で満たさないサンプルがあれば、修正するか、対象外とする理由を記録する。
- 検証範囲を変更した結果、従来のグロブ指定では対象外だったファイルが新たに対象へ入る。**入った結果として失敗するものがないこと**を確認する。1回目の実行では104件が失敗した。
- **modeline を持たない YAML を検出できる**。書き忘れたファイルが黙って検証対象から外れる状態を作らない。現在はグロブ指定のため新規ファイルも自動的に対象になっており、移行でカバレッジを下げない。
- **modeline のパスが実在する schema を指すことを検証できる**。パスが誤っていてもエディタは黙って検証しないだけで気づけないため、機械的に確認する。
- YAML テンプレート30本が modeline を持ち、`deliverable scaffold` で生成されるファイルへ引き継がれる。新規ファイルが最初から modeline を持つ。
- `_SCHEMA_REF_` が対象ファイルの modeline から解決される。rulebook frontmatter の `schema` 宣言に依存しない。未宣言により plan から schema 検証の指示が落ちる現状を解消する。
- `package.json` の schema 検証スクリプトが集約される。全 YAML を走査して各自の modeline で検証する形とし、schema とグロブの対応をスクリプト側に持たない。
- `.vscode/settings.json` の `yaml.schemas` をどう扱うかを判断する。modeline が優先されるため削除できるが、modeline 未付与ファイルの保険として残す選択もある。判断した理由を記録する。
- 現在 `settings.json` と検証スクリプトで食い違っている6件（`dct` / `pm-roles` / `sch-defaults` がエディタのみ、`exec-defaults` / `job-run` / `sch-assessment` が CI のみ）が解消する。
- `rulebook` frontmatter の `schema` 宣言をどうするか判断する。役割を失うため削除できるが、残す場合は modeline との関係を明示する。schema は実践の型ではないため、PJR-3N21 の決定とは矛盾しない。
- `package.json` と `.specdojo/exec-defaults.yaml` は agent の保護対象であり書き込めない。必要な変更内容を result へ具体的に記載し、オーケストレーターが承認のうえ適用する。agent 自身は変更しない。
- `npm run validate:schema`、`npm run lint:md`、`npm run lint:fm`、`npm run test:unit`、`npm run test:integration` が成功する。**検証の失敗を残したまま完了としない。**

### 調査済みの事実

- `.vscode/settings.json` の `yaml.schemas` は13パターン、`package.json` の `validate:schema:*` は13本で、同じ対応を別形式で保持している。両者を突き合わせると6件が片方にしか存在しない。
- `src/kata.ts` は rulebook frontmatter の `schema` を正としているが、宣言している rulebook は106本中2本のみで、うち1本は `none` である。
- `src/exec-plans.ts` のコメントに「The agent cannot derive the schema path on its own (it would have to hunt for it and risks burning its turn)」とあり、agent が自力で schema を特定できない前提で `_SCHEMA_REF_` の埋め込みが設計されている。解決できない場合は schema 検証の指示自体が plan から削除される。
- `redhat.vscode-yaml` は devcontainer に含まれ、`yaml.validate` / `completion` / `hover` はいずれも有効である。modeline は `yaml.schemas` より優先されるため、段階的な移行の間も検証が途切れない。
- 単一ファイルを検証する `validate:schema:file` は既に存在する。
- 対象は `docs/` 配下の YAML 89件、テンプレート30件である。

## 3. 作業内容

| No  | 作業                                                   | 担当 | 状態    | メモ                                                                                    |
| --- | ------------------------------------------------------ | ---- | ------- | --------------------------------------------------------------------------------------- |
| 1   | テンプレートへ modeline を追加する                     | ARC  | done    | 30件すべてに付与し、`validate=false reason=template` を併記                             |
| 2   | 既存 YAML へ modeline を付与する                       | ARC  | done    | 非 schema YAML 89件中86件に modeline、3件に `schema none` を付与                        |
| 3   | modeline の欠落とパスの誤りを検出する検証を追加する    | ARC  | done    | `validate-yaml-schema.ts --modeline` を追加                                             |
| 4   | `_SCHEMA_REF_` の解決を modeline からに変更する        | ARC  | done    | `src/kata.ts` の schema 解決を対象 YAML の modeline 読み取りへ変更                      |
| 5   | 検証スクリプトを集約し、settings.json の扱いを判断する | ARC  | partial | `.vscode/settings.json` の `yaml.schemas` は削除。`package.json` は保護対象のため未適用 |

## 4. 対応結果

- `docs/` 配下の非 schema YAML 89件を走査し、86件に
  `# yaml-language-server: $schema=<relative-schema-path>` を付与した。内部 schema が未整備の
  `gl-sample.yaml`、`ifx-api-sample.yaml`、`ifx-msg-sample.yaml` は
  `# specdojo-schema: none reason=<reason>` で対象外理由を明示した。
- `docs/ja/specdojo/templates/` 配下の YAML template 30件はすべて modeline を持つ。完成前の
  placeholder を含むため、modeline に加えて `# specdojo-schema: validate=false reason=template` を併記し、生成先へ modeline が引き継がれる形にした。
- `ifx-cmd` は内部 schema が無かったため、`docs/specdojo/schemas/v1/ifx-cmd.schema.yaml` を追加し、sample と template の modeline から参照するようにした。
- `tools/docs/src/validate-yaml-schema.ts` に `--modeline` を追加した。既存の `--schema` / `--data` による単一 schema 検証は維持しつつ、modeline 走査では schema 欠落、schema パス不在、対象外理由なしを検出できる。
- `_SCHEMA_REF_` は `src/kata.ts` の `resolveDeliverableSchemaRef` が対象 YAML の modeline から repo 相対 schema パスを解決する形に変更した。`src/exec-plans.ts` と `src/schedule-assessment.ts` はこの解決結果を使用し、rulebook frontmatter の `schema` へ依存しない。
- rulebook frontmatter の `schema` 宣言は役割を失うため、`dct-index-rulebook.md` と `ifx-cmd-rulebook.md` から削除した。あわせて `rulebook-frontmatter.schema.yaml` から `schema` プロパティを削除した。
- `.vscode/settings.json` の `yaml.schemas` は削除した。modeline 欠落は `--modeline` 検証で検出できるため、VS Code 側に保険として重複した対応表を残さない判断とした。
- `package.json` の `validate:schema:*` 集約は、個票の保護対象条件に従い agent では未適用とした。オーケストレーター承認後に、個別13本を削除して
  `validate:schema:file` を維持し、`validate:schema` を
  `tsx tools/docs/src/validate-yaml-schema.ts --modeline` へ差し替える必要がある。
- `result` は reporter 専有のため、本 executor では作成・更新していない。

## 5. 関連ドキュメント

- 文書メタデータの規約: [[specdojo:document-metadata-standard|文書メタデータ標準]]
- 実践の型の正本を定めた決定: [[prj-0001:pjr-3n21-kata-declaration-ssot-split|PJR-3N21 実践の型の要否と所在の正本を分ける]]
- 実装: `src/kata.ts`（schema の解決）、`src/exec-plans.ts`（`_SCHEMA_REF_` の埋め込み）、`tools/docs/src/validate-yaml-schema.ts`
- 対象設定: `.vscode/settings.json` の `yaml.schemas`、`package.json` の `validate:schema:*`
