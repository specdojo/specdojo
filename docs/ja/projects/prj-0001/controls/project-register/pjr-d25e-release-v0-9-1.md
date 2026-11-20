---
specdojo:
  id: prj-0001:pjr-d25e-release-v0-9-1
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: PO
  registered_at: "2026-11-20T11:24:37Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-PAE3
  depends_on:
    - PJR-08EK
    - PJR-A77M
    - PJR-H1PQ
---

# PJR-D25E v0.9.1 をリリースする

## 1. 概要

0.9.0 から回した 08EK（opencode の書き込み）・A77M（CodeQL の src の 5 件）・H1PQ（依存の残り）を入れて 0.9.1 を公開する

## 2. 入力

- 利用者の決定（2026-11-20）: 0.9.1 の範囲は 08EK・A77M・H1PQ。公開の期限は 2026-11-30
- 利用者の決定（2026-11-20）: 手順は 0.9.0（PJR-PAE3）と同じ。push・PR の merge・タグ・npm の stage の承認は利用者が行う

## 3. 完了条件

- `depends_on` の 08EK・A77M・H1PQ が close されている。A77M は、リリースの PR の CI で CodeQL の 5 件の alert が閉じたことを確かめてから close する。
- 版を変更内容から決めている。本体は `0.9.1`。`@specdojo/docs-lint`・`@specdojo/docs-site` は、配る中身が 0.9.0 から変わったかで決める。
- `package.json` と `package-lock.json` の版を上げ、`CHANGELOG.md` に `## [0.9.1] - <日付>` の節を、0.9.0 の後に close した項目の個票の「CHANGELOG に書く事項」から書いている。利用者に影響しない項目は外し、外したことを対応結果に書く。
- クリーンな作業ツリーで `npm ci`・`npm run check`・`npm audit --omit=dev --audit-level=high`・`npm run docs:build` が通る。
- `npm pack` の配布物を空の Git リポジトリへ入れ、`init`・`register add --commit`・`exec run --register`（start から review まで）を確かめている。
- 公開候補が PR の merge commit で `main` へ入り、その commit を指すタグから npm の公開 workflow が起動する。push・PR の merge・タグ・npm の stage の承認は利用者が行う。
- 公開後に npm の `latest`、provenance、タグで起動した workflow の結果、npm から入れた版の動作を確かめている。

## 4. 作業内容

| No  | 作業                                                | 担当         | 状態 | メモ                                                  |
| --- | --------------------------------------------------- | ------------ | ---- | ----------------------------------------------------- |
| 1   | 先に close する項目を確かめて close する            | orchestrator | done | A77M だけはリリースの PR の CI で確かめる             |
| 2   | release ブランチで版と CHANGELOG を用意し、確認する | orchestrator | done | 988416a8b、9ebf7e436 で develop へ統合                |
| 3   | push・PR の merge・タグ・npm の stage の承認        | PO           | done | 利用者が行った（PR #41、タグ `v0.9.1`、stage の承認） |
| 4   | 公開後の確認                                        | orchestrator | done | 対応結果の「公開と公開後の確認」のとおり              |

## 5. 対応結果

### 5.1. 先に close した項目

- H1PQ（依存の脆弱性）と 08EK（opencode の書き込み）を close した（2026-11-20）。08EK は候補の版で実際の run 2 件を流して確かめた。
- A77M は、リリースの PR #41 の CI で CodeQL の check が通り、merge ref に open の alert が無いことを確かめて close した（2026-11-20）。

### 5.2. 版と CHANGELOG

- 0.9.0 の後に配る中身（`src`・`templates`・`docs/ja/specdojo`・`docs/specdojo`・`bin`・`package.json`）を変えた commit は、08EK と A77M の 2 件だけだった。
- 本体を `0.9.1` にした。`@specdojo/docs-lint` は lockfile だけが変わり、公開する package に lockfile は入らないため上げない。`@specdojo/docs-site` は 0.9.0 の後の変更が無いため上げない。
- `CHANGELOG.md` の 0.9.1 の節に、08EK（利用者から見て動きが変わる点と不具合修正）と A77M（不具合修正）を書いた。P318（CI の検査の仕組み）と H1PQ（lockfile の更新）は、利用者の環境を変えないため書かなかった。

### 5.3. release ブランチの確認

- `feature/prj-0001/release-v0.9.1` で、`npm ci`・`npm run build`・`npm run check`（266 ファイル、4,458 テスト）・`npm audit --omit=dev --audit-level=high`（0 件）・`npm run test:integration`・`npm run docs:build` が通った。
- `specdojo-0.9.1.tgz` を空の Git リポジトリへ入れ、`--version`（0.9.1）、`init --yes --provider claude --exec`、`-m` を 2 つ付けた `register add --commit`（件名と本文で commit された）、`kata show`、`exec run --register --worktree`（sonnet の executor と reporter で start から review、統合まで）を確かめた。`npm audit --omit=dev` は 0 件だった。

### 5.4. 公開と公開後の確認（2026-11-20）

- PR #41 の CI で `analyze`・`CodeQL`・`audit`・`layout`・`scan` が通った。利用者が PR #41 を merge commit で merge し（29675617a）、`v0.9.1` のタグを 29675617a に付けて push した。
- タグで起動した 2 つの workflow（specdojo の公開と文書サイトの deploy）が成功した。公開では `audit` の関門が通ってから stage され、ログに provenance の署名が出ていた。利用者が 2FA を通した経路で stage を承認した。
- npm の `latest` は specdojo 0.9.1 になり、provenance（`https://slsa.dev/provenance/v1`）が付いている。
- 空の Git リポジトリへ npm から 0.9.1 を入れ、`--version`（0.9.1）、`config init`、`register scaffold`・`add`、`kata list`（`node_modules` から解決）を確かめた。08EK の `dist/exec/opencode-permissions.js` が入っていた。`npm audit --omit=dev` は 0 件だった。
- 0.9.1 の後に届いた Dependabot の PR は、脆弱性の修正の #30〜#33 を利用者が閉じた（0.9.1 で取り込み済み）。週次の更新の #35〜#40 は PJR-K7QF（minor・patch）と PJR-R8Q3（major の評価）で扱う。

## 6. 関連ドキュメント

- [[prj-0001:pjr-pae3-release-v0-9-0|PJR-PAE3]]: 0.9.0 のリリース（同じ手順）
- [[prj-0001:pm-orchestrator-playbook|オーケストレーター運用メモ]]: リリースの手順
