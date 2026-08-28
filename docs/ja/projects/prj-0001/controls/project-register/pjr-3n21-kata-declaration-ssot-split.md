---
specdojo:
  id: prj-0001:pjr-3n21-kata-declaration-ssot-split
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: decided
  priority: medium
  owner: ARC
  registered_at: "2026-08-24T10:02:39Z"
  due_on: "2026-08-31"
  completed_at: "2026-08-24T11:34:23Z"
  conclusion: "実践の型の要否と所在は、いずれも rulebook frontmatter を正本とする（選択肢A）。成果物カタログは型の宣言を持たず rulebook の宣言のみを保持する。kind が generated の成果物には型を適用せず、宣言ではなく kind から導出する。rulebook を持たない成果物は rulebook: not-needed で表現し型の宣言を不要とする。所在が rulebook の外に置かれた例が実在せず、PJR-VV3M の方針も3種すべてが系統単位の判断であるため。要否の4状態と判断基準は置き場所を変えるのみで意味は変えない。移行は別途起票する。"
  register_events:
    - v: 1
      id: reg_e8f7290065e2d1ddf161cdb0977e3b48
      ts: "2026-08-24T10:04:04Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "docs(register): PJR-3N21 実践の型の要否と所在の正本を分ける決定を起票する"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: 実践の型の要否と所在の正本を分ける
        - field: description
          from: ""
          to: 実践の型の宣言が成果物カタログと rulebook frontmatter の2か所にあり、意味が混ざっている。カタログには文書 ID が書かれ、bps-sample が29件の成果物へ重複するなど、系統単位で決まる情報を成果物ごとに持つ二重管理になっている。要否（その成果物にその型が必要か）と所在（実体がどの文書か）で正本を分けるかを決める。
        - field: type
          from: ""
          to: decision
        - field: priority
          from: ""
          to: medium
        - field: owner
          from: ""
          to: ARC
        - field: registered
          from: ""
          to: "2026-08-24"
        - field: due
          from: ""
          to: "2026-08-31"
        - field: completed
          from: ""
          to: "-"
        - field: conclusion
          from: ""
          to: "-"
        - field: block_reason
          from: ""
          to: "-"
      legacy_commit: 513d3e8c6b739a78593ab3005bf6e4b9cdbe8ab7
    - v: 1
      id: reg_232e190c992dab7e9f9c1f3a202223ce
      ts: "2026-08-24T11:35:11Z"
      action: close
      actor: SpecDojo Test
      from_status: open
      to_status: decided
      reason: "docs(register): PJR-3N21 を決定し移行作業 PJR-XGJK を起票する"
      changes:
        - field: status
          from: open
          to: decided
        - field: completed
          from: "-"
          to: "2026-08-24"
        - field: conclusion
          from: "-"
          to: "実践の型の要否と所在は、いずれも rulebook frontmatter を正本とする（選択肢A）。成果物カタログは型の宣言を持たず rulebook の宣言のみを保持する。kind が generated の成果物には型を適用せず、宣言ではなく kind から導出する。rulebook を持たない成果物は rulebook: not-needed で表現し型の宣言を不要とする。所在が rulebook の外に置かれた例が実在せず、PJR-VV3M の方針も3種すべてが系統単位の判断であるため。要否の4状態と判断基準は置き場所を変えるのみで意味は変えない。移行は別途起票する。"
      legacy_commit: 5da5e2d22e3d9fc799b23308f39645f3723dde16
      previous_event_id: reg_e8f7290065e2d1ddf161cdb0977e3b48
---

# PJR-3N21 実践の型の要否と所在の正本を分ける

## 1. 背景

実践の型の宣言が成果物カタログと rulebook frontmatter の2か所にあり、意味が混ざっている。カタログには文書 ID が書かれ、bps-sample が29件の成果物へ重複するなど、系統単位で決まる情報を成果物ごとに持つ二重管理になっている。要否（その成果物にその型が必要か）と所在（実体がどの文書か）で正本を分けるかを決める。

