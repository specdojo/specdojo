---
specdojo:
  id: prj-0001:pjr-0jvb-exec-cycle-skip-human-tasks
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: review
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-22T23:53:44Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-561Q
  commit_type: fix
  commit_scope: exec
---

# PJR-0JVB exec cycle が agent を指定すると人の確定のタスクを拾って失敗する

## 1. 課題内容

11-23 朝の exec cycle が第 3 波の完成版確定（execution: human）13 件を edit として拾い、plan の生成で止まって failed になった。agent を指定した自動の実行でも人のタスクを外す

## 2. 入力

- 2026-11-23 の朝の exec cycle（JBR-exec-cycle-eb11b9add2df）の stderr に、`T-KATA-WAVE-3-*-140` の 13 件で「has execution: human; claim it to create and use its result instead of a plan.」が出て、auto=failure になった
- 見立て（未確認）: src/exec/run/schedule-prepare.ts は agent の候補が無いときだけ人のタスクを止める。cycle が --edit-by で agent を渡すと、この判定を通り抜けて src/exec/plans-generation.ts の plan の生成で止まる
- PJR-561Q の記録では、--auto は execution: human のタスクを自動で飛ばしていた

## 3. 影響範囲

| 観点         | 影響                                                                 |
| ------------ | -------------------------------------------------------------------- |
| スコープ     | `src/exec/run/schedule-mode.ts`、`src/exec/run/schedule-prepare.ts`  |
| スケジュール | 影響なし                                                             |
| コスト       | 人のタスクで plan 生成が失敗し cycle が failure になる無駄がなくなる |
| 品質         | 自動選択が人のタスクを拾わない。`--by` 等の明示指定は従来どおり      |
| 関係者       | DEV                                                                  |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                  |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | `--edit-by` / `--review-by` で agent 候補が作られると、`prepareSingleTask` の人のタスク判定が候補なしの分岐にしか無く、素通りして plan 生成で失敗した |
| 対応策   | 自動選択で `--by`・`--executor-by`・タスク固定 agent の無い人のタスクを skip し、`prepareSingleTask` でも同条件を override 解決の前に判定する         |
| 依存事項 | なし                                                                                                                                                  |
| 完了条件 | 下の箇条書きのすべてを満たす                                                                                                                          |

- `exec cycle` と `exec run --auto` で、`--edit-by`・`--review-by` で agent を指定していても、`execution: human` のタスクを自動の実行の対象から外す。人が `--by <nickname>` で明示したときの動きは変えない（1 回目で済み）。
- 人のタスクだけが残って実行できるタスクがないときは、`exec run --auto`（dry-run を含む）と `exec cycle` を失敗にせず、実行できるタスクがない旨と、人の確定を待つタスクの数を出して終了コード 0 で終える。人のタスクのほかに実行できないタスク（準備の失敗など）があるときは、今までどおり失敗にする。
- 単体テストを足す（agent を指定した自動の実行で人のタスクを飛ばすこと、人のタスクだけが残ったときに終了コード 0 で終えること、準備の失敗があるときは失敗にすること）。
- 2 回目の実行（2026-11-23）: 1 回目は人のタスクを飛ばすようにしたが、飛ばしたタスクも ready の数（`readyCount`・`lastReadyCount`）に数えるため、人のタスクだけが残ると「no executable tasks」で終了コード 1 のままだった（prj-0001 の dry-run で確かめた）。また単体テストを足していなかった。上の 2 つ目と 3 つ目を満たす。起票のときの完了条件がこの個票に入っていなかったのはオーケストレーターの誤りで、この回で入れ直した。
- runner の動きを変えるため、統合の後に orchestrator が `exec smoke` を流し、prj-0001 で `exec run --auto --dry-run --edit-by sol-executor` が終了コード 0 で終わることを確かめてから close する。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` など）は変えない。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証を通す。

## 5. 対応結果

- `schedule-mode.ts` の準備ループで、明示 agent の無い人のタスクを skip（ログ出力）するようにした。
- `schedule-prepare.ts` の人のタスク判定を override 解決の前へ移し、mode 単位の `--edit-by` / `--review-by` は明示 agent に数えないようにした。
- 2 回目: 飛ばした人のタスクを `readyCount`（dry-run）・`lastReadyCount` から除き、`humanWaiting` として別に数えるようにした（`schedule-mode.ts`）。人のタスクだけが残ったときは「no executable tasks — N task(s) waiting for human completion — exit」を出して終了コード 0 で終える。準備の失敗など実行できないタスクがあるときは従来どおり失敗にする。メッセージは `noTaskMessage` に集約した。
- 単体テスト `tests/src/exec/run/human-task-skip.test.ts` を追加した（`--edit-by` 指定でも人のタスクを飛ばすこと、人のタスクだけが残ったとき dry-run・通常とも終了コード 0 になること、準備の失敗があるときは終了コード 1 になること）。ローカルで vitest・`tsc -b`・eslint は通過した。
- 確認: 型・単体テスト・lint の全件は親 runner の検証に委ねる。`exec smoke` は統合後に orchestrator が流す（executor は実行しない）。
- 再発防止: mode 単位の override は人のタスクの許可にならない、という規則をコードコメントに残した。

### 5.1. CHANGELOG に書く事項

- 区分: Fixed
- 文案: `exec cycle` と `exec run --auto` が `--edit-by` / `--review-by` 指定時に `execution: human` のタスクを拾って失敗する問題を修正した。人のタスクだけが残ったときは、待ちの数を表示して終了コード 0 で終える。

## 6. 関連ドキュメント

- `PJR-561Q`（派生元）
