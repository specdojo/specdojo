---
specdojo:
  id: prj-0001:xer-t-kata-review-all-itc-sample-130-20261125t013051z-7011ea29
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-itc-sample-130
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-itc-sample-130/T-KATA-REVIEW-ALL-itc-sample-130-20261125T013051Z-7011ea29/plan.md
  started_at: "2026-11-25T01:31:00.717Z"
  completed_at: "2026-11-25T01:43:33.778Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:itc-sample
    - specdojo:itc-sample
---

# Edit Result

## 1. 実施内容

- R3（読みやすさ）として `docs/ja/specdojo/samples/itc-sample.md` の文を6か所直した。直した観点は、主語と述語の対応、指示語の参照先、略語の初出、用語の統一、修飾の係りである。
- F001 と F003 は前の段で観点の型の表になった時点で解消済みだった。executor は、表に理由と代わりのケース `it-sales-checkout-persistence-integrity-010` があることを確かめた。
- F002 は `itc-index-sample` 側の割り当てを直す指摘である。本書の記述は変えず、handoff に残した。
- Prettier での整形と markdownlint は問題なし。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も passed。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/itc-sample.md`: 文の直し6か所（12行挿入・12行削除）。(1) 概要の対象文を、主語と述語がそろう形に直した。 (2) 結合境界/依存/環境前提の「外れる扱いはない」を「共通の扱いから外れる依存はない」にした。 (3) `_ASSUMPTION_` の「変わる場合は」を「分離レベルが変わる場合は」にした。 (4) 略語 PJR の初出に正式名を添え、参照先を wikilink にした。 (5) TR-05 の要点から主語のない「主担当」を外し、備考列に一本化した。 (6) 意図の文を「在庫不足で確定できない会計と DB の更新拒否のどちらでも…」にし、用語を「更新拒否」にそろえた。

## 3. 申し送り

- R3-4 は「要判断」である。PJR の語を削ると意味が変わるおそれがあるため、正式名を添えるだけにとどめた。`itc-index-sample` の同じ論点の対応欄は「PM へ決定事項として報告」と書いており、PJR への起票とは書いていない。食い違いの確認は R5 に任せる。
- F002 は `itc-index-sample` 側を直す案件である。`itc-sales-checkout` の「依存障害時の挙動」を「DB の更新拒否時に未保存を成功表示しない」に、「状態遷移の整合性」を「未確定のまま確定へ進まない保留の維持」に改める案を handoff に残した。R5 または `itc-index-sample` の手直しで扱う。
- R3-1: R3 / 1. 概要（sales-checkout） / 「会計確定の要求が…確定するまでの縦スライス」は主語「要求が」と述語「確定する」がねじれており、文も体言止めで終わっている / 「店頭操作端末が会計確定を要求してから、販売・在庫記録サービスが業務記録 DB へ…確定するまでの縦スライス（…）を対象とする。」にした / W2、W1 / -
- R3-2: R3 / 4. 結合境界/依存/環境前提 / 「外れる扱いはない」は何が外れないのかが読み取りにくい / 「共通の扱いから外れる依存はない」にした / W1、vp-ux-readability / -
- R3-3: R3 / 4. 結合境界/依存/環境前提 / `_ASSUMPTION_` の「変わる場合は」は何が変わるのかが文から一つに決まらない / 「分離レベルが変わる場合は」にした / W4 / -
- R3-4: R3 / 4. 結合境界/依存/環境前提 / 略語「PJR」の初出に正式名がなく、「itc-index 側」は参照先の書き方として曖昧 / 「プロジェクト登録簿（PJR）への引き継ぎは [[specdojo:itc-index-sample|内部結合テストカタログ: 概要]] の同じ論点に集約し」にした / W8 / 要判断（理由: itc-index-sample の同じ論点の対応欄は「PM へ決定事項として報告」で、PJR への起票とは書いていない。PJR という語を削る案は意味が変わるおそれがあるため選ばず、正式名を添えるだけにとどめた。食い違いの確かめは R5 に任せる）
- R3-5: R3 / 5. トレース / TR-05 の要点「…二重計上防止を主担当する」は主語がなく、「主担当」が備考列と二重になっている / 要点を「確定失敗時はロールバックし、同じ取引番号の再送で二重計上しない」にし、主担当は備考列だけに残した / W1、vp-arc-conciseness / -
- R3-6: R3 / 6.2.1. 意図 / 「確定できない会計と DB の更新失敗で」は修飾の係りが曖昧で、「更新失敗」が本書のほかの箇所の用語「更新拒否」とそろっていない / 「在庫不足で確定できない会計と DB の更新拒否のどちらでも、販売・在庫に途中の変更を残さないことを保証する。」にした / W5、W8 / -
- R3-7: R3 / 6. テスト観点とケース / F001（状態遷移の整合性の理由と代わりのケース）と F003（導入段落の詰め込み）は、前の段で観点の型の表になったときに解消済み。表に理由「補完後の購入は通常の会計確定と同じ入力になる」と代わり `it-sales-checkout-persistence-integrity-010` があることを確かめた / - / vp-qe-omissions-consistency、vp-ux-readability / -
- R3-8: R3 / 6. テスト観点とケース（相手側: itc-index-sample の観点の立て方（共通）の表） / F002: itc-index-sample は `itc-sales-checkout` の「依存障害時の挙動」を「DB 停止時に未保存を成功表示しない」とし、「状態遷移の整合性」を「未確定から確定への遷移」としている。本書は DB 停止を採用せず更新拒否で扱い、状態遷移は保留の維持だけを扱っており、両者が食い違う / - / vp-qe-kata-conformance。相手側の直す案: itc-index-sample の該当セルを「DB の更新拒否時に未保存を成功表示しない」と「未確定のまま確定へ進まない保留の維持」に改める。R5 または itc-index-sample の手直しで扱う / -
- 適用外の検証: `npm run validate:history-links`（履歴蓄積ファイル（plan / result / 個票）を変更していないため）
- 適用外の検証: `npm run validate:schema:file`（`*.yaml` / `*.yml` を変更していないため）

## 4. 進め方と実践の型の適用

kata-guide の「kata を agent でレビューする」の R3 に従い、文章のチェック項目 W1〜W10 に沿って文を直した。意味、判断に要る背景、例外、制約は変えていない。plan に展開された finding のうち、F001（vp-qe-omissions-consistency）と F003（vp-ux-readability）は、前の段の直しで解消済みであることを確かめた。F002（vp-qe-kata-conformance）は、本書が DB 停止を不採用にしている点と `itc-index-sample` の共通方針の食い違いである。本書は rulebook の方針に沿っているため変えず、相手側の直し案を申し送りに残した。この指摘は未解消のまま残る。次のアクションは、`itc-index-sample` の該当セルの更新である。frontmatter の `status` は `draft` のまま変えていない。
