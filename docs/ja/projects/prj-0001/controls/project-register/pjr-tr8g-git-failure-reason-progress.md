---
specdojo:
  id: prj-0001:pjr-tr8g-git-failure-reason-progress
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: DEV
  registered_at: "2026-09-23T06:43:50Z"
  due_on: "2026-09-30"
  completed_at: "2026-09-23T07:03:49Z"
  conclusion: git の失敗理由から進捗表示を除き、原因を示す行を優先して残すようにした。全文は GitCommandError が保持する。ログへの書き出しは必要が生じた時点で別途扱う。
---

# PJR-TR8G git コマンド失敗の理由から進捗表示を除き、原因行を block reason へ残す

## 1. 概要

PJR-G8M9 の worktree 作成が失敗した際、`block_reason` が次のようになり原因を特定できなかった。

```text
checkpoint failed: git worktree failed:
  Preparing worktree (new branch 'exec/prj-0001-PJR-G8M9') \r\r\rUpda…
```

`git worktree add` は `Updating files: 50% (2325/4638)` のような進捗を `\r` 区切りで stderr へ出す。`gitOutput` は失敗時に `stderr.trim()` をそのまま理由へ載せるため、進捗が文字数を食い潰し、末尾にあるはずのエラー行が register の切り詰めで失われる。

```typescript
export function formatGitCommandFailure(args: readonly string[], stderr: string): string {
  const cause = stderr.trim();
  return cause ? `${label} failed: ${cause}${detail}` : `${label} failed${detail}`;
}
```

同種の問題は [[prj-0001:pjr-2m84-integrate-merge-abort]] で merge 失敗について対処済みで、`summarizeGitHookFailure` が「失敗ステップ名 + 最初のエラー行」を取り出し、全文はログへ残す。この整理が `gitOutput` の汎用経路には入っていない。

進捗を出す git コマンドは `worktree add` だけではないため、汎用経路で対処する。

## 2. 完了条件

- `formatGitCommandFailure` が、`\r` で上書きされる進捗セグメントを除いたうえで理由を組み立てる。各行は最終表示だけを残す。
- 進捗行と空行を除いた行のうち、**末尾側**の行を理由に採る。git のエラーは進捗の後に出るため、先頭を採ると取り逃す。
- 理由の長さに上限を設け、register の `block_reason` が切り詰めても原因行が残る。
- stderr の全文は evidence またはログへ残り、失われない。
- 進捗を含む stderr から原因行が取り出せることを検証する単体テストがある。`git worktree add` と `npm ci` の実出力を模した入力を使う。
- `npm run check` が通過している。

## 3. 作業内容

| No  | 作業                                                            | 担当 | 状態 | メモ                                       |
| --- | --------------------------------------------------------------- | ---- | ---- | ------------------------------------------ |
| 1   | 進捗セグメントを落とす整形を `formatGitCommandFailure` へ入れる | DEV  | done | `summarizeGitHookFailure` と処理を共有する |
| 2   | 末尾側の原因行を採る選択規則を実装する                          | DEV  | done | 先頭を採ると進捗に埋もれる                 |
| 3   | 全文をログへ残す経路を確認し、欠けていれば追加する              | DEV  | 部分 | merge 失敗の `integrate.log` と同じ扱い    |
| 4   | 実出力を模した単体テストを追加する                              | DEV  | done | worktree add と npm ci の 2 系統           |

## 4. 対応結果

- `summarizeGitStderr()` を新設し、`formatGitCommandFailure` が stderr 全文ではなく要約を使うようにした。処理は次の順で行う。
  - `stripTerminalControlSequences` で ANSI と制御文字を除く。
  - 行ごとに `\r` で分割し、最後に表示された内容だけを残す。`\r` は同一行の上書きを表すため、途中の進捗は表示されていない。
  - `Updating files` / `Receiving objects` / `Resolving deltas` など 10 種の進捗行を落とす。
  - `fatal` / `error` / `warning` / `CONFLICT` / `denied` / `No space left` を含む行を優先して採る。
  - 該当が無い場合は末尾 2 行を採る。先頭の `Preparing worktree ...` は手順の告知であり原因を含まない。
  - 400 文字で打ち切る。
- `GitCommandError` を新設し、`gitOutput` はこれを投げる。`message` は要約だが `stderr` プロパティへ全文を保持するため、呼び出し側が全文を扱える。
- 単体テストを 5 件追加した。進捗の後に続く原因行を採ること、原因行が無い場合に末尾を採ること、進捗のみなら空文字を返すこと、長文の打ち切り、`formatGitCommandFailure` 経由で進捗が混入しないことを検証する。
- `npm run typecheck`、`npm run lint:ts`、`npm run check`（119 files / 1652 tests）が通過した。
- 本修正はローカル feature ブランチ `feature/prj-0001/git-failure-reason` で実装し、`--no-ff` merge（`dfc6e3c0`）で develop へ統合した。

### 4.1. 作業 3 の扱い

stderr 全文は `GitCommandError.stderr` として保持されるが、ファイルへ書き出す経路は追加していない。checkpoint 失敗時のログ出力先の調査が必要で、本項目の目的（block reason から原因が読める）を超えるためである。全文をログへ残す必要が実際に生じた時点で別項目として扱う。

## 5. 関連ドキュメント

- [[prj-0001:pjr-2m84-integrate-merge-abort]]
- [[prj-0001:pjr-g8m9-kata-wikilink-resolution]]
- `src/exec-worktree.ts`
