---
specdojo:
  id: specdojo:plan-result-lifecycle-guide
  type: guide
  status: ready
---

# plan/resultライフサイクルガイド

Plan and Result Lifecycle Guide

`exec plan` / `exec run` / `exec claim` が扱う plan と result の生成、命名、再実行、アーカイブを説明します。exec の実行手順は [exec運用ガイド](exec-operation-guide.md) を参照します。

**対象読者**

- exec plan と result の生成・保管・再実行を運用または保守する開発者、実行管理者

**この文書で分かること**

- plan・result の役割、配置、命名、生成ルール、status、テンプレート、アーカイブ、再実行時の扱い

**次に読む文書**

- 実行手順は [exec運用ガイド](exec-operation-guide.md)、plan が参照する資料の使い分けは [実践の進め方ガイド](ryu-guide.md) を参照してください。

## 1. planとresultの基本

plan と result が持つ役割と、それぞれの配置場所を示します。

### 1.1. planとresultの役割

| ファイル | 役割                                               | 生成タイミング            |
| -------- | -------------------------------------------------- | ------------------------- |
| plan     | agent に渡す作業指示                               | `exec plan` / `exec run`  |
| result   | 実行結果の記録。human では作業指示と確認記録の正本 | `exec claim` / `exec run` |

plan と result は git 管理対象の通常ファイルとして扱います。`generated/` のような再生成物ではありません。

plan / result の frontmatter には `targets`（対象文書の doc id リスト）を必須項目として焼き込みます。通常タスクの先頭は対象成果物の配置に対応する doc id（プロダクト文書は `<local-id>`、プロジェクト文書は `<project-id>:<local-id>`）、以降は `approach` に応じて変更・確定の対象になる実践の型の doc id です。既存の成果物は frontmatter の `specdojo.id` を正本とし、未作成の成果物はカタログで解決した配置から ID 形式を決めます。`bootstrap` / `bootstrap-finalize` は rulebook / recipe / sample / template、`<kind>-maintenance` は対象の 1 種を含め、解決できない実践の型は含めません。`cross-deliverable-dedup` では schedule の `target_local_ids` に対応する複数成果物だけを列挙し、実践の型は変更対象に含めません。いずれも doc-index（`index lookup`）でパスへ解決できます。agent は plan、human は result を正本にするため、schedule やファイル名の命名規約に依存せず対象文書を機械的に取得できます。

`bootstrap` と `<kind>-maintenance` の edit plan 本文には、成果物のパスに加えて、rulebook frontmatter の宣言から解決した実践の型の repo 相対パスと状態を記載します。状態は、既存文書を編集する `existing`、宣言済みパスへ新規作成する `missing`、宣言からパスを解決できず前提確認が必要な `unresolved` の3値です。`unresolved` のときは命名規則から対象を推測しません。

### 1.2. 配置

1 回の実行を `execution/runs/<出どころ>/<項目 ID>/<run ID>/` にまとめます。配置の決め方は `src/shared/run-records.ts` を正本とします。

```text
execution/
  runs/<出どころ>/<項目 ID>/<run ID>/
    plan.md
    result.md
    evidence.json
    pipeline-state.json
    executor.log
    reporter.log
```

ログは実行した段に応じて保存し、親検証・統合のログも同じディレクトリに置きます。human の実行は result のみです。完了しても保存先は変わりません。共通規約の版は `execution/conventions/`、成果物ごとの評価結果は `execution/grade/results/`、job の状態管理 JSON は `execution/jobs/runs/` に残します。

### 1.3. 配置の検査

`exec validate` は schedule・event とともに実行記録の配置を検査し、欠けた記録を `WARN:` で知らせます。欠落だけなら終了コードは 0 です。CI などで配置だけを検査し、欠落もエラーにする場合は次を使います。

```bash
specdojo exec validate --project <project-id> --records-only
```

次の過去の世代の記録は、通常の検査でも `--records-only` でもエラー・警告にしません。

- evidence 導入前: `plan.md` と `result.md` がそろい、`pipeline-state.json` と `evidence.json` がない run。
- 移行で plan・result を集約した先行試行: `pipeline-state.json` と `evidence.json` があり、plan・result が両方なく、同じ出どころ・項目の別 run に plan・result の対がある run。
- 旧配置: `execution/exec/plans/`・`results/`・`evidence/` 配下。evidence や対になる記録がなくても検査対象から外します。

