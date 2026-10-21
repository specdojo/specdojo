---
specdojo:
  id: prj-0001:pjr-2asz-init-gemma-reporter-26b
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-10-21T14:34:31Z"
---

# PJR-2ASZ 配布する名簿の雛形の gemma の reporter を 26b にし、モデル名を利用者の環境に合わせる

## 1. 概要

init が作る名簿の雛形では gemma の executor と reporter がすべて 31b を指し、モデル名も手元の Ollama で作ったタグ（mlx-work-64k）のままで、利用者の環境にそのままでは無い。既定の reporter を 26b にし、モデル名の決め方と用意の仕方を利用者が分かる形にする

## 2. 完了条件

- 0.4.2 の範囲とする（2026-10-21、利用者が承認）。
- `templates/init-agent-members.yaml` の `gemma-reporter` の既定のモデルを gemma4 の 26b にする（利用者の決定）。`gemma-executor`・`gemma-review-executor` は 31b のままとする。別名の `opencode-reporter` は `gemma-reporter` を指したままとし、`specdojo init` で opencode を選んだときの振り分けの表の reporter が 26b になることを確かめる。
- 雛形・`templates/opencode/` のモデル名から、手元の Ollama で作ったタグ（`-mlx-work-64k`）をなくし、利用者が `ollama pull` で取得できるタグ名にする。タグ名は Ollama の公式のモデルの一覧で確かめ、確かめた方法を result に書く。確かめられない場合は推測で埋めず、`_ASSUMPTION_` として残し、result の申し送りに人の確認として書く。
- 文脈の長さ（`num_ctx` など）を広げたい利用者のために、Modelfile で別のタグを作り `model` を書き換える手順を、`templates/opencode/README.md` か [[specdojo:exec-config-guide]] のどちらか 1 か所に短く書く。
- 既に導入した利用者の名簿は上書きされないこと（`init` は既存ファイルを上書きしない）を、同じ箇所に書き、26b に変えたい場合の書き換え方を示す。
- 本リポジトリの `.specdojo/agent-members.yaml` は変えない（保護された設定）。
- 単体テスト（`init` の生成内容のテストなど）で、opencode を選んだときの名簿と振り分けの表の reporter が 26b の実体を指すことを確かめる。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG の `## [Unreleased]` の節に書く。公開済みの版の節は変えない。

## 3. 作業内容

| No  | 作業                                                         | 担当 | 状態 | メモ         |
| --- | ------------------------------------------------------------ | ---- | ---- | ------------ |
| 1   | 名簿の雛形の gemma の reporter を 26b にし、モデル名を見直す | DEV  | done | 0.4.2 の範囲 |

## 4. 対応結果

- 実施内容:
  - `templates/init-agent-members.yaml` の `gemma-reporter` の既定モデルを `ollama-local/gemma4:26b` に更新し、`gemma-executor` および `gemma-review-executor` からローカル固有のタグを除去して `ollama-local/gemma4:31b` に統一した。
  - `templates/opencode/agents/specdojo-orchestrator.md` の `model` から `-mlx-work-64k` を削除し、`ollama-local/gemma4:31b` に変更した。
  - `templates/opencode/README.md` のモデル例を公式タグ表記に改め、文脈長（`num_ctx` など）を広げるための Modelfile によるタグ作成・名簿書き換え手順と、既存導入プロジェクトで `gemma-reporter` を 26b に変更するための書き換え手順を追記した。
  - `tests/src/commands/init.test.ts` を更新し、opencode 選択時の `gemma-reporter`（`ollama-local/gemma4:26b`）解決および振り分け表（`medium` ルーティング）の reporter が 26b の実体を指すことを検証した。
  - `CHANGELOG.md` の `## [Unreleased]` に変更内容を追記した。
- 成果物:
  - `templates/init-agent-members.yaml`
  - `templates/opencode/agents/specdojo-orchestrator.md`
  - `templates/opencode/README.md`
  - `tests/src/commands/init.test.ts`
  - `CHANGELOG.md`
  - `docs/ja/projects/prj-0001/controls/project-register/pjr-2asz-init-gemma-reporter-26b.md`
- 残課題: なし。

## 5. 関連ドキュメント

- [[specdojo:exec-config-guide]]
