---
specdojo:
  id: prj-0001:pjr-5hyp-agent-routing-by-difficulty
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-20T12:03:52Z"
  derived_from:
    - PJR-ZM1K
---

# PJR-5HYP 作業の難しさで agent を振り分ける設定を加える

## 1. 概要

exec-defaults.yaml に、難しさ（hard・medium・easy）ごとの executor・reporter・rate limit のときの扱い・代わりの agent を書く振り分けの表を加え、個票に difficulty を持たせる。exec run --register で agent を指定しないときと夜間の orchestrator は、この表で agent を選ぶ。今の自動選択は priority の小さい順で、普通の難しさに qwen-executor が選ばれるため、あわせて直す（2026-10-20、利用者が承認）

## 2. 完了条件

- 0.4.1 の範囲とする（2026-10-20、利用者が承認）。
- `exec-defaults.yaml` に振り分けの表（例: `routing`）を加える。難しさ（`hard`・`medium`・`easy`）ごとに、executor・reporter・rate limit のときの扱い（wait・fallback・stop）・代わりの executor と reporter を書ける。名前は別名でも実体でもよい。
- 個票の frontmatter に `difficulty`（`hard`・`medium`・`easy`）を加え、`register add`・`register update` の `--difficulty` で指定できるようにする。schema と規則（[[specdojo:pjr-rulebook]]）に書く。
- `exec run --register` で `--executor-by`・`--reporter-by` を指定しないとき、個票の `difficulty` に合う振り分けの表の agent を使う。`difficulty` がない個票や、表がない設定では今の自動選択を使う。指定したオプションは表より優先する。
- 夜間の orchestrator（`orchestrator night`）も同じ表で agent を選ぶ。
- 今の自動選択が `priority` の小さい順で、普通の難しさにローカルの `qwen-executor` が選ばれる点を見直し、どう直したかと理由を result に書く。`agent-members.yaml` の冒頭の古いコメント（`Qwen -> Gemma -> Codex -> Claude`）を直す案も result に書く（保護された設定のため人が反映する）。
- 配布する `init` の `exec-defaults.yaml` の雛形に、選んだ provider に合わせた振り分けの表の例を入れる。
- 本リポジトリの `exec-defaults.yaml` に入れる振り分けの表の案（hard は sol-executor で上限のときは待ち、代わりは opus-executor、medium は flash-high-executor で代わりは sol-executor、easy は qwen-executor で docs・src・tests の外を触らない作業に限り代わりは flash-high-executor、reporter は gemma26-reporter で代わりは sonnet-reporter）を result に書く（保護された設定のため人が反映する）。
- [[specdojo:exec-config-guide]] と [[specdojo:exec-operation-guide]] に、振り分けの表と `difficulty` の使い方を書く。
- 単体テストで、`difficulty` ごとの選び方、オプションが表より優先されること、表がないときに今の自動選択になることを確かめる。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- runner のコードを変えるため、統合の後に `exec run --register` を 1 回流して動作を確かめる（PJR-JSEY）。
- CHANGELOG の `## [0.4.1] - 未定` の節に書く。公開済みの版の節は変えない。

## 3. 作業内容

| No  | 作業                                          | 担当 | 状態 | メモ         |
| --- | --------------------------------------------- | ---- | ---- | ------------ |
| 1   | 作業の難しさで agent を振り分ける設定を加える | DEV  | open | 0.4.1 の範囲 |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-zm1k-agent-members-model-alias]]（元の項目）
- [[prj-0001:pjr-6dhy-night-orchestrator-approved-queue]]（夜間の orchestrator）
