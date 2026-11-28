---
specdojo:
  id: prj-0001:xer-t-kata-review-all-prj-success-criteria-and-acceptance-criteria-sample-150-20261125t081724z-79166049
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-prj-success-criteria-and-acceptance-criteria-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-prj-success-criteria-and-acceptance-criteria-sample-150/T-KATA-REVIEW-ALL-prj-success-criteria-and-acceptance-criteria-sample-150-20261125T081724Z-79166049/plan.md
  started_at: "2026-11-25T08:17:34.349Z"
  completed_at: "2026-11-25T08:32:08.531Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:prj-success-criteria-and-acceptance-criteria-sample
    - specdojo:prj-success-criteria-and-acceptance-criteria-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）を実施した。対象 sample は変更していない（`changes` は空）。
- plan の F001（SC-06 の必須記録と引き継ぎが曖昧）と F002（例外表の列が template と異なる）は、前の段で解消済みと確認した。SC-06 は3種の記録と引き継ぎメモの記入に具体化されている。例外表は `論点`・`判定への影響`・`当面の扱い` の3列で、template と rulebook に一致する。
- `based_on`・wikilink の参照先・用語集・共通サンプル文脈とも、本 sample 側を直すべき食い違いは見つからなかった。
- 相手側の文書を直す案を9件 handoff に残した。うち4件は要判断の印が付いている。

## 2. 変更ファイル

- なし

## 3. 申し送り

