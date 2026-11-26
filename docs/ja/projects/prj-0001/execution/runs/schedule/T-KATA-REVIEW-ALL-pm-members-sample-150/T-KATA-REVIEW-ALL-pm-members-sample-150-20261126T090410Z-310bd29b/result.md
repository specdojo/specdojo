---
specdojo:
  id: prj-0001:xer-t-kata-review-all-pm-members-sample-150-20261126t090410z-310bd29b
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-pm-members-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-pm-members-sample-150/T-KATA-REVIEW-ALL-pm-members-sample-150-20261126T090410Z-310bd29b/plan.md
  started_at: "2026-11-26T09:04:21.592Z"
  completed_at: "2026-11-26T09:10:06.854Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - prj-0001:pm-members-sample
    - specdojo:pm-members-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として、pm-members-sample を共通サンプル文脈、`based_on` の参照先、同じ系列の pm sample（pm-roles-sample、pm-organization-sample）、用語集と照合した。
- 5 名の `display_name`・`nickname`・`roles` と未成年の rule に食い違いはなく、用語集にも食い違う語はなかった。
- grade の F001（`display_name`「同行レビュー担当」）は、共通登場人物の役割名と sysd-cross-cutting-policy-sample の表記に一致する。sample だけを変えると系列内の不整合を生むため、sample は変更せず、相手側を直す案を findings に残した。
- 変更ファイルはない。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | `members[peer-reviewer].display_name`（pm-members-sample.yaml 38行付近） | grade F001 は、「同行レビュー担当」が nickname `peer-reviewer` と note の「第三者視点で確認」に合わず、レビューの独立性が伝わらないとする。ただしこの表示名は、共通登場人物の役割名と sysd-cross-cutting-policy-sample（27〜31行・154行）の表記に一致している。 | sample は変更しない。表示名を改める場合は、正本 sample-authoring-standard.md の共通登場人物表で「同行レビュー担当」を「第三者レビュー担当」などへ変える。同時に pm-members-sample.yaml（`display_name` と rules）と sysd-cross-cutting-policy-sample.md の表記もそろえる。sample だけを変える案は、系列内の不整合を生むため選ばなかった。この指摘は R3 の観点 `vp-ux-language-consistency` にも当たる。 | `vp-qe-kata-conformance`（kata 相互と適用先）、sample.instructions の「業務文脈は共通サンプル文脈に統一」 | 要判断 |
| R5-2 | R5 | members 全体・rules | 5 名の `display_name`・nickname・roles と未成年の rule は、共通登場人物、pm-roles-sample の code、pm-organization-sample の採否・owner 方針・責任領域と一致している。用語集（`gl-*.yaml`）にも食い違う語はない。 | - | `vp-qe-kata-conformance`、`vp-dev-change-impact` | - |

## 2. 変更ファイル

- なし

## 3. 申し送り

- R5-1: 段 R5 / 箇所 `members[peer-reviewer].display_name` / 指摘 grade F001 は「同行レビュー担当」が第三者視点の確認と合わないとするが、この表示名は Sample 記述標準の共通登場人物（`peer-reviewer` の sample 内の役割）と sysd-cross-cutting-policy-sample（27〜31行・154行）の表記に一致し、sample だけを変えると共通サンプル文脈から外れる / 直した案 - / 根拠 `vp-qe-kata-conformance`（kata 相互と適用先）、sample.instructions の「業務文脈は共通サンプル文脈に統一」。相手側を直す案: 表示名を改めるなら、正本の sample-authoring-standard.md の共通登場人物表の「同行レビュー担当」を「第三者レビュー担当」などへ変え、同時に pm-members-sample.yaml（`display_name` と rules）と sysd-cross-cutting-policy-sample.md の表記をそろえる。選ばなかった案は、sample だけを変えること（系列内の不整合を生むため）。F001 は R3 の観点（`vp-ux-language-consistency`）でもある / 印 要判断
- R5-2: 段 R5 / 箇所 members 全体・rules / 指摘 5 名の `display_name`・nickname・roles、未成年の rule は、共通登場人物、pm-roles-sample の code、pm-organization-sample の採否・owner 方針・責任領域と一致し、用語集（`gl-*.yaml`）にも食い違う語はない / 直した案 - / 根拠 `vp-qe-kata-conformance`、`vp-dev-change-impact` / 印 -
- 適用外の検証: `npm run validate:schema:file -- --schema docs/specdojo/schemas/v1/pm-members.schema.yaml --data docs/ja/specdojo/samples/pm-members-sample.yaml`（変更した `*.yaml` / `*.yml` ファイルがない（sample は変更なし））
- 適用外の検証: `npx prettier --check`（変更した md/ts/js/json/yaml ファイルがない）
- 適用外の検証: `npm run validate:history-links`（executor は plan・result・個票を変更していない）

## 4. 進め方と実践の型の適用

根拠にした資料は、Sample 記述標準の共通サンプル文脈、pm-roles-sample、pm-organization-sample、sysd-cross-cutting-policy-sample、用語集（`gl-*.yaml`）、`vp-qe-kata-conformance`、`vp-dev-change-impact`、`vp-ux-language-consistency` である。整合している記述はすべて維持し、改訂はしなかった。F001 は、sample だけを直すと共通サンプル文脈から外れるため見送った。次のアクションは、表示名を改めるかどうかを人が判断することである。改める場合は、正本の共通登場人物表と、pm-members-sample.yaml（`display_name` と rules）、sysd-cross-cutting-policy-sample.md を同時に直す。YAML を変更していないため、schema 検査は `not_applicable` である。
