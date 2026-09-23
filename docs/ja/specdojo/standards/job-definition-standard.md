---
specdojo:
  id: specdojo:job-definition-standard
  type: standard
  status: draft
---

# Job 定義標準

Job Definition Standard

`job-*.yaml` が担う責務の境界と、`task` の記述・agent 指名・検証の規約を定義します。Job は runner が直接実行する決定論的コマンド、または agent へ委譲する判断を定義します。

## 1. 目的・適用範囲

- 対象: プロジェクトの `jobs_path` 配下に置くすべての `job-*.yaml`。
- 目的: 決定論的な実行と agent に委譲する判断を分け、コマンドの組み立てへ agent の判断力を使わせないこと。
- 位置づけ: 本標準は Job Definition の規範を定める。実行モデル（Job Run、冪等性、checkpoint）の設計は `sysd-job-execution`、運用手順は `routine-operation-guide` と `command-reference` に委譲する。
- 機械検証: `docs/specdojo/schemas/v1/job.schema.yaml` を SSOT とし、本文では制約を二重定義しない。

## 2. 基本方針

- 決定論的な手順（分岐条件が事前に確定し、実行結果が入力から一意に決まる手順）は script または CLI へ実装し、`mode: command` の `task.command` からその入口を呼ぶ。
- `task.command` は materialize 時に入力を展開して Run へ凍結し、runner が agent の sandbox 外で直接実行する。
- 対象選択を伴う command Job は任意の `task.precondition` で選択を先に評価できる。skip 条件を満たした場合は Job Run と付随成果物を作らない。
- command Job が同じプロジェクトの `specdojo exec` を子プロセスとして呼ぶ場合、runner が保持する project 実行 lock の token を子へ継承する。子は owner token の一致を検証した場合だけ再取得を省略し、Job 全体の排他範囲を維持する。
- 判断（観測した結果の解釈、失敗の切り分け、次の行動の提案）が必要な command Job だけ、`task.analysis` で reporter agent と判断内容を指定する。
- `edit` / `review` Job は従来どおり agent に作業を委譲し、`task.description` に判断内容を書く。
- 委譲先の agent は nickname で指名する。`capabilities` / `proficiency` による間接指定は、指名が不要な場合に限る。
- 同じ論理実行に対して同じ Run を作れるよう、Job が使う値は `inputs`、`job_id`、`scheduled_at`、前回成功 checkpoint に限定する。Run ID 確定後の task と checkpoint では `job_run_id` も参照できる。

### 2.1. 判断と手順の切り分け基準

次の表で「手順」に該当する記述は `task.description` へ書かず、script または CLI へ移す。

| 区分 | 判定基準                                                   | 記述場所                                              | 例                                               |
| ---- | ---------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------ |
| 手順 | 実行前に条件と順序が確定し、結果が入力から一意に決まる     | script / CLI と `task.command`                        | 対象文書の列挙、段の順序制御、1件ごとの CLI 実行 |
| 手順 | 同じ操作を対象ごとに繰り返す                               | script / CLI と `task.command`                        | 全件ループ、対象0件時の分岐                      |
| 判断 | 観測した結果を解釈し、複数の説明のどれが妥当かを選ぶ       | `task.analysis.description` または `task.description` | 失敗が rate limit か agent の失敗かの切り分け    |
| 判断 | 事実から次の行動（再開・見直し・エスカレーション）を決める | `task.analysis.description` または `task.description` | 閾値の見直し要否、再開可否の判断                 |
| 委譲 | どの agent に任せるか                                      | `task.analysis.agent` または `task.agent`             | reporter / executor の nickname 指名             |

## 3. 規範本体

### 3.1. task.description の規約

- `task.description` には、agent が下すべき判断と、判断の根拠にする入力（コマンドの出力、生成ファイル）を書く。
- 決定論的な手順を自然言語で列挙してはならない。command Job の `task.command` が呼び出す入口（script または CLI）は1つに限り、その引数は `inputs` から解決する。
- 判断できない事象について、推測で埋めず、観測した事実と未確認範囲を分けて報告することを求める。
- 対象が0件の場合の扱い（no-op）を記述する。

### 3.2. agent 指名の規約

