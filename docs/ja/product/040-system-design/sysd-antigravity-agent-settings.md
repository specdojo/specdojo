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

- executor / reporter の役割は runner が plan へ付加する stage 指示を正本とし、agy の `--agent` は使わない。
- 起動コマンドは `.specdojo/exec-defaults.yaml` の `providers.antigravity.command_template` に集約し、member に `command` を書かない。
- 標準モデルは `proficiency`、Antigravity 経由の他社モデルは `nickname` で選択する。解決順序は `by_nickname`、`by_proficiency`、`by_mode` の順とする。
- 自動選択の評価が完了するまでは codex / claude より低い `priority` を設定し、主に by-name と `--executor-by` / `--reporter-by` で使う。

## 2. 非対話起動

`agy -p` はプロンプトを引数として受け取り stdin を直接読まないため、runner が stdin へ渡す plan を `-p "$(cat)"` で引数へ変換する。`--sandbox` だけでは書き込み先が `~/.gemini/antigravity-cli/scratch/` へ移るため、`--add-dir "$(pwd)"` で task worktree を明示する。

```yaml
providers:
  antigravity:
    command_template: 'specdojo agent launch --provider antigravity --role {mode} -- --sandbox --model {model} -p "$(cat)"'
    command_params:
      by_proficiency:
        normal: { model: gemini-3.8-flash-medium }
        expert: { model: gemini-3.8-flash-high }
      by_nickname:
        agy-claude-executor: { model: claude-sonnet-5-5-medium }
        agy-claude-expert-executor: { model: claude-opus-5-5-high }
        agy-claude-expert-review-executor: { model: claude-opus-5-5-high }
        agy-gpt-executor: { model: gpt-oss-120b-medium }
```

使えるモデル ID は `agy models` で確認する。モデル ID 自体が推論強度を含み、`--effort` と組み合わせると選択が衝突するため `--effort` は指定しない。`--output-format json --json-schema` の出力は `structured_output` を含む envelope であり、reporter schema の生 JSON ではないため、reporter も既定のテキスト出力を使う。

## 3. member とモデル

| nickname                            | mode     | proficiency | model                      | 用途             |
| ----------------------------------- | -------- | ----------- | -------------------------- | ---------------- |
| `agy-executor`                      | `edit`   | `normal`    | `gemini-3.8-flash-medium`  | 標準 executor    |
| `agy-expert-executor`               | `edit`   | `expert`    | `gemini-3.8-flash-high`    | expert executor  |
| `agy-expert-review-executor`        | `review` | `expert`    | `gemini-3.8-flash-high`    | expert review    |
| `agy-reporter`                      | `report` | `normal`    | `gemini-3.8-flash-medium`  | reporter         |
| `agy-claude-executor`               | `edit`   | `normal`    | `claude-sonnet-5-5-medium` | Sonnet executor  |
| `agy-claude-expert-executor`        | `edit`   | `expert`    | `claude-opus-5-5-high`     | Opus executor    |
| `agy-claude-expert-review-executor` | `review` | `expert`    | `claude-opus-5-5-high`     | Opus review      |
| `agy-gpt-executor`                  | `edit`   | `normal`    | `gpt-oss-120b-medium`      | GPT OSS executor |

`command_params.by_nickname` は member ごとのモデル差し替えだけに使う。役割の選択は `command_template` の `--role {mode}`、権限と worktree 指定は起動処理に集約し、同じ provider の全 member へ一括適用する。

## 4. 指示と設定ファイル

`agy` は repository root まで探索し、`AGENTS.md`、`.agents/rules/*.md`、`.agents/skills/<name>/SKILL.md` を読む。プロジェクト共通の言語・安全規則は `AGENTS.md`、環境別の薄い規則ラッパーは `.agents/rules/`、再利用手順は `.agents/skills/` を正本とする。

