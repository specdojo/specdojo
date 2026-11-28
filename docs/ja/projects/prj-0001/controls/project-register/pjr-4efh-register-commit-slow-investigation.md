---
specdojo:
  id: prj-0001:pjr-4efh-register-commit-slow-investigation
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  registered_at: "2026-11-28T14:35:56Z"
---

# PJR-4EFH register の記帳の --commit が 1 件に 1 分前後かかる原因を調べる

## 1. 概要

register update/close --commit が 1 件に 50〜90 秒かかる。時間の内訳を測り、原因と短くする案をまとめる（調査のみ）

## 2. 入力

- indie の指摘（2026-11-28）: register の起票・記帳に時間がかかりすぎる
- 観測（2026-11-28 23:15〜23:26 JST）: 専用ブランチ project/prj-0001/sync/register への commit の間隔が、連続した register update --commit 1 件ごとに約 47〜90 秒だった。1 件（PJR-6V26 の update）はシェルの 120 秒の時間切れを超えた
- 出力には、1 件の記帳ごとに専用ブランチの worktree で pjr-index などの生成物の一式を作り直す Generated の行が並ぶ
- 担当・期限は未定（indie が朝に決める）

## 3. 完了条件

- `register add` / `update` / `close` を `--commit` 付きで、`register_sync` を有効にした prj-0001 で流したときの時間の内訳を測り、個票の対応結果に表で書く。少なくとも次の段を分ける。
  - lifecycle の枠の取得と待ち
  - 専用ブランチの worktree の同期
  - 個票とイベントの書き込み
  - `register build`（生成物の作り直し）
  - commit の hook（lefthook の各段）
  - 専用ブランチの push
- 測り方（使ったコマンドと回数）を個票の対応結果に書き、ほかの人が同じ手順で測り直せるようにする。測るために作った項目は、測り終えたら reject などで片づける。
- 長くかかる段ごとに、原因と短くする案（例: 変わった項目に関わる生成物だけ作り直す、hook で検査する範囲を絞る、push をまとめる）を書き、案ごとの効果の見込みと影響を個票の対応結果に書く。
- この項目ではコードと設定を変えない（調査のみ）。直す作業は、案ごとに `--from` でこの項目を指した todo の案として個票の対応結果に書き、起票は indie の判断を待つ。
- 保護された設定（`lefthook.yml`・`.specdojo/`・`package.json` など）に関わる案は、案として書くだけにする。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、「なし」と書く。
- `npm run -s lint:md` を通し、親の検証を通す。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。

## 4. 作業内容

| No  | 作業                                 | 担当   | 状態 | メモ |
| --- | ------------------------------------ | ------ | ---- | ---- |
| 1   | 担当と期限を決める                   | indie  | open | -    |
| 2   | 記帳の時間の内訳を測る               | _TODO_ | open | -    |
| 3   | 長い段の原因と短くする案をまとめる   | _TODO_ | open | -    |
| 4   | 案から直す todo を起票するかを決める | indie  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
