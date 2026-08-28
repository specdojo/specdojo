---
specdojo:
  id: prj-0001:pjr-aq9g-exec-plan-angle-placeholder-escape
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-08-23T02:24:50Z"
  due_on: "2026-08-31"
  completed_at: "2026-08-23T03:17:14Z"
  conclusion: register build の変換処理を exec-shared へ切り出し、plan 生成にも適用した。個票由来の値に含まれる素の山括弧プレースホルダは、連結範囲ごとインラインコード化される。既存の残置 plan も修正し、lint:fm が成功する状態へ戻した。再適用しても二重化しないことをテストで固定している。
  register_events:
    - v: 1
      id: reg_7d4d228fa924ad8c1ee7d65b81790f4e
      ts: "2026-08-23T02:25:17Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "docs(register): plan 生成の山括弧エスケープを PJR-AQ9G として起票"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: plan 生成でも山括弧プレースホルダをインラインコード化する
        - field: description
          from: ""
          to: 個票の説明文は exec plan の本文へそのまま流し込まれるため、`dct-<domain>.yaml` のような素の山括弧プレースホルダが plan へ現れる。PJR-ZWMH では索引の表セル（register build）と frontmatter の検知を対応したが、plan 生成は対象外だった。実際に PJR-ZWMH 自身の plan が lint:fm の警告として検出されている。register build と同じ規則で plan 本文の展開時にもインラインコード化する。
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
          to: "2026-08-23"
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
      legacy_commit: e8880ced57886f29f2aa1925bb79478994849ab4
    - v: 1
      id: reg_178e61e937441fdc3a26f4cd59628c73
      ts: "2026-08-23T02:28:22Z"
      action: start
      actor: SpecDojo Test
      from_status: open
      to_status: in-progress
      reason: "exec(register PJR-AQ9G): start"
      changes:
        - field: status
          from: open
          to: in-progress
      legacy_commit: 8556fc645401d4835728740861c68840ea267f82
      previous_event_id: reg_7d4d228fa924ad8c1ee7d65b81790f4e
    - v: 1
      id: reg_1fd69f5f6ed08c661271c9d3ddf869cb
      ts: "2026-08-23T02:50:03Z"
      action: wait
      actor: SpecDojo Test
      from_status: in-progress
      to_status: waiting
      reason: "exec(register PJR-AQ9G): wait"
      changes:
        - field: status
          from: in-progress
          to: waiting
        - field: conclusion
          from: "-"
          to: "agent exited with non-zero code: 共通規約の検査対象表により、src/ および tests/ 配下の変更がある本タスクでは npm run test:unit（pipeline executor 環境）の実行が必須である。executor evidence では対象を絞った npm run test:unit（該当テストファイル指定）は69件成功しているが、全件の …"
      legacy_commit: fa37e0b64815a01e91187c1d34906fb4bda3e854
      previous_event_id: reg_178e61e937441fdc3a26f4cd59628c73
    - v: 1
      id: reg_5a8c68586cdc859960aef334d414e34d
      ts: "2026-08-23T02:54:50Z"
      action: update
      actor: SpecDojo Test
      from_status: waiting
      to_status: waiting
      reason: "exec(register PJR-AQ9G): plan 生成でも山括弧プレースホルダをインラインコード化する"
      changes:
        - field: description
          from: 個票の説明文は exec plan の本文へそのまま流し込まれるため、`dct-<domain>.yaml` のような素の山括弧プレースホルダが plan へ現れる。PJR-ZWMH では索引の表セル（register build）と frontmatter の検知を対応したが、plan 生成は対象外だった。実際に PJR-ZWMH 自身の plan が lint:fm の警告として検出されている。register build と同じ規則で plan 本文の展開時にもインラインコード化する。
          to: 個票の説明文は exec plan の本文へそのまま流し込まれるため、`dct-<domain>.yaml` のような素の山括弧プレースホルダが plan へ現れる。PJR-ZWMH では索引の表セル（register build）と frontmatter の検知を対応したが、plan 生成は対象外だった。実際に PJR-ZWMH 自身の plan が lint:fm の警告として検出されている。register build と同じ規則で plan 本文の展開時にもインラインコード化する。
      legacy_commit: 8f4c158ef3a91ead9b0276dd62f0b96ea18bf0a7
      previous_event_id: reg_1fd69f5f6ed08c661271c9d3ddf869cb
    - v: 1
      id: reg_4e688231065710313d00bff326a99428
      ts: "2026-08-23T02:56:08Z"
      action: review
      actor: SpecDojo Test
      from_status: waiting
      to_status: review
      reason: "exec(register PJR-AQ9G): review"
      changes:
        - field: status
          from: waiting
          to: review
      legacy_commit: 0cab1fa0a07133ba61002d46fe037d262fe3165a
      previous_event_id: reg_5a8c68586cdc859960aef334d414e34d
    - v: 1
      id: reg_f93f6659e9b1ab41d25965f6a3f315a9
      ts: "2026-08-23T03:17:14Z"
      action: close
      actor: SpecDojo Test
      from_status: review
      to_status: done
      reason: "exec(register PJR-AQ9G): close"
      changes:
        - field: status
          from: review
          to: done
        - field: completed
          from: "-"
          to: "2026-08-23"
        - field: conclusion
          from: "agent exited with non-zero code: 共通規約の検査対象表により、src/ および tests/ 配下の変更がある本タスクでは npm run test:unit（pipeline executor 環境）の実行が必須である。executor evidence では対象を絞った npm run test:unit（該当テストファイル指定）は69件成功しているが、全件の …"
          to: register build の変換処理を exec-shared へ切り出し、plan 生成にも適用した。個票由来の値に含まれる素の山括弧プレースホルダは、連結範囲ごとインラインコード化される。既存の残置 plan も修正し、lint:fm が成功する状態へ戻した。再適用しても二重化しないことをテストで固定している。
      legacy_commit: 5e3cac1e17c56a919aa8f5707cda24bb39921ea7
      previous_event_id: reg_4e688231065710313d00bff326a99428
