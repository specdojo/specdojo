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
- 追加（2026-10-22、1 回目の統合の後の確認で判明、利用者が承認）: `init` と `config scaffold` が作るオーケストレーターの起動（`orch:opus`・`orch:sonnet` など）に、executor 用の権限設定（`settings.edit.json`）を渡さない。executor 用の設定は保護された設定（`.specdojo/`・`package.json`・`CLAUDE.md` など）の編集も禁じるため、利用者の承認を得てオーケストレーターが行う設定の変更ができなくなる。
- 追加: オーケストレーター専用の権限設定（例: `templates/claude/settings.orchestrator.json`）を作り、オーケストレーターの起動にはそれを渡す。止めるのは `git push` と `gh` の書き込み操作だけとし、保護された設定の編集は禁じない。`gh` の読み取り（`gh pr view`・`gh pr list`・`gh run list`・`gh run view`・`gh release view` など）はオーケストレーターにだけ許す。executor と reporter は 1 回目の作りどおり `gh` を全面的に禁じる。claude 以外の provider でオーケストレーターに同じ区別を付けられるかを確かめ、付けられない場合はその理由を result の表に書く。
- 追加: 単体テストで、オーケストレーターの起動に executor 用の設定が渡らないこと、オーケストレーター用の設定で `gh` の読み取りが許され書き込みと `git push` が禁じられること、executor と reporter の設定は全面禁止のままであることを確かめる。
- 本リポジトリの `.specdojo/` や `.claude/` などの保護された設定は変えない（必要なら変更案を result に書く）。
- [[specdojo:remote-host-development-guide]] の推奨 preset の説明に、`gh` が入ること、ログインは利用者が必要なときに行うこと、コンテナの中の agent からも認証が見えるため agent の権限設定で書き込み操作を止めていることを書く。
- 単体テストで、推奨 preset の生成物に `gh` とログイン情報のボリュームが入ること、preset を使わないときは入らないこと、配布する権限設定に禁止の規則が入っていることを確かめる。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG の `## [Unreleased]` の節に書く（なければ作る）。公開済みの版の節は変えない。

## 3. 作業内容

| No  | 作業                                                             | 担当 | 状態 | メモ   |
| --- | ---------------------------------------------------------------- | ---- | ---- | ------ |
| 1   | 推奨 preset に gh を加え、agent の push と gh の書き込みを止める | DEV  | done | 次の版 |

## 4. 対応結果

- 推奨 preset の apt package に `gh` を加え、`~/.config/gh` をリポジトリ別の名前付き volume に保存するようにした。preset を使わない生成物には `gh` とこの volume を加えない。ホストの認証情報の mount と自動ログインは行わない。
- pipeline executor・review executor・reporter は、GitHub CLI の読み取りも含めて全面拒否する方針にした。`gh api` は任意の HTTP method を指定でき、今後サブコマンドが増える可能性もあるため、無人 pipeline では全 `gh` を止める。
- 対話型オーケストレーターは、利用者と確認しながら PR・workflow run・release の状態を確認する必要があるため、役割別設定を持てる Claude Code と OpenCode に限り `gh pr view`・`gh pr list`・`gh run list`・`gh run view`・`gh release view` などの読み取りを許可した。`git push`、`gh api`、PR・release・repository などの書き込みサブコマンドは deny する。
- Claude Code の `orch:opus`・`orch:sonnet` は新しい `settings.orchestrator.json` を使う。executor 用の `settings.edit.json` は使わないため、利用者が承認した `.specdojo/`・`package.json`・`CLAUDE.md` などの設定変更を妨げない。

| provider    | pipeline executor・reporter         | 対話型 orchestrator                | 境界・制約                                                                                            |
| ----------- | ----------------------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Claude Code | `git push` と全 `gh` を deny        | `git push` と `gh` 書き込みを deny | 専用 `settings.orchestrator.json` で読み取りを allow。保護設定の Edit deny は持たない                 |
| Codex       | `git push` と全 `gh` を `forbidden` | 同じく全 `gh` を `forbidden`       | project-local rule は役割共通で、orchestrator だけを例外にできない。無人 exec は network 無効化も併用 |
| OpenCode    | `git push` と全 `gh` を deny        | `git push` と `gh` 書き込みを deny | agent 定義ごとの許可で全 Edit と `gh` 読み取りを allow。reporter は Bash 全面 deny                    |
| Antigravity | `git push` と全 `gh` を deny        | 同じく全 `gh` を deny              | global settings は役割共通で、orchestrator だけを例外にできない。`--global` 指定時だけマージ          |

- これらの境界は各 provider が agent に提供する shell command を止める。利用者自身の terminal 操作、別の GitHub client、外部 MCP などは対象外であり、今回の配布設定では agent にその代替経路を追加していない。
- 常時稼働ホスト運用ガイド、コマンドリファレンス、Quick Start、exec 設定ガイド、provider 別 README、CHANGELOG を実装に合わせて更新した。
- 推奨 preset と preset なしの生成差分、4 provider の配布権限、Claude Code の orchestrator 専用設定と起動スクリプト、OpenCode の orchestrator 読み取り許可を単体テストへ追加した。親 runner が `lint-ts`・`lint-fm`・`lint-md`・`typecheck`・`test-unit`・`test-integration`・`validate-schema` を実行する。
- 本リポジトリの `.specdojo/`、`.claude/`、`.codex/`、`.opencode/` などの保護設定は変更していない。

## 5. 関連ドキュメント

- [[specdojo:remote-host-development-guide]]
- PJR-EN6M（推奨 preset）
