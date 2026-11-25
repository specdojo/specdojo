---
specdojo:
  id: prj-0001:xer-t-kata-review-all-opr-access-control-sample-110-20261125t050657z-d5f3c5a6
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-opr-access-control-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-opr-access-control-sample-110/T-KATA-REVIEW-ALL-opr-access-control-sample-110-20261125T050657Z-d5f3c5a6/plan.md
  started_at: "2026-11-25T05:07:08.486Z"
  completed_at: "2026-11-25T05:20:36.504Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opr-access-control-sample
    - specdojo:opr-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R1（目的の過不足）を実施し、`docs/ja/specdojo/samples/opr-sample.md` の運用変更作業の章を 1 箇所だけ修正した（1 行追加・1 行削除）。
- 指摘一覧（R1 の確かめ）： | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | R1-1 | R1 | 8. 運用変更作業 | 重大変更の事前周知の要否と手段が価格の一括変更にしかなく、記録の操作が変わるアプリの版の更新の周知が書かれていない | 「記録の操作が変わる版の更新と価格の一括変更は、前日の閉店時に店内の掲示で店番担当へ周知する。記録に影響しない表示の修正は周知しない。」に直した | `vp-qe-kata-conformance`（opr-rulebook 6.8「重大変更は事前周知の要否と手段を明記する」）。周知の範囲は `opr-change-sample` に合わせた | - | | R1-2 | R1 | 12. 関連ドキュメント導線 | F003（分冊が障害対応だけ、`opr-incident` は予定、という記述）を確かめた。現在の表は分冊 sample 8 件を作成済として載せており、すでに解消している | 変更なし | `vp-qe-kata-conformance`（grade finding F003） | - | | R1-3 | R1 | 1. 概要・12. 関連ドキュメント導線 | 兄弟の分冊 sample は `opr-sample` を `opr-index` として参照している。一方 `opr-sample` 自身は入口を `opr-index-sample` と書き、`opr-index` の sample が 2 つになっている | 直していない。選ばなかった案は (a) `opr-sample` から入口の記述を消して自分を `opr-index` と名乗る、(b) 兄弟の分冊の参照先を `opr-index-sample` へ移す、の 2 つ。どちらを完成例とするかは rulebook の分担を決めないと選べない | `vp-qe-kata-conformance`、`vp-arc-single-responsibility` | 要判断 | | R1-4 | R1 | 1. 概要 | F001・F004（未決事項の表に決定者・期限・ready 化前の解消項目の列がない）は `vp-po-decision-readiness`・`vp-ops-release-readiness` の指摘で、kata の段では使わない観点 | 直していない | kata-guide「kata の観点の組」（外す観点） | - | | R1-5 | R1 | 11. 証跡 | F002（保管期間が `_UNDECIDED_`）は `vp-qe-verifiability` で R4 の観点。概要の未決事項の表には「監査ログ以外の証跡の保管期間」の行がすでにある | 直していない（R4 で扱う） | kata-guide「kata の観点の組」（R4 の観点） | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opr-sample.md`: 運用変更作業の章の事前周知の記述を、価格の一括変更だけから「記録の操作が変わる版の更新と価格の一括変更は、前日の閉店時に店内の掲示で店番担当へ周知する。記録に影響しない表示の修正は周知しない。」へ変更した（1 行追加・1 行削除）。opr-rulebook 6.8 の要求（重大変更の事前周知の要否と手段）を満たすための修正。

## 3. 申し送り

- タスク名は `opr-access-control-sample` だが、plan の編集対象と grade finding の行は `opr-sample.md` を指していたため、`opr-sample.md` だけを直した。`opr-access-control-sample.md` は読んだだけで変更していない。
- R1-3（`opr-index` の完成例が `opr-sample` と `opr-index-sample` の 2 つになっている件）は人の判断が必要である。R5 または人の判断で扱う。
- F001・F002・F004 は R1 の観点ではないため未対応である。F001・F004 は kata の段で使わない観点、F002 は R4 の観点である。F003 は確認の結果、すでに解消している。
- R1-1: R1 / 8. 運用変更作業 / 重大変更の事前周知の要否と手段が価格の一括変更にしかなく、記録の操作が変わるアプリの版の更新の周知が書かれていない / 「記録の操作が変わる版の更新と価格の一括変更は、前日の閉店時に店内の掲示で店番担当へ周知する。記録に影響しない表示の修正は周知しない。」にした / `vp-qe-kata-conformance`（opr-rulebook の運用変更作業（6.8）「重大変更は事前周知の要否と手段を明記する」）、周知の範囲は `opr-change-sample` の運用変更の表と事前周知の手順に合わせた / -
- R1-2: R1 / 12. 関連ドキュメント導線 / F003（関連導線が分冊を障害対応だけと書き、`opr-incident` を予定としている）を確かめた。現在の表は分冊 sample 8 件をすべて作成済として載せており、指摘はすでに解消している / - / `vp-qe-kata-conformance`（grade finding F003） / -
- R1-3: R1 / 1. 概要・12. 関連ドキュメント導線 / 兄弟の分冊 sample（opr-incident・opr-backup-restore・opr-batch・opr-change・opr-monitoring・opr-support・opr-access-control）は `opr-sample` を `opr-index` として参照している。一方で `opr-sample` 自身は「手順群の入口は `opr-index-sample`」と書き、`opr-index` の sample が `opr-sample`（opr-rulebook）と `opr-index-sample`（opr-index-rulebook）の 2 つになっている / - / `vp-qe-kata-conformance`、`vp-arc-single-responsibility`。直さなかった理由: どちらを `opr-index` の完成例とするかは rulebook の分担（opr-rulebook と opr-index-rulebook）を決めないと選べず、対象の kata だけでは解けない。選ばなかった案: (a) `opr-sample` から `opr-index-sample` への入口の記述を消して自分を `opr-index` と名乗る、(b) 兄弟の分冊の参照先を `opr-index-sample` へ移す。R5 または人の判断で扱う / 要判断
- R1-4: R1 / 1. 概要 / F001・F004（未決事項の表に決定者・期限・ready 化前に解消すべき項目の列がない）は `vp-po-decision-readiness`・`vp-ops-release-readiness` の指摘で、kata-guide の「kata の観点の組」はこの 2 つを kata の段のレビューで使わない観点としているため直していない / - / kata-guide の「kata の観点の組」（外す観点） / -
- R1-5: R1 / 11. 証跡 / F002（保管期間が `_UNDECIDED_`）は `vp-qe-verifiability` で R4 の観点のため、この段では扱わない。概要の未決事項の表にはすでに「監査ログ以外の証跡の保管期間」の行がある / - / kata-guide の「kata の観点の組」（R4 の観点） / -
- 対象の確認: タスク名は opr-access-control-sample だが、plan の編集対象（rulebook の sample 宣言から解決）と grade finding の行は opr-sample.md を指していたため、opr-sample.md だけを直した。opr-access-control-sample.md は読んだだけで変えていない
- 適用外の検証: `npm run validate:history-links`（変えたのは docs/ja/specdojo/samples/opr-sample.md だけで、plan・result・個票を変えていないため）

## 4. 進め方と実践の型の適用

approach は sample-maintenance。R1 の観点（種別の責務と opr-rulebook の目的に対する過不足）で `opr-sample.md` を確かめ、rulebook の要求（6.8）に当たる不足を 1 箇所だけ足した。plan に展開された grade finding は 4 件。F003 は確認の結果すでに解消済み、F001・F004 は kata の段で使わない観点、F002 は R4 の観点として扱わなかった。rulebook など sample 以外は変更していない。検証は、executor が `npx prettier --check` を実行して通過した。runner は `npm run lint:md:changed`、`npm run lint:fm:changed`、`npm run lint:mermaid`、`npm run lint:d2`、`npm run test:docs`、`npm run validate:schema` を実行し、いずれも通過した。変更種別に当たらない検査は `not_applicable` で、`npm run validate:history-links` も履歴ファイルを変えていないため `not_applicable` である。未解消は R1-3 の 1 件で、次のアクションは rulebook の分担を決めたうえでの人の判断。
