---
specdojo:
  id: prj-0001:pjr-vky2-register-sync-branch-split-impl
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-27T10:11:56Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-EVWA
---

# PJR-VKY2 register_sync のブランチを sync/register と sync/exec-events に分ける

## 1. 概要

PJR-EVWA の決定に従い、register_sync の専用ブランチを project/`<id>`/sync/register と project/`<id>`/sync/exec-events の 2 本に分け、設定・コマンド・CI・hook を対応させる

## 2. 入力

- PJR-EVWA で D を採った（indie、2026-11-27）。名前は exec-events とし、exec は使わない
- 登録簿の個票とイベント（controls/project-register/）は sync/register、execution/exec/events/ は sync/exec-events に載せる
- 今の作りでは exec run --register は登録簿だけ、schedule の task の実行は exec の events だけを記帳する。両方へ書く場合の順番と片方が失敗したときの扱いはこの todo で決めて個票の対応結果に記録する
- 今の project/`<id>`/register からの移し替えは、実行中の run がない時に行う

## 3. 完了条件

- register_sync を有効にした project で、登録簿の個票とイベント（`controls/project-register/`）は `project/<id>/sync/register` に、`execution/exec/events/` は `project/<id>/sync/exec-events` に記帳して push する。
- 設定は `sync` を軸に、ブランチごとの置き場を書ける形にしている。キーの名前と、今の `register_sync` との互換の扱いは executor が決め、理由を個票の対応結果に書いている。
- push・merge・guard・check のコマンド、exec run の後の自動取り込み、CI（`.github/workflows/check-register-push.yml`）、lefthook の `register-branch-guard`、専用の worktree の置き場を、2 本に対応させている。
- 1 回の操作が両方のブランチへ書く場合の順番と、片方が失敗したときの扱いを決め、個票の対応結果に書いている。今の作りでは両方へ書く操作はない（`exec run --register` は登録簿だけ、schedule の task の実行は exec の events だけを記帳する）。
- 今の `project/<id>/register` から 2 本へ移し替える手順を、個票の対応結果と関係する guide（`docs/ja/specdojo/guides/`）に書いている。実際の移し替えは、実行中の run がないときにオーケストレーターが行う。
- 保護された設定（`.specdojo/`・`lefthook.yml`・`package.json` など）の変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書いている。反映は利用者の承認のもと feature ブランチで行う。
- `docs/ja/specdojo/references/command-reference.md` と設定リファレンスを、変えたコマンドと設定に合わせている。
- CHANGELOG の書き方は運用メモの決まりに従い、公開済みの版の節は変えていない。
- 作業を終える前に `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通している。親の検証の `test-integration` が通っている。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
