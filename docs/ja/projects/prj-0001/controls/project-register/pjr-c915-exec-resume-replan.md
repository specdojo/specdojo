---
specdojo:
  id: prj-0001:pjr-c915-exec-resume-replan
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-09-29T12:29:04Z"
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
| 1   | 再開時に plan を作り直す処理を加える | DEV  | open | 元の plan は残す          |
| 2   | 統合テストを追加する                 | DEV  | open | AY1R と同じ状況を再現する |
| 3   | ガイドとリファレンスへ記載する       | DEV  | open | -                         |

## 4. 対応結果

-

## 5. 関連ドキュメント

- PJR-AY1R（発生した項目）、PJR-R0XA、PJR-CTV4（再開の経路）
- `src/exec-run.ts`、`src/exec-register-resume.ts`