executor 向けの stage 契約は `src/exec/run/agent.ts` が plan 末尾へ付加し、reporter の prompt・出力契約は `src/exec/reporter.ts`、両 stage の進行は `src/exec/run/agent-pipeline.ts` が担う。executor は成果物の編集と検証だけを行い result・lifecycle を更新せず、reporter は evidence から構造化結果を返すだけでファイルを書かない。したがって `templates/antigravity/agents/` は設けない。一方、`config scaffold --provider antigravity` はオーケストレーターと provider 設定スニペットをリポジトリへ配置し、`--global` 指定時だけ CLI のユーザー権限設定をマージする。

対話型オーケストレーターはファイル定義 agent ではなく、`npm run orch:flash` が `gemini-3.8-flash-high` を指定し、`.agents/specdojo-orchestrator.agent.md` の本文を `-i` で渡して起動する。

## 5. 認証・秘密情報

認証は利用者が `agy` で行い、機械ローカルの `~/.gemini/` に保持する。repository の provider 設定、member、plan、evidence へ token、cookie、認証ファイルの内容を記録しない。devcontainer では `~/.gemini` の永続化ボリュームを利用するが、その内容は成果物・保護設定の対象外とする。

## 6. 権限と保護境界

agy 1.4.12 の `--settings` は JSON またはファイルパスを取り、セッション内だけに適用する（2026-11-02 のローカル `agy --version` / `agy --help` で確認）。通常の scaffold は `settings.edit.json`、`settings.review.json`、`settings.report.json`、`settings.orchestrator.json` を `.specdojo/antigravity/` へ配置し、ユーザーのグローバル設定を書き換えない。

非対話実行は `specdojo agent launch --provider antigravity --role {mode} -- <agy 引数>` を通す。同じ版の `specdojo` が PATH に必要である。runner が追加する `--add-dir` はこの入口を通り、`SPECDOJO_REPO_*` から得た task worktree と cwd に含まれる場合だけ受け付ける。対話型は `orchestrator launch --provider antigravity` が選択 project の宣言済み product repository と宣言済み外部 project を同じ生成処理へ渡す。任意の外部 repository は自動許可しない。

`src/exec/antigravity-session.ts` はローカルの役割プロファイル（未配置なら配布原本）に追加ルートの絶対パスと固定の制限を足し、重複を除いた単一の `--settings` JSON を渡す。ファイルを生成・保存しない。ルートの symlink は実体へ正規化し、権限構文で安全に表現できない `(`、`)`、`*` 等を含むルートは拒否する。不正な JSON・ルール配列は起動前に失敗する。

| 役割            | ファイル権限                         | command・MCP                            |
| --------------- | ------------------------------------ | --------------------------------------- |
| edit            | cwd と宣言済み task worktree を編集  | 検証用 command を allow、その他は確認制 |
| review / report | 宣言済みルートの読み取りのみ         | 全 command・MCP・ブラウザ操作を deny    |
| orchestrator    | 宣言済みルートと承認された設定を編集 | 未設定操作は確認制、push・gh 等は deny  |

全役割で各ルートの `.env` と主要な環境別ファイル、`secrets/` 等の読み取り、Git metadata の書き込みを deny する。edit の固定保護ルールは provider 非依存ガードのディレクトリ・ファイル定義から生成し、既存 commitlint 設定も加える。review / report は `write_file(*)` に加えて `command(*)`・`unsandboxed(*)`・`mcp(*)` を拒否するため、shell からの書き込みも許可しない。検証コマンドは親 runner が担当する。orchestrator は利用者の承認で保護設定を変更する役割なので、executor の設定パス deny を引き継がない。

