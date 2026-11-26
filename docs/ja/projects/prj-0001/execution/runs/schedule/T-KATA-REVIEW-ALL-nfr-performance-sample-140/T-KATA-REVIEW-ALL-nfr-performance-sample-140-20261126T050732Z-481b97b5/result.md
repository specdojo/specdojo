---
specdojo:
  id: prj-0001:xer-t-kata-review-all-nfr-performance-sample-140-20261126t050732z-481b97b5
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-nfr-performance-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-nfr-performance-sample-140/T-KATA-REVIEW-ALL-nfr-performance-sample-140-20261126T050732Z-481b97b5/plan.md
  started_at: "2026-11-26T05:07:43.829Z"
  completed_at: "2026-11-26T05:14:34.827Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:nfr-performance-sample
    - specdojo:nfr-performance-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R4（正しさ）として、`nfr-performance-sample` の記述を schema・関連 sample と突き合わせ、誤り 2 件を直した。あわせて grade の F001（未判定の要件の扱い）を測定・検証方法に明記した。
- 確かめた主張は 9 件。7 件は一致、2 件は不一致で直した。ホスティングのプランと資源の上限は正本がなく、確かめられなかった。
- `npx prettier --write` と `npx markdownlint-cli2` はエラーなし。runner の `lint:md:changed`、`lint:fm:changed`、`validate:schema` なども通った。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R4-1 | R4 | 関連ドキュメント導線 / 受入条件の行 | 受入条件の行が仮置きの `sac-performance` になっており、既にある `specdojo:sac-sample` へリンクしていない。目的の列の「`nfr-perf-001`〜`nfr-perf-006` の合否判定」は、`nfr-perf-004` を対象外とする sac-sample の概要と合わない。 | `[[specdojo:sac-sample\|システム受入条件: 性能]]` にし、目的を「`nfr-perf-004` を除く要件の合否判定」にした。 | `vp-dev-implementation-readiness`（sac-sample の概要と SAC-PERF-01〜04 の対応表） | - |
| R4-2 | R4 | 関連ドキュメント導線 / 総合テストの行 | `nfr-perf-003` の測定を `st-cash-sale-commit-response-010` としている。stc-sample では照合を `st-cash-sale-commit-records-010`（TR-06・SAC-PERF-02）が担い、`response-010` は TR-05・TR-07 で P95・P99 を測る。 | 「`nfr-perf-001`・`nfr-perf-002` の測定（`st-cash-sale-commit-response-010`）と `nfr-perf-003` の照合（`st-cash-sale-commit-records-010`）」にした。 | `vp-dev-testability`（stc-sample の TR-06・TR-07、`response-010` と `records-010` のケース行） | - |
| R4-3 | R4 | 測定・検証方法 / F001 | 表の後の「合格条件を満たせば pass、満たさなければ fail」が、`nfr-perf-002`・`nfr-perf-004` の「基準の確定まで判定しない」と読み合わない。 | 「基準の確定まで判定しない要件は、測った値を記録するだけとし pass / fail を付けない」を足した。 | `vp-qe-verifiability`（grade F001） | - |
| R4-4 | R4 | 測定・検証方法 / `nfr-perf-004` の測り方 | 本書は「商品名・商品コードの検索を各 30 回」とし、stc-sample の TR-07 は「会計確定と同じ試行で値だけ記録する」としていて、測り方が食い違う。 | - | 正をどちらに寄せるかは R5（整合）で決める。案は、本書の測定方法に「会計確定の試行と同じ時間帯に行う」と書き添えるか、stc-sample の TR-07 の備考を本書に合わせること。 | 要判断（測定設計の選択になるため、R4 では直さなかった） |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/nfr-performance-sample.md`: 関連ドキュメント導線の受入条件の行を、仮置きの `sac-performance` から `[[specdojo:sac-sample|システム受入条件: 性能]]` へのリンクに直した。目的は sac-sample の概要に合わせ、`nfr-perf-004` を除く要件の合否判定とした。総合テストの行は、`nfr-perf-001`・`nfr-perf-002` の測定を `st-cash-sale-commit-response-010`、`nfr-perf-003` の照合を `st-cash-sale-commit-records-010` に分けて書いた。測定・検証方法には「基準の確定まで判定しない要件は、測った値を記録するだけとし pass / fail を付けない」を足し、F001 を解消した。

## 3. 申し送り

- R4-1: R4 / 関連ドキュメント導線 / 受入条件の行が仮置きの `sac-performance` になっており、既にある `specdojo:sac-sample` へリンクしていない。目的の列の「`nfr-perf-001`〜`nfr-perf-006` の合否判定」は、`nfr-perf-004` を対象外とする sac-sample の概要と合わない / `[[specdojo:sac-sample\|システム受入条件: 性能]]` にし、目的を「`nfr-perf-004` を除く要件の合否判定」にした / `vp-dev-implementation-readiness`（sac-sample の概要と SAC-PERF-01〜04 の対応表） / -
- R4-2: R4 / 関連ドキュメント導線 / 総合テストの行で、`nfr-perf-003` の測定を `st-cash-sale-commit-response-010` としている。stc-sample では照合を `st-cash-sale-commit-records-010`（TR-06・SAC-PERF-02）が担い、`response-010` は TR-05・TR-07 で P95・P99 を測る / 「`nfr-perf-001`・`nfr-perf-002` の測定（`st-cash-sale-commit-response-010`）と `nfr-perf-003` の照合（`st-cash-sale-commit-records-010`）」にした / `vp-dev-testability`（stc-sample の TR-06・TR-07、`response-010` と `records-010` のケース行） / -
- R4-3: R4 / 測定・検証方法 / F001: 表の後の「合格条件を満たせば pass、満たさなければ fail」が、`nfr-perf-002`・`nfr-perf-004` の「基準の確定まで判定しない」と読み合わない / 「基準の確定まで判定しない要件は、測った値を記録するだけとし pass / fail を付けない」を足した / `vp-qe-verifiability`（grade F001） / -
- R4-4: R4 / 測定・検証方法 / `nfr-perf-004` の測り方が食い違う。本書は「商品名・商品コードの検索を各 30 回」、stc-sample の TR-07 は「会計確定と同じ試行で値だけ記録する」としている / - / 正をどちらに寄せるかは R5（整合）で決める。案は本書の測定方法に「会計確定の試行と同じ時間帯に行う」と書き添えるか、stc-sample の TR-07 の備考を本書に合わせる / 要判断（測定設計の選択になるため、R4 では直さなかった）
- R4 確かめの表の材料（主張 / 正本 / 結果）: 1 wikilink 6 件（nfr-index・prj-overview・prj-acd・tsp-index・stc・opd-monitoring）/ 各 sample の frontmatter の id / 一致。2 ACD-A02 通信断・ACD-D01 タブレット 1 台 / prj-assumptions-constraints-dependencies-sample 26・43 行 / 一致。3 初期目標「営業日の 90% 以上」「つけ残高を 1 分以内」/ prj-overview-sample 70・78 行 / 一致。4 仮置き基準「60 件/時で P95 2 秒以内」/ tsp-index-sample 138 行 / 一致。5 `nfr-perf-002`・`nfr-perf-004` は記録のみ / tsp-index-sample 109 行・sac-sample 20・28 行 / 一致。6 受入条件 `sac-performance` で 001〜006 を判定 / sac-sample / 不一致（R4-1 で直した）。7 `nfr-perf-003` の測定は `response-010` / stc-sample 64・141 行 / 不一致（R4-2 で直した）。8 frontmatter の `type: requirement`・`rulebook` / nfr-performance-rulebook の `deliverable_type`・`sample` / 一致。9 ホスティングのプラン・資源の上限 / 正本なし（`_UNDECIDED_`）/ 確かめられない（事業者の提供条件が決まれば確かめられる）
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/samples 配下の sample だけで、plan・result・個票を変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更した `*.yaml` / `*.yml` ファイルがない）

## 4. 進め方と実践の型の適用

根拠としたのは、kata-guide の R4 の定め、nfr-performance-rulebook、sac-sample、stc-sample、tsp-index-sample、prj-overview-sample、prj-assumptions-constraints-dependencies-sample である。sample の主張を、これらの正本と 1 件ずつ突き合わせた。不一致だった受入条件のリンク先とテストケース名は正本に合わせて直した。一致した記述は維持した。矛盾があるときは rulebook と各正本を正とした。F001 は測定・検証方法に扱いを足して解消した。`nfr-perf-004` の測り方が stc-sample の TR-07 と食い違う点は、測定設計の選択になるため R4 では直さず、R5（整合）の判断に回した。ホスティングのプランと資源の上限は正本がなく、確かめられない主張として残した。
