---
specdojo:
  id: prj-0001:pjr-ed0k-exec-resume-executor-from-integrate
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-15T10:47:32Z"
  completed_at: "2026-11-15T16:49:18Z"
  conclusion: 0.8.0 の第 1 段で直した（統合の段で止まった schedule のタスクを、executor の段からやり直せるようにする）。親の検証をすべて通って統合済み
  derived_from:
    - PJR-52EE
  commit_type: feat
  commit_scope: exec
---

# PJR-ED0K 統合の段で止まった schedule のタスクを、executor の段からやり直せるようにする

## 1. 概要

統合の段の失敗から、成果を保ったまま executor の段へ戻して再開する手段を用意する

## 2. 入力

- 2026-11-15、bds-progress-report-005 と ifx-file-agent-evidence-005 が統合の段で止まり、exec resume --resume-from executor が「cannot resume the executor from the integrate stage」で使えなかった。orchestrator が blob から記録を戻し、成果物を手で直して統合をやり直した（PJR-TN43 の D）

## 3. 完了条件

- 統合の段（commit・検査・merge）で止まった schedule のタスクを、worktree の成果を保ったまま executor の段からやり直せる。`exec resume --task <id> --resume-from executor` が「cannot resume the executor from the integrate stage」で断らない。
- やり直すとき、統合の段で stage した変更・run の記録（evidence・pipeline-state・result・ログ）を失わない。失う操作が要る場合は、先に控えるか止める。
- 統合の段の失敗の理由（検査の名前、commit の対象外のパス、merge の失敗など）と次の操作を、block の理由と result に残す。
- 統合の段で止まったタスクに develop の直しを取り込む正規の手段（runner が行う同期）を用意するか、使い方を書く。orchestrator が worktree で `git merge` や `git merge --abort` を流さずに済む。
- 統合の段で止まった場合と、そこから executor の段へ戻す場合を、回帰テストで確かめている。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。保護された設定の変更は、変更案を書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節に書いている（PJR-EPQ3）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                             | 担当 | 状態 | メモ |
| --- | ------------------------------------------------ | ---- | ---- | ---- |
| 1   | 統合の段から executor の段へ戻す再開を足す       | DEV  | done | -    |
| 2   | 成果と記録を保つ扱いと、develop の取り込みを足す | DEV  | done | -    |
| 3   | block の理由と回帰テストを足す                   | DEV  | done | -    |

## 5. 対応結果

### 5.1. 実施内容

- `selectScheduleExecutorResume`（`src/exec/register-resume.ts`）は、統合の段で止まった run も、どのリポジトリも統合していなければ executor の段へ戻す。統合が成功済みの run と、一部のリポジトリを統合済み（`stages.integrate.repos` が `merged`・`unchanged`・`branch-only`）の run は理由を付けて断る。register の `selectResumableRegisterRun` は既定で従来どおり断り、schedule だけが `allowFailedIntegration` で許す。
- `exec resume --task <id> --resume-from executor`（`src/exec/run/lifecycle-commands.ts`）は、`blocked` の統合の段（`pipeline_stage=integrate`）を受け付け、「cannot resume the executor from the integrate stage」で断らない。統合の段から戻すときは `prepareExecutorResumeFromIntegration` が、状態を変える前に次を行う。
  - exec branch が merge 済みなら止め、統合だけの再開（`exec resume --task <id>`）を案内する。
  - project または product の worktree が merge の途中なら止める。中止（`git merge --abort`）は stage 済みの変更を失うため、runner は行わない。
  - 統合先（project は root の現在ブランチ、product は統合先ブランチ）を、既存の `syncTaskWorktreesWithIntegrationTargets` で exec branch と worktree へ取り込む。未 commit の変更と run の記録は取り込みの前に控えて戻し、戻せない場合は取り込み前へ戻して止める。これが develop の直しを取り込む正規の手段で、orchestrator が worktree で `git merge` や `git merge --abort` を流さずに済む。
- 再開した executor は既存の `snapshotRunAttempt` で、前回の state・evidence・ログを `*.attempt-N.*` に退避してから走る。stage 済みの変更・result・`integrate.log` は worktree に残ったまま引き継ぐ。
- 統合の段の block 理由（`src/exec/run/schedule-task.ts` の `integrationBlockReason`）は、失敗した操作のメッセージ（検査の名前、commit の対象外のパス、merge の失敗など）に、worktree の場所と次の操作（`--resume-from executor` での直しと、統合だけの再試行）を足す。同じ文を block イベントと result の両方に残す。
- 回帰テストを足した。
  - `tests/src/exec/register-resume.test.ts`: 統合の段（`failed`・`running`）から executor へ戻せること、統合成功済み・一部統合済みの run を断ること。
  - `tests/src/exec/pipeline-e2e.integration.test.ts`: 統合の段で止まり block 理由と result に次の操作が残ること、統合先の直しを取り込んでから executor → reporter → 統合を通し、前回の evidence が attempt として残ること、worktree が merge の途中なら状態を変えずに止まること。統合成功済みの run を断る場合を、従来の「統合の段は断る」場合から置き換えた。
- `docs/ja/specdojo/references/command-reference.md`・`docs/ja/specdojo/guides/exec-operation-guide.md`・`docs/ja/specdojo/guides/exec-worktree-guide.md` に、統合の段からの再開、取り込み、断る条件、block 理由の次の操作を書いた。

### 5.2. 迷った点と決めたこと

- register にも同じ再開を広げるか: 広げない。個票は schedule の不具合で、register の統合の段の再開は別の段取り（register 遷移と post-review）を持つ。register は従来どおり断る。必要なら別の項目で扱う。
- 一部のリポジトリを統合済みの run を戻すか: 戻さない。統合済みの成果と executor の直しが食い違い、統合の段がそのリポジトリを二重に扱うためである。
- 統合先の取り込みを、reporter の段から戻す再開にも行うか: 行わない。統合の段から戻す場合に限り、既存の再開の挙動を変えない。統合だけの再開（`--resume-from` なし）も変えない。
- merge の途中の worktree: runner が中止すると stage 済みの成果を失うため、自動では中止せず止める（記憶 `worktree-merge-abort-destroys-staged` と同じ判断）。
- 保護された設定の変更はない。

### 5.3. CHANGELOG に書く事項

- `exec resume --task <id> --resume-from executor` が、統合の段（commit・検査・merge）で止まった schedule のタスクを受け付ける。executor を起動する前に統合先を exec branch と worktree へ取り込み、worktree の成果と run の記録を保ったまま executor → reporter → 統合をやり直す。統合が成功済み・一部統合済み・merge 済みの run と、worktree が merge の途中の run は断る。
- schedule の統合の段の block 理由と result に、worktree の場所と次の操作（`--resume-from executor` での直し、または統合だけの再試行）を記録する。

### 5.4. 残課題

- なし。

## 6. 関連ドキュメント

- [[prj-0001:pjr-tn43-user-decisions-pending]]
