---
specdojo:
  id: prj-0001:xer-t-kata-review-all-pr-sample-110-20261125t145018z-bff31bc6
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-pr-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-pr-sample-110/T-KATA-REVIEW-ALL-pr-sample-110-20261125T145018Z-bff31bc6/plan.md
  started_at: "2026-11-25T14:50:28.665Z"
  completed_at: "2026-11-25T14:57:59.780Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:pr-sample
    - specdojo:pr-sample
---

# Edit Result

## 1. 実施内容

- R1（目的の過不足）を確認した。`pr-sample.md` は pr-rulebook の必須 5 章と記述ガイドを満たしており、要る内容の欠落も要らない内容の混入もなかったため、sample は変更しなかった。
- grade の F001（`vp-ba-stakeholder-clarity`、報告者・報告先の明記）は、kata ガイドが段のレビューで使わない観点であり、pr-rulebook も求めていない。Sample 記述標準が禁じる、文書を作る役割の割り当ての記述にも当たるため、直さなかった。
- rulebook など sample 以外も変更していない。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R1-1 | R1 | 冒頭の導入文（grade F001） | grade F001（`vp-ba-stakeholder-clarity`）が報告者と報告先の明記を求めている。 | - | kata ガイドの「kata の観点の組」は `vp-ba-stakeholder-clarity` を段のレビューで使わない観点としている。pr-rulebook の本文要件に報告者・報告先はない。Sample 記述標準の「記述ガイド」は、文書を作る役割の割り当てを本文に書くことを禁じている。このため直さない。 | - |
| R1-2 | R1 | 全章 | rulebook の必須 5 章（報告期間・完了事項・進行中事項・リスク・課題・次期予定）、表の列、根拠 ID の形式、進み具合の量での表記、影響度の判定、担当の Role code・期日に過不足はない。カタログの pr-progress-report に `done_criteria` はない。 | - | `vp-po-purpose-alignment`、`vp-qe-kata-conformance`（種別の責務）、`vp-arc-single-responsibility` | - |
| R1-3 | R1 | 範囲外（R5 への申し送り） | 成果物カタログの pr-progress-report は `instance_id_pattern` が pr-{yyyy}-{mm}-{dd}（日付は報告日）。pr-rulebook の「ファイル命名・ID規則」は pr-&lt;yyyy-mm-dd&gt;-&lt;nn&gt;（日付は報告期間の終了日）で、食い違っている。 | 相手側の `docs/ja/specdojo/templates/dct-project-management-template.yaml` の `instance_id_pattern` と note を rulebook に合わせる案を R5 で確かめる。 | `vp-qe-kata-conformance`（適用先との関係） | 要判断 |

## 2. 変更ファイル

- なし

## 3. 申し送り

- R1-3 の `instance_id_pattern` の食い違いは範囲外のため R5 で確かめる。相手側の `docs/ja/specdojo/templates/dct-project-management-template.yaml` の `instance_id_pattern` と note を rulebook に合わせる案を検討する。
- R1-1: R1 / 冒頭の導入文 / grade F001（vp-ba-stakeholder-clarity）が報告者と報告先の明記を求めている / - / kata ガイドの「kata の観点の組」は vp-ba-stakeholder-clarity を段のレビューで使わない観点としている。pr-rulebook の本文要件に報告者・報告先はない。Sample 記述標準の「記述ガイド」は、文書を作る役割の割り当てを本文に書くことを禁じている。このため直さない / -
- R1-2: R1 / 全章 / rulebook の必須 5 章（報告期間・完了事項・進行中事項・リスク・課題・次期予定）、表の列、根拠 ID の形式、進み具合の量での表記、影響度の判定、担当の Role code・期日に過不足はない。カタログの pr-progress-report に `done_criteria` はない / - / vp-po-purpose-alignment、vp-qe-kata-conformance（種別の責務）、vp-arc-single-responsibility / -
- R1-3: R1 / 範囲外（R5 への申し送り） / 成果物カタログの pr-progress-report は `instance_id_pattern` が pr-{yyyy}-{mm}-{dd}（日付は報告日）。pr-rulebook の「ファイル命名・ID規則」は pr-&lt;yyyy-mm-dd&gt;-&lt;nn&gt;（日付は報告期間の終了日）で、食い違っている / - / vp-qe-kata-conformance（適用先との関係）。相手側の docs/ja/specdojo/templates/dct-project-management-template.yaml の `instance_id_pattern` と note を rulebook に合わせる案を R5 で確かめる / 要判断
- 適用外の検証: `npm run validate:history-links`（executor は plan・result・個票のいずれも変更していないため、適用条件を満たさない）
- 適用外の検証: `npx prettier --check docs/ja/specdojo/samples/pr-sample.md`（sample を変更しておらず、Prettier の適用条件（`*.md` などの変更）を満たさない）

## 4. 進め方と実践の型の適用

根拠にしたのは、pr-rulebook、Sample 記述標準の記述ガイド、kata ガイドの「kata の観点の組」、成果物カタログの pr-progress-report、grade の F001 である。rulebook の必須 5 章、表の列、根拠 ID の形式、進み具合の量での表記、影響度の判定、担当の Role code・期日を照合し、過不足がないため sample の記述は維持した。F001 は、段のレビューで使わない観点であること、rulebook が要件としていないこと、文書を作る役割の割り当てを本文に書くことを標準が禁じていることから、改訂せず見送った。次のアクションはなく、sample 側の未解消事項もない。
