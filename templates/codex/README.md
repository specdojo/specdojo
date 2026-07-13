---
specdojo:
  id: codex-provider-templates
  type: guide
  status: draft
---

# Codex Provider テンプレート

## 1. 目的

`specdojo exec` が Codex CLI を agent として起動する際に使う設定一式の配布原本です。無人実行の permission は `.specdojo/exec-defaults.yaml` の `providers.codex.command_template` のフラグが正本で、ここには親 Codex が必要に応じて spawn する subagent 定義を含みます。

## 2. 構成

| パス            | 利用プロジェクトでの配置先 | 説明                                                   |
| --------------- | -------------------------- | ------------------------------------------------------ |
| `agents/*.toml` | `.codex/agents/`           | subagent 定義。command template から直接選択はされない |

## 3. 導入手順

利用プロジェクトのルートで scaffold コマンドを実行します。

```sh
specdojo exec scaffold --provider codex
```

コピー後に次を行います。

1. `.specdojo/exec-defaults.yaml` の `providers.codex.command_template` に sandbox と権限を明示する。`--sandbox workspace-write` と `-c sandbox_workspace_write.network_access=false` を必ず含め、`danger-full-access` は使わない。member 側に `command` は書かない。

   ```yaml
   providers:
     codex:
       command_template: 'codex exec --ephemeral --sandbox workspace-write -c approval_policy="never" -c sandbox_workspace_write.network_access=false --model {model} -c model_reasoning_effort="{effort}"'
       command_params:
         by_proficiency:
           normal: { model: gpt-5.4-mini, effort: medium }
           expert: { model: gpt-5.5, effort: high }
   ```

2. 対話セッション用のデフォルト（`.codex/config.toml`）は利用環境に合わせて作成する。モデルや `approval_policy` の好みを含むため、このテンプレートには含めていない。
3. コピーしたファイルをコミットする。worktree はコミット済み内容から作られるため、未コミットだと agent 実行時に設定が読めない。

## 4. カスタマイズ

- worker のモデル・reasoning effort は `command_params.by_proficiency` の1箇所で調整する。subagent（`agents/*.toml`）側の `model` / `model_reasoning_effort` は利用プランに合わせて調整する。
- 権限設計の背景は `specdojo-exec-config-guide.md` の `agent 権限とプロンプトインジェクション対策` を参照する。
