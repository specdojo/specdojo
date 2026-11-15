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

公式資料の確認に基づく暫定の比較を記録する（2026-11-15）。最小検証は未実施であり、各候補の「未確認」は検証で確かめる。

| 選択肢 | 内容                        | 利点                                                                                                                                           | 懸念                                                                                                                                                                                                   |
| ------ | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| A      | Promptfoo                   | Node で動き、設定は YAML。複数ターンの模擬利用者（`promptfoo:simulated-user`）、反復実行と合格率、モデルによる採点、JS の検査を書ける          | 模擬利用者は、相手が OpenAI 形式の会話を受け取る前提。CLI のオーケストレーターには、会話を続ける JS の custom provider を自作する。未確認: exec の script provider へ会話の履歴を渡せるか              |
| B      | Inspect AI（Inspect SWE）   | Claude Code・Codex CLI を Docker の sandbox で動かして評価できる。実 agent の評価にいちばん強い                                                | Python と Docker が前提。agent bridge で agent のモデル通信を Inspect に回すため API キーの課金になり、契約中の CLI のログインで動かす運用と合わない可能性がある。既存の TypeScript・Vitest から離れる |
| C      | DeepEval                    | Python。会話の模擬（ConversationSimulator）と会話向けの採点指標（TurnRelevancy・ConversationCompleteness など）がそろう                        | モデルによる採点が中心で、ファイル・Git の状態の検査は自分で書く。未確認: SaaS（Confident AI）へ送らない設定                                                                                           |
| D      | Vitest を中心とする独自構成 | 既存の統合テスト（一時 Git リポジトリ、偽 agent の E2E）の仕組みをそのまま使える。個票・イベント・Git の状態の検査を既存の読み取り処理で書ける | 模擬利用者とモデルによる採点はない。利用者の発言を固定したシナリオになる。実 agent を呼ぶため時間と費用がかかり、結果も毎回同じにはならない                                                            |

SpecDojo で重い観点は、承認の前に状態が変わっていないことと、実行の後の設定・個票・イベント・Git の状態の正しさである。どちらも実オーケストレーターを一時リポジトリで動かし、ファイルと Git を機械的に照らす検査で、モデルに指示文を渡して出力を採点する評価（A・C の主な用途）では確かめられない。対話の出来の採点はその次の層とする。

## 3. 決定内容

_UNDECIDED_: 最小検証の結果を見て決める。暫定のお勧めは次のとおり（2026-11-15、利用者がこの進め方を承認）。

- 土台は D とする。Quick Start の代表的な対話を利用者の発言を固定したシナリオにし、実オーケストレーターを一時リポジトリで動かす。承認の発言の前に個票・イベント・Git が変わっていないこと、承認の後に期待どおりの個票・イベント・commit があることを機械的に確かめる。実 agent を使うため `npm test` とは分けた任意のテスト群とし、N 回流して合格率を記録する。
- 対話の出来（確認の仕方、提案の分かりやすさ）を採点したくなった時点で A を足す。Node のため同じリポジトリに置ける。
- B は実 agent の評価には強いが、Python・Docker・API 課金の運用が重いため採らない。C は状態の検査が弱いため採らない。

## 4. 採択理由

- _TODO_: 最小検証の結果を受けて記載する。暫定の理由は「検討した選択肢」と「決定内容」のとおり。

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
| 追跡先     | PJR-V5AZ。最小検証は PJR-FNB7（D で Quick Start のシナリオを 1 本流す）            |

## 7. 関連ドキュメント

- [[prj-0001:pjr-v5az-quick-start-conversation-flow]]
- [[specdojo:quick-start-guide]]
- [[specdojo:orchestrator-operation-guide]]
- Promptfoo: Simulated User（<https://www.promptfoo.dev/docs/providers/simulated-user/>）
- Inspect AI: Using Agents（<https://inspect.aisi.org.uk/agents.html>）
- DeepEval: Multi-Turn Test Case（<https://deepeval.com/docs/evaluation-multiturn-test-cases>）
- Promptfoo: Custom script provider（<https://promptfoo.dev/docs/providers/custom-script>）
- Promptfoo: Chat conversations / threads（<https://promptfoo.dev/docs/configuration/chat>）
- Inspect AI: Agent Bridge（<https://inspect.aisi.org.uk/agent-bridge.html>）
- Inspect SWE: Claude Code（<https://meridianlabs-ai.github.io/inspect_swe/claude_code.html>）
- DeepEval: Conversation Simulator（<https://www.deepeval.com/docs/conversation-simulator>）
