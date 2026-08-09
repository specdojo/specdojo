---
specdojo:
  id: prj-0001:pjr-rzr3-pjr-index-as-generated-view
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: ARC
  registered_at: "2026-08-09T08:48:42Z"
  due_on: "2026-08-31"
  completed_at: "2026-08-09T10:24:53Z"
---

# PJR-RZR3 pjr-index を generated 配下の生成ビューへ移す

## 1. 概要

[[prj-0001:pjr-es57-register-file-ssot-migration]] の分割3。個票群から登録項目一覧を生成し、`pjr-index.md` を `generated/` 配下の非追跡な派生ビューへ移す。既存の派生ビュー（状態別・優先度別・担当者別、controls 全体の type 別ビュー）も同じ入力から生成されるようにする。

## 2. 完了条件

- 個票群から一覧が生成され、`generated/` 配下へ出力される。
- 出力が決定的である。同一入力から同一出力が得られ、ファイル列挙順に依存しない。
- 生成物が追跡対象から外れている。
- 既存の派生ビューが個票群を入力として生成される。
- 一覧を手編集する運用が残っていない。手編集しても次回生成で失われることが文書化されている。

## 3. 作業内容

| No  | 作業                                         | 担当 | 状態 | メモ                                                                        |
| --- | -------------------------------------------- | ---- | ---- | --------------------------------------------------------------------------- |
| 1   | 個票群を入力とする一覧生成処理を実装する     | ARC  | done | `injectRegisterRows` で template へ行を注入。ID 昇順を code unit 比較で固定 |
| 2   | 出力先を `generated/` へ変更する             | ARC  | done | `generated/pjr-index.md` を生成。`.gitignore` の既存ルールで非追跡          |
| 3   | 既存の派生ビュー生成の入力を個票群へ変更する | ARC  | done | 入力は PJR-TT4J で個票化済み。列見出しの供給元も template へ移した          |
| 4   | 文書内リンクと参照の解決先を確認する         | ARC  | done | 個票セルの相対リンクは解決可。`prj-0001:pjr-index` の解決は申し送り         |

## 4. 対応結果

- 登録項目一覧を個票から生成し、`project-register/generated/pjr-index.md` へ出力するようにした。生成処理は `specdojo register build`（および `add` / 状態遷移 / `renumber` 実行時の再生成）に含まれ、出力は `.gitignore` の `docs/**/generated/*` により非追跡である。
- 一覧の外枠（H1・注記・章構成）と列見出しは `pjr-index-template.md` が所有し、生成処理は章 1 のテーブル区切り行の直後へ行だけを差し込む（`injectRegisterRows`）。列名を定数として持たないため、一覧の言語は template の差し替えで切り替えられる。
- 列見出しの供給元を作業ツリーの `pjr-index.md` から template へ移した。これにより生成処理は追跡対象の `pjr-index.md` を入力にしなくなり、`register build` も同ファイルの存在を要求しない（要求するのは登録簿ディレクトリの存在のみ）。
- 出力の決定性を担保するため、並び替えを `localeCompare`（ICU の照合順に依存）から表示 ID の code unit 比較（`compareRegisterItemIds`）へ変更した。個票の走査は `readdir` 後に必ずソートするため、ファイル列挙順は出力に影響しない。同一入力で 2 回生成し、6 ファイルすべてが同一ハッシュになることを確認した。
- 既存の派生ビュー（台帳ビュー、controls 全体の type 別ビュー）の入力は [[prj-0001:pjr-tt4j-register-cli-write-to-tickets]] の時点で個票へ移っていた。本作業では雛形の再生成注記が `pjr-index.md` を正本と記していた誤りを、個票 Frontmatter を正本とする記述へ修正した。
- `register scaffold` は追跡対象の `pjr-index.md` を作らず、登録簿ディレクトリの作成と `generated/` 配下の初回生成のみを行うようにした。新規プロジェクトで手編集前提の一覧が生まれる経路をなくした。手編集が次回生成で失われることは、生成物の冒頭注記と [[specdojo:register-operation-guide]] の「派生ビューの扱い」に記載した。
- 参照の解決先を確認した。一覧の個票セルは `generated/` 起点へ相対パスを付け替えており、生成物から個票へ辿れる。一方 `docs/**/generated/` は doc-index の走査対象外のため、`prj-0001:pjr-index` を解決できるのは現時点では追跡対象の `pjr-index.md` だけである。同 ID は個票 60 件の `part_of` と wikilink 10 箇所から参照されているため、追跡ファイルの削除時に解決手段を用意する必要がある（申し送り）。
- 移行中の状態として、追跡対象の `pjr-index.md` は未移行項目（186 件中 185 件。個票 Frontmatter に `item_status` を持つのは本項目のみ）の唯一の値の持ち主であるため残置した。生成処理はこの行を互換入力として読み、生成物へ含める。同ファイルの削除は [[prj-0001:pjr-9p5q-migrate-existing-register-items]] で全項目を個票化した後に行う。

## 5. 関連ドキュメント

- [[prj-0001:pjr-es57-register-file-ssot-migration]]: 分割元の移行タスク
- [[prj-0001:pjr-rf3b-register-item-frontmatter-schema]]: 生成の入力となるスキーマ定義
- [[specdojo:directory-layout-reference]]: 生成物の配置規約
