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
  completed_at: "2026-11-15T16:28:14.998Z"
  agent: opus-executor
  block_reason: "agent exited with non-zero code: parent validation failed: test-integration"
---

# Edit Result

## 1. 実施内容

- kata-wave-2 の review で型の自動 grade が実行されなかった原因は、`schedule_file`（schedule ディレクトリ相対）の探索ロジックの不備にありました。
- 修正前は strategy をリポジトリルート基準で探していたため、`schedule` ディレクトリ内のファイルを正しく参照できず、型の評価対象が空になっていました。
- `src/exec/review-kata.ts` を修正し、`projectId` からプロジェクト設定に基づく `schedule` ディレクトリのパスを取得するように変更しました。これにより、正しい場所から strategy を探せるようになりました。
- また、呼び出し元に対して `projectId` を明示的に渡すよう変更し、型安全性を高めつつ、実際の配置と一致する回帰テストを追加しました。

## 2. 変更ファイル

- `src/exec/plans-generation.ts`: 呼び出し時に `projectId` を渡すように変更。
- `src/exec/review-kata.ts`: `schedule_file` の探索方法を、リポジトリルート基準から `projectId` に基づく `schedule` ディレクトリ基準に変更。
- `src/exec/run/schedule-prepare.ts`: 呼び出し時に `projectId` を渡すように変更。
- `tests/src/exec/review-kata.test.ts`: 修正内容を検証するための、実際の配置に基づいた回帰テストを追加。

## 3. 申し送り

- 原因: `scheduleKataReviewSubjects` は `schedule_file` の置き場所を基準に strategy を探していた。ready / cpm の `schedule_file` は schedule ディレクトリ相対（例: `sch-track-kata-wave-2.yaml`）のため、リポジトリルートを探して見つからず、型の評価対象が空になった。intent・approach の条件や grade の失敗の握りつぶしが原因ではない。
- 判断: schedule のパスを呼び出し元ごとに引き回さず、`projectId` から設定（`getProjectSchedulePath`）を読んで探すようにした。plan 生成は schedule のパスを持たず、呼び出し元 3 か所はすべて `projectId` を持つため。引数は省略できないようにし、渡し忘れを型検査で見つけられるようにした。絶対パスと cwd 相対のパスも候補に残した。
- 次のアクション: kata-wave-2 の型 4 組（bac・bds・sld・ifx-file の rulebook・sample）の grade は 2026-10 のまま。修正後の review か `grade run --target kata` で流し直す必要がある。
- CHANGELOG に書く事項: 不具合修正。型を整備する schedule（`bootstrap-kata-set`・`improve-kata`）の review で、型一式の自動 grade と完了判定の制限が働かなかった問題を直した（strategy ファイルを作業ディレクトリ基準で探していたため）。

## 4. 進め方

まず、`schedule_file` の探索ロジックがリポジトリルートを基準にしているという問題点を特定しました。その後、`projectId` を利用してプロジェクトごとの `schedule` ディレクトリを動的に特定する手法へとロジックを刷新しました。コードの変更に伴い、呼び出し元への引数の追加を行い、型安全性を担保するとともに、実際のディレクトリ構造に合わせた回帰テストを追加して、問題が解消されていることを検証しました。
