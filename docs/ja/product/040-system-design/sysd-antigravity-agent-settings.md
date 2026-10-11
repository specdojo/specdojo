---
specdojo:
  id: sysd-antigravity-agent-settings
  type: architecture
  status: draft
  rulebook: specdojo:sysd-rulebook
  part_of:
    - sysd-agent-settings
---

# Antigravity CLI エージェント設定

SpecDojo CLI と Antigravity CLI（`agy`）を組み合わせ、executor / reporter pipeline を非対話実行するための provider 固有設定を定義する。

## 1. 設計方針

共通の責務分担、worktree、member 選択、保護ガードは [[sysd-agent-settings|エージェント実行・共通設計]] に従う。本書では `provider: antigravity` 固有の起動方法、モデル選択、指示読込、認証、制限検出だけを定義する。

- `agy` はファイル定義 agent を選択する仕組みを持たないため、executor / reporter の役割は runner が plan へ付加する stage 指示を正本とする。
- 起動コマンドは `.specdojo/exec-defaults.yaml` の `providers.antigravity.command_template` に集約し、member に `command` を書かない。
- 標準モデルは `proficiency`、Antigravity 経由の他社モデルは `nickname` で選択する。解決順序は `by_nickname`、`by_proficiency`、`by_mode` の順とする。
- 自動選択の評価が完了するまでは codex / claude より低い `priority` を設定し、主に by-name と `--executor-by` / `--reporter-by` で使う。

## 2. 非対話起動

`agy -p` はプロンプトを引数として受け取り stdin を直接読まないため、runner が stdin へ渡す plan を `-p "$(cat)"` で引数へ変換する。`--sandbox` だけでは書き込み先が `~/.gemini/antigravity-cli/scratch/` へ移るため、`--add-dir "$(pwd)"` で task worktree を明示する。

```yaml
providers:
  antigravity:
    command_template: 'agy --sandbox --add-dir "$(pwd)" --model {model} -p "$(cat)"'
    command_params:
      by_proficiency:
        normal: { model: gemini-3.8-flash-medium }
        expert: { model: gemini-3.1-pro-high }
      by_nickname:
        agy-claude-executor: { model: claude-sonnet-4-6 }
        agy-claude-expert-executor: { model: claude-opus-4-6-thinking }
        agy-claude-expert-review-executor: { model: claude-opus-4-6-thinking }
        agy-gpt-executor: { model: gpt-oss-120b-medium }
```

モデル ID 自体が推論強度を含み、`--effort` と組み合わせると選択が衝突するため `--effort` は指定しない。`--output-format json --json-schema` の出力は `structured_output` を含む envelope であり、reporter schema の生 JSON ではないため、reporter も既定のテキスト出力を使う。

## 3. member とモデル

| nickname                            | mode     | proficiency | model                      | 用途             |
| ----------------------------------- | -------- | ----------- | -------------------------- | ---------------- |
| `agy-executor`                      | `edit`   | `normal`    | `gemini-3.8-flash-medium`  | 標準 executor    |
| `agy-expert-executor`               | `edit`   | `expert`    | `gemini-3.1-pro-high`      | expert executor  |
| `agy-expert-review-executor`        | `review` | `expert`    | `gemini-3.1-pro-high`      | expert review    |
| `agy-reporter`                      | —        | `normal`    | `gemini-3.8-flash-medium`  | reporter         |
| `agy-claude-executor`               | `edit`   | `normal`    | `claude-sonnet-4-6`        | Sonnet executor  |
| `agy-claude-expert-executor`        | `edit`   | `expert`    | `claude-opus-4-6-thinking` | Opus executor    |
| `agy-claude-expert-review-executor` | `review` | `expert`    | `claude-opus-4-6-thinking` | Opus review      |
| `agy-gpt-executor`                  | `edit`   | `normal`    | `gpt-oss-120b-medium`      | GPT OSS executor |

