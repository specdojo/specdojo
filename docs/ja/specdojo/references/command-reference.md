---
specdojo:
  id: specdojo:command-reference
  type: reference
  status: draft
  supersedes:
    - command-reference-guide
---

# CLIコマンドリファレンス

CLI Command Reference

`specdojo` CLI の主要コマンドを、用途、代表例、主要オプションに絞って説明します。背景や運用手順は各専門ガイドを参照します。

**対象範囲**

- `specdojo` CLI の主要コマンド（config / catalog / deliverable / schedule / register / exec / agent / grade / index / watch / build / routine）

**ここで引けるもの**

- コマンドごとの用途と実行例、全体で共通のオプション、コマンド別の主要オプション

**詳細の参照先**

- CLI 全体の流れは [遂行の技活用ガイド](../guides/waza-guide.md)、運用上の判断と手順は各コマンド節からリンクした専門ガイドを参照してください。

## 1. 共通オプション

| オプション        | 用途                                               | 主な対象                            |
| ----------------- | -------------------------------------------------- | ----------------------------------- |
| `--project <id>`  | 対象 project を明示する                            | project に紐づくコマンド            |
| `--dry-run`       | 書き込みや実行を行わず予定内容を表示する           | scaffold / build / run / worktree   |
| `--force`         | 既存ファイルの上書きや通常拒否される操作を明示する | scaffold / schedule build / release |
| `--scope <scope>` | build / watch の対象範囲を絞る                     | `build` / `watch`                   |

project の解決順序と設定は [遂行の技活用ガイド](../guides/waza-guide.md) を参照します。

## 2. config / project

| コマンド          | 用途                                       | 例                                          |
| ----------------- | ------------------------------------------ | ------------------------------------------- |
| `config init`     | `specdojo.config.json` を作成する          | `specdojo config init`                      |
| `config scaffold` | provider の agent・settings 設定を配置する | `specdojo config scaffold --provider codex` |
| `project list`    | 登録済み project を表示する                | `specdojo project list`                     |

`config init` は、register 単体で始められる `prj-0001` の最小設定を作成し、設定確認、任意の
provider 設定、登録簿作成の順に次のコマンドを案内します。`config scaffold` の `--provider` には
`claude`、`codex`、`copilot`、`opencode` を指定でき、`--dry-run` と `--force` も利用できます。

`current_project` を設定しておくと、多くのコマンドで `--project` を省略できます。

## 3. catalog / deliverable

`catalog` は成果物カタログ（`dct-*.yaml`）を扱います。

| コマンド           | 用途                                     | 例                                             |
| ------------------ | ---------------------------------------- | ---------------------------------------------- |
| `catalog scaffold` | テンプレートから `dct-*.yaml` を生成する | `specdojo catalog scaffold --project prj-0001` |
| `catalog where`    | catalog 関連パスを表示する               | `specdojo catalog where --project prj-0001`    |
| `catalog validate` | `dct-*.yaml` を検証する                  | `specdojo catalog validate --project prj-0001` |
| `catalog build`    | `generated/dct-*.md` を生成する          | `specdojo catalog build --project prj-0001`    |

`deliverable` はカタログが指す、人が編集する成果物ファイル本体を扱います。

| コマンド               | 用途                                                                    | 例                                                                                 |
| ---------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `deliverable scaffold` | `dct-*.yaml` が指す成果物ファイル本体を生成する                         | `specdojo deliverable scaffold --project prj-0001`                                 |
| `deliverable trash`    | 非推奨化した成果物ファイルを `trash` ディレクトリへ移動する（idは不変） | `specdojo deliverable trash --project prj-0001 --local-id cdfd-register-operation` |

主要オプション:

| オプション           | 用途                                                                      |
| -------------------- | ------------------------------------------------------------------------- |
| `--size <size>`      | `small` / `medium` / `large` の成果物セットを選ぶ                         |
| `--project-id <id>`  | 生成ファイルに埋め込む project ID を上書きする                            |
| `--domain <domain>`  | `catalog scaffold` の対象をtemplateの`domain`で絞る（反復・カンマ区切り） |
| `--var <NAME=value>` | `catalog scaffold` で`_NAME_` placeholderを置換する（反復可能）           |
| `--plan`             | 保存済みの `dct-plan-<domain>.yaml` から決定論的に生成する                |
| `--dry-run`          | `--plan` の生成結果と既存ファイルとの差分を、書き込まずに表示する         |
| `--dct <name>`       | `deliverable scaffold` の対象を特定の `dct-*.yaml` に絞る（後述）         |
| `--force`            | 既存ファイルを上書きする                                                  |

`catalog scaffold`は、`--domain`を省略すると従来どおりすべてのDCT templateを対象にします。指定した場合は、ファイル名ではなくtemplate内の`domain`が一致するものだけを生成します。存在しないdomainを指定した場合は、部分的な生成を行わずエラーで終了します。

`--var`はtemplate内の文字列に含まれる`_NAME_`を置換します。`local_id`、`path`、`depends_on`、名称、概要、注記も同じ値で展開されます。`PROJECT_ID`は予約済みであり、project IDの上書きには`--project-id`を使用します。変数指定後もplaceholderが残る成果物は従来どおり生成対象から除外し、除外した`local_id`を警告します。

```bash
specdojo catalog scaffold \
  --project prj-0001 \
  --size large \
  --domain data-flow,data-model \
  --domain business-model \
  --var TERM=specdojo \
  --var DOMAIN=specdojo
```

`--dct <name>` で対象を特定の `dct-*.yaml` に絞れます。`name` は `dct-` プレフィックスや `.yaml` の有無を問わず、ドメイン名（例: `project-definition`）でも一致します。カンマ区切りまたは複数回指定で複数のカタログを対象にできます。指定名に一致する `dct-*.yaml` がない場合はエラーで終了します。

`deliverable scaffold` が使用する template は、各成果物の `rulebook` を辿り、rulebook frontmatter の `template` 文書 ID から解決します。同じ rulebook を参照する成果物は template を共有できます。`template: not-needed`、`template: undecided`、項目省略では template を使用せず、最小雛形を生成します。`local_id` と同名の template を暗黙には探索しません。

```bash
specdojo deliverable scaffold --project prj-0001 --dct project-definition
specdojo deliverable scaffold --project prj-0001 --dct dct-project-definition.yaml,dct-project-management.yaml
```

`deliverable scaffold` の生成方針と `specdojo build` に含めない理由は [遂行の技活用ガイド](../guides/waza-guide.md) の `deliverable scaffold の生成方針`、生成系動詞の使い分けは同ガイドの `生成系動詞の標準`、成果物カタログから Schedule への展開は [Schedule設計ガイド](../guides/schedule-design-guide.md) の `成果物カタログとの責務分担` を参照します。

### 3.1. catalog plan（成果物インスタンスの判定）

`catalog plan` は、data-flow 等の上流成果物からどの成果物インスタンスが必要かを agent が判定した結果（`dct-plan-<domain>.yaml`）を扱います。判定結果はカタログディレクトリ配下の `plans/` に保存し、後続の決定論的ジェネレーターの入力にします。

| コマンド                | 用途                                                          | 例                                                                     |
| ----------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `catalog plan prompt`   | agent へ渡す判定指示（入力文書・出力規約）を出力する          | `specdojo catalog plan prompt --project prj-0001 --domain data-flow`   |
| `catalog plan scaffold` | 判定計画の骨組みを作る、または agent の判定結果を検証保存する | `specdojo catalog plan scaffold --project prj-0001 --domain data-flow` |
| `catalog plan validate` | 保存済みの `dct-plan-*.yaml` を検証する                       | `specdojo catalog plan validate --project prj-0001`                    |

主要オプション:

| オプション          | 用途                                                       |
| ------------------- | ---------------------------------------------------------- |
| `--domain <domain>` | 対象ドメインを指定する（`prompt` / `scaffold` は必須）     |
| `--input <path>`    | data-flow 以外の上流成果物を入力として明示する（反復可能） |
| `--from <path>`     | agent が出力した判定計画を検証して正準パスへ保存する       |
| `--out <path>`      | `catalog plan prompt` の出力をファイルへ書き出す           |
| `--dry-run`         | 書き込まずに差分を表示する                                 |
| `--force`           | 既存の判定計画を上書きする                                 |

運用手順は次のとおりです。

