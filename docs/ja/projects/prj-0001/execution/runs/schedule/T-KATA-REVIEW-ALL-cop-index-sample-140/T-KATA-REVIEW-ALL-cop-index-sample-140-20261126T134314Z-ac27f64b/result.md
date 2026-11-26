---
specdojo:
  id: prj-0001:xer-t-kata-review-all-cop-index-sample-140-20261126t134314z-ac27f64b
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-cop-index-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-cop-index-sample-140/T-KATA-REVIEW-ALL-cop-index-sample-140-20261126T134314Z-ac27f64b/plan.md
  started_at: "2026-11-26T13:43:25.768Z"
  completed_at: "2026-11-26T13:50:57.495Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:cop-index-sample
    - specdojo:cop-index-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R4（正しさ）を行った。sample の主張を schema・rulebook・関連 sample と突き合わせ、誤りは見つからなかった。F001（GO4 の判定基準の曖昧さ）は、基準を数値と状態で示す形に直した。
- F002（導入文と GO1 の確認時期の食い違い）は、前の段の直しで解消済みだったため、追加の変更はしていない。
- 確かめられなかった主張は T+0:10〜T+2:30 の所要時間だけである。`mtp-index` のリハーサル結果が sample になく、本文でも `_ASSUMPTION_` と明記されているため、確かめの対象外とした。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R4-1 | R4 | 当日タイムライン、切替判定ポイント（GO/NO-GO） | GO4 の条件「理由の分からない差異がない」は、判定者によって解釈が分かれる（F001）。 | T+7日の行と GO4 の行を「売上額とつけ残高合計の差異が 0 円か、差異の理由が日次締めの差異欄にある」に直した。基準は `otp-index-sample` の日次締めの差異（1 円以上は理由を記録する）に合わせた。 | `vp-qe-verifiability` | - |
| R4-2 | R4 | 実施条件（事前完了条件） | 導入文と GO1 の確認時期の食い違い（F002）は、前の段の直しで「それぞれ表の『確認の時期』までに」「前日の T-13:00」となり解消済みだった。 | - | `vp-qe-omissions-consistency` | - |
| R4-3 | R4 | 切替判定ポイント（GO/NO-GO） | 正本の `mip-index-sample` の GO4 は「理由の分からない差異が残っていない」のままで、cop 側の新しい基準より曖昧である。 | 対象外の kata のため直していない。R5 または `mip-index-sample` の見直しで、T+7日の行の完了条件を同じ基準にそろえる案がある。 | `vp-qe-omissions-consistency` | 要判断。cop を mip に合わせて戻すと F001 が未解消に戻るため、その案は選ばなかった。 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/cop-index-sample.md`: GO4 の条件「理由の分からない差異がない」を、当日タイムラインの T+7日の行と切替判定ポイントの GO4 の行の両方で、「売上額とつけ残高合計の差異が 0 円か、差異の理由が日次締めの差異欄にある」に直した。基準は `otp-index-sample` の日次締めの差異の扱いに合わせた。表は prettier で整形した。

## 3. 申し送り

- R4 の確かめの表と指摘は、executor の handoff に記載のとおりである。
- `validate:history-links` は履歴ファイルを変更していないため非適用とした。runner の検査は、適用されるものがすべて通過した。
- R4-1: R4 / 当日タイムライン、切替判定ポイント（GO/NO-GO） / GO4 の条件「理由の分からない差異がない」は判定者によって解釈が分かれる（F001） / T+7日の行と GO4 の行を「売上額とつけ残高合計の差異が 0 円か、差異の理由が日次締めの差異欄にある」に直した / `vp-qe-verifiability`。基準は `otp-index-sample` の日次締めの差異（1 円以上は理由を日次締め記録へ書く）に合わせた / -
- R4-2: R4 / 実施条件（事前完了条件） / 導入文と GO1 の確認時期の食い違い（F002）は、前の段の直しで「それぞれ表の『確認の時期』までに」「前日の T-13:00」となり解消済み / - / `vp-qe-omissions-consistency` / -
- R4-3: R4 / 切替判定ポイント（GO/NO-GO） / 正本の `mip-index-sample` の GO4 は、まだ「理由の分からない差異が残っていない」のままで、cop 側の新しい基準より曖昧 / -（対象外の kata のため直さない） / R5 または `mip-index-sample` の見直しで、T+7日の行の完了条件を同じ基準にそろえる案 / 要判断（cop を mip に合わせて戻す案は、F001 が未解消に戻るため選ばなかった）
- 確かめの表 1: 主張 frontmatter の `type: operations` と `rulebook: specdojo:cop-index-rulebook` / 正本 `docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml`、`docs/ja/specdojo/rulebooks/cop-index-rulebook.md` / 確かめ方 grep と読み取り / 結果 一致 / 根拠 schema の 17 行目が `operations`、rulebook の推奨 Frontmatter 項目の章
- 確かめの表 2: 主張 本文の 10 章の順と各表の列 / 正本 `cop-index-rulebook.md` の本文要件 / 確かめ方 読み取りで照合 / 結果 一致 / 根拠 章名と列名が rulebook の表と同じ
- 確かめの表 3: 主張 参照する ID（`mip-index`、`dmd-index`、`mtp-index`、`otp-index`、`pm-decision-log`、`pm-issue-log`） / 正本 `docs/ja/specdojo/templates/dct-migration-planning-template.yaml`、`dct-project-management-template.yaml` / 確かめ方 grep / 結果 一致 / 根拠 各 `local_id` の宣言がある
- 確かめの表 4: 主張 `dmd-index` の洗い替えで取り込み直す / 正本 `docs/ja/specdojo/samples/dmd-index-sample.md` / 確かめ方 grep / 結果 一致 / 根拠 20 行目の冪等性（洗い替え）
- 確かめの表 5: 主張 GO1〜GO3 の条件と失敗時の扱い / 正本 `docs/ja/specdojo/samples/mip-index-sample.md` のカットオーバー概要 / 確かめ方 grep と照合 / 結果 一致（cop は時刻を細かくしている） / 根拠 116〜118 行目
- 確かめの表 6: 主張 T+0:10〜T+2:30 の所要時間 / 正本 `mtp-index` / 確かめ方 - / 結果 確かめられない / 根拠 sample に `mtp-index` の結果がなく、本文でも `_ASSUMPTION_` と明記している。確かめるには `mtp-index` のリハーサルの結果が要る
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/ の sample だけで、plan・result・個票を変更していない）

## 4. 進め方と実践の型の適用

根拠として `cop-index-rulebook.md`、`deliverable-frontmatter.schema.yaml`、`dct-migration-planning-template.yaml`、`dct-project-management-template.yaml`、`dmd-index-sample.md`、`mip-index-sample.md`、`otp-index-sample` を照合した。F001 は判定根拠 `vp-qe-verifiability` に沿って、判定者によらず同じ結論になる数値と状態の基準に直した。F002 は `vp-qe-omissions-consistency` の観点で再確認し、導入文が表の「確認の時期」に従う形になっていて、GO1 は前日の T-13:00 と整合していたため維持した。正本の `mip-index-sample` の GO4 はまだ曖昧な表現のままで、この対象外の kata は直していない。
