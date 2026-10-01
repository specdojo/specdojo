---
specdojo:
  id: prj-0001:pjr-98g4-multi-repo-worktree-agent
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: high
  owner: DEV
  registered_at: "2026-10-01T03:53:39Z"
---

# PJR-98G4 タスク単位の複数 worktree と agent の作業ディレクトリ

## 1. 概要

`<task-id>`/ の下にリポジトリごとの worktree を作り、agent の作業ディレクトリと各 provider の sandbox の許可を複数のルートへ広げる（v0.3.0）

## 2. 完了条件

- 方針は [[prj-0001:pjr-5822-multi-repo-item-design]] の決定内容に従う。変更箇所は同個票の「現行実装の変更箇所」を起点にする。
- `repos` を持つ project の `exec run --worktree` で、`<worktree_base>/<task-id>/<repo>/` にプロジェクトと各プロダクトの worktree を作り、撤去・孤児検出・命名をリポジトリ別に扱う。
- agent の `cwd` はプロジェクト worktree とし、プロダクト worktree を各 provider（claude・codex・antigravity・opencode）の追加ディレクトリと書き込み許可に加える。リポジトリごとの絶対パスを環境変数（`SPECDOJO_REPO_<NAME>` など）で渡す。provider ごとの対応状況と制約を result に記録する。
- 保護設定の検査（`src/exec-agent-protected-config.ts`）・Git 状態の検査（`src/exec-agent-git-state.ts`）・evidence の変更記録（`src/exec-evidence.ts`）を、プロダクト worktree を含むリポジトリ別に行う。
- プロダクトが 2 つ以上の宣言でも worktree の作成・撤去・検査が働くことを、実 Git を使う統合テストで確かめる。
- プロジェクト worktree のディレクトリ名（`<task-id>/` の下の名前）を決め、その名前を `repos` の `name` の予約名として設定の検証で拒否する（PJR-HQBK の残課題）。
- exec worktree の中で設定を読む場合も、`repos` の `path` がリポジトリ別の worktree を指すよう解決する（PJR-HQBK の残課題）。
- 宣言（`repos`）を持たない project の動作が変わらないことを、既存のテストと回帰テストで確かめる。
- `.specdojo/exec-defaults.yaml`・`package.json` など agent が変更できない設定は変更しない。必要な変更は result の申し送りに書く。
- 親検証（lint・test・typecheck・validate-schema）がすべて通る。

## 3. 作業内容

| No  | 作業                                                   | 担当 | 状態 | メモ                                                               |
| --- | ------------------------------------------------------ | ---- | ---- | ------------------------------------------------------------------ |
| 1   | リポジトリ別の worktree の作成・撤去・命名             | DEV  | done | `src/exec-task-repos.ts` を新設し、`exec-worktree-ops` から呼ぶ    |
| 2   | agent の作業ディレクトリと provider の書き込み許可     | DEV  | done | runner が起動コマンドへ provider 別の引数を付け足す                |
| 3   | 保護設定・Git 状態の検査と evidence のリポジトリ別対応 | DEV  | done | プロダクト側は `<repo>:<path>` で記録する                          |
| 4   | 統合テスト                                             | DEV  | done | `tests/src/exec-task-repos.integration.test.ts`（プロダクト 2 つ） |

## 4. 対応結果