```bash
specdojo catalog plan prompt --project prj-0001 --domain data-flow --out logs/dct-plan-prompt.md
# 上記の指示で agent に判定させ、出力 YAML を保存先候補へ書き出す
specdojo catalog plan scaffold --project prj-0001 --domain data-flow --from <agent-output>.yaml
specdojo catalog plan validate --project prj-0001 --domain data-flow
specdojo catalog scaffold --project prj-0001 --domain data-flow --plan --dry-run
specdojo catalog scaffold --project prj-0001 --domain data-flow --plan
```

`catalog plan scaffold` は、`--from` を省略すると入力文書と未確定事項だけを埋めた骨組みを作ります。既存の判定計画がある場合は上書きせず、差分を表示して終了します。上書きは `--force` で明示します。

判定に使う data-flow 成果物が 1 件も無いドメインでは、`--input` で上流成果物を明示しない限りエラーで終了します。`trash/` へ移動した非推奨成果物は入力に含めません。既に `dct-<domain>.yaml` があるドメインでは、既存カタログを基準線として入力に記録し、差分レビューを促す警告を出します。

検証では、スキーマ適合に加えて、template との対応、placeholder の解決、パターンA / パターンBの整合、`local_id` の重複、`depends_on` の解決を確認します。未解決の placeholder や根拠の無い判断はエラーになり、`open_questions` へ移すよう促されます。スキーマ単体で検証する場合は次を実行します。

`catalog scaffold --plan` は判定済み plan と同じ `domain` の template をすべて読み、通常の scaffold と同じ `min_size`・placeholder・`part_of`・group・base path 規則で `dct-<domain>.yaml` を生成します。物理分割 template は `dct-<domain>-<part>.yaml` のまま生成します。検証エラーや既存ファイル競合が一件でもあれば、その domain のファイルは一件も書き込みません。既存内容を変更する場合は、`--dry-run` の差分を確認してから `--force` を指定します。

```bash
npm run validate:schema:file -- \
  --schema docs/specdojo/schemas/v1/dct-plan.schema.yaml \
  --data "docs/ja/**/plans/dct-plan-*.yaml" --allow-empty
```

## 4. schedule

`schedule` は `sch-strategy-<track>.yaml` から `sch-track-<track>.yaml` を生成します。

| コマンド         | 用途                                    | 例                                                                  |
| ---------------- | --------------------------------------- | ------------------------------------------------------------------- |
| `schedule build` | strategy から track schedule を生成する | `specdojo schedule build --project prj-0001 --track launch --force` |
| `schedule where` | schedule 関連パスを表示する             | `specdojo schedule where --project prj-0001`                        |

主要オプション:

| オプション        | 用途                                         |
| ----------------- | -------------------------------------------- |
| `--track <track>` | 生成対象 track を指定する                    |
| `--force`         | 既存の `sch-track-<track>.yaml` を上書きする |
| `--dry-run`       | 生成予定を確認する                           |

`--track` で指定した `sch-track-<track>.yaml` だけを生成・上書きします。プロジェクト共通の `sch-milestones.yaml` は、同じ `schedule_path` にある全 `sch-strategy-*.yaml` から再構築するため、指定外 track のマイルストーンも保持されます。既存 ID の表示順は維持し、新規 ID は末尾へ追加します。全 strategy のいずれかが不正、project ID が不一致、またはマイルストーン ID が重複している場合は、生成物を書き込まずに停止します。

Schedule設計の詳細は [Schedule設計ガイド](../guides/schedule-design-guide.md) を参照します。

### 4.1. schedule strategy（決定論的な strategy 生成）

`schedule strategy generate` は、DCT、Timeline、strategy の `approach_rules`、Kata の保存済み grade、標準 strategy profile から `sch-strategy-<track>.yaml` を生成します。先に strategy へ scope と成果物別 intent を宣言してください。

```bash
specdojo schedule strategy generate \
  --project prj-0001 \
  --track data-model \
  --default-owner ARC \
  --gate-owner PM \
  --milestone-owner PM \
  --dry-run
specdojo schedule strategy generate \
  --project prj-0001 \
  --track data-model \
  --default-owner ARC \
  --gate-owner PM \
  --milestone-owner PM
```

主要オプション:

| オプション                 | 用途                                                               |
| -------------------------- | ------------------------------------------------------------------ |
| `--owner <local_id=ROLE>`  | 一成果物の主担当を明示する（反復可能）                             |
| `--default-owner <ROLE>`   | 既存 strategy から解決できない成果物の既定主担当                   |
| `--gate-owner <ROLE>`      | 生成する phase gate の owner                                       |
| `--milestone-owner <ROLE>` | 生成する group milestone の owner                                  |
| `--pass-owner <ROLE>`      | owner が複数にまたがる横断 pass の主担当                           |
| `--no-bootstrap-ordering`  | 非 bootstrap 成果物を代表 bootstrap の後へ置く既定動作を無効にする |
| `--dry-run` / `--force`    | 差分だけを表示する / 確認済みの差分で既存 strategy を上書きする    |

主担当の解決順は `--owner`、既存 strategy の `owner_rules`、`--default-owner` です。DCT の `done_criteria.roles` はレビュー担当であり、主担当として複製しません。主担当、gate / milestone / pass owner を決定できない場合、または `pm-roles.yaml` に存在しない場合は推測せず停止します。

書き込み前に intent の網羅・重複、追加パラメータ、都度収集した facts、必要な grade、scope で選択した全 `kind: work` の網羅、`scope.catalogs[].local_ids` の実在、strategy schema、project ID、参照、milestone ID 重複、`schedule build --dry-run` 相当を検証します。catalog の `local_ids` を省略した場合は従来どおり対象 kind の全成果物、指定した場合はその部分集合だけを生成します。不足時は暫定値で進めず停止します。既存 strategy は `--force` なしで保護し、同一内容の再生成は `Unchanged` として書き込みません。生成後は `schedule build --track <track> --force`、`exec refresh` の順に既存コマンドを実行します。

## 5. timeline

`timeline` は、人間が着手前に決めた `tml-index.yaml`（トラック順序計画）から、着手順序と成果物カタログ作成の準備情報を生成します。`tml-index.yaml` が正本で、生成物は `timeline/generated/` へ出力する一方通行の流れです。

| コマンド         | 用途                                                    | 例                                           |
| ---------------- | ------------------------------------------------------- | -------------------------------------------- |
| `timeline build` | `tml-index.yaml` から着手順序と scaffold 対象を生成する | `specdojo timeline build --project prj-0001` |
| `timeline where` | timeline 関連パスを表示する                             | `specdojo timeline where --project prj-0001` |

主要オプション:

| オプション  | 用途                                     |
| ----------- | ---------------------------------------- |
| `--dry-run` | 生成内容を標準出力へ表示し、書き込まない |

生成物は次の3つです。

| ファイル              | 内容                                                                     |
| --------------------- | ------------------------------------------------------------------------ |
| `timeline-order.md`   | `order` / `parallel_group` / `depends_on` から算出した着手 wave 一覧     |
| `catalog-scaffold.md` | `dct-<domain>.yaml` が未作成のドメインと `catalog scaffold` 実行コマンド |
| `timeline.json`       | 後続コマンドが読む機械可読サマリー                                       |

`depends_on` の未定義参照・循環、`depends_on` と `order` の矛盾、track id の重複を検出した場合は、生成物を書き込まずに終了コード 1 で停止します。`catalog_status` と実カタログの有無が食い違う場合は警告のみを出します。カタログの突き合わせはファイル名ではなく各 `dct-*.yaml` の `domain` 値で行うため、1 ドメインが複数ファイルに分割されていても検出できます。

`timeline_path` は未設定の場合、プロジェクト直下の `timeline` を既定とします。記述ルールは [タイムライン作成ルール](../rulebooks/tml-rulebook.md)、生成フローと運用タイミングは [Timeline設計ガイド](../guides/timeline-design-guide.md)、トラックの標準構成と実行順序は [トラック設計ガイド](../guides/track-design-guide.md) を参照します。

## 6. register

`register` は個票を正本とするプロジェクト登録簿と、その生成ビューを扱います。

