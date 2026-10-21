---
specdojo:
  id: prj-0001:pjr-stb4-opencode-readme-gemma-mlx
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: low
  difficulty: easy
  owner: DEV
  registered_at: "2026-10-21T14:57:21Z"
  derived_from:
    - PJR-2ASZ
---

# PJR-STB4 opencode の README に Apple シリコン向けの mlx 版の gemma の案内を加える

## 1. 概要

名簿の雛形は環境を選ばない gemma4:26b と gemma4:31b を既定にした（PJR-2ASZ）。Mac の Apple シリコンでは Ollama の公式の mlx 版（gemma4:26b-mlx など）が使えるため、選び方と書き換え方を opencode の README に一言添える

## 2. 完了条件

- 0.4.2 の範囲とする（2026-10-21、利用者が承認）。
- `templates/opencode/README.md` の、モデルの指定と文脈を広げる手順の近くに、次を 2〜4 行で書く。
  - Mac の Apple シリコンでは、Ollama の公式の mlx 版（`gemma4:26b-mlx`・`gemma4:31b-mlx`）を `ollama pull` で取得して使えること。
  - 使う場合は `.specdojo/agent-members.yaml` の `model` を `ollama-local/gemma4:26b-mlx` などに書き換えること。Modelfile で文脈を広げる場合は `FROM` に mlx 版のタグを書くこと。
  - 既定の雛形は環境を選ばない無印のタグ（`gemma4:26b`・`gemma4:31b`）のままとすること。
- タグ名は Ollama の公式の一覧（<https://ollama.com/library/gemma4/tags>）にあるもの（2026-10-21 に `gemma4:26b-mlx`・`gemma4:31b-mlx` があることを確認済み）だけを書く。
- 雛形の名簿（`templates/init-agent-members.yaml`）とテストは変えない。
- `npm run lint:md` と `npm run docs:build` が通る。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG の `## [Unreleased]` の節に書く。公開済みの版の節は変えない。

## 3. 作業内容

| No  | 作業                                       | 担当 | 状態 | メモ         |
| --- | ------------------------------------------ | ---- | ---- | ------------ |
| 1   | opencode の README に mlx 版の案内を加える | DEV  | open | 0.4.2 の範囲 |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- PJR-2ASZ（名簿の雛形の gemma の見直し）
