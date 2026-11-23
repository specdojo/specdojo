---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-project-pm-risk-register-sample-040-20261123t065649z-105ac726
  type: exec-result
  task_id: T-KATA-WAVE-6-PROJECT-pm-risk-register-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-PROJECT-pm-risk-register-sample-040/T-KATA-WAVE-6-PROJECT-pm-risk-register-sample-040-20261123T065649Z-105ac726/plan.md
  started_at: "2026-11-23T06:56:56.577Z"
  completed_at: "2026-11-23T07:16:53.896Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - specdojo:pm-risk-register-sample
    - specdojo:pm-risk-register-rulebook
---

# Edit Result

## 1. 実施内容

- rulebook である `docs/ja/specdojo/rulebooks/pm-risk-register-rulebook.md` を更新し、grade による指摘事項を解消しました。
- 章構成を執筆標準に合わせて変更し、個票運用時の詳細な入力先、公開可能な情報の範囲、影響度の判定観点、受容判断の主体、移管時の ID 対応、および見直し漏れ時の是正手順を追記しました。
- 禁止事項についても、公開してよい情報の範囲や、人間による判断の必要性、生成物に対する扱いなどを整理しました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/pm-risk-register-rulebook.md`: 章構成を `rulebook-authoring-standard.md` に準拠して整理し、finding (`F001`〜`F013`) に基づく記述の拡充を行いました。具体的には、個票における各項目の入力先、影響度の判定観点、リスクの受容判断を人間が行う旨、および見直しが行われなかった際の是正措置を追記しました。

## 3. 申し送り

- F008/F009: 6 章構成の単独のリスク登録簿に対応する `template` がありません。Frontmatter の `template` (`specdojo:pm-risk-register-template`) は `register build` による生成ビューを指しています。rulebook には、`template` が生成ビュー用であることと、単独の登録簿は本文要件の 6 章で作ることを記述しましたが、単独用の `template` を作成するか、単独の運用を見直す検討が必要です。
- F010: sample (`specdojo:pm-risk-register-sample`) が改訂後の rulebook の要件を満たしていません。評価基準の判定条件、対応表、役割による判断者、完了条件、`item_status` によるステータス、見直し漏れ時の是正、および文書 ID による関連ドキュメントの記述が不足しています。これは後続の sample 更新タスクで対応する必要があります。
- F007: 個票の値の検証手順や `register build` の再実行手順については、同じ内容を書き写さない方針 (`PJR-2GD6`) に従い、`pjr-rulebook` を参照する構成としました。もし手順の明記が引き続き必要とされる場合は、`pjr-rulebook` 側の更新を検討してください。
- F008/F009: 6 章構成の単独のリスク登録簿に対応する template がない。Frontmatter の `template`（`specdojo:pm-risk-register-template`）は `register build` の生成ビューを指している。rulebook には、`template` が生成ビュー用であることと、単独の登録簿は本文要件の 6 章で作ることを書いた。単独用の template を作るか、単独の運用をやめるかを決める必要がある。
- F010: sample（`specdojo:pm-risk-register-sample`）が改訂後の rulebook を満たしていない。足りないのは、評価基準の判定条件と対応表、再評価の条件と判断する Role code、確かめ方と合格の基準を書いた完了条件、`item_status` の値によるステータス、見直し漏れのときの連絡先と是正、文書 ID による関連ドキュメントと影響を受ける成果物。sample を直すタスクで対応する。
- F007: 個票の値の検証と `register build` を再実行する手順は、同じ内容を書き写さない方針（PJR-2GD6）のため `pjr-rulebook` を正本として参照するだけにした。手順を本書にも書くべきだという指摘が続く場合は、`pjr-rulebook` 側に確認手順を足すか検討する。

## 4. 進め方と実践の型の適用

rulebook メンテナンスの原則に従い、成果物 (`pm-risk-register-sample`) の実態と `grade` の指摘事項を `rulebook` に反映させるアプローチを取りました。`template` や `sample` の不整合については、このフェーズでは `rulebook` の定義を優先し、実態を `rulebook` に合わせる形で記述を整理しました。
