---
id: prj-0001:xep-t-launch-prj-overview-010-i01
type: exec-plan
rulebook: xep-rulebook
task_id: T-LAUNCH-prj-overview-010-I01
name: たたき台作成
mode: edit
status: ready
project_id: prj-0001
owner: BA
on_critical_path: true
approach: freeform
---

# Edit Plan: T-LAUNCH-prj-overview-010-I01

## 1. このフェーズで行うこと

エージェントが成果物の初版を作成する。
章構成・記載項目を決め、現時点で把握している情報を埋める。
調査・確認が必要な箇所は TODO として明示したまま残す。

## 2. 対象成果物

- `name`: プロジェクト概要
- `depends_on`: -
- `overview`: プロジェクトの目的・背景・ゴールを定義
- `path`: `/docs/ja/projects/prj-0001/020-project-definition/prj-overview.md`
- `result`: `/docs/ja/projects/prj-0001/030-project-management/execution/exec/results/T-LAUNCH-prj-overview-010-I01-result.md`

**done_criteria:**

- プロジェクトの目的・背景・ゴールが業務観点で確認できる粒度で記述されていること
- プロジェクトの目的・スコープを承認できる情報が含まれていること
- 技術的前提・制約を読み取れる情報が含まれていること
- 成功判定の輪郭が確認できること
- プロジェクトの目的・スコープを計画立案の基礎として確認できること

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **BA（Business Analyst）**
- 責務: 要件、利用者視点、受入条件を整理する。

このロールが重視するレビュー観点:

- 業務価値との対応: 成果物の記述が業務目的、利用者、業務課題、期待効果と対応しているか。
- 要件・受入条件の充足: 要件、受入条件、対象範囲、対象外が利用者視点で確認できる粒度になっているか。
- 関係者・利用場面の明確性: 関係者、利用場面、確認者、合意対象が読み取れるか。

## 4. 進め方

rulebook / recipe / sample / template に原則縛られないため、対象成果物の文脈から記載内容を組み立てる。次の手順で記載内容を決める。

1. `depends_on` に挙がった成果物を読み、前提・決定事項・用語・制約を把握し、それらと整合する内容にする。
2. `name`・`overview`・`done_criteria` から、この成果物が答えるべき問いと記載すべき項目の仮説を立てる。done_criteria の各項目を満たす記述を必ず含める。
3. プロジェクト文脈（背景・目的・関係者の意図）を `depends_on` の成果物や関連ドキュメントから確認し、仮説を裏付けるか修正する。
4. 内部情報だけで判断できない一般的な観点・用語・標準があり、実行 agent が Web 検索能力を持つ場合は、関連情報を取得して出典を添える。Web 検索能力がない場合は、利用可能な内部情報の範囲で判断し、確認できない事項を result に記録する。
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
- agent 自身は claim / complete / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。
