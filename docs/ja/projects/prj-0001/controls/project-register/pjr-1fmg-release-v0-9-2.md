---
specdojo:
  id: prj-0001:pjr-1fmg-release-v0-9-2
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: DEV
  registered_at: "2026-11-21T01:22:11Z"
  due_on: "2026-11-21"
  completed_at: "2026-11-21T01:58:41Z"
  conclusion: "SpecDojo 0.9.2 を公開した（PR #42、merge commit 3bf65f9d2、タグ v0.9.2）。npm の latest は 0.9.2 で、provenance 付き"
  derived_from:
    - PJR-5V0T
---

# PJR-1FMG SpecDojo 0.9.2 をリリースする

## 1. 概要

Antigravity（agy）の起動を止める hotfix（PJR-NJE4）と、0.9.1 以降に close した項目を 0.9.2 として公開する

## 2. 入力

- 利用者の指示（2026-11-21）: 0.9.2 は今日リリースする。告知は不要
- 範囲: 0.9.1 のタグ（29675617a、2026-11-20 23:07 JST）以降に close した項目

## 3. 完了条件

- 0.9.1 以降に close した項目の「CHANGELOG に書く事項」を `## [0.9.2] - 2026-11-21` の節にまとめ、版を 0.9.2 に上げる。
- release ブランチで `npm ci`・`npm run check`・`npm audit --omit=dev --audit-level=high` が通る。
- `npm pack` した tarball を空のリポジトリで確かめる。
- npm の `latest` が 0.9.2 になり、npm から入れた版で agy の起動が止まる。

## 4. 作業内容

| No  | 作業                                        | 担当                  | 状態 | メモ                             |
| --- | ------------------------------------------- | --------------------- | ---- | -------------------------------- |
| 1   | CHANGELOG をまとめて版を上げる              | specdojo-orchestrator | done | `cbf7d5959`                      |
| 2   | release ブランチで check と audit を流す    | specdojo-orchestrator | done | 271 ファイル・4,517 テスト、0 件 |
| 3   | tarball を空のリポジトリで確かめる          | specdojo-orchestrator | done | 下の対応結果                     |
| 4   | PR・merge・タグ・公開の承認                 | indie                 | done | PR #42、`3bf65f9d2`、`v0.9.2`    |
| 5   | npm の latest と npm から入れた版を確かめる | specdojo-orchestrator | done | 下の対応結果                     |

## 5. 対応結果

- 範囲: 0.9.1 のタグ以降に close した 12 件。文案のない 5RAY・5V0T・JSEY を除く 9 件（NJE4・BSCK・HVQZ・SW7T・5F1Y・7KXW・70SS・QQRH・V277）を CHANGELOG に取り込んだ。
- release ブランチ（`feature/prj-0001/release-v0.9.2`）で `npm ci`（`packages/*` も）・`npm run check`（271 テストファイル、4,517 テスト）・`npm audit --omit=dev --audit-level=high`（0 件）が通った。
- `specdojo-0.9.2.tgz` を空のリポジトリに入れ、`init --provider antigravity` が理由付きのエラーになること、`init --provider claude --exec`・`register add --commit`・`register update --section --commit`・`kata show`・`exec run --register --worktree`（sonnet、start から review、統合まで）が通ることを確かめた。最初の確認は、init が書いた `.gitignore` を確認の手順で上書きしたため統合で止まったが、0.9.2 の不具合ではなく、init の `.gitignore` のままのリポジトリで通った。
- PR #42 の CI（CodeQL・audit・layout・scan）が通り、利用者が merge commit（`3bf65f9d2`）で merge し、`v0.9.2` のタグを push し、stage（`4bf68d35-7987-45b2-b0f4-1efac4c22c2d`）を 2FA の経路で承認した。
- npm の `latest` は 0.9.2 で、provenance（`https://slsa.dev/provenance/v1`）が付いている。タグで起動した公開と文書サイトの workflow は成功した。npm から入れた 0.9.2 で、`init --provider antigravity` と `agent launch --provider antigravity` が理由付きで断られ、`init --provider claude --exec` が通ることを確かめた。

## 6. 関連ドキュメント

- [[prj-0001:pjr-5v0t-antigravity-provider-support|PJR-5V0T]]
- [[prj-0001:pjr-nje4-hotfix-0-9-2-block-antigravity|PJR-NJE4]]
- [[prj-0001:pjr-d25e-release-v0-9-1|PJR-D25E]]
