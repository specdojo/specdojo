---
specdojo:
  id: prj-0001:xer-pjr-e73z-20261123t043039z-44fc5dac
  type: exec-result
  task_id: PJR-E73Z
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-E73Z/pjr-e73z-20261123T043039Z-44fc5dac/plan.md
  started_at: "2026-11-23T04:30:40.916Z"
  completed_at: "2026-11-23T04:47:57.675Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- specdojo build --skip-fresh を追加し、docs:generate:fresh（specdojo-docs-site generate --skip-if-fresh）を段ごとの判定にした。個票を 1 件直した後は 13.7 秒から 11.1〜11.4 秒、何も変えていない後は 0.15 秒から 0.58 秒。全段を流す specdojo build は変えていない。

## 2. 変更ファイル

- `docs/ja/specdojo/references/command-reference.md`: 変更、+2 / -0 行
- `packages/docs-site/bin/specdojo-docs-site.js`: 変更、+5 / -13 行
- `src/commands/build.ts`: 変更、+102 / -17 行
- `src/commands/build-freshness.ts`: 追加、+477 / -0 行
- `tests/src/commands/build-freshness.test.ts`: 追加、+266 / -0 行

## 3. 申し送り

- 判断: 判定の方法は内容のハッシュでなく、入力ファイルのパス・サイズ・更新時刻の一覧のハッシュにした。約 17,000 ファイルを毎回読むと速くならないため。更新時刻は同じかどうかで比べるので、消したファイルや checkout で戻ったファイルも変化として拾う。
- 判断: catalog・register・dashboard・index の入力は docs/ 全体にした（狭めると取り違える恐れがあるため）。catalog だけは登録簿のディレクトリを外した。yaml-pages の入力は YAML だけ。CLI の実装が変わると全段を作り直す。exec・register・dashboard は日付が変わると作り直す。
- 判断: 記録は `node_modules/.cache/specdojo/build-steps.json` に置いた。保護された .specdojo/ と .gitignore を変えずに済むため。`node_modules` の無い repo では記録せず、毎回全段を流す。
- 判断: repos か `external_projects` を宣言した構成では入力が repo の外に及ぶので、毎回全段を作り直す。
- 何も変えていない場合は 0.15 秒から 0.58 秒になった（tsx の起動と走査）。前の判定はファイルの削除・日付の変わり目・生成物の欠けを取り違えていたため、この差は受け入れた。dist がある場合の時間は測っていない（run の最中に npm run build をしない運用のため）。
- 保護された設定の変更は不要。package.json の docs:generate:fresh はそのままで新しい判定を使う。CHANGELOG.md は変えず、文案（区分 Changed）は個票の対応結果に書いた。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
