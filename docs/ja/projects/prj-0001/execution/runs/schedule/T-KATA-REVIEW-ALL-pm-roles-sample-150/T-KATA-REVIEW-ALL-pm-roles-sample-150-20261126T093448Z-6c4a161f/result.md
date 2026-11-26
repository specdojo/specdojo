---
specdojo:
  id: prj-0001:xer-t-kata-review-all-pm-roles-sample-150-20261126t093448z-6c4a161f
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-pm-roles-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-pm-roles-sample-150/T-KATA-REVIEW-ALL-pm-roles-sample-150-20261126T093448Z-6c4a161f/plan.md
  started_at: "2026-11-26T09:34:59.509Z"
  completed_at: "2026-11-26T09:42:02.628Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - prj-0001:pm-roles-sample
    - specdojo:pm-roles-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として `pm-roles-sample.yaml` を、組織定義・メンバー定義・RACI と照合した。OPS の `project_note` が、リリース準備の主導を PM とする他の sample と食い違っていたため、1 件直した。
- QE の確認範囲に関する 1 件は、直さず「要判断」として findings に残した。
- `pm-roles.schema.yaml` による schema 検査と prettier 検査は通った。runner の `lint:md:changed`、`lint:fm:changed`、`test:docs`、`validate:schema` も通った。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | `roles[].project_note`（OPS） | OPS が導入・障害時対応・引き継ぎを「準備し」「PM が主導するリリース準備へ取り込む」と書かれ、準備と取り込みの主体が OPS になっている。組織定義はリリース準備を PM が主導、メンバー定義は OPS の支援を PM が導入準備へ取り込むとし、RACI は専門支援の助言を主導ロールの PM が取り込むとしており、食い違う。 | 「導入・障害時対応・引き継ぎを専門支援として検討し、PM が主導するリリース準備へ助言する。」に直し、ARC・UX と同じ書き方にそろえた。 | `vp-qe-kata-conformance`（`specdojo:pm-organization-sample` のロール・owner 方針、`specdojo:pm-members-sample` の shop-owner の note、`specdojo:pm-raci-sample` の適用方針と 4.1 の「リリース候補の導入・引き継ぎを準備する」の owner が PM） | - |
| R5-2 | R5 | `roles[].project_note`（QE） | QE の確認範囲に「家族の店番時の操作」が入っている。RACI の判断・プロセス別では利用者確認の R が BA（QE は C）で、組織定義の QE の欄は記録漏れ・残高誤りの検証だけのため、BA の利用者確認と重なって読める。 | - | `vp-qe-kata-conformance`、`vp-dev-change-impact`。直さなかったのは、試験として家族の店番時の操作を確かめるのは QE の責務とも読め、メンバー定義の peer-reviewer の焦点（受入条件 ID と検証結果の照合）とも矛盾しないため。選ばなかった案は、QE の説明から「家族の店番時の操作」を削って BA の利用者確認だけに任せる案、または組織定義の QE の欄へ家族の店番時の操作の試験を書き足す案（相手側の `specdojo:pm-organization-sample` を直す）。 | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/pm-roles-sample.yaml`: OPS の `roles[].project_note` を、導入・障害時対応・引き継ぎを専門支援として検討し、PM が主導するリリース準備へ助言する書き方に直した。準備と取り込みの主体が OPS に読める点を解消し、ARC・UX と同じ書き方にそろえた。差分は 1 行の置換のみ。

## 3. 申し送り

- R5-2 の QE 確認範囲（家族の店番時の操作）は、sample 側を直すか相手側の組織定義を直すかを人が判断する。
- R5-1: R5 / `roles[].project_note`（OPS） / OPS が導入・障害時対応・引き継ぎを「準備し」「PM が主導するリリース準備へ取り込む」と書かれ、準備と取り込みの主体が OPS になっている。組織定義はリリース準備を PM が主導、メンバー定義は「OPS としての支援は PM が導入準備へ取り込む」、RACI は専門支援の助言を主導ロール（PM）が取り込むとしており食い違う / 「導入・障害時対応・引き継ぎを専門支援として検討し、PM が主導するリリース準備へ助言する。」に直し、ARC・UX と同じ書き方にそろえた / `vp-qe-kata-conformance`（specdojo:pm-organization-sample のロール・owner方針、specdojo:pm-members-sample の shop-owner の note、specdojo:pm-raci-sample の適用方針と 4.1 の「リリース候補の導入・引き継ぎを準備する」の owner が PM） / -
- R5-2: R5 / `roles[].project_note`（QE） / QE の確認範囲に「家族の店番時の操作」が入っている。RACI の判断・プロセス別では利用者確認の R が BA（QE は C）、組織定義の QE の欄は記録漏れ・残高誤りの検証だけで、BA の利用者確認と重なって読める / - / `vp-qe-kata-conformance`、`vp-dev-change-impact`。直さなかったのは、試験として家族の店番時の操作を確かめるのは QE の責務とも読め、メンバー定義の peer-reviewer の焦点（受入条件 ID と検証結果の照合）とも矛盾しないため。選ばなかった案は、QE の説明から「家族の店番時の操作」を削って BA の利用者確認だけに任せる案、または組織定義の QE の欄へ家族の店番時の操作の試験を書き足す案（相手側の specdojo:pm-organization-sample を直す） / 要判断
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/pm-roles-sample.yaml のみで、pjr 個票・plan・result を変更していないため）

## 4. 進め方と実践の型の適用

根拠にしたのは、`specdojo:pm-organization-sample` のロール・owner 方針、`specdojo:pm-members-sample` の shop-owner の note、`specdojo:pm-raci-sample` の適用方針と 4.1 である。これらはリリース準備の owner を PM とし、専門支援は PM が取り込むとしている。矛盾する OPS の記述は sample 側を直した。QE の件は、試験として確かめる責務とも読め、メンバー定義の焦点とも矛盾しないため直さず、案を残した。構造と必須項目は schema を正とし、検査で整合を確認した。
