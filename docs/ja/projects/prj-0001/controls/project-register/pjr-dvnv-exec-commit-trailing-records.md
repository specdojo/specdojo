---
specdojo:
  id: prj-0001:pjr-dvnv-exec-commit-trailing-records
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-15T12:27:24Z"
  commit_type: fix
  commit_scope: exec
---

# PJR-DVNV runner が統合の後に書いたイベントと run の記録を commit する

## 1. 概要

統合の後のイベントと試行の記録を、runner が自分で commit する（run の終わりに記帳の commit を足す、など）

## 2. 入力

- 2026-11-15、develop の作業ツリーに commit されていない実行記録が 465 件たまっていた。イベント 371 件（11/10〜11/15 の claim・complete・block・unblock・release など）と、失敗した試行や再開前の試行のログ 70 件
- 調べた結果: ログの配置の変更（2026-11-07、PJR-Z0XR）が原因ではない。runner の統合の commit に入るのはその時点までのイベント（claim）と run の記録で、統合の後に書く complete・失敗時の block は 8 月から一度も runner が commit していない。orchestrator が『実行イベントを記録する』commit（08-12・09-16・11-05・11-09 など）で手で補っていたが、playbook にも orchestrator の定義にも書かれておらず、引き継がれずにたまった

## 3. 完了条件

- run の終わり（成功・失敗・延期・再開のどれでも）に、runner が書いたイベント（claim・complete・block・unblock・release）と、その run の記録（plan・result・evidence・pipeline-state・ログ、退避した試行のログ）を、記帳の commit として develop に入れる。作業ツリーに残さない。
- 統合の commit に入らなかったイベントがあれば、次の run の準備の commit で拾う仕組みが効いているか確かめ、効いていなければ直す。
- commit が index.lock などで失敗したら再試行し、それでも失敗したら残ったファイルと次の操作を報告に書く。
- 人が書くイベント（`exec claim`・`complete`・`block` など）は、従来どおり記帳する人が commit する。その区別をガイドに書いている。
- run が終わった後に `git status` で実行記録が残らないことを、回帰テストか実際の run で確かめている。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節に書いている（PJR-EPQ3）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                            | 担当 | 状態 | メモ |
| --- | ----------------------------------------------- | ---- | ---- | ---- |
| 1   | 統合の後のイベントと試行の記録を commit する    | DEV  | open | -    |
| 2   | 次の run の準備の commit での拾い上げを確かめる | DEV  | open | -    |
| 3   | ガイドと回帰テストを足す                        | DEV  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-y013-exec-commit-folding]]
- [[prj-0001:pjr-tn43-user-decisions-pending]]
