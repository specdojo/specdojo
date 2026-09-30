---
specdojo:
  id: prj-0001:pjr-k1z5-parent-validations-lint
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
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

| No  | 作業                                        | 担当         | 状態 | メモ                                                                               |
| --- | ------------------------------------------- | ------------ | ---- | ---------------------------------------------------------------------------------- |
| 1   | 許可リスト・schema・テスト・docs の変更     | DEV          | open | exec run で agent が行う                                                           |
| 2   | `.specdojo/exec-defaults.yaml` で有効にする | orchestrator | done | `ee612f74` で `lint-ts`・`lint-fm`・`lint-md` を `test-integration` の前に追加した |

## 4. 対応結果

- 実施内容: `src/exec-parent-validation.ts` の `ParentValidationId` と固定の許可リストに `lint-ts`（`npm run lint:ts`）、`lint-fm`（`npm run lint:fm`）、`lint-md`（`npm run lint:md`）を追加した。既存の 4 つと同じく `shell: false` の固定 argv で実行する。
- schema: `docs/specdojo/schemas/v1/exec-defaults.schema.yaml` の `parent_validations` の `enum` に 3 つの ID を追加した。
- テスト: `tests/src/exec-parent-validation.test.ts` に、3 つの ID の解決と、未知 ID の拒否時に許可 ID 一覧へ 3 つが含まれることを確かめるテストを追加した。既存 ID の解決と未知・重複 ID の拒否のテストは変更していない。
- docs: `exec-config-guide` と `command-reference` の親検証の説明に 3 つの ID を加えた。`templates/*/exec-defaults-snippet.yaml` には親検証の例がないため変更していない。`CHANGELOG.md` の v0.3.0「追加機能」に追記した。
- 残課題: `.specdojo/exec-defaults.yaml` の `pipeline.parent_validations` へ `lint-ts`・`lint-fm`・`lint-md` を加える変更は、作業内容 No.2 として統合後に orchestrator が反映する。

2026-10-01 の評価（orchestrator）: 許可リスト・schema・テスト・docs・CHANGELOG の変更を確かめ、`tests/src/exec-parent-validation.test.ts`（18 件）と `npm run lint:ts` の通過を確認した。`templates/*/exec-defaults-snippet.yaml` には親検証の例がないため変更は不要だった。申し送りに従い、orchestrator が `.specdojo/exec-defaults.yaml` で 3 つを有効にし（`ee612f74`）、ビルド後の CLI が 3 つを `npm run lint:ts`・`lint:fm`・`lint:md` へ解決することを確かめた。

## 5. 関連ドキュメント

- [[prj-0001:pjr-cf15-glossary-term-reference-check]]
- [[prj-0001:pjr-gwyj-rulebook-sample-chapter-extraction-phase2]]
