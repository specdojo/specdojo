---
specdojo:
  id: prj-0001:xer-t-kata-review-all-opr-support-sample-130-20261125t091622z-cf3ca466
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-opr-support-sample-130
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-opr-support-sample-130/T-KATA-REVIEW-ALL-opr-support-sample-130-20261125T091622Z-cf3ca466/plan.md
  started_at: "2026-11-25T09:16:31.395Z"
  completed_at: "2026-11-25T09:35:50.716Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opr-support-sample
    - specdojo:opr-sample
---

# Edit Result

## 1. 実施内容

- kata のレビュー段 R3（読みやすさ）として、`docs/ja/specdojo/samples/opr-support-sample.md` に文の直しを 11 件入れた。主語の明示、文の分割、略語の初出への正式名の添え、表名の括り、記入例の前の 1 文を直した。意味・背景・例外・制約は変えていない。
- `prettier` の整形と `markdownlint` はエラーなしで通った。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も passed だった。
- grade の finding F001〜F004 は、この段では直していない。F001 と F004 は kata の段のレビューでは使わない観点にあたる。F002 は R4、F003 は R5 で扱う。
- 指摘の一覧（No・段・箇所・指摘・直した案・根拠・印）は、executor の handoff に 1 件ずつ記録されている。ここでは表を重ねて書かない。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opr-support-sample.md`: R3 の観点で文を直した（24 行追加・24 行削除）。概要の主語を明示して `OPS` の初出に正式名を添え、目的の長い文を 2 文に分け、KPI の初出に正式名を添えた。連絡先の行では `PO` と `DEV` の表記を opr-sample に揃え、障害は `OPS` が扱うと別の文にした。アラート対応手順の因果のねじれた文を 2 文に分けた。表のセルの役割名は `OPS`・`PO`・`DEV` に統一した。「分類と応答の目標」の表は括って表名と分かるようにした。記入例の前の 1 文は問い合わせ記録の記入例と明示した。完了条件と証跡の 3 か所には、確かめて記録する主体を足した。

## 3. 申し送り

- 要判断: 完了条件の「引き継いだ」で、課題管理への登録と `ticket_id` の記入の主体を `OPS` にした。一次対応の流れの手順 5 で登録と記入をするのは `OPS` なので、この読み方にした。引き継ぎ先が記入するという読み方は採っていない。
- F003 で指摘された関連ドキュメント導線の `opr-incident` の「予定」と、`opr-index` の呼び名の不揃いは未対応のまま残っている。R5 で、分冊 sample の有無と `opr-incident-sample` の参照先を確かめて揃える必要がある。
- F002 の証跡の保管期間が `_UNDECIDED_` のままである点は、R4 で扱う。
- 1: R3 / 概要 / 1 文目に主語がなく、`OPS` の初出に正式名がない / 「本書は、」を足し、「運用／リリース管理（`OPS`: Operations / Release Manager）」とした / W1・W8 / -
- 2: R3 / 概要 / 目的の文が長く、「記録を続けられること」と「KPI を支えること」の 2 つを 1 文に詰めている / 「目的は、…ようにすることである。」と「あわせて、…重要業績評価指標（KPI）を支える。」の 2 文に分け、KPI の初出に正式名を添えた / W3・W2・W8 / -
- 3: R3 / 手順適用範囲・前提（連絡先の行） / `PO` を「業務」と書いていて opr-sample の「プロジェクト責任者」と表記がずれる。窓口の `OPS` 自身を「障害が運用（`OPS`）」と引き継ぎ先に並べている / 「開発（`DEV`: Developer）」「プロジェクト責任者（`PO`: Project Owner）」とし、障害は「`OPS` が障害対応手順で扱う」と別の文にした / W8・`vp-ux-language-consistency` / -
- 4: R3 / アラート対応手順 / 「経由しないため、…に従う」の因果がねじれていて、何が従うのか分からない / 「問い合わせは自動の通知を経由しない。通知への対応は `opr-index` のアラート対応手順に従う。」の 2 文にした / W2・W4 / -
- 5: R3 / 分類と応答の目標（表） / 定義済みの役割に「運用（`OPS`）」「業務（`PO`）」「開発（`DEV`）」と別の呼び名を付け直していて、用語が揺れる / 表のセルでは `OPS`・`PO`・`DEV` だけを書くようにした（4 か所） / W8・`vp-arc-conciseness` / -
- 6: R3 / 一次対応の流れ（影響・引き継ぎ要否） / 「分類と応答の目標の表」が、表の名前なのか分類と目標を並べた語なのか読み分けにくい / 「「分類と応答の目標」の表」と括った（完了の後の段落と合わせて 3 か所） / W5 / -
- 7: R3 / 一次対応の流れ（記入例の前の 1 文） / 「回答の文例」と書いているが、例は受付・分類・引き継ぎまで含む問い合わせ記録の記入例になっている / 「操作の質問に回答したときの問い合わせ記録の記入例を次に示す。」とした / Sample 記述標準の表・例の前の 1 文・W7 / -
- 8: R3 / 完了条件と月次の見直し（回答した） / 確かめて記録に書く主体がない / 「`OPS` が、店番担当が…」と主体を足した / W1 / -
- 9: R3 / 完了条件と月次の見直し（引き継いだ） / 「引き継ぎ先が…受け取り、`ticket_id` を書いた」となり、書く主体が引き継ぎ先に読める / 「`OPS` が課題管理に登録した `ticket_id` を問い合わせ記録に書き、引き継ぎ先が登録を受け取った。」とした / W1・W2 / 要判断: 一次対応の流れの手順 5 で登録と記入をするのは `OPS` なので、`OPS` を主体にした。記入を引き継ぎ先がするという読み方は採らなかった
- 10: R3 / 証跡（模擬の結果） / 結果を残す主体がない / 「`OPS` は模擬の結果を、…に残す」とした / W1 / -
- 11: R3 / grade の finding F001〜F004 / F001（`vp-po-decision-readiness`）と F004（`vp-ops-release-readiness`）は、kata の段のレビューでは使わない観点になっている（kata-guide の「kata の観点の組」）。F002（`vp-qe-verifiability`）は R4、F003（`vp-qe-kata-conformance`。関連ドキュメント導線の `opr-incident` が「予定」のままで、`opr-index` の呼び名も揃っていない）は R5 で扱う / - / kata-guide の「kata の観点の組」 / -

## 4. 進め方と実践の型の適用

根拠は、plan が指す kata-guide の「kata を agent でレビューする」、「文章のチェック項目」（W1〜W10）、「kata の観点の組」と、sample 記述標準である。executor の handoff によると、直したのは W1・W2・W3・W4・W5・W7・W8 に当たる文だけである。意味と判断に要る背景・例外・制約は変えていない。grade の F001〜F004 は、kata-guide の観点の組に照らして R3 の対象外と判断し、次の扱いにした。F001 と F004 は kata の段のレビューでは使わない観点なので、直していない。F002 は R4 に、F003 は R5 に任せる。推測での改訂はしていない。frontmatter の `status` は `draft` のままで、`ready` への昇格はしていない。
