---
specdojo:
  id: prj-0001:xer-t-kata-review-all-pm-orchestrator-playbook-sample-150-20261126t090913z-316917c7
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-pm-orchestrator-playbook-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-pm-orchestrator-playbook-sample-150/T-KATA-REVIEW-ALL-pm-orchestrator-playbook-sample-150-20261126T090913Z-316917c7/plan.md
  started_at: "2026-11-26T09:09:25.394Z"
  completed_at: "2026-11-26T09:18:03.052Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:pm-orchestrator-playbook-sample
    - specdojo:pm-orchestrator-playbook-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として `pm-orchestrator-playbook-sample` を、運用手順（運用変更）・テスト戦略・方針・template の各 sample と照合し、食い違いを sample 側で直した。
- 直したのはリリースの手順（ホスティング環境への版の更新と変更記録）、close の前の確かめ方（テストデータの扱い）、参照の説明、frontmatter（`based_on` を外して `supersedes` を追加）である。
- 用語集との表記の違いは相手側を直す案として findings に残し、sample は変えていない。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R5 | 8. リリースの手順（冒頭・手順 3〜5） | 「店頭のタブレットへの入れ替え」「配布物を作る」「前の版へ戻す」が、`opr-change-sample` の「本番のホスティング環境でアプリの版を更新し、変更記録で承認・適用・確認・ロールバックする」という手順と食い違っていた。 | 冒頭を「本番のホスティング環境への版の更新は、閉店後に運用手順（運用変更）に従って行う」に改めた。手順 3 の終わりを「変更記録を起票する」に、手順 4・5 を「適用の手順で版を更新し、変更記録が完了になったら close。ロールバックしたら close せず原因を直す項目を起票」の 1 手順にまとめた。 | [[specdojo:opr-change-sample]] の「手順適用範囲・前提」と「適用の手順」、[[specdojo:opr-index-sample]] の対象内（ホスティング環境）。 | - |
| 2 | R5 | 8. リリースの手順（旧手順 4・5） | 本番で `kinuya-test-data` を使って記録を試し、版の確認結果を `kinuya-acceptance-record` に残す、と書かれていた。テストデータは各テストの開始時に戻す架空データで、受入確認記録はケースごとの受入結果を残す記録のため、本番の版の更新の確認とは役割が合わない。 | 公開後の確認は、運用手順（運用変更）の完了条件（本番で販売・在庫・つけを各 1 件記録して取り消す）と変更記録に任せる。 | [[specdojo:tsp-index-sample]] のテストデータの記述、[[specdojo:atc-index-sample]] の `kinuya-acceptance-record` の定義、[[specdojo:opr-change-sample]] の変更種別と承認・実施条件の表。 | - |
| 3 | R5 | 5. close の前の確かめ方（1 項目目） | 「`kinuya-test-data` の 1 営業日分を流す」とあるが、テスト戦略・方針のテストデータの定義に 1 営業日分の区切りはない。 | 「検証用の環境で `kinuya-test-data` へ戻してから同じ販売・在庫・つけの記録を流し、つけ残高の合計が変更前の版と一致する」に直した。 | [[specdojo:tsp-index-sample]] の「商品A を基準とする架空の商品・顧客を `kinuya-test-data` として共通化し、各テストの開始時に同じ状態へ戻す」。 | - |
| 4 | R5 | 1. 目的と適用範囲（最後の段落） | 「記録先は [[specdojo:pm-plan-sample]] が定める」とあるが、プロジェクト管理計画には `kinuya-test-data` も `kinuya-release-notes` も、登録簿の項目 ID の記録先もない。 | その文を外し、「`kinuya-test-data` は [[specdojo:tsp-index-sample]] が定めるテストデータを指す」に替えた。 | [[specdojo:pm-plan-sample]] の情報ごとの正本の表、[[specdojo:tsp-index-sample]]。 | - |
| 5 | R5 | Frontmatter | `based_on` が rulebook の定める「決まりの直接の根拠になる決定（decision の個票）」ではなく pm-plan-sample を指していた。template の `frontmatter_template` にある `supersedes` もなかった（F008）。 | `based_on` を外して `supersedes: []` を加えた。 | rulebook の「推奨 Frontmatter 項目」、template の `frontmatter_template`。 | - |
| 6 | R5 | 本文全体の「登録簿の項目」「項目」（相手側は rulebook・template の「登録簿項目」） | 用語集（`gl-register.yaml`）の正式な語は「登録項目」だが、rulebook と template は「登録簿項目」、sample は「登録簿の項目」「項目」を使っている。kata の間と用語集で表記がそろっていない。 | 相手側を直す案: rulebook の本文要件・記述ガイドと、template の章名「登録簿項目の完了条件の書き方」を、用語集の「登録項目」に合わせるか決める。合わせる場合は sample の章名と本文も同時に直す。今回は rulebook と章名を揃える必要があるため、sample は変えていない。 | docs/ja/product/010-business-specs/060-glossary/gl-register.yaml の `term: 登録項目`、pm-orchestrator-playbook-rulebook の本文要件の表。 | 要判断 |
| 7 | R5 | 9. 店頭の端末との分担（営業時間） | 食い違いなし。営業時間 10:00〜18:00 と閉店後の作業は `opr-index-sample` と一致し、`--project kinuya` もほかの sample の project id と一致する。 | - | [[specdojo:opr-index-sample]] の時間帯の行。 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/pm-orchestrator-playbook-sample.md`: リリースの手順を、本番のホスティング環境への版の更新と変更記録に合わせて整理した。close の前の確かめ方は、`kinuya-test-data` の定義に合わせて直した。冒頭の参照の説明は、記録先の記述を外してテストデータの参照に替えた。Frontmatter は `based_on` を外して `supersedes: []` を加えた。

## 3. 申し送り

- No: 1 / 段: R5 / 箇所: 8. リリースの手順（冒頭・手順 3〜5） / 指摘: 「店頭のタブレットへの入れ替え」「配布物を作る」「前の版へ戻す」が、[[specdojo:opr-change-sample]] の「本番のホスティング環境でアプリの版を更新し、変更記録で承認・適用・確認・ロールバックする」という手順と食い違っていた / 直した案: 冒頭を「本番のホスティング環境への版の更新は、閉店後に運用手順（運用変更）に従って行う」に改めた。手順 3 の終わりを「変更記録を起票する」に、手順 4・5 を「適用の手順で版を更新し、変更記録が完了になったら close。ロールバックしたら close せず原因を直す項目を起票」の 1 手順にまとめた / 根拠: [[specdojo:opr-change-sample]] の「手順適用範囲・前提」（使用手段: 本番のホスティング環境）と「適用の手順」、[[specdojo:opr-index-sample]] の対象内（ホスティング環境） / 印: なし
- No: 2 / 段: R5 / 箇所: 8. リリースの手順（旧手順 4・5） / 指摘: 本番で `kinuya-test-data` を使って記録を試し、版の確認結果を `kinuya-acceptance-record` に残す、と書かれていた。テストデータは各テストの開始時に戻す架空データで、受入確認記録はケースごとの受入結果を残す記録のため、本番の版の更新の確認とは役割が合わない / 直した案: 公開後の確認は運用手順（運用変更）の完了条件（本番で販売・在庫・つけを各 1 件記録して取り消す）と変更記録に任せる / 根拠: [[specdojo:tsp-index-sample]] のテストデータの記述、[[specdojo:atc-index-sample]] の `kinuya-acceptance-record` の定義、[[specdojo:opr-change-sample]] の変更種別と承認・実施条件の表 / 印: なし
- No: 3 / 段: R5 / 箇所: 5. close の前の確かめ方（1 項目目） / 指摘: 「`kinuya-test-data` の 1 営業日分を流す」とあるが、テスト戦略・方針のテストデータの定義に 1 営業日分の区切りはない / 直した案: 「検証用の環境で `kinuya-test-data` へ戻してから同じ販売・在庫・つけの記録を流し、つけ残高の合計が変更前の版と一致する」に直した / 根拠: [[specdojo:tsp-index-sample]] の「商品A を基準とする架空の商品・顧客を `kinuya-test-data` として共通化し、各テストの開始時に同じ状態へ戻す」 / 印: なし
- No: 4 / 段: R5 / 箇所: 1. 目的と適用範囲（最後の段落） / 指摘: 「記録先は [[specdojo:pm-plan-sample]] が定める」とあるが、プロジェクト管理計画には `kinuya-test-data`・`kinuya-release-notes` も登録簿の項目 ID の記録先もない / 直した案: その文を外し、「`kinuya-test-data` は [[specdojo:tsp-index-sample]] が定めるテストデータを指す」に替えた / 根拠: [[specdojo:pm-plan-sample]] の情報ごとの正本の表、[[specdojo:tsp-index-sample]] / 印: なし
- No: 5 / 段: R5 / 箇所: Frontmatter / 指摘: `based_on` が rulebook の定める「決まりの直接の根拠になる決定（decision の個票）」ではなく pm-plan-sample を指し、template の `frontmatter_template` にある `supersedes` もなかった（F008） / 直した案: `based_on` を外して `supersedes: []` を加えた / 根拠: rulebook の「推奨 Frontmatter 項目」、template の `frontmatter_template` / 印: なし
- No: 6 / 段: R5 / 箇所: 本文全体の「登録簿の項目」「項目」（相手側: rulebook・template の「登録簿項目」） / 指摘: 用語集（gl-register.yaml）の正式な語は「登録項目」で、rulebook・template は「登録簿項目」、sample は「登録簿の項目」「項目」を使っている。kata の間と用語集で表記がそろっていない / 直した案（相手側）: rulebook の本文要件・記述ガイドと template の章名「登録簿項目の完了条件の書き方」を、用語集の「登録項目」へ合わせるか決める。合わせる場合は sample の章名と本文も同時に直す。今回は rulebook と章名を揃える必要があるため、sample は変えていない / 根拠: docs/ja/product/010-business-specs/060-glossary/gl-register.yaml の `term: 登録項目`、pm-orchestrator-playbook-rulebook の本文要件の表 / 印: 要判断
- No: 7 / 段: R5 / 箇所: 9. 店頭の端末との分担（営業時間） / 指摘: 食い違いなし。営業時間 10:00〜18:00 と閉店後の作業は [[specdojo:opr-index-sample]] と一致し、`--project kinuya` もほかの sample の project id と一致する / 直した案: なし（維持） / 根拠: [[specdojo:opr-index-sample]] の時間帯の行 / 印: なし
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/ の sample だけで、plan・result・個票を変更していない）

## 4. 進め方と実践の型の適用

根拠にした資料は、運用手順（運用変更）・テスト戦略・方針・受入テスト・プロジェクト管理計画の各 sample、rulebook、template、用語集である。sample と食い違う記述は sample 側を直し、rulebook の定めと食い違う Frontmatter は rulebook を正にして直した。用語集との表記の違いは相手側の判断が要るため、sample は維持し、案を findings に残した。営業時間と project id は食い違いがなかったので維持した。plan に展開された finding のうち、F008 は Frontmatter の修正で解消した。F001〜F007 と F009 は R5（整合）の観点に当たらないため、今回は扱っていない。
