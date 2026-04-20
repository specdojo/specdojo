---
name: upsert-rulebook
description: 'docs/ja/handbook/rulebooks` 配下の `*-rulebook.md` を新規作成または更新するための Skill です。'
---

# SKILL: upsert-rulebook

`docs/ja/handbook/rulebooks` 配下の `*-rulebook.md` を新規作成または更新するための Skill です。

## 使いどころ

- 新しい `*-rulebook.md` を新規作成したいとき
- 既存の `*-rulebook.md` を `meta-rulebook-structure-rulebook.md` に準拠させたいとき
- 章構成や記述品質の整合性を確認・修正したいとき
- docs-contents-guide や deliverables catalog に定義されているドキュメントの rulebook を起こしたいとき

補足:

- 成果物ファイル（`sample-gcs-product/` 配下等）から逆生成する場合は、`@file:.github/skills/reverse-rulebook/SKILL.md` を使用する。

## 前提

- 共通運用ルール: `@file:.github/instructions/rulebook.instructions.md`
- 章構成基準: `docs/ja/handbook/rulebooks/meta-rulebook-structure-rulebook.md`
- メタ情報ルール（種別別）:
  - `docs/ja/handbook/rulebooks/meta-rulebook-metadata-rulebook.md`
  - `docs/ja/handbook/rulebooks/meta-deliverable-metadata-rulebook.md`
  - `docs/ja/handbook/rulebooks/meta-instruction-metadata-rulebook.md`
- 命名ルール: `docs/ja/handbook/rulebooks/meta-id-and-file-naming-rulebook.md`
- Frontmatter スキーマ: `docs/shared/schemas/rulebook-frontmatter.schema.yaml`
- ドキュメント内容ガイド: `docs/ja/handbook/guidelines/docs-contents-guide.md`
- 対象除外: `meta-*-rulebook.md` は本 Skill の対象外

## 引数仕様（複数対象対応）

- `/upsert-rulebook <file1> <file2> ...` のような複数指定を受け付ける。
- 区切りはスペース / 改行 / カンマを受け付ける。
- 相対パスと絶対パスの両方を受け付ける。
- `-rulebook.md` を含む完全指定と、`-rulebook.md` を省略した短縮指定の両方を受け付ける。
  - 例: `imp-business-rulebook.md`（`docs/ja/handbook/rulebooks/imp-business-rulebook.md` として解釈）
  - 例: `imp-business`（`docs/ja/handbook/rulebooks/imp-business-rulebook.md` として解釈）
- 同一対象の重複指定は 1 件に正規化する。
- 引数なしの場合は、現在開いているファイルを単一対象として扱う。

## 複数対象の実行ルール

- 正規化後の対象を 1 ファイルずつ独立に判定し、順次実行する。
- `meta-*-rulebook.md` に該当する対象は、その対象のみスキップする。
- ある対象で失敗しても他対象の処理は継続する。
- 最後に対象ごとの結果（更新 / 新規 / スキップ / 失敗）を一覧で出力する。

## 入力情報の収集

rulebook を書くには、対象ドキュメントの **目的・構成・記述粒度** を理解する必要がある。
以下の順で情報を収集する。

1. **docs-contents-guide.md** — 対象ドキュメントの目的・主な内容・略称を確認
2. **既存の類似 rulebook** — 同カテゴリの rulebook を読み、粒度・章構成のパターンを把握
   - index 系: `bes-index-rulebook.md`, `nfr-index-rulebook.md`, `utc-index-rulebook.md` 等
   - 個別系: `bes-rulebook.md`, `bps-rulebook.md`, `br-rulebook.md` 等
   - Mermaid 系: `cdfd-mermaid-rulebook.md`, `ccd-mermaid-rulebook.md` 等
3. **対応する sample** — `../samples/<name>-sample.md` があれば参照（記述例の粒度把握）
4. **対応する instruction** — `../instructions/<name>-instruction.md` があれば参照

補足（対象フォーマットの扱い）:

- `target_format` が `markdown` / `yaml` / `json` のどれかを確認し、収集対象と参照リンク拡張子を合わせる。
- `target_format` が未記載の場合は、`@file:.github/instructions/rulebook.instructions.md` の推測ルールに従い、次の優先順位で推測する。
  1. `サンプル` 章の参照拡張子（`.md` / `.yaml` / `.json`）
  2. 本文の記述例（YAMLブロック、JSONオブジェクト、Markdown章構成）
  3. 用語の前提（Frontmatter 前提か、先頭メタ項目前提か）
- 対応する sample の探索時は、`<name>-sample.md` / `<name>-sample.yaml` / `<name>-sample.json` を順に確認し、`target_format` に一致するものを優先する。

## 実行フロー（通常）

1. 引数有無を判定し、対象一覧を正規化する（未指定時は開いている 1 件）
2. 対象を 1 ファイルずつ順に処理する
3. 各対象 `*-rulebook.md` の既存有無を確認する
4. 既存の場合: `meta-rulebook-structure-rulebook.md` との差分を洗い出す
   - あわせて `target_format` と本文記述の整合（Frontmatter 前提か、先頭メタ項目前提か）を確認する
5. 新規の場合: docs-contents-guide から目的・内容を抽出し、類似 rulebook を参考に構成を決める
   - `target_format` 未記載時は、共通運用ルールの推測手順で暫定決定する
6. 標準章構成に従い、新規作成またはアップサートを行う
7. `サンプル` のリンクと `生成 AI への指示テンプレート` のリンクを更新する
   - sample リンクは `target_format` に合わせて `.md` / `.yaml` / `.json` を選ぶ
8. 対象ごとの結果を集約して出力する
9. `npm run -s lint:md` で検証する

## 記述規約の適用方針

- rulebook の章構成、記述品質、禁止事項、最終チェックは `@file:.github/instructions/rulebook.instructions.md` を正とする。
- 本 Skill では、対象解決・情報収集・実行順序・失敗時継続などの実行オーケストレーションのみを定義する。
- 規約の再掲は避け、記述内容の判断が必要な場合は共通運用ルールを参照して決定する。

## 生成・更新時の補助ルール

- 通常フロー手順 6 で必要になる章構成、記述ガイド、禁止事項、最終チェックは `@file:.github/instructions/rulebook.instructions.md` を参照する。
- docs-contents-guide の記述が短い場合は、類似 rulebook と一般的開発知見で補完する。
- ただし、実装依存の詳細（SQL 全文、具体クラス名、詳細 API 設計）には踏み込まない。

## 出力

- 対象ごとの結果（更新 / 新規 / スキップ / 失敗）
- 変更ファイル一覧
- 実行時に参照した根拠（docs-contents-guide と類似 rulebook）
- `npm run -s lint:md` の結果
