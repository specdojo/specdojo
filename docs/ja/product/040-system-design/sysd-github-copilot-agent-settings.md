---
specdojo:
  id: sysd-github-copilot-agent-settings
  type: project
  status: draft
  rulebook: sysd-rulebook
  part_of:
    - sysd-agent-settings
---

# GitHub Copilot エージェント設定

SpecDojo CLI と GitHub Copilot CLI / Copilot cloud agent を組み合わせてマルチエージェント実行を行うための設定・構成を定義する。

## 1. 設計方針

共通の責務分担、実行フロー、割り当て、失敗処理、worktree は [エージェント共通設定](sysd-agent-settings.md) に従う。本書では GitHub Copilot 固有の設定だけを定義する。

GitHub Copilot は GitHub アカウント、Copilot CLI、GitHub.com の cloud agent、Copilot code review、リポジトリ custom instructions を組み合わせて利用できる。SpecDojo の自動実行では Copilot CLI の非対話実行を使用し、GitHub.com 上の cloud agent / code review でも同じリポジトリ指示を参照できるようにする。

- **非対話実行は `copilot -p`**: TUI を起動せず、タスクプロンプトを渡して応答後に終了する。`--no-ask-user` を指定し、追加質問を待たずに自動実行する。
- **用途別モデル分担**: 標準作業を汎用モデル、複雑な設計判断を高性能モデルで分担する。
- **usage と quota は分けて扱う**: JSONL、`/usage`、OTel で usage / cost / AIU は観測できるが、premium request の残量や reset 時刻を共通 API として前提にしない。
- **リポジトリ共通指示は `.github/copilot-instructions.md`**: Copilot Chat、Copilot CLI、cloud agent、code review が共有するプロジェクト概要、検証コマンド、安全規則を定義する。
- **パス別指示は `.github/instructions/*.instructions.md`**: Markdown、TypeScript、Vitest、SpecDojo exec workflow など、対象ファイルに応じたルールを定義する。
- **custom agent は `.github/agents/*.md`**: Copilot CLI / cloud agent で明示的に選択する agent profile として使用する。
- **権限は command で最小化する**: `--allow-tool` と `--deny-tool` を `pm-members.yaml` の command に定義する。`--allow-all`、`--allow-all-tools`、`--allow-all-paths`、`--yolo` は通常運用で使用しない。
- **CLI 設定は個人設定を優先する**: 共有可能な指示と agent profile は `.github/` に置く。認証、保存済み権限、session、個人設定は `~/.copilot/` または `.github/copilot/settings.local.json` に置き、リポジトリへコミットしない。

## 2. 責務分担

3層の共通責務は親設計に従う。Copilot agent は、Copilot 固有の custom instructions、custom agent、モデル、ツール許可を使用して plan を処理する。claim、complete、block、並列起動、worktree 管理は行わない。

## 3. 全体フロー

```text
specdojo exec run
   -> member.command の copilot -p --agent <name> を起動
   -> plan を標準入力で渡す
   -> Copilot agent が成果物または result を編集
   -> Copilot CLI の終了状態を共通フローへ返す
```

edit / review の選択と終了後の状態遷移は親設計に従う。

## 4. ディレクトリ構成

```text
repo-root/
├─ AGENTS.md                           # AI agent 共通プロジェクトルール
├─ .github/
│  ├─ copilot-instructions.md          # Copilot リポジトリ共通指示
│  ├─ instructions/
│  │  ├─ markdown.instructions.md      # Markdown パス別指示
│  │  ├─ rulebook.instructions.md      # rulebook パス別指示
│  │  ├─ sample.instructions.md        # sample パス別指示
│  │  ├─ specdojo-exec-workflow.instructions.md
│  │  ├─ typescript.instructions.md
│  │  └─ vitest.instructions.md
│  └─ agents/
│     ├─ copilot-edit-agent.md
│     ├─ copilot-review-agent.md
│     ├─ copilot-expert-edit-agent.md
│     └─ copilot-expert-review-agent.md
```