`command_params.by_nickname` は member ごとのモデル差し替えだけに使う。権限フラグや worktree 指定は `command_template` に残し、同じ provider の全 member へ一括適用する。

## 4. 指示と設定ファイル

`agy` は repository root まで探索し、`AGENTS.md`、`.agents/rules/*.md`、`.agents/skills/<name>/SKILL.md` を読む。プロジェクト共通の言語・安全規則は `AGENTS.md`、環境別の薄い規則ラッパーは `.agents/rules/`、再利用手順は `.agents/skills/` を正本とする。

executor / reporter の stage 契約は `src/exec-run.ts` が plan 末尾へ付加する。executor は成果物の編集と検証だけを行い result・lifecycle を更新せず、reporter は evidence から構造化結果を返すだけでファイルを書かない。したがって `templates/antigravity/agents/` は設けない。一方、`config scaffold --provider antigravity` はオーケストレーターと provider 設定スニペットをリポジトリへ配置し、`--global` 指定時だけ CLI のユーザー権限設定をマージする。

対話型オーケストレーターはファイル定義 agent ではなく、`npm run orch:agy` が `.agents/specdojo-orchestrator.agent.md` の本文を `-i` で渡して起動する。

## 5. 認証・秘密情報

認証は利用者が `agy` で行い、機械ローカルの `~/.gemini/` に保持する。repository の provider 設定、member、plan、evidence へ token、cookie、認証ファイルの内容を記録しない。devcontainer では `~/.gemini` の永続化ボリュームを利用するが、その内容は成果物・保護設定の対象外とする。

## 6. 権限と保護境界

Antigravity CLI の権限は、[公式の fine-grained permissions](https://antigravity.google/docs/permissions?tab=cli) に従って `~/.gemini/antigravity-cli/settings.json` の `permissions.allow` / `deny` / `ask` で管理する。deny が ask と allow より優先されるため、必要な検証コマンドだけを allow し、次を deny する。

- `git add` / `commit` / `push`、`git reset --hard`、`rm -rf`、`sudo`
- `.env` と `secrets/` の読み取り
- `.git/` と、親 runner・hook・CI・agent の実行内容を定義する固定保護パスへの書き込み。`.specdojo/` は設定ファイルと provider ディレクトリを個別に deny し、検証で再生成する `.specdojo/doc-index.json` は妨げない

`--dangerously-skip-permissions` はこれらの承認境界を迂回するため command template へ含めない。permission 設定に加えて、worktree、commit 許可リスト、Git 状態ガード、provider 非依存の固定保護パス検査を併用する。

`config scaffold --provider antigravity --global` は同設定へ不足ルールだけを追記する。既存キーと既存配列要素は変更・削除せず、書き換え前に `settings.json.backup-<timestamp>` を作る。`--global` を省略した場合はユーザーディレクトリへ触れず、`--global --dry-run` は追加ルールだけを差分表示して書き込まない。不正な JSON または文字列配列以外の permission 設定は、非破壊のためエラーとして扱う。

## 7. 利用制限と検証

利用制限の初期検出パターンは `rate limit`、`429`、`quota`、`RESOURCE_EXHAUSTED` とする。実文言は未観測のため、実行ログで新しい制限シグナルを確認したときに `rate_limit_detection.stderr_patterns` を更新する。

設定変更時は次を確認する。

1. schema と catalog の検証が成功する。
2. `resolveMemberCommand()` のテストで `by_nickname` が `by_proficiency` と `by_mode` を上書きする。
3. dry-run で各 nickname が意図した `--model` を含む `agy` コマンドへ解決される。
4. 指示ディレクトリまたは root 指示ファイルの変更が `agent-config-write` で block される。
5. 実タスクでは executor evidence、親 runner 検証、reporter、統合までを確認する。
6. 一時 HOME を使い、`--global --dry-run` が無変更、実適用が既存キーを保持してバックアップを作ること、再実行が冪等であることを確認する。