| コマンド            | 用途                                           | 例                                                                          |
| ------------------- | ---------------------------------------------- | --------------------------------------------------------------------------- |
| `register scaffold` | 登録簿ディレクトリと生成ビューを初期化する     | `specdojo register scaffold --project prj-0001`                             |
| `register add`      | issue / todo / question などの項目を追加する   | `specdojo register add --project prj-0001 --type issue --title "確認事項"`  |
| `register build`    | 個票から登録項目一覧と派生ビューを生成する     | `specdojo register build --project prj-0001`                                |
| `register update`   | 登録項目を更新する                             | `specdojo register update --project prj-0001 --id PJR-001 --owner PM`       |
| `register start`    | 項目を対応中へ変更する                         | `specdojo register start --project prj-0001 --id PJR-001`                   |
| `register wait`     | 項目を待ち状態へ変更する                       | `specdojo register wait --project prj-0001 --id PJR-001`                    |
| `register review`   | 項目をレビュー状態へ変更する                   | `specdojo register review --project prj-0001 --id PJR-001`                  |
| `register close`    | 項目を完了にし、個票を `ready` へ昇格する      | `specdojo register close --project prj-0001 --id PJR-001`                   |
| `register reject`   | 項目を却下にし、個票を `deprecated` にする     | `specdojo register reject --project prj-0001 --id PJR-001`                  |
| `register defer`    | 項目を延期にする                               | `specdojo register defer --project prj-0001 --id PJR-001`                   |
| `register reopen`   | 終了済み項目を再オープンする                   | `specdojo register reopen --project prj-0001 --id PJR-001`                  |
| `register renumber` | 重複・衝突した PJR-ID を未使用の ID へ移す     | `specdojo register renumber --project prj-0001 --id PJR-0137 --to PJR-0140` |
| `register history`  | 追記型 event と旧 Git 履歴から変更を再構成する | `specdojo register history --project prj-0001 --since 2026-08-01`           |
| `register migrate`  | 旧形式の登録簿データを現行形式へ移行する       | `specdojo register migrate --project prj-0001 --dry-run`                    |

`register add` は ID を省略すると自動採番し、現在の作業ツリーに type 別の個票を作成します。ID は乱数部分を持ち、曖昧文字（`I` / `L` / `O` / `U`）を除いた英大文字+数字の 32 文字セットによる 4 桁（例: `PJR-4B7K`）です。個票 Frontmatter が分類、処理状態、優先度、担当、日付、結論の正本であり、`register build` は個票から一覧と派生ビューを生成します。`register` 系コマンドはすべて、成功時の通常出力を標準出力へ、エラーメッセージを標準エラー出力へ書きます。

主要オプション:

| オプション                | 用途                                                          | 対象                                      |
| ------------------------- | ------------------------------------------------------------- | ----------------------------------------- |
| `--to <PJR-ID>`           | 移動先の PJR-ID を指定する                                    | `renumber`                                |
| `--registered <datetime>` | 起票日時（タイムゾーン付き RFC 3339）。省略時は実行時刻       | `add`                                     |
| `--completed <datetime>`  | 完了・却下日時（タイムゾーン付き RFC 3339）。省略時は実行時刻 | `close` / `reject`                        |
| `--by <actor>`            | 追記型 event に記録する actor を指定                          | `add` / 更新 / 遷移コマンド               |
| `--reason <text>`         | event の理由を記録（`wait` では `block_reason` も更新）       | `add` / 更新 / 遷移コマンド               |
| `--conclusion <text>`     | 終端時の結論を記録・更新（`update` では `-` で削除）          | `add` / `update` / 終端コマンド           |
| `--topic <slug>`          | 個票ファイル名と文書 ID の論点部分を指定・更新する            | `add` / `update`                          |
| `--dry-run`               | 書き込みを行わず変更対象を表示する                            | `renumber` / `add` / `update` / `migrate` |
| `--since <date>`          | 対象コミットの開始日（`YYYY-MM-DD`、当日を含む）              | `history`                                 |
| `--until <date>`          | 対象コミットの終了日（`YYYY-MM-DD`、当日を含む）              | `history`                                 |
| `--id <PJR-ID...>`        | 出力する項目を限定する（空白・カンマ区切りで複数可）          | `history`                                 |
| `--status-only`           | 追加・削除・状態遷移だけを出力する                            | `history`                                 |
| `--limit <count>`         | 走査するコミット数の上限                                      | `history`                                 |
| `--json`                  | イベントを JSON で出力する                                    | `history`                                 |

`register add` は個票 Frontmatter の `registered_at`（起票日時）を、`register close` / `register reject` は `completed_at`（完了・却下日時）を自動記入します。値は UTC の RFC 3339・秒精度（例: `2026-08-09T14:08:51Z`）で、OS / コンテナの `TZ` 環境変数には依存しません。`register reopen` は `completed_at` を削除します。

`--registered` / `--completed` にはタイムゾーン付きの RFC 3339 値（`2026-08-09T14:08:51Z` または `2026-08-09T23:08:51+09:00`）を指定し、保存時に UTC へ正規化します。タイムゾーンを含まない値は解釈が実行環境に依存するため受け付けません。期限（`--due`）は瞬間ではなく暦日のため `YYYY-MM-DD` のままです。

`register update --topic <slug>` は個票のファイル名と Frontmatter の文書 ID を同時に変更し、`docs/ja` 配下の旧文書 ID 参照を更新してから生成ビューを再生成します。変更は `action: update` の event に文書 ID の変更として記録されます。形式は英小文字・数字・単一ハイフン区切りに限り、変更先ファイルが存在する場合は書き込み前に停止します。

一覧・派生ビューの「登録日」「完了日」は、保存した日時を config の `run.register_date_timezone`（IANA タイムゾーン名、既定 `UTC`）へ変換して導出する表示値です。

`register migrate` は旧形式の登録簿データを現行形式へ移す一度限りの移行コマンドです。追跡対象だった `pjr-index.md` の表を個票 Frontmatter へ移し、旧日時を UTC へ変換し、個票内の `register_events` を `events/pjr-XXXX.yaml` へ分離します。イベントがまだない項目は、利用可能な Git 履歴を項目別イベントファイルへ変換します。event ID は commit・項目 ID・変更内容から決定的に生成するため、再実行で重複しません。

`register history` は `events/pjr-XXXX.yaml` を読み、個票単位の追加（`added`）と変更（`updated`）を発生順に出力します。event 導入前または未移行の期間だけ Git 履歴を読み、削除（`removed`）を含む従来の履歴と統合します。event は発生日時・actor・action・reason・遷移前後状態・変更フィールドを保持するため、複数遷移を1コミットへまとめても粒度を失いません。比較対象は登録項目一覧の列と `block_reason` です。

各書き込みコマンドは現在値を個票へ、event を項目別イベントファイルへ反映します。同じ現在値になる操作の再実行では event を追加しません。`register build` は個票とイベントファイルの対応、event の schema、ID 一意性、時刻順、直前イベント参照、状態連鎖、最新 event と現在値の一致を検証します。

登録項目を agent に実行させるには `exec run --register` を使います（`exec` の章を参照）。

`renumber` による ID 重複の復旧手順、登録の判断、type の選び方、状態遷移、個票の作成などの台帳運用は [登録簿運用ガイド](../guides/register-operation-guide.md) を参照します。

## 7. exec

`exec` は schedule に基づいたタスクの実行、状態追跡、plan/result 生成、worktree 隔離実行を扱います。

