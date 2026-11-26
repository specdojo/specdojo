---
specdojo:
  id: prj-0001:xer-t-kata-review-all-uis-sample-150-20261125t045838z-6aa1b402
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-uis-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-uis-sample-150/T-KATA-REVIEW-ALL-uis-sample-150-20261125T045838Z-6aa1b402/plan.md
  started_at: "2026-11-25T04:58:48.268Z"
  completed_at: "2026-11-25T05:11:56.709Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:uis-sample
    - specdojo:uis-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として `uis-sample` を、同じ接頭辞の sample、参照先、用語集、共通サンプル文脈と突き合わせた。
- 共通サンプル文脈にない利用者の役割「店員」を、「店番をする家族」へ直した。直した箇所は概要と対象ユーザー表の 3 行である。
- F001（`現在庫数` の更新契機）は前の段で解消済みと確認し、追加の変更はしていない。
- 同じ接頭辞の sample は `uis-sample` のみで、wikilink はなく `based_on` も空だった。用語集に食い違う語はなかった。
- 相手側を直す案を 2 件、判断が要る点として handoff に残した。相手側は変更していない。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/uis-sample.md`: 概要 1 文目の「店員・店主が」を「店主と店番をする家族が」に直した。対象ユーザー/利用目的の表では「店員」を「店番の家族」に、「店員と同じ」を「店番の家族と同じ」に直した。いずれも共通サンプル文脈に合わせた変更で、3 行（3 行追加・3 行削除）にとどまる。

## 3. 申し送り

- 指摘内容と案は上記 evidence.handoff の 4 件のとおり。reporter として追加する申し送りはない。
- No: 1 / 段: R5 / 箇所: uis-sample.md「概要」1 文目と「対象ユーザー/利用目的」表 / 指摘: 利用者の役割「店員」が共通サンプル文脈にない。文脈では、店主以外で店番をするのは家族（「家族が店番する場合も同じ手順で」） / 直した案: 「店員・店主が」を「店主と店番をする家族が」、表の「店員」を「店番の家族」、「店員と同じ」を「店番の家族と同じ」にした（反映済み） / 根拠: docs/ja/specdojo/standards/sample-authoring-standard.md の「共通サンプル文脈」の「プロジェクト概要」「目的と必要性」 / 印: 要判断（dss-sample と同時に合わせるかどうか）
- No: 2 / 段: R5 / 箇所: dss-sample.md 16 行目・145 行目（相手側。変更していない） / 指摘: uis-sample と同じく、共通サンプル文脈にない「店員」を使っている。uis-sample を直したため、2 つの sample の利用者名が食い違う / 直した案: dss-sample の「店員・店主」を「店主と店番をする家族」に、「店員による」を「店番の家族による」にする / 根拠: sample-authoring-standard.md の「共通サンプル文脈」、uis-sample.md の今回の修正 / 印: 要判断
- No: 3 / 段: R5 / 箇所: uis-sample.md「バリデーション」の商品コード（半角数字 8 桁）と ifx-api-sample.yaml の `product_code`（pattern ^[0-9]{4,13}$、JAN コードまたは店舗の独自コード） / 指摘: 商品コードの桁数が sample どうしで違う。ただし uis は店舗サービス、ifx-api は本部 API と前提の構成が違い、同じ系列とは言い切れない / 直した案: 同じ系列として扱うなら、uis の条件を「4〜13 桁の数字（JAN コードまたは店舗の独自コード）」に合わせる。別の題材として扱うなら、どちらも変えない / 根拠: docs/ja/specdojo/samples/ifx-api-sample.yaml の `product_code` の定義、uis-sample.md の「バリデーション」の表 / 印: 要判断
- No: 4 / 段: R5 / 箇所: uis-sample.md「表示項目」の現在庫数（F001） / 指摘: 更新契機が曖昧だという grade の指摘は、前の段で解消済みだった（商品追加・数量変更・会計確定の在庫確認の成功時に更新し、通信失敗時は前の値を保持） / 直した案: なし（維持） / 根拠: uis-sample.md の該当行、vp-qe-verifiability / 印: なし

## 4. 進め方と実践の型の適用

根拠としたのは、`docs/ja/specdojo/standards/sample-authoring-standard.md` の「共通サンプル文脈」と `vp-qe-verifiability` である。共通サンプル文脈では、店主以外で店番をするのは家族なので、役割「店員」を直した。`現在庫数` の更新契機（F001）は、前の段の修正で判定根拠を満たしていたため維持した。商品コードの桁数が `ifx-api-sample.yaml` と異なる点は、前提の構成が違い同じ系列と言い切れないため変更を見送り、要判断として handoff に残した。`dss-sample.md` にも同じ「店員」があるが、相手側のため変更せず、直す案を handoff に記録した。検査は、executor が `prettier` と `markdownlint` を実行し、どちらも通過した。runner の `lint:md:changed`・`lint:fm:changed`・`lint:mermaid`・`lint:d2`・`test:docs`・`validate:schema` も通過した。変更種別に合わない検査は `not_applicable` だった。
