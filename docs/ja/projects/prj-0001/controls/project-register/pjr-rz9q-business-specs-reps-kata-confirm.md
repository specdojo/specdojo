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

5 種類の型をすべて確定する。

| 型      | 確定した主な点                                                                                                                                                    |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bdd     | エンティティに `schema_ref` か `type_ref` を書き、fields には業務上の意味だけを書く。どちらもなければ今の形。`bdd.schema.yaml` は後方互換のまま緩めた（PJR-MECY） |
| ccd     | 属性は主キーだけ。関連は役割名と多重度を必須とし、多重度の業務上の根拠の章を置く。recipe・template は要らない（PJR-M7KD）                                         |
| cdt     | 値の一覧は `schema_ref`・`type_ref` で参照し、値ごとの業務上の意味と使い分けを書く。実装にない分類は値を書く（PJR-7FXC）                                          |
| sf      | 機能の目的と bps・uis との対応に絞り、操作手順は参照だけにする章立て（PJR-C1RG）                                                                                  |
| ifx-cmd | 引数の表を持たず正本を参照し、渡すファイル・作るファイル・副作用・終了の分類を書く。`ifx-cmd.schema.yaml` は後方互換のまま広げた（PJR-4N3R）                      |

## 5. 採択理由

- 5 件とも、実装・schema・リファレンスと同じことを 2 回書かないという方針（PJR-2GD6）どおりの規則になっている。
- schema の変更は必須を外すか項目を足すだけで、今の形の文書も検査を通る。
- 親の検証と、統合後の `validate:schema`・`catalog validate`・`lint:md` が通っている。

## 6. 承認

| 項目     | 内容                                                                           |
| -------- | ------------------------------------------------------------------------------ |
| 決定者   | indie                                                                          |
| 決定日   | 2026-11-08                                                                     |
| 承認方式 | commit                                                                         |
| 証跡     | この個票の close の commit（オーケストレーターとの対話で「全て推奨で」と回答） |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 7. 影響範囲とフォローアップ

| 項目       | 内容                                                                                            |
| ---------- | ----------------------------------------------------------------------------------------------- |
| 影響範囲   | 業務仕様の代表 8 件の作成（PJR-2GD6）                                                           |
| 必要な対応 | uis の型の手入れと、カタログの uis・ifx の `overview` の直しの後に、PJR-STM9 で schedule を作る |
| 追跡先     | PJR-STM9                                                                                        |

## 8. 関連ドキュメント

- 親: [[prj-0001:pjr-2gd6-business-specs-reps]]
- 型の手入れ: [[prj-0001:pjr-mecy-bdd-kata-reference-to-implementation]]、[[prj-0001:pjr-m7kd-ccd-kata-reference-to-implementation]]、[[prj-0001:pjr-7fxc-cdt-kata-reference-to-implementation]]、[[prj-0001:pjr-c1rg-sf-kata-reference-to-implementation]]、[[prj-0001:pjr-4n3r-ifx-cmd-kata-reference-to-implementation]]
- 前例: [[prj-0001:pjr-pt5n-stsd-kata-confirm]]
