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

| パス            | 利用プロジェクトでの配置先 | 説明                                                       |
| --------------- | -------------------------- | ---------------------------------------------------------- |
| `agents/*.toml` | `.codex/agents/`           | subagent 定義。command template から直接選択はされない     |
| `rules/*.rules` | `.codex/rules/`            | `git push` と全 `gh` を拒否する project-local command rule |

配布する `agents/*.toml` のモデルは、名簿の雛形と同じ GPT-6 の 2 段構成（normal は `gpt-6-luna`、expert は `gpt-6.1-sol`）にそろえています。成果物の編集と検証だけを担い result を更新しない `codex-expert-executor` も含みます。

| ファイル名                          | モデル        | reasoning effort | 用途                                                                |
| ----------------------------------- | ------------- | ---------------- | ------------------------------------------------------------------- |
| `codex-executor.toml`               | `gpt-6-luna`  | `medium`         | 標準的な成果物の編集と検証（result は更新しない）                   |
| `codex-review-executor.toml`        | `gpt-6-luna`  | `medium`         | 多観点レビュー（成果物・result のいずれにも書き込まない）           |
| `codex-expert-executor.toml`        | `gpt-6.1-sol` | `high`           | 複雑な分析・設計判断を伴う編集と検証（result は更新しない）         |
| `codex-expert-review-executor.toml` | `gpt-6.1-sol` | `high`           | 複雑な多観点レビュー（成果物・result のいずれにも書き込まない）     |
| `specdojo-orchestrator.toml`        | `gpt-6.1-sol` | `medium`         | 対話型オーケストレーター（提案 → 承認 → 実行で CLI 操作を代行する） |

※ `gpt-6-luna` は Max までで Ultra を受け付けないため、Ultra は割り当てません。

## 3. 導入手順

利用プロジェクトのルートで scaffold コマンドを実行します。

```sh
specdojo config scaffold --provider codex
```

`package.json` がある場合は、モデルの系統で名付けた `orch:sol` と `orch:luna` も追加されます。モデルはそれぞれ `gpt-6.1-sol` と `gpt-6-luna` を明示して起動します。既存の `orch:terra` などのスクリプトは書き換えません。

```json
{
  "scripts": {
    "orch:sol": "specdojo orchestrator launch --provider codex -- -m gpt-6.1-sol \"$(cat .specdojo/codex/orchestrator.md)\"",
    "orch:luna": "specdojo orchestrator launch --provider codex -- -m gpt-6-luna \"$(cat .specdojo/codex/orchestrator.md)\""
  }
}
```

```sh
npm run orch:sol
# または
npm run orch:luna
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

2. SpecDojo が起動する agent をリポジトリ共通の `.specdojo/agent-members.yaml` へ実体と別名の 2 段で定義する。実体は model の系統で名付け（`luna-executor`・`sol-executor` など）、`model` に版を含む ID（`gpt-6-luna` など）を持つ。従来の名前（`codex-executor`・`codex-expert-executor` など）は `aliases` で実体を指す別名にする。project ごとの `pm-members.yaml` は人間専用なので、`type: agent` を書かない。

   ```yaml
   members:
     - nickname: luna-executor
       provider: codex
       model: gpt-6-luna
       mode: edit
       stage_role: executor
       proficiency: normal
       # display_name などの必須項目は省略
   aliases:
     - nickname: codex-executor
       alias_of: luna-executor
   ```

   `specdojo init --exec` は codex を 2 段で書く。normal の段は `gpt-6-luna` の `luna-executor`・`luna-review-executor`・`luna-reporter`（別名 `codex-executor`・`codex-review-executor`・`codex-reporter`）、expert の段は `proficiency: expert` を付けた `gpt-6.1-sol` の `sol-executor`・`sol-review-executor`（別名 `codex-expert-executor`・`codex-expert-review-executor`）である。reasoning effort は `by_proficiency` で normal が `medium`、expert が `high` になる（`gpt-6-luna` は Max までで Ultra を受け付けないため、Ultra は割り当てない）。

   model を持たない従来の 1 段の member は、`command_params.by_proficiency` に `model` を書けばそのまま動く（member の `model` があればそちらが優先される）。

3. scaffold が配置する `.codex/rules/specdojo.rules` を維持する。この rule は Dev Container の共有 GitHub 認証を agent が使わないよう、`git push` と読み取りを含む全 `gh` を `forbidden` にする。project-local rule は信頼済み project で読み込まれる。
4. 対話セッション用のデフォルト（`.codex/config.toml`）は利用環境に合わせて作成する。モデルや `approval_policy` の好みを含むため、このテンプレートには含めていない。
5. コピーしたファイルと `.specdojo/agent-members.yaml` をコミットする。worktree はコミット済み内容から作られるため、未コミットだと agent 実行時に設定が読めない。

## 4. カスタマイズ

- worker のモデルは実体の member の `model`、reasoning effort は `command_params.by_proficiency` で調整する。subagent（`agents/*.toml`）側の `model` / `model_reasoning_effort` は利用プランに合わせて調整する。
- `codex-expert-executor` の result 更新禁止は pipeline の責務境界なので維持する。SpecDojo worker としての選択は `.specdojo/agent-members.yaml` の `stage_role: executor` で行い、custom subagent ファイルは起動コマンドから直接選択されない。
- 権限設計の背景は `exec-config-guide.md` の `agent 権限とプロンプトインジェクション対策` を参照する。

### 既存の利用者の `.codex/agents` の更新

`specdojo config scaffold --provider codex` は既存のファイルを上書きしません。以前の版で生成された `.codex/agents/*.toml`（`gpt-5.4-mini`・`gpt-5.5`・`gpt-5.6-terra` など）を GPT-6 系へ更新する場合は、次のいずれかを行います。

1. **scaffold で一括再配置する場合**:
   手動のカスタマイズを行っていない場合は、`--force` を指定してテンプレートで上書きします。

   ```sh
   specdojo config scaffold --provider codex --force
   ```

2. **手動で書き換える場合**:
   各 `.codex/agents/*.toml` の `model`（および必要に応じて `model_reasoning_effort`）を直接編集します。
   - `codex-executor.toml`・`codex-review-executor.toml`: `model = "gpt-6-luna"`、`model_reasoning_effort = "medium"`
   - `codex-expert-executor.toml`・`codex-expert-review-executor.toml`: `model = "gpt-6.1-sol"`、`model_reasoning_effort = "high"`
   - `specdojo-orchestrator.toml`: `model = "gpt-6.1-sol"`、`model_reasoning_effort = "medium"`
