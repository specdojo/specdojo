---
specdojo:
  id: prj-0001:pjr-3r8f-orchestrator-agent-test-tool-selection
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: medium
  owner: BA
  registered_at: "2026-11-02T12:06:35Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-V5AZ
---

# PJR-3R8F SpecDojo の対話型オーケストレーターを検証する agent テストツールを選定する

## 1. 背景

Quick Start の対話を実際のオーケストレーターで検証するため、Promptfoo・Inspect AI・DeepEval・Vitest を中心とする独自構成を比較し、SpecDojo に適した採用案と理由、導入方針を選定する。

PJR-V5AZ の対話ベースの Quick Start 改訂を背景とする。利用者は候補の比較調査と、SpecDojo に適切な採用案の選定を依頼した。担当は BA、期限は 2026-11-30 と合意した。ツール導入や実装は本項目の選定後の作業として分ける。

### 1.1. 比較観点

- 複数ターンの対話、固定した利用者発言による再現と利用者シミュレーション。
- 実際に利用するオーケストレーターとの接続方法、provider ごとの対応範囲と追加実装量。
- 不足事項の確認、提案・承認・実行の順序、承認前に状態変更が起きていないことの検査。
- ツール・コマンドの実行履歴、設定・個票・イベント・Git の状態による結果の検査。
- 再現性、反復時の成功率、モデルによる採点と機械的な合否判定の役割分担。
- 既存の TypeScript・Vitest との共存、CI 連携、隔離環境、実行時間、費用、ライセンス、データ送信先、保守負担。

### 1.2. 判断を完了する条件

- 各候補の公式資料を確認し、比較表に根拠と未確認事項を記録する。
- 単にモデルへ指示文を渡す評価と、実オーケストレーターの実行環境を使う評価を区別し、どこまで検証できるか示す。
- 採用案と理由、他案を採用しない理由、制約、追加検証が必要な点を記録する。
- Quick Start の代表的な対話を使う最小検証の手順と合否条件を示し、実施済みの結果と未実施の計画を区別する。
- 導入方針と後続作業を整理し、決定者による承認を記録する。導入・実装・設定変更を本項目だけで承認済みとは扱わない。

## 2. 検討した選択肢

以下は比較対象であり、優劣は調査後に記録する。必要な追加候補を調査し、採用案が複数ツールの併用になる場合も構成と理由を明示する。

| 選択肢 | 内容                        | 利点                               | 懸念                                          |
| ------ | --------------------------- | ---------------------------------- | --------------------------------------------- |
| A      | Promptfoo                   | _TODO_: 公式資料と検証に基づき記録 | _TODO_: 接続方法と運用上の制約を確認          |
| B      | Inspect AI                  | _TODO_: 公式資料と検証に基づき記録 | _TODO_: 接続方法と運用上の制約を確認          |
| C      | DeepEval                    | _TODO_: 公式資料と検証に基づき記録 | _TODO_: 接続方法と運用上の制約を確認          |
| D      | Vitest を中心とする独自構成 | _TODO_: 既存資産との共存を評価     | _TODO_: 対話継続と agent 接続の実装負担を評価 |

## 3. 決定内容

_UNDECIDED_: 比較調査後に採用案を選定する。起票時点で採用するツールは決定していない。

## 4. 採択理由

- _TODO_: 判断根拠を記載する。

## 5. 承認

| 項目     | 内容   |
| -------- | ------ |
| 決定者   | _TODO_ |
| 決定日   | _TODO_ |
| 承認方式 | _TODO_ |
| 証跡     | _TODO_ |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 6. 影響範囲とフォローアップ

| 項目       | 内容                                                                               |
| ---------- | ---------------------------------------------------------------------------------- |
| 影響範囲   | SpecDojo の対話型オーケストレーターの評価方法とテスト構成                          |
| 必要な対応 | 比較調査、採用案と理由の選定、最小検証と導入方針の整理。導入・実装は後続作業とする |
| 追跡先     | PJR-V5AZ。選定後の導入・実装項目は未起票                                           |

## 7. 関連ドキュメント

- [[prj-0001:pjr-v5az-quick-start-conversation-flow]]
- [[specdojo:quick-start-guide]]
- [[specdojo:orchestrator-operation-guide]]
- [Promptfoo: Simulated User](https://www.promptfoo.dev/docs/providers/simulated-user/)
- [Inspect AI: Using Agents](https://inspect.aisi.org.uk/agents.html)
- [DeepEval: Multi-Turn Test Case](https://deepeval.com/docs/evaluation-multiturn-test-cases)
