---
specdojo:
  id: prj-0001:pjr-4tz7-grade-per-document
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-08-29T12:49:25Z"
  due_on: "2026-09-30"
  register_events:
    - v: 1
      id: reg_fd510476614241c9b4579e1a7b91ce1e
      ts: "2026-08-29T12:49:26Z"
      action: add
      actor: manual
      from_status: null
      to_status: open
      reason: item added
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: grade を1文書単位の評価へ変更し plan として保存する
        - field: description
          from: ""
          to: grade prompt は指定された全対象を1つの prompt にまとめるため、対象数に比例してコンテキストが膨張し、kata 285 件では破綻する。分割の仕組みもない。評価単位を1文書へ変更し、対応する rulebook / recipe / sample / template を参考資料として添付することで、コンテキストを一定に保ちつつ成果物間整合の判定材料を確保する。あわせて prompt を plan へ改称し、ファイルとして保存・再利用できるようにする。exec trial による複数 agent の比較や、同一 plan の再実行による再現性検証に利用できる。ただし plan を履歴として蓄積すると冪等性が失われるため、対象ごとに上書きする設計とする。
        - field: type
          from: ""
          to: todo
        - field: priority
          from: ""
          to: medium
        - field: owner
          from: ""
          to: ARC
        - field: registered
          from: ""
          to: "2026-08-29"
        - field: due
          from: ""
          to: "2026-09-30"
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

| No  | 作業                           | 担当   | 状態 | メモ                                            |
| --- | ------------------------------ | ------ | ---- | ----------------------------------------------- |
| 1   | 評価単位と参考資料の範囲の決定 | ARC    | open | 対象1件に対してどの実践の型を添付するか         |
| 2   | plan の保存場所と命名の決定    | ARC    | open | 履歴として蓄積させない置き場所                  |
| 3   | ループ実行の責務の決定         | ARC    | open | CLI 内で回すか job / exec 側で回すか            |
| 4   | plan 生成の実装                | _TODO_ | open | 1文書単位、参考資料の解決                       |
| 5   | 改称と互換対応                 | _TODO_ | open | CLI、job-grade-kata、規範文書                   |
| 6   | 失敗時の継続と再開の実装       | _TODO_ | open | 成功済みの結果を保持する                        |
| 7   | 規範文書の更新                 | _TODO_ | open | command-reference、routine-operation-guide ほか |

### 3.1. 現状の問題

`renderGradePrompt` は `paths: string[]` を受け取り、全ファイルを1つの prompt へ展開する。実測では4件で 46,673 文字だった。単純に比例させると 285 件では 3MB 規模となり、どのモデルのコンテキストにも収まらない。

分割処理は実装されていない。`--changed-only` による絞り込みだけが唯一の緩和策であり、全件が対象になる状況では機能しない。

### 3.2. 参考資料の必要性

比較実験で `opr-batch-sample.md`（22 行）と `opr-rulebook.md`（483 行）の乖離を検出できたのは、両方が同じ prompt に含まれていたためである。実行ログを確認したところ、agent はファイル読み取りツールを使用しておらず、plan に含まれた情報だけで判定していた。

したがって単純に1文書だけを渡すと、`vp-arc-cross-document-consistency` のような成果物間整合の観点が判定不能になる。評価対象は1件としつつ、対応する実践の型をコンテキストとして添付する必要がある。実践の型は rulebook / recipe / sample / template がセットで対応関係を持つため、セット単位で添付すれば通常 2〜5 ファイルに収まる。

### 3.3. plan として保存する意義

`exec trial` は1つの不変な plan に対して複数 agent を比較する既存機能である。grade の指示書を plan として保存すれば、同じ枠組みで agent の比較ができる。手作業で agent ごとに実行して結果を突き合わせる必要がなくなる。

同一 plan を再実行することで、agent 判定の再現性も測定できる。同じ入力に対するレベル差の実測は PJR-49D2 の残論点であり、plan の保存はその前提となる。

### 3.4. 蓄積させない設計

plan を exec plan と同じく履歴として蓄積すると、定期実行のたびにファイルが増える。grade は状態の観測であり、冪等であることが設計上の要件であるため、履歴の蓄積は要件と矛盾する。

対象文書ごとに1つの plan を持ち、再生成時は上書きする。判断の履歴は評価結果そのもの（Frontmatter の grade）と finding が担う。

### 3.5. 未決の論点

- ループ実行の責務。grade が agent を起動しない現在の責務分離を保つなら job / exec 側で回すことになるが、285 件分の exec タスクを作るのは現実的でない。grade 側にループ実行を持たせる場合、agent 起動の責務が増える点をどう整理するか。
- 参考資料の解決範囲。実践の型のセットに加えて、上位の authoring standard を含めるかどうか。含めるとコンテキストが増える一方、規範との整合をより正確に判定できる。
- 改称に伴う互換性。`grade prompt` を残すか、`plan` のみとするか。

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-49d2-quality-assessment]]: grade の設計と実装。本項目はその実行単位を見直す。
- [[specdojo:exec-operation-guide]]: plan と agent 実行の枠組み。`exec trial` の利用先。
- [[specdojo:command-reference]]: コマンド名と挙動の記載先。
- [[specdojo:routine-operation-guide]]: 定期実行の設定先。