- 実施内容
  - 配置: `repos` を持つ project では、プロジェクト worktree を `<worktree_base>/<task-id>/project/`、各プロダクト worktree を `<worktree_base>/<task-id>/<name>/` に作る。branch 名は各リポジトリで共通の `exec/<task-id>` とし、プロダクト側は `integration_branch`（省略時は現在のブランチ）の先端から作る。checkpoint commit はプロジェクトリポジトリだけで行う。`setup` の `install`・`build` は省略時 `true` とした。
  - 予約名: プロジェクト worktree のディレクトリ名を `project` に決め、`repos[].name` の予約名として設定の読み込みと schema の両方で拒否する。
  - worktree 内の設定: プロジェクト worktree（`<task-id>/project/` で `exec/<task-id>` を checkout した linked worktree）の中で設定を読むと、`repos[].path` の代わりに同じタスクの `<task-id>/<name>/` へ解決する。
  - 撤去・破棄・孤児検出: 撤去は全プロダクト worktree が撤去できる（未 commit の変更が無く、統合先へ merge 済み）ことを確かめてから、プロダクト、プロジェクトの順にまとめて行い、空になった `<task-id>/` を消す。古い worktree の破棄（再 claim・`release --reset-worktree`）と `exec worktree prune` の孤児 branch 検出をプロダクトリポジトリにも広げた。
  - agent: `cwd` はプロジェクト worktree のまま、`SPECDOJO_REPO_PROJECT`・`SPECDOJO_REPO_<NAME>`・`SPECDOJO_REPO_NAMES` で各 worktree の絶対パスを渡し、プロンプトに各リポジトリの場所と `<repo>:<path>` の書き方を加える。親プロセスから継いだ `SPECDOJO_REPO_*` は落とす。
  - 検査: 保護設定と Git 状態の検査を全リポジトリで行い、違反をプロダクト側は `<repo>:<path>`・`<repo>:HEAD` で示す。result の申し送りにはリポジトリごとの差分を `# repo: <name>` 付きで残す。commit 前の保護設定の再検査もプロダクト worktree に行う。evidence の変更ファイルと diff の要約にプロダクト側を `<repo>:<path>` で加え、再開時の target coverage はこの書式で照合する。
  - 統合前のガード: プロダクトの commit・統合（PJR-0WAA）が入るまで、プロダクト worktree に変更か commit が残るタスクは、プロジェクト側の commit の前に block し、全 worktree を残す。
  - 手動運用: `exec worktree` の `prepare`・`status`・`agent`・`commit`・`remove`・`prune` が複数 worktree を表示・検査する。
- provider ごとの対応状況と制約

| provider      | 対応                                                                        | 制約                                                                                                                                         |
| ------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `claude`      | `--add-dir <path>...` と `--allowedTools 'Edit(//<path>/**)'...` を付け足す | mode 別 settings の `Edit` 許可が作業ディレクトリ相対のため、絶対パスの許可を CLI 引数で渡す。実 CLI での書き込み確認は PJR-69VP で行う      |
| `codex`       | `--add-dir <path>` を付け足す                                               | `--sandbox workspace-write` の書き込みルートに加わる。各 worktree の `.git` は codex の仕様で読み取り専用のまま                              |
| `antigravity` | `--add-dir <path>` を付け足す                                               | _ASSUMPTION_: `--add-dir` を複数指定でき、`-p "$(cat)"` の後ろに置いても解釈される。実 CLI での確認は PJR-69VP で行う                        |
| `copilot`     | `--add-dir <path>` を付け足す                                               | _ASSUMPTION_: 利用中の copilot CLI が `--add-dir` に対応する。実 CLI での確認は PJR-69VP で行う                                              |
| `opencode`    | 環境変数とプロンプトでパスを渡すだけで、書き込み許可は付けない              | 作業ディレクトリ外は `.opencode/agents/*.md` の `permission.external_directory: deny` で拒否される。agent 定義は保護対象のため変更していない |

- 成果物
  - 実装: `src/exec-task-repos.ts`（新設）、`src/exec-worktree.ts`、`src/exec-worktree-ops.ts`、`src/exec-worktree-command.ts`、`src/exec-run.ts`、`src/exec.ts`、`src/exec-evidence.ts`、`src/exec-agent-protected-config.ts`、`src/exec-agent-git-state.ts`、`src/exec-protection-handoff.ts`、`src/specdojo-config.ts`。
  - schema・文書: `docs/specdojo/schemas/v1/specdojo-config.schema.yaml`、`docs/ja/specdojo/references/specdojo-config-reference.md`、`docs/ja/specdojo/guides/docs-structure-guide.md`。
  - テスト: `tests/src/exec-task-repos.test.ts`、`tests/src/exec-task-repos.integration.test.ts`、`tests/src/specdojo-config-repos.test.ts`、`tests/docs/specdojo/schemas/specdojo-config-schema.test.ts`。
- 残課題
  - プロダクトリポジトリの commit・統合・統合先ブランチへの merge と、失敗位置からの再開は PJR-0WAA で扱う。現状はプロダクトに変更が残ると統合前に block する。
  - opencode でプロダクト worktree へ書き込むには、`.opencode/agents/*.md` の `permission.external_directory` に worktree の配置（例: `<worktree_base>/**`）への許可を人が加える必要がある。
  - `exec trial` は単一リポジトリのまま扱う。
  - 親検証のリポジトリへの割り当ては PJR-V96B で扱う。
  - `.specdojo/exec-defaults.yaml`・`package.json` は変更していない。`command_template` を変えずに動くよう、追加の引数は runner が付け足す。

## 5. 関連ドキュメント

- [[prj-0001:pjr-5822-multi-repo-item-design]]
