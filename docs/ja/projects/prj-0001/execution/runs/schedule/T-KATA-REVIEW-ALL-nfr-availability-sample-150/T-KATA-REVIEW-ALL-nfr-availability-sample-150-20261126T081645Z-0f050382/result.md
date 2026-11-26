---
specdojo:
  id: prj-0001:xer-t-kata-review-all-nfr-availability-sample-150-20261126t081645z-0f050382
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-nfr-availability-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-nfr-availability-sample-150/T-KATA-REVIEW-ALL-nfr-availability-sample-150-20261126T081645Z-0f050382/plan.md
  started_at: "2026-11-26T08:16:55.783Z"
  completed_at: "2026-11-26T08:25:42.671Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:nfr-availability-sample
    - specdojo:nfr-availability-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの R5（整合）として、可用性要件 sample を信頼性要件・非機能要件 index・運用方針 index・前提・制約・依存 sample と突き合わせ、sample 側で直せる 4 点を修正した。
- 修正内容は、1 分以上の通信断を停止とする線引き、依存関係 ACD-D03 の参照、判断記録 `dec-offline-recording` の導線の追加、RTO・RPO の正式名の明記である。
- 受入条件・総合テストの ID の食い違いは、どちらを正とするか決められないため要判断として残した。信頼性要件側の ACD-D03 の分類は、相手側を直す案を示すにとどめた。
- grade の F001 と F002 は R5 の観点に当たらないため、この段では扱っていない。
- executor 実施の markdownlint は 0 件で、runner 実施の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も成功した。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | 適用範囲・除外条件、未決事項（`nfr-reliability-sample` との関係） | 信頼性要件は 1 分未満の瞬断を自動回復の対象、1 分以上を可用性の停止としている。本書は店舗の通信回線の断をすべて停止に数えており、扱いが重なる。 | 条件を「店舗の回線が 1 分以上切れて記録できない時間。1 分未満の瞬断は信頼性要件の自動回復で扱う」、稼働率での扱いを「停止に含める。1 分未満の瞬断は含めない」とした。未決事項の当面の扱いも「1 分以上の通信断を停止として数え」にした。 | `vp-qe-kata-conformance`（信頼性要件の「適用範囲・前提条件」の店頭の通信瞬断・技術前提の行） | - |
| R5-2 | R5 | 未決事項、関連ドキュメント導線 | 通信断時の記録方法は前提・制約・依存の依存関係 ACD-D03（オフライン時の運用方針の決定）で決まるのに、前提条件 ACD-A02 だけを挙げている。 | 未決事項を「前提条件 ACD-A02、依存関係 ACD-D03」にした。導線の前提・制約・依存の目的欄に「オフライン時の運用方針の決定（ACD-D03）」を足した。 | `vp-qe-kata-conformance`（`prj-assumptions-constraints-dependencies-sample` の依存関係の ACD-D03 の行） | - |
| R5-3 | R5 | 関連ドキュメント導線 | 非機能要件 index（`nfr-index-sample`）の導線表は可用性の判断記録に `dec-offline-recording` を挙げ、rulebook の関連ドキュメント導線も設計判断の `dec-*` を求める。しかし本書には判断記録の行がない。 | 判断記録の行を足した。内容は `dec-offline-recording`、オフライン時の記録方法と紙の販売控えへの切替の判断（決定待ち）、`nfr-avl-004` の前提である。 | `vp-qe-kata-conformance`、`vp-dev-change-impact`（index の関連ドキュメント導線、rulebook の関連ドキュメント導線の記述ルール） | - |
| R5-4 | R5 | 可用性要件一覧（指標欄） | index と運用方針（`opd-index-sample`）は「目標復旧時間（RTO）」「目標復旧時点（RPO）」と書くが、本書の指標欄は略語だけである。 | 指標欄を「目標復旧時間（RTO）」「目標復旧時点（RPO）」にした。 | `vp-qe-kata-conformance`（index のカテゴリ一覧、`opd-index-sample` の未決事項） | - |
| R5-5 | R5 | 関連ドキュメント導線（受入条件・総合テストの ID） | 受入条件・総合テストの ID が index（`sac-store-sales`、`stc-record-recovery`）と本書（`sac-availability`、`stc-availability`）で食い違う。 | 変更していない。本書を index に寄せなかった理由は、rulebook の良い例が `sac-availability` であり、分冊の間でも信頼性・完全性は分冊ごとの ID、機密性・安全性・操作性は `sac-store-sales` と分かれていて、どちらが正か決められないことである。案 1 は index の可用性の行を `sac-availability`・`stc-availability` にする。案 2 は分冊ごとの ID に統一する方針を決め、index の各行を直す。 | `vp-dev-change-impact` | 要判断 |
| R5-6 | R5 | 相手側（`nfr-reliability-sample` の適用範囲・前提条件） | 信頼性要件が ACD-D03 を「前提条件 ACD-D03」と書いているが、ACD-D03 は前提・制約・依存の依存関係の項目である。 | 変更していない。相手側の直す案は、`nfr-reliability-sample` の技術前提の箇条を「依存関係 ACD-D03」に直すことである。 | `vp-qe-kata-conformance` | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/nfr-availability-sample.md`: 適用範囲・除外条件と未決事項で、1 分以上の通信断を停止に数え、1 分未満の瞬断は信頼性要件で扱うよう線引きした。未決事項に依存関係 ACD-D03 を追加した。関連ドキュメント導線に判断記録 `dec-offline-recording` の行を加え、前提・制約・依存の目的欄に ACD-D03 を足した。可用性要件一覧の指標欄を「目標復旧時間（RTO）」「目標復旧時点（RPO）」にした。表は prettier で整形した。

## 3. 申し送り

- R5-5 は要判断である。案 1 は index の可用性の行を `sac-availability`・`stc-availability` にする。案 2 は分冊ごとの ID に統一する方針を決めて index の各行を直す。
- R5-6 の相手側の修正案は、`nfr-reliability-sample` の技術前提の箇条を「依存関係 ACD-D03」に直すことである。本タスクでは変更していない。
- R5-1: R5 / 適用範囲・除外条件、未決事項 / 信頼性要件（`nfr-reliability-sample`）は 1 分未満の瞬断を自動回復の対象、1 分以上を可用性の停止としているが、本書は店舗の通信回線の断をすべて停止に数えており扱いが重なる / 条件を「店舗の回線が 1 分以上切れて記録できない時間。1 分未満の瞬断は信頼性要件の自動回復で扱う」、稼働率での扱いを「停止に含める。1 分未満の瞬断は含めない」とし、未決事項の当面の扱いを「1 分以上の通信断を停止として数え」にした / `vp-qe-kata-conformance`（信頼性要件の「適用範囲・前提条件」の店頭の通信瞬断・技術前提の行） / -
- R5-2: R5 / 未決事項、関連ドキュメント導線 / 通信断時の記録方法は前提・制約・依存の依存関係 ACD-D03（オフライン時の運用方針の決定）で決まるのに、前提条件 ACD-A02 だけを挙げている / 未決事項を「前提条件 ACD-A02、依存関係 ACD-D03」にし、導線の前提・制約・依存の目的欄に「オフライン時の運用方針の決定（ACD-D03）」を足した / `vp-qe-kata-conformance`（`prj-assumptions-constraints-dependencies-sample` の依存関係の ACD-D03 の行） / -
- R5-3: R5 / 関連ドキュメント導線 / 非機能要件 index（`nfr-index-sample`）の導線表は可用性の判断記録に `dec-offline-recording` を挙げ、rulebook の関連ドキュメント導線も設計判断の `dec-*` を求めるが、本書に判断記録の行がない / 判断記録の行（`dec-offline-recording`、オフライン時の記録方法と紙の販売控えへの切替の判断（決定待ち）。`nfr-avl-004` の前提）を足した / `vp-qe-kata-conformance`、`vp-dev-change-impact`（index の関連ドキュメント導線、rulebook の関連ドキュメント導線の記述ルール） / -
- R5-4: R5 / 可用性要件一覧 / index と運用方針（`opd-index-sample`）は「目標復旧時間（RTO）」「目標復旧時点（RPO）」と書くが、本書の指標欄は略語だけ / 指標欄を「目標復旧時間（RTO）」「目標復旧時点（RPO）」にした / `vp-qe-kata-conformance`（index のカテゴリ一覧、`opd-index-sample` の未決事項） / -
- R5-5: R5 / 関連ドキュメント導線 / 受入条件・総合テストの ID が index（`sac-store-sales`、`stc-record-recovery`）と本書（`sac-availability`、`stc-availability`）で食い違う / - / `vp-dev-change-impact`。本書を index に寄せなかった理由: rulebook の良い例が `sac-availability` で、分冊の間でも信頼性・完全性は分冊ごとの ID、機密性・安全性・操作性は `sac-store-sales` と分かれており、どちらが正か決められない。案 1: index の可用性の行を `sac-availability`・`stc-availability` にする。案 2: 分冊ごとの ID に統一する方針を決め、index の各行を直す / 要判断
- R5-6: R5 / 相手側（`nfr-reliability-sample` の適用範囲・前提条件） / 信頼性要件が ACD-D03 を「前提条件 ACD-D03」と書いているが、ACD-D03 は前提・制約・依存の依存関係の項目である / - / `vp-qe-kata-conformance`。相手側の直す案: `nfr-reliability-sample` の技術前提の箇条を「依存関係 ACD-D03」に直す / -
- 範囲外: grade の F001（`vp-arc-conciseness`）と F002（`vp-qe-verifiability`）は R5 の観点に当たらないため、この段では扱わず R3・R4 の段に任せた。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/ 配下の sample だけで、plan・result・個票を変更していない）

## 4. 進め方と実践の型の適用

sample-maintenance の進め方に従い、plan の R5 の観点で、同じ接頭辞の index、信頼性要件、運用方針 index、前提・制約・依存 sample と本書を照合した。食い違いのうち sample 側で直せるものだけを修正した。相手側を直すべき点と判断が分かれる点は変更せず、案を findings と handoff に残した。grade の F001（`vp-arc-conciseness`）と F002（`vp-qe-verifiability`）は R5 の観点外のため扱わず、R3・R4 の段に任せた。frontmatter の `status` は `draft` のまま据え置いた。
