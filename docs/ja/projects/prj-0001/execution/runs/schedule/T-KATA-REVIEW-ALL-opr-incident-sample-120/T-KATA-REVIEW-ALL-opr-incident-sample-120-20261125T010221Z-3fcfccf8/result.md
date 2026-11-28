---
specdojo:
  id: prj-0001:xer-t-kata-review-all-opr-incident-sample-120-20261125t010221z-3fcfccf8
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-opr-incident-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-opr-incident-sample-120/T-KATA-REVIEW-ALL-opr-incident-sample-120-20261125T010221Z-3fcfccf8/plan.md
  started_at: "2026-11-25T01:02:29.924Z"
  completed_at: "2026-11-25T01:16:09.036Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opr-incident-sample
    - specdojo:opr-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R2（構成）を `docs/ja/specdojo/samples/opr-incident-sample.md` に対して実施した。章の順と表・本文の配置を確かめ、読む順の前後と記述の食い違いを 2 件直した。
- 指摘 R2-1: 段=R2、箇所=4.1. 優先度別の初動と復旧。指摘=「気付いた時刻・画面の状態・優先度を障害記録に書いてから連絡する」という前提が表の後の箇条書きにあり、表の前の文が「気付いた時刻」を初動の期限の起点にしているため読む順が前後していた。直した案=この文を表の前の段落へ移し、残った 1 項目の箇条書き（複数の行に当たる場合は高い方の優先度）は普通の文にした。根拠=`vp-arc-document-structure`。印=なし。
- 指摘 R2-2: 段=R2、箇所=3. 日次・週次・月次点検手順。指摘=「日次の点検は `opr-index` 参照」と書きながら、直後の表に日次の行があり記述が食い違っていた。直した案=「共通の日次・月次点検は `opr-index` 参照とする。本書の手順のために足す点検は次の 2 つ」に改めた。根拠=`vp-qe-omissions-consistency`。印=なし。
- 指摘 R2-3: 段=R2、箇所=全体。指摘=plan の編集対象は `opr-sample.md`（rulebook の sample 宣言から解決）だが、task ID と R1 の対象に合わせて `opr-incident-sample.md` を編集した。直した案=`opr-sample.md` の編集は選ばなかった。根拠=task ID と前段 R1（-110）の対象との整合。印=要判断。対象を取り違えていれば、この段の差分は戻す。
- 検証は、executor の prettier が通り、runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が成功した。TypeScript 関連の検査と `test:integration` は変更種別により対象外だった。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opr-incident-sample.md`: 4.1 の前提の文（障害記録に書いてから連絡する）を表の前の段落へ移し、残りの箇条書きを普通の文にした。3 章の `opr-index` 参照の文を「共通の日次・月次点検は参照、本書で足す点検は次の 2 つ」に直し、直後の表との食い違いを解消した。

## 3. 申し送り

- 申し送り（R3 へ）: 「日次締めは照合が終わってから行う」が 4.2・4.3・4.4 で、ロールバック手順の参照先（`opr-index` の運用変更作業）が 4.2 の本文と 8 章で重なっている。`vp-arc-conciseness` の観点で R3 が扱う。
- 申し送り: grade の finding F001〜F004 は R2 の観点に当たらないため扱っていない。F001（`vp-po-decision-readiness`）と F004（`vp-ops-release-readiness`）は kata のレビューでは使わない観点、F002（`vp-qe-verifiability`）は R4、F003（`vp-qe-kata-conformance`）は R5 で扱う。
- plan で編集対象を解決する処理が `opr-sample.md` を指した点は見直しが要る（R2-3、要判断）。
- R2-1: R2 / 4.1. 優先度別の初動と復旧 / 「店番担当は気付いた時刻・画面の状態・優先度を障害記録に書いてから連絡する」という前提が、表の後の箇条書きにあった。表の前の文はこの「気付いた時刻」を初動の期限の起点にしているため、読む順が前後していた / この文を表の前の段落へ移した。残った 1 項目の箇条書き（複数の行に当たる場合は高い方の優先度）は普通の文にした / `vp-arc-document-structure` / -
- R2-2: R2 / 3. 日次・週次・月次点検手順 / 「日次の点検は `opr-index` 参照」と書きながら、直後の表に日次の行があり、記述が食い違っていた / 「共通の日次・月次点検は `opr-index` 参照とする。本書の手順のために足す点検は次の 2 つ」にした / `vp-qe-omissions-consistency` / -
- R2-3: R2 / 全体 / plan の「編集対象」は opr-sample.md（rulebook の sample 宣言から解決）だが、task ID と R1（-110）の対象に合わせて opr-incident-sample.md を編集した / - / opr-sample.md の編集は選ばなかった。対象を取り違えていれば、この段の差分は戻す。plan で編集対象を解決する処理の見直しが要る / 要判断
- 申し送り（R3 へ）: 「日次締めは照合が終わってから行う」が 4.2・4.3・4.4 で、ロールバックの手順の参照先（`opr-index` の運用変更作業）が 4.2 の本文と 8 章で重なっている。`vp-arc-conciseness` の観点で R3 が扱う。
- 申し送り: grade の finding は R2 の観点に当たらないため扱わなかった。F001（`vp-po-decision-readiness`）と F004（`vp-ops-release-readiness`）は kata-guide で kata のレビューでは使わない観点、F002（`vp-qe-verifiability`）は R4、F003（`vp-qe-kata-conformance`）は R5 で扱う。

## 4. 進め方と実践の型の適用

kata-guide の「kata を agent でレビューする」の R2（構成）に従い、R1 が直した版を読んで章の順、粒度、表と本文の配置を確かめた。直したのは、前提から結論の順に読めない箇所（4.1）と本文と表が食い違う箇所（3 章）の 2 件で、どちらも sample 内の差分で済ませた。rulebook など sample 以外は変更していない。grade の finding F001〜F004 は他の段の観点に当たるため扱わず、担当の段を申し送りに残した。plan の編集対象（`opr-sample.md`）と実際の編集対象（`opr-incident-sample.md`）が異なる点は、根拠を task ID と R1 の対象として要判断にした。
