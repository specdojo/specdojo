---
specdojo:
  id: prj-0001:xer-pjr-f4mg-20261127t135541z-cf9c48cc
  type: exec-result
  task_id: PJR-F4MG
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-F4MG/pjr-f4mg-20261127T135541Z-cf9c48cc/plan.md
  started_at: "2026-11-27T13:57:31.771Z"
  completed_at: "2026-11-27T14:39:18.753Z"
  agent: opus-executor
  block_reason: "parent validation failed: lint-md-changed, lint-fm-changed, lint-fm"
---

# Edit Result

## 1. 実施内容

- README、文書サイトの入口、クイックスタート、入門の型の組（5 つの型）について、英語版 34 文書を `docs/en/specdojo/` 配下に新規作成しました。入門の型の組は PJR-BXYM で決まった `civic-tech-starter-guide` を正としています。
- 英語入口として `README.md`、`docs/index.md`、`docs/en/index.md` を更新しました。あわせて、英語版の追加に必要な `.remarkrc.yaml`、命名標準、共通 frontmatter スキーマも更新しました。
- executor の検証は、整形、スキーマ検証、履歴リンク検査、catalog 検証、`register build`、英語範囲の照合（34 文書、実リンク 66 件）、`git diff --check` が成功しました。`npm run docs:build` は、書き込み禁止の文書索引を更新するためホスト側での実行が必要です。
- 親 runner の検証では、`lint:md:changed` が `docs/en/specdojo/guides/quick-start-guide.md` の 26 行目で MD028（引用ブロック内の空行）を報告し、失敗しました。`lint:fm:changed` と `lint:fm` は、`frontmatter-deliverable-type` の警告が残る状態で失敗しました。報告された警告は、`specdojo.type: rulebook specdojo:&lt;id&gt;-rulebook is ambiguous` の形式です。`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` は成功しました。

## 2. 変更ファイル

- `.remarkrc.yaml`: 英語版文書を lint の対象にするため設定を更新しました。
- `README.md`: 英語版への入口を追加しました。
- `docs/en/index.md`: 英語版の文書サイト入口を更新しました。クイックスタートと入門ガイドへ案内します。
- `docs/index.md`: 文書サイトのトップに英語版への導線を追加しました。
- `docs/ja/specdojo/standards/id-and-file-naming-standard.md`: 英語版文書の ID とファイル名の扱いを命名標準に反映しました。
- `docs/specdojo/schemas/v1/common-frontmatter.schema.yaml`: 英語版の翻訳元を表す frontmatter 項目を共通スキーマに追加しました。JSON Schema 2020-12 で検証済みです。
- `docs/en/specdojo/guides/civic-tech-starter-guide.md`: 入門の型の組（5 つの型）を説明する英語版ガイドを新規作成しました。
- `docs/en/specdojo/guides/quick-start-guide.md`: クイックスタートの英語版を新規作成しました。26 行目に MD028 の指摘があります。
- `docs/en/specdojo/recipes/br-recipe.md`: br の recipe の英語版を新規作成しました。
- `docs/en/specdojo/recipes/prj-issues-and-approach-recipe.md`: prj-issues-and-approach の recipe の英語版を新規作成しました。
- `docs/en/specdojo/recipes/prj-overview-recipe.md`: prj-overview の recipe の英語版を新規作成しました。
- `docs/en/specdojo/rulebooks/br-rulebook.md`: br の rulebook の英語版を新規作成しました。
- `docs/en/specdojo/rulebooks/pjr-rulebook.md`: pjr の rulebook の英語版を新規作成しました。
- `docs/en/specdojo/rulebooks/prj-issues-and-approach-rulebook.md`: prj-issues-and-approach の rulebook の英語版を新規作成しました。
- `docs/en/specdojo/rulebooks/prj-overview-rulebook.md`: prj-overview の rulebook の英語版を新規作成しました。
- `docs/en/specdojo/rulebooks/sf-index-rulebook.md`: sf-index の rulebook の英語版を新規作成しました。
- `docs/en/specdojo/samples/br-sample.md`: br の sample の英語版を新規作成しました。
- `docs/en/specdojo/samples/prj-issues-and-approach-sample.md`: prj-issues-and-approach の sample の英語版を新規作成しました。
- `docs/en/specdojo/samples/prj-overview-sample.md`: prj-overview の sample の英語版を新規作成しました。
- `docs/en/specdojo/samples/sf-index-sample.md`: sf-index の sample の英語版を新規作成しました。
- `docs/en/specdojo/templates/br-template.md`: br の template の英語版を新規作成しました。
- `docs/en/specdojo/templates/pjr-change-request-template.md`: pjr の変更要求 template の英語版を新規作成しました。
- `docs/en/specdojo/templates/pjr-decision-template.md`: pjr の decision template の英語版を新規作成しました。
- `docs/en/specdojo/templates/pjr-dependent-items-template.md`: pjr の依存項目 template の英語版を新規作成しました。
- `docs/en/specdojo/templates/pjr-derived-items-template.md`: pjr の派生項目 template の英語版を新規作成しました。
- `docs/en/specdojo/templates/pjr-epic-items-template.md`: pjr の epic 項目 template の英語版を新規作成しました。
- `docs/en/specdojo/templates/pjr-epic-template.md`: pjr の epic template の英語版を新規作成しました。
- `docs/en/specdojo/templates/pjr-handoff-template.md`: pjr の申し送り template の英語版を新規作成しました。
- `docs/en/specdojo/templates/pjr-handoffs-template.md`: pjr の申し送り一覧 template の英語版を新規作成しました。
- `docs/en/specdojo/templates/pjr-index-template.md`: pjr の登録簿 index template の英語版を新規作成しました。
- `docs/en/specdojo/templates/pjr-issue-template.md`: pjr の issue template の英語版を新規作成しました。
- `docs/en/specdojo/templates/pjr-note-template.md`: pjr の note template の英語版を新規作成しました。
- `docs/en/specdojo/templates/pjr-question-template.md`: pjr の question template の英語版を新規作成しました。
- `docs/en/specdojo/templates/pjr-risk-template.md`: pjr の risk template の英語版を新規作成しました。
- `docs/en/specdojo/templates/pjr-todo-template.md`: pjr の todo template の英語版を新規作成しました。
- `docs/en/specdojo/templates/pjr-views-by-owner-template.md`: pjr の担当者別ビュー template の英語版を新規作成しました。
- `docs/en/specdojo/templates/pjr-views-by-priority-template.md`: pjr の優先度別ビュー template の英語版を新規作成しました。
- `docs/en/specdojo/templates/pjr-views-by-status-template.md`: pjr の状態別ビュー template の英語版を新規作成しました。
- `docs/en/specdojo/templates/prj-issues-and-approach-template.md`: prj-issues-and-approach の template の英語版を新規作成しました。
- `docs/en/specdojo/templates/prj-overview-template.md`: prj-overview の template の英語版を新規作成しました。