## 2. 検討した選択肢

| 選択肢 | 内容                                                                 | 利点                                                                                      | 懸念                                                                                                                                  |
| ------ | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| A      | rulebook frontmatter を正本とし、カタログは参照しない                | 型の所在が系統ごとに1か所へ集約され、直接的で分かりやすい。複数の完成例を配列で表現できる | rulebook を持たない成果物の型を宣言できない。実装には `resolveRefWithoutRulebook` の経路が存在する                                    |
| B      | 成果物カタログを正本とし、rulebook frontmatter は参照しない          | rulebook を持たない成果物にも対応できる。現在の実装の優先順位とも一致する                 | 系統単位で決まる情報を成果物ごとに書くため、`bps-sample` が29件へ重複する二重管理が残る。複数の完成例の表現方法を別途決める必要がある |
| C      | 要否はカタログ、所在は rulebook frontmatter を正本とし、役割で分ける | 成果物ごとに変わる情報と系統で決まる情報を、それぞれ変わる単位に置ける                    | 正本が2か所になり、どちらに何を書くかの理解が必要になる。移行時にカタログ208件の書き換えが要る                                        |

## 3. 決定内容

選択肢 A を採択する。実践の型の要否と所在は、いずれも rulebook frontmatter を正本とする。

| 項目                      | 決定内容                                                                       |
| ------------------------- | ------------------------------------------------------------------------------ |
| 正本                      | rulebook frontmatter。要否と所在の両方を保持する                               |
| 成果物カタログ            | 型の宣言を持たない。`rulebook` の宣言のみを保持する                            |
| 生成物の扱い              | `kind: generated` の成果物には型を適用しない。宣言ではなく `kind` から導出する |
| rulebook を持たない成果物 | `rulebook: not-needed` で表現する。型の宣言は不要とする                        |

要否の表現（`undecided` / 項目の省略 / 文書 ID / `not-needed`）と PJR-QESV・PJR-VV3M の判断基準は、そのまま rulebook frontmatter 側で用いる。置き場所を変えるのみで、意味は変えない。

## 4. 採択理由

- 「所在」が rulebook の外に置かれている例が存在しない。rulebook を持たずに型を宣言している成果物は3件のみで、いずれも `rulebook: not-needed` かつ型もすべて `not-needed` である。文書 ID を宣言しているものは0件である。選択肢 A の懸念とした `resolveRefWithoutRulebook` の経路には、実際の利用者がいない。
- 成果物だけがあって rulebook がなく、sample や recipe だけが存在する状態は、実践の型の位置づけとして成立しない。型は成果物種別の規約に付随するものであり、規約なしに完成例や作り方だけが独立して存在することはない。
- PJR-VV3M の方針は3種すべてが系統単位の判断である。「sample は rulebook がある系統へ一律に作る」「template は rulebook 系統単位で持つ」「recipe は品質差が出る系統のみ」であり、成果物ごとに変わる情報ではない。系統単位で決まる情報を成果物ごとに208回書く必要がない。
- 同一 rulebook 内で宣言が割れている系統は7件あるが、うち6件は PJR-JT1Y の移行途上による `not-needed` と `undecided` の混在であり、本質的な差ではない。残る1件は `pjr-rulebook` における個票（`kind: work`）と生成ビュー（`kind: generated`）の差であり、生成物は執筆されないため型を参照する場面がない。`kind` から導出でき、成果物ごとの宣言を要しない。
- 現在の実装がカタログを優先しているのは PJR-K4TA が持ち込んだ結果であり、設計上の判断ではない。実装の現状を正本選定の根拠にはしない。
- 同一系統に複数の完成例を持つ rulebook が12本ある。rulebook frontmatter は配列宣言に対応済みであり、そのまま表現できる。カタログを正本にする場合は、1成果物1文書IDの前提と両立させる方法を別途決める必要がある。

