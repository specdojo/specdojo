---
specdojo:
  id: prj-0001:pjr-3d7q-grade-target-filter
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-08-31T12:41:16Z"
  due_on: "2026-09-30"
  completed_at: "2026-08-31T13:45:21Z"
  conclusion: discoverGradeTargets へ verdict、finding 件数の上限、未評価の各フィルターを追加し、既存条件との AND 結合を実装した。grade plan / apply / validate に --verdict、--max-findings、--ungraded を公開している。評価済み 6 件で検証し、--verdict pass --max-findings 1 が ifx-index のみを抽出することを確認した。指摘のある mm と gl は pass でも除外され、条件の組み合わせが機能している。
---

# PJR-3D7Q grade の対象選択に判定結果による絞り込みを追加する

## 1. 概要

grade の対象選択は `--path` と `--changed-only` しかなく、前回の判定結果で絞り込めない。

段階的な運用では、`pass` かつ finding がほとんど無い文書を見落としの疑いが強いものとして高性能 agent へ回し、続けて失敗した未評価の文書を確実に評価する必要がある。

`verdict`、finding の件数、未評価であることを条件に対象を選べるようにする。

## 2. 完了条件

- `verdict` で対象を絞れる。
- finding の件数で対象を絞れる。
- 未評価の文書だけを対象にできる。
- 条件を組み合わせられる。
- 既存の `--path` と `--changed-only` と併用できる。
- `npm run check` が通る。

## 3. 作業内容

| No  | 作業               | 担当 | 状態 | メモ                                 |
| --- | ------------------ | ---- | ---- | ------------------------------------ |
| 1   | 条件の設計         | ARC  | open | オプション名と組み合わせ方           |
| 2   | 未評価の定義の決定 | ARC  | open | grade が無い状態と失敗した状態の区別 |
| 3   | 実装               | ARC  | open | `discoverGradeTargets` の拡張        |
| 4   | 規範文書の更新     | ARC  | open | command-reference                    |

### 3.1. 必要になった経緯

rulebook 9 件の実測で、判定結果による絞り込みが要る状況が確認できた。

| 文書        | 状況                             | 必要な扱い                      |
| ----------- | -------------------------------- | ------------------------------- |
| `ifx-index` | 2 回とも score 100、finding 0 件 | 見落としの疑い。高性能 agent へ |
| `opr`       | 3 回とも失敗し未評価のまま       | 確実に評価する                  |
| `ntp`       | `needs-work` 67、finding 5 件    | 修正対象。再評価は不要          |

`needs-work` や `fail` は修正すべき指摘が既にあるため、高性能 agent による再確認の価値が低い。一方 `pass` かつ finding が少ない文書は、問題がないのか検出できていないのかを判別できない。

### 3.2. 想定する条件

| 条件           | 用途                                     |
| -------------- | ---------------------------------------- |
| verdict        | `pass` のみを再確認の対象にする          |
| finding の件数 | 指摘がほとんど無いものに絞る             |
| 未評価         | grade が記録されていない文書を対象にする |

`--changed-only` は内容の変更を見るが、判定結果は見ない。両者は独立した軸であり、併用できる必要がある。

### 3.3. 未決の論点

- 未評価の定義。grade が記録されていない状態と、評価を試みて失敗した状態を区別するか。現在は失敗しても記録が残らないため、両者を区別できない。区別するには失敗の記録が要る。
- finding 件数の閾値をどこに置くか。0 件のみとするか、1 件以下とするか。実測では `ifx-index` が 0 件、`mm` が 1 件から 3 件であった。
- severity を条件に含めるか。`major` が無く `minor` だけの文書は、`pass` でも見落としの疑いがある。

### 3.4. 採用した設計

- `--verdict <pass|needs-work|fail>` で最新の判定を指定する。
- `--max-findings <count>` で `blocker` / `major` / `minor` / `note` の合計件数が閾値以下の文書を選ぶ。0 件か 1 件以下かは運用側で指定する。
- `--ungraded` は `specdojo.grade` が存在しない文書を選ぶ。現状は失敗した評価試行が記録されないため、一度も試行していない状態と区別しない。
- 複数の条件は AND とし、`--path` と `--changed-only` も同じ選択処理で併用する。
- `--ungraded` と、保存済み grade を前提とする `--verdict` / `--max-findings` の併用は入力エラーにする。
- severity 単位の絞り込みは今回の実測上の完了条件に含めず、合計件数で扱う。

## 4. 対応結果

- `discoverGradeTargets` に verdict、finding 上限、未評価のフィルターを追加し、既存条件との AND 結合を実装した。
- 判定結果フィルターの組み合わせ、finding 合計、未評価、変更有無、矛盾条件を単体テストへ追加した。
- CLI の `grade plan` / `grade apply` / `grade validate` に共通オプションを公開した。
- [[specdojo:command-reference]] にオプションと選択規則を追記した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-25f4-grade-two-stage-filter]]: 段階的な grade 運用。本項目を前提とする。
- [[prj-0001:pjr-ga2k-routine-sequential-actions]]: routine の順次実行。段ごとに対象を変える。
- [[prj-0001:pjr-vqb5-agent-grade-comparison]]: 絞り込みが必要になった実測記録。
