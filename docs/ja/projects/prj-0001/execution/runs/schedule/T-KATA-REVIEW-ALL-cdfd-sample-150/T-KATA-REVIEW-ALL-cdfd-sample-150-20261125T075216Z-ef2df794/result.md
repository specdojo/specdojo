---
specdojo:
  id: prj-0001:xer-t-kata-review-all-cdfd-sample-150-20261125t075216z-ef2df794
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-cdfd-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-cdfd-sample-150/T-KATA-REVIEW-ALL-cdfd-sample-150-20261125T075216Z-ef2df794/plan.md
  started_at: "2026-11-25T07:52:25.541Z"
  completed_at: "2026-11-25T08:03:56.618Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:cdfd-sample
    - specdojo:cdfd-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）の段として、`cdfd-sample` の「グループ外への委譲」表の 2 か所を、ユースケース別 sample の図と食い違わないように直した。
- grade の指摘 F001（`P-02-04` の主要入力の重複）と F002（`P-02-05` の「不一致・不良情報」と図の不一致）は、前の段で直っていた。executor は今の版で解消を確認した。
- 相手側の文書（`cdfd-uc-sample`、`cdfd-overview-sample`）に見つかった食い違いは変更せず、直す案を handoff に残した。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/cdfd-sample.md`: 「グループ外への委譲」表を 2 か所直した。`cdfd-sales` の行の「本グループへ戻す条件」を、「販売グループが入荷数量・受入結果と売場商品の差異を返した」に改めた。`cdfd-uc-replenishment` の行の「引き渡す情報」を、「補充依頼、発注・受入結果、入荷数量・受入結果、売場商品」にそろえた。差分は 5 行追加・5 行削除である。

## 3. 申し送り

- 報告の形に沿って、指摘 No.1〜7 は evidence.handoff の記載のとおりである。ここでは繰り返さない。
- 印が「要判断」の指摘は No.5（仕入記録の主な内容と返品の線を全体概要に足すか）、No.6（`P-02` の業務目的の順）、No.7（`E-01-01` の再開経路）の 3 件である。人の判断を待つ。
- No.3、No.4、No.5、No.6 は相手側の文書を直す案である。この段では相手側を変更していない。No.7 は sample 側も未変更である。
- No: 1／段: R5／箇所: docs/ja/specdojo/samples/cdfd-sample.md「グループ外への委譲」の `cdfd-sales` の行「本グループへ戻す条件」／指摘: 戻す条件が在庫グループの補充依頼になっており、`cdfd-inventory` の行と重なる。ユースケース別 sample（`cdfd-uc-sample`）の例外の図にある販売から仕入への戻り（数量の差異・未確定の受入結果・配置状況）もない／直した案: 「販売グループが入荷数量・受入結果と売場商品の差異を返した」に改めた（sample 側で反映済み）／根拠: [[specdojo:cdfd-uc-sample]] の「例外時の戻り」の図、[[specdojo:cdfd-rulebook]] の「主要例外とグループ外への委譲」／印: なし
- No: 2／段: R5／箇所: docs/ja/specdojo/samples/cdfd-sample.md「グループ外への委譲」の `cdfd-uc-replenishment` の行「引き渡す情報」／指摘: 「発注結果、入荷数量」が、ユースケース別 sample の図の線名「発注・受入結果」「入荷数量・受入結果」と違う／直した案: 「補充依頼、発注・受入結果、入荷数量・受入結果、売場商品」にそろえた（sample 側で反映済み）／根拠: [[specdojo:cdfd-uc-sample]] の「欠品から売場補充まで」の図の線／印: なし
- No: 3／段: R5／箇所: docs/ja/specdojo/samples/cdfd-uc-sample.md の役割表「在庫（P-05〜P-06）」と「データストア」の商品台帳の行／指摘: 発注単位に合わせて数量を確定するのが在庫グループになっている。全体概要の `P-01` と cdfd-sample の `P-01-01` では、仕入計画で発注単位に合わせて確定する／直した案（相手側、未変更）: 在庫の横断上の役割を「補充対象と必要数量を判断し、店主代表が承認した補充依頼を仕入へ渡す」にし、商品台帳の利用と図のラベルから「発注単位」を外す（「補充基準」だけにする）／根拠: [[specdojo:cdfd-overview-sample]] の「仕入（P-01〜P-02）」の表、cdfd-sample の `P-01-01`／印: なし
- No: 4／段: R5／箇所: docs/ja/specdojo/samples/cdfd-uc-sample.md の「適用範囲」の対象外／指摘: 「店番担当」は共通登場人物の役割名になく、全体概要と cdfd-sample の「家族利用者代表」と食い違う／直した案（相手側、未変更）: 「家族利用者代表」に置き換える／根拠: [[specdojo:sample-authoring-standard]] の「共通登場人物」、[[specdojo:cdfd-overview-sample]] の「適用範囲」／印: なし
- No: 5／段: R5／箇所: docs/ja/specdojo/samples/cdfd-overview-sample.md「データストア」の仕入記録の「主な内容」と全体図の仕入・仕入先の間の線／指摘: cdfd-sample が仕入記録に書く受入日時・検品結果・返品情報が全体概要の主な内容になく、全体図に仕入先への返品の線もない／直した案（相手側、未変更）: 主な内容に「受入日時、検品結果、返品日・数量」を足し、返品の線を足すかを決める／根拠: cdfd-sample の「データストア」の仕入記録の行と、「入荷検品（P-02）」の図の返品連絡・返品商品の線／印: 要判断（全体概要として省いてよい範囲か）
- No: 6／段: R5／箇所: docs/ja/specdojo/samples/cdfd-overview-sample.md の `P-02` の業務目的／指摘: 「売場棚へ出して仕入記録と在庫記録を更新する」の順が、cdfd-sample の仕入記録確定（`P-02-03`）→ 売場補充（`P-02-04`）の順と逆に読める／直した案（相手側、未変更）: 「納品された商品を検品して仕入記録と在庫記録を更新し、受入品を売場棚へ出す」にする／根拠: cdfd-sample の `P-02-04` の起動条件「仕入記録確定後に受入品がある」／印: 要判断
- No: 7／段: R5／箇所: docs/ja/specdojo/samples/cdfd-sample.md の `E-01-01` の「継続・再開条件」と「グループ外への委譲」の `cdfd-inventory` の行／指摘: 再開する経路が一つに決まらない。例外表は店主代表が代替仕入先または数量を承認した後に `P-01-01` から再開するとし、委譲表は在庫グループから修正済みの補充依頼が渡されたら戻るとする。ユースケース別 sample は後者（修正・再承認済みの補充依頼）だけを描く／直した案（未変更）: どちらの経路で再開するかを決め、例外表・委譲表・ユースケース別 sample の戻りをそろえる／根拠: [[specdojo:cdfd-uc-sample]] の「例外時の戻り」の図／印: 要判断
- F001・F002（grade の指摘）は前の段で直っており、今の版で解消を確認した。`P-02-04` の主要入力は「受入品、確定済みの入荷数量・受入結果」、`P-02-05` は「返品対象商品、返品対象の検品結果」で、図の線と一致する。

## 4. 進め方と実践の型の適用

根拠にしたのは、ユースケース別 sample（`cdfd-uc-sample`）の図、全体概要 sample（`cdfd-overview-sample`）、`cdfd-rulebook` の「主要例外とグループ外への委譲」、共通サンプル文脈である。 図の線名と合う記述は維持し、食い違う 2 か所だけを sample 側で直した。 F001 と F002 は前の段で直っている。`P-02-04` の主要入力は「受入品、確定済みの入荷数量・受入結果」、`P-02-05` は「返品対象商品、返品対象の検品結果」で、図の線と一致する。 検査では、executor の `prettier --check` と `markdownlint` が通った。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も通った。`lint:ts`、`lint:md`、`lint:fm`、`test:integration`、`typecheck`、`test:unit` は、変更の種類により対象外と判定された。 `status` の昇格は行っていない。
