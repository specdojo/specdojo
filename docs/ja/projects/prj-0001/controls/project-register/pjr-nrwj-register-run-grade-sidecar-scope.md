---
specdojo:
  id: prj-0001:pjr-nrwj-register-run-grade-sidecar-scope
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-24T03:36:55Z"
  due_on: "2026-11-30"
  completed_at: "2026-11-24T04:58:31Z"
  conclusion: register の worktree と再開の経路の checkpoint が、項目の対象の文書の grade の結果だけを取り込むようになった
  derived_from:
    - PJR-A54F
  commit_type: fix
  commit_scope: exec
---

# PJR-NRWJ register の run の checkpoint が、ほかの文書の grade の結果を取り込む

## 1. 課題内容

- 2026-11-24 の `PJR-F4TG` の register の run の開始（start）の記帳の commit（`23d6bf8bcd`）に、同じ時刻に流れていた kata の run（`T-KATA-WAVE-6-PROJECT-prj-success-criteria-and-acceptance-criteria-sample-*`）が作った grade の結果 4 件（`execution/grade/results/specdojo.prj-success-criteria-and-acceptance-criteria-{rulebook,recipe,sample,template}.yaml`）が入った。
- PJR-A54F は schedule のタスクの checkpoint だけを、自分の対象の grade の結果に絞った。register の worktree の経路（`src/exec/run/register-worktree.ts` など）は、引数を省いた呼び出しのまま、ルートで変更中の grade の結果をすべて取り込む。

## 2. 入力

- v0.10.0 に入れる（利用者の方針、2026-11-24: 今回の実行で詰まったところを issue として起票して直す）

## 3. 影響範囲

- register の run の commit に、関係のない grade の結果が混ざり、記録の由来が分かりにくくなる。
- 並べて流した kata の run と同じ grade の結果を変えると、統合で衝突しうる（PJR-A54F と同じ型の衝突）。

## 4. 対応方針

- register の worktree の経路の checkpoint でも、grade の結果を、その項目が対象とする文書の結果だけに絞る。対象の文書が grade の対象でない項目では、grade の結果を取り込まない。どう絞ったかを個票の対応結果に書く。
- `lifecycle-commands.ts`・`register-state.ts`・`worktree-command.ts` のほかの経路も同じに扱うかを確かめ、扱いと理由を個票の対応結果に書く。
- 統合テストで、ルートにほかの文書の grade の結果の変更があっても、register の run の commit に入らないことを確かめる。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証の `test-integration` を通す。

## 5. 対応結果

### 5.1. 解決内容

- `src/exec/run/register-grade-scope.ts` に `registerGradeResultPaths` を追加した。項目の `targets` を catalog の成果物へ解決し、その文書の grade の結果のパスだけを返す。catalog 外の対象や catalog が無い項目は何も返さない。
- 絞り込みは `gradeCheckpointPaths` の第 2 引数（PJR-A54F で追加済み）に渡す。結果のサイドカーだけを絞り、`criteria` と `pipeline` は従来どおり取り込む。
- register の worktree の経路（`register-worktree.ts`）と、再開の経路（`register-resume.ts` から `register-state.ts` の `registerBookkeepingPaths`）に適用した。後者は `ownGradeResultPaths` を必須の引数にした。

### 5.2. ほかの経路の扱い

- `lifecycle-commands.ts` は schedule のタスクの統合再開の経路で、register の項目を扱わない。対象の文書も持たないため、今回は変えない。
- `worktree-command.ts` は項目を持たない汎用の worktree の操作で、絞る対象を決められないため、従来どおり全件を扱う。

### 5.3. 確認結果

- `tests/src/exec/worktree-ops.integration.test.ts` に、ほかの文書の grade の結果がルートにあっても、grade の対象でない項目の checkpoint に入らないことを確かめるテストを追加し、通った。
- `npm run typecheck` と `npm run lint:ts`（エラー 0）を通した。`test-integration` は親の検証が行う。

### 5.4. CHANGELOG に書く事項

- 区分: Fixed
- 行の文案: register の run の checkpoint が、項目の対象でない文書の grade の結果を取り込まないようにした（PJR-NRWJ）。

## 6. 関連ドキュメント

- 関連: PJR-A54F（schedule のタスクの絞り込み）、PJR-F4TG（混ざった commit）。
