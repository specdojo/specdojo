---
specdojo:
  id: prj-0001:pjr-25f4-grade-two-stage-filter
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-08-30T12:22:15Z"
  due_on: "2026-09-30"
  completed_at: "2026-08-31T13:52:30Z"
  conclusion: "grade を3段で回す運用を設計し実装した。1段目はリファレンスありで全件をローカル評価し、2段目はリファレンスなしで1段目の失敗を拾いつつ指摘を確認する。3段目は pass かつ score 96 以上で finding 1 件以下のものと、未評価のものだけを codex-expert-executor が確認する。rtn-grade-kata を3つの Job の配列 action へ変更し、前段の成否にかかわらず後段を実行する。あわせて grade へ --min-score を追加し、verdict と finding 件数と AND で組み合わせられるようにした。--ungraded とは保存済み grade の有無が矛盾するため併用を拒否する。routine の有効化は人が判断するため enabled: false を維持している。"
---

# PJR-25F4 grade の段階的な運用を設計する

## 1. 概要

ローカルモデルは判定が甘く、単独では見落としが生じる。`dec-rulebook.md` はローカル構成（qwen を executor、gemma を reporter）で verdict が `pass`、score が 96 と判定されたが、`codex-expert-executor` は単独で 12 件、`claude-expert-executor` は 23 件の指摘を出している。

一方で `needs-work` や `fail` と判定されたものは、既に修正対象が確定しており、高性能 agent による再評価の価値は低い。

定期評価をローカルで全件回し、`pass` と判定されたものだけを codex-expert で再確認する二段階フィルタとすることで、API コストを抑えつつ見落としを拾える。

## 2. 完了条件

- ローカル評価の結果から再確認対象を選び出せる。
- 再確認の対象範囲を決める基準が定義されている。verdict だけでなく score も用いる。
- 二段階目の評価が一段階目の finding を引き継ぎ、severity を維持する。
- 運用手順が規範文書へ記載されている。
- サンプル評価の結果から閾値が根拠づけられている。

## 3. 作業内容

| No  | 作業                       | 担当 | 状態 | メモ                                                     |
| --- | -------------------------- | ---- | ---- | -------------------------------------------------------- |
| 1   | サンプル評価による分布把握 | ARC  | done | rulebook 9件で pass 率、score、ERROR 率を測定            |
| 2   | フィルタ基準の決定         | ARC  | done | `pass AND score >= 96 AND finding <= 1` と未評価を採用   |
| 3   | 対象選択の実装             | ARC  | done | `grade` の全 workflow に `--min-score` を追加            |
| 4   | 運用手順の文書化           | ARC  | done | 3つの Job、routine、routine 運用ガイドへ順序と閾値を反映 |

### 3.1. 見落としの実例

`dec-rulebook.md` に対する評価結果である。

| 評価者                    | verdict / 平均 level | finding |
| ------------------------- | -------------------- | ------- |
| ローカル（qwen と gemma） | pass / score 96      | 1       |
| `codex-expert-executor`   | 平均 level 2.75      | 12      |
| `claude-expert-executor`  | 平均 level 2.62      | 23      |

ローカルが問題なしと判定した文書に対し、codex は 12 件の指摘を出した。ローカルの `pass` は信頼できない。

### 3.2. 3 段構成

実測を踏まえ、次の順序で実行する。

| 回  | 構成                              | ERROR 率 | 役割                           |
| --- | --------------------------------- | -------- | ------------------------------ |
| 1   | ローカル、リファレンスあり        | 33%      | 深い指摘を取る                 |
| 2   | ローカル、リファレンスなし        | 11%      | 1 回目の失敗を拾い、指摘を確認 |
| 3   | `codex-expert-executor`、条件付き | 低い     | 見落としの最終確認             |

リファレンスありは精度が高いが失敗しやすい。2 回目の安定性で 1 回目の失敗を補う。実測では 1 回目に失敗した `pr` と `cdsd` が、リファレンスなしでは成功している。

2 回目で判定が緩まないことは severity の維持（PJR-Z8T1）が保証する。1 回目にリファレンスありで検出した `major` は、2 回目で `minor` へ格下げされない。

### 3.3. 3 回目の対象

| 条件                                                | 根拠                                                                                            |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `pass` かつ score 96以上かつ finding が0-1件        | `dec` は score 96 / finding 1件、`ifx-index` は score 100 / finding 0件でも見落としの疑いがある |
| 2回のローカル評価後も `specdojo.grade` がない未評価 | `opr` は3回とも失敗し記録が残っていない                                                         |

