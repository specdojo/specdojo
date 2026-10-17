---
specdojo:
  id: prj-0001:pjr-bhmh-pinned-agent-rate-limit-policy
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  owner: DEV
  registered_at: "2026-10-17T23:11:40Z"
  due_on: null
---

# PJR-BHMH agent を指定した実行で、上限のときに待つか代わりの agent へ切り替えるかを選べるようにする

## 1. 概要

exec run --register などで --executor-by により agent を指定した実行は、上限に達すると waiting で止まり、人が --resume するまで再開しない。解ける時刻まで待って同じ agent で再開する（wait）か、指定した代わりの agent へ切り替えて続ける（fallback）かを、コマンドの引数と exec-defaults の既定で選べるようにする

## 2. 完了条件

2026-10-18 時点の上限の扱い（[[specdojo:exec-config-guide]] の「実行フロー」、`.specdojo/exec-defaults.yaml` の `rate_limit_policy`）:

| 場面                                                                                                 | 扱い                                                                                                            |
| ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| schedule の自動選択（`--auto`）                                                                      | 待たずに次の優先順の agent へ切り替える（`on_critical: try_next`）。全候補が上限なら wait と backoff でやり直す |
| agent を指定した実行（`--executor-by`・`--reporter-by`、register の実行、phase の by-name の agent） | 別の agent へは切り替えず `waiting` で止まる。再開は人が `--resume` で行う                                      |

2026-10-17 の夜、`exec run --register PJR-ZJXQ --executor-by codex-expert-executor` が codex の上限（解ける時刻は 1:29）で止まり、朝まで再開されなかった。

条件:

- agent を指定した実行で、上限に達したときの扱いを次の 2 つから選べる。
  - `wait`: provider の出力から解ける時刻（`try again at 1:29 AM` などの reset / retry-after）を読み、その時刻まで待ってから、同じ agent で止まった段から再開する。解ける時刻が読めない場合は、`rate_limit_policy.cooldown_seconds` を使う。どちらも無い場合と、待つ時間が上限（例: 既定 8 時間）を超える場合は、従来どおり `waiting` で止める。
  - `fallback`: 指定した代わりの agent（例: `--fallback-executor-by claude-expert-executor`）へ切り替えて、止まった段から続ける。代わりの agent も上限なら `waiting` で止める。代わりの agent を指定していなければ `wait` と同じ扱いにするか止めるかを決め、result に書く。
- 選び方は、コマンドの引数（例: `--on-rate-limit wait|fallback|stop`、`--fallback-executor-by`・`--fallback-reporter-by`）と、`exec-defaults.yaml` の既定（例: `rate_limit_policy.pinned`）の両方で指定でき、引数が優先する。既定は従来どおり `stop`（`waiting` で止める）とし、既存の動きを変えない。
- 待つ間は、project の実行ロックを持ち続けるか、いったん放して待つかを決めて実装し、理由を result に書く（待つ間に routine や別の run が動けるようにするかどうか）。
- `wait` と `fallback` のどちらでも、どの agent でいつ再開したかを、run の記録（pipeline の状態・evidence・result）と登録簿のイベントの理由に残す。
- `exec run --register` に加え、`--plan`・`--deliverable` と、`exec resume` でも同じ指定が効く。schedule の自動選択の既存の動き（`try_next`）は変えない。
- 単体テストか統合テストで、解ける時刻を読んで待つこと（時刻は差し替えて、実際には待たない）と、代わりの agent へ切り替えることを確かめる。
- `docs/ja/specdojo/guides/exec-config-guide.md` の「実行フロー」と、`docs/ja/specdojo/references/command-reference.md` に、新しい指定と既定を書く。
- CHANGELOG に記載する場合は、未公開の版の節（`## [0.4.0] - 未定`）に書く。公開済みの版の節は変えない。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- runner のコードを変えるため、統合の後に orchestrator が `exec run --register` を 1 回流し、統合まで終わることを確かめる（本件の close の条件）。

## 3. 作業内容

| No  | 作業                                                           | 担当         | 状態 | メモ                                    |
| --- | -------------------------------------------------------------- | ------------ | ---- | --------------------------------------- |
| 1   | `wait` を実装する（解ける時刻を読んで待ち、同じ agent で再開） | DEV          | open | 時刻の読み取りは既存の reset 検出を使う |
| 2   | `fallback` を実装する（代わりの agent へ切り替え）             | DEV          | open | -                                       |
| 3   | 引数と `exec-defaults.yaml` の既定で選べるようにする           | DEV          | open | 既定は従来どおり止める                  |
| 4   | ガイドとコマンドリファレンスを更新する                         | DEV          | open | -                                       |
| 5   | 統合の後に `exec run --register` を 1 回流す                   | orchestrator | open | close の条件                            |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[specdojo:exec-config-guide]]: 実行フローと rate limit の既存の扱い。
- [[prj-0001:pjr-zjxq-register-approach-fields]]: 事象が起きた実行。
