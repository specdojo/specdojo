---
specdojo:
  id: prj-0001:pjr-bnmv-product-repo-git-workflow
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: decided
  priority: medium
  owner: DEV
  registered_at: "2026-10-31T02:38:33Z"
  due_on: "2026-11-30"
  completed_at: "2026-10-31T02:41:49Z"
  conclusion: 案 A を採る。プロダクトのリポジトリごとの設定で作業ブランチの名前・commit の 1 行目・merge commit の書式と統合の形（merge・branch-only・ff）を選べるようにし、commit の type と scope は個票で項目ごとに持つ。git-flow の例は feature/{topic} とし、ブランチ名が別の項目と重なったら run の開始時に止める
---

# PJR-BNMV プロダクトのリポジトリの commit とブランチの形を運用に合わせて選べるようにする

## 1. 背景

プロダクトのリポジトリ（`repos` で宣言したもの）へ exec が積む commit は、1 行目が `exec(register <ID>): <タイトル>` に、merge commit のメッセージも同じ形に、作業ブランチの名前が `exec/<project-id>-<ID>` に、コードで固定されている。統合先は `integration_branch` と `--integration-branch` で feature ブランチにできるが、履歴の見た目は git-flow や GitHub flow にならない。

git-flow や GitHub flow など任意の運用に合わせて見た目を選べるようにし、commit の type を項目ごとに指定できるようにする方針を決める。

## 2. 検討した選択肢

| 選択肢 | 内容                                                                                                                             | 利点                                                   | 懸念                                                                     |
| ------ | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------ |
| A      | `repos[]` の設定で、作業ブランチの名前・commit の 1 行目・merge commit の書式と統合の形を選べるようにし、type は個票の項目で持つ | 運用ごとに見た目を合わせられる。設定がなければ今と同じ | runner が `exec/` の名前に頼る処理を、記録での対応に置き換える必要がある |
| B      | `branch-only` で作業ブランチを残し、利用者が手で feature ブランチへ squash merge する                                            | 実装が要らない                                         | 毎回の手作業が増え、ブランチ名は `exec/` のまま                          |
| C      | commit の 1 行目だけ設定で変えられるようにする                                                                                   | 変更が小さい                                           | ブランチ名と merge commit が運用に合わない                               |

## 3. 決定内容

A を採る。対象はプロダクトのリポジトリだけとし、SpecDojo の記録のリポジトリの記帳の commit（`exec(register ...)`）は変えない。設定がない場合は今と同じ動きにする。

- 作業ブランチの名前: `repos[].branch_template` で指定する。既定は `exec/{project}-{id}`。例: git-flow は `feature/{topic}`、GitHub flow は `{type}/{topic}`。
- commit の 1 行目: `repos[].commit_subject_template` で指定する。例: `{type}({scope}): {title}`、`{type}: {title}`。本文の末尾の `Refs: <project-id>:<ID>` は常に付ける。
- merge commit: `repos[].merge_message_template` で指定する。既定は git の標準の `Merge branch '{branch}' into {target}` に `Refs:` を付けたもの。
- 使える変数: `{id}`（登録簿の項目の ID）・`{project}`・`{topic}`・`{type}`・`{scope}`・`{title}`・`{branch}`・`{target}`。
- 項目ごとの type: 個票に `commit_type` と任意の `commit_scope` を持たせ、`register add` / `update` の `--commit-type` / `--commit-scope` で指定する。指定がなければ項目の type から決め（`issue` は `fix`、`todo`・`change-request` は `feat`）、この対応も設定で変えられるようにする。
- 統合の形: 今の `merge`・`branch-only` に `ff`（merge commit を作らず早送りで積む）を足す。
- ブランチ名の重なり: run の開始時に、同じ名前のブランチが別の項目のものとしてあれば止め、topic を変えるか `--branch` で名前を指定するよう案内する。自動の連番は付けない。同じ項目の再開では同じブランチを使い続ける。テンプレートが `{id}` も `{topic}` も含まない場合は設定エラーにする。
- run と作業ブランチの対応は、ブランチ名の接頭辞ではなく runner の記録で持つ。

## 4. 採択理由

- 利用者の前提（個票の `入力`）は、任意の運用に合わせた見た目と、項目ごとの type の選択である。B と C ではブランチ名か merge commit が運用に合わない。
- 設定をプロダクトのリポジトリごとに持てば、git-flow と GitHub flow のリポジトリを同じ project で扱える。
- git-flow のブランチ名は中身で付けるのが普通で、ID は commit の本文の `Refs:` でたどれる。
- ブランチ名の重なりで止める形にすると、ブランチ名と PR の名前がいつも狙いどおりになる。

## 5. 承認

| 項目     | 内容                                                                                                   |
| -------- | ------------------------------------------------------------------------------------------------------ |
| 決定者   | indie                                                                                                  |
| 決定日   | 2026-10-31                                                                                             |
| 承認方式 | commit                                                                                                 |
| 証跡     | 2026-10-31 の対話で indie が案 A と重なりの扱い（止める）を承認し、本個票の close の commit で記録した |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 6. 影響範囲とフォローアップ

| 項目       | 内容                                                                                                                                                                                     |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 影響範囲   | `specdojo.config.json` の `repos[]` の schema と設定リファレンス、個票の frontmatter と `register add` / `update`、exec の作業ブランチの作成・再開・片付け、プロダクト側の commit と統合 |
| 必要な対応 | 決定後に todo を 3 件に分けて起票する: 項目の `commit_type`・`commit_scope`、commit と merge commit の書式、作業ブランチの名前の書式と記録での対応・重なりの検査・`ff` の統合（hard）    |
| 追跡先     | 決定後に起票する todo                                                                                                                                                                    |

## 7. 関連ドキュメント

- [[specdojo:specdojo-config-reference]]
- [[specdojo:command-reference]]

## 入力

- 対象は SpecDojo の記録とは別のプロダクトのリポジトリ（repos で宣言したもの）だけ。記録と同じリポジトリでは今の exec(register ...) の形のままでよい
- git-flow だけでなく、GitHub flow など任意の運用に対応したい。見た目は各運用のとおりにし、commit の 1 行目に exec(register PJR-XXXX) を入れず、項目の ID は本文に入れる
- commit の type（feat・fix など）は項目ごとに選びたい
- git-flow のブランチ名は feature/{topic} とする。ブランチ名が別の項目のものと重なったら run の開始時に止め、topic を変えるか名前を指定するよう案内する（自動の連番は付けない）
