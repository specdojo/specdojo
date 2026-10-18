---
specdojo:
  id: prj-0001:pjr-g90k-integrate-index-lock-retry
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-18T16:42:24Z"
  derived_from:
    - PJR-RY4C
---

# PJR-G90K 統合の git 操作が index.lock の一時的な取り合いで待たずに失敗する

## 1. 課題内容

2026-10-19 01:32 と 01:41 に、PJR-EVAX の統合が git restore failed: Unable to create .git/index.lock で失敗した。並行の run の統合や記帳と同じ時刻に重なったためで、ロックはすぐに外れる一時的なものだった。runner の統合の git 操作は index.lock を待たずに失敗し、run を waiting にする。並行の run が多い夜間の自動実行では起こりやすい

## 2. 影響範囲

| 観点         | 影響                                                                          |
| ------------ | ----------------------------------------------------------------------------- |
| スコープ     | runner の統合と記帳の git の操作（`src/shared/git.ts` などの git の呼び出し） |
| スケジュール | 中。並行の run が多いと、統合が一時的なロックの取り合いだけで止まる           |
| コスト       | 止まった run を統合からやり直す手間                                           |
| 品質         | 成果物に問題のない run が `waiting` になる                                    |
| 関係者       | 並行で `exec run` を流す利用者、夜間の自動実行                                |

## 3. 対応方針

| 項目     | 内容                                                                                                                                        |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | runner の git の操作は、`.git/index.lock` が一時的にあると `Unable to create ... index.lock` で失敗し、統合をやめて run を `waiting` にする |
| 対応策   | index.lock の取り合いで失敗した git の操作を、短い間隔で数回やり直す                                                                        |
| 依存事項 | なし                                                                                                                                        |
| 完了条件 | 下記の完了条件を満たす                                                                                                                      |

### 3.1. 完了条件

- runner の統合と記帳の git の操作が `Unable to create '...index.lock': File exists`（日本語のメッセージを含む）で失敗した場合、短い間隔（例: 1〜2 秒）で上限の回数（例: 10 回）までやり直す。上限に達したら、今までどおり失敗として報告し、ロックのファイルのパスをメッセージに含める。
- ロックのファイルを runner が消すことはしない（ほかの git の操作が実際に動いている場合があるため）。
- やり直しの仕組みは、dubious ownership のやり直し（RY4C）など既存の仕組みがあればそれに合わせ、1 か所にまとめる。
- 単体テストで、index.lock の失敗が数回続いた後に成功する場合と、上限に達して失敗する場合を確かめる。時間は固定するか待ち時間を差し替えて、テストを遅くしない。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- runner のコードを変えるため、統合の後に `exec run --register` を 1 回流して動作を確かめる（PJR-JSEY）。
- CHANGELOG は、未公開の版の節（`## [0.4.1] - 未定`）に書く。公開済みの版の節は変えない。

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-ry4c-register-commit-git-status-buffer]]（元の項目）
- [[prj-0001:pjr-evax-spec-do-notation]]（止まった実行）