### 判断材料（調査済み）

- `src/kata.ts` の実装は、カタログに1つでも型の宣言があれば rulebook frontmatter を無視する。コメントは「rulebook frontmatter の宣言を正とする」と述べており実装と食い違っていたが、PJR-1Z1H で実装に合わせて修正済みである。解決処理そのものは変更していない。
- rulebook を持たない成果物のための `resolveRefWithoutRulebook` が実装に存在する。選択肢 A を採る場合、この経路が扱う情報の置き場所がなくなる。
- 現在カタログに書かれているのは文書 ID であり、要否ではない。`specdojo:bps-sample` が29件の成果物へ重複している。
- PJR-VV3M は「sample は rulebook がある系統へ一律に作る」「template は rulebook 系統単位で判断する」と定めた。系統単位で決まる情報を成果物ごとに208回書く必要はない。
- rulebook frontmatter の未宣言は PJR-1Z1H で解消した。sample を宣言する rulebook は106本中101本となり、残る5本は sample の実ファイル自体が存在しないため宣言していない。所在の正本として使う前提は整った。
- 同一系統に複数の完成例を持つ rulebook が12本ある（`opd-rulebook` は `opd-sample` / `opd-access-control-sample` / `opd-incident-management-sample` の3件など）。rulebook frontmatter は PJR-1Z1H で配列宣言に対応したが、成果物カタログ側は1成果物1文書IDを前提としている。カタログを所在の正本にする場合、複数の完成例をどう表現するかを決める必要がある。
- 現在の解決は、カタログに recipe / sample / template のいずれかがあればカタログの宣言セットを優先し、未宣言の種別は rulebook frontmatter へ戻らず慣例ファイルを探索する。複数宣言時は先頭を既定例として扱う。

## 5. 承認

| 項目     | 内容                                                        |
| -------- | ----------------------------------------------------------- |
| 決定者   | PO                                                          |
| 決定日   | 2026-08-24                                                  |
| 承認方式 | commit                                                      |
| 証跡     | 本個票を決定済みにした commit（`docs(register): PJR-3N21`） |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 6. 影響範囲とフォローアップ

| 項目       | 内容                                                                                                                                                                                                                             |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 影響範囲   | 成果物カタログの型宣言208件、rulebook frontmatter 106本、`src/kata.ts` の解決処理、`catalog validate` の検証内容                                                                                                                 |
| 必要な対応 | カタログ208件から型宣言を削除し、要否を rulebook frontmatter へ移す。`src/kata.ts` の解決をカタログ優先から rulebook 正本へ変更する。`kind: generated` の成果物へ型を適用しない導出を実装する。schema と検証を決定内容に合わせる |
| 追跡先     | 前提の PJR-1Z1H は完了済み。移行は PJR-XGJK で追跡する。PJR-K9KG（実在成果物の要否確定）は移行後の宣言先で判断する必要があるため、PJR-XGJK の完了を待つ                                                                          |

## 7. 関連ドキュメント

- 要否判断の基準: [[specdojo:kata-guide|実践の型ガイド]]
- 種別ごとの作成方針: [[prj-0001:pjr-vv3m-kata-creation-policy-by-type|PJR-VV3M 実践の型は種別ごとに作成方針を変える]]
- 前提となる項目: [[prj-0001:pjr-1z1h-rulebook-sample-declaration-gap|PJR-1Z1H 実践の型の宣言の欠落を埋める]]
- 作業が重なる項目: [[prj-0001:pjr-k9kg-kata-requirement-existing-deliverables|PJR-K9KG 実在する成果物の要否確定]]
- 本決定の移行作業: [[prj-0001:pjr-xgjk-kata-declaration-migrate-to-rulebook|PJR-XGJK 実践の型の宣言を rulebook frontmatter へ移行する]]