| コマンド         | 用途                                                                                                          | 例                                                                                                      |
| ---------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `exec where`     | execution 関連パスを表示する                                                                                  | `specdojo exec where --project prj-0001`                                                                |
| `exec validate`  | schedule と event を検証する                                                                                  | `specdojo exec validate --project prj-0001`                                                             |
| `exec refresh`   | state、Ready、CPM、gantt-chart を再計算する                                                                   | `specdojo exec refresh --project prj-0001`                                                              |
| `exec scheduler` | 次のタスクを自動選択して claim する（`--dry-run` で選択のみ）                                                 | `specdojo exec scheduler --project prj-0001 --by agent-1`                                               |
| `exec claim`     | タスクを `doing` にする                                                                                       | `specdojo exec claim --project prj-0001 --task <task-id> --by agent-1`                                  |
| `exec complete`  | タスクを `done` にする（actor の `doing` が1件なら `--task` 省略可）                                          | `specdojo exec complete --project prj-0001 --by agent-1`                                                |
| `exec reopen`    | 誤って完了したタスクを `done` から `todo` に戻す                                                              | `specdojo exec reopen --project prj-0001 --task <task-id> --by indie --msg "completion criteria unmet"` |
| `exec block`     | タスクを `blocked` にする                                                                                     | `specdojo exec block --project prj-0001 --task <task-id> --by agent-1 --msg "waiting"`                  |
| `exec unblock`   | `blocked` を `doing` に戻す                                                                                   | `specdojo exec unblock --project prj-0001 --task <task-id> --by agent-1 --msg "resume"`                 |
| `exec release`   | `doing` / `blocked` を `todo` に戻す                                                                          | `specdojo exec release --project prj-0001 --task <task-id> --by agent-1`                                |
| `exec cancel`    | `todo` を `cancelled` にする                                                                                  | `specdojo exec cancel --project prj-0001 --task <task-id> --by agent-1 --msg "scope removed"`           |
| `exec note`      | メモイベントを残す                                                                                            | `specdojo exec note --project prj-0001 --task <task-id> --by agent-1 --msg "memo"`                      |
| `exec link`      | 外部参照イベントを残す                                                                                        | `specdojo exec link --project prj-0001 --task <task-id> --by agent-1 --ref pr=https://example.com/pr/1` |
| `exec estimate`  | 見積もりイベントを残す                                                                                        | `specdojo exec estimate --project prj-0001 --task <task-id> --by agent-1 --meta duration_days=1`        |
| `exec run`       | plan を生成してエージェントを実行する                                                                         | `specdojo exec run --project prj-0001 --task <task-id>`                                                 |
| `exec resume`    | `doing`、または due な利用制限延期 task を既存 worktree で再開する                                            | `specdojo exec resume --project prj-0001 --due`                                                         |
| `exec cycle`     | 延期 task 再開・doc-index 再構築・古い track の再生成・状態再計算・`--auto` loop を単一ロック内で順次実行する | `specdojo exec cycle --project prj-0001 --loop`                                                         |
| `exec trial`     | 同一planを複数agentで隔離試行し、比較・評価・採否を管理する                                                   | `specdojo exec trial run --project prj-0001 --plan <path> --agent agent-a agent-b`                      |
| `exec status`    | 実行状態を表示する                                                                                            | `specdojo exec status --project prj-0001 --state blocked`                                               |
| `exec scaffold`  | 共通レビュー観点を継承するプロジェクト差分を生成する                                                          | `specdojo exec scaffold --project prj-0001`                                                             |
| `exec plan`      | plan だけを生成する                                                                                           | `specdojo exec plan --project prj-0001 --task <task-id>`                                                |
| `exec archive`   | 完了済み plan を `done/` へ移動する                                                                           | `specdojo exec archive --project prj-0001 --task <task-id>`                                             |

`exec scaffold --project <project-id>` は、対象 project の `viewpoints_path` へ `extends: specdojo:pm-review-viewpoints` を持つ空の差分ファイルを生成します。共通正本は [[specdojo:pm-review-viewpoints|共通レビュー観点一覧]] であり、scaffold 時点の全量コピーは作りません。そのため、共通側の更新は次回の review plan 生成時に継承 project へ反映されます。既存ファイルは既定で保持し、`--force` の指定時だけ差分雛形で置き換えます。

プロジェクト差分の upsert、無効化、独自ロールの宣言規則は [[specdojo:review-guide|レビューガイド]] を参照してください。provider 設定の推奨入口は `config scaffold --provider <name>` です。従来の `exec scaffold --provider <name>` も互換入口として同じ設定一式を生成します。

状態イベントの `--msg` は、イベント種別によって必須・省略可が分かれます。

| コマンド                                               | `--msg` | 省略時に記録される固定メッセージ                                                  |
| ------------------------------------------------------ | ------- | --------------------------------------------------------------------------------- |
| `claim` / `complete` / `release` / `link` / `estimate` | 省略可  | `claim task` / `complete task` / `release task` / `link refs` / `update estimate` |
| `note` / `block` / `unblock` / `reopen` / `cancel`     | 必須    | -（内容・理由・再開根拠をメッセージ自体が表すため）                               |

主要オプション:

| オプション                      | 用途                                                                                                   | 対象                                             |
| ------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------ |
| `--task <task-id>`              | 対象タスクを指定する                                                                                   | 状態遷移系 / `run` / `plan`                      |
| `--by <actor>`                  | 実行 actor / agent の nickname を指定する（手動ターゲットの agent 選択も兼ねる）                       | 状態遷移系 / `run` / `resume` / `worktree agent` |
| `--edit-by <nickname>`          | `--auto` バッチで edit タスクに使う agent nickname                                                     | `run --auto` / `resume`                          |
| `--review-by <nickname>`        | `--auto` バッチで review タスクに使う agent nickname                                                   | `run --auto` / `resume`                          |
| `--strategy <name>`             | 選択戦略を切り替える（`critical-first` 既定 / `fifo`）                                                 | `scheduler` / `run --auto`                       |
| `--auto` / `--loop`             | Ready タスクを自動選択する / Ready がなくなるまで繰り返す                                              | `run`                                            |
| `--parallel <n>`                | 同時に走らせる agent 数の上限を指定する                                                                | `run --auto` / `run --register --worktree`       |
| `--worktree`                    | worktree に隔離して実行する                                                                            | `run --task` / `run --register`                  |
| `--track-state`                 | claim / complete の状態イベントを記録する                                                              | `run --task`                                     |
| `--register <PJR-ID>`           | 登録簿の項目を実行する（空白・カンマ区切りで複数可。既定は in-place、`--worktree` で隔離）             | `run` / `plan`                                   |
| `--register-filter`             | 登録簿項目を type / priority / status / limit の条件で決定論的に選ぶ                                   | `run`                                            |
| `--register-commit`             | 成功したIDごとに、その実行で生じた変更を1コミットにまとめる（`--worktree` 時は常に commit のため無視） | `run --register`                                 |
| `--on-failure <stop\|continue>` | 途中失敗時に残りのIDを停止するか継続するか（既定は `stop`）                                            | `run --register`                                 |
| `--resume`                      | run が止まった段（executor / reporter / 統合）を既存 worktree と checkpoint で再開する                 | `run --register --worktree`                      |
| `--force-restart`               | 再開可能な run の成果があっても、worktree を破棄して項目全体を再実行する                               | `run --register --worktree`                      |
| `--executor-by <nickname>`      | executor/reporter パイプラインの executor 段に使う agent nickname                                      | `run --auto` / `resume` / `run --register`       |
| `--reporter-by <nickname>`      | executor/reporter パイプラインの reporter 段に使う agent nickname                                      | `run --auto` / `resume` / `run --register`       |
| `--due`                         | 再開時刻を迎えた利用制限延期 task を対象にする                                                         | `resume`                                         |

agent の指定は roster nickname（`pm-members.yaml`）へ一本化します。手動ターゲット（`--task` / `--register` など）では `--by <nickname>`、`--auto` バッチでは mode 別に `--edit-by` / `--review-by` を使い、バッチ起動は `--auto` に一本化します。解決の優先順位は「単体指定（`--by`）＞ mode 別指定（`--edit-by` / `--review-by`）＞ 自動選択」です。

Schedule タスクの `agent_pipeline`（`sch-strategy-<track>.yaml` の phase 設定）と同じ executor/reporter 2段階（`stage_role: executor` が成果物を編集・検証し、`stage_role: reporter` が evidence から result を描画する）は、`--register` でも `--executor-by <nickname>` と `--reporter-by <nickname>` を **両方セットで** 指定すると使えます。register 項目は Schedule のような per-item のパイプライン宣言を持たないため、owner・role からの自動選択は行わず、この2フラグの明示指定のみで切り替わります。片方だけの指定はエラーになります。

`exec scheduler` の claim 保護と選択戦略、`--auto --loop --parallel` の枠管理は [Schedule実行運用ガイド](../guides/schedule-operation-guide.md)、`exec reopen` の実行条件は [exec運用ガイド](../guides/exec-operation-guide.md) を参照します。

代表的な `exec run`:

