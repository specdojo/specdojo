---
specdojo:
  id: prj-0001:pjr-mrjt-job-run-identity-from-period
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: high
  owner: ARC
  registered_at: "2026-09-09T14:22:01Z"
  due_on: "2026-09-30"
  completed_at: "2026-09-09T22:18:09Z"
---

# PJR-MRJT 実行の同一性を period から組み立てており日次実行できない

## 1. 概要

job のコマンドが `--run-id` を入力から組み立てているため、実行の同一性がスケジュールの粒度に
依存する。週次を日次へ変えると 2 晩目以降が空振りする。

```text
--run-id {{job_id}}-{{inputs.kind}}-{{inputs.period}}
```

## 2. 発生の経路

`tools/grade/run-per-document.sh` は `--run-id` 単位で完了段を保存し、同じ run-id なら再開
扱いにする。中断からの再開を成立させるための仕様である。

```text
Completed stages are persisted below --work-dir so the same command resumes after an interruption.
```

`period` が `{{scheduled_at | iso_week}}` の場合、同じ週の実行はすべて同じ run-id になる。

```text
月曜 01:00  run-id=...-2026-W37  → 5 文書を評価
火曜 01:00  run-id=...-2026-W37  → 完了済みとして飛ばす
```

週に 1 回しか意味のある実行にならない。日次・時間毎の実行が成立しない。

## 3. 誤りの所在

`period` が 3 つの役割を兼ねている。

| 役割                       | 本来の担い手 |
| -------------------------- | ------------ |
| Job Run の冪等性           | Job Run ID   |
| スクリプトの再開状態のキー | Job Run ID   |
| レポートの対象期間の表示   | `period`     |

実行の同一性を、利用者が渡す入力から組み立てている点が誤りである。routine 側が「スケジュールに
合う粒度」を推測して `period` を作る必要が生じ、スケジュールを変えるたびに入力の粒度を合わせ
直すことになる。実行の一意性はスケジュールの粒度とは無関係であるべきである。

Job Run は `JBR-grade-kata-48cd668e941c` のような一意な ID を持つが、テンプレートから参照でき
ない。`renderJobTemplate` が解決するのは次に限られる。

```text
job_id / project_id / specdojo / scheduled_at / inputs.* / checkpoint.*
```

## 4. 対症療法では解決しない

`iso_date` フィルタを追加すれば日次は動くが、時間毎の実行では `iso_hour` が要る。粒度を増やす
たびに同じ問題が再発する。

現状の週次設定も正しくない。同じ週に 2 回実行すれば 2 回目は前回の完了段を飛ばす。週次のため
顕在化していないだけで、失敗後の再試行でも同じことが起きる。実際に検証中、`period` を
`2026-W37-verify` と手で変えて回避した経緯がある。

## 5. 想定する形

```text
--run-id {{job_run_id}}
```

| 得られる性質                                     |
| ------------------------------------------------ |
| 実行ごとに必ず異なる。粒度の推測が不要           |
| 同じ Job Run の再開では一致する                  |
| `period` は表示用の入力へ戻り、役割が 1 つになる |
| フィルタを増やす必要がない                       |

## 6. 完了条件

- コマンドテンプレートから Job Run ID を参照できる。
- `job-grade-kata` の `--run-id` が Job Run ID から組み立てられている。
- `rtn-grade-recheck` を日次で 2 回実行したとき、2 回目も文書を選択して評価する。前回の完了段を
  飛ばさない。
- 同じ Job Run を再開した場合は、前回の完了段を引き継ぐ。再開の仕組みを壊さない。
- 冪等キーが `period` に依存する現状の妥当性が判断され、必要なら見直されている。同じ日に 2 回
  起動したときの扱いが定義されている。
- `period` の役割が表示用途に限定されている。
- 上記を検証するテストがある。

## 7. 作業内容

| No  | 作業                                          | 対応                                                        |
| --- | --------------------------------------------- | ----------------------------------------------------------- |
| 1   | `renderJobTemplate` へ Job Run ID を追加      | `job_run_id` として追加                                     |
| 2   | `job-grade-kata` の `--run-id` を切り替える   | `{{job_run_id}}` と同名の結果ディレクトリへ切り替え         |
| 3   | 冪等キーの設計を見直す                        | `scheduled_at` を実行枠とし、`period` をキーから除外        |
| 4   | 日次で 2 回実行して空振りしないことを確認する | 連続する2実行枠と同一枠retryをmaterializeするテストで確認   |
| 5   | テストを追加する                              | テンプレート展開、実行枠の分離、同一Runの再開を単体テスト化 |

## 8. 対応結果

- `renderJobTemplate` が、Job Run ID確定後のtaskとcheckpointで`{{job_run_id}}`を解決できるように
  した。循環参照になるため、`run.idempotency_key`の解決時には参照を拒否する。
- `job-grade-kata`は`JBR-...`形式のJob Run IDをscriptの`--run-id`と結果ディレクトリに使う。
- 冪等キーを`scheduled_at`と実行内容を変える入力から構成する`command-v2`へ更新した。同じ論理
  実行枠の重複起動と失敗後のretryは同じJob Runを使い、次の日次実行枠は別のJob Runになる。
  `period`は対象期間の表示用に限定した。
- 連続する2日と同日内の異なる実行枠がそれぞれ異なるJob Run IDと再開キーを得て、同じ実行枠の
  retryが同じIDと完了状態を引き継げることを単体テストで検証した。
- 夜間再評価の阻害要因を解消したため、`rtn-grade-recheck`を`enabled: true`へ戻した。

## 9. 関連ドキュメント

- [[prj-0001:pjr-gwy4-job-deterministic-command]]: コマンド実行の決定論化。
- [[prj-0001:pjr-t2kk-grade-recheck-routine]]: 再評価の routine 化。
