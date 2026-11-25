---
specdojo:
  id: prj-0001:pjr-32pn-exec-loop-drain-stop
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-25T11:11:06Z"
  due_on: "2026-12-31"
  derived_from:
    - PJR-0BGE
---

# PJR-32PN 動いている exec run --auto --loop を、走っているタスクを終えてから安全に止めるコマンドを足す

## 1. 概要

動いている `exec run --auto --loop` を、走っているタスクを壊さずに止めるコマンドを足す。新しいタスクは始めず、走っているタスクを統合まで終えてからループを抜ける止め方（drain）にする。設定の変更・feature ブランチの統合・dist の作り直しなどを、区切りで安全に行えるようにする。

## 2. 入力

- 利用者の問い（2026-11-25）: schedule を途中で安全に止めて設定を変えるコマンドは実装されているか
- 確かめた事実（2026-11-25）: exec queue cancel は次の段の前でしか止まらず、--max-rounds は起動時の値。SIGTERM で止めると走っていたタスクが途中で切れ、exec resume で手当てが要った。exec-defaults は起動時に 1 度だけ読まれる
- 利用者の判断（2026-11-25）: 担当は DEV、期限は 12 月末

## 3. 完了条件

- 止める指示のコマンドを足す。名前と引数は executor が決め、理由を個票の対応結果に書く。対象の run（project・track または予約の列）を指定できる。
- 指示を受けたループは、新しいタスクを claim せず、走っているタスクを統合（reporter と記帳を含む）まで終えてから抜ける。抜けた理由を exec の記録に残し、終了コードで「指示で止まった」ことが分かる。
- 予約の列から流している場合は、その段で止まる。同じ `exec queue run <queueId>` で、止めた段から再開できる。
- `exec status` と `exec queue status` で、止める指示を受けて走っている分を終えるのを待っている状態が分かる。
- 指示を取り消せる（抜ける前なら、ループはそのまま続く）。
- 走っていない run への指示や、二重の指示は、分かるメッセージで扱う。
- 統合テストで、走っているタスクが統合まで終わること、新しい claim が出ないこと、列から再開できることを確かめる。
- 利用者向けの文書（`command-reference`、exec の運用のガイド）に止め方を書く。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 保護された設定に変更が要る場合は、案を個票の対応結果と報告の `handoff` に書き、反映は利用者の承認のもとで行う。
- 作業を終える前に `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。
- close の前に、実際の `exec run --auto --loop` を止めて再開し、動作を確かめる。

## 4. 作業内容

| No  | 作業                               | 担当 | 状態 | メモ |
| --- | ---------------------------------- | ---- | ---- | ---- |
| 1   | 止める指示の形と記録の設計         | DEV  | open | -    |
| 2   | ループと予約の列の実装とテスト     | DEV  | open | -    |
| 3   | 状態の表示と利用者向けの文書の更新 | DEV  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
