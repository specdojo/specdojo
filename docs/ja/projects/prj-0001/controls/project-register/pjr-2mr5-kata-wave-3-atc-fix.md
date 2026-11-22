---
specdojo:
  id: prj-0001:pjr-2mr5-kata-wave-3-atc-fix
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-22T05:42:33Z"
  derived_from:
    - PJR-ABY4
---

# PJR-2MR5 第 3 波の atc の型を grade の指摘に沿って直す

## 1. 概要

第 3 波の 090 で atc の型（rulebook pass 98（minor 2）、sample needs-work 87（major 3・minor 2））が合格に届かなかったため、grade の指摘を直して評価し直す

## 2. 入力

- 2026-11-22、T-KATA-WAVE-3-atc-sample-090 の review で、型の評価は rulebook pass 98（minor 2）、sample needs-work 87（major 3・minor 2） だった。指摘は docs/ja/projects/prj-0001/execution/grade/results/specdojo.atc-rulebook.yaml と specdojo.atc-sample.yaml にある。
- 合格は、機械的な「未解決の `_TODO_` / `_ASSUMPTION_`」の指摘（PJR-7C9X）を除いて、rulebook と sample に blocker と major がないこととする（indie の判断、2026-11-22）。
- `_TODO_` は sample に残さない。`_ASSUMPTION_` は sample-authoring-standard（sample の記述の標準、読むだけで変えない）に従って残してよい。

## 3. 完了条件

- 変えるのは `docs/ja/specdojo/rulebooks/atc-rulebook.md` と `docs/ja/specdojo/samples/atc-sample.md` だけとする。ほかの型の rulebook・sample・recipe・template は変えない。
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.atc-rulebook.yaml` と `docs/ja/projects/prj-0001/execution/grade/results/specdojo.atc-sample.yaml` の `findings` を 1 件ずつ直す。直さない指摘は、ID と理由を個票の対応結果に書く。
- sample の F005（機械的な「未解決の _TODO_ / _ASSUMPTION_」の指摘、PJR-7C9X）は、`_TODO_` を解消して扱う。sample に `_TODO_` を残さない。`_ASSUMPTION_` は `sample-authoring-standard` に従って残してよい。
- sample の F001・F003（major）: `at-cash-sale-transaction-check-010` の店番の交代が、`atc-index-sample` の「店番の交代は atc-sale-hold の引継ぎ経路だけで確かめる」と食い違う。`atc-index-sample` は変えず、本書を交代を伴わない照合に改める。
- rulebook を変えた場合は、sample が rulebook に従っていることを確かめ、食い違いがあれば sample も直す。
- `CHANGELOG.md` は変えない。個票の対応結果の `### 5.1. CHANGELOG に書く事項` に「なし」（文書の型の手直しのため）と書く。
- `npm run lint:md` を通し、親の検証を通す。
- 統合の後、オーケストレーターが `npx specdojo grade run --target kata --kata atc` で評価し直し、rulebook と sample に blocker と major がないことを確かめる。機械的な指摘（PJR-7C9X）だけが残る場合は合格とし、そのことを個票の対応結果に書く。合格しなければ、この項目に回目の完了条件を足して流し直す。

## 4. 作業内容

| No  | 作業                               | 担当                  | 状態 | メモ                                |
| --- | ---------------------------------- | --------------------- | ---- | ----------------------------------- |
| 1   | grade の指摘を読み、直し方を決める | DEV                   | done | 全指摘を直す方針とした              |
| 2   | rulebook と sample を直す          | DEV                   | done | ほかの型は変えていない              |
| 3   | lint と親の検証を通す              | DEV                   | open | lint と親の検証は runner が実行する |
| 4   | 統合の後に grade で評価し直す      | specdojo-orchestrator | open | 合格しなければ回目を足す            |

## 5. 対応結果

- sample（`atc-sample.md`）: F001・F003（major）・F002 は、`at-cash-sale-transaction-check-010` を店番の交代を伴わない照合に改めて直した（責務・観点の意図・概要も合わせた）。`atc-index-sample` は変えていない。F004 は「term」を「このカタログ（`atc-cash-sale`）」に言い換えた。
- F005（機械的な未解決 `_ASSUMPTION_` の指摘、PJR-7C9X）は `_ASSUMPTION_` が `sample-authoring-standard` に従う残し方のため、残す。sample に `_TODO_` はない。
- rulebook（`atc-rulebook.md`）: F001・F002（minor）は、`_UNDECIDED_` から解消済みの「sample の未整合」の記述を削り、recipe・template の要否だけに更新した。
- 統合後の `npx specdojo grade run --target kata --kata atc` による再評価は、オーケストレーターが行う（作業 4 は open）。

### 5.1. CHANGELOG に書く事項

なし（文書の型の手直しのため）。

### 5.2. 統合後の評価し直し

- 2026-11-22、オーケストレーターが `npx specdojo grade run --target kata --kata atc`（run id `regrade-wave3-fix-2026-11-22`、opus-review-executor）で評価し直した。
- `atc-rulebook`: pass、score 98（minor 1、2026-11-22T06:54:14.991Z）
- `atc-sample`: needs-work、score 96（minor 1・major 1、2026-11-22T06:55:11.379Z）
- 残った major は sample の F002（機械的な「未解決の _TODO_ / _ASSUMPTION_」の指摘、PJR-7C9X）だけで、sample の `_TODO_` は 0 件、`_ASSUMPTION_` だけが残る。合格の基準（この指摘を除いて blocker と major がない）を満たすため、合格とした。

## 6. 関連ドキュメント

- [[specdojo:atc-rulebook]]
- [[specdojo:atc-sample]]
- [[specdojo:atc-index-sample]]
