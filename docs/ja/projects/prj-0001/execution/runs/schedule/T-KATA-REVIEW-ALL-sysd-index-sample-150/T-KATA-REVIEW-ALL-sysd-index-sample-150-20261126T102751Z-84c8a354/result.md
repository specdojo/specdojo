---
specdojo:
  id: prj-0001:xer-t-kata-review-all-sysd-index-sample-150-20261126t102751z-84c8a354
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-sysd-index-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-sysd-index-sample-150/T-KATA-REVIEW-ALL-sysd-index-sample-150-20261126T102751Z-84c8a354/plan.md
  started_at: "2026-11-26T10:28:03.416Z"
  completed_at: "2026-11-26T10:34:12.446Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:sysd-index-sample
    - specdojo:sysd-index-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R5（整合）として、`sysd-index-sample.md` を同じ接頭辞の sample（`sysd-critical-flows-sample`・`sysd-cross-cutting-policy-sample`）と突き合わせ、sample 側の食い違いを直した。
- 直した内容は、関連ドキュメント導線の参照名の追加・置換と、監査ログ schema の参照名の統一である。
- 相手側を直すべき点（R5-5、R5-6）は変更せず、直す案を findings に記した。判断記録の参照の食い違い（R5-7）は要判断とした。
- 整形と markdownlint は executor が通した。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も passed である。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | 5. 関連ドキュメント導線（構成・システム設計の行） | 横断ルールの架空の参照名がなく、`sysd-cross-cutting-policy-sample` への導線が欠けていた。 | `kinuya-sysd-cross-cutting-policy` を足し、参照目的に「停止・保持・照合の横断ルール」を加えた。 | `vp-qe-kata-conformance`（同じ接頭辞の sample 相互） | - |
| R5-2 | R5 | 5. 関連ドキュメント導線（業務・データ契約の行） | `sysd-critical-flows-sample` が状態の定義先にしている取引状態仕様 `kinuya-stsd-sale` が索引にない。 | `kinuya-stsd-sale` を足し、参照目的に「会計確定・照合待ちの状態定義」を加えた。 | `vp-qe-kata-conformance`、`vp-dev-change-impact` | - |
| R5-3 | R5 | 5. 関連ドキュメント導線（非機能・運用の行） | 索引の `kinuya-opr-recovery` が、重要フロー sample の手順名 `kinuya-opr-sale-reconciliation`・`kinuya-opr-reprint` と食い違う。横断ルール sample が時間・再試行上限の正本とする `kinuya-execution-policy` も索引にない。 | 手順名を重要フロー sample の 2 件に置き換え、`kinuya-execution-policy` を足した。参照目的は「本部連携の時間・再試行上限、停止時の保留、有人監視、会計照合と再印刷」にした。 | `vp-qe-kata-conformance`、`vp-dev-change-impact` | - |
| R5-4 | R5 | 2. SSOT 一覧（監視・ログ・通知の行）と 4. 変更の入口（ログ・通知の変更の行） | 監査ログの schema が `schemas/audit-event.schema.json` で、横断ルール sample の正本名 `kinuya-audit-record-schema` と食い違う。 | `schemas/audit-record.schema.json`（`kinuya-audit-record-schema`）に改めた。 | `vp-qe-kata-conformance` | - |
| R5-5 | R5 | 相手側 `sysd-cross-cutting-policy-sample` の関連ドキュメントの表（システム設計・重要フローの行） | 設計索引の参照名が `kinuya-system-design-index` で、重要フロー sample の `kinuya-sysd-index` と食い違う。 | 変更していない。相手側の案は、`sysd-cross-cutting-policy-sample` の `kinuya-system-design-index` を `kinuya-sysd-index` に揃えること。 | `vp-qe-kata-conformance` | - |
| R5-6 | R5 | 相手側 `sysd-cross-cutting-policy-sample` の参照（References と関連ドキュメントの表） | `kinuya-recovery-procedure`・`kinuya-log-policy`・`kinuya-module-map` が、索引の手順名（`kinuya-opr-sale-reconciliation`・`kinuya-opr-reprint`）、運用設計名（`kinuya-opd-monitoring`）、モジュール境界の行と対応していない。 | 変更していない。相手側の案は、回復手順を索引の OPR 2 件に、ログ方針を `kinuya-opd-monitoring` または索引の監視・ログの行に、`kinuya-module-map` を索引のモジュール境界の行への参照に置き換えること。 | `vp-qe-kata-conformance`、`vp-dev-change-impact` | - |
| R5-7 | R5 | 5. 関連ドキュメント導線（テスト・判断記録の行） | 判断記録の参照が 3 か所で食い違う。索引は `kinuya-dec-recovery`、重要フロー sample は `KIN-DEC-01`・`KIN-DEC-02`、横断ルール sample は `kinuya-decision-log` である。 | 変更していない。迷った理由は、索引に載せるべきものが文書（決定簿）か判断 ID か決めきれないこと。選ばなかった案は、索引を `kinuya-decision-log` にして、重要フロー sample の `KIN-DEC-01`・`KIN-DEC-02` をその中の判断 ID と位置付ける案。人がどちらかに揃える。 | `vp-qe-kata-conformance` | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/sysd-index-sample.md`: 関連ドキュメント導線で、横断ルールの `kinuya-sysd-cross-cutting-policy`、取引状態仕様の `kinuya-stsd-sale`、時間・再試行上限の `kinuya-execution-policy` を追加した。また、回復手順名を `kinuya-opr-sale-reconciliation` と `kinuya-opr-reprint` に置き換え、参照目的を更新した。監査ログ schema の参照を `schemas/audit-record.schema.json`（`kinuya-audit-record-schema`）に改めた。差分は 11 行追加、11 行削除である。

## 3. 申し送り

- R5-5 と R5-6 は相手側（`sysd-cross-cutting-policy-sample`）の修正が要るため、本タスクでは変更していない。直す案は findings に記載した。
- R5-1: R5 / 5. 関連ドキュメント導線（構成・システム設計の行） / 横断ルールの架空の参照名がなく、`sysd-cross-cutting-policy-sample` への導線が欠けていた / `kinuya-sysd-cross-cutting-policy` を足し、参照目的に「停止・保持・照合の横断ルール」を加えた / `vp-qe-kata-conformance`（同じ接頭辞の sample 相互） / -
- R5-2: R5 / 5. 関連ドキュメント導線（業務・データ契約の行） / `sysd-critical-flows-sample` が状態の定義先にしている取引状態仕様 `kinuya-stsd-sale` が索引にない / `kinuya-stsd-sale` を足し、参照目的に「会計確定・照合待ちの状態定義」を加えた / `vp-qe-kata-conformance`、`vp-dev-change-impact` / -
- R5-3: R5 / 5. 関連ドキュメント導線（非機能・運用の行） / 索引の `kinuya-opr-recovery` が、重要フロー sample の手順名 `kinuya-opr-sale-reconciliation`・`kinuya-opr-reprint` と食い違う。横断ルール sample が時間・再試行上限の正本とする `kinuya-execution-policy` もない / 手順名を重要フロー sample の 2 件に置き換え、`kinuya-execution-policy` を足し、参照目的を「本部連携の時間・再試行上限、停止時の保留、有人監視、会計照合と再印刷」にした / `vp-qe-kata-conformance`、`vp-dev-change-impact` / -
- R5-4: R5 / 2. SSOT 一覧（監視・ログ・通知の行）と 4. 変更の入口（ログ・通知の変更の行） / 監査ログの schema が `schemas/audit-event.schema.json` で、横断ルール sample の正本名 `kinuya-audit-record-schema` と食い違う / `schemas/audit-record.schema.json`（`kinuya-audit-record-schema`）に改めた / `vp-qe-kata-conformance` / -
- R5-5: R5 / 相手側 `sysd-cross-cutting-policy-sample` の関連ドキュメントの表（システム設計・重要フローの行） / 設計索引の参照名が `kinuya-system-design-index` で、重要フロー sample の `kinuya-sysd-index` と食い違う / - / 相手側の案: `sysd-cross-cutting-policy-sample` の `kinuya-system-design-index` を `kinuya-sysd-index` に揃える。`vp-qe-kata-conformance` / -
- R5-6: R5 / 相手側 `sysd-cross-cutting-policy-sample` の参照（References と関連ドキュメントの表） / `kinuya-recovery-procedure`・`kinuya-log-policy`・`kinuya-module-map` が、索引の手順名（`kinuya-opr-sale-reconciliation`・`kinuya-opr-reprint`）、運用設計名（`kinuya-opd-monitoring`）、モジュール境界の行と対応していない / - / 相手側の案: 回復手順を索引の OPR 2 件に、ログ方針を `kinuya-opd-monitoring` または索引の監視・ログの行に、`kinuya-module-map` を索引のモジュール境界の行への参照に置き換える。`vp-qe-kata-conformance`、`vp-dev-change-impact` / -
- R5-7: R5 / 5. 関連ドキュメント導線（テスト・判断記録の行） / 判断記録の参照が 3 か所で食い違う。索引は `kinuya-dec-recovery`、重要フロー sample は `KIN-DEC-01`・`KIN-DEC-02`、横断ルール sample は `kinuya-decision-log` / - / 迷った理由: 索引に載せるべきは文書（決定簿）か判断 ID か決めきれない。選ばなかった案: 索引を `kinuya-decision-log` にして、重要フロー sample の `KIN-DEC-01`・`KIN-DEC-02` をその中の判断 ID と位置付ける案。人がどちらかに揃える。`vp-qe-kata-conformance` / 要判断
- 適用外の検証: `npm run validate:history-links`（変更は `docs/ja/specdojo/samples/` 配下の sample のみで、plan・result・個票を変更していない）

## 4. 進め方と実践の型の適用

同じ接頭辞の sample（`sysd-critical-flows-sample`・`sysd-cross-cutting-policy-sample`）の参照名を根拠に、索引の導線を整合させた。判定は `vp-qe-kata-conformance` と `vp-dev-change-impact` による。sample 側だけを直し、相手側の食い違いは変更せず案として残した。判断記録の参照（R5-7）は索引に載せる対象が決まらないため据え置き、人の判断に回す。plan に展開された grade の finding と、成果物から届いた Kata が原因の finding は、どちらもなしだった。
