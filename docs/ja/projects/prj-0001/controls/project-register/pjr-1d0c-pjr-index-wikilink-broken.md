---
specdojo:
  id: prj-0001:pjr-1d0c-pjr-index-wikilink-broken
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: high
  owner: ARC
  registered_at: "2026-08-09T11:03:44Z"
  due_on: "2026-08-31"
  completed_at: "2026-08-09T12:42:13Z"
  register_events:
    - v: 1
      id: reg_fbe056e6775f250be948363b77779d53
      ts: "2026-08-09T11:03:44Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "docs(prj-0001): close PJR-9P5Q, add PJR-1D0C"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: 個票のpart_ofとwikilinkがprj-0001:pjr-indexを参照できない
        - field: description
          from: ""
          to: "[[prj-0001:pjr-rzr3-pjr-index-as-generated-view]] が追跡対象の `pjr-index.md` を `generated/` 配下の非追跡ビューへ移し、[[prj-0001:pjr-9p5q-migrate-existing-register-items]]（2026-08-09）が追跡版 `pjr-index.md` 本体を削除した。これにより、文書ID `prj-0001:pjr-index` を参照する箇所（個票 60 件の `part_of` と、本文中の wikilink 10 箇所。PJR-9P5Q・PJR-RZR3 自身の `5. 関連ドキュメント` を含む）が解決不能になっている。"
        - field: type
          from: ""
          to: issue
        - field: priority
          from: ""
          to: high
        - field: owner
          from: ""
          to: ARC
        - field: registered
          from: ""
          to: _TODO_
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
      legacy_commit: 7eeeb85408d2e382450800116dca75eba2633d62
    - v: 1
      id: reg_a37e9d484314d954c175773c52cc8f23
      ts: "2026-08-09T12:24:25Z"
      action: start
      actor: SpecDojo Test
      from_status: open
      to_status: in-progress
      reason: "exec(register PJR-1D0C): start"
      changes:
        - field: status
          from: open
          to: in-progress
      legacy_commit: 0f4eb0c1636ca3bde4abf83750c199d37fa1914b
      previous_event_id: reg_fbe056e6775f250be948363b77779d53
    - v: 1
      id: reg_ee67e6f0a04c86cb35137cc0cb84f144
      ts: "2026-08-09T12:35:31Z"
      action: review
      actor: SpecDojo Test
      from_status: in-progress
      to_status: review
      reason: "exec(register PJR-1D0C): review"
      changes:
        - field: status
          from: in-progress
          to: review
      legacy_commit: 32ac28c16e2687d8f745e050758c294eee5dbc20
      previous_event_id: reg_a37e9d484314d954c175773c52cc8f23
    - v: 1
      id: reg_f9c10890c3817e7e1e5c0a93732386c9
      ts: "2026-08-09T12:42:13Z"
      action: close
      actor: SpecDojo Test
      from_status: review
      to_status: done
      reason: "docs(prj-0001): close PJR-1D0C"
      changes:
        - field: status
          from: review
          to: done
      legacy_commit: e3b3f6c3c89a911849cef8d212e3d32427aefc87
      previous_event_id: reg_ee67e6f0a04c86cb35137cc0cb84f144
    - v: 1
      id: reg_7b94f6fa15c4c1a582a0e0422dd42e66
      ts: "2026-08-09T14:39:40Z"
      action: update
      actor: SpecDojo Test
      from_status: done
      to_status: done
      reason: "exec(register PJR-EQAQ): 登録簿日時をregistered_at・completed_atへ移行する"
      changes:
        - field: registered
          from: _TODO_
          to: "2026-08-09"
        - field: completed
          from: "-"
          to: "2026-08-09"
      legacy_commit: 38201bef867f3cc1454db6b748fc979ed3f2fa8f
      previous_event_id: reg_f9c10890c3817e7e1e5c0a93732386c9
---

# PJR-1D0C 個票のpart_ofとwikilinkがprj-0001:pjr-indexを参照できない

## 1. 課題内容

