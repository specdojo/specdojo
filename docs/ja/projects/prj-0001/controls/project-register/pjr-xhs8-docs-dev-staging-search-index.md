---
specdojo:
  id: prj-0001:pjr-xhs8-docs-dev-staging-search-index
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-22T23:45:22Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-BBTW
  commit_type: perf
  commit_scope: docs-site
---

# PJR-XHS8 docs:dev の起動で型の複製と検索の索引の色付けを省く

## 1. 概要

kata-staging の更新時刻の比較で端数が落ちて毎回複製する。dev の検索の索引の描画で Shiki の色付けをしている。合わせて約 10 秒

## 2. 入力

- docs:dev の起動を速くする（利用者の依頼、2026-11-23）。devcontainer を作り直した後の 2 回目の起動で 58.4 秒だった

## 3. 完了条件

- `packages/docs-site/.vitepress/kata-staging.ts` の `copyIfChanged` が、毎回複製する動きを直す。複製先へ書き戻す更新時刻は 1 ミリ秒未満の端数が落ちる（2026-11-23 に、元が `.006373083`、複製が `.006000000` であることを確かめた）ため、更新時刻の比較に 1 ミリ秒の幅を持たせるなど、2 回目の起動では変わっていないファイルを複製しないようにする。
- dev の起動のときの検索の索引の描画（`renderSearchHtml` まわり）で、コードブロックの色付け（Shiki）をしない。検索で引ける文字は変えない。ページの表示の色付けは変えない。
- 直す前と直した後で、検索の索引に入る文字が変わらないことを代表のページで確かめ、確かめ方を個票の対応結果に書く。
- 2026-11-23 の測りでは、dev サーバーの起動（生成の段を除く）が約 26 秒で、型の複製が約 4 秒、検索の索引の色付けが約 6 秒だった（CPU プロファイル）。直した後に、2 回目の起動の時間を 3 回測り、前後を個票の対応結果に書く。測りは統合の後に orchestrator が行ってもよい。
- 単体テストを足す（更新時刻の端数が違うだけのファイルを複製しない）。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証を通す。
- 2 回目の実行（2026-11-23）: 1 回目は直しと単体テストを終えたが、検索の索引の比較と起動の時間の測りを sandbox の中で流せず、waiting になった。比較と測りはオーケストレーターが行った。結果は次のとおりで、executor はこれを個票の対応結果に書き写し、作業内容の表の比較と測りの行を done にする。executor は比較と測りを流し直さない。
  - 本体の作業ツリーの文書に向けて dev サーバーを起動し、`/specdojo/` が 200 を返すまでを、温めの 1 回の後に 3 回ずつ測った。直す前（develop の docs-site）は 23.9・23.4・23.9 秒（平均 23.7 秒）、直した後（この worktree の docs-site）は 16.3・15.7・15.8 秒（平均 15.9 秒）だった。worktree の中の文書だけでは、直す前も直した後も約 6 秒で差が出なかった（git 管理外の生成のページがないため）。
  - 両方の dev サーバーから日本語の検索の索引（`@localSearchIndexja`）を取り出して比べた。文書の数（15,472）と文書の id は同じだった。語の違いは、測りの合間に dashboard が作り直された時刻の 3 語と、直す前だけにある `x26`・`x3c`（Shiki の色付けが出す HTML の文字参照）の 2 語だけで、本文の文字は変わっていない。

## 4. 作業内容

| No  | 作業                                                      | 担当 | 状態 | メモ                                    |
| --- | --------------------------------------------------------- | ---- | ---- | --------------------------------------- |
| 1   | `copyIfChanged` の更新時刻の比較に 1 ミリ秒の幅を持たせる | DEV  | done | `kata-staging.ts`                       |
| 2   | dev の索引の描画で Shiki の色付けを省く                   | DEV  | done | `config.mts` の `renderSearchHtml`      |
| 3   | 端数違いのファイルを複製しない単体テストを足す            | DEV  | done | `kata-staging.test.ts`                  |
| 4   | 索引の文字の前後比較・2 回目の起動時間の 3 回測定         | DEV  | done | orchestrator が実施（5.2 に結果を転記） |

## 5. 対応結果

### 5.1. 実施内容

- `copyIfChanged` は、更新時刻の差が 1 ミリ秒未満なら複製しない。
- `renderSearchHtml` は、`SPECDOJO_DOCS_COMMAND` が `dev` のときだけ `md.options.highlight` を一時的に外して描画し、`finally` で戻す。build では変えない。ページ表示の色付けは別の描画のため変わらない。

### 5.2. 確かめ方と結果

比較と測りは orchestrator が統合後に行った。executor は流し直していない。

- 索引の文字: 本体の作業ツリーの文書に向けて、直す前（develop の docs-site）と直した後（この worktree の docs-site）の dev サーバーから日本語の検索の索引（`@localSearchIndexja`）を取り出して比べた。文書の数（15,472）と文書の id は同じだった。語の違いは、測りの合間に dashboard が作り直された時刻の 3 語と、直す前だけにある `x26`・`x3c`（Shiki の色付けが出す HTML の文字参照）の 2 語だけで、本文の文字は変わっていない。
- 起動時間: 同じ文書に向けて dev サーバーを起動し、`/specdojo/` が 200 を返すまでを、温めの 1 回の後に 3 回ずつ測った。

| 状態     | 1 回目  | 2 回目  | 3 回目  | 平均    |
| -------- | ------- | ------- | ------- | ------- |
| 直す前   | 23.9 秒 | 23.4 秒 | 23.9 秒 | 23.7 秒 |
| 直した後 | 16.3 秒 | 15.7 秒 | 15.8 秒 | 15.9 秒 |

- 平均で約 7.8 秒短くなった。worktree の中の文書だけでは、直す前も直した後も約 6 秒で差が出なかった（git 管理外の生成のページがないため）。
- 利用者の依頼時の 58.4 秒は devcontainer 作り直し直後の別条件の値で、上の表とは直接比べない。

### 5.3. CHANGELOG に書く事項

- 区分: Performance
- 文案: `docs:dev` の起動で、更新時刻の端数による型の毎回の複製と、検索の索引でのコードブロックの色付けを省き、起動を短くした。

### 5.4. 残課題

- なし（5.2 の確認は orchestrator が完了済み）。
- _ASSUMPTION_: dev 判定は `bin` が渡す `SPECDOJO_DOCS_COMMAND` に依る。

## 6. 関連ドキュメント

- `prj-0001:pjr-index`
