---
specdojo:
  id: prj-0001:pjr-2fv2-release-v0-6-0
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  difficulty: medium
  owner: PO
  registered_at: "2026-10-31T08:35:35Z"
  due_on: "2026-11-30"
  completed_at: "2026-10-31T09:31:01Z"
  conclusion: "specdojo 0.6.0 と @specdojo/docs-lint 0.4.0 を 2026-10-31 に公開した（PR #27、merge commit 9eb96b807）。docs-site は 0.3.0 のまま"
---

# PJR-2FV2 0.6.0 でリリースする

## 1. 概要

`specdojo` 0.6.0 と `@specdojo/docs-lint` 0.4.0 を公開する。`@specdojo/docs-site` は変更がないため 0.3.0 のままとする。

## 2. 入力

- 2026-10-31 の対話で利用者がリリースを指示した。版は specdojo 0.6.0、@specdojo/docs-lint 0.4.0（`_CONTEXT_` の目印の検出を追加したため minor）、@specdojo/docs-site は 0.3.0 から変更がないため上げない
- CHANGELOG に破壊的変更の節はないが、schedule の guided-pass の approach が fully-guided から draft に変わったことと、fully-guided が宣言された文書だけを参照する磨き込み専用になったことを、版の節の先頭で目立たせる
- 手順は pm-orchestrator-playbook のリリースの手順に従う。push・PR の merge・タグ・npm の公開の承認は利用者が行う

## 3. 完了条件

- `package.json` と `package-lock.json` の版が `0.6.0` で、`CHANGELOG.md` の `[Unreleased]` を `0.6.0` の節として日付を付けて確定している。
- `packages/docs-lint` の `package.json` と `package-lock.json` の版が `0.4.0` で、`CHANGELOG.md` の `0.6.0` の節の冒頭に、`@specdojo/docs-lint` 0.4.0 を同時に公開することと、その変更内容を記載している。`packages/docs-site` の版は変えない。
- `CHANGELOG.md` の `0.6.0` の節の先頭に、利用者から見て動きが変わる点（schedule の `guided-pass` の approach が `draft` になったこと、`fully-guided` が宣言された文書だけを参照する磨き込み専用になったこと）をまとめている。
- ルートと `packages/docs-lint`・`packages/docs-site`・`packages/vscode-specdojo` の `npm ci` が通り、クリーンな作業ツリーで `npm run check` が通る。
- `npm pack` の配布物（本体・docs-lint）を空の Git リポジトリへ入れ、次の動作を確かめる。
  - `init` と `register add`（`--input`・`--commit-type` を含む）
  - `deliverable scaffold --target`（カタログのない成果物）で作った雛形が docs-lint の `lint:fm` を通ること
  - `exec run --register`（start から review まで）
  - docs-lint の `_CONTEXT_` の目印の検出（ready 以外は情報、ready はエラー）
- 公開候補が PR の merge commit で `main` へ入り、その commit を指す `v0.6.0`・`docs-lint-v0.4.0` のタグからそれぞれの npm の公開 workflow が起動する。push・PR の merge・タグ・npm の公開の承認は利用者が行う。
- 公開後に npm の `latest` が `specdojo` は `0.6.0`、`@specdojo/docs-lint` は `0.4.0` であること、タグで起動した workflow の結果、npm から入れた版の動作を確かめる。

## 4. 作業内容

| No  | 作業                                                        | 担当                  | 状態 | メモ |
| --- | ----------------------------------------------------------- | --------------------- | ---- | ---- |
| 1   | 版と CHANGELOG を確定し、`npm ci` と `npm run check` を流す | specdojo-orchestrator | done | -    |
| 2   | 配布物を空のリポジトリで試す                                | specdojo-orchestrator | done | -    |
| 3   | PR・merge・タグ・公開の承認                                 | PO                    | done | -    |
| 4   | 公開後の確認                                                | specdojo-orchestrator | done | -    |

## 5. 対応結果

specdojo 0.6.0 と @specdojo/docs-lint 0.4.0 を 2026-10-31 に公開した。@specdojo/docs-site は 0.3.0 のまま。

- 版と CHANGELOG: `feature/prj-0001/release-v0.6.0` で specdojo を 0.6.0、docs-lint を 0.4.0 に上げ、`[Unreleased]` を `## [0.6.0] - 2026-10-31` にした。節の先頭に、同梱パッケージの説明と「利用者から見て動きが変わる点」（`guided-pass` の approach が `draft` になったこと、`fully-guided` が磨き込み専用になったこと）を書いた。
- 検証: ルートと 3 package の `npm ci` が通り、リリースのブランチで `npm run check` が通った（193 テストファイル、3,224 テスト）。
- 配布物の試用: 2 つの tarball を空のリポジトリに入れ、`init`、`register add`（`--input`・`--commit-type`・`--commit-scope`）、`deliverable scaffold --target` で作ったカタログのない成果物の雛形の docs-lint の通過、`_CONTEXT_:` の検出（draft は情報、ready はエラー）、`exec run --register`（claude の executor・reporter で start から review と統合）を確かめた。
- 試用で見つけた docs-lint の `remark/md-content` を options なしで読み込むと失敗する問題は、PJR-5EN3 で公開の前に直し、0.4.0 に含めた。
- 公開: PR #27（<https://github.com/specdojo/specdojo/pull/27>）を merge commit `9eb96b807` で main に入れ、`v0.6.0`・`docs-lint-v0.4.0` のタグを付けた。公開の workflow（41188544012・41188544055）はどちらも success。push・PR の merge・タグ・npm の公開の承認は利用者が行った。
- 公開後の確認: npm の `latest` は specdojo が 0.6.0、@specdojo/docs-lint が 0.4.0。npm から入れた版で `init`、`register add`、`deliverable scaffold --target` の雛形の docs-lint の通過、options なしの `md-content` での `_CONTEXT_:` の検出（情報）を確かめた。
- main を develop へ取り込んだ（早送り）。

## 6. 関連ドキュメント

- [[prj-0001:pm-orchestrator-playbook]]
- [[prj-0001:pjr-fmj5-release-v0-5-0]]
