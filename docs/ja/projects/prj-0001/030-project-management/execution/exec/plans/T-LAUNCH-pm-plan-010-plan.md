---
id: prj-0001:xep-t-launch-pm-plan-010
type: exec-plan
rulebook: xep-rulebook
task_id: T-LAUNCH-pm-plan-010
name: たたき台作成
mode: edit
status: ready
project_id: prj-0001
owner: PM
---

# Edit Plan: T-LAUNCH-pm-plan-010

## 1. このフェーズで行うこと

担当ロールが成果物の初版を作成する。
章構成・記載項目を決め、現時点で把握している情報を埋める。
調査・確認が必要な箇所は TODO として明示したまま残す。

## 2. 対象成果物

- `name`: プロジェクト管理計画
- `depends_on`: `pm-organization`, `pm-roles`
- `overview`: プロジェクト全体の管理方針・プロセスを定義
- `path`: `/docs/ja/projects/prj-0001/030-project-management/010-management-plan/pm-plan.md`
- `result`: `/docs/ja/projects/prj-0001/030-project-management/execution/exec/results/T-LAUNCH-pm-plan-010-result.md`

**done_criteria:**

- プロジェクト全体の管理方針・プロセスを承認できる粒度で記述されていること
- 計画・進捗・リスク管理の方針が記述されていること
- 業務プロセスとの整合が確認できること
- 構成管理・技術管理の観点が含まれていること
- レビュー方針・品質基準への参照が確認できること

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **PM（Project Manager）**
- 責務: 計画・進捗・課題・リスク管理を担う。小規模運用では po が兼務する。

このロールが重視するレビュー観点:

- 計画化可能性: 成果物の内容がタスク化、順序付け、所要時間見積もり、進捗確認に使える粒度になっているか。
- 依存関係・リスク・課題化: 後続成果物、Schedule、PJR に影響する依存、リスク、課題、変更要求が識別されているか。
- 管理・報告への接続: 進捗、課題、リスク、変更要求、決定記録へ転記すべき事項が分離されているか。

## 4. 進め方

- exec plan frontmatter の `approach` を確認する。
- `approach` が `rulebook-maintenance` / `recipe-maintenance` / `sample-maintenance` / `template-maintenance` の場合は、参照の向きを「成果物 → 対象の参考資料」に切り替えて進める。
- それ以外の場合は、対象成果物に紐づく rulebook / recipe / sample / template の有無を確認し、`approach` に応じて参照範囲を決める。
  - `fully-guided`: rulebook / recipe / sample / template をそれぞれの役割に沿って活用する（構造・必須要素・禁止事項は rulebook、内容の組み立ては recipe、粒度・文体・表の書き方は sample、雛形は template を基準にし、プレースホルダは残さず埋める）。
  - `recipe-guided`: recipe が示す構成・問い・観点だけを使って組み立てる（rulebook / sample が存在しても構造・文体の基準にはしない）。
  - `freeform`: 参考資料より、類似成果物の実例やプロジェクト文脈を優先して組み立てる。
  - 未指定の場合は、存在するすべての参考資料をそれぞれの役割に沿って活用する。
- 複数の文書間で記述に矛盾がある場合、参照範囲に rulebook を含む `approach`（`fully-guided` など）では rulebook を正とする。
- 存在しない、または参照範囲から外れた文書がある場合は、他に存在する文書、類似成果物、対象領域の慣行を手がかりに判断し、根拠を成果物または result に残す。

詳細は [[specdojo-reference-materials-guide]] を参照する。

## 5. 完了手順

1. 「このフェーズで行うこと」に従って成果物を更新する。
2. 必要な検証と lint を実行する。
3. result の done_criteria_checked セクションを記入する。

## 6. 異常終了の条件

- 依存未解決・対象ファイル不明・lint/test 未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- 異常終了時は complete ではなく block を記録する。
