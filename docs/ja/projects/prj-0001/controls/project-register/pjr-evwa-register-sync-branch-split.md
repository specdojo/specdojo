---
specdojo:
  id: prj-0001:pjr-evwa-register-sync-branch-split
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-11-27T03:37:49Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-VM2S
---

# PJR-EVWA register_sync のブランチを sync/register と sync/exec-events に分ける

## 1. 背景

register_sync の専用ブランチ `project/<id>/register` には、登録簿の記帳（個票とイベント）と、schedule の task の実行のイベント（`execution/exec/events/` の claim・complete）の両方が載っている。ブランチの名前が中身と合っていない。

将来、登録簿と関係ないもの（定期実行の記録など）も複数の作業者で共有したくなったとき、`register` という 1 つの名前では足す場所がない。そのため、`sync/` の下に種類ごとのブランチを置く階層の形にし、今の中身を 2 本に分けるかを決める。

## 2. 入力

- 現在の専用ブランチ project/prj-0001/register には、登録簿の記帳と execution/exec/events/ の claim・complete の両方が載る（直近 40 件中 8 件が schedule の task の記帳）
- 利用者は、将来登録簿と関係ないものも共有する場合に register の名前では行き詰まる点を懸念し、sync/ の下に種類ごとのブランチを置く階層の形を選んだ（2026-11-27）
- exec run --register は登録簿の状態遷移だけを記帳し、schedule の task の実行は exec の events だけを記帳するため、今の作りでは 1 回の実行が両方のブランチへ書く場面はない
- 決めること: 両方へ書く必要が出た場合の順番と片方が失敗したときの扱い、exec-events という名前、今のブランチからの移し替えの手順（実行中の run がない時に切り替える）
- 変更の範囲: 設定（sync.branches など）、push・merge・guard・check のコマンド、exec run の後の自動取り込み、CI（check-register-push.yml）、lefthook、専用の worktree の置き場

## 3. 検討した選択肢

| 選択肢 | 内容                                                  | 利点                                                                                 | 懸念                                                                  |
| ------ | ----------------------------------------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| A      | 名前を変えない（`project/<id>/register`）             | 手間がない。今の中身の大半は登録簿の記帳で、名前は大きくは外れていない               | 実行のイベントが混ざり、名前と中身がずれる。将来ほかのものを足せない  |
| B      | 1 つの名前にする（`sync`・`activity` など）           | 将来ほかのものを足しても名前が外れない                                               | 中身が名前から分からない。何でも入れる置き場になりやすい              |
| C      | `sync/register` の 1 本にする（中身は今と同じ）       | 役割と中身が名前に出る。将来は `sync/` の下に足せる                                  | 実行のイベントが `register` のブランチに残り、名前と中身のずれが残る  |
| D      | `sync/register` と `sync/exec-events` の 2 本に分ける | 両方の名前が中身どおりになる。登録簿の履歴に実行の記帳が混ざらない。範囲の検査が単純 | 取り込み・検査・設定が 2 本分になる。今のブランチからの移し替えが要る |

## 4. 決定内容

選択肢 D を採る。register_sync の専用ブランチを `project/<id>/sync/register`（登録簿の個票とイベント）と `project/<id>/sync/exec-events`（`execution/exec/events/` の claim・complete など）の 2 本に分ける。

- 名前は `exec-events` とする。`exec` は実行の記録（runs）全体を共有すると誤解されやすいため使わない。
- 設定とコマンドは `sync` を軸にし、ブランチごとに置き場を設定に書く。将来ほかのものを共有するときは `sync/` の下に足す。
- 1 回の操作が両方のブランチへ書く必要が出た場合の順番と、片方が失敗したときの扱いは、実装の todo で決めて個票に記録する。今の作りでは両方へ書く操作はない。
- 今の `project/<id>/register` からの移し替えは、実行中の run がない時に行う。
- 実装は別の todo で行う。

## 5. 採択理由

- 両方のブランチの名前が中身どおりになり、`sync/` の下に足す形で将来の共有にも行き詰まらない。
- 登録簿の履歴に schedule の実行の記帳が混ざらない。別の project からの起票は `sync/register` だけに触れるため、範囲の検査を絞りやすい。
- 今の作りでは `exec run --register` は登録簿だけ、schedule の task の実行は exec の events だけを記帳するため、2 本に分けても 1 回の実行が両方へ書く場面がない。
- 名前を変える作業と分ける作業は同じ範囲（設定・コマンド・CI）を触るため、1 回で済ませる方が手間が少ない。

## 6. 承認

| 項目     | 内容   |
| -------- | ------ |
| 決定者   | _TODO_ |
| 決定日   | _TODO_ |
| 承認方式 | _TODO_ |
| 証跡     | _TODO_ |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 7. 影響範囲とフォローアップ

| 項目       | 内容                                                                                                                                                                 |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 影響範囲   | 設定（`sync.branches` など）、push・merge・guard・check のコマンド、exec run の後の自動取り込み、CI（`check-register-push.yml`）、lefthook、専用の worktree の置き場 |
| 必要な対応 | 両方へ書く場合の順番と失敗の扱いを決める。名前（`exec-events`）を決める。実行中の run がない時に今のブランチから移し替える                                           |
| 追跡先     | 決定後に実装の todo を `--from` で起票する                                                                                                                           |

## 8. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
