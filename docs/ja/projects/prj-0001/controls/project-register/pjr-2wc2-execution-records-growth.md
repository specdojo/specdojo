---
specdojo:
  id: prj-0001:pjr-2wc2-execution-records-growth
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-11-03T04:54:14Z"
  due_on: "2026-12-31"
  completed_at: "2026-11-07T07:21:37Z"
  conclusion: 共通の規約を版への参照にし、実行記録を run 単位の置き場所へ移して検査を足した。生のログは全文を残す。残った記録の片付けと CI は PJR-TKRV で扱う
  derived_from:
    - PJR-8HCB
  commit_type: fix
  commit_scope: exec
---

# PJR-2WC2 実行記録が増え続けるのを抑え、ファイルとディレクトリの構成を見直す

## 1. 課題内容

exec の実行記録（evidence・plan・result）がリポジトリの 3 分の 2 を占め、毎月ほぼ倍に増えている。何を Git に残すか、ディレクトリの分け方、plans/done に移らない件を決めて直す

## 2. 入力

- Git 管理の大きさ 63 MB のうち、prj-0001 の実行記録が 42 MB。内訳は exec/evidence 21.8 MB（2,881）、exec/plans 12.4 MB（1,100）、exec/results 3.8 MB（1,115）、grade/results 2.4 MB（322）、その他 1.6 MB。evidence の実行の数は 8 月 93、9 月 207、10 月 447 と毎月ほぼ倍に増えている（2026-11-03 の実測）
- 減らせる候補: 親の検証と統合の生のログ（`parent-validation-*.log`・integrate.log、約 8 MB、1 本で 1 MB に達するものがある）、executor.log（3.6 MB）、全 plan に埋め込む共通の規約（約 3 KB × 1,099 で約 3.3 MB）、JSEY の動作確認の繰り返し（plan 68 件、約 2.1 MB）、終わった試行の exec/trials（0.7 MB）（2026-11-03）
- 構成の問題: plan と result が 1 つのディレクトリに約 1,100 件ずつ並び、`pjr-*`・`T-*`・`JBR-grade-*`・`stsd-*` が混ざる。plan-result-lifecycle-guide は --track-state の成功で plan を exec/plans/done/ へ移すとするが、done/ は空で `T-*` の plan 252 件が plans/ に残る。result のない plan が 2 件、plan のない result が 16 件ある。評価の結果・ジョブの実行記録・evidence が grade/results・jobs/runs・exec/evidence に分かれている（2026-11-03）
- Git 管理から外しても履歴に残るため clone の重さ（pack 58 MB）は減らない。履歴の書き換えは git-branching-standard で禁止されており、対策の効果はこれから増える分を抑えることになる（2026-11-03）
- 利用者の決定: 生のログ（executor.log・integrate.log・`parent-validation-*.log`）は監査証跡として全文を Git に残す。追跡から外さず、大きさの上限や途中の省略も設けない。成功した run でも agent が誤った報告をすることがあり、後から実物で確かめられるようにするため（2026-11-06）
- orchestrator の実測: 生のログは作業ツリーで 13.7 MB だが、Git の pack では約 2.1 MB（pack 61.5 MB の約 3%）で、追跡から外しても clone はほとんど軽くならない。追跡中の実行記録に API キー・トークン・秘密鍵・個人のメールアドレスは見つからなかった（2026-11-06）
- 利用者の決定: 増え方はログ以外の原因（全 plan に埋め込む共通の規約を参照に変える、完了した plan の扱い）で抑える。あわせて、ディレクトリ体系とファイルの配置のおかしい箇所を直す。配置の体系は派生の decision で決め、伏せ字と秘密の検査は派生の todo で扱う（2026-11-06）

## 3. 影響範囲

| 観点         | 影響                                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------------------- |
| スコープ     | prj-0001 の実行記録（plan・result・evidence・ログ・checkpoint）の置き場所と、runner・検査・ガイドの記述 |
| スケジュール | 派生の項目（VH8D から 9BY9・JT5J・KC0T まで）を 2026-11-06〜07 に順に流した                             |
| コスト       | 履歴は書き換えないため、clone の重さは減らない。効果はこれから増える分に限る                            |
| 品質         | 生のログは監査証跡として全文を残す。置き場所が 1 つの体系にそろい、検査で崩れを見つけられるようになる   |
| 関係者       | orchestrator と executor・reporter（記録の書き手）、記録を読む利用者                                    |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                     |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | 全 plan に共通の規約を埋め込んでいた。plan・result・evidence が別々のディレクトリに混ざり、完了した plan の扱いがガイドと実物で食い違っていた            |
| 対応策   | 共通の規約を版への参照にする（BVS9）。配置の体系を決め（VH8D）、run 単位の置き場所へ移し（Z0XR・9BY9）、検査を足す（JT5J・KC0T）。伏せ字を広げる（FMA4） |
| 依存事項 | 生のログは全文を Git に残す（2026-11-06 indie が決定）。履歴の書き換えは行わない                                                                         |
| 完了条件 | 派生の項目が終端し、新しい run の記録が 1 つの体系に置かれ、普通の `exec validate` が develop で通る                                                     |

## 5. 対応結果

- 派生の項目はすべて終端した。[[prj-0001:pjr-vh8d-execution-records-layout]] で配置の体系を決め、Z0XR・9BY9 で既存の記録 5,576 件を `execution/runs/` へ移した。TA6W・BRN4 で再開と統合の取りこぼしを直し、PZBP で定期処理の状態を Git の外へ移した。JT5J・KC0T で置き場所の検査を足し、過去の世代の記録を正常として扱うようにした。
- 増え方: BVS9 の後の plan は共通の規約を参照で持ち、6 件の平均は約 5.5 KB だった。それ以前の 1,195 件の平均は約 12 KB。規約の本体は `execution/conventions/` に 1 件（4 KB）だけある（2026-11-07 の実測）。
- 生のログは決定どおり全文を残している。伏せ字は FMA4 で 8 形式を足し、既存の記録に秘密は見つからなかった。
- 2026-11-07 に develop で `npx specdojo exec validate --project prj-0001` が終了コード 0 になることを確かめた。
- 残課題:
  - 記録の一部だけが残った 13 件の run の片付けと、`--records-only` を流す CI の workflow の反映は [[prj-0001:pjr-tkrv-run-record-missing-criteria]] で扱う。
  - 再開時に古い検証のログが残る件は [[prj-0001:pjr-8yh0-resume-stale-validation-logs]] で扱う。
  - plan の規約への参照が Markdown のリンクになる件は [[prj-0001:pjr-g1w9-plan-conventions-markdown-link]] で扱う。
  - 増え方の月ごとの実測は、次の月の記録がそろってから行う。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
