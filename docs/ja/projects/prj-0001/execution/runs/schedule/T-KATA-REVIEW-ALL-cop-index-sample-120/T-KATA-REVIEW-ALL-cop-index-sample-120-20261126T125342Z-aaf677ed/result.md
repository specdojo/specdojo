---
specdojo:
  id: prj-0001:xer-t-kata-review-all-cop-index-sample-120-20261126t125342z-aaf677ed
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-cop-index-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-cop-index-sample-120/T-KATA-REVIEW-ALL-cop-index-sample-120-20261126T125342Z-aaf677ed/plan.md
  started_at: "2026-11-26T12:53:53.718Z"
  completed_at: "2026-11-26T13:03:29.341Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:cop-index-sample
    - specdojo:cop-index-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R2（構成）を `cop-index-sample` に対して実施した。章の順・見出し・各表の列は `cop-index-rulebook` の本文要件の 10 章と一致し、前提から結論の順に読める。
- grade の F002（実施条件の導入文と確認時期の不整合）を解消した。あわせて、ロールバック手順の順序を rulebook の記述ガイドに合わせて入れ替えた。
- grade の F001（GO4 の差異の判定基準）は `vp-qe-verifiability` の指摘で R4 の観点のため、この段では扱わず R4 に任せた。
- runner の検証では `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が成功した。executor の `prettier --check` も成功した。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R2-1 | R2 | 5. 実施条件（事前完了条件）の導入文と GO1 の行 | 導入文は条件を「前日の閉店時までに」満たすとしている。しかし各行の確認時期は 1 週間前から前日の T-13:00 まで分かれている。GO1 の行の「前日の閉店後」はタイムラインの T-13:00 と合わない（grade F002）。 | 導入文を「それぞれ表の『確認の時期』までに満たされている必要がある」にし、GO1 の行の確認の時期を「前日の T-13:00」にした。 | vp-qe-omissions-consistency | - |
| R2-2 | R2 | 7. ロールバック手順 | rulebook の記述ガイドは、業務を再開できたことを確かめる手順で終わることを求めている。しかし表は登録簿への転記（手順 4）で終わり、表の後の段落が完了条件を言い直していた。 | 手順 3（転記）と手順 4（ノートでの試し記録）を入れ替えた。表の後の段落を削り、「最後の手順の完了条件を満たしたとき、ロールバックを完了とする」を表の前の 1 文に加えた。 | vp-arc-document-structure、cop-index-rulebook の記述ガイド（ロールバック手順） | 要判断（迷った理由: 実務では試し記録で再開を確かめてから転記する順も自然。選ばなかった案: 順序を変えず末尾の段落だけ残す） |
| R2-3 | R2 | 5. 実施条件（事前完了条件）、6. 切替判定ポイント（GO/NO-GO） | GO1 が両方の表にあり、未達時の扱い（「延期。ノートで営業を続ける」と「延期。切替日を決め直し、ノートで営業を続ける」）がほぼ同じ内容で重なっている。 | - | vp-qe-omissions-consistency、vp-arc-conciseness | 要判断（迷った理由: rulebook は判定点を実施条件にも載せることを禁じておらず、前日の条件として実施条件に挙げる読み方にも理がある。選ばなかった案: 実施条件の行の扱いを「GO1 の失敗時の扱いに従う」にする案。後の章を前の章から参照する形になり、前提から結論の順を崩すため採らなかった） |
| R2-4 | R2 | 6. 切替判定ポイント（GO/NO-GO）の GO4 | GO4 の「理由の分からない差異がない」の判定基準が曖昧である（grade F001）。これは検証可能性の指摘で R4 の観点のため、この段では扱わない。 | - | vp-qe-verifiability（R4 に任せる） | - |
| R2-5 | R2 | 全体 | 章の順・見出し・各表の列は `cop-index-rulebook` の本文要件の 10 章と一致している。前提（概要の時刻の表し方）から結論（関連ドキュメント）の順に読める。構成上の指摘はない。 | - | vp-arc-document-structure | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/cop-index-sample.md`: 実施条件の導入文を「それぞれ表の『確認の時期』までに満たされている必要がある」に直し、GO1 の確認時期を「前日の T-13:00」に揃えた（F002）。ロールバック手順は手順 3（転記）と手順 4（ノートでの試し記録）を入れ替えた。表の後の段落を削り、「最後の手順の完了条件を満たしたとき、ロールバックを完了とする」を表の前の 1 文に加えた。

