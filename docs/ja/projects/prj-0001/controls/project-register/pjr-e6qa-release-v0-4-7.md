---
specdojo:
  id: prj-0001:pjr-e6qa-release-v0-4-7
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: BA
  registered_at: "2026-10-26T11:13:25Z"
  due_on: "2026-10-31"
---

# PJR-E6QA v0.4.7 を公開する

## 1. 概要

PJR-6WQY・P14M・K87Y・MB92・TVGA を v0.4.7 として検証し、main へ昇格して npm に公開する。

## 2. 完了条件

- PJR-6WQY・P14M・K87Y・MB92・TVGA がすべて `done` で、`package.json` と `package-lock.json` の版が `0.4.7`、`CHANGELOG.md` に `0.4.7` の公開対象と日付が記載されている。
- ルートと `packages/docs-lint`・`packages/docs-site`・`packages/vscode-specdojo` の `npm ci` が通り、クリーンな作業ツリーで `npm run check` が通る。
- `npm pack` の配布物を空の Git リポジトリへ入れ、`init`、Dev Container の `shutdownAction`、OpenCode の `ollama-local` と `*-mlx-work-64k` モデル、`register add`、`exec run --register` の動作を確かめる。
- 公開候補が PR の merge commit で `main` へ入り、その commit を指す `v0.4.7` タグから npm の公開 workflow が起動する。
- npm の公開候補を利用者が承認した後、`latest` が `0.4.7` であること、タグで起動した workflow の結果、npm から入れた版の動作を確かめる。

## 3. 作業内容

| No  | 作業                               | 担当                  | 状態 | メモ                                                    |
| --- | ---------------------------------- | --------------------- | ---- | ------------------------------------------------------- |
| 1   | 版番号と変更履歴を確定する         | specdojo-orchestrator | done | release ブランチから `develop` へ統合済み               |
| 2   | 全体検証と配布物の試用を行う       | specdojo-orchestrator | done | クリーンな worktree と空のリポジトリで確認              |
| 3   | PR を merge し、タグを push する   | BA                    | done | PR #24 の merge commit `2e9f32798` に `v0.4.7` を付けた |
| 4   | npm 公開を承認し、公開版を確かめる | BA                    | done | npm の `latest` とタグの workflow を確認した            |

## 4. 対応結果

- `feature/prj-0001/release-v0-4-7` で版番号と変更履歴を commit し、`develop` へ統合した。
- ルートと 3 package の `npm ci --offline` が通った。クリーンな一時 worktree の `npm run check` は 177 テストファイル、2,775 テストを通過した。
- v0.4.7 の tarball を空の一時リポジトリへ入れた。`init` で `shutdownAction: none` と `ollama-local` の Gemma・Qwen `*-mlx-work-64k` モデルを確認した。`register add` と、Codex executor・Gemma reporter による `exec run --register` が統合まで通り、個票が `review` へ進んだ。
- 利用者が PR #24 を merge し、`main` の merge commit `2e9f3279829718cbeb4251f6f156c052c349828f` を指す `v0.4.7` タグを push した。npm の公開候補も利用者が承認した。
- npm registry の `latest` は `0.4.7`。タグから起動した [npm 公開 workflow](https://github.com/specdojo/specdojo/actions/runs/40324618919) と [文書サイトの workflow](https://github.com/specdojo/specdojo/actions/runs/40324618934) は成功した。
- npm registry から `specdojo@0.4.7` を空の一時リポジトリへ新規導入し、CLI の版表示が `0.4.7` であることと `init` の完了を確認した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-6wqy-catalog-less-deliverable-approach]]
- [[prj-0001:pjr-p14m-per-project-parent-validations-replace]]
- [[prj-0001:pjr-k87y-integrate-grade-run-per-document]]
- [[prj-0001:pjr-mb92-opencode-scaffold-ollama-work-64k]]
- [[prj-0001:pjr-tvga-devcontainer-scaffold-shutdown-action]]
