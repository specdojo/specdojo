---
specdojo:
  id: prj-0001:pjr-2q0g-grade-conciseness-metrics
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: hard
  registered_at: "2026-11-17T12:53:26Z"
  derived_from:
    - PJR-0T83
  depends_on:
    - PJR-8S4T
  commit_type: feat
  commit_scope: grade
---

# PJR-2Q0G grade で文書の冗長さと膨らみを点数に反映する

## 1. 概要

手直しで文書が膨らんでも grade の点数が下がらないため、機械で測る大きさの指標と冗長性の観点の強化を組み合わせて、冗長さを verdict と点数に反映する

## 2. 入力

- PJR-0T83 の対応策 (3) にあたる。利用者が 2026-11-17 に、機械で測る指標と観点の強化を組み合わせる案（c）を選んだ
- orchestrator の調査（2026-11-17）: 冗長さを見る観点 vp-arc-conciseness は既定の重大度が minor で「長さだけでは fail にしない」とあり、verdict を needs-work にしない。点数は区分ごとの平均を重み付けしたもので、28 の観点のうち 1 つとして usability の区分の中で平均されるため、1 段下がっても点数は 1〜2 点しか動かない。sld-sample（運用・検証の章が約 28%）はこの観点で 4（満点）だった
- 手直しで膨らんだ例: PJR-CPZH の代替案比較は 27KB から 75KB（sample は 20KB）、PJR-Y5AC の品質管理計画は 5.4KB から 18.8KB（sample は 15.8KB）。どちらも grade の点数は上がっていた
- 上限の数値は、PJR-8S4T で sld を見直した結果（前後の大きさと grade の結果）を見てから決める

## 3. 完了条件

- _TODO_: 完了と判断できる具体的な条件を記載する。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
