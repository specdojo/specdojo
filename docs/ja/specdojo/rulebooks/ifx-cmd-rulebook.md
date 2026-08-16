---
specdojo:
  id: specdojo:ifx-cmd-rulebook
  type: rulebook
  status: draft
  target_format: yaml
  recipe: specdojo:ifx-cmd-recipe
  sample: specdojo:ifx-cmd-sample
  template: specdojo:ifx-cmd-template
  schema: none
---

# 外部コマンド連携仕様作成ルール

External Command Interface Specification (ECIS) Documentation Rules

外部 CLI プロセスを起動する連携について、実行契約、入出力、終了状態、認証注入、失敗時の扱いを YAML 1 ファイルで定義します。ESIL の `kind: コマンド` から参照される、1 つの外部コマンド連携の詳細仕様です。

## 1. 全体方針

- 1 ファイルで、1 つの実行目的と共通の入出力契約を持つコマンド連携を定義する。サブコマンドや出力契約が異なる場合はファイルを分ける。
- 呼び出し元と外部 CLI の合意境界に必要な項目を記載し、内部クラス、関数、プロセス起動ライブラリの実装詳細は含めない。
- 実行可能ファイルと引数は配列要素として分離し、既定ではシェルを経由しない。パイプ、リダイレクト、コマンド置換は 1 つのコマンド契約に埋め込まない。
- 認証情報は値ではなく注入方式と参照名だけを定義し、仕様、引数、標準入力、出力例に秘密値を記載しない。

## 2. 位置づけと用語定義

| 用語           | 定義                                                                                                    |
| -------------- | ------------------------------------------------------------------------------------------------------- |
| 外部コマンド   | 対象システムのプロセス境界外にあり、実行可能ファイルと引数を指定して起動する CLI                        |
| 起動契約       | 実行可能ファイル、サブコマンド、引数、実行ディレクトリ、タイムアウトの合意                              |
| ストリーム契約 | stdin、stdout、stderr それぞれの使用有無、形式、文字コード、成功時・失敗時の意味                        |
| 認証注入       | シークレットストアや CLI 認証プロファイルから、プロセスに認証状態を渡す方式。秘密値自体は仕様に含めない |
| 終了カテゴリ   | CLI 固有の終了コードを、成功、入力不正、認証失敗、一時失敗など呼び出し元が扱える意味へ分類した値        |

ESIL は連携の存在と方向を一覧化し、本仕様は対応する `spec_ref` の先でプロセス起動の契約を定義します。API、ファイル転送、メッセージングが連携の本体であり CLI が単なる操作ツールの場合は、対応する API／ファイル／メッセージ仕様を正本とし、本仕様との責務の重複を避けます。

## 3. ファイル命名・ID規則

- ファイル名は `ifx-cmd-<term>.yaml`、`id` は `ifx-cmd-<term>` とし、`<term>` は連携目的または外部 CLI を表す kebab-case にする。
- ESIL の `interfaces[].kind` は `コマンド`、`interfaces[].spec_ref` は本仕様の `id` と一致させる。詳細仕様が未作成の間だけ `TBD` を使用できる。
- 1 つの CLI で複数の実行目的を持つ場合は、`ifx-cmd-git-read` と `ifx-cmd-git-write` のように連携契約単位で分割する。バージョンや状態は ID に含めない。
- package に同梱する sample の ID `specdojo:ifx-cmd-sample` は記述例を識別するための例外であり、ESIL の `spec_ref` には使用しない。

## 4. 先頭メタ項目

YAML の先頭に次のメタ項目を置きます。

| キー       | 説明                                             | 必須 |
| ---------- | ------------------------------------------------ | ---- |
| id         | コマンド連携仕様 ID。成果物では `ifx-cmd-<term>` | ○    |
| type       | `command` 固定                                   | ○    |
| title      | 対象と実行目的が分かる仕様名                     | ○    |
| status     | `draft` / `ready` / `deprecated`                 | ○    |
| rulebook   | `specdojo:ifx-cmd-rulebook`                      | ○    |
| version    | 呼び出し契約の変更を追跡する整数または SemVer    | 任意 |
| based_on   | 作成時に直接確認した設計・運用文書の ID 配列     | 任意 |
| supersedes | 置き換え対象の文書 ID 配列                       | 任意 |

