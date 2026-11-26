---
specdojo:
  id: prj-0001:xer-t-kata-review-all-nfr-availability-sample-110-20261125t115133z-385454a1
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-nfr-availability-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-nfr-availability-sample-110/T-KATA-REVIEW-ALL-nfr-availability-sample-110-20261125T115133Z-385454a1/plan.md
  started_at: "2026-11-25T11:51:42.849Z"
  completed_at: "2026-11-25T12:04:39.772Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:nfr-availability-sample
    - specdojo:nfr-availability-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの R1（目的の過不足）を実施した。可用性要件の sample について、種別の責務と rulebook の目的に照らして不足している内容と余分な内容を確認した。
- 不足は 1 件あった。可用性要件一覧の `技術前提` 列に、rulebook が求める設計文書の出どころが書かれていなかった。この 1 件を sample に足した。
- rulebook の「関連ドキュメント導線」が求める `dec-*` の紐づけは、sample に対応する決定記録の行がない。この点は sample 側では直さず、要判断の指摘として残した。
- F001（`vp-arc-conciseness`）と F002（`vp-qe-verifiability`）は R1 の観点ではない。担当の段である R3 と R4 に回した。
- 検証結果: 変更した sample に対する prettier と markdownlint-cli2 は通った。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も通った。TypeScript 系の検査は、変更対象に該当しないため非適用だった。
- 指摘一覧（Markdown の表） | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | R1-1 | R1 | 3. 可用性要件一覧 / `技術前提` 列 | 基準を支える仕組みの出どころとなる設計文書がない。rulebook の記述ガイドは、`技術前提` に対応する設計文書または `dec-*` を書くよう求めている。 | 4 行すべてに出どころを書き足した。出どころは、運用方針の監視・アラート方針、運用方針のバックアップ・リストア方針、運用手順の障害対応である。冗長化しない仮定には「決定記録はなく、ホスティング環境の SLA が決まったら見直す」を添えた。 | `vp-qe-kata-conformance`（rulebook の「可用性要件一覧」の記述ガイド）。監視の閾値（5 分）と閉店後のバックアップは `opd-index-sample` と一致することを確かめた。 | - | | R1-2 | R1 | 5. 関連ドキュメント導線 | rulebook は、この章に設計判断の `dec-*` を紐づけるよう求めている。sample には対応する決定記録の行がない。 | sample は変更しない。rulebook（`specdojo:nfr-availability-rulebook`）の記述ガイドを「設計判断がある場合に `dec-*` を紐づける」に直す案を出す。 | `vp-qe-kata-conformance`。可用性の設計判断の決定記録は実在せず、`dec-sample` も非推奨のため、架空の `dec-*` を足す案は採らなかった。 | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/nfr-availability-sample.md`: 「3. 可用性要件一覧」の `技術前提` 列を修正した。4 行すべてに、基準を支える仕組みの出どころとして運用方針（監視・アラート、バックアップ・リストア）と運用手順（障害対応）を書き足した。冗長化しない仮定には、決定記録がなくホスティング環境の SLA が決まったら見直す旨を添えた。差分は 6 行追加、6 行削除である。

## 3. 申し送り

- R1-2 は要判断である。rulebook の「関連ドキュメント導線」の記述ガイドを、設計判断がある場合のみ `dec-*` を紐づける形に改めるか、決定記録を実在させるかを人が決める必要がある。
- F001 は R3（読みやすさ）、F002 は R4（正しさ）の段で扱う。本段では sample を直していない。
- R1-1: R1 / 3. 可用性要件一覧 / `技術前提` 列に、基準を支える仕組みの出どころとなる設計文書がない（rulebook の記述ガイドは、`技術前提` に対応する設計文書または `dec-*` を書くよう求めている） / 4 行すべてに出どころ（運用方針の監視・アラート方針、運用方針のバックアップ・リストア方針、運用手順の障害対応）を書き足した。冗長化しない仮定には「決定記録はなく、ホスティング環境の SLA が決まったら見直す」を添えた / `vp-qe-kata-conformance`（rulebook の「可用性要件一覧」の記述ガイド）。監視の閾値（5 分）と閉店後のバックアップは `opd-index-sample` と一致することを確かめた / -
- R1-2: R1 / 5. 関連ドキュメント導線 / rulebook は、この章に設計判断の `dec-*` を紐づけるよう求めているが、sample には対応する決定記録の行がない / - / `vp-qe-kata-conformance`。可用性の設計判断の決定記録は実在せず、`dec-sample` も非推奨のため、架空の `dec-*` を足す案は採らなかった。rulebook（`specdojo:nfr-availability-rulebook`）の「関連ドキュメント導線」の記述ガイドを「設計判断がある場合に `dec-*` を紐づける」に直す案を出す / 要判断
- F001（`vp-arc-conciseness`）と F002（`vp-qe-verifiability`）はこの段の観点ではないため、それぞれ R3（読みやすさ）と R4（正しさ）の段に回した

## 4. 進め方と実践の型の適用

approach は sample-maintenance である。R1 の確かめに当たる箇所だけを直した。根拠は、sample の frontmatter から辿れる rulebook（`specdojo:nfr-availability-rulebook`）の「可用性要件一覧」「関連ドキュメント導線」の記述ガイドと、運用方針の sample（`opd-index-sample`）である。維持した記述は、rulebook と整合し、監視の閾値や閉店後のバックアップが運用方針と一致していた箇所である。rulebook と sample が食い違った `dec-*` 紐づけは、rulebook を正としつつ、実在しない決定記録を捏造しないため sample を変えず、rulebook 側の直し案として要判断に残した。F001 と F002 は R1 の観点に当たらないため未解消のまま後続の段に任せた。次のアクションは、R3 と R4 での対応と、R1-2 の人による判断である。