個人設定、認証情報、保存済み権限、session は `~/.copilot/` に置き、リポジトリへコミットしない。リポジトリ配下に個人上書きを置く場合は `.github/copilot/settings.local.json` を使用し、gitignore で除外する。

SpecDojo の project management 配下と worktree の共通構成は親設計を参照する。

## 5. 認証・モデル設定

### 5.1. 認証方法

| 方式                        | 用途                            | 設定方法                                    |
| --------------------------- | ------------------------------- | ------------------------------------------- |
| GitHub サインイン           | 個人開発・対話利用              | `copilot` の `/login` または CLI 認証       |
| `COPILOT_GITHUB_TOKEN`      | CI/CD・自動化                   | 実行プロセスだけに環境変数を注入            |
| `GH_TOKEN` / `GITHUB_TOKEN` | GitHub CLI / Actions 連携       | `COPILOT_GITHUB_TOKEN` が未指定の場合に利用 |
| Copilot cloud agent         | GitHub.com 上の issue / PR 作業 | GitHub の Copilot plan と repository access |

token はジョブ全体の常設環境変数にせず、`copilot -p` 実行時だけ注入する。`~/.copilot/config.json` と `~/.copilot/permissions-config.json` は個人環境の状態として扱い、コミットしない。

### 5.2. モデル選択

モデルは `copilot -p --model` または `COPILOT_MODEL`、custom agent の `model` frontmatter で指定する。モデル名と推奨モデルは Copilot の更新に合わせて見直す。

| 用途                 | モデル例            | reasoning effort | 方針                               |
| -------------------- | ------------------- | ---------------- | ---------------------------------- |
| 標準 edit / review   | `claude-sonnet-4.6` | `medium`         | 汎用的な文書作成・実装・レビュー   |
| expert edit / review | `gpt-5.4`           | `high`           | 複雑な分析・設計判断・重要レビュー |

## 6. `.github/copilot-instructions.md` 設計

`.github/copilot-instructions.md` は repository-wide custom instructions である。GitHub.com、Copilot CLI、Copilot Chat、cloud agent、code review の共通入口になるため、対象を限定しないプロジェクト概要、基本方針、検証コマンド、安全規則だけを置く。

実際のファイル: `.github/copilot-instructions.md`

記述内容は次に限定する。

- SpecDojo が TypeScript 製 CLI、schema、ドキュメント体系であること。
- 変更前に関連設計書と既存パターンを読むこと。
- `src/`、`tests/`、`docs/` の主要な検証コマンド。
- `.env`、`secrets/`、認証情報、破壊的 Git 操作、`git push` の禁止。
- タスク固有手順は issue、PR、exec plan を正本とすること。

`AGENTS.md` も Copilot CLI の agent instructions として読み込まれるため、同じ安全規則を矛盾なく保つ。`.github/copilot-instructions.md` は Copilot 向けにビルド・検証・リポジトリ構造を補足する位置づけとし、`AGENTS.md` を置き換えない。

## 7. `.github/instructions/*.instructions.md` 設計

path-specific custom instructions は `.github/instructions` 配下の `NAME.instructions.md` に置き、frontmatter の `applyTo` で適用対象を指定する。

既存の実ファイルは次のとおり。

| ファイル名                               | 適用対象                                      | 用途                        |
| ---------------------------------------- | --------------------------------------------- | --------------------------- |
| `markdown.instructions.md`               | `docs/**/*.md`                                | Markdown 共通記述ルール     |
| `rulebook.instructions.md`               | `docs/ja/specdojo/rulebooks/**/*-rulebook.md` | rulebook 作成・更新手順     |
| `sample.instructions.md`                 | `docs/ja/specdojo/samples/**/*-sample.md`     | sample 作成・更新手順       |
| `specdojo-exec-workflow.instructions.md` | `docs/ja/projects/` 配下の exec 作業で参照    | exec plan / result 実行手順 |
| `typescript.instructions.md`             | `{src,tools,tests,scripts}/**/*.ts`           | TypeScript 実装ルール       |
| `vitest.instructions.md`                 | `tests/**/*.test.ts`                          | Vitest テスト記述ルール     |

