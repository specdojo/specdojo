---
specdojo:
  id: prj-0001:pjr-gh26-ledger-review-alternative
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
---

# PJR-GH26 台帳の差分レビュー代替手段を決めて実装する

## 1. 概要

[[prj-0001:pjr-es57-register-file-ssot-migration]] の分割8。一覧が生成物となり追跡対象から外れることで、台帳全体の変更を1ファイルの差分で追えなくなる。これは [[prj-0001:pjr-9y7g-register-item-file-as-ssot]] で選択肢 B の懸念として挙げた点であり、成立条件として代替手段を決めることが求められている。

## 2. 完了条件

- 台帳の変更を確認する手段が決まっている。個票の履歴で追う、pull request で frontmatter 差分を確認する、一覧表示コマンドを用意する等の選択肢が比較されている。
- 選定した手段が実装または運用手順として整備されている。
- 手段が [[specdojo:register-operation-guide]] へ記載され、いつ何を見れば台帳の変化を追えるかが分かる。
- 監査時に、ある期間の登録項目の追加・状態遷移を再構成できる。

## 3. 作業内容

| No  | 作業                                 | 担当 | 状態 | メモ                                             |
| --- | ------------------------------------ | ---- | ---- | ------------------------------------------------ |
| 1   | 代替手段の選択肢を洗い出して比較する | ARC  | open | 確認の容易さ、実装コスト、監査への耐性で比較する |
| 2   | 採用する手段を決める                 | ARC  | open | 決定内容は本個票へ記録する                       |
| 3   | 実装または運用手順を整備する         | ARC  | open | 一覧表示コマンドを採る場合は CLI へ追加する      |
| 4   | 運用ガイドへ反映する                 | ARC  | open | -                                                |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-es57-register-file-ssot-migration]]: 分割元の移行タスク
- [[prj-0001:pjr-9y7g-register-item-file-as-ssot]]: 代替手段の決定を成立条件とした決定
- [[prj-0001:pjr-rzr3-pjr-index-as-generated-view]]: 一覧が非追跡になる変更
- [[specdojo:register-operation-guide]]: 反映先の運用手順
