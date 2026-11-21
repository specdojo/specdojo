---
specdojo:
  id: prj-0001:xer-t-kata-wave-3-utc-index-sample-040-20261121t094805z-629c7047
  type: exec-result
  task_id: T-KATA-WAVE-3-utc-index-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-3-utc-index-sample-040/T-KATA-WAVE-3-utc-index-sample-040-20261121T094805Z-629c7047/plan.md
  started_at: "2026-11-21T09:48:10.790Z"
  completed_at: "2026-11-21T09:54:42.498Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - specdojo:utc-index-sample
    - specdojo:utc-index-rulebook
---

# Edit Result

## 1. 実施内容

- Rulebook `docs/ja/specdojo/rulebooks/utc-index-rulebook.md` を更新し、指摘事項（finding）に基づいた修正を実施した。
- F001: 境界/依存関係の章において、実接続の検証に関する記述を例外一覧への参照に置き換え、重複を解消した。
- F002: ケース表の全10カラムについて、必須であることを定義し、未充足の場合の扱い（`トレース`/`証跡` カラムの扱い）を明記した。
- F003: 文書の目的文を、ケース表の共通カラムに合わせて修正した。
- F005: 図（diagram）のノード名を、成果物名と一致するよう修正した。
- F006: `recipe` および `template` が `undecided` であることに対する `_UNDECIDED_` 注記を、全体方針の章に追加した。
- 文書構成の変更: 第5章を `本文要件` へ改名し、`サンプル` 章を削除した。あわせて、記述ガイドの各セクションに「良い例・悪い例」を追加した。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/utc-index-rulebook.md`: rulebook の内容を、指摘事項（F001, F002, F003, F005, F006）に基づいて修正。具体的には、重複の削除、カラムの定義明確化、ノード名の表記ゆれ修正、未決定事項の注記追加、および章構成の整理（`サンプル` 章の削除と `本文要件` への改名）を行った。

## 3. 申し送り

- F004 not fixed: `docs/ja/specdojo/samples/utc-index-sample.md` が本 rulebook の `本文要件` で定義した章構成に従っていない。本フェーズでは sample の編集は禁止されているため、後続の `sample-maintenance` で、見出しの構成・順序の整合および Markdown リンクの削除を行う必要がある。
- The `サンプル（最小）` chapter was removed because the plan says the rulebook must not hold a completed example. `rulebook-authoring-standard` says existing rulebooks should not remove this chapter ahead of others in an individual revision; please confirm which rule takes precedence.
- F006: the frontmatter declarations (`recipe: undecided`, `template: undecided`) are unchanged per the plan; the `_UNDECIDED_` note in `全体方針` must be removed once they are decided (template is handled by PJR-WYTX).
- F004 not fixed: docs/ja/specdojo/samples/utc-index-sample.md does not follow the rulebook's 本文要件 chapters 1-9. The plan forbids editing the sample in this stage, so the follow-up `sample-maintenance` should align its headings and order (also remove the Markdown links in its H1 and body).
- The サンプル（最小） chapter was removed because the plan says the rulebook must not hold a completed example. rulebook-authoring-standard says existing rulebooks should not remove this chapter ahead of others in an individual revision; please confirm which rule takes precedence.
- F006: the frontmatter declarations (`recipe: undecided`, `template: undecided`) are unchanged per the plan; the `_UNDECIDED_` note in 全体方針 must be removed once they are decided (template is handled by PJR-WYTX).
- 適用外の検証: `npm run validate:history-links`（Only a rulebook under docs/ja/specdojo/rulebooks was changed; no plan/result/pjr ticket was edited）

## 4. 進め方と実践の型の適用

rulebook-maintenance
