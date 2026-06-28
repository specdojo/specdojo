---
name: upsert-wbs
description: "`wbs-strategy-<domain>.md` を入力として `wbs-<domain>.yaml` を新規作成または更新する Skill です。"
---

# SKILL: upsert-wbs

`wbs-strategy-<domain>.md` に記載された展開戦略をもとに、`wbs-<domain>.yaml` を新規作成または差分更新するための Skill です。

## 使いどころ

- `wbs-strategy-<domain>.md` が存在し、対応する `wbs-<domain>.yaml` を新規作成したいとき
- 成果物カタログが更新されたため、WBS を同期したいとき
- WBS の粒度・ID 形式・スキーマ整合を見直したいとき

## 前提

- WBS スキーマ: `docs/specdojo/schemas/v1/wbs.schema.yaml`
- WBS 記述例: `docs/ja/specdojo/samples/wbs-sample.yaml`
- 成果物→WBS 展開ガイド: `docs/ja/specdojo/guidelines/specdojo-deliverables-to-schedule-guide.md`

## 引数仕様

- `/upsert-wbs <strategy-file-or-domain>` の形式で指定する。
- ドメイン名のみの指定（例: `project-definition`）と、ファイルパス指定の両方を受け付ける。
  - 例: `project-definition`
  - 例: `docs/ja/projects/prj-0001/030-project-management/wbs/wbs-strategy-project-definition.md`
- 引数なしの場合は、現在開いているファイルが `wbs-strategy-*.md` であればそれを対象とする。

## 実行フロー

1. 引数を解釈し、対象の `wbs-strategy-<domain>.md` のパスを決定する
2. strategy ファイルを読み込み、以下を取得する
   - `based_on`: 参照する成果物カタログの ID（例: `prj-0001:dct-project-definition`）
   - 出力先パス（策略本文の「wbsの出力先は…」から取得）
   - `done_criteria` の方針（承認ロールや条件の記述）
3. `based_on` で参照された成果物カタログを読み込む
   - カタログが複数ある場合はすべて読み込む
   - カタログに記載された WBS 展開対象（`kind: work` / 例外的な `kind: control`）を特定する
4. 出力先の `wbs-<domain>.yaml` の既存有無を確認する（新規 or アップサート）
5. strategy とスキーマに従い、`wbs-<domain>.yaml` を生成または更新する
   - `1 成果物 = 1 WBS item` を厳守する
   - `deliverable` は単一オブジェクト（配列不可）で記述する
   - `wbs[].id` は `WBS-<DOMAIN>-<ARTIFACT>` 形式（末尾に連番なし）とする
   - `done_criteria` は strategy ファイルの方針に従い、判定可能な文で記述する
   - `depends_on` は論理的な成果物依存のみ記述し、スケジュール都合の依存は含めない
6. 生成した YAML を出力先パスに書き込む
7. `npm run validate:schema:file -- --schema docs/specdojo/schemas/v1/wbs.schema.yaml --data <output-path>` でスキーマ検証する
8. 結果を報告する

## 実行ルール

- strategy ファイルが存在しない場合はエラーとし、生成を中断する
- 成果物カタログが特定できない場合は不足情報として報告し、推測補完しない
- WBS 対象外（`kind: generated` 等）の成果物は WBS item に含めない
- 既存 `wbs-<domain>.yaml` がある場合は差分アップサートとし、既存 WBS item の `id` を変更しない
- 実行順序・日程・所要期間は WBS に含めない（Schedule 側の責務）

## 出力

- 生成または更新した `wbs-<domain>.yaml` のパス
- 追加・更新・削除した WBS item の一覧（件数含む）
- スキーマ検証の結果
- 不足情報があれば一覧として報告
