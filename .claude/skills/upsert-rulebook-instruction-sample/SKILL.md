---
name: upsert-rulebook-instruction-sample
description: '`upsert-rulebook` → `rulebook-to-instruction` → `rulebook-to-sample` をこの順序で実行するオーケストレーション Skill です。'
---

# SKILL: upsert-rulebook-instruction-sample

`upsert-rulebook` → `rulebook-to-instruction` → `rulebook-to-sample` を **この順序で固定** して実行する Skill です。
既存の個別 Skill を呼び出して処理し、重複実装を避けます。

## 使いどころ

- rules と派生成果物（instruction / sample）を 1 回の依頼で順次更新したいとき
- 実行順を固定して、反映漏れ（rules だけ更新、など）を防ぎたいとき

## 呼び出す既存資産（必須）

- rules: `@file:.github/skills/upsert-rulebook/SKILL.md`
- instruction: `@file:.github/skills/rulebook-to-instruction/SKILL.md`
- sample: `@file:.github/skills/rulebook-to-sample/SKILL.md`

## 引数仕様

- 引数は対象ファイルまたは短縮名（例: `imp-business`）を受け付ける。
- 複数指定可（スペース区切り / 改行区切り / カンマ区切り）。
- 相対パス / 絶対パスを受け付ける。
- `-rulebook.md` 省略指定を受け付ける（例: `imp-business`）。
- 同一対象の重複指定は 1 件に正規化する。

## 実行手順（固定順）

1. `upsert-rulebook` を実行する
2. `rulebook-to-instruction` を実行する
3. `rulebook-to-sample` を実行する
4. 最後に `npm run -s lint:md` を実行する

## 実行ルール

- 各ステップは同じ対象セットを使う。
- あるステップで一部対象が失敗しても、次ステップは継続する。
- 最後に対象ごとの結果（更新 / 新規 / スキップ / 失敗）をまとめる。

## 出力形式

- 対象件数（総数 / 更新 / 新規 / スキップ / 失敗）
- 変更ファイル一覧
- 対象ごとの反映要点（1〜3行）
- lint 結果
