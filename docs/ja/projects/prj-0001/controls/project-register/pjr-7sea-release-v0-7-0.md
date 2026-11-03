---
specdojo:
  id: prj-0001:pjr-7sea-release-v0-7-0
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: medium
  owner: PO
  registered_at: "2026-11-03T05:35:47Z"
  due_on: "2026-11-03"
  depends_on:
    - PJR-561Q
    - PJR-FVRZ
    - PJR-W7YX
  commit_type: chore
  commit_scope: release
---

# PJR-7SEA 0.7.0 でリリースする

## 1. 概要

specdojo 0.7.0 と @specdojo/docs-site 0.4.0 を公開する。@specdojo/docs-lint は変更がないため 0.4.0 のままとする

## 2. 入力

- 0.6.0 からの変更: CHANGELOG の Unreleased に 8 件（orch:argon、schedule の --resume-from executor、docs-site の D2、devcontainer host-script など）。概念データフロー図の Kata の見直し（全体概要とユースケース別、D2 記法ルール）。docs-site の D2 の SVG 生成とサイドメニューへの Kata の掲載。docs-lint と vscode-specdojo は変更なし。破壊的変更はない（2026-11-03）
- 利用者の判断: 本体 0.7.0、docs-site 0.4.0。不具合 3 件（PJR-561Q・PJR-FVRZ・PJR-W7YX）の修正を待って含める。docs-site に Git 管理された一時ファイル `packages/docs-site/.vitepress/config.mts.timestamp-*.mjs` を消して .gitignore に足し、CHANGELOG に Kata の見直しと docs-site のサイドメニューを追記する作業をこの todo で行う。リリースは 2026-11-03 中に行う（2026-11-03）
- 手順は pm-orchestrator-playbook の「リリースの手順」に従う。push・PR の merge・タグ・npm の公開の承認は利用者が行う（2026-11-03）

## 3. 完了条件

- PJR-561Q・PJR-FVRZ・PJR-W7YX が close されている
- `package.json` と `package-lock.json` の版が `0.7.0` で、`CHANGELOG.md` の `[Unreleased]` を `0.7.0` の節として日付を付けて確定している。`packages/docs-site` の `package.json` と `package-lock.json` の版が `0.4.0` で、`0.7.0` の節の冒頭に `@specdojo/docs-site` 0.4.0 を同時に公開することと変更内容を書いている。`packages/docs-lint` の版は変えない
- `CHANGELOG.md` の `0.7.0` の節に、概念データフロー図の Kata の見直しと、docs-site のサイドメニューへの Kata の掲載を書いている
- `packages/docs-site/.vitepress/config.mts.timestamp-*.mjs` を Git の管理から外し、`.gitignore` に足して、`npm pack` の配布物に含まれない
- ルートと `packages/docs-lint`・`packages/docs-site`・`packages/vscode-specdojo` の `npm ci` が通り、クリーンな作業ツリーで `npm run check` が通る
- `npm pack` の配布物（本体・docs-site）を空の Git リポジトリへ入れ、次の動作を確かめる
  - `init` と `register add`、`exec run --register`（start から review まで）
  - `exec run --auto --track` の選択（`--dry-run`）
  - `kata show` で見直した概念データフロー図の rulebook が読める
  - docs-site で D2 の図を含む文書がビルドできる
- 公開候補が PR の merge commit で `main` へ入り、その commit を指す `v0.7.0`・`docs-site-v0.4.0` のタグからそれぞれの npm の公開 workflow が起動する。push・PR の merge・タグ・npm の公開の承認は利用者が行う
- 公開後に npm の `latest` が `specdojo` は `0.7.0`、`@specdojo/docs-site` は `0.4.0` であること、タグで起動した workflow の結果、npm から入れた版の動作を確かめる

## 4. 作業内容

| No  | 作業                                                                            | 担当                  | 状態 | メモ |
| --- | ------------------------------------------------------------------------------- | --------------------- | ---- | ---- |
| 1   | 版と CHANGELOG を確定し、一時ファイルを外し、`npm ci` と `npm run check` を流す | specdojo-orchestrator | done | -    |
| 2   | 配布物を空のリポジトリで試す                                                    | specdojo-orchestrator | done | -    |
| 3   | PR・merge・タグ・公開の承認                                                     | PO                    | done | -    |
| 4   | 公開後の確認                                                                    | specdojo-orchestrator | done | -    |

## 5. 対応結果

- 範囲: 不具合 3 件（PJR-561Q・PJR-FVRZ・PJR-W7YX）を close してから準備に入った。
- 版と CHANGELOG: `feature/prj-0001/release-v0.7.0` で specdojo を 0.7.0、@specdojo/docs-site を 0.4.0 にし、CHANGELOG の Unreleased を 0.7.0 の節にした。節に docs-site 0.4.0 の同時公開、概念データフロー図の Kata の見直し、サイドメニューへの Kata の掲載を加えた。docs-site に Git 管理されていた Vite の一時ファイルを外し、`.gitignore` に `*.timestamp-*.mjs` を足した。
- 準備で見つけて直したこと:
  - `npm run check` の `validate:history-links` が、PJR-3R8F・PJR-6NEM・PJR-B0B8 の個票の外部 URL のラベル付きリンク 6 か所で失敗した。autolink に直した。
  - PJR-PQG3 で足したサイドメニューのテストが、Git 管理外の生成ページ（`samples/generated/*.md`）を前提にしていて、新しい clone で失敗した。閲覧ページのリンクは元の YAML で確かめる形に直した。
  - 配布物の試用で、npm から入れた docs-site 0.4.0 の文書サイトのビルドと D2 の生成が「`markdown-it` が見つからない」で失敗した。`src/d2.mjs` が vitepress の依存として読み込んでいたが、vitepress は markdown-it を組み込みで持ち別のパッケージとして入れないためである（PJR-6NEM）。利用者の承認を得て、docs-site の `dependencies` に `markdown-it` を足し、直接読み込む形に直した。
- 検証: ルートと 3 package の `npm ci` が成功し、リリースのブランチで `npm run check` が成功した（204 テストファイル、3,368 テスト）。2 つの tarball を空のリポジトリへ入れ、`init`（`--yes`）、`register add`（`--input`・`--commit-type`）、`exec run --register`（claude の executor・reporter で start から review、統合まで）、`exec run --auto --track`（存在しない track は claim の前に停止）、`kata show` で見直した rulebook、docs-site の D2 の生成と文書サイトのビルドを確かめた。
- 公開: PR #28 を merge commit `a50db8a86` で main へ入れ、その commit に `v0.7.0`・`docs-site-v0.4.0` を付けた。Publish specdojo to npm と Publish @specdojo/docs-site to npm の workflow が成功し、利用者が npmjs.com で公開を承認した。
- 公開後の確認: npm の `latest` は specdojo が 0.7.0、@specdojo/docs-site が 0.4.0。npm から入れた版で `init` と、D2 の図を含む文書の `specdojo-docs-site build` が通り、`markdown-it` が依存として入ることを確かめた。

## 6. 関連ドキュメント

- [[prj-0001:pm-orchestrator-playbook]]
- [[prj-0001:pjr-2fv2-release-v0-6-0]]
