---
specdojo:
  id: prj-0001:xer-pjr-eakn-20261105t105903z-7f2f279a
  type: exec-result
  task_id: PJR-EAKN
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-EAKN/20261105T105903818Z-b4bd01fa/plan.md
  started_at: "2026-11-05T10:59:09.394Z"
  completed_at: "2026-11-05T11:08:34.588Z"
  agent: sol-executor
  approach: rulebook-maintenance
  targets:
    - specdojo:stsd-mermaid-rulebook
---

# Edit Result

## 1. 実施内容

- stsd-mermaid-rulebook を更新し、図を分割した際の初期点の扱いに関する規則を追加した。
- 分割したそれぞれの図に対象の図へ初期点を置くか、あるいは特定の図へ置くかのルールを明文化した。
- 終了点を置かない境界の書き方については、先に stsd-rulebook に追加された内容と整合させるため、同書を参照する形式とした。
- 更新後の `stsd-task-execution` の図構成（通常系への開始遷移の配置と、例外系における共有状態による接続）が、追加した規則に適合していることを確認した。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/stsd-mermaid-rulebook.md`: 図を分割した際の、分割された各図における初期点の配置ルール（開始遷移を含む図への配置、および共有状態から始まる図への配置）の記述を追加した。

## 3. 申し送り

- reporter は result の「進め方と実践の型の適用」に記録してください。根拠は両 STSD rulebook、rulebook 記述標準、共通レビュー観点 `vp-arc-concisen-ness`、関連 recipe・sample・template、PJR-Q9AW・PJR-KBS6 の個票と実行結果、既存 STSD の分割例です。開始遷移を含む図へ初期点を配置し、共有状態から続く図には配置しない規則を追加しました。全図をつないで到達性と終端を判定し、終了点の要否・省略時の概要の記述は PJR-KBS6 で整備した `stsd-rulebook` を正本として参照します。
- `stsd-task-execution` の通常系には開始遷移 T-01・T-14 が各一度だけあり、例外系は初期点を持たず同名・同 ID の共有状態で接続されています。全16遷移・全6状態を両図でたどれ、完了には差し戻し遷移、中止には出力遷移がありません。概要に到達点と管理継続の理由があり、追加規則との相違はありません。この確認結果と判断根拠は PJR-EAKN 個票の対応結果にも記録済みです。
- executor が変更した追跡対象は `docs/ja/specdojo/rulebooks/stsd-mermaid-rulebook.md` と PJR-EAKN 個票の対応結果のみです。開始時から存在した登録簿イベント・evidence は未編集です。`lint:md`・`lint:fm` 等の指定済み親検証は重複実行していません。
- reporter は result の「進め方と実践の型の適用」に記録してください。根拠は両 STSD rulebook、rulebook 記述標準、共通レビュー観点 `vp-arc-conciseness`、関連 recipe・sample・template、PJR-Q9AW・PJR-KBS6 の個票と実行結果、既存 STSD の分割例です。開始遷移を含む図へ初期点を配置し、共有状態から続く図には配置しない規則を追加しました。全図をつないで到達性と終端を判定し、終了点の要否・省略時の概要の記述は PJR-KBS6 で整備した `stsd-rulebook` を正本として参照します。
- 適用外の検証: `npm run validate:schema:file`（executor の変更は Markdown のみで、YAML ファイルを変更していない。）

## 4. 進め方と実践の型の適用

対象の rulebook である `docs/ja/specdojo/rulebooks/stsd-mermaid-rulebook.md` を読み込み、図の分割に関する規則を拡張した。具体的には、PJR-Q9AW で行われた図の分割（通常系と例外系への分離）に対応するため、分割された各図における初期点の扱い（開始遷移を含む図に置くか、あるいは共有状態として扱うか）を明文化した。また、終了点の扱いについては `docs/ja/specdojo/rulebooks/stsd-rulebook.md` との整合性を保つため、同書を参照する設計とした。最後に、既存の `stsd-task-execution` の図がこの新しい規則に適合していることを検証した。
