---
specdojo:
  id: prj-0001:pjr-5b42-cross-repo-register-add
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-10-22T11:11:14Z"
  derived_from:
    - PJR-W93C
---

# PJR-5B42 別のリポジトリの project の登録簿へ起票できるようにする

## 1. 概要

PJR-W93C は同じリポジトリの中の project に限られる。設定で別のリポジトリの project を別名付きで宣言し、register add でその別名を指定すると、相手のリポジトリの specdojo を起動して起票させる。project ID の衝突を別名で避け、orchestrator launch で相手のリポジトリへの編集を許可する

## 2. 完了条件

- 次の版の範囲とする（2026-10-22、利用者が承認。案 A: 相手のリポジトリの CLI に任せる）。
- `specdojo.config.json` に、別のリポジトリの project を別名付きで宣言できる（例: `external_projects` の下に、別名ごとに相手のリポジトリのパスと相手の project ID）。キーの名前と形は設計で決め、result に理由を書く。別名は、自分の `projects` の ID と重なってはならず、重なれば設定の検証で止める。
- `register add --project <別名> --commit` で、相手のリポジトリの中にある specdojo（相手のリポジトリの `node_modules/.bin/specdojo` など）を起動し、相手の project ID で起票させる。相手の版・形式・名簿・記帳の枠は相手の CLI に任せ、こちらの CLI は相手の登録簿のファイルを直接書かない。相手の統合ブランチの解決は相手の CLI（0.4.2 の W93C の動き）に任せる。
- 相手のリポジトリがない、相手に specdojo が入っていない、相手の版が W93C より古い、`--commit` がない、の場合は、何もせずに理由を示して止まる。相手の起票が失敗したときは、相手の出力をそのまま示す。push はしない。
- `--from <別名>:PJR-XXXX` で、別のリポジトリの項目を起票の元として指せる。項目があるかは相手の CLI で確かめる。記録する値の形（別名で残すか、相手の project ID で残すか）は設計で決め、result に理由を書く。
- `orchestrator launch` が、宣言した別のリポジトリにも `repos` と同じく `--add-dir` と編集の許可を付ける。
- 別のリポジトリへの状態遷移（close など）は対象外とし、相手のリポジトリで行うよう案内して止める。
- [[specdojo:register-operation-guide]]・[[specdojo:command-reference]]・[[specdojo:specdojo-config-reference]] に、宣言の仕方・起票の仕方・制約を書く。
- 単体テストで、設定の検証（別名の重なり）と、相手の CLI を起動する引数の組み立てを確かめる。統合テストで、2 つの一時のリポジトリ（両方に specdojo を入れたもの）を用意し、片方から他方へ起票して、相手のリポジトリの統合ブランチに 1 件の commit で記帳されること、元のリポジトリが変わらないこと、相手に specdojo がないときに止まることを確かめる。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- register のコードを変えるため、統合の後に `exec run --register` を 1 回流して動作を確かめる（PJR-JSEY）。
- CHANGELOG の `## [Unreleased]` の節に書く（なければ作る）。公開済みの版の節は変えない。

## 3. 作業内容

| No  | 作業                                                    | 担当 | 状態 | メモ   |
| --- | ------------------------------------------------------- | ---- | ---- | ------ |
| 1   | 別のリポジトリの project の登録簿へ起票できるようにする | DEV  | open | 次の版 |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- PJR-W93C（同じリポジトリの中の別の project への起票）
- PJR-SAZC（`orchestrator launch` による `repos` の許可）
