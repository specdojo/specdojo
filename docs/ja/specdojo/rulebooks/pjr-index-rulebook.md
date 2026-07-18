---
specdojo:
  id: pjr-index-rulebook
  type: rulebook
  status: ready
  target_format: markdown
  recipe: none
  sample: none
  template: pjr-index-template
  based_on:
    - rulebook-authoring-standard
  supersedes: []
---

# プロジェクト登録簿 作成ルール

Project Register Documentation Rules

本ドキュメントは、プロジェクト登録簿（`pjr-index`）を統一形式で記述するためのルールです。
プロジェクト登録簿は `pjr-index` と `pjr-XXXX-<topic>.md` で構成し、TODO、要確認事項、リスク、課題、変更要求、決定事項、依存事項、備忘などの管理対象を一元管理します。
本書は構造・列・記述形式を定義し、位置づけ、値の意味・選び方、登録・状態遷移・個票分離などの運用は [[specdojo-register-operation-guide]] を参照します。

## 1. 全体方針

- `pjr-index` は、project-register の本体として機能する。
- 個別登録項目の詳細説明、判断理由、経緯、対応内容は各 `pjr-XXXX-<topic>.md` に集約し、`pjr-index` は登録項目一覧と参照先リンクの管理に専念する。
- `generated/` 配下の派生ビューは補助一覧であり、正本ではない。
- 本文構造は `pjr-index.schema.yaml` により機械検証され、本書は構造と記述形式を定義する。

## 2. ファイル命名・ID規則

### 2.1. ID規約

- `pjr-index` 自体の `id` は `<project-id>:pjr-index` 形式を推奨する。
  - 例: `prj-0001:pjr-index`
- 個別登録項目の表示 ID は `PJR-XXXX` 形式とする。
  - 例: `PJR-0001`
- 個別登録項目のファイル連番は 4 桁とし、project-register 内で一意にする。
- `<topic>` は英小文字・数字・ハイフンのみとし、対象領域や論点が分かる短い名称にする。

### 2.2. ファイル命名規約

- プロジェクト登録簿本体のファイル名は `pjr-index.md` とする。
- プロジェクト登録簿本体は以下に配置する。

```text
docs/ja/projects/<project-id>/030-project-management/controls/project-register/pjr-index.md
```

- 個別登録項目のファイル名は `pjr-XXXX-<topic>.md` 形式とする。
  - 例: `pjr-0001-auth-boundary.md`
- 相対リンクで `pjr-index` から個別登録項目へ遷移できる命名・配置を維持する。

## 3. 推奨 Frontmatter 項目

| 項目         | 説明                                                 | 必須 |
| ------------ | ---------------------------------------------------- | ---- |
| `id`         | `<project-id>:pjr-index`（例: `prj-0001:pjr-index`） | ○    |
| `type`       | `project` を推奨                                     | ○    |
| `status`     | `draft` / `ready` / `deprecated`                     | ○    |
| `rulebook`   | `pjr-index-rulebook`                                 | 任意 |
| `based_on`   | 登録簿全体の運用根拠として参照した文書IDの配列       | 任意 |
| `supersedes` | 置き換え元の文書IDの配列                             | 任意 |

- `based_on` には登録簿全体の運用根拠だけを記載し、登録項目ごとの根拠文書は個別の `pjr-XXXX-<topic>.md` 側に記載する。直接根拠がない場合は省略してよい。

## 4. 本文構成（標準テンプレ）

| 章  | 内容         | 必須 |
| --- | ------------ | ---- |
| 1   | 登録項目一覧 | ○    |
| 2   | 派生ビュー   | 任意 |

### 4.1. 登録項目一覧 の標準列

| 列名       | 説明                                          | 必須 |
| ---------- | --------------------------------------------- | ---- |
| ID         | `PJR-XXXX` 形式の表示 ID                      | ○    |
| ステータス | 登録項目の現在状態                            | ○    |
| タイトル   | 登録項目の内容が分かる短いタイトル            | ○    |
| 説明       | 登録項目の内容を短く説明する本文              | 条件 |
| 分類       | 登録項目の分類                                | ○    |
| 優先度     | 対応優先度                                    | ○    |
| 担当       | 主担当者または役割。未定の場合は `_TODO_`     | 任意 |
| 期限       | 対応期限または判断期限。未定の場合は `_TODO_` | 任意 |
| 完了日     | 完了・却下した日付。未完了の場合は `-`        | 任意 |
| 結論       | 完了・却下・決定時の結果の要約。未定は `-`    | 任意 |
| 個票       | `pjr-XXXX-<topic>.md` への相対リンク          | 条件 |

`説明` と `個票` は、少なくともどちらか一方を記載する。

### 4.2. 派生ビュー の標準リンク

「派生ビュー」章には、派生ビューが正本ではないことを明記し、必要に応じて次のリンクを含める。

- 登録簿内の台帳ビュー: `./generated/pjr-views.md`
- controls 全体の派生管理ビュー: `../generated/pm-risk-register.md`、`../generated/pm-issue-log.md`、`../generated/pm-change-request-log.md`、`../generated/pm-decision-log.md`

## 5. 記述ガイド

### 5.1. タイトルと概要の記述

- H1 は `プロジェクト登録簿` とし、project-register の本体であることが分かる名称にする。
- H1 の直下には英語名を 1 行で記載する（例: Project Register）。
- 英語名の直下に、ドキュメント概要を 2〜3 行で記載する。
- 概要には少なくとも「対象」「目的」「登録項目を一覧管理すること」を含め、個別項目の詳細説明は書かない。

### 5.2. 登録項目一覧の記述

- 一覧は表形式で記載する。
- タイトルは1文以内に収め、登録項目の内容を端的に示す。
- `説明` は1〜2文以内に収め、長文化する場合は個票へ分離する。
- 「個票」列にリンクを記載する場合は `[pjr-XXXX-<topic>.md](./pjr-XXXX-<topic>.md)` 形式で相対リンクを記載する。
- 個票を作成しない場合、「個票」列は `-` とする。
- 担当または期限が未定の場合は空欄にせず `_TODO_` と記載する。
- 完了、却下、決定した項目は、「完了日」に日付を記入し、「結論」に結果を1文で残す。
- 個票がある一覧行は個別登録項目の要約に留め、判断理由、経緯、対応内容は個別登録項目へ分離する。

### 5.3. type / status / priority の値

- 値は `pjr-index.schema.yaml` に定義された enum のみを使用し、表記ゆれを作らない。値の一覧は schema を正本とする。
- 各値の意味と選び方は [[specdojo-register-operation-guide]] の `type の選び方` および `状態遷移とコマンド` を参照する。

## 6. 禁止事項

- `pjr-index` に個別登録項目の詳細説明、判断理由、経緯、対応内容を長文で記載しない。
- type 別一覧、担当者別一覧、状態別一覧、優先度別一覧を `pjr-index` 本文で重複管理しない。
- `generated/` 配下の派生ビューを正本として扱わない。
- `type` / `status` / `priority` に未定義の値を使用しない。
- `説明` と `個票` の両方がない一覧行を作成しない。
- Git 管理を前提とする場合に、手書きの更新履歴を追加しない。
- 特定プロジェクト固有の例外事項を共通ルールとして記載しない。
