---
specdojo:
  id: prj-0001:xer-t-kata-review-all-nfr-reliability-sample-150-20261126t084513z-0678fcde
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-nfr-reliability-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-nfr-reliability-sample-150/T-KATA-REVIEW-ALL-nfr-reliability-sample-150-20261126T084513Z-0678fcde/plan.md
  started_at: "2026-11-26T08:45:24.119Z"
  completed_at: "2026-11-26T08:54:10.263Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:nfr-reliability-sample
    - specdojo:nfr-reliability-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）のレビューとして `nfr-reliability-sample` を、完全性要件・総合テスト index・依存関係の sample と突き合わせて直した。
- 完全性要件の `nfr-int-003` と重複していた二重記録の要件 `nfr-rel-002` を外し、旧 `nfr-rel-003` から `nfr-rel-005` を `nfr-rel-002` から `nfr-rel-004` に振り直した。
- 検証先の総合テスト ID を `stc-index-sample` に合わせて `stc-record-recovery` と `stc-sale-hold` に直した。
- ACD-D03 は前提条件ではなく依存関係の項目なので、その記述に直した。
- 相手側の sample を直す案は 3 件（R5-4 から R5-6）を findings に残した。
- grade の F001 は R4 の観点で、前の段で `nfr-rel-001` の備考に判断の時期が書き足してあった。そのため R5 では追加の変更をしていない。
- lint 系、`validate:schema`、`test:docs` の検査は通っている。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | 3. 信頼性要件一覧、4. 測定・検証方法、5. 関連ドキュメント導線 | `nfr-rel-002`（同じ取引が二重に記録されない）が、完全性要件の `nfr-int-003`（同一取引番号の重複記録 0 件）と同じ要求を別の定義で持っていた。nfr-index-sample の変更の入口の表にも、統合の例として同じ二重記録の要求が挙がっている。 | 要件の行と測定の行を削り、旧 `nfr-rel-003` から `nfr-rel-005` を `nfr-rel-002` から `nfr-rel-004` に振り直した。概要に完全性要件で定める旨を書き足し、瞬断の要件の備考に `nfr-int-003` への参照を足し、導線の表に完全性要件の行を足した。業務影響の箇条書きの「つけが二重に残る」も記録の失敗に直した。選ばなかった案は、信頼性の側に残し、完全性の側を再送に限らない重複に絞る案。 | `vp-qe-kata-conformance`（kata 相互）、`vp-dev-change-impact` | 要判断 |
| R5-2 | R5 | 4. 測定・検証方法、5. 関連ドキュメント導線 | 検証先の `stc-reliability` は stc-index-sample の対象別の ID の一覧になく、nfr-index-sample の導線（`stc-cash-sale`、`stc-sale-hold`）とも食い違っていた。 | 瞬断からの回復（新 `nfr-rel-002`）は `stc-record-recovery`、不正値の試験（新 `nfr-rel-004`）は `stc-sale-hold` に直し、導線の表も 2 行に分けた。 | `vp-qe-kata-conformance`（適用先）。stc-index-sample の対象別の ID の一覧 | - |
| R5-3 | R5 | 2. 適用範囲・前提条件、4. 測定・検証方法 | 「前提条件 ACD-D03」と書いていたが、prj-assumptions-constraints-dependencies-sample では ACD-D03 は依存関係の項目（店主代表によるオフライン時の運用方針の決定）である。nfr-availability-sample も「依存関係 ACD-D03」と書いている。 | 2 か所を「依存関係 ACD-D03」に直し、導線の目的を「オフライン時の方針の決定（ACD-D03）」にした。 | `vp-qe-kata-conformance`（参照先） | - |
| R5-4 | R5 | nfr-index-sample のカテゴリ一覧（信頼性の行） | 守ること「誤った金額・数量の販売記録を作らない」と代表指標「販売記録の誤り件数、入力検証で止めた誤入力の割合」が、本書の中心（記録処理が失敗しない、瞬断から自動で回復する、異常終了しない）と合わない。 | 相手側を直す案: 信頼性の行を「記録処理が失敗せず、通信の瞬断から自動で回復する」とし、代表指標を「会計処理の障害率（月次）、瞬断時の処理成功率」にする。本タスクでは変更していない。 | `vp-qe-kata-conformance`（kata 相互） | - |
| R5-5 | R5 | nfr-index-sample の関連ドキュメント導線（信頼性の行） | 検証先が `sac-reliability`、`stc-cash-sale`、`stc-sale-hold` で、本書の検証先（`stc-record-recovery`、`stc-sale-hold`）と合わない。`stc-cash-sale` は二重記録の試験で、二重記録は完全性要件で扱う。 | 相手側を直す案: 信頼性の行の検証先を `sac-reliability`、`stc-record-recovery`、`stc-sale-hold` にする。本タスクでは変更していない。 | `vp-qe-kata-conformance`、`vp-dev-change-impact` | - |
| R5-6 | R5 | 5. 関連ドキュメント導線（運用方針の監視の行） | 本書は opd-monitoring-sample を「エラー件数・異常終了の監視方針」として参照しているが、相手の監視対象はホスティング環境の死活、閉店後のバックアップ、日次締めの差異の 3 つで、アプリのエラー件数と異常終了はない。 | 相手側を直す案: opd-monitoring-sample の監視対象に、会計処理のエラー件数とアプリの異常終了を足す。もう一つの案は、本書の導線の目的を「監視・通知の方針」に弱める案。どちらの側を直すかは、監視の範囲の判断による。本タスクでは変更していない。 | `vp-qe-kata-conformance`（参照先） | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/nfr-reliability-sample.md`: 二重記録の要件とその測定の行を削除し、要件 ID を振り直した。概要と瞬断の要件の備考に、完全性要件の `nfr-int-003` への参照を足した。検証先を `stc-record-recovery` と `stc-sale-hold` に直し、導線の表に完全性要件の行を足した。ACD-D03 は依存関係と書き直した。

## 3. 申し送り

- R5-1 は要件を削って ID を振り直す影響の大きい変更なので、人の判断が要る。
- 相手側の sample の修正案（R5-4、R5-5、R5-6）は変更していない。
- R5-1: R5 / 3. 信頼性要件一覧・4. 測定・検証方法・5. 関連ドキュメント導線 / `nfr-rel-002`（同じ取引が二重に記録されない）が、完全性要件の `nfr-int-003`（同一取引番号の重複記録 0 件）と同じ要求を別の定義（同じ確定操作から作られた記録 / 同一取引番号）で持っていた。nfr-index-sample の変更の入口の表でも、統合の例として「信頼性と完全性で同じ二重記録の要求を持っている」が挙がっている / 要件の行と測定の行を削り、旧 `nfr-rel-003`〜`005` を `nfr-rel-002`〜`004` に振り直した。概要に「記録が欠けない・二重に残らないことは完全性要件で定める」を書き足し、瞬断の要件の備考に `nfr-int-003` への参照を足し、導線の表に完全性要件の行を足した。業務影響の箇条書きの「つけが二重に残る」も記録の失敗に直した / `vp-qe-kata-conformance`（kata 相互）、`vp-dev-change-impact`。迷った理由: 要件の行を削り ID を振り直すのは影響が大きい。選ばなかった案は、信頼性の側に残し、完全性の側を再送に限らない重複に絞る案 / 要判断
- R5-2: R5 / 4. 測定・検証方法・5. 関連ドキュメント導線 / 検証先の `stc-reliability` は stc-index-sample の対象別の ID の一覧になく、nfr-index-sample の導線（`stc-cash-sale`、`stc-sale-hold`）とも食い違っていた / 瞬断からの回復（新 `nfr-rel-002`）は `stc-record-recovery`（応答欠落・保存失敗の検知から復元）、不正値の試験（新 `nfr-rel-004`）は `stc-sale-hold`（入力不足の検知で未確定のまま止める）に直し、導線の表も 2 行に分けた / `vp-qe-kata-conformance`（適用先）。stc-index-sample の対象別の ID の一覧 / -
- R5-3: R5 / 2. 適用範囲・前提条件、4. 測定・検証方法 / 「前提条件 ACD-D03」と書いていたが、prj-assumptions-constraints-dependencies-sample では ACD-D03 は依存関係の項目（店主代表によるオフライン時の運用方針の決定）で、nfr-availability-sample も「依存関係 ACD-D03」と書いている / 2 か所を「依存関係 ACD-D03」に直し、導線の目的を「オフライン時の方針の決定（ACD-D03）」にした / `vp-qe-kata-conformance`（参照先） / -
- R5-4: R5 / nfr-index-sample のカテゴリ一覧（信頼性の行） / 守ること「誤った金額・数量の販売記録を作らない」と代表指標「販売記録の誤り件数、入力検証で止めた誤入力の割合」が、本書の中心（記録処理が失敗しない・瞬断から自動で回復する・異常終了しない）と合わない / -（相手側の案: nfr-index-sample の信頼性の行を「記録処理が失敗せず、通信の瞬断から自動で回復する」とし、代表指標を「会計処理の障害率（月次）、瞬断時の処理成功率」にする） / `vp-qe-kata-conformance`（kata 相互） / -
- R5-5: R5 / nfr-index-sample の関連ドキュメント導線（信頼性の行） / 検証先が `sac-reliability`、`stc-cash-sale`、`stc-sale-hold` で、本書の検証先（`stc-record-recovery`、`stc-sale-hold`）と合わない。`stc-cash-sale` は二重記録の試験で、二重記録は完全性要件で扱う / -（相手側の案: 信頼性の行の検証先を `sac-reliability`、`stc-record-recovery`、`stc-sale-hold` にする） / `vp-qe-kata-conformance`、`vp-dev-change-impact` / -
- R5-6: R5 / 5. 関連ドキュメント導線（運用方針の監視の行） / 本書は opd-monitoring-sample を「エラー件数・異常終了の監視方針」として参照しているが、相手の監視対象はホスティング環境の死活、閉店後のバックアップ、日次締めの差異の 3 つで、アプリのエラー件数と異常終了はない / -（相手側の案: opd-monitoring-sample の監視対象に、会計処理のエラー件数とアプリの異常終了を足す。もう一つの案は、本書の導線の目的を「監視・通知の方針」に弱める案） / `vp-qe-kata-conformance`（参照先）。迷った理由: どちらの側を直すかは、監視の範囲の判断による / 要判断
- grade の F001（`vp-qe-verifiability`、基準値が未定）は R4 の観点なので R5 では扱わない。前の段で `nfr-rel-001` の備考に判断の時期（試用期間の終了時、`_ASSUMPTION_`）が書き足してあり、異常終了の要件（新 `nfr-rel-003`）も同じ時期に決めると書いてあるので、手当ては済んでいる。用語集（`gl-*.yaml`）とは食い違いがなかった。

## 4. 進め方と実践の型の適用

参照の向きを成果物から sample に切り替え、同じ接頭辞の index sample、参照先の sample、用語集を突き合わせた。用語集との食い違いはなかった。食い違いのうち本書側で直せるものは直した。相手側を直すべきものは変更せず、直す案を findings に残した。grade の F001 は `vp-qe-verifiability` の指摘で、R4 の観点に当たる。前の段で備考に判断の時期が書き足されていたので、R5 では扱っていない。
