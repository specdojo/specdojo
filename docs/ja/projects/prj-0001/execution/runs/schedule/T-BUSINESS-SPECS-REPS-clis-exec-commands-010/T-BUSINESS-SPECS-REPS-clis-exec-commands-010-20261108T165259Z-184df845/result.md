---
specdojo:
  id: prj-0001:xer-t-business-specs-reps-clis-exec-commands-010-20261108t165259z-184df845
  type: exec-result
  task_id: T-BUSINESS-SPECS-REPS-clis-exec-commands-010
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-BUSINESS-SPECS-REPS-clis-exec-commands-010/T-BUSINESS-SPECS-REPS-clis-exec-commands-010-20261108T165259Z-184df845/plan.md
  started_at: "2026-11-08T16:53:00.773Z"
  completed_at: "2026-11-08T17:09:29.273Z"
  agent: sol-executor
  execution: agent
  approach: retrofit
  targets:
    - clis-exec-commands
---

# Edit Result

## 1. 実施内容

- CLI仕様（exec コマンド群）の文書を `draft` 状態で新設し、利用目的、操作フロー、入出力の要点、終了コード、および回復手順を記述しました。
- 実装エビデンスとして `src/exec/commands.ts` を調査し、コマンド定義や対話出力、エラー表示等の現在動作を確認して反映しました。
- プロジェクト文脈に基づき、判断・記録の共有による継承という価値を利用目的に盛り込み、運用ガイドやシステム設計ルールと整合させました。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/040-user-interface-model/clis-exec-commands.md`: CLI仕様（exec コマンド群）を新設し、利用目的、操作の流れ、コマンドリファレンスへの参照、入出力の要点、終了コード、エラー表示、回復手順を定義しました。

## 3. 申し送り

- 判断は「新設」。対象文書が存在せず、成果物カタログにパスと `done_criteria` が定義されていたため。変更ファイルは docs/ja/product/010-business-specs/040-user-interface-model/clis-exec-commands.md のみ。
- 実装エビデンス src/exec/commands.ts を全771行参照した。plan の対象指定の排他、状態を変えない生成操作、検証後の refresh、担当・mode による scheduler の選択、対象なしの正常終了、event 由来の status、scaffold・archive・where の出力を確認した。run・resume・cycle・slots・worktree・trial・handoff・記録移行は登録先へ処理が委譲される。
- 一致する内容を、CLIコマンドリファレンス、exec関連運用ガイド、システム設計横断ルールと照合して反映した。編集・レビュー・人による確定の責務、schedule・register・Jobの経路、入力失敗と回復操作の対応を記載した。プロジェクト文脈の判断・記録の共有による継承という価値を利用目的へ反映した。
- 依存先 `clis-index` と外部連携契約 `ifx-cmd-ai-provider-cli` は未作成。内容を推測せず第7章に明記した。作成後にスコープ・用語・参照を照合し、`based_on` と索引からの導線を整える。
- 後続 review finding 候補: `exec validate --schedule-only` は、リファレンスでは schedule・event のみとされるが、commands.ts ではカタログと rulebook の警告検査も実行される。実装の検査範囲を限定するか、文書上の契約を変更するかを判断する別タスクが必要。実装へ無条件に合わせた仕様変更はしていない。
- 後続 review finding 候補: `exec status` は日時列を `claimed_at` と表示する一方、値には最終event日時を使う。本文では最終操作の日時と説明した。表示見出しを実際の意味に合わせる実装修正を候補とする。
- 未確認範囲: 列挙外の実装は調査根拠へ追加していない。状態遷移・ロック・共通エラー処理の内部、run・再開・統合の全分岐、外部agent・Gitの実動作と終了コード伝搬は未確認。該当部分は既存仕様の期待動作を参照し、調査限界を第7章に明記した。
- result の記入は reporter に引き継ぐ。親 runner 指定の lint・schema・typecheck・unit/integration test は重複実行していない。開始時から存在した未追跡の pipeline-state.json は変更していない。
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/product/ 配下のMarkdownのみで、docs/ja/projects/ 配下の成果物を変更していない。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票および既存のplan・resultを変更していない。）
- 適用外の検証: `npm run validate:schema:file`（YAML・YMLファイルの変更がない。）

## 4. 進め方と実践の型の適用

retrofit
