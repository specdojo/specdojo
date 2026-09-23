---
specdojo:
  id: prj-0001:pjr-2t2s-antigravity-provider
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  owner: ARC
  registered_at: "2026-09-21T06:49:03Z"
  due_on: "2026-10-05"
  block_reason: "agent exited with non-zero code: agent exited with non-zero code: agent-config-write: protected configuration changes detected; paths=.specdojo/exec-defaults.yaml; agent must record the required chang…"
---

# PJR-2T2S Antigravity CLI（agy）を executor / reporter の provider として使えるようにする

## 1. 概要

この 1 週間で codex は 3 回、claude は 1 回、利用制限で exec が止まった。devcontainer に導入した Antigravity CLI（`agy` 1.2.7、認証は `~/.gemini` ボリュームで永続化済み）を第 3 の frontier 経路として SpecDojo の executor / reporter に組み込み、by-name（PJR-7WFE）で枠を割り当てられるようにする。

`agy` の非対話実行に必要な機能は揃っている（2026-09-21 に確認）。

| 機能             | フラグ                                                                            |
| ---------------- | --------------------------------------------------------------------------------- |
| 単発の非対話実行 | `-p` / `--print`（プロンプトは引数または stdin）                                  |
| 権限の自動承認   | `--dangerously-skip-permissions`、または `--mode accept-edits`                    |
| sandbox          | `--sandbox`（ターミナル制限）                                                     |
| モデル・推論強度 | `--model <id>`、`--effort low\|medium\|high`                                      |
| 構造化出力       | `--output-format json`、`--json-schema <schema>`（reporter の JSON 出力に使える） |
| ワークスペース   | `--add-dir`（worktree 実行時に不要な範囲を開かない）                              |

利用できるモデル（`agy models`）: `gemini-3.8-flash-{high,medium,low}`、`gemini-3.1-pro-{high,low}`、ほかに `claude-sonnet-4-6` / `claude-opus-4-6-thinking` / `gpt-oss-120b-medium`。Antigravity 経由の claude は Anthropic 直の枠とは別勘定になる見込みだが、要確認。

### 1.2. agy が読む設定（2026-09-21 確認）

`~/.gemini/antigravity-cli/builtin/skills/agy-customizations/SKILL.md` によると、agy は次を読み込む。

| 種別           | パス                                                                                              | 既存の対応                                                                                                                           |
| -------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 規則           | `GEMINI.md`、`AGENTS.md`、`.agents/rules/*.md`（`always_on` は常時、`model_decision` は条件付き） | `AGENTS.md` は codex と共用で既にある。`.github/instructions/*.md` の薄ラッパーは `.claude/rules/` にあり、`.agents/rules/` にはない |
| skills         | `.agents/skills/<name>/SKILL.md`                                                                  | 既にある                                                                                                                             |
| workspace 設定 | `.agents/`（`.agent/` 等も可）をリポジトリルートまで遡って探索                                    | オーケストレーター SSOT `.agents/specdojo-orchestrator.agent.md` は同じ場所にあるが、agy がこの形式を agent として扱うかは未確認     |
| 機械ローカル   | `~/.gemini/config/`                                                                               | ボリューム化済み                                                                                                                     |

`--agent <name>` は存在しない名前でも黙って実行されたため、ファイル定義の custom agent の可否は検証が必要。

### 1.1. 決定事項

- provider 名は `antigravity`。`pm-members.schema.yaml` の `provider` enum に追加する（`custom` は使わない。provider 別の rate limit 検出と `max_concurrency` を持たせるため）。
- `exec-defaults.yaml` の `providers.antigravity`:
  - `command_template`: `agy -p --sandbox --dangerously-skip-permissions --model {model} --effort {effort}`（プロンプトは runner が stdin で渡す。`{nickname}` は使わない。codex と同じ方式）
  - `command_params.by_proficiency`: normal は `gemini-3.8-flash-high` / `medium`、expert は `gemini-3.1-pro-high` / `high` を初期値とし、trial の結果で見直す
  - `rate_limit_detection.stderr_patterns`: `rate limit`、`429`、`quota`、`RESOURCE_EXHAUSTED` を初期値とし、実観測した文言で更新する（memory の observed-agent-limit-stderr と同じ扱い）
