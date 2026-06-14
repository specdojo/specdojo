---
id: sysd-agent-settings
type: project
status: draft
rulebook: sysd-rulebook
---

# エージェント共通設定

SpecDojo CLI と外部エージェント CLI を組み合わせてマルチエージェント実行を行う際の共通設計を定義する。

個別の CLI、provider、モデル、認証、権限、agent 定義は次の子設計で定義する。

- [Claude Code エージェント設定](sysd-claude-agent-settings.md)
- [Codex エージェント設定](sysd-codex-agent-settings.md)
- [OpenCode エージェント設定（Ollama）](sysd-opencode-agent-settings.md)

## 1. 設計方針

SpecDojo CLI、agent、`specdojo exec run` の3層に責務を分割する。

- **SpecDojo CLI**: タスク状態、依存関係、実行計画、結果、イベントを管理する。
- **agent**: 渡された plan を解釈し、関連文書を読み、成果物の編集またはレビューと result の記録を行う。
- **`specdojo exec run`**: member 選択、起動、フェーズ順序、並列数、worktree、フォールバックを制御する。

共通方針は次のとおりとする。

- agent は scheduler として動作せず、渡された1件の plan だけを処理する。
- edit と review は `mode` で分離し、review agent に成果物の編集権限を与えない。
- phase の `capabilities` と `proficiency` を member の属性と照合して agent を選択する。
- 複数の edit agent を並列実行する場合は、タスクごとに worktree を割り当てる。
- 認証情報は環境または各 CLI の認証ストアから注入し、リポジトリへ保存しない。
- CLI 固有の権限機構を使用し、無制限のファイル操作や確認回避を通常運用に含めない。

## 2. 責務分担

| 層                  | 責務                                                                                                                  | 責務外                             |
| ------------------- | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| SpecDojo CLI        | validate / build / ready 抽出 / claim / complete / block / lock / CPM / plan・result・event 管理                      | タスク内容の理解・成果物の編集     |
| agent               | plan の解釈・関連文書の読解・成果物の編集またはレビュー・done criteria の確認・result の記録                         | タスク取得の排他制御・並列起動制御 |
| `specdojo exec run` | member 選択・フェーズ順序・並列数・worktree 割り当て・agent 起動・終了状態の反映・フォールバック                     | タスク内容の判断・成果物の編集     |

各 agent CLI の設定ファイル、モデル、権限、非対話コマンドは子設計の責務とする。

## 3. 共通実行フロー

```text
schedule yaml（owner・phase・mode・capabilities・proficiency を定義）
   ↓
specdojo exec build
   ↓
generated/ready.json / exec/plans/<task-id>-plan.md
   ↓
specdojo exec run
   → ready task を claim
   → exec/results/<task-id>-result.md を scaffold 生成
   → phase 要件に適合する member を選択
   → edit task では必要に応じて task 単位の worktree を作成
   → member.command で agent CLI を非対話起動し、plan を渡す
   → agent が成果物の編集またはレビューと result の記録を実行
   → 終了コード 0 は complete、失敗はポリシーに従って retry / fallback / block
   → worktree をクリーンアップ
```

edit と review の順序は固定しない。`sch-strategy-<track>.yaml` の phase に `mode: edit` または `mode: review` を定義し、スケジュール構造で順序を表現する。

## 4. 共通ディレクトリ

```text
docs/ja/projects/prj-0001/030-project-management/
├─ 020-organization/
│  └─ pm-members.yaml                 # agent CLI の起動定義と選択属性
├─ schedule/
│  └─ sch-strategy-<track>.yaml       # phase の mode・capabilities・proficiency
└─ execution/
   ├─ exec/
   │  ├─ plans/                       # agent に渡す plan
   │  ├─ results/                     # agent が確認結果を記録する result
   │  └─ events/                      # append-only の状態変更イベント
   └─ generated/
      └─ ready.json                   # exec build の生成物
```

agent CLI 固有のプロジェクト設定と agent 定義の配置は子設計で定義する。

## 5. エージェント割り当て

### 5.1. `pm-members.yaml`

`pm-members.yaml` の member は、少なくとも次の属性で実行方法と選択条件を定義する。