このほか `execution: human` を明記した result は単独で正常とします。それ以外で `plan.md`・`result.md`・`evidence.json` が欠けた run は、通常は警告、`--records-only` では `ERROR:` と終了コード 1 で報告します。生成直後の plan 単独や中断中の run も含みます。ログと checkpoint は実行段に応じた任意の記録で、退避した試行も同じ run に保持できます。

run の外の plan・result・evidence・checkpoint・ログ、不正な出どころや深さは、上の例外を除き両モードでエラーにします。`exec/events/`・`exec/trials/`、規約の版、`grade/results/`・`grade/generated/`、job の状態、生成物、routine の失敗記録は独立した形式として検査から除きます。runtime lock は `git check-ignore` で確認し、追跡済みや無視されていない lock、Git で確認できない場合は両モードで終了コード 1 を返します。旧 `routines/.locks/` も設定された routine のディレクトリで検査しますが、ファイルのない lock のディレクトリは対象外です。

検査は記録を書き換えず、欠けたファイルも生成しません。CI で `--records-only` を使う場合は、実行が終了して記録がそろった revision を対象にしてください。

`exec run` と `exec cycle` の事前検証は `exec validate --schedule-only` で schedule・event だけを調べます。生成途中や中断中の run と、取得中の runtime lock があっても、実行・再開を妨げません。`--schedule-only` と `--records-only` は併用できません。

## 2. 命名規則

### 2.1. 出どころと項目 ID

| 出どころ   | 項目 ID                    |
| ---------- | -------------------------- |
| `register` | 登録項目 ID（`PJR-XXXX`）  |
| `schedule` | タスク ID（`T-...`）       |
| `job`      | job の実行 ID（`JBR-...`） |

review は元の項目の下の別 run とします。plan と result の文書 ID は frontmatter の `specdojo.id` を正本とし、ファイルの移動で変更しません。

### 2.2. run ID

新しい plan の生成では `<slug>-<UTC>-<rand>` のユニークな run ID を採番します。`<rand>` は4バイト（16進8桁）で、同一プロセス内で重複した場合は連番を加えます。job の attempt など、呼び出し側が run ID を指定する場合も同じ配置モジュールを通します。

plan と result のファイル名はそれぞれ `plan.md` と `result.md` です。同じ task の新しい実行は別 run に保存します。同一 run の再開では保存先を維持し、executor をやり直す前の state・evidence・ログを `*.attempt-N.*` に退避します。

### 2.3. 既存記録の移行

`exec migrate-records` は検査を通すためには不要です。旧配置の記録を CLI の通常の探索で使う場合に移行します。移さない場合の制約は次のとおりです。

- `exec run --register ... --resume` と schedule の executor 再開は、`runs/` 内の checkpoint を候補にするため旧 `exec/evidence/` の run を発見しません。schedule の通常実行・統合再開も、plan・result の通常の探索では旧配置を参照しません。保存済みイベントや checkpoint の明示的なパス参照を読む経路はありますが、旧配置を自動探索する互換機能ではありません。
- `dashboard build` の実行記録一覧と plan・result 件数には、旧配置の記録が含まれません。`exec archive` や task ID からの plan・result の取得も `runs/` のみを探索します。
- `register build` は個票とイベントから派生ビューを作り、旧記録の探索やリンクの移行はしません。個票にある既存リンクは元ファイルが残れば利用できますが、検査の成功によって補完・更新されることはありません。

移行対象の run を完了または破棄し、対応する worktree を撤去してから、Git index に書き込める環境で移行します。プロセスを止めただけで worktree が残っている場合は、`--dry-run` でも項目 ID・worktree のパス・ブランチを示して処理前に停止します。進行中の run の移行と再開は対象外です。

```bash
specdojo exec migrate-records --project <project-id> --dry-run
specdojo exec migrate-records --project <project-id>
```

コマンドは移動先と参照の更新対象、対になる plan または result が欠けた記録を表示します。移動には `git mv` を使い、ログ本文と文書 ID を保持してパスの欄と共通規約への相対参照を更新します。移動先の衝突・追跡されていない移動元は処理前に拒否します。移行済みの状態で再実行すると移動は 0 件です。

checkpoint に同じ plan / result を参照する試行が複数ある場合、対は最新の checkpoint の run に置き、先行試行の evidence とログはそれぞれの run に残します。対応が特定できない記録は元の stem を run ID とし、欠けた記録を捏造しません。比較実験の `exec/trials/` は独立した保存形式のため移行対象から外します。通常の読み取りは `runs/` のみを対象にします。

### 2.4. deliverable指定の解決

`--deliverable <local_id>` は成果物カタログ全体から `local_id` を検索します。

