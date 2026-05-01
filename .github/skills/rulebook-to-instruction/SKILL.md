---
name: rulebook-to-instruction
description: '`docs/ja/specdojo/rulebooks` の更新内容を、`docs/ja/specdojo/instructions` の `*-instruction.md` へ反映するための Skill です。'
---

# SKILL: rulebook-to-instruction

`docs/ja/specdojo/rulebooks` の更新内容を、
`docs/ja/specdojo/instructions` の `*-instruction.md` へ反映するための Skill です。

## 使いどころ

- 新しい `*-instruction.md` を単一ファイルで新規作成したいとき
- `*-rulebook.md` 更新後に instruction を同期したいとき
- 差分アップサートで既存 instruction を保守したいとき
- 全 rules を一括で同期したいとき

## 前提

- 共通運用ルール: `@file:.github/instructions/instruction.instructions.md`
- 命名対応: `<name>-rulebook.md` → `<name>-instruction.md`
- 出力先ディレクトリ: `docs/ja/specdojo/instructions/`

## 引数仕様（複数対象対応）

- `/rulebook-to-instruction <file1> <file2> ...` のような複数指定を受け付ける。
- 区切りはスペース / 改行 / カンマを受け付ける。
- 相対パスと絶対パスの両方を受け付ける。
- `-rulebook.md` を含む完全指定と、`-rulebook.md` を省略した短縮指定の両方を受け付ける。
  - 例: `imp-business-rulebook.md`
  - 例: `imp-business`（`docs/ja/specdojo/rulebooks/imp-business-rulebook.md` として解釈）
- 同一対象の重複指定は 1 件に正規化する。
- 引数なしの場合は、現在開いているファイルを単一対象として扱う。

## 複数対象の実行ルール

- 正規化後の対象を 1 ファイルずつ独立に判定し、順次実行する。
- ある対象で失敗しても他対象の処理は継続する。
- 最後に対象ごとの結果（更新 / 新規 / スキップ / 失敗）を一覧で出力する。

## 実行フロー

1. 引数有無を判定し、対象一覧を正規化する（未指定時は開いている 1 件）
2. 対象を 1 ファイルずつ順に処理する
3. 各対象 rules を読み、必須章・必須表・禁止事項・最終チェックを抽出
   - `target_format`（`markdown` / `yaml` / `json`）を確認する
   - `target_format` 未記載時は `@file:.github/instructions/rulebook.instructions.md` の推測ルールで判定する
4. 対応する instruction を新規作成またはアップサート
   - `target_format: markdown` は Frontmatter + 見出し順を中心に指示する
   - `target_format: yaml` / `json` はルートキー・必須キー・ネスト構造・型制約を中心に指示する
5. 命名・章番号・責務境界（index vs term）を整合
6. 対象ごとの結果を集約して出力する
7. `npm run -s lint:md` で検証

## 注意事項

- rules 本文の丸写しではなく、生成AIへの実行指示として再構成する
- 既存 instruction は全置換せず、差分アップサートを優先する
- 実装依存の詳細（SQL全文、具体クラス名等）は追加しない
- `target_format: yaml` / `json` の rules では、instruction 側に以下を明示する
  - 先頭メタ項目
  - ルートキーと必須キー
  - 命名規則・参照規則・型制約
  - sample / schema による検証手順