```bash
# カレントリポジトリで単発実行する
specdojo exec run --project prj-0001 --task <task-id>

# claim/complete まで記録する
specdojo exec run --project prj-0001 --task <task-id> --by agent-1 --track-state

# worktree 隔離で単発実行する
specdojo exec run --project prj-0001 --task <task-id> --worktree

# Ready タスクを自動実行する
specdojo exec run --project prj-0001 --auto --parallel 5

# Ready がなくなるまで連続実行する
specdojo exec run --project prj-0001 --auto --loop --parallel 5

# 登録簿の項目を実行する（開始で in-progress、成功で review、失敗で waiting へ遷移）
specdojo exec run --project prj-0001 --register PJR-0012

# 複数の項目を指定順に直列実行し、成功IDごとにcommitする
specdojo exec run --project prj-0001 --register PJR-0012 PJR-0013 --register-commit

# 途中で失敗しても残りの項目を続行する（既定は失敗時に停止）
specdojo exec run --project prj-0001 --register PJR-0012,PJR-0013 --on-failure continue

# 登録簿を flat な条件で絞り込み、ID 昇順に実行する
specdojo exec run --project prj-0001 --register-filter --register-types todo --register-priorities high --register-statuses open --register-limit 3

# 成果物を worktree に隔離して実行し、統合ブランチへ merge back する
specdojo exec run --project prj-0001 --register PJR-0012 --worktree

# worktree 隔離のまま複数項目を並列実行する
specdojo exec run --project prj-0001 --register PJR-0012 PJR-0013 --worktree --parallel 2

# executor/reporter パイプラインで実行する（両フラグ必須）
specdojo exec run --project prj-0001 --register PJR-0012 --executor-by claude-expert-executor --reporter-by claude-reporter --worktree

# 途中で止まった項目を、止まった段（executor、reporter、または統合）から再開する
specdojo exec run --project prj-0001 --register PJR-0012 --worktree --resume

# Job Definitionから期間ごとのRunを生成して実行する
specdojo exec run --project prj-0001 --job job-weekly-report --input period=2026-W32
```

`--register` は指定した個票の項目を実行します。`--register-filter` は `--register-types` / `--register-priorities` / `--register-statuses` のカンマ区切り条件と、正の整数の `--register-limit` で項目を選びます。条件省略時は open かつ実行可能な type が対象です。いずれも実行対象になる type は `todo` / `issue` / `change-request` / `question` / `risk` で、`decision` / `note` は対象外です。既定は in-place の直列実行です。`--worktree` を付けると成果物の変更を worktree に隔離し、状態遷移（`start` / `review` / `waiting`）を直列化したうえで、成功時に merge back します。`--parallel <n>` は `--worktree` との併用時のみ指定でき、単独で指定するとエラーになります。

`--resume` は `--register --worktree` の pipeline 実行専用で、途中で止まった run を止まった段から再開します。対象 run は既存 worktree に残る最新の `pipeline-state.json` から特定し、再開段も state から決まります。executor が `running` のまま残っていれば、同じ plan/result と未コミット成果を保持した worktree 上で executor を再実行します。executor が成功済みで reporter が未完了なら、保存済みの `evidence.json` を使って reporter だけを再開します。親検証の記録が不足または失敗している場合は、現在の固定許可リストで親検証を更新してから reporter へ進みます。reporter も成功していて統合（commit → merge → worktree 撤去）だけが残っている場合は、agent を起動せずに統合段だけを再試行します。worktree や plan/result が無い、成功済み executor の evidence が欠損しているなど再開できない場合は、worktree を含め何も変更せずエラー終了します。再開可能な成果が残っている項目を `--resume` なしで再実行しようとした場合も、未統合の成果を守るために中断します。破棄して最初からやり直す場合は `--force-restart` を指定します。手順の使い分けは [exec運用ガイド](../guides/exec-operation-guide.md) を参照します。

`--by`（または owner 解決）を指定した場合は、従来どおり単一 agent が成果物編集と result 記入を1回の実行で完結します。`--executor-by` と `--reporter-by` を両方指定した場合は、`stage_role: executor` の agent が成果物を編集・検証し、その evidence（実行ログの要約・検証結果）を渡された `stage_role: reporter` の agent が result 本文を描画する2段階実行に切り替わります。`stage_role` が一致しない nickname を指定するとエラーになります。

register 実行の対応内容、状態追跡、commit の扱いは [登録簿運用ガイド](../guides/register-operation-guide.md)、実行フロー全体は [exec運用ガイド](../guides/exec-operation-guide.md) を参照します。

### 7.1. agent比較trial

`exec trial`は、同一タスクの既存planを複数agentへ同じ内容で渡し、agent名を含む独立worktreeとbranchで試行します。Schedule eventとregister状態は変更しません。

| サブコマンド | 用途                                                            |
| ------------ | --------------------------------------------------------------- |
| `run`        | 2つ以上のagentで試行し、客観指標を中央の比較記録へ集約する      |
| `status`     | plan/promptハッシュとagent別指標を表示する                      |
| `rate`       | 判断・文章・範囲遵守の人手評価（1〜5）と注記を記録する          |
| `adopt`      | 成功trialを現在branchへmergeし、残りのworktree/branchを破棄する |
| `discard`    | 成果を採用せず全worktree/branchを破棄し、比較記録だけを残す     |

```bash
specdojo exec trial run \
  --project prj-0001 \
  --plan docs/ja/projects/prj-0001/execution/exec/plans/<task>-plan.md \
  --base <commit-before-completed-work> \
  --agent agent-a agent-b \
  --reporter-by reporter-a \
  --parallel 2

# executorとreporterを組で比較する場合
specdojo exec trial run \
  --project prj-0001 \
  --plan docs/ja/projects/prj-0001/execution/exec/plans/<task>-plan.md \
  --base <commit-before-completed-work> \
  --pair executor-a=reporter-a executor-b=reporter-b

specdojo exec trial status --project prj-0001 --comparison <comparison-id>
specdojo exec trial rate --project prj-0001 --comparison <comparison-id> --trial agent-a --judgment-quality 4 --writing-quality 4 --scope-adherence 5
specdojo exec trial adopt --project prj-0001 --comparison <comparison-id> --trial agent-a
```

`run`はplan frontmatterの`task_id` / `mode` / `project_id`を要求します。`--base`はworktreeの起点となるcommit-ishで、省略時は従来どおりHEADです。指定値は完全なcommitへ解決され、実行開始時のHEAD（完了済み作業の参照結果）、baseがHEADの祖先か、plan内で参照されたリポジトリ相対パスが起点ツリーに存在するかという互換性確認とともに比較記録へ保存されます。plan自体が起点に存在しなくても、指定した現在のplan内容を全trialへ共通で渡します。

`--agent`と任意の`--reporter-by`を使うと、reporterなしまたは全trial共通reporterの従来方式になります。`--pair <executor>=<reporter>...`は2組以上を指定し、executorとreporterを一組として比較します。`--pair`は`--agent` / `--reporter-by`と併用できません。比較記録の`reporter_mode`には`none` / `shared` / `paired`のいずれかを保存します。各reporterについて構造化出力の成否、形式試行回数、形式再試行回数、`reported_blocked` / `invalid_output` / `invocation_failure` / `rate_limit`の失敗分類も保存します。

`pipeline.parent_validations`はtrialにも適用され、executor成功後・reporter起動前に各worktreeで実行されます。親検証結果は`source: runner`付きでevidenceへ保存し、失敗時はtrialを`failed`にします。比較記録と`trial status`はexecutor・親検証・全体の時間を分け、executorの検証報告総数と`passed` / `failed` / `not_run`、親検証の状態と件数を別々に表示します。採用前に親検証の成功とexecutorの未実施・未報告を確認してください。

記録先は`execution_path/exec/trials/<comparison-id>/`です。agent選定への反映は自動化せず、人が複数比較を確認して`pm-members.yaml`を更新します。

## 8. grade

`grade` は kata（rulebook / recipe / sample / template）または成果物を、review と同じ共通 viewpoint・category rubric で継続評価します。agent に直接ファイル探索やスコア計算をさせず、plan 生成と反映を分離します。

| コマンド         | 用途                                                     |
| ---------------- | -------------------------------------------------------- |
| `grade list`     | 選択した文書のパスを1行1件で出力し、plan は保存しない    |
| `grade plan`     | 1文書ごとに executor / reporter の評価 plan を保存する   |
| `grade apply`    | reporter の JSON と executor の申告を検証して反映する    |
| `grade validate` | 内容ハッシュと Frontmatter / 本文 finding 件数を検証する |

```bash
specdojo grade plan --target kata --changed-only --project prj-0001
specdojo grade list --target kata --changed-only --project prj-0001
specdojo grade plan --target kata --verdict pass --min-score 96 --max-findings 1 --project prj-0001
specdojo grade plan --target kata --ungraded --project prj-0001
specdojo grade list --target deliverable --changed-only --project prj-0001
specdojo grade plan --target deliverable --changed-only --project prj-0001
# executor plan の自由記述を保存し、reporter plan と一緒に reporter へ渡す
specdojo grade apply --target kata --path <document.md> \
  --analysis-from <executor-output.txt> --from <grade-result.json> --by <executor-nickname>
specdojo grade validate --target kata --project prj-0001
```

