---
specdojo:
  id: prj-0001:pjr-2kpn-register-update-topic
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-08-29T06:54:31Z"
  due_on: "2026-09-30"
  completed_at: "2026-08-29T11:32:30Z"
  block_reason: rate limit reached
  conclusion: register update --topic を追加し、個票ファイル名と文書 ID の変更、参照の更新、event 記録、生成ビューの再生成を一度のコマンドで完結させた。topic は英小文字・数字を単一ハイフンで区切る形式に限定し、変更先ファイルが存在する場合は計画段階で停止する。参照の更新範囲は既存の register renumber と揃え、生成物を除く docs/ja 配下の旧文書 ID を自動更新する。event の action は新設せず update を用い、changes の id へ変更前後の完全な文書 ID を保存する。
  register_events:
    - v: 1
      id: reg_220c4eda72ff46a29ed52c3a2ceba550
      ts: "2026-08-29T06:54:31Z"
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
          to: register update に個票の topic 変更手段を追加する
        - field: description
          from: ""
          to: 個票の内容が変わって topic が実態と合わなくなっても、CLI に変更手段がない。register renumber は ID 衝突解消専用で topic を扱えないため、git mv と Frontmatter の id 書き換えを手作業で行うことになり、register event に記録が残らない。他文書からの wikilink 参照も手作業で追随させる必要がある。register update へ --topic を追加し、ファイル名・文書 ID・参照・生成ビューの整合と event 記録をコマンドで完結させる。
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
      id: reg_a82bd40af09346d9a8e9939307e695c8
      ts: "2026-08-29T11:02:14Z"
      action: start
      actor: codex-expert-executor
      from_status: open
      to_status: in-progress
      reason: work started
      changes:
        - field: status
          from: open
          to: in-progress
      previous_event_id: reg_220c4eda72ff46a29ed52c3a2ceba550
    - v: 1
      id: reg_af7998bbbeef4227b1ae1a8d323947c1
      ts: "2026-08-29T11:08:34Z"
      action: wait
      actor: codex-expert-executor
      from_status: in-progress
      to_status: waiting
      reason: rate limit reached
      changes:
        - field: status
          from: in-progress
          to: waiting
        - field: block_reason
          from: "-"
          to: rate limit reached
      previous_event_id: reg_a82bd40af09346d9a8e9939307e695c8
    - v: 1
      id: reg_1dea7669f5dd46319b6a518cfa23f055
      ts: "2026-08-29T11:32:30Z"
      action: close
      actor: manual
      from_status: waiting
      to_status: done
      reason: 実装・検証・レビューが完了したため
      changes:
        - field: status
          from: waiting
          to: done
        - field: completed
          from: "-"
          to: "2026-08-29"
        - field: conclusion
          from: "-"
          to: register update --topic を追加し、個票ファイル名と文書 ID の変更、参照の更新、event 記録、生成ビューの再生成を一度のコマンドで完結させた。topic は英小文字・数字を単一ハイフンで区切る形式に限定し、変更先ファイルが存在する場合は計画段階で停止する。参照の更新範囲は既存の register renumber と揃え、生成物を除く docs/ja 配下の旧文書 ID を自動更新する。event の action は新設せず update を用い、changes の id へ変更前後の完全な文書 ID を保存する。
      previous_event_id: reg_af7998bbbeef4227b1ae1a8d323947c1
---

# PJR-2KPN register update に個票の topic 変更手段を追加する

## 1. 概要

個票のファイル名と文書 ID は `pjr-XXXX-<topic>` 形式であり、`<topic>` は対象領域や論点が分かる短い名称とすることが pjr-rulebook で定められている。しかし検討が進んで項目の主題が変わると、`<topic>` が実態と合わなくなる。

このとき CLI に変更手段がない。`register update` は title / description / priority / owner / due / conclusion のみを扱い、`register renumber` は PJR-ID の衝突解消専用で `<topic>` を扱えない。結果として `git mv` と Frontmatter の `id` 書き換えを手作業で行うことになり、次の問題が生じる。

- 変更が `register_events` に記録されず、監査履歴が欠落する。
- 他文書からの wikilink 参照が壊れる。参照側の修正も手作業になる。
- 手順が規範化されていないため、実施者によって結果が揺れる。

`register update` へ `--topic` を追加し、ファイル名・文書 ID・参照・生成ビューの整合と event 記録をコマンドで完結させる。

## 2. 完了条件

- `register update --topic <topic>` で個票のファイル名と Frontmatter の `id` が同時に更新される。
- 変更が `register_events` へ追記され、変更前後の値が追える。
- 他文書からの wikilink 参照が壊れないよう、更新するか、少なくとも検出して報告する。
- 変更後の `<topic>` が既存個票と衝突する場合はエラーとして停止する。
- `<topic>` の形式（英小文字・数字・ハイフン）を検証し、不正な値を拒否する。
- `--dry-run` で変更内容を確認できる。
- 生成一覧と派生ビューが `register build` で整合する。
- `npm run check` が通る。

## 3. 作業内容