## 3. 申し送り

- 親 runner の `lint:md:changed` は `docs/en/specdojo/guides/quick-start-guide.md` の 26 行目（MD028）で失敗しています。`lint:fm:changed` と `lint:fm` も失敗しており、`frontmatter-deliverable-type` の警告が原因として報告されています。evidence には、これらの失敗に対する修正は記録されていません。
- `lint:fm` の実行ログは 411749 バイトあり、evidence では一部が省略されています。そのため、警告のうち英語版の追加が原因のものがどれだけあるかは、evidence からは判断できません。
- `npm run docs:build` は `.specdojo/doc-index.json` を更新するためsandboxでは実行していません。ホスト側で実行し、英語入口・両ガイド・5つの型のリンクと描画を確認してください。個票の作業6は理由付きでopenです。
- npm配布には保護された `package.json` の `files` に `docs/en/specdojo` と `!docs/en/specdojo/**/generated/**` を追加する必要があります。executorでは変更していません。
- `kata_locale`、`init` の質問と `--kata-locale`、`kata list` の `LOCALE` 列は後続項目で実装してください。登録簿の日本語固定表記も確認対象です。OS言語による既定値とCLI・オーケストレーターの言語切替は未決として個票に記録しました。
- PJR-BXYMのreviewで組や本文が変わった場合は、翻訳追従todoを起票し、各文書の `translated_from.commit` から日本語差分を照合して構成ファイル・入門ガイド・英語入口を更新します。この扱いは個票にも記録しました。
- 人の確認が必要: `npm run docs:build`（書き込み禁止の文書索引を更新するため、ホスト側での実行が必要です。）

## 4. 進め方

個票と、PJR-BXYM で決まった入門の型の組を基準にして、英語版の範囲を決めました。範囲は README、文書サイトの入口、クイックスタート、入門の型の組（5 つの型）の rulebook、recipe、sample、template です。翻訳元の commit を各文書の frontmatter に記録しました。検証は整形、スキーマ検証、リンク照合、登録簿のビルドで行いました。sandbox では `npm run docs:build` を実行できませんでした。
