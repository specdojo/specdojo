---
specdojo:
  id: prj-0001:xer-t-kata-review-all-bds-sample-150-20261126t070320z-6490a1d0
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-bds-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-bds-sample-150/T-KATA-REVIEW-ALL-bds-sample-150-20261126T070320Z-6490a1d0/plan.md
  started_at: "2026-11-26T07:03:30.694Z"
  completed_at: "2026-11-26T07:08:55.668Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:bds-sample
    - specdojo:bds-sample
---

# Edit Result

## 1. 実施内容

- kata レビュー段 R5（整合）として、`bds-sample` を関連 sample（`bes-sample`、`bes-index-sample`、`bdd-sample`、`cdsd-sample`）と照合し、用語の食い違い2件を `bds-sample` 側で修正した。
- 相手側を直すべき点1件と、判断が必要な2件は、変更せず案を handoff と findings に残した。
- plan に展開された F001（`vp-pm-control-reporting`）は、kata のレビューに使わない観点のため本段では扱っていない。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | 7. 集計・算出ルール（期間への割り当て） | 「会計確定日時」が、`bes-sample` と `bes-index-sample` の用語「会計確定時点」と食い違っている。 | 「販売記録の会計確定時点を日本時間で判定する」に改めた。 | vp-qe-kata-conformance（`bes-sample` の「いつ」と「事実データ」、`bes-index-sample` の事実データ列） | - |
| R5-2 | R5 | 7. 集計・算出ルール（販売数） | 「販売明細」が、`bdd-sample` と `cdsd-sample` の用語「売上明細」と食い違っている。 | 「売上明細の数量を商品ごとに合計し」に改めた。 | vp-qe-kata-conformance（`bdd-sample` の売上記録・売上明細、`cdsd-sample` の販売記録の主な内容） | - |
| R5-3 | R5 | 5. 対象範囲と元にする記録（欠品の記録）、9. メモ / 将来課題（根拠の業務イベント） | 欠品の記録 `bes-stock-out-recorded` が、`bes-index-sample` の業務イベント一覧にない。 | -（相手側の案: `bes-index-sample` に「店番担当が欠品を記録した」行を足す。起点領域は店番、事実データは商品・記録日・記録担当とする。足さない場合は未決事項に未作成として載せる） | vp-dev-change-impact | - |
| R5-4 | R5 | 9. メモ / 将来課題（補充候補の基準） | 未決の補充候補の基準に、`cdsd-sample` の商品台帳の「補充基準」と `bdd-sample` の「発注点」とのつながりが書かれていない。補充候補は欠品の印で仕入れ数量を出さないという本書の方針と、発注点による判定のどちらを基準とするかは PO の判断事項である。 | -（選ばなかった案: 未決事項に「商品台帳の補充基準（発注点）との関係も決める」と書き足す） | vp-qe-kata-conformance | 要判断 |
| R5-5 | R5 | 9. メモ / 将来課題（欠品削減の測定） | 本書は月次報告が本報告を元にするとしている。一方、`cdsd-sample` は月次報告の根拠を日次締め記録と隣接台帳としており、本報告を含めていない。どちらを直すかは月次報告の設計判断になる。 | -（案A: `cdsd-sample` の月次報告の正本区分に週次販売・欠品報告を足す。案B: 本書の記述を「月次報告は欠品の記録から集計する」に改める） | vp-dev-change-impact | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/bds-sample.md`: 「7. 集計・算出ルール」の用語を関連 sample に合わせて2か所直した。「会計確定日時」を「会計確定時点」に、「販売明細」を「売上明細」に改めた（2行の置換）。

## 3. 申し送り

- `bds-sample` の修正は用語2件に限った。R5-3、R5-4、R5-5 は相手側の設計判断を伴うため、sample は変更していない。
- R5-1: 段 R5 / 箇所 7. 集計・算出ルール（期間への割り当て） / 指摘: 「会計確定日時」が bes-sample・bes-index-sample の用語「会計確定時点」と食い違う / 直した案: 「販売記録の会計確定時点を日本時間で判定する」に改めた / 根拠: vp-qe-kata-conformance（bes-sample「いつ」「事実データ」、bes-index-sample の事実データ列） / 印: -
- R5-2: 段 R5 / 箇所 7. 集計・算出ルール（販売数） / 指摘: 「販売明細」が bdd-sample・cdsd-sample の用語「売上明細」と食い違う / 直した案: 「売上明細の数量を商品ごとに合計し」に改めた / 根拠: vp-qe-kata-conformance（bdd-sample の売上記録・売上明細、cdsd-sample の販売記録の主な内容） / 印: -
- R5-3: 段 R5 / 箇所 5. 対象範囲と元にする記録（欠品の記録）、9. メモ / 将来課題（根拠の業務イベント） / 指摘: 欠品の記録 `bes-stock-out-recorded` が bes-index-sample の業務イベント一覧にない / 直した案: - / 根拠: vp-dev-change-impact。相手側の bes-index-sample に「店番担当が欠品を記録した」行（起点領域、事実データ: 商品、記録日、記録担当）を足すか、未決事項に未作成として載せる案 / 印: -
- R5-4: 段 R5 / 箇所 9. メモ / 将来課題（補充候補の基準） / 指摘: 未決の補充候補の基準に、cdsd-sample の商品台帳の「補充基準」と bdd-sample の「発注点」とのつながりが書かれていない / 直した案: - / 根拠: vp-qe-kata-conformance。迷った理由: 補充候補は欠品の印で、仕入れ数量を出さないという本書の方針と、発注点による判定のどちらを基準とするかは PO の判断事項のため。選ばなかった案: 未決事項に「商品台帳の補充基準（発注点）との関係も決める」と書き足す / 印: 要判断
- R5-5: 段 R5 / 箇所 9. メモ / 将来課題（欠品削減の測定） / 指摘: 本書は月次報告が本報告を元にするとしているが、cdsd-sample は月次報告の根拠を日次締め記録と隣接台帳としており、本報告を含めていない / 直した案: - / 根拠: vp-dev-change-impact。迷った理由: どちらを直すかは月次報告の設計判断になるため。案A: cdsd-sample の月次報告の正本区分に週次販売・欠品報告を足す。案B: 本書の記述を「月次報告は欠品の記録から集計する」に改める / 印: 要判断
- F001（vp-pm-control-reporting）: kata-guide で kata のレビューに使わない観点（計画・依存・報告は個々の成果物で問う）に当たるため、本段では扱わない。なお該当行には担当 BA と `pm-issue-log` の課題での追跡がすでに書かれている。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/bds-sample.md のみで、plan・result・個票を変更していないため）
- 適用外の検証: `npm run validate:schema:file`（変更ファイルに `*.yaml` / `*.yml` がないため）

## 4. 進め方と実践の型の適用

kata-guide の R5 の観点に従い、同じ接頭辞の関連 sample と参照先を照合した。食い違いのうち `bds-sample` の側を直せるものは用語を揃えて修正した。相手側を直すべきもの、または設計判断が要るものは変更せず、直す案を findings に記録した。F001 は kata のレビューで使わない観点に当たるため扱わず、該当行には担当 BA と `pm-issue-log` での追跡がすでにある。executor の `prettier --check` と runner の lint・schema 検査は通過している。
