---
specdojo:
  id: specdojo:pm-members-recipe
  type: recipe
  status: ready
  rulebook: specdojo:pm-members-rulebook
  sample: specdojo:pm-members-sample
---

# メンバー定義 作成レシピ

Project Human Member Roster Writing Recipe

人間の実行主体と Role code の対応を `pm-members.yaml` に整理し、agent の実行定義を保護設定へ混在させないための作成手順です。

## 1. このレシピの使い方

- 組織定義とロール定義から、人間が担う最終判断と使用可能な Role code を確認します。
- 実行ログへ残す人間の nickname、公開可能な表示名、兼務を整理します。
- agent の provider、能力、優先度、command は `.specdojo/agent-members.yaml` へ分離します。
- 既存名簿に agent がある場合は、手編集より先に移行コマンドの dry-run を確認します。

## 2. 作成前に集める情報

| 項目        | 集める情報                                                   |
| ----------- | ------------------------------------------------------------ |
| 組織定義    | 最終判断の集約先、公開方針、兼務方針                         |
| ロール定義  | `members[].roles` に使える Role code                         |
| 人間 member | 安定 nickname、公開可能な表示名・連絡先、対応 Role code      |
| 実行ログ    | 既に使われ、変更してはいけない nickname                      |
| agent 定義  | 人間 nickname と重複しないことを確認するための nickname 一覧 |
| 公開制約    | 個人情報、私用連絡先、非公開組織情報を含めない条件           |

## 3. 全体の作成手順

1. `project_id`、成果物 ID、`based_on` を確定します。
2. 人間の実行主体だけを列挙し、`type: human` とします。
3. `pm-roles.yaml` と照合して各 member の `roles` を割り当てます。
4. 実行ログと `.specdojo/agent-members.yaml` を確認し、nickname の重複と改名を避けます。
5. 非公開の連絡先は `null` にし、最終判断範囲を `note` に簡潔に記載します。
6. schema 検証で agent 用フィールドや未定義キーが混入していないことを確認します。

## 4. 深掘りする問い

### 4.1. 実行主体

- 人間として最終判断、受入、公開可否を担う主体は誰ですか。
- 人物が交代しても意味が変わらない nickname になっていますか。
- 兼務する Role code は責務正本と一致していますか。
- 公開できない個人情報を推測で補っていませんか。

### 4.2. agent との境界

- `type: agent`、`provider`、`command`、`mode`、`stage_role` が名簿に残っていませんか。
- 人間 nickname が repository 共通の agent nickname と重複していませんか。
- agent の追加・優先度変更を通常成果物の編集として扱っていませんか。
- 既存 agent の移行には `specdojo config migrate-members --dry-run` を先に使いましたか。

### 4.3. Role と履歴

- `roles` は `pm-roles.yaml` に存在する値だけですか。
- Schedule の `owner` と member nickname を混同していませんか。
- 実行ログに記録済みの nickname を変更していませんか。
- nickname を廃止する場合も履歴参照を維持できる記録がありますか。

## 5. レビュー観点

| 観点             | 確認内容                                                      |
| ---------------- | ------------------------------------------------------------- |
| schema           | `pm-members.schema.yaml` に適合し、人間だけを含む             |
| Role code        | `members[].roles` がロール定義と一致する                      |
| nickname         | project 内と agent 定義との合成後に一意で、履歴上安定している |
| 責任境界         | 人間の最終判断と agent の実行支援が混在していない             |
| 公開適性         | 私用連絡先、秘密情報、非公開組織情報を含まない                |
| トレーサビリティ | 組織定義、ロール定義、変更記録から割り当て理由を追える        |

## 6. 完了チェック

- `members[]` はすべて `type: human` です。
- nickname、`display_name`、`roles` が全 member にあります。
- agent 用の選択属性と起動設定は含まれていません。
- `pm-members.schema.yaml` の検証を通過します。
- agent 定義と合成したとき nickname が重複しません。
- 最終判断と公開可否を担う人間の範囲が読み取れます。
