---
name: rulebook-to-sample
description: '`docs/ja/specdojo/rulebooks` の更新内容を、`docs/ja/specdojo/samples` の `*-sample.md` へ反映するための Skill です。'
---

# SKILL: rulebook-to-sample

`docs/ja/specdojo/rulebooks` の更新内容を、
`docs/ja/specdojo/samples` の `*-sample.md` へ反映するための Skill です。

## 使いどころ

- 新しい `*-sample.md` を単一ファイルで新規作成したいとき
- `*-rulebook.md` 更新後に sample を同期したいとき
- 差分アップサートで既存 sample を保守したいとき
- 全 rules を一括で sample に同期したいとき

## 前提

- 共通運用ルール: `@file:.github/instructions/rulebook-to-sample.instructions.md`
- 命名対応: `<name>-rulebook.md` → `<name>-sample.md`
- 出力先ディレクトリ: `docs/ja/specdojo/samples/`
- 前提プロジェクト: 駄菓子屋の販売管理システムを構築するプロジェクト（固定）

## 引数仕様（複数対象対応）

- `/rulebook-to-sample <file1> <file2> ...` のような複数指定を受け付ける。
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
4. 対応する sample を新規作成またはアップサート
5. 命名・章番号・見出し名称・業務文脈を整合
6. 対象ごとの結果を集約して出力する
7. `npm run -s lint:md` で検証

## 注意事項

- rules 本文の丸写しではなく、ルールに準拠した最小の記述例として再構成する
- 既存 sample は全置換せず、差分アップサートを優先する
- 業務文脈は「駄菓子屋の販売管理システム構築プロジェクト」に統一し、他業種の題材を混在させない
- Frontmatter（`id` / `type` / `status`）と本文見出し順を rules と整合させる
- 曖昧語（十分/適切/問題ない）を避け、読み手が意図を判定できる記述にする
