---
specdojo:
  id: prj-0001:xer-t-kata-review-all-opd-incident-management-sample-150-20261125t025535z-367e857d
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-opd-incident-management-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-opd-incident-management-sample-150/T-KATA-REVIEW-ALL-opd-incident-management-sample-150-20261125T025535Z-367e857d/plan.md
  started_at: "2026-11-25T02:55:44.501Z"
  completed_at: "2026-11-25T03:09:51.095Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opd-incident-management-sample
    - specdojo:opd-access-control-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R5（整合）として、`opd-incident-management-sample` を関連 sample（`opd-index-sample`、`opr-incident-sample`、`opd-access-control-sample`）にそろえ、2 か所を直した。
- 直した箇所は、2.3 の SLA 対象外の相手の表記と、2.2 の P1 で `PO` に連絡がつかないときの紙の販売控えへの切替の補足である。
- 相手側の文書を直す案 4 件は handoff に記載し、相手側のファイルは変更していない。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opd-incident-management-sample.md`: 2.3 の来店客以外に周知しない理由を「外部の利用者・委託先」の表記にそろえた。2.2 の表の後に、P1 で `PO` に連絡がつかない場合は店番担当が紙の販売控えへ切り替えて `PO` の連絡を待つ補足を足した。

## 3. 申し送り

- R5-1（段 R5、2.3. 周知の対象・手段・時機）: 「外部の利用者・取引先は SLA の対象外」を、`opd-index-sample` の SLA の行にそろえて「外部の利用者・委託先」に直した。根拠は `vp-qe-kata-conformance`。相手側案: `opr-incident-sample` の「手順適用範囲・前提」の対象外にある「外部の利用者・取引先への周知」も「外部の利用者・委託先への周知」にする。
- R5-2（段 R5、2.2. 停止・切替の判断）【要判断】: 本書は P1 の切替の判断者を `PO` だけとしている。一方、`opr-incident-sample` は `PO` に 15 分以内に連絡がつかない場合の切替を定め、`opd-access-control-sample` の未決事項も同じ扱いを前提にしている。表の後に補足の 1 文を足して直した。根拠は `vp-qe-kata-conformance` と `vp-dev-change-impact`。迷った点は、`opd-index` の「`PO` が切替を決める」に例外を足すことになる点である。別案は、未決事項の表に「`PO` に連絡がつかないときの切替判断」を足し、決まるまでの扱いとして同じ文を書くこと。
- R5-3（段 R5、2.2. 停止・切替の判断、`opd-access-control-sample` の緊急権限との対応）: 緊急権限の「使える場面」は `opd-index` の優先度の表で P1 とした障害だけを指す。本書の判定で P1 とするタブレットの故障・通信回線の切断が含まれるかが読み取れない。本書は変更していない。根拠は `vp-dev-change-impact`。相手側案: `opd-access-control-sample` の緊急権限の表で「使える場面」を「`opd-incident-management` の優先度の判定で P1 とした障害」にする。
- R5-4（段 R5、2.2 と 2.3）【要判断】: 2.2 は P2 の日次締めの持ち越しを `PO` が閉店後に判断すると定める。2.3 は持ち越したことを `PO` に翌朝の開店前に伝えると定める。判断した本人へ後から伝える形で、本書の中で食い違う。R2 の観点 `vp-qe-omissions-consistency` に当たり、R5 の範囲外のため直していない。直す案: 2.3 の P2 の `PO` の行の内容を「日次締めを持ち越した後の締めの結果」にするか、行を削る。`opr-incident-sample` の「復旧後の報告と再発防止」の P2 の行も同時に見直す。
- R5-5（段 R5、`opd-monitoring-sample` の「初動の時限と完了条件」）: 本書を wikilink ではなく `opd-incident-management` のインラインコードで参照している。本書は作成済みである。本書は変更していない。根拠は `vp-dev-change-impact`。相手側案: wikilink `specdojo:opd-incident-management-sample`（表示名は「運用方針・設計（障害対応）」）にする。
- 注記: plan の編集対象は `opd-access-control-sample.md` に解決されていた。executor はタスク名と kata-guide の「直すのは対象の kata だけ」に従い、レビュー対象の `opd-incident-management-sample.md` を直した。`opd-access-control-sample.md` は変更していない。用語集に駄菓子屋の業務用語はなく、食い違いはなかった。共通サンプル文脈の役割名とも合っている。
- R5-1: R5 / 2.3. 周知の対象・手段・時機 / 来店客以外に周知しない理由の「外部の利用者・取引先は SLA の対象外」が、`opd-index-sample` の SLA の行「外部の利用者・委託先と合意する約束がない」と表記が違う / 「外部の利用者・委託先」に直した / `vp-qe-kata-conformance`（kata 相互）。相手側案: `opr-incident-sample` の「手順適用範囲・前提」の対象外にある「外部の利用者・取引先への周知」も「外部の利用者・委託先への周知」にそろえる / -
- R5-2: R5 / 2.2. 停止・切替の判断 / P1 の紙の販売控えへの切替は判断者が `PO` だけで、`PO` に連絡がつかない場合の扱いがない。一方で `opr-incident-sample` の「停止・切替とロールバックの判断」は「`PO` に 15 分以内に連絡がつかない場合、店番担当は紙の販売控えへ切り替えて `PO` の連絡を待つ」としており、`opd-access-control-sample` の未決事項も同じ扱いを前提にしている。方針にない規則を手順が持っている / 表の後に「P1 で `PO` に連絡がつかない場合は、店番担当が紙の販売控えへ切り替えて `PO` の連絡を待つ（補足）。」を足した / `vp-qe-kata-conformance`、`vp-dev-change-impact`。迷った理由: `opd-index` の「`PO` が切替を決める」に例外を足すことになるため。選ばなかった案: 未決事項の表に「`PO` に連絡がつかないときの切替判断」を足し、決まるまでの扱いとして同じ文を書く / 要判断
- R5-3: R5 / 2.2. 停止・切替の判断（`opd-access-control-sample` の緊急権限との対応） / `opd-access-control-sample` の緊急権限の「使える場面」は `opd-index` の優先度の表で P1 とした障害だけを指している。本書の優先度の判定で P1 としたタブレットの故障・通信回線の切断が含まれるかが読み取れない / - / `vp-dev-change-impact`。相手側案: `opd-access-control-sample` の「緊急権限」の表の「使える場面」を「`opd-incident-management` の優先度の判定で P1 とした障害」にする。障害を P1 とする条件の具体化は本書に置かれているため / -
- R5-4: R5 / 2.2. 停止・切替の判断・2.3. 周知の対象・手段・時機 / 2.2 では P2 の日次締めの持ち越しを `PO` が閉店後に判断する一方、2.3 では持ち越したことを `PO` へ翌朝の開店前に伝えるとしている。判断した本人へ後から伝える形で、本書の中で食い違う（R2 の観点 `vp-qe-omissions-consistency` に当たり、R5 の範囲の外のため直していない） / - / 直す案: 2.3 の P2 の `PO` の行の内容を「日次締めを持ち越した後の締めの結果」とするか、行を削る。`opr-incident-sample` の「復旧後の報告と再発防止」の P2 の行も同時に見直す / 要判断
- R5-5: R5 / 3. 関連ドキュメント導線（`opd-monitoring-sample` 側） / `opd-monitoring-sample` の「初動の時限と完了条件」は本書を wikilink ではなく `opd-incident-management` というインラインコードで参照している（本書は作成済み） / - / `vp-dev-change-impact`。相手側案: `opd-monitoring-sample` の該当箇所を wikilink `specdojo:opd-incident-management-sample`（表示名は「運用方針・設計（障害対応）」）にする / -
- 注記（指摘ではない）: plan の編集対象は rulebook の sample 宣言から `opd-access-control-sample.md` に解決されていたが、タスク名と kata-guide の「直すのは対象の kata だけ」に従い、レビュー対象の `opd-incident-management-sample.md` を直した。`opd-access-control-sample.md` は変えていない。用語集（`docs/ja/product/010-business-specs/060-glossary/`）に駄菓子屋の業務用語はなく、食い違いはなかった。共通サンプル文脈の役割名とも合っている
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/ の sample だけで、plan・result・個票を変えていないため）
- 適用外の検証: `npm run validate:schema:file`（変更したのは Markdown 1 ファイルだけで、`*.yaml` / `*.yml` の変更がないため）

## 4. 進め方と実践の型の適用

kata-guide の「kata を agent でレビューする」に従い、R5（整合）の観点で、同じ接頭辞の sample、用語集、共通サンプル文脈との食い違いを確かめた。grade と condense の finding は plan に展開されていなかった。直したのは本書の側だけで、相手側の 4 件は handoff に案として残した。R5-2 と R5-4 は判断が分かれるため「要判断」とした。検証は prettier、`lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が通った。`status` は `draft` のままで、`ready` にしていない。
