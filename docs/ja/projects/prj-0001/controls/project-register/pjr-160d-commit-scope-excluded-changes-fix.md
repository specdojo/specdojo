---
specdojo:
  id: prj-0001:pjr-160d-commit-scope-excluded-changes-fix
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  difficulty: hard
  owner: sol-executor
  registered_at: "2026-11-13T21:53:02Z"
  completed_at: "2026-11-15T01:19:20Z"
  conclusion: commit 対象外の変更が残ると統合と撤去を止め、対象パスと次の操作を result とログに残すようにした
  derived_from:
    - PJR-1Y1M
  commit_type: fix
  commit_scope: commit-scope
---

# PJR-160D executor の変更が commit の対象外のまま統合されないようにする

## 1. 概要

PJR-1Y1M の修正

## 2. 入力

- PJR-1Y1M の修正。kata-wave-1 の後、wave-2 を作る前に流す（indie が 2026-11-14 に承認）

## 3. 完了条件

- executor が commit の対象外のファイルを変えたまま報告したとき、runner が統合を黙って進めない。対象外の変更が残っていれば、統合を止めて理由（どのファイルか）を result と報告に残す。
- 型の文書を作る approach（`bootstrap` と `*-maintenance`）では、型を直すのに要るファイル（成果物カタログの項目・schema・文書サイトの型のメニュー）を commit の対象に含められるかを検討し、含めるなら許可リストの決め方を直す。含めない場合は、変更案として報告に書く決まりにする。
- `commit-scope: unresolved target doc id (not committable)` の警告が出るのに、型のファイルが commit される理由を確かめ、警告の意味と実際の振る舞いを合わせる。
- 対象外の変更が残る場合と、型の文書を作る場合の両方を、回帰テストで確かめている。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節に書いている（PJR-EPQ3）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                             | 担当         | 状態 | メモ                                             |
| --- | ------------------------------------------------ | ------------ | ---- | ------------------------------------------------ |
| 1   | commit 対象外の停止・記録を全 agent タスクへ適用 | sol-executor | done | commit 前後・統合前・撤去時・再開時に検査        |
| 2   | 型の許可範囲と未解決 ID 警告を整理               | sol-executor | done | 許可範囲を維持し、周辺ファイルは変更案として報告 |
| 3   | 回帰テストと利用ガイドを更新                     | sol-executor | done | 主要な検証は親 runner が実行                     |
| 4   | 再開 E2E の fixture と停止ログの run を修正      | sol-executor | done | 対象内の再開を維持し、対象外は統合だけ停止       |

## 5. 対応結果

### 5.1. 実施内容と判断

- 登録簿由来だけに適用されていた停止ガードを `assertCommitScope` / `UncommittedChangesError` へ一般化した。agent の edit / review とも、対象外の変更が残れば commit・統合・通常の worktree 撤去を停止し、worktree を保持する。schedule の統合再開でも検査し、複数リポジトリ統合の事前確認でも停止する。
- 対象パス・停止理由・次のアクションを stdout、`integrate.log`、result の申し送りに自動記録する。dry-run ではファイルへ書き込まない。`tmp/` や既知の生成物の除外、人間の schedule タスクでの選択方式は維持した。
- `bootstrap` / `*-maintenance` の成果物カタログ・schema・型のメニューを一括許可する案は採用しない。他の成果物や親 runner の動作に影響するため、checkpoint 済みの `targets` から個別に解決できる場合だけ許可する。対象外なら executor は編集せず、変更理由・対象パス・提案差分・必要な検証を報告の `handoff` と個票（register タスクの場合）へ書き、対象の見直しまたは別タスクで反映する。
- 未解決 ID の従来の警告は、doc-index / catalog による個別パス解決の失敗を表す一方、approach の型ディレクトリ許可は独立して適用されていた。警告を `no individual path; approach directory permissions still apply` に改め、未解決 ID でも型ファイルが commit される挙動と一致させた。
- 前回の親検証で失敗した再開 E2E 5 件は、fake executor が宣言済みの `test:doc` と別の `pipeline-artifact.md` を作っていた。rate limit 後もこのファイルが残り、reporter 再開、hook 拒否後の統合再開、merge 後の撤去再開、親検証の再実行でも新しい停止条件に該当した。対象外変更で止まる仕様は維持し、成功系 fixture を catalog で宣言した `docs/test/doc.md` に揃えた。既存の stage の再利用・試行数・commit 数の期待は維持する。
- task ID と run ID が異なる呼び出しでも、停止ログの既定パスを選択中の result と同じ run にした。別 run のログを自ら作り、そのログが再開を妨げることを防ぐ。

### 5.2. 成果物と検証

- `src/exec/worktree-ops-commit.ts`、統合・撤去・schedule / register runner、`protection-handoff.ts` と export を更新した。
- `tests/src/exec/worktree-ops.integration.test.ts` に、対象外変更による commit / merge / 撤去の停止、result・ログ記録、確認後の再開、review / retrofit の停止、dry-run、bootstrap と全 4 種の maintenance の型許可と周辺ファイルの停止、追跡済み schema の編集・削除による停止を記録した。
- `tests/src/exec/pipeline-e2e.integration.test.ts` の成功系 fixture を対象内へ修正し、reporter 再開後に対象外変更を検出して停止し、確認後は executor / reporter を再実行せず統合だけを完了する回帰テストを追加した。worktree ops には task ID と run ID が異なる場合のログ保存先と再開を確かめる回帰テストも追加した。
- 利用ガイドの停止条件・変更案の報告規約・未解決 ID の説明を更新した。今回の再開で Prettier、hook と同じ `node --import tsx tools/catalog-validate-if-configured.mjs`、履歴リンク検証、`git diff --check` が通過した。catalog は変更していない re-export と未作成文書について警告を出すが、終了コードは 0。統合テストの個別実行も親検証との二重実行禁止の対象であるため、`pipeline-e2e.integration.test.ts`・`worktree-ops.integration.test.ts` を含む `test:integration`、`typecheck`・`lint:ts`・`test:unit`・Markdown 等の検証は親 runner に委ねる。今回の修正後のテスト成功は executor では未確認であり、実測結果は親 runner の evidence を参照する。

### 5.3. 申し送り

- 未解決の設計判断・保護設定の変更提案はない。統合後は運用メモに従い、PJR-JSEY の対象に PJR-160D を加え、実 agent の start から review までを確認してから close する。

### 5.4. CHANGELOG に書く事項

- 不具合修正: executor が commit 対象外の変更を残した場合、schedule 由来のタスクでも統合と worktree 撤去を停止し、対象パスと次のアクションを result とログへ記録する。型の対象 ID を解決できない場合の警告を、approach によるディレクトリ許可と整合する説明に修正する。

## 6. 関連ドキュメント

- [[prj-0001:pjr-1y1m-commit-scope-excluded-changes-silent|元の課題 PJR-1Y1M]]
- [[specdojo:exec-config-guide|exec 設定ガイド]]
- [[specdojo:exec-worktree-guide|exec worktree ガイド]]
- [[prj-0001:pm-orchestrator-playbook|prj-0001 のオーケストレーター運用メモ]]
