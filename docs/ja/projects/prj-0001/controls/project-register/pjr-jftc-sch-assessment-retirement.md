---
specdojo:
  id: prj-0001:pjr-jftc-sch-assessment-retirement
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
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
    - v: 1
      id: reg_c4a2eafa366542a8aea76417691db51c
      ts: "2026-08-29T06:49:05Z"
      action: update
      actor: manual
      from_status: open
      to_status: open
      reason: PJR-49D2 の品質評価により judgment の大部分が決定論化できるため、改名ではなく廃止可否の判断に組み替える
      changes:
        - field: title
          from: sch-assessment を sch-readiness へ改名する
          to: sch-assessment の廃止可否を判断し approach の決定論的導出へ移行する
        - field: description
          from: "`sch-assessment` は track 単位で成果物と kata（rulebook / recipe / sample / template）の整備状況を評価し、`recommended_approach` を導くものである。schema の description 自身が readiness と説明しているにもかかわらず、名前が `assessment` という汎用語のため、何を評価するのかが名前から読み取れない。"
          to: specdojo grade が kata usability の judgment を代替できるため、sch-assessment の agent 判定は intent の決定を残すのみとなる。intent を strategy 側の宣言で表現できれば recommended_approach は決定論的に導出でき、agent 再実行を避けるための保存という sch-assessment の存在理由が消える。判断の履歴は exec plan が持つため、成果物としてのファイルは不要になる見込み。intent 宣言化の可否を検証し、可能なら sch-assessment を廃止して schedule 生成時の都度導出へ移行する。廃止しない場合に限り sch-readiness などへの改名を検討する。
      previous_event_id: reg_d456456e8e514734bf5fdae2b5de387a
    - v: 1
      id: reg_8e73b42c62564da6b03f1a8437b41160
      ts: "2026-08-29T10:27:56Z"
      action: start
      actor: codex-expert-executor
      from_status: open
      to_status: in-progress
      reason: work started
      changes:
        - field: status
          from: open
          to: in-progress
      previous_event_id: reg_c4a2eafa366542a8aea76417691db51c
---

# PJR-JFTC sch-assessment の廃止可否を判断し approach の決定論的導出へ移行する

## 1. 概要

`sch-assessment` は track 単位で成果物と kata の整備状況を評価し、`recommended_approach` を導く。schema の description が示すその存在理由は、agent が書いた judgment を保存し、後続の生成器が agent を再実行せずに済むようにすることである。

PJR-49D2 の品質評価（`specdojo grade`）を導入すると、`KataJudgment` の 4 つの check のうち 3 つが grade で代替でき、残る `target-fit` も `facts.kata[].declaration` でほぼ事実として決まる。agent 判定として残るのは `intent` のみとなる。

`intent` を strategy 側の宣言で表現できれば `recommended_approach` は決定論的に導出でき、agent 再実行を避けるための保存という存在理由が消える。判断の履歴は exec plan が既に保持しているため、成果物としての `sch-assessment` は不要になる見込みである。

本項目では intent 宣言化の可否を検証し、可能なら `sch-assessment` を廃止して schedule 生成時の都度導出へ移行する。廃止しない場合に限り、名称が汎用語で品質評価と紛らわしい問題への対処として改名を検討する。

## 2. 完了条件

- `TaskIntent` の 7 種すべてについて、strategy 側の宣言で表現できるかを検証し、結論が記録されている。
- 廃止する場合は、`recommended_approach` が strategy の宣言、facts、grade から決定論的に導出され、agent を起動せずに schedule を生成できる。
- 廃止する場合は、`docs/` 配下の `sch-assessment-<track>.yaml` と生成ページが削除され、schema と実装が整理されている。
- facts をキャッシュとして残す場合は、`docs/` 配下の成果物ではなく `.specdojo/` 配下へ置かれている。
- 導出できない入力に対しては、暫定値で進まずエラーとして停止する。
- `execution` 配下の plan / result は書き換えていない。
- 廃止しない場合は、改名の要否と改名先の名称が決定されている。
- `npm run check` が通る。

## 3. 作業内容

| No  | 作業                            | 担当 | 状態 | メモ                                                   |
| --- | ------------------------------- | ---- | ---- | ------------------------------------------------------ |
| 1   | intent 宣言化の可否検証         | ARC  | done | 7 種すべてを `approach_rules` で表現可能と確認         |
| 2   | 廃止可否の判断                  | ARC  | done | 派生値の重複保存となるため廃止を決定                   |
| 3   | 決定論的な approach 導出の実装  | ARC  | done | strategy の宣言、facts、grade から都度導出             |
| 4   | facts の扱いの決定              | ARC  | done | 収集が軽量なためキャッシュせず都度収集                 |
| 5   | sch-assessment の削除と実装整理 | ARC  | done | schema、実データ、CLI、agent prompt、専用テストを削除  |
| 6   | 規範文書の更新                  | ARC  | done | sch-rulebook、dct-rulebook、command-reference ほか更新 |

### 3.1. grade が代替できる範囲

