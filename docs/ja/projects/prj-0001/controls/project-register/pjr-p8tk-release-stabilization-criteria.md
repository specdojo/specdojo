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

### 2.4. 判定基準ごとの状況（2026-10-09 未明）

| #   | 基準                                                                | 状況                                                                                                                                                                                                                |
| --- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 成果物の消失・誤った状態・統合の誤りにつながる未解決の issue がない | 該当なし。導入の経路の issue は PJR-TM1B・PJR-A0NE とも 10/9 に完了                                                                                                                                                 |
| 2   | develop で `npm run check` が通る                                   | 統合のたびに親検証と commit のフックで確認している。最終の確認は公開の直前に行う                                                                                                                                    |
| 3   | 公開物での実地の確認                                                | 達成（grade を除く）。10/9 に PJR-755T・PJR-DJFT を入れた tarball で、claude（sonnet）と codex の exec が統合まで通った。適用外の検査は申し送りに残った。grade は v0.3.0 では部品のみ・試験的と明記した（PJR-DJFT） |
| 4   | 直近の exec の 5 回が runner の不具合なしに終わる                   | 数え直し中。10/9 は PJR-A0NE・PJR-755T・PJR-DJFT と試用の 2 件が runner の不具合なしに終わった（5 回）。PJR-HQKV が定期実行のステージ済みファイルで止まった件は PJR-PJBN で修正した（10/9）                         |
| 5   | 修正版がある high 以上の脆弱性を放置していない                      | 達成。`fast-glob` を置き換え、`npm audit --omit=dev` は 0 件（PJR-HQKV、10/9）                                                                                                                                      |
| 6   | PJR-HRMS と PJR-CBQV が済んでいる                                   | PJR-HRMS は 10/9 に完了（公開日の記入だけが公開当日の PO の作業）。PJR-CBQV は利用者の作業（npm の公開）                                                                                                            |
| 7   | devcontainer scaffold の確認                                        | 未確認（PJR-2H5F・PJR-EZAF・PJR-J7WE は利用者の実機での確認待ち）                                                                                                                                                   |

### 2.5. 判定基準ごとの状況（2026-10-12）

利用者の判断（2026-10-12）により、全利用者に関わる PJR-WP44・PJR-ADZ6、複数リポジトリの PJR-B2EC・PJR-GBVM・PJR-BJH6・PJR-86Q5・PJR-2GZE、導入手順の PJR-J2AS、判定の PJR-HJ99 を公開前に直し、いずれも統合して閉じた。用語の整理（PJR-9G9Y・PJR-34F2）と CHANGELOG の追記（PJR-MTFA）も済んだ。

| #   | 基準                                                                | 状況                                                                                                                                                                                                                                                    |
| --- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 成果物の消失・誤った状態・統合の誤りにつながる未解決の issue がない | 達成。未完了の issue は PJR-W2EB（負荷によるテストの時間切れ。公開後でよいと判定済みで CHANGELOG の既知の問題に記載）、PJR-1DKD・PJR-G85C（開発環境）のみ                                                                                               |
| 2   | develop で `npm run check` が通る                                   | 統合ごとの親検証（lint・型検査・単体・統合テスト・schema）は通っている。公開の直前に main で確かめる                                                                                                                                                    |
| 3   | 公開物での実地の確認                                                | 一部。2026-10-12 に `npm pack` の tarball で `config init` から `register build`、`config scaffold --provider claude`（`orch:opus` の追加）までを確かめた。10/09 以降の変更が多いため、main への昇格後に `exec run --register` から統合までを確かめ直す |
| 4   | 直近の exec の 5 回が runner の不具合なしに終わる                   | 達成。判定の修正の統合後の 5 回（PJR-J2AS、PJR-34F2、PJR-GRMK の再開、PJR-HJ99 の再開、PJR-MTFA の再開）は runner の不具合なしに統合まで終わった。agent が書いたテストの誤りは数えない                                                                  |
| 5   | 修正版がある high 以上の脆弱性を放置していない                      | 達成（2026-10-12 の `npm audit --omit=dev` は 0 件）                                                                                                                                                                                                    |
| 6   | CHANGELOG と docs-site の公開                                       | CHANGELOG は PJR-MTFA で追記済み。PJR-CBQV（docs-site の公開）と PJR-WJZD（docs-lint の公開）は利用者の作業として残る                                                                                                                                   |
| 7   | devcontainer scaffold の確認                                        | 利用者が実機で確認中（PJR-2H5F・PJR-EZAF・PJR-J7WE）。PJR-FPCM は本リポジトリの devcontainer の再ビルド時に確認する。確認で見つけた点は PJR-J2AS（直した）と PJR-PV5B（既知の問題に記載）へ分けた                                                       |

残る作業は、明朝の定期実行の確認と PJR-VQZA・PJR-MD3C の close、main への昇格、main での `npm run check` と実地の確認、PJR-CBQV・PJR-WJZD・devcontainer の確認、`v0.3.0` のタグの push である。

### 2.6. 公開前の確認（2026-10-12 夜）

- 基準 2: develop（f3b5b03e3）で `npm run check` が通った（テスト 145 ファイル・2226 件）。main への昇格後にもう一度確かめる。
- 基準 3: develop から `npm pack` した tarball（specdojo 0.3.0）を新しいリポジトリへ入れ、利用者と同じ手順で確かめた。`config init`（`.gitignore` に `node_modules/` が入る）→ `config scaffold --provider claude`（`orch:opus`・`orch:sonnet` が追加される）→ `exec-defaults.yaml` の `command_template` と `agent-members.yaml`（claude の 3 名）を案内どおり用意 → `register scaffold` → `register add`（todo）→ `exec run --register --worktree`（agent を指定せず `claude-executor` と `claude-reporter` が自動で選ばれた）→ 統合して `review` → `register close` まで通った。grade は v0.3.0 では部品のみ・試験的のため対象外とした。利用者のリポジトリに markdownlint が無い場合、result の commit 前の lint は飛ばされる（`result-markdownlint: markdownlint-cli not found; skipped`）。
- routine の新しい流れ（PJR-VQZA・PJR-MD3C）: Job Run の worktree での実行、runner の commit、claude-expert の review、verdict による統合までを試し実行で確かめた（f3b5b03e3）。途中で見つかった PJR-4VAC・PJR-DXDC・PJR-BJTC は直して統合した。今夜の定期実行の結果を明朝確かめる。

### 2.7. main への昇格後の確認（2026-10-12 夜）

- PR #11 で develop（4a7143a64）を `main` へ昇格した（d23f5599b）。merge で起動した workflow はない。`main` と develop の先端は内容が一致する。
- 基準 2: `main` と同じ内容で `npm run check` を実行し、2226 件中 2225 件が通った。残る 1 件（`doc-index.test.ts`）は 20 秒の時間切れで、単独の再実行では 28 件すべてが約 4 秒で通った。負荷による一時的な時間切れ（PJR-W2EB、既知の問題に記載）と判断した。
- 公開の準備: `@specdojo/docs-lint` は 0.1.0 の公開（2026-09-23）以降に脆弱性の修正・lint の追加・依存の更新が入っているため、0.2.0 へ上げて公開する。`@specdojo/docs-site` 0.2.0 は未公開（PJR-CBQV）。`deploy.yml` が使う `github-pages` environment に `v*` のタグの規則を加える必要がある。

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
