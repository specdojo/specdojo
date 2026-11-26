---
specdojo:
  id: prj-0001:xer-t-kata-review-all-sac-sample-110-20261125t150814z-da0d4b96
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-sac-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-sac-sample-110/T-KATA-REVIEW-ALL-sac-sample-110-20261125T150814Z-da0d4b96/plan.md
  started_at: "2026-11-25T15:08:25.229Z"
  completed_at: "2026-11-25T15:15:07.381Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:sac-sample
    - specdojo:sac-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R1（目的の過不足）を `docs/ja/specdojo/samples/sac-sample.md` に対して実施した。概要から rulebook が求めない背景の文を削り、`SAC-PERF-04` の合格内容を業務の成果から日次締めの完了というシステムの条件へ直した。
- grade の F002（概要表と 2.4 見出しの食い違い）は `SAC-PERF-04` の直しで解消した。F001（日次締めの合否境界）は `vp-qe-verifiability` の観点で R4 に当たり、rulebook が SAC での閾値の新規確定を禁止しているため、sample 単独では直さず申し送りとした。
- 整形（prettier）と markdownlint は変更した sample に対して通過した。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も passed である。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R1 | `docs/ja/specdojo/samples/sac-sample.md` 「概要」冒頭段落の 2 文目 | 会計確定が遅れたときの影響と営業日 90% の初期目標を述べる背景の文と、SAC の種別の定義を言い直した文末は、rulebook の概要が求める要素（出口条件・対象範囲と対象外・根拠）に当たらない。根拠の性能要件と共通サンプル文脈の再掲になっている。 | 2 文目を削除し、出口条件の 1 文だけにした。 | `specdojo:sac-rulebook` の「本文要件」と「記述ガイド」、`specdojo:sample-authoring-standard` の「サンプル群の目的」、`vp-arc-conciseness` | 要判断 |
| 2 | R1 | `docs/ja/specdojo/samples/sac-sample.md` 「概要」の表の `SAC-PERF-04` 行の「合格とする内容」 | 「翌日の開店前に前日の在庫数を確かめる」は店番が行う業務の成果で BAC の範囲にあり、SAC が扱う日次締めの完了（2.4）と食い違っている（grade F002 と同じ箇所）。 | 「閉店後の日次締めを翌日の開店前に終える」に直し、2.4 の見出しと `nfr-perf-006` にそろえた。 | `specdojo:sac-rulebook` の「位置づけ」、`specdojo:nfr-performance-sample` の `nfr-perf-006` | - |
| 3 | R1（R4 へ申し送り） | `docs/ja/specdojo/samples/sac-sample.md` 「2.4.4. 判定方法」と「メモ / 将来課題」の日次締めの行（grade F001） | 日次締めの合否の境界が「翌日の開店まで」だけで、閉店・開店の時刻か許容時間がない。ただし `vp-qe-verifiability` の観点は R4 に当たり、rulebook が SAC での閾値の新規確定を禁止しているため、sample 単独では直せない。 | 直さない。先に `specdojo:nfr-performance-sample` の負荷条件の表か `nfr-perf-006` の暫定判定に時刻か許容時間の仮置き値を足し、そのあと sac-sample の 2.4.4 とメモの表へ反映する案を R4 と人の判断へ渡す。 | `specdojo:sac-rulebook` の「全体方針」と「禁止事項」、`docs/ja/specdojo/guides/kata-guide.md` の「kata の観点の組」 | 要判断 |
| 4 | R1（R3 へ申し送り） | `docs/ja/specdojo/samples/sac-sample.md` 「概要」の表の `SAC-PERF-01` 行「ピーク時の会計確定が待たせない」 | 主語と述語がねじれている（W2）。読みやすさの観点で R1 の範囲外のため直していない。 | R3 で「ピーク時の会計確定で客を待たせない」などに直す。 | `docs/ja/specdojo/guides/kata-guide.md` の「文章のチェック項目」W2 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/sac-sample.md`: 「概要」冒頭段落の 2 文目（会計確定が遅れたときの影響と初期目標を述べる背景、SAC の種別定義の言い直し）を削除し、出口条件の 1 文にした。概要表の `SAC-PERF-04` の合格内容を「閉店後の日次締めを翌日の開店前に終える」に直し、2.4 の見出しと根拠の `nfr-perf-006` にそろえた。

## 3. 申し送り

- R4 への申し送り（No 3）: 日次締めの閉店・開店時刻か許容時間は、先に `specdojo:nfr-performance-sample` の負荷条件の表か `nfr-perf-006` の暫定判定へ仮置き値を足してから、sac-sample の 2.4.4 とメモの表へ反映する。人の判断が要る。
- R3 への申し送り（No 4）: 概要表の `SAC-PERF-01` 行の主語と述語のねじれ（W2）は R1 の範囲外のため直していない。
- No 1 の背景文の削除は、完成例に背景を残すかどうかで判断が分かれる。人が採るか戻すかを決める。
- No: 1 / 段: R1 / 箇所: `docs/ja/specdojo/samples/sac-sample.md` 「概要」冒頭段落の 2 文目 / 指摘: 会計確定が遅れたときの影響と営業日 90% の初期目標を述べる背景の文と、SAC の種別の定義を言い直した文末は、rulebook の概要が求める要素（出口条件・対象範囲と対象外・根拠）に当たらず、根拠の性能要件と共通サンプル文脈の再掲になっている / 直した案: 2 文目を削除し、出口条件の 1 文だけにした / 根拠: `specdojo:sac-rulebook` の「本文要件」と「記述ガイド」の概要（1〜3 文で出口条件・対象範囲と対象外・根拠を示す）、`specdojo:sample-authoring-standard` の「サンプル群の目的」（説明に必要な範囲に限定する）、`vp-arc-conciseness`（目的に要らない背景と正本の再掲を書かない） / 印: 要判断（背景を完成例に残すかどうかは判断が分かれるため、人が採るか戻すかを決める）
- No: 2 / 段: R1 / 箇所: `docs/ja/specdojo/samples/sac-sample.md` 「概要」の表の `SAC-PERF-04` 行の「合格とする内容」 / 指摘: 「翌日の開店前に前日の在庫数を確かめる」は店番が行う業務の成果で BAC の範囲にあり、SAC が扱うシステムの合格基準（2.4 の日次締めの完了）と食い違っている（grade F002 と同じ箇所） / 直した案: 「閉店後の日次締めを翌日の開店前に終える」に直し、2.4 の見出しと根拠の `nfr-perf-006` にそろえた / 根拠: `specdojo:sac-rulebook` の「位置づけ」（業務担当者が業務を進められるかは BAC で扱い、SAC は業務シナリオの成立条件を再掲しない）、`specdojo:nfr-performance-sample` の `nfr-perf-006`（日次締めの完了時間） / 印: なし
- No: 3 / 段: R1（R4 へ申し送り） / 箇所: `docs/ja/specdojo/samples/sac-sample.md` 「2.4.4. 判定方法」と「メモ / 将来課題」の日次締めの行（grade F001） / 指摘: 日次締めの合否の境界が「翌日の開店まで」だけで、閉店・開店の時刻か許容時間がない。ただし検証可能性（`vp-qe-verifiability`）の観点で R1 の観点に当たらない。また rulebook が SAC での閾値の新規確定を禁止しているため、sample 単独では直せない / 直した案: 直さない。先に `specdojo:nfr-performance-sample` の負荷条件の表（閉店後の行）か `nfr-perf-006` の暫定判定に閉店・開店の時刻か許容時間の仮置き値を足し、そのあとで sac-sample の 2.4.4 とメモの表に反映する案を R4 と人の判断へ渡す / 根拠: `specdojo:sac-rulebook` の「全体方針」（新しい閾値や要求を SAC で確定しない）と「禁止事項」（根拠のない閾値・要求の追加）、`docs/ja/specdojo/guides/kata-guide.md` の「kata の観点の組」（`vp-qe-verifiability` は R4） / 印: 要判断
- No: 4 / 段: R1（R3 へ申し送り） / 箇所: `docs/ja/specdojo/samples/sac-sample.md` 「概要」の表の `SAC-PERF-01` 行「ピーク時の会計確定が待たせない」 / 指摘: 主語と述語がねじれている（W2）。読みやすさの観点で R1 の範囲外のため直していない / 直した案: R3 で「ピーク時の会計確定で客を待たせない」などに直す / 根拠: `docs/ja/specdojo/guides/kata-guide.md` の「文章のチェック項目」W2 / 印: なし
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/samples/sac-sample.md だけで、個票や plan・result などの履歴ファイルを変更していないため）
- 適用外の検証: `npm run validate:schema:file`（変更ファイルに `*.yaml` / `*.yml` がないため）

## 4. 進め方と実践の型の適用

根拠とした規範は `specdojo:sac-rulebook`（本文要件・記述ガイド・位置づけ・全体方針・禁止事項）、`specdojo:sample-authoring-standard`、`specdojo:nfr-performance-sample`、`vp-arc-conciseness`、`docs/ja/specdojo/guides/kata-guide.md` である。rulebook を正として、概要が求める出口条件・対象範囲と対象外・根拠に当たらない背景を削った。`SAC-PERF-04` は SAC が扱うシステムの合格基準にそろえた。grade の F002 は解消した。F001 は R4 の観点であり、SAC で新しい閾値を確定できないため、根拠不足として見送り、先に性能要件へ仮置き値を足す案を申し送った。