- `task.agent.executor` に、成果物の編集・検証・コマンド実行を担当する agent の nickname を書く。
- result を executor が書かない構成（stage_role を持つ pipeline member）では、`task.agent.reporter` に reporter の nickname を書く。両方を指名した Run は executor → reporter の2段で実行され、result は reporter が書く。
- `task.agent.reporter` を省略した場合、executor が Job Run の result まで記入する。result を書かない agent を単独で指名してはならない。
- nickname は `pm-members.yaml` に登録済みの `type: agent` のメンバーと完全一致させる。`job validate` は書式のみを検査するため、実在確認は `exec run --job --dry-run` で行う。
- `exec run --by` は単一 agent 実行としての単発の差し替え、`--executor-by` / `--reporter-by` は段ごとの差し替えとして、いずれも Job の指名より優先する。
- command Job で判断が必要な場合は `task.analysis.agent` に `stage_role: reporter` の nickname を指定する。`--reporter-by` で差し替えられるが、runner 実行を `--by` / `--executor-by` で agent に置き換えることはできない。

### 3.3. command mode の規約

- `task.command` は非空のシェルコマンドとし、materialize 後の文字列を Job Run に保存する。
- `task.precondition` は command mode だけで使用でき、非空の `command` と `skip_when` を持つ。runner は入力と Job Run ID を含む template 値を解決した後、初回の Job Run を保存する前に precondition を実行する。
- `skip_when: empty-output` は終了コード 0 かつ、前後の空白を除いた stdout が空の場合に skip とする。`skip_when` に 0 から 255 の整数を指定した場合は、その終了コードを skip とする。それ以外の非 0 終了は precondition の失敗として扱う。
- precondition による skip では Job Run、plan、result、evidence を作らず、analysis reporter と `task.command` も起動しない。routine 起動では routine に `skipped` を返し、routine 側だけが `last_run` / `last_result` を更新する。
- 既存 Job Run の retry は保存済みの対象と再開状態を維持するため precondition を再実行しない。`--dry-run` は precondition を実行せず、解決済みコマンドと skip 条件を表示する。
- command から対象プロジェクトを指定するときは template 値 `{{project_id}}` を使い、同じ CLI を子プロセスで呼ぶときは `{{specdojo}}` を使う。`specdojo` という PATH 上の別 checkout を直接呼ばない。
- script が中断再開用の ID を要求するときは `{{job_run_id}}` を渡す。期間などの `inputs` から再開キーを組み立てない。
- runner は POSIX 環境では `/bin/sh -eu` でコマンドを実行し、終了コードが0以外なら agent を起動せず Run を失敗にする。
- runner はコマンド、終了コード、標準出力、標準エラーを bounded・redacted evidence として保存する。stdout / stderr は監査用ログへの参照に加え、analysis reporter が追加のファイル読取なしで判断できるよう evidence 本体にも同じ bounded 内容を含める。
- `task.analysis` は任意である。省略時は終了コードだけで成否を確定し、指定時はコマンド成功後に evidence を reporter agent へ渡す。
- analysis の根拠にする生成ファイルは command が stdout へ出力する。reporter は evidence 本体に埋め込まれた bounded stdout / stderr だけを読み、参照先ログや作業ツリーのファイルを追加で検査しない。

### 3.4. 責務境界と粒度

- 1つの Job は1つの委譲単位に対応させる。同じ処理を条件違いで繰り返すために Job を分割してはならない。条件差は `inputs` で表す。
- 実行順序を Job の分割で表現してはならない。順序は script または CLI が持ち、routine の `action` 配列は独立した委譲単位の並びにだけ使う。
- Job は起動時刻を持たない。時刻条件は routine または外部スケジューラが持つ。
- Job は agent 実行エンジンを持たない。plan 生成、agent 選択、result、worktree、commit は `exec` 実行基盤へ委ねる。

### 3.5. inputs と冪等性

