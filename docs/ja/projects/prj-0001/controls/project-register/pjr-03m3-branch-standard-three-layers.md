---
specdojo:
  id: prj-0001:pjr-03m3-branch-standard-three-layers
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-09-23T02:37:13Z"
  due_on: "2026-10-10"
  completed_at: "2026-09-23T03:43:14Z"
  block_reason: "agent exited with non-zero code: agent-config-write: protected configuration changes detected; paths=.opencode/.gitignore, .opencode/node_modules/.bin/download-msgpackr-prebuilds, .opencode/node_modul…"
  conclusion: git-branching-standard へ 3 層の変更経路と運用規模ごとの必須条件を新設し、branch-workflow-guide へ feature 分岐前の base push と PR 表示再計算の対処を追加した。
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
| 1   | `git-branching-standard` へ 3 層の切り分けと判断基準を追加する         | DEV  | done | `分岐・統合の規範` へ 4.1 として追加 |
| 2   | 運用規模別の必須条件と省略可能範囲を追加する                           | DEV  | done | 4.2 で猶予期間を含めて明文化         |
| 3   | `branch-workflow-guide` へ PR 表示が再計算されない場合の対処を追加する | DEV  | done | compare API と close / reopen を追加 |

## 4. 対応結果

- [[specdojo:git-branching-standard]] に、exec の自動実行、人・対話型 agent が内容を書いた変更、register の記帳という3層と、それぞれのブランチ・統合方法を表で追加した。事前レビューの価値を境界とし、乱数 ID、Git 管理対象外の生成物、項目単位の実体という記帳例外の前提も明記した。
- 同標準に運用規模別の条件を追加した。3層分類と exec 対象の事前統合は共通とし、単独運用ではリモート PR、branch protection、分離した統合専用 actor、リモートへのベース反映を条件付きで省略できる一方、複数人・複数 actor 運用では必須とした。
- [[specdojo:branch-workflow-guide]] に、feature 分岐前の base push と SHA 確認、および Pull Request の Files changed が古い場合に compare API で実差分を確認して close / reopen する手順を追加した。
- レビューで 1 点修正した。運用規模別の表の層2の行が「リモートを共有しない場合は」を単独運用の条件にしていたが、判断基準はリモートの有無ではなく独立した承認者の有無であるため、「作成者と独立した承認者が参加していない期間は」へ改め、リモートの有無では判断しないことを明記した。
- 実行は codex-expert-executor / gemma-reporter / worktree で行った。初回は保護設定の誤検知（[[prj-0001:pjr-t84c-protected-config-runtime-artifacts]]）で `waiting` になり、修正後に reporter ステージから `--resume` して完走した。executor は再実行していない。

## 5. 関連ドキュメント

- [[prj-0001:pjr-ewwx-feature-branch-policy]]
- [[specdojo:git-branching-standard]]
- [[specdojo:branch-workflow-guide]]
- [[prj-0001:pjr-kefk-orchestrator-feature-branch-rule]]
