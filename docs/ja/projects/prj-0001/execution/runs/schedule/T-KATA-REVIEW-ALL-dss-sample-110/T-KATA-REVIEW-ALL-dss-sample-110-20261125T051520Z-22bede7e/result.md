---
specdojo:
  id: prj-0001:xer-t-kata-review-all-dss-sample-110-20261125t051520z-22bede7e
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-dss-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-dss-sample-110/T-KATA-REVIEW-ALL-dss-sample-110-20261125T051520Z-22bede7e/plan.md
  started_at: "2026-11-25T05:15:30.022Z"
  completed_at: "2026-11-25T05:29:14.375Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:dss-sample
    - specdojo:dss-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R1（目的の過不足）として `dss-sample.md` を見直し、不足していた 4 件を足した。削る内容はなかった。
- 足した内容は、利用者の呼び方を共通サンプル文脈に合わせたこと、対象外の参照先、部品の寸法の参照先、change-request の転記先である。
- rulebook など sample 以外は変更していない。
- 検証は runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が passed だった。executor の `prettier --write` も passed だった。
- 指摘の一覧は次の表のとおり。 | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | 1 | R1 | 「目的・適用範囲」の本文、「検証」の表の「全体の利用結果」の行 | 利用者が「店員」と書かれていた。共通サンプル文脈と `uis-sample` の利用者は「店主」と「店番をする家族」で、店員はいない | 2 か所とも「店主と店番をする家族」に置き換えた | Sample 記述標準の共通サンプル文脈、`uis-sample` の利用者の表 | なし | | 2 | R1 | 「目的・適用範囲」の表の対象外の行 | 対象外を並べるだけで、それぞれの参照先（UIS・NFR）を示していなかった | 画面固有の仕様は UIS、利用結果の目標は操作性要件、API のエラー契約・再送条件は横断ルールで扱う、と書き分けた | `dss-rulebook` の記述ガイド「目的・適用範囲」 | なし | | 3 | R1 | 「部品の使い方」の `dss-comp-01`〜`04` | rulebook が求める「寸法の参照先」が書かれていなかった | 部品ごとに使う寸法のトークンを足した（ボタンは size-target・radius-control、入力はさらに stroke-control、表の行内操作は size-target、ダイアログは radius-panel） | `dss-rulebook` の記述ガイド「部品の使い方」 | なし | | 4 | R1 | 「変更・不適合・例外」の表の規則変更の行 | 審査が要る変更を change-request に記録することが抜けていた | 「操作の意味や回復操作が変わり審査が要る変更は change-request」と足した | `dss-rulebook` の記述ガイド「検証・変更管理と関連文書」 | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/dss-sample.md`: R1 の確かめに当たる 4 箇所を足した。利用者の呼び方を「店員」から「店主と店番をする家族」へ直した（本文と検証の表の 2 か所）。目的・適用範囲の対象外に参照先（UIS・操作性要件・横断ルール）を足した。部品の使い方に寸法トークンの参照先を足した。変更・不適合・例外の規則変更の行に change-request への記録を足した。あわせて prettier で表を整形した。

## 3. 申し送り

- 「要判断」: No.4 の change-request の対象範囲は、executor が「操作の意味や回復操作が変わり審査が要る変更」と決めて書いた。この境界を例示してよいか、人が確認する。
- No: 1 / 段: R1 / 箇所: 「目的・適用範囲」の本文、「検証」の表の「全体の利用結果」の行 / 指摘: 利用者が「店員」と書かれていた。共通サンプル文脈と uis-sample の利用者は「店主」と「店番をする家族」で、店員はいない / 直した案: 2 か所とも「店主と店番をする家族」に置き換えた / 根拠: Sample 記述標準の共通サンプル文脈、[[specdojo:uis-sample]] の利用者の表 / 印: なし
- No: 2 / 段: R1 / 箇所: 「目的・適用範囲」の表の対象外の行 / 指摘: 対象外を並べるだけで、それぞれの参照先（UIS・NFR）を示していなかった / 直した案: 画面固有の仕様は UIS、利用結果の目標は操作性要件、API のエラー契約・再送条件は横断ルールで扱う、と書き分けた / 根拠: [[specdojo:dss-rulebook]] の記述ガイド「目的・適用範囲」 / 印: なし
- No: 3 / 段: R1 / 箇所: 「部品の使い方」の `dss-comp-01`〜`04` / 指摘: rulebook が求める「寸法の参照先」が書かれていなかった / 直した案: 部品ごとに使う寸法のトークンを足した（ボタンは size-target・radius-control、入力はさらに stroke-control、表の行内操作は size-target、ダイアログは radius-panel） / 根拠: [[specdojo:dss-rulebook]] の記述ガイド「部品の使い方」 / 印: なし
- No: 4 / 段: R1 / 箇所: 「変更・不適合・例外」の表の規則変更の行 / 指摘: 審査が要る変更を change-request に記録することが抜けていた / 直した案: 「操作の意味や回復操作が変わり審査が要る変更は change-request」と足した / 根拠: [[specdojo:dss-rulebook]] の記述ガイド「検証・変更管理と関連文書」 / 印: 要判断（審査が要る変更の範囲を「操作の意味や回復操作が変わる変更」と executor が決めて書いた。この境界で例示してよいか人が確認する）
- 確かめた資料: [[specdojo:dss-rulebook]]（本文要件・記述ガイド・禁止事項）、[[specdojo:sample-authoring-standard]]、dct-kata.yaml の dss-sample の `done_criteria`、[[specdojo:uis-sample]]。展開された finding はなし。rulebook の必須章・禁止事項に照らして削る内容はなく、ほかの記述は維持した。rulebook を直す案はなし

## 4. 進め方と実践の型の適用

根拠にしたのは、`dss-rulebook`（本文要件・記述ガイド・禁止事項）、`sample-authoring-standard`、`dct-kata.yaml` の dss-sample の `done_criteria`、`uis-sample` である。plan に展開された grade の finding と、成果物から届いた Kata が原因の finding はなかった。rulebook の必須章・禁止事項に照らして削る内容はなく、整合する既存の記述は維持した。足した内容はいずれも rulebook の記述ガイドか共通サンプル文脈に基づく。rulebook と sample が矛盾した箇所はなく、rulebook を直す案もない。
