---
specdojo:
  id: prj-0001:pjr-rs2p-product-docs-remove-role-assignment
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-21T08:24:25Z"
  derived_from:
    - PJR-76N9
---

# PJR-RS2P 製品の成果物から、文書の役割の割り当てと承認の進み具合の記述を外す

## 1. 概要

PJR-76N9 の決まりに合わせ、製品の成果物（約 28 件）の本文から、文書を作る・確かめる・承認する役割の割り当てと承認の進み具合を外す。承認と留保は登録簿へ移す

## 2. 入力

- PJR-76N9 の決定（2026-11-21、indie）と、orchestrator の調べ（2026-11-21）: 役割の割り当ての文は bes-index・bes-task-ready-selected・cdt-register-type・cdsd-execution・stsd-routine-run・ccd-project-planning・stsd-task-execution・sf-task-execution・cpd-specdojo-cli・bac-task-completion・sysd-critical-flows・sysd-cross-cutting-policy・ifx-index・ifx-file-agent-evidence などにある。cnd-specdojo は PJR-Q9DF で直す
- 文書の中身として役割が要る文書（pm-raci・pm-organization・pm-roles など）は対象外

## 3. 完了条件

- 対象の成果物を `docs/ja/product/` から洗い出し、直したもの・対象外としたもの（理由）を個票の対応結果に表で書く。入力に挙げた文書は必ず確かめる。cnd-specdojo は PJR-Q9DF で直したため対象外とする。
- 本文から、文書を作る・確かめる・承認する役割の割り当て（例:「ARC が構成案を担当し、BA は……を確認する」）と、承認の範囲・留保・差し戻しなどの進み具合の記述を外す。外したことで文がつながらなくなる箇所は、文書が扱う内容が分かる文に直す。
- 文書の中身として役割が要る記述（RACI・体制・利用者の接点・業務の担当など、その文書が扱う対象そのもの）は残す。残したものは、理由を対応結果に書く。
- 外した承認と留保のうち、まだ終わっていないものは、個票の対応結果に一覧で書く（登録簿への起票はオーケストレーターが利用者と決める）。
- frontmatter（`status` など）は変えない。rulebook・sample・template・standard は変えない（第 3〜6 波と PJR-325Y で扱う）。
- `CHANGELOG.md` は変えない。個票の対応結果の `### 5.1. CHANGELOG に書く事項` に、区分と行の文案を書く。利用者に影響がなければ「なし」と書く。
- `npm run lint:md`・`npm run lint:fm` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業                                     | 担当 | 状態 | メモ                                                                                             |
| --- | ---------------------------------------- | ---- | ---- | ------------------------------------------------------------------------------------------------ |
| 1   | 対象の成果物を洗い出す                   | DEV  | done | `docs/ja/product/` の 59 件から、役割名（PO・ARC・BA・DEV・QE・PM・OPS）の語を検索して洗い出した |
| 2   | 役割の割り当てと承認の進み具合を外す     | DEV  | done | 27 ファイルを直した。直した内容は 5.2 の表                                                       |
| 3   | 残したもの・未完了の承認を対応結果に書く | DEV  | done | 5.3・5.4 に書いた                                                                                |
| 4   | 検証を通す                               | DEV  | done | `npm run lint:md`・`npm run lint:fm` は通った。親の検証は runner が実行する                      |

## 5. 対応結果

`docs/ja/product/` の成果物（59 件）から役割名の語を洗い出し、文書の作成・確認・承認の割り当てと承認の進み具合を外した。外した文は、文書が扱う内容が分かる文に直した（例:「BA が対応を確かめる」は「対応を確かめる」）。確認者・担当・判断者・決定者の列は削った。`status` などの frontmatter、rulebook・sample・template・standard、`CHANGELOG.md` は変えていない。

### 5.1. CHANGELOG に書く事項

なし（製品の成果物の文言の整理であり、利用者の操作・出力に影響しない）。

### 5.2. 直した成果物

`ifx-*` は YAML が正本のため YAML を直した（`generated/` は git 管理外で、build で再生成される）。

| 成果物                             | 直した内容                                                                                   |
| ---------------------------------- | -------------------------------------------------------------------------------------------- |
| `bes-index`                        | 照合・確認の担当、承認と承認日、未決事項の判断者列、承認条件                                 |
| `bes-task-ready-selected`          | 判断の進め方案の担当割当、承認者の識別の行、承認条件                                         |
| `cdt-register-type`                | 主担当ロール・利用者・変更影響の担当                                                         |
| `cdsd-execution`                   | 利用者の役割、訂正・照合の担当、未決事項の担当・承認、公開前の確認                           |
| `cdsd-planning`・`cdsd-sharing`    | 概要の利用者の役割                                                                           |
| `stsd-routine-run`                 | 今後の検討メモの担当・決定者列、業務承認の条件                                               |
| `stsd-task-execution`              | 未決事項の確認・承認の担当                                                                   |
| `stsd-deliverable`・`stsd-job-run` | 今後の検討メモの決定者列                                                                     |
| `stsd-register-entry`              | 今後の検討メモの決定者・報告先                                                               |
| `ccd-project-planning`             | 概要の利用者の役割、確認の担当                                                               |
| `sld-specdojo`                     | 利用者の役割、検証観点のロール、公開と昇格の承認                                             |
| `sf-index`                         | 読者・保守・承認の記述、未決事項の担当・判断者列                                             |
| `sf-task-execution`                | 利用者・確認の役割、未決事項の担当・判断者列、受入の承認                                     |
| `br-task-selection-strategy`       | 利用者の承認、判断依頼先の列、業務承認の条件                                                 |
| `bds-progress-report`              | 作成責任・公開の承認、扱いの表の役割、未整備事項の担当                                       |
| `bac-task-completion`              | 確認する役割の表、確認状況の担当、`QE` が確認する旨の記述、留保の判断依頼先列                |
| `cxd-specdojo`・`cpd-specdojo-cli` | 構成の承認、確認ロール・担当ロールの列                                                       |
| `ifd-specdojo`                     | 構成の承認、未決事項の担当列と承認                                                           |
| `sysd-index`                       | ロール別の責務表（責務区分の表へ）、更新責任の列、未決事項の担当列、公開前の承認             |
| `sysd-critical-flows`              | 公開の判断者、未決事項の担当列、承認対象の表（照合する証跡の表へ）、留保の承認               |
| `sysd-cross-cutting-policy`        | 利用・確認・承認責務の表、規則の担当列、確認群の担当、報告・追跡責務の列、未決事項の判断者列 |
| `ifx-index`                        | 管理担当・承認・判断者の記述                                                                 |
| `ifx-cmd-ai-provider-cli`          | 未決事項の技術判断者・追跡者、延期の承認                                                     |
| `ifx-file-agent-evidence`          | 未決事項の `owner`、昇格の承認、確認担当                                                     |

