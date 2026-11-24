---
specdojo:
  id: prj-0001:xer-t-kata-review-all-dmd-index-sample-150-20261124t230828z-b7debc0c
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-dmd-index-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-dmd-index-sample-150/T-KATA-REVIEW-ALL-dmd-index-sample-150-20261124T230828Z-b7debc0c/plan.md
  started_at: "2026-11-24T23:08:37.328Z"
  completed_at: "2026-11-24T23:23:08.019Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:dmd-index-sample
    - specdojo:dmd-index-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として `dmd-index-sample` を見直した。F001 に対応し、検証の共通方針に合否の判定者を Role code 付きで併記した。
- `dmd-sample` との食い違い（許容差の氏名の表記ゆれ）も本書側で直した。相手側（`dmd-sample`・`mip-index-sample`）を直す案は handoff に残し、それらのファイルは変更していない。
- executor が実行した prettier と markdownlint-cli2 は通過した。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も通過した。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/dmd-index-sample.md`: 「検証の共通方針（種別/基準/証跡/保管）」を 7 行修正した。(1) 合否の判定者を併記した。件数照合は開発担当（DEV）、サンプル照合と重要値照合は店主代表（PO）とした（F001）。(2) 許容差の対象に顧客の氏名を足した。残高は顧客番号で結び付くので影響しないという理由も添えた。本文と表のサンプル照合の行を直し、`dmd-sample` の氏名変換と整合させた。status は `draft` のまま。

## 3. 申し送り

- 指摘一覧は executor の handoff（R5-1〜R5-4）を正とする。次の追加の注意点のみ記す。R5-1 と R5-2 は「要判断」の印が付いており、人の確認が要る。
- R5-3 と R5-4 は相手側（`dmd-sample`、`mip-index-sample`）を直す案で、本タスクでは未変更。扱う段または別タスクで対応が要る。
- R5-1: R5 / 4. 検証の共通方針（種別/基準/証跡/保管） / 合否の判定者が `mip-index` への参照だけで、誰が判定するか本書から読めない（F001） / 「件数照合は開発担当（DEV）、サンプル照合と重要値照合は店主代表（PO）が判定する」を足した / `vp-qe-kata-conformance`、F001（`vp-ba-stakeholder-clarity`）。`mip-index` の受入基準では、件数の一致は開発担当、つけ残高と在庫数の一致は店主代表が判定者。サンプル照合に当たる受入基準は `mip-index` になく、店主代表に寄せた。選ばなかった案は、サンプル照合を開発担当にする案と、同行レビュー担当を判定者にする案（`mip-index` では同行レビュー担当は読み合わせの役割で、判定者ではない） / 要判断
- R5-2: R5 / 4. 検証の共通方針（種別/基準/証跡/保管） / 本書の許容差は商品名の表記ゆれだけなのに、`dmd-sample` は本書の許容差として氏名の全角・半角の違いを許容しており、食い違っていた / 許容差の対象に顧客の氏名を足し、残高は顧客番号で結び付くので影響しないという理由を足した（本文と表のサンプル照合の行） / `vp-qe-kata-conformance`、`vp-dev-change-impact`。`dmd-sample` の変換ルールは氏名を全角にそろえるので、元ノートとの全角・半角の違いが出るのは想定どおり。選ばなかった案は、本書を商品名だけのままにして `dmd-sample` から氏名の許容を外す案（変換ルールのせいで照合が必ず不合格になるため採らなかった） / 要判断
- R5-3: R5 / 9. 検証方法（`dmd-sample`） / `dmd-sample` は「合否は `mip-index` の成功条件の判定者（店主代表）」として件数照合も店主代表としているが、`mip-index` では件数の一致の判定者は開発担当 / - / `vp-qe-kata-conformance`。相手側は `docs/ja/specdojo/samples/dmd-sample.md` の検証方法の表の前の文。直す案は「件数照合は開発担当（DEV）、サンプル照合と重要値照合は店主代表（PO）が照合表を見て決める」とし、本書の「合否の判定」とそろえる / -
- R5-4: R5 / 9. 移行後ハイパーケア方針の関連ドキュメント（`mip-index`） / `mip-index` は `mtp-index` を「照合の合否基準」と説明しているが、照合の合格基準は本書（`dmd-index`）の検証の共通方針が定めており、`dmd-index`・`dmd-sample` は `mtp-index` を「照合の合否の確かめ方」としている / - / `vp-qe-kata-conformance`。相手側は `docs/ja/specdojo/samples/mip-index-sample.md` の関連ドキュメントの `mtp-index` の行。直す案は「移行リハーサル計画（作業時間の測定と照合の合否の確かめ方）」 / -
- 適用外の検証: `npm run validate:history-links`（Only docs/ja/specdojo/samples/dmd-index-sample.md changed; no plan/result/pjr history file was modified）

## 4. 進め方と実践の型の適用

根拠としたのは、`dmd-index-sample` と同じ接頭辞の `dmd-sample`、参照先の `mip-index` と `mtp-index`、F001 の viewpoint（`vp-ba-stakeholder-clarity`）、整合の観点（`vp-qe-kata-conformance`、`vp-dev-change-impact`）である。F001 は判定者の役割を Role code 付きで併記して解消した。`mip-index` の受入基準では件数の一致は開発担当、つけ残高と在庫数の一致は店主代表が判定者である。サンプル照合に当たる基準は `mip-index` になく、店主代表に寄せた（要判断）。`dmd-sample` の氏名の全角・半角の許容との食い違いは、許容差に氏名を足して直した（要判断）。相手側の食い違いは変更せず、直す案を handoff に残した。grade result のサイドカーは編集していない。見送った finding はない。
