---
specdojo:
  id: prj-0001:pjr-epq3-changelog-from-register-handoff
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: medium
  registered_at: "2026-11-08T04:02:27Z"
---

# PJR-EPQ3 CHANGELOG は各項目が直接書かず、個票の申し送りからリリースでまとめる

## 1. 背景

各項目が CHANGELOG.md の未公開の節へ直接書くと、並べて流したときに統合で衝突する。各項目は個票の対応結果に「CHANGELOG に書く事項」を書き、リリースの todo が close 済みの項目から集めて CHANGELOG を書く

## 2. 入力

- 2026-11-08 に、型の手入れ 5 件などで CHANGELOG の衝突による停止が 3 回あった。
- 案 A（個票の申し送り）・案 B（断片のファイル）・案 C（今のまま）のうち、A を採る（indie が推奨どおりと決定、2026-11-08）。

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
