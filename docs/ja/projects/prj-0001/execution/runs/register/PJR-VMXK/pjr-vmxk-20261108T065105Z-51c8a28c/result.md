---
specdojo:
  id: prj-0001:xer-pjr-vmxk-20261108t065105z-51c8a28c
  type: exec-result
  task_id: PJR-VMXK
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-VMXK/pjr-vmxk-20261108T065105Z-51c8a28c/plan.md
  started_at: "2026-11-08T06:51:15.746Z"
  completed_at: "2026-11-08T07:15:01.060Z"
  agent: flash-high-executor
  approach: rulebook-authoring
  targets:
    - specdojo:clis-rulebook
---

# Edit Result

## 1. 実施内容

- CLI 仕様（`clis`）の型を新設し、`specdojo:clis-rulebook` および `specdojo:clis-sample` を作成しました。
- 作成した新しい型を、命名標準、成果物リファレンス、サイトのサイドバー構成、およびレビュー観点の設定ファイルへ反映しました。

## 2. 変更ファイル

- `docs/ja/specdojo/defaults/pm-review-viewpoints.yaml`: レビュー観点の設定に `clis` を追加しました。
- `docs/ja/specdojo/references/deliverables-reference.md`: 成果物リファレンスに `clis` の定義を追加しました。
- `docs/ja/specdojo/standards/id-and-file-naming-standard.md`: ID およびファイル命名の標準に `clis` を追加しました。
- `packages/docs-site/.vitepress/sidebar-config.ts`: ドキュメントサイトのサイドバー構成に `clis` を追加しました。
- `docs/ja/specdojo/rulebooks/clis-rulebook.md`: `specdojo:clis-rulebook` を新規作成しました。
- `docs/ja/specdojo/samples/clis-sample.md`: `specdojo:clis-sample` を新規作成しました。

## 3. 申し送り

- CLI 仕様（`clis`）の型新設に伴う決定事項: `recipe` および `template` はコマンド群の業務目的に応じてフローや出力の構造が大きく異なり定型化の必要性が低いため、Frontmatter で `recipe: not-needed`、`template: not-needed` と判断した。PJR-PJYJ で人が要否を最終判断する。
- 保護された設定（`.specdojo/`、`package.json`、`.agents/` など）における種類一覧の変更対象は存在せず、変更提案なし。
- CHANGELOG に書く事項: [追加] CLI 仕様（`clis`）の型を新設し、コマンドリファレンスを参照して操作の流れ・出力と生成ファイル要点・終了コード・エラー表示と利用者の次の手を記述する `rulebook` と `sample` を追加（`specdojo:clis-rulebook`, `specdojo:clis-sample`）
- 後続タスクへの申し送り: `uis` の型および `prj-0001` のカタログは本タスクの制約に従い変更していない。後続タスク（PJR-PJYJ）にて `uis` からの CLI 記述の分離確認および必要な場合のカタログ反映・実成果物への適用を判断する。
- CLI仕様（clis）の型新設に伴う決定事項: recipe および template はコマンド群の業務目的に応じてフローや出力の構造が大きく異なり定型化の必要性が低いため、Frontmatter で recipe: not-needed、template: not-needed と判断した。PJR-PJYJ で人が要否を最終判断する。
- 保護された設定（.specdojo/、package.json、.agents/ など）における種類一覧の変更対象は存在せず、変更提案なし。
- CHANGELOG に書く事項: [追加] CLI 仕様（clis）の型を新設し、コマンドリファレンスを参照して操作の流れ・出力と生成ファイル要点・終了コード・エラー表示と利用者の次の手を記述する rulebook と sample を追加（specdojo:clis-rulebook, specdojo:clis-sample）
- 後続タスクへの申し送り: uis の型および prj-0001 のカタログは本タスクの制約に従い変更していない。後続タスク（PJR-PJYJ）にて uis からの CLI 記述の分離確認および必要な場合のカタログ反映・実成果物への適用を判断する。

## 4. 進め方と実践の型の適用

新しく定義された `clis` 型の `rulebook` と `sample` を作成し、SpecDojo のエコシステム全体（命名標準、リファレンス、サイドバー、レビュー観点）にその存在を組み込みました。既存の `uis` 成果物から CLI 関連の記述を分離するための準備工程となります。
