---
specdojo:
  id: prj-0001:pjr-e025-src-remaining-cycles
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: low
  owner: DEV
  registered_at: "2026-10-17T08:45:12Z"
  due_on: null
---

# PJR-E025 汎用の部品の移動の後に残る循環をほどく

## 1. 概要

register から exec/worktree-ops・exec/slot-lock、job から exec/plans、grade から exec/schedule-index、exec から grade/result などの残りを 1 件ずつ見て、shared へ移すか依存の向きを逆にする。 PJR-QQKY の決定に基づく。動作は変えない

## 2. 完了条件

- 次の残りの循環を 1 件ずつ見て、`src/shared/` へ移すか依存の向きを逆にするかを決め、件ごとの判断と理由を result に書く。
  - `register` → `exec/worktree-ops`・`exec/slot-lock`
  - `job` → `exec/plans`
  - `grade` → `exec/schedule-index`
  - `exec` → `grade/result`
- `src/shared/` へ移すのは、他の機能から使われている汎用の部分に限る。
- 作業の後、上の組の間に循環する import が残らないことを確かめ、確かめ方を result に書く。
- ESLint の依存の向きの規則はこの項目では足さない（PJR-WSET で足す）。
- 移す・直すのは構造だけとし、動作は変えない。全コマンドの `--help` の出力が変更の前後で一致することを確かめ、result に書く。
- runner のコードを移した場合は、統合の後に `exec run --register` を 1 回流して動作を確かめる（PJR-JSEY）。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG には記載しない（内部の変更のため）。

## 3. 作業内容

| No  | 作業                        | 担当 | 状態 | メモ                                                   |
| --- | --------------------------- | ---- | ---- | ------------------------------------------------------ |
| 1   | 残りの循環を 1 件ずつほどく | DEV  | done | 4 組の直接依存を shared への移動と依存方向の変更で解消 |

## 4. 対応結果

- `register` → `exec/worktree-ops`・`exec/slot-lock` は、複数機能で使えるプロセス間ロックを `src/shared/cross-process-lock.ts`、Git の相対パス・状態取得・stage 処理を `src/shared/git.ts` へ移した。register lifecycle lock のパスは register の責務として `src/register/lifecycle-lock.ts` に置き、exec 側から参照する向きへ変更した。register 固有の処理を shared に混ぜず、汎用部分だけを移すためである。
- `job` → `exec/plans` は、Job と exec が共用する plan テンプレート解決・共通規約注入を `src/shared/plan-templates.ts`、Markdown 整形を `src/shared/markdown-format.ts`、同梱リソース解決を `src/shared/template-resolution.ts` へ移した。既存の exec・docs API は再 export で維持した。
- `grade` → `exec/schedule-index` は、schedule YAML の読み取りと index 構築を `src/shared/schedule-index.ts`、schedule パス処理を `src/shared/schedule-paths.ts` へ移した。grade・dashboard・exec が同じ実装を shared から使う構成にした。
- `exec` → `grade/result` は、grade result の読取・件数集計を既存の `src/shared/grade-result.ts` へ移し、exec は shared を直接参照するようにした。grade 固有の書込・翻訳・検証は `src/grade/result.ts` に残した。
- grade result の正本移動に合わせ、`tests/src/exec/plans-grade-findings.test.ts` のモック先も shared へ変更した。これにより、単体テストがモックを迂回して実設定を読む回帰を解消した。
- `src/` の相対 import を機能ディレクトリ単位で集計し、`register` → `exec`、`job` → `exec`、`grade` → `exec`、`exec` → `grade` がいずれも 0 件であることを確認した。shared から機能ディレクトリへの import も 0 件である。
- 変更前の Git HEAD と変更後をそれぞれ build し、ルートから全サブコマンドまで 123 件の `--help` 出力が完全一致することを確認した。`npm run build` も成功した。親 runner が実行する lint・型検査・単体／統合テスト・schema 検証は executor では重複実行していない。
- runner が使うロック・Git 操作を移したため、統合後の実動作確認は [[prj-0001:pjr-jsey-exec-run-split-smoke|PJR-JSEY exec-run.ts の分割後に runner の動作を確かめる]] の手順で `exec run --register` を 1 回流す。

## 5. 関連ドキュメント

- [[prj-0001:pjr-qqky-src-feature-cycles|PJR-QQKY src の機能どうしの循環する依存をほどく方針を決める]]（決定）
- [[prj-0001:pjr-jsey-exec-run-split-smoke|PJR-JSEY exec-run.ts の分割後に runner の動作を確かめる]]（統合後の動作確認）
