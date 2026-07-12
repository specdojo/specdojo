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

| パス                   | 利用プロジェクトでの配置先 | 説明                                                               |
| ---------------------- | -------------------------- | ------------------------------------------------------------------ |
| `agents/*.md`          | `.claude/agents/`          | agent 定義。`--agent <name>` で参照されるため配置先は固定          |
| `settings.edit.json`   | `.specdojo/claude/`        | edit agent 用 permission 設定。成果物への書き込みを許可する        |
| `settings.review.json` | `.specdojo/claude/`        | review agent 用 permission 設定。result 配下のみ書き込みを許可する |

## 3. 導入手順

利用プロジェクトのルートで scaffold コマンドを実行すると、上表の配置先へ一式コピーされます（詳細は [specdojo-exec-config-guide.md](../../docs/ja/specdojo/guides/specdojo-exec-config-guide.md) の `provider 設定の配布と scaffold` を参照）。

```sh
specdojo exec scaffold --provider claude
```

既存ファイルは上書きされません（`--force` 指定時のみ上書き）。`--dry-run` でコピー予定を確認できます。コピー後に次の 2 点を行います。

1. `pm-members.yaml` の claude member の `command` に `--settings .specdojo/claude/settings.<mode>.json` を指定する（`--permission-mode bypassPermissions` は付けない）。
2. コピーしたファイルをコミットする。worktree はコミット済み内容から作られるため、未コミットだと agent 実行時に設定が読めない。

```yaml
command: "claude -p --verbose --agent claude-review-agent --settings .specdojo/claude/settings.review.json"
```

## 4. カスタマイズ

- `Edit(...)` / `Write(...)` のパスパターンは、利用プロジェクトの成果物・execution ディレクトリ配置に合わせて調整する。
- 全セッション共通で効かせたい deny（`.env` 読み取り禁止、`git push` 禁止など）は、利用プロジェクトの `.claude/settings.json` に置く。ここで配布するロール別設定は `--settings` 指定時の追加マージであり、共通設定の allow を取り消すことはできない。
