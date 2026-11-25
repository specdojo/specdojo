---
specdojo:
  id: prj-0001:xer-t-kata-review-all-opr-support-sample-140-20261125t105123z-a2306c13
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-opr-support-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-opr-support-sample-140/T-KATA-REVIEW-ALL-opr-support-sample-140-20261125T105123Z-a2306c13/plan.md
  started_at: "2026-11-25T10:51:34.688Z"
  completed_at: "2026-11-25T11:08:00.612Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opr-support-sample
    - specdojo:opr-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R4（正しさ）として、`opr-support-sample` の主張を正本（`opd-index-sample`・`opd-access-control-sample`・`opr-sample`・`opr-incident-sample`・`opr-rulebook`・schema）と突き合わせた。
- 誤り 3 件を直した。1 件目は権限区分の名前、2 件目はつけ残高の訂正者、3 件目は `opr-incident` の作成状態である。
- P1〜P3 の条件と期限、応答の目標、KPI、営業時間、操作メモ、監視の記述、frontmatter の `type` と `rulebook` は正本と一致したため維持した。
- F001 と F004 は、kata-guide がこの段で使わない観点（`vp-po-decision-readiness`、`vp-ops-release-readiness`）のため扱わなかった。F002 は `opr-sample` の未決事項の表で解消済みと判断した。F003 のうち「予定」の誤りは直した。
- runner の検証では `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が通った。変更種別により対象外の検査は `not_applicable` になった。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opr-support-sample.md`: 3 箇所を正本に合わせて直した（3 行追加・3 行削除）。(1) 手順適用範囲・前提の必要権限を、OPS は証跡の参照権限で日次締め記録を確かめ訂正しない、訂正は店番担当が店番の区分で、つけ残高は店主代表が管理の区分で行う、に直した。(2) 一次対応の流れの手順 2 を「OPS が日次締め記録で同じ内容を確かめる」に直した。(3) 関連ドキュメント導線で `opr-incident` を「予定」から、`opr-incident-sample`（運用手順（障害対応））・作成済に直した。

## 3. 申し送り

- R4 の確かめ表（主張・正本・結果）は 10 件で、不一致 3 件（No1〜No3）を直し、一致 7 件（No4〜No10）を維持した。確かめられなかった主張はない。
- `opr-sample` を `opr-index` と呼ぶ書き方は、分冊 sample（`opr-access-control`・`opr-change`・`opr-incident`）に共通するため維持した。ただし `opr-sample` 自身は手順群の入口を `opr-index-sample` としており、呼び方が食い違う。R5（整合）で決める必要がある。
- R4 確かめ No1: 主張「OPS は閲覧の権限、訂正は店番担当が記録の権限」（手順適用範囲・前提の必要権限）／正本 docs/ja/specdojo/samples/opd-access-control-sample.md の権限区分／結果 不一致。権限区分は店番・管理・運用・保守で、つけ残高の訂正は管理の区分だけ。「OPS は証跡の参照権限で日次締め記録を確かめ、訂正しない。訂正は店番担当が店番の区分で、つけ残高は店主代表が管理の区分で」に直した。
- R4 確かめ No2: 主張「OPS の閲覧の権限で同じ画面を確かめる」（一次対応の流れの手順 2）／正本 opd-access-control-sample の権限区分と opr-sample の証跡の表（日次締め記録の参照権限に OPS）／結果 不一致。「OPS が日次締め記録で同じ内容を確かめる」に直した。
- R4 確かめ No3: 主張「`opr-incident` は予定」（関連ドキュメント導線）／正本 docs/ja/specdojo/samples/opr-incident-sample.md と opr-rulebook の sample 宣言／結果 不一致。[[specdojo:opr-incident-sample\|運用手順（障害対応）]]・作成済に直した。
- R4 確かめ No4: 主張 P1〜P3 の条件・期限と「P1 で OPS が応答しなければ PO」／正本 opd-index-sample の体制・責任分界の表／結果 一致。
- R4 確かめ No5: 主張 操作の質問・記録の訂正の依頼・機能の要望の応答の目標／正本 opd-index-sample の問い合わせ運用方針／結果 一致。
- R4 確かめ No6: 主張 KPI「営業日の 90% 以上で記録を継続」／正本 opd-index-sample の SLO・SLA・KPI／結果 一致。
- R4 確かめ No7: 主張 営業時間 10:00〜18:00、開店前 9:45 から／正本 opr-sample の手順適用範囲・前提／結果 一致。
- R4 確かめ No8: 主張 操作メモ「顧客の画面の取り消しから当日分だけ消せます」／正本 opr-sample の問い合わせ一次対応手順／結果 一致。
- R4 確かめ No9: 主張「夜間バックアップの失敗は監視で検知」／正本 opd-index-sample の監視・アラート方針／結果 一致。
- R4 確かめ No10: 主張 frontmatter の `type: operations` と `rulebook: specdojo:opr-rulebook`／正本 docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml と opr-rulebook の sample 宣言／結果 一致。
- grade の finding F001（vp-po-decision-readiness）と F004（vp-ops-release-readiness）: kata-guide の『kata を agent でレビューする』は、この 2 観点を kata の段のレビューで使わないとしているため扱わない。
- grade の finding F002（vp-qe-verifiability、opr-sample の保管期間）: opr-sample の未決事項の表に『監査ログ以外の証跡の保管期間』の行と決まるまでの扱いがあり、証跡の章からも参照しているため解消済みと判断し、opr-sample は変えていない。
- grade の finding F003（vp-qe-kata-conformance）: 『予定』の誤りは R4 で直した。opr-sample を `opr-index` と呼ぶ書き方は分冊 sample（opr-access-control・opr-change・opr-incident）の共通の書き方なので維持した。ただし opr-sample が手順群の入口を opr-index-sample としていて呼び方が食い違うため、R5（整合）で決める必要がある。

## 4. 進め方と実践の型の適用

`kata-guide` の「kata を agent でレビューする」に従い R4（正しさ）を行った。sample の事実を、権限区分は `opd-access-control-sample`、問い合わせ運用方針・優先度・KPI・監視は `opd-index-sample`、証跡・営業時間・操作メモは `opr-sample`、分冊の作成状態は `opr-incident-sample` と `opr-rulebook` の sample 宣言、frontmatter は `deliverable-frontmatter.schema.yaml` と突き合わせた。誤りは正本を正として直し、一致したものは維持した。F001・F004 はこの段の観点外として扱わず、F002 は解消済みとして `opr-sample` を変えなかった。F003 は R4 の範囲（「予定」の誤り）だけ直し、`opr-index` の呼び方の統一は R5 に回した。
