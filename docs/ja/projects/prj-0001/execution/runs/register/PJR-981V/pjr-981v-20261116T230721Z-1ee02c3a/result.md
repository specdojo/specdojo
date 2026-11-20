---
specdojo:
  id: prj-0001:xer-pjr-981v-20261116t230721z-1ee02c3a
  type: exec-result
  task_id: PJR-981V
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-981V/pjr-981v-20261116T230721Z-1ee02c3a/plan.md
  started_at: "2026-11-16T23:07:22.104Z"
  completed_at: "2026-11-17T02:47:15.363Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- コーディング規約の型（`cdr`）の rulebook・sample・template を作り、観点の定義と成果物リファレンスへ登録した。改められた完了条件に合わせ、個票の grade の行のメモと残課題を書き直した。grade の行は `open` のまま残した。

## 2. 変更ファイル

- `docs/ja/specdojo/defaults/pm-review-viewpoints.yaml`: 変更、+2 / -0 行
- `docs/ja/specdojo/references/deliverables-reference.md`: 変更、+21 / -12 行
- `docs/ja/specdojo/rulebooks/cdr-rulebook.md`: 追加、+161 / -0 行
- `docs/ja/specdojo/samples/cdr-sample.md`: 追加、+80 / -0 行
- `docs/ja/specdojo/templates/cdr-template.md`: 追加、+58 / -0 行

## 3. 申し送り

- `grade run --target kata` で `specdojo:cdr-rulebook`・`specdojo:cdr-sample`・`specdojo:cdr-template` を grade し、pass を確認する。完了条件どおり orchestrator が統合の後に流す（個票の作業内容 3 は `open`）。
- executor が決めた点: 接頭辞は `cdr`。成果物の `id` は `&lt;言語&gt;-instructions`。`deliverable_type` は `architecture`。recipe は `not-needed`。正本の frontmatter はトップレベルに `applyTo`、`specdojo:` 配下に SpecDojo の項目を置く。カタログは `base_path` を `/.github/instructions` にして正本だけを登録する。`vp-ba-business-value` は除外した。
- 既存の `.github/instructions/typescript.instructions.md` の `applyTo` とラッパー `.claude/rules/typescript.md` の `paths` がずれている。既存の正本には `specdojo:` の frontmatter もない。別の登録簿項目での対応を提案する。
- `npm run docs:build` は前回メモリ不足（SIGKILL）で終了したため今回は実行していない。CI などメモリの足りる環境で確認する。
- 人の確認が必要: `npm run docs:build`（sandbox ではメモリ不足で子プロセスが SIGKILL される。メモリの足りる環境で確認が必要）

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
