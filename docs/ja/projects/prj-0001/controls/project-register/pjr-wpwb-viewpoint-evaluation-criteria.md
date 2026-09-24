---
specdojo:
  id: prj-0001:pjr-wpwb-viewpoint-evaluation-criteria
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: ARC
  registered_at: "2026-09-24T22:41:24Z"
  due_on: "2026-10-31"
---

# PJR-WPWB 観点の evaluation の区分基準を定義し、名前と割り当てを揃える

## 1. 概要

viewpoint の `evaluation`（`deterministic` / `agent` / `human`）は、**軸が混在し、値の名前が実態と合っていない**。区分の基準そのものが文書化されていないため、基準の定義・命名・現在の割り当ての再確認を一体で行う。

### 1.1. 名前が実態と合っていない

`agent` と `human` は実行主体の名前だが、**実行主体を区別していない**。review フェーズは agent が実行する（`claude-review-executor`、`codex-review-executor`、`agy-expert-review-executor`、`opencode-review-executor`）。`xrp-*` は agent へ渡す review plan であり、`evaluation: human` の観点も agent が判定している。

さらに値が他フィールドと衝突する。

| 値      | 他フィールドでの意味                                                               |
| ------- | ---------------------------------------------------------------------------------- |
| `agent` | `member.type: agent`（AI のメンバー）、`task.execution: agent`（agent が実行する） |
| `human` | `task.execution: human`（**実際に人が実行する**）                                  |

`task.execution` の `human` は正しい用法である。同じ語が別の意味を持つため、読み手は必ず誤解する。実際に [[prj-0001:pjr-2zvs-grade-review-integration]] の決定 3.1 は「`human` 観点は review のレビュア（人）が判定する」と誤って書かれ、grade の対象選択の基準も `continuous` ではなく `evaluation` と誤って据えられた。

`deterministic` は問題ない。他フィールドの enum 値と衝突せず、job の説明で使われる「決定論的コマンド」と意味も一致する。

### 1.2. 当初案の contextual は実態と合わない

当初は「`human` = 文書外の文脈を要する」と解釈し `contextual` を候補とした。しかし 16 観点の `evidence` を確認したところ、**すべて文書内の記述を指していた**。

| 観点                              | evidence                                                           |
| --------------------------------- | ------------------------------------------------------------------ |
| `vp-po-purpose-alignment`         | プロジェクト概要の目的・必要性、成果物固有の目的、上位根拠との対応 |
| `vp-dev-implementation-readiness` | 設定項目、schema、入力、出力、制約、作業対象ファイル               |
| `vp-dev-testability`              | 検証コマンド、期待結果、対象ファイル、エラー時対応                 |
| `vp-ops-agent-boundary`           | owner、reviewer、approver、agent_mode、manual gate                 |

文書外の文脈を要求する evidence は 1 つもない。`vp-dev-testability`（検証コマンドと期待結果が書かれているか）や `vp-po-publication-accountability`（status、承認責任の記述）は、記述の有無の確認であり機械的に照合できそうである。にもかかわらず `human` になっている。

**区分の基準が定義されていない**ため、現在の割り当てが正しいかを判定できない。

### 1.3. 観測されるパターン

role と category の分布には規則性がある。

| `evaluation`    | 件数 | role                                  | category                                                                                     |
| --------------- | ---- | ------------------------------------- | -------------------------------------------------------------------------------------------- |
| `deterministic` | 2    | ARC 1、QE 1                           | architecture、quality                                                                        |
| `agent`         | 10   | ARC 3、QE 4、UX 3                     | consistency 2、usability 4、architecture 1、quality 3                                        |
| `human`         | 16   | PO 3、PM 3、BA 3、ARC 1、DEV 3、OPS 3 | purpose 2、operations 4、planning 3、business 3、architecture 1、implementation 2、quality 1 |

`agent` は ARC / QE / UX、つまり**文書そのものの品質**を見る観点に集まる。`human` は PO / PM / BA / DEV / OPS、つまり**約束や責任を伴う判断**（承認、計画、要件、実装の見通し、リリース可否）に集まる。

## 2. 完了条件

- `evaluation` の区分基準が文書化され、新しい観点を追加する人が自分で判定できる。基準は 1 つの軸で表現されている。
- 基準に沿った 3 値の名前が決まっている。他フィールドの enum 値（`member.type`、`task.execution`）と衝突しない。
- 現在の 28 観点の割り当てを基準に照らして確認し、変更が必要なものを特定している。変更する場合は理由を記録する。
- 割り当ての変更が `continuous` に及ぶ場合、grade の対象範囲と夜間実行のコストへの影響を見積もっている。
- `pm-review-viewpoints.schema.yaml` の enum と description が更新されている。
- `docs/ja/specdojo/defaults/pm-review-viewpoints.yaml` の 28 観点が追従している。
- `src/grade.ts` の `continuousViewpoints()` / `agentViewpoints()` / `deterministicResults()` が追従している。
- `task.execution` の `human` は変更しない。
- 旧値を読み込んだ場合、新値を示すエラーで失敗する。黙って無視しない。
- 関連する rulebook・standard・guide の記述が追従している。
- `npm run check` が通過している。

## 3. 基準の候補

| 候補 | 軸                     | 判定の目安                                                                           |
| ---- | ---------------------- | ------------------------------------------------------------------------------------ |
| A    | 判定に必要な根拠の所在 | 文書内にあるか、文書外か。**調査で否定された**（`human` の evidence もすべて文書内） |
| B    | 判断の性質             | 記述の有無・整合の照合か、価値の判断か                                               |
| C    | 判断が伴う責任         | 約束・承認・公開の可否を左右するか。`role` と `category` の分布に合う                |
| D    | 自動判定の信頼度       | agent に任せて実務上使える精度が出るか                                               |

C が現在の割り当てを最もよく説明する。ただし「責任」を基準にすると、責任の所在が変われば分類も変わるため、観点の定義としては不安定になりうる。B と C の組み合わせが妥当かもしれない。

命名は基準の確定後に決める。`deterministic` は維持し、残る 2 値を基準に沿って命名する。

## 4. 進め方

基準の定義と命名を先に確定し、その結果として割り当ての変更が何件になるかを見てから実装へ移る。割り当ての変更が多数に及ぶ場合は、命名の変更と再分類を別の版へ分けることを検討する。

[[prj-0001:pjr-xtan-unify-verdict-vocabulary]] と同じファイルと schema の enum を変えるため、**0.3.0 にまとめて移行を 1 回で済ませる**。

## 5. 関連ドキュメント

- [[prj-0001:pjr-2zvs-grade-review-integration]]
- [[prj-0001:pjr-xtan-unify-verdict-vocabulary]]
- `docs/ja/specdojo/defaults/pm-review-viewpoints.yaml`
- `docs/specdojo/schemas/v1/pm-review-viewpoints.schema.yaml`
- `src/grade.ts`