| 一致件数 | 挙動                                  |
| -------- | ------------------------------------- |
| 0件      | エラー                                |
| 1件      | その成果物を対象にする                |
| 2件以上  | エラーにし、`local_id` の一意化を促す |

先頭一致や domain の暗黙選択は行いません。`local_id` はプロジェクト全体で一意にします。

## 3. 生成とテンプレート

どの操作が plan / result を生成するか、`mode` / `approach` に応じたテンプレートの選び方を示します。

### 3.1. 生成ルール

| 操作                            | plan             | result                                    | 状態event                                 |
| ------------------------------- | ---------------- | ----------------------------------------- | ----------------------------------------- |
| `exec plan --task`              | 生成する         | 生成しない                                | 変更しない                                |
| `exec plan --deliverable`       | 生成する         | 生成しない                                | 変更しない                                |
| `exec claim`                    | 生成しない       | scaffold 生成する                         | `claim` を記録する                        |
| `exec run --task`               | なければ生成する | scaffold 生成し、終了コードで status 更新 | 変更しない                                |
| `exec run --task --track-state` | なければ生成する | scaffold 生成し、終了コードで status 更新 | `claim` / `complete` / `block` を記録する |
| `exec reopen`                   | 変更しない       | 変更しない                                | `reopen` を記録する                       |
| `exec run --plan`               | 既存 plan を使う | plan 名から導出する                       | 変更しない                                |
| `exec refresh`                  | 生成しない       | 生成しない                                | 変更しない                                |

`exec refresh` は state、Ready、CPM などの `generated/` 更新に専念し、plan は生成・削除しません。agent タスクの plan は `exec plan` / `exec run` でオンデマンド生成します。`execution: human` のタスクは plan を持たず、`exec claim` が生成する result を使います。

### 3.2. planテンプレート

plan は `mode` / `approach` に応じたテンプレートから生成します。
plan の構造と生成規則は schema・本ガイド・各テンプレートを正本とするため、生成する Frontmatter の `rulebook` は `none` とします。
これらは `docs/ja/specdojo/exec-templates/` に置く実行基盤の内部テンプレートであり、`docs/ja/specdojo/templates/` に置く成果物テンプレートとは別に管理します。

| 条件                  | 代表テンプレート             |
| --------------------- | ---------------------------- |
| `mode: edit`          | `xep-template.md`            |
| `mode: review`        | `xrp-template.md`            |
| `approach` が指定済み | `xep-<approach>-template.md` |

共通規約は `xp-common-conventions-template.md`（edit / review 共通）と、`mode` に対応する `xep-common-conventions-template.md`（edit 専用）または `xrp-common-conventions-template.md`（review 専用）を組み合わせます。接頭辞の `x` は exec、`p` は plan、`e` / `r` は edit / review を表します。各ファイルの `plan-essentials` マーカー間を plan の `_COMMON_CONVENTIONS_` 位置へ順に展開し、規約の詳細を読む案内には両ファイルのパスを載せます。マーカーのないローカル断片は全文を展開します。grade の plan はこれらの規約を使いません。

保存する plan では、展開済みの共通規約を `[共通規約 sha256:<内容のハッシュ>](<plan からの相対パス>)` に置き換えます。規約本体は `<execution_path>/conventions/<SHA-256>.txt` に版ごとに一度だけ保存し、整形で内容が変わらないようプレーンテキストで保持します。版は mode・schema の解決後の本文（末尾の改行を含む）から計算します。規約本文の資源への参照はリポジトリ相対とし、別 checkout の同梱資源は package 内の相対パスにするため、端末の絶対パスで版が変わりません。agent と reporter へ渡す前に保存した版を復元するため、テンプレートの更新後や再開時も当時の規約が届きます。`exec run --plan` と `agent run --plan` も同じ読み取りを使います。参照先が欠けている場合やハッシュが一致しない場合は、版とパスを示すエラーで停止します。規約を埋め込んだ既存 plan はそのまま読めます。plan を別の場所で使うときは、規約ファイルも引き継ぎ、相対参照を維持してください。

`execution: human` のタスクに `exec plan` を実行するとエラーになります。human の確定手順は [Human Finalize 実行レシピ](../recipes/exec-human-finalize-recipe.md)、共通規約は [Human Finalize 実行標準](../standards/exec-human-finalize-standard.md)を正本とし、human result から参照します。

`approach` が指定されていれば `xep-fully-guided-template.md`、`xep-condense-template.md`、`xep-recipe-guided-template.md`、`xep-freeform-template.md`、`xep-retrofit-template.md`、`xep-rulebook-maintenance-template.md` のような approach 別テンプレートを優先します。該当テンプレートが存在しない場合は標準テンプレートにフォールバックします。

