---
specdojo:
  id: prj-0001:pjr-ta5c-agent-run-primitive
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: ARC
  registered_at: "2026-09-01T12:02:19Z"
  due_on: "2026-09-30"
  completed_at: "2026-09-01T13:46:54Z"
  block_reason: "integrate failed: git commit -m exec(register PJR-TA5C): plan を agent へ渡し stdout を得る agent run を公開する -- docs/ja/projects/prj-0001/controls/project-register/pjr-ta5c-agent-run-primitive.md docs/ja/proj…"
  conclusion: specdojo agent run を追加し、plan を指定 agent へ渡して stdout を得る primitive を公開した。
---

# PJR-TA5C plan を agent へ渡し stdout を得る agent run を公開する

## 1. 概要

grade の 3 段評価を shell script 化するために必要な primitive が CLI として公開されていない。
「plan を指定した agent へ渡し、その stdout をファイルへ得る」操作である。

内部実装は `src/exec-run.ts` の `runAgentCommand` として既に存在し、stdout を捕捉して
rate limit 検出にも用いている。しかし CLI から呼べないため、現在は job の agent が
自然言語の手順を解釈して手作業で代行している。

## 2. 完了条件

- `specdojo agent run --plan <path> --by <nickname> --out <file>` で、指定 agent に plan を
  渡し stdout をファイルへ保存できる。
- agent は `pm-members.yaml` の nickname で一意に決まり、選択に揺れがない。
- rate limit を検出した場合は既存の `exec-limit` の判定と同じ扱いになり、終了コードで
  呼び出し側が中断を判別できる。
- `--dry-run` で解決後のコマンドを実行せずに確認できる。
- 単体テストで agent 解決と stdout 保存の契約を検証している。
- 単体テストがファイル内で連続実行しても成功する。

## 2.1. 前回試行で判明した不具合

前回の試行は `test-unit` の失敗で `waiting` へ遷移した。worktree は
`worktrees/prj-0001-PJR-TA5C` に保持されている。調査結果は次のとおりで、実装ではなく
テストの独立性の欠如が原因である。

`runAgentPlan` が冒頭で呼ぶ `activateResolvedProjectPaths` は、`SPECDOJO_SCHEDULE_PATH` と
`SPECDOJO_EXECUTION_PATH` をプロセス全体へ設定する。テストの `withRepo` はケースごとに
一時リポジトリを作って削除するが、この2つの環境変数を復元していない。そのため2件目以降は
削除済みの前ケースのパスを `resolveProjectPaths` が返し、`Cannot uniquely resolve project
for execution path: ...` で失敗する。例外は `commandError` が stderr へ出すため、テストからは
「出力ファイルが無い」「dry-run が何も表示しない」という別の症状に見える。

3件を単独実行するといずれも成功し、連続実行すると先頭以外の2件が失敗することを確認済みである。

修正は `withRepo` の `finally` で両環境変数を元の値へ復元することで足りる。
`.github/instructions/vitest.instructions.md` の「`process.env` を変更する場合は、元の値を
保存して復元する」に従う。

あわせて `src/agent.ts` と `src/agent-run.ts` の2ファイルが存在する。役割が重複していないかを
確認し、重複していれば1つへ統合する。

## 3. 作業内容

| No  | 作業                                       | 担当 | 状態 | メモ                       |
| --- | ------------------------------------------ | ---- | ---- | -------------------------- |
| 1   | `runAgentCommand` の呼び出し境界を整理する | ARC  | done | 既存の exec run 経路を維持 |
| 2   | `agent run` サブコマンドを追加する         | ARC  | done | `src/agent.ts`             |
| 3   | rate limit 検出と終了コードの契約を定める  | ARC  | done | exec-limit を再利用        |
| 4   | 単体テストを追加する                       | ARC  | done | env 復元でケース間を独立   |
| 5   | command-reference へ追記する               | ARC  | done | agent 節を追加             |

## 4. 対応結果

`specdojo agent run --plan <path> --by <nickname> --out <file>` を追加した。

既存の agent 実行関数を共有境界として公開し、`exec run` の挙動を維持したまま `agent run` からも利用する。agent は `pm-members.yaml` の nickname で完全一致させ、human、無効化された agent、コマンドを解決できない agent を拒否する。`--dry-run` では解決後のコマンドだけを表示する。

agent の stdout は `--out` のファイルへ保存し、親ディレクトリが無ければ作成する。通常失敗は終了コード `1`、既存の rate limit 検出に一致した場合は専用の終了コード `75` とし、いずれの場合も捕捉済み stdout を保存する。

実装は CLI の責務を `src/agent.ts` へ集約し、重複する `src/agent-run.ts` は設けなかった。project path は agent の子プロセス環境にだけ渡し、プロセス全体の環境変数を変更しない。単体テストも `SPECDOJO_PROJECT`、`SPECDOJO_SCHEDULE_PATH`、`SPECDOJO_EXECUTION_PATH` をケースごとに復元し、stdout 保存、nickname の決定性、dry-run、rate limit 終了コードを連続実行で検証する。

## 5. 関連ドキュメント

- [[prj-0001:pjr-excv-grade-per-document-pipeline]]: 本 primitive を前提とする実行経路。
- [[prj-0001:pjr-wzma-job-responsibility-boundary]]: job から手順を追い出す前提。
- [[prj-0001:pjr-49d2-quality-assessment]]: grade コマンドの起点。
