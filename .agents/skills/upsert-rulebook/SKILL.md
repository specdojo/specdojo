---
name: upsert-rulebook
description: '`docs/ja/specdojo/rulebooks` 配下の `*-rulebook.md` を新規作成または更新する Skill です。'
---

# SKILL: upsert-rulebook

`docs/ja/specdojo/rulebooks` 配下の `*-rulebook.md` を新規作成または更新するための Skill です。

## 使いどころ

- 新しい `*-rulebook.md` を新規作成したいとき
- 既存の `*-rulebook.md` を `docs/ja/specdojo/standards/rulebook-authoring-standard.md` に準拠させたいとき
- 章構成や記述品質の整合性を確認・修正したいとき
- docs-contents-guide や成果物カタログに定義されているドキュメントの rulebook を起こしたいとき

補足:

- 成果物ファイル（`sample-gcs-product/` 配下等）から逆生成する場合は、`.github/skills/reverse-rulebook/SKILL.md` を使用する。

## 前提

- 章立て・記述ルール・Frontmatter 規約の正本: `docs/ja/specdojo/standards/rulebook-authoring-standard.md`
- 作業手順: `.github/instructions/rulebook.instructions.md`
- ドキュメント内容ガイド: `docs/ja/specdojo/guidelines/docs-contents-guide.md`

## 引数仕様

- `/upsert-rulebook <file1> <file2> ...` の複数指定を受け付ける。
- 区切りはスペース / 改行 / カンマを受け付ける。
- `-rulebook.md` を含む完全指定と、省略した短縮指定を受け付ける。
  - 例: `imp-business-rulebook.md`
  - 例: `imp-business`
- 同一対象の重複指定は 1 件に正規化する。
- 引数なしの場合は、現在開いているファイルを単一対象として扱う。

## 実行フロー

1. 引数有無を判定し、対象一覧を正規化する（未指定時は開いている 1 件）
2. 対象を 1 ファイルずつ順に処理する
3. 各対象 `*-rulebook.md` の既存有無を確認する
4. 情報収集を行う
   - docs-contents-guide で目的・主な内容を確認する
   - 類似 rulebook を 2〜3 件確認する
   - 対応 sample があれば確認する
5. 新規作成または差分アップサートを行う
   - 章構成・記述品質・禁止事項は `docs/ja/specdojo/standards/rulebook-authoring-standard.md` に従う
   - Frontmatter は `docs/ja/specdojo/standards/rulebook-authoring-standard.md` の `Frontmatter 規約` に従う
   - `target_format` が未記載の場合は markdown を対象とみなす
6. `サンプル` のリンクを更新する
7. 対象ごとの結果を集約し、`npm run -s lint:md` で検証する

## 実行ルール

- 正規化後の対象を 1 ファイルずつ独立に判定し、順次実行する
- ある対象で失敗しても他対象の処理は継続する
- 実装依存の詳細（SQL 全文、具体クラス名、詳細 API 設計）は rulebook に含めない

## 出力

- 対象ごとの結果（更新 / 新規 / スキップ / 失敗）
- 変更ファイル一覧
- 実行時に参照した根拠（docs-contents-guide と類似 rulebook）
- `npm run -s lint:md` の結果
