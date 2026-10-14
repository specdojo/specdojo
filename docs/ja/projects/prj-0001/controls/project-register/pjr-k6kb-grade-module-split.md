---
specdojo:
  id: prj-0001:pjr-k6kb-grade-module-split
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  owner: DEV
  registered_at: "2026-10-02T12:14:32Z"
---

# PJR-K6KB grade.ts の責務ごとの分割

## 1. 概要

src/grade.ts（3,561 行）を CLI の登録・対象の探索・plan の生成・適用の責務ごとに分ける。動作は変えない（v0.3.0 の公開後）

## 2. 完了条件

リファクタリングの段取り（2026-10-14、利用者が承認）の段 3。対象は `src/grade.ts`（2026-10-14 時点で 4,110 行）である。

対象の責務と宣言（2026-10-14 時点の名前。行数は目安）:

- grade の値の扱い: 直列化（`serializeGrade` など）と finding の挿入（`insertFindings` など）。ファイルの先頭から約 800 行。
- 対象の探索: `loadDeliverableCatalog`、`discoverGradeTargets`、`matchesParsedGradeTargetFilters` と、pipeline の状態（`parseGradePipelineState`、`recordGradePipelineStage`）。約 830 行。
- plan の生成: `deterministicResults`、`gradePlanEmbedding`、`renderGradePlanWithEmbedding`、`renderGradeReporterPlan`、`writeGradePlans`。約 640 行。
- 提出の検証と適用: `parseGradeExecutorAnalysis`、`doneCriteriaFidelityIssues`、`convertGradeExecutorOutput`、`validateGradeReporterFidelity`、`validateDoneCriteriaInput`、`validateGradeSubmission`、`scoreDocument`、`applyGradeSubmission`。約 930 行。
- Markdown の grade と移行: `gradeMarkdownDocument`、`migrateInlineGrades`。約 300 行。
- コマンドの登録: `registerGradeCommand`（608 行、10 のサブコマンド）。サブコマンドごと、または関係の深い組ごとのモジュールへ分ける。

条件:

- 上の責務ごとのモジュールへ移す。ファイル名は既存の `src/grade-result.ts` に揃え、`grade-` で始める。
- 移すだけにし、ロジックは変えない。分割の途中で不具合や改善点を見つけても直さず、result に書く。
- `src/grade.ts` が現在 export しているものは、すべて同じ名前で `src/grade.ts` から import できる（移した先から再 export する）。既存のテストは import のパスを含めて変更せずに通る。テストの追加は妨げない。
- `registerGradeCommand` は `src/grade.ts` から引き続き export し、各モジュールの登録関数を呼ぶだけの関数にする（目安 150 行以下）。
- 分割の前後で、`grade` とその全サブコマンドの `--help` の出力が一致する。前後の出力を `tmp/` に保存して比べ、比べたコマンドの一覧と差分がないことを result に記録する。
- 新しく作るモジュールはそれぞれ 1,000 行以下とする。新しい循環 import を作らず、移した先のモジュールから `src/grade.ts` を import しない。
- モジュールの構成に触れている設計書があれば更新する。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。

## 3. 作業内容

| No  | 作業                                                                | 担当 | 状態 | メモ                     |
| --- | ------------------------------------------------------------------- | ---- | ---- | ------------------------ |
| 1   | 分割の前の `--help` の出力を `tmp/` に保存する                      | DEV  | done | `grade` と全サブコマンド |
| 2   | 責務ごとのモジュールへ移し、`src/grade.ts` から再 export する       | DEV  | done | 12 モジュールへ分割      |
| 3   | 分割の後の `--help` の出力と比べ、テストと検証を通す                | DEV  | done | 差分なし                 |
| 4   | result に、移したものの対応表と残った行数、見つけた改善点を記録する | DEV  | open | reporter が記録する      |

## 4. 対応結果

`src/grade.ts` の公開 API を保ったまま、grade 値、対象探索、pipeline 状態、plan 生成、提出の検証と適用、Markdown grade、CLI 登録を `grade-` で始まる責務別モジュールへ移した。`registerGradeCommand` は各 CLI 登録モジュールを順に呼ぶ 22 行の入口とした。新規モジュールは最大 915 行で、循環 import はない。

分割前後の `grade` と全 9 サブコマンドの `--help` を比較し、差分がないことを確認した。移動対象の名前付き関数 124 件は、空白を除いた関数本体が分割前と一致した。親 runner が lint、型検査、単体・統合テスト、schema 検証を実行する。分割中に、別タスクで対応すべき不具合や改善点は見つからなかった。

## 5. 関連ドキュメント

- [[prj-0001:pjr-qcmp-register-commands-split]]: 段 2。共通の完了条件を試した。
- [[prj-0001:pjr-th4b-eslint-max-lines-guard]]: 分割後の行数の上限。
