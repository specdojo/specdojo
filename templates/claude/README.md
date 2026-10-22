---
specdojo:
  id: claude-provider-templates
  type: guide
  status: draft
---

# Claude Code Provider テンプレート

## 1. 目的

`specdojo exec` が Claude Code CLI を agent として起動する際に使う設定一式の配布原本です。agent 定義と、ロール別の permission 設定を含みます。

## 2. 構成

| パス                   | 利用プロジェクトでの配置先 | 説明                                                                  |
| ---------------------- | -------------------------- | --------------------------------------------------------------------- |
| `agents/*.md`          | `.claude/agents/`          | 役割ごとの agent 定義。`--agent <name>` で参照されるため配置先は固定  |
| `settings.edit.json`   | `.specdojo/claude/`        | edit executor と orchestrator 用 permission 設定                      |
| `settings.review.json` | `.specdojo/claude/`        | review executor 用 permission 設定。result 配下のみ書き込みを許可する |
| `settings.report.json` | `.specdojo/claude/`        | reporter 用 permission 設定。ファイル編集を拒否する                   |

## 3. 導入手順

利用プロジェクトのルートで scaffold コマンドを実行すると、上表の配置先へ一式コピーされます（詳細は [exec-config-guide.md](../../docs/ja/specdojo/guides/exec-config-guide.md) の `provider 設定の配布と scaffold` を参照）。

```sh
specdojo exec scaffold --provider claude
```

既存ファイルは上書きされません（`--force` 指定時のみ上書き）。`--dry-run` でコピー予定を確認できます。scaffold が `package.json` に追加する対話型オーケストレーターの npm script は `settings.edit.json` も指定します。コピー後に次の 3 点を行います。

1. `.specdojo/exec-defaults.yaml` の `providers.claude.command_template` に `--settings .specdojo/claude/settings.{mode}.json` を指定する（`--permission-mode bypassPermissions` は付けない）。member 側に `command` は書かない。
2. agent の定義は役割（executor・review executor・reporter）ごとの 1 ファイルで、model を持たない。`command_params.by_mode` で mode から定義を選び、model は実体の member の `model` を `--model {model}` で渡す。
3. コピーしたファイルをコミットする。worktree はコミット済み内容から作られるため、未コミットだと agent 実行時に設定が読めない。

```yaml
providers:
  claude:
    command_template: "claude -p --verbose --agent {agent} --model {model} --settings .specdojo/claude/settings.{mode}.json"
    command_params:
      by_mode:
        edit: { agent: claude-executor }
        review: { agent: claude-review-executor }
        report: { agent: claude-reporter }
```

`.specdojo/agent-members.yaml` は実体と別名の 2 段で書く。実体は model の系統で名付け（`sonnet-executor`・`opus-executor` など）、`model` に `sonnet` / `opus` を持つ。従来の名前（`claude-executor`・`claude-expert-executor` など）は `aliases` で実体を指す別名にする。

```yaml
members:
  - nickname: opus-executor
    provider: claude
    model: opus
    mode: edit
    stage_role: executor
    proficiency: expert
    # display_name などの必須項目は省略
aliases:
  - nickname: claude-expert-executor
    alias_of: opus-executor
```

従来の `--agent {nickname}` と model を持つ定義ファイルで組んだ 1 段の名簿は、そのまま動く。scaffold は既存ファイルを上書きしないため、`--force` で役割ごとの定義（model を持たない）に置き換える場合だけ、上の `command_template` へ移す。移行の手順は exec-config-guide の `agent の名簿の 2 段構成と移行` を参照する。

## 4. カスタマイズ

- edit 用の既定値は `docs/**`、`src/**`、`tests/**` を許可する。`Edit(...)` / `Write(...)` のパスパターンは、利用プロジェクトの成果物・execution ディレクトリ配置に合わせて調整する。
- report 用の既定値はファイルへの Edit/Write と `git add` / `git commit` を deny する。reporter は evidence から構造化結果を返すだけで、result への反映は runner が行う。
- 全ロールで `git push` と全 `gh` を deny する。Dev Container の名前付き volume に GitHub 認証がある場合も、remote の読み取り・書き込みは利用者へ引き渡す。
- そのほかの全セッション共通 deny（`.env` 読み取り禁止など）は、利用プロジェクトの `.claude/settings.json` に置く。ここで配布するロール別設定は `--settings` 指定時の追加マージであり、共通設定の allow を取り消すことはできない。
