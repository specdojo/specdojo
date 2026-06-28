---
name: upsert-sample
description: "`docs/ja/specdojo/samples` 配下の `*-sample.(md|yaml|json)` を新規作成または更新する Skill です。"
---

# SKILL: upsert-sample

`docs/ja/specdojo/samples` 配下の `*-sample.(md|yaml|json)` を新規作成または更新するための Skill です。

## 使いどころ

- 新しい `*-sample.(md|yaml|json)` を新規作成したいとき
- 既存の `*-sample.(md|yaml|json)` を Sample 記述標準に準拠させたいとき
- 対応 rulebook が更新されたため sample 側へ差分を反映したいとき
- 章構成や業務文脈の整合性を確認・修正したいとき

## 前提

- 記述標準・共通文脈: `docs/ja/specdojo/standards/sample-authoring-standard.md`
- 作業手順: `.github/instructions/sample.instructions.md`
- 対応 rulebook: `docs/ja/specdojo/rulebooks/<prefix>-rulebook.md`
- 前提プロジェクト: 駄菓子屋の販売管理システムを構築するプロジェクト（固定）

## 引数仕様

- `/upsert-sample <file1> <file2> ...` の複数指定を受け付ける。
- 区切りはスペース / 改行 / カンマを受け付ける。
- `-sample.md` / `-sample.yaml` / `-sample.json` を含む完全指定と、省略した短縮指定を受け付ける（例: `imp-business-sample.md`, `imp-business-sample.yaml`, `imp-business`）。
- `-rulebook.md` 形式での指定も受け付け、対応する `*-sample.<ext>` に変換する。
- 同一対象の重複指定は 1 件に正規化する。
- 引数なしの場合は、現在開いているファイルを単一対象として扱う。

## 実行フロー

1. 引数有無を判定し、対象一覧を正規化する（未指定時は開いている 1 件）
2. 対象を 1 ファイルずつ順に処理する
3. 各対象 `*-sample.<ext>` の既存有無を確認する（`<ext>` は `target_format` に応じて決定）
4. 情報収集を行う
   - 対応 `<prefix>-rulebook.md` を一次根拠として読み込み、出力構造・必須要素・禁止事項を把握する
   - `target_format` を確認し、sample の拡張子（`.md` / `.yaml` / `.json`）を決定する
   - 類似 sample を 2〜3 件確認する
5. 新規作成または差分アップサートを行う
   - 章構成・記述品質・禁止事項・共通文脈は `docs/ja/specdojo/standards/sample-authoring-standard.md` に従う
   - 対応 rulebook に従い、駄菓子屋文脈の記述例を構成する
   - 必要な前提情報が不足する場合は、駄菓子屋の販売管理システムとして妥当な内容を仮定して記述する
6. sample 作成後にリンク解決を確認する
   - sample 内で記載したリンク先ファイルの存在を確認する
   - 存在しないリンクはデッドリンク回避のため Markdown リンクにせず、バッククォートで囲んだファイル名表記へ置換する
7. 対応 rulebook の「サンプル」章に `*-sample.<ext>` へのリンクを記載する
8. 対象ごとの結果を集約し、`npm run -s lint:md` で検証する

## 実行ルール

- 正規化後の対象を 1 ファイルずつ独立に判定し、順次実行する
- ある対象で失敗しても他対象の処理は継続する
- rulebook の内容をそのまま複製せず、ルールに準拠した記述例として再構成する
- sample の直接的な記述根拠は対応 rulebook とする
- 業務文脈は「駄菓子屋の販売管理システム構築プロジェクト」に統一し、他業種の題材を混在させない
- 不足している前提条件は、駄菓子屋の販売管理システムに適合する範囲で合理的に仮定して補う
- 実装依存の詳細（SQL 全文、具体クラス名、詳細 API 設計）は sample に含めない
- sample 作成後の最終状態では、存在確認できない参照先を Markdown リンクのまま残さず、すべてバッククォートで囲んだファイル名表記へ置換する

## 出力

- 対象ごとの結果（更新 / 新規 / スキップ / 失敗）
- 変更ファイル一覧
- 実行時に参照した根拠（対応 rulebook、類似 sample）
- `npm run -s lint:md` の結果
