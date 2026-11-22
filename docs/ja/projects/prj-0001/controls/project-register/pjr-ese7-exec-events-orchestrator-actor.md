---
specdojo:
  id: prj-0001:pjr-ese7-exec-events-orchestrator-actor
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: high
  difficulty: medium
  registered_at: "2026-11-22T03:14:14Z"
  derived_from:
    - PJR-PP4X
---

# PJR-ESE7 exec の記帳の --by に specdojo-orchestrator を使えない

## 1. 概要

exec release などの --by は名簿の人と agent だけを受け付け、オーケストレーターが行った release を正しい主体で記帳できない。register と同じく予約名 specdojo-orchestrator を受け付ける。

## 2. 入力

- 2026-11-22、第 3 波の 090 を流し直すための release を、specdojo-orchestrator でも indie でも記帳できなかった（indie での記帳は Claude Code の安全確認で止められた）。
- 利用者の承認（2026-11-22、indie）で起票した。

## 3. 完了条件

- `exec claim`・`release`・`block`・`unblock`・`complete`・`reopen`・`cancel` の `--by` で、登録簿と同じ予約名 `specdojo-orchestrator` を受け付ける。名簿の人と agent は今までどおり受け付ける。
- 予約名のうち、ほかの 2 つ（`SpecDojo`・`night-orchestrator`）を exec の記帳でも受け付けるかは executor が決め、理由を個票の対応結果に書く。予約名の一覧は `src/shared/specdojo-config.ts` の `RESERVED_REGISTER_ACTORS` と同じ正本を使い、別の一覧を作らない。
- 予約名で記帳したイベントを読んで state を組み立てるとき（`exec refresh`・`exec status`）、エラーにも警告にもならない。
- 名簿にも予約名にもない名前は、今までどおり記帳の前にエラーで止まる。
- 上の 3 つを単体テストで確かめる。
- 予約名の扱いを説明している文書（`command-reference` の exec の記帳の節、`exec-operation-guide` など）を直す。
- `CHANGELOG.md` は変えない。個票の対応結果の `### 5.1. CHANGELOG に書く事項` に、区分と行の文案を書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。
- 統合の後、オーケストレーターが本体で、ready のタスク 1 件に `exec claim --by specdojo-orchestrator` と `exec release --by specdojo-orchestrator` を行い、記帳できること、`exec refresh`・`exec status` が警告なしに todo へ戻すことを確かめる。名簿にない名前が記帳の前にエラーで止まることも確かめる。
- runner の動作確認（PJR-JSEY）の代わりに、第 3 波の 090 の run（2026-11-22 の列 `wave3-090-a-2026-11-22`・`wave3-090-b-2026-11-22`）で、agent の claim と complete が新しい検証を通って記帳されることを確かめる。
- 2 回目の確かめ方の変更（2026-11-22）: 当初の「090 の 1 件を `exec release --by specdojo-orchestrator` で戻して流す」は、release が claim の持ち主か人の `--force` に限られるため行えない。利用者（indie）の判断で上の 2 つに差し替えた。

## 4. 作業内容

| No  | 作業                                 | 担当 | 状態 | メモ                                                         |
| --- | ------------------------------------ | ---- | ---- | ------------------------------------------------------------ |
| 1   | exec の記帳で予約名を受け付ける      | DEV  | done | `assertValidExecActor` を追加                                |
| 2   | state の組み立てで予約名を受け付ける | DEV  | done | `foldEventsToState` は名簿を見ないため変更不要。テストで確認 |
| 3   | テストと文書、CHANGELOG の文案       | DEV  | done | 単体テスト・文書・CHANGELOG 文案を記載                       |

## 5. 対応結果

### 5.0. 実施内容

- `src/shared/specdojo-config.ts` に `assertValidExecActor` を追加した。`RESERVED_REGISTER_ACTORS` に含まれる名前は名簿なしで受け付け、それ以外は従来の `assertValidActor` に委ねる。`exec` の `src/exec/core.ts`・`src/exec/commands.ts` の `--by` 検証（claim・release・block・unblock・complete・reopen・cancel・scheduler）をこちらへ切り替えた。
- 予約名 3 つ（`SpecDojo`・`specdojo-orchestrator`・`night-orchestrator`）をすべて受け付ける。理由は、`register` と同じ正本を使い、別の一覧や例外を作らないため。`grade` の `--by` は agent 限定のため `assertValidActor` のまま。
- state の組み立て（`foldEventsToState`）は名簿を参照しないため、予約名の event はエラーにも警告にもならない。単体テストで確認した。
- テスト: `tests/src/shared/specdojo-config.test.ts`・`tests/src/exec/events.test.ts` に追加。
- 文書: `command-reference` の exec の記帳の節、`exec-operation-guide` の blocked 復帰の節に追記した。

### 5.1. CHANGELOG に書く事項

- 区分: Changed
- 文案: `exec claim` / `release` / `block` / `unblock` / `complete` / `reopen` / `cancel` の `--by` が、`register` と同じ予約 actor（`SpecDojo`・`specdojo-orchestrator`・`night-orchestrator`）を受け付けるようにした。

### 5.2. 残課題

- 統合後にオーケストレーターが第 3 波の 090 の 1 件を `exec release --by specdojo-orchestrator` で戻して流し、記帳と run が通ることを確かめる（executor では実行しない）。

## 6. 関連ドキュメント

- `docs/ja/specdojo/references/command-reference.md`・`docs/ja/specdojo/guides/exec-operation-guide.md`（本タスクで更新）
