---
specdojo:
  id: prj-0001:xer-pjr-rxvc-20261101t020615z-c8f03f6b
  type: exec-result
  task_id: PJR-RXVC
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-rxvc-20261101T020615Z-c8f03f6b-plan.md
  started_at: "2026-11-01T02:06:15.722Z"
  completed_at: "2026-11-01T02:21:55.442Z"
  agent: flash-high-executor
---

# Edit Result

## 1. 実施内容

- 全体概要の CDFD を「使い方の流れ」に基づいて 4 つの図（`register` 系、`schedule` 系、`routine` 系、および共通・基盤）に分割し、D2 形式で作成しました。
- 分割に伴い、`docs/ja/specdojo/rulebooks/cdfd-overview-rulebook.md` を更新し、図の分割方式として「使い方の流れ」を選択可能とする方針を追加しました。
- 図のノード ID には、将来の互換性を考慮して英語のスネークケース（`orchestrator`、`register` など）を採用し、ラベルに日本語と絵文字を使用しています。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/010-data-flow/cdfd-overview.md`: 全体概要の CDFD を、LP の Roadmap に合わせて `register` 系、`schedule` 系、`routine` 系、および Onboarding・稼働構成管理・非推奨化を含む共通・基盤系の 4 つの D2 図に分割して再構成しました。
- `docs/ja/specdojo/rulebooks/cdfd-overview-rulebook.md`: 図の分割方式として、従来の「データストアの区分」に加えて「使い方の流れ」を選択可能とする規定を追加しました。

## 3. 申し送り

- ノード ID の言語方針: D2 コード内のノード ID には英語の英数字・スネークケース（`orchestrator`、`plan`、`do_exec`、`register`、`exec_plan` など）を採用し、表示ラベルに日本語および絵文字を記述した。理由: [[specdojo:cdfd-d2-rulebook]] 第 2 節の標準方針に準拠し、将来のパーサーやツール連携における文字化け等の不具合を防止しつつ、図の可読性を両立するため。
- 受け渡し（エッジ）の対応: 変更前の Mermaid 図にあった全 57 本の受け渡しエッジ（トランザクション系 35 本、マスタ・構成系 22 本）は、4 つの図（5.1. register 系の流れ、5.2. schedule 系の流れ、5.3. routine 系の流れ、5.4. 共通・基盤の流れ）のいずれか（または複数）にすべて漏れなく保持・再配置された。詳細な対応表は個票（`pjr-rxvc-cdfd-overview-split-by-usage.md`）の対応結果 5.3 節に記録した。
- 共通の図の構成: 共通・基盤の流れ（5.4）に、Onboarding（`P-01`）、稼働構成管理（`P-12`）、非推奨化保管（`P-13`）を確実に配置した。
- rulebook の改定: [[specdojo:cdfd-overview-rulebook]] において、図のノード数が 16 を超える場合の分割方式として「データストアの区分」に加えて「使い方の流れ」を選択可能とし、凡例で明示しない場合は既定の「データストアの区分」とする方針を規定した。

## 4. 進め方

まず、`cdfd-overview.md` を分析し、LP の Roadmap に対応する 4 つのコンテキスト（`register`、`schedule`、`routine`、共通/基盤）を定義しました。次に、既存の Mermaid 図からエッジを漏れなく抽出し、各図へ再配置する作業を行いました。図の作成には D2 を使用し、ノード ID は機械的な扱いが容易な英語のスネークケースで記述しています。最後に、この分割方式を将来的に他のプロジェクトでも利用できるように、`cdfd-overview-rulebook.md` の構成定義を更新しました。
