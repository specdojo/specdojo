---
specdojo:
  id: prj-0001:pjr-rz9q-business-specs-reps-kata-confirm
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: medium
  registered_at: "2026-11-08T00:36:48Z"
  derived_from:
    - PJR-2GD6
  depends_on:
    - PJR-MECY
    - PJR-M7KD
    - PJR-7FXC
    - PJR-C1RG
    - PJR-4N3R
---

# PJR-RZ9Q 業務仕様の代表に使う型（bdd・ccd・cdt・sf・ifx-cmd）の手入れを確定する

## 1. 背景

業務仕様の代表を作る前に、実装と同じことを 2 回書かないよう、5 種類の型（bdd・ccd・cdt・sf・ifx-cmd）を手入れする（PJR-MECY・PJR-M7KD・PJR-7FXC・PJR-C1RG・PJR-4N3R）。手入れした型で代表を作ると、型の誤りが代表の文書にそのまま入るため、schedule を作る前に人が型を確かめて確定する。

## 2. 入力

- 型の確定は人が行う（stsd の試行の PJR-PT5N と同じ扱い）。

## 3. 検討した選択肢

種類ごとに、次のどちらかを選ぶ。

| 選択肢 | 内容                                                                                          |
| ------ | --------------------------------------------------------------------------------------------- |
| 確定   | 手入れした rulebook と sample（ifx-cmd は recipe・template も）を、代表を作る型として確定する |
| 直す   | 直す点を書いて、その種類の型の手入れの todo を起票し直す。その種類の代表は直した後に作る      |

判断の材料は、各 todo の個票の対応結果にある「executor が決めた点と理由」と、型の差分である。

## 4. 決定内容

_TODO_: 採択した内容を明確に記載する。

## 5. 採択理由

- _TODO_: 判断根拠を記載する。

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

| 項目       | 内容   |
| ---------- | ------ |
| 影響範囲   | _TODO_ |
| 必要な対応 | _TODO_ |
| 追跡先     | _TODO_ |

## 8. 関連ドキュメント

- 親: [[prj-0001:pjr-2gd6-business-specs-reps]]
- 型の手入れ: [[prj-0001:pjr-mecy-bdd-kata-reference-to-implementation]]、[[prj-0001:pjr-m7kd-ccd-kata-reference-to-implementation]]、[[prj-0001:pjr-7fxc-cdt-kata-reference-to-implementation]]、[[prj-0001:pjr-c1rg-sf-kata-reference-to-implementation]]、[[prj-0001:pjr-4n3r-ifx-cmd-kata-reference-to-implementation]]
- 前例: [[prj-0001:pjr-pt5n-stsd-kata-confirm]]