path-specific instructions は cloud agent と code review の双方で使われる。レビューに適用したくない指示を追加する場合は、frontmatter の `excludeAgent` を検討する。

## 8. `.github/agents/*.md` エージェント定義

Copilot custom agent は `.github/agents/<name>.md` に YAML frontmatter と prompt 本文で定義する。`description` は必須、`name` は表示名である。ファイル名から `.md` を除いた値が、`copilot -p --agent <name>` の指定名になる。

frontmatter では `tools` と `model` を指定できる。`tools` は agent が利用可能なツールの絞り込みであり、実行時の自動許可ではない。自動実行時の許可・拒否は `pm-members.yaml` の command に `--allow-tool` / `--deny-tool` として定義する。

### 8.1. frontmatter フィールド

| フィールド                 | 必須 | 説明                                            |
| -------------------------- | ---- | ----------------------------------------------- |
| `name`                     | -    | 表示名。省略時はファイル名が使われる            |
| `description`              | ○    | agent の用途と能力                              |
| `target`                   | -    | `vscode` / `github-copilot`。省略時は両方に適用 |
| `tools`                    | -    | `read`、`edit`、`search`、`execute`、`web` など |
| `model`                    | -    | 使用モデル。省略時は既定モデルを継承            |
| `disable-model-invocation` | -    | 自動呼び出しを無効にし、手動選択だけにする      |
| `user-invocable`           | -    | ユーザーが手動選択できるかを制御する            |

本文には、標準入力で渡された plan に従うこと、agent 自身で claim / complete / block を行わないこと、事実を捏造しないことだけを定める。対象成果物、owner 観点、result の記入方法、検証、正常・異常終了条件は edit / review plan を正本とする。

### 8.2. `copilot-edit-agent.md`

標準 edit agent は exec plan に従って成果物と result を更新する。

実際のファイル: `.github/agents/copilot-edit-agent.md`

### 8.3. `copilot-review-agent.md`

標準 review agent は review plan に従って成果物を検証し、成果物を変更せず result に所見と判定を記録する。

実際のファイル: `.github/agents/copilot-review-agent.md`

### 8.4. `copilot-expert-edit-agent.md`

高性能 edit agent は複雑な分析・アーキテクチャ判断・詳細設計が必要なタスクを担当する。

実際のファイル: `.github/agents/copilot-expert-edit-agent.md`

### 8.5. `copilot-expert-review-agent.md`

高性能 review agent は精度が重要な多観点レビューを担当し、成果物を変更せず result だけを更新する。

実際のファイル: `.github/agents/copilot-expert-review-agent.md`

### 8.6. エージェント一覧

| ファイル名                       | `--agent` 指定名              | モデル              | tools                                      | 用途          |
| -------------------------------- | ----------------------------- | ------------------- | ------------------------------------------ | ------------- |
| `copilot-edit-agent.md`          | `copilot-edit-agent`          | `claude-sonnet-4.6` | `read`, `edit`, `search`, `execute`, `web` | 標準 edit     |
| `copilot-review-agent.md`        | `copilot-review-agent`        | `claude-sonnet-4.6` | `read`, `search`, `execute`, `web`         | 標準 review   |
| `copilot-expert-edit-agent.md`   | `copilot-expert-edit-agent`   | `gpt-5.4`           | `read`, `edit`, `search`, `execute`, `web` | expert edit   |
| `copilot-expert-review-agent.md` | `copilot-expert-review-agent` | `gpt-5.4`           | `read`, `search`, `execute`, `web`         | expert review |

review agent には `edit` tool を含めない。ただし CLI の tool filter は権限境界ではなく利用可能ツールの制御であるため、実行コマンドでも成果物変更を許可しない方針を併用する。

## 9. エージェント割り当て設定

### 9.1. `pm-members.yaml` のコマンド設計

`pm-members.yaml` の `command` フィールドに、`specdojo exec run` から呼び出す完全なコマンドを記述する。