## 3. 申し送り

- R2-2 と R2-3 は「要判断」の印を付けた。人が採否を確認してほしい。
- `template` は rulebook で `undecided` のため、template との照合は行っていない。
- R2-1: R2 / 5. 実施条件（事前完了条件） / 導入文は条件を「前日の閉店時までに」満たすとしているが、各行の確認時期は 1 週間前から前日の T-13:00 まで分かれ、GO1 の行の「前日の閉店後」はタイムラインの T-13:00 と合わない（grade F002） / 導入文を「それぞれ表の『確認の時期』までに満たされている必要がある」にし、GO1 の行の確認の時期を「前日の T-13:00」にした / vp-qe-omissions-consistency / -
- R2-2: R2 / 7. ロールバック手順 / rulebook の記述ガイド（ロールバック手順）は、業務を再開できたことを確かめる手順で終わることを求めているが、表は登録簿への転記（手順 4）で終わり、表の後の段落が完了条件を言い直していた / 手順 3（転記）と手順 4（ノートでの試し記録）を入れ替え、表の後の段落を削って「最後の手順の完了条件を満たしたとき、ロールバックを完了とする」を表の前の 1 文に加えた / vp-arc-document-structure、cop-index-rulebook の記述ガイド（ロールバック手順） / 要判断（迷った理由: 実務では試し記録で再開を確かめてから転記する順も自然。選ばなかった案: 順序を変えず末尾の段落だけ残す）
- R2-3: R2 / 5. 実施条件（事前完了条件）、6. 切替判定ポイント（GO/NO-GO） / GO1 が両方の表にあり、未達時の扱い（「延期。ノートで営業を続ける」と「延期。切替日を決め直し、ノートで営業を続ける」）がほぼ同じ内容で重なっている / - / vp-qe-omissions-consistency、vp-arc-conciseness / 要判断（迷った理由: rulebook は判定点を実施条件にも載せることを禁じておらず、前日の条件として実施条件に挙げる読み方にも理がある。選ばなかった案: 実施条件の行の扱いを「GO1 の失敗時の扱いに従う」にする案。後の章を前の章から参照する形になり、前提から結論の順を崩すため採らなかった）
- R2-4: R2 / 6. 切替判定ポイント（GO/NO-GO） / grade F001（GO4 の「理由の分からない差異」の判定基準が曖昧）は vp-qe-verifiability の指摘で R4 の観点のため、この段では扱わない / - / vp-qe-verifiability（R4 に任せる） / -
- R2-5: R2 / 全体 / 章の順・見出し・各表の列は cop-index-rulebook の本文要件の 10 章と一致し、前提（概要の時刻の表し方）から結論（関連ドキュメント）の順に読める。template は rulebook で template: undecided のため照合していない / - / vp-arc-document-structure / -
- 適用外の検証: `npm run validate:history-links`（変更したのは sample だけで、plan・result・個票を変更していないため）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルに `*.yaml` / `*.yml` がないため）

## 4. 進め方と実践の型の適用

根拠は `cop-index-rulebook` の本文要件と記述ガイド（ロールバック手順）、および grade の finding F001・F002。構成の不整合は rulebook を正として直した。章の順・粒度・表の列は rulebook と整合していたため維持した。F001 は観点が R4 のため見送り、次のアクションは R4 での差異の許容基準の明示とした。
