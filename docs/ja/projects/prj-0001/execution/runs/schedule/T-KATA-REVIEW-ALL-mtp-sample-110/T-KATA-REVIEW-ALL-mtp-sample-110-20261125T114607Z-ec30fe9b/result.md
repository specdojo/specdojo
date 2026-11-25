---
specdojo:
  id: prj-0001:xer-t-kata-review-all-mtp-sample-110-20261125t114607z-ec30fe9b
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-mtp-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-mtp-sample-110/T-KATA-REVIEW-ALL-mtp-sample-110-20261125T114607Z-ec30fe9b/plan.md
  started_at: "2026-11-25T11:46:19.372Z"
  completed_at: "2026-11-25T11:59:17.637Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:mtp-sample
    - specdojo:mtp-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R1（目的の過不足）を実施した。rulebook の判断基準、成果物カタログの `done_criteria`、Sample 記述標準に照らして `mtp-sample.md` を確認した。
- 直した点は 1 件。差異発生時の扱いの表で、許容差を超えた行の転記先に、同じ回の中の取り込み直し（再実行）の判断を `pm-decision-log` へ転記する旨が欠けていたため、これを足した。この指摘には「要判断」の印を付けている。
- ほかに足す内容も削る内容もない。概要の「対象に含むもの・含まないもの」は範囲の境界を示すため残した。
- grade の finding F001・F002・F003 は R1 の観点に当たらないため、この段では直していない。F001 は R5、F002 は R4、F003 は R3 に回す。
- executor の検査では、`npx prettier --check` と、runner の `lint:md:changed`・`lint:fm:changed`・`lint:mermaid`・`lint:d2`・`test:docs`・`validate:schema` が通った。ほかの検査は変更種別により非適用になった。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/mtp-sample.md`: 6. 差異発生時の扱い（許容/修正/再実行）の表のうち、許容差を超えた行の転記先の列を、「差異と原因を `pm-issue-log` へ、取り込み直しの判断を `pm-decision-log` へ」に変更した。rulebook の記述ガイド（再実行の判断は `pm-decision-log` へ転記する）に合わせ、同じ回の中の取り込み直しの判断の転記先が欠けていた点を補った。変更は 6 行の挿入と 6 行の削除で、表の整形を含む。

## 3. 申し送り

- R1-1 は「要判断」である。回の中の取り込み直しをリハーサル内の作業とみなせば、判断の記録は要らないとも読める。選ばなかった案は、許容差超の行を変えず、追加の回の判断だけを記録する案である。
- F002 を R4 で直すときは、`mip-index-sample` と値をそろえる必要がある。同 sample の停止許容時間は「切替日の午前の臨時休業（正午まで）」で、開始時刻が未定のためである。
- R1-1: 段 R1 / 箇所 6. 差異発生時の扱い（許容/修正/再実行）の許容差超の行 / 指摘: 同じ回の中で別 `run_id` で取り込み直すのは再実行に当たるが、管理記録への転記先が `pm-issue-log` だけで、再実行の判断の `pm-decision-log` への転記がない。rulebook の記述ガイドの差異発生時の扱い（判断基準と良い例）が求める内容が欠けている / 直した案: 転記先の列を「差異と原因を `pm-issue-log` へ、取り込み直しの判断を `pm-decision-log` へ」にした / 根拠: `vp-qe-kata-conformance`（種別の責務）、`vp-po-purpose-alignment`。迷った理由: 回の中の取り込み直しをリハーサルの中の作業とみれば判断の記録は要らないとも読める。選ばなかった案は、許容差超の行を変えずに追加の回の判断だけを記録すること / 印: 要判断
- R1-2: 段 R1 / 箇所 全章 / 指摘: rulebook の本文要件の 9 章、成果物カタログ（`dct-migration-planning-template.yaml` の `mtp-index`）の `done_criteria` 4 件、Sample 記述標準の禁止事項に照らし、R1-1 以外に欠けている内容も要らない内容もない。概要の「対象に含むもの・含まないもの」は `mtp-&lt;term&gt;` だけの必須項目だが、範囲の境界を示すので残した / 直した案: - / 根拠: `vp-po-purpose-alignment`、`vp-arc-single-responsibility`、`vp-qe-kata-conformance` / 印: -
- 申し送り（指摘以外）: grade の finding は 3 件とも R1 の観点に当たらないため、この段では直していない。F001（`based_on` に `specdojo:dmd-sample` がない、`vp-dev-change-impact`）は R5、F002（所要時間の基準に分数などの値がない、`vp-qe-verifiability`）は R4、F003（「決定記録」と `pm-decision-log` の呼び方の揺れ、`vp-ux-language-consistency`）は R3 に回す。F002 は、mip-index-sample でも停止許容時間が「切替日の午前の臨時休業（正午まで）」とされ、開始時刻が未定のため、R4 で値を足すときは mip-index-sample とそろえる必要がある。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/mtp-sample.md だけで、plan・result・個票を変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更した `*.yaml`・`*.yml` ファイルがない）

## 4. 進め方と実践の型の適用

根拠にしたのは、rulebook の本文要件 9 章、成果物カタログ（`dct-migration-planning-template.yaml` の `mtp-index`）の `done_criteria` 4 件、Sample 記述標準の禁止事項である。観点は `vp-po-purpose-alignment`、`vp-arc-single-responsibility`、`vp-qe-kata-conformance` を使った。rulebook と sample が食い違う箇所は rulebook を正とし、再実行の判断の転記先を補った。それ以外の記述は目的に整合するため維持した。grade の finding F001・F002・F003 は R1 の観点に当たらないため、R5・R4・R3 に回した。根拠不足で見送った項目はない。
