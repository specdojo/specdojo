---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-project-pm-issue-log-sample-060-20261123t082639z-4f1dbe6b
  type: exec-result
  task_id: T-KATA-WAVE-6-PROJECT-pm-issue-log-sample-060
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-PROJECT-pm-issue-log-sample-060/T-KATA-WAVE-6-PROJECT-pm-issue-log-sample-060-20261123T082639Z-4f1dbe6b/plan.md
  started_at: "2026-11-23T08:26:50.814Z"
  completed_at: "2026-11-23T08:44:09.412Z"
  agent: opus-executor
  execution: agent
  approach: template-maintenance
  targets:
    - specdojo:pm-issue-log-sample
    - specdojo:pm-issue-log-template
---

# Edit Result

## 1. 実施内容

- 課題ログの `template` を更新しました。
- 既存の `template` の冒頭にあった「派生ビュー」という記述を、`register build` による再生成手順の明記と、`item_type: issue` の個票がソースである旨の説明に書き換えました（F019への対応）。
- なお、`template` は `register build` によって自動生成される登録簿のビュー枠組みであるため、rulebook の「位置づけ」章に基づき、単独の課題ログ用としての 6 章構成（F001〜F016）は採用せず、`view-slot=table` の構造を維持しています。

## 2. 変更ファイル

- `docs/ja/specdojo/templates/pm-issue-log-template.md`: 冒頭のガイダンスを更新し、`register build` による再生成手順と、`item_type: issue` の個票をソースとすることを明記しました。

## 3. 申し送り

- F001〜F013・F015・F016 は不採用。`template` は登録簿の生成物 `controls/generated/pm-issue-log.md` の枠組みで（rulebook の「位置づけ」章、`src/register/views.ts`）、6 章構成は単独の課題ログだけに求められる要件である。`view-slot=table` を書き換えると `register build` の出力が壊れる。
- F014 は不採用。rulebook の「位置づけ」章が生成物の rulebook を `specdojo:pjr-rulebook` と明示しており、今の値で正しい。`specdojo:pm-issue-log-rulebook` を使うのは単独のログだけである。
- F017 は不採用。「派生ビュー」「個票」はプロジェクト登録簿 作成ルール（`specdojo:pjr-rulebook`）で定義された用語であり、同系統の template（risk-register・change-request-log・decision-log）とも同じ表現である。
- F018: `template` の `status` は `ready` のまま。変更は人が判断する事柄である。
- 次のアクションの案: 登録簿の生成ビュー用 `template` を単独の文書の作成用雛形として採点しないよう、grade の観点か rulebook 側の明示を見直すことを検討する。同じ枠組みの `pm-risk-register` / `pm-change-request-log` / `pm-decision-log` の `template` にも、再生成の手順を書く同じ修正を広げるかどうかは別のタスクで判断する。
- F001〜F013・F015・F016 は不採用。template は登録簿の生成物 `controls/generated/pm-issue-log.md` の枠組みで（rulebook の「位置づけ」章、`src/register/views.ts`）、6章構成は単独の課題ログだけに求められる要件である。`view-slot=table` を書き換えると `register build` の出力が壊れる。
- F018: template の status は `ready` のまま。変更は人が判断する事柄である。
- 次のアクションの案: 登録簿の生成ビュー用 template を単独の文書の作成用雛形として採点しないよう、grade の観点か rulebook 側の明示を見直すことを検討する。同じ枠組みの pm-risk-register / pm-change-request-log / pm-decision-log の template にも、再生成の手順を書く同じ修正を広げるかどうかは別のタスクで判断する。

## 4. 進め方と実践の型の適用

参照の向きを「成果物 → `template`」に切り替え、対象成果物に紐づく `template` を見直しました。`template` は自動生成されるビューとしての役割を持つため、単独の文書としての構成（6 章構成など）は rulebook の「位置づけ」に基づき採用せず、再生成の手順とソースの定義を明確化することに注力しました。
