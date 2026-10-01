---
specdojo:
  id: prj-0001:pjr-98g4-multi-repo-worktree-agent
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
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

| No  | 作業                                                   | 担当 | 状態 | メモ |
| --- | ------------------------------------------------------ | ---- | ---- | ---- |
| 1   | リポジトリ別の worktree の作成・撤去・命名             | DEV  | open | -    |
| 2   | agent の作業ディレクトリと provider の書き込み許可     | DEV  | open | -    |
| 3   | 保護設定・Git 状態の検査と evidence のリポジトリ別対応 | DEV  | open | -    |
| 4   | 統合テスト                                             | DEV  | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-5822-multi-repo-item-design]]
