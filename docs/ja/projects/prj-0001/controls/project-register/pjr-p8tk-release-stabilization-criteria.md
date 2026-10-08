---
specdojo:
  id: prj-0001:pjr-p8tk-release-stabilization-criteria
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-08T03:45:54Z"
  due_on: null
---

# PJR-P8TK 公開前に exec の未解決の不具合を棚卸しし、公開の判定基準を決める

## 1. 概要

v0.3.0 の公開前に、exec の再開・統合・判定まわりの未解決の不具合と既知の問題を棚卸しし、公開してよいかの判定基準（未解決を許す範囲など）を決める。

## 2. 完了条件

- 公開の判定基準を本個票に記録し、利用者の承認を得る（下記「公開の判定基準」）。
- 必須の基準をすべて満たしたことを確かめ、結果を対応結果に記録する。
- 公開してから対応してよいものを、既知の問題として CHANGELOG に載せるか、todo として残す。

### 2.1. 公開の判定基準（2026-10-08、利用者が承認）

必須（すべて満たしたら公開してよい）:

1. 登録簿に、成果物の消失・誤った状態の記録・統合の誤りにつながる未解決の issue がない。
2. develop で `npm run check`（単体・統合のテストを含む）が通る。
3. 公開物での実地の確認: `npm pack` で作った tarball を一時的なリポジトリに入れ、`config init` → register の起票・close・build → `exec run --register` で 1 件 → grade で 1 文書、の流れが通る。
4. 直近の実際の exec の 5 回が、runner の不具合なしに終わる（利用制限など agent 側の失敗は数えない）。
5. 本体の実行時の依存に、修正版があるのに放置している high 以上の脆弱性がない。修正版がないものは CHANGELOG の既知の問題に書く。
6. [[prj-0001:pjr-hrms-v030-changelog-finalize]]（CHANGELOG と移行ガイド）と [[prj-0001:pjr-cbqv-docs-site-npm-publish]]（docs-site の公開）が済んでいる。
7. devcontainer scaffold は、実機で確認済みか、CHANGELOG で試験的な機能と明記する。

公開してから対応してよいもの: 並列実行時の統合の commit のフックの一時的な失敗（`--resume` で回避できる。既知の問題として書く）、dubious ownership の根本の原因、medium と low の項目（普及戦略の段階 0 の残りを含む）。

### 2.2. 棚卸しの結果（2026-10-08）

| #   | 事象                                                                                                      | 状態                                         |
| --- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| a   | 並列で流すと、統合の commit のフックで全テストが一時的に失敗する（PJR-PG6W の初回）                       | 起票する                                     |
| b   | dubious ownership が一時的に起きる根本の原因                                                              | 未解明。再試行で緩和済み（PJR-VX97）         |
| c   | 本体の実行時の依存に high が 3 件（`fast-glob` → `micromatch` → `braces` のサービス不能攻撃。修正版なし） | 起票する。CHANGELOG では対応済みと書いている |
| d   | docs-site と docs-lint の脆弱性                                                                           | CHANGELOG の既知の問題に記載済み             |
| e   | devcontainer scaffold（PJR-2H5F・PJR-EZAF・PJR-J7WE）                                                     | 実機での確認待ち                             |
| f   | CHANGELOG の未反映と docs-site の未公開                                                                   | PJR-HRMS・PJR-CBQV                           |

登録簿の未完了の issue と risk は 0 件。10/01 以降に `fix(exec)` の commit が 6 件あり、ほかに exec で直した runner の不具合が 5 件（PJR-GHKD・PJR-0ECY・PJR-PG6W・PJR-BK4K・PJR-R8WR）ある。いずれも実際の実行で見つかった。

### 2.3. 公開物での実地の確認の途中経過（2026-10-08）

`npm pack` の tarball（specdojo 0.3.0）を一時的なリポジトリに入れ、利用者と同じ手順で試した。

| 手順                               | 結果                                                                                                                                                         |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `npm install`（tarball）           | 成功                                                                                                                                                         |
| `config init`、`register scaffold` | 成功                                                                                                                                                         |
| register の起票・決定・build       | 成功。日本語のタイトルの topic が `item` などになる（PJR-17HH）                                                                                              |
| `config scaffold --provider codex` | codex の agent の定義と `npm run orch:codex` を作る。起動コマンド（`exec-defaults.yaml`）と agent の名簿（`agent-members.yaml`）は作らず、手で書く必要がある |
| `exec run --register`（codex）     | 既定の設定では agent が読まれず失敗した（PJR-WZYW）。人の名簿と `members_path` を足す回避策で成功し、成果物の更新と review への遷移を確かめた                |
| grade                              | 未実施。成果物カタログと設定のキー（`catalog_path`）を手で足す必要がある                                                                                     |

判定基準 3 は、PJR-WZYW（公開を止める不具合）を直したあとに、grade まで含めて確かめ直す。

### 2.4. 判定基準ごとの状況（2026-10-08 深夜）

| #   | 基準                                                                | 状況                                                                                                                                                                           |
| --- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | 成果物の消失・誤った状態・統合の誤りにつながる未解決の issue がない | 該当なし。ただし導入の経路の issue が 2 件未解決（PJR-TM1B: claude の既定の書き込み許可が狭い、PJR-A0NE: 適用外の検査の not_run で止まる）。利用者の判断待ち                   |
| 2   | develop で `npm run check` が通る                                   | 統合のたびに親検証と commit のフックで確認している。最終の確認は公開の直前に行う                                                                                               |
| 3   | 公開物での実地の確認                                                | 一部達成。tarball で init・記帳・クイックスタートの手順は通った（PJR-6QDA・PJR-XMQH）。exec は codex で作業まで進むが、claude では PJR-TM1B・PJR-A0NE で止まる。grade は未確認 |
| 4   | 直近の exec の 5 回が runner の不具合なしに終わる                   | 未達成。今日も runner の判定の抜け（PJR-SDWF ほか）を直した。PJR-TM1B・PJR-A0NE の決着後に数え直す                                                                             |
| 5   | 修正版がある high 以上の脆弱性を放置していない                      | `braces` は修正版なし（PJR-HQKV）。既知の問題として CHANGELOG に書く（PJR-HRMS）                                                                                               |
| 6   | PJR-HRMS と PJR-CBQV が済んでいる                                   | PJR-HRMS は codex の利用制限の解除後（10/9 1:50）に再開を予約。PJR-CBQV は利用者の作業（npm の公開）                                                                           |
| 7   | devcontainer scaffold の確認                                        | 未確認（PJR-2H5F・PJR-EZAF・PJR-J7WE は利用者の実機での確認待ち）                                                                                                              |

## 3. 作業内容

| No  | 作業                                   | 担当         | 状態 | メモ                       |
| --- | -------------------------------------- | ------------ | ---- | -------------------------- |
| 1   | 未解決の不具合と既知の問題を棚卸しする | orchestrator | done | 2.2.                       |
| 2   | 判定基準を決める                       | PO           | done | 2.1.                       |
| 3   | 必須の基準を満たすことを確かめる       | orchestrator | open | 公開物での実地の確認を含む |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-nyzr-adoption-strategy]]（普及戦略）
- [[prj-0001:pjr-hrms-v030-changelog-finalize]]（CHANGELOG と移行ガイド）