`based_on` は実際に内容を確認した文書だけとします。コマンドのバージョン制約はメタ項目の `version` ではなく、`command.version_constraint` に記載します。

## 5. YAML構成（標準テンプレ）

| ルートキー     | 定義内容                                                                         | 必須 |
| -------------- | -------------------------------------------------------------------------------- | ---- |
| command        | 実行可能ファイル、サブコマンド、用途、バージョン制約、シェル経由の有無           | ○    |
| arguments      | option／positional の種別、必須性、型、値の供給元、説明                          | ○    |
| streams        | stdin、stdout、stderr の使用有無、データ形式、文字コード、契約                   | ○    |
| exit_codes     | 終了コードと意味、共通カテゴリ、リトライ可否                                     | ○    |
| authentication | 認証方式、注入機構、参照名、秘密値の供給元、ログのマスク方針                     | ○    |
| execution      | 実行ディレクトリ、タイムアウト、ネットワーク要否、並列実行数、冪等性             | ○    |
| error_handling | 再試行対象、試行上限、待機方式、タイムアウト時、出力解析失敗時、認証失敗時の処置 | ○    |

引数が無いコマンドは `arguments: []` を明示できます。`exit_codes` は空配列にせず、少なくとも成功と代表的な失敗を記載します。

## 6. 記述ガイド

### 6.1. command と arguments

- `command.executable` は実行可能ファイル名または配布済みパスを記載し、引数やパイプを連結しない。`command.subcommands` は起動順の文字列配列とする。
- `command.shell` は `false` 固定とする。複数コマンドの連携は実行側のワークフローで表し、文字列のシェルスクリプトとして仕様化しない。
- `arguments[].kind` は `option` / `positional`、`value_type` は `string` / `integer` / `boolean` / `path` / `json`、`value_source` は `literal` / `config` / `generated` のいずれかとする。
- positional 引数は `position` を 1 始まりで付け、option 引数は `name` に CLI の表記を記載する。可変値は `example` に実値ではなく公開可能な例を置く。

### 6.2. stdin／stdout／stderr

- `streams.stdin.mode` は `none` / `optional` / `required` とし、`required` または `optional` の場合は `format`、`encoding`、入力の意味を記載する。
- `streams.stdout` は成功時に呼び出し元が解析する形式と最小契約を記載する。機械処理する場合は `json` または `jsonl` を優先し、人向けの可変文言に依存しない。
- `streams.stderr` は進捗、警告、失敗詳細のどれが出力されるかを記載する。stderr の文言だけで成否を判定せず、終了コードと構造化出力を優先する。
- 形式は `text` / `json` / `jsonl` / `yaml` / `binary` / `none` から選び、テキスト形式には原則 `UTF-8` を指定する。

### 6.3. exit_codes

| キー      | 記載内容                                                                                                                              | 必須 |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| code      | CLI が返す整数の終了コード                                                                                                            | ○    |
| meaning   | CLI 固有の意味と呼び出し元が識別できる条件                                                                                            | ○    |
| category  | `success` / `input_error` / `authentication_error` / `authorization_error` / `rate_limit` / `transient_failure` / `permanent_failure` | ○    |
| retryable | 同じ入力で自動再試行してよいか                                                                                                        | ○    |

複数の意味に使われる終了コードは、追加の判定条件を `meaning` に記載します。汎用的な非 0 のみを `rate_limit` や `transient_failure` とみなさず、専用コードまたは構造化出力で識別できる場合だけその category を使用します。

### 6.4. authentication

