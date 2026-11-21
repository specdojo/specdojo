---
specdojo:
  id: prj-0001:xer-t-kata-wave-3-utc-sample-050-20261121t110214z-2c3b1615
  type: exec-result
  task_id: T-KATA-WAVE-3-utc-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-3-utc-sample-050/T-KATA-WAVE-3-utc-sample-050-20261121T110214Z-2c3b1615/plan.md
  started_at: "2026-11-21T11:02:19.791Z"
  completed_at: "2026-11-21T12:53:39.030Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:utc-sample
    - specdojo:utc-sample
---

# Edit Result

## 1. 実施内容

- `docs/ja/specdojo/samples/utc-sample.md` を `utc-rulebook` の本文要件（概要からテスト観点とケースまでの構成）に準拠した、会計確定（`utc-sales-checkout`）の完成例へと全面改訂しました。
- frontmatter に `based_on`（`tsp-index-sample`, `utc-index-sample`, `bac-sample`）を追加し、H1 を規定の形式へ修正しました。
- トレース表（`trace_key` TR-01〜05）の実装、依存関係の制御方法、および 3 観点・6 ケースの全項目（10 カラム）を埋めることで、具体的な検証可能性を提示しました。
- `prettier` による整形、`markdownlint` による構文チェック、および `docs:build` を実行し、成果物の品質を確保しました。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/utc-sample.md`: `utc-rulebook` の構成および検証可能性の指摘に基づき、具体的な会計確定のケースとして内容を大幅に拡充・再構成しました。

## 3. 申し送り

- rulebook 変更案: `utc-rulebook` の全体方針にある `_UNDECIDED_` のうち「sample は本文要件の見出し構成へ未整合」の文言は今回の改訂で解消したため削除する（recipe・template の要否は残す）。
- F002/F004/F005/F006/F027/F028（PM の計画・依存リスク・報告経路・ready 化の判定基準・運用ガイダンス・未解決事項表）は `utc-rulebook` の本文要件（6章固定）に該当する章がなく、sample 独自の章は作れないため本文には追加していない。未決事項・承認・改訂の扱いは rulebook がドキュメントメタ情報標準へ委ねている。sample 群で扱うかは rulebook の側で判断する必要がある。
- TR-04（受領額不足で確定しない）は `bac-sample` の BAC-01 前提「合意した請求額の現金を受領している」からの解釈であり、`_ASSUMPTION_` として明記した。BAC 側に明示の条件を追加するか BA の判断が要る。
- F001/F007〜F010（目的・ビジネス価値・受入基準・ステークホルダー）は概要・責務・対象外とトレース（BAC・tsp-index）で対応した。目的と関与者の一覧は `utc-index-sample` にあるため、本 sample には重ねて書いていない。
- rulebook 変更案: utc-rulebook の全体方針にある `_UNDECIDED_` のうち「sample は本文要件の見出し構成へ未整合」の文言は今回の改訂で解消したため削除する（recipe・template の要否は残す）。
- F002/F004/F005/F006/F027/F028（PM の計画・依存リスク・報告経路・ready 化の判定基準・運用ガイダンス・未解決事項表）は utc-rulebook の本文要件（6章固定）に該当する章がなく、sample 独自の章は作れないため本文には追加していない。未決事項・承認・改訂の扱いは rulebook がドキュメントメタ情報標準へ委ねている。sample 群で扱うかは rulebook の側で判断する必要がある。
- TR-04（受領額不足で確定しない）は bac-sample の BAC-01 前提「合意した請求額の現金を受領している」からの解釈であり、`_ASSUMPTION_` として明記した。BAC 側に明示の条件を追加するか BA の判断が要る。
- F001/F007〜F010（目的・ビジネス価値・受入基準・ステークホルダー）は概要・責務・対象外とトレース（BAC・tsp-index）で対応した。目的と関与者の一覧は utc-index-sample にあるため、本 sample には重ねて書いていない。
- 適用外の検証: `npm run validate:history-links`（変更ファイルは docs/ja/specdojo/samples/utc-sample.md のみで、pjr 個票や plan/result などの履歴ファイルを変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更した `*.yaml` / `*.yml` ファイルがない）

## 4. 進め方と実践の型の適用

`utc-rulebook` の構成要件を正として、`utc-sample.md` を駄菓子屋の具体的なビジネスロジック（会計確定）に即した実践的なサンプルへと厚くしました。`grade` の指摘事項に基づき、`trace_key` によるトレーサビリティ、依存関係の定義、および検証可能なテストケース（観点・条件・判定基準・責任者を含む）を網羅的に記述することで、`done_criteria` を満たす成果物へと昇華させました。
