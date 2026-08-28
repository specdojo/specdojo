---
specdojo:
  id: prj-0001:pjr-0124-human-plan-integrate-result
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  due_on: "2026-07-31"
  completed_at: "2026-07-25T12:00:00Z"
  conclusion: human実行時のplan生成を廃止し、done_criteria確認をresultへ集約。commitスコープはhumanではresult frontmatterのtargets由来へ切替え（コミット0e0db54a）
  register_events:
    - v: 1
      id: reg_a3754e76f44281a089cb6b433f7b3b16
      ts: "2026-07-25T10:10:47Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "refactor(docs): 横断ディレクトリをプロジェクト直下へ移動"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: human実行時のplan非生成とresultへの統合
        - field: description
          from: ""
          to: "`execution: human` のタスクでは、実行者が plan を参照せず result だけで確認していた。plan の固有価値は HEAD 由来の改ざん耐性ある commit スコープ導出だが、これは agent のプロンプトインジェクション対策であり、敵対 agent が存在しない human では無効になる。したがって human 時は plan を生成せず result へ統合し、commit スコープは result frontmatter の `targets` から導出する。result のチェックは現状で最低限のため温存し、done_criteria 確認の一元的な受け皿とする。"
        - field: type
          from: ""
          to: todo
        - field: priority
          from: ""
          to: medium
        - field: owner
          from: ""
          to: _TODO_
        - field: registered
          from: ""
          to: _TODO_
        - field: due
          from: ""
          to: _TODO_
        - field: completed
          from: ""
          to: "-"
        - field: conclusion
          from: ""
          to: "-"
        - field: block_reason
          from: ""
          to: "-"
      legacy_commit: 393767768e66c987bff6cfac9914f208620e9166
    - v: 1
      id: reg_7a511e781f2298e9f334e5c450d83743
      ts: "2026-08-09T10:55:22Z"
      action: close
      actor: SpecDojo Test
      from_status: open
      to_status: done
      reason: "exec(register PJR-9P5Q): 既存登録項目を個票 frontmatter へ一括移行する"
      changes:
        - field: status
          from: open
          to: done
        - field: description
          from: "`execution: human` のタスクでは、実行者が plan を参照せず result だけで確認していた。plan の固有価値は HEAD 由来の改ざん耐性ある commit スコープ導出だが、これは agent のプロンプトインジェクション対策であり、敵対 agent が存在しない human では無効になる。したがって human 時は plan を生成せず result へ統合し、commit スコープは result frontmatter の `targets` から導出する。result のチェックは現状で最低限のため温存し、done_criteria 確認の一元的な受け皿とする。"
          to: execution:humanはplanを読まないため、human時はplanを生成せずresultへ統合し、commitスコープをresult由来に切替える
        - field: owner
          from: _TODO_
          to: ARC
        - field: due
          from: _TODO_
          to: "2026-07-31"
        - field: conclusion
          from: "-"
          to: human実行時のplan生成を廃止し、done_criteria確認をresultへ集約。commitスコープはhumanではresult frontmatterのtargets由来へ切替え（コミット0e0db54a）
      legacy_commit: dbac152079df02ec9bbad154a3253c043e10655a
      previous_event_id: reg_a3754e76f44281a089cb6b433f7b3b16
    - v: 1
      id: reg_ffeeb8235ec4ab8b4e4b2fd11c29f0ec
      ts: "2026-08-09T14:39:40Z"
      action: update
      actor: SpecDojo Test
      from_status: done
      to_status: done
      reason: "exec(register PJR-EQAQ): 登録簿日時をregistered_at・completed_atへ移行する"
      changes:
        - field: completed
          from: "-"
          to: "2026-07-25"
      legacy_commit: 38201bef867f3cc1454db6b748fc979ed3f2fa8f
      previous_event_id: reg_7a511e781f2298e9f334e5c450d83743
---

# PJR-0124 human実行時のplan非生成とresultへの統合

## 1. 概要

execution:humanはplanを読まないため、human時はplanを生成せずresultへ統合し、commitスコープをresult由来に切替える

`execution: human` のタスクでは、実行者が plan を参照せず result だけで確認していた。plan の固有価値は HEAD 由来の改ざん耐性ある commit スコープ導出だが、これは agent のプロンプトインジェクション対策であり、敵対 agent が存在しない human では無効になる。したがって human 時は plan を生成せず result へ統合し、commit スコープは result frontmatter の `targets` から導出する。result のチェックは現状で最低限のため温存し、done_criteria 確認の一元的な受け皿とする。

## 2. 完了条件

- `execution: human` のタスクで plan が生成されない（`exec build` の `generateReadyHumanPlans` が human plan を作らない）。
- human タスクの commit スコープが result frontmatter の `targets` から導出される（agent 非敵対のため HEAD 改ざん耐性は要件から外す）。
- done_criteria の確認が result 側に一元化され、plan と result の二重掲載が解消している。
- finalize の確定手順・共通規約が静的な recipe / standard に一本化され、plan 生成に依存しない。
- `npm run build`・`npm run lint:ts`・関連テストが通る。

## 3. 作業内容

<!-- prettier-ignore -->
| No | 作業 | 担当 | 状態 | メモ |
| --- | --- | --- | --- | --- |
| 1 | `exec build` の human plan 生成（`generateReadyHumanPlans`）を停止する | ARC | done | build から生成処理を削除し、human の `exec plan` も result 利用を案内して拒否 |
| 2 | commit スコープ導出を human 時に result frontmatter の `targets` 由来へ切替える | ARC | done | HEAD 上の `execution: human` result を優先し、human の `ready` 昇格を許可 |
| 3 | human result テンプレへ done_criteria チェックを集約（plan の最終確認項目を統合） | ARC | done | `xer-human-*-template.md` を作業指示と確認記録の受け皿に統合 |
| 4 | finalize の確定手順・共通規約を静的 recipe / standard へ移設し result から参照する | ARC | done | [[specdojo:exec-human-finalize-recipe\|Human Finalize 実行レシピ]] / [[specdojo:exec-human-finalize-standard\|Human Finalize 実行標準]]を新設 |
| 5 | 既存 human plan テンプレ・生成物を整理し、影響とテストを更新する | ARC | done | `xep-human-*-template.md` を削除し、schema・guide・関連テストを更新 |

## 4. 対応結果

- `exec build` を generated 更新専用に戻し、human plan の自動生成処理と専用テンプレートを削除した。
- human の claim result に `execution: human` と `targets` を記録し、存在しない `plan_ref` は出力しない構造へ変更した。
- commit scope は agent では HEAD 上の plan、human では HEAD 上の result を正本として導出するよう分岐した。
- done_criteria、確定対象、確定判断を human result に集約し、[[specdojo:exec-human-finalize-recipe|Human Finalize 実行レシピ]]と [[specdojo:exec-human-finalize-standard|Human Finalize 実行標準]]への参照を追加した。
- `npm run build`、`npm run lint:ts`、関連テストを実行し、すべて成功した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-0122-review-launch|launch trackの振り返り]] — 起票元（対策案「executionがhuman時にplanをつくるか」）
- [[specdojo:exec-config-guide]] — commit 許可リスト / プロンプトインジェクション対策の正本（影響先）
