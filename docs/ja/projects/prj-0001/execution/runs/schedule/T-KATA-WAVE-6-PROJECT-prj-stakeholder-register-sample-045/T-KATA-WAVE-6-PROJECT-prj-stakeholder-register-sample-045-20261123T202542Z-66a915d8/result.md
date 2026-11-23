---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-project-prj-stakeholder-register-sample-045-20261123t202542z-66a915d8
  type: exec-result
  task_id: T-KATA-WAVE-6-PROJECT-prj-stakeholder-register-sample-045
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-PROJECT-prj-stakeholder-register-sample-045/T-KATA-WAVE-6-PROJECT-prj-stakeholder-register-sample-045-20261123T202542Z-66a915d8/plan.md
  started_at: "2026-11-23T20:25:49.727Z"
  completed_at: "2026-11-23T20:33:25.070Z"
  agent: opus-executor
  execution: agent
  approach: recipe-maintenance
  targets:
    - specdojo:prj-stakeholder-register-sample
    - specdojo:prj-stakeholder-register-recipe
---

# Edit Result

## 1. 実施内容

- recipe を更新し、`grade` から報告された 3 つの `finding` (F001, F002, F003) に対応する問題を解消しました。
- 具体的には、エンゲージメント方針の問い、期限の書き方のコツ、および見直し条件における承認者の記載ルールについて、`recipe` 側の記述を修正しました。
- `rulebook` および `sample` は、このフェーズでは変更していません。

## 2. 変更ファイル

- `docs/ja/specdojo/recipes/prj-stakeholder-register-recipe.md`: `finding` に基づき、以下の 3 箇所を修正しました。1. 「合意の時点」の観点において、エンゲージメント方針の行動と期限が食い違わないよう、問いとコツを追加。2. 「関与方針」の記載において、会議の頻度ではなく節目や条件で書くよう、コツを追加。3. 「見直し条件」の記載において、承認者を適切に記載するよう、コツを追加。

## 3. 申し送り

- sample (`docs/ja/specdojo/samples/prj-stakeholder-register-sample.md`) は未修正です。次の sample 修正の段で以下を実施する必要があります: 1. `STH-FAMILY-USER` の関与方針を「リリース前の試利用」に合わせる (F001)。2. 「週次相談」の重複を排除し、関与方針の期限を節目や条件で書くよう調整する (F002)。3. プロジェクトの目的・スコープ変更行の承認者を 「-」 から `PO` に修正する (F003)。
- `grade` の `finding` の行番号（60, 64, 87）は、現在の `recipe` の行（69, 73, 96）とずれていますが、`anchor` の文言を用いて正しく照合して修正を行いました。
- sample（`docs/ja/specdojo/samples/prj-stakeholder-register-sample.md`）は未修正。次の sample 修正の段で直す: `STH-FAMILY-USER` の関与方針「リリース後に試利用させる」をリリース前の試利用に合わせる（F001）／「週次相談」の繰り返しをコミュニケーション要件の「計画への反映」1 か所に絞り、関与方針の期限を節目か関与を終える条件で書く（F002）／見直し条件の目的・スコープ変更行の承認者「-」を `PO` に直す（F003）。
- grade の finding の行番号（60・64・87）は今の recipe の行（69・73・96）とずれている。前の版を評価したものとみて、anchor の文言で場所を突き合わせた。
- 適用外の検証: `npm run validate:history-links`（変更は recipe のみで、plan・result・個票を変更していないため）

## 4. 進め方と実践の型の適用

`grade` から出力された `finding` を `recipe` の見直し基準として適用しました。各指摘事項（F001, F002, F003）を、`recipe` 内の「レビュー観点」および「仕上げチェック」の項目に反映させることで、成果物作成時に同様のミスが起きないよう、問いやコツとして定着させています。
