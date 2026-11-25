---
specdojo:
  id: prj-0001:xer-t-kata-review-all-atc-sample-150-20261124t234728z-20e6dd66
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-atc-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-atc-sample-150/T-KATA-REVIEW-ALL-atc-sample-150-20261124T234728Z-20e6dd66/plan.md
  started_at: "2026-11-24T23:47:36.764Z"
  completed_at: "2026-11-25T00:01:38.481Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:atc-sample
    - specdojo:atc-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R5（整合）として `atc-sample` を `atc-index-sample` の命名と照合し、観点の見出しを分配表の観点名に合わせた。
- grade の F001（概要の分割基準から「金額の提示」が抜けている）は、今の版が「商品の登録→金額の提示→会計確定→レシートの受け渡し」になっており、手を入れずに解消済みと確認した。
- 相手側の `atc-index-sample` の食い違いと、優先度の判断が要る点は、変更せず handoff に残した。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/atc-sample.md`: 観点の見出しを「観点：主要操作の自力完了の成立」に変更した。`atc-index-sample` の観点名と命名規則（名詞＋成立/保証/整合）に揃える修正である。`perspective_key` の `self-complete` は据え置いた。

## 3. 申し送り

- R5 の指摘は 4 件ある。No.1（観点見出しの命名）は直した。No.2（grade F001）は解消済みで、No.3 は相手側、No.4 は要判断である。各項目の詳細は executor の handoff に記載されている。
- No.4 は `at-cash-sale-transaction-check-010` の優先度に関する判断である。選択肢は 2 つある。ケースを P0 にするか、`atc-index-sample` の P1 の定義に「確定後の取引の照合」を加えるかである。どちらも完了条件が変わるため、人の判断を待つ。
- No.3 の直し案は `atc-index-sample` 側の修正で、今回は変更していない。共通カラムの記入例のトレース列を `TR-xx` にして、環境/依存 列を空ける案である。
- No: 1 / 段: R5 / 箇所: docs/ja/specdojo/samples/atc-sample.md の観点の見出し（主要操作の自力完了） / 指摘: 観点名が atc-index-sample の命名規則（名詞＋成立/保証/整合）と分配表の観点名「主要操作の自力完了の成立」に合っていない / 直した案: 見出しを「観点：主要操作の自力完了の成立」に変えた（`perspective_key` の `self-complete` は据え置き） / 根拠: atc-index-sample の「受入観点の立て方（共通）」と「観点/条件の採用基準と対象別への分配方針（共通）」 / 印: 直した
- No: 2 / 段: R5 / 箇所: docs/ja/specdojo/samples/atc-sample.md の概要（grade F001） / 指摘: 分割基準から「金額の提示」が抜けている / 直した案: 今の版は「商品の登録→金額の提示→会計確定→レシートの受け渡し」になっており、手を入れていない / 根拠: atc-index-sample の分割基準の表の `atc-cash-sale` の行 / 印: 解消済み
- No: 3 / 段: R5 / 箇所: docs/ja/specdojo/samples/atc-index-sample.md の「ケース表の共通カラム」の記入例（相手側） / 指摘: トレース列に仕様 ID（BAC-01、AC-01）を直書きし、環境/依存 列に共通方針と同じ前提を書いている。atc-rulebook は、トレース列には `TR-xx` を書き仕様 ID の直書きを禁じ、環境/依存 列は共通方針と異なる前提があるときだけ書くとしている / 直した案: 記入例のトレース列を `TR-01、TR-02` にし、環境/依存 列を空ける。あわせて共通カラムの表のトレースの書き方を「トレースの章の `TR-xx`」に改める（相手側のため変更していない） / 根拠: atc-rulebook のケース表の列の定義（トレース・環境/依存）と禁止事項 / 印: 相手側
- No: 4 / 段: R5 / 箇所: docs/ja/specdojo/samples/atc-sample.md の `at-cash-sale-transaction-check-010` の優先度 / 指摘: BAC-01・AC-04 を辿るのに P1 である。atc-index-sample の合格基準では、AC-01〜AC-05 に対応する最短経路は P0、P1 は BAC-02・BAC-03 の停止と引継ぎ・確定前の取消などの重要分岐としている / 直した案: ケースを P0 にするか、atc-index-sample の P1 の定義に「確定後の取引の照合」を加える。完了条件が変わるため変更していない / 根拠: atc-index-sample の「合格基準」、prj-success-criteria-and-acceptance-criteria-sample の AC-04 / 印: 要判断

## 4. 進め方と実践の型の適用

根拠は `atc-index-sample` の「受入観点の立て方（共通）」と分配方針、および `atc-rulebook` の列定義と禁止事項である。構造・必須項目は rulebook を正とした。F001 は今の版の記述が `atc-index-sample` の分割基準と一致していたため、維持した。根拠が足りない箇所や推測で直す箇所はなく、見送った finding もない。相手側の食い違いと優先度の件は、改訂せず直す案として申し送った。
