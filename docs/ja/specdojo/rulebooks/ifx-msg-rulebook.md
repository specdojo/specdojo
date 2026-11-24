---
specdojo:
  id: specdojo:ifx-msg-rulebook
  type: rulebook
  deliverable_type: api
  status: draft
  target_format: yaml
  recipe: not-needed
  sample: specdojo:ifx-msg-sample
  template: not-needed
---

# 外部メッセージ仕様 作成ルール

External Message Specification Documentation Rules

外部システム（物流、会計、本部など）との非同期のメッセージ連携を、AsyncAPI と CloudEvents の YAML 1 ファイルで定義する基準を定めます。本書では、この YAML を「メッセージ仕様」と呼びます。

## 1. 全体方針

- **1 連携 1 ファイル**: 1 ファイルは、`ifx-index` の 1 行（1 つの外部連携）が使うイベントとチャネルの組とする。同じブローカーでも、発行者・購読者・業務の目的が異なるイベントはファイルを分ける。
- **外部との合意に必要な最小十分**: 最小十分とは、購読者がこのファイルだけでイベントを受け取り、重複・順序・欠落を判断して処理できることをいう。
- **方式を選ぶ理由**: AsyncAPI は、チャネルと向きをプロトコルに依存せず書けるため使う。CloudEvents は、イベントの属性（`id`・`source`・`type`・`time`）の名前を相手と共通にでき、重複の判定と版の識別に使えるため、エンベロープに使う。
- **同期の API との境界**: 要求に対する応答を待つ連携は `ifx-api`（[[specdojo:ifx-api-rulebook|外部API仕様 作成ルール]]）で定める。本仕様は、発生した事実の通知と、応答を待たない指示を扱う。
- **共通の運用**: `status` の昇格と承認、改訂と廃止は [[specdojo:document-metadata-standard|ドキュメントメタ情報標準]] に従い、本書では言い直しません。

## 2. 位置づけ

- `ifx-index`（[[specdojo:ifx-index-rulebook|外部システムI/F一覧 作成ルール]]）の `interfaces[].spec_ref` が指す詳細仕様である。一覧で連携の目的・方向・失敗時の扱いを決め、本仕様でイベントの契約を決める。
- 作る順序: `ifx-index` に連携の行を置き、`spec_ref: TBD` で未決事項を残したうえで本仕様を作り、作った ID を `spec_ref` に入れる。
- 合意の当事者: 自システム側の DEV（開発担当）が ARC（技術メンター）の助言を受けて契約を作り、発行者・購読者の窓口と合意する。業務上の採否と `ready` への昇格は PO が判断する。`ready` にする条件は、`_UNDECIDED_` が残っていないことと、検証器での構造の確認を終えたことである。

## 3. ファイル命名・ID規則

- 配置先: プロダクト文書の `020-external-interface-specs/`。ディレクトリ構成は [[specdojo:docs-structure-guide|ドキュメント構成ガイド]] に従う。
- ファイル名は `ifx-msg-<term>.yaml`（例: `ifx-msg-stock-changed.yaml`）、ID のローカル部分は `ifx-msg-<term>` とする。`<term>` はイベントの業務の目的を表す kebab-case とし、版や状態を含めない。
- id やファイル名を変えるときは、`ifx-index` の `spec_ref`、`based_on` で参照する他仕様、YAML の表示のページ（`generated/<name>.md`、yaml-pages で作り直す）を同じ変更でそろえる。
- 同梱の完成例の ID `specdojo:ifx-msg-sample` は命名上の例外であり、実際の `ifx-index` の参照先には使用しない。

## 4. 先頭メタ項目

ファイルの先頭行に `# specdojo-schema: none reason=external-asyncapi` を置く。AsyncAPI の構造は SpecDojo の schema で検証しないことを示し、`x-spec-meta` の照合は省略されない。

メタ情報は `x-spec-meta` に置く。

| キー     | 説明                                                                  | 必須 |
| -------- | --------------------------------------------------------------------- | ---- |
| id       | メッセージ仕様ID（`ifx-msg-...`）                                     | ○    |
| type     | `api` 固定                                                            | ○    |
| rulebook | `specdojo:ifx-msg-rulebook`                                           | ○    |
| status   | ドキュメントメタ情報標準の値                                          | ○    |
| based_on | 根拠となる文書の ID リスト。参照元の `ifx-index` の ID を最低限入れる | ○    |

## 5. 本文要件

AsyncAPI は 2.6.0、CloudEvents は 1.0 を既定とする。AsyncAPI 3.x は、発行者・購読者の双方の検証器とコード生成が対応すると確認できた場合に限り、DEV が ARC と合意して選ぶ。

