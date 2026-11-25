---
specdojo:
  id: prj-0001:xer-t-kata-review-all-opr-monitoring-sample-130-20261125t015444z-c8affba3
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-opr-monitoring-sample-130
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-opr-monitoring-sample-130/T-KATA-REVIEW-ALL-opr-monitoring-sample-130-20261125T015444Z-c8affba3/plan.md
  started_at: "2026-11-25T01:54:53.012Z"
  completed_at: "2026-11-25T02:07:30.258Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opr-monitoring-sample
    - specdojo:opr-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R3（読みやすさ）として、`opr-monitoring-sample.md` の文を 6 か所直した（W1・W2・W4・W5）。主語と述語のねじれ、指示語が指す表の取り違え、読み違えやすい表現を解消した。意味・判断に要る背景・例外・制約は変えていない。
- 指摘 8 件のうち 6 件を直し、R3-7 と R3-8 は適用範囲や主体が変わりうるため直さず「要判断」とした。
- grade の finding F001〜F004 は R3 の観点に当たらないため扱わず、ほかの段に任せた。
- 検査は、executor の `prettier --check` と `markdownlint`、runner の `lint:md:changed`・`lint:fm:changed`・`lint:mermaid`・`lint:d2`・`test:docs`・`validate:schema` が passed。`validate:history-links` と `validate:schema:file` は対象外、`lint:ts`・`typecheck`・`test:unit`・`test:integration` などは変更種別により対象外だった。
- | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | R3-1 | R3 | 1. 概要 | 「目的は、…気付き、…進めることとする」の主語と述語がねじれ、文も長い | 「目的は、…気付けるようにすることである。」と「気付いた後は、…`OPS` と店番担当が同じ判断で…へ進む。」の 2 文に分けた | W2、W3、W1 | - | | R3-2 | R3 | 5. アラート対応手順（段階の表・暫定対応の完了条件） | 「下の表」が指す表を名前で読めない | 「機能を止める判断の表に従った」にした | W4 | - | | R3-3 | R3 | 5. アラート対応手順（段階の表・誤検知の手順） | 「「誤検知」と考えられる原因を書いて」は「誤検知と考えられる」と読み違えやすく、書く先もない | 「障害記録に「誤検知」と、考えられる原因を書いて終える」にした | W5 | - | | R3-4 | R3 | 5. アラート対応手順（誤検知の扱い・クローズ条件） | 「上の表の誤検知の段階」は、直前の機能を止める判断の表と取り違えうる | 「段階ごとの操作の表の誤検知の行に従う」にした | W4 | - | | R3-5 | R3 | 5. アラート対応手順（誤検知の扱い・閾値の調整） | 「閾値は `opd-index` の統制のため」の主語と述語がねじれ、翌月に確かめる主体がない | 「`opd-index` で統制する値のため、先に `opd-index` を改訂し、その後に…適用する」にし、確かめる主体を `OPS`（月次点検の実施者）と明記した | W2、W1 | - | | R3-6 | R3 | 11. 証跡 | 「記録は…同じ記録に識別子を足し」の主語と述語がねじれ、1 文に 2 つの主張がある | 「同じ記録とし、本書の識別子を足す。」と「通知の履歴は本書で足す証跡とする。」に分けた | W2、一文一主張（`簡潔さと文章量を責務に合わせる`） | - | | R3-7 | R3 | 10. 問い合わせ一次対応手順 | 「「画面が開かない」などの問い合わせ」の「など」の範囲が読み取りにくい | 直していない。「記録できない状態の問い合わせ」などと言い切る案があるが、適用範囲が変わりうる | W7 | 要判断 | | R3-8 | R3 | 11. 証跡（模擬の段落） | 「1 回ずつ模擬する」の主語がない | 直していない。`opr-sample` の同じ段落にも主語がなく、主体（`OPS` か `DEV` か）を本文から一つに決められない。主体は R5 で `opr-sample` とそろえて決める | W1 | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opr-monitoring-sample.md`: R3（読みやすさ）として 6 か所の文を直した。内訳は、概要の長い文を 2 文に分割、「下の表」「上の表」の指示を表の名前に置換、誤検知の記録先を明示、閾値調整の主語と確認主体（`OPS`）の明記、証跡の段落の 2 文への分割。10 行を変更した。

## 3. 申し送り

- grade の finding の扱い: F001（`vp-po-decision-readiness`）と F004（`vp-ops-release-readiness`）は、kata-guide の `kata の観点の組` で kata の段のレビューでは使わない観点のため直していない。F002（`vp-qe-verifiability`）は R4、F003（`vp-qe-kata-conformance`）は R1・R5 の観点のため、ほかの段に任せた。
- 編集対象のずれ: plan の編集対象（rulebook の sample 宣言から解決）は `docs/ja/specdojo/samples/opr-sample.md` だが、実際に直したのは対象の kata `opr-monitoring-sample.md` だけである。plan の編集対象の解決を見直す必要がある。
- R3-1: R3 / 1. 概要 / 「目的は、…気付き、…進めることとする」の主語と述語がねじれ、文も長い / 「目的は、…気付けるようにすることである。」と「気付いた後は、…`OPS` と店番担当が同じ判断で…へ進む。」の 2 文に分けた / W2、W3、W1 / -
- R3-2: R3 / 5. アラート対応手順（段階の表・暫定対応の完了条件） / 「下の表」が指す表を名前で読めない / 「機能を止める判断の表に従った」にした / W4 / -
- R3-3: R3 / 5. アラート対応手順（段階の表・誤検知の手順） / 「「誤検知」と考えられる原因を書いて」は「誤検知と考えられる」と読み違えやすく、書く先もない / 「障害記録に「誤検知」と、考えられる原因を書いて終える」にした / W5 / -
- R3-4: R3 / 5. アラート対応手順（誤検知の扱い・クローズ条件） / 「上の表の誤検知の段階」は、直前の機能を止める判断の表と取り違えうる / 「段階ごとの操作の表の誤検知の行に従う」にした / W4 / -
- R3-5: R3 / 5. アラート対応手順（誤検知の扱い・閾値の調整） / 「閾値は `opd-index` の統制のため」の主語と述語がねじれ、翌月に確かめる主体がない / 「`opd-index` で統制する値のため、先に `opd-index` を改訂し、その後に…適用する」にし、確かめる主体を `OPS`（月次点検の実施者）と明記した / W2、W1 / -
- R3-6: R3 / 11. 証跡 / 「記録は…同じ記録に識別子を足し」の主語と述語がねじれ、1 文に 2 つの主張がある / 「同じ記録とし、本書の識別子を足す。」と「通知の履歴は本書で足す証跡とする。」に分けた / W2、一文一主張（`簡潔さと文章量を責務に合わせる`） / -
- R3-7: R3 / 10. 問い合わせ一次対応手順 / 「「画面が開かない」などの問い合わせ」の「など」の範囲が読み取りにくい / - / W7。「記録できない状態の問い合わせ」などと言い切る案があるが、適用範囲が変わりうるため直さなかった / 要判断
- R3-8: R3 / 11. 証跡（模擬の段落） / 「1 回ずつ模擬する」の主語がない / - / W1。opr-sample の同じ段落にも主語がなく、主体（`OPS` か `DEV` か）を本文から一つに決められないため直さなかった。主体は R5 で opr-sample とそろえて決める / 要判断
- grade の finding の扱い: F001（`vp-po-decision-readiness`）と F004（`vp-ops-release-readiness`）は、kata-guide の `kata の観点の組` で kata の段のレビューでは使わない観点のため、直していない。F002（`vp-qe-verifiability`）は R4、F003（`vp-qe-kata-conformance`）は R1・R5 の観点のため、ほかの段に任せた。
- 編集対象のずれ: plan の編集対象（rulebook の sample 宣言から解決）は `docs/ja/specdojo/samples/opr-sample.md` だが、kata-guide の `段と渡す材料` に従い、直すのは対象の kata `opr-monitoring-sample.md` だけとした。前の段 R2（`-120`）の plan も同じ編集対象を挙げつつ、実際には `opr-monitoring-sample.md` が直されている。plan の編集対象の解決を見直す必要がある。
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/samples/ 配下の sample だけで、plan・result・個票を変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルに `*.yaml` / `*.yml` がない）

## 4. 進め方と実践の型の適用

sample-maintenance の R3 として、kata-guide の「文章のチェック項目」（W1〜W10）に照らして `opr-monitoring-sample.md` を読み、主語と述語のねじれ、指示語の曖昧さ、読み違えやすい表現を直した。前の段の指摘は繰り返していない。plan に展開された finding F001〜F004 は R3 の観点に当たらず、ほかの段（R1・R4・R5 など）に任せた。迷った 2 件（R3-7、R3-8）は推測で直さず「要判断」とした。`status` は `draft` のまま据え置いた。
