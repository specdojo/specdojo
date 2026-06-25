---
id: pm-members-recipe
type: recipe
status: ready
rulebook: pm-members-rulebook
sample: pm-members-sample
---

# メンバー定義 作成レシピ

Project Member Roster Writing Recipe

本ドキュメントは、メンバー定義を「PO が実行主体と担当 Role code の対応を承認できる内容」に仕上げるための作り方です。構造と必須項目は [[pm-members-rulebook|メンバー定義 作成ルール]] を正とし、本書では問い、深掘り手順、レビュー観点を扱います。

## 1. このレシピの使い方

- 最初に、組織定義とロール定義から、採用する Role code、最終判断の集約先、公開方針を確認する。
- 次に、実行ログに残す必要がある人間と agent を洗い出し、各 member の `roles` に対応 Role code を割り当てる。
- 最後に、member nickname、Role code、Schedule の `owner` を混同せず、公開してよい情報だけを残す。

| 種別 | 役割 | 使いどころ |
| --- | --- | --- |
| rulebook | 成果物として成立するための規約 | 構造、必須項目、禁止事項を確認する |
| recipe | 良い内容を書くための作り方 | 問い、深掘り、レビューに使う |
| sample | 完成例 | 粒度、文体、YAML の書き方を確認する |
| template | 記入の骨組み | 新規作成時にメタ項目と Member 配列を用意する |

## 2. 作成前に集める情報

| 項目 | 集める情報 |
| --- | --- |
| 組織定義 | 最終判断の集約先、agent 委任範囲、公開方針 |
| ロール定義 | `members[].roles` に使える Role code の一覧 |
| プロジェクト ID | `project_id` と `id` に使う値 |
| 人間 member | 最終判断を担う人間、兼務する Role code、公開可能な表示名 |
| agent member | 実行モード、能力、実行コマンド、優先度、品質 tier |
| 実行ログ | 既に使われた nickname と、変更してはいけない値 |
| 公開制約 | 個人情報、連絡先、非公開組織情報、認証情報を含めない条件 |

## 3. 全体の作成手順

1. `id`、`type`、`status`、`rulebook`、`version`、`project_id` を設定する。
2. `based_on` に、組織定義、ロール定義など実際に確認した根拠 ID を記載する。
3. `members` に、人間の最終判断主体を少なくとも 1 件記載する。
4. 実行に使う agent を列挙し、`mode`、`proficiency`、`priority`、`capabilities`、`command` を確認する。
5. 各 member の `roles` が `pm-roles.yaml` に存在する Role code だけで構成されているか確認する。
6. `rules` に、`owner`、`roles`、`--by` の使い分け、agent の支援範囲、公開制約を記載する。
7. PO が承認できるよう、実行主体の過不足、公開可否、説明責任の所在を確認する。

## 4. 各要素の書き方

### 4.1. メタ項目

問い:

- `id` は `<project-id>:pm-members` 形式になっているか。
- `project_id` は配置先プロジェクトと一致しているか。
- `based_on` は member 割り当ての根拠を指しているか。

書き方:

- `type` は `project`、`version` は整数で記載する。
- `rulebook` には `pm-members-rulebook` を記載する。
- 根拠 ID は、内容を実際に確認した文書だけを記載する。

### 4.2. `members`

問い:

- 実際に `specdojo exec --by` で指定される主体が入っているか。
- 人間の最終判断主体が明示されているか。
- agent の支援範囲と実行条件が読み取れるか。

書き方:

- 人間 member と agent member を混在させてよいが、`type` で必ず区別する。
- 最終判断を担う人間は、`note` に承認・公開可否・説明責任の扱いを記載する。
- agent は、支援範囲を `persona`、`focus`、`capabilities`、`mode` で表す。

### 4.3. `members[].roles`

問い:

- 各 Role code は `pm-roles.yaml` の `roles[].code` に存在するか。
- 兼務が必要な人間 member には、対応 Role code が過不足なく入っているか。
- 汎用 agent の `roles: []` を、承認責任の空白として扱っていないか。

書き方:

- Role code は大文字の標準表記で記載する。
- 汎用 agent は `roles: []` としてよいが、実行時にはタスク `owner` または plan で対象 Role を補う。
- Schedule の `owner` に member nickname を書く代替として `roles` を使わない。

### 4.4. agent 用フィールド

問い:

- `mode` は edit / review のどちらに対応するか。
- `proficiency` と `priority` は scheduler の選択条件として使えるか。
- `command` に秘密情報や個人環境依存のパスを含めていないか。

書き方:

- `command` は runner が実行できるコマンドを 1 行で記載する。
- `capabilities` は `web_search` などのツール能力に限定する。
- agent の `note` には、最終判断を持たないことを明示する。

## 5. 深掘り手順

1. 組織定義から、PO が最終判断する範囲と agent 委任範囲を抜き出す。
2. ロール定義から、`members[].roles` に使える Role code を一覧化する。
3. 実行ログ、Schedule、既存 event から、使われている nickname を確認する。
4. 各 member を「人間の最終判断主体」「Role 固定 agent」「汎用 agent」「review agent」に分類する。
5. agent ごとに、mode、proficiency、priority、capabilities、command の不足を確認する。
6. 公開文書に残してよい表示名、連絡先、コマンドだけになっているか確認する。
7. PO 以外に最終承認、公開可否、説明責任が移っていないことを確認する。

## 6. 良い例 / 悪い例

| 観点 | 良い例 | 悪い例 |
| --- | --- | --- |
| nickname | `codex-edit-agent` | `Codex Expert Edit Agent` |
| roles | `roles: [PO, PM, OPS]` | `owner: po` |
| 汎用 agent | `roles: []` とし、実行時の owner で文脈を補う | `roles` 未記載のまま承認責任を曖昧にする |
| agent の責務 | 草案作成と整合確認を支援し、承認しない | agent が公開可否を判断する |
| command | 認証情報を含まない CLI コマンド | トークンや秘密鍵を含むコマンド |
| 公開可否 | `email: null` とし、公開不要な個人情報を出さない | 私用メールアドレスを公開する |

## 7. レビュー観点

| 観点 | 確認内容 |
| --- | --- |
| 目的・スコープとの整合 | 組織定義で採用した運用規模と agent 委任方針に合っているか |
| 承認判断 | PO が実行主体、兼務、agent 支援範囲を承認、保留、差し戻しできるか |
| Role code 整合 | `members[].roles` が `pm-roles.yaml` の `roles[].code` に存在するか |
| 実行可能性 | `--by` に指定する nickname と、agent 実行に必要な情報が揃っているか |
| 公開可否 | 個人情報、非公開情報、認証情報、agent への最終判断委任が含まれていないか |
| 下流入力 | scheduler、exec run、実行ログが参照できる安定した member 台帳になっているか |

## 8. 仕上げチェック

- [[pm-members-rulebook|メンバー定義 作成ルール]] の本文構成と禁止事項に従っている。
- [[pm-members-sample|メンバー定義 sample]] と同程度の粒度で、人間と agent の違いが分かる。
- `members[].roles` に未定義 Role code、member nickname、人名、agent 名が混ざっていない。
- agent の `command` に秘密情報や個人環境に閉じた値が含まれていない。
- `pm-organization.md` と `pm-roles.yaml` の方針と矛盾していない。
- 公開してよい情報だけで構成され、最終判断と説明責任が人間の PO に残っている。
