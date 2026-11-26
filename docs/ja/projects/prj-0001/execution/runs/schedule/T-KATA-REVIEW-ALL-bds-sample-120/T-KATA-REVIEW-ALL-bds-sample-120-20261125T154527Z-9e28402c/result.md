---
specdojo:
  id: prj-0001:xer-t-kata-review-all-bds-sample-120-20261125t154527z-9e28402c
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-bds-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-bds-sample-120/T-KATA-REVIEW-ALL-bds-sample-120-20261125T154527Z-9e28402c/plan.md
  started_at: "2026-11-25T15:45:38.342Z"
  completed_at: "2026-11-25T15:52:14.686Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:bds-sample
    - specdojo:bds-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R2（構成）として `docs/ja/specdojo/samples/bds-sample.md` を見直した。章の順・粒度・表と本文の配置を bds-rulebook の本文要件に照らして確かめ、1 件を直した。
- 直した内容は、休業日と締め未確定の分け方の置き場所である。この分け方は「対象範囲と元にする記録」の表のセルにあり、「集計・算出ルール」の営業日の定義と分かれていた。これを「集計・算出ルール」の営業日へまとめた。分けた結果は変わらない。
- 「本書の変更」の行の置き場所は、直さず要判断として残した。F001 は R1 で解消済みで、R2 の観点でもないため扱わなかった。
- rulebook など sample 以外は変更していない。変更ファイルは sample 1 件だけである。
- 検証では、整形と markdownlint が通り、runner の `lint:md:changed`・`lint:fm:changed`・`lint:mermaid`・`lint:d2`・`test:docs`・`validate:schema` が成功した。そのほかの検査は変更種別により対象外である。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R2-1 | R2 | 5. 対象範囲と元にする記録、7. 集計・算出ルール | 休業日・締め未確定の分け方が「対象範囲と元にする記録」の表の日次締め記録の行（欠けるときの扱い）に書かれ、「集計・算出ルール」の営業日の定義と分かれていた。表のセルが算出ルールを持ち、表と本文の分担が rulebook の章の目的に合わない。 | 分け方を「集計・算出ルール」の営業日へまとめた。確定した版のない日のうち、締め記録・締め案・販売記録のどれもない日は休業日、それ以外は締め未確定とし、どちらも数えない。表のセルは「確定した版のない日は「集計・算出ルール」の営業日に従う」に変えた。分けた結果は前と同じで、「例外と注意事項」の全休の週・締め未確定の行とも合う。 | `vp-arc-document-structure`、bds-rulebook の本文要件（集計・算出ルールは期間への割り当てと算出を、対象範囲と元にする記録は記録ごとの用途・正本・欠けるときの扱いを持つ） | - |
| R2-2 | R2 | 9. メモ / 将来課題 | 「本書の変更」の行は、表示項目・算出ルール・契機を変えたときの影響と照合の手順で、rulebook がこの章に求める未作成の参照先・未確認の動作・未決事項のどれにも当たらない。 | - | `vp-arc-document-structure`。rulebook の本文要件に、変えたときの影響を置く章がない。行を消すと変えたときの影響（`vp-dev-change-impact`、R5 の観点）の記述がなくなる。「出力の時期と契機」の再出力の項目へ移す案は、本書を変えたときの影響が出力の契機の話ではないため採らなかった。変えたときの影響をどの章に置くかを決める案は rulebook 側に残す。 | 要判断 |
| F001 | R2 | 9. メモ / 将来課題 の「根拠の業務イベント」の行（grade、`vp-pm-control-reporting`、line=89） | 引継ぎの担当と転送先が示されていない。 | - | R1 の段（`T-KATA-REVIEW-ALL-bds-sample-110`）で「BA が `pm-issue-log` の課題で作成を追う」が足され、すでに解消している。`vp-pm-control-reporting` は kata-guide の「kata の観点の組」で kata の段のレビューに使わない観点とされ、R2 の観点でもないため、R2 では扱わない。 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/bds-sample.md`: 休業日と締め未確定の分け方を、「対象範囲と元にする記録」の日次締め記録の行から「集計・算出ルール」の営業日の定義へ移した。表のセルは「確定した版のない日は「集計・算出ルール」の営業日に従う」に変えた。表と本文の分担を rulebook の章の目的に合わせた変更で、8 行追加・8 行削除である。

## 3. 申し送り

- R2-2 の「本書の変更」の行は、bds-rulebook の本文要件に、変えたときの影響を置く章がない。そのため sample は変えていない。置き場所は rulebook 側で決める必要がある。
- R2-1: 段 R2 / 箇所 5. 対象範囲と元にする記録、7. 集計・算出ルール / 指摘: 休業日・締め未確定の分け方が「対象範囲と元にする記録」の表の日次締め記録の行（欠けるときの扱い）に書かれ、「集計・算出ルール」の営業日の定義と分かれていた。表のセルが算出ルールを持ち、表と本文の分担が rulebook の章の目的に合わない / 直した案: 分け方を「集計・算出ルール」の営業日へまとめた（確定した版のない日のうち、締め記録・締め案・販売記録のどれもない日は休業日、それ以外は締め未確定とし、どちらも数えない）。表のセルは「確定した版のない日は「集計・算出ルール」の営業日に従う」に変えた。分けた結果は前と同じで、「例外と注意事項」の全休の週・締め未確定の行とも合う / 根拠: `vp-arc-document-structure`、bds-rulebook の本文要件（集計・算出ルールは期間への割り当てと算出を、対象範囲と元にする記録は記録ごとの用途・正本・欠けるときの扱いを持つ） / 印: -
- R2-2: 段 R2 / 箇所 9. メモ / 将来課題 / 指摘: 「本書の変更」の行は、表示項目・算出ルール・契機を変えたときの影響と照合の手順で、rulebook がこの章に求める未作成の参照先・未確認の動作・未決事項のどれにも当たらない / 直した案: - / 根拠: `vp-arc-document-structure`。迷った理由: rulebook の本文要件に、変えたときの影響を置く章がない。行を消すと変えたときの影響（`vp-dev-change-impact`、R5 の観点）の記述がなくなる。選ばなかった案は「出力の時期と契機」の再出力の項目へ移す案で、本書を変えたときの影響は出力の契機の話ではないため採らなかった。bds-rulebook の本文要件で、変えたときの影響をどの章に置くかを決める案を相手側（rulebook）に残す / 印: 要判断
- F001（grade、`vp-pm-control-reporting`、line=89）: 段 R2 / 箇所 9. メモ / 将来課題 の「根拠の業務イベント」の行 / 指摘: 引継ぎの担当と転送先が示されていない / 直した案: - / 根拠: R1 の段（`T-KATA-REVIEW-ALL-bds-sample-110`）で「BA が `pm-issue-log` の課題で作成を追う」が足され、すでに解消している。`vp-pm-control-reporting` は kata-guide の「kata の観点の組」で kata の段のレビューに使わない観点とされ、R2 の観点でもないため、R2 では扱わない / 印: -
- 適用外の検証: `npm run validate:history-links`（変えたのは docs/ja/specdojo/samples/bds-sample.md だけで、plan・result・個票などの履歴の蓄積ファイルは変えていない）
- 適用外の検証: `npm run validate:schema:file`（変えたファイルに `*.yaml` / `*.yml` がない）
- 適用外の検証: `specdojo catalog validate`（変えたのは docs/ja/specdojo/samples/ 配下だけで、docs/ja/projects/ の成果物を変えていない）

## 4. 進め方と実践の型の適用

根拠とした規範は、bds-rulebook の本文要件、`vp-arc-document-structure`、kata-guide の「kata を agent でレビューする」である。R1 が直した版を読み、R1 の指摘は繰り返していない。営業日の分け方は表から本文へ移したが、分けた結果と「例外と注意事項」の記述は変えず、整合を保った。F001 は `vp-pm-control-reporting` の指摘である。この観点は kata の段のレビューに使わず、R1 で「BA が `pm-issue-log` の課題で作成を追う」が足されて解消済みのため、R2 では扱わなかった。「本書の変更」の行は、行を消すと変えたときの影響の記述が失われ、再出力の項目へ移す案は出力の契機の話と合わないため、直さず要判断とした。
