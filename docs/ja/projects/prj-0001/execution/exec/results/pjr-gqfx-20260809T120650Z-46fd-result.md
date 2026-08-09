---
specdojo:
  id: prj-0001:xer-pjr-gqfx-20260809t120650z-46fd
  type: exec-result
  task_id: PJR-GQFX
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-gqfx-20260809T120650Z-46fd-plan.md
  started_at: "2026-08-09T12:06:50.143Z"
  completed_at: "2026-08-09T12:15:44.766Z"
  agent: codex-expert-edit-agent
---

# Edit Result

## 1. 実施内容

- `src/register.ts` の個票未記入判定を変更し、Markdown のインラインコードとバッククォート・チルダによるフェンスコードを除外してからプレースホルダを検索するようにした。
- コード範囲外の未記入は従来どおり検出するため、未記入がある個票を誤って `ready` へ昇格させない動作を維持した。
- `tests/src/register.test.ts` に、インラインコード、2 種類のフェンスコード、コード範囲外にも未記入が残る場合の回帰テストを追加した。修正前に新規の正常系 3 件が失敗し、修正後に対象ファイルの全 53 件が成功することを確認した。
- 個票のタイトル・課題説明で記法名をインラインコードとして明示し、対応結果を実施内容で更新した。個票の `status: draft` と `item_status: in-progress` は変更していない。

## 2. 変更ファイル

- `src/register.ts`
- `tests/src/register.test.ts`
- `docs/ja/projects/prj-0001/controls/project-register/pjr-gqfx-todo-marker-false-positive-in-inline-code.md`
- `docs/ja/projects/prj-0001/execution/exec/results/pjr-gqfx-20260809T120650Z-46fd-result.md`

## 3. 申し送り

- `prettier` と対象 Markdown の `markdownlint`、`npm run typecheck`、対象テスト 53 件、`register build`、`catalog validate`、`index build` は成功した。`catalog validate` の出力は既存成果物の未生成参照に関する warning のみだった。
- 実データに対する `register close --project prj-0001 --id PJR-GQFX --dry-run` で、コード表記を含む対象個票が警告なく `ready` への更新予定として判定されることを確認した。dry-run のため登録簿と個票の状態は変更していない。
- `npm test` は 953 件中 937 件が成功した。失敗した 16 件は worktree 系テスト内で `git` を起動すると実行環境の制約により `spawnSync git EPERM` となるもので、今回変更した register 判定の失敗ではない。
- 規定の `npx tsx src/specdojo.ts register build` は実行環境の IPC 制約により `listen EPERM` となったため、同じ TypeScript ローダーを IPC なしで起動する `node --import tsx src/specdojo.ts register build` で代替し、生成成功を確認した。`catalog validate` と `index build` も同じ起動方法で成功した。
- 登録項目の review / close と個票の `ready` への状態遷移は runner と人間が行う。

## 4. 進め方と実践の型の適用

本タスクは `rulebook: none` の register 起点の不具合修正であるため、個票の完了条件を作業基準にした。関連設計として [[specdojo:pjr-rulebook|プロジェクト登録簿 作成ルール]] の個票 status 遷移基準と [[specdojo:register-operation-guide|プロジェクト登録簿 運用ガイド]] を確認し、通常本文の未記入を検出して `ready` への昇格を止める既存要件を維持した。現行実装の `ticketBodyHasTodo` と `updateTicketStatusForItem`、既存の status 遷移テストを根拠に、Markdown のコード範囲だけを検索対象から外す最小変更とした。専用の rulebook / recipe / sample / template は plan で指定されておらず、実践の型の変更も必要ないため、Skill は適用していない。