| No  | 作業                   | 担当 | 状態 | メモ                                              |
| --- | ---------------------- | ---- | ---- | ------------------------------------------------- |
| 1   | 参照更新の方針決定     | ARC  | done | `docs/ja` 配下の旧文書 ID 参照を自動更新する      |
| 2   | event の action の決定 | ARC  | done | 既存の `update` を使い `id` の変更として記録する  |
| 3   | `--topic` の実装       | ARC  | done | ファイル名、文書 ID、衝突検証、dry-run を実装した |
| 4   | 参照検出・更新の実装   | ARC  | done | 生成物を除く Markdown 参照を更新対象にした        |
| 5   | テスト追加             | ARC  | done | 正常系、衝突、不正形式、dry-run、参照を網羅した   |
| 6   | 規範文書の更新         | ARC  | done | rulebook、運用ガイド、コマンドリファレンスを更新  |

### 3.1. 背景となった実例

PJR-JFTC は当初「sch-assessment を sch-readiness へ改名する」として起票したが、検討の結果「sch-assessment の廃止可否を判断する」へ主題が変わった。`register update --title` でタイトルと H1 は更新できたものの、`<topic>` は `sch-readiness-rename` のまま残り、文書 ID が実態と乖離した。

このため `git mv` と Frontmatter の `id` 書き換えを手作業で実施し、あわせて PJR-49D2 からの wikilink 参照も手で修正した。この一連の操作は `register_events` に記録されていない。

### 3.2. 決めるべき事項

参照の扱いが設計上の焦点となる。文書 ID を変更すると、他文書からの `[[id]]` 参照が解決できなくなる。取りうる方針は次の3つで、いずれも一長一短がある。

| 方針             | 利点                             | 欠点                                     |
| ---------------- | -------------------------------- | ---------------------------------------- |
| 自動更新する     | 参照が壊れない                   | 履歴蓄積ファイルまで書き換える危険がある |
| 検出して報告する | 履歴を書き換えない。修正者が判断 | 参照の修正漏れが起きうる                 |
| 変更を禁止する   | 実装が不要                       | 実態と乖離した文書 ID が残り続ける       |

履歴蓄積ファイル（plan / result / 個票）は過去の記録であり書き換えるべきではない一方、登録簿本体や規範文書の参照は追随させたい。参照先の種類によって扱いを分ける必要がある。

`register_events` の `action` に何を使うかも決める。既存 enum は `renumber` を持つが、これは ID 衝突解消の意味で使われている。`update` として記録するか、`retopic` のような action を追加するかを判断する。

### 3.3. 決定事項

起票時に未決としていた論点は、実施を通じて次のとおり決着した。

- 文書 ID を変えずにファイル名だけを変える運用は許さない。pjr-rulebook が両者の一致を求めているため、`--topic` は常に同時に変更する。
- 参照の更新範囲は既存の `register renumber` と揃え、生成物を除く `docs/ja` 配下の旧文書 ID を自動更新する。plan / result や過去の個票などの履歴蓄積ファイルも対象に含まれる。文書 ID が変わると過去の記録からの参照が解決できなくなるため、記録の不変性よりも参照の追随を優先する既存方針を踏襲した。
- 変更前の文書 ID は `register_events` の `changes.id` へ変更前後の完全な ID として保存する。`supersedes` は用途が異なるため使わない。event の action は新設せず `update` を用いる。
- 文書 ID インデックスとの整合は、変更後に `index build` を実行して再生成することで保つ。

移行前の `pjr-index.md` は読み取り互換の入力であり正本ではないため、topic 変更の更新対象に含めない。未移行データの扱いは `register migrate` の責務とする。

参照を追随させない選択肢も検討したが採用しなかった。解決できない wikilink は `index build` でも `validate-history-links` でも検出されないことを実測で確認しており、追随させない場合は壊れた参照が検出されないまま蓄積する。また wikilink は文書の同一性を指すポインタであって記録された事実ではなく、ID を更新しても指し示す文書は変わらない。実行した事実は plan / result の本文、状態遷移は `register_events`、変更の時刻と実施者は git 履歴がそれぞれ担保する。文書 ID を外部へ公開・引用する運用を始める場合は、この方針を再検討する。

## 4. 対応結果

- `register update --topic <topic>` を追加し、個票ファイル名と Frontmatter の文書 ID を一度のコマンドで変更できるようにした。title など既存の更新オプションとの同時指定にも対応する。
- topic は英小文字・数字を単一ハイフンで区切る形式に限定し、変更先ファイルが存在する場合は計画段階で停止する。
- 参照は既存の `register renumber` と同じ範囲・置換処理を採用し、生成物を除く `docs/ja` 配下の旧文書 ID を自動更新する。生成ビューは個票の移動後に再生成する。
- event action は新設せず `update` を採用し、`changes` の `id` に変更前後の完全な文書 ID を保存する。
- CLI テストに、個票名・文書 ID・参照・event・生成ビューの一括更新、dry-run、不正 topic、ファイル衝突のケースを追加した。

## 5. 関連ドキュメント

- [[specdojo:pjr-rulebook]]: 個票のファイル名と文書 ID の規約、および register コマンドの責務を定める。
- [[prj-0001:pjr-jftc-sch-assessment-retirement]]: 手作業での topic 変更が必要になった実例。
- [[specdojo:command-reference]]: 追加したオプションの記載先。
- [[specdojo:register-operation-guide]]: 運用手順の反映先。
