---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-project-pm-risk-register-sample-050-20261123t075012z-dc2fcc93
  type: exec-result
  task_id: T-KATA-WAVE-6-PROJECT-pm-risk-register-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-PROJECT-pm-risk-register-sample-050/T-KATA-WAVE-6-PROJECT-pm-risk-register-sample-050-20261123T075012Z-dc2fcc93/plan.md
  started_at: "2026-11-23T07:50:25.023Z"
  completed_at: "2026-11-23T08:05:21.330Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:pm-risk-register-sample
    - specdojo:pm-risk-register-sample
---

# Edit Result

## 1. 実施内容

- リスク登録簿の `sample` を、駄菓子屋きぬやのプロジェクトにおける単独の完成例として厚く書き換えました。
- grading によって指摘された F001〜F026 の問題（評価基準の不足、完了条件の具体性、関連ドキュメントの参照形式、役割の明記など）を解消しました。
- rulebook との整合性を保つため、本書がプロジェクト登録簿を用いない単独のサンプルである旨を概要に追記しました。
- `priority` や `item_status` を rulebook の規定に合わせた値に修正し、情報の二重管理を解消しました。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/pm-risk-register-sample.md`: リスク登録簿の完成例として、概要の拡充、評価基準（発生確率と影響度の判定表）の追加、完了条件の具体化、関連ドキュメントのリンク形式の修正、および `priority` や `item_status` の値の正規化を行いました。

## 3. 申し送り

- 決める必要のある値: RK-001 の完了条件にある、連続会計の試行の件数（`_UNDECIDED_` 件）と、1 件の会計確定にかけてよい秒数（`_UNDECIDED_` 秒）。
- rulebook の修正案: `pm-risk-register-rulebook` の frontmatter の `template` は生成ビュー（`pm-risk-register-template`）を指しており、単独の登録簿の `sample` を手で書く形式と食い違うと grade が判定した（F021）。`sample` の概要に単独の登録簿の例であることを明記して対処した。単独の登録簿には `template` がないことを frontmatter または位置づけの章で区別できるよう、rulebook の見直しを提案する。
- F025（ready にする前提）: `sample` の `status` は人だけが `ready` にできるため `draft` のまま。再 grade で問題がなければ、人の判断で `ready` にする。
- sample で置いた仮の前提: RK-002 の根拠『準備中の打合せが 2 回延期された』、見直し漏れのとき PM が 2 営業日以内に再評価する期限、RK-003 の受容を PO が判断した記載。関連する `sample` と食い違う場合は直す。
- 決める必要のある値: RK-001 の完了条件にある、連続会計の試行の件数（`_UNDECIDED_` 件）と、1 件の会計確定にかけてよい秒数（`_UNDECIDED_` 秒）。
- rulebook の修正案: pm-risk-register-rulebook の frontmatter の `template` は生成ビュー（pm-risk-register-template）を指しており、単独の登録簿の sample を手で書く形式と食い違うと grade が判定した（F021）。sample の概要に単独の登録簿の例であることを明記して対処した。単独の登録簿には template がないことを frontmatter または位置づけの章で区別できるよう、rulebook の見直しを提案する。
- F025（ready にする前提）: sample の status は人だけが ready にできるため draft のまま。再 grade で問題がなければ、人の判断で ready にする。
- sample で置いた仮の前提: RK-002 の根拠『準備中の打合せが 2 回延期された』、見直し漏れのとき PM が 2 営業日以内に再評価する期限、RK-003 の受容を PO が判断した記載。関連する sample と食い違う場合は直す。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/ の sample だけで、plan・result・個票を変更していないため）

## 4. 進め方と実践の型の適用

rulebook に沿い、`sample` を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くしました。`grade` の指摘（`finding`）に基づき、評価基準の定義、完了条件の具体性、関連ドキュメントの参照方法、および `priority` や `item_status` の値の一貫性を修正することで、実例としての完成度を高めました。