`needs-work` と `fail` は修正すべき指摘が確定しているため対象外とする。score だけで絞ると `gl`（score 96 だが `needs-work`）まで再確認するため、verdict、score、finding 件数を AND で組み合わせる。未評価は保存済み grade を前提とする条件と OR になるため、別の `--ungraded` 選択として実行する。

score の初期下限は96とする。リファレンスありの実測では pass の score が91、96、100に分かれ、既知の偽陰性である `dec` も96だった。95以下まで広げるより、まず偽陰性境界以上で finding がほぼない層を再確認する。実測9件では高信頼 pass と未評価を合わせて2件から3件が対象となり、kata 285件では60件から85件に相当する。

### 3.4. 効率の見積もり

削減効果はローカル評価後に3条件をすべて満たす比率に依存する。

| expert 対象率 | codex の対象（285件中） | 削減効果     |
| ------------- | ----------------------- | ------------ |
| 20%           | 57件                    | 大きい       |
| 50%           | 143件                   | 中程度       |
| 80%           | 228件                   | ほとんどない |

初期値は実測の22%から33%に相当する。週次実行では対象率、expert が追加した finding 数、expert 後も `pass` だった比率を記録し、対象率が50%を超える場合、または96点未満の標本で偽陰性が見つかった場合に閾値を再検討する。

### 3.5. 前提となる機能

本項目の運用に必要な次の機能は実装済みである。

- PJR-GA2K により、routine の `action` は配列を受け付け、各 Job を同期的に順次実行できる。
- PJR-3D7Q により、`--verdict`、`--max-findings`、`--ungraded` で保存済み結果を選べる。本項目で `--min-score` を追加し、score 下限も AND 条件へ含めた。
- PJR-X40M と PJR-Z8T1 により、後段の plan が前回 finding を引き継ぎ、未解消 finding の severity を維持する。

### 3.6. 運用上の決定

- expert は、網羅性とコストの均衡から `codex-expert-executor`、構造化はローカルの `gemma-reporter` とする。
- 前回 expert が問題なしとした文書も、次の週次実行でローカル grade が上書きされ、3条件を満たせば再確認する。現行 grade snapshot には確認世代を区別する情報がないため、誤って除外するより偽陰性の再確認を優先する。
- 初期閾値は Kata の種別で分けない。運用指標を種別別にも集計し、score 96未満の偽陰性率に差が出た場合に Job を分割する。
- リファレンスありの ERROR は、2回目のリファレンスなし評価で補完する。1回目の ERROR 率自体を下げる変更は、比較条件を変えて閾値の根拠を失わないよう別の測定項目として扱う。

## 4. 対応結果

- `grade plan` / `grade apply` / `grade validate` に `--min-score 0..100` を追加し、verdict、finding 件数、既存条件と AND で選択できるようにした。`--ungraded` とは保存済み grade の有無が矛盾するため併用を拒否する。
- `job-grade-kata` をリファレンスありの全件ローカル評価へ更新し、リファレンスなしの `job-grade-kata-local-confirmation` と、条件付き `job-grade-kata-expert-check` を追加した。
- `rtn-grade-kata` を3つの Job の配列 action へ変更し、前段の成功・失敗後に後段を同期実行する構成にした。routine の有効化は人が行うため `enabled: false` を維持した。
- [[specdojo:command-reference]] に score フィルタ、[[specdojo:routine-operation-guide]] に3段の対象、agent、閾値、severity 維持、閾値見直し条件を記載した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-vqb5-agent-grade-comparison]]: agent ごとの検出能力の差と、ローカル構成の実測記録。
- [[prj-0001:pjr-ankr-grade-executor-reporter]]: ローカルで grade を回すための2段構成。
- [[prj-0001:pjr-x40m-grade-previous-findings]]: 前回 finding の引き継ぎ。二段階目でも指摘を保つ。
- [[prj-0001:pjr-z8t1-grade-finding-severity]]: severity の維持。二段階目で格下げが起きない前提となる。
- [[prj-0001:pjr-3d7q-grade-target-filter]]: verdict、finding 件数、未評価による対象選択。
- [[prj-0001:pjr-ga2k-routine-sequential-actions]]: 3つの Job を順次実行する routine の前提。
- [[specdojo:command-reference]]: `grade` の選択オプションの規範。
- [[specdojo:routine-operation-guide]]: 段階評価の運用手順。
