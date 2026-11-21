---
specdojo:
  id: prj-0001:pjr-rs2p-product-docs-remove-role-assignment
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
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

| No  | 作業                                     | 担当 | 状態 | メモ |
| --- | ---------------------------------------- | ---- | ---- | ---- |
| 1   | 対象の成果物を洗い出す                   | DEV  | open | -    |
| 2   | 役割の割り当てと承認の進み具合を外す     | DEV  | open | -    |
| 3   | 残したもの・未完了の承認を対応結果に書く | DEV  | open | -    |
| 4   | 検証を通す                               | DEV  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
