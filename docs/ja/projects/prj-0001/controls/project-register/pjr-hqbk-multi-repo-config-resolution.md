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

| No  | 作業                                     | 担当 | 状態 | メモ                                                             |
| --- | ---------------------------------------- | ---- | ---- | ---------------------------------------------------------------- |
| 1   | `repos` の schema と設定の読み込み・検証 | DEV  | done | `specdojo-config.schema.yaml` を新設し、`loadConfig` で検証する  |
| 2   | `<repo>:<path>` の解決と単体テスト       | DEV  | done | `resolveRepoQualifiedRef`・`resolveRepoQualifiedPath` を追加した |
| 3   | 設定リファレンスと雛形の更新             | DEV  | done | 雛形の JSON は変えず、`config init` の案内に `repos` を加えた    |

## 4. 対応結果

- 実施内容
  - `src/specdojo-config.ts` に `repos`（`name`・`path`・`integration_branch`・`setup`）の型、`getProjectRepos`、`validateProjectRepos` を加えた。`loadConfig` は全 project の誤り（`name` の書式違反と重複、project id との重複、`path` の不在・絶対パス・非ディレクトリ、未知のキー、`setup` の型違い）を `projects.<project-id>.repos[<n>]` 付きでまとめてエラーにする。
  - `<repo>:<path>` を解決する `resolveRepoQualifiedRef`（接頭辞が宣言済みのリポジトリ名ならパス、それ以外は値を変えずに doc id またはプロジェクトリポジトリのパスとして返す）と、絶対パスへ解決する `resolveRepoQualifiedPath` を加えた。空のパス・絶対パス・リポジトリ外へ出るパスはエラーにする。
  - `docs/specdojo/schemas/v1/specdojo-config.schema.yaml` を新設した。
  - `config init` の次の手順に `repos` の案内を加え、`specdojo-config-reference` に「`repos`のキー」の章を加えた。
- 成果物: `src/specdojo-config.ts`、`docs/specdojo/schemas/v1/specdojo-config.schema.yaml`、`docs/ja/specdojo/references/specdojo-config-reference.md`、`tests/src/specdojo-config-repos.test.ts`、`tests/docs/specdojo/schemas/specdojo-config-schema.test.ts`、`tests/src/specdojo-config-command.test.ts`。
- 残課題
  - _ASSUMPTION_: `config init` の雛形 JSON には `repos` を書き込まない。存在しない `path` を宣言すると読み込みがエラーになるためで、説明は案内文とリファレンスに置いた。
  - `path` は SpecDojo ルート起点で解決するため、exec worktree の中で設定を読むと相対パスが別の場所を指す。worktree からの解決は PJR-98G4 で扱う。
  - `targets`・`paths` の解決関数を commit 対象の算出や job の plan 生成へ組み込む作業は、PJR-98G4・PJR-0WAA の範囲とした。job の `qualifyTargets` は `:` を含む値を変えないため、`app1:src/...` は現行でもそのまま渡る。
  - プロジェクトリポジトリの暗黙名（仮称 `project`）を予約名として拒否するかは未決定である。

## 5. 関連ドキュメント

- [[prj-0001:pjr-5822-multi-repo-item-design]]
