---
specdojo:
  id: prj-0001:xer-t-kata-review-all-imp-operations-sample-120-20261125t211747z-0f3fe12e
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-imp-operations-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-imp-operations-sample-120/T-KATA-REVIEW-ALL-imp-operations-sample-120-20261125T211747Z-0f3fe12e/plan.md
  started_at: "2026-11-25T21:17:58.470Z"
  completed_at: "2026-11-25T21:25:55.102Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:imp-operations-sample
    - specdojo:imp-operations-sample
---

# Edit Result

## 1. 実施内容

- R2（構成）のレビューを行った。章の順・粒度・表と本文の配置に、sample 側で直すべき構成上の問題は見つからなかったため、sample は変更していない。
- grade の F001（成功条件 2 の上限時間が未決）は `vp-qe-verifiability` の観点で R4（正しさ）に割り当てられているため、R2 では扱わず R4 に任せた。
- grade の F002（対応方針の表の「完了条件」列）は、sample を変えず、rulebook の必須列に「完了条件」を足す案を「要判断」として findings に示した。rulebook の変更は人が判断する。
- 親 runner の検査では、変更ファイルがないため `lint:md:changed` と `lint:fm:changed` は対象なしで通過した。`lint:mermaid`、`lint:d2`、`validate:schema` も通過した。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R2 | `docs/ja/specdojo/samples/imp-operations-sample.md` 対応方針の表（line 69）の「完了条件」列（grade F002） | rulebook の本文要件が決める対応方針の表の必須列（影響度、対応項目、期限、担当、前提条件）に「完了条件」がない。sample が rulebook より先に列を足している。 | sample は変えない。`docs/ja/specdojo/rulebooks/imp-operations-rulebook.md` の本文要件の必須列の表で、対応方針の行に「完了条件」を足す。あわせて 5 章の目的を「対応項目ごとの期限・担当・前提条件と完了条件を示す」に変え、記述ガイドの対応方針に「完了条件は確かめられる状態で書く」を足す。rulebook の変更は人が判断する。 | rulebook は「列名はこのとおりに揃える」と決めているが、列を足すことは禁止事項にない。この列は各対応項目の完了を確かめる唯一の基準で、外すと完成例として後退する。観点は `vp-qe-kata-conformance` と `vp-qe-omissions-consistency`。 | 要判断 |
| 2 | R2 | 対応方針の表の「低」の行（問い合わせ一次対応の見送りの再評価）と、表の後の再評価条件の箇条書き | 見送りの再評価が表の行と箇条書きの 2 か所に出てくる。代替（日次締め運用）の再評価は箇条書きだけに出てくる。2 か所を合わせて読むことはできるが、表と本文の分担がそろっていない。 | 今の配置のままとする。直す場合は R3（読みやすさ、`vp-arc-conciseness`）で、表の行の完了条件を「再評価条件の判断の記録」に絞るかを判断する。 | rulebook の対応方針の記述ガイドは、見送り・代替に再評価条件と期限を書くことを求めるが、置く場所は決めていない。 | - |
| 3 | R2 | 成功条件の表の 2 行目（line 24、grade F001、観点 `vp-qe-verifiability`） | R4（正しさ）の観点なので R2 では扱わない。 | R4 で、暫定の判定基準（その日の閉店までに把握する）を成功条件の判定方法にも書くかを判断する。 | kata-guide の観点の組で、`vp-qe-verifiability` は R4 に割り当てられている。 | - |

## 2. 変更ファイル

- なし

## 3. 申し送り

- No: 1 / 段: R2 / 箇所: `docs/ja/specdojo/samples/imp-operations-sample.md` 対応方針の表（line 69）の「完了条件」列（grade F002） / 指摘: rulebook の本文要件が決める対応方針の表の必須列（影響度、対応項目、期限、担当、前提条件）に「完了条件」がなく、sample が rulebook より先に列を足している / 直した案: sample は変えない。`docs/ja/specdojo/rulebooks/imp-operations-rulebook.md` の本文要件の必須列の表で、対応方針の行に「完了条件」を足し、5 章の目的を「対応項目ごとの期限・担当・前提条件と完了条件を示す」に、記述ガイドの対応方針に「完了条件は確かめられる状態で書く」を足す（rulebook の変更は人が判断する） / 根拠: rulebook は「列名はこのとおりに揃える」と決めているが、列を足すことは禁止事項にない。この列は各対応項目の完了を確かめる唯一の基準で、外すと完成例として後退する。観点は `vp-qe-kata-conformance`・`vp-qe-omissions-consistency` / 印: 要判断
- No: 2 / 段: R2 / 箇所: 対応方針の表の「低」の行（問い合わせ一次対応の見送りの再評価）と、表の後の再評価条件の箇条書き / 指摘: 見送りの再評価が表の行と箇条書きの 2 か所に出てくる。代替（日次締め運用）の再評価は箇条書きだけに出てくる。2 か所を合わせて読むことはできるが、表と本文の分担がそろっていない / 直した案: 今の配置のままとする。直す場合は R3（読みやすさ、`vp-arc-conciseness`）で、表の行の完了条件を「再評価条件の判断の記録」に絞るかを判断する / 根拠: rulebook の対応方針の記述ガイドは、見送り・代替に再評価条件と期限を書くことを求めるが、置く場所は決めていない / 印: なし
- No: 3 / 段: R2 / 箇所: 成功条件の表の 2 行目（line 24、grade F001、観点 `vp-qe-verifiability`） / 指摘: R4（正しさ）の観点なので R2 では扱わない / 直した案: R4 で、暫定の判定基準（その日の閉店までに把握する）を成功条件の判定方法にも書くかを判断する / 根拠: kata-guide の観点の組で、`vp-qe-verifiability` は R4 に割り当てられている / 印: なし
- 適用外の検証（runner の判定）: `npm run lint:md`（変更に Markdown ファイル（`*.md`） がない）

## 4. 進め方と実践の型の適用

参照の向きを「成果物 → sample」にして、`docs/ja/specdojo/samples/imp-operations-sample.md` を R2（構成）の観点で見直した。R1 の指摘は繰り返していない。構成面の根拠は rulebook の本文要件と、kata-guide の「kata を agent でレビューする」の段の割り当てである。章の順・粒度・表と本文の配置は維持した。F002 は rulebook を正として照合し、sample が rulebook に先行している状態と判断した。rulebook は sample 以外に当たるため変更せず、直す案を findings に記録した。F001 は `vp-qe-verifiability` が R4 の担当なので見送り、R4 で扱う。
