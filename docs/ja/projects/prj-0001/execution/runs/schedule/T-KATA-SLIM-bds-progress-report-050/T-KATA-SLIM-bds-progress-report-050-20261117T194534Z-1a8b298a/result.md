---
specdojo:
  id: prj-0001:xer-t-kata-slim-bds-progress-report-050-20261117t194534z-1a8b298a
  type: exec-result
  task_id: T-KATA-SLIM-bds-progress-report-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-bds-progress-report-050/T-KATA-SLIM-bds-progress-report-050-20261117T194534Z-1a8b298a/plan.md
  started_at: "2026-11-17T19:45:40.238Z"
  completed_at: "2026-11-17T20:12:48.616Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - bds-progress-report
    - specdojo:bds-sample
---

# Edit Result

## 1. 実施内容

- `bds-sample.md` から文書の運用の記述と同じ判断の言い直しを外した。手本は sld の試行と改訂済みの `sld-sample.md` である。結論（判断の基準、値、例外、未決事項の論点）は変えていない。
- 空白を除いた文字数は 8,778 から 5,222 になり、7 割以下の目安を満たす（59.5%）。表の区切り行を除くと 6,911 から 4,189（60.6%）。バイト数は 28,703 から 15,808 になった。
- F001 の再出力手順と停止条件の再掲は、「出力の時期と契機」への参照にまとめた。
- executor の `prettier`、`markdownlint-cli2`、runner の `lint:fm`、`lint:md`、`lint:mermaid`、`lint:d2`、`validate:schema`、`test:unit`、`test:integration` は成功した。`lint:ts` と `typecheck` は変更種別により非適用だった。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/bds-sample.md`: 役割の箇条書き（対象外の用途のみ残した）、末尾の確認・公開の段落、メモ / 将来課題の担当・追跡先の列と登録の段落、並び順の例を削除した。再出力の定義は「出力の時期と契機」に一本化し、元にする記録の表と販売数の確認は「集計・算出ルール」を参照する形にした。読み取れない締め記録と定期処理失敗の例外行を統合し、仕入れ閾値の未決は「集計・算出ルール」から「メモ / 将来課題」へ移した。「本書の変更」行は、変更影響と再検証条件を残して再出力手順を参照に置き換えた。整形の過程で削りすぎた 4 つの規則（販売ゼロの営業日、品目台帳に無い品目の確認依頼、締めた週の欠品記録のある品目の一覧、締め計画と合わない場合の DEV への通知）は戻した。

## 3. 申し送り

- F001 は再出力手順と停止条件の再掲を参照に置き換えて解消した。ただし F001 が残すよう求めた BA・DEV・QE・PO の担当と PO 承認の順序は外した。plan が担当の列を外すよう指示しており、これらは rulebook が担う共通の運用であるためである。
- 元の sample に検証の表がなかったため、文書品質の行は削除対象がなかった。
- bds-rulebook は recipe と template を不要と宣言しているため、それらへの変更案はない。
- Size in non-whitespace characters, for the result: bds-sample went from 8,778 to 5,222 (59.5%). Excluding table separator rows, as in the sld pilot, it went from 6,911 to 4,189 (60.6%). Bytes went from 28,703 to 15,808.
- F001: the re-output procedure and stop condition are no longer repeated in the 本書の変更 row; it now references the chapter 出力の時期と契機. The change impact and the re-verification condition (re-output the latest week after the change and check the week-over-week difference) are kept. The BA/DEV/QE/PO owners and the PO approval order that F001 asked to keep were removed, because the plan says to remove the owner columns and these are common operations that the rulebook covers.
- Removed: the role bullets in 読み手と利用目的 (only the out-of-scope uses remain), the final confirmation and publication paragraph, the owner/resolution and handoff-target columns in メモ / 将来課題 and the PM registration paragraph (the table now has the two columns the rulebook recommends), and the example for the sort order. The original sample had no verification table, so there was no document-quality row to remove.
- Merged duplicates: re-output is defined only in 出力の時期と契機. The missing-previous-report handling in the source-records table and the check for the 販売数 item refer to 集計・算出ルール. The exception rows for an unreadable closing record and a failed automatic run are merged. The undecided restock threshold moved from 集計・算出ルール to メモ / 将来課題.
- Conclusions are unchanged. Four rules that were trimmed during the rewrite were restored: a business day with zero sales, prompting the owner about items missing from the item ledger, listing items with stock-out records in a closed week, and notifying DEV when that does not match the closure plan.
- bds-rulebook declares recipe and template as not-needed, so there are no change proposals for them.
- 適用外の検証: `npm run validate:history-links`（The only changed file is a sample under docs/ja/specdojo/samples/, not a plan, result, or register ticket）

## 4. 進め方と実践の型の適用

参照の向きを成果物から sample に切り替え、改訂済みの bds-rulebook と sld の試行を規範として `bds-sample.md` だけを見直した。F001 は `vp-arc-conciseness` の判定根拠に沿い、再出力規則の二重管理を章タイトルでの参照に置き換えた。同じ判断は 1 か所の表を正とし、隣接仕様との分担と対応を 1 つの表にまとめて概要の再掲を外した。結論は変えず、削りすぎた 4 つの規則は戻した。根拠不足で見送った finding はない。rulebook、recipe、template は変更していない。
