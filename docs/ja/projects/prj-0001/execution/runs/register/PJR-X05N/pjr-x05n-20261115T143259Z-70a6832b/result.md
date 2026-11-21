---
specdojo:
  id: prj-0001:xer-pjr-x05n-20261115t143259z-70a6832b
  type: exec-result
  task_id: PJR-X05N
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-X05N/pjr-x05n-20261115T143259Z-70a6832b/plan.md
  started_at: "2026-11-15T14:33:05.643Z"
  completed_at: "2026-11-15T22:05:52.158Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- kata-wave-2 の review で型の自動 grade が流れなかった原因は、strategy の探し方だった。`schedule_file`（schedule ディレクトリ相対）の置き場所をリポジトリルートで探していたため strategy が見つからず、型の評価対象が空になっていた。プロジェクト設定の schedule ディレクトリを基準に探すよう `src/exec/review-kata.ts` を直し、呼び出し元 3 か所から `projectId` を渡すようにした。実際と同じ配置の fixture と kata-wave-2 と同じ形の回帰テストを足し、個票の対応結果を更新した。

## 2. 変更ファイル

- `src/exec/plans-generation.ts`: 変更、+1 / -1 行
- `src/exec/review-kata.ts`: 変更、+24 / -4 行
- `src/exec/run/schedule-prepare.ts`: 変更、+2 / -2 行
- `tests/src/exec/review-kata.test.ts`: 変更、+44 / -3 行

## 3. 申し送り

- 原因: `scheduleKataReviewSubjects` は `schedule_file` の置き場所を基準に strategy を探していた。ready / cpm の `schedule_file` は schedule ディレクトリ相対（例: `sch-track-kata-wave-2.yaml`）のため、リポジトリルートを探して見つからず、型の評価対象が空になった。intent・approach の条件や grade の失敗の握りつぶしが原因ではない。
- 判断: schedule のパスを呼び出し元ごとに引き回さず、`projectId` から設定（`getProjectSchedulePath`）を読んで探すようにした。plan 生成は schedule のパスを持たず、呼び出し元 3 か所はすべて `projectId` を持つため。引数は省略できないようにし、渡し忘れを型検査で見つけられるようにした。絶対パスと cwd 相対のパスも候補に残した。
- 次のアクション: kata-wave-2 の型 4 組（bac・bds・sld・ifx-file の rulebook・sample）の grade は 2026-10 のまま。修正後の review か `grade run --target kata` で流し直す必要がある。
- CHANGELOG に書く事項: 不具合修正。型を整備する schedule（`bootstrap-kata-set`・`improve-kata`）の review で、型一式の自動 grade と完了判定の制限が働かなかった問題を直した（strategy ファイルを作業ディレクトリ基準で探していたため）。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
