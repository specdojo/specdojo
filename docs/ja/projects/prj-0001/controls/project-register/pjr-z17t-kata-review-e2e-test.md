---
specdojo:
  id: prj-0001:pjr-z17t-kata-review-e2e-test
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: medium
  registered_at: "2026-11-22T03:13:03Z"
  derived_from:
    - PJR-PP4X
---

# PJR-Z17T 型の schedule の review の段を通しで試す統合テストがない

## 1. 概要

PJR-E4R5 の型の grade と review の段の事前の grade の組み合わせが試されておらず、第 3 波の 090 で初めて食い違いが分かった。fixture の型の schedule で review の段を 1 回通す統合テストを足す。

## 2. 入力

- 利用者の承認（2026-11-22、indie）で起票した。

## 3. 完了条件

- `tests/src/exec/kata-review-stage.integration.test.ts` を新しく作る。一時リポジトリに、intent が `improve-kata` で review の段の代表が sample である型の schedule の fixture を置き、review の段を 1 回通す。agent と grade は、既存の統合テストと同じく fixture のコマンドで代える。
- このテストで次を確かめる。
  - review の前の grade が `kata` で 1 回だけ流れる。
  - review の plan の「grade の対象種別」が `kata` になる。
  - executor が `grade list --changed-only` を失敗と記録しても block にならず、verdict が記録される。
  - 型の grade が `needs-work` のとき、review が完了にならない。
- テストで不具合が見つかっても、直すのはこの範囲だけにする。ほかの問題は個票の対応結果に書き、起票を提案する。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。テストだけの変更なら「なし」と書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証（`test-integration` を含む）を通す。

## 4. 作業内容

| No  | 作業                                                      | 担当     | 状態 | メモ                         |
| --- | --------------------------------------------------------- | -------- | ---- | ---------------------------- |
| 1   | 型の schedule の fixture と review の段の統合テストを作る | executor | open | -                            |
| 2   | テストで見つかった問題を対応結果に書く                    | executor | open | 範囲外の問題は起票を提案する |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
