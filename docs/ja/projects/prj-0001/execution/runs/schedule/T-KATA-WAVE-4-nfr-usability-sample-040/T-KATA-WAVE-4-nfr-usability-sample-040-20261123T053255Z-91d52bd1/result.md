---
specdojo:
  id: prj-0001:xer-t-kata-wave-4-nfr-usability-sample-040-20261123t053255z-91d52bd1
  type: exec-result
  task_id: T-KATA-WAVE-4-nfr-usability-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-4-nfr-usability-sample-040/T-KATA-WAVE-4-nfr-usability-sample-040-20261123T053255Z-91d52bd1/plan.md
  started_at: "2026-11-23T05:33:01.945Z"
  completed_at: "2026-11-23T05:36:45.771Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - specdojo:nfr-usability-sample
    - specdojo:nfr-usability-rulebook
---

# Edit Result

## 1. 実施内容

- nfr-usability-rulebook を簡潔に整えました。
- F001（指標の分母に関する記述）、F002（良い例の `備考` を対象者・操作に修正）、F003（`id` をプロジェクト修飾形式へ変更）の各 finding を解消しました。
- ルールブック内に置かれていた完成例の章を削除し、完成例の管理を sample に任せる構造に変更しました。
- F004（sample の見出し構成不整合）、F005・F006（`recipe` / `template` の `undecided` 状態および `ready` への昇格条件）については、次回のタスクまたは登録簿での管理事項として申し送りました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/nfr-usability-rulebook.md`: finding に基づき、指標の定義ルール、良い例の記載内容、およびプロジェクト修飾付きの ID 形式への修正を行いました。また、rulebook 内の完成例の章を削除しました。

## 3. 申し送り

- F004 (major): `specdojo:nfr-usability-sample` が rulebook の本文要件の見出し構成（概要（対象・目的）/適用範囲・利用者前提/操作性要件一覧/測定・検証方法/関連ドキュメント導線）に従っていません。この段では sample を変更しないため、sample を改訂するタスクにて対応が必要です。
- F005: Frontmatter の `recipe` / `template` が `undecided` のままです。要否と所在の正本は frontmatter に記載するルールに基づき、登録簿での判断を進めます。
- F006: `ready` への昇格前に解決すべき事項（F004 の sample 構造の修正および F005 の `recipe` / `template` の要否判断）を登録簿へ引き継ぎます。
- 直さなかった箇所: 記述ガイドの「測定・検証方法」における判定者の例（「UX・QA」）は、製品の受入試験における役割であり、文書の役割の割り当て（PJR-76N9）ではないため、そのまま維持しています。位置づけ、全体方針、および禁止事項についても、冗長な記述がないため変更していません。
- F004 (major): `specdojo:nfr-usability-sample` が rulebook の本文要件の見出し構成（概要（対象・目的）/適用範囲・利用者前提/操作性要件一覧/測定・検証方法/関連ドキュメント導線）に従っていない。H1 の Markdown リンクも残っている。この段は sample を変更しない決まりのため、sample を改訂する段で直す。
- F005: Frontmatter の `recipe` / `template` が `undecided` のまま。rulebook-authoring-standard では要否と所在の正本は Frontmatter で、本文に記さない。要否は登録簿の個票で判断することを提案する。
- F006: `ready` にする前に済ませることは、F004 の sample の直しと F005 の `recipe` / `template` の要否の判断。登録簿へ引き継ぐことを提案する。
- 直さなかった箇所: 記述ガイドの「測定・検証方法」の判定者（例の「UX・QA」）は製品の受入試験の判定者で、文書の役割の割り当てではないため、PJR-76N9 の対象外として残した。位置づけ・全体方針・禁止事項は指摘も冗長な記述もないため変更していない。

## 4. 進め方と実践の型の適用

rulebook-maintenance
