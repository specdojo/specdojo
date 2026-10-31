---
specdojo:
  id: prj-0001:pjr-bnmv-product-repo-git-workflow
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-31T02:38:33Z"
  due_on: "2026-11-30"
---

# PJR-BNMV プロダクトのリポジトリの commit とブランチの形を運用に合わせて選べるようにする

## 1. 背景

git-flow や GitHub flow など任意の運用に合わせ、プロダクトのリポジトリの作業ブランチの名前、commit の 1 行目、merge commit、統合の形を設定で選べるようにし、commit の type を項目ごとに指定できるようにする方針を決める

## 2. 検討した選択肢

| 選択肢 | 内容   | 利点   | 懸念   |
| ------ | ------ | ------ | ------ |
| A      | _TODO_ | _TODO_ | _TODO_ |

## 3. 決定内容

_TODO_: 採択した内容を明確に記載する。

## 4. 採択理由

- _TODO_: 判断根拠を記載する。

## 5. 承認

| 項目     | 内容   |
| -------- | ------ |
| 決定者   | _TODO_ |
| 決定日   | _TODO_ |
| 承認方式 | _TODO_ |
| 証跡     | _TODO_ |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 6. 影響範囲とフォローアップ

| 項目       | 内容   |
| ---------- | ------ |
| 影響範囲   | _TODO_ |
| 必要な対応 | _TODO_ |
| 追跡先     | _TODO_ |

## 7. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。

## 入力

- 対象は SpecDojo の記録とは別のプロダクトのリポジトリ（repos で宣言したもの）だけ。記録と同じリポジトリでは今の exec(register ...) の形のままでよい
- git-flow だけでなく、GitHub flow など任意の運用に対応したい。見た目は各運用のとおりにし、commit の 1 行目に exec(register PJR-XXXX) を入れず、項目の ID は本文に入れる
- commit の type（feat・fix など）は項目ごとに選びたい
- git-flow のブランチ名は feature/{topic} とする。ブランチ名が別の項目のものと重なったら run の開始時に止め、topic を変えるか名前を指定するよう案内する（自動の連番は付けない）
