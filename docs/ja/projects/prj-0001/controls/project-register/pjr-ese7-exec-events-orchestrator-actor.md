---
specdojo:
  id: prj-0001:pjr-ese7-exec-events-orchestrator-actor
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
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
- runner の記帳を変えるため、統合の後にオーケストレーターが第 3 波の 090 の 1 件を `exec release --by specdojo-orchestrator` で戻して流し、記帳と run が通ることを確かめる。

## 4. 作業内容

| No  | 作業                                 | 担当 | 状態 | メモ                              |
| --- | ------------------------------------ | ---- | ---- | --------------------------------- |
| 1   | exec の記帳で予約名を受け付ける      | DEV  | open | 正本は `RESERVED_REGISTER_ACTORS` |
| 2   | state の組み立てで予約名を受け付ける | DEV  | open | refresh・status                   |
| 3   | テストと文書、CHANGELOG の文案       | DEV  | open | -                                 |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
