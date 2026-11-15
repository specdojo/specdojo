---
specdojo:
  id: prj-0001:xer-pjr-ed0k-20261115t152522z-c3f3237b
  type: exec-result
  task_id: PJR-ED0K
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-ED0K/pjr-ed0k-20261115T152522Z-c3f3237b/plan.md
  started_at: "2026-11-15T15:25:28.007Z"
  completed_at: "2026-11-15T16:08:15.775Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- 統合の段（commit・検査・merge）で止まった schedule のタスクを、`exec resume --task &lt;id&gt; --resume-from executor` で executor の段からやり直せるようにした。どのリポジトリも統合していない run だけを executor へ戻し、統合成功済み・一部統合済み・merge 済みの run と、worktree が merge の途中の run は断る。起動前に統合先を exec branch と worktree へ取り込み、未 commit の変更と run の記録（attempt への退避）を保つ。統合の段の block 理由と result に、worktree の場所と次の操作を記録する。register の挙動は変えていない。回帰テストと文書を更新し、個票の対応結果を記入した。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/exec-operation-guide.md`: 変更、+10 / -10 行
- `docs/ja/specdojo/guides/exec-worktree-guide.md`: 変更、+1 / -1 行
- `docs/ja/specdojo/references/command-reference.md`: 変更、+1 / -1 行
- `src/exec/register-resume.ts`: 変更、+54 / -12 行
- `src/exec/run/lifecycle-commands.ts`: 変更、+104 / -8 行
- `src/exec/run/schedule-task.ts`: 変更、+21 / -1 行
- `tests/src/exec/pipeline-e2e.integration.test.ts`: 変更、+163 / -4 行
- `tests/src/exec/register-resume.test.ts`: 変更、+49 / -3 行

## 3. 申し送り

- 決めたこと: register の統合の段からの executor 再開には広げない（`selectResumableRegisterRun` は既定で従来どおり断り、schedule だけが `allowFailedIntegration` で許す）。必要なら別の登録簿項目で扱う。
- 決めたこと: 一部のリポジトリを統合済み（`stages.integrate.repos` が `merged`・`unchanged`・`branch-only`）の run、exec branch が merge 済みの run は executor へ戻さない。統合済みの成果との食い違いと二重統合を避けるため。
- 決めたこと: worktree が merge の途中なら runner は `git merge --abort` を行わずに止める。stage 済みの成果を失うため。
- 決めたこと: 統合先の取り込みは、統合の段から executor へ戻す場合だけに行う。reporter の段から戻す既存の再開と、`--resume-from` なしの統合だけの再開は変えていない。
- CHANGELOG に書く事項は個票の対応結果「CHANGELOG に書く事項」の節に記載した（CHANGELOG.md は未変更）。
- ESLint の `max-lines-per-function` の警告が `runResumeMode`（361 行）と `runPreparedTask`（714 行）に出ている。どちらも既存の長い関数で、本タスクでは分割していない。分割を検討する候補として扱う。
- 保護された設定の変更はない。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
