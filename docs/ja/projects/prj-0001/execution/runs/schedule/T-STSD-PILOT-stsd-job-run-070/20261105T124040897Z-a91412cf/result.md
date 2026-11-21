---
specdojo:
  id: prj-0001:xer-t-stsd-pilot-stsd-job-run-070
  type: exec-result
  task_id: T-STSD-PILOT-stsd-job-run-070
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-STSD-PILOT-stsd-job-run-070/20261105T124040897Z-a91412cf/plan.md
  started_at: "2026-11-05T12:40:42.792Z"
  completed_at: "2026-11-05T12:56:05.579Z"
  agent: sol-executor
  execution: agent
  approach: fully-guided
  targets:
    - stsd-job-run
---

# Edit Result

## 1. 実施内容

- Job Run の「実行中」(`running`) の定義を、実装の振る舞いに合わせて修正しました。
- `src/job/job.ts` の `materializeJobRun` において、過去の失敗結果を保持したまま新しい試行を追加するという挙動に基づき、既存の概要・遷移説明との整合性を確保しました。
- 対象成果物の整形と差分検査を完了しました。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/020-data-model/stsd-job-run.md`: Job Run の状態一覧における `running` の定義を、実装の仕様（過去の試行結果を保持した状態での新規試行追加）に合わせて修正しました。

## 3. 申し送り

- 変更ファイルは `docs/ja/product/010-business-specs/020-data-model/stsd-job-run.md` のみ。状態一覧の `running` の意味を修正した。`src/job/job.ts` の `materializeJobRun` が過去の失敗結果を保持して新しい試行を追加すること、および既存の概要・遷移説明との整合が根拠。章構成の変更、削除・統合、新しい仕様の追加は行っていない。
- 進め方と実践の型の適用: 指定の共通規約、AGENTS.md、pm-orchestrator-playbook.md、PJR-PT5N、prj-overview.md、stsd-rulebook.md、stsd-mermaid-rulebook.md、stsd-recipe.md、stsd-sample.md、対象成果物、指定実装2ファイルを参照した。検査条件の判断には package.json、.specdojo/specdojo.config.json、lefthook.yml、Prettier 設定を参照した。
- 主 rulebook を必須構造・状態と遷移の定義、Mermaid rulebook を記法・分割基準、recipe を境界・一意判定・図表照合の確認に使用した。sample は形式参照に限り、既存構成を優先した。実践の型の欠落や矛盾はなかった。5状態・7遷移の対応と到達性を確認し、実行中への接続遷移数が6を超えるため2図を維持した。
- プロジェクトの Why は、人と AI Agent が試行履歴を引き継ぐという既存の利用目的と整合しており、再掲しなかった。template、未宣言のプロジェクト文書・実装、外部情報は参照していない。`based_on` と `status: draft` は維持した。
- `depends_on` の `prj-0001:bdd-job-run` は未作成のため本文を参照できない。部分成功・処理不要の業務境界、成功の受入条件、呼出元の状態選択、安全な再試行と残留試行の扱い、結果訂正の可否は推測で具体化せず、決定者・決定時期を持つ既存の検討メモを維持した。業務データ辞書の策定と各方針の合意後に照合する。
- result は executor/reporter pipeline の指示に従い編集していない。reporter は上記の変更内容・判断根拠・未決事項を result に転記する。指定された lint・schema・型検査・テストは親 runner の実行に委ねた。
- 適用外の検証: `npm run validate:schema:file`（変更は Markdown のみで、YAML ファイルの変更がない。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は docs/ja/product/ 配下のみで、docs/ja/projects/ 配下の成果物変更がない。）
- 適用外の検証: `npm run validate:history-links`（登録簿、既存の実行計画、実行結果を変更していない。）

## 4. 進め方と実践の型の適用

既存の成果物をベースに、実装エビデンス（`src/job/job.ts`, `src/job/definition.ts`）に基づいた厳密な磨き込みを行いました。特に、Job Run のステータス `running` に関する定義について、実装の挙動（過去の試行結果を維持した上での試行追加）との整合性を図る修正を実施しました。章構成や既存の記述の枠組みは維持し、情報の不足や不整合の解消に最小限の修正を適用しています。
