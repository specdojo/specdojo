---
specdojo:
  id: prj-0001:xer-t-kata-review-all-imp-data-sample-120-20261125t211216z-8e49dcd3
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-imp-data-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-imp-data-sample-120/T-KATA-REVIEW-ALL-imp-data-sample-120-20261125T211216Z-8e49dcd3/plan.md
  started_at: "2026-11-25T21:12:27.441Z"
  completed_at: "2026-11-25T21:18:51.577Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:imp-data-sample
    - specdojo:imp-data-sample
---

# Edit Result

## 1. 実施内容

- R2（構成）として `imp-data-sample` を見直した。6 章の順序と必須の列は rulebook の本文構成と一致していたため、章の入れ替えは行わず、3 件の局所的な構成修正だけを入れた。
- 着手の順番の段落を「影響分析サマリ」から「対応方針」の表の直後へ移した。売上明細の行に抜けていた可用性の判定を補い、再評価条件を対象ごとの 2 項目に分けてキャンペーン適用履歴に期限を付けた。
- F001・F002（`based_on` の `cr-2026-004` が個票 ID 形式でない件）は R1 が `pjr-c4a1` / `PJR-C4A1` へ直し済みのため、R2 では繰り返していない。
- 整形と静的検査（prettier、markdownlint、`lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema`）はすべて passed だった。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R2-1 | R2 | 3. 影響分析サマリ → 5. 対応方針 | 影響度「高」の 2 件の着手の順番（商品マスタを先に着手）は対応項目の順番の判断である。サマリの集計の後に置くと、結論の後に別の結論が続く。 | 段落を「対応方針」の表の直後へ移し、サマリは影響度別の件数の表で終えた。サマリの「優先対応」列の補足として元の位置に残す案もあったが選ばなかった。 | `vp-arc-document-structure`。rulebook「対応方針」は影響度の高い順に対応項目を並べる章である。 | 要判断 |
| R2-2 | R2 | 4. 影響詳細一覧（売上明細の行） | 4 観点のうち、可用性の判定が売上明細の行だけ抜けている。rulebook「影響がない観点も理由を残す」と、サマリの集計規則（観点ごとの最も高い判定）に照らすと不足である。 | 実装変更に「既存明細の移行は閉店後に端末を止めて行う（可用性: 中）」を足した。行の影響度は高のままである。 | `vp-qe-omissions-consistency`。可用性: 中は、「影響分析サマリ」の尺度（閉店後の停止で済む）と「未解決事項」の閉店後の移行作業の記述から導いた。 | - |
| R2-3 | R2 | 5. 対応方針（再評価条件） | 見送りと代替の 2 対象の再評価条件が 1 項目に詰められている。代替（キャンペーン適用履歴）には、rulebook が求める期限がない。 | 前置きの 1 文の後、対象ごとに 2 項目へ分け、キャンペーン適用履歴にも「2026-07-31 までに」を足した。期限は対象期間の終わり（月次照合の完了日）に合わせた。期限を足さずに未解決事項として残す案もあったが選ばなかった。 | `vp-arc-document-structure`、`vp-qe-omissions-consistency`（rulebook「見送り・代替は再評価条件と期限を付す」）。 | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/imp-data-sample.md`: 着手の順番の段落を「影響分析サマリ」から「対応方針」へ移した。「影響詳細一覧」の売上明細の行に可用性の判定（中）を足した。「対応方針」の再評価条件を対象ごとの 2 項目に分け、キャンペーン適用履歴に期限（2026-07-31）を付けた。prettier により表の列幅も整えた。

## 3. 申し送り

- rulebook の template が `undecided` のため、template との照合はできなかった。
- executor の作業用ファイル `tmp/r2-edit.py` が残っている。`tmp/` は commit の対象外。
- R2-1: 段=R2 / 箇所=3. 影響分析サマリ → 5. 対応方針 / 指摘=影響度「高」の 2 件の着手の順番（商品マスタを先に着手）は対応項目の順番の判断で、サマリの集計の後に置くと結論の後に別の結論が続く / 直した案=段落を「対応方針」の表の直後へ移し、サマリは影響度別の件数の表で終えた / 根拠=`vp-arc-document-structure`。rulebook「対応方針」は影響度の高い順に対応項目を並べる章。迷った理由: サマリの「優先対応」列の補足として残す案もある（選ばなかった案: 元の位置に残す） / 印=要判断
- R2-2: 段=R2 / 箇所=4. 影響詳細一覧（売上明細の行） / 指摘=4 観点のうち可用性の判定が売上明細の行だけない。rulebook「影響がない観点も理由を残す」と、サマリの集計規則（観点ごとの最も高い判定）に照らすと抜けている / 直した案=実装変更に「既存明細の移行は閉店後に端末を止めて行う（可用性: 中）」を足した。行の影響度は高のまま / 根拠=`vp-qe-omissions-consistency`。可用性: 中は「影響分析サマリ」の尺度（閉店後の停止で済む）と「未解決事項」の閉店後の移行作業の記述から導いた / 印=-
- R2-3: 段=R2 / 箇所=5. 対応方針（再評価条件） / 指摘=見送りと代替の 2 対象の再評価条件を 1 項目に詰めており、代替（キャンペーン適用履歴）には rulebook が求める期限がない / 直した案=前置きの 1 文の後、対象ごとに 2 項目へ分け、キャンペーン適用履歴にも「2026-07-31 までに」を足した / 根拠=`vp-arc-document-structure`、`vp-qe-omissions-consistency`（rulebook「見送り・代替は再評価条件と期限を付す」）。迷った理由: 期限は対象期間の終わり（月次照合の完了日）に合わせて決めた。選ばなかった案: 期限を足さずに未解決事項として残す / 印=要判断
- F001・F002（`based_on` の `cr-2026-004` が個票 ID 形式でない）は R1（T-KATA-REVIEW-ALL-imp-data-sample-110）が `pjr-c4a1` / `PJR-C4A1` へ直し済みのため、R2 では繰り返さない。rulebook の template は `undecided` のため、template との照合はできなかった。
- 作業用のファイル `tmp/r2-edit.py` が残っている（削除のコマンドが承認待ちで止まった）。`tmp/` は commit の対象外。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/imp-data-sample.md のみで、個票・plan・result を変更していないため）
- 適用外の検証: `npm run validate:schema:file`（変更した `*.yaml` / `*.yml` ファイルがないため）

## 4. 進め方と実践の型の適用

根拠にしたのは rulebook の本文構成と `vp-arc-document-structure`、`vp-qe-omissions-consistency` である。rulebook を正として、sample の章の順・粒度・表と本文の配置を照合した。章構成は一致していたため維持し、結論の後に別の結論が続く箇所、観点の判定の抜け、期限のない再評価条件の 3 点だけを修正した。F001・F002 は R1 の修正で解消済みと判断し、再度の変更はしていない。判断が分かれた R2-1 と R2-3 は「要判断」とした。
