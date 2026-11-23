---
specdojo:
  id: prj-0001:xer-t-kata-wave-5-mip-index-sample-040-20261123t055125z-1ce60d51
  type: exec-result
  task_id: T-KATA-WAVE-5-mip-index-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-5-mip-index-sample-040/T-KATA-WAVE-5-mip-index-sample-040-20261123T055125Z-1ce60d51/plan.md
  started_at: "2026-11-23T05:51:33.577Z"
  completed_at: "2026-11-23T06:02:57.079Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - specdojo:mip-index-sample
    - specdojo:mip-index-rulebook
---

# Edit Result

## 1. 実施内容

- rulebook を簡潔に整理しました。
- 完成例の章を削除し、`based_on` の具体的な例示や、下流成果物（`dmd-*`/`mtp-*`/`cop-*`/`otp-*`）への追従・担当 Role code を明記することで、grade の指摘（F001, F002）に対応しました。
- 記述ガイドの冗長な説明を、本文要件の表を用いて整理しました（`vp-arc-conciseness`）。
- 禁止事項の整理も併せて実施しました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/mip-index-rulebook.md`: rulebook を簡潔に整理しました。完成例の章を削除し、`based_on` の具体的な例示や、下流成果物（`dmd-*`/`mtp-*`/`cop-*`/`otp-*`）への追従・担当 Role code を追加して、grade の指摘事項を解消しました。また、記述ガイドの冗長な説明を、本文要件の表を用いて整理しました。

## 3. 申し送り

- F001 は、推奨 Frontmatter 項目に `based_on` の上流の例（`prj-scope`・`nfr-*`・`bac-*`/`sac-*`・`opd-index`）を挙げて解消した。
- F002 は、位置づけの表に下流ごとの追従の担当（ARC・DEV／QE／OPS）と改訂時の追従の規則（PM が個票で追う）を足して解消した。
- 根拠は `document-metadata-standard` の『文書の改訂・廃止とライフサイクル変更管理』、`rulebook-authoring-standard`、先例の `cop-index-rulebook` と `stc-index-rulebook` である。
- サンプル（最小）の章は plan と先例の rulebook に合わせて削除し、良い例・悪い例は記述ガイドへ移した。
- 記述ガイドの章ごとの箇条書きは本文要件の表と重なるためまとめた（`vp-arc-conciseness`）。
- 禁止事項のうち必須の章を省略しないという行は、本文要件の『すべて必須』と重なるため統合・削除した。
- result の『進め方と実践の型の適用』に書く内容: F001 は、推奨 Frontmatter 項目に `based_on` の上流の例（`prj-scope`・`nfr-*`・`bac-*`/`sac-*`・`opd-index`）を挙げて解消した。F002 は、位置づけの表に下流ごとの追従の担当（ARC・DEV／QE／OPS）と改訂時の追従の規則（PM が個票で追う）を足して解消した。根拠は document-metadata-standard の『文書の改訂・廃止とライフサイクル変更管理』、rulebook-authoring-standard、先例の cop-index-rulebook と stc-index-rulebook。
- 削除・統合した箇所と理由: サンプル（最小）の章は plan と先例の rulebook に合わせて削除し、良い例・悪い例は記述ガイドへ移した。記述ガイドの章ごとの箇条書きは本文要件の表と重なるためまとめた（`vp-arc-conciseness`）。禁止事項のうち必須の章を省略しないという行は、本文要件の『すべて必須』と重なるため統合・削除した。

## 4. 進め方と実践の型の適用

既存の rulebook を見直し、grade の指摘事項（`based_on` の具体例、下流成果物への追従と担当）を反映させつつ、冗長な記述を削って簡潔な構成に整理しました。完成例の章は削除し、ルールとしての記述に特化させています。
