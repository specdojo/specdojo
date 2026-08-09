---
specdojo:
  id: prj-0001:pjr-0128-propagate-project-context
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: ARC
  due_on: "2026-07-31"
  completed_on: "2026-07-26"
  conclusion: project contextをtemplateに追加
---

# PJR-0128 exec planへproject contextを伝播

## 1. 概要

全ての対象成果物生成でprj-overviewを参照できるよう、depends_onと分離したproject contextをexec planへ追加する

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
| 1 | project context の設定単位、既定値、対象タスク、除外条件を設計する | ARC | done | project 単位、既定 `prj-overview`、`[]` で opt-out。maintenance / finalize / 非成果物 / 自己参照を除外 |
| 2 | 設定 schema・型・読み込み処理へ project context を追加する | ARC | done | `project_context?: string[]` と入力検証・既定値解決を追加し、既存設定との後方互換性を維持 |
| 3 | exec plan に project context セクションと解決済み参照を生成する | ARC | done | bare ID を project 修飾し、edit / review plan の独立セクションへ生成 |
| 4 | 参照方針と重複記述を避ける原則を guide / plan template に反映する | ARC | done | Why を判断軸として読み、全文は再掲せず成果物責務に必要な影響だけを反映するよう明記 |
| 5 | schedule・based_on・commit scope が不変であることを含むテストを追加する | ARC | done | edit / review、opt-out、除外、`depends_on` と `targets` の非変更を確認 |

## 4. 対応結果

- `.specdojo/specdojo.config.json` の project 設定に `project_context` を追加した。省略時は `["prj-overview"]`、空配列は project 単位の opt-out として扱う。
- project context を project 解決結果から全ての成果物 plan 生成経路へ伝播し、edit / review plan に `depends_on` と独立した「プロジェクトコンテキスト」を生成するようにした。
- `prj-overview` は `[[<project-id>:prj-overview]]` として解決可能な参照を出力し、実行 agent に作業前の参照、Why・用語・判断原則との整合、全文を再掲しない原則を指示するようにした。
- 参考資料 maintenance、human finalize、成果物を解決できない機械的タスク、context 文書自身は除外した。project context は plan 本文だけに追加し、schedule、`depends_on` / `based_on`、frontmatter `targets` と commit scope には追加していない。
- [[specdojo:kata-guide|SpecDojo 参考資料活用ガイド]]、CLI の project 設定例、edit / review plan テンプレートを更新した。
- plan 生成・project 設定の単体テスト 61 件、関連 ESLint、TypeScript build が成功した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-0122-review-launch|launch trackの振り返り]] — 起票元
- [[prj-0001:pjr-0127-clarify-project-why|prj-overviewのプロジェクトWhyを明確化]] — 先行して参照内容を明確化
- [[prj-0001:prj-overview|プロジェクト概要]] — project context の既定参照先
- [[specdojo:kata-guide]] — 現行の参照範囲と反映先