- member は 4 つ追加する: `agy-executor`（normal / edit）、`agy-expert-executor`（expert / edit）、`agy-expert-review-executor`（expert / review）、`agy-reporter`（reporter）。priority は既存 codex / claude より低くし、自動選択では選ばれず by-name と `--executor-by` で使う（評価が済むまで）。
- reporter は `--output-format json --json-schema` で runner の reporter schema を直接指定できるか検証し、できれば format attempts を減らす。
- agent の git 隔離（`gitEnvironment()`）と保護設定（`exec-agent-protected-config`）は provider 非依存のためそのまま適用される。`.gemini` 配下への書き込みは agent の設定領域として扱い、保護対象には含めない。
- 設計文書 `sysd-antigravity-agent-settings` を `sysd-*-agent-settings` の並びで新設し、`dct-architecture.yaml` に登録する。

### 1.3. Antigravity 経由の他社モデル（2026-09-23）

`agy models` は Gemini 以外に `claude-sonnet-4-6` / `claude-opus-4-6-thinking` / `gpt-oss-120b-medium` を提供する。これらを executor / reporter として指名できるようにする。

member 単位の `command` 上書きでも実現できるが、`--add-dir` の追加や `--effort` の除去のような provider 共通の修正が member 数だけ分散する（本項目で 2 度発生済み）。`command_params` に nickname 別の層 `by_nickname` を追加し、`command_template` は 1 本のまま member ごとにモデルを差す方式を採る。この層は claude など他 provider のモデル指定にも使える。

```yaml
command_params:
  by_proficiency:
    normal: { model: gemini-3.8-flash-medium }
    expert: { model: gemini-3.1-pro-high }
  by_nickname:
    agy-sonnet-executor: { model: claude-sonnet-4-6 }
```

解決順序は `by_nickname` > `by_proficiency` > `by_mode` とし、同じ変数名が複数層にある場合は先に挙げた層を優先する（現行の by_mode / by_proficiency 間の重複禁止は、by_nickname による意図的な上書きを許すため、層をまたぐ場合に限り許容する）。

## 2. 完了条件

- `pm-members.schema.yaml` の provider enum に `antigravity` があり、`pm-members.yaml` に 4 member が定義され、`schedule build` / `catalog validate` / `validate:schema` が通過する。
- `exec-defaults.yaml` に `providers.antigravity` があり、`exec run --register <id> --executor-by antigravity-expert-executor --dry-run` が `agy -p …` のコマンドを表示する。
- 小さな register todo 1 件を `agy-expert-executor` / `agy-reporter` で実行し、親検証を通過して develop へ統合される。
- `exec trial` で同一 plan を `agy-expert-executor` と `codex-expert-executor` に並走させ、親検証の通過と codex-review の判定を比較して結果を個票に記録する。
- rate limit の実文言を観測して `rate_limit_detection` に反映する（観測できない場合はその旨を記録）。
- `sysd-antigravity-agent-settings` が作成され、exec-config-guide の provider 一覧に antigravity が載っている。
- `.agents/rules/` に薄ラッパーがあり、オーケストレーターを agy から起動できる（ラッパーまたは `orch:agy`）。
- agent の指示ディレクトリが保護設定に含まれ、executor がそれらを変更すると block される。
- `npm run check` が通過している。

## 3. 作業内容

