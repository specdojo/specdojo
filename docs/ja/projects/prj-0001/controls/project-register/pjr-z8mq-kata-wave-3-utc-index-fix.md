---
specdojo:
  id: prj-0001:pjr-z8mq-kata-wave-3-utc-index-fix
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
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

| No  | 作業                               | 担当                  | 状態 | メモ                     |
| --- | ---------------------------------- | --------------------- | ---- | ------------------------ |
| 1   | grade の指摘を読み、直し方を決める | DEV                   | open | 直さない指摘は理由を残す |
| 2   | rulebook と sample を直す          | DEV                   | open | ほかの型は変えない       |
| 3   | lint と親の検証を通す              | DEV                   | open | -                        |
| 4   | 統合の後に grade で評価し直す      | specdojo-orchestrator | open | 合格しなければ回目を足す |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
