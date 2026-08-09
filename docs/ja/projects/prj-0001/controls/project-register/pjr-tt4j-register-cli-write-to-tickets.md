---
specdojo:
  id: prj-0001:pjr-tt4j-register-cli-write-to-tickets
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: ARC
  registered_on: "2026-08-09"
  due_on: "2026-08-31"
  completed_on: "2026-08-09"
---

# PJR-TT4J register CLI の読み書き先を個票 frontmatter へ変更する

## 1. 概要

PJR-ES57 の分割2。add・状態遷移・update が pjr-index.md ではなく個票 frontmatter を読み書きするようにする。

[[prj-0001:pjr-es57-register-file-ssot-migration]] の分割2。register の各サブコマンドが `pjr-index.md` の表ではなく個票 frontmatter を読み書きするようにする。[[prj-0001:pjr-rf3b-register-item-frontmatter-schema]] のスキーマ定義に依存する。

## 2. 完了条件

- `add` が個票ファイルを作成し、構造化フィールドを frontmatter へ書き込む。表への行追記を行わない。
- 状態遷移（`start` / `wait` / `review` / `close` / `reject` / `defer` / `reopen`）が個票 frontmatter を更新する。
- `update` が個票 frontmatter のフィールドを更新する。
- 一覧の読み取りが必要な処理（`build`、`exec run --register`、`routine`）が個票群の走査で成立する。
- `--dry-run` が個票の変更内容を表示する。

## 3. 作業内容

| No  | 作業                                             | 担当 | 状態 | メモ                                                              |
| --- | ------------------------------------------------ | ---- | ---- | ----------------------------------------------------------------- |
| 1   | 個票の読み書きを担う共通処理を用意する           | ARC  | done | `src/register-item.ts` を追加（導出・走査・frontmatter 書き込み） |
| 2   | `add` を個票生成へ変更する                       | ARC  | done | 行追記を廃止し、`--ticket` を撤去して常に個票を作る               |
| 3   | 状態遷移コマンドを個票更新へ変更する             | ARC  | done | 遷移の妥当性検証（終端状態ガード）は既存ロジックを流用            |
| 4   | `update` を個票更新へ変更する                    | ARC  | done | タイトルは H1、説明は概要段落、他は frontmatter へ書く            |
| 5   | 一覧を参照する周辺機能の入力を個票走査へ変更する | ARC  | done | `build` / `exec run --register` / `routine` を個票走査へ切替      |

## 4. 対応結果

- 個票 frontmatter を正本として読み書きする共通処理 `src/register-item.ts` を追加した。表示 ID はファイル名、タイトルは H1、説明は最初の章の段落から導出し、処理状態・分類・優先度・担当・日付・結論は frontmatter の登録項目フィールドを読む。書き込みは `specdojo:` 名前空間を YAML で読み書きし、値なしはキー削除、キー順は登録項目の並びへ正規化する。
- `register add` は個票ファイルの作成のみを行い、`pjr-index.md` へ行を追記しなくなった。全項目が個票を持つ前提になったため `--ticket` を撤去し、既存 ID との衝突は個票ファイル名と未移行の一覧行の双方から検出する。統合ブランチへの予約経路も、登録行ではなく個票を1コミットで作成する形へ変更した。
- 状態遷移（`start` / `wait` / `review` / `close` / `reject` / `defer` / `reopen`）と `update` は、対象個票の frontmatter を更新する。`reopen` は `completed_on` のキーを削除し、`close` / `reject` に伴う文書成熟度（`status`）の昇格・廃止は従来どおり行う。
- 未移行の項目（一覧行だけが存在し個票 frontmatter に登録項目フィールドが無い項目）は、読み取り時に一覧行を値として採用し、遷移・更新の際に行の値ごと個票 frontmatter へ書き出して移行する。個票ファイル自体が無い項目は書き込み先が無いため、個票の作成を促すエラーで中断する（一括移行は [[prj-0001:pjr-9p5q-migrate-existing-register-items]]）。
- 一覧を読む処理（`register build` の派生ビュー生成、`exec run --register` の対象解決、`routine` の対象抽出）を個票走査（未移行分は一覧行で補完）へ切り替えた。`pjr-index.md` は列見出しの供給元としてのみ読む。`exec run --register` の commit 対象にも対象個票を含め、状態遷移が確実に記録されるようにした。
- `--dry-run` は、個票のパスと書き込み予定のフィールド（`add` は生成予定の個票内容）を表示し、ファイルを書き換えない。

## 5. 関連ドキュメント

- [[prj-0001:pjr-es57-register-file-ssot-migration]]: 分割元の移行タスク
- [[prj-0001:pjr-rf3b-register-item-frontmatter-schema]]: 前提となるスキーマ定義
- [[specdojo:register-operation-guide]]: 対象コマンドの現行仕様
