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

配布する subagent には、成果物の編集と検証だけを担い result を更新しない `codex-expert-executor` を含みます。

## 3. 導入手順

利用プロジェクトのルートで scaffold コマンドを実行します。

```sh
specdojo config scaffold --provider codex
```

コピー後に次を行います。

1. `.specdojo/exec-defaults.yaml` の `providers.codex.command_template` に sandbox と権限を明示する。`--sandbox workspace-write` と `-c sandbox_workspace_write.network_access=false` を必ず含め、`danger-full-access` は使わない。member 側に `command` は書かない。

   ```yaml
   providers:
     codex:
       command_template: 'codex exec --ephemeral --sandbox workspace-write -c approval_policy="never" -c sandbox_workspace_write.network_access=false --model {model} -c model_reasoning_effort="{effort}"'
       command_params:
         by_proficiency:
           normal: { effort: medium }
           expert: { effort: high }
   ```

   `{model}` には実体の member の `model` が入る。model の ID は名簿の 1 か所に書き、reasoning effort だけを proficiency で切り替える。

   実 Git / worktree を必要とする integration テストを親 runner で実行する場合は、command ではなく固定許可リスト ID を追加する。

   ```yaml
   pipeline:
     parent_validations:
       - test-integration
   ```

   この構成では Codex executor は `npm run test:unit` を実行し、親 runner が `npm run test:integration` の結果を evidence へ追加する。

2. SpecDojo が起動する agent をリポジトリ共通の `.specdojo/agent-members.yaml` へ実体と別名の 2 段で定義する。実体は model の系統で名付け（`terra-executor`・`sol-executor` など）、`model` に版を含む ID（`gpt-5.6-terra` など）を持つ。従来の名前（`codex-executor`・`codex-expert-executor` など）は `aliases` で実体を指す別名にする。project ごとの `pm-members.yaml` は人間専用なので、`type: agent` を書かない。

   ```yaml
   members:
     - nickname: terra-executor
       provider: codex
       model: gpt-5.6-terra
       mode: edit
       stage_role: executor
       proficiency: normal
       # display_name などの必須項目は省略
   aliases:
     - nickname: codex-executor
       alias_of: terra-executor
   ```

   model を持たない従来の 1 段の member は、`command_params.by_proficiency` に `model` を書けばそのまま動く（member の `model` があればそちらが優先される）。

3. 対話セッション用のデフォルト（`.codex/config.toml`）は利用環境に合わせて作成する。モデルや `approval_policy` の好みを含むため、このテンプレートには含めていない。
4. コピーしたファイルと `.specdojo/agent-members.yaml` をコミットする。worktree はコミット済み内容から作られるため、未コミットだと agent 実行時に設定が読めない。

## 4. カスタマイズ

- worker のモデルは実体の member の `model`、reasoning effort は `command_params.by_proficiency` で調整する。subagent（`agents/*.toml`）側の `model` / `model_reasoning_effort` は利用プランに合わせて調整する。
- `codex-expert-executor` の result 更新禁止は pipeline の責務境界なので維持する。SpecDojo worker としての選択は `.specdojo/agent-members.yaml` の `stage_role: executor` で行い、custom subagent ファイルは起動コマンドから直接選択されない。
- 権限設計の背景は `exec-config-guide.md` の `agent 権限とプロンプトインジェクション対策` を参照する。
