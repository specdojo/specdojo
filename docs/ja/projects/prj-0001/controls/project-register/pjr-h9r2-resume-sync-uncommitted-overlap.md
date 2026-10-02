---
specdojo:
  id: prj-0001:pjr-h9r2-resume-sync-uncommitted-overlap
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: review
  priority: medium
  owner: DEV
  registered_at: "2026-10-01T20:01:26Z"
  block_reason: "agent exited with non-zero code: runner 検証 `test-integration`（`npm run test:integration`）が exit 1 で failed のため、完了条件を満たすと確認できない。"
---

# PJR-H9R2 再開前の統合先の取り込みが worktree の未 commit の変更と重なると再開できない

## 1. 課題内容

PJR-GENJ の再開前の取り込みは、executor が worktree に残した未 commit の変更と統合先の変更が同じファイルに及ぶと、git merge が上書きを拒み再開できない。executor の成果を退避または commit してから取り込み、衝突は現行どおり理由を示して止める

## 2. 影響範囲

| 観点         | 影響                                                           |
| ------------ | -------------------------------------------------------------- |
| スコープ     | `exec run --resume` で reporter 段または統合段から再開する場合 |
| スケジュール | 該当する項目は再開できず、最初からのやり直しになる             |
| コスト       | 取り込みの手順の修正とテスト                                   |
| 品質         | executor の成果が残っていても再開できない                      |
| 関係者       | exec run を使う利用者                                          |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | PJR-GENJ の再開前の取り込みは、executor が worktree に残した未 commit の変更と統合先の変更が同じファイルに及ぶと、git merge が上書きを拒んで止まる                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| 対応策   | 取り込みの前に executor の成果を一時的に退避（stash など）し、取り込み後に戻す。戻すときに衝突した場合は、現行どおり理由と worktree の場所を示して再開を止め、成果を失わない                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 依存事項 | [[prj-0001:pjr-genj-resume-validation-before-develop-sync]]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| 完了条件 | 未 commit の変更と統合先の変更が同じファイルに及んでも衝突しない場合は、再開が取り込みを終えて親検証へ進むことを確かめる統合テストがある。衝突する場合は成果を失わずに止まることも確かめる。宣言を持たない project と複数リポジトリの project の両方で動く。親検証がすべて通る。1 回目の実行（codex）では、同じファイルの衝突しない変更を戻すときに `git stash pop --index` が index の衝突で失敗した（`tests/src/exec-task-repos.integration.test.ts` の「merges non-conflicting changes to the same file and restores the executor edit」）。戻すときは index を復元しない方法にする。差分の控えは `/workspaces/specdojo-workspace/specdojo/logs/pjr-h9r2-attempt1.patch` にある |

## 4. 対応結果

- 解決内容: 再開前の統合先取り込みで、worktree の未 commit 変更を未追跡ファイルと stage 状態ごと一時退避し、merge commit 作成後に復元するようにした。同一ファイルの非競合 hunk は両方を反映して再開を続行する。復元が競合した場合は同期 merge を元の HEAD へ巻き戻し、executor の成果を元の worktree へ戻してから理由を示して停止する。
- 変更箇所: `src/exec-repo-integration.ts`、`tests/src/exec-task-repos.integration.test.ts`、`tests/src/exec-register-resume.integration.test.ts`、`docs/ja/specdojo/guides/exec-operation-guide.md`、`docs/ja/specdojo/references/command-reference.md`。
- 確認結果: 宣言を持たない project と複数リポジトリの project で、同一ファイルの非競合変更を同期できるテストを追加した。CLI の reporter 再開で、未 commit 成果と重なる統合先の修正を取り込んだ後に親検証へ進むケースと、競合時に追跡済み・未追跡の executor 成果を失わずに停止するケースも追加した。親検証は pipeline runner で実行する。
- 再発防止策: 同一ファイルの非競合、実競合時の巻き戻しと成果復元、複数リポジトリの同期順序を統合テストで固定した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-genj-resume-validation-before-develop-sync]]
- [[prj-0001:pjr-69vp-multi-repo-e2e-docs]]
