---
specdojo:
  id: prj-0001:xer-t-kata-review-all-opd-incident-management-sample-130-20261125t013444z-6b2fb76a
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-opd-incident-management-sample-130
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-opd-incident-management-sample-130/T-KATA-REVIEW-ALL-opd-incident-management-sample-130-20261125T013444Z-6b2fb76a/plan.md
  started_at: "2026-11-25T01:34:53.415Z"
  completed_at: "2026-11-25T01:47:36.918Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opd-incident-management-sample
    - specdojo:opd-access-control-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R3（読みやすさ）として `opd-incident-management-sample` を見直し、文の直しを 9 件入れた。
- 判断が要る 2 件（R3-10、R3-11）は推測で書くと事実の捏造になるため直していない（R3-11 は 3 項目めの主語のみ補った）。
- 導線表の備考が実態と合わない件（R3-12）は R5（整合）へ申し送った。
- plan の編集対象は `opd-access-control-sample` と解決されたが、executor は `task_id` と前の段の経緯から `opd-incident-management-sample` を R3 の対象とした。この点は確認が要る。
- runner の検証では `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が成功した。変更種別により対象外の検査は `not_applicable` になった。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opd-incident-management-sample.md`: 文の読みやすさを直した（21 行の挿入と 21 行の削除）。概要の長文を 2 文に分け、初出の `PO` と `OPS` に正式名または役割名を補い、「表の「決まるまでの扱い」の列に従って運用する」と対応する列を明示した。P1 の前提、再開の判断、つけの返済の反映順、外部への周知、P3 の時機は、主語と述語のねじれや修飾の係り先を直した。月次点検の主語に `OPS` を補った。prettier で表の列幅も揃えた。意味に関わる背景・例外・制約は変えていない。

## 3. 申し送り

