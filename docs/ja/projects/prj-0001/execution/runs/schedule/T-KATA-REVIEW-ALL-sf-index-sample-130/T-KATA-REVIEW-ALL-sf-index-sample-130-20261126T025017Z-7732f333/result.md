---
specdojo:
  id: prj-0001:xer-t-kata-review-all-sf-index-sample-130-20261126t025017z-7732f333
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-sf-index-sample-130
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-sf-index-sample-130/T-KATA-REVIEW-ALL-sf-index-sample-130-20261126T025017Z-7732f333/plan.md
  started_at: "2026-11-26T02:50:26.484Z"
  completed_at: "2026-11-26T02:56:46.008Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:sf-index-sample
    - specdojo:sf-index-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R3（読みやすさ）として、`docs/ja/specdojo/samples/sf-index-sample.md` に文の直しを 6 件入れた（W1・W2・W3・W5・W8・`vp-arc-conciseness`）。意味と判断に要る背景・例外・制約は維持した。
- executor の `prettier` と `markdownlint-cli2` はエラーなしで通った。runner の `lint:md:changed`・`lint:fm:changed`・`lint:mermaid`・`lint:d2`・`test:docs`・`validate:schema` も passed だった。
- grade finding のうち F001 と F002、F004 はこの段の観点に当たらないため扱っていない。F003 は前の段で解消済みである。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R3-1 | R3 | 冒頭の導入段落 | 「機能分割・テスト対象の洗い出しと、個別機能仕様への入口として使う」が主語と述語でねじれ、使い道が「1. 目的と対象範囲」と重複する。 | 「各機能を業務プロセス領域と画面へ対応付け、個別機能仕様への入口とする。」にした。 | W2、`vp-arc-conciseness` | - |
| R3-2 | R3 | 1. 目的と対象範囲 | 第1文に主語がなく、第2文は読点が多く使い道と判断を1文に詰めている。 | 主語「本一覧は」を補い、役割ごとの使い道の文と「読み手は、業務からの漏れと機能の重なりを一覧で判断する。」の2文に分けた。 | W1、W3 | - |
| R3-3 | R3 | 1. 目的と対象範囲（対象外の行） | P-01 の表記「仕入先への発注」が概念データフロー図と「2. 機能構成」の「仕入計画」と揃っていない。 | 「仕入計画と仕入先への発注（`P-01`）」にした。 | W8、`vp-ux-language-consistency` | - |
| R3-4 | R3 | 3. システム化機能一覧（注記2項目目） | 「在庫未反映・結果不明を販売完了とは通知しない」の主語がない。 | 「販売とつけ販売の機能は、在庫未反映または結果不明の取引を販売完了として通知しない」にした。 | W1 | - |
| R3-5 | R3 | 3. システム化機能一覧（注記の個別仕様の項目） | 「個別仕様は…完成例で…その他は一覧行の要約を正とする」がねじれ、表の個別仕様の列と Q-03 の当面の扱いの言い直しになっている。 | 項目を削除した。 | W2、`vp-arc-conciseness` | - |
| R3-6 | R3 | 4. 未決事項（Q-01 の論点） | 「補充依頼確定以外の BPS と販売登録画面以外の画面仕様」の修飾の係りが二通りに読める。 | 「BPS は補充依頼確定、画面仕様は販売登録画面だけが作成済みで、…に基づく暫定である」にした。 | W5 | - |
| R3-7 | R3 | 1. 目的と対象範囲 | 役割名（店主代表）と Role code（DEV・QE）が同じ文に混在する。 | - | W8、sample-authoring-standard の役割名・Role code の区分。QE に対応する共通登場人物の役割名がなく統一できないため Role code を維持した。選ばなかった案は「開発担当（DEV）」のように正式名を添える方法である。 | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/sf-index-sample.md`: 冒頭の導入段落と「1. 目的と対象範囲」の主語・文の長さを直し、対象外の行の P-01 表記を「仕入計画と仕入先への発注」に揃えた。「3. システム化機能一覧」の注記は、主語を補った項目と、表や Q-03 と重複する個別仕様の項目の削除を行った。「4. 未決事項」の Q-01 は修飾の係りを明確にした。

## 3. 申し送り

- grade finding のうち F001 は kata の段のレビューで使わない観点、F002 と F004 は R5 の観点のため、この段では扱っていない。F003 は前の段で表のセルに「`Q-02` で未決」が補われ、解消済みである。
- R3-1: R3 / 冒頭の導入段落 / 「機能分割・テスト対象の洗い出しと、個別機能仕様への入口として使う」が主語と述語でねじれ、使い道が 1. 目的と対象範囲と重複する / 「各機能を業務プロセス領域と画面へ対応付け、個別機能仕様への入口とする。」にした / W2、vp-arc-conciseness / -
- R3-2: R3 / 1. 目的と対象範囲 / 第1文に主語がなく、第2文は読点が多く使い道と判断を1文に詰めている / 主語「本一覧は」を補い、役割ごとの使い道の文と「読み手は、業務からの漏れと機能の重なりを一覧で判断する。」の2文に分けた / W1、W3 / -
- R3-3: R3 / 1. 目的と対象範囲（対象外の行） / P-01 の表記「仕入先への発注」が概念データフロー図と2. 機能構成の「仕入計画」と揃っていない / 「仕入計画と仕入先への発注（`P-01`）」にした / W8、vp-ux-language-consistency / -
- R3-4: R3 / 3. システム化機能一覧（注記2項目目） / 「在庫未反映・結果不明を販売完了とは通知しない」の主語がない / 「販売とつけ販売の機能は、在庫未反映または結果不明の取引を販売完了として通知しない」にした / W1 / -
- R3-5: R3 / 3. システム化機能一覧（注記の個別仕様の項目） / 「個別仕様は…完成例で…その他は一覧行の要約を正とする」がねじれ、表の個別仕様の列と Q-03 の当面の扱いの言い直しになっている / 項目を削除した / W2、vp-arc-conciseness / -
- R3-6: R3 / 4. 未決事項（Q-01 の論点） / 「補充依頼確定以外の BPS と販売登録画面以外の画面仕様」の修飾の係りが二通りに読める / 「BPS は補充依頼確定、画面仕様は販売登録画面だけが作成済みで、…に基づく暫定である」にした / W5 / -
- R3-7: R3 / 1. 目的と対象範囲 / 役割名（店主代表）と Role code（DEV・QE）が同じ文に混在する / - / W8、sample-authoring-standard の役割名・Role code の区分。QE に対応する共通登場人物の役割名がなく統一できないため Role code を維持した。選ばなかった案: 「開発担当（DEV）」のように正式名を添える / 要判断
- grade finding の扱い: F001（vp-pm-control-reporting）は kata の段のレビューで使わない観点、F002（vp-dev-change-impact）と F004（vp-qe-kata-conformance の kata 相互整合）は R5 の観点のためこの段では扱わない。F003 は前の段で表のセルに「`Q-02` で未決」が補われ解消済み。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/ の sample のみで、plan・result・個票を変更していないため）
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/specdojo/samples/ 配下のみで docs/ja/projects/ に届かないため）

## 4. 進め方と実践の型の適用

根拠は plan が指す kata-guide の R3 と文章のチェック項目 W1〜W10、sample-authoring-standard、`vp-arc-conciseness` である。前の段の指摘は繰り返さず、文の直しだけを入れ、意味や判断に要る背景・例外・制約は変えていない。役割名と Role code の混在（R3-7）は、QE に対応する共通登場人物の役割名がなく統一できないため Role code を維持し、要判断とした。frontmatter の `status` は `draft` のまま据え置いた。
