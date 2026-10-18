---
specdojo:
  id: prj-0001:pjr-ns8y-parent-validation-build-format-ids
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-10-12T06:06:51Z"
  due_on: "2026-10-31"
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
| 対応策   | _UNDECIDED_: 許可リストに `build`（`npm run build`）と `format-check`（`npm run format:check`）を加える案。固定 argv で実行する方針は変えない                                                                                           |
| 依存事項 | prj-0002 の PJR-2CQC で `specdojo-lp` に `format:check` の script を用意する                                                                                                                                                            |
| 完了条件 | `{ id: build, repo: <name> }` などで、親 runner がプロダクトリポジトリのビルドと整形の検査を実行し、結果が evidence に `source: runner` で記録される                                                                                    |

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0002:pjr-2cqc-lp-dev-environment]]: `specdojo-lp` の開発環境の整備。
- [[prj-0002:pjr-hepk-lp-content]]: ビルドを orchestrator が確認した項目。
- [[specdojo:exec-config-guide]]: `parent_validations` の許可リストと `{ id, repo }`。
