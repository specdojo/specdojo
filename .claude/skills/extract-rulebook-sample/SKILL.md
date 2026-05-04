---
name: extract-rulebook-sample
description: 'rulebook の「サンプル（抜粋例）」章に書かれた例を抽出し、`docs/ja/specdojo/samples/*-sample.md` を作成/更新する Skill です。'
---

# SKILL: extract-rulebook-sample

rulebook に記載されたサンプル例（例: `## 8. サンプル（抜粋例）`）を抽出し、
`docs/ja/specdojo/samples/*-sample.md` を作成/更新する Skill です。

基準とする記載形式は `docs/ja/specdojo/rulebooks/opd-rulebook.md` の
`## 8. サンプル（抜粋例）` と同等の構造です。

## 使いどころ

- rulebook にサンプル例が既に書かれており、sample ファイルへ分離したいとき
- 1つの rulebook から複数の sample（`index` と `term`）を一括生成したいとき
- rulebook 更新後に sample を抜粋ベースで同期したいとき

## 前提

- 共通運用ルール: `@file:.github/instructions/markdown.instructions.md`
- rulebook 対象: `docs/ja/specdojo/rulebooks/*-rulebook.md`
- sample 出力先: `docs/ja/specdojo/samples/`

## 引数仕様（複数対象対応）

- `/extract-rulebook-sample <file1> <file2> ...` のような複数指定を受け付ける。
- 区切りはスペース / 改行 / カンマを受け付ける。
- 相対パスと絶対パスの両方を受け付ける。
- `-rulebook.md` を省略した短縮指定も受け付ける。
  - 例: `opd` -> `docs/ja/specdojo/rulebooks/opd-rulebook.md`
- 同一対象の重複指定は 1 件に正規化する。
- 引数なしの場合は、現在開いているファイルを単一対象として扱う。

## 抽出対象の判定ルール

1. rulebook 内に `## 8. サンプル` で始まる章を探す。
   - 例: `## 8. サンプル（抜粋例）`
2. 上記章の配下で、`### 8.x. サンプル:` 形式のサブセクションをサンプル単位として扱う。
3. 各サンプル単位から次を抽出する。
   - YAML コードブロック（先頭メタ項目）
   - その後ろの `####` 見出しと本文（表・箇条書きを含む）

サンプル単位が見つからない場合は、その対象を `スキップ` とする。

## sample ファイル生成ルール

- 出力ファイル名は、抽出した YAML の `id` を基準に `<id>-sample.md` とする。
  - 例: `id: opd-index` -> `docs/ja/specdojo/samples/opd-index-sample.md`
- 先頭に抽出した YAML を Frontmatter として配置する。
- H1 は `<title> サンプル` とする（`title` が無い場合は `<id> サンプル`）。
- 本文は、抽出した `####` 見出し群を上から順に `## 1.` から採番し直して配置する。
  - 元見出しの章番号（例: `8.1.2.`）は除去し、見出し名だけを使う。
- rulebook への参照行として、本文冒頭に次を追加してよい。
  - `- 参照: ../rulebooks/<source-rulebook>`

## アップサート方針

- 既存 sample がある場合は全置換ではなく、以下の優先順位で差分反映する。
  1. Frontmatter（`id` / `type` / `status` など）
  2. 見出し構成
  3. 表・箇条書き本文
- 既存 sample がない場合は新規作成する。

## 失敗時継続ルール

- ある対象で抽出失敗しても、他対象の処理は継続する。
- 最後に対象ごとの結果（更新 / 新規 / スキップ / 失敗）を一覧で出力する。

## 実行フロー

1. 引数有無を判定し、対象一覧を正規化する。
2. 対象を 1 ファイルずつ処理する。
3. `## 8. サンプル` 章の有無を確認する。
4. `### 8.x. サンプル:` ごとに YAML + 本文を抽出する。
5. `id` から出力先 sample ファイルを決定し、新規作成またはアップサートする。
6. 対象ごとの結果を集約して出力する。
7. 最後に `npm run -s lint:md` を実行する。

## 出力

- 対象ごとの結果（更新 / 新規 / スキップ / 失敗）
- 変更ファイル一覧
- 抽出したサンプル数（対象ごと）
- `npm run -s lint:md` の結果
