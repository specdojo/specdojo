---
specdojo:
  id: prj-0001:xer-t-kata-review-all-opr-support-sample-150-20261125t135814z-80cd4cb9
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-opr-support-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-opr-support-sample-150/T-KATA-REVIEW-ALL-opr-support-sample-150-20261125T135814Z-80cd4cb9/plan.md
  started_at: "2026-11-25T13:58:23.241Z"
  completed_at: "2026-11-25T14:11:33.892Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opr-support-sample
    - specdojo:opr-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として、`opr-support-sample.md` を同じ系列の sample・用語集・共通サンプル文脈と突き合わせ、sample 側の食い違い 3 件を直した。
- 相手側（`opr-index-sample`、`opr-sample`、`opd-index-sample` など）を直すべき点は変更せず、直す案を findings に記載した。
- plan に展開された F001・F004 は kata の段の観点に当たらないため、この段では扱わなかった。F002 は R4 の段に任せる。F003 のうち導線の欠落は、分冊 2 件を足して解消した。分冊の記述が `opr-index-sample` 側と食い違う点は、相手側の案として残した。
- `npx prettier --check` と runner の検査（`lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema`）は成功した。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R5 | opr-support-sample「手順適用範囲・前提」の必要権限の行 | 「証跡の参照権限」が、`opd-access-control-sample` の権限区分の表（店番・管理・運用・保守）にない語だった。 | 「`OPS` は日次締め記録を閲覧して確かめ、記録の訂正はしない（運用の区分は販売・つけの記録と訂正ができない）」に変更した（適用済み）。 | `opd-access-control-sample` の権限区分の節、`opr-access-control-sample` の手順適用範囲・前提 | - |
| 2 | R5 | opr-support-sample「証跡」の引き継ぎの記録の行、「概要」の未決事項の表 | 引き継ぎの記録の保管期間だけが、参照先のない `_UNDECIDED_` だった。 | 未決事項の行を「問い合わせ記録と引き継ぎの記録の保管期間（店内の連絡帳と課題管理の記録を処分せず、すべて残す）」に広げ、証跡の表を「`_UNDECIDED_`（概要参照）」にした（適用済み）。 | `opr-sample` の概要の未決事項「監査ログ以外の証跡の保管期間 — 削除しない」 | - |
| 3 | R5 | opr-support-sample「関連ドキュメント導線」 | 権限・設定の依頼の引き継ぎ先にあたる分冊（権限・アカウント、運用変更）が導線にない。 | `opr-access-control-sample`（付与・区分の変更・剥奪の申請へ移す）と `opr-change-sample`（商品マスタ・価格の一括変更の依頼を運用変更作業へ移す）の行を足した（適用済み）。 | `opr-sample` の関連ドキュメント導線の分冊一覧、`opr-change-sample` の対象（一括変更） | - |
| 4 | R5 | 相手側 `opr-index-sample`「関連ドキュメント導線」（F003） | 「分冊は障害対応だけとし、ほかの作業領域は本書で完結する」とあるが、分冊の sample が 7 件ある。 | `opr-index-sample` の導線の表へ分冊 7 件を足し、直前の文を「各分冊に固有の操作・判断・証跡は分冊を参照する」に改める（未変更）。 | `opr-rulebook` の frontmatter の sample 宣言、`opr-sample` の関連ドキュメント導線 | - |
| 5 | R5 | 相手側 `opr-sample` と `opr-index-sample` の位置づけ | `opr-*` の分冊は全部 `opr-sample` を `opr-index` として参照する。一方、`opd-*` と `opr-sample` の概要は `opr-index-sample` を手順群の入口としており、入口が 2 つある。 | どちらを `opr-index` の sample とするかを決め、`opr-rulebook` と `opr-index-rulebook` の sample 宣言と分冊の参照を揃える（未変更。`opr-support-sample` は分冊の多数に合わせて `opr-sample` 参照のまま維持した）。 | `opr-rulebook` の sample 宣言、`opr-index-rulebook`、`opd-index-sample` の関連ドキュメント導線 | 要判断 |
| 6 | R5 | 相手側 `opd-index-sample`「問い合わせ運用方針」 | 分類が 3 つ（操作の質問・記録の訂正の依頼・機能の要望）で、`opr-support-sample` の「権限・設定の依頼」と「障害にあたるもの」の行が方針にない。 | `opd-index-sample` の分類の表に「権限・設定の依頼」を足し、応答の目標を `_UNDECIDED_` として示す。障害はエスカレーション表で扱うと 1 文で書き添える（未変更）。 | `opr-support-sample` の分類と応答の目標の表、概要の未決事項 | 要判断 |
| 7 | R5 | 相手側 `opr-sample`・`opr-index-sample`・`opr-incident-sample`・`opr-monitoring-sample` の「引継ぎ」 | 同じ系列の中で「引継ぎ」と「引き継ぎ」が混ざっている。`opr-support-sample` は 13 か所とも「引き継ぎ」で、用語集 `gl-execution.yaml` も「引き継ぎ」である。 | 相手側の「引継ぎ」を「引き継ぎ」に揃える（未変更）。 | `docs/ja/product/010-business-specs/060-glossary/gl-execution.yaml` の表記 | - |
| 8 | R5 | 相手側 `opr-sample` の証跡の問い合わせ記録の行 | 最低限残す識別子が「受付日、分類」で、分冊 `opr-support-sample` の「受付日時、分類、引き継ぎ時は `ticket_id`」と粒度が違う。 | `opr-sample` の行を「受付日時、分類」にし、引き継ぎの識別子は分冊を参照すると書く（未変更）。 | `opr-support-sample` の証跡の表 | 要判断 |
| 9 | R5 | opr-support-sample「分類と応答の目標」の権限・設定の依頼の行 | 判定の条件に「商品マスタ・価格の変更」とあるが、`opr-change-sample` は 1 商品ずつの店頭での価格の修正を対象外とし、その引き継ぎ先がどの手順にもない。 | 1 商品ずつの価格の修正を管理の区分で店主代表が行う操作として `opr-access-control-sample` か `opr-sample` に書くか、`opr-support-sample` の判定の条件を「一括変更」に限る（未変更）。 | `opr-change-sample` の手順適用範囲・前提の対象外、`opd-access-control-sample` の権限区分の表 | 要判断 |
| 10 | R5 | plan の finding F001・F002・F004 | F001・F004 は kata の段のレビューで使わない観点（`vp-po-decision-readiness`・`vp-ops-release-readiness`）、F002 は R4 の観点（`vp-qe-verifiability`）のため、この段では扱わない。 | F002 は R4 の段に任せる。F001・F004 は登録簿で追う。 | `kata-guide` の kata の観点の組 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opr-support-sample.md`: 権限の記述を `opd-access-control-sample` の 4 区分（店番・管理・運用・保守）に合わせ、`OPS` は日次締め記録を閲覧するだけで訂正しないと改めた。引き継ぎの記録の保管期間を概要の未決事項に結び、証跡の表は「`_UNDECIDED_`（概要参照）」にした。関連ドキュメント導線へ `opr-access-control-sample` と `opr-change-sample` の行を足した。

## 3. 申し送り

- F001・F004（`vp-po-decision-readiness`、`vp-ops-release-readiness`）は kata の段のレビューで使わない観点のため、本タスクでは改訂していない。登録簿で追う。
- F002（`vp-qe-verifiability`）は R4 の段の観点のため、R4 に任せる。ただし証跡の保管期間の未決は、概要の未決事項と結び付けた。
- 相手側を直す案（No 4〜9）は変更していない。要判断の印を付けた No 5・6・8・9 は、判断を待って相手側の sample と rulebook を直す。
- No: 1 / 段: R5 / 箇所: opr-support-sample「手順適用範囲・前提」の必要権限の行 / 指摘: 「証跡の参照権限」が opd-access-control-sample の権限区分の表（店番・管理・運用・保守）にない語だった / 直した案: 「`OPS` は日次締め記録を閲覧して確かめ、記録の訂正はしない（運用の区分は販売・つけの記録と訂正ができない）」に変更した（適用済み） / 根拠: opd-access-control-sample の権限区分の節、opr-access-control-sample の手順適用範囲・前提 / 印: なし
- No: 2 / 段: R5 / 箇所: opr-support-sample「証跡」の引き継ぎの記録の行、「概要」の未決事項の表 / 指摘: 引き継ぎの記録の保管期間だけが参照先のない `_UNDECIDED_` だった / 直した案: 未決事項の行を「問い合わせ記録と引き継ぎの記録の保管期間（店内の連絡帳と課題管理の記録を処分せず、すべて残す）」に広げ、証跡の表を「`_UNDECIDED_`（概要参照）」にした（適用済み） / 根拠: opr-sample の概要の未決事項「監査ログ以外の証跡の保管期間 — 削除しない」 / 印: なし
- No: 3 / 段: R5 / 箇所: opr-support-sample「関連ドキュメント導線」 / 指摘: 権限・設定の依頼の引き継ぎ先にあたる分冊（権限・アカウント、運用変更）が導線にない / 直した案: opr-access-control-sample（付与・区分の変更・剥奪の申請へ移す）と opr-change-sample（商品マスタ・価格の一括変更の依頼を運用変更作業へ移す）の行を足した（適用済み） / 根拠: opr-sample の関連ドキュメント導線の分冊一覧、opr-change-sample の対象（一括変更） / 印: なし
- No: 4 / 段: R5 / 箇所: 相手側 opr-index-sample「関連ドキュメント導線」（F003） / 指摘: 「分冊は障害対応だけとし、ほかの作業領域は本書で完結する」とあるが、分冊の sample が 7 件ある / 直した案: opr-index-sample の導線の表へ分冊 7 件を足し、直前の文を「各分冊に固有の操作・判断・証跡は分冊を参照する」に改める（未変更） / 根拠: opr-rulebook の frontmatter の sample 宣言、opr-sample の関連ドキュメント導線 / 印: なし
- No: 5 / 段: R5 / 箇所: 相手側 opr-sample と opr-index-sample の位置づけ / 指摘: `opr-*` の分冊は全部 opr-sample を `opr-index` として参照する一方、`opd-*` と opr-sample の概要は opr-index-sample を手順群の入口とし、入口が 2 つある / 直した案: どちらを `opr-index` の sample とするかを決め、opr-rulebook と opr-index-rulebook の sample 宣言と分冊の参照を揃える（未変更。opr-support-sample は分冊の多数に合わせて opr-sample 参照のまま維持した） / 根拠: opr-rulebook の sample 宣言、opr-index-rulebook、opd-index-sample の関連ドキュメント導線 / 印: 要判断
- No: 6 / 段: R5 / 箇所: 相手側 opd-index-sample「問い合わせ運用方針」 / 指摘: 分類が 3 つ（操作の質問・記録の訂正の依頼・機能の要望）で、opr-support-sample の「権限・設定の依頼」と「障害にあたるもの」の行が方針にない / 直した案: opd-index-sample の分類の表に「権限・設定の依頼」を足し、応答の目標を `_UNDECIDED_` として示す。障害はエスカレーション表で扱うと 1 文で書き添える / 根拠: opr-support-sample の分類と応答の目標の表、概要の未決事項 / 印: 要判断
- No: 7 / 段: R5 / 箇所: 相手側 opr-sample・opr-index-sample・opr-incident-sample・opr-monitoring-sample の「引継ぎ」 / 指摘: 同じ系列の中で「引継ぎ」と「引き継ぎ」が混ざっている（opr-support-sample は 13 か所とも「引き継ぎ」、用語集 gl-execution.yaml も「引き継ぎ」） / 直した案: 相手側の「引継ぎ」を「引き継ぎ」に揃える（未変更） / 根拠: docs/ja/product/010-business-specs/060-glossary/gl-execution.yaml の表記 / 印: なし
- No: 8 / 段: R5 / 箇所: 相手側 opr-sample の証跡の問い合わせ記録の行 / 指摘: 最低限残す識別子が「受付日、分類」で、分冊 opr-support-sample の「受付日時、分類、引き継ぎ時は `ticket_id`」と粒度が違う / 直した案: opr-sample の行を「受付日時、分類」にし、引き継ぎの識別子は分冊を参照すると書く（未変更） / 根拠: opr-support-sample の証跡の表 / 印: 要判断
- No: 9 / 段: R5 / 箇所: opr-support-sample「分類と応答の目標」の権限・設定の依頼の行 / 指摘: 判定の条件に「商品マスタ・価格の変更」とあるが、opr-change-sample は 1 商品ずつの店頭での価格の修正を対象外とし、その引き継ぎ先がどの手順にもない / 直した案: 1 商品ずつの価格の修正を管理の区分で店主代表が行う操作として opr-access-control-sample か opr-sample に書くか、opr-support-sample の判定の条件を「一括変更」に限る / 根拠: opr-change-sample の手順適用範囲・前提の対象外、opd-access-control-sample の権限区分の表 / 印: 要判断
- No: 10 / 段: R5 / 箇所: plan の finding F001・F002・F004 / 指摘: F001・F004 は kata の段のレビューで使わない観点（`vp-po-decision-readiness`・`vp-ops-release-readiness`）、F002 は R4 の観点（`vp-qe-verifiability`）のため、この段では扱わない / 直した案: F002 は R4 の段に任せる。F001・F004 は登録簿で追う / 根拠: kata-guide の kata の観点の組 / 印: なし
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/samples/opr-support-sample.md だけで、plan・result・個票を変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルに `*.yaml` / `*.yml` がない）

## 4. 進め方と実践の型の適用

根拠は、`opr-sample`、`opd-index-sample`、`opd-access-control-sample`、`opr-access-control-sample`、`opr-change-sample`、`opr-incident-sample`、用語集 `gl-execution.yaml`、`kata-guide` の R5 の節、Sample 記述標準の共通サンプル文脈。rulebook と矛盾する箇所は rulebook を正とした。権限の語、保管期間の参照先、分冊の導線は根拠と整合しなかったため改訂した。「引き継ぎ」の表記は用語集と一致するため維持した。`opr-sample` を `opr-index` として参照する分冊の多数に合わせ、`opr-support-sample` の参照先も維持した。入口が 2 つある点は要判断として残した。
