---
specdojo:
  id: prj-0001:xer-pjr-w63q-20261115t172254z-34574d44
  type: exec-result
  task_id: PJR-W63Q
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-W63Q/pjr-w63q-20261115T172254Z-34574d44/plan.md
  started_at: "2026-11-15T17:23:08.688Z"
  completed_at: "2026-11-15T18:07:05.720Z"
  agent: opus-executor
  approach: fully-guided
  targets:
    - bac-task-completion
---

# Edit Result

## 1. 実施内容

- bac-task-completion に BAC-01〜09 ごとの実装（`evidence_refs`）・設計の文書（stsd-task-execution・stsd-register-entry・stsd-deliverable・cdsd-execution）・ARC の確認状況の対応表を追加。メモ / 将来課題の `_TODO_` 2 件は期限付きの留保に改め、追跡先列と設計の確認待ちの留保行を追加した。個票の対応結果も記入。status は draft のまま。grade run --target deliverable による再評価はまだ行っていない。

## 2. 変更ファイル

- `docs/ja/product/050-business-acceptance-criteria/bac-task-completion.md`: 変更、+21 / -4 行

## 3. 申し送り

- `grade run --target deliverable` による再評価はまだ行っていない。個票はこれを完了条件としているので、runner または orchestrator が実行し、結果を PJR-W63Q の対応結果に追記する。
- 決めたこと: 設計・実装の対応はシナリオごとの節に分散させず、受入条件の共通前提の後に 1 つの表にまとめた（同じ参照の繰り返しを避けるため）。
- 決めたこと: 実装の参照は `evidence_refs`（src/grade/grade.ts・src/exec/run/run.ts）の範囲に限った。PJR-M18B で対応済みの review 前の grade の鮮度の扱いは範囲外の実装なので、BAC-07 は「確認待ち」とした。
- 決めたこと: 評価結果を扱う cdsd・stsd がないので、BAC-01〜04・08 には「評価結果の設計の文書なし」と明記した。cdsd-execution の `_TODO_`（plan / result / evidence のデータストアの追加）とつながる論点である。
- 決めたこと: 代表試行と費用・作業時間の上限は本書では決められないので、期限付きの留保（業務受入の試行の前に解消する）とし、追跡先は 140 の確定時に PO が判断する PJR-TN43 の kata-wave-2 の行とした。留保の可否は PO が 140 で判断する。
- 次のアクション: 「確認待ち」の条件（BAC-02 の Kata 変化の検出、BAC-03・04・08、BAC-06・07・09 の一部）は、業務受入の試行の前に ARC が照合する。不足は BA が PM へ PJR 登録候補として渡し、登録したら bac-task-completion の「メモ / 将来課題」の追跡先に個票を追記する。
- 参照範囲: 個票の完了条件が cdsd・stsd への参照を求めるため、plan で宣言されていない設計の文書（stsd-task-execution・stsd-register-entry・stsd-deliverable・cdsd-execution）と、`evidence_refs` が再エクスポートするモジュール（src/grade/target-discovery.ts など）を読み取り専用で参照した。

## 4. 進め方と実践の型の適用

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
