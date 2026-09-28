---
specdojo:
  id: prj-0001:pjr-36cn-integrate-bookkeeping-event-union
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-09-28T11:18:10Z"
  completed_at: "2026-09-28T15:15:55Z"
  block_reason: "agent exited with non-zero code: 親 runner が実行した runner 検証 `id: test-integration`（`npm run test:integration`）が `status: failed`（exit 1）である。plan の共通規約により、runner 検証が failed の場合は reporter が結果を complete とす…"
  conclusion: 統合時にイベントファイルが競合した場合、両側のイベントを和集合（同一 id は 1 件、時刻順）で解決する register-event-merge を追加した。waiting 中に統合先で追記されたイベントが統合後も残ることを統合テストで確認した
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
| 1   | イベントの和集合での解決を実装する | DEV  | done | -    |
| 2   | 個票の再構築の扱いを決めて実装する | DEV  | done | -    |
| 3   | 統合テストを追加する               | DEV  | done | -    |

## 4. 対応結果

- `src/register-event-merge.ts` を追加し、`unionRegisterEventLogs` でイベントファイルを両側の和集合で解決するようにした。同じ id のイベントは exec branch 側の内容で 1 件にまとめ、時刻順に並べて `previous_event_id` の連鎖を張り直す。
- 統合先だけにある状態を変えないイベント（`update` など）は、並べ替え後の直前の状態を `from_status` / `to_status` に引き継ぐ。統合先だけに状態遷移があるなど状態の連続性を保てない場合は、従来どおり exec branch 側で解決し、統合ログに理由を出力する。
- 個票の扱い: exec branch 側を基準にし、統合先だけにあるイベントが最後に変えた `type` / `priority` / `owner` / `due` を `rebuildRegisterTicketFromEvents` で frontmatter へ再構築する。タイトル・説明は本文、`status` / `block_reason` / `conclusion` / `completed` は状態遷移に伴う値、`registered` はイベント上で暦日に変換済みで元の日時を復元できないため、再構築せず exec branch 側を残す。
- plan・result・登録簿（`pjr-index.md`）はイベントから再構築できないため、従来どおり exec branch 側で解決する。
- `src/exec-worktree-ops.ts` の `resolveBranchOwnedConflicts` で、競合したイベントファイルに上記を適用し、対応する個票が競合していれば再構築した内容で解決する。
- 単体テスト `tests/src/register-event-merge.test.ts` と、`waiting` 中に統合先で追記した `update` イベントが統合後に残ることを確かめる統合テストを `tests/src/exec-worktree-ops.integration.test.ts` に追加した。
- [[specdojo:exec-worktree-guide]] の統合の説明を更新した。

## 5. 関連ドキュメント

- PJR-CTV4（exec branch 側での解決を導入した項目）、PJR-R0XA、PJR-N22N
- [[specdojo:exec-worktree-guide]]
- `src/exec-worktree-ops.ts`、`src/exec-run.ts`