`--target` は `kata` または `deliverable` です。`--path` は繰り返し指定でき、明示した Markdown 文書だけを対象にします。ただし、パス要素に `generated` を含む生成文書と `trash` を含む退避済み文書は自動探索から除外し、`--path` で明示した場合も入力エラーとして拒否します。`--changed-only` は既存 grade の `content_hash` と、grade・finding を除いた現在内容のハッシュを比較するため、評価結果の書き込み自体を変更として再検出しません。ハッシュの計算前に改行を LF へ統一し、行末空白を除去して、連続する空行を1行へ畳みます。この正規化により、`grade apply` 後の Prettier 整形だけでは再評価対象になりません。

保存済みの判定結果では、`--verdict <pass|needs-work|fail>` で最新 verdict、`--min-score <score>` で総合 score が指定値以上、`--max-findings <count>` で全 severity の finding 合計が指定件数以下の文書に絞れます。score は 0 から 100 の整数で指定します。`--ungraded` は `specdojo.grade` が存在しない文書だけ、`--incomplete` は同じ本文に対する設定済み段数の評価が未完了で連続失敗上限に達していない文書だけを選びます。複数の選択条件は AND で適用され、`--path` や `--changed-only` とも併用できます。保存済み grade を前提とする `--verdict`、`--min-score`、`--max-findings` のいずれかと `--ungraded` の併用は入力エラーです。`grade list` はこの選択規則を plan の生成や文書更新なしで利用するための機械可読な入口で、標準出力にはリポジトリ相対パスだけを辞書順で出力します。定期再評価の呼び出し側は変更済み、未評価、段未完了を別々に列挙して和集合を取ります。

段の到達状況は `<execution_path>/grade/pipeline/` の文書別 JSON に保存します。`stage_completed`、`stage_failed`、`stage_total`、`consecutive_failures`、`max_failures` から再開段と上限到達を判定し、`content_hash` が現在本文と異なる古い state は再開に使いません。`grade state --target <target> --project <id> --path <document>` は現在本文に有効な state を JSON で返し、`--exhausted` は上限到達文書のパスを返します。state の更新は文書単位の実行 script が担い、pipeline 完了時にファイルを削除します。

`grade plan` は対象ごとに executor plan と reporter plan の2ファイルを生成し、既定では `<execution_path>/grade/generated/plans/<target>/` へ保存します。`generated/` 配下は再生成可能な派生生成物の置き場で、git 管理と文書索引の対象外です。`--out <directory>` で保存先を変更できます。ファイル名は対象パスから決定され、同じ対象の再生成は同じファイルを上書きするため履歴を増やしません。executor plan は評価対象を1件だけリポジトリ相対パスで示し、Kata の `rulebook` / `recipe` / `sample` / `template` 参照と逆参照から解決した対応文書も参考資料のパスとして列挙します。`--random-reference` を指定した場合は、同じ種別で `status: ready` の別文書から良い実例を1件無作為に選び、記載水準を比較するリファレンスとして記録します。Kata は同じ rulebook / recipe / sample / template 種別、成果物は同じ `specdojo.type` を候補範囲とします。実例は評価対象ではなく、`ready` も品質保証ではありません。対象・参考資料・実例の本文は plan に埋め込みません。再生成のたびに候補集合から選び直すため、同じ対象の plan でも実例だけが変わることがあります。`--random-reference` も `--reference` も指定しなければリファレンスは付けません。reporter plan は対象の固定 facts と GradeSubmission テンプレートだけを持ち、評価資料は持ちません。

成果物の plan は、成果物カタログの `done_criteria` を `DC-001` から順に列挙し、条件文、担当 Role code、viewpoint を executor へ渡します。executor は各条件を `satisfied` / `unsatisfied` として score とは独立に申告し、reporter はその判定と不足理由を変更せず GradeSubmission へ写します。`grade apply --target deliverable` は過不足と忠実性を検証し、成果物 Frontmatter の要約と `<execution_path>/grade/criteria/` の詳細 YAML を同時に更新します。詳細は成果物ごとに1ファイルで、再評価では同じファイルを上書きします。

再評価時は、対象本文に現在残っている `specdojo:finding` コメントから `rule`、`severity`、`line`、`message` を前回の指摘として plan へ含めます。`line` を持たない既存コメントも読み取れます。agent は各指摘が現在も未解消かを確認し、未解消なら前回の message を変更せず、前回と同等以上の severity で今回の finding に含めます。`grade apply` も同じ message の finding を未解消と扱い、提出された severity が前回より軽ければ前回値へ戻し、対応する viewpoint level を severity 上限まで補正します。前回の問題が解消され、別の軽微な問題だけが残る場合は、新しい finding の message に引き下げの根拠を含めます。前回の観点割り当てに判定を引きずられないよう各 viewpoint を現在の根拠から独立に評価し、前回指摘にない問題も検出します。前回の level、score、verdict や解消履歴は plan に引き継ぎません。適用結果は従来どおり最新状態へ上書きされます。コメントは指摘行を含む最上位 Markdown ブロックの直前へ置かれ、リスト、表、引用、コードフェンス、複数行段落を分断しません。実際の指摘行はコメントの `line` 属性で確認します。

executor は判定前に、plan が示す評価対象、すべての参考資料、選定された良い実例をファイル読み取りツールで全文読み、実行ログに各パスの読み取り操作を残します。参考資料は成果物間整合、良い実例は章ごとの具体性・根拠の密度・過不足を比較する材料であり、どちらも評価対象にはしません。実例の表現や欠点を機械的に転用せず、rubric と viewpoint を最終的な判定基準にします。いずれかのファイルを読み取れない場合は、内容を推測せず異常終了します。grade plan の Frontmatter と「このタスクで行うこと / 対象項目 / 進め方 / 完了手順 / 異常終了の条件」の章構成は exec plan に準拠します。

executor plan は JSON 契約を持ちません。各 viewpoint を `[VIEWPOINT <id>]` と `[END VIEWPOINT]` で囲み、`LEVEL: <0-4>` と、必要な `FINDING <severity> line=<line>: <message>` を申告します。marker 間の根拠と検討過程は自由記述です。この軽量な申告形式により、JSON を安定して生成できない agent でも分析を完了できます。

reporter は executor の最終応答を `<grade_executor_output>` として reporter plan と一緒に受け取り、GradeSubmission JSON だけを返します。対象文書や参考資料を再評価せず、executor の level、severity、line、message を追加・省略・変更しません。`grade apply --analysis-from <executor-output>` は reporter JSON と executor marker を機械照合し、不一致、欠落、追加を拒否してから既存の GradeSubmission 検証を実行します。判定主体は reporter ではなく executor なので、`--by <executor-nickname>` がプロジェクトの `pm-members.yaml` に存在する nickname を検証して `specdojo.grade.graded_by` へ記録します。

finding の忠実性照合では、message に限り、Unicode の正準等価（NFC）、連続・前後の空白、句読点周辺の空白、および `、。！？：；`（全角の `，．` を含む）と対応する ASCII 句読点を正規化します。これは reporter が内容を保ったまま起こす表記差だけを許容する境界です。英字の大小、英数字の全角・半角、括弧・ダッシュ、単語や文の言い換えは正規化しません。severity と line は常に完全一致が必要です。拒否時は、変更された severity、line、正規化後も異なる message の原文をエラーへ示します。

移行期間中は `--analysis-from` を省略した従来の1段構成も受理します。既存の保存済み plan や GradeSubmission を適用するための互換経路であり、新しく生成した2段 plan では `--analysis-from` を指定します。旧 GradeSubmission の `graded_by` も入力互換性のため受理しますが、記録には使いません。

複数対象は、生成された plan の組を順に処理し、executor 応答を保存して reporter へ引き渡し、1件の GradeSubmission を直ちに `grade apply --path <document> --analysis-from <executor-output>` で反映します。agent 起動は `agent run`、stage 間の応答受け渡しは呼び出し側が担い、`grade` は plan の生成と結果の検証・反映に限定されます。この単位で処理すると、後続文書が失敗しても適用済みの grade は保持されます。保存済み executor plan は `exec trial` などで同じ入力を複数 agent へ渡す用途にも利用できます。

### 8.1. 文書単位の grade pipeline

