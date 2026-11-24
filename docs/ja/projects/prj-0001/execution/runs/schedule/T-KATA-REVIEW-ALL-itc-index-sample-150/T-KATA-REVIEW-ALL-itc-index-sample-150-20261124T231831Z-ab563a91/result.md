---
specdojo:
  id: prj-0001:xer-t-kata-review-all-itc-index-sample-150-20261124t231831z-ab563a91
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-itc-index-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-itc-index-sample-150/T-KATA-REVIEW-ALL-itc-index-sample-150-20261124T231831Z-ab563a91/plan.md
  started_at: "2026-11-24T23:18:41.811Z"
  completed_at: "2026-11-24T23:31:50.369Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:itc-index-sample
    - specdojo:itc-index-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として `itc-index-sample` を `tsp-index-sample`・`etc-index-sample`・`ifd-sample` と突き合わせ、PATH-04（保全の取得）と PATH-07（復元の回復）を内部結合テストの範囲に置くよう関連する表と記述をそろえた。
- 保全・復元を扱う `itc-backup-restore` を単位として追加し、分配方針・依存の表・CI の行を対応させた。
- F002 に対応し、未決事項の報告先を既存の個票 `kinuya:pjr-i003` にした。保全・復元の成立条件（`kinuya:pjr-i004`）も未決事項に追加した。
- F001・F003・F004・F005・F006 は前の段で解消済みであることを確認した。
- 検証は runner の `lint:md:changed`・`lint:fm:changed`・`lint:mermaid`・`lint:d2`・`test:docs`・`validate:schema` が passed だった。変更種別に該当しない検査は `not_applicable` だった。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/itc-index-sample.md`: 目的と適用対象、テストレベルの表、対象外・除外理由を `tsp-index-sample` と `etc-index-sample` に合わせ、適用対象を PATH-01〜PATH-04・PATH-07 に変更した（外部結合テストは PATH-05・PATH-06 のみ）。業務リスクに保全・復元の食い違いを追加した。`itc-backup-restore` を括りの単位、観点の型、分配表（回復した記録と取得時点の一致／取得の途中失敗）に追加し、復元用保管サービスの Stub と CI の必須変更対象も追加した。メモ／将来課題では、通信不能時の販売継続の報告先を `kinuya:pjr-i003`、保全・復元の成立条件の行を新設して報告先を `kinuya:pjr-i004` にした。表は prettier で整形した。

## 3. 申し送り

- 要判断（R5-2）: 単位 `itc-backup-restore` を新設した。`itc-sales-checkout` に含める案は、トランザクションと依存境界が違うため採らなかった。単位を増やす判断が妥当か確認してほしい。
- 相手側の直し案: 次回の grade で F004 と同じ指摘が出た場合は、`tsp-index-sample` の「テストレベル」を正として扱う。相手側文書の変更は不要。
- `itc-backup-restore` の個別 sample は同梱しておらず、架空の成果物として扱っている。必要なら別タスクで作成する。
- `itc-sample`（`itc-sales-checkout`）は PATH-02・PATH-03 のみを扱い、今回の変更と食い違いはない。用語集には Stub・Mock・内部結合などの見出し語がなく、照合する食い違いもなかった。
- R5-1: R5 / 1. 本ドキュメントの目的と適用対象・テストレベルの表・3. 対象外・除外理由（共通） / PATH-04（保全の取得）と PATH-07（復元の回復）を外部結合テストの範囲としていた。tsp-index-sample の「テストレベル」「I/F の確認範囲と代替方法」と etc-index-sample は内部結合テストに置いており、食い違う / 適用対象を PATH-01〜PATH-04・PATH-07 にし、外部結合テストに置くのは PATH-05・PATH-06 だけにした。業務リスクに保全・復元の食い違いを足した。IT 行・ET 行と対象外の行も直した / vp-qe-kata-conformance（tsp-index-sample・etc-index-sample との整合） / -
- R5-2: R5 / 2. テスト対象の括り方と分割基準・4. 観点の立て方（共通）・6. 分配方針・7. 境界/依存の扱い・8. 環境の CI 行 / PATH-04・PATH-07 を扱う単位がなかった / `itc-backup-restore` を足した。観点の型の列、分配の行（回復した記録と取得時点の一致／取得の途中失敗）、復元用保管サービスの Stub の行も足し、CI の必須の変更対象に保全・復元処理を加えた / vp-qe-kata-conformance、vp-dev-change-impact。迷った理由: 単位の数を増やすため。選ばなかった案: itc-sales-checkout に含める（トランザクションと依存境界が違うため不採用） / 要判断
- R5-3: R5 / 10. メモ / 将来課題 / F002。「通信不能時の販売継続」の報告先が「PM へリスクとして報告」だけで、ifd-sample と tsp-index-sample が引き継いだ既存の個票 `kinuya:pjr-i003` を参照していない / 報告先を `kinuya:pjr-i003`（既存の個票に追記し、新たに起票しない）にした / F002（vp-pm-control-reporting） / -
- R5-4: R5 / 10. メモ / 将来課題 / ifd-sample の未決「保全・復元の成立条件」（`kinuya:pjr-i004`）が、PATH-04・PATH-07 を扱う本書に載っていなかった / 行を足した。当面の扱いは itc-backup-restore を記録の一致に絞ることとし、報告先は `kinuya:pjr-i004` にした / vp-qe-kata-conformance（ifd-sample との整合） / -
- R5-5: R5 / grade の指摘 F001・F003・F004・F005・F006 / 前の段で直っていることを確かめた。F004 の「PATH-04・PATH-07 は tsp の定めで外部結合テストの範囲」という前提は、いまの tsp-index-sample と逆である。本段では tsp に合わせた / -（相手側の文書の直しはない。次の grade で F004 と同じ指摘が出た場合は、tsp-index-sample の「テストレベル」を正とする） / F004、vp-qe-kata-conformance / -
- 申し送り: itc-sample（itc-sales-checkout）は PATH-02・PATH-03 だけを扱い、本段の変更と食い違いはない。itc-backup-restore の個別 sample は同梱しておらず、架空の成果物として扱う。用語集（`docs/ja/product/010-business-specs/060-glossary/`）には Stub・Mock・内部結合などの見出し語がなく、照合する食い違いもなかった。

## 4. 進め方と実践の型の適用

sample-maintenance の R5（整合）として実施した。同じ接頭辞の sample、`tsp-index-sample`・`etc-index-sample`・`ifd-sample` を根拠に、食い違いは sample 側だけを直した。PATH-04・PATH-07 の位置づけは `tsp-index-sample` の「テストレベル」を正とした。grade の F001・F003・F004・F005・F006 は前の段で直っていることを確認し、F002 は本段で直した。F004 が前提とした「PATH-04・PATH-07 は外部結合テスト」は現行の `tsp-index-sample` と逆だったため、`tsp-index-sample` に合わせた。根拠不足による見送りはない。frontmatter の `status` は `draft` のままである。
