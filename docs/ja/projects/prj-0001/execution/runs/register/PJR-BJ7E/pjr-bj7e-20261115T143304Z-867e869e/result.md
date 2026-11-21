---
specdojo:
  id: prj-0001:xer-pjr-bj7e-20261115t143304z-867e869e
  type: exec-result
  task_id: PJR-BJ7E
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-BJ7E/pjr-bj7e-20261115T143304Z-867e869e/plan.md
  started_at: "2026-11-15T14:44:21.142Z"
  completed_at: "2026-11-15T15:12:23.327Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- pipeline-e2e が揺れる原因は、時間切れになった run が裏で続き、その間に afterEach が fixture を消していたことだった。起動した run の終わりを待ってから片付けるようにし、制限時間を 180 秒に延ばして直した。test-integration の paths は sample・rulebook などの型の文書を外す変更案を個票に書いた。揺らぎが消えたかは、親の検証と次の並走 run で確かめる。

## 2. 変更ファイル

- `tests/src/exec/pipeline-e2e.integration.test.ts`: 変更、+33 / -9 行

## 3. 申し送り

- 変更案（保護設定のため人が反映）: `.specdojo/exec-defaults.yaml` の test-integration の `paths` の `docs/ja/specdojo/**` を `docs/ja/specdojo/{templates,exec-templates,defaults,schemas}/**` に置き換える。rulebooks・samples・recipes・standards・guides・philosophy・references・index.md だけの変更では流さなくなる。理由: これらは `collectDocIndexEntries` で frontmatter の `id` と `type` を集めるときに読まれるだけで、ID の重複や frontmatter の不備は index build・`lint:fm`・`test-unit` が先に見つける。
- 決めたこと: 設定ファイル全体の `testTimeout`（30 秒）は変えず、pipeline-e2e の両方の `describe` だけを 180 秒にした。ほかの統合テストの時間切れの検知を弱めないためである。
- 並走 run の親の検証で、pipeline-e2e の時間切れと `Cannot find module` が再び起きないことを確かめる（executor の sandbox では統合テストを流せない）。
- CHANGELOG: 今回は利用者への影響なし。paths の変更案を反映するときに、型の文書だけの変更では test-integration を流さないことを書く。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