```yaml
members:
  - nickname: copilot-edit-agent
    type: agent
    mode: edit
    capabilities: [web_search]
    proficiency: normal
    priority: 4
    command: 'copilot -p --agent copilot-edit-agent --model claude-sonnet-4.6 --reasoning-effort medium -s --no-ask-user --allow-tool="read,write,shell(npm:*),shell(test:*),shell(git status),shell(git diff),shell(git ls-files),shell(rg:*),url(docs.github.com),url(github.com)" --deny-tool="read(.env),read(secrets/*),shell(git push),shell(git reset --hard),shell(git clean),shell(rm:*)"'
    scheduler_strategy: critical-first

  - nickname: copilot-review-agent
    type: agent
    mode: review
    capabilities: [web_search]
    proficiency: normal
    priority: 4
    command: 'copilot -p --agent copilot-review-agent --model claude-sonnet-4.6 --reasoning-effort medium -s --no-ask-user --allow-tool="read,shell(npm run -s lint:md),shell(npm test),shell(test:*),shell(git status),shell(git diff),shell(git ls-files),shell(rg:*),url(docs.github.com),url(github.com)" --deny-tool="write,read(.env),read(secrets/*),shell(git push),shell(git reset --hard),shell(git clean),shell(rm:*)"'
    scheduler_strategy: fifo

  - nickname: copilot-expert-edit-agent
    type: agent
    mode: edit
    capabilities: [web_search]
    proficiency: expert
    priority: 3
    command: 'copilot -p --agent copilot-expert-edit-agent --model gpt-5.4 --reasoning-effort high -s --no-ask-user --allow-tool="read,write,shell(npm:*),shell(test:*),shell(git status),shell(git diff),shell(git ls-files),shell(rg:*),url(docs.github.com),url(github.com)" --deny-tool="read(.env),read(secrets/*),shell(git push),shell(git reset --hard),shell(git clean),shell(rm:*)"'
    scheduler_strategy: critical-first

  - nickname: copilot-expert-review-agent
    type: agent
    mode: review
    capabilities: [web_search]
    proficiency: expert
    priority: 3
    command: 'copilot -p --agent copilot-expert-review-agent --model gpt-5.4 --reasoning-effort high -s --no-ask-user --allow-tool="read,shell(npm run -s lint:md),shell(npm test),shell(test:*),shell(git status),shell(git diff),shell(git ls-files),shell(rg:*),url(docs.github.com),url(github.com)" --deny-tool="write,read(.env),read(secrets/*),shell(git push),shell(git reset --hard),shell(git clean),shell(rm:*)"'
    scheduler_strategy: fifo
```

`--agent` は custom agent profile の選択、`--model` と `--reasoning-effort` は実行時のモデル指定、`--allow-tool` / `--deny-tool` は自動実行時の許可設定である。plan 本文は引数へ埋め込まず、`specdojo exec run` から標準入力で渡す。

`--allow-all`、`--allow-all-tools`、`--allow-all-paths`、`--yolo` は権限を広げすぎるため使用しない。個人設定で `permissions.disableBypassPermissionsMode` を `"disable"` にしておくと、allow-all 系 flag を起動時に抑止できる。

### 9.2. `sch-strategy-<track>.yaml`

phase の共通契約は親設計に従う。Copilot の Web 検索または GitHub 情報参照が必要な phase は `capabilities: [web_search]` を指定し、複雑な実装や設計判断が必要な場合は `proficiency: expert` を指定する。

### 9.3. `.specdojo/exec-defaults.yaml`

共通の retry / fallback / block 方針とグローバル既定 / provider 別上書きの2層構造は親設計に従う。Copilot 固有の検出条件は `providers.copilot.rate_limit_detection` に置き、`pm-members.yaml` で `provider: copilot` の member に適用する。

```yaml
providers:
  copilot:
    rate_limit_detection:
      stderr_patterns:
        - "rate limit"
        - "429"
        - "quota"
        - "premium request"
```

Copilot の limit は、消費量ベースの premium request クォータと、需要調整の rate limit で考え方が異なる。共通モデルへの写像は親設計の limit 表に従う。

