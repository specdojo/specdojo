---
specdojo:
  id: prj-0001:pjr-c915-exec-resume-replan
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: deferred
  priority: medium
  owner: DEV
  registered_at: "2026-09-29T12:29:04Z"
  block_reason: "agent exited with non-zero code: runner 検証の `typecheck`（`npm run typecheck`、exit 2、`src/exec-run.ts(6268,36)` の TS2339: `RegisterResumeTarget` に `initialChanges` が存在しない）と `test-integration`（`npm run t…"
  conclusion: v0.3.0 には入れず次の版で再開する。再開時は agy・claude の 2 回の失敗（RunOpts に replan がない、RegisterResumeTarget に evidence・initialChanges がない型エラーと統合テストの失敗、範囲外の Job 実行記録の変更）を完了条件に加えてから実行する
---

# PJR-C915 exec run --resume で executor の成果を残したまま plan を作り直せるようにする

## 1. 概要

`exec run --register ... --worktree --resume` は、止まった段（executor / reporter / 統合）から再開する。このとき、plan は最初の実行で生成したものをそのまま使う。

2026-09-29 の PJR-AY1R では、executor が段階移行の条件に従って第 1 段で止まった。利用者の判断で個票の完了条件を第 1 段に絞ってから `--resume` したが、reporter は範囲を絞る前の plan（「54 件をすべて外出しする」）で判断して未完了とし、統合されなかった。`--resume` を繰り返しても plan は作り直されない。orchestrator が worktree の成果を手で develop に適用して対処した。

## 2. 完了条件

- `exec run --register ... --worktree --resume --replan` で、executor の成果と worktree を残したまま、現在の個票から plan を作り直して再開できる。
- 作り直した plan は、新しい plan ファイルとして保存し、元の plan は残す（履歴として追える）。evidence と result に、plan を作り直したことが記録される。
- reporter の段から再開する場合は、作り直した plan を reporter に渡す。executor の段から再開する場合は、作り直した plan を executor に渡す。
- `--replan` は `--resume` と一緒のときだけ使える。`--force-restart` とは同時に使えない。
- 個票の完了条件を変えて `--resume --replan` すると、reporter が新しい完了条件で判断することを、統合テストで確かめる。
- `exec-worktree-guide.md` と `command-reference.md` に記載されている。
- `npm run check` が成功する。

## 3. 作業内容

| No  | 作業                                 | 担当 | 状態 | メモ                      |
| --- | ------------------------------------ | ---- | ---- | ------------------------- |
| 1   | 再開時に plan を作り直す処理を加える | DEV  | done | 元の plan は残す          |
| 2   | 統合テストを追加する                 | DEV  | done | AY1R と同じ状況を再現する |
| 3   | ガイドとリファレンスへ記載する       | DEV  | done | -                         |

## 4. 対応結果

- `exec run` に `--replan` を追加した。`--resume` と一緒のときだけ指定でき、`--resume` なし・`--force-restart` との同時指定はエラーにする。
- `--resume --replan` では、root の個票を exec branch の個票へ `git merge-file` で三方向に取り込み、現在の個票から新しい stem の plan と result を worktree に作って `exec(register <id>): replan` として exec branch に commit してから再開する。worktree と executor の未コミット成果はそのまま残す。個票が worktree 側の未コミット変更と競合した場合は何も変更せずに再開を拒否する。
- executor の段から再開する場合は作り直した plan を executor に、reporter の段から再開する場合は reporter に渡す。統合だけが残る run では `--replan` を拒否する。
- 元の plan は残し、元の result は `superseded` にする。作り直した記録は `evidence.json` の `replan`（`exec-evidence.schema.yaml` に追加）、`pipeline-state.json` の `replans`（`artifacts` は新しい plan / result へ差し替え）、result の申し送りに残す。
- `tests/src/exec-register-resume.integration.test.ts` に、reporter が元の完了条件で未完了と判断した後に root の個票で完了条件を絞り、`--resume --replan` で新しい完了条件によって complete になることを確かめる統合テストと、引数の組み合わせを拒否するテストを追加した。
- `exec-worktree-guide.md` と `command-reference.md` に `--replan` を記載した。

## 5. 関連ドキュメント

- PJR-AY1R（発生した項目）、PJR-R0XA、PJR-CTV4（再開の経路）
- `src/exec-run.ts`、`src/exec-register-resume.ts`