| 対象キー              | 必須性           | 契約として定める内容                                                                          |
| --------------------- | ---------------- | --------------------------------------------------------------------------------------------- |
| `asyncapi`            | 必須             | `2.6.0` または合意した版                                                                      |
| `info.title`          | 必須             | イベントの業務の目的が分かる名前                                                              |
| `info.version`        | 必須             | 契約の版（`MAJOR.MINOR.PATCH`）                                                               |
| `info.description`    | 必須             | 対応する `ifx-index` の連携名、発行者と購読者、配信と順序の保証、重複受信の扱い、未決事項     |
| `x-spec-meta`         | 必須             | 先頭メタ項目の表のキー                                                                        |
| `defaultContentType`  | 必須             | メッセージの既定の形式                                                                        |
| `servers`             | 任意             | プロトコルと接続先の種別。接続先が未確定なら省略するか、例示用ドメイン（`example.com`）とする |
| `channels`            | 必須（1 つ以上） | チャネル名、`description`（発生の契機）、向き（`publish` / `subscribe`）と `message` の参照   |
| `components/messages` | 必須（1 つ以上） | `name`・`title`・`contentType`・`payload`                                                     |
| `components/schemas`  | 必須             | CloudEvents のエンベロープと `data` のスキーマ                                                |

CloudEvents の属性は仕様で名前が固定のため、snake_case に変換しない。

| 属性              | 必須性 | 内容                                                                |
| ----------------- | ------ | ------------------------------------------------------------------- |
| `specversion`     | 必須   | `"1.0"`                                                             |
| `type`            | 必須   | イベント種別。末尾に版を付ける（例: `com.kinuya.stock.changed.v1`） |
| `source`          | 必須   | イベントの発生元（URI 参照、例: `/inventory`）                      |
| `id`              | 必須   | イベント ID。`source` との組で一意とし、購読者は組で重複を判定する  |
| `time`            | 必須   | 発生時刻（RFC 3339）                                                |
| `datacontenttype` | 必須   | `data` の形式。`enum` で値を固定する（例: `application/json`）      |
| `subject`         | 任意   | 対象を識別する文字列                                                |
| `data`            | 必須   | 業務のペイロード。プロパティ名は snake_case とする                  |

## 6. 記述ガイド

### 6.1. 向きと送信者・受信者

- AsyncAPI 2.6.0 の `subscribe` は「アプリケーションが発行し、利用者が購読できる」、`publish` は「利用者が送り、アプリケーションが受け取る」を表す。向きの誤読を防ぐため、チャネルの `description` に発行者と購読者を名前で書く。
- 良い例: 「発行者: 店舗端末の在庫管理。購読者: 本部の在庫集計」と書く。
- 悪い例: `subscribe` だけを置き、どちらのシステムが送るかを書かない。

### 6.2. 形式の使い分け

- CloudEvents の structured モード（エンベロープと `data` を 1 つの JSON で送る）を既定とし、`components/messages` の `contentType` を `application/cloudevents+json` にする。
- `defaultContentType` は `contentType` のないメッセージの既定、`datacontenttype` は `data` の形式を表す。三つの値の関係を `info.description` に書く。
- binary モード（属性をプロトコルのヘッダーで送る）を使う場合は、`contentType` を `data` の形式にし、ヘッダーの対応をメッセージの `description` に書く。

### 6.3. 配信の保証と重複

- 配信の保証（at-least-once など）、順序の保証の範囲（例: 同じ `subject` の中だけ）を `info.description` に書く。
- 購読者は `source` と `id` の組で重複を捨て、順序の逆転は `time` で判断する、などの扱いを書く。
- `data` の数値の下限、識別子の書式（`pattern`）を書き、購読者が不正値を判定できるようにする。

### 6.4. 版と改訂

- 互換を保つ変更（任意の `data` 項目の追加）は `info.version` の MINOR を上げる。購読者は知らない項目を無視する前提を書く。
- 互換を壊す変更は `info.version` の MAJOR と `type` の版（`.v1` → `.v2`）を上げ、旧版のイベントを併存して発行する期間と廃止の通知を相手と合意し、`ifx-index` の注記に残す。

### 6.5. 未決事項と検証

- 未決事項は `_UNDECIDED_`、仮置きは `_ASSUMPTION_`、未確認は `_TODO_` をコメントで書き、確認先と `ready` にする前に解消する事項を示す。
- 本ファイルは `validate:schema` で構造を検証しない。作成・改訂のたびに、AsyncAPI の版に対応した検証器（例: AsyncAPI CLI の `validate`）で構造を確かめ、使った検証器と結果を実行記録に残す。

## 7. 禁止事項

| 禁止事項                                          | 理由                                           |
| ------------------------------------------------- | ---------------------------------------------- |
| DB の物理テーブル名・物理カラム名・SQL 全文を書く | 内部の実装で、相手との合意の対象にならないため |
| 実装のクラス・関数名、内部のモジュール構成を書く  | 実装の変更のたびに契約を改訂することになるため |
| UI 操作を逐語で並べる                             | 画面の仕様の正本と二重になるため               |
| `servers` に実の接続先・認証情報・契約情報を書く  | 文書から接続先と秘密情報が漏れるため           |
| CloudEvents の属性名を snake_case などに変える    | 仕様の属性として相手が解釈できなくなるため     |
| 互換を壊す変更を `type` の版を上げずに行う        | 購読者が旧版と区別できず、処理が壊れるため     |
