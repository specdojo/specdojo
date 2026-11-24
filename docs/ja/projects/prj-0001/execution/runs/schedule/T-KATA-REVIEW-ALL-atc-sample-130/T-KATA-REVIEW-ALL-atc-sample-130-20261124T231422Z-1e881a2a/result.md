---
specdojo:
  id: prj-0001:xer-t-kata-review-all-atc-sample-130-20261124t231422z-1e881a2a
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-atc-sample-130
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-atc-sample-130/T-KATA-REVIEW-ALL-atc-sample-130-20261124T231422Z-1e881a2a/plan.md
  started_at: "2026-11-24T23:14:31.128Z"
  completed_at: "2026-11-24T23:27:08.978Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:atc-sample
    - specdojo:atc-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R3（読みやすさ）として `docs/ja/specdojo/samples/atc-sample.md` の文を W1〜W10 に照らして 8 か所直した。直した内容は、主語の明示、長い文の分割、略語の初出に正式名を付けること、表の前の 1 文の追加である。
- 判断に要る背景・例外・制約は変えていない。
- F001（`vp-qe-omissions-consistency`）は前の段で解消済みで、この段では直していない。現在の版は分割基準を「商品の登録→金額の提示→会計確定→レシートの受け渡し」と書いており、`atc-index-sample` の `atc-cash-sale` 行と一致する。再評価で解消を確かめる。
- executor の検証では `npx prettier --check` と、runner の `lint:md:changed`・`lint:fm:changed`・`lint:mermaid`・`lint:d2`・`test:docs`・`validate:schema` が passed だった。変更種別に該当しない検査は `not_applicable` だった。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/atc-sample.md`: 1. 概要で、冒頭の文に主語を置いて「本カタログ（ローカル ID `atc-cash-sale`）は、…」とし、ローカル ID の重複記述を削った。役割分担の 1 文を 3 文に分け、BA・QE の初出に「業務分析担当（BA）」「品質担当（QE）」と正式名を付けた。2. 受入の責務で、SC-01 の主語と述語を対応させ、完了条件を「P0 が全件 Pass し、P1 が `atc-index` の『合格基準』を満たすことである」に直した。3. 対象外、4. 環境/データ/外部依存、5. トレースで、表の前に何の表かを示す 1 文を足し、「前提が確定するまで」と主語を補った。

## 3. 申し送り

- R3 の指摘の一覧（No・段・箇所・指摘・直した案・根拠・印）は、executor の handoff に 1 件ずつ書かれている。R3-1 から R3-8 は、`atc-sample.md` の 1. 概要・2. 受入の責務・3. 対象外・4. 環境/データ/外部依存・5. トレースの読みやすさに関する指摘である。
- 要判断: R3-5 の完了条件の言い換えで、P1 の条件付き受入を「満たす」に含めて読めるかを executor は迷った。`atc-index-sample` の合格基準の表に条件付き受入の扱いがあるため、意味は変わらないと判断している。人が確認する。
- R3-1: R3 / 1. 概要 / 第1文に主語がなく、ローカル ID が第2文の括弧と第3文に重ねて書かれている / 「本カタログ（ローカル ID `atc-cash-sale`）は、…」に改め、第2文の「このカタログ（`atc-cash-sale`）」を「本カタログ」に、第3文の「ローカル ID は `atc-cash-sale` とし、」を削った / W1・`vp-arc-conciseness` / -
- R3-2: R3 / 1. 概要 / 役割分担の文が読点 3 つで 4 人の役割を 1 文に並べている / 「操作する」「記録し、照合する」「判定する」の 3 文に分けた / W3 / -
- R3-3: R3 / 1. 概要 / 略語 BA・QE の初出に正式名がない / `atc-index-sample` の関係者表に合わせて「業務分析担当（BA）」「品質担当（QE）」にした / W8 / -
- R3-4: R3 / 2. 受入の責務（成果/完了条件） / 「SC-01 の測定記録で支援0回・自力で回復できない事象0件になる」の主語と述語が対応しない / 「SC-01 の測定記録では、支援が0回、自力で回復できない事象が0件になる」にした / W2 / -
- R3-5: R3 / 2. 受入の責務（成果/完了条件） / 「完了条件は、…P1 の『合格基準』による判定である（基準は `atc-index` のとおり）」で主語と述語がねじれ、括弧で補足を足している / 「P0 が全件 Pass し、P1 が `atc-index` の『合格基準』を満たすことである」にした / W2。判定の基準は `atc-index-sample` の合格基準の P1 行のまま変えていない / 要判断（P1 の条件付き受入を「満たす」に含めて読めるか迷った。合格基準の表に条件付き受入の扱いがあるため、言い換えても意味は変わらないと判断した）
- R3-6: R3 / 3. 対象外 / 表の前に、何の表かを示す 1 文がない / 「本カタログで扱わない範囲と、その理由・代わりに確かめる先は次のとおり。」を足した / `sample-authoring-standard` の表の前の 1 文・`vp-ux-readability` / -
- R3-7: R3 / 4. 環境/データ/外部依存 / 最初の表の前に説明文がなく、2つ目の表の前の文「確定するまで」の主語がない / 「ケースの開始・完了の時点と、データ・外部依存の準備は次のとおり。」を足し、「前提が確定するまで」にした / `sample-authoring-standard` の表の前の 1 文・W1 / -
- R3-8: R3 / 5. トレース / 表の前に、何と何の対応表かを示す 1 文がない / 「ケースのトレース列に書く `trace_key` と、上流の条件の対応は次のとおり。」を足した / `sample-authoring-standard` の表の前の 1 文 / -
- F001（grade、`vp-qe-omissions-consistency`）: 前の段で解消済み。今の版は分割基準を「商品の登録→金額の提示→会計確定→レシートの受け渡し」と書いており、`atc-index-sample` の `atc-cash-sale` 行と一致する。finding が引いた「店番の交代は `atc-sale-hold` の引継ぎ経路だけで確かめる」の文も今の版にはない。再評価で解消を確かめる。

## 4. 進め方と実践の型の適用

根拠とした規範は、`kata-guide` の「kata を agent でレビューする」「文章のチェック項目」（W1〜W10）、`sample-authoring-standard`、`vp-arc-conciseness`、`vp-ux-readability` である。前の段が直した版を読み、その指摘は繰り返していない。維持した記述は、判断に要る背景・例外・制約と、`atc-index-sample` の合格基準に基づく判定内容である。直した記述は、主語が欠けた文、長い並列文、略語の初出、表の前の説明文である。grade の finding F001 は前の段で解消済みと確認し、grade result サイドカーは編集していない。`status` は `draft` のまま変えていない。rulebook と矛盾する箇所は見つからなかった。
