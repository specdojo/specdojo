---
specdojo:
  id: prj-0001:pjr-nmsh-agy-model-not-recognized
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-10-12T21:56:50Z"
  completed_at: "2026-10-15T20:38:37Z"
  conclusion: agy の提供終了の model の ID を agy models の一覧にある ID へ置き換え、直した後の最初の定期実行の grade が統合まで通った
---

# PJR-NMSH agy がモデル名を一時的に受け付けず grade が失敗する

## 1. 課題内容

agy-expert-executor が --model gemini-3.1-pro-high を「既知のモデルでも custom model でもない」として拒否し exit 1 で失敗した。同じ Run で同じ設定の 12 件は成功しており、一時的な失敗と見られる。再試行や切り分けの方法を決める

## 2. 影響範囲

| 観点         | 影響                                                                                                                          |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | 本リポジトリの `.specdojo/exec-defaults.yaml` の agy の model の指定（`by_proficiency.expert` と `by_nickname` の claude 系） |
| スケジュール | 定期実行の grade（01:00・06:00）が agy-expert-executor を使うため、毎晩失敗する                                               |
| コスト       | 2026-10-15 01:00 の成果物の grade は 10 件すべてが失敗し、Run が `waiting` になった                                           |
| 品質         | 評価が更新されず、`pm-communication-plan` は連続 2 回の失敗で、あと 1 回で `retry_exhausted` になる                           |
| 関係者       | 定期実行の grade、agy を使う exec                                                                                             |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | 一時的な失敗ではなかった。agy 1.3.5 の `agy models` の一覧に Gemini の Pro 系（`gemini-3.1-pro-high`）と Claude の 4.6 系（`claude-sonnet-4-6`・`claude-opus-4-6-thinking`）がなく、提供が終わっている              |
| 対応策   | 一覧にある ID へ置き換える。`expert` は `gemini-3.8-flash-high`、`agy-claude-executor` は `claude-sonnet-5-5-medium`、`agy-claude-expert-executor` と `agy-claude-expert-review-executor` は `claude-opus-5-5-high` |
| 依存事項 | 配布する雛形と文書の同じ ID は [[prj-0001:pjr-x60a-agy-model-ids-in-templates]] で直す                                                                                                                              |
| 完了条件 | 置き換えた model で agy が起動し、次の定期実行の grade が統合まで通る                                                                                                                                               |

## 4. 対応結果

- 2026-10-15、利用者の承認を得て、orchestrator が `feature/prj-0001/agy-model-ids` で `.specdojo/exec-defaults.yaml` の 4 か所を置き換え、develop へ統合した（c3394b157、merge d9b8f2b6d）。c3394b157 の commit メッセージの `Refs:` は誤って PJR-VGNG と書いたが、本件の対応である。
- 置き換えた 3 つの model（`gemini-3.8-flash-high`・`claude-sonnet-5-5-medium`・`claude-opus-5-5-high`）は、agy から起動して応答が返ることを確かめた。
- 2026-10-16 01:00 の成果物の grade（JBR-grade-deliverable-14d97cad9f51）は `succeeded`、review の verdict は `complete-with-findings` で、6 文書の評価結果が統合された（2493a349f）。`invalid model selection` は 0 件だった。

## 5. 関連ドキュメント

- [[prj-0001:pjr-x60a-agy-model-ids-in-templates]]: 配布物の同じ ID の修正（0.3.1）。
- [[prj-0001:pjr-vgng-job-run-partial-failure-integration]]: 一部の文書の失敗で Run 全体が統合されない件（別件）。
