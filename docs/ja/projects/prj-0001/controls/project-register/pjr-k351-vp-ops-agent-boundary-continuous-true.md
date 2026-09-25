---
specdojo:
  id: prj-0001:pjr-k351-vp-ops-agent-boundary-continuous-true
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: OPS
  registered_at: "2026-09-25T12:45:13Z"
---

# PJR-K351 vp-ops-agent-boundary を試行して continuous: true の可否を決める

## 1. 概要

`vp-ops-agent-boundary`（「agent に最終承認、公開可否判断、説明責任を委ねる記述になっていないか」）は現在 grade の対象外である。[[prj-0001:pjr-wpwb-viewpoint-evaluation-criteria]] の基準では照合型であり、`continuous` の条件 1 と 2 を満たす。条件 3（繰り返し評価に値する finding が出るか）は実測が必要なため、試行して可否を決める。

## 2. 事実

### 2.1. continuous の条件 1 と 2 を満たす

| 条件 | 内容                                | 判定                                                                       |
| ---- | ----------------------------------- | -------------------------------------------------------------------------- |
| 1    | 対象が成果物の現在の状態である      | 満たす。記述の有無を見る。変更を対象としない                               |
| 2    | 情報が grade の読み取り範囲にある   | 満たす。`evidence` は owner、reviewer、approver、`agent_mode`、manual gate |
| 3    | 繰り返し評価に値する finding が出る | **未実測**                                                                 |

### 2.2. 現在 grade の対象外である

| フィールド      | 現在の値 | 基準による判定      |
| --------------- | -------- | ------------------- |
| `evaluation`    | `human`  | `referential`       |
| `continuous`    | `false`  | 試行して決める      |
| `grade_targets` | 未指定   | kata と成果物の両方 |

`src/grade.ts` は `continuous === true && evaluation !== "human"` で対象を絞るため、`evaluation` を `referential` へ変えるだけでは対象に入らない。[[prj-0001:pjr-wpwb-viewpoint-evaluation-criteria]] の分離が前提になる。

### 2.3. 継続検出の価値が高い

agent へ最終承認や説明責任を委ねないことは SpecDojo の設計方針である。成果物が増えるほど違反が混入する余地が広がるが、現在は review フェーズを通る成果物だけで確認している。**継続評価にすれば全成果物を対象に検出できる。**

## 3. 完了条件

- [[prj-0001:pjr-wpwb-viewpoint-evaluation-criteria]] の `evaluation` と `continuous` の分離が完了している。
- `vp-ops-agent-boundary` を含めた grade を試行し、finding 数と内容を記録している。
- finding が実在の問題を指しているかを標本で確認している。誤検出の割合を記録する。
- 試行結果に基づいて `continuous` の値を決めている。`false` に留める場合も理由を記録する。
- `continuous: true` にする場合、夜間実行の所要時間とコストの増加を記録している。

## 4. 試行の方法

1. `evaluation` と `continuous` の分離を適用する。
2. `vp-ops-agent-boundary` を `continuous: true` にする。
3. 標本の成果物に対して grade を実行する。全件ではなく 20 件程度に絞る。
4. 出た finding を 1 件ずつ確認し、実在の問題か誤検出かを分類する。
5. 誤検出が多い場合は `check` の書き方を見直すか、`continuous: false` に戻す。

判定の目安は、**誤検出が半分を超える場合は採用しない**こととする。継続評価の finding は人が読むため、誤検出が多いと読まれなくなる。

## 5. 作業内容

| No  | 作業                                   | 担当 | 状態 | メモ                             |
| --- | -------------------------------------- | ---- | ---- | -------------------------------- |
| 1   | 分離の完了を確認する                   | OPS  | open | 前提項目の完了待ち               |
| 2   | 標本 20 件で grade を試行する          | QE   | open | kata と成果物を混ぜる            |
| 3   | finding を実在の問題と誤検出へ分類する | OPS  | open | 誤検出が半分を超えたら採用しない |
| 4   | `continuous` の値を確定する            | OPS  | open | 理由を個票へ記録する             |

## 6. 対応結果

-

## 7. 関連ドキュメント

- [[prj-0001:pjr-wpwb-viewpoint-evaluation-criteria]]
- `docs/ja/specdojo/defaults/pm-review-viewpoints.yaml`
- `src/grade.ts`
