---
specdojo:
  id: prj-0001:xer-t-kata-review-all-pm-raci-sample-150-20261126t093011z-95ccfcb7
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-pm-raci-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-pm-raci-sample-150/T-KATA-REVIEW-ALL-pm-raci-sample-150-20261126T093011Z-95ccfcb7/plan.md
  started_at: "2026-11-26T09:30:22.280Z"
  completed_at: "2026-11-26T09:37:09.110Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:pm-raci-sample
    - specdojo:pm-raci-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R5（整合）を実施した。F001（成果物別 RACI の行から成果物 ID を辿れない）は、前の段で「対象 ID」列が入り全行に成果物 ID または `kinuya-*` 記録名が書かれていたため、追加の変更はしていない。
- 管理計画の判断ゲート「店頭試用後の継続」は起案・整理を `BA` と `PM` とする。一方、RACI の判断行では `BA` が `C` だけで、`BA` の整理の範囲が読めなかった。この食い違いを、`pm-raci-sample` の表の後の補足に 1 項目足して直した。
- executor は prettier と markdownlint を実行し、どちらも通過した。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も通過した。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | 1. 適用方針から 2. 成果物別 RACI / F001（成果物別 RACI の行から成果物 ID を確かめられない） | grade の F001 は、成果物別 RACI の統合行が成果物名だけで、成果物 ID との対応を確認できないという指摘だった。前の段で「対象 ID」列が入り、全行に成果物 ID または `kinuya-*` 記録名が書かれている。これで rulebook の「ファイル命名・ID規則」にある一意照合を満たす。 | - | `vp-qe-kata-conformance`。追加の修正は不要。 | - |
| R5-2 | R5 | 3. 判断・プロセス別 RACI / 判断行「リリース・試用後の継続判断」 | 管理計画の判断ゲート「店頭試用後の継続」は起案・整理を `BA` と `PM` とする。しかし RACI の判断行では `BA` が `C` だけで、`BA` の整理の範囲が読めない。 | 表の後の補足に「試用後の継続判断では、`BA` が営業日別記録と利用者所感を整理し、`PM` が保守・引き継ぎの見込みと合わせて判断材料にまとめる。」を足した。 | `vp-qe-kata-conformance`、`vp-dev-change-impact`。迷った理由は、この行がリリース判断と継続判断を 1 行にまとめているため。`BA` を `R` にすると、起案しないリリース判断まで作業責任になる。選ばなかった案は、(1) `BA` を `R` にして主担当を注記する、(2) 行を「リリース判断」と「試用後の継続判断」に分ける（表が大きくなるので見送った）。 | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/pm-raci-sample.md`: 判断・プロセス別 RACI の表の後の補足に、試用後の継続判断の整理の範囲を 1 項目足した。`BA` が営業日別記録と利用者所感を整理し、`PM` が保守・引き継ぎの見込みと合わせて判断材料にまとめる、という内容にした。管理計画の判断ゲートとの食い違いを解消するための変更で、差分は 1 行の追加。

## 3. 申し送り

- R5-2 は要判断。この行はリリース判断と継続判断を 1 行にまとめている。`BA` を `R` にすると、`BA` が起案しないリリース判断まで作業責任になる。そのため今回は補足で対応した。別案は、`BA` を `R` にして主担当を注記する案と、行を「リリース判断」と「試用後の継続判断」に分ける案である。後者は表が大きくなるため見送った。採否は人が判断する。
- R5-1: R5 / 1. 適用方針から 2. 成果物別 RACI / F001（成果物別 RACI の行から成果物 ID を確かめられない） / - / `vp-qe-kata-conformance`。前の段で「対象 ID」列が入り、全行に成果物 ID または `kinuya-*` 記録名が書かれていて、rulebook「ファイル命名・ID規則」の一意照合を満たす。追加の修正は不要 / -
- R5-2: R5 / 3. 判断・プロセス別 RACI / [[specdojo:pm-plan-sample|管理計画]] の判断ゲート「店頭試用後の継続」は起案・整理を `BA`、`PM` とするが、RACI の判断行「リリース・試用後の継続判断」では `BA` が `C` だけで、`BA` の整理の範囲が読めない / 表の後の補足に「試用後の継続判断では、`BA` が営業日別記録と利用者所感を整理し、`PM` が保守・引き継ぎの見込みと合わせて判断材料にまとめる。」を足した / `vp-qe-kata-conformance`、`vp-dev-change-impact`。迷った理由: この行はリリース判断と継続判断を 1 行にまとめており、`BA` を `R` にすると起案しないリリース判断まで作業責任になる。選ばなかった案: (1) `BA` を `R` にして主担当を注記する、(2) 行を「リリース判断」と「試用後の継続判断」に分ける（表が大きくなるので見送った） / 要判断
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/pm-raci-sample.md だけで、pjr 個票・plan・result を変更していない）

## 4. 進め方と実践の型の適用

sample-maintenance の R5（整合）として、同じ接頭辞の sample、参照先の管理計画、組織・ロール・メンバー定義を照合した。対象を sample 側の修正に限り、F001 は rulebook の「ファイル命名・ID規則」に照らして前の段で解消済みと確認した。管理計画との食い違いは、sample の補足を 1 項目足して直した。
