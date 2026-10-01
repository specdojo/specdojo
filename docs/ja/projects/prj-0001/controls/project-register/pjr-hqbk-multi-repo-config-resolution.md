---
specdojo:
  id: prj-0001:pjr-hqbk-multi-repo-config-resolution
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  owner: DEV
  registered_at: "2026-10-01T03:53:32Z"
---

# PJR-HQBK 複数リポジトリの宣言と targets・paths の解決

## 1. 概要

specdojo.config.json の project にリポジトリの宣言を加え、task の targets と job の paths をリポジトリ付き（例: app1:src/...）で解決する（v0.3.0）

## 2. 完了条件

- 方針は [[prj-0001:pjr-5822-multi-repo-item-design]] の決定内容に従う。変更箇所は同個票の「現行実装の変更箇所」を起点にする。
- `specdojo.config.json` の project に `repos`（`name`・`path`・`integration_branch`・`setup`）を宣言でき、schema（`docs/specdojo/schemas/v1/` の config schema）と設定の読み込みで検証する。`name` は `[a-z0-9-]`、`path` は SpecDojo ルートからの相対パスとする。
- リポジトリ名と project id の重複、`name` の重複、存在しない `path` を、対象と原因を示すエラーにする。
- `targets`・`paths` の `<repo>:<path>` を解決する関数があり、接頭辞が宣言済みのリポジトリ名ならそのリポジトリのパス、それ以外は doc id として扱う。この規則の単体テストがある。
- `config init` の雛形と `specdojo-config-reference` に `repos` の説明がある。
- 宣言（`repos`）を持たない project の動作が変わらないことを、既存のテストと回帰テストで確かめる。
- `.specdojo/exec-defaults.yaml`・`package.json` など agent が変更できない設定は変更しない。必要な変更は result の申し送りに書く。
- 親検証（lint・test・typecheck・validate-schema）がすべて通る。

## 3. 作業内容

| No  | 作業                                     | 担当 | 状態 | メモ |
| --- | ---------------------------------------- | ---- | ---- | ---- |
| 1   | `repos` の schema と設定の読み込み・検証 | DEV  | open | -    |
| 2   | `<repo>:<path>` の解決と単体テスト       | DEV  | open | -    |
| 3   | 設定リファレンスと雛形の更新             | DEV  | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-5822-multi-repo-item-design]]
