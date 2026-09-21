---
specdojo:
  id: prj-0001:pjr-2t2s-antigravity-provider
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: ARC
  registered_at: "2026-09-21T06:49:03Z"
  due_on: "2026-10-05"
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
- member は 4 つ追加する: `antigravity-executor`（normal / edit）、`antigravity-expert-executor`（expert / edit）、`antigravity-expert-review-executor`（expert / review）、`antigravity-reporter`（reporter）。priority は既存 codex / claude より低くし、自動選択では選ばれず by-name と `--executor-by` で使う（評価が済むまで）。
- reporter は `--output-format json --json-schema` で runner の reporter schema を直接指定できるか検証し、できれば format attempts を減らす。
- agent の git 隔離（`gitEnvironment()`）と保護設定（`exec-agent-protected-config`）は provider 非依存のためそのまま適用される。`.gemini` 配下への書き込みは agent の設定領域として扱い、保護対象には含めない。
- 設計文書 `sysd-antigravity-agent-settings` を `sysd-*-agent-settings` の並びで新設し、`dct-architecture.yaml` に登録する。

## 2. 完了条件

- `pm-members.schema.yaml` の provider enum に `antigravity` があり、`pm-members.yaml` に 4 member が定義され、`schedule build` / `catalog validate` / `validate:schema` が通過する。
- `exec-defaults.yaml` に `providers.antigravity` があり、`exec run --register <id> --executor-by antigravity-expert-executor --dry-run` が `agy -p …` のコマンドを表示する。
- 小さな register todo 1 件を `antigravity-expert-executor` / `antigravity-reporter` で実行し、親検証を通過して develop へ統合される。
- `exec trial` で同一 plan を `antigravity-expert-executor` と `codex-expert-executor` に並走させ、親検証の通過と codex-review の判定を比較して結果を個票に記録する。
- rate limit の実文言を観測して `rate_limit_detection` に反映する（観測できない場合はその旨を記録）。
- `sysd-antigravity-agent-settings` が作成され、exec-config-guide の provider 一覧に antigravity が載っている。
- `.agents/rules/` に薄ラッパーがあり、オーケストレーターを agy から起動できる（ラッパーまたは `orch:agy`）。
- agent の指示ディレクトリが保護設定に含まれ、executor がそれらを変更すると block される。
- `npm run check` が通過している。

## 3. 作業内容

| No  | 作業                                                                                                                                                                                                                                                                                                                                               | 担当 | 状態 | メモ                                              |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- | ---- | ------------------------------------------------- |
| 1   | schema の provider enum、`exec-defaults.yaml` の provider、`pm-members.yaml` の 4 member を追加し、dry-run でコマンドを確認する                                                                                                                                                                                                                    | DEV  | open | オーケストレーターが直接対応（設定のみ）          |
| 2   | reporter の `--json-schema` 直接指定を検証し、有効なら command_template に組み込む                                                                                                                                                                                                                                                                 | DEV  | open | 同上                                              |
| 3   | 小さな register todo を antigravity で実行し、統合まで通す                                                                                                                                                                                                                                                                                         | ARC  | open | 候補: PJR-YWPH                                    |
| 4   | `exec trial` で codex と比較し、proficiency の初期値と priority を決める                                                                                                                                                                                                                                                                           | ARC  | open | 結果を本個票に記録                                |
| 5   | `sysd-antigravity-agent-settings` を作成し、exec-config-guide と `dct-architecture.yaml` を更新する                                                                                                                                                                                                                                                | DEV  | open | codex-expert-executor / gemma-reporter / worktree |
| 6   | `.agents/rules/*.md` に `.github/instructions/*.md` の薄ラッパーを置く（`.claude/rules/` と同じ方式）。`GEMINI.md` は置かず `AGENTS.md` を共用する                                                                                                                                                                                                 | DEV  | open | オーケストレーターが直接対応                      |
| 7   | agy のファイル定義 agent の可否を検証し、可なら `.agents/` に 5 つ目のオーケストレーターラッパーを追加して `validate-orchestrator-sync.mjs` の照合対象に加える。不可なら `npm run orch:agy`（`agy -i "$(cat .agents/specdojo-orchestrator.agent.md)"`、codex の `orch:sol` と同型）を追加する                                                      | DEV  | open | 同上                                              |
| 8   | executor / reporter の役割指示は codex worker と同じく plan の共通規約で担う。`xep-common-conventions-template` の役割指示（result を更新しない、claim / complete を行わない）が十分か確認し、不足を補う。ファイル定義 agent が使える場合は `templates/antigravity/agents/**` を `config scaffold --provider antigravity` の配布原本として用意する | DEV  | open | 作業 5 と同一タスク                               |
| 9   | `exec-agent-protected-config` の保護対象に agent の指示ディレクトリ（`.agents/rules/`、`.agents/skills/`、`.claude/`、`.codex/`、`.opencode/`、`.github/agents/`、`AGENTS.md`、`CLAUDE.md`、`GEMINI.md`）を加え、agent が自分の指示を書き換えられないようにする                                                                                    | DEV  | open | 同上。他 provider にも効く                        |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[specdojo:exec-config-guide]]
- [[prj-0001:pjr-7wfe-schedule-agent-by-name]]
- [[prj-0001:pjr-1y0g-devcontainer-stale-vscode-server]]
- `docs/ja/projects/prj-0001/030-project-management/pm-members.yaml`
- `.specdojo/exec-defaults.yaml`
- `docs/specdojo/schemas/v1/pm-members.schema.yaml`
- `docs/ja/product/040-system-design/sysd-codex-agent-settings.md`（同型の設計文書）
- `.devcontainer/post-create.sh`（`agy` の導入）
