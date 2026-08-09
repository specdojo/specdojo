---
specdojo:
  id: prj-0001:pjr-tt4j-register-cli-write-to-tickets
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
---

# PJR-TT4J register CLI の読み書き先を個票 frontmatter へ変更する

## 1. 概要

[[prj-0001:pjr-es57-register-file-ssot-migration]] の分割2。register の各サブコマンドが `pjr-index.md` の表ではなく個票 frontmatter を読み書きするようにする。[[prj-0001:pjr-rf3b-register-item-frontmatter-schema]] のスキーマ定義に依存する。

## 2. 完了条件

- `add` が個票ファイルを作成し、構造化フィールドを frontmatter へ書き込む。表への行追記を行わない。
- 状態遷移（`start` / `wait` / `review` / `close` / `reject` / `defer` / `reopen`）が個票 frontmatter を更新する。
- `update` が個票 frontmatter のフィールドを更新する。
- 一覧の読み取りが必要な処理（`build`、`exec run --register`、`routine`）が個票群の走査で成立する。
- `--dry-run` が個票の変更内容を表示する。

## 3. 作業内容

| No  | 作業                                             | 担当 | 状態 | メモ                                                |
| --- | ------------------------------------------------ | ---- | ---- | --------------------------------------------------- |
| 1   | 個票の読み書きを担う共通処理を用意する           | ARC  | open | 表のパース処理からの置き換え先になる                |
| 2   | `add` を個票生成へ変更する                       | ARC  | open | 全項目が個票を持つ前提へ変える                      |
| 3   | 状態遷移コマンドを個票更新へ変更する             | ARC  | open | 遷移の妥当性検証は既存ロジックを流用する            |
| 4   | `update` を個票更新へ変更する                    | ARC  | open | -                                                   |
| 5   | 一覧を参照する周辺機能の入力を個票走査へ変更する | ARC  | open | `exec run --register` と `routine` の参照経路を含む |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-es57-register-file-ssot-migration]]: 分割元の移行タスク
- [[prj-0001:pjr-rf3b-register-item-frontmatter-schema]]: 前提となるスキーマ定義
- [[specdojo:register-operation-guide]]: 対象コマンドの現行仕様
