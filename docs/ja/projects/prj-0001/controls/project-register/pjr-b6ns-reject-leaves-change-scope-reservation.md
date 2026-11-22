---
specdojo:
  id: prj-0001:pjr-b6ns-reject-leaves-change-scope-reservation
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-22T11:41:41Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-SGFC
---

# PJR-B6NS reject した項目の変更の範囲の予約が残り、後の項目を止める

## 1. 課題内容

統合されないまま reject した項目の変更の範囲の予約が blocked のまま残り、範囲が重なる後の項目が start する前に止まる。2026-11-22 に SGFC の予約で YS9M が止まった。

## 2. 入力

- 2026-11-22、YS9M の run が「[scope] PJR-YS9M blocked by unintegrated PJR-SGFC」で止まった。SGFC は TF6F の確かめに使い、統合せずに reject した項目で、worktree はもう無かった。
- 予約は execution/exec/.locks/change-scopes/ の項目ごとの JSON（state: blocked）。登録は src/exec/run/change-scope.ts の tryAcquire。
- 回避として、オーケストレーターが利用者の承認のもとで SGFC の予約のファイルを手で消した（2026-11-22）。
- 利用者の承認（2026-11-22、indie）で起票した。担当 DEV、期限 2026-11-30。

## 3. 影響範囲

| 観点         | 影響                                                                 |
| ------------ | -------------------------------------------------------------------- |
| スコープ     | `exec run --register` の変更の範囲の順番待ち（`change-scope`）       |
| スケジュール | 範囲が重なる項目が、予約を手で消すまで流れない                       |
| コスト       | 小さい〜中（予約を解く条件の修正とテスト）                           |
| 品質         | 手で予約のファイルを消す運用が残り、消し違えると実行中の項目と重なる |
| 関係者       | オーケストレーター、夜間の実行                                       |

## 4. 対応方針

| 項目     | 内容                                                                            |
| -------- | ------------------------------------------------------------------------------- |
| 原因     | 統合されずに止まった項目の予約は blocked で残り、その項目を終端にしても解けない |
| 対応策   | 終端になった項目の予約を、後の項目の妨げにしない                                |
| 依存事項 | なし                                                                            |
| 完了条件 | 下の箇条書きのすべてを満たす                                                    |

- 項目を終端（reject・done・decided など）にしたあと、その項目の blocked の予約が、範囲の重なる後の項目を止めない。終端の遷移で予約を解くか、予約を調べるときに終端の項目を読み飛ばすかは executor が決め、理由を個票の対応結果に書く（単体テストで確かめる）。
- 終端でない項目（waiting など）の blocked の予約は、今までどおり後の項目を止める（単体テストで確かめる）。
- 残った予約の確かめ方と解き方を `exec-operation-guide` の「変更範囲が重なる項目の順番待ち」に書く。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。
- runner の動きを変えるため、統合の後にオーケストレーターが JSEY を流して確かめてから close する。

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
