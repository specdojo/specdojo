---
specdojo:
  id: prj-0001:pjr-2kpn-register-update-topic
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  owner: ARC
  registered_at: "2026-08-29T06:54:31Z"
  due_on: "2026-09-30"
  block_reason: rate limit reached
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

| No  | 作業                   | 担当   | 状態 | メモ                                              |
| --- | ---------------------- | ------ | ---- | ------------------------------------------------- |
| 1   | 参照更新の方針決定     | ARC    | open | 参照を自動更新するか、検出して報告するか          |
| 2   | event の action の決定 | ARC    | open | 既存 enum の update / renumber を使うか追加するか |
| 3   | `--topic` の実装       | _TODO_ | open | ファイル名、Frontmatter の id、衝突検証、dry-run  |
| 4   | 参照検出・更新の実装   | _TODO_ | open | 方針決定の結果に従う                              |
| 5   | テスト追加             | _TODO_ | open | 衝突、不正な形式、参照ありの場合                  |
| 6   | 規範文書の更新         | _TODO_ | open | pjr-rulebook と command-reference                 |

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

### 3.3. 未決の論点

- 文書 ID を変えずにファイル名だけを変える運用を許すか。pjr-rulebook は両者の一致を求めているため、原則は同時変更となる。
- `index build` で生成される文書 ID インデックスとの整合をどう保証するか。
- 変更前の文書 ID を Frontmatter へ残して追跡可能にするか。`supersedes` の用途と重なるため、混同しない形が必要になる。

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[specdojo:pjr-rulebook]]: 個票のファイル名と文書 ID の規約、および register コマンドの責務を定める。
- [[prj-0001:pjr-jftc-sch-assessment-retirement]]: 手作業での topic 変更が必要になった実例。
- [[specdojo:command-reference]]: 追加したオプションの記載先。
- [[specdojo:register-operation-guide]]: 運用手順の反映先。