- `method` は `none` / `api_token` / `oauth` / `ssh_key` / `provider_login` から選び、連携先が要求する認証の種類を示す。
- `injection.mechanism` は `none` / `environment_variable` / `credential_store` / `workload_identity` / `cli_profile` から選び、必要な参照名を `injection.names` に列挙する。
- `secret_source` に値を供給する管理境界を記載し、`log_policy` に引数、環境変数、stdout／stderr のマスク条件を記載する。
- 認証トークン、秘密鍵、パスワード、認証プロファイルの実パスを記載しない。コマンド引数への秘密値の埋め込みも許可しない。

### 6.5. execution と error_handling

- `execution.timeout_seconds` は 1 回の起動上限、`max_parallel` は同時実行上限とし、コマンドの公開契約や実測根拠から決める。
- `execution.idempotency` は `guaranteed` とその条件を記載する。副作用のあるコマンドを再試行する場合は、リクエスト ID など重複実行を防ぐ条件を明示する。
- `error_handling.retry.on_categories` は `exit_codes` の category と一致させ、`max_attempts` と `backoff` を記載する。認証失敗や入力不正は自動再試行しない。
- タイムアウト時のプロセス終了、不完全出力の破棄、stdout の解析失敗、認証失敗の再認証依頼をそれぞれ別のキーで記載する。

## 7. 禁止事項

- 実行可能ファイル、サブコマンド、引数を 1 本のシェル文字列として記載しない。`command.shell: true`、パイプ、リダイレクト、コマンド置換は使用しない。
- トークン、パスワード、秘密鍵、秘密値を含む URL、個人環境に固有の認証パスを本文や例に記載しない。
- 標準出力と標準エラーを混同したり、出力形式を「CLI の既定」とだけ記載したり、終了コードの意味を定義せずに成否判定を文言解析に依存しない。
- 副作用があるコマンドを冪等性条件なしで自動再試行対象にしない。認証失敗、認可失敗、入力不正を一時失敗として扱わない。
- DB 物理構造、内部クラス名、プロセス起動ライブラリの API 呼び出し、スクリプト全文などの実装詳細を含めない。

## 8. サンプル

```yaml
id: ifx-cmd-supplier-order
type: command
title: 仕入先への発注登録コマンド連携仕様
status: draft
rulebook: specdojo:ifx-cmd-rulebook
version: 1

command:
  executable: supplier-cli
  subcommands: [orders, submit]
  purpose: 確定した発注データを仕入先サービスへ登録する
  version_constraint: ">=2.1.0 <3.0.0"
  shell: false

arguments:
  - name: --file
    kind: option
    required: true
    value_type: path
    value_source: generated
    description: 発注データ JSON のパス
    example: tmp/orders/ORD-0001.json
  - name: --request-id
    kind: option
    required: true
    value_type: string
    value_source: generated
    description: 重複登録を防ぐリクエスト ID
    example: req-order-0001

streams:
  stdin:
    mode: none
    format: none
  stdout:
    format: json
    encoding: UTF-8
    description: order_id と accepted_at を含む登録結果
  stderr:
    format: text
    encoding: UTF-8
    description: 診断情報。認証情報は出力しない

exit_codes:
  - code: 0
    meaning: 発注を登録した、または同じ request_id の登録済み結果を返した
    category: success
    retryable: false
  - code: 2
    meaning: 引数または発注データが不正
    category: input_error
    retryable: false
  - code: 75
    meaning: 仕入先サービスが一時的に利用できない
    category: transient_failure
    retryable: true

authentication:
  method: api_token
  injection:
    mechanism: environment_variable
    names: [SUPPLIER_CLI_TOKEN]
  secret_source: 実行環境のシークレットストア
  log_policy: 環境変数の値をコマンド表示、stdout、stderr、エラー記録に出力しない

execution:
  working_directory: repository_root
  timeout_seconds: 60
  network_required: true
  max_parallel: 1
  idempotency:
    guaranteed: true
    condition: 同じ --request-id を再送する

error_handling:
  retry:
    on_categories: [transient_failure]
    max_attempts: 3
    backoff: exponential
  timeout_action: 子プロセスを終了し、不完全な stdout を破棄する
  malformed_output_action: 再試行せず、出力解析失敗として停止する
  authentication_failure_action: 再試行せず、認証状態の確認を依頼する
```
