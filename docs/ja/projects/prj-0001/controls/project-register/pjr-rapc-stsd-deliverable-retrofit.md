---
specdojo:
  id: prj-0001:pjr-rapc-stsd-deliverable-retrofit
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-05T11:25:14Z"
  completed_at: "2026-11-05T12:10:19Z"
  conclusion: 新設。3 状態・4 遷移を 1 図で書き、実装で確かめられない点は検討メモに残した
  derived_from:
    - PJR-3APD
    - PJR-PT5N
  depends_on:
    - PJR-PT5N
  approach: retrofit
  targets:
    - prj-0001:stsd-deliverable
---

# PJR-RAPC stsd-deliverable を確定した Kata と実装に合わせる（retrofit）

## 1. 概要

3APD の段 8。ステータス定義（成果物）を、確定した stsd の Kata と現行の実装（カタログの evidence_refs）に合わせて retrofit する。成果物はまだない

## 2. 入力

- Kata は PJR-PT5N で確定した。代表の 1 件 stsd-task-execution（PJR-Q9AW・PJR-MC63）を書き方の参考にできるが、宣言された資料ではないため、根拠には実装とカタログを使う
- 図の分割は stsd-mermaid-rulebook の閾値を超える場合だけ行い、閾値以下の図は 1 つのままにする（PJR-PT5N）

## 3. 完了条件

- [[stsd-deliverable]] が、[[specdojo:stsd-rulebook]]・[[specdojo:stsd-mermaid-rulebook]] の必須の章・表・図の規則を満たしている（終了点を置くか置かないかと、置かない場合の「概要」の書き方を含む）。
- 状態一覧の状態と遷移の説明の各行が、カタログの `evidence_refs` の実装で確かめられる。実装で確かめられないことは推測で埋めず、`_UNDECIDED_` か今後の検討メモで残す。既存の記述と実装が食い違う場合は、どちらに合わせたかと理由を result に書く。
- 図の分割は、図の rulebook の閾値を超える場合だけ行っている。
- 遷移 ID を振り直していない（既存の文書の場合）。
- `stsd-deliverable` 以外の成果物と Kata は変えていない。Kata に直すべき点を見つけた場合は、変えずに result の申し送りに書く。
- `npm run -s lint:md`・`npm run -s lint:fm`・`npm run -s lint:mermaid` が通っている。

## 4. 作業内容

| No  | 作業                                                             | 担当 | 状態 | メモ |
| --- | ---------------------------------------------------------------- | ---- | ---- | ---- |
| 1   | 実装と既存の記述を照らし、維持・部分反映・作り直し・新設を決める | BA   | open | -    |
| 2   | 文書を直し、検査を通す                                           | BA   | open | -    |

## 5. 対応結果

- 判断: 新設。executor（sol）が [[stsd-deliverable]] を作った（a96b0a206）。3 状態（`draft`・`ready`・`deprecated`）と 4 遷移（T-01〜T-04）を、1 つの図と遷移の表に書いた。図の rulebook の閾値以下のため分割していない。
- 根拠: `src/deliverable/deliverable.ts` と `src/deliverable/trash.ts` を読んだ。実装は状態の値を検証・変更しないため、状態値と遷移の意図はカタログ・ドキュメントメタ情報標準・ID とファイル命名の標準を根拠にし、実装で確かめられない点は図表を機械的に保証された動作として扱わないと明記した。廃棄（`trash/` への移動）は状態を変えない保管場所の変更として、自己遷移にしていない。
- 未決: 依存先の `bdd-deliverable` はまだない。承認者・受入条件・証跡、`ready` から `draft` への戻り、後継のない廃止、規約外の値の扱いは、推測で埋めず今後の検討メモに残した。
- orchestrator の確認: 変わった成果物は対象の 1 件だけで、Kata は変わっていない。親の検証はすべて通った。

## 6. 関連ドキュメント

- `stsd-deliverable`: 対象の成果物
- [[specdojo:stsd-rulebook]]・[[specdojo:stsd-mermaid-rulebook]]: 確定した Kata（PJR-PT5N）