文書ごとに grade pipeline を実行する場合は、リポジトリルートから `tools/grade/run-per-document.sh` を実行します。`--stages 1` は codex 単段、既定の `--stages 3` は従来の3段構成です。`--target kata` では `--kind` に `rulebook` / `recipe` / `sample` / `template` のいずれか、または `all` を指定します。`--target deliverable` では成果物カタログの Markdown 成果物を対象にし、`--kind` は使いません。`--path` を繰り返すと明示した文書だけを処理できます。`--changed-only`、`--ungraded`、`--incomplete` は `grade list` の選択結果を利用し、複数指定時は各結果の和集合を処理します。既定 target は `kata`、既定 kind は `rulebook` です。

```bash
# 対象と agent / reference の確認だけを行う
tools/grade/run-per-document.sh --run-id 20260901-rulebooks --limit 3 --dry-run

# rulebook を codex 単段で評価する。同じ run-id で再実行すると中断箇所から再開する
tools/grade/run-per-document.sh --run-id 20260901-rulebooks --stages 1 --kind rulebook

# 変更済み、未評価、または段未完了の4種別を最大5件再評価する
tools/grade/run-per-document.sh --run-id 20260908-recheck --kind all \
  --stages 1 --changed-only --ungraded --incomplete --limit 15

# 変更済み、未評価、または段未完了の成果物を最大5件再評価する
tools/grade/run-per-document.sh --run-id 20260912-deliverables --target deliverable \
  --stages 1 --changed-only --ungraded --incomplete --limit 10
```

`--stages 1` では stage 1 の既定を `codex-expert-executor` / `gemma-reporter` / リファレンスなしとし、stage 2・3は実行しません。定期実行する `job-grade-kata` と `job-grade-deliverable` はこの構成を指定します。

互換用の `--stages 3` では、各段の executor と reporter を個別に指定できます。1段目の比較リファレンスは `--kind` に応じて `docs/ja/specdojo/<種別ディレクトリ>/prj-overview-<kind>.md` を既定とします。たとえば `--kind recipe` では `docs/ja/specdojo/recipes/prj-overview-recipe.md` です。対応する既定文書が存在しない場合は警告し、1段目もリファレンスなしで続行します。`--stage-1-reference` の明示指定は既定値より優先しますが、選択した種別のディレクトリにある `prj-overview` 系 Markdown だけを受理し、異なる種別や `none` は入力エラーとします。2段目はリファレンスなし、3段目は `codex-expert-executor` によるリファレンスなしの確認が既定です。2段目が `pass`、score 96以上、finding 1件以下の3条件をすべて満たす場合だけ3段目を実行します。解決した構成は `--dry-run` の `stage=<n>` 行で確認できます。

Run 内の実行 state は既定で `logs/grade/runs/per-document/<run-id>/documents/` に文書・段ごとに保存し、保存先を変える場合は `--work-dir` で指定します。初回に選択した文書は同じ Run の `selection.txt` へ固定し、再開時に grade の更新で選択結果が変わっても、未完了の段を同じ対象で継続します。Run をまたぐ到達状況は前述の文書別 JSON に保存し、新しい Run は `stage_failed`、または `stage_completed + 1` から再開します。単段への切り替え時に、`grade state` が現在本文に有効な `stage_total: 3` の state を返した場合は既存評価を完了済みとみなし、単段の incomplete として再開せず state を削除します。`content_hash` が現在本文と異なる state は `grade state` が返さないため、この移行処理の対象になりません。`logs/` へ plan を置くのは、段ごとの plan が同じ文書 ID を持ち、`docs/` 配下では `index build` が重複 ID で失敗するためです。agent が rate limit を返した場合は終了コード75で中断し、その段を失敗回数には数えません。同じ引数と `--run-id` で再実行すると、完了済みの段を再適用せず未完了の段から続行します。設定が保存済み Run state と異なる場合は、別条件の結果を混在させず、新しい `--run-id` を要求します。

各段の status、所要秒数、verdict、score、finding 件数、executor、reporter、reference、連続失敗回数は同ディレクトリの `results.tsv` で確認できます。通常の agent / apply 失敗はその段で文書処理を止め、成功済みの前段を残して次回同じ段から再試行します。既定の連続失敗上限は3回で、`--max-stage-failures` で変更できます。上限到達文書は処理対象から外れますが、`retry_exhausted` 行として `results.tsv` に含め、reporter が人手対応を促せるようにします。

`apply` は level 3 以下に finding を要求し、`blocker` は level 0、`major` は最大 level 2、`minor` は最大 level 3 に制限します。category score は viewpoint score（`level × 25`）の平均、総合 score は対象種別ごとの重み付き平均です。verdict は `blocker` があれば `fail`、`major` があるか総合 score が 70 未満なら `needs-work`、それ以外を `pass` とします。

現行のインライン記録対象は Markdown です。YAML / JSON の kata・成果物はコメントと Frontmatter を同じ契約で保持できないため、`--path` で指定した場合は書き込まずエラーにします。非 Markdown の記録形式はサイドカー schema を導入する後続変更で扱います。

## 9. exec worktree

`exec worktree` は、claim 済みタスクを段階ごとに確認しながら隔離実行するための分割コマンドです。

| サブコマンド | 用途                                                                          |
| ------------ | ----------------------------------------------------------------------------- |
| `prepare`    | plan、result、claim event を checkpoint commit し、task worktree を作成する   |
| `status`     | task state、actor、worktree、差分、統合状態を表示する                         |
| `agent`      | task worktree 内で agent command を1回実行する                                |
| `commit`     | 対象 result と成果物変更を exec ブランチへ commit する                        |
| `merge`      | exec ブランチを現在のブランチへ merge する                                    |
| `remove`     | 統合済み task worktree を削除する                                             |
| `prune`      | worktree のない exec ブランチを監査し、現在の HEAD に統合済みのものだけを削除 |

```bash
specdojo exec worktree prepare --project prj-0001 --task <task-id>
cd <worktree-path>
specdojo exec worktree agent --project prj-0001 --task <task-id>
specdojo exec worktree commit --project prj-0001 --task <task-id>
cd <merge-target-worktree>
specdojo exec worktree merge --project prj-0001 --task <task-id>
specdojo exec worktree remove --project prj-0001 --task <task-id> --delete-branch

# 孤立ブランチを確認してから、安全に削除する
specdojo exec worktree prune --project prj-0001 --dry-run
specdojo exec worktree prune --project prj-0001
```

`prepare` は root と tracked `package-lock.json` を持つ独立 package で `npm ci` を実行し、task worktree 内に書き込み可能な `node_modules` を準備します。過去の共有シンボリックリンクがある場合は、リンク先を変更せず実体ディレクトリへ置き換えます。install に失敗した場合、agent は起動されず task worktree が保持されます。

`prune` は登録済み worktree が使うブランチを対象外にし、孤立していても未統合のブランチは `kept (not merged)` として保持します。削除には `git branch -d` 相当だけを使います。

詳細な安全条件は [exec worktree運用ガイド](../guides/exec-worktree-guide.md) を参照します。

## 10. index

`index` は frontmatter の `id` とファイルパスのインデックスを扱います。

| コマンド        | 用途                                              | 例                                                     |
| --------------- | ------------------------------------------------- | ------------------------------------------------------ |
| `index build`   | `.specdojo/doc-index.json` を生成する             | `specdojo index build`                                 |
| `index lookup`  | ID からパスを返す                                 | `specdojo index lookup specdojo:prj-overview-rulebook` |
| `index replace` | `[[id]]` を Markdown リンクまたは path に展開する | `specdojo index replace --format path <plan-path>`     |

`exec run` は agent に plan を渡す直前に `index replace --format path --missing keep` 相当の処理を行います。

## 11. watch / build

| コマンド | 用途                                        | 例                                               |
| -------- | ------------------------------------------- | ------------------------------------------------ |
| `watch`  | ファイル変更を監視して対象 build を実行する | `specdojo watch --project prj-0001 --scope exec` |
| `build`  | 全生成物または指定 scope を一括再生成する   | `specdojo build --project prj-0001 --scope all`  |

`dashboard build --project <id>` は `execution/generated/dashboard.md` を再生成します。通常の進捗集計に加え、`routines/generated/routine-runs.jsonl` から昨日の実行と本日の予定を、登録簿個票から着手候補のおすすめ順を、register / exec の event から解除待ちの理由と次の行動を表示します。

`--scope` は `exec`、`catalog`、`register`、`index`、`all` を指定します。

## 12. job

`job`は再利用可能な`job-*.yaml`と、その定義からmaterializeされたJob Runを扱います。実行自体は`exec run --job`を使います。

