---
specdojo:
  id: prj-0001:pjr-cyg0-editorial-review-approach
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-11-03T23:50:48Z"
  due_on: "2026-11-30"
  commit_type: docs
  commit_scope: register
---

# PJR-CYG0 冗長さを抜き出して原因を分ける review approach（editorial-review）の仕様を決める

## 1. 背景

人の代わりに成果物の冗長さを箇所ごとに抜き出し、原因を「この文書だけ」と「Kata が原因」に分け、磨き込みと Kata の手入れの段へ渡す review approach の名前、指摘の書式、渡し方、判定の基準を決める

## 2. 入力

- 利用者の課題: agent が作る文書は冗長なことが多い。review task で冗長な部分を抽出して磨き込みで直したい。冗長な記述のレビューは専用の人間代替の review approach を新設し、Kata の maintenance に回したい（2026-11-04）
- 既存の仕組み: rulebook / recipe / sample / template-maintenance は review result や finding を根拠に Kata を見直す作りだが、schedule に明示した段でしか動かない。成果物の review の指摘を Kata が原因かその文書だけの問題かに分けて手入れへ渡す仕組みはない（ryu-guide の「実践の型メンテナンスの進め方」、2026-11-04）
- 案: 新しい approach（仮名 editorial-review）は、冗長さ（重複、表と本文の二重の説明、図をなぞる文、目的に要らない背景など）を箇所ごとに抜き出し、直し方の案（削る・まとめる・参照に置き換える）と原因の分類（この文書だけ／Kata が原因。Kata の場合はどの Kata か）を付ける。この文書だけの指摘は fully-guided の磨き込みへ、Kata が原因の指摘は対象の Kata の手入れの段へ渡す（2026-11-04）
- 論点: 名前、指摘の書式と原因の分類、手入れと磨き込みの段への渡し方（plan への取り込み）、冗長さの判定の基準を何に置くか（standards・rulebook・review の観点）、grade や既存の review との役割の分け方（2026-11-04）

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
