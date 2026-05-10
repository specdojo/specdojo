# Agent Instructions

## Language

- 回答は原則として日本語で行う。
- コード、ファイル名、識別子は英語を優先する。
- Markdown設計書は自然な日本語で、曖昧な表現を避ける。

## Project Policy

- 変更前に関連する設計書を確認する。
- `docs/` 配下のMarkdownでは、frontmatter の `id`, `based_on`, `status` を尊重する。
- 既存の命名規則・ディレクトリ規則を優先する。
- 大きな変更は、まず設計書に反映してからコードを変更する。

## Local LLM Usage

- 軽い要約、章立て、表現修正は `gemma4:e4b` を使う。
- 設計書レビュー、矛盾確認、影響分析は `gemma4:26b` を使う。
- コーディング、リファクタ、テスト修正は `qwen3-coder:30b` を使う。
- 最終判断や難しい設計判断は Claude Code または Codex を使う。

## Safety

- `.env`, `.env.*`, `secrets/`, 認証情報、秘密鍵は読み込まない。
- 破壊的変更を行う前に git diff を確認する。
- ファイル削除、広範囲置換、ディレクトリ移動は慎重に行う。
