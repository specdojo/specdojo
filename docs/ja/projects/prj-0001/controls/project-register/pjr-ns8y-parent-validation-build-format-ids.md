---
specdojo:
  id: prj-0001:pjr-ns8y-parent-validation-build-format-ids
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-10-12T06:06:51Z"
  due_on: "2026-10-31"
  completed_at: "2026-10-18T17:53:53Z"
  conclusion: 親検証の許可リストに build（npm run build）と format-check（npm run format:check）を加え、プロダクトリポジトリへ割り当てられるようにした。schema・init・ガイド・リファレンスを合わせ、テストを加えた
---

# PJR-NS8Y parent_validations の許可リストにプロダクトリポジトリ向けの build と format の ID がない

## 1. 課題内容

parent_validations の { id, repo } でプロダクトリポジトリの検証を親 runner に任せられるが、許可リストは validate-schema・typecheck・test-unit・test-integration・lint-ts・lint-fm・lint-md だけで、build や format:check がない。agent の sandbox では npm を実行できないため、プロダクトリポジトリのビルドと整形の検査は毎回人が確認している

## 2. 影響範囲

| 観点         | 影響                                                                           |
| ------------ | ------------------------------------------------------------------------------ |
| スコープ     | `repos` を宣言した別リポジトリ構成で、プロダクトリポジトリのビルドと整形の検査 |
| スケジュール | 項目ごとに orchestrator のビルド確認を待つ                                     |
| コスト       | 毎回の手動確認                                                                 |
| 品質         | 統合前にビルドと整形が検査されず、統合後に人が見つけることになる               |
| 関係者       | 別リポジトリ構成で exec を使う利用者と orchestrator                            |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                    |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | `pipeline.parent_validations` の許可リスト（[[specdojo:exec-config-guide]]）は `validate-schema`・`typecheck`・`test-unit`・`test-integration`・`lint-ts`・`lint-fm`・`lint-md` の 7 種で、`build` や `format:check` に当たる ID がない |
| 対応策   | 許可リストに `build`（`npm run build`）と `format-check`（`npm run format:check`）を追加した。固定 argv で実行する方針は変えない                                                                                                        |
| 依存事項 | prj-0002 の PJR-2CQC で `specdojo-lp` に `format:check` の script を用意する                                                                                                                                                            |
| 完了条件 | `{ id: build, repo: <name> }` などで、親 runner がプロダクトリポジトリのビルドと整形の検査を実行し、結果が evidence に `source: runner` で記録される                                                                                    |

## 4. 対応結果

- 解決内容:
  - `src/exec/parent-validation.ts` の `ParentValidationId` 型および `PARENT_VALIDATION_REGISTRY` に `build`（`npm run build`）と `format-check`（`npm run format:check`）を追加した。
  - `src/commands/init.ts` の `PARENT_VALIDATION_SCRIPTS` に `build` と `format-check` を追加した。
  - `docs/specdojo/schemas/v1/exec-defaults.schema.yaml` の `ParentValidationId` enum に `build` と `format-check` を追加した。
  - `docs/ja/specdojo/guides/exec-config-guide.md` および `docs/ja/specdojo/references/command-reference.md` の親検証許可リスト説明を更新した。
  - `CHANGELOG.md` の v0.4.1「追加機能」に追記した。
  - `tests/src/exec/parent-validation.test.ts` に `build` と `format-check` の定義解決、プロダクトリポジトリへの割り当て、および未知 ID 拒否時の許可リスト一覧を確かめるテストを追加した。
- 確認結果:
  - 単体テストにて `build`・`format-check` の固定 argv 解決、プロダクトリポジトリ割り当て（`app1:build`、`app1:format-check`）の解決、未知 ID 拒否時の許可リスト確認がパスすることを確認した。
- 再発防止策:
  - 親 runner の固定 argv 解決規則とスキーマ・ドキュメントを同期させ、プロダクトリポジトリのビルド・整形検査を安全に委譲できるようにした。

## 5. 関連ドキュメント

- [[prj-0002:pjr-2cqc-lp-dev-environment]]: `specdojo-lp` の開発環境の整備。
- [[prj-0002:pjr-hepk-lp-content]]: ビルドを orchestrator が確認した項目。
- [[specdojo:exec-config-guide]]: `parent_validations` の許可リストと `{ id, repo }`。
