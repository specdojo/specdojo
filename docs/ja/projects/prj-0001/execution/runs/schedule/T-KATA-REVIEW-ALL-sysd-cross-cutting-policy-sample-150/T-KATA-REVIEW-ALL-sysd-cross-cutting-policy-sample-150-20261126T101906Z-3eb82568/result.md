---
specdojo:
  id: prj-0001:xer-t-kata-review-all-sysd-cross-cutting-policy-sample-150-20261126t101906z-3eb82568
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-sysd-cross-cutting-policy-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-sysd-cross-cutting-policy-sample-150/T-KATA-REVIEW-ALL-sysd-cross-cutting-policy-sample-150-20261126T101906Z-3eb82568/plan.md
  started_at: "2026-11-26T10:19:16.999Z"
  completed_at: "2026-11-26T10:30:03.900Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:sysd-cross-cutting-policy-sample
    - specdojo:sysd-cross-cutting-policy-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として、横断ルールの sample を同系列の設計索引 sample・重要フロー sample と整合させた。設計索引への `part_of` 接続、設計索引と重要フローへのリンク、架空正本名と検証コマンドの置き換えを行った。
- plan に展開された F001（`vp-ux-language-consistency`）は、見出しの略語列挙が前の段で削除済みで、すでに解消していた。本段では変更していない。
- 相手側の sysd-critical-flows-sample と sysd-index-sample に直すべき点があった。本段では変更せず、案を findings に記載した。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | frontmatter（rulebook「推奨 Frontmatter 項目」） | rulebook は設計索引へ `part_of` で接続すると定めるが、`part_of` がなかった。 | `part_of: [specdojo:sysd-index-sample]` を追加した。 | vp-qe-kata-conformance（sysd-cross-cutting-policy-rulebook の「推奨 Frontmatter 項目」） | - |
| R5-2 | R5 | 正本と運用への入口 | 設計索引を未同梱の `kinuya-system-design-index` としていたが、完成例 `specdojo:sysd-index-sample` が実在する。同系列の `specdojo:sysd-critical-flows-sample` への導線もなかった。 | 設計索引の行を `[[specdojo:sysd-index-sample]]` へのリンクに置き換え、重要フロー sample の行を追加した。 | vp-qe-kata-conformance（kata 相互）、rulebook「関連導線」 | - |
| R5-3 | R5 | scp-IDM-001・scp-LOG-001・scp-TRC-001 の References、正本と運用への入口 | 架空の正本名が設計索引 sample の呼び名と食い違っていた。対象は `kinuya-recovery-procedure`、`kinuya-log-policy`、`kinuya-sales-test-plan`、`kinuya-audit-record-schema` である。 | 設計索引 sample に合わせて `kinuya-opr-recovery`、`kinuya-opd-monitoring`、`kinuya-test-index`、`kinuya-audit-event-schema` に替えた。 | vp-qe-kata-conformance、vp-dev-change-impact | 要判断（回復手順名は、設計索引 sample が `kinuya-opr-recovery` の 1 本、重要フロー sample が `kinuya-opr-sale-reconciliation` と `kinuya-opr-reprint` の 2 本で食い違う。所在の正本である設計索引を採った） |
| R5-4 | R5 | 変更影響と再検証 | 検証コマンドが設計索引にない架空 script だった。対象は `npm run check:contracts`、`npm run test:sales-recovery`、`npm run test:sales-audit` である。 | 設計索引の「変更の入口」にある `npm run validate:config`、`npm run lint`、`npm run test:unit`、`npm run test:integration` の指定に替えた。 | vp-dev-change-impact、rulebook の禁止事項（検査名だけで実行経路を示さない） | - |
| R5-5 | R5 | 相手側 sysd-critical-flows-sample の「概要」と「正本と変更影響」 | 設計索引を未同梱の `kinuya-sysd-index` としているが、`specdojo:sysd-index-sample` が実在する。運用助言の役割名「運用助言 OPS」も、共通登場人物の「店舗運営アドバイザー」と違う。 | 変更していない。`kinuya-sysd-index` を `[[specdojo:sysd-index-sample]]` に、「運用助言 OPS」を「店舗運営アドバイザー OPS」に替え、回復手順名を設計索引と一本化する案。 | vp-qe-kata-conformance | - |
| R5-6 | R5 | 相手側 sysd-index-sample の「関連ドキュメント導線」と「SSOT 一覧」 | 重要フローの `kinuya-sysd-critical-flows` を未作成としているが、`specdojo:sysd-critical-flows-sample` が実在する。横断ルールへの導線もない。`schemas/audit-event.schema.json` には他の schema のような ID の併記がない。本部連携の時間・retry 上限の正本 `kinuya-execution-policy` の所在もない。 | 変更していない。重要フローを sample へのリンクにし、横断ルールの行を足す。`schemas/audit-event.schema.json` に `kinuya-audit-event-schema` を併記し、設定・実行構成の行に `kinuya-execution-policy` を足す案。 | vp-qe-kata-conformance、vp-dev-change-impact | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/sysd-cross-cutting-policy-sample.md`: frontmatter に `part_of: [specdojo:sysd-index-sample]` を追加した。設計索引の行を `[[specdojo:sysd-index-sample]]` へのリンクにし、重要フロー sample への導線を追加した。架空の正本名を設計索引 sample の呼称に合わせ、`kinuya-opr-recovery`、`kinuya-opd-monitoring`、`kinuya-test-index`、`kinuya-audit-event-schema` に替えた。検証コマンドも設計索引の「変更の入口」にある `npm run validate:config`、`npm run lint`、`npm run test:unit`、`npm run test:integration` の指定に替えた。

## 3. 申し送り

- R5-3 の回復手順名は、設計索引 sample の `kinuya-opr-recovery` を採った。重要フロー sample の 2 本の名前は採っていない。`kinuya-audit-event-schema` は、設計索引 sample の `schemas/audit-event.schema.json` から推した名前である。
- R5-1: R5 / frontmatter / rulebook「推奨 Frontmatter 項目」は設計索引へ `part_of` で接続すると定めるが、`part_of` がなかった / `part_of: [specdojo:sysd-index-sample]` を追加した / vp-qe-kata-conformance（sysd-cross-cutting-policy-rulebook の「推奨 Frontmatter 項目」） / -
- R5-2: R5 / 正本と運用への入口 / 設計索引を未同梱の `kinuya-system-design-index` としていたが、同じ CLI の設計索引の完成例 `specdojo:sysd-index-sample` が実在する。また同系列の `specdojo:sysd-critical-flows-sample` への導線がなかった / 設計索引の行を [[specdojo:sysd-index-sample]] へのリンクに置き換え、重要フローの sample の行を追加した / vp-qe-kata-conformance（kata 相互）、rulebook「関連導線」（呼称は参照先の文書名にそろえる） / -
- R5-3: R5 / scp-IDM-001・scp-LOG-001・scp-TRC-001 の References、正本と運用への入口 / 架空正本名が設計索引の sample の呼び名と食い違っていた（`kinuya-recovery-procedure`・`kinuya-log-policy`・`kinuya-sales-test-plan`・`kinuya-audit-record-schema`） / 設計索引の sample の「関連ドキュメント導線」とログ・通知の SSOT に合わせ、`kinuya-opr-recovery`・`kinuya-opd-monitoring`・`kinuya-test-index`・`kinuya-audit-event-schema` に替えた / vp-qe-kata-conformance、vp-dev-change-impact / 要判断（回復手順の名前は、設計索引の sample が `kinuya-opr-recovery` の 1 本、重要フローの sample が `kinuya-opr-sale-reconciliation` と `kinuya-opr-reprint` の 2 本で、両者が食い違っている。所在の正本である設計索引を採り、重要フローの細かい名前は採らなかった。`kinuya-audit-event-schema` は設計索引の sample の `schemas/audit-event.schema.json` から、他の schema の命名に合わせて推した名前）
- R5-4: R5 / 変更影響と再検証 / 検証コマンドが設計索引にない架空 script（`npm run check:contracts`・`npm run test:sales-recovery`・`npm run test:sales-audit`）で、設計索引の「変更の入口」の検証コマンドと食い違っていた / 設計索引の `npm run validate:config`・`npm run lint`・`npm run test:unit -- tests/cli/sales.test.ts`、`npm run test:integration -- tests/infra/head-office.test.ts tests/infra/printer.test.ts`、`npm run test:unit -- tests/storage/recovery.test.ts`、`npm run test:unit -- tests/ops/logging.test.ts` に替えた / vp-dev-change-impact、rulebook の禁止事項（検査名だけで実行経路を示さない） / -
- R5-5: R5 / 相手側 sysd-critical-flows-sample の「概要」と「正本と変更影響」 / 設計索引を未同梱の `kinuya-sysd-index` としているが、`specdojo:sysd-index-sample` が実在する。運用助言の役割名「運用助言 OPS」も共通登場人物の「店舗運営アドバイザー」と違う / - / sysd-critical-flows-sample の `kinuya-sysd-index` を [[specdojo:sysd-index-sample]] に、「運用助言 OPS」を「店舗運営アドバイザー OPS」に、回復手順名を設計索引と一本化する案（vp-qe-kata-conformance） / -
- R5-6: R5 / 相手側 sysd-index-sample の「関連ドキュメント導線」と「SSOT 一覧」 / 構成・システム設計の `kinuya-sysd-critical-flows` を未作成としているが `specdojo:sysd-critical-flows-sample` が実在し、横断ルール（`specdojo:sysd-cross-cutting-policy-sample`）への導線もない。監視・ログの schema `schemas/audit-event.schema.json` に他の schema のような ID の併記がなく、本部連携の時間・retry 上限の正本 `kinuya-execution-policy` の所在もない / - / sysd-index-sample の「関連ドキュメント導線」で重要フローを sample へのリンクにし、横断ルールの行を足す。`schemas/audit-event.schema.json`（`kinuya-audit-event-schema`）と併記し、設定・実行構成の行に `kinuya-execution-policy` を足す案（vp-qe-kata-conformance、vp-dev-change-impact） / -
- F001（grade, vp-ux-language-consistency）: 見出し「関連ドキュメント導線」から略語の列挙は前の段で削られ、指摘はすでに解消していた。本段では変更していない。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/ の sample だけで、pjr 個票・plan・result を変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルは `*.md` だけで、`*.yaml` / `*.yml` を変更していない）

## 4. 進め方と実践の型の適用

根拠としたのは、sysd-cross-cutting-policy-rulebook の「推奨 Frontmatter 項目」と禁止事項、同系列の sysd-index-sample と sysd-critical-flows-sample、共通サンプル文脈である。食い違いは、構造・必須項目・禁止事項で rulebook を正とし、所在の正本である設計索引 sample に合わせて直した。F001 は前の段で解消済みのため維持した。相手側の食い違いは変更せず、findings に直す案を残した。
