---
specdojo:
  id: prj-0001:xer-t-kata-review-all-pm-communication-plan-sample-150-20261125t080751z-93294d07
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-pm-communication-plan-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-pm-communication-plan-sample-150/T-KATA-REVIEW-ALL-pm-communication-plan-sample-150-20261125T080751Z-93294d07/plan.md
  started_at: "2026-11-25T08:08:00.562Z"
  completed_at: "2026-11-25T08:22:37.558Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:pm-communication-plan-sample
    - specdojo:pm-communication-plan-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として、コミュニケーション計画の sample を関連 sample と照合し、家族利用者向け手順書の呼称を「簡易手順書」から「操作メモ」にそろえた（2 か所）。
- grade の F001（RACI の参照先が読めない）は前の段で解消済みだった。現在の版では、見直し条件と未決事項の表から `[[specdojo:pm-raci-sample|RACI]]` の判断行へ参照が付いているため、この段では変更していない。
- 登録簿の「初期公開」「試行」と、管理計画・本書の「初期リリース」「店頭試用」の食い違いは、相手側を直す案として「要判断」で申し送った。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/pm-communication-plan-sample.md`: 家族利用者向けの手順書の呼称「簡易手順書」を「操作メモ」に置き換えた。対象は、コミュニケーション機会（`STH-FAMILY-USER` への試用参加の依頼の手段）と、見直し条件と未決事項の連絡手段・チャネルの行の 2 か所。スコープの sample、AC-04、登録簿、管理計画の M-08、変更要求ログの呼称にそろえた（2 行追加・2 行削除）。

## 3. 申し送り

- R5-1（直した）: 「簡易手順書」を「操作メモ」に 2 か所置き換えた。根拠は `vp-qe-kata-conformance`、`prj-scope-sample` の運用補助、`prj-success-criteria-and-acceptance-criteria-sample` の AC-04、`prj-stakeholder-register-sample` の希望チャネル。印はなし。
- R5-2（要判断）: 相手側の `specdojo:prj-stakeholder-register-sample` が「初期公開」「代表シナリオ試行」と書く一方、管理計画と本書は「初期リリース」「店頭試用」と書く。直す案は、登録簿の表記を管理計画のゲート名（初期リリース・店頭試用開始）に合わせること。登録簿は概要（`prj-overview-sample`）の「初期公開指標」を受けた言葉なので、概要まで含めてどちらにそろえるかを人が決める必要がある。本書を登録簿の表記に寄せる案は、管理計画のゲート名とずれるため選ばなかった。根拠は `vp-qe-kata-conformance`、`vp-dev-change-impact`。
- R5-1: 段 R5 / 箇所 コミュニケーション機会（`STH-FAMILY-USER` への試用参加の依頼の手段）、見直し条件と未決事項（連絡手段・チャネルの行） / 指摘 家族利用者向けの手順書を「簡易手順書」と書いているが、スコープの sample の運用補助、成功条件の AC-04、登録簿、管理計画の M-08、変更要求ログは同じ文書を「操作メモ」と呼んでいる / 直した案 2 か所を「操作メモ」に置き換えた / 根拠 `vp-qe-kata-conformance`（kata 相互）、`prj-scope-sample` の運用補助、`prj-success-criteria-and-acceptance-criteria-sample` の AC-04（作るのは `DEV`）、`prj-stakeholder-register-sample` の希望チャネル / 印 -
- R5-2: 段 R5 / 箇所 方針と適用範囲・コミュニケーション機会（相手側: ステークホルダー登録簿の全章） / 指摘 登録簿は「初期公開」「代表シナリオ試行」と書き、管理計画と本書は「初期リリース」「店頭試用」と書いていて、同じ節目を指す言葉が系列の中でそろっていない / 直した案 - / 根拠 `vp-qe-kata-conformance`、`vp-dev-change-impact`。相手側の `specdojo:prj-stakeholder-register-sample` の「初期公開」「試行」を、管理計画のゲート名（初期リリース・店頭試用開始）に合わせて書き換える案。迷った理由: 登録簿は概要（`prj-overview-sample`）の「初期公開指標」を受けた言葉なので、概要まで含めた系列全体でどちらにそろえるかを人が決める必要がある。本書のほうを登録簿の表記に寄せる案は、管理計画のゲート名とずれるため選ばなかった / 印 要判断
- F001（`vp-ux-language-consistency`、RACI の参照先が読めない）は前の段で解消済み。いまの版では、見直し条件と未決事項の表から `[[specdojo:pm-raci-sample|RACI]]` の判断行に参照が付いているため、この段では変更していない。
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/samples/ 配下の sample だけで、plan・result・個票は変えていない）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルに `*.yaml` / `*.yml` がない）

## 4. 進め方と実践の型の適用

根拠は、スコープ・成功条件と受入基準・ステークホルダー登録簿・管理計画・変更要求ログの各 sample、`vp-qe-kata-conformance` と `vp-dev-change-impact` の観点。F001 は読み込んだ現在の版で解消済みと確認し、変更しなかった。用語の食い違いのうち、本書の側で直せる「操作メモ」は直し、登録簿側の表記は相手側を変更せず案として残した。検査は Prettier、`lint:md:changed`、`lint:fm:changed`、`validate:schema`、`test:docs` などが成功した。`validate:history-links` と `validate:schema:file` は、履歴ファイルも YAML も変更していないため非適用とした。