| limit                        | 概要                                                                                                                | reset horizon             | `provider_signal.kind` | 扱い                                                                                                           |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------- |
| rate limit                   | 高需要時の公平利用のためのスロットリング                                                                            | 秒〜分                    | `rate_limit`           | `limited` / retryable。wait+backoff か try_next                                                                |
| premium request 月次クォータ | 消費量ベースの月次枠（例: Pro 300 / Pro+ 1500）。毎月1日 00:00 UTC リセット、繰越なし。CLI は1プロンプトで1以上消費 | 月次（毎月1日 00:00 UTC） | `quota_exhausted`      | `limited`。超過後は included model に degrade して継続可だが throttle 対象。run 継続不可なら try_next か block |

`429` / `rate limit` を rate limit シグナルとして検出する。quota / premium request 上限を示すメッセージは `quota_exhausted` として検出する。premium 超過後も Copilot 側で included model にフォールバックして継続する場合があるため、共通層では `limited` として扱いつつ、継続失敗時にのみ try_next / block へ進む。残量や reset 時刻を安定取得する共通非対話 API は前提にせず、`/usage` を人が確認する補助情報とし、自動制御は stderr message / JSONL error / OTel の error 情報に基づく。汎用的な `exit_codes: [1]` は使わず stderr で判定する。

stderr の実文言は CLI バージョンで変わりうるため、上記 pattern は実際の出力で検証してから確定する。

実際のファイル: `.specdojo/exec-defaults.yaml`

### 9.4. `exec run` による実行

共通の実行コマンドは親設計を参照する。Copilot member は phase の `capabilities` / `proficiency` と `pm-members.yaml` の属性により自動選択される。

memberを明示して実行する場合は `--cmd` にnicknameを指定する。

```bash
specdojo exec run --cmd copilot-edit-agent
specdojo exec run --cmd copilot-expert-review-agent
```

## 10. 非対話実行と出力

`copilot -p` は prompt mode で実行し、完了後に終了する。`-s` / `--silent` は session metadata を抑制し、標準出力をスクリプトで扱いやすくする。`--output-format=json` を指定すると JSONL 出力を利用できる。

Copilot CLI には `/usage` と OpenTelemetry monitoring があり、token usage、cost、AIU、session shutdown 時の集計値を観測できる。これらは実績値の可観測性として扱い、残り quota や premium request 残数の真値とは分離する。

```bash
copilot -p "SpecDojo task を1件実行してください" \
  --agent copilot-edit-agent \
  --model claude-sonnet-4.6 \
  --reasoning-effort medium \
  -s \
  --no-ask-user \
  --allow-tool='read,write,shell(npm:*),shell(git status),shell(git diff),shell(rg:*)' \
  --deny-tool='read(.env),read(secrets/*),shell(git push),shell(git reset --hard),shell(git clean),shell(rm:*)'
```

`specdojo exec run` との統合では、plan の内容は**引数ではなく stdin** 経由で渡す。YAML frontmatter の `---` がコマンドラインオプションとして誤認されるのを防ぐためである。

```bash
cat exec/plans/<task-id>-plan.md | copilot \
  --agent copilot-edit-agent \
  --model claude-sonnet-4.6 \
  --reasoning-effort medium \
  -s \
  --no-ask-user
```

非対話実行では新しい承認要求や質問に応答できない。必要な操作が許可範囲を超える場合は、許可を広げて再実行せず非0で終了し、runner に block 判断を戻す。

## 11. worktree 分離セットアップ

worktree のライフサイクル、配置、ブランチ名、イベントファイル名は親設計に従う。edit worker の並列実行では worktree を使用する。review worker は成果物を変更せず result だけを更新するため、成果物競合防止を目的とした worktree 分離は不要とする。

## 12. 公式仕様参照

- [Adding repository custom instructions for GitHub Copilot](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions)
- [Adding custom instructions for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions)
- [Running GitHub Copilot CLI programmatically](https://docs.github.com/en/copilot/how-tos/copilot-cli/automate-copilot-cli/run-cli-programmatically)
- [GitHub Copilot CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)
- [Custom agents configuration](https://docs.github.com/en/copilot/reference/custom-agents-configuration)
- [GitHub Copilot CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference)