`KataJudgment` は 4 つの check の全 pass で `usability: usable` を決める。この 4 つと grade の軸は次のように対応する。

| check                  | 内容                                    | 代替手段                                 |
| ---------------------- | --------------------------------------- | ---------------------------------------- |
| `substantive-content`  | 空・プレースホルダ主体でないか          | grade の該当観点（実質的内容の充足）     |
| `internal-consistency` | 同じ set の他 kata と致命的矛盾がないか | grade の該当観点（文書内・文書間の整合） |
| `standard-alignment`   | 現行 rulebook / schema と整合しているか | grade の該当観点（規範との整合）         |
| `target-fit`           | その成果物向けの内容か                  | facts の `declaration` でほぼ決まる      |

観点と grade の対応の具体的な割り当ては、PJR-49D2 の観点一本化設計で確定する。

`target-fit` は文書単体の品質ではなく成果物との対応関係の判定であるため grade の対象外だが、`facts.kata[].declaration` が `declared` または `conventional` であれば規約上その成果物向けである。agent 判定が必要なのは、宣言はあるが中身が別物という異常系に限られる。

### 3.2. 決定論化のボトルネックは intent

`recommended_approach` は `intent` と usability から決定的ルールで導出される。したがって usability が決定論化された後、残るボトルネックは `intent` だけである。

`intent` は成果物や kata の品質からは導けない。同じ状態の成果物に対して実装を反映したいのか重複を整理したいのかは、プロジェクトの目的の問題である。schema の description も、kata readiness で決まるのは `author-deliverable` のみであり、他は目的別のフェーズであると明記している。

`sch-strategy.schema.yaml` には phase_set 単位で既定 approach を宣言する仕組みが既にある。同様に intent を宣言できるかを検証する。同じ phase_set 内で成果物ごとに intent が分かれるケースを表現できるかが焦点となる。

### 3.3. 廃止した場合の構造

```text
strategy（intent を宣言）＋ facts（コードが収集）＋ grade（品質の事実）
  → recommended_approach を決定的に導出（agent 起動なし）
```

判断の履歴は exec plan が保持する。plan には approach が記録され、履歴として蓄積されるため、過去の判断の追跡はそちらが正本となる。決定論的な導出結果を版管理下の成果物として別途保存すると、派生値の重複保存になる。

導出できない場合は暫定値で進めず、入力不足としてエラー停止する。追跡が必要な問いは登録簿の question として起票する。

facts の収集コストが問題になる場合は、`.specdojo/doc-index.json` と同じ位置づけのキャッシュとして残す。この場合も `docs/` 配下の成果物としては存在しない。

### 3.4. 廃止しない場合

intent の宣言化が一部のケースで成立せず agent 判定が残るなら、その judgment を保存する場所が必要になる。その場合は `sch-assessment` を縮退させたうえで、名称が汎用語で品質評価と紛らわしい問題に対処する。

このとき主責務が readiness 評価ではなく approach の決定であれば、`sch-readiness` よりも `sch-approach` が実態に合う。readiness の事実は grade と facts が保持するためである。

改名する場合、参照は 63 ファイルに及ぶ。`execution` 配下の plan / result 42 件は当時の実行事実の記録であり、遡って書き換えない。新旧の名称が履歴に混在することは許容し、改名した事実と時期を規範文書へ記す。

### 3.5. 検証結論

- 7 種の intent はすべて `approach_rules[].intent` で表現できる。成果物単位の `local_ids` により、同じ phase set 内で intent が分かれる場合も別 rule として宣言できる。
- `improve-kata` は `kata_target`、`bootstrap-kata-set` と `confirm-with-kata-set` は `bootstrap_scope` を追加すれば、必要な入力を欠落なく表現できる。
- facts はファイル参照とメタデータ読取で都度収集できるためキャッシュしない。grade は各 Kata 文書のメタデータを正本とする。
- `sch-assessment` は派生 facts と導出結果の重複保存になるため廃止し、既存 3 track の実データも削除する。過去の execution plan / result は実行記録として維持する。

## 4. 対応結果

`sch-assessment` を廃止し、strategy の `approach_rules`、都度収集する DCT / Kata facts、保存済み grade から approach を決定論的に導出する構造へ移行した。7 種の intent はすべて schema で宣言でき、必要入力が欠ける場合は `undecided` を保存せず strategy 生成をエラー停止する。

専用 schema、CLI の `schedule assessment`、agent prompt、実データ 3 件、専用テストを削除した。Planning カタログから assessment 成果物を外し、既存 3 strategy へ `approach_rules` を追加した。facts のキャッシュは設けていない。

## 5. 関連ドキュメント

- [[prj-0001:pjr-49d2-quality-assessment]]: 判断の前提となる品質評価の TODO。設計確定が着手の前提。
- [[specdojo:schedule-design-guide]]: approach 決定の位置づけを記載する文書。
- [[specdojo:schedule-operation-guide]]: 移行後の運用手順の反映先。
- [[specdojo:command-reference]]: コマンドと生成物の記載を更新する。