register のカタログなしの成果物 plan は、個票の `target_path`・`target_rulebook` または既存文書の索引と frontmatter から対象を解決します。カタログの `done_criteria` がないことを明記し、個票の完了条件と rulebook を使います。`bootstrap` は未作成 kata の ID・パスと参照宣言の指示、`finalize`・`bootstrap-finalize` は既存成果物の確認チェック表と確定対象を plan に載せます。実 agent は `status: ready` への昇格を行いません。対象と起票の条件は [[specdojo:command-reference]] を参照してください。

`approach: retrofit` では、対象成果物の DCT エントリに宣言された `evidence_refs` を edit / review plan の「実装エビデンス」へ展開します。カタログ経由で `evidence_refs` がない場合は plan 生成をエラーにします。カタログなしでは実装の調査パスを個票に明記して調査入力とします。実装エビデンスは調査入力であり、frontmatter の `targets` には追加しません。実行者は実際に参照したパス、抽出した現在動作、成果物との一致・乖離、未確認範囲を result に記録します。

`draft`・`fully-guided`・`recipe-guided` の edit plan にも `evidence_refs` を読み取り専用で展開します。未指定・カタログなしでは「なし」と示し、生成を拒否しません。これらの plan の `depends_on` は、既存文書を wikilink、未作成文書をインラインコードと「未作成」で表示します。未作成の依存の内容は推測せず _TODO_ / _ASSUMPTION_ として残し、存在しないことだけを理由に実行を止めません。`condense` など他 approach と review の plan は従来のままです。

実践の型の扱いは [実践の進め方ガイド](ryu-guide.md) を参照します。

### condense の記録

`condense` は既存の 1 文書を対象とする edit で、標準フローでは磨き込みの後・review の前に置きます。plan は `xep-condense-template.md`、result は `xer-condense-template.md` を使います。判定基準は [[specdojo:pm-review-viewpoints]] の `vp-arc-conciseness` とし、判断に要る背景・制約・例外・完了条件と意味を維持します。

result の `specdojo.condense_records` は修正・保持の記録のリストです。候補がなければ `[]` とし、変更不要の理由を本文へ書きます。各要素は次の 5 項目を持ち、本文の「修正・保持の記録」の表と 1 対 1 に対応します。

| 項目       | 内容                                                                                                                                                            |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `location` | 修正前の成果物の見出し・行・引用                                                                                                                                |
| `category` | `repetition`（繰り返し）、`table-prose`（表と本文）、`figure-prose`（図をなぞる文）、`unneeded-background`（不要な背景）、`canonical-restatement`（正本の再掲） |
| `action`   | `delete`（削る）、`merge`（まとめる）、`reference`（参照）、`retain`（残す）                                                                                    |
| `reason`   | 意味を保った根拠、または残した理由                                                                                                                              |
| `cause`    | `FindingCause`: `{"type":"document"}`、または `{"type":"kata","kind":"recipe","location":"根拠の箇所"}`。`kind` は rulebook / recipe / sample / template        |

Kata が原因とするのは、宣言された Kata の箇所を示せる場合だけです。schema は `condense-records.schema.yaml` から共通の `finding-cause.schema.yaml` を参照します。pipeline executor は最終 evidence に `condense_records` を出し、runner が検証済みの同じリストを frontmatter と表へ転記します。reporter の要約によって省略・変更しません。通常の識別項目は scaffold と照合し、`condense_records` は記録用の可変項目として検証します。完了・block などの状態更新後も記録を保持します。

Kata の手入れ plan は成果物ごとの最新の完了済み `condense` result から Kata が原因の記録を展開します。成果物が宣言する rulebook から辿れる対象 Kata と原因の種類が一致する記録に限り、grade 由来とは出どころを区別します。

### 3.3. resultテンプレート

result は実行記録です。agent では plan と対になり、human では作業指示も兼ねます。`claim` または `exec run` が scaffold 生成します。
result テンプレートも plan と同じ `docs/ja/specdojo/exec-templates/` 配下に置きます。

| 条件                                          | 代表テンプレート                           |
| --------------------------------------------- | ------------------------------------------ |
| `mode: edit`                                  | `xer-template.md`                          |
| `mode: review`                                | `xrr-template.md`                          |
| `mode: edit` + `approach: finalize`           | `xer-human-finalize-template.md`           |
| `mode: edit` + `approach: bootstrap-finalize` | `xer-human-bootstrap-finalize-template.md` |