| No  | 作業                                                                                                                                                                                                                                                                                                                                               | 担当 | 状態 | メモ                                                                       |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- | ---- | -------------------------------------------------------------------------- |
| 1   | schema の provider enum、`exec-defaults.yaml` の provider、`pm-members.yaml` の 4 member を追加し、dry-run でコマンドを確認する                                                                                                                                                                                                                    | DEV  | done | オーケストレーターが直接対応（設定のみ）                                   |
| 2   | reporter の `--json-schema` 直接指定を検証し、有効なら command_template に組み込む                                                                                                                                                                                                                                                                 | DEV  | done | 同上                                                                       |
| 3   | 小さな register todo を antigravity で実行し、統合まで通す                                                                                                                                                                                                                                                                                         | ARC  | done | PJR-YWPH で確認                                                            |
| 4   | `exec trial` で codex と比較し、proficiency の初期値と priority を決める                                                                                                                                                                                                                                                                           | ARC  | open | 結果を本個票に記録                                                         |
| 5   | `sysd-antigravity-agent-settings` を作成し、exec-config-guide と `dct-architecture.yaml` を更新する                                                                                                                                                                                                                                                | DEV  | done | codex-expert-executor / gemma-reporter / worktree                          |
| 6   | `.agents/rules/*.md` に `.github/instructions/*.md` の薄ラッパーを置く（`.claude/rules/` と同じ方式）。`GEMINI.md` は置かず `AGENTS.md` を共用する                                                                                                                                                                                                 | DEV  | done | オーケストレーターが直接対応                                               |
| 7   | agy のファイル定義 agent の可否を検証し、可なら `.agents/` に 5 つ目のオーケストレーターラッパーを追加して `validate-orchestrator-sync.mjs` の照合対象に加える。不可なら `npm run orch:agy`（`agy -i "$(cat .agents/specdojo-orchestrator.agent.md)"`、codex の `orch:sol` と同型）を追加する                                                      | DEV  | done | 同上                                                                       |
| 8   | executor / reporter の役割指示は codex worker と同じく plan の共通規約で担う。`xep-common-conventions-template` の役割指示（result を更新しない、claim / complete を行わない）が十分か確認し、不足を補う。ファイル定義 agent が使える場合は `templates/antigravity/agents/**` を `config scaffold --provider antigravity` の配布原本として用意する | DEV  | done | 作業 5 と同一タスク                                                        |
| 9   | `exec-agent-protected-config` の保護対象に agent の指示ディレクトリ（`.agents/rules/`、`.agents/skills/`、`.claude/`、`.codex/`、`.opencode/`、`.github/agents/`、`AGENTS.md`、`CLAUDE.md`、`GEMINI.md`）を加え、agent が自分の指示を書き換えられないようにする                                                                                    | DEV  | done | 同上。他 provider にも効く                                                 |
| 10  | `command_params.by_nickname` を実装し（解決順序 by_nickname > by_proficiency > by_mode）、schema・guide・テストを更新する                                                                                                                                                                                                                          | DEV  | done | codex-expert-executor / gemma-reporter / worktree                          |
| 11  | Antigravity 経由の claude / GPT を使う member（`agy-sonnet-executor`、`agy-opus-executor`、`agy-opus-review-executor`、`agy-gpt-executor`）を追加し、dry-run で確認する                                                                                                                                                                            | DEV  | done | 作業 10 と同一タスク。priority は既存 agy-\* と同じく低くし by-name で使う |

## 4. 対応結果

### 4.1. 作業 1・2・6・7（2026-09-21、オーケストレーターが直接対応）

- `agy` の非対話実行を実測した。`-p` はプロンプトを引数に取り stdin を読まない（`-p -` は「-」をプロンプトとみなす）ため、command template は `-p "$(cat)"` で runner の stdin を引数へ渡す。`--sandbox` だけでは書き込みが `~/.gemini/antigravity-cli/scratch/` へ逃げるため `--add-dir "$(pwd)"` を併用する（これで worktree へ書ける）。`--output-format json --json-schema` は `structured_output` を含むエンベロープで返り、runner の reporter が読む生 JSON とは形が違うため、reporter は既定のテキスト出力で運用する（作業 2 は検証のみ）。
- `pm-members.schema.yaml` / `exec-defaults.schema.yaml` / `AgentProvider` 型 / `pm-members-rulebook` に `antigravity` を追加し、`exec-defaults.yaml` に `providers.antigravity`（normal: `gemini-3.8-flash-high` / medium、expert: `gemini-3.1-pro-high` / high、rate limit 初期パターン）を定義した。member 4 件（executor 4、expert-executor 3、expert-review-executor 3、reporter 4）を追加し、dry-run で `agy … --model gemini-3.1-pro-high --effort high -p "$(cat)"` を確認、`--auto` の選択は codex のまま変わらないことを確認した。
- 規則: `AGENTS.md` と `.agents/rules/*.md` は `--add-dir "$(pwd)"` を付けた場合に読み込まれることを実測した（付けないと読まれない）。`.agents/rules/` に `.github/instructions/` 6 本の薄いラッパー（`trigger: glob`、`@[label](path)` include）を置き、本リポジトリで `markdown.instructions.md` の内容を答えることを確認した。
- オーケストレーター: agy はファイル定義の agent を持たない（`--agent` は存在しない名前でも黙って動く）ため、Codex と同じく SSOT 本文を `-i` で渡す `npm run orch:agy` / `orch:agy:work` を追加した。5 つ目のラッパーは作らず、`validate-orchestrator-sync.mjs` の変更も不要。
- 作業 3: PJR-YWPH を `agy-expert-executor`（当時の nickname は `antigravity-expert-executor`）/ `agy-reporter` で実行し、executor は約 10 分で完走、親検証 3 種 passed、reporter は format attempts 1 で完走した。`--effort` とモデル ID の衝突で reporter が一度起動に失敗したため、command template から `--effort` を外した。nickname は 2026-09-22 に `antigravity-*` から `agy-*` へ改名した（コマンド名に合わせる）。YWPH の実行記録（register event、evidence、result）は改名前の nickname のまま残す。
- 残り: 作業 4（trial で codex と比較）。

