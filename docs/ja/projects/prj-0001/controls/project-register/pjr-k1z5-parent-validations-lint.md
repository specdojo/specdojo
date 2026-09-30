---
specdojo:
  id: prj-0001:pjr-k1z5-parent-validations-lint
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-09-30T11:52:53Z"
---

# PJR-K1Z5 runner の親検証に lint:ts・lint:fm・lint:md を加える

## 1. 概要

親検証の固定許可リスト（ParentValidationId）に lint:ts・lint:fm・lint:md を追加し、exec-defaults の parent_validations で有効にする。agent の段階で lint エラーを検出し、統合後の npm run check まで持ち越さない

## 2. 完了条件

- `src/exec-parent-validation.ts` の `ParentValidationId` と固定の許可リストに、`lint-ts`（`npm run lint:ts`）、`lint-fm`（`npm run lint:fm`）、`lint-md`（`npm run lint:md`）を追加する。既存の 4 つと同じく shell を介さない固定の argv で実行する。
- `docs/specdojo/schemas/v1/exec-defaults.schema.yaml` の `parent_validations` の `enum` に、上の 3 つを加える。
- 3 つの ID が解決されること、既存の ID の解決と未知の ID の拒否が変わらないことを確かめる単体テストがある。
- `exec-config-guide` と `command-reference` の親検証の説明に 3 つの ID を加える。`templates/*/exec-defaults-snippet.yaml` に親検証の例があれば、そろえる。
- `.specdojo/exec-defaults.yaml` は agent が変更できない設定のため変更しない。有効にするための変更は result の申し送りに書き、統合後に orchestrator が反映する。
- `CHANGELOG.md` の v0.3.0 の「追加機能」に追記されている。
- `npm run lint:ts`、`npm run lint:fm`、`npm run lint:md` が通る。

## 3. 作業内容

| No  | 作業                                        | 担当         | 状態 | メモ                                       |
| --- | ------------------------------------------- | ------------ | ---- | ------------------------------------------ |
| 1   | 許可リスト・schema・テスト・docs の変更     | DEV          | open | exec run で agent が行う                   |
| 2   | `.specdojo/exec-defaults.yaml` で有効にする | orchestrator | open | 統合後に orchestrator が承認を得て反映する |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-cf15-glossary-term-reference-check]]
- [[prj-0001:pjr-gwyj-rulebook-sample-chapter-extraction-phase2]]
