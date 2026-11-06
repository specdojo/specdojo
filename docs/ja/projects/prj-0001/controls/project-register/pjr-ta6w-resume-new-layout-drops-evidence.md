---
specdojo:
  id: prj-0001:pjr-ta6w-resume-new-layout-drops-evidence
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-06T17:26:33Z"
  due_on: null
  derived_from:
    - PJR-Z0XR
---

# PJR-TA6W 古い配置の run を新しい配置で再開すると、evidence とログが commit されない

## 1. 課題内容

PJR-Z0XR の統合後、古い配置で始まった PJR-PZBP を executor から再開すると、新しい配置に run のディレクトリができ、統合の commit には pipeline-state.json しか入らなかった。evidence.json・executor のログ・親の検証のログが消えた

## 2. 入力

- 2026-11-07 の PJR-PZBP の再開（commit 9a08a55c0）。最初の run は古い配置（exec/evidence/PJR-PZBP/20261106T160500718Z-12a595ba/、exec/plans・exec/results）に記録した。Z0XR の入った dist で --resume --resume-from executor を流すと、execution/runs/register/PJR-PZBP/20261106T165603146Z-2fcac83e/ に記録が書かれた（worktree で parent-validation-attempt-1-lint-ts.log を読めた）。続く --resume で統合すると、Git に入ったのは新しいディレクトリの pipeline-state.json だけで、ほかは worktree ごと消えた。run の要約は success だった（2026-11-07 orchestrator の確認）
- Z0XR の個票は、再開を同じ run として扱い、前回の記録を同じディレクトリへ `*.attempt-N.*` として退避すると書くが、古い配置で始まった run では新しいディレクトリが別にできた（2026-11-07）
- 関連: PJR-BRN4（統合が許可外の追加を黙って落とす）。commit の許可リストが HEAD 側の plan（古い配置）から導かれ、新しいディレクトリのファイルが外れた可能性がある。原因は未確認（2026-11-07）

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
