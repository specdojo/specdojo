---
specdojo:
  id: prj-0001:pjr-87xs-code-workspace-scaffold
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  owner: DEV
  registered_at: "2026-10-12T09:00:53Z"
  due_on: "2026-10-31"
---

# PJR-87XS repos の設定から VS Code のマルチルートワークスペースを作れるようにする

## 1. 概要

別リポジトリ構成では、プロジェクトリポジトリとプロダクトリポジトリを VS Code で同時に開く必要がある。repos の宣言から `<project-id>.code-workspace` を作る機能（config scaffold など）を加え、利用者が手で書かなくて済むようにする

## 2. 完了条件

- `repos` を宣言した project について、`<project-id>.code-workspace` をプロジェクトリポジトリのルートに作れる。`folders` には、プロジェクトリポジトリ（`.`）と、宣言した各リポジトリ（`repos[].path`）を宣言順に並べる。`name` にはディレクトリ名と `repos[].name` を使う。
- パスはファイルからの相対で書き、どの worktree から開いても、その worktree と隣のプロダクトリポジトリが開く。
- 既存のファイルは上書きしない（上書きは明示の指定がある場合だけとする）。
- _UNDECIDED_: 作るコマンド（`config scaffold` の対象に加えるか、別のサブコマンドにするか）と、`repos` を持たない project での扱いは、設計時に決める。
- prj-0002 で手で作った `prj-0002.code-workspace` と同じ内容が作られることを確認している。
- [[specdojo:command-reference]] と、別リポジトリ構成を説明する文書に、作り方が書かれている。
- 単体テストで、`repos` の宣言から作られる内容と、既存ファイルを上書きしないことを確認している。
- `_UNDECIDED_` の点は、設計の段階で executor が決め、決めた内容と理由を result と個票の対応結果に書く。決めた内容は既存の動きを変えない（指定しない利用者の動きは今のまま）ものにする。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG の `## [0.4.1] - 未定` の節に書く。公開済みの版の節は変えない（2026-10-20、利用者の承認で 0.4.1 の範囲に加えた）。

## 3. 作業内容

| No  | 作業                           | 担当 | 状態 | メモ |
| --- | ------------------------------ | ---- | ---- | ---- |
| 1   | 作るコマンドと内容を設計する   | DEV  | done | -    |
| 2   | 実装し、テストと文書を更新する | DEV  | done | -    |

## 4. 対応結果

- 実施内容:
  - `src/shared/workspace-scaffold.ts` にマルチルートワークスペース生成処理（`buildWorkspaceData`, `renderWorkspaceContent`, `runWorkspaceScaffold`）を実装した。
  - `src/shared/specdojo-config.ts` の `config scaffold` コマンドに `--workspace` と `--project <id>` オプションを追加し、`repos` の宣言から `<project-id>.code-workspace` を作成可能にした。
  - `_UNDECIDED_` 事項の決定と理由:
    - コマンドの形式: `specdojo config scaffold --workspace` として既存の `config scaffold` に追加した。既存の `--force`、`--dry-run` と一貫した CLI 操作を提供し、`--provider` との併用も可能である。未指定時はエラーメッセージで `--provider` または `--workspace` の指定を案内し、既存のプロバイダ生成の挙動を損なわない。
    - `repos` を持たない project の扱い: マルチルートワークスペースは別リポジトリ構成のためのものであるため、`repos` 未宣言の project ではファイルを作成せずエラー（原因と設定案内を表示）として終了する仕様とした。
  - prj-0002 で手動作成された `prj-0002.code-workspace` の `folders` 構造（プロジェクトルート `.` および `repos` の各エントリ）と同一の内容が生成されることを確認した。
  - 単体テスト `tests/src/shared/workspace-scaffold.test.ts` を作成し、データ構築・JSON 出力・ファイル書き込み・既存ファイル保護（`--force`）・dry-run・CLI オプション連携を検証した。
  - 利用者向けドキュメント（[[specdojo:command-reference|CLIコマンドリファレンス]]、[[specdojo:specdojo-config-reference|specdojo.config.json リファレンス]]、[[specdojo:docs-structure-guide|ドキュメント構成ガイド]]）および `CHANGELOG.md` を更新した。
- 成果物:
  - `src/shared/workspace-scaffold.ts`
  - `src/shared/specdojo-config.ts`
  - `tests/src/shared/workspace-scaffold.test.ts`
  - `docs/ja/specdojo/references/command-reference.md`
  - `docs/ja/specdojo/references/specdojo-config-reference.md`
  - `docs/ja/specdojo/guides/docs-structure-guide.md`
  - `CHANGELOG.md`
  - `docs/ja/projects/prj-0001/controls/project-register/pjr-87xs-code-workspace-scaffold.md`
- 残課題:
  - なし。すべての完了条件を満たしている。

## 5. 関連ドキュメント

- [[specdojo:specdojo-config-reference]]: `repos` の宣言。
- 前例: prj-0002 の `prj-0002.code-workspace`（`folders` に `.` と `../specdojo-lp`）。
