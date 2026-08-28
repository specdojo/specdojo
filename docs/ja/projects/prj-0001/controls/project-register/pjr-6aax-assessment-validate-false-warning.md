---
specdojo:
  id: prj-0001:pjr-6aax-assessment-validate-false-warning
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: low
  owner: ARC
  registered_at: "2026-08-27T13:22:07Z"
  due_on: "2026-10-31"
  register_events:
    - v: 1
      id: reg_7632207864a673c19afb7509958a372f
      ts: "2026-08-27T13:23:32Z"
      action: add
      actor: naoji3x
      from_status: null
      to_status: open
      reason: "docs(register): PJR-ENK0 をクローズし PJR-6AAX を起票する"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: assessment validateが正しい判定に対して誤警告を出す
        - field: description
          from: ""
          to: schedule assessment validate が、判定の根拠として status draft を挙げていない箇所に対して「status draft であること自体は利用不能の根拠にならない」という警告を出す。PJR-ENK0 で生成した sch-assessment-planning.yaml の dct-index / kata.template が該当したが、実際の根拠は target-fit と internal-consistency の失敗であり、draft には言及していない。判定の checks に draft という語が含まれるかどうかなど、機械的な条件で誤検知していると見られる。正しい判定に警告が出るとレビューのたびに確認の手間がかかる。
        - field: type
          from: ""
          to: todo
        - field: priority
          from: ""
          to: low
        - field: owner
          from: ""
          to: ARC
        - field: registered
          from: ""
          to: "2026-08-27"
        - field: due
          from: ""
          to: "2026-10-31"
        - field: completed
          from: ""
          to: "-"
        - field: conclusion
          from: ""
          to: "-"
        - field: block_reason
          from: ""
          to: "-"
      legacy_commit: 6ba4158b1f9a5372bca146832c79c724b376708d
---

# PJR-6AAX assessment validateが正しい判定に対して誤警告を出す

## 1. 概要

schedule assessment validate が、判定の根拠として status draft を挙げていない箇所に対して「status draft であること自体は利用不能の根拠にならない」という警告を出す。PJR-ENK0 で生成した sch-assessment-planning.yaml の dct-index / kata.template が該当したが、実際の根拠は target-fit と internal-consistency の失敗であり、draft には言及していない。判定の checks に draft という語が含まれるかどうかなど、機械的な条件で誤検知していると見られる。正しい判定に警告が出るとレビューのたびに確認の手間がかかる。

## 2. 完了条件

- 判定の根拠に `status: draft` を挙げていない箇所へ、当該警告が出ない。
- 実際に `status: draft` を利用不能の根拠としている判定に対しては、引き続き警告が出る。警告の目的を弱めない。
- 誤警告と真の警告を区別できることを自動テストで確認する。双方向を検証する。
- 現在の `sch-assessment-planning.yaml` が警告なしで通る。判定の内容は変更しない。
- `npm run typecheck`、`npm run lint:ts`、`npm run test:unit`、`npm run test:integration` が成功する。

### 調査済みの事実

- 警告が出たのは `sch-assessment-planning.yaml` の `dct-index` / `kata.template` である。判定は `usability: unusable` で、`checks` の内容は次のとおりである。
  - `target-fit: fail` — 対象は YAML 正本だが、この template は `generated/dct-index.md` の表示ビューを雛形としている。
  - `internal-consistency: fail` — rulebook が `dct-index.yaml` を正本とし、`generated/dct-index.md` の直接編集を禁止している。
- いずれも実質的な不整合を指摘しており、`status: draft` には言及していない。判定は妥当である。
- 判定7件を確認したが、`draft` を根拠にしたものは0件であった。
- 影響は警告の表示のみで、strategy の生成は成立する。優先度は低い。

## 3. 作業内容

| No  | 作業                                       | 担当 | 状態 | メモ                   |
| --- | ------------------------------------------ | ---- | ---- | ---------------------- |
| 1   | 誤警告の発生条件を特定する                 | ARC  | open | 機械的な語の一致を疑う |
| 2   | 判定の根拠を見て警告するよう改める         | ARC  | open | 警告の目的は弱めない   |
| 3   | 誤警告と真の警告を区別するテストを追加する | ARC  | open | 双方向の確認           |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- 誤警告が判明した項目: [[prj-0001:pjr-enk0-sch-strategy-planning-regenerate|PJR-ENK0 sch-strategy-planningをassessmentから再生成する]]
- Schedule の設計方針: [[specdojo:schedule-design-guide|Schedule設計ガイド]]
- 対象ファイル: `docs/ja/projects/prj-0001/schedule/assessments/sch-assessment-planning.yaml`
- 実装: `src/schedule-assessment.ts`
