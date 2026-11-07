---
specdojo:
  id: prj-0001:xer-pjr-y29x-20261106t135913z-8f1c901b
  type: exec-result
  task_id: PJR-Y29X
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-Y29X/20261106T135913593Z-00fc2eea/plan.md
  started_at: "2026-11-06T13:59:24.560Z"
  completed_at: "2026-11-06T14:12:27.850Z"
  agent: sol-executor
  approach: retrofit
  targets:
    - prj-0001:stsd-job-run
---

# Edit Result

## 1. 実施内容

- stsd-job-run を新しい Kata に「部分反映」しました。
- 「目的」の章を整備し、状態の定義とともに「状態の判定」の章を新設して判定規則を整理しました。
- 状態遷移図の遷移ラベルに `T-&lt;nn&gt;` 形式の ID を付与し、図の直下に遷移説明の表を配置する構成に修正しました。
- 図のラベルと遷移表の ID を `T-01` から `T-07` まで欠番なく振り直し、既存の ID との対応を確認しました。
- 実装エビデンス `src/job/job.ts` および `src/job/definition.ts` に基づき、状態（running / succeeded / partial / failed / noop）と試行（attempt）の扱いを反映しました。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/020-data-model/stsd-job-run.md`: 新しい章立て（「目的」、「適用範囲」、「状態の判定」、「状態遷移」）への再構成、および状態遷移における遷移 ID ラベル（`T-01`〜`T-07`）の付与と遷移表の整備を行いました。

## 3. 申し送り

- reporter は個票の「5. 対応結果」を result へ反映すること。判断は部分反映。src/job/job.ts で新規開始、失敗・実行中からの試行追加、結果保存、既存結果返却、レビュー記録、checkpoint 更新を確認。src/job/definition.ts で5状態、試行の同じ状態型、不正・欠損状態の拒否、空の試行履歴の読み込みを確認し、互換の扱いを本文へ反映した。
- 図・表の順で再採番した結果、旧順と一致した。旧→新は T-01→T-01、T-02→T-02、T-03→T-03、T-04→T-04、T-05→T-05、T-06→T-06、T-07→T-07。削除・追加なし。個票にも記録済み。
- 検討メモ3件を維持。業務データ辞書 `prj-0001:bdd-job-run` は未作成で、状態選択・業務上の受入条件は確認不能。安全な再試行の責任・残留試行の確定方針も未決。結果保存は遷移元を制限しないが、結果訂正の承認根拠がないため図を維持した。BA・PO・ARC の合意後、文書への訂正遷移追加か実装の制限かを別タスクで決める。実装で解決済みとして削除できる項目はなく、理由を個票にも記録した。
- 指定2ファイル以外の呼出元の結果選択・排他制御は未調査。外部コマンド・agent 実行、Git 入力解決、保存障害の実行時検証は未実施。実装・他成果物・Kata・result は編集していない。Kata の修正提案なし。親 runner は指定された lint を含む親検証を実行し、その結果を追記すること。
- 適用外の検証: `npm run validate:schema:file`（executor の変更はMarkdown 2件のみで、YAMLファイルの変更がないため。）

## 4. 進め方と実践の型の適用

対象成果物 `docs/ja/product/010-business-specs/020-data-model/stsd-job-run.md` を、新しい Kata（章構成および状態遷移の記述ルール）に合わせて「部分反映」しました。実装エビデンスから Job Run の状態遷移および試行（attempt）の定義を読み取り、文書の内容を更新するとともに、図と表の整合性を確保するための ID 整備を行いました。
