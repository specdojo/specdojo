---
id: pm-roles-recipe
type: recipe
status: ready
rulebook: pm-roles-rulebook
sample: pm-roles-sample
---

# ロール定義 作成レシピ

Project Role Definition Writing Recipe

本ドキュメントは、ロール定義を「PO が全 Role code とプロジェクト固有メモを承認できる内容」に仕上げるための作り方です。構造と必須項目は [[pm-roles-rulebook|ロール定義 作成ルール]] を正とし、本書では問い、深掘り手順、レビュー観点を扱います。

## 1. このレシピの使い方

- 最初に、組織定義から採用する責務語彙、最終判断の集約先、公開方針を確認する。
- 次に、`pm-roles.yaml` に列挙する Role code を、Schedule の `owner` や RACI の列として使える粒度で整理する。
- 最後に、member nickname、agent 名、個人名、兼務割り当てを混ぜず、プロジェクト固有メモだけを残す。
- schema にないメタ項目を追加しない。rulebook 参照は成果物カタログまたは計画側で解決する。

| 種別     | 役割                           | 使いどころ                                 |
| -------- | ------------------------------ | ------------------------------------------ |
| rulebook | 成果物として成立するための規約 | 構造、必須項目、禁止事項を確認する         |
| recipe   | 良い内容を書くための作り方     | 問い、深掘り、レビューに使う               |
| sample   | 完成例                         | 粒度、文体、YAML の書き方を確認する        |
| template | 記入の骨組み                   | 新規作成時にメタ項目と Role 配列を用意する |

## 2. 作成前に集める情報

| 項目                 | 集める情報                                                   |
| -------------------- | ------------------------------------------------------------ |
| 組織定義             | 採用する責務語彙、最終判断の集約先、見直し条件               |
| プロジェクト ID      | `project_id` と `id` に使う値                                |
| 採用 Role code       | Schedule の `owner` と RACI の列に使う Role code             |
| Role name            | 各 Role code の正式名称                                      |
| プロジェクト固有メモ | 当該プロジェクトで強調する責務、専任化条件、公開判断上の注意 |
| 下流文書             | `pm-members.yaml`、Schedule、RACI が参照する Role code       |
| schema               | `pm-roles.yaml` に許可されるメタ項目、Role code、型制約      |
| 公開制約             | 個人情報、連絡先、非公開組織情報を含めない条件               |

## 3. 全体の作成手順

1. `id`、`type`、`status`、`version`、`project_id` を設定する。
2. `based_on` に、ロール採用の根拠となる組織定義などの ID を記載する。
3. `roles` に、プロジェクトで使用する Role code を標準順で列挙する。
4. 各 Role に `code` と `name` を記載し、必要な場合だけ `project_note` を 1 行で添える。
5. `project_note` から member nickname、agent 名、個人名、具体的な兼務割り当てを除く。
6. schema にないキー、重複 Role code、標準外 Role code がないことを確認する。
7. PO が承認できるよう、全 Role code の過不足、公開可否、下流文書への入力適合を確認する。

## 4. 各要素の書き方

### 4.1. メタ項目

問い:

- `id` は `<project-id>:pm-roles` 形式になっているか。
- `project_id` は配置先プロジェクトと一致しているか。
- `based_on` はロール採用の根拠を指しているか。

書き方:

- `type` は `project`、`version` は整数で記載する。
- `status` は現時点の成果物状態を示す。
- 根拠 ID は、内容を実際に確認した文書だけを記載する。
- `rulebook` など schema が許可しないキーを追加しない。

### 4.2. `roles`

問い:

- Schedule の `owner` として必要な Role code が過不足なく入っているか。
- 重複した Role code や表記ゆれはないか。
- 専任 member がいない Role code でも、責務語彙として必要なら残せているか。

書き方:

- 標準順に `PO`, `PM`, `BA`, `ARC`, `DEV`, `QE`, `UX`, `OPS` を並べる。
- 独自 Role code は追加しない。
- `roles` は責務語彙の一覧であり、実行主体の一覧ではないことを意識する。
- 下流の `pm-members.yaml` や Schedule が参照する Role code を後から推測しなくてよいよう、採用する責務語彙を明示する。

### 4.3. `roles[].project_note`

問い:

- PO が承認判断するために必要なプロジェクト固有の扱いが分かるか。
- 専任化を検討する条件や公開判断上の注意が必要か。
- member nickname、agent 名、個人名、兼務割り当てを書いていないか。

書き方:

- 1 Role につき 1 行を目安にする。
- 一般的な責務の長い再掲ではなく、当該プロジェクトでの使い方を書く。
- 割り当てが必要な場合は `pm-members.yaml` に委譲する。

## 5. 深掘り手順

1. 組織定義の「採用ロールと owner 語彙」から、Role code の採用方針を抜き出す。
2. Schedule、RACI、member 定義で参照される可能性がある責務語彙を洗い出す。
3. 標準 Role code で代替できない独自コードが出ていないか確認する。
4. 各 Role の `project_note` を、責務強調、専任化条件、公開判断上の注意に分類する。
5. 実行主体や兼務割り当てに該当する記述を `pm-members.yaml` 側へ移す。
6. PO の最終判断、公開可否、説明責任が agent や member nickname に移っていないことを確認する。

## 6. 良い例 / 悪い例

| 観点                 | 良い例                                            | 悪い例                            |
| -------------------- | ------------------------------------------------- | --------------------------------- |
| Role code            | `code: PM`                                        | `code: project-manager-agent`     |
| 実行主体との分離     | 実行主体の割り当ては `pm-members.yaml` で管理する | `PM は pm-agent が担当する`       |
| プロジェクト固有メモ | 小規模運用では専任化せず、滞留時に見直す          | 必要に応じて対応する              |
| 公開可否             | 公開判断は PO に残す                              | agent が公開可否を判断する        |
| 下流入力             | `roles[].code` を Schedule の `owner` に使う      | `owner` に member nickname を使う |
| schema 適合          | メタ項目は schema が許可するキーだけにする        | `rulebook: pm-roles-rulebook`     |

## 7. レビュー観点

| 観点                   | 確認内容                                                                        |
| ---------------------- | ------------------------------------------------------------------------------- |
| 目的・スコープとの整合 | 組織定義で採用した責務語彙と矛盾していないか                                    |
| 承認判断               | PO が全 Role code と `project_note` を承認、保留、差し戻しできるか              |
| owner 語彙             | Schedule の `owner` に使う値が `roles[].code` として定義されているか            |
| スキーマ適合           | 必須メタ項目、`roles` 配列、Role code の列挙が YAML スキーマに沿っているか      |
| 公開可否               | 個人情報、連絡先、非公開情報、agent への最終判断委任が含まれていないか          |
| 下流入力               | `pm-members.yaml`、Schedule、RACI が参照できる安定した Role code になっているか |

## 8. 仕上げチェック

- [[pm-roles-rulebook|ロール定義 作成ルール]] の本文構成と禁止事項に従っている。
- `roles[].code` に必要な Role code が過不足・重複なく入っている。
- `roles[].project_note` はプロジェクト固有メモに限定され、具体的な member 割り当てを含まない。
- `pm-organization.md` の採用方針と矛盾していない。
- `pm-members.yaml` の `members[].roles` から参照できる Role code 語彙になっている。
- 公開してよい情報だけで構成され、最終判断と説明責任が人間の PO に残っている。
