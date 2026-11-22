---
specdojo:
  id: prj-0001:pjr-z8mq-kata-wave-3-utc-index-fix
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
  registered_at: "2026-11-22T05:40:23Z"
  derived_from:
    - PJR-ABY4
---

# PJR-Z8MQ 第 3 波の utc-index の型を grade の指摘に沿って直す

## 1. 概要

第 3 波の 090 で utc-index の型（rulebook pass 91（minor 6）、sample needs-work 92（major 1・minor 7））が合格に届かなかったため、grade の指摘を直して評価し直す

## 2. 入力

- 2026-11-22、T-KATA-WAVE-3-utc-index-sample-090 の review で、型の評価は rulebook pass 91（minor 6）、sample needs-work 92（major 1・minor 7） だった。指摘は docs/ja/projects/prj-0001/execution/grade/results/specdojo.utc-index-rulebook.yaml と specdojo.utc-index-sample.yaml にある。
- 合格は、機械的な「未解決の `_TODO_` / `_ASSUMPTION_`」の指摘（PJR-7C9X）を除いて、rulebook と sample に blocker と major がないこととする（indie の判断、2026-11-22）。
- `_TODO_` は sample に残さない。`_ASSUMPTION_` は docs/ja/specdojo/standards/sample-authoring-standard.md に従って残してよい。

## 3. 完了条件

- 変えるのは `docs/ja/specdojo/rulebooks/utc-index-rulebook.md` と `docs/ja/specdojo/samples/utc-index-sample.md` だけとする。ほかの型の rulebook・sample・recipe・template は変えない。
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.utc-index-rulebook.yaml` と `docs/ja/projects/prj-0001/execution/grade/results/specdojo.utc-index-sample.yaml` の `findings` を 1 件ずつ直す。直さない指摘は、ID と理由を個票の対応結果に書く。
- sample の F008（機械的な「未解決の _TODO_ / _ASSUMPTION_」の指摘、PJR-7C9X）は、`_TODO_` を解消して扱う。sample に `_TODO_` を残さない。`_ASSUMPTION_` は `sample-authoring-standard` に従って残してよい。
- rulebook を変えた場合は、sample が rulebook に従っていることを確かめ、食い違いがあれば sample も直す。
- `CHANGELOG.md` は変えない。個票の対応結果の `### 5.1. CHANGELOG に書く事項` に「なし」（文書の型の手直しのため）と書く。
- `npm run lint:md` を通し、親の検証を通す。
- 統合の後、オーケストレーターが `npx specdojo grade run --target kata --kata utc-index` で評価し直し、rulebook と sample に blocker と major がないことを確かめる。機械的な指摘（PJR-7C9X）だけが残る場合は合格とし、そのことを個票の対応結果に書く。合格しなければ、この項目に回目の完了条件を足して流し直す。

## 4. 作業内容

| No  | 作業                               | 担当                  | 状態 | メモ                                       |
| --- | ---------------------------------- | --------------------- | ---- | ------------------------------------------ |
| 1   | grade の指摘を読み、直し方を決める | DEV                   | done | 直さない指摘なし                           |
| 2   | rulebook と sample を直す          | DEV                   | done | ほかの型は変えていない                     |
| 3   | lint と親の検証を通す              | DEV                   | done | lint:md 通過                               |
| 4   | 統合の後に grade で評価し直す      | specdojo-orchestrator | open | executor は grade を起動できないため未実施 |

## 5. 対応結果

rulebook 6 件・sample 8 件の指摘をすべて直した。直さない指摘はない。

- rulebook: F001 は 6.3.2 の空の表を外して典型例の表に統合。F002 は禁止事項から「大量に」を削除。F003・F006 は `_UNDECIDED_` を recipe・template の要否だけに更新。F004 は「E2E」を ST/AT に統一。F005 は「テストダブルの使い分け」へ改名。
- sample: F001・F007 は各論点に決める時期を足し、ready 前に解消する論点を明記。F002 はタイムアウトと非同期・並行性の扱いを追記。F003 は採用理由を業務影響で書き直し。F004 は通信不能時の担保先を明記。F005 は記入例の `証跡` が CI 整備後の書き方である旨を注記。F006 は「以上」にそろえた。F008 は `_TODO_` を解消した（`_ASSUMPTION_` と `_UNDECIDED_` は残す）。
- rulebook の変更後も sample は本文要件の9見出し・10カラムに従っている。
- 統合後の `npx specdojo grade run --target kata --kata utc-index` による再評価は未実施（オーケストレーターが行う）。機械的な指摘（PJR-7C9X）だけが残る場合は合格とする。

### 5.1. CHANGELOG に書く事項

なし（文書の型の手直しのため）。

### 5.2. 統合後の評価し直し

- 2026-11-22、オーケストレーターが `npx specdojo grade run --target kata --kata utc-index`（run id `regrade-wave3-fix-2026-11-22`、opus-review-executor）で評価し直した。
- `utc-index-rulebook`: pass、score 95（minor 2、2026-11-22T06:42:50.256Z）
- `utc-index-sample`: needs-work、score 96（minor 2・major 1、2026-11-22T06:43:52.489Z）
- 残った major は sample の F002（機械的な「未解決の _TODO_ / _ASSUMPTION_」の指摘、PJR-7C9X）だけで、sample の `_TODO_` は 0 件、`_ASSUMPTION_` だけが残る。合格の基準（この指摘を除いて blocker と major がない）を満たすため、合格とした。

## 6. 関連ドキュメント

- [[specdojo:utc-index-rulebook]]
- [[specdojo:utc-index-sample]]
