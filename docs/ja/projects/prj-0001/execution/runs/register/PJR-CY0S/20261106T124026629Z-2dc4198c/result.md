---
specdojo:
  id: prj-0001:xer-pjr-cy0s-20261106t124026z-06922e24
  type: exec-result
  task_id: PJR-CY0S
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-CY0S/20261106T124026629Z-2dc4198c/plan.md
  started_at: "2026-11-06T12:40:40.377Z"
  completed_at: "2026-11-06T12:51:38.716Z"
  agent: sol-executor
  approach: sample-maintenance
  targets:
    - specdojo:stsd-sample
---

# Edit Result

## 1. 実施内容

- stsd-sample の遷移 ID を、図と表が交互に並ぶ形式から、PJR-FS9A の規則に従った通し番号へ振り直しました。
- 通常系の遷移 ID を `T-01` から `T-05` へ、例外系の遷移 ID を `T-06` から `T-08` へ再割り当てしました。
- 図のラベルと、その直後に続く遷移表の ID が一致していることを確認しました。
- 例外系の図の前に記載されていた遷移 ID の範囲指定も、新しい番号体系に合わせて更新しました。
- 遷移の中身（遷移元・遷移先・イベント・条件・補足）および、文書の他の章の内容には変更を加えていません。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/stsd-sample.md`: 遷移 ID を図と表の順に振り直しました。具体的には、通常系を `T-01`〜`T-05`、例外系を `T-06`〜`T-08` とし、図と表の ID 一致および範囲指定の更新を行いました。

## 3. 申し送り

- 旧→新: T-01→T-01、T-02→T-02、T-03→T-03、T-04→T-06、T-05→T-04、T-06→T-07、T-07→T-05、T-08→T-08。追加・削除なし。個票の対応結果にも記録済み。
- reporter 記録用: stsd-rulebook 第3・5・6章、stsd-mermaid-rulebook、stsd-recipe、sample-authoring-standard、共通レビュー観点、PJR-FS9A・PJR-0QJS の結果、stsd-job-run・stsd-deliverable と対応する condense result を確認した。recipe の既存 ID 保持規定との不一致は rulebook を優先した。F001・F002 の照合条件は状態一覧・初期遷移・T-01 に反映済みのため維持した。図表対応・共有状態は判断に必要であり、vp-arc-conciseness に照らして維持した。result は編集していない。
- 指定の lint:md・lint:fm・lint:mermaid を含む親検証は、指示に従い runner の実行へ委ねた。
- 適用外の検証: `npm run validate:schema:file`（executor 自身の変更は Markdown のみ。）

## 4. 進め方と実践の型の適用

PJR-FS9A の規則に基づき、分割された stsd-sample の遷移 ID を図と表の順に振り直しました。通常系（`T-01`〜`T-05`）と例外系（`T-06`〜`T-08`）の区分けを行い、整合性を確保しています。
