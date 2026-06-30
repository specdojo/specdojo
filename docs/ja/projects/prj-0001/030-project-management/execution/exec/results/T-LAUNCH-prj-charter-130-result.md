---
id: prj-0001:xer-t-launch-prj-charter-130
type: exec-result
task_id: T-LAUNCH-prj-charter-130
mode: edit
status: complete
project_id: prj-0001
plan_ref: exec/plans/T-LAUNCH-prj-charter-130-plan.md
started_at: "2026-06-29T19:14:29.129Z"
completed_at: "2026-06-30T15:33:08.340Z"
agent: claude-edit-agent
approach: template-maintenance
---

# Edit Result

## 1. 実施内容

- `docs/ja/specdojo/templates/prj-charter-template.md` を、完成版 [[prj-0001:prj-charter|プロジェクト憲章]]・review result [[prj-0001:xrr-t-launch-prj-charter-090|T-LAUNCH-prj-charter-090]]・[[prj-charter-sample]]・[[prj-charter-rulebook]] を根拠に最終調整した。
- 「2. 認可対象」に `認可条件` 行（プレースホルダ `_AUTHORIZATION_CONDITION_OR_NONE_`）を追加し、条件がない場合は行を削除する旨の `_TODO_` を添えた。完成版憲章と sample の両方が、未承認段階の補足として同じ行を採用していたため、雛形に取り込んだ。
- 「8. 権限委譲」の PO 承認事項リストを、rulebook 6.8「予算枠、公開可否、ライセンス、主要スコープ変更、GO / Not GO 判断は、PO 承認事項として明示する」の 5 区分に合わせて 3 項目から 5 項目へ拡張した。
- 「10. 後続で作成・詳細化する文書」を、4 行の汎用プレースホルダから、完成版憲章と sample の双方で一字一句一致していた 8 行の文書一覧（`dct-index` / `dct-project-definition` 〜 `pm-quality-management-plan` / `pm-communication-plan`）に置き換えた。文書 ID と目的の説明文はプロジェクト固有内容ではなく SpecDojo フレームワーク共通の文書カタログ定義であるため、プレースホルダではなく固定値とした。末尾に、成果物体系に合わせて過不足を調整する旨の `_TODO_` を残した。
- 「11. 本格実行開始の GO / Not GO 判断」に `公開適性` 行を追加した。rulebook 6.11 は「目的整合、公開適性、予算枠、体制、品質」の 5 観点を明記しているが、雛形は `公開適性` が欠落しており、完成版憲章・sample のいずれも 5 観点を備えていたため、rulebook 本文に合わせて修正した。
- `npx prettier --write` と `npx markdownlint` を実行し、整形・静的検査のエラーがないことを確認した。

## 2. 変更ファイル

- `docs/ja/specdojo/templates/prj-charter-template.md`
- `docs/ja/projects/prj-0001/030-project-management/execution/exec/results/T-LAUNCH-prj-charter-130-result.md`

## 3. 申し送り

- 「10. 後続で作成・詳細化する文書」の固定文書一覧は、完成版憲章と sample という同一系統の 2 例（sample は完成版憲章を参照して整合させたもの）から得た根拠であり、独立した複数プロジェクトでの再現は未確認である。他プロジェクトの憲章実績が増えた際に、文書一覧の過不足を再確認するとよい。
- 「2. 認可対象」の `認可条件` 行は rulebook 6.2 で「追加してよい」と任意扱いのため、雛形では `_TODO_` で削除可否を明示した。今後 rulebook 側で必須化する判断があれば、雛形の表現も合わせて見直す。

## 4. 参考資料の活用

- `approach: template-maintenance` に従い、参照の向きを「成果物 → template」に切り替え、見直し対象を `docs/ja/specdojo/templates/prj-charter-template.md` とした。
- 根拠として、完成版 [[prj-0001:prj-charter|プロジェクト憲章]]（`status: draft` だが全 13 章が rulebook 構成と一致し review 済み）、review result [[prj-0001:xrr-t-launch-prj-charter-090|T-LAUNCH-prj-charter-090]]（recommendation: approve、findings なし）、[[prj-charter-sample]]（sample-maintenance タスク [[prj-0001:xer-t-launch-prj-charter-120|T-LAUNCH-prj-charter-120]] で完成版憲章に合わせて最終調整済み）、[[prj-charter-rulebook]]（5 章「本文構成」、6.2/6.8/6.11 の記述ガイド）、[[prj-charter-recipe]] を実際に読み込んで比較した。
- rulebook 5 章の本文構成（13 章の見出し・順序）と template の見出し構成は一致しており、章構成自体の変更は不要と判断した。
- 表内容の見直しは、(a) rulebook 本文の明示的な記述（6.8 の PO 承認事項 5 区分、6.11 の判断観点 5 区分）、(b) 完成版憲章と sample の双方で再現していた共通記述（「10. 後続で作成・詳細化する文書」の文書一覧、「2. 認可対象」の `認可条件` 行）の 2 種類の根拠がある箇所に限定し、いずれか一方のみでしか確認できない箇所（例: 「3. プロジェクトの目的」「6. ハイレベル成功基準」の具体的な観点ラベルはプロジェクトごとに異なっていた）は、成果物固有の内容と判断し雛形へ持ち込まなかった。
- rulebook・recipe・sample・template・completed deliverable の間で、構造・必須項目・禁止事項に関する矛盾は検出されなかった。「11. 本格実行開始の GO / Not GO 判断」の `公開適性` 欠落は、template が rulebook 本文の記述から外れていた箇所であり、rulebook を正として template 側を修正した。