| コマンド       | 用途                                       | 例                                         |
| -------------- | ------------------------------------------ | ------------------------------------------ |
| `job list`     | Job Definitionと最終Runを表示する          | `specdojo job list --project prj-0001`     |
| `job validate` | `job-*.yaml`を検証する                     | `specdojo job validate --project prj-0001` |
| `job where`    | Job Definition・Run・stateのパスを表示する | `specdojo job where --project prj-0001`    |

`exec run --job`の`--input <key=value...>`はJob入力を指定し、`--scheduled-at`はroutineやCIが論理実行枠を渡す場合に使います。入力定義の `enum` は string / integer / boolean の値、または list の各要素を制限し、integer の `minimum` / `maximum` は値域を制限します。command template では `{{project_id}}` で解決済みプロジェクトIDを、`{{specdojo}}` で現在のrunnerと同じCLI entryを、`{{job_run_id}}` で確定済みJob Run IDを参照できます。`job_run_id`は`run.idempotency_key`では参照できません。同じidempotency keyの完了済みRunは再実行せず、失敗済みRunは同じRun IDの次attemptとして実行します。Job Runは現在in-place実行に対応し、`--worktree`との併用は未対応です。

委譲先のagentは`task.agent.executor`（および必要なら`task.agent.reporter`）にnicknameで指名します。両方を指名したRunはexecutor→reporterの2段で実行し、resultはreporterが書きます。`--by`は単一agent実行としての差し替え、`--executor-by` / `--reporter-by`は段ごとの差し替えとして、いずれも指名より優先します。`job validate`はnicknameの書式だけを検査するため、実在確認は`--dry-run`で行います。責務境界と記述規約は [Job定義標準](../standards/job-definition-standard.md) を参照します。

`task.mode: command`では、materialize済みの`task.command`をrunnerが直接実行します。終了コード、標準出力、標準エラーはcommand evidenceへ記録され、終了コードが0以外ならagentを起動せずRunをfailedにします。stdout / stderr はredact・64 KiB上限付きログへの参照と同じbounded内容がevidence本体にも入り、判断が必要なJobでは成功時に`task.analysis.agent`へ渡されます。analysis reporterは参照先ログや作業ツリーを追加で読まず、このevidence本体から判断します。commandのrunner実行を`--by` / `--executor-by`でagent実行へ差し替えることはできません。analysis agentだけは`--reporter-by`で差し替えられます。

```bash
# 解決された runner command / analysis reporter を確認する（実行しない）
specdojo exec run --job job-grade-kata --project prj-0001 --input period=2026-W37 --dry-run
```

## 13. routine

`routine` は `rtn-*.yaml` の定義に基づき、schedule の依存グラフとは独立にタスクを定期実行します。CLI は常駐せず、外部スケジューラ（cron / CI の scheduled workflow）から `routine run --due` を冪等に呼び出します。

| コマンド           | 用途                                           | 例                                              |
| ------------------ | ---------------------------------------------- | ----------------------------------------------- |
| `routine list`     | 定義・due 状態・最終実行を表示する             | `specdojo routine list --project prj-0001`      |
| `routine validate` | `rtn-*.yaml` を検証する                        | `specdojo routine validate --project prj-0001`  |
| `routine run`      | due な routine を実行し、`last_run` を記録する | `specdojo routine run --project prj-0001 --due` |
| `routine where`    | routine 関連パスを表示する                     | `specdojo routine where --project prj-0001`     |

主要オプション:

| オプション  | 用途                                            |
| ----------- | ----------------------------------------------- |
| `--due`     | due と判定された routine だけを対象にする       |
| `--id <id>` | due 判定と無関係に特定の routine を即時実行する |
| `--dry-run` | 実行も `last_run` 記録も行わず、対象を表示する  |

`action` は単一オブジェクト、または先頭から順に実行する1件以上の配列を受け付けます。単一オブジェクトの `action.kind`、配列の各要素の `kind` は `job` または `specdojo` を受け付けます。`job` は実行内容と入力検証を参照先の Job Definition に委ね、`exec run --job` 経由で実行ロックに従います。`specdojo` は `args` に書いた specdojo サブコマンド（例: `[dashboard, build]`）へ `--project` を付けて直接起動し、実行ロックを取りません（agent を呼ばない読み取り・派生生成専用。`exec` と `--project` は `args` に書けません）。`register` / `exec-auto` / `exec-resume` / `exec-cycle` の旧 kind は廃止済みです。定義ファイルの配置、`interval`または`trigger.cron`の書式、複数 action の失敗方針、due判定は [routine運用ガイド](../guides/routine-operation-guide.md) を参照します。

各 routine の実行完了時には、`routine-state.json` の最新状態とは別に、`routines/generated/routine-runs.jsonl` へ `routine_id`、`scheduled_for`、開始・終了時刻、結果、Job Run ID（`specdojo` action では空）を1実行1行で追記します。この履歴が dashboard の「routine 実行状況（昨日・本日）」の正本です。

```bash
# due な routine をまとめて実行する（cron / CI から呼ぶ想定）
specdojo routine run --project prj-0001 --due

# 特定の routine を due 判定と無関係に即時実行する
specdojo routine run --project prj-0001 --id rtn-daily-register-sweep

# 実行内容を確認する（実行も last_run 記録もしない）
specdojo routine run --project prj-0001 --due --dry-run
```

schedule / register / job / routine の使い分けの基準は [exec運用ガイド](../guides/exec-operation-guide.md) の `実行経路の使い分け` を参照します。

## 14. agent

`agent` は、保存済みの plan を指定した1つの agent へ渡し、その標準出力を取得します。agent の選択は `pm-members.yaml` の nickname で一意に決まるため、実行のたびに担当が変わりません。決定論的な手順を shell script や CLI 側に置き、agent には判断だけを委ねるための最小の部品です。

| コマンド    | 用途                                                        |
| ----------- | ----------------------------------------------------------- |
| `agent run` | plan を stdin で agent へ渡し、標準出力をファイルへ保存する |

```bash
specdojo agent run --plan <plan.md> --by <nickname> --out <response.txt>
specdojo agent run --plan <plan.md> --by <nickname> --dry-run
```

`--plan` は agent へ標準入力で渡すファイルです。存在しない場合と内容が空の場合は、空のプロンプトを送らずにエラーにします。`--by` は `pm-members.yaml` の agent nickname で、同じ nickname の agent が複数ある場合、`type: agent` 以外、`disabled: true` の member は拒否します。`capabilities` や `proficiency` による間接的な絞り込みは行わないため、候補が複数になって担当が揺れることがありません。

`--out` を指定すると標準出力をそのファイルへ書き、親プロセスの標準出力には保存先だけを表示します。指定しない場合は agent の出力をそのまま端末へ流します。`--out` の親ディレクトリは必要に応じて作成します。`--dry-run` は解決したコマンドを表示するだけで agent を起動しません。

終了コードは、成功が `0`、agent の失敗が `1`、rate limit の検出が `75` です。rate limit は通常の失敗と区別する必要があります。呼び出し側は、対象を評価済みとして記録せずに中断し、後で再開できます。検出条件と cooldown は `exec run` と同じ `exec-defaults.yaml` の設定を provider ごとに解決して使います。

`exec run` と違い、`agent run` は claim や result の記帳を行いません。状態遷移を伴う実行は `exec run` を使い、`agent run` は plan と応答だけを扱う用途に限定します。

## 15. 関連ガイド

| 詳細                     | 参照先                                                                      |
| ------------------------ | --------------------------------------------------------------------------- |
| CLI全体像と初期設定      | [遂行の技活用ガイド](../guides/waza-guide.md)                               |
| Schedule設計             | [Schedule設計ガイド](../guides/schedule-design-guide.md)                    |
| exec運用（経路の選び方） | [exec運用ガイド](../guides/exec-operation-guide.md)                         |
| Schedule実行運用         | [Schedule実行運用ガイド](../guides/schedule-operation-guide.md)             |
| routine運用              | [routine運用ガイド](../guides/routine-operation-guide.md)                   |
| 登録簿運用               | [登録簿運用ガイド](../guides/register-operation-guide.md)                   |
| worktree隔離実行         | [exec worktree運用ガイド](../guides/exec-worktree-guide.md)                 |
| plan/result              | [plan/resultライフサイクルガイド](../guides/plan-result-lifecycle-guide.md) |
| エージェント設定         | [exec設定ガイド](../guides/exec-config-guide.md)                            |
