---
specdojo:
  id: prj-0001:xer-t-kata-slim-br-task-selection-strategy-050-20261117t195513z-7f3d6737
  type: exec-result
  task_id: T-KATA-SLIM-br-task-selection-strategy-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-br-task-selection-strategy-050/T-KATA-SLIM-br-task-selection-strategy-050-20261117T195513Z-7f3d6737/plan.md
  started_at: "2026-11-17T19:55:22.062Z"
  completed_at: "2026-11-17T20:22:44.760Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - br-task-selection-strategy
    - specdojo:br-sample
---

# Edit Result

## 1. 実施内容

- `docs/ja/specdojo/samples/br-sample.md` を削り、運用の記述と同じ判断の言い直しを外した。空白を除く文字数は 2,996 から 2,077 になり、約 69% で目安の 7 割以下に収まった。
- 外した記述は、メモ / 将来課題の店主代表への業務承認依頼の段落である。役割の段落、検証の表の文書品質の行、未決事項の表の管理台帳の列は、もともと sample になかった。
- 入力・判定例・出力・例外で重なっていた言い直しを、1 か所の表と段落にまとめた。判定の基準・値・例外・未決事項の結論は変えていない。
- recipe・template・rulebook は変えていない。br-recipe と br-template に同じ運用の記述は見当たらず、変更案はない。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/br-sample.md`: 業務承認依頼の段落を削除した。入力の表の欠損時 `E-01`、R-01 の確認順、判定例の「判定値を返さない」、例外の表の「判定せず」「再判定する」、出力の正常時の段落、概要と出力で重なる「発注を確定しない」といった言い直しを整理し、出力側に残した。判定例は 11 行から 9 行にし、結論が同じ 14 / 3 / 10（不足なし）と 0 / 0 / 1（不足）を外した。40 行追加・52 行削除。

## 3. 申し送り

- `docs/ja/specdojo/samples/br-sample.md` の判定例を 11 行から 9 行にした。外したのは結論が重複する 2 行で、判定の結論は変わらない。
- docs 向けの `lint:md`・`lint:fm`・`validate:schema` と、単体テスト・統合テストは通過している。`lint:ts` と `typecheck` は変更種別により非適用である。
- 文字数（空白を除く）: 変更前 2,996、変更後 2,077（約 69%）。
- 外した記述: メモ / 将来課題の店主代表への業務承認依頼の段落（承認の段落にあたる）。役割の段落・検証の表・未決事項の表の管理台帳の列は、もともと sample になかった。
- まとめた言い直し: 入力の表の欠損時 `E-01`、R-01 の確認順（例外 / 異常系を参照）、判定例の『判定値を返さない』、例外の表の『判定せず』『再判定する』、出力の正常時の段落、概要と出力で重なる『発注を確定しない』（出力側に残した）。
- 判定例を 11 行から 9 行にした。外したのは結論が同じ 14 / 3 / 10（不足なし）と 0 / 0 / 1（不足）。判定の結論は変えていない。
- recipe・template・rulebook は変えていない。br-recipe と br-template に、この sample と同じ運用の記述は見当たらなかったため、変更案はない。

## 4. 進め方と実践の型の適用

sample-maintenance の手順で、直した rulebook と sld の試行を手本に、br-sample.md から運用の記述と同じ判断の言い直しを外した。成果物本体と、recipe・template・rulebook は変更していない。finding の展開はなく、根拠不足による見送りもない。文字数は変更前 2,996、変更後 2,077（約 69%）である。
