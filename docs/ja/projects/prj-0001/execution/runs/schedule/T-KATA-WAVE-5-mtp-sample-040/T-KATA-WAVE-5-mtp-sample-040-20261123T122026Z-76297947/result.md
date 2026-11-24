---
specdojo:
  id: prj-0001:xer-t-kata-wave-5-mtp-sample-040-20261123t122026z-76297947
  type: exec-result
  task_id: T-KATA-WAVE-5-mtp-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-5-mtp-sample-040/T-KATA-WAVE-5-mtp-sample-040-20261123T122026Z-76297947/plan.md
  started_at: "2026-11-23T12:20:37.454Z"
  completed_at: "2026-11-23T12:39:20.447Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - specdojo:mtp-sample
    - specdojo:mtp-rulebook
---

# Edit Result

## 1. 実施内容

- rulebook (`docs/ja/specdojo/rulebooks/mtp-rulebook.md`) を簡潔に整えました。
- 指示に従い、rulebook 内の「サンプル」章を削除し、完成例を `docs/ja/specdojo/samples/mtp-sample.md` へ移譲する形式に変更しました。
- grade の指摘に基づき、以下の内容を反映しました：
- 差異発生時の扱い（`pm-issue-log` や `pm-decision-log` への転記条件と担当 `Role code`）の追記 (F001)
- ファイル変更時の `mtp-index` への追従事項の定義 (F003)
- 検証手順として実行すべき `lint:fm` や `lint:md` の明示 (F004)
- 再実行の判断基準について、単なる記載有無ではなく、未確定時は `_UNDECIDED_` を用いるなどの判定可能な条件への置き換え (F005)
- 判定者欄の表記を `Role code` で指定するよう統一 (F008)

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/mtp-rulebook.md`: rulebook の簡潔化および grade 指摘への対応。サンプル章を削除し、本文要件の表、判断基準、および `line` ごとの記述ガイド（「良い例」「悪い例」）を整備しました。また、差異発生時の `pm-issue-log` への転記条件や、`lint:fm` 等の検証手順、判定者への `Role code` 指定などの要件を追記しました。

## 3. 申し送り

- F006（major, vp-qe-kata-conformance）は未解消: `docs/ja/specdojo/samples/mtp-sample.md` が汎用的な 5 章構成のままであり、本 rulebook の要件（9 章構成：概要〜関連ドキュメント）に沿っていません。この段では sample を変更しない方針のため、後続の sample 更新タスクにて、駄菓子屋の事例を用いた 9 章構成への作り直しが必要です。
- rulebook のサンプル章を削除しました。これは `docs/ja/specdojo/standards/rulebook-authoring-standard.md` の経過措置に基づき、完成例を `sample` へ集約する方針に従ったものです。
- F006（major, vp-qe-kata-conformance）は未解消: docs/ja/specdojo/samples/mtp-sample.md が汎用5章のままで、rulebook の Frontmatter（type: test, rulebook: specdojo:mtp-rulebook）と本文要件の9章（概要〜関連ドキュメント）に沿っていない。この段は sample を変更しないため、後続の sample の段で駄菓子屋の販売管理システムを題材に9章の完成例へ作り直す必要がある（合否基準の判定者は Role code、差異の扱いに再実行上限と pm-issue-log・pm-decision-log への転記を含める）。
- rulebook のサンプル章を削除した。rulebook-authoring-standard は既存の章を段階的に外出しする経過措置としているが、plan の『rulebook に完成例の章を置かず、完成例は sample に任せる』と、同じ wave の cop-index-rulebook の前例に従った。完成例は sample の作り直しまで実質的に存在しない。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/rulebooks/mtp-rulebook.md だけで、plan・result・個票を変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルに `*.yaml` / `*.yml` がない）

## 4. 進め方と実践の型の適用

対象の `mtp-rulebook` を読み込み、`grade` の `finding` に基づいて修正を実施しました。特に、「完成例の除去」「判断基準の具体化」「検証手段の明示」「Role code による判定者の定義」に重点を置き、rulebook が「形式の輪郭を伝える最小限の定義」となるよう調整しました。修正後は `lint:md` 等により構造の整合性を確認しています。
