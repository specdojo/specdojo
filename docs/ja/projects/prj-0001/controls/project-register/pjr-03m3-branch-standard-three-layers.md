---
specdojo:
  id: prj-0001:pjr-03m3-branch-standard-three-layers
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-09-23T02:37:13Z"
  due_on: "2026-10-10"
---

# PJR-03M3 git-branching-standard に 3 層の切り分けと運用規模別の条件を明記する

## 1. 概要

[[prj-0001:pjr-ewwx-feature-branch-policy]] で、develop へ入る経路を 3 層に分けることを決めた。[[specdojo:git-branching-standard]] は `feature/<project-id>/<topic>` を必須ブランチとして定義しているが、「どの変更を feature に載せ、どの変更を develop へ直接 commit してよいか」を規定していない。単独運用ではその区別が不要だったため、標準と実運用が乖離している。

本項目では、決定内容を標準と運用ガイドへ反映し、運用規模ごとに何が必須で何を省略できるかを判別できるようにする。

## 2. 完了条件

- `git-branching-standard` に 3 層の切り分け（exec の自動実行 / 人が内容を書いた変更 / register の記帳）と、層ごとの統合方法が表で定義されている。
- 層の判断基準（事前レビューの価値があるか）と、記帳を例外にできる根拠（ID が乱数採番、生成物が gitignore、実体が項目単位）が記述されている。
- 単独運用で省略できる範囲と、複数人運用で必須になる条件（develop の保護、統合専用 actor、feature を切る前のベース push）が区別して書かれている。
- exec に流す `todo` は実行前に develop へ入っている必要があることが、制約として記述されている。
- `branch-workflow-guide` に、base ブランチを進めても PR の Files changed が再計算されない場合の対処（compare API での確認、close / reopen）が手順として加わっている。
- 既存の章構成と番号付けを壊さず、`npm run lint:md` と `npm run check` が通過している。

## 3. 作業内容

| No  | 作業                                                                   | 担当 | 状態 | メモ                                 |
| --- | ---------------------------------------------------------------------- | ---- | ---- | ------------------------------------ |
| 1   | `git-branching-standard` へ 3 層の切り分けと判断基準を追加する         | DEV  | open | 既存の `分岐・統合の規範` へ接続する |
| 2   | 運用規模別の必須条件と省略可能範囲を追加する                           | DEV  | open | 猶予期間の扱いを明文化する           |
| 3   | `branch-workflow-guide` へ PR 表示が再計算されない場合の対処を追加する | DEV  | open | 実地で観測した事象                   |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-ewwx-feature-branch-policy]]
- [[specdojo:git-branching-standard]]
- [[specdojo:branch-workflow-guide]]
- [[prj-0001:pjr-kefk-orchestrator-feature-branch-rule]]