---

# PJR-AQ9G plan 生成でも山括弧プレースホルダをインラインコード化する

## 1. 概要

個票の説明文は exec plan の本文へそのまま流し込まれるため、`dct-<domain>.yaml` のような素の山括弧プレースホルダが plan へ現れる。PJR-ZWMH では索引の表セル（register build）と frontmatter の検知を対応したが、plan 生成は対象外だった。実際に PJR-ZWMH 自身の plan が lint:fm の警告として検出されている。register build と同じ規則で plan 本文の展開時にもインラインコード化する。

## 2. 完了条件

- exec plan の本文へ展開する個票由来の値（説明文、タイトル、完了条件など）で、コードスパン外の山括弧プレースホルダがインラインコード化される。
- 変換規則は `register build` と同じものを共有し、実装を二重に持たない。連結範囲は拡張子のドットまで含め、文末の句点はコードの外に置く。
- 既にインラインコードで囲まれた箇所を二重に囲まない。
- 既存の残置 plan（`pjr-zwmh-20260822T140937Z-7efd-plan.md`）が解消され、`npm run lint:fm` が成功する。
- plan を再生成しても同じ結果になる。
- 上記を検証する unit test が追加され、`npm run test:unit` と `npm run lint:fm` が成功する。

## 3. 作業内容

| No  | 作業                                                | 担当 | 状態 | メモ                                          |
| --- | --------------------------------------------------- | ---- | ---- | --------------------------------------------- |
| 1   | `register build` の変換処理を共有できる形に切り出す | ARC  | done | `src/exec-shared.ts` へ共通関数として移動     |
| 2   | plan 生成の本文展開へ適用する                       | ARC  | done | 個票由来の title / description と name へ適用 |
| 3   | 既存の残置 plan を解消する                          | ARC  | done | PJR-ZWMH と今回の生成済み plan を直接補正     |
| 4   | unit test を追加する                                | ARC  | done | 変換、二重化防止、再生成の安定性を検証        |

## 4. 対応結果

- `src/register.ts` に閉じていた `inlineCodeAnglePlaceholders` を `src/exec-shared.ts` へ移し、`register build` と register plan 生成で同じ変換規則を共有した。
- register plan の title / description と frontmatter の name に共通の Markdown 保護処理を適用した。拡張子を含む連結範囲を一つのコードスパンで囲み、文末のピリオドは外に残す。既存の単一・複数バッククォートのコードスパンは保持する。
- `tests/src/exec-register-plan-escape.test.ts` に、山括弧の変換、既存コードスパンの保持、同じ入力からの再生成が同一結果になることを確認する回帰テストを追加した。
- PJR-ZWMH と PJR-AQ9G の生成済み plan、および `lint:fm` が検出した PJR-DCTG 個票 frontmatter の残置箇所をインラインコード化した。残課題はない。

## 5. 関連ドキュメント

- 索引側の対応: [[prj-0001:pjr-zwmh-register-index-angle-placeholder-escape|PJR-ZWMH 登録簿の索引生成で山括弧プレースホルダをインラインコード化し、frontmatter でも検知する]]
- 表記規約: `.github/instructions/markdown.instructions.md` の山括弧プレースホルダの節
- 共有したい実装: `src/register.ts` の `inlineCodeAnglePlaceholders`
- 検知している仕組み: `tools/docs/src/remark-no-unescaped-angle-placeholder.ts`
