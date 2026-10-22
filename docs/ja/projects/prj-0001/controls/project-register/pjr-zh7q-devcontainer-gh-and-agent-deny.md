---
specdojo:
  id: prj-0001:pjr-zh7q-devcontainer-gh-and-agent-deny
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-10-22T12:42:33Z"
  derived_from:
    - PJR-EN6M
---

# PJR-ZH7Q 推奨 preset に gh を加え、agent の push と gh の書き込み操作を止める

## 1. 概要

推奨 preset に gh を入れ、ログイン情報を名前付きボリュームに残す。コンテナの中でログインすると同じ利用者で動く agent からも認証が使えるため、配布する agent の権限設定に git push と gh の書き込み操作を止める規則を加え、ガイドに注意を書く

## 2. 完了条件

- 次の版の範囲とする（2026-10-22、利用者が承認）。
- `devcontainer scaffold --preset recommended`（`init` で Dev Container を選んだときの既定を含む）で、apt の `gh` を入れる。ログイン情報（`~/.config/gh`）は、ほかの provider の設定と同じく名前付きボリュームに保存し、コンテナを作り直しても残る。ホストの認証情報はマウントせず、自動でログインもしない。`--preset` を使わない場合は今の動きのままとする。
- 配布する agent の権限設定（claude のロール別の settings、codex・opencode・antigravity の対応する設定や agent の定義のうち、コマンドの許可と禁止を書けるもの）に、`git push` と、`gh` の書き込み操作（少なくとも `gh pr create`・`gh pr merge`・`gh pr close`・`gh release`・`gh repo`・`gh api` の書き込み）を止める規則を加える。agent に `gh` の読み取り（`gh pr view` など）を許すかは設計で決め、理由を result に書く。provider ごとに止められる範囲と止められない範囲を result に表で書く。
- 本リポジトリの `.specdojo/` や `.claude/` などの保護された設定は変えない（必要なら変更案を result に書く）。
- [[specdojo:remote-host-development-guide]] の推奨 preset の説明に、`gh` が入ること、ログインは利用者が必要なときに行うこと、コンテナの中の agent からも認証が見えるため agent の権限設定で書き込み操作を止めていることを書く。
- 単体テストで、推奨 preset の生成物に `gh` とログイン情報のボリュームが入ること、preset を使わないときは入らないこと、配布する権限設定に禁止の規則が入っていることを確かめる。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG の `## [Unreleased]` の節に書く（なければ作る）。公開済みの版の節は変えない。

## 3. 作業内容

| No  | 作業                                                             | 担当 | 状態 | メモ   |
| --- | ---------------------------------------------------------------- | ---- | ---- | ------ |
| 1   | 推奨 preset に gh を加え、agent の push と gh の書き込みを止める | DEV  | open | 次の版 |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[specdojo:remote-host-development-guide]]
- PJR-EN6M（推奨 preset）
