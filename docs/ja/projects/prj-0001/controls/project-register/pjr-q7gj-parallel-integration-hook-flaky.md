---
specdojo:
  id: prj-0001:pjr-q7gj-parallel-integration-hook-flaky
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-10-08T12:32:32Z"
  due_on: null
  completed_at: "2026-10-09T12:08:15Z"
  conclusion: hook の並列の生成（register-build・index-build）と、実リポジトリの generated/pjr-index.md を読む doc-index のテストの競合を原因と特定し、テストを一時ディレクトリの fixture へ移した。commit・merge の失敗時は hook の出力の全文を integrate.log へ保存し、要約に FAIL と集計の行を残す。
---

# PJR-Q7GJ 並列実行で統合の commit のフックのテストが一時的に失敗する

## 1. 課題内容

exec run --parallel で 3 件を並べて流したとき、PJR-PG6W の統合段の commit で lefthook の pre-commit が実行する全テストが失敗した。同じ worktree で全テストを実行し直すと 2039 件すべて通り、--resume で統合できた。並列の親検証・統合とフックのテストが重なり、資源の競合で一時的に失敗したとみられる。原因の特定か、統合の commit でのフックの扱いの見直しが要る。

2026-10-08 の PJR-6QDA の統合でも同じ失敗が起きた。このときは並列ではなく単独の実行だった。同じ worktree で全テストを実行し直すと 2084 件すべて通り、`--resume` で統合できた。並列実行に限った問題ではない。

## 2. 影響範囲

| 観点         | 影響                                                                                         |
| ------------ | -------------------------------------------------------------------------------------------- |
| スコープ     | 統合段の commit で動く pre-commit hook の出力の記録、hook のテストが読むリポジトリ内の生成物 |
| スケジュール | v0.3.0 の公開の判定基準 4 と CHANGELOG の既知の問題に関わる                                  |
| コスト       | 作業が済んだ項目が waiting になり、`--resume` の手間が要る                                   |
| 品質         | 失敗したテストの名前が記録に残らず、原因を追えない                                           |
| 関係者       | exec run を使う本リポジトリの開発と、hook でテストを回す利用者                               |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | 未特定。2026-10-09 の調べでは、統合の commit の失敗の理由に hook の出力の冒頭（テストが意図して出す `unknown option '--reserve'` などの stderr）しか残らず、落ちたテストの名前が記録にない。仮説として、`lefthook.yml` の pre-commit は `parallel: true` で `npm test` と `register-build`・`index-build`（生成物 `generated/pjr-index.md`・`.specdojo/doc-index.json` を書き直す）を同時に動かすため、生成物を読むテスト（`tests/src/doc-index.test.ts` など）が書き換え中のファイルを読む競合が考えられる |
| 対応策   | 記録を直して原因を追えるようにし、仮説を確かめて直す。下記の「完了条件の詳細」のとおり                                                                                                                                                                                                                                                                                                                                                                                                                      |
| 依存事項 | PJR-R8WR（親検証の失敗の出力の保存）                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| 完了条件 | 下記の「完了条件の詳細」を満たす                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

### 3.1. 完了条件の詳細

- 統合段（および checkpoint）の `git commit` が失敗したとき、hook の stdout / stderr の全文を秘匿処理のうえ evidence の run ディレクトリへ保存する（PJR-R8WR の親検証のログと同じ扱い）。失敗の理由と要約には、出力の先頭だけでなく末尾（vitest の `FAIL` 行や `Test Files` の集計を含む部分）を残す。
- 仮説（hook の並列の生成とテストの競合）を確かめる。`npm test` の対象のうち、リポジトリ内の生成物（`generated/` 配下、`.specdojo/doc-index.json` など）を読むテストを洗い出し、hook の生成と同時に動くと結果が変わりうるかを調べる。
  - 競合しうるテストは、一時ディレクトリの fixture を使うなど、hook の生成物に依存しない形へ直す。
  - `lefthook.yml` の変更（テストを生成の後に回すなど）が必要と判断した場合は、`lefthook.yml` は保護対象のため変更せず、変更案を result の申し送りへ書く。
  - 仮説が成り立たない場合は、調べた範囲と根拠を本個票の対応結果に残す。
- unit test で、統合の commit の失敗時に hook の出力の全文が保存され、要約に末尾が残ることを確かめる。
- CHANGELOG の v0.3.0 の既知の問題（PJR-Q7GJ）を、結果に合わせて更新する（解消した場合は不具合修正へ移す）。
- `npm run check` が通る。

## 4. 対応結果

- 原因は `lefthook.yml` の `parallel: true` で `test` と `register-build` / `index-build` が
  同時に動く一方、`tests/src/doc-index.test.ts` の「prj-0001 project register references」が
  `process.cwd()` の実リポジトリを走査し、`generated/pjr-index.md` を読み込んでいたことである。
  hook の生成処理が同じファイルを書き換える途中にテストが読む競合があり、単独の exec 実行でも
  hook 内部の並列処理だけで発生しうる状態だった。
- 該当テストは、追跡対象の `docs/` を一時ディレクトリへ複製し、必要な
  `generated/pjr-index.md` を fixture 内に作って検査する形へ変更した。実リポジトリの生成物を
  読み書きしないため、hook の `register-build` / `index-build` と同時に動いても結果が変わらない。
  ほかの生成物を読むテストも確認し、対象となる各テスト自身が一時ディレクトリで生成・検査して
  いることを確認した。競合源をテスト側で除いたため、保護対象の `lefthook.yml` は変更していない。
- checkpoint と統合段の task / product / register-state commit、post-hook amend、merge が失敗した
  場合に、stdout / stderr の全文を共通の秘匿処理後に run の `integrate.log` へ保存するようにした。
  checkpoint は pipeline の run ID を commit 前に確定し、失敗ログを同じ evidence run
  ディレクトリへ残す。失敗理由の要約には先頭側のステップとエラーに加え、末尾側の `FAIL`、
  `Test Files`、`Tests` 行を最大3行残す。
- unit test で全文保存・秘匿・末尾要約を、integration test で merge hook の実出力保存と秘匿を
  固定した。共通の検証一式は executor 終了後に親 runner が実行する。

## 5. 関連ドキュメント

- [[prj-0001:pjr-p8tk-release-stabilization-criteria]]（公開の判定基準）
