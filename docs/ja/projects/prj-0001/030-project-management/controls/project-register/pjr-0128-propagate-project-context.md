---
specdojo:
  id: prj-0001:pjr-0128-propagate-project-context
  type: project
  status: draft
  rulebook: pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
---

# PJR-0128 exec planへproject contextを伝播

## 1. 概要

guided な agent 実行では exec plan に列挙された参考資料と `depends_on` 成果物だけが参照範囲となるため、`prj-overview` の Why が直接依存しない成果物へ届かない。作成順序・根拠関係を表す `depends_on` は変更せず、プロジェクト共通文脈を渡す独立した仕組みを設け、対象となる edit / review plan へ `prj-overview` を確実に伝播する。

## 2. 完了条件

- `depends_on` と意味・用途を分離した project context の設定方法と適用範囲が定義されている。
- 対象となる edit / review plan に `prj-overview` の解決済み参照が生成され、実行 agent へ確実に渡る。
- 機械的な生成・保守タスクなど、project context が不要なタスクの除外または opt-out 方針が定義されている。
- project context の追加によって schedule の実行順序、`based_on` の検証、commit scope が変化しない。
- agent への指示に、プロジェクトレベルの Why を参照しつつ全文を後続文書へ再掲しない原則が含まれている。
- plan 生成の単体テスト、関連する lint、build が成功する。

## 3. 作業内容

<!-- prettier-ignore -->
| No | 作業 | 担当 | 状態 | メモ |
| --- | --- | --- | --- | --- |
| 1 | project context の設定単位、既定値、対象タスク、除外条件を設計する | ARC | open | `depends_on` とは分離する |
| 2 | 設定 schema・型・読み込み処理へ project context を追加する | ARC | open | 後方互換性を維持 |
| 3 | exec plan に project context セクションと解決済み参照を生成する | ARC | open | plan が agent へ届く共通入力 |
| 4 | 参照方針と重複記述を避ける原則を guide / plan template に反映する | ARC | open | Why は参照し、本文は成果物責務へ集中 |
| 5 | schedule・based_on・commit scope が不変であることを含むテストを追加する | ARC | open | edit / review の双方を確認 |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-0122|launch trackの振り返り]] — 起票元
- [[prj-0001:pjr-0127-clarify-project-why|prj-overviewのプロジェクトWhyを明確化]] — 先行して参照内容を明確化
- [[prj-0001:prj-overview|プロジェクト概要]] — project context の既定参照先
- [[specdojo-reference-materials-guide]] — 現行の参照範囲と反映先