[CLI 権限仕様](https://antigravity.google/docs/permissions/?tab=cli) は `deny > ask > allow`、workspace 内の暗黙許可、ファイルパスの再帰的照合を定める。Claude の `Edit(...)` / `Bash(...)` と agy の `write_file(...)` / `command(...)` は同一の構文ではない。特に agy の `*` は全対象指定であり、Claude のパス glob を転記しない。

_ASSUMPTION_: 公開仕様では `--settings` と既存グローバル・project 設定の permission 配列が結合されるか置換されるかを確定できない。今回確認したのは session-only の help と生成 JSON の内容・起動引数であり、Claude と同等の隔離を実証したとは扱わない。独立した複数の `--settings` のマージには依存せず、必須ルールを毎回一つの JSON に含める。既存の deny / ask が残って許可を狭める場合や、置換によって利用者独自ルールが失われる場合は実機確認が必要である。追加の独自制限は各役割プロファイルへ明示する。

`toolPermission` は `request-review` に固定し、bypass・別 settings・project／会話の再開・別 agent を指定する引数は拒否する。`--dangerously-skip-permissions` に依存しない。秘密情報の任意の別名・入れ子配置や、許可された検証 script 自体の任意処理まで権限 JSON だけで保証するものではない。実機で sandbox と shell の拒否範囲を確認し、provider 非依存の保護設定・Git 状態ガード、worktree、commit 許可リストを引き続き併用する。

### 6.1. 既存利用者の移行

1. `config scaffold --provider antigravity --dry-run` を確認してから通常実行し、役割プロファイルを追加する。既存ファイルは保持され、`--force` は内容確認後にだけ使う。
2. `providers.antigravity.command_template` を上記の `agent launch` 形式へ変更し、member の `mode` を edit / review / report に合わせる。member の個別 command がある場合も移行する。
3. 旧 `--dangerously-skip-permissions` を削除する。対話型の npm script は `orchestrator launch` 経由にする。scaffold は既存 npm script を上書きしない。
4. 旧 `--global` で追加した executor 用 deny が orchestrator の設定編集を妨げる場合、バックアップと自身のルールを照合して必要な項目だけ手動で各役割へ移す。CLI は既存グローバルルールを自動削除しない。`settings.global.json` と明示的な `--global` は互換入口として残すが、新規導入には不要である。
5. 設定を commit し、下記の実機検証後に運用へ適用する。本リポジトリ自身の保護設定は個票・result の申し送りを承認後に反映する。

## 7. 利用制限と検証

利用制限の初期検出パターンは `rate limit`、`429`、`quota`、`RESOURCE_EXHAUSTED` とする。実文言は未観測のため、実行ログで新しい制限シグナルを確認したときに `rate_limit_detection.stderr_patterns` を更新する。

設定変更時は次を確認する。

1. schema と catalog の検証が成功する。
2. `resolveMemberCommand()` のテストで `by_nickname` が `by_proficiency` と `by_mode` を上書きする。
3. dry-run で各 nickname が意図した `--model` を含む `agy` コマンドへ解決される。
4. 指示ディレクトリまたは root 指示ファイルの変更が `agent-config-write` で block される。
5. 実タスクでは executor evidence、親 runner 検証、reporter、統合までを確認する。
6. 一時 HOME を使い、`--global --dry-run` が無変更、実適用が既存キーを保持してバックアップを作ること、再実行が冪等であることを確認する。

### 7.1. 実機確認の申し送り

実 agy は認証・使用枠を伴うため sandbox 内では起動しない。秘密情報を含まない使い捨て project / product repository と task worktree を使い、次を記録する。

1. グローバル・project・session に相反する allow / deny / ask と識別用ルールを置き、配列の結合／置換と優先順位、セッション終了後の設定無変更を確認する。実ユーザー設定・認証ファイルは証跡へ転記しない。
2. edit で両 worktree の通常ファイルの作成・変更が通ること、未宣言ルートの書き込みが自動許可されないことを確認する。
3. 無害な内容の `.env`、`secrets/probe.txt`、`package.json`、agent 設定を使い、両 repository で読み取り／書き込みの拒否を確認する。shell 経由も含める。
4. review / report の通常ファイルと result の書き込み、command / MCP を拒否すること、orchestrator では承認された保護設定編集が可能であることを確認する。
5. 統合後に [[prj-0001:pm-orchestrator-playbook|運用プレイブック]] の PJR-JSEY を実行し、実際の `exec run --register` の executor・親検証・reporter・統合の証跡を個票と result に記録する。
