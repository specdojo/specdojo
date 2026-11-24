---
specdojo:
  id: prj-0001:xer-t-kata-wave-3-stc-index-sample-050-20261121t101803z-cc6d283e
  type: exec-result
  task_id: T-KATA-WAVE-3-stc-index-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-3-stc-index-sample-050/T-KATA-WAVE-3-stc-index-sample-050-20261121T101803Z-cc6d283e/plan.md
  started_at: "2026-11-21T10:18:09.139Z"
  completed_at: "2026-11-21T10:28:42.827Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:stc-index-sample
    - specdojo:stc-index-sample
---

# Edit Result

## 1. 実施内容

- `docs/ja/specdojo/samples/stc-index-sample.md` を、rulebook の標準的な見出し構成（第 1 章から第 8 章）に従った「駄菓子屋 きぬや」の完成例として全面改訂しました。
- grading によって指摘された 23 件の finding (`F001`〜`F023`) に対し、業務シナリオの具体化、分割基準と分配方針の明示、技術的前提（環境・外部依存・証跡）の記述、および `case_id` を含むケース表の形式例の追加などを行うことで、すべて解消しました。
- Frontmatter に `based_on: [tsp-index, bac-sample]` を追加し、上位の `tsp-index` への依存関係を明示しました。また、H1 の Markdown リンクを削除し、ID ベースの参照または Frontmatter による定義に整理しました。
- 性能条件や合格基準、環境・境界に関する記述を具体化し、検証可能性（verifiability）を備えた完成例として厚みを持たせました。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/stc-index-sample.md`: rulebook の標準構成（## 1 〜 ## 8）に基づき、駄菓子屋の販売管理システムを題材とした完成例へと改訂。業務シナリオの定義、対象外事項の表、技術的環境・境界、ケースの形式例、および P0/P1/P2 ごとの合格基準などを具体的に記述しました。

## 3. 申し送り

- sample で使った架空名 `kinuya-ci-st`（CI ジョブ）・`kinuya-st-report`（ST レポート）・データ領域 `kinuya-st` は、`tsp-index-sample` などほかの sample に定義がないため、今後 `stc-sample` を厚くする際は同じ名前に揃える必要があります。
- 分割した 4 つの term（`stc-cash-sale`・`stc-sale-hold`・`stc-credit-balance`・`stc-record-recovery`）は、BAC-01〜03・AC-02・TSP のスコープから決めた `stc-index-sample` 上の仮定です。対象別の `stc-sample` を改訂するときは、この分割と `case_id` の例（`st-cash-sale-flow-success-010`）に合わせる必要があります。
- 兄弟の `stc-sample.md`・`itc-index-sample.md` などは、旧版と同じ薄い書き方（H1 に相対リンク、最小記述例の表）のまま残っています。本タスクの範囲外のため変更していません。
- rulebook の変更案: 「総合テスト共通の境界/環境の扱い」が求める共通合格基準を、P0/P1/P2 の表形式で示す推奨フォーマットとして rulebook に加えると、sample と対象別カタログの書き方が揃います（任意）。
- sample で使った架空名 `kinuya-ci-st`（CI ジョブ）・`kinuya-st-report`（ST レポート）・データ領域 `kinuya-st` は、tsp-index-sample などほかの sample に定義がない。今後 stc-sample を厚くするときは同じ名前に揃える。
- 分割した 4 つの term（`stc-cash-sale`・`stc-sale-hold`・`stc-credit-balance`・`stc-record-recovery`）は、BAC-01〜03・AC-02・TSP のスコープから決めた sample 上の仮定である。対象別の stc-sample を改訂するときは、この分割と `case_id` の例（`st-cash-sale-flow-success-010`）に合わせる必要がある。
- 兄弟の stc-sample.md・itc-index-sample.md などは、旧版と同じ薄い書き方（H1 に相対リンク、最小記述例の表）のまま残っている。本タスクの範囲外のため変更していない。
- rulebook の変更案: 「総合テスト共通の境界/環境の扱い」が求める共通合格基準を、P0/P1/P2 の表形式で示す推奨フォーマットとして rulebook に加えると、sample と対象別カタログの書き方が揃う（任意）。
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/samples/stc-index-sample.md だけで、plan・result・pjr 個票は変更していないため）
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/specdojo/samples/ 配下だけで、docs/ja/projects/ には及ばないため）

## 4. 進め方と実践の型の適用

rulebook の標準テンプレに従い、`stc-index-sample.md` を「駄菓子屋 きぬや」の具体的な業務シナリオを用いた完成例として厚くしました。grading による事項（構成の不備、分割方針の不足、技術的前提の欠如、検証可能性の不足など）をすべて解消し、実案件への適用を想定した実践的なサンプルへとアップデートしました。