result の `status` は、個々の実行試行がどの状態にあるかを表します。

| status        | 意味                                                  | 対応要否                                 |
| ------------- | ----------------------------------------------------- | ---------------------------------------- |
| `in_progress` | scaffold が作成され、実行中の試行                     | 実行終了を待つ                           |
| `complete`    | 正常終了し、完了記録になった試行                      | なし                                     |
| `blocked`     | 障害や未充足条件によって停止した試行                  | 理由を解消して再開または再実行する       |
| `superseded`  | 後続の新しい run に置き換えられ、破棄された先行の試行 | なし。履歴として保持し、再開対象にしない |

runner は一意名の新しい result を scaffold するとき、同じ `task_id` を持つ先行 result のうち `in_progress` または `blocked` のものを `superseded` へ更新します。`completed_at` には後続 run の開始時刻を記録し、先行 result の `block_reason` は除去します。`complete` の result は完了記録として変更しません。同じ run を続ける `exec resume` は新しい result を作らないため、この遷移の対象外です。

`exec status` が表示・集計する Schedule の `doing` / `blocked` などは event log から導出するタスク状態であり、result の status とは別です。このため、履歴上の `superseded` result が実行中件数や対応待ちの blocked 件数へ加算されることはありません。

review plan には、catalog の `done_criteria` と review 前段で得た grade の評価結果を焼き込みます。review result は観点を再評価する欄を持たず、`評価結果の確認`、`判断根拠`、`未充足事項・改善指示`、`approach` に応じた確認、6値の `verdict` を記録します。`finalize` / `bootstrap-finalize` の result には、`done_criteria` の確認チェックリスト（roles / viewpoint 注記付き）と確定対象（`status` を `ready` へ昇格する対象）のチェックリストを焼き込みます。human result は `execution: human` と `targets` を持ち、`plan_ref` を持ちません。確定手順・確認対象・確認記録・確定判断を result 側へ一元化し、恒久記録として残します。

既に result が存在する場合は上書きせず、既存ファイルを使います。エージェントや人は result に実行内容、検証結果、残課題を記録します。

agent の終了コードが 0 でも、result 本文の必須プレースホルダが残っている場合は runner が block として扱います。runner は agent 起動前の scaffold も保持し、終了時の `specdojo` frontmatter について必須項目が非空であることと、キー・値が scaffold と一致することを確認します。frontmatter の欠落、改名、値の改変、独自項目への置換がある場合も block とし、commit・merge・complete へ進めません。YAML の引用符やキー順など、パース後の値を変えない表記上の変更は一致として扱います。

worktree を再利用する `exec resume` では、再開直前の worktree result をその試行の厳密な比較基準にします。rate-limit 後に runner が付けた `status: blocked`、`completed_at`、`block_reason` は元 scaffold との差分として許容しますが、元 scaffold との不変項目の照合も継続します。このため、正常な lifecycle 遷移は frontmatter 改変と誤判定せず、前回試行から持ち越された識別情報や固定値の破壊は再開後も block します。

## 4. アーカイブと再実行

完了済み plan の扱いと、完了済み task をやり直すときの手順を示します。

### 4.1. アーカイブ

`exec archive` は完了した plan を同じ run ディレクトリに保持します。`exec complete`、`exec run --track-state` の成功時、`--archive-on-success` でも保存先は変わりません。

```bash
specdojo exec archive --project <project-id> --task <task-id>
```

不要な plan は `--delete` で削除できます。result は実行記録として残ります。

### 4.2. 再実行

完了済み task をやり直す場合は、新しい run の plan / result を生成してカレントリポジトリで実行します。

```bash
specdojo exec run --project <project-id> --task <task-id>
```

状態イベントは追加されません。完了判定を取り消して Schedule の進捗へ再度反映したい場合は、`reopen`、`claim`、`run`、`complete` を明示的に実行します。

```bash
specdojo exec reopen --project <project-id> --task <task-id> --by <human-actor> --msg "completion criteria unmet"
specdojo exec refresh --project <project-id>
specdojo exec claim --project <project-id> --task <task-id> --by <actor> --msg "rerun"
specdojo exec run --project <project-id> --task <task-id>
specdojo exec complete --project <project-id> --task <task-id> --by <actor> --msg "rerun done"
```

`reopen` は過去 run の plan / result を変更しません。次の `exec plan` / `exec run` は新しい run を作り、過去の完了状態は保存した記録と `complete` / `reopen` event で追跡します。同じ run の続きは `exec resume` で再開します。
