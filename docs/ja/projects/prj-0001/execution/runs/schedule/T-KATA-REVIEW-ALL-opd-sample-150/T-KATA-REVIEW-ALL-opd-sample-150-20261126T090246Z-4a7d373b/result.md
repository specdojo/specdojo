---
specdojo:
  id: prj-0001:xer-t-kata-review-all-opd-sample-150-20261126t090246z-4a7d373b
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-opd-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-opd-sample-150/T-KATA-REVIEW-ALL-opd-sample-150-20261126T090246Z-4a7d373b/plan.md
  started_at: "2026-11-26T09:02:58.975Z"
  completed_at: "2026-11-26T09:12:06.404Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opd-sample
    - specdojo:opd-access-control-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として、`opd-access-control-sample` を同じ接頭辞の sample、参照先、用語集、共通サンプル文脈と照合し、食い違い 3 件を sample 側で直した。
- 相手側（`opr-index-sample`、`opr-access-control-sample`）を直すべき点 2 件は変更せず、直す案を handoff に残した。
- 変更は 1 ファイルのみ。executor の `npx prettier --write` は passed。runner 検査は `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が passed で、他は変更種別により `not_applicable`。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | 1. 概要（access-control）の未決事項の表 | `opr-access-control-sample` が「運用方針で未決」として挙げる「`OPS` に 15 分以内に連絡がつかないときのアカウント停止」が、方針側の未決事項にない。 | 未決事項の表に 1 行足した。判断者は `PO`。決まるまでは紙の販売控えへ切り替え、`OPS` が停止するまで新しく記録しない。影響する節は付与・剥奪の契機。 | `vp-qe-kata-conformance`（kata 相互）。`opr-access-control-sample` の概要の未決事項の表。 | - |
| R5-2 | R5 | 2.2. 付与・剥奪の契機 | 保守作業が終わったときの扱いを、方針側は「保守の区分を外す」、`opr-access-control-sample` の 9.1 は「剥奪（停止）」と書いている。2.6 の棚卸しは、保守作業中の権限変更記録にない `DEV` のアカウントを不合格にするため、区分を外すだけではアカウントが残り不合格になる。 | 行うことを「アカウントを停止する」にした。 | `vp-qe-kata-conformance`（kata 相互）、`vp-dev-change-impact`。 | - |
| R5-3 | R5 | 2.5. 監査ログ | 緊急権限の間に `DEV` が直す記録（つけ残高の訂正を含む）が、月次の「管理の区分以外の操作 0 件」に数えられ、緊急権限を正しく使った月も不合格になる。 | 緊急権限の間の `DEV` の操作は事後の確認で扱い、件数から除くと 1 文足した。相手側の `opr-access-control-sample` の 3. 日次・週次・月次点検手順の「月次（監査ログ）」の行にも同じ条件を足す案がある（未変更）。 | `vp-qe-kata-conformance`（kata 相互）。2.4 の緊急権限の事後の確認との整合。 | - |
| R5-4 | R5 | 3. 関連ドキュメント導線（`opr` 等） | 導線の先の `opr-index-sample` が、権限の行（34 行）と付与・剥奪の表（132〜135 行）で、区分を記録・閲覧・管理者とし、`DEV` に管理者権限を持たせ、付与を `DEV` が行う書き方になっている。本書の 4 区分と `OPS` が付与する体制、`opd-index-sample` の RACI（`OPS` が R、`DEV` が C）、`opr-sample` と食い違う。 | -（本書は変更していない）相手側の `opr-index-sample` を、4 区分に揃え、付与・剥奪を `OPS` が行い、詳しい手順を `opr-access-control-sample` に任せる形に改める案。 | `vp-qe-kata-conformance`（適用先）、`vp-dev-change-impact`。 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opd-access-control-sample.md`: 未決事項の表に、`OPS` に 15 分以内に連絡がつかないときのアカウント停止を 1 行追加した。保守作業が終わったときの扱いを「保守の区分を外す」から「アカウントを停止する」に揃えた。緊急権限の間の `DEV` の操作を、監査ログの「管理の区分以外の操作 0 件」の件数から除き、事後の確認で扱うと 1 文足した。表を prettier で整形した。

## 3. 申し送り

- R5-1: 段=R5 / 箇所=1. 概要（access-control）の未決事項の表 / 指摘=opr-access-control-sample が「運用方針で未決」として挙げる「`OPS` に 15 分以内に連絡がつかないときのアカウント停止」が、方針側の未決事項にない / 直した案=未決事項の表に 1 行足した（判断者は `PO`、決まるまでの扱いは opr と同じく紙の販売控えへ切り替え、`OPS` が停止するまで新しく記録しない、影響する節は付与・剥奪の契機） / 根拠=vp-qe-kata-conformance（kata 相互）。opr-access-control-sample の概要の未決事項の表 / 印=-
- R5-2: 段=R5 / 箇所=2.2. 付与・剥奪の契機 / 指摘=保守作業が終わったときの扱いを、方針側は「保守の区分を外す」、opr-access-control-sample の 9.1 は「剥奪（停止）」と書いている。また 2.6 の棚卸しは、保守作業中の権限変更記録にない `DEV` のアカウントを不合格にするため、区分を外すだけではアカウントが残り不合格になる / 直した案=行うことを「アカウントを停止する」にした / 根拠=vp-qe-kata-conformance（kata 相互）、vp-dev-change-impact / 印=-
- R5-3: 段=R5 / 箇所=2.5. 監査ログ / 指摘=緊急権限の間に `DEV` が直す記録（つけ残高の訂正を含む）が、月次の「管理の区分以外の操作 0 件」に数えられ、緊急権限を正しく使った月も不合格になる / 直した案=緊急権限の間の `DEV` の操作は事後の確認で扱い、件数から除くと 1 文足した / 根拠=vp-qe-kata-conformance（kata 相互）。2.4 の緊急権限の事後の確認との整合。相手側として opr-access-control-sample の 3. 日次・週次・月次点検手順の「月次（監査ログ）」の行にも同じ条件を足す案がある / 印=-
- R5-4: 段=R5 / 箇所=3. 関連ドキュメント導線（`opr` 等） / 指摘=導線の先の opr-index-sample が、権限の行（34 行）と付与・剥奪の表（132〜135 行）で、区分を記録・閲覧・管理者とし、`DEV` に管理者権限を持たせ、付与を `DEV` が行う書き方になっている。本書の 4 区分と `OPS` が付与する体制、opd-index-sample の RACI（`OPS` が R、`DEV` が C）、opr-sample と食い違う / 直した案=- / 根拠=vp-qe-kata-conformance（適用先）、vp-dev-change-impact。相手側の opr-index-sample を、4 区分に揃え、付与・剥奪を `OPS` が行い、詳しい手順を opr-access-control-sample に任せる形に改める案 / 印=-

## 4. 進め方と実践の型の適用

根拠は、`opr-access-control-sample` の未決事項と 9.1 の記述、`opr-index-sample`、`opd-index-sample` の RACI、本書の 2.4・2.5・2.6 の整合（`vp-qe-kata-conformance`、`vp-dev-change-impact`）。方針側の sample の食い違いを直し、手順側の sample は変更せず案として残した。`status` は `draft` のまま据え置いた。