- 指摘の一覧（No・段・箇所・指摘・直した案・根拠・印）は、executor の handoff に9件（R5-1〜R5-9）が記録されている。R5-1 は前の段で解消済みで直す点なし、R5-2〜R5-9 は相手側の文書を直す案または系列の判断。R5-7・R5-8・R5-9 は要判断である。R5-6 も、日付を持つ記録の文書なので直さない選択肢があり、迷いの余地がある。
- 本 sample 自体は変更していないため、sample 側に未解消の finding はない。相手側の文書は本タスクでは変更しておらず、直す案の適用は別タスクまたは人の判断に委ねる。
- R5-1: 段 R5 / 箇所: 2. 成功基準（SC-06）、5. 例外条件と未解決事項 / 指摘: plan の F001（SC-06 の必須記録と引き継ぎが曖昧）と F002（例外表の列が template と異なる）は、前の段で解消済み。SC-06 は 3 種の記録と、店主代表へ渡す引き継ぎメモの記入に具体化されている。例外表は `論点`・`判定への影響`・`当面の扱い` の 3 列で、影響を受ける条件 ID と初期受入の可否を書いており、template と rulebook の「例外条件と未解決事項」に一致する / 直した案: - / 根拠: vp-qe-kata-conformance、vp-qe-verifiability（読んだもの: prj-success-criteria-and-acceptance-criteria-template.md、同 rulebook の例外条件と未解決事項） / 印: -
- R5-2: 段 R5 / 箇所: 2. 成功基準（SC-06）/ 指摘: 本 sample の SC-06 は 3 種の記録と引き継ぎメモの記入に具体化されたが、`based_on` の [[specdojo:prj-overview-sample]] の中長期指標「店舗継続」の測定方法は「必須記録と引き継ぎの完了を確認する」のままで、F001 と同じ曖昧さが残っている / 直した案: - / 根拠: vp-dev-change-impact。相手側の prj-overview-sample の中長期指標の店舗継続の行の測定方法を、「運用開始後6か月の店主不在の店番日を母数として、その日の販売・在庫・つけの記録と引き継ぎメモの記入を確認する」に直す案 / 印: -
- R5-3: 段 R5 / 箇所: 1. 判定対象と適用範囲、3. 受入条件 / 指摘: 本 sample では初期受入の必須条件が SC-01・SC-07・SC-09・AC-01〜AC-05 だが、[[specdojo:pm-plan-sample]] は古い範囲のままである。M-07 の行と、判断ゲートの初期リリース・店頭試用開始の行が「SC-01・AC-01〜AC-04」となっている / 直した案: - / 根拠: vp-dev-change-impact。相手側の pm-plan-sample の両方の行を「SC-01・SC-07・SC-09・AC-01〜AC-05」に直す案 / 印: -
- R5-4: 段 R5 / 箇所: 1. 判定対象と適用範囲 / 指摘: 本 sample で運用開始後に判定する条件は SC-02〜SC-06・SC-08・SC-10 だが、[[specdojo:pm-plan-sample]] は SC-08 と SC-10 が抜けている。該当は「SC-02〜SC-06 は初期受入の合否に混ぜず」、店頭試用後の継続ゲートの「SC-02・SC-03 が合格」、同じゲートの「SC-04〜SC-06 は後続観測」の 3 箇所 / 直した案: - / 根拠: vp-dev-change-impact。相手側の pm-plan-sample を「SC-02〜SC-06・SC-08・SC-10」「SC-02・SC-03・SC-08 が合格」「SC-04〜SC-06・SC-10 は後続観測」に直す案 / 印: -
- R5-5: 段 R5 / 箇所: 1. 判定対象と適用範囲、3. 受入条件 / 指摘: [[specdojo:pm-quality-management-plan-sample]] の条件 ID の範囲も古い。初期受入ゲートは「SC-01・AC-01〜AC-04」、利用者確認の行は「初期受入は SC-01・AC-01〜AC-03」、短期利用ゲートは「SC-02・SC-03」、初期受入に含めない条件と後続観測は「SC-04〜SC-06」となっている / 直した案: - / 根拠: vp-dev-change-impact。相手側の pm-quality-management-plan-sample を「SC-01・SC-07・SC-09・AC-01〜AC-05」「SC-01・SC-07・SC-09・AC-01〜AC-03・AC-05」「SC-02・SC-03・SC-08」「SC-04〜SC-06・SC-10」に直す案 / 印: -
- R5-6: 段 R5 / 箇所: 3. 受入条件 / 指摘: [[specdojo:pm-risk-register-sample]] は、影響度「中」の基準と RK の影響を受ける成果物で受入条件を「AC-01〜AC-04」（後者は「SC-01〜SC-03、AC-01〜AC-04」）と書いており、AC-05 が抜けている。[[specdojo:pm-change-request-log-sample]] の CR-004 の「承認済みの AC-01〜AC-04 は発注を扱わない」も同じ。AC-05 も入荷・棚卸・廃棄とつけの登録で、発注は扱わない / 直した案: - / 根拠: vp-dev-change-impact。相手側の 2 文書の範囲を AC-01〜AC-05 に直す案。日付を持つ記録の文書なので、当時の条件 ID の範囲を残したいなら直さないことも選べる / 印: -
- R5-7: 段 R5 / 箇所: 4. 判定手順と証跡（手順 1）/ 指摘: 本 sample では、SC-04・SC-05 のベースラインを店主代表（`PO`）が運用開始の1か月前から手書きで日次に記録する。[[specdojo:pm-plan-sample]] の運用前の準備では、`BA` が日次欠品と廃棄・値引き・長期滞留を採取し、`QE` が照合するとしている / 直した案: - / 根拠: vp-dev-change-impact。迷った理由: 店頭で毎日書けるのは店主代表で、pm-plan-sample は作業時間を見積もった計画であり、どちらも筋が通る。案A（採った）: 本 sample は変えず、pm-plan-sample を「`PO` が日次に記録し、`BA` が集計し、`QE` が照合する」に直す。案B（採らなかった）: 本 sample の手順 1 の記録者を `BA` に変える。案B は、店頭で日次に記録するという本 sample の前提と合わない / 印: 要判断
- R5-8: 段 R5 / 箇所: 全体（「初期リリース」の表記）/ 指摘: 本 sample と [[specdojo:prj-scope-sample]] は「初期リリース」と書く。[[specdojo:prj-overview-sample]] と [[specdojo:prj-stakeholder-register-sample]] は「初期公開」と書き、概要は初期公開を「店頭で使い始める最初の版の提供」と定義している。同じ系列で表記が混ざっている / 直した案: - / 根拠: vp-dev-change-impact、W8。迷った理由: どちらに統一するかは系列全体の判断で、本 sample だけを変えると `based_on` のスコープとずれる。案A（採った）: 本 sample は変えず、系列の統一を人の判断に回す。案B（採らなかった）: 本 sample を「初期公開」に変える / 印: 要判断
- R5-9: 段 R5 / 箇所: 1. 判定対象と適用範囲（両代表の定義）、5. 例外条件と未解決事項（オフライン時の記録方法）/ 指摘: 2 つの表記ずれがある。1 つ目は役割名で、本 sample は prj 系列と同じ「家族利用者代表」を使う。Sample 記述標準の共通サンプル文脈の共通登場人物では、役割名は「利用者代表」で、人物は家族ではない幼なじみとされている。2 つ目は、本 sample の論点「オフライン時の記録方法」を、[[specdojo:prj-scope-sample]] のスコープ外では「通信断の日の記録」と書いている / 直した案: - / 根拠: vp-qe-kata-conformance。相手側を直す案は 2 つ。1 つは Sample 記述標準の共通サンプル文脈に「家族利用者代表（店主不在の店番を担う家族の利用者代表）」を役割として足すか、系列の役割名の扱いを決めること。もう 1 つは、スコープの表記を「オフライン時（通信断の日）の記録」にそろえること。迷った理由: 役割名は系列の多くの sample にまたがり、本 sample だけを直すと `based_on` の文書とずれる / 印: 要判断
- 適用外の検証: `npm run validate:history-links`（plan・result・個票などの履歴ファイルを executor が変更していないため）
- 適用外の検証: `npm run validate:schema:file`（変更した `*.yaml` / `*.yml` ファイルがないため）

## 4. 進め方と実践の型の適用

sample-maintenance の R5（整合）として、前の段が直した版を読み、同じ接頭辞の sample、`based_on` と wikilink の参照先、用語集、Sample 記述標準の共通サンプル文脈との食い違いを確認した。plan の F001・F002 は、`vp-qe-verifiability` と `vp-qe-kata-conformance` の判定根拠に照らして、前の段で解消済みと判断した。template と rulebook の「例外条件と未解決事項」を照合し、構造・列構成が一致することを根拠にした。本 sample 側に直す箇所はなく、維持した。相手側の文書（`prj-overview-sample`、`pm-plan-sample`、`pm-quality-management-plan-sample`、`pm-risk-register-sample`、`pm-change-request-log-sample`、`prj-scope-sample` など）を直す案は、変更せず handoff に記録した。判断が割れる点（SC-04・SC-05 のベースライン記録者、「初期リリース」と「初期公開」の表記、「家族利用者代表」の役割名、オフライン時の記録の表記）は「要判断」とした。
