---
specdojo:
  id: prj-0001:pjr-fmz2-integrate-error-stderr
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-09-01T13:48:32Z"
  due_on: "2026-09-30"
  completed_at: "2026-09-02T14:37:56Z"
  block_reason: "agent exited with non-zero code: agent exited with non-zero code: agent-git-state-write: Git state changes detected; fields=HEAD, local-config; agent must leave commits and repository configuration ch…"
  conclusion: git 失敗メッセージで stderr を先頭付近へ置き、pathspec を件数へ要約した。切り詰めが起きても失敗原因が残る。
---

# PJR-FMZ2 統合失敗時のエラーに git stderr を残す

## 1. 概要

統合の失敗理由は `git <args> failed: <stderr>` の形で組み立てられるが、`args` に
commit 対象の pathspec が全件並ぶため文字列が長くなり、記録先で切り詰められて末尾の
stderr が失われる。

PJR-TA5C の統合失敗では、register イベントの `reason`、result の `block_reason`、
実行ログの一覧行のいずれも `-- docs/ja/proj…` で終わっており、git が何を理由に
失敗したのかを事後に特定できなかった。同じ commit を後から実行すると成功したため、
再現による切り分けもできなかった。

失敗の記録が原因を含まないと、一過性か再現性かの判断ができず、対処が推測になる。

## 2. 完了条件

- 統合が失敗した場合、git の stderr が切り詰められずに記録される。
- pathspec の長さが stderr の記録を圧迫しない。
- register イベントの `reason`、result の `block_reason`、実行ログの一覧で
  失敗理由を確認できる。
- 既存の成功時の出力を冗長にしない。

## 3. 作業内容

| No  | 作業                                         | 担当 | 状態 | メモ                                                        |
| --- | -------------------------------------------- | ---- | ---- | ----------------------------------------------------------- |
| 1   | git 失敗メッセージの構成を見直す             | ARC  | done | pathspec を件数へ要約し、stderr を先頭側へ移した            |
| 2   | 記録先ごとの長さ制限と切り詰め位置を確認する | ARC  | done | 3 記録先とも `sanitizeRegisterConclusion` の 200 文字が上限 |
| 3   | 単体テストを追加する                         | ARC  | done | `tests/src/exec-worktree.test.ts` を追加                    |

## 4. 対応結果

`src/exec-worktree.ts` の `gitOutput` が組み立てる失敗メッセージを、
`git <引数全文> failed: <stderr>` から
`git <サブコマンド> failed: <stderr> (args: <要約>)` へ変更した。

- `summarizeGitArguments` を追加し、`--` 以降の pathspec を `-- <件数> paths` へ要約する。
  個々の引数は 40 文字、要約全体は 120 文字を上限とする。
- `formatGitCommandFailure` を追加し、失敗原因（stderr）をサブコマンド名の直後へ置く。
  切り詰めが起きても先頭側に原因が残る。
- stderr が空の場合は `git <サブコマンド> failed (args: ...)` とし、コロン以降を付けない。
- 変更は失敗時のメッセージ構成のみで、成功時の出力は従来どおり変えていない。

記録先の長さ制限は、register イベントの `reason`、result の `block_reason`、
実行ログの一覧行（`formatRegisterRunSummary`）のいずれも
`sanitizeRegisterConclusion` の 200 文字上限を共有していることを確認した。
本変更後は、pathspec が 40 件でも
`integrate failed: git commit failed: <stderr> (args: -m title -- 40 paths)` が
200 文字に収まり、stderr 全文と引数要約の双方が記録される。

単体テストは `tests/src/exec-worktree.test.ts` に追加し、pathspec の件数要約、
引数の省略、stderr が空の場合、および長い pathspec を含む失敗理由が
`sanitizeRegisterConclusion` 通過後も stderr を保持することを検証する。

残課題として、pre-commit hook の出力のように stderr 自体が 200 文字を大きく超える場合は、
先頭 200 文字のみが記録される。全文保存が必要になった場合は記録先ごとの上限見直しが必要になる。

- 受け入れ時に orchestrator が、PJR-TA5C で実際に失敗した commit と同じ引数構成
  （メッセージ1件と pathspec 10件）で検証した。従来はパス列に埋もれて失われた stderr が、
  134文字のメッセージの先頭に現れる。

```text
git commit failed: error: pathspec did not match any file known to git (args: -m exec(register PJR-TA5C): plan を agent へ… -- 10 paths)
```

- 実行時に `agent-git-state-write` が block した。agent が `git reset` とリポジトリ設定の変更を
  行ったためである。`reflog` に残るのは `reset: moving to HEAD` のみで agent の commit はなく、
  成果物は `src/exec-worktree.ts` と新規テストに限られていた。orchestrator が内容を確認して
  統合し、統合後に単体テスト1334件の通過と上記の出力を再確認した。
- この block でも agent は申し送りを記入しなかった。[[prj-0001:pjr-vh6r-agent-config-write-handoff]]
  で起票した問題が `agent-config-write` に限らないことが判明したため、同項目の対象を保護機構
  全体へ広げた。

## 5. 関連ドキュメント

- [[prj-0001:pjr-ta5c-agent-run-primitive]]: 本問題が実際に発生した項目。
- [[prj-0001:pjr-y0ah-integrate-only-resume]]: 統合失敗からの回復に関する項目。
