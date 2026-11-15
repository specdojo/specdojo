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
  completed_at: "2026-11-15T14:58:50.912Z"
  agent: opus-executor
  block_reason: "parent validation failed: validate-schema"
---

# Edit Result

## 1. 実施内容

- kata-wave-2 の `review` において、型の自動 `grade` が実行されなかった原因を解消しました。
- 原因は、`schedule_file` の探索において、`schedule` ディレクトリからの相対パスではなくリポジトリルートを基準に strategy を探していたことによるものでした。
- `src/exec/review-kata.ts` を修正し、`projectId` を用いてプロジェクト設定から正しい `schedule` ディレクトリのパスを取得して探索するように変更しました。あわせて、呼び出し元から `projectId` を渡すように修正を行いました。
- 回帰テストとして、実際のディレクトリ配置を模した fixture と、`kata-wave-2` の構造を再現したテストケースを追加しました。

## 2. 変更ファイル

- `src/exec/plans-generation.ts`: `projectId` を引数に追加し、`review-kata` の呼び出しを修正しました。
- `src/exec/review-kata.ts`: `schedule_file` の探索ロジックを修正しました。リポジトリルートではなく、`projectId` から取得した `schedule` ディレクトリを基準に探索するように変更しました。
- `src/exec/run/schedule-prepare.ts`: `projectId` を引数に追加し、`review-kata` の呼び出しを修正しました。
- `tests/src/exec/review-kata.test.ts`: 修正後の挙動を確認するための回帰テストおよび fixture を追加しました。

## 3. 申し送り

- 原因: `scheduleKataReviewSubjects` は `schedule_file` の置き場所を基準に strategy を探していた。ready / cpm の `schedule_file` は `schedule` ディレクトリ相対（例: `sch-track-kata-wave-2.yaml`）のため、リポジトリルートを探して見つからず、型の評価対象が空になった。intent・approach の条件や grade の失敗の握りつぶしが原因ではない。
- 判断: `schedule` のパスを呼び出し元ごとに引き回さず、`projectId` から設定（`getProjectSchedulePath`）を読んで探すようにした。plan 生成は `schedule` のパスを持たず、呼び出し元 3 か所はすべて `projectId` を持つため。引数は省略できないようにし、渡し忘れを型検査で見つけられるようにした。絶対パスと cwd 相対のパスも候補に残した。
- 次のアクション: `kata-wave-2` の型 4 組（`bac`・`bds`・`sld`・`ifx-file` の `rulebook`・`sample`）の `grade` は 2026-10 のまま。修正後の `review` か `grade run --target kata` で流し直す必要がある。
- CHANGELOG に書く事項: 不具合修正。型を整備する `schedule`（`bootstrap-kata-set`・`improve-kata`）の `review` で、型一式の自動 `grade` と完了判定の制限が働かなかった問題を直した（strategy ファイルを作業ディレクトリ基準で探していたため）。
- 原因: `scheduleKataReviewSubjects` は `schedule_file` の置き場所を基準に strategy を探していた。ready / cpm の `schedule_file` は schedule ディレクトリ相対（例: `sch-track-kata-wave-2.yaml`）のため、リポジトリルートを探して見つからず、型の評価対象が空になった。intent・approach の条件や grade の失敗の握りつぶしが原因ではない。
- 判断: schedule のパスを呼び出し元ごとに引き回さず、`projectId` から設定（`getProjectSchedulePath`）を読んで探すようにした。plan 生成は schedule のパスを持たず、呼び出し元 3 か所はすべて `projectId` を持つため。引数は省略できないようにし、渡し忘れを型検査で見つけられるようにした。絶対パスと cwd 相対のパスも候補に残した。
- 次のアクション: kata-wave-2 の型 4 組（bac・bds・sld・ifx-file の rulebook・sample）の grade は 2026-10 のまま。修正後の review か `grade run --target kata` で流し直す必要がある。
- CHANGELOG に書く事項: 不具合修正。型を整備する schedule（`bootstrap-kata-set`・`improve-kata`）の review で、型一式の自動 grade と完了判定の制限が働かなかった問題を直した（strategy ファイルを作業ディレクトリ基準で探していたため）。

## 4. 進め方

`schedule_file` のパス解決の不備を特定しました。既存のコードでは、`schedule` ディレクトリ内に配置されているファイルをリポジトリルート基準で探していたため、strategy が見つからない問題が発生していました。このため、`projectId` を経由してプロジェクトごとの `schedule` ディレクトリの絶対パスを取得し、それを基準に探索を行うようロジックを修正しました。これにより、`kata-wave-2` 等の `schedule` 内にあるファイルを正しく参照できるようになります。
