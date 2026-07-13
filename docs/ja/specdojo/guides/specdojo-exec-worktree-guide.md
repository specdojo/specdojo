---
specdojo:
  id: specdojo-exec-worktree-guide
  type: guide
  status: draft
---

# SpecDojo exec worktreeガイド

SpecDojo Exec Worktree Guide

`specdojo exec worktree` による隔離実行の分割手順と安全条件を説明します。自動実行や通常の手動実行は [specdojo-exec-operation-guide.md](specdojo-exec-operation-guide.md) を参照します。

## 1. worktree分割コマンドの役割

`exec run --worktree` と `exec run --auto` は、worktree 準備、agent 起動、commit、merge、状態更新を一括で行います。各段階を人が確認しながら進める場合は `exec worktree` 配下の分割コマンドを使います。

| コマンド           | 責務                                                              | Git変更   | イベント変更 |
| ------------------ | ----------------------------------------------------------------- | --------- | ------------ |
| `worktree prepare` | 実行管理ファイルを checkpoint commit し、task worktree を準備する | あり      | なし         |
| `worktree status`  | worktree、result、Git差分の状態を確認する                         | なし      | なし         |
| `worktree agent`   | worktree内で agent command を1回実行する                          | agent次第 | なし         |
| `worktree commit`  | result と成果物変更を exec ブランチへ commit する                 | あり      | なし         |
| `worktree merge`   | exec ブランチを現在のブランチへ merge する                        | あり      | なし         |
| `worktree remove`  | 統合済み worktree を削除する                                      | あり      | なし         |

分割コマンドは `claim`、`complete`、`block` を暗黙には実行しません。対象タスクは事前に `doing` である必要があります。

## 2. 標準手順

```bash
REPO_ROOT="$(git rev-parse --show-toplevel)"

specdojo exec claim \
  --project <project-id> \
  --task <task-id> \
  --by <actor> \
  --msg "manual worktree run"

specdojo exec worktree prepare --project <project-id> --task <task-id>

# prepare が表示した path へ移動する
cd <worktree-path>
specdojo exec worktree status --project <project-id> --task <task-id>
specdojo exec worktree agent --project <project-id> --task <task-id>
specdojo exec worktree commit --project <project-id> --task <task-id>

# merge 先の root worktree へ戻る
cd "${REPO_ROOT}"
specdojo exec worktree merge --project <project-id> --task <task-id>
specdojo exec worktree remove --project <project-id> --task <task-id> --delete-branch

specdojo exec complete \
  --project <project-id> \
  --task <task-id> \
  --by <actor> \
  --msg "manual worktree run done"
```

途中で問題が見つかった場合は、worktree を削除せず `agent` から再実行します。

## 3. 共通の導出ルール

`exec worktree` は独自の JSON や状態ファイルを作りません。必要な情報は毎回既存情報から導出します。

| 情報                | 導出元                                                     |
| ------------------- | ---------------------------------------------------------- |
| worktree名 / branch | project 修飾 task ID から `<slug>` と `exec/<slug>` を導出 |
| worktreeパス        | `git worktree list --porcelain` から exec branch を検索    |
| plan / result パス  | project 設定と task ID から導出                            |
| claim actor         | `exec/events/` の claim event から導出                     |
| 比較起点 commit     | `git merge-base HEAD <exec-branch>` で導出                 |
| merge先             | `worktree merge` を実行した現在ブランチ                    |

project が解決できる場合、branch 名は project ID を含めます。例として `prj-0001:T-LAUNCH-prj-scope-010` は `exec/prj-0001-T-LAUNCH-prj-scope-010` になります。

## 4. prepare

`prepare` は claim 済みタスク専用の worktree を作成します。

```bash
specdojo exec worktree prepare \
  --project <project-id> \
  --task <task-id>
```

主な処理:

1. task state が `doing` であることを確認する。
2. プロジェクトロックを取得する。
3. plan、result、claim event を確認する。
4. plan がなければ `exec plan` 相当で生成する。
5. root index に stage 済み変更がないことを確認する。
6. plan、result、claim event を checkpoint commit する。
7. checkpoint commit から exec branch と worktree を作成する。

root にある無関係な未commit変更は checkpoint commit に含めません。ただし、stage 済み変更がある場合は停止します。

## 5. status

`status` は分割実行の現在地を確認する読み取り専用コマンドです。

```bash
specdojo exec worktree status \
  --project <project-id> \
  --task <task-id>
```

