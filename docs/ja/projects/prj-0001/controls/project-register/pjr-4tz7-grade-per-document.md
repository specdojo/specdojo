---
specdojo:
  id: prj-0001:pjr-4tz7-grade-per-document
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-08-29T12:49:25Z"
  due_on: "2026-09-30"
  completed_at: "2026-08-29T14:53:21Z"
  conclusion: grade prompt を grade plan へ改称し、対象1件ごとに exec 互換の plan を生成・保存する構成へ変更した。kata のメタデータを索引化し、参照と逆参照から対応する rulebook / recipe / sample / template を解決して参考資料として plan へ含める。参考資料は評価対象には含めない旨を plan へ明記する。plan は execution/grade/plans/`<target>`/ へ対象由来の固定ファイル名で冪等に保存する。Job は1件の判定ごとに apply を実行するため、後続の失敗時も既存の grade と finding は失われない。
---

# PJR-4TZ7 grade を1文書単位の評価へ変更し plan として保存する

## 1. 概要

`grade prompt` は `--path` で指定された全対象を1つの prompt にまとめる。対象数に比例してコンテキストが膨張し、分割の仕組みもないため、kata 285 件を対象にすると破綻する。`--changed-only` で絞る前提だが、初回実行、共通 viewpoint や rubric の更新後、一括修正の後はいずれも全件が対象になる。

評価単位を1文書へ変更する。対応する rulebook / recipe / sample / template を参考資料として添付することで、コンテキストを一定に保ちながら成果物間整合の判定材料を確保する。

あわせて `prompt` を `plan` へ改称し、ファイルとして保存・再利用できるようにする。SpecDojo は agent への指示書を plan と呼んでおり、語彙を揃える。保存された plan は `exec trial` による複数 agent の比較と、同一 plan の再実行による再現性検証に利用できる。

## 2. 完了条件

- 1文書ごとに plan を生成し、対象を順に評価できる。対象数が増えても1回あたりのコンテキストが一定に保たれる。
- 評価対象の文書に対応する実践の型を参考資料として plan へ含め、成果物間整合の観点を判定できる。
- `prompt` から `plan` への改称が CLI、job 定義、規範文書へ反映されている。
- plan がファイルとして保存され、同じ plan を別の agent へ渡して比較できる。
- plan の保存が履歴として蓄積せず、対象ごとに上書きされる。
- 途中で失敗しても、成功済みの文書の評価結果が失われない。
- `npm run check` が通る。

## 3. 作業内容

| No  | 作業                           | 担当 | 状態 | メモ                                            |
| --- | ------------------------------ | ---- | ---- | ----------------------------------------------- |
| 1   | 評価単位と参考資料の範囲の決定 | ARC  | done | 対象1件とメタデータで対応する Kata セット       |
| 2   | plan の保存場所と命名の決定    | ARC  | done | execution 配下へ対象パス由来の固定名で保存      |
| 3   | ループ実行の責務の決定         | ARC  | done | Job / exec が plan を順に処理                   |
| 4   | plan 生成の実装                | ARC  | done | 1文書単位、参考資料の正逆参照解決               |
| 5   | 改称と互換対応                 | ARC  | done | CLI、job-grade-kata、規範文書を `plan` へ統一   |
| 6   | 失敗時の継続と再開の実装       | ARC  | done | 文書ごとに即時 apply して成功済み結果を保持     |
| 7   | 規範文書の更新                 | ARC  | done | command-reference、routine-operation-guide ほか |

### 3.1. 現状の問題

`renderGradePrompt` は `paths: string[]` を受け取り、全ファイルを1つの prompt へ展開する。実測では4件で 46,673 文字だった。単純に比例させると 285 件では 3MB 規模となり、どのモデルのコンテキストにも収まらない。

分割処理は実装されていない。`--changed-only` による絞り込みだけが唯一の緩和策であり、全件が対象になる状況では機能しない。

### 3.2. 参考資料の必要性

比較実験で `opr-batch-sample.md`（22 行）と `opr-rulebook.md`（483 行）の乖離を検出できたのは、両方が同じ prompt に含まれていたためである。

