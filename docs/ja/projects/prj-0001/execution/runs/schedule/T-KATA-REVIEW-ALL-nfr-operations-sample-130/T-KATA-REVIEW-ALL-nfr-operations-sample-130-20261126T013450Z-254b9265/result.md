---
specdojo:
  id: prj-0001:xer-t-kata-review-all-nfr-operations-sample-130-20261126t013450z-254b9265
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-nfr-operations-sample-130
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-nfr-operations-sample-130/T-KATA-REVIEW-ALL-nfr-operations-sample-130-20261126T013450Z-254b9265/plan.md
  started_at: "2026-11-26T01:34:59.884Z"
  completed_at: "2026-11-26T01:41:09.267Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:nfr-operations-sample
    - specdojo:nfr-operations-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R3（読みやすさ）として、`nfr-operations-sample` を W1〜W10 に照らして確かめ、文の直し 5 件を入れた。
- 主語の明示、文の分割、ねじれの解消、箇条書き化を行った。意味・背景・制約は変えていない。
- grade の finding F001〜F004 は R3 の観点に当たらないため扱わず、該当する段に任せた。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R3-1 | R3 | 1. 概要（対象・目的）の冒頭の 1 文 | 読点が 3 つあり、目的と定める内容が混ざっている。「定める」の主語もない。 | 「本書は、監視・バックアップ・手順・体制の達成基準を定める。目的は、…できるようにすることである。」の 2 文に分けた。 | W1、W3 | - |
| R3-2 | R3 | 2. 適用範囲・体制前提の監視時間帯の行 | 夜間バックアップの結果を 9:30 に確かめる主体がない。 | 「`OPS` が開店 30 分前の 9:30 に確かめる」にした。`opd-monitoring-sample` と `opr-monitoring-sample` の記述と合わせた。 | W1 | - |
| R3-3 | R3 | 2. 適用範囲・体制前提の段階の表の前の文 | 「異常を検知または店番担当が気付いた時刻」は検知の主語がなく、並べ方もねじれている。 | 「死活監視が異常を検知した時刻、または店番担当が気付いた時刻」にした。 | W2、W5 | - |
| R3-4 | R3 | 3. 運用要件一覧の表の前の文 | 「暫定の基準があれば基準の欄に併記し、ない要件は…」で、主語と述語がねじれている。 | 暫定の基準がある要件と、ない要件の 2 文に分けた。 | W2、W3 | - |
| R3-5 | R3 | 4. 測定・検証方法の箇条書きの 2 点目 | 基準値を見直す時機を 3 つ並べた 1 文に主語がなく、読点が 3 つある。 | 「判定者は、次のいずれかのときに基準値を見直す。」に続けて、時機を 3 項目の入れ子の箇条書きにした。 | W1、W3、W9 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/nfr-operations-sample.md`: 概要の冒頭文を 2 文に分け、監視時間帯の行にバックアップ結果を確かめる主体 `OPS` を補った。段階の表の前の文と運用要件一覧の表の前の文のねじれを直した。測定・検証方法の基準値の見直し時機は、入れ子の箇条書きにした。

## 3. 申し送り

- grade の finding F001（`vp-po-decision-readiness`）と F004（`vp-ops-release-readiness`）は、kata の段のレビューでは使わない観点として扱わなかった。F002（`vp-qe-verifiability`）は R4、F003（`vp-qe-kata-conformance`）は R5 に任せる。これらは executor の申し送りどおりで、この段では未解消のまま残る。
- R3-1: R3 / 1. 概要（対象・目的） / 冒頭の1文は読点が3つあり、目的と定める内容が混ざっている。「定める」の主語もない / 「本書は、監視・バックアップ・手順・体制の達成基準を定める。目的は、…できるようにすることである。」の2文に分けた / W1、W3 / -
- R3-2: R3 / 2. 適用範囲・体制前提（監視時間帯の行） / 夜間バックアップの結果を 9:30 に確かめる主体がない / 「`OPS` が開店 30 分前の 9:30 に確かめる」にした（`opd-monitoring-sample`・`opr-monitoring-sample` の記述と合わせた） / W1 / -
- R3-3: R3 / 2. 適用範囲・体制前提（段階の表の前の文） / 「異常を検知または店番担当が気付いた時刻」で、検知の主語がなく、並べ方もねじれている / 「死活監視が異常を検知した時刻、または店番担当が気付いた時刻」にした / W2、W5 / -
- R3-4: R3 / 3. 運用要件一覧（表の前の文） / 「暫定の基準があれば基準の欄に併記し、ない要件は…」で主語と述語がねじれている / 暫定の基準がある要件と、ない要件の2文に分けた / W2、W3 / -
- R3-5: R3 / 4. 測定・検証方法（箇条書きの2点目） / 基準値を見直す時機を3つ並べた1文に主語がなく、読点が3つある / 「判定者は、次のいずれかのときに基準値を見直す。」に続けて、時機を3項目の入れ子の箇条書きにした / W1、W3、W9 / -
- grade の finding の扱い: F001（`vp-po-decision-readiness`）と F004（`vp-ops-release-readiness`）は、kata-guide の「kata の観点の組」で kata の段のレビューでは使わない観点のため扱わない。F002（`vp-qe-verifiability`）は R4、F003（`vp-qe-kata-conformance`、rulebook の記述）は R5 に任せる。

## 4. 進め方と実践の型の適用

sample-maintenance の進め方で、前の段が直した版を読み、R3 の観点（W1〜W10）に当たる箇所だけを直した。rulebook と矛盾する変更はなく、意味と判断に要る背景・例外・制約は維持した。整形と markdownlint、runner の lint・schema 検査は通過した。
