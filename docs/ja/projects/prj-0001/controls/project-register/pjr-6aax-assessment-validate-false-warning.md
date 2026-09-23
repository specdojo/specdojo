---
specdojo:
  id: prj-0001:pjr-6aax-assessment-validate-false-warning
  type: project
  status: deprecated
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: rejected
  priority: low
  owner: ARC
  registered_at: "2026-08-27T13:22:07Z"
  due_on: "2026-10-31"
  completed_at: "2026-09-04T14:28:54Z"
  conclusion: PJR-JFTC で sch-assessment が廃止され、誤警告を出す判定処理そのものが失われたため前提不成立。修正対象がない。
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

| No  | 作業                                       | 担当 | 状態 | メモ                                                       |
| --- | ------------------------------------------ | ---- | ---- | ---------------------------------------------------------- |
| 1   | 誤警告の発生条件を特定する                 | ARC  | done | 後続の PJR-JFTC で対象実装を含む sch-assessment を廃止した |
| 2   | 判定の根拠を見て警告するよう改める         | ARC  | done | 警告を生成する CLI 自体が廃止済みのため変更不要            |
| 3   | 誤警告と真の警告を区別するテストを追加する | ARC  | done | 対象機能と専用テストが廃止済みのため追加不要               |

## 4. 対応結果

後続の [[prj-0001:pjr-jftc-sch-assessment-retirement|PJR-JFTC sch-assessment の廃止可否を判断し approach の決定論的導出へ移行する]] で、`sch-assessment` と `schedule assessment` CLI、schema、実データ、専用テストが廃止された。現在の `schedule` コマンドは `where`、`build`、`strategy` のみを提供し、対象の警告を生成する経路は存在しない。

このため、誤警告と真の警告を区別する判定修正および回帰テスト追加は不要となった。元の完了条件は対象機能の存続を前提としていたため PJR-JFTC の廃止判断により適用外であり、実装の再導入は行わない。残課題はない。

受け入れ時に orchestrator が前提の消滅を確認した。

| 確認項目               | 結果                                        |
| ---------------------- | ------------------------------------------- |
| 実装                   | `src/schedule-assessment.ts` は存在しない   |
| 対象データ             | `sch-assessment*.yaml` は存在しない         |
| CLI からの到達性       | `schedule` に assessment サブコマンドがない |
| 実装・テストの残存参照 | なし                                        |

廃止は PJR-JFTC の実行（commit `614945e1`）で意図的に行われている。誤警告を出す判定処理そのもの
が失われたため、修正すべき対象がない。

実施しない判断が確定したため、`done` ではなく `rejected` で終端する。判定修正を行っていないため
完了扱いにすると、実施済みの対応があったと誤読される。

## 5. 関連ドキュメント

- 誤警告が判明した項目: [[prj-0001:pjr-enk0-sch-strategy-planning-regenerate|PJR-ENK0 sch-strategy-planningをassessmentから再生成する]]
- 対象機能の廃止判断: [[prj-0001:pjr-jftc-sch-assessment-retirement|PJR-JFTC sch-assessment の廃止可否を判断し approach の決定論的導出へ移行する]]
- Schedule の設計方針: [[specdojo:schedule-design-guide|Schedule設計ガイド]]
- 廃止済みの対象ファイル: `docs/ja/projects/prj-0001/schedule/assessments/sch-assessment-planning.yaml`
- 廃止済みの実装: `src/schedule-assessment.ts`
