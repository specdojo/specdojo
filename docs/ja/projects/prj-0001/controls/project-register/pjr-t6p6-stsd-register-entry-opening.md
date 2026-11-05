---
specdojo:
  id: prj-0001:pjr-t6p6-stsd-register-entry-opening
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-05T13:07:08Z"
  derived_from:
    - PJR-3APD
    - PJR-VNT1
  depends_on:
    - PJR-SWRE
    - PJR-P9SW
  approach: fully-guided
  targets:
    - prj-0001:stsd-register-entry
---

# PJR-T6P6 stsd-register-entry の冒頭と図の表示名を新しい Kata に合わせる

## 1. 概要

stsd-register-entry の「概要」を頭書き・目的・適用範囲に分け、状態遷移図の表示名を状態名と値の 2 行にする。内容は変えない

## 2. 入力

- PJR-VNT1 の決定に合わせて手入れした stsd の Kata（PJR-F1FD・PJR-NEPD・PJR-YSST・PJR-SWRE・PJR-P9SW）に合わせる。状態・遷移・条件などの中身は schedule の磨き込み・condense・review を通った内容を保つ

## 3. 完了条件

- [[stsd-register-entry]] の冒頭が、H1 直下の 1〜2 行の頭書き、「1. 目的」「2. 適用範囲」になっている。これまでの「概要」の内容は、意味を変えずに目的か適用範囲へ移している（落とさない、足さない）。
- 状態遷移図の表示名が、値がある状態は`状態名<br>値`、値が `-` の状態は状態名だけになっている。2 行目の値は状態一覧の値と一致する。分割図で共有する状態は同じ表示名である。
- 状態・遷移・遷移 ID・条件の数と中身は変えていない（schedule の磨き込み・condense・review を通った内容を保つ）。章番号が変わったことによる本文中の章の参照は、章のタイトルで直している。
- `stsd-register-entry` 以外の成果物と Kata は変えていない。
- `npm run -s lint:md`・`npm run -s lint:fm`・`npm run -s lint:mermaid` が通っている。

## 4. 作業内容

| No  | 作業                                 | 担当 | 状態 | メモ |
| --- | ------------------------------------ | ---- | ---- | ---- |
| 1   | 冒頭を頭書き・目的・適用範囲に分ける | BA   | open | -    |
| 2   | 図の表示名を直し、検査を通す         | BA   | open | -    |

## 5. 対応結果

- 対象成果物の概要を頭書き・目的・適用範囲へ移し、章番号と本文の参照を更新した。三図の表示名を状態一覧に合わせて `状態名<br>値` に変更し、8 状態・40 遷移の内容を保持した。
- 主 rulebook を章構成、Mermaid rulebook を表示名の基準とし、recipe の冒頭分離と図表照合の手順を適用した。sample は形式確認だけに用いた。プロジェクト概要の `BV-03` と人間の判断責任に関する既存記述を保持し、内容の追加・削除・統合は行っていない。両共通規約と hook 設定を確認し、親 runner 担当の lint・test は executor で重複実行しない。result は reporter が記入する。
- F001・F002・F003 は未解消。PJR の実 ID・日程・Schedule への接続は宣言資料から確定できず、内容保持の条件に従って既存の `M-01`・`M-04` を維持した。PM が issue・decision・必要な change-request と辞書作成作業を登録し、追跡先・順序・完了条件・後続作業への影響を接続する。
- F004・F006 は未解消。夜間の事前承認と事後 review 後の自動 close は既存の責任境界・遷移条件を変えるため本件では追加しない。指摘中の運用ガイド本文は宣言参照外であり未参照。次のタスクで参照を宣言し、PO・BA が通常経路との承認・証跡条件を合意する。
- F005・F009・F010・F011 は未解消。未作成と宣言された `bdd-register-entry` の内容を推測せず、既存の依存不足と検討メモを保持した。BA が辞書を作成・照合し、PM が依存解消作業へ接続した後、許可された `based_on` の反映と完成判定を行う。F009 の直接終端遷移に関する指摘についても、現在の 40 遷移を保持し、追加の業務条件は別途合意する。
- F007 は未解消。具体的な test・schema のパスを裏付ける定義本体は宣言参照外であり未参照。DEV・QE が次のタスクで参照を宣言し、実在する検証コマンド・パスと T-ID の対応を確認する。
- F008 は未解消。再開・却下・延期・`note` の差異を解消する業務判断は本件の内容保持条件を超えるため、`M-01` の判断待ちを維持した。PO・ARC・QE が強制方針と経路を合意し、図表・実装・受入条件を同時に更新して DC-001〜DC-005 を再判定する。
- 対象 frontmatter の `based_on` は空で、追加の根拠文書はない。実装エビデンス 5 ファイルは業務内容を変更しないため未参照。template、未宣言のプロジェクト文書・実装・外部情報は参照せず、Kata と他の成果物、grade result サイドカー、登録項目の状態・履歴は変更していない。
- 検証: Prettier 整形、編集前後の内容保持確認、catalog 検証、履歴リンク検証が成功した。内容保持確認では冒頭・全本文・8 状態・40 遷移・T-ID 行・三図の表示名・frontmatter を照合した。catalog 検証には未作成成果物の警告がある。`lint:md`・`lint:fm`・`lint:mermaid` を含む指定の親検証は runner 実行待ちである。

## 6. 関連ドキュメント

- [[stsd-register-entry]]: 対象の成果物
- [[specdojo:stsd-rulebook]]・[[specdojo:stsd-mermaid-rulebook]]: 手入れした Kata（PJR-VNT1）
