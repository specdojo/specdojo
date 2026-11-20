---
specdojo:
  id: prj-0001:xer-pjr-hvqz-20261120t165955z-54a8a5e3
  type: exec-result
  task_id: PJR-HVQZ
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-HVQZ/pjr-hvqz-20261120T165955Z-54a8a5e3/plan.md
  started_at: "2026-11-20T16:59:56.366Z"
  completed_at: "2026-11-20T17:17:09.934Z"
  agent: flash-high-executor
---

# Edit Result

## 1. 実施内容

- 決定記録（dec）および移行テスト計画（ntp）の型（rulebook・sample）を非推奨化し、後継への案内を記載しました。また dss-sample の dec 参照を登録簿の decision へ更新しました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/dec-rulebook.md`: 変更、+10 / -42 行
- `docs/ja/specdojo/rulebooks/ntp-rulebook.md`: 変更、+10 / -50 行
- `docs/ja/specdojo/samples/dec-sample.md`: 変更、+3 / -30 行
- `docs/ja/specdojo/samples/dss-sample.md`: 変更、+12 / -12 行
- `docs/ja/specdojo/samples/ntp-sample.md`: 変更、+3 / -30 行

## 3. 申し送り

- 【pm-review-viewpoints.yaml の扱い】pm-review-viewpoints.yaml の `document_kinds` における specdojo:dec-rulebook および specdojo:ntp-rulebook は、現存する全 rulebook ファイル（112件）を網羅判定する `confirmed_default` の記録であり、後継である specdojo:pjr-rulebook および specdojo:mtp-rulebook は既に `confirmed_default` に含まれている。また dec-rulebook.md と ntp-rulebook.md は本タスクでは削除せず非推奨として残すため（完了条件 2）、pm-review-viewpoints.yaml から削除すると viewpoint-document-kinds-check で未判定（undecided）エラーとなる（先行の cstd-rulebook も非推奨化後も `confirmed_default` に維持されている）。したがって、pm-review-viewpoints.yaml および派生テスト snapshot（specdojo--pm-review-viewpoints.md.snap）は変更不要と判断した。
- 【CHANGELOG に書く事項】区分: 変更 / 行の文案: 決定記録（dec）と移行テスト計画（ntp）の型（rulebook・sample）を非推奨にし、後継（dec は登録簿の decision、ntp は mtp-rulebook）への移行方針を明記した。また dss-sample の dec 参照を登録簿の decision へ向けた。
- 適用外の検証: `npm run validate:schema:file`（No `*.yaml` or `*.yml` files changed）

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
