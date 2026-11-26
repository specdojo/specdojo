---
specdojo:
  id: prj-0001:xer-t-kata-review-all-nfr-usability-sample-150-20261126t085754z-c6787407
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-nfr-usability-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-nfr-usability-sample-150/T-KATA-REVIEW-ALL-nfr-usability-sample-150-20261126T085754Z-c6787407/plan.md
  started_at: "2026-11-26T08:58:04.743Z"
  completed_at: "2026-11-26T09:05:21.591Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:nfr-usability-sample
    - specdojo:nfr-usability-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として `nfr-usability-sample` を同じ接頭辞の sample、`sf-index-sample`、`uis-sample`、`stc-sample`、`stc-index-sample` と突き合わせ、sample 側の食い違いを直した。
- つけ・在庫の画面 ID を `sf-index-sample` に合わせ、販売完了画面に `uis-sales-complete` を付け、総合テスト導線の目的を判定方法（総合テスト終了時のレビュー）に揃えた。
- grade の F001（`sac-store-sales` の参照の書き方）と F002（判定者列の表記）は、evidence の `final_message` では前の段で解消済みとされている。
- 相手側を直すべき点 3 件（R5-4〜R5-6）は変更せず、直す案を findings と handoff に記した。
- 検査では `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が通った。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | 適用範囲・利用者前提、関連ドキュメント導線 | つけ・在庫の画面の仮置き ID（`uis-credit-ledger`・`uis-stock-list`）が、`sf-index-sample` の画面 ID（`uis-credit-sale`・`uis-inventory`）と食い違っていた。 | `uis-credit-sale`・`uis-inventory` に揃え、「未作成の仮置き名」を「未作成」にした。 | `vp-qe-kata-conformance`（kata 相互）。正本は `sf-index-sample` のシステム化機能一覧。 | - |
| R5-2 | R5 | 適用範囲・利用者前提 | 販売完了画面に識別子がなく、`uis-sample` が定める `uis-sales-complete` と対応が取れなかった。 | 「販売完了画面（`uis-sales-complete`）」とした。 | `vp-qe-kata-conformance`。`uis-sample` の遷移表の会計完了の行。 | - |
| R5-3 | R5 | 関連ドキュメント導線（総合テストの行） | 総合テストの行の目的が、`nfr-usb-005`・`nfr-usb-006` を総合テストのケースで判定するように読めた。測定・検証方法ではこの 2 件は総合テスト終了時のレビューで判定し、`stc-index-sample` は操作性を総合テストで扱わない。 | 「総合テストの終了時に `nfr-usb-005`・`nfr-usb-006` をレビューする会計の経路（確定前の取消を含む）」にした。 | `vp-qe-kata-conformance`、`vp-dev-change-impact`。`stc-sample` の概要、`stc-index-sample` の観点の立て方。 | - |
| R5-4 | R5 | 操作性要件一覧（相手側: `nfr-index-sample` のカテゴリ一覧の操作性の行） | 一覧の代表指標は「誤操作による取消の件数」だが、分冊の `nfr-usb-002` は割合（誤操作率 2% 以下）で判定する。 | sample 側は変更していない。相手側を直す案: `nfr-index-sample` の代表指標を「説明なしでのタスク完了率、誤操作による取消の割合」にする。 | `vp-qe-kata-conformance` | - |
| R5-5 | R5 | 操作性要件一覧（相手側: `nfr-index-sample` のカテゴリ一覧の操作性の行） | 一覧の「守ること」は「家族利用者代表が説明なしで会計とつけの記録を終えられる」だが、分冊が完了率で判定するのは現金会計だけである。つけは残高確認の時間（`nfr-usb-003`）だけを判定している。 | sample 側は変更していない。相手側を直す案: `nfr-index-sample` の行を「家族利用者代表が説明なしで会計とつけ残高の確認を終えられる」にする。選ばなかった案: 分冊につけの記録の完了率の要件を足す（基準値の業務判断が要るため見送った）。 | `vp-qe-kata-conformance` | 要判断 |
| R5-6 | R5 | 操作性要件一覧（相手側: `prj-success-criteria-and-acceptance-criteria-sample` の SC-01、`dss-sample`） | SC-01 は両代表が 3 タスクを完了率 100% で終えることを求め、分冊の `nfr-usb-001` は新任利用者 5 名で会計だけを 80% 以上としている。被験者と対象が違うため矛盾とは言い切れないが、読み手には食い違って見える。また `dss-sample` は `nfr-usability` に「キーボード操作」の要求があるように書き、受入条件・総合テストの想定 ID を `sac-usability`・`stc-store-gui` としている。一方、分冊と `nfr-index-sample` は `sac-store-sales` を使い、キーボード操作の要件はない。 | sample 側は変更していない。相手側を直す案: `dss-sample` の想定 ID を `sac-store-sales` に揃え、キーボード操作の記述を「操作性要件の対象外（設計条件として `dss` が持つ）」とする。SC-01 と `nfr-usb-001` の関係（プロジェクトの成功判定と製品品質の判定の違い）は、人が分冊か成功基準に 1 文足すかを決める。 | `vp-qe-kata-conformance`、`vp-dev-change-impact` | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/nfr-usability-sample.md`: 適用範囲のつけ・在庫の画面 ID を `uis-credit-sale`・`uis-inventory` に揃え、販売完了画面を `uis-sales-complete` と明記した。関連ドキュメント導線では、総合テストの行の目的を「総合テストの終了時に `nfr-usb-005`・`nfr-usb-006` をレビューする会計の経路（確定前の取消を含む）」に改めた。未作成の文書には「未作成」を明示した。prettier で表を整形した。

