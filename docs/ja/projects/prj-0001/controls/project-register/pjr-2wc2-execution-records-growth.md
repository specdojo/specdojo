---
specdojo:
  id: prj-0001:pjr-2wc2-execution-records-growth
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-11-03T04:54:14Z"
  due_on: "2026-12-31"
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

## 3. 影響範囲

| 観点         | 影響   |
| ------------ | ------ |
| スコープ     | _TODO_ |
| スケジュール | _TODO_ |
| コスト       | _TODO_ |
| 品質         | _TODO_ |
| 関係者       | _TODO_ |

## 4. 対応方針

| 項目     | 内容   |
| -------- | ------ |
| 原因     | _TODO_ |
| 対応策   | _TODO_ |
| 依存事項 | _TODO_ |
| 完了条件 | _TODO_ |

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
