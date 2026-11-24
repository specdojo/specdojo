---
specdojo:
  id: prj-0001:pjr-t4e0-watch-coexist-exec-watch
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-23T00:13:27Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-52EE
  depends_on:
    - PJR-40EE
  commit_type: feat
  commit_scope: exec
---

# PJR-T4E0 見張りと立ち上げたままのオーケストレーターを共存させ、exec watch を足す

## 1. 概要

手で始めた run に触らない・見張りの停止と再開・lock の尊重を扱い、次のイベントまで待つ exec watch を足す（PJR-52EE の子の 4）

## 2. 入力

- PJR-52EE を 4 件に分ける。決まった手当ては規則で行い、判断が要るものは agent に診断の案だけを書かせ（案 C）、立ち上げたままのオーケストレーターのために待つコマンドを足す（案 A）。MCP を使う案は採らない（利用者の決定、2026-11-23）

## 3. 完了条件

- オーケストレーターや人が手で始めた run・再開・直しの途中の worktree には、見張りも手当て（子の 2）も触らない。見分けは、実行中のプロセスと lock、claim の actor、手で付ける「見張りの対象外」の印で行う。
- オーケストレーターや人が、見張りをいつでも止めたり再開したりできる（全体、またはタスク単位）。
- 別の run が lock を持っている間は何もせず、次の回に回す（PJR-KVWH と合わせる）。
- `exec watch` を足す。見張り（子の 1）のイベントの記録を読み、指定した種類のイベント（止まった・終わった・waiting になった など）が新しく起きるまで待って、その内容を出して終わる。待つ上限の時間を指定でき、上限で終わったときは別の終了コードにする。
- `exec watch` はふつうの CLI のコマンドとし、後ろで流しても前で流しても使える。なくても見張りと手当ての仕組みは成り立つ。オーケストレーターの使い方（後ろで流して通知で起きる、前で流して待つ）をガイドに書く。
- オーケストレーターが手で run を流しているときに見張りと手当てが動いても、ぶつからないことを統合テストで確かめる。
- 2026-11-13〜14 の夜の実例（型のメニューの足し忘れ・commit の対象外・branch の食い違い）を、回帰テストの場面として再現する。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` など）は変えない。設定の例や変更が要る場合は、案を個票の対応結果と報告の `handoff` に書く。
- 関連する設計・ガイド・CLI リファレンスを直す。
- runner と routine の動きを変えるため、統合の後に orchestrator が `exec smoke` と実際の routine の 1 回の実行で確かめてから close する。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
