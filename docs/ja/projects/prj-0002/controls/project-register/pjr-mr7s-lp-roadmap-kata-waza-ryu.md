---
specdojo:
  id: prj-0002:pjr-mr7s-lp-roadmap-kata-waza-ryu
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: BA
  registered_at: "2026-11-01T12:32:06Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-7T8X
---

# PJR-MR7S LP の「これから」に Kata・Waza・Ryu の役割を追記する

## 1. 概要

LP 末尾の「これから」に、型（Kata）・技（Waza）・流（Ryu）の役割と仕事の回し方との関係を、平易な言葉で紹介する。既存の PDCA 表との関係および提供状況の表示を整合させる。

## 2. 入力

- 利用者から、LP 末尾の「これから」には register・schedule・routine + Job の記載がある一方、kata・waza・ryu の記載がないとの指摘があり、これらを記述する todo の起票を依頼された。担当 BA、期限 2026年11月末。
- 会話で提示した案：既存の PDCA 表に行を足すより、「これから」に「作り方も、磨いていく」という短い説明を添える。型（Kata）は規約・作り方・完成例・雛形で成果物の品質を支え、技（Waza）は記録・実行・評価をつなぎ、流（Ryu）は目的や型の整備状況に合わせて進め方を選ぶことを紹介する。具体的な文言は提案として扱う。
- 締めの文案：「仕事を回すだけでなく、作り方も磨いていく。型を整え、技で実行し、目的に合った流れで成果物を育てていきます。」提供状況の表示は既存の「いま使える／準備中」と整合させて決める。
- 既存の PJR-7T8X では導入時の分かりやすさを優先して Kata・Waza・Ryu の語を使わない方針だった。今回はこの紹介範囲を見直す。用語や体系の再設計、公開時期の決定まで範囲を広げない。

## 3. 完了条件

- LP 末尾の「これから」に、型（Kata）・技（Waza）・流（Ryu）の役割を平易な言葉で紹介している。
  - Kata は規約・作り方・完成例・雛形で成果物の品質を支えることを説明する。
  - Waza は記録・実行・評価をつないで仕事を進めることを説明する。
  - Ryu は目的や型の整備状況に合わせて進め方を選ぶことを説明する。
- 既存の register・schedule・routine + Job の PDCA 表との関係が分かり、「いま使える／準備中」の表示と矛盾していない。公開時期を新たに約束しない。
- PC とスマホの表示で、追加した説明と既存の PDCA 表が読みやすく表示されることを確認し、確認結果を対応結果に記録している。
- `specdojo-lp` で `npm run build` が成功し、検証結果を対応結果に記録している。

## 4. 作業内容

| No  | 作業                                                 | 担当 | 状態 | メモ                                        |
| --- | ---------------------------------------------------- | ---- | ---- | ------------------------------------------- |
| 1   | 関連ガイドと既存 LP を確認し、追記する文言をまとめる | BA   | open | 入力の文案と PJR-7T8X の従来方針を踏まえる  |
| 2   | 「これから」に三つの役割と PDCA 表との関係を追記する | BA   | open | 提供状況の表示と整合させる                  |
| 3   | PC・スマホの表示とビルドを確認し、結果を記録する     | BA   | open | `specdojo-lp` で `npm run build` を実行する |

## 5. 対応結果

-

## 6. 関連ドキュメント

- [[prj-0002:pjr-7t8x-lp-roadmap-pdca-matrix]]: 既存の「これから」と PDCA 表の方針。
- [[specdojo:specdojo-overview-guide]]: Kata・Waza・Ryu と成果物・実行管理の関係。
- [[specdojo:kata-guide]]: 実践の型の役割。
- [[specdojo:waza-guide]]: 遂行の技の役割。
- [[specdojo:ryu-guide]]: 目的や型の整備状況に応じた進め方。
