---
specdojo:
  id: prj-0001:pjr-nrwj-register-run-grade-sidecar-scope
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-24T03:36:55Z"
  due_on: "2026-11-30"
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

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- 関連: PJR-A54F（schedule のタスクの絞り込み）、PJR-F4TG（混ざった commit）。
