---
specdojo:
  id: prj-0001:pjr-grmk-catalog-validate-hook-without-catalog
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: waiting
  priority: medium
  owner: DEV
  registered_at: "2026-10-12T04:10:29Z"
  due_on: "2026-10-31"
  block_reason: "agent exited with non-zero code: agent exited with non-zero code: agent-config-write: protected configuration changes detected; paths=lefthook.yml; agent must record the required change in the result …"
---

# PJR-GRMK pre-commit の catalog-validate が catalog_path のない project で失敗する

## 1. 課題内容

lefthook の catalog-validate は project を指定せずに catalog validate を実行するため、SPECDOJO_PROJECT が catalog_path のない project（prj-0002 など）を指すシェルでは、register の記帳だけの commit でも失敗する

## 2. 影響範囲

| 観点         | 影響                                                                                                                            |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | catalog を使わない project（prj-0002）の register の記帳 commit が、catalog と無関係な検証で止まる                              |
| スケジュール | 回避策があるため影響は小さい                                                                                                    |
| コスト       | commit のたびに環境変数を外す手間がかかる                                                                                       |
| 品質         | 回避策では catalog-validate が別 project（`current_project` の prj-0001）を検証するため、検証の対象が commit の内容と一致しない |
| 関係者       | prj-0002 を扱う orchestrator と利用者                                                                                           |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                   |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | `lefthook.yml` の catalog-validate は glob `docs/ja/projects/**` で起動し、`catalog validate` を `--project` なしで実行する。project は環境変数 `SPECDOJO_PROJECT` から解決され、`catalog_path` のない prj-0002 を指すと exit 1 になる |
| 対応策   | `catalog_path` のない project では catalog-validate を飛ばす。利用者が承認した方針（2026-10-12）                                                                                                                                       |
| 依存事項 | なし                                                                                                                                                                                                                                   |
| 完了条件 | `SPECDOJO_PROJECT=prj-0002` のシェルで prj-0002 の個票だけを commit したとき、catalog-validate が失敗しない。prj-0001 の catalog の不整合は、従来どおり検出する                                                                        |

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0002:pjr-hepk-lp-content]]: 記帳 commit が止まった項目。
- 再現（2026-10-12）: `/workspaces/specdojo-workspace/specdojo-prj-0002` で `SPECDOJO_PROJECT=prj-0002` のまま `git commit` を実行し、catalog-validate が `catalog_path not set for project 'prj-0002'` で exit 1 になった。回避として `env -u SPECDOJO_PROJECT git commit` で commit した。
