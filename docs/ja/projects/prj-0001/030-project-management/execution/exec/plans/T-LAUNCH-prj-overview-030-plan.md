---
id: prj-0001:xep-t-launch-prj-overview-030
type: exec-plan
rulebook: xep-rulebook
task_id: T-LAUNCH-prj-overview-030
name: 一次版レビュー
mode: edit
status: ready
project_id: prj-0001
owner: BA
on_critical_path: true
approach: recipe-maintenance
---

# Edit Plan: T-LAUNCH-prj-overview-030

## 1. このフェーズで行うこと

担当ロールが補強後の内容を確認し、承認・修正指示・差し戻しを判断する。
修正が軽微な場合は直接編集して承認とみなす。
差し戻しの場合は修正箇所と理由を明記する。

## 2. 対象成果物

- `name`: プロジェクト概要
- `depends_on`: -
- `overview`: プロジェクトの目的・背景・ゴールを定義
- `path`: `/docs/ja/projects/prj-0001/020-project-definition/prj-overview.md`
- `result`: `/docs/ja/projects/prj-0001/030-project-management/execution/exec/results/T-LAUNCH-prj-overview-030-result.md`

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

参照の向きを「成果物 → recipe」に切り替え、対象成果物に紐づく recipe を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行は、いずれも実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

1. 見直し対象の recipe を読み込み、現状の問い・観点・深掘り手順・レビュー観点を把握する。
2. 複数の成果物・review result・対象領域の慣行を根拠に、それらが良い内容の作成に役立っているかを見直す。
3. 成果物で繰り返し不足する内容や review で繰り返し指摘される箇所があれば、それを引き出す問い・観点を recipe に追加する。
4. 既存記述のうち、根拠と整合しない・陳腐化したものは見直し、整合するものは維持する。

見直した recipe は [[recipe-authoring-standard]]（章立て・記述ルール・禁止事項の正本）に従う。rulebook と記述が矛盾しないように更新する（構造・必須項目・禁止事項は rulebook を正とする）。

approach 全体の定義は [[specdojo-reference-materials-guide]] の「参考資料メンテナンスの進め方」を参照する。本タスクの実行に必要な recipe メンテナンスの進め方は、このセクションで完結する。

### 4.1. 見直しの根拠が不足する場合

- 見直しの根拠とできる成果物・review result が不足し、recipe の改訂が妥当か判断できない場合は、その事実と判断を result の `参考資料の活用` セクションに記録する。
- 根拠不足のまま推測で recipe を改訂しない。確証が得られた範囲に改訂を限定し、残りは申し送りに残す。
- 見直し対象の recipe が存在しない場合は、根拠とした成果物群から新規に作成する。

### 4.2. 判断根拠の記録

見直しの根拠とした成果物・review result と判断根拠を result に残す。記録先は次のとおり。

- done_criteria の充足状況: result の `done_criteria 確認` セクション。
- 根拠とした成果物・review result、改訂・維持した記述とその根拠、矛盾時に rulebook を正とした箇所: result の `参考資料の活用` セクション。

## 5. 完了手順

1. 「このフェーズで行うこと」に従って recipe を更新する。
2. 必要な検証と lint を実行する。
3. result の done_criteria_checked セクションを記入する。

## 6. 異常終了の条件

- 依存未解決・対象ファイル不明・lint/test 未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- 異常終了時は complete ではなく block を記録する。
