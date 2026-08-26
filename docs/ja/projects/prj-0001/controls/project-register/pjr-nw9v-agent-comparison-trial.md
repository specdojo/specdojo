---
specdojo:
  id: prj-0001:pjr-nw9v-agent-comparison-trial
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  owner: ARC
  registered_at: "2026-08-26T08:17:39Z"
  due_on: "2026-10-31"
---

# PJR-NW9V 同一タスクを複数agentで試行し性能を比較できるようにする

## 1. 概要

agent の実力を把握する手段がない。実際のタスクで一度試すしかなく、結果は個別の result に散在して比較できない。同じタスクを worktree を分けて複数の agent で実行し、結果を比較できるようにする。現状は worktree 名とブランチ名が task ID から決まるため同一タスクの並行実行が衝突し、register の状態遷移も1つの実行しか想定していない。比較には同じ plan を与える必要がある点にも配慮する。

## 2. 完了条件

- 同一タスクを複数の agent で実行し、それぞれの成果物を独立した worktree に得られる。実行は並行でも逐次でもよい。
- 比較する agent へ**同じ plan** を与えられる。plan が実行ごとに生成されると内容が揺れ、agent の差なのか指示の差なのか判別できない。
- 試行が本来のタスクの状態を進めない。通常の実行と同じ状態遷移を行うと、1つの試行が完了扱いになり残りが実行できない。試行用の扱いを設けるか、状態を進めない実行方法を用意する。
- 比較のための記録が1か所に集まる。個別の result に散在すると比較できない。
- 客観的に測れる指標が記録される。所要時間、検証の成否、変更ファイル数、reporter が構造化出力を返せたか、形式リトライの回数などが候補である。何を記録するかは判断してよい。
- 主観的な評価（判断の質、文章の質、範囲の遵守）を人が記入できる欄がある。これらは自動では測れないため、機械的な指標と分けて扱う。
- 試行の成果物のうち採用する1つを選び、残りを破棄できる。破棄した試行の記録は残す。
- 試行結果を agent の選定へ反映する経路が示されている。`pm-members.yaml` の記述を変えるのか、別の記録に留めるのかを判断し、理由を記録する。
- `npm run typecheck`、`npm run lint:ts`、`npm run test:unit`、`npm run test:integration` が成功する。

### 現状の観測（比較したい内容の例）

PJR-0FCT を qwen-expert-executor / qwen-reporter で実行した際の観測である。こうした内容を体系的に集められる状態を目指す。

| 観点       | qwen の観測                                                     | 測り方   |
| ---------- | --------------------------------------------------------------- | -------- |
| 所要時間   | 1ファイルの規約整理に約53分（codex は実装規模の作業で10〜25分） | 機械的   |
| 判断の質   | 矛盾の構造を正しく理解し、妥当な方式を選択                      | 人の評価 |
| 範囲の遵守 | 保持すべき固定句を残した                                        | 人の評価 |
| 文章の質   | 同趣旨を繰り返す冗長な記述。推敲を要した                        | 人の評価 |
| 規約の遵守 | `register build` の実行漏れで親検証が失敗                       | 機械的   |
| 構造化出力 | reporter が3回とも JSON でなく自然文を返した                    | 機械的   |

判断の質や文章の質は自動では測れず、機械的な指標（時間、検証の成否、形式リトライ回数）とは分けて扱う必要がある。

### 調査済みの制約

- worktree 名とブランチ名は task ID から決まる（`worktreeNameFromTaskId`、ブランチは `exec/<worktree名>`）。同一タスクを複数 agent で実行すると衝突する。agent 名などを含めた命名が要る。
- `exec run --register` は register の状態遷移で実行を追跡する。同一項目に対する複数実行は想定されていない。
- `exec run --plan <path>` は既存 plan をその場で実行する（生成しない）。同じ plan を複数 agent へ与える手段として利用できる可能性がある。
- evidence は `evidence/<task>/<run>/` に run 単位で保存されるため、複数試行の証跡は共存できる。PJR-KAQV により reporter 失敗時の生ログも残る。

## 3. 作業内容

| No  | 作業                                                                 | 担当 | 状態 | メモ                                                                                  |
| --- | -------------------------------------------------------------------- | ---- | ---- | ------------------------------------------------------------------------------------- |
| 1   | 試行の実行方法を設計する                                             | ARC  | done | `exec trial run`を追加。状態遷移なしでagent別worktree/branchを作る                    |
| 2   | 同じ plan を複数 agent へ与える手段を用意する                        | ARC  | done | 既存planを1回だけ読み、全trialへ同一promptを渡してplan/promptのSHA-256を記録          |
| 3   | 比較記録の形式を決め、客観指標と主観評価を分けて記録できるようにする | ARC  | done | 中央JSONに機械指標を集約し、`exec trial rate`で人手評価を別フィールドへ記録           |
| 4   | 採用と破棄の手順を用意する                                           | ARC  | done | `adopt`で1trialを統合して残りを破棄、`discard`で全破棄。記録/evidenceは中央に保持     |
| 5   | 試行結果を agent 選定へ反映する経路を決める                          | ARC  | done | 単発結果では自動変更せず、人が反復結果を確認して`pm-members.yaml`を更新する方針とした |

## 4. 対応結果

`specdojo exec trial`を追加し、同じplanを2つ以上のagentへ渡す比較試行を、通常のSchedule/registerライフサイクルから分離した。

- `trial run`はplanを再生成せず1回だけ読み、全agentへ同一promptを渡す。比較IDとagent名を含むworktree/branchを使うため、同一task IDでも衝突しない。planとpromptのSHA-256および共通base commitを保存する。
- 比較記録を`execution_path/exec/trials/<comparison-id>/comparison.json`へ集約した。所要時間、終了コード、試行回数、変更ファイル、検証結果、executor構造化出力、reporter構造化出力・形式試行回数を客観指標として保存し、agent別のredact済みevidence/logも同じディレクトリへ中央保存する。
- `trial rate`で判断の質、文章の質、範囲の遵守を1〜5と注記で記録する。自動指標とは別の`subjective`フィールドに保持する。
- `trial adopt`は成功した1trialだけを現在branchへmergeし、ほかのtrial worktree/branchを破棄する。`trial discard`はどれも採用せず全trialを破棄する。どちらも中央の比較記録とevidenceを削除しない。
- agent選定は単一trialから自動変更しない。人が複数タスクの客観・主観結果を確認し、傾向が再現した場合に`pm-members.yaml`のpriority/capabilitiesへ反映する。この方針を各比較記録の`agent_selection`にも保存する。
- CLIの使い方と安全条件を[[specdojo:exec-operation-guide|exec運用ガイド]]およびコマンドリファレンスへ追記し、比較記録生成のunit testを追加した。

残課題はない。

## 5. 関連ドキュメント

- exec の運用: [[specdojo:exec-operation-guide|exec運用ガイド]]
- exec の設定: [[specdojo:exec-config-guide|exec設定ガイド]]
- agent の定義: `docs/ja/projects/prj-0001/030-project-management/pm-members.yaml`
- 生ログ保全（比較材料になる）: [[prj-0001:pjr-kaqv-agent-raw-stderr-retention|PJR-KAQV agent失敗時の生のstderrを保全する]]
- 実力把握の契機となった実行: [[prj-0001:pjr-0fct-test-unit-rerun-after-fix|PJR-0FCT 共通規約のtest実行に関する記述の矛盾を解消する]]
