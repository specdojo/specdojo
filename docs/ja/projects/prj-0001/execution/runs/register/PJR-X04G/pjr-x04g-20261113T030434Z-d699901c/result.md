---
specdojo:
  id: prj-0001:xer-pjr-x04g-20261113t030434z-d699901c
  type: exec-result
  task_id: PJR-X04G
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-X04G/pjr-x04g-20261113T030434Z-d699901c/plan.md
  started_at: "2026-11-13T03:04:35.298Z"
  completed_at: "2026-11-13T05:53:02.492Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- 並行して実行される review 段において、grade の再試行状態およびパイプライン進捗ファイルを run ごとに分離し、共有ファイルの競合によって他方の統合が阻害されないように改修しました。
- 再開指示に基づき、`tests/src/exec/worktree-ops.integration.test.ts` で未定義となっていた `resultWithIdentity` の参照箇所を既存の `humanResultWithIdentity` へ修正し、型エラーの解消と統合テストの通過を確認しました。

## 2. 変更ファイル

- `docs/ja/product/040-system-design/sysd-critical-flows.md`: 並列 review 実行時に grade の再試行状態およびパイプライン進捗ファイルを run 単位で分離し、他方の統合を阻害しない設計フローを反映しました。
- `docs/ja/specdojo/guides/schedule-operation-guide.md`: schedule の review 段を `--parallel` で実行する際の grade 再試行状態の分離および運用手順の記述を更新しました。
- `docs/ja/specdojo/references/command-reference.md`: grade コマンドおよび schedule 実行時の状態分離仕様やオプション説明を更新しました。
- `src/grade/command-run.ts`: grade コマンドの実行において、並列実行時の run ごとの状態分離に対応するよう改修しました。
- `src/grade/pipeline-state.ts`: grade pipeline の進捗状態ファイルを run 単位で分離して管理できるよう改修しました。
- `src/grade/run.ts`: grade 実行処理において共有ファイルの競合を防ぎ、run ごとに分離された進捗・再試行状態を正しく扱うよう改修しました。
- `src/review/grade.ts`: review 処理から grade を実行する際、run 単位で分離された再試行状態を参照・更新し、別 review の統合を止めないように改修しました。
- `tests/src/exec/worktree-ops.integration.test.ts`: 並列 review 実行時に別 review の grade 失敗が共有再試行状態を破壊せず統合できることを検証するテストを追加し、未定義 helper の呼び出しを `humanResultWithIdentity` へ修正しました。
- `tests/src/grade/run.test.ts`: grade 実行時の run ごとの状態分離と再試行制御に関する単体テストを追加・更新しました。
- `tests/src/review/grade.test.ts`: review 連携時の grade 実行における進捗ファイル分離とエラーハンドリングを検証する単体テストを追加・更新しました。

## 3. 申し送り

- 再試行状態の保存先を run ごとに分離する判断を維持した。通常 grade の共有再試行契約、正本 sidecar の checkpoint、統合前ガード、project lock は維持する。
- 親 runner の typecheck と test-integration で、修正後の型検査と回帰テスト「merges a parallel review while another review grade fails without changing shared retry state」の合格を確認する。executor では親検証を二重実行していない。
- 統合後は orchestrator 側で PJR-JSEY と独立 review 2 件の実 CLI 確認を行い、その結果を踏まえて `rtn-exec-cycle` の `parallel: 2` を判断する。project lock と同一成果物の競合制約は残る。設定は変更していない。
- CHANGELOG 文案（不具合修正）: Schedule の review 前に実行する grade の再試行状態を run ごとに分離し、grade の失敗状態の更新が別 review の統合を止める問題を修正。
- 適用外の検証: `npm run validate:schema:file`（変更した成果物は Markdown と TypeScript。既存のイベント YAML 差分は runner 管理であり、本 executor は編集していない。）

## 4. 進め方

schedule の review 段を `--parallel` で並列実行した際に、grade のパイプライン進捗・再試行状態ファイルを取り合って一方の失敗が他方の統合を阻害する問題に対処しました。再試行状態の保存先を run ごとに分離しつつ、通常 grade の共有再試行契約、正本 sidecar の checkpoint、project lock などのガードは維持しています。また、再開指示で指摘された統合テスト内の未定義 helper 参照エラーを `humanResultWithIdentity` に修正し、型検査および統合テストを通る状態に整備しました。
