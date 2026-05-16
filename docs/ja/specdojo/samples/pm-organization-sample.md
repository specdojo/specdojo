---
id: pm-organization
type: project
status: draft
rulebook: pm-organization-rulebook
---

# 組織定義 サンプル

## 1. 基本方針

本書は、駄菓子屋きぬや販売管理システム構築プロジェクトにおける採用ロールと `owner` 利用方針を定義する最小サンプルである。

- 本プロジェクトは店主と少人数の支援メンバーで進める小規模運用とする。
- Schedule の `owner` には採用済み Role code だけを使用する。
- 最終判断は `PO` に集約し、`PM` の管理責務は `PO` が兼務する。
- 標準ロールの一般的な責務や `owner` / `role` / `--by` の共通定義は [people-and-organization-definition-standard.md](../standards/people-and-organization-definition-standard.md) を参照する。

## 2. 採用ロール

| Role code | 正式名称 | 本プロジェクトでの扱い |
| --------- | -------- | ---------------------- |
| `PO` | Project Owner | 店主代表として目的、優先順位、最終判断を担う |
| `BA` | Business Analyst | 店舗業務の整理、販売・在庫・つけ管理の要件整理を担う |
| `ARC` | Architect | タブレット前提の構成方針とデータ管理方針を整理する |
| `QE` | Quality Engineer | 受入観点、操作確認、欠品・会計ミス防止の検証観点を管理する |

## 3. 未採用ロール

| Role code | 正式名称 | 未採用理由・代替方針 |
| --------- | -------- | -------------------- |
| `PM` | Project Manager | 小規模運用のため独立ロールは置かず、進捗・課題・リスク管理は `PO` が兼務する |
| `DEV` | Developer | 実装作業は外部支援メンバーが `ARC` 配下で担当し、独立した `owner` ロールとしては採用しない。実装タスクが継続増加した時点で追加を検討する |
| `UX` | UX / Documentation Designer | 画面文言と説明導線は `BA` が兼務し、操作説明の見直し量が増えた場合に追加を検討する |
| `OPS` | Operations / Release Manager | 単一店舗の初期運用のため `PO` が兼務し、正式リリース手順や運用引継ぎが増えた場合に追加する |

## 4. 本プロジェクトで使用できる `owner`

- `PO`
- `BA`
- `ARC`
- `QE`
- 未採用ロールおよび個人名は `owner` に使用しない。

## 5. 関連ドキュメント

- `pm-roles.yaml`: 採用 Role code を machine-readable な YAML として一覧化する。
- `pm-members.yaml`: 実際に作業する人間または agent と Role code の対応を管理する。
- `pm-raci.md`: 必要になった時点で成果物ごとの責任分担を定義する。
- [people-and-organization-definition-standard.md](../standards/people-and-organization-definition-standard.md): Role、Member、Task owner、Executor、RACI の共通定義を参照する。

## 6. 見直し条件

| 更新トリガー | 見直し内容 |
| ------------ | ---------- |
| 外部開発メンバーが継続参加し、実装タスクを `owner` 単位で分ける必要が出た | `DEV` の独立採用を再検討する |
| 店頭運用の説明や画面改善タスクが増え、利用者導線の判断を分離したくなった | `UX` の採用有無と責務境界を見直す |
| リリース手順、障害一次対応、変更管理を定常運用する必要が出た | `OPS` の独立採用と関連文書追加を検討する |
| 週次の進捗・課題管理が `PO` 兼務では回らなくなった | `PM` を独立採用し、意思決定と実行管理の境界を見直す |

## 7. 禁止事項

- 未採用ロールを Schedule の `owner` に使わない。
- 個人名を `owner` に使わない。
- agent に最終判断を委ねない。
- 標準ロールの一般責務や共通定義表を本書へ複製しない。
