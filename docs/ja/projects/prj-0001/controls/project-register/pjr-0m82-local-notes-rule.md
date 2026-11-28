---
specdojo:
  id: prj-0001:pjr-0m82-local-notes-rule
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: medium
  registered_at: "2026-11-28T08:33:41Z"
---

# PJR-0M82 個人のメモは git の管理外の /local に置く

## 1. 背景

登録簿の note にするほどでもないメモの置き場を、git の管理外の /local に決める。文書・個票・完了条件から参照せず、共有する価値が出たら note か該当する文書へ移す

## 2. 入力

- 利用者の問い（2026-11-28）: note より軽いメモの置き場の決まりがない。notes/ か local-notes/ を作る案があり、git の対象にすべきかを知りたい
- オーケストレーターの推奨: 既にある /local（.gitignore 済み）を使い、git に入れた notes/ は作らない。共有の記録が登録簿と二重になり、理解の負債を増やすため
- 決まりの案: 事実の根拠にしない / 共有する価値が出たら note などへ移して消す / exec run --worktree の worktree には git の管理外のファイルが入らないため、agent の材料は git の管理下に置く / 秘密を書かない
- indie が推奨どおりの起票を指示した（2026-11-28）。担当と期限は未定

## 3. 検討した選択肢

| 選択肢 | 内容   | 利点   | 懸念   |
| ------ | ------ | ------ | ------ |
| A      | _TODO_ | _TODO_ | _TODO_ |

## 4. 決定内容

_TODO_: 採択した内容を明確に記載する。

## 5. 採択理由

- _TODO_: 判断根拠を記載する。

## 6. 承認

| 項目     | 内容   |
| -------- | ------ |
| 決定者   | _TODO_ |
| 決定日   | _TODO_ |
| 承認方式 | _TODO_ |
| 証跡     | _TODO_ |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 7. 影響範囲とフォローアップ

| 項目       | 内容   |
| ---------- | ------ |
| 影響範囲   | _TODO_ |
| 必要な対応 | _TODO_ |
| 追跡先     | _TODO_ |

## 8. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