[[prj-0001:pjr-rzr3-pjr-index-as-generated-view]] が追跡対象の `pjr-index.md` を `generated/` 配下の非追跡ビューへ移し、[[prj-0001:pjr-9p5q-migrate-existing-register-items]]（2026-08-09）が追跡版 `pjr-index.md` 本体を削除した。これにより、文書ID `prj-0001:pjr-index` を参照する箇所（個票 60 件の `part_of` と、本文中の wikilink 10 箇所。PJR-9P5Q・PJR-RZR3 自身の `5. 関連ドキュメント` を含む）が解決不能になっている。

`doc-index build` は `docs/**/generated/` を走査対象から除外するため、`prj-0001:pjr-index` は現状どの追跡ファイルにも存在しない。VitePress の wikilink 変換（`.vitepress/config.mts` の `specdojo_wikilink` ルール）は未解決 ID を検出してもビルドを失敗させず、画面に生の `[[prj-0001:pjr-index]]` という文字列をそのまま表示するだけになる。CI・lint のどの既存チェック（`lint:fm` / `validate-history-links` / `catalog validate` 等）もこのケースを検出しない。

## 2. 影響範囲

| 観点         | 影響                                                                               |
| ------------ | ---------------------------------------------------------------------------------- |
| スコープ     | 個票60件の`part_of`と本文wikilink10箇所の参照が解決不能。表示上のリンク切れ        |
| スケジュール | ビルド・CIは失敗しないため検知が遅れやすい。放置期間が長いほど参照箇所が増える恐れ |
| コスト       | 解決方式の決定と実装が必要（既存個票の一括置換を伴う可能性）                       |
| 品質         | ドキュメントサイトで生の`[[id]]`文字列が利用者に見える状態が既に発生している       |
| 関係者       | ドキュメント参照者・レビュアー                                                     |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                   |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | `doc-index build`が`generated/`配下を走査しないため、非追跡になった一覧を指すIDが解決先を持たなくなった                                                                                                                                                                                                                |
| 対応策   | (c) を採用し、`prj-0001:pjr-index`を持つ追跡対象の案内ページを`project-register/pjr-index.md`として置く。登録項目の値は持たせず、非追跡の`generated/pjr-index.md`へ案内する。(a) は生成ページとYAML正本のID重複を招き、(b) は既存の参照規約と全個票の変更を伴うため採用しない。`register scaffold`も同じ構成を生成する |
| 依存事項 | [[prj-0001:pjr-gh26-ledger-review-alternative]]は完了済み。同項目の`register history`は台帳の変更追跡を担い、本項目の文書ID解決は案内ページが担うため、役割を分離した                                                                                                                                                  |
| 完了条件 | `prj-0001:pjr-index`を参照する全箇所（実行時点で個票`part_of`187件、本文wikilink10箇所）が解決可能になっている。実リポジトリからdoc-indexを再構築して`part_of`と対象wikilinkを検証する回帰テストが追加され、再発時にCIで検知できる                                                                                     |

## 4. 対応結果

- `prj-0001:pjr-index`を持つ追跡対象の`pjr-index.md`を案内ページとして復元した。`specdojo index lookup prj-0001:pjr-index`は同ファイルを返し、個票187件の`part_of`と本文wikilink10箇所が同じIDで解決できるようになった。
- 一覧の値は案内ページへ戻さず、個票Frontmatterを正本、`generated/pjr-index.md`を非追跡の派生ビューとする構成を維持した。案内ページから生成一覧へ相対リンクで移動できる。
- `register scaffold`が追跡対象の案内ページと非追跡の生成一覧を併せて作るようにした。移行後の`register migrate`は案内ページを旧一覧と誤認せず、再実行時にno-opとなる。
- `tests/src/doc-index.test.ts`に、実リポジトリのdoc-indexを再構築し、登録簿個票の全`part_of`と`prj-0001:pjr-index`へのwikilinkが追跡文書へ解決することを確認する回帰テストを追加した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-es57-register-file-ssot-migration]]: 分割元の移行タスク
- [[prj-0001:pjr-rzr3-pjr-index-as-generated-view]]: 追跡版一覧を非追跡化した変更
- [[prj-0001:pjr-9p5q-migrate-existing-register-items]]: 追跡版`pjr-index.md`を削除した変更
- [[prj-0001:pjr-gh26-ledger-review-alternative]]: 台帳参照手段の検討（評価対象が重なる）
