---
specdojo:
  id: prj-0001:xer-pjr-x05n-20261115t143259z-70a6832b
  type: exec-result
  task_id: PJR-X05N
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-X05N/pjr-x05n-20261115T143259Z-70a6832b/plan.md
  started_at: "2026-11-15T14:33:05.643Z"
  completed_at: "2026-11-15T16:44:14.301Z"
  agent: opus-executor
  block_reason: "agent exited with non-zero code: parent validation failed: test-integration"
---

# Edit Result

## 1. 実施内容

- kata-wave-2 の review において、型の自動 grade が実行されなかった原因を特定し修正した。
- 原因は、`schedule_file`（`schedule` ディレクトリ相対）の探索において、リポジトリルートを基準に検索していたため strategy が見つからず、型の評価対象が空になっていたことだった。
- `src/exec/review-kata.ts` を修正し、`projectId` からプロジェクト設定の `schedule` ディレクトリを基準に探索を行うように変更した。また、呼び出し元 3 か所から `projectId` を明示的に渡すように変更し、型安全性を高めた。
- 修正を検証するため、実際と同じ配置の fixture を用いた回帰テストを `tests/src/exec/review-kata.test.ts` に追加した。

## 2. 変更ファイル

- `src/exec/plans-generation.ts`: `src/exec/review-kata.ts` の変更に伴い、`projectId` を引き回すための変更。
- `src/exec/review-kata.ts`: `schedule_file` の探索ロジックを、リポジトリルート基準からプロジェクトの `schedule` ディレクトリ基準に変更。また、引数に `projectId` を追加。
- `src/exec/run/schedule-prepare.ts`: `src/exec/review-kata.ts` の変更に伴い、`projectId` を渡すための変更。
- `tests/src/exec/review-kata.test.ts`: kata-wave-2 と同様のディレクトリ構成を持つ fixture を用いた、strategy 探索の回帰テストを追加。

## 3. 申し送り

- 原因: `scheduleKataReviewSubjects` は `schedule_file` の置き場所を基準に strategy を探していた。ready / cpm の `schedule_file` は schedule ディレクトリ相対（例: `sch-track-kata-wave-2.yaml`）のため、リポジトリルートを探して見つからず、型の評価対象が空になった。intent・approach の条件や grade の失敗の握りつぶしが原因ではない。
- 判断: schedule のパスを呼び出し元ごとに引き回さず、`projectId` から設定（`getProjectSchedulePath`）を読んで探すようにした。plan 生成は schedule のパスを持たず、呼び出し元 3 か所はすべて `projectId` を持つため。引数は省略できないようにし、渡し忘れを型検査で見つけられるようにした。絶対パスと cwd 相対のパスも候補に残した。
- 次のアクション: kata-wave-2 の型 4 組（bac・bds・sld・ifx-file の rulebook・sample）の grade は 2026-10 のまま。修正後の review か `grade run --target kata` で流し直す必要がある。
- CHANGELOG に書く事項: 不具合修正。型を整備する schedule（`bootstrap-kata-set`・`improve-kata`）の review で、型一式の自動 grade と完了判定の制限が働かなかった問題を直した（strategy ファイルを作業ディレクトリ基準で探していたため）。

## 4. 進め方

原因の調査として、`schedule_file` の探索ロジックを確認したところ、リポジトリルートを基準に strategy を探していることが判明した。これにより、`schedule` ディレクトリ内の相対パスで定義されている strategy が見つからず、評価対象が空になっていた。これを解消するため、`projectId` からプロジェクト固有の `schedule` パスを取得して探索するよう `src/exec/review-kata.ts` を修正した。また、修正が正しいことを保証するために、実際のディレクトリ構成を模した回帰テストを `tests/src/exec/review-kata.test.ts` に実装した。
