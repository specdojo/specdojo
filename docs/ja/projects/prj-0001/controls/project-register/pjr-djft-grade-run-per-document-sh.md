---
specdojo:
  id: prj-0001:pjr-djft-grade-run-per-document-sh
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-09T03:55:04Z"
---

# PJR-DJFT 公開物では grade を通しで実行できない（run-per-document.sh が同梱されない）

## 1. 課題内容

公開物の試用（2026-10-09）で、文書ごとの grade の実行を担う tools/grade/run-per-document.sh（約 1,300 行の bash）が npm package の files に含まれず、利用者は grade plan と grade apply の部品しか使えないことを確認した。案内文書はこのスクリプトを前提にしている。v0.3.0 では grade を部品のみ・試験的と明記するか、CLI に grade run として取り込むかを決める。

## 2. 影響範囲

| 観点         | 影響                                                                                                                 |
| ------------ | -------------------------------------------------------------------------------------------------------------------- |
| スコープ     | grade を案内する利用者向けの文書（review-guide、routine-operation-guide、command-reference など）、README、CHANGELOG |
| スケジュール | v0.3.0 の公開の判定基準 3 に関わる                                                                                   |
| コスト       | 案内どおりに grade を流そうとした利用者が、スクリプトがなく先へ進めない                                              |
| 品質         | 文書と公開物の内容が食い違う                                                                                         |
| 関係者       | grade を使う利用者                                                                                                   |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                            |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | 文書ごとの grade の実行を、本リポジトリ専用の `tools/grade/run-per-document.sh` が担い、npm package に含まれない                                                                                |
| 対応策   | 2026-10-09 に利用者が案 A を採用した。v0.3.0 では grade を「部品のみ・試験的」と明記し、通しの実行（`grade run` などとして CLI へ取り込むこと）は次の版で扱う。下記の「完了条件の詳細」のとおり |
| 依存事項 | なし                                                                                                                                                                                            |
| 完了条件 | 下記の「完了条件の詳細」を満たす                                                                                                                                                                |

### 3.1. 完了条件の詳細

- 利用者向けの文書（`docs/ja/specdojo/` の guides・references、README、Quick Start）で `tools/grade/run-per-document.sh` や grade の通しの実行を案内している箇所を洗い出す。各箇所に、次のことを明記する。
  - このスクリプトは SpecDojo 本体のリポジトリの開発用で、npm package には含まれない。
  - 公開物の利用者が使えるのは `grade list` / `plan` / `apply` / `validate` / `result` などの部品であり、grade は v0.3.0 では試験的な機能である。
  - 成果物の grade には `catalog_path` の設定が要る。
- 公開物の利用者が部品だけで 1 文書を評価する最小の手順を、command-reference の grade の節に示す。手順は、`grade plan` で plan を作る → executor の agent に plan を渡して marker を出力させる → `grade apply` で取り込む、の流れである。手順は CLI の実際のオプションと照合する。
- CHANGELOG の v0.3.0 の grade の項目に「試験的」であることと、通しの実行のスクリプトが package に含まれないことを追記する（既知の問題でもよい）。
- `tools/grade/run-per-document.sh` 自体と package の `files` は変えない。
- `npm run check` が通る。

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-p8tk-release-stabilization-criteria]]（公開の判定基準）
