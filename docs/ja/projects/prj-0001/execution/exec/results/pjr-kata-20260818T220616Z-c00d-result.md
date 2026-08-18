---
specdojo:
  id: prj-0001:xer-pjr-kata-20260818t220616z-c00d
  type: exec-result
  task_id: PJR-KATA
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-kata-20260818T220616Z-c00d-plan.md
  started_at: "2026-08-18T22:06:28.238Z"
  completed_at: "2026-08-18T22:29:49.024Z"
  agent: claude-expert-executor
---

# Edit Result

## 1. 実施内容

- sch-assessment-&lt;track&gt;.yaml のスキーマ、成果物・Kata（rulebook/recipe/sample/template）の存在・状態・内容利用可能性・既存実装エビデンス有無を判定するagent処理、推奨フロー判定規則、CLI（schedule assessment）を実装した。
- 関連ガイド（kata-guide、ryu-guide、schedule-design-guide）、command-reference、directory-layout-reference、sch-rulebook を更新し、判定機能の利用方法・出力形式を反映した。
- 新規テスト46件を含む単体テストがすべて通過し、typecheck・ESLint・prettier・markdownlint・frontmatter検証・schema検証・catalog validate・register build・exec refresh・index build・history-links検証がすべて成功した。
- 個票（pjr-kata-artifact-kata-readiness-assessment.md）を実施内容で更新した。

## 2. 変更ファイル

- `docs/ja/projects/prj-0001/controls/project-register/pjr-kata-artifact-kata-readiness-assessment.md`: 作業内容・対応結果セクションを本タスクの実施内容で更新した。
- `docs/ja/specdojo/guides/kata-guide.md`: 成果物・Kata判定機能に関する追記を行った。
- `docs/ja/specdojo/guides/ryu-guide.md`: 判定機能・推奨フローに関する記述を更新した。
- `docs/ja/specdojo/guides/schedule-design-guide.md`: sch-assessment の生成・利用手順を追記した。
- `docs/ja/specdojo/references/command-reference.md`: 新規 schedule assessment CLI コマンドのリファレンスを追加した。
- `docs/ja/specdojo/references/directory-layout-reference.md`: sch-assessment-&lt;track&gt;.yaml の配置先を反映した。
- `docs/ja/specdojo/rulebooks/sch-rulebook.md`: sch-assessment 成果物に関する規約を追記した。
- `src/kata.ts`: Kata 判定処理向けの拡張を行った。
- `src/schedule.ts`: 成果物・Kata の利用可能性と推奨フロー判定ロジックを実装し、既存コマンドへ統合した（+276行）。
- `tests/src/schedule-command.test.ts`: 既存 schedule コマンドテストを新機能に合わせて更新した。
- `docs/specdojo/schemas/v1/sch-assessment.schema.yaml`: sch-assessment-&lt;track&gt;.yaml の新規スキーマを追加した。
- `src/schedule-assessment-prompt.ts`: agent 判定用プロンプト生成処理を新規実装した。
- `src/schedule-assessment.ts`: 事実収集・agent判定境界・推奨フロー判定規則の中核ロジックを新規実装した。
- `tests/src/schedule-assessment-command.test.ts`: 新規 CLI（schedule assessment）のテストを追加した。
- `tests/src/schedule-assessment.test.ts`: 判定ロジックの単体テストを新規追加した。

## 3. 申し送り

- プロジェクト実データ（sch-assessment-&lt;track&gt;.yaml の実ファイル）の生成は未実施。次アクションとして対象 track を選定し、新規 CLI（schedule assessment）で実データを生成する必要がある。
- package.json への schema 検証 script 追加は、executor の書き込み権限がなく未実施。次アクションとして、npm run validate:schema 相当のフローに sch-assessment.schema.yaml の検証を組み込む script 追加を検討する必要がある。

## 4. 進め方と実践の型の適用

既存の schedule.ts / kata.ts の判定基盤を拡張し、成果物カタログの kind: work を対象に、成果物本体と Kata（rulebook/recipe/sample/template）の存在・文書状態・内容の利用可能性・既存実装エビデンス有無を判定する agent 処理を新規モジュール（schedule-assessment.ts / schedule-assessment-prompt.ts）として実装し、判定結果を track 単位の sch-assessment-&lt;track&gt;.yaml に schema 定義付きで保存する構成とした。