### 5.3. 対象外または残したもの

- `cnd-specdojo`: PJR-Q9DF で直したため対象外。
- 文書の中身として役割が要るため残した:
  - `cdfd-overview`・`cdfd-uc-register`・`cdfd-uc-schedule`・`cdfd-uc-routine`: 業務プロセスの主担当と起点の主体。
  - `bps-task-completion`・`bps-deliverable-evaluation`: 業務プロセスの主担当・ステップの担当・例外の担当。
  - `bes-index` の主体の列、`cdsd-execution` の更新責務の列: データストアの更新責務そのもの。
  - `bac-task-completion` のシナリオ: 完了判断・記録の主体のふるまいが受入の対象。
  - `sysd-critical-flows` の重要フローの登場者と検知・記録先の表: フローの主体そのもの。
  - `ifd-specdojo` の管理主体の列、`stsd-register-entry` の承認権限者（登録種別ごと）、`stsd-deliverable` の状態定義: 設計・状態定義の対象。
  - `gl-quality`（`generated/` は git 管理外。元の用語集の説明文）、`bdd-register-entry`（`generated/`）、`sysd-job-execution`・`cpd-specdojo-cli` の frontmatter `owner`（frontmatter は変えない）。
- 残る課題: 上記のうち `sysd-critical-flows` と `bac-task-completion` の「確認する」記述の一部に、役割の主体が残る。業務プロセスの主体との切り分けが要るため、利用者の判断を待つ。

### 5.4. 外した承認と留保のうち、まだ終わっていないもの

登録簿への起票は、オーケストレーターが利用者と決める。

| 成果物                          | 終わっていないもの                                                                             | 追跡先                                 |
| ------------------------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------- |
| `bes-index`                     | 主体・事実データ・詳細化の対応の留保、成果物カタログとの範囲の差、テスト設計の観点としての確認 | PJR-AK5V                               |
| `bes-task-ready-selected`       | 適用範囲（register・routine 系）、カタログとの整合、業務承認する人の特定                       | -                                      |
| `stsd-routine-run`              | `M-01`〜`M-04` の解消と業務承認                                                                | -                                      |
| `stsd-task-execution`           | 権限の規則（`T-05`〜`T-12`）の業務上の確定、辞書との照合                                       | PJR-TN43                               |
| `cdsd-execution`                | 業務データ辞書 7 件の作成、実行 event の形式違反の復旧手順                                     | -                                      |
| `sysd-critical-flows`           | `CF-U01`〜`CF-U05` の解消と、各フローの受入の承認                                              | PJR-Y2X4                               |
| `sysd-cross-cutting-policy`     | `Q1`〜`Q4` の判断と公開前の承認                                                                | PJR-39AB                               |
| `ifx-index`・`ifd-specdojo`     | Git・GitHub の詳細契約、クラウド AI の接続契約、文書の構築・公開境界の留保                     | PJR-CJMN                               |
| `ifx-file-agent-evidence`       | `OD-01`〜`OD-04` の解消                                                                        | PJR-TN43                               |
| `ifx-cmd-ai-provider-cli`       | `timeout_seconds`・`max_parallel`・`max_attempts` の延期                                       | PJR-39AB・PJR-Y2X4                     |
| `bac-task-completion`           | 代表試行の対象・費用の上限・設計の対応表の確認待ちの条件                                       | PJR-TN43・PJR-W63Q                     |
| `br-task-selection-strategy`    | `U-01`〜`U-07` の採用方針                                                                      | -                                      |
| `sf-index`・`sf-task-execution` | `Q-01`〜`Q-03` と未決事項 3 件                                                                 | PJR-AK5V・PJR-2GD6・PJR-BCAQ・PJR-99NS |
| `cpd-specdojo-cli`              | 内部構成と実装の対応、正本の参照の接続、外部依頼・途中変更の回復条件                           | -                                      |

## 6. 関連ドキュメント

- [[prj-0001:pjr-76n9-no-role-assignment-in-documents]]
- [[prj-0001:pjr-q9df-cnd-specdojo-rework-grade-findings]]
