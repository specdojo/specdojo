---
specdojo:
  id: prj-0001:pjr-69vp-multi-repo-e2e-docs
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: high
  owner: DEV
  registered_at: "2026-10-01T03:54:10Z"
  block_reason: "agent exited with non-zero code: タスクが要求する `CHANGELOG.md` の更新と、tools 配下の検証スクリプトが未実施です(executor の書き込み許可リスト外のため)。このため完了条件を満たしていません。次のアクションは、許可リストの調整、または人間による `CHANGELOG.md` への反映です。"
---

# PJR-69VP 複数リポジトリ構成の実構成検証と文書の更新

## 1. 概要

2 リポジトリの統合テストと e2e で動作を確かめ、docs-structure-guide・exec のガイド・CHANGELOG・移行ガイドを更新する（v0.3.0）

## 2. 完了条件

- 方針は [[prj-0001:pjr-5822-multi-repo-item-design]] の決定内容に従う。変更箇所は同個票の「現行実装の変更箇所」を起点にする。
- プロジェクトリポジトリ 1 つとプロダクトリポジトリ 2 つの構成を一時ディレクトリに作り、1 つの項目で 3 つのリポジトリを変更する exec run が、worktree の作成から統合・trace の記録まで通る e2e または統合テストがある。
- 同じ構成で、統合の各位置での失敗と再開が期待どおりになることを確かめる。
- 宣言を持たない構成（同一リポジトリ構成を含む）の回帰を確かめる。
- 実際の agent CLI（claude・codex・antigravity）でプロダクト worktree へ書き込めるかの確認手順を、一時ディレクトリに 3 リポジトリ構成を作るスクリプトまたはコマンドの列として `tools/` か result に用意する。agent の sandbox からは別の agent を起動できないため、確認の実行は orchestrator が行う。
- opencode の `permission.external_directory` を変える場合の差分案（保護された agent 定義のため変更はしない）を result の申し送りに書く。
- 統合 commit の `Refs:` が `<project-id>:<item-id>` になっていることを、統合テストで確かめる（PJR-30SW）。
- 2026-10-01〜02 の 1 回目の実行（claude）の差分の控えは `/workspaces/specdojo-workspace/specdojo/logs/pjr-69vp-attempt1.patch` にある（e2e と文書 5 件）。その後に develop へ入った PJR-9KST・PJR-GENJ・PJR-6RN3 の変更を踏まえて作り直す。`CHANGELOG.md` の更新を忘れない。
- `docs-structure-guide` の「別リポジトリ構成」（「現行実装の境界」「二重 worktree」の各章）、exec のガイド、`CHANGELOG.md`、v0.3.0 の移行ガイドを、実装後の動作に合わせて更新する。
- 宣言（`repos`）を持たない project の動作が変わらないことを、既存のテストと回帰テストで確かめる。
- `.specdojo/exec-defaults.yaml`・`package.json` など agent が変更できない設定は変更しない。必要な変更は result の申し送りに書く。
- 親検証（lint・test・typecheck・validate-schema）がすべて通る。

## 3. 作業内容

| No  | 作業                                | 担当 | 状態 | メモ                                                       |
| --- | ----------------------------------- | ---- | ---- | ---------------------------------------------------------- |
| 1   | 3 リポジトリ構成の e2e              | DEV  | done | `tests/src/exec-register-pipeline-e2e.integration.test.ts` |
| 2   | 失敗と再開の検証                    | DEV  | done | app1・app2・project の各位置（PJR-9KST のケースを拡張）    |
| 3   | 宣言のない構成の回帰                | DEV  | done | 同じテストファイルの回帰ケース                             |
| 4   | ガイド・CHANGELOG・移行ガイドの更新 | DEV  | done | `CHANGELOG.md` は agent が変更できないため申し送り         |

## 4. 対応結果

- 実施内容（2 回目）: 1 回目の差分の控えを、PJR-9KST・PJR-GENJ・PJR-6RN3 の後の develop に合わせて作り直した。PJR-9KST が失敗位置ごとの再開テストを `tests/src/exec-register-pipeline-e2e.integration.test.ts` に入れていたため、別ファイルを作らず、同じファイルの fixture（プロジェクトリポジトリ 1 つとプロダクトリポジトリ 2 つ、`app2` は `integration_branch` を宣言）にケースを加えた。
- 3 リポジトリの e2e: 新しい executor `exec-multi-repo` がプロジェクト worktree とプロダクト worktree 2 つへ書き込み、実際の CLI 経路の `exec run --register --worktree` が、worktree の作成から統合・trace の記録・撤去まで通ることを確かめる。agent の `cwd` が `<worktree_base>/<task>/project/` であることも確かめる。
- 統合の失敗と再開: PJR-9KST の `app1`・`app2`・project の各位置のケースに、失敗後に全リポジトリの worktree が残ること、プロジェクトが未統合であること、再開後の `Refs:` と result の trace 表の merge commit を確かめる検査を加えた。
- `Refs:`: プロダクト側の commit・merge commit とプロジェクト側の merge commit が `Refs: <project-id>:<item-id>` を持つことを、統合テストで確かめる（PJR-30SW）。
- 回帰: `repos` を宣言しない構成で、`<worktree_base>/<task-id>/` 直下の worktree、修飾した `Refs:`、trace の章を持たない result、`integrate.repos` が無い pipeline state を確かめる。
- 文書: `docs-structure-guide` の「別リポジトリ構成」（採用条件、現行実装の境界、複数リポジトリの worktree と統合順序、複数リポジトリの統合の失敗と再開）、`exec-worktree-guide`、`exec-operation-guide`（再開前の取り込みで統合済みのプロダクトを除くこと）、`specdojo-config-reference` の古い記述、v0.3.0 移行ガイドを実装後の動作に合わせて更新した。
- 残課題: `CHANGELOG.md` と `tools/` は agent の書き込み許可の外にあるため変更していない。CHANGELOG の追記案、実 agent CLI の確認手順、opencode の差分案は result の申し送りに記載する。実 agent CLI（claude・codex・antigravity）での確認は orchestrator が行う。

## 5. 関連ドキュメント

- [[prj-0001:pjr-5822-multi-repo-item-design]]
- [[prj-0001:pjr-p7hy-multi-repo-single-item]]
- [[specdojo:docs-structure-guide]]
