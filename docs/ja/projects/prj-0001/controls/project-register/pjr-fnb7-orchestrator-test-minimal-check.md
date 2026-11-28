---
specdojo:
  id: prj-0001:pjr-fnb7-orchestrator-test-minimal-check
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-15T14:18:16Z"
  due_on: "2026-11-30"
  completed_at: "2026-11-26T12:17:27Z"
  conclusion: 対話型オーケストレーターのテストを Vitest で最小限確かめる仕組み（test:agent）を作った
  derived_from:
    - PJR-3R8F
  commit_type: test
  commit_scope: exec
---

# PJR-FNB7 対話型オーケストレーターのテストを Vitest で最小検証する

## 1. 概要

Quick Start の代表的な対話 1 本を、固定の発言のシナリオで実オーケストレーターに流し、承認前後の状態を機械的に確かめる

## 2. 入力

- PJR-3R8F の暫定のお勧め（D：Vitest を中心とする独自構成を土台にし、対話の出来の採点が要るときに Promptfoo を足す）を確かめるための最小検証である（2026-11-15、利用者が進め方を承認）
- Quick Start の代表的な対話（起票の提案 → 承認 → 実行）を、利用者の発言を固定したシナリオにする。実オーケストレーター（claude CLI の会話の継続）を一時 Git リポジトリで動かす
- 合否条件: 承認の発言の前に、個票・イベント・Git の HEAD と作業ツリーが変わっていない。承認の後に、期待した個票・イベント・commit がある。N 回（例: 5 回）流して合格率と所要時間・費用を記録する
- 実 agent を呼ぶため npm test には入れず、任意のテスト群（別の script）とする。結果を PJR-3R8F の採択理由に書き、3R8F を決める材料にする

## 3. 完了条件

- Quick Start の代表的な対話（起票の提案 → 承認 → 実行）を、利用者の発言を固定したシナリオとして、実オーケストレーターで一時 Git リポジトリに流せる。
- 承認の発言の前に、個票・イベント・Git の HEAD と作業ツリーが変わっていないことを機械的に確かめる。
- 承認の後に、期待した個票・イベント・commit があることを機械的に確かめる。
- N 回（例: 5 回）流した合格率と、所要時間・費用を記録する。
- 実 agent を呼ぶテストは `npm test` に入れず、別の script で流せる。
- 結果を PJR-3R8F の採択理由に書き、3R8F を決める材料にする。

## 4. 作業内容

| No  | 作業                                                                                  | 担当 | 状態 | メモ                                                                                                                     |
| --- | ------------------------------------------------------------------------------------- | ---- | ---- | ------------------------------------------------------------------------------------------------------------------------ |
| 1   | Quick Start の対話を固定の発言のシナリオにする                                        | BA   | done | 「機能追加を起票する（todo）」の利用者の 3 発言を `QUICK_START_TODO_SCENARIO` に固定した                                 |
| 2   | 一時 Git リポジトリで実オーケストレーターを流し、承認前後の状態を検査するテストを書く | BA   | done | `tests/agent/orchestrator-quick-start.agent.test.ts` と `vitest.agent.config.ts` を追加した                              |
| 3   | N 回流して合格率・時間・費用を記録し、PJR-3R8F に書く                                 | BA   | open | 実 agent の起動と利用枠の消費が要るため executor の sandbox では流せない。利用者が流して結果を PJR-3R8F の採択理由に書く |

## 5. 対応結果

- シナリオ: Quick Start の「機能追加を起票する（todo）」の利用者の発言を 3 つに固定した（依頼 → 項目の回答 → 承認）。2 発言目には topic `add-faq-section` を足し、期待する個票の名前を決めている。
- 実行の仕組み: 一時 Git リポジトリでビルド済みの specdojo を `npx specdojo` で呼べるようにし、`specdojo init --yes --provider claude` の結果を commit してから、`claude -p --output-format json --agent specdojo-orchestrator` を `--session-id` / `--resume` で会話を継続して流す。起動の引数は `buildOrchestratorLaunch` で組み立て、`--setting-sources project` と `--strict-mcp-config` で利用者の設定を持ち込まない。Bash は `npx specdojo`・`specdojo` と読み取りの git だけを許す。
- 承認の前の検査: 1・2 発言の後に、HEAD、`git status --porcelain`、個票（`pjr-*.md`）とイベント（`events/pjr-*.yaml`）の内容のハッシュが初期状態と同じかを比べる。
- 承認の後の検査: 新しい個票とイベントがそれぞれ 1 つ、個票の `item_type`・`item_status`・`priority`・`owner`・`due_on`・`difficulty` が期待どおり、最初のイベントが `add`、HEAD が進み両ファイルが commit に含まれ、作業ツリーがきれいなことを確かめる。
- 記録: run ごとの合否・失敗理由・返答・所要時間・費用（`total_cost_usd`）と合格率を `tmp/agent-test/orchestrator-quick-start-<時刻>.json` に書き、要約を標準出力に出す。回数は `SPECDOJO_AGENT_TEST_RUNS`（既定 5）、モデルは `SPECDOJO_AGENT_TEST_MODEL`（既定 `sonnet`）で変える。
- `npm test` との分離: `*.agent.test.ts` を unit の対象から外し、`vitest.agent.config.ts` だけで流す。判定部分は agent を呼ばない単体テスト `tests/agent/helpers/orchestrator-scenario.test.ts` で確かめた。
- `package.json`: executor から編集できないため、オーケストレーターが利用者の承認（2026-11-26）のもとで `"test:agent": "npm run build && vitest run --config vitest.agent.config.ts"` を足した。
- N 回の実行（2026-11-26、オーケストレーター）: `SPECDOJO_AGENT_TEST_RUNS=5` で 5 回中 4 回合格（80%）、合計 154 秒、約 0.83 USD。不合格の 1 回は試験の一時リポジトリでの権限の確認による停止。結果は PJR-3R8F の採択理由に書いた。仮の ID が `Refs:` に残る食い違いは PJR-V8ND で扱う。

## 6. 関連ドキュメント

- [[prj-0001:pjr-3r8f-orchestrator-agent-test-tool-selection]]
