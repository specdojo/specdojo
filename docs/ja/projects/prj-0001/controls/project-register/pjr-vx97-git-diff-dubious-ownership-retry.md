---
specdojo:
  id: prj-0001:pjr-vx97-git-diff-dubious-ownership-retry
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-10-07T22:18:25Z"
  due_on: null
  completed_at: "2026-10-07T22:33:20Z"
  conclusion: 作業ディレクトリに .git がある場合に限り、Not a git repository の失敗も dubious ownership と同じ間隔・上限で再試行するようにした。.git がない場合は従来どおりすぐ失敗する
---

# PJR-VX97 一時的な dubious ownership で git diff が失敗し、再試行されない

## 1. 課題内容

worktree で Git が一時的に dubious ownership を返すとき、git diff は「fatal: detected dubious ownership」ではなく「warning: Not a git repository. Use --no-index ...」を出して失敗する。exec-worktree.ts の再試行は前者の文言だけを検出するため、git diff は再試行されず、再開前の統合先の取り込みが拒否される。PJR-EZAF の再開（2026-10-08）で発生した。

## 2. 影響範囲

| 観点         | 影響                                                                                                  |
| ------------ | ----------------------------------------------------------------------------------------------------- |
| スコープ     | `src/exec-worktree.ts` の Git 実行の再試行（`gitResult` と、それを使う `gitOutput` などの呼び出し側） |
| スケジュール | 再開前の統合先の取り込みが拒否され、再開をやり直す必要がある                                          |
| コスト       | 再開 1 回分の手間                                                                                     |
| 品質         | register の状態は変わらず、worktree の変更も失われない（取り込みは状態を変える前に拒否される）        |
| 関係者       | worktree で exec を実行・再開する利用者                                                               |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                          |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | 再試行は stderr の「fatal: detected dubious ownership」だけを検出する。`git diff` は同じ状況で「warning: Not a git repository. Use --no-index ...」を出して失敗するため、再試行されない。dubious ownership が一時的に起きる根本の原因は未解明 |
| 対応策   | 「Not a git repository」の失敗も、作業ディレクトリに `.git`（ファイルまたはディレクトリ）がある場合に限り、dubious ownership と同じ間隔で再試行する。`.git` がない場合は本当の誤りとして従来どおり再試行しない                                |
| 依存事項 | PJR-GHKD（Git 実行ヘルパーの cwd の固定）                                                                                                                                                                                                     |
| 完了条件 | 下記の「完了条件の詳細」を満たす                                                                                                                                                                                                              |

### 3.1. 完了条件の詳細

- `gitResult` の再試行で、stderr が「Not a git repository」（大文字小文字を問わない）を含み、かつ作業ディレクトリに `.git` がある場合を、一時的な失敗として扱う。待ち時間と最大回数は dubious ownership の再試行（2 秒・5 秒・10 秒）と共有し、両者を合わせて上限を超えない。
- 作業ディレクトリに `.git` がない場合は、従来どおり再試行せずにすぐ失敗する。
- 再試行するときの警告の文言で、どちらの理由で再試行したかが分かる。
- 判定の関数を unit test で確かめる（`.git` がある場所の「Not a git repository」は再試行の対象、ない場所は対象外、既存の dubious ownership と index.lock の判定は変わらない）。実際の待ち時間はテストで待たないよう、既存のテストの方式に合わせる。
- `npm run check` が通る。

## 4. 対応結果

- `src/exec-worktree.ts` で、`Not a git repository` を大文字小文字を問わず検出し、対象 repository の `.git` が存在する場合だけ一時的な Git 失敗として再試行するようにした。dubious ownership と 2 秒・5 秒・10 秒の待ち時間および最大 3 回の上限を共有し、警告には判定理由を出力する。
- `tests/src/exec-worktree.test.ts` に、`.git` がディレクトリの場合とファイルの場合、`.git` がない場合、2 種類の一時的失敗で上限を共有する場合、既存の dubious ownership と index.lock の判定を追加した。
- [[specdojo:exec-worktree-guide|exec worktree運用ガイド]] に、追加した再試行条件と上限、再試行しない条件を反映した。
- unit test、typecheck、lint などの全体検証は executor 終了後に親 runner が実行する。

## 5. 関連ドキュメント

- [[prj-0001:pjr-ghkd-resume-sync-git-diff-outside-repo]]（Git 実行ヘルパーの cwd の固定）
