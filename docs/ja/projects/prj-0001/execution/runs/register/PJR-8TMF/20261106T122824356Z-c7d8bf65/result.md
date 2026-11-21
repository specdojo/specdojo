---
specdojo:
  id: prj-0001:xer-pjr-8tmf-20261106t122824z-62ae349b
  type: exec-result
  task_id: PJR-8TMF
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-8TMF/20261106T122824356Z-c7d8bf65/plan.md
  started_at: "2026-11-06T12:28:46.182Z"
  completed_at: "2026-11-06T12:59:30.646Z"
  agent: sol-executor
  approach: template-maintenance
  targets:
    - specdojo:stsd-template
---

# Edit Result

## 1. 実施内容

- `stsd-template` を新しい章立てに更新しました。
- 章構成を「目的」「適用範囲」「状態の判定」「状態一覧」「状態遷移」「今後の検討メモ」の6章構成に変更しました。
- 「目的」の記入案内を、文書の使い方ではなく状態の目的を記述するよう修正しました。
- 「適用範囲」から状態の判定に関する記述を除去し、新設した「状態の判定」の章へ移動しました。
- 「スコープ」の表記を、TO-BE の文書と並ぶ場合のみ記載する条件付きの形式に整備しました。
- 「状態遷移」について、図の直下に遷移の表を配置する形式に変更し、図のラベルに遷移 ID (`T-&lt;nn&gt;`) を含めるよう案内を更新しました。
- STSD および Mermaid の `rulebook` に基づき、分割図における遷移 ID や共有状態の明記を維持するよう構成を整えました。

## 2. 変更ファイル

- `docs/ja/specdojo/templates/stsd-template.md`: 章立てを「目的・適用範囲・状態の判定・状態一覧・状態遷移」の新しい構成に更新しました。また、状態遷移図における遷移 ID (`T-&lt;nn&gt;`) の明記や、図と遷移の表の配置に関する記入案内を整備しました。

## 3. 申し送り

- 適用外の検証: `npm run validate:catalog`（executorの変更はテンプレートのみで、`docs/ja/projects/` 配下に及ばないため。）
- 適用外の検証: `npm run validate:history-links`（executorは登録簿・既存plan・resultを変更していないため。）
- 適用外の検証: `npm run validate:schema:file`（変更したYAMLファイルがないため。）

## 4. 進め方と実践の型の適用

指示された新しい章立て（目的・適用範囲・状態の判定・状態一覧・状態遷移）に基づき、`stsd-template` の構成を全面的に見直しました。特に、状態の判定基準を「適用範囲」から独立させ、「状態の判定」の章として再定義し、構成上の整合性を確保しました。また、状態遷移図の記述についても、図と表をセットで扱うための新しい規約に適合するよう、プレースホルダと記入案内を更新しています。