- `inputs` には、実行内容または表示内容を決める値（期間、対象種別、上限件数）だけを置く。
- string / integer / boolean は `enum` で許容値を、list は `enum` で各要素の許容値を制限できる。integer の範囲は `minimum` / `maximum` で制限する。既定値にも同じ制約を適用する。
- 入れ子の mapping は入力にせず、独立に検証できる flat な入力へ分ける。たとえば登録簿 filter は `types` / `priorities` / `statuses` の list と `limit` の integer で表す。
- `run.idempotency_key` には、同じ論理実行を判別できる実行条件を含める。実行枠ごとに処理する Job は `scheduled_at` を含め、同じ実行枠の重複起動を同じ Run、次の実行枠を別 Run にする。
- 表示専用の `period` は冪等キーや再開キーに使わない。実行内容を変える `inputs` は冪等キーに含める。
- `job_run_id` は `idempotency_key` から導出されるため、`run.idempotency_key` では参照できない。
- 同じ `scheduled_at` を明示した手動・routine 起動は同じ実行枠として重複排除する。`scheduled_at` を省略した手動起動は起動ごとに新しい実行枠とする。

## 4. 値制約・判定基準

| 項目                   | 必須 | 判定基準                                                           |
| ---------------------- | ---- | ------------------------------------------------------------------ |
| `id`                   | ○    | `job-<slug>` 形式で、ファイル名の拡張子を除いた部分と一致する      |
| `task.mode`            | ○    | `edit` / `review` / `command`                                      |
| `task.description`     | 条件 | `edit` / `review` で必須。決定論的手順の列挙を含まない             |
| `task.command`         | 条件 | `command` で必須。入力展開後も非空                                 |
| `task.precondition`    | 任意 | `command` と `empty-output` または 0〜255 の終了コードを指定       |
| `task.analysis`        | 任意 | command 結果の判断が必要な場合だけ agent と description を指定     |
| `task.targets` `paths` | 条件 | `edit` / `review` はいずれか必須。`command` では任意               |
| `task.agent.executor`  | 任意 | `pm-members.yaml` の nickname 書式（`^[a-z0-9][a-z0-9_-]{0,62}$`） |
| `task.agent.reporter`  | 任意 | 同上。executor が result を書かない構成では必須                    |
| `inputs.*.enum`        | 任意 | scalar の値または list の各要素に対する非空の許容値集合            |
| `minimum` / `maximum`  | 任意 | integer input だけに指定でき、`minimum <= maximum`                 |
| `run.idempotency_key`  | ○    | 空文字へ解決されず、同じ論理実行を一意に判別できる                 |

## 5. 記述例

```yaml
task:
  mode: command
  owner: ARC
  precondition:
    command: "{{specdojo}} grade list --target kata --changed-only --project {{project_id}}"
    skip_when: empty-output
  command: |
    tools/grade/run-per-document.sh --run-id {{job_run_id}}
    cat logs/grade/runs/per-document/{{job_run_id}}/results.tsv
  analysis:
    agent: claude-reporter
    description: |
      command evidence と results.tsv から未完了の段の有無、失敗の切り分け、
      閾値の見直し要否を判断して報告する。
  paths:
    - docs/ja/specdojo/rulebooks
run:
  idempotency_key: "{{job_id}}:{{scheduled_at}}"
```

## 6. 禁止事項

- 対象文書の列挙、段の順序制御、1件ごとの CLI 実行を `task.description` へ書かない。自然言語で書かれた script は Job の責務ではない。
- 実行順序を表すためだけに Job を分割しない（例: 1段目・2段目・3段目を別 Job にする）。
- `task.agent` を省略したまま、`capabilities` の間接指定だけで pipeline member を選ばせない。auto 選択の対象は stage_role を持たない agent に限られるため、指名なしでは解決できない。
- result を更新しない agent を `task.agent.reporter` なしで指名しない。Run が常に未記入 result で失敗する。
- `task.description` へ認証情報、秘密鍵、token を書かない。
- 検証済みでない外部入力（環境変数、任意コード実行）をテンプレート式で展開しない。

## 7. 運用・見直しルール

- `job-*.yaml` を変更した場合は `specdojo job validate --project <project-id>` を実行する。
- agent の指名を変更した場合は `specdojo exec run --job <job-id> --dry-run` で、解決された nickname とコマンドを確認する。
- Job を統廃合した場合は、参照する routine の `action` と運用ガイドの記述を同じ変更で更新する。
- script または CLI へ手順を移した場合は、移し先の入口と引数を `command-reference` に記載し、Job からはその入口だけを呼ぶ。
- `task.precondition` を追加・変更した場合は、選択 0 件の skip と 1 件以上の通常 materialize の両方をテストする。
