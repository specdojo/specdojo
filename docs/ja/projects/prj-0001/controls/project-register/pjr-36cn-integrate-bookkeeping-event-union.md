---
specdojo:
  id: prj-0001:pjr-36cn-integrate-bookkeeping-event-union
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-09-28T11:18:10Z"
---

# PJR-36CN 統合時の記帳競合でイベントを和集合で合わせる

## 1. 概要

PJR-CTV4 で、統合 merge の競合が項目自身の記帳ファイル（個票・イベント・plan・result・登録簿）だけに収まる場合は、exec branch 側の内容で解決して統合を完了するようにした（`resolveConflictsWithBranchPaths`）。

イベント（`controls/project-register/events/pjr-<id>.yaml`）は追記型の記録である。項目が `waiting` の間に統合先でイベントが追記されると（例: 利用者が `register update` で期限や担当を変えた）、exec branch 側で丸ごと解決したときにそのイベントが失われる。

2026-09-28 に orchestrator が PJR-N22N を手で統合したときは、exec branch 側のイベントが統合先の 7 件をすべて含み、再開時の `start` と `review` の 2 件が加わっているだけであることを確かめてから解決した。CTV4 の実装には、この確認がない。

## 2. 完了条件

- 統合時にイベントファイルが競合した場合、両側のイベントの和集合で解決する。同一のイベントは 1 件にまとめ、時刻順を保つ。
- 個票など、イベント以外の記帳ファイルは、イベントから再構築できるものは再構築し、できないものは従来どおり exec branch 側で解決する。どう扱ったかを対応結果に記録する。
- waiting 中に統合先でイベントが追記された場合でも、統合後にそのイベントが残ることを確かめる統合テストがある。
- `npm run check` が成功する。

## 3. 作業内容

| No  | 作業                               | 担当 | 状態 | メモ |
| --- | ---------------------------------- | ---- | ---- | ---- |
| 1   | イベントの和集合での解決を実装する | DEV  | open | -    |
| 2   | 個票の再構築の扱いを決めて実装する | DEV  | open | -    |
| 3   | 統合テストを追加する               | DEV  | open | -    |

## 4. 対応結果

-

## 5. 関連ドキュメント

- PJR-CTV4（exec branch 側での解決を導入した項目）、PJR-R0XA、PJR-N22N
- [[specdojo:exec-worktree-guide]]
- `src/exec-worktree-ops.ts`、`src/exec-run.ts`
