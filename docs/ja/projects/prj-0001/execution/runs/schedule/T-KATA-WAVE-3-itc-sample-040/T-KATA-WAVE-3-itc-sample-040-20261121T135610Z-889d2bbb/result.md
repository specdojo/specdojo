---
specdojo:
  id: prj-0001:xer-t-kata-wave-3-itc-sample-040-20261121t135610z-889d2bbb
  type: exec-result
  task_id: T-KATA-WAVE-3-itc-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-3-itc-sample-040/T-KATA-WAVE-3-itc-sample-040-20261121T135610Z-889d2bbb/plan.md
  started_at: "2026-11-21T13:56:25.126Z"
  completed_at: "2026-11-21T14:04:49.315Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - specdojo:itc-sample
    - specdojo:itc-rulebook
---

# Edit Result

## 1. 実施内容

- rulebook (`docs/ja/specdojo/rulebooks/itc-rulebook.md`) を簡潔化し、grade result の finding (F001〜F012) にすべて対応させました。
- H5 見出しを廃止して H4 以内に収め、構成を整理しました。
- サンプルの実例（第5節）を削除し、`本文要件` 章へ変更して、具体的な記述基準を設ける構成に改めました。
- `case_id` やケース表のカラム定義を `itc-index` の定義へ委譲し、不変性の規則を禁止事項へ集約しました。
- `perspective_key` を変更する場合の追跡手段、`_UNDECIDED_` (recipe/template 用) の扱い、および作成後の検証コマンド (`npm run lint:md` 等) を明記しました。
- 各章に「良い例」と「悪い例」を追加し、記述の具体性を高めました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/itc-rulebook.md`: rulebook の章立てを簡潔にし、`itc-index` への参照や `_UNDECIDED_` の状態、検証手順、`perspective_key` の追跡方法などを追記して、grade result の指摘事項を解消しました。また、記述ガイドとして「良い例・悪い例」を追加しました。

## 3. 申し送り

- sample (`docs/ja/specdojo/samples/itc-sample.md`) は rulebook の「本文要件」（6章構成、`perspective_key` 宣言、`trace_key`、ケース表）に未整合のため、後続の sample-maintenance で駄菓子屋の文脈で厚くする必要がある（F009）。
- recipe・template の要否判断は未了で、rulebook に `_UNDECIDED_` として記載した（template は PJR-WYTX で扱う）。
- sample（docs/ja/specdojo/samples/itc-sample.md）は rulebook の「本文要件」（6章構成、`perspective_key` 宣言、`trace_key`、ケース表）に未整合のため、後続の sample-maintenance で駄菓子屋の文脈で厚くする必要がある（F009）。
- recipe・template の要否判断は未了で、rulebook に `_UNDECIDED_` として記載した（template は PJR-WYTX で扱う）。
- 適用外の検証: `npm run validate:history-links`（変更ファイルは rulebook のみで、plan・result・個票などの履歴ファイルを変更していないため）

## 4. 進め方と実践の型の適用

rulebook を「成果物（sample）の実例を載せる場所」から、「成果物の構成・基準・禁止事項を定義する場所」へと整理・簡潔化しました。具体的な実例は sample 側に委譲し、rulebook は `itc-index` を通じた参照と、記述の是非を判定するための基準（良い例・悪い例）の提示に集中させています。
