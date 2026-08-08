---
specdojo:
  id: prj-0001:pjr-0162-exec-agent-flag-removal
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
---

# PJR-0162 旧agent指定フラグの撤去（--cmd/--agent-cmd/--edit-agent/--review-agent）

## 1. 概要

PJR-0159 で agent 指定フラグを `--by` 系（`--by` / `--edit-by` / `--review-by`）＋ `--auto` へ統一し、旧フラグ `--cmd` / `--agent-cmd` / `--edit-agent` / `--review-agent`（および `exec worktree agent` の `--agent-cmd`）は deprecated alias（動作維持＋警告）として残した。本項目は、その deprecation 期間（1〜2 リリース）経過後に旧フラグと生コマンド受理経路を物理撤去する後続タスクである。

## 2. 完了条件

- `exec run` / `exec resume` から `--cmd` / `--agent-cmd` / `--edit-agent` / `--review-agent` を削除し、`RunOpts` の該当フィールドを除去している。
- `exec worktree agent` から `--agent-cmd` を削除し、command 供給を `--by` nickname 解決（roster / exec-defaults）へ付け替えている。
- 生コマンド受理経路（`resolveAgentOverride` の raw command 分岐、`resolveInPlaceCommand` / `resolveRegisterCommand` の `auto-agent` フォールバック）を除去し、agent 指定を nickname のみに限定している。
- `--cmd` によるバッチ起動判定を除去し、バッチ起動は `--auto` のみに限定している。
- `normalizeAgentFlags` から deprecated 処理を除去（または関数を撤去）している。
- 旧フラグ・生コマンドに依存する既存テスト（`exec-run-inplace` / `exec-run-resolve-command` / `exec-run-resolve-claiming-actor` / `exec-register` / `exec-run`）を nickname 前提へ移行または削除している。
- ドキュメント（`command-reference` の非推奨移行表、`exec-operation-guide` / `exec-config-guide` / `exec-worktree-guide`、`sysd-*-agent-settings`）から旧フラグ記述を除去・更新している。
- `npm run build` / `npm run lint:ts` / `npm run lint:md` と関連テストが通る。

## 3. 作業内容

| No  | 作業                                                                   | 担当 | 状態 | メモ                                                        |
| --- | ---------------------------------------------------------------------- | ---- | ---- | ----------------------------------------------------------- |
| 1   | `exec run` / `exec resume` の旧フラグ定義と `RunOpts` フィールドを削除 | ARC  | done | `--cmd` / `--agent-cmd` / `--edit-agent` / `--review-agent` |
| 2   | 生コマンド受理経路とバッチ起動判定を除去し nickname 一本化             | ARC  | done | `resolveAgentOverride` ほか解決系                           |
| 3   | `exec worktree agent` の command 供給を `--by` nickname 解決へ付け替え | ARC  | done | `--agent-cmd` 撤去                                          |
| 4   | 旧フラグ・生コマンド依存テストの移行または削除                         | ARC  | done | 5 テストファイル                                            |
| 5   | ドキュメントから旧フラグ記述を除去・更新                               | ARC  | done | command-reference / guides / sysd                           |
| 6   | build / lint / テストによる検証                                        | ARC  | done | ts/md/関連テスト                                            |

## 4. 対応結果

- `exec run` / `exec resume` / `exec worktree agent` から旧 agent 指定フラグを削除し、`RunOpts` と正規化処理も撤去した。
- 単体指定を `--by`、mode 別指定を `--edit-by` / `--review-by`、バッチ起動を `--auto` に限定し、agent command は roster / exec-defaults の nickname 解決だけで取得するようにした。
- in-place / register / claiming actor の raw command フォールバックを削除し、関連 unit・integration・E2E fixture を登録済み nickname 前提へ移行した。
- command reference、exec guides、agent system design と package script を現行フラグへ更新した。
- build、TypeScript / Markdown lint、関連テストを実施した。全体テストのうち Git subprocess を使わない 835 件は成功し、Git を spawn する 21 件は実行環境の制約（`spawnSync git EPERM`）で開始できなかった。

## 5. 関連ドキュメント

- [[prj-0001:pjr-0159-exec-agent-flag-by-unification]]: deprecation/改名フェーズ（本撤去の前提）。
- [[specdojo:command-reference]]: 旧フラグの非推奨移行表を撤去する対象。
- `src/exec-run.ts`: 旧フラグ定義・解決ロジック・生コマンド経路。
- `src/exec-worktree-command.ts`: `exec worktree agent` の `--agent-cmd` と command 供給。