## 3. 申し送り

- R5-1: R5 / 適用範囲・利用者前提、関連ドキュメント導線 / つけ・在庫の画面の仮置き ID（`uis-credit-ledger`・`uis-stock-list`）が、`sf-index-sample` の画面 ID（`uis-credit-sale`・`uis-inventory`）と食い違っている / `uis-credit-sale`・`uis-inventory` に揃え、「未作成の仮置き名」を「未作成」にした / `vp-qe-kata-conformance`（kata 相互）。正本は `sf-index-sample` のシステム化機能一覧 / -
- R5-2: R5 / 適用範囲・利用者前提 / 販売完了画面に識別子がなく、`uis-sample` が定める `uis-sales-complete` と対応が取れない / 「販売完了画面（`uis-sales-complete`）」とした / `vp-qe-kata-conformance`。`uis-sample` の遷移表の会計完了の行 / -
- R5-3: R5 / 関連ドキュメント導線 / 総合テストの行の目的「`nfr-usb-005`・`nfr-usb-006` を判定する総合テストの会計の経路」は、総合テストのケースで判定するように読める。測定・検証方法ではこの 2 件は総合テスト終了時のレビューで判定し、`stc-index-sample` は操作性を総合テストで扱わない / 「総合テストの終了時に `nfr-usb-005`・`nfr-usb-006` をレビューする会計の経路（確定前の取消を含む）」にした / `vp-qe-kata-conformance`、`vp-dev-change-impact`。`stc-sample` の概要（確定前の取消を含む）、`stc-index-sample` の観点の立て方 / -
- R5-4: R5 / 操作性要件一覧（相手側: `nfr-index-sample` のカテゴリ一覧の操作性の行） / 一覧の代表指標は「誤操作による取消の件数」だが、分冊の `nfr-usb-002` は割合（誤操作率 2% 以下）で判定する / - / `vp-qe-kata-conformance`。相手側を直す案: `nfr-index-sample` の代表指標を「説明なしでのタスク完了率、誤操作による取消の割合」にする / -
- R5-5: R5 / 操作性要件一覧（相手側: `nfr-index-sample` のカテゴリ一覧の操作性の行） / 一覧の「守ること」は「家族利用者代表が説明なしで会計とつけの記録を終えられる」だが、分冊が完了率で判定するのは現金会計だけで、つけは残高確認の時間（`nfr-usb-003`）だけを判定している / - / `vp-qe-kata-conformance`。相手側を直す案: `nfr-index-sample` の行を「家族利用者代表が説明なしで会計とつけ残高の確認を終えられる」にする。選ばなかった案: 分冊に、つけの記録の完了率の要件を足す（基準値の業務判断が要るため見送った） / 要判断
- R5-6: R5 / 操作性要件一覧（相手側: `prj-success-criteria-and-acceptance-criteria-sample` の SC-01、`dss-sample`） / SC-01 は両代表が 3 タスクを完了率 100% で終えることを求め、分冊の `nfr-usb-001` は新任利用者 5 名で会計だけを 80% 以上としている。被験者と対象が違うため矛盾とは言い切れないが、読み手には食い違って見える。また `dss-sample` は `nfr-usability` に「キーボード操作」の要求があるように書き、受入条件・総合テストの想定 ID を `sac-usability`・`stc-store-gui` としているが、分冊と `nfr-index-sample` は `sac-store-sales` を使い、キーボード操作の要件はない / - / `vp-qe-kata-conformance`、`vp-dev-change-impact`。相手側を直す案: `dss-sample` の想定 ID を `sac-store-sales` に揃え、キーボード操作の記述を「操作性要件の対象外（設計条件として `dss` が持つ）」とする。SC-01 と `nfr-usb-001` の関係（プロジェクトの成功判定と製品品質の判定の違い）は、人が分冊か成功基準に 1 文足すかを決める / 要判断
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/ 配下の sample だけで、plan・result・個票は変更していないため）

## 4. 進め方と実践の型の適用

sample-maintenance の進め方に沿って、`nfr-usability-sample` を `sf-index-sample`、`uis-sample`、`stc-sample`、`stc-index-sample`、`nfr-index-sample` と突き合わせた。sample 側で確証のある食い違い（画面 ID、総合テスト導線の目的）だけを直し、F001・F002 は前の段で解消済みであることを確認した。相手側の修正や業務判断が要る点（R5-4〜R5-6）は変更せず、案を残した。`status` は `draft` のまま据え置いた。
