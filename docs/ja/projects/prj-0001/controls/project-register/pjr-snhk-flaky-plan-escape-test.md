---
specdojo:
  id: prj-0001:pjr-snhk-flaky-plan-escape-test
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  owner: DEV
  registered_at: "2026-10-25T03:20:41Z"
---

# PJR-SNHK register-plan-escape の共通の規約の test が負荷で 5 秒の上限を超えて落ちる

## 1. 概要

`tests/src/exec/register-plan-escape.test.ts` の「approach の有無によらず、共通の規約は参照パスと要点だけを本文に載せる」が、負荷のある実行で Vitest の既定の上限（5 秒）を超えて落ちる。変更と関係のない項目の統合を止め、やり直しが要る。

- 起きたこと（2026-10-25）:
  - [[prj-0001:pjr-zg0a-empty-register-views-blank-lines|PJR-ZG0A]] の統合で、worktree の commit hook と親の検証の test-unit で 4 回続けて `Test timed out in 5000ms` で落ち、5 回目で通った。
  - [[prj-0001:pjr-50yh-markdownlint-cli2-overrides|PJR-50YH]] の親の検証でも同じ test が落ちた。
- オーケストレーターが測った時間:
  - 本体の develop で単独に流すと約 1.6 秒、全件の中では約 1.9 秒。単体テストで最も遅く、2 位（約 1.0 秒）の倍近い。
  - ZG0A の worktree で単独に流すと、1 回目は 6.5 秒で落ち、2 回目以降は約 1.5〜1.9 秒で通った。変換のキャッシュがない状態で遅くなる。
- この test は `generateRegisterPlan` を 2 回呼ぶ（approach なしと、カタログを書いて `fully-guided` の approach あり）。どこに時間がかかっているかは未確認である。

## 2. 完了条件

- この test に時間がかかる原因を調べ、個票の対応結果と報告の `handoff` に書く。
- 原因を取り除いて速くできる場合は、速くする。test が確かめる内容（両方の plan に共通の規約の参照パスと要点が載り、全文が載らないこと）は変えない。
- 速くできない場合、または速くしても 5 秒に余裕がない場合は、この test に限って上限を広げる。設定全体の `testTimeout` は変えない。広げた値と理由を test の近くのコメントに書く。
- 本番のコード（`src/`）は、test を速くするためだけには変えない。plan の生成が遅い原因が `src/` にある場合は、直さずに個票の対応結果と報告の `handoff` に書く。
- v0.4.6 の範囲とする。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG には書かない（利用者に見える変更がないため）。

## 3. 作業内容

| No  | 作業                                 | 担当 | 状態 | メモ                     |
| --- | ------------------------------------ | ---- | ---- | ------------------------ |
| 1   | 時間のかかる原因を調べる             | DEV  | open | -                        |
| 2   | 速くするか、この test の上限を広げる | DEV  | open | 設定全体の上限は変えない |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-zg0a-empty-register-views-blank-lines]]：統合が 4 回止まった項目
- [[prj-0001:pjr-50yh-markdownlint-cli2-overrides]]：親の検証で同じ test が落ちた項目
