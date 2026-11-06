---
specdojo:
  id: prj-0001:pjr-ta6w-resume-new-layout-drops-evidence
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: waiting
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-06T17:26:33Z"
  due_on: null
  block_reason: "parent validation failed: lint-fm, test-integration"
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

| 観点         | 影響                                                                                                                                                           |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | `exec run --register --worktree` と `exec resume` の統合で、run の記録（evidence・ログ・state）を commit の対象に入れる判定と、古い配置で始まった run の再開先 |
| スケジュール | PJR-Z0XR の close、PJR-BVS9・PJR-9BY9 の実行が、この項目の後になる                                                                                             |
| コスト       | runner の commit の対象の判定と再開処理、統合テストの修正                                                                                                      |
| 品質         | 監査証跡（evidence とログ）が警告なしに失われる。PJR-PZBP の再開分の記録は worktree ごと消え、戻せない                                                         |
| 関係者       | DEV、run を再開する orchestrator と利用者                                                                                                                      |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | `isCommitTargetPath` は `isOtherRunRecord(path, resultRel)` で、result と別のディレクトリにある新しい配置の記録を「ほかの run の記録」として外す。再開した run は result が古い配置（`exec/results/`）のままで、evidence とログだけが新しいディレクトリ（`runs/register/PJR-PZBP/<run-id>/`）に書かれたため、自分の記録が外れた。外した記録は許可外の一覧にも出ないため、警告が残らない。`pipeline-state.json` は統合の段が別の経路で書いたため残った（2026-11-07 orchestrator が `isCommitTargetPath` を直接呼んで確認） |
| 対応策   | 今の run の記録を、result の置き場所にかかわらず commit の対象にする。古い配置で始まった run の再開は、元のディレクトリへ書き続ける（A 案、2026-11-07 indie が決定）                                                                                                                                                                                                                                                                                                                                                      |
| 依存事項 | なし。PJR-BRN4 も同じ `src/exec/worktree-ops-commit.ts` を変えるため、この項目の統合の後に流す                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 完了条件 | 下記の条件をすべて満たすこと                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |

完了条件の内訳。

- 今の run の記録（今の run ID のディレクトリの中の evidence・ログ・state・`*.attempt-N.*`）は、result が古い配置にあっても新しい配置にあっても、統合の commit に入る。ほかの run の記録を外す動きは変えない。
- 古い配置（`exec/evidence/<task-id>/<run-id>/`）で始まった run を `--resume`（`--resume-from executor` を含む）で再開すると、新しい配置にディレクトリを作らず、元のディレクトリへ書き続ける。前回の記録の退避（`*.attempt-N.*`）も元のディレクトリで行う。
- 統合が run の記録を commit の対象から外したときは、ほかの許可外と同じく `integrate.log` と標準出力に一覧を書く。
- 実際の worktree を使う統合テストで、次を確かめる。
  - 古い配置で始まった run を executor から再開して統合すると、evidence・executor のログ・親の検証のログ・state がすべて commit される。
  - 新しく始めた run（新しい配置）を統合すると、plan・result・evidence・ログ・state がすべて commit される。
- 原因と、PJR-PZBP の再開分の記録が戻せないことを、個票の対応結果に記録する。
- 動きの説明が変わる場合は、`exec-operation-guide` を実際の動きに合わせる。CHANGELOG は未公開の版の節に書き、公開済みの版の節は変えない。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` が通り、親の検証（`test-integration`）が通る。

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
