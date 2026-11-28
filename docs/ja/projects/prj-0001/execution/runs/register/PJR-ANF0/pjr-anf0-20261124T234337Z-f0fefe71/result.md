---
specdojo:
  id: prj-0001:xer-pjr-anf0-20261124t234337z-f0fefe71
  type: exec-result
  task_id: PJR-ANF0
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-ANF0/pjr-anf0-20261124T234337Z-f0fefe71/plan.md
  started_at: "2026-11-24T23:43:38.588Z"
  completed_at: "2026-11-24T23:52:36.527Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- reporter の edit の出力に任意の欄 `findings`（`no`・`stage`・`location`・`finding`・`fix`・`basis`・`mark`）を足し、runner がそれを result の実施内容の後に Markdown の表として 1 回だけ描く（セルの `|` と改行を正規化）ようにした。欄が無い出力は今までどおり描く。reporter の prompt、公開 schema、kata-guide の `人への報告の形`、2 つの strategy の段 R1〜R5 の `description` を新しい欄に合わせ、単体テストを足し、個票の作業内容・対応結果を更新した。

## 2. 変更ファイル

- `docs/ja/projects/prj-0001/schedule/sch-strategy-kata-review-all.yaml`: 変更、+5 / -5 行
- `docs/ja/projects/prj-0001/schedule/sch-strategy-kata-review-calibration.yaml`: 変更、+5 / -5 行
- `docs/ja/specdojo/guides/kata-guide.md`: 変更、+2 / -1 行
- `docs/specdojo/schemas/v1/exec-reporter-output.schema.yaml`: 変更、+26 / -0 行
- `src/exec/reporter-output.ts`: 変更、+61 / -1 行
- `src/exec/reporter.ts`: 変更、+6 / -1 行
- `src/exec/results.ts`: 変更、+25 / -0 行
- `tests/src/exec/reporter.test.ts`: 変更、+83 / -0 行
- `tests/src/exec/results.test.ts`: 変更、+90 / -0 行

## 3. 申し送り

- 欄の名前は `findings` とし、列のキーは英語の `no`・`stage`・`location`・`finding`・`fix`・`basis`・`mark` にした。既存の欄のキーが英語で、表の見出しは runner が日本語で付けるため。kata-guide の列の順に合わせた。`fix` と `mark` も必須とし、値が無いときは `-` を書かせる。
- 表は `## 1. 実施内容` の箇条書きの後に置き、章は足していない。result の template と既存の result の章立てを変えないため。欄は edit の形だけに足した（レビューの段は edit の plan で流れるため）。
- executor の報告の形（`handoff` に 1 件ずつ書く）は変えていない。このため runner が `evidence.handoff` を `申し送り` に機械的に残し、指摘が箇条書きにも出る（表は 1 回だけ）。重ねたくない場合は、executor の envelope に構造の欄を足す変更を別の項目で扱う。
- R4 の「主張ごとの確かめの表」は今も reporter の自由記述として描かれ 1 行に詰まる。同じ形の構造の欄が要るかは R4 の result を見て判断する。
- 統合後の確認（個票の作業内容 No 6）はオーケストレーターが行う。PJR-0BGE の auto loop が止まっている間に統合し、レビューの段を 1 件 `exec run` で流して、指摘が Markdown の表として 1 回だけ描かれることを確かめてから close する。
- CHANGELOG に書く事項（個票の対応結果にも記載）: 区分 Changed。文案「`exec` の reporter の edit の出力に任意の欄 `findings`（`no`・`stage`・`location`・`finding`・`fix`・`basis`・`mark`）を足し、runner が result の実施内容の後に指摘の表として描くようにした。欄の無い出力は今までどおり描く（PJR-ANF0）。」
- 保護された設定（`.specdojo/`・`.claude/` など）は変えていない。変更案もない。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