| 項目                 | 用途                                                        |
| -------------------- | ----------------------------------------------------------- |
| `nickname`           | event、result、`--by` で使用する member 識別子              |
| `type`               | agent member は `agent`                                     |
| `mode`               | `edit` または `review`                                      |
| `capabilities`       | Web 検索など、その member が提供できる能力                  |
| `proficiency`        | `normal` または `expert`                                    |
| `priority`           | 同じ要件に適合する member 間の優先順位                      |
| `command`            | `specdojo exec run` が起動する非対話コマンド                |
| `scheduler_strategy` | ready task の選択順序。edit は `critical-first` を基本とする |

`command` には agent CLI と実行オプションだけを定義する。plan 本文はコマンド文字列へ埋め込まず、`specdojo exec run` から標準入力で渡す。

### 5.2. `sch-strategy-<track>.yaml`

phase は `mode`、`capabilities`、`proficiency` で作業要件を宣言する。`specdojo exec run` は要件を満たす member を選択する。

```yaml
phase_sets:
  first-pass:
    - id: enrich
      mode: edit
      proficiency: normal

  finalize-pass:
    - id: align
      mode: review
      proficiency: expert
```

CLI 名やモデル名は phase に記述しない。実行環境の差し替えは `pm-members.yaml` で行う。

詳細は [specdojo-exec-strategy-guide](../../specdojo/guides/specdojo-exec-strategy-guide.md) を参照する。

## 6. 実行と失敗処理

### 6.1. 非対話実行

agent CLI は TUI を起動しない非対話モードで実行する。plan は標準入力で渡し、YAML frontmatter や本文がコマンドラインオプションとして解釈されないようにする。

agent は次の契約に従う。

- plan に指定された対象と done criteria だけを処理する。
- edit agent は成果物を編集し、review agent は成果物を変更せず所見を result に記録する。
- result の done criteria 確認欄を更新してから終了する。
- agent 自身は claim、complete、block を実行しない。
- 権限不足や判断不能な状態では権限を拡大せず、非0で終了して block 判断を呼び出し元へ戻す。

共通の実行例は次のとおりとする。

```bash
# 1バッチ実行
specdojo exec run --auto --parallel 3

# ready task がなくなるまで実行
specdojo exec run --auto --loop --parallel 3

# member を明示して実行
specdojo exec run --by <member-nickname>
```

### 6.2. `.specdojo/exec-defaults.yaml`

rate limit と一時障害の検出条件、および retry / fallback / block のポリシーは `.specdojo/exec-defaults.yaml` で一元管理する。

```yaml
rate_limit_policy:
  on_non_critical:
    action: skip
  on_critical:
    action: try_next
    retry:
      max_attempts: 3
      initial_wait_seconds: 30
      backoff_multiplier: 2
      max_wait_seconds: 300
    on_exhausted: block
```

検出対象となる終了コード、stderr pattern、待機時間は provider ごとに異なる。子設計には provider 固有のシグナルと運用上の注意だけを記述する。

## 7. worktree 分離

複数の edit agent を並列実行する場合は、タスクごとに worktree とブランチを作成して Git working tree の競合を防ぐ。review agent が成果物を変更しない場合、review task の worktree 分離は不要とする。

| タイミング          | 操作                                                        |
| ------------------- | ----------------------------------------------------------- |
| claim 時            | `git worktree add ../worktrees/<task-id> -b exec/<task-id>` |
| complete / block 時 | `git worktree remove ../worktrees/<task-id>`                |

`specdojo exec run` がライフサイクルを管理し、agent の作業ディレクトリを割り当てた worktree に設定する。手動実行でも同じ命名規則を使用する。

```text
repo/
worktrees/
├─ T-ARC-base-arch-010/      # branch: exec/T-ARC-base-arch-010
└─ T-DEV-api-impl-010/       # branch: exec/T-DEV-api-impl-010
```

worktree 間で append-only event が衝突しないよう、イベントファイル名は次の形式とする。

```text
<timestamp>-<by>-<task-id>-<event-type>.json
```

task ID を含めることで、同じ member が同時に複数 task を処理してもファイル名を一意にする。