### 4.2. 作業 5・8〜11（2026-09-23、executor / reporter pipeline）

- [[sysd-antigravity-agent-settings|Antigravity CLI エージェント設定]] を作成し、非対話起動、モデル選択、指示読込、認証、保護境界、rate limit 検出、検証観点を定義した。`dct-system-design.yaml` へ成果物を登録し、`dct-architecture.yaml` のホーム Mac 開発環境 2 件から依存させ、[[specdojo:exec-config-guide|exec設定ガイド]] と共通設計も更新した。
- executor の result 非更新、reporter のファイル非更新、lifecycle と Git 操作の runner 所有は `src/exec-run.ts` が plan 末尾へ付加する pipeline stage 指示で明示済みと確認した。`agy` はファイル定義 agent を持たないため、`templates/antigravity/agents/**` と scaffold 配布物は追加しない。
- 固定保護パスへ `.agents/rules/**`、`.agents/skills/**`、`.claude/**`、`.codex/**`、`.opencode/**`、`.github/agents/**`、`AGENTS.md`、`CLAUDE.md`、`GEMINI.md` を追加した。起動前 snapshot が既存ファイルの変更と新規指示ファイルの追加を検出するテストを追加した。
- `command_params.by_nickname` を schema・型・解決処理へ追加した。追加変数は `by_mode`、`by_proficiency`、`by_nickname` の順に適用し、後段が同名変数を上書きする。組み込み変数の再定義は禁止したままとした。
- `agy-sonnet-executor`、`agy-opus-executor`、`agy-opus-review-executor`、`agy-gpt-executor` を追加した。4 member の dry-run で、それぞれ `claude-sonnet-4-6`、`claude-opus-4-6-thinking`、`claude-opus-4-6-thinking`、`gpt-oss-120b-medium` を含む起動コマンドへ解決されることを確認した。
- rate limit の実文言は今回も観測していない。初期パターン（`rate limit`、`429`、`quota`、`RESOURCE_EXHAUSTED`）を維持し、実観測時に追加・修正する。
- sandbox 内の非親検証として Markdown lint、TypeScript lint、frontmatter lint、history link 検証、catalog build / validate、index build、dry-run が成功した。`typecheck`、schema、unit、integration は親 runner の固定検証へ委ねる。

## 5. 関連ドキュメント

- [[specdojo:exec-config-guide]]
- [[sysd-antigravity-agent-settings|Antigravity CLI エージェント設定]]
- [[prj-0001:pjr-7wfe-schedule-agent-by-name]]
- [[prj-0001:pjr-1y0g-devcontainer-stale-vscode-server]]
- `docs/ja/projects/prj-0001/030-project-management/pm-members.yaml`
- `.specdojo/exec-defaults.yaml`
- `docs/specdojo/schemas/v1/pm-members.schema.yaml`
- `docs/ja/product/040-system-design/sysd-codex-agent-settings.md`（同型の設計文書）
- `.devcontainer/post-create.sh`（`agy` の導入）
