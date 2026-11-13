---
specdojo:
  id: prj-0001:xer-pjr-kbrm-20261113t094209z-9a0fe89c
  type: exec-result
  task_id: PJR-KBRM
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-KBRM/pjr-kbrm-20261113T094209Z-9a0fe89c/plan.md
  started_at: "2026-11-13T09:42:10.475Z"
  completed_at: "2026-11-13T10:06:37.890Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- 7系統の recipe、template、rulebook、および sample ファイルを改訂された rulebook の内容に合わせて同期しました。
- 管理計画における依存関係の記述、RACI の担当展開、および品質管理における判定・記録欄の整備を行いました。
- メンバー定義の sample において、採用された 8 ロールを人間でカバーするように調整しました。
- カタログ雛形（`dct-project-management-template.yaml`）の更新を含め、計 24 ファイルの変更が完了しています。

## 2. 変更ファイル

- `docs/ja/specdojo/recipes/pm-organization-recipe.md`: プロジェクト組織に関する recipe を更新しました。
- `docs/ja/specdojo/recipes/pm-plan-recipe.md`: プロジェクト計画に関する recipe を更新しました。
- `docs/ja/specdojo/recipes/pm-quality-management-plan-recipe.md`: 品質管理計画に関する recipe を更新しました。
- `docs/ja/specdojo/recipes/pm-raci-recipe.md`: RACI に関する recipe を更新しました。
- `docs/ja/specdojo/recipes/pm-roles-recipe.md`: 役割に関する recipe を更新しました。
- `docs/ja/specdojo/recipes/prj-assumptions-constraints-dependencies-recipe.md`: 前提・制約・依存に関する recipe を更新しました。
- `docs/ja/specdojo/recipes/prj-comparison-of-alternatives-recipe.md`: 代替案比較に関する recipe を更新しました。
- `docs/ja/specdojo/rulebooks/pm-quality-management-plan-rulebook.md`: 品質管理計画の rulebook を更新しました。
- `docs/ja/specdojo/rulebooks/pm-raci-rulebook.md`: RACI の rulebook を更新しました。
- `docs/ja/specdojo/rulebooks/pm-roles-rulebook.md`: 役割の rulebook を更新しました。
- `docs/ja/specdojo/samples/pm-members-sample.yaml`: メンバー構成の sample を更新しました。
- `docs/ja/specdojo/samples/pm-plan-sample.md`: 計画書の sample を更新しました。
- `docs/ja/specdojo/samples/pm-quality-management-plan-sample.md`: 品質管理計画の sample を更新しました。
- `docs/ja/specdojo/samples/pm-raci-sample.md`: RACI の sample を更新しました。
- `docs/ja/specdojo/samples/pm-roles-sample.yaml`: 役割の sample を更新しました。
- `docs/ja/specdojo/templates/dct-project-management-template.yaml`: プロジェクト管理カタログの template を更新しました。
- `docs/ja/specdojo/templates/pm-organization-template.md`: 組織に関する template を更新しました。
- `docs/ja/specdojo/templates/pm-plan-template.md`: 計画書に関する template を更新しました。
- `docs/ja/specdojo/templates/pm-quality-management-plan-template.md`: 品質管理計画に関する template を更新しました。
- `docs/ja/specdojo/templates/pm-raci-template.md`: RACI に関する template を更新しました。
- `docs/ja/specdojo/templates/pm-roles-template.yaml`: 役割に関する template を更新しました。
- `docs/ja/specdojo/templates/prj-assumptions-constraints-dependencies-template.md`: 前提・制約・依存に関する template を更新しました。
- `docs/ja/specdojo/templates/prj-comparison-of-alternatives-template.md`: 代替案比較に関する template を更新しました。

## 3. 申し送り

- 統合後、orchestrator が7系統の rulebook / sample の grade を実行し、indie が確定の段を行ってください。
- SC-04 の運用前1か月の基準値採取を試用開始の前提とし、対象確定→BA による採取→QE の照合→試用開始の依存、PM のリスク管理を sample に記載しました。運用後の SC-04 の合否は初期受入に含めません。
- メンバー定義 sample は共通文脈の役割ベースの nickname と架空の兼務に揃え、BA・DEV・QE を含む採用済み8ロールを人間でカバーしました。
- 前提・制約・依存の項目 ID・依存表の列名と、代替案比較 sample の必須評価軸は既に対応済みのため保持しました。rulebook の変更は、grade 指摘に対応するロール定義・RACI・品質管理計画の3件に限定しました。
- CHANGELOG 文案（変更）: プロジェクトの型7種類の recipe・template を改訂済み rulebook に同期し、管理計画の依存・根拠・証跡、ロール採用、RACI の担当展開、品質管理の判定・記録欄を整備。駄菓子屋 sample の人間の担当と運用前ベースラインの準備を修正。個票の対応結果にも記載済みです。

## 4. 進め方

改訂された rulebook に基づき、既存の recipe、template、および sample を一貫性のある内容に更新しました。具体的には、管理計画における依存関係の明示、RACI における役割の展開、および品質管理における判定基準の整備を行いました。また、メンバー定義の sample を現在の採用ロールに合わせて調整しました。最後に、すべての変更に対して静的検査および整合性検査を実行し、正当性を確認しました。