表示する主な情報:

| 情報          | 内容                                      |
| ------------- | ----------------------------------------- |
| task state    | `doing` / `blocked` など                  |
| claim actor   | 現在の実行主体                            |
| worktree      | path と branch                            |
| plan / result | 存在有無と変更状態                        |
| Git差分       | 未commit変更、stage済み変更               |
| 統合状態      | exec branch が現在ブランチへ merge 済みか |

worktree が未準備の場合も、削除や作成はせず `not prepared` として確認できます。

## 6. agent

`agent` は準備済み worktree をカレントディレクトリとして agent command を1回起動します。

```bash
specdojo exec worktree agent \
  --project <project-id> \
  --task <task-id>
```

claim actor の member 属性と `.specdojo/exec-defaults.yaml` の `providers.<provider>.command_template` から command を解決します。plan 内の `[[id]]` は `index replace --format path --missing keep` 相当で展開し、agent の標準入力へ渡します。

コマンドを明示する場合は `--agent-cmd` を使います。

```bash
specdojo exec worktree agent \
  --project <project-id> \
  --task <task-id> \
  --agent-cmd "opencode run --agent opencode-edit-agent"
```

`agent` は retry、fallback、commit、merge、event 更新を行いません。終了コードは agent command の終了コードをそのまま返します。

## 7. commit

`commit` は agent が更新した result と成果物を exec branch へ commit します。

```bash
specdojo exec worktree commit \
  --project <project-id> \
  --task <task-id>
```

commit 対象から除外する主なパス:

| 除外対象                         | 理由                                         |
| -------------------------------- | -------------------------------------------- |
| `exec/plans/`                    | plan は実行入力であり agent の成果物ではない |
| 対象 task 以外の `exec/results/` | 他タスクの記録を混ぜない                     |
| `exec/events/`                   | event は root 側の状態管理で扱う             |
| `generated/`                     | 再生成物を task 成果物に混ぜない             |

対象 task の result は成果物変更と同じ commit に含めます。変更がない場合は commit を作成しません。

上表の除外に加え、プロンプトインジェクション対策として commit 対象を mode 別の許可リストで絞ります。review は対象 task の result のみ、edit は result と plan の `targets` から解決した成果物（maintenance / bootstrap 系 approach は参考資料ディレクトリも）だけを commit し、許可リスト外の変更は `commit-scope:` 警告を出して worktree に残します。詳細は [specdojo-exec-config-guide.md](specdojo-exec-config-guide.md) の `agent 権限とプロンプトインジェクション対策` を参照します。

## 8. merge

`merge` は exec branch の commit を、コマンドを実行した現在ブランチへ統合します。

```bash
specdojo exec worktree merge \
  --project <project-id> \
  --task <task-id>
```

安全条件:

| 条件                                             | 意味                            |
| ------------------------------------------------ | ------------------------------- |
| exec branch 側に未統合 commit がある             | merge する差分が存在する        |
| task worktree に commit 対象の未commit変更がない | result / 成果物を取りこぼさない |
| 現在ブランチが exec branch ではない              | 自分自身へ merge しない         |
| 現在の未commit変更と merge 対象パスが重複しない  | 手作業の変更を壊さない          |

通常は `git merge --no-ff --no-edit` 相当で統合します。`--ff-only` 指定時は fast-forward 可能な場合だけ統合します。競合した場合は Git の競合状態を保持し、自動 abort しません。

## 9. remove

`remove` は不要になった task worktree を削除します。

```bash
specdojo exec worktree remove \
  --project <project-id> \
  --task <task-id> \
  --delete-branch
```

既定では exec branch を残します。`--delete-branch` を付けた場合だけ、merge 済み branch を `git branch -d` 相当で削除します。

`--force` は `git worktree remove --force` 相当であり、未commit変更が失われる可能性があります。exec branch の削除には `-D` 相当の強制削除を使いません。

## 10. complete / blockの記録

分割コマンドは状態 event を更新しないため、成果物確認後に人が明示的に `complete` または `block` を実行します。

```bash
specdojo exec complete \
  --project <project-id> \
  --task <task-id> \
  --by <actor> \
  --msg "worktree result verified"
```

完了条件を満たせない場合は result に状況を記録し、`block` を使います。

```bash
specdojo exec block \
  --project <project-id> \
  --task <task-id> \
  --by <actor> \
  --msg "waiting for clarification"
```
