---
specdojo:
  id: prj-0001:xer-pjr-bxym-20261128t032317z-9247536b
  type: exec-result
  task_id: PJR-BXYM
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-BXYM/pjr-bxym-20261128T032317Z-9247536b/plan.md
  started_at: "2026-11-28T03:23:22.783Z"
  completed_at: "2026-11-28T03:27:38.193Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- 3回目の修正を日英のガイドに入れた。復元の節の bash の起票例を chat の依頼の例に置き換え、確認状態の目印を agent が付けて人が確かめて外させる書き方に直し、ガイド全体で人が自分で書く・起票するように読める文を直した。決めたことと理由は個票の「3 回目の実行」の小節に書いた。

## 2. 変更ファイル

- `docs/en/specdojo/guides/civic-tech-starter-guide.md`: 変更、+26 / -19 行
- `docs/ja/specdojo/guides/civic-tech-starter-guide.md`: 変更、+25 / -20 行

## 3. 申し送り

- 3回目の実行で直した点: 日英の「既存のシステムから始める場合（復元）」の `register add` の bash の例を chat の依頼の例に置き換えた。プログラムの場所を伝えると、オーケストレーターが `retrofit` の todo を提案し、機能一覧も含めるなら epic と子の todo 2 つに分け、承認を得てから起票して `exec run` で実行する。コマンドはオーケストレーターが使うものとして CLI コマンドリファレンスを参照させるだけにした。
- 3回目の実行で直した点: 日英の「確認状態の目印を使う」を、agent が目印を付け、人が確かめて結果をオーケストレーターに伝えて外させる書き方に直した（表の列名を「agent が付ける場面」「外させるとき」に変更、例は agent が書いた文書での見え方として残した）。
- 3回目の実行で直した点: ガイド全体を見直し、理解の負債の 4 段の表（確認状態・記録）、「後で足す型の目安」と「全部の型を求めない」の起票の記述、冒頭の「型に沿って書いておけば」を、agent に作らせ、オーケストレーターに頼む流れに直した。
- 判断: 復元の chat の例では、成果物の置き場所（`--target-path`）や rulebook の指定は出さず、プログラムの場所と完了条件の要点だけを示した。非エンジニアの読み手に要るのは頼み方で、置き場所などはオーケストレーターが成果物カタログとコマンドリファレンスから決めるため。例に出す項目の ID（PJR-JK12 など）は、新しく作る場合の例と重ならないものにした。
- 次のアクション: 英語版の `translated_from.commit` は完了条件のとおり `a9ab7fd` のまま。統合の後に、オーケストレーターが今回の commit に合わせる。
- CHANGELOG に書く事項: 2回目（個票 5.4）の行の文案のまま、区分は Added。3回目の直しで変える点はない。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
