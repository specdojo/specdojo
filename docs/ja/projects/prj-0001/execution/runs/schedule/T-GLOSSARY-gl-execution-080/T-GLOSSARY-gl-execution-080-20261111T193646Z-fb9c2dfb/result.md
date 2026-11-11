---
specdojo:
  id: prj-0001:xer-t-glossary-gl-execution-080-20261111t193646z-fb9c2dfb
  type: exec-result
  task_id: T-GLOSSARY-gl-execution-080
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-GLOSSARY-gl-execution-080/T-GLOSSARY-gl-execution-080-20261111T193646Z-fb9c2dfb/plan.md
  started_at: "2026-11-11T19:36:47.673Z"
  completed_at: "2026-11-11T19:47:50.268Z"
  agent: sol-executor
  execution: agent
  approach: condense
  targets:
    - gl-execution
  condense_records:
    - location: gl-execution.yaml 修正前107行、tm-worktree の notes「隔離実行に用い、」
      category: repetition
      action: delete
      reason: 隔離用途は同用語の定義にある作業分離の説明で示されるため削除。失敗時の成果・再開記録の保持と利用条件は残した。
      cause:
        type: document
    - location: gl-execution.yaml 修正前125行、tm-executor の notes「適用する実行方式を確認する」
      category: repetition
      action: delete
      reason: 実行方式ごとの担当範囲を直前の二文で明示しているため、確認を促す文言を削除。pipeline と単独 Job の責務の違いは保持した。
      cause:
        type: document
    - location: gl-execution.yaml 修正前143行、tm-execution-pipeline の notes「親検証は runner が実行し、」
      category: repetition
      action: delete
      reason: 親検証の実行主体は tm-parent-validation の定義にあるため重複を削除。親検証を `stages` の独立した段に記録しない制約は保持した。
      cause:
        type: document
    - location: gl-execution.yaml 修正前310行、tm-routine-action の notes「Job 出力の統合前レビューは Job 側で宣言し」
      category: repetition
      action: reference
      reason: 同文書の「ジョブ統合前レビュー宣言」への参照に置換。同用語に Job 側の宣言と起動元を問わない適用範囲があり、既存の関連用語も維持した。routine の `commit` が互換用途に限られる制約は残した。
      cause:
        type: document
    - location: gl-execution.yaml 修正前38〜39行、tm-task-state の definition・notes
      category: repetition
      action: retain
      reason: 定義は状態の概念、補足は各状態値と日本語の対応・導出方法を示す。CLI や設計の参照と文書成熟度との区別に必要なため保持した。
      cause:
        type: document
    - location: gl-execution.yaml 修正前116行・134行、tm-runner と tm-reporter の notes
      category: repetition
      action: retain
      reason: 証跡を正とする説明は重なるが、runner の事実管理責任と reporter の報告責任の境界を各用語で判断するために必要。報告生成の成功だけでは完了・統合成功にならない制約も保持した。
      cause:
        type: document
    - location: gl-execution.yaml 修正前236行、tm-job-input の notes
      category: canonical-restatement
      action: retain
      reason: 型と列挙値・整数範囲・checkpoint 引き継ぎの関係は用語を利用する条件の要約であり、schema の条件式の転載ではない。項目名と正本への参照を含めて保持した。
      cause:
        type: document
---

# Condense Result

## 1. 実施内容

- 用語集（実行） `gl-execution.yaml` の冗長さを整理しました。
- 具体的に、`tm-worktree`、`tm-executor`、`tm-execution-pipeline` の `notes` にあった重複記述を削除し、`tm-routine-action` の記述を既存の正本への参照に置換しました。
- 一方で、状態概念や責任境界、`schema` の利用条件要約など、設計上の判断に必要な情報は保持しています。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/060-glossary/gl-execution.yaml`: 冗長な記述の削除および参照置換を行い、定義・制約などの必須情報を維持したまま簡潔化しました。

## 3. 申し送り

- 適用外の検証: `npx markdownlint docs/ja/product/010-business-specs/060-glossary/gl-execution.yaml`（変更対象は YAML のみで、Markdown ファイルを変更していない。）
- 適用外の検証: `node --import tsx tools/catalog-validate-if-configured.mjs`（成果物の変更は docs/ja/product/ 配下のみで、docs/ja/projects/ 配下を変更していない。）
- 適用外の検証: `npm run validate:history-links`（履歴ファイル、plan、result を変更していない。）

## 4. 進め方と実践の型の適用

condense

## 5. 修正・保持の記録

| 場所（修正前） | 種類 | 直し方 | 残した理由／意味の維持 | 原因 |
| --- | --- | --- | --- | --- |
| `gl-execution.yaml 修正前107行、tm-worktree の notes「隔離実行に用い、」` | `repetition` | `delete` | `隔離用途は同用語の定義にある作業分離の説明で示されるため削除。失敗時の成果・再開記録の保持と利用条件は残した。` | `document` |
| `gl-execution.yaml 修正前125行、tm-executor の notes「適用する実行方式を確認する」` | `repetition` | `delete` | `実行方式ごとの担当範囲を直前の二文で明示しているため、確認を促す文言を削除。pipeline と単独 Job の責務の違いは保持した。` | `document` |
| `gl-execution.yaml 修正前143行、tm-execution-pipeline の notes「親検証は runner が実行し、」` | `repetition` | `delete` | ``親検証の実行主体は tm-parent-validation の定義にあるため重複を削除。親検証を `stages` の独立した段に記録しない制約は保持した。`` | `document` |
| `gl-execution.yaml 修正前310行、tm-routine-action の notes「Job 出力の統合前レビューは Job 側で宣言し」` | `repetition` | `reference` | ``同文書の「ジョブ統合前レビュー宣言」への参照に置換。同用語に Job 側の宣言と起動元を問わない適用範囲があり、既存の関連用語も維持した。routine の `commit` が互換用途に限られる制約は残した。`` | `document` |
| `gl-execution.yaml 修正前38〜39行、tm-task-state の definition・notes` | `repetition` | `retain` | `定義は状態の概念、補足は各状態値と日本語の対応・導出方法を示す。CLI や設計の参照と文書成熟度との区別に必要なため保持した。` | `document` |
| `gl-execution.yaml 修正前116行・134行、tm-runner と tm-reporter の notes` | `repetition` | `retain` | `証跡を正とする説明は重なるが、runner の事実管理責任と reporter の報告責任の境界を各用語で判断するために必要。報告生成の成功だけでは完了・統合成功にならない制約も保持した。` | `document` |
| `gl-execution.yaml 修正前236行、tm-job-input の notes` | `canonical-restatement` | `retain` | `型と列挙値・整数範囲・checkpoint 引き継ぎの関係は用語を利用する条件の要約であり、schema の条件式の転載ではない。項目名と正本への参照を含めて保持した。` | `document` |
