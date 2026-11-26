---
specdojo:
  id: prj-0001:xer-pjr-ndm7-20261126t210227z-31032992
  type: exec-result
  task_id: PJR-NDM7
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-NDM7/pjr-ndm7-20261126T210227Z-31032992/plan.md
  started_at: "2026-11-26T21:02:28.049Z"
  completed_at: "2026-11-26T21:03:58.368Z"
  agent: sonnet-executor
---

# Edit Result

## 1. 実施内容

- imp-interface-sample の印字の波及先を ifx-cmd-sample の wikilink に置換し、grep で旧 ID が 0 件であることを確認した。個票の対応結果を更新した。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/imp-interface-sample.md`: 変更、+6 / -6 行

## 3. 申し送り

- `ifx-cmd-sample` は YAML sample で H1 がないため、wikilink の表示名は `title` の「レシート印刷コマンド連携仕様」にした（他の sample と同じ表示名）。
- `prettier --write` で同じ表の他の行の空白が再整形された。内容の変更は印字の備考の 1 箇所だけ。
- `npm run lint:fm`・`npm run lint:md` は親 runner の検査のため executor では流していない。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
