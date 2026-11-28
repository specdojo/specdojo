---
specdojo:
  id: prj-0001:xer-t-kata-review-all-mtp-sample-150-20261126t081153z-54f60a1f
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-mtp-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-mtp-sample-150/T-KATA-REVIEW-ALL-mtp-sample-150-20261126T081153Z-54f60a1f/plan.md
  started_at: "2026-11-26T08:12:03.919Z"
  completed_at: "2026-11-26T08:21:05.940Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:mtp-sample
    - specdojo:mtp-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として `docs/ja/specdojo/samples/mtp-sample.md` を、同系列の sample（`mip-index-sample`・`dmd-index-sample`・`dmd-sample`・`cop-index-sample`）および共通サンプル文脈に照らして見直し、食い違いを sample 側で修正した。
- F001 は `based_on` への `specdojo:dmd-sample` 追加で解消した。F002 と F003 は executor が前の段で解消済みとしている。
- 所要時間の基準は `cop-index-sample` の動作確認の締め切り（T+2:30）に合わせて 150 分とした。スケジュールは切替日の 1 週間前までの確定に合わせて前倒しした。判定者は `dmd-index-sample` と `mip-index-sample` の分担にそろえた。
- 検証は、`npx prettier --check` と、runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が通った。変更種別により対象外となった検査は `not_applicable` になっている。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | Frontmatter / 本文と関連ドキュメント | 本文と関連ドキュメントで依拠している `specdojo:dmd-sample` が `based_on` にない（F001）。 | `based_on` に `specdojo:dmd-sample` を追加した。 | vp-dev-change-impact、mtp-rulebook の Frontmatter 規約（移行判断に直接使った成果物を挙げる） | - |
| R5-2 | R5 | 合否基準 | 所要時間の基準 180 分（9:00〜正午）は、`cop-index-sample` の動作確認の締め切り T+2:30 と開店準備 T+2:50 に合わない。時間内でも開店準備の時間がなくなる。 | 基準を 150 分以内にした。未決事項は「9:00 開始から動作確認の締め切り（T+2:30）までの 150 分」と「決まった時刻から 11:30 までの分数に直す」にした。 | vp-qe-kata-conformance（`cop-index-sample` の当日タイムラインと判定点） | - |
| R5-3 | R5 | リハーサル回数とスケジュール・差異発生時の扱い・GO/NO-GO判断プロセス | 第 2 回を切替日の 3 日前に置き、結果を見てから切替日を確定する形だった。これでは `cop-index-sample` の前提条件（リハーサルの結果を切替日の 1 週間前に確かめる）と、`mip-index-sample`・`cop-index-sample` の臨時休業の貼り紙（1 週間前から掲示）に間に合わない。 | 第 1 回を 21 日前、第 2 回を 14 日前（どちらも定休日の午前）、追加の期限を 8 日前の閉店後にした。PO が切替日の 1 週間前までに判断すると書いた。日付は週 1 回の定休日に合わせた 7 日間隔の仮置きである。選ばなかった案は、mtp を今のままにして `cop-index-sample` の確認時期と貼り紙の告知期間を短くする案で、2 文書の変更が要るため採らなかった。 | vp-qe-kata-conformance | 要判断 |
| R5-4 | R5 | 合否基準 | サンプルの差分の判定者が QE で、`dmd-index-sample` の判定の分担（サンプル照合と重要値照合は PO、件数照合は DEV）と食い違う。 | 判定者を PO に変え、注記を「判定者は mip-index の成功条件と dmd-index の判定の分担にそろえ、件数は DEV、それ以外は PO」にした。 | vp-qe-kata-conformance（`dmd-index-sample` の検証の共通方針） | - |
| R5-5 | R5 | 合否基準 | 所要時間の判定者が OPS で、`mip-index-sample` の業務停止時間の判定者（店主代表）と食い違う。同系列の sample に OPS は出てこない。 | 判定者を PO に変えた。リハーサルの時間は運用役割の OPS が見るという意図もありうる。選ばなかった案は、OPS のまま残して mip-index と違う理由を注記する案である。 | vp-qe-kata-conformance | 要判断 |
| R5-6 | R5 | 差異発生時の扱い | 区分「許容差内（表記ゆれ）」は判定者 QE が「照合表に記録して合格とする」としている。サンプル照合の合否を PO とする `dmd-index-sample` や R5-4 の直しとずれる可能性がある。 | -（今回は変えていない）。区分を分ける役割として QE を残すか、合格の判断を PO に寄せるかを人が決める。 | vp-qe-kata-conformance | 要判断 |
| R5-7 | R5 | 関連ドキュメント | R5-2 で `cop-index` が合否基準の所要時間の根拠になったのに、見直す範囲に合否基準がない。 | `cop-index` の行を「リハーサル回数とスケジュール、検証観点、合否基準の所要時間を見直す」にした。 | vp-dev-change-impact | - |
| R5-8 | R5 | 相手側 `cop-index-sample` の判定点（GO2） | GO2 は件数・つけ残高・在庫数をまとめて店主代表が判定する。一方、`dmd-index-sample` と `mtp-sample` では件数の判定は DEV である。 | -（相手側の文書なので変えていない）。案は 2 つある。`cop-index-sample` の GO2 で件数の判定者を開発担当（DEV）、つけ残高と在庫数を店主代表（PO）と分ける。または `dmd-index-sample` の分担を当日は店主代表にまとめると書き分ける。 | vp-qe-kata-conformance | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/mtp-sample.md`: `based_on` に `specdojo:dmd-sample` を追加した。合否基準では、所要時間を 150 分以内（動作確認の締め切り T+2:30 基準）に改め、判定者を PO に変更した。サンプル差分の判定者も PO にし、件数は DEV とした。リハーサル回数とスケジュールは、第 1 回を 21 日前、第 2 回を 14 日前、追加の期限を 8 日前とし、PO が切替日の 1 週間前までに判断する形にした。関連ドキュメントの `cop-index` の行には、合否基準の所要時間を見直す範囲として加えた。

## 3. 申し送り

- R5-3 と R5-5 と R5-6 は人の判断が要る。内容は findings に記載した。
- R5-8 は相手側の `cop-index-sample` に関する案であり、本タスクでは変更していない。
- R5-1: R5 / Frontmatter / 本文と関連ドキュメントで依拠している `specdojo:dmd-sample` が `based_on` にない（F001） / `based_on` に `specdojo:dmd-sample` を追加した / vp-dev-change-impact、mtp-rulebook の Frontmatter 規約（移行判断に直接使った成果物を挙げる） / -
- R5-2: R5 / 合否基準 / 所要時間の基準 180 分（9:00〜正午）は cop-index-sample の動作確認の締め切り T+2:30 と開店準備 T+2:50 に合わず、時間内なのに開店準備の時間がなくなる / 基準を 150 分以内にし、未決事項を「9:00 開始から動作確認の締め切り（T+2:30）までの 150 分」「決まった時刻から 11:30 までの分数に直す」にした / vp-qe-kata-conformance（cop-index-sample の当日タイムラインと判定点） / -
- R5-3: R5 / リハーサル回数とスケジュール・差異発生時の扱い・GO/NO-GO判断プロセス / 第 2 回を切替日の 3 日前に置いて結果を見てから切替日を確定するため、cop-index-sample の前提条件（リハーサルの結果を切替日の 1 週間前に確かめる）と mip-index-sample・cop-index-sample の臨時休業の貼り紙（1 週間前から掲示）に間に合わない / 第 1 回を 21 日前、第 2 回を 14 日前（どちらも定休日の午前）、追加の期限を 8 日前の閉店後にし、PO が切替日の 1 週間前までに判断すると書いた / vp-qe-kata-conformance。迷った理由: 日付は週 1 回の定休日に合わせた 7 日間隔の仮置き。選ばなかった案は、mtp を今のままにして cop-index-sample の確認時期と貼り紙の告知期間を短くする案（2 文書の変更が要るため採らなかった） / 要判断
- R5-4: R5 / 合否基準 / サンプルの差分の判定者が QE で、dmd-index-sample の判定の分担（サンプル照合と重要値照合は PO、件数照合は DEV）と食い違う / PO に変え、注記を「判定者は mip-index の成功条件と dmd-index の判定の分担にそろえ、件数は DEV、それ以外は PO」にした / vp-qe-kata-conformance（dmd-index-sample の検証の共通方針） / -
- R5-5: R5 / 合否基準 / 所要時間の判定者が OPS で、mip-index-sample の業務停止時間の判定者（店主代表）と食い違い、同系列の sample に OPS は出てこない / PO に変えた / vp-qe-kata-conformance。迷った理由: リハーサルの時間は運用役割の OPS が見るという意図もありうる。選ばなかった案は OPS のまま残し、mip-index と違う理由を注記する案 / 要判断
- R5-6: R5 / 差異発生時の扱い / 区分「許容差内（表記ゆれ）」は判定者 QE が「照合表に記録して合格とする」としており、サンプル照合の合否を PO とする dmd-index-sample と R5-4 の直しとずれる可能性がある / - / vp-qe-kata-conformance。区分を分ける役割として QE を残すか、合格の判断を PO に寄せるかを人が決める（今回は変えていない） / 要判断
- R5-7: R5 / 関連ドキュメント / R5-2 で cop-index が合否基準の所要時間の根拠になったのに、見直す範囲に合否基準がない / cop-index の行を「リハーサル回数とスケジュール、検証観点、合否基準の所要時間を見直す」にした / vp-dev-change-impact / -
- R5-8: R5 / 相手側 cop-index-sample の判定点（GO2） / GO2 は件数・つけ残高・在庫数をまとめて店主代表が判定するが、dmd-index-sample と mtp-sample では件数の判定は DEV / -（相手側の文書なので変えていない） / vp-qe-kata-conformance。cop-index-sample の GO2 で件数の判定者を開発担当（DEV）、つけ残高と在庫数を店主代表（PO）と分けるか、dmd-index-sample の分担を当日は店主代表にまとめると書き分ける案 / -

## 4. 進め方と実践の型の適用

sample-maintenance の R5 として、参照先の sample 群と共通サンプル文脈を根拠に、`mtp-sample.md` の側だけを修正した。相手側の食い違い（`cop-index-sample` の GO2）は変更せず、直す案を findings に残した。F001 は修正して解消した。F002 と F003 は executor が前の段で解消済みとしており、本 reporter では再確認していない。
