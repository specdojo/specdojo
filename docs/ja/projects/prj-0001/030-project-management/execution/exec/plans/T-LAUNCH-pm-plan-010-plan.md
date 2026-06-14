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
approach: freeform
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

rulebook / recipe / sample / template に原則縛られないため、対象成果物の文脈から記載内容を組み立てる。次の手順で記載内容を決める。

1. `depends_on` に挙がった成果物を読み、前提・決定事項・用語・制約を把握し、それらと整合する内容にする。
2. `name`・`overview`・`done_criteria` から、この成果物が答えるべき問いと記載すべき項目の仮説を立てる。done_criteria の各項目を満たす記述を必ず含める。
3. プロジェクト文脈（背景・目的・関係者の意図）を `depends_on` の成果物や関連ドキュメントから確認し、仮説を裏付けるか修正する。
4. 内部情報だけで判断できない一般的な観点・用語・標準がある場合は、Web 検索で関連情報を取得し、出典を添えて反映する。
5. 仮説と収集した情報をもとに成果物を記述する。判断に迷う箇所は `_TODO_` / `_ASSUMPTION_` で残し、根拠と次のアクションを書く。

記載にあたっては次を守る。

- 対象成果物に既存の記述がある場合は、まず内容を確認する。`depends_on` の最新の決定事項やプロジェクト文脈と矛盾する、または前提が変わって古くなった記述は破棄する。古くなっていない記述は活かし、不足分を加筆・補強する。破棄・加筆の判断根拠を result の `参考資料の活用` セクションに残す。
- 参考資料より、対象領域の類似成果物の実例とプロジェクト文脈を優先し、参考資料は矛盾しない範囲の参考にとどめる。
- 参考資料とプロジェクト文脈が矛盾する場合は、プロジェクト文脈を優先し、その理由を記録する。
- done_criteria とこの plan のフェーズ説明を満たすことを主な基準にする。

本タスクの実行に必要な freeform の進め方は、このセクションで完結する。approach 全体の定義（他 approach との対比や review への適用）を確認したい場合のみ、参考として [[specdojo-reference-materials-guide]] を参照する。

### 4.1. 判断根拠の記録

仮説と収集した情報をもとにした判断根拠を result に残す。記録先は次のとおり。

- done_criteria の充足状況: result の `done_criteria 確認` セクション。
- 仮説の根拠、参照した `depends_on` 成果物、Web 出典、優先した実例・プロジェクト文脈、参考資料を補助に使った場合の判断根拠、参考資料とプロジェクト文脈が矛盾しプロジェクト文脈を優先した箇所とその理由、既存記述の破棄・加筆の根拠: result の `参考資料の活用` セクション。

## 5. 完了手順

1. 「このフェーズで行うこと」に従って成果物を更新する。
2. 必要な検証と lint を実行する。
3. result の done_criteria_checked セクションを記入する。

## 6. 異常終了の条件

- 依存未解決・対象ファイル不明・lint/test 未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- 異常終了時は complete ではなく block を記録する。