- R3 指摘一覧（reporter 整理）。executor の handoff の指摘を表にまとめた。 | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | - | - | - | - | - | - | - | | R3-1 | R3 | 1. 概要 | 読点の多い長文が、記録の前提と決めることの両方を述べていた | 2 文に分けた | W3 | - | | R3-2 | R3 | 1. 概要 | 初出の `PO` に正式名がない | 「店主代表（`PO`）」にした | W8 | - | | R3-3 | R3 | 1. 概要 | 「該当する行の扱い」では表のどの列に従うか不明 | 「決まるまでの扱い」の列に従う、と明示した | W4 | - | | R3-4 | R3 | 2.1. 優先度の判定 | 長い修飾が P1 にかかり前提が読みにくい | 「タブレットが故障した場合は P1 として扱い、交換できるまで紙の販売控えで営業を続ける。」にした | W5 | - | | R3-5 | R3 | 2.2. 停止・切替の判断 | 初出の `OPS` に正式名がない。時機のセルがほかの行と違う形で終わっていた | 「`OPS`（Operations / Release Manager）が再開を確かめられない時点」にした | W8, W2 | - | | R3-6 | R3 | 2.2. 停止・切替の判断 | 「戻すのは、…決める」で主語と述語がねじれている | 「戻すかは、…`PO` が決める」にした | W2 | - | | R3-7 | R3 | 2.2. 停止・切替の判断 | 目的と決まりの関係が読み取りにくい | 「二重の反映を防ぐため、つけの返済は照合の後に残高へ反映する（補足）。」にした | W2 | - | | R3-8 | R3 | 2.3. 周知の対象・手段・時機 | 何が SLA の対象外か、ねじれている | 「外部の利用者・取引先は SLA の対象外のため、周知しない。」にした | W2 | - | | R3-9 | R3 | 2.3. 周知の対象・手段・時機 | 「確かめた」が「次の営業日」にかかるようにも読める | 「確かめた日の次の営業日の開店前」にした | W5 | - | | R3-10 | R3 | 2.1. 優先度の判定 | 「優先度を 1 つ上げる」に主語がない。判定者は本書にも `opd-index-sample` にも書かれていない | 直していない。`opd-index-sample` の体制・責任分界の表に判定者を足し、本書も合わせる案がある | W1 | 要判断 | | R3-11 | R3 | 2.4. 障害記録 | 1・2 項目めの「残す」に主語がない。記録者は項目ごとに分かれている（店番担当と `OPS`） | 1・2 項目めは直していない。3 項目めは `OPS` を補った | W1 | 要判断 | | R3-12 | R3 | 3. 関連ドキュメント導線 | `opd-access-control` は作成済みなのに備考が「予定」のままで、wikilink でもない | R5（整合）へ申し送る。案は `[[specdojo:opd-access-control-sample\|運用方針・設計（権限・アカウント）]]` と「作成済」にすること。ほかの行も実在を確かめる | R5 | - |
- plan が解決した編集対象は `opd-access-control-sample` だが、このファイルは編集していない。executor は、`task_id` が `opd-incident-management-sample` を指すこと、前の段 R2 がこの sample を直していること、`opd-access-control-sample` の R1〜R5 が終わっていることを根拠に、対象を `opd-incident-management-sample` とした。rulebook が複数の sample を宣言している場合の編集対象の解決を見直す必要がある可能性がある。
- R3-1: R3 / 1. 概要（incident-management） / 読点の多い長い文が、記録の前提と決めなければならないことの両方を述べていた / 「販売・在庫・つけは店頭のタブレット 1 台で記録する。」と「そのため、…紙へ切り替える業務、止める業務、伝える相手と内容をその場で決めなければならない。」の 2 文に分けた / W3 / -
- R3-2: R3 / 1. 概要（incident-management） / 本書で最初に出る `PO` に正式名がない / 「店主代表（`PO`）が決める」にした / W8（同じ系列の opd-access-control-sample と同じ表記） / -
- R3-3: R3 / 1. 概要（incident-management） / 「該当する行の扱いで運用する」では、表のどの列に従うかが分からない / 「表の「決まるまでの扱い」の列に従って運用する」にした / W4 / -
- R3-4: R3 / 2.1. 優先度の判定 / 「交換できるまで紙の販売控えで営業を続ける」という長い修飾が「P1」にかかり、前提の意味が読みにくい / 「タブレットが故障した場合は P1 として扱い、交換できるまで紙の販売控えで営業を続ける。」にした / W5 / -
- R3-5: R3 / 2.2. 停止・切替の判断 / 本書で最初に出る `OPS` に正式名がない。判断の時機のセルが、ほかの行（「…時点」）と違う形で終わっていた / 「`OPS`（Operations / Release Manager）が再開を確かめられない時点」にした / W8（正式名は opd-index-sample の表記）、W2 / -
- R3-6: R3 / 2.2. 停止・切替の判断 / 「戻すのは、…`PO` が決める」で主語と述語がねじれている / 「戻すかは、…`PO` が決める」にした / W2 / -
- R3-7: R3 / 2.2. 停止・切替の判断 / 「反映するのは照合の後とし、二重の反映を防ぐ」では、目的と決まりの関係が読み取りにくい / 「二重の反映を防ぐため、つけの返済は照合の後に残高へ反映する（補足）。」にした / W2 / -
- R3-8: R3 / 2.3. 周知の対象・手段・時機 / 「外部の利用者・取引先への周知は、SLA が対象外のため行わない」で、何が SLA の対象外なのかがねじれている / 「外部の利用者・取引先は SLA の対象外のため、周知しない。」にした / W2 / -
- R3-9: R3 / 2.3. 周知の対象・手段・時機 / P3 の時機「`OPS` が回避の方法を確かめた次の営業日の開店前」で、「確かめた」が「次の営業日」にかかるようにも読める / 「確かめた日の次の営業日の開店前」にした / W5 / -
- R3-10: R3 / 2.1. 優先度の判定 / 「回避策が使えなくなった時点で、優先度を 1 つ上げる」に主語がない / - / W1。要判断: 優先度を判定・変更する人が、本書にも opd-index-sample（優先度は体制・責任分界の表の条件で決める）にも書かれていない。店番担当か `OPS` かを推測で書くと事実の捏造になるため直していない。決める場合は opd-index-sample の体制・責任分界の表に判定者を足し、本書もその表記に合わせる案がある / 要判断
- R3-11: R3 / 2.4. 障害記録 / 1・2 項目めの「残す」に主語がない / - / W1。要判断: opd-index-sample では、障害記録に異常を書くのは店番担当、原因・影響を残すのは `OPS` で、記録する人が分かれている。項目ごとの記録者を推測で決めず、直していない。3 項目めの月次点検は opd-index-sample で `OPS` が行うと書かれているため、主語の `OPS` を補った / 要判断
- R3-12: R3 / 3. 関連ドキュメント導線（`opr` 等） / `opd-access-control` はすでに作られているのに、備考が「予定」のままで、wikilink にもなっていない / - / R5（整合）が扱う事項として申し送る。案: 行を `[[specdojo:opd-access-control-sample\|運用方針・設計（権限・アカウント）]]` と「作成済」にする。ほかの行も実在を確かめる / -
- plan が解決した編集対象は docs/ja/specdojo/samples/opd-access-control-sample.md（opd-rulebook の sample 宣言から解決）だが、このファイルは編集していない。`task_id` が opd-incident-management-sample を指していること、前の段 R2（-120）がこの sample を直していること、opd-access-control-sample の R1〜R5（-110〜-150）がすでに終わっていることを根拠に、R3 の対象を opd-incident-management-sample とした。plan の編集対象の解決（rulebook が複数の sample を宣言している場合の選び方）を見直す必要がある可能性がある。
- 適用外の検証: `npm run validate:history-links`（Only docs/ja/specdojo/samples/opd-incident-management-sample.md changed; no plan/result/pjr history file was edited by the executor.）

## 4. 進め方と実践の型の適用

sample メンテナンスとして、kata-guide の R3（読みやすさ）と W1〜W10 に沿って `opd-incident-management-sample` を読み、文の直しだけを入れた。意味と判断に要る背景・例外・制約は変えていない。plan に展開された grade の finding と condense の記録はなかった。根拠が足りず推測になる 2 件（R3-10、R3-11）は「要判断」として直さずに残した。R3-12 は R5 の扱いとした。初出の `PO` と `OPS` の表記は、同じ系列の `opd-access-control-sample` と `opd-index-sample` に合わせた。frontmatter の `status` は `draft` のままで、`ready` へは変えていない。
