---
specdojo:
  id: prj-0001:xer-t-kata-review-all-pm-plan-sample-140-20261126t053914z-6bb8e52f
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-pm-plan-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-pm-plan-sample-140/T-KATA-REVIEW-ALL-pm-plan-sample-140-20261126T053914Z-6bb8e52f/plan.md
  started_at: "2026-11-26T05:39:24.813Z"
  completed_at: "2026-11-26T05:47:58.747Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:pm-plan-sample
    - specdojo:pm-plan-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として、pm-plan-sample の事実を成功条件の正本と突き合わせた。初期受入・試用継続・後続観測の条件 ID が成功条件と食い違っていたため、4 か所を成功条件に合わせて直した。
- 参照先の id、章の名前、BV・AC の内容、ロール、Schedule の `owner` は正本と一致し、直しは不要だった。
- 整形と markdownlint は通り、runner の `lint:md:changed`・`lint:fm:changed`・`lint:mermaid`・`lint:d2`・`test:docs`・`validate:schema` も成功した。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R4-1 | R4 | 統合管理方針（M-07 品質）、判断ゲートとエスカレーション（初期リリース・店頭試用開始） | 初期受入の必須条件が SC-01・AC-01〜AC-04 で、成功条件の SC-01・SC-07・SC-09・AC-01〜AC-05 と食い違う。 | 2 か所を SC-01・SC-07・SC-09・AC-01〜AC-05 に直した。 | `vp-arc-technical-constraints`、`vp-qe-verifiability`。正本は prj-success-criteria-and-acceptance-criteria-sample の「判定対象と適用範囲」。 | - |
| R4-2 | R4 | 判断ゲートとエスカレーション（表の前の文） | 初期受入に混ぜない条件が SC-02〜SC-06 だけで、正本の SC-08・SC-10 が抜けている。 | SC-02〜SC-06・SC-08・SC-10 に直した。 | `vp-qe-verifiability`。正本は成功条件の「判定対象と適用範囲」。 | - |
| R4-3 | R4 | 統合管理方針（M-07 品質）、判断ゲートとエスカレーション（店頭試用後の継続） | 判定時期が運用開始後2週間の SC-08 が試用継続の条件にも後続観測にもなく、6か月の SC-10 が後続観測にない。 | 試用継続を SC-02・SC-03・SC-08、後続観測を SC-04〜SC-06・SC-10 にした。 | `vp-qe-verifiability`、`vp-dev-testability`。SC-08 は判定時期が2週間の試用と同じため継続の必須条件に入れた。選ばなかった案は SC-08 を後続観測に回すこと（成功条件は継続ゲートの必須条件を定めていない）。 | 要判断 |
| R4-4 | R4 | 別の kata（pm-quality-management-plan-sample）の品質ゲートの表と確認の表（29・30・32・40・65 行目） | 旧版の条件 ID（SC-01・AC-01〜AC-04、SC-02・SC-03、SC-04〜SC-06）が残っている。 | pm-quality-management-plan-sample を成功条件と本 sample に合わせ、初期受入を SC-01・SC-07・SC-09・AC-01〜AC-05、試用終了時を SC-02・SC-03・SC-08、後続観測を SC-04〜SC-06・SC-10 に直す案。本タスクでは直していない。 | `vp-qe-kata-conformance` | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/pm-plan-sample.md`: 初期受入の必須条件を SC-01・SC-07・SC-09・AC-01〜AC-05 に直した（M-07 品質と、初期リリース・店頭試用開始のゲートの 2 か所）。初期受入に混ぜない条件を SC-02〜SC-06・SC-08・SC-10 に直した。店頭試用後の継続の条件を SC-02・SC-03・SC-08、後続観測を SC-04〜SC-06・SC-10 に直した。prettier 整形で表の列幅も変わった。

## 3. 申し送り

- R4-4 は別の kata（pm-quality-management-plan-sample）に旧版の条件 ID が残っているという指摘で、本タスクでは直していない。該当 kata の見直しで対応が必要。
- R4-1: R4 / 統合管理方針（M-07 品質）、判断ゲートとエスカレーション（初期リリース・店頭試用開始） / 初期受入の必須条件が SC-01・AC-01〜AC-04 で、成功条件の SC-01・SC-07・SC-09・AC-01〜AC-05 と食い違う / 2 か所を SC-01・SC-07・SC-09・AC-01〜AC-05 に直した / `vp-arc-technical-constraints`、`vp-qe-verifiability`。正本は prj-success-criteria-and-acceptance-criteria-sample の「判定対象と適用範囲」 / -
- R4-2: R4 / 判断ゲートとエスカレーション（表の前の文） / 初期受入に混ぜない条件が SC-02〜SC-06 だけで、正本の SC-08・SC-10 が抜けている / SC-02〜SC-06・SC-08・SC-10 に直した / `vp-qe-verifiability`。正本は成功条件の「判定対象と適用範囲」 / -
- R4-3: R4 / 統合管理方針（M-07 品質）、判断ゲートとエスカレーション（店頭試用後の継続） / 判定時期が運用開始後2週間の SC-08 が試用継続の条件にも後続観測にもなく、6か月の SC-10 が後続観測にない / 試用継続を SC-02・SC-03・SC-08、後続観測を SC-04〜SC-06・SC-10 にした / `vp-qe-verifiability`、`vp-dev-testability`。SC-08 は判定時期が2週間の試用と同じため継続の必須条件に入れた。選ばなかった案は SC-08 を後続観測に回すこと（成功条件は継続ゲートの必須条件を定めていない） / 要判断
- R4-4: R4 / 別の kata（pm-quality-management-plan-sample） / 品質ゲートの表と確認の表に、旧版の条件 ID（SC-01・AC-01〜AC-04、SC-02・SC-03、SC-04〜SC-06）が残っている（29・30・32・40・65 行目） / - / `vp-qe-kata-conformance`。pm-quality-management-plan-sample を成功条件と本 sample に合わせ、初期受入を SC-01・SC-07・SC-09・AC-01〜AC-05、試用終了時を SC-02・SC-03・SC-08、後続観測を SC-04〜SC-06・SC-10 に直す案 / -
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/pm-plan-sample.md だけで、plan・result・個票を変更していないため）

## 4. 進め方と実践の型の適用

根拠は prj-success-criteria-and-acceptance-criteria-sample の「判定対象と適用範囲」で、条件 ID は成功条件を正として sample 側を直した。参照先の id、章の名前、BV・AC の内容、ロール、Schedule の `owner` は一致したので維持した。SC-08 を試用継続の必須条件に入れる判断は R4-3 に記録しており、確認が要る。plan に展開された grade の finding と成果物から届いた Kata 起因の finding はなかった。
