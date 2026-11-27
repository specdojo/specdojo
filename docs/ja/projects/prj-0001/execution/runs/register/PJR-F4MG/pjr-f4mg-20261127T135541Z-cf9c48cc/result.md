---
specdojo:
  id: prj-0001:xer-pjr-f4mg-20261127t135541z-cf9c48cc
  type: exec-result
  task_id: PJR-F4MG
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-F4MG/pjr-f4mg-20261127T135541Z-cf9c48cc/plan.md
  started_at: "2026-11-27T13:57:31.771Z"
  completed_at: "2026-11-27T14:54:34.187Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- 英語34文書・README・文書サイト入口を整備。同一言語の rulebook を優先する型照合と回帰テストを追加し、MD028 違反を修正した。方針・理由・検証結果を個票に記録した。

## 2. 変更ファイル

- `.remarkrc.yaml`: 変更、+12 / -0 行
- `README.md`: 変更、+1 / -1 行
- `docs/en/index.md`: 変更、+23 / -4 行
- `docs/index.md`: 変更、+1 / -1 行
- `docs/ja/specdojo/standards/document-metadata-standard.md`: 変更、+1 / -0 行
- `docs/ja/specdojo/standards/id-and-file-naming-standard.md`: 変更、+1 / -0 行
- `docs/specdojo/schemas/v1/common-frontmatter.schema.yaml`: 変更、+18 / -0 行
- `packages/docs-lint/src/deliverable-type.cjs`: 変更、+52 / -12 行
- `tests/packages/docs-lint/deliverable-type.test.ts`: 変更、+96 / -0 行
- `docs/en/specdojo/guides/civic-tech-starter-guide.md`: 追加、+149 / -0 行
- `docs/en/specdojo/guides/quick-start-guide.md`: 追加、+937 / -0 行
- `docs/en/specdojo/recipes/br-recipe.md`: 追加、+77 / -0 行
- `docs/en/specdojo/recipes/prj-issues-and-approach-recipe.md`: 追加、+104 / -0 行
- `docs/en/specdojo/recipes/prj-overview-recipe.md`: 追加、+180 / -0 行
- `docs/en/specdojo/rulebooks/br-rulebook.md`: 追加、+107 / -0 行
- `docs/en/specdojo/rulebooks/pjr-rulebook.md`: 追加、+221 / -0 行
- `docs/en/specdojo/rulebooks/prj-issues-and-approach-rulebook.md`: 追加、+166 / -0 行
- `docs/en/specdojo/rulebooks/prj-overview-rulebook.md`: 追加、+153 / -0 行
- `docs/en/specdojo/rulebooks/sf-index-rulebook.md`: 追加、+131 / -0 行
- `docs/en/specdojo/samples/br-sample.md`: 追加、+88 / -0 行
- `docs/en/specdojo/samples/prj-issues-and-approach-sample.md`: 追加、+98 / -0 行
- `docs/en/specdojo/samples/prj-overview-sample.md`: 追加、+120 / -0 行
- `docs/en/specdojo/samples/sf-index-sample.md`: 追加、+70 / -0 行
- `docs/en/specdojo/templates/br-template.md`: 追加、+68 / -0 行
- `docs/en/specdojo/templates/pjr-change-request-template.md`: 追加、+70 / -0 行
- `docs/en/specdojo/templates/pjr-decision-template.md`: 追加、+65 / -0 行
- `docs/en/specdojo/templates/pjr-dependent-items-template.md`: 追加、+26 / -0 行
- `docs/en/specdojo/templates/pjr-derived-items-template.md`: 追加、+26 / -0 行
- `docs/en/specdojo/templates/pjr-epic-items-template.md`: 追加、+26 / -0 行
- `docs/en/specdojo/templates/pjr-epic-template.md`: 追加、+48 / -0 行
- `docs/en/specdojo/templates/pjr-handoff-template.md`: 追加、+47 / -0 行
- `docs/en/specdojo/templates/pjr-handoffs-template.md`: 追加、+30 / -0 行
- `docs/en/specdojo/templates/pjr-index-template.md`: 追加、+54 / -0 行
- `docs/en/specdojo/templates/pjr-issue-template.md`: 追加、+60 / -0 行
- `docs/en/specdojo/templates/pjr-note-template.md`: 追加、+39 / -0 行
- `docs/en/specdojo/templates/pjr-question-template.md`: 追加、+63 / -0 行
- `docs/en/specdojo/templates/pjr-risk-template.md`: 追加、+59 / -0 行
- `docs/en/specdojo/templates/pjr-todo-template.md`: 追加、+51 / -0 行
- `docs/en/specdojo/templates/pjr-views-by-owner-template.md`: 追加、+26 / -0 行
- `docs/en/specdojo/templates/pjr-views-by-priority-template.md`: 追加、+26 / -0 行
- `docs/en/specdojo/templates/pjr-views-by-status-template.md`: 追加、+26 / -0 行
- `docs/en/specdojo/templates/prj-issues-and-approach-template.md`: 追加、+91 / -0 行
- `docs/en/specdojo/templates/prj-overview-template.md`: 追加、+103 / -0 行

## 3. 申し送り

- 英語版は日本語と同じ論理 ID を維持する。ID 標準との整合と参照の維持を理由に、英語専用 ID・名前空間は採用しなかった。型照合では `.specdojo/index-config.yaml` の `locales` に従い同じ言語を優先し、無ければ宣言順で最初に存在する言語へ戻る。同一言語の重複、言語中立 ID との衝突、未修飾参照の曖昧さは検出を維持する。個票5.4に記録済み。
- 親 runner が lint・型検査・テスト・全体スキーマ検証を実行する。前回失敗した Markdown と frontmatter lint の再評価、および追加した言語解決の回帰テストの結果を確認すること。executor では指定された親検証を重複実行していない。
- `npm run docs:build` は保護された `.specdojo/doc-index.json` を更新するためホスト側で実行する。他の重い処理と重ねず、英語入口・両ガイド・5つの型の描画とリンクを確認すること。個票の作業6は理由付きで open とした。
- PJR-BXYM は review 中だが、再開指示に従い統合済みの5つの型を翻訳した。人の確認後に組や本文が変わった場合は翻訳追従 todo を起票し、各文書の `translated_from.commit` から正本の差分を確認して英語文書・入門ガイド・入口を更新する。個票に記録済み。
- CLI の `kata_locale`・`init` の質問と `--kata-locale`・`kata list` の LOCALE 列は設計決定のみで、実装は後続項目とする。npm 配布には保護された `package.json` の files への英語文書追加が必要。LANG による既定値と案内言語の切り替えは未決事項として個票に記録した。
- result は reporter が記入する。CHANGELOG に集める Added・Fixed の文案は個票5.2に記録済み。登録簿と個票のステータスは変更していない。検証用の一時ファイルは削除済み。
- 人の確認が必要: `npm run docs:build`（保護された文書索引を更新するため、ホスト側でビルドと表示確認が必要。）

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