実行ログを確認したところ、参考資料の入手方法は agent によって異なった。claude はファイル読み取りツールを使用せず、prompt に含まれた情報だけで判定した。一方 qwen は関連する rulebook、authoring standard、スキーマをツールで読み込んだうえで判定した。

したがって単純に1文書だけを渡すと、ツールを使わない agent では `vp-arc-cross-document-consistency` のような成果物間整合の観点が判定不能になる。plan に参考資料を含める設計は、agent のツール使用の有無に依存せず判定材料を保証する意味を持つ。評価対象は1件としつつ、対応する実践の型をコンテキストとして添付する必要がある。実践の型は rulebook / recipe / sample / template がセットで対応関係を持つため、セット単位で添付すれば通常 2〜5 ファイルに収まる。

### 3.3. plan として保存する意義

`exec trial` は1つの不変な plan に対して複数 agent を比較する既存機能である。grade の指示書を plan として保存すれば、同じ枠組みで agent の比較ができる。手作業で agent ごとに実行して結果を突き合わせる必要がなくなる。

同一 plan を再実行することで、agent 判定の再現性も測定できる。同じ入力に対するレベル差の実測は PJR-49D2 の残論点であり、plan の保存はその前提となる。

### 3.4. 蓄積させない設計

plan を exec plan と同じく履歴として蓄積すると、定期実行のたびにファイルが増える。grade は状態の観測であり、冪等であることが設計上の要件であるため、履歴の蓄積は要件と矛盾する。

対象文書ごとに1つの plan を持ち、再生成時は上書きする。判断の履歴は評価結果そのもの（Frontmatter の grade）と finding が担う。

### 3.5. 決定事項

- grade は agent を起動せず、1文書単位の plan 生成と GradeSubmission の検証・反映を担う。Job / exec が生成された plan を順に agent へ渡し、各結果を直ちに apply する。文書ごとに完結するため、途中で失敗しても成功済みの grade は保持される。
- 参考資料は対象文書の `rulebook` / `recipe` / `sample` / `template` 参照、対象への逆参照、そこから特定できる rulebook / recipe の宣言先とする。上位 authoring standard は一律添付せず、共通 viewpoint の記述を判定基準とする。
- CLI は `grade plan` へ改称し、`grade prompt` は残さない。全対象を1つの標準出力へ展開する旧契約を残すと、文書単位という不変条件を迂回できるためである。
- plan は既定で `<execution_path>/grade/plans/<target>/` へ保存する。対象パスの basename とハッシュから安定したファイル名を作り、内容が同じ場合は書き換えない。同じ対象は常に同じファイルへ保存される。

## 4. 対応結果

- `renderGradePlan` と `writeGradePlans` を追加し、選択対象ごとに対象文書が1件だけの exec 互換 plan を生成・保存するようにした。plan は `task_id` / `mode` / `project_id` / `targets` を持ち、同一内容を複数 agent へ渡せる。
- Kata のメタデータを索引化し、対象からの参照と対象への逆参照を用いて対応する rulebook / recipe / sample / template を解決した。参考資料は plan に埋め込むが GradeSubmission の評価対象には含めない。
- `grade prompt` を `grade plan` へ置き換え、Job 定義と規範文書を文書単位の逐次処理へ更新した。
- plan の保存先をプロジェクトの `execution/grade/plans/<target>/` とし、対象由来の固定ファイル名へ冪等に保存するようにした。
- Job は1件の agent 判定後に `grade apply --path <document>` を実行してから次の plan へ進む。後続の失敗時も、それ以前の文書に保存した grade と finding は失われない。

## 5. 関連ドキュメント

- [[prj-0001:pjr-49d2-quality-assessment]]: grade の設計と実装。本項目はその実行単位を見直す。
- [[specdojo:exec-operation-guide]]: plan と agent 実行の枠組み。`exec trial` の利用先。
- [[specdojo:command-reference]]: コマンド名と挙動の記載先。
- [[specdojo:routine-operation-guide]]: 定期実行の設定先。
