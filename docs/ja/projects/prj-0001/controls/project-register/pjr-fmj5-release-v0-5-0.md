---
specdojo:
  id: prj-0001:pjr-fmj5-release-v0-5-0
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: medium
  owner: BA
  registered_at: "2026-10-28T21:40:56Z"
  due_on: "2026-10-31"
  depends_on:
    - PJR-0QW0
---

# PJR-FMJ5 v0.5.0 を公開する

## 1. 概要

0.4.7 以降の変更（成果物 type の移行という破壊的変更を含む）を v0.5.0 として検証し、main へ昇格して npm に公開する

## 2. 完了条件

- PJR-484B・0D0T・EXH2・WAGY・B4Y4・6RVJ・9ZN5・05GN・EVAE・9SXH・XSM8・H988・N9JC・8NWR がすべて `done` である。
- `package.json` と `package-lock.json` の版が `0.5.0` で、`CHANGELOG.md` の `[Unreleased]` を `0.5.0` の節として日付を付けて確定している。
- `packages/docs-lint` と `packages/docs-site` の `package.json` と `package-lock.json` の版が `0.3.0` で、`CHANGELOG.md` の `0.5.0` の節の冒頭に、`@specdojo/docs-lint` 0.3.0 と `@specdojo/docs-site` 0.3.0 を同時に公開することと、それぞれの変更内容を記載している（利用者の判断、案 A）。
- 破壊的変更を含むため、`CHANGELOG.md` の `0.5.0` の節の先頭に移行手順（rulebook への `deliverable_type` の追加、YAML の旧 type の置き換え、表示ページの再生成）をまとめている。
- ルートと `packages/docs-lint`・`packages/docs-site`・`packages/vscode-specdojo` の `npm ci` が通り、クリーンな作業ツリーで `npm run check` が通る。
- `npm pack` の配布物（本体・docs-lint・docs-site）を空の Git リポジトリへ入れ、`init`、`register add`（`epic` と `--depends-on` を含む）、`exec run --register`、docs-lint の `lint:fm` による `deliverable_type` の照合、docs-site の `build` の動作を確かめる。
- 公開候補が PR の merge commit で `main` へ入り、その commit を指す `v0.5.0`・`docs-lint-v0.3.0`・`docs-site-v0.3.0` のタグからそれぞれの npm の公開 workflow が起動する。push・PR の merge・npm 公開の承認は利用者が行う。
- 公開後に npm の `latest` が `specdojo` は `0.5.0`、`@specdojo/docs-lint` と `@specdojo/docs-site` は `0.3.0` であること、タグで起動した workflow の結果、npm から入れた版の動作を確かめる。

## 3. 作業内容

| No  | 作業                                    | 担当                  | 状態 | メモ                                             |
| --- | --------------------------------------- | --------------------- | ---- | ------------------------------------------------ |
| 1   | 版番号と変更履歴・移行手順を確定する    | specdojo-orchestrator | done | `631268836`、develop へ統合                      |
| 2   | 全体検証と配布物の試用を行う            | specdojo-orchestrator | done | 試用で見つけた問題を PJR-0QW0 で修正後に再確認   |
| 3   | PR を merge し、タグ 3 つを push する   | BA                    | done | PR #25 の merge commit `b52064d29` に 3 つのタグ |
| 4   | npm 公開 3 件を承認し、公開版を確かめる | BA                    | done | npm の `latest` と workflow を確認               |

## 4. 対応結果

- `feature/prj-0001/release-v0-5-0` で、本体を `0.5.0`、`@specdojo/docs-lint` と `@specdojo/docs-site` を `0.3.0` に上げ、`CHANGELOG.md` の `[Unreleased]` を `## [0.5.0] - 2026-10-29` として確定した。節の冒頭に同時に公開する 2 package と変更内容を書き、`破壊的変更` に移行の手順をまとめた（`631268836`、develop へ `11912d471` で統合）。公開日が変わる場合は公開時に日付を直す。
- 配布物の試用で、docs-lint を入れた markdownlint の設定がないリポジトリでは、result の commit 前検査が MD013 で統合を止めることが分かった。0.5.0 の前に直す判断（利用者）により PJR-0QW0 を起票し、本項目の `depends_on` とした。0QW0 は統合後に PJR-JSEY の動作確認を経て close した。
- 0QW0 を含む `bf1092590` から作ったクリーンな worktree で、ルートと 3 package の `npm ci --offline` と `npm run check` が通った（185 テストファイル、2,996 テスト）。
- 同じ commit から作った 3 つの tarball を空の Git リポジトリへ入れ、次を確かめた。
  - `init` が `.markdownlint.yaml` を生成し、最初の commit が通る。
  - markdownlint の設定を消した状態で、Codex executor・Gemma reporter による `exec run --register` が統合まで通り、個票が `review` へ進む（result に 80 文字を超える行が 7 行あっても止まらない）。
  - `epic` の起票（`--track` 必須）、`--from` でつないだ子 todo、`--depends-on` と、先行が未完了のときの `exec run` の停止、epic と依存のビューの生成（修正前の tarball で確認。本体の差分は 0QW0 だけ）。
  - docs-lint 0.3.0 の `lint:fm` が rulebook の `deliverable_type` と合わない type を検出して exit 1 になり、宣言値に直すと通る。
  - docs-site 0.3.0 の `build` が通り、生成物が `.vitepress/` の下（dist・kata-staging・mermaid）に出て、`public/` を作らない（docs-site の tarball は修正前後で同一）。
- 利用者が PR #25 を merge し、`main` の merge commit `b52064d2939341215989a4afdb4dcdbe300ee577` を指す `v0.5.0`・`docs-lint-v0.3.0`・`docs-site-v0.3.0` のタグを push した。npm の公開 3 件も利用者が承認した。
- タグから起動した workflow はすべて成功した。
  - specdojo の npm 公開: <https://github.com/specdojo/specdojo/actions/runs/40856845741>
  - docs-lint の npm 公開: <https://github.com/specdojo/specdojo/actions/runs/40856845672>
  - docs-site の npm 公開: <https://github.com/specdojo/specdojo/actions/runs/40856845906>
  - 文書サイト: <https://github.com/specdojo/specdojo/actions/runs/40856845720>
- npm registry の `latest` は `specdojo` が `0.5.0`、`@specdojo/docs-lint` と `@specdojo/docs-site` が `0.3.0`。npm registry から 3 package を空の一時リポジトリへ新規導入し、CLI の版表示が `0.5.0` であること、`init` が `.markdownlint.yaml` を生成して完了すること、`epic` を起票できることを確認した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-484b-deliverable-type-declaration]]
- [[prj-0001:pjr-0d0t-yaml-deliverable-type-alignment]]
- [[prj-0001:pjr-e6qa-release-v0-4-7]]
