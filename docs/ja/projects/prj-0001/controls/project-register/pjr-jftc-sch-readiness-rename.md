---
specdojo:
  id: prj-0001:pjr-jftc-sch-readiness-rename
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-08-29T00:39:35Z"
  due_on: "2026-09-30"
  register_events:
    - v: 1
      id: reg_d456456e8e514734bf5fdae2b5de387a
      ts: "2026-08-29T00:39:35Z"
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
          to: sch-assessment を sch-readiness へ改名する
        - field: description
          from: ""
          to: sch-assessment は track 単位の成果物と kata の整備状況（readiness）を評価するものだが、名前が汎用語のため PJR-49D2 の品質評価と紛らわしい。評価対象が名前から分かるよう sch-readiness へ改名する。schema、実データ 3 track、src 5 ファイル、tests 4 ファイル、規範文書が対象。execution 配下の plan / result 42 件は当時の実行記録のため書き換えず、旧名が履歴に残ることを許容する。PJR-49D2 の設計と facts 連携が固まってから着手し、データ移行を 1 回で済ませる。
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

# PJR-JFTC sch-assessment を sch-readiness へ改名する

## 1. 概要

`sch-assessment` は track 単位で成果物と kata（rulebook / recipe / sample / template）の整備状況を評価し、`recommended_approach` を導くものである。schema の description 自身が readiness と説明しているにもかかわらず、名前が `assessment` という汎用語のため、何を評価するのかが名前から読み取れない。

PJR-49D2 で品質評価の仕組みを追加すると、評価対象の異なる2つの評価が併存する。両者を名前で区別できるよう、整備状況の評価であることを示す `sch-readiness` へ改名する。

改名しても `execution` 配下の plan / result には旧名が残る。これらは当時の実行事実の記録であり、遡って書き換えない。

## 2. 完了条件

- schema ファイル名と `$id`、生成される YAML ファイル名、生成ページが `sch-readiness` へ揃っている。
- 既存 3 track の実データが新名称へ移行され、schedule 関連コマンドが再実行できる。
- `src` / `tests` の識別子とファイル名が新名称へ揃っている。
- 規範文書（rulebook / reference / guide）の記述が新名称へ更新されている。
- `execution` 配下の履歴ファイルを書き換えていない。
- `npm run check` が通る。

## 3. 作業内容

| No  | 作業                       | 担当   | 状態 | メモ                                                 |
| --- | -------------------------- | ------ | ---- | ---------------------------------------------------- |
| 1   | 改名対象の確定             | ARC    | open | 識別子、ファイル名、ディレクトリ名の範囲を決める     |
| 2   | schema と実データの移行    | _TODO_ | open | schema、3 track の YAML、生成ページ                  |
| 3   | 実装とテストの更新         | _TODO_ | open | `src` 5 ファイル、`tests` 4 ファイル                 |
| 4   | 規範文書の更新             | _TODO_ | open | sch-rulebook、dct-rulebook、command-reference ほか   |
| 5   | 履歴ファイルの扱いの明文化 | ARC    | open | 旧名が履歴に残ることを規範文書のどこに記すかを決める |

### 3.1. 影響範囲

`sch-assessment` を参照するファイルは 63 件ある。

| 区分                     | 件数 | 扱い                                    |
| ------------------------ | ---- | --------------------------------------- |
| `docs/ja/**/execution/`  | 42   | 書き換えない。過去の実行記録            |
| `docs/ja/**/controls/`   | 13   | 個票など履歴に当たるものは書き換えない  |
| `docs/ja/**/schedule/`   | 12   | 移行対象。実データ 3 track と生成ページ |
| `src/`                   | 5    | 移行対象                                |
| `tests/src/`             | 4    | 移行対象                                |
| `docs/ja/specdojo/`      | 8    | 移行対象。rulebook / reference / guide  |
| `docs/specdojo/schemas/` | 1    | 移行対象                                |

### 3.2. 履歴ファイルを書き換えない理由

plan / result は実行時点の事実の記録であり、当時の名前で記述されていることが正しい。遡及して書き換えると、記録と実際の実行内容が食い違う。改名後は新旧の名称が混在するが、これは許容する。読み手が混乱しないよう、改名した事実と時期を規範文書へ記す。

### 3.3. 着手の前提

PJR-49D2 で品質評価の設計と、品質評価結果を readiness の `facts` へ取り込む連携の形が固まってから着手する。設計が動いている段階で改名すると、移行作業が二度発生する。

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-49d2-quality-assessment]]: 改名の動機となる品質評価の TODO。設計確定が着手の前提。
- [[specdojo:schedule-design-guide]]: readiness 評価の位置づけを記載する文書。
- [[specdojo:schedule-operation-guide]]: 改名後の運用手順の反映先。
- [[specdojo:command-reference]]: コマンドと生成物名の記載を更新する。
