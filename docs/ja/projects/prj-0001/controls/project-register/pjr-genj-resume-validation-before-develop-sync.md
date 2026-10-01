---
specdojo:
  id: prj-0001:pjr-genj-resume-validation-before-develop-sync
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: review
  priority: medium
  owner: DEV
  registered_at: "2026-10-01T04:30:54Z"
  block_reason: "agent exited with non-zero code: agent-config-write: protected configuration changes detected; paths=.opencode/.gitignore, .opencode/package-lock.json, .opencode/package.json; agent must record the re…"
---

# PJR-GENJ reporter 段からの再開で develop を取り込む前に親検証を実行する

## 1. 課題内容

exec run --resume で reporter 段から再開すると、統合先ブランチの最新を worktree へ取り込む前に親検証を実行する。統合先で直した不具合が反映されず、同じ失敗を繰り返す。親検証の前に取り込むか、取り込み後に検証し直す

## 2. 影響範囲

| 観点         | 影響                                                           |
| ------------ | -------------------------------------------------------------- |
| スコープ     | `exec run --resume` で reporter 段または統合段から再開する場合 |
| スケジュール | 再開のたびに無駄な失敗が 1 回起き、待ち時間が延びる            |
| コスト       | 修正とテストの追加                                             |
| 品質         | 統合先で直した不具合が再開時の検証に反映されない               |
| 関係者       | exec run を使う利用者と orchestrator                           |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                        |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | 再開時に親検証を実行してから、waiting の時点と同じ方法で統合先の最新を取り込んでいる                                                                                                        |
| 対応策   | 親検証の前に統合先ブランチの最新を exec branch と worktree へ取り込む。衝突した場合は現行どおり再開を止めて理由を示す                                                                       |
| 依存事項 | なし                                                                                                                                                                                        |
| 完了条件 | reporter 段または統合段からの再開で、統合先で直した不具合が親検証に反映されることを確かめるテストがある。宣言を持たない project と複数リポジトリの project の両方で動く。親検証がすべて通る |

## 4. 対応結果

- 解決内容: `exec run --register --worktree --resume` で reporter 段または統合段から再開するとき、register の `start` 遷移と親検証より前に、統合先ブランチの最新を exec branch と worktree へ merge commit で取り込むようにした。複数リポジトリの project では宣言順に各プロダクトの統合先を取り込み、最後にプロジェクトの統合先を取り込む。取り込みで新しい commit が入った場合は、記録済みの親検証が成功していても検証し直す。統合段の再開でも親検証を実行し、失敗した場合は統合せずに `waiting` へ戻す。統合先の変更が未コミット成果と重なる場合や、項目自身の記帳ファイル以外で競合する場合は merge を中止し、register の状態を変えずに再開を拒否して理由を表示する。merge 済みで worktree の撤去だけが残る統合再開では取り込まない。
- 変更箇所: `src/exec-repo-integration.ts`（`syncWorktreeWithIntegrationTarget`、`syncTaskWorktreesWithIntegrationTargets`）、`src/exec-run.ts`（register 再開の取り込みと親検証のやり直し）、`docs/ja/specdojo/guides/exec-operation-guide.md`、`docs/ja/specdojo/references/command-reference.md`。
- 確認結果: wait の後に統合先で直した修正が、reporter 段からの再開時の親検証に反映され項目が `review` へ進む E2E テストを `tests/src/exec-register-resume.integration.test.ts` に追加した。宣言を持たない project と複数リポジトリの project の取り込み、未コミット成果と重なる場合と競合時の中止、記帳ファイルの競合解決を確かめるテストを `tests/src/exec-task-repos.integration.test.ts` に追加した。テストと型検査は親検証で実行する。
- 未対応: Schedule タスク（`exec resume`）の reporter 段・統合段の再開には取り込みを入れていない。統合段からの再開で親検証へ反映されることを確かめる E2E テストは追加していない（取り込みと親検証の呼び出しは reporter 段と共通）。
- 再発防止策: 再開の入口で、統合先との同期を親検証より前に置く順序をテストで固定した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-fzc4-multi-repo-design-investigation]]
