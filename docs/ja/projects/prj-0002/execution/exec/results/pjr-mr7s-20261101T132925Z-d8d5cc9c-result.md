---
specdojo:
  id: prj-0002:xer-pjr-mr7s-20261101t132925z-d8d5cc9c
  type: exec-result
  task_id: PJR-MR7S
  mode: edit
  status: complete
  project_id: prj-0002
  origin: register
  plan_ref: exec/plans/pjr-mr7s-20261101T132925Z-d8d5cc9c-plan.md
  started_at: "2026-11-01T13:29:25.416Z"
  completed_at: "2026-11-01T13:43:11.419Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- LP（Landing Page）の「これから」セクションに、Kata・Waza・Ryu の役割に関する説明を追記しました。
- 既存の PDCA 表との整合性をとりつつ、`routine` + `job` の表記への統一および説明文の修正を行いました。
- 個票 `pjr-mr7s-lp-roadmap-kata-waza-ryu.md` を更新し、対応結果を記録しました。

## 2. 変更ファイル

- `specdojo-lp:src/components/sections/Roadmap.astro`: 「これから」セクション内の `routine` + `Job` という表記を、指示通り `routine` + `job` へと統一し、Kata・Waza・Ryu の役割説明を追加しました。

## 3. 申し送り

- reporter／runner は result に今回の修正内容・変更ファイル・検証結果を反映する。変更ファイルは specdojo-lp:src/components/sections/Roadmap.astro と docs/ja/projects/prj-0002/controls/project-register/pjr-mr7s-lp-roadmap-kata-waza-ryu.md。
- 今回の実画面確認は `requires_human`。sandbox 外で PC（1440px）・スマホ（390px）の行名と Waza 説明の折り返し・横はみ出しを確認する。個票5.4の表示確認は今回の修正前の記録。
- 今回の実画面確認は `requires_human`。sandbox 外で PC（1440px）・スマホ（390px）の行名と Waza 説明の折り返し・横はみ出しを確認する。個票5.4の表示確認は今回の修正前の記録。
- 適用外の検証: `node --import tsx src/specdojo.ts catalog validate --project prj-0002`（対象プロジェクト prj-0002 に `catalog_path` が設定されていない。）
- 適用外の検証: `npm run validate:schema:file`（今回変更したファイルに YAML ファイルがない。）
- 人の確認が必要: `node /tmp/pjr-mr7s-preview.mjs`（sandbox がローカルサーバー起動を listen EPERM で拒否。PC・スマホの実画面確認を sandbox 外で実施する。）

## 4. 進め方

まず、LP のソースコード `src/components/sections/Roadmap.astro` を編集し、指示された通り `routine` + `job` への表記統一と、Kata（型）・Waza（技）・Ryu（流）の役割に関する説明の追記を行いました。その後、個票ファイル `docs/ja/projects/prj-0002/controls/project-register/pjr-mr7s-lp-roadmap-kata-waza-ryu.md` を更新して、実施内容と結果を記録しました。検証については、Astro の静的ビルドおよび生成された HTML に対する文字列検索により、意図した通りの表記と内容が含まれていることを確認しています。
