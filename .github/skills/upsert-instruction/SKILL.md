---
name: upsert-instruction
description: '`docs/ja/specdojo/instructions` 配下の `*-instruction.md` を新規作成または更新する Skill です。'
---

# SKILL: upsert-instruction

`docs/ja/specdojo/instructions` 配下の `*-instruction.md` を新規作成または更新するための Skill です。

## 使いどころ

- 新しい `*-instruction.md` を新規作成したいとき
- 既存の `*-instruction.md` を `.github/instructions/instruction.instructions.md` に準拠させたいとき
- 対応 rulebook が更新されたため instruction 側へ差分を反映したいとき
- 章構成や記述品質の整合性を確認・修正したいとき

## 前提

- 共通運用ルール: `.github/instructions/instruction.instructions.md`
- Frontmatter スキーマ: `docs/specdojo/schemas/v1/instruction-frontmatter.schema.yaml`
- メタ情報標準: `docs/ja/specdojo/standards/instruction-metadata-standard.md`

## 引数仕様

- `/upsert-instruction <file1> <file2> ...` の複数指定を受け付ける。
- 区切りはスペース / 改行 / カンマを受け付ける。
- `-instruction.md` を含む完全指定と、省略した短縮指定を受け付ける。
  - 例: `imp-business-instruction.md`
  - 例: `imp-business`
- 同一対象の重複指定は 1 件に正規化する。
- 引数なしの場合は、現在開いているファイルを単一対象として扱う。

## 実行フロー

1. 引数有無を判定し、対象一覧を正規化する（未指定時は開いている 1 件）
2. 対象を 1 ファイルずつ順に処理する
3. 各対象 `*-instruction.md` の既存有無を確認する
4. 情報収集を行う
   - 対応 `<prefix>-rulebook.md` を読み込み、`target_format`・必須章・禁止事項を把握する
   - 類似 instruction を 2〜3 件確認する
5. 新規作成または差分アップサートを行う
   - 章構成・記述品質・禁止事項は `.github/instructions/instruction.instructions.md` に従う
   - rulebook の内容を生成 AI への実行指示として再構成する
6. 対応 rulebook の「生成 AI への指示テンプレート」章に `*-instruction.md` へのリンクを記載する
7. 対象ごとの結果を集約し、`npm run -s lint:md` で検証する

## 実行ルール

- 正規化後の対象を 1 ファイルずつ独立に判定し、順次実行する
- ある対象で失敗しても他対象の処理は継続する
- rulebook の内容をそのまま複製せず、生成 AI への実行指示として再構成する
- 実装依存の詳細（SQL 全文、具体クラス名、詳細 API 設計）は instruction に含めない

## 出力

- 対象ごとの結果（更新 / 新規 / スキップ / 失敗）
- 変更ファイル一覧
- 実行時に参照した根拠（対応 rulebook と類似 instruction）
- `npm run -s lint:md` の結果
