---
specdojo:
  id: prj-0001:xer-t-kata-review-all-sysd-critical-flows-sample-110-20261125t152354z-181aa52f
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-sysd-critical-flows-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-sysd-critical-flows-sample-110/T-KATA-REVIEW-ALL-sysd-critical-flows-sample-110-20261125T152354Z-181aa52f/plan.md
  started_at: "2026-11-25T15:24:03.640Z"
  completed_at: "2026-11-25T15:30:58.000Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:sysd-critical-flows-sample
    - specdojo:sysd-critical-flows-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R1（目的の過不足）として、sample `sysd-critical-flows-sample` を足す・削る観点で見直した。
- grade の F001（検証表に確認状況と不足の解消先の列がない）は、5.2 の検証表へ列を追加して解消した。
- sample の役割に合わない記述として、概要の文書役割割り当てと、雛形にない承認章 5.4 を削除した。
- F002（「照合待ち」の定義の食い違い）は観点が R3 の担当のため本段では直さず、案を指摘に残した。
- executor の `prettier` と `markdownlint-cli2` は通過した。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も通過した。ほかの runner 検査は変更種別により `not_applicable` だった。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R1-1 | R1 | 5.2. 検証への引渡し / 検証表 | template が求める「確認状況・不足の解消先」列がない。所在・網羅性・実行結果の区別と、不足の未決事項への接続を示せていない（grade F001）。 | 列を追加し、5 シナリオすべてに「未実施」・不足理由・解消先 SU-01／SU-02 を記入した。先頭列名を「検証ID / フロー / 受入条件ID」にそろえた。 | vp-qe-kata-conformance（sysd-critical-flows-template「検証への引渡し」、rulebook「本文要件」のテスト参照の段落） | - |
| R1-2 | R1 | 1. 概要（対象・運用方針） | 「開発担当 DEV が設計を更新し、ARC・QE・家族利用者代表が確認し、PO が最終判断する」は文書の役割割り当てで、Sample 記述標準の記述ガイド・禁止事項に抵触する。 | 該当の 2 文を削除し、公開範囲の文は残した。 | vp-qe-kata-conformance（sample-authoring-standard「記述ガイド」「禁止事項」） | - |
| R1-3 | R1 | 5.4. 承認対象と公開前条件 | rulebook・template の章構成にない独自章で、内容は承認の分担と進み具合（禁止事項）。末尾の「draft を維持する」は frontmatter の `status: ready` と矛盾し、「未同梱の契約・実装成功を表さない」は 5.1 冒頭文の再掲だった。 | 章ごと削除した。 | vp-qe-kata-conformance、vp-arc-single-responsibility（sample-authoring-standard「構成の原則」「禁止事項」） | - |
| R1-4 | R1 | 1. 概要（対象・運用方針） | 「照合待ち」の定義が「本部受付の成否を断定できない状態」だけで、itc-kinuya-cf-03 の「本部受付後の控え保存失敗も照合待ち」と食い違う（grade F002）。 | 観点が R3 担当のため本段では直さない。案: 定義を「本部受付またはローカル販売実績の保存のどちらかが確認できない状態」に広げる。 | vp-ux-language-consistency | 要判断 |
| R1-5 | R1 | 5.3. 未決事項と後続作業 | template にある「受入や運用への影響」「当面の扱い」の列がない。該当内容は 2 列目の文に含まれている。 | 内容は rulebook の要件を満たすため、R1 では足し引き不要と判断した。列の分割は R2（構成）で扱う。 | rulebook の要件、sysd-critical-flows-template | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/sysd-critical-flows-sample.md`: 5.2 の検証表に「確認状況・不足の解消先」列を追加した。5 シナリオすべてに「未実施」、不足理由、解消先 SU-01／SU-02 を記入し、先頭列名を「検証ID / フロー / 受入条件ID」にそろえた。1 章から文書の役割割り当ての 2 文を削除した。雛形にない 5.4「承認対象と公開前条件」を章ごと削除した。差分は 8 行追加、19 行削除。

## 3. 申し送り

- F002 は R3 で扱う。案は、「照合待ち」の定義を「本部受付またはローカル販売実績の保存のどちらかが確認できない状態」に広げること。
- R1-1: R1 / 5.2. 検証への引渡し / 検証表に template が求める「確認状況・不足の解消先」列がなく、所在・網羅性・実行結果の区別と不足の未決事項への接続（rulebook 本文要件）を示していない（grade F001） / 列を追加し、5 シナリオすべてに「未実施」・不足理由・解消先 SU-01／SU-02 を記入。先頭列名を「検証ID / フロー / 受入条件ID」にそろえた / vp-qe-kata-conformance（sysd-critical-flows-template「検証への引渡し」、rulebook「本文要件」のテスト参照の段落） / -
- R1-2: R1 / 1. 概要（対象・運用方針） / 「開発担当 DEV が設計を更新し、ARC・QE・家族利用者代表が確認し、PO が最終判断する」は文書の役割割り当てであり、Sample 記述標準の記述ガイド・禁止事項に抵触する / 該当の 2 文を削除し、公開範囲の文は残した / vp-qe-kata-conformance（sample-authoring-standard「記述ガイド」「禁止事項」） / -
- R1-3: R1 / 5.4. 承認対象と公開前条件 / rulebook・template の章構成にない独自章で、内容は承認の分担と進み具合（禁止事項）。末尾の「draft を維持する」は frontmatter の status: ready と矛盾し、「未同梱の契約・実装成功を表さない」は 5.1 冒頭文の再掲 / 章ごと削除 / vp-qe-kata-conformance、vp-arc-single-responsibility（sample-authoring-standard「構成の原則」「禁止事項」） / -
- R1-4: R1 / 1. 概要（対象・運用方針） / 「照合待ち」の定義が「本部受付の成否を断定できない状態」だけで、itc-kinuya-cf-03 の「本部受付後の控え保存失敗も照合待ち」と食い違う（grade F002、vp-ux-language-consistency） / - / 観点が R3 担当のため本段では直さない。案: 定義を「本部受付またはローカル販売実績の保存のどちらかが確認できない状態」に広げる / 要判断
- R1-5: R1 / 5.3. 未決事項と後続作業 / template にある「受入や運用への影響」「当面の扱い」の列がなく、該当内容は 2 列目の文に含まれている / - / 内容は rulebook の要件を満たすため R1 では足し引き不要と判断。列の分割は R2（構成）で扱う / -

## 4. 進め方と実践の型の適用

根拠にした規範は、grade の finding F001／F002、`sysd-critical-flows-template` の「検証への引渡し」、rulebook の本文要件、`sample-authoring-standard` の「構成の原則」「記述ガイド」「禁止事項」。F001 は雛形の列構成に合わせて解消した。承認の分担と進み具合は禁止事項に当たり、5.4 は雛形にない章だった。5.4 の「draft を維持する」は frontmatter の `status: ready` と矛盾し、「未同梱の契約・実装成功を表さない」は 5.1 冒頭文の再掲だった。このため 5.4 を削除した。5.3 に「受入や運用への影響」「当面の扱い」の列がない点は、内容が 2 列目の文に含まれ rulebook の要件を満たすため、R1 では維持した。列の分割は R2 に回す。F002 は R3 の観点のため未解消で、次のアクションは R3 での定義の拡張。
