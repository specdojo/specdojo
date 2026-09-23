---
specdojo:
  id: prj-0001:pjr-reds-integrate-staged-deletion
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: ARC
  registered_at: "2026-09-03T09:50:00Z"
  due_on: "2026-09-30"
  completed_at: "2026-09-03T10:07:14Z"
  conclusion: staged 済みの削除を git add の対象から除外し、削除を含む変更を統合できるようにした。commit の pathspec は HEAD も照合するため削除は記録される。
---

# PJR-REDS 統合処理が削除ファイルを含む変更を commit できない

## 1. 概要

worktree 実行の統合処理は、commit 対象へ `git add -A -- <paths>` を実行する。対象に削除された
ファイルが含まれ、その削除が既に index へ入っている場合、この呼び出しが pathspec 不一致で
失敗する。

```text
integrate failed: git add failed:
  fatal: pathspec 'docs/ja/projects/prj-0001/jobs/job-grade-kata-expert-check.yaml' did not match any files
```

削除が staged 済みだと、そのパスは作業ツリーにも index にも存在しない。`git add` の pathspec
はこの2つを照合するため一致せず、`-A` を付けても致命的エラーになる。

| index の状態      | `git add -A -- <path>` |
| ----------------- | ---------------------- |
| 未 staged の削除  | 成功                   |
| staged 済みの削除 | fatal (exit 128)       |

統合処理は pre-commit hook による再整形へ収束させるため `git add` をやり直す。1回目で削除が
staged されるので、2回目で必ず失敗する。結果としてファイル削除を伴う変更は統合できない。

PJR-WZMA で発生した。3つの job を1つへ統合する設計のため削除が本質的に伴い、executor と
reporter が成功しても統合段で止まる。

PJR-TA5C の統合失敗も同じ原因の可能性が高い。当時は失敗理由が長さ上限で切り詰められて
特定できず、orchestrator による手動統合で回避した。原因が読めるようになったのは
[[prj-0001:pjr-fmz2-integrate-error-stderr]] の変更以降である。

## 2. 完了条件

- ファイルの削除を含む変更を統合できる。
- 削除が staged 済みの状態で統合を再試行しても失敗しない。
- 新規追加、変更、リネームの統合が従来どおり動作する。
- pre-commit hook による再整形後の再 stage が引き続き機能する。
- 削除を含む統合の回帰テストがある。

## 3. 検討事項

- `git add -A` を pathspec 付きで使う限りこの制約は残る。commit 対象の指定方法自体を見直すか、
  削除済みパスを除外して扱うかの判断が要る。
- `git commit -- <paths>` の pathspec commit も同じ照合規則に従うため、統合経路全体で
  削除パスの扱いを揃える必要がある。
- 対象を限定する目的（利用者の無関係な変更を巻き込まない）は維持する。全件 `git add -A` へ
  戻すと目的を損なう。

## 4. 作業内容

| No  | 作業                                   | 担当 | 状態 | メモ                                     |
| --- | -------------------------------------- | ---- | ---- | ---------------------------------------- |
| 1   | 統合経路で削除パスが通る箇所を洗い出す | ARC  | done | pathspec 付き `git add` は4箇所          |
| 2   | 削除パスの扱いを決めて実装する         | ARC  | done | add 対象のみ絞り、commit 対象は変えない  |
| 3   | 再試行時に失敗しないことを確認する     | ARC  | done | staged 済み削除の回帰テストで確認        |
| 4   | 回帰テストを追加する                   | ARC  | done | 削除単独・削除/変更/追加の混在・helper   |
| 5   | PJR-WZMA の統合を再開して確認する      | ARC  | open | 本変更のマージ後に `--resume` で統合段へ |

## 5. 対応結果

`git add` の pathspec は作業ツリーと index だけを照合するため、削除が既に index へ入っている
パスはどちらにも存在せず fatal になる。一方 `git commit` / `git commit --amend` の pathspec は
HEAD も照合し、index から消えたパスを削除として記録できる（git 本体の
`t7501-commit-basic-functionality.sh` の `partial commit that involves removal (2)` が同じ条件を
検証している）。そこで、commit 対象の集合は変えずに `git add` へ渡すパスだけを絞る方針とした。

- `src/exec-worktree-ops.ts` に `selectStageablePaths` と `stageCommitTargets` を追加した。
  `git ls-files` の結果と作業ツリーの存在確認で「stage できるパス」を選び、該当が無ければ
  `git add` 自体を実行しない。
- pathspec 付き `git add` の呼び出し4箇所を `stageCommitTargets` へ置き換えた。
  `stabilizeCommitTargets`（hook 再整形後の再 stage）、`commitWorktreeChanges`（worktree の
  commit）、`checkpointAndEnsureWorktree`（checkpoint）、`src/exec-run.ts` の
  `commitRegisterItemChanges` と `commitRegisterState`（in-place register の commit）。
- commit 対象は従来どおり許可リスト・除外リストで限定したままで、全件 `git add -A` へは戻して
  いない。未 staged の削除、変更、新規追加、リネームの扱いも変わらない。
- 回帰テストを `tests/src/exec-worktree-ops.integration.test.ts` に追加した。削除・変更・追加が
  混在する commit、削除が staged 済みの状態からの再試行（本件の再現条件）と merge、
  `selectStageablePaths` の選別を検証する。

残課題は作業内容の No.5（PJR-WZMA の統合を `--resume` で再開して確認する）である。本変更が
統合ブランチへ入った後に実施する。

- 受け入れ時に orchestrator が、本欠陥で止まっていた PJR-WZMA の統合を `--resume` で再開し、
  成功することを確認した。削除された2つの job ファイルが commit に記録されている。修正前は
  同じ操作が `git add failed: fatal: pathspec ... did not match any files` で失敗していた。
- `git add` の pathspec が作業ツリーと index だけを照合するのに対し、`git commit` の pathspec は
  HEAD も照合するという違いを利用している。staged 済みの削除を add の対象から外しても、
  commit では削除として記録される。commit 対象の限定という目的は損なわれていない。
- typecheck、lint:ts、validate:schema、単体テスト1356件の通過を確認した。

## 6. 関連ドキュメント

- [[prj-0001:pjr-wzma-job-responsibility-boundary]]: 本問題で統合が止まっている項目。
- [[prj-0001:pjr-fmz2-integrate-error-stderr]]: 原因を読めるようにした変更。
- [[prj-0001:pjr-y0ah-integrate-only-resume]]: 修正後に統合段から再開するための経路。
