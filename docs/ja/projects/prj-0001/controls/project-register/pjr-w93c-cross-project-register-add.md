---
specdojo:
  id: prj-0001:pjr-w93c-cross-project-register-add
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-10-21T13:17:35Z"
---

# PJR-W93C 別の project の登録簿へ起票できるようにする

## 1. 概要

project ごとに統合ブランチと作業ツリーが分かれているため、ある project の作業ツリーから別の project の todo などを起票できず、--from で別の project の項目も指せない。register add --project で相手の project の統合ブランチへ直接記帳し、project 付きの --from を使えるようにする

## 2. 完了条件

- 0.4.2 の範囲とする（2026-10-21、利用者が承認）。
- `register add --project <project-id> --commit` を、別の project の作業ツリーから実行すると、対象 project の統合ブランチへ記帳される。統合ブランチは `specdojo.config.json` の project の設定で指定でき、省略時は [[specdojo:git-branching-standard]] の `project/<project-id>/develop` とする。今の作業ツリーが対象 project の統合ブランチにいる場合の動きは、今のままとする。
- 対象のブランチを開いている作業ツリーがあれば、その作業ツリーの中で、その実行パスの register lifecycle の枠を取り、起票・`register build`・commit を行う。開いている作業ツリーがなければ、一時的な worktree で同じことを行い、終わったら外す。対象の作業ツリーの登録簿に未 commit の変更がある場合と、対象のブランチが存在しない場合は、何も書き込まずに理由を示して止まる。
- 起票の前に、対象 project の名簿と予約名で `--by` を確かめる（PJR-3K1X の規則を対象 project の設定で適用する）。
- `--commit` のない別の project への起票は、記帳と commit の場所が分かれて取り残しが出るため、エラーにする。
- `register add` と `register update` の `--from` に、`<project-id>:PJR-XXXX` の形で別の project の項目を指定できる。項目があるかを、対象 project の統合ブランチの内容を git から読んで確かめ、見つからなければ止める。今の project の項目を指す従来の書き方は変えない。
- 別の project に対する状態遷移（`close`・`reject` など）は対象外とし、エラーで止める。メッセージで、その project の作業ツリーで行うよう案内する。
- 単体テストで、統合ブランチの解決、`--commit` のない場合と状態遷移の拒否、project 付きの `--from` の解釈を確かめる。統合テストで、2 つの project のブランチと作業ツリーを用意し、対象のブランチを開いた作業ツリーがある場合とない場合の両方で、対象のブランチに 1 件の commit で記帳されること、元の作業ツリーと元のブランチが変わらないこと、未 commit の変更があるときに止まることを確かめる。
- [[specdojo:register-operation-guide]]・[[specdojo:command-reference]]・[[specdojo:specdojo-config-reference]] に、別の project への起票の仕方と制約を書く。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- runner と register のコードを変えるため、統合の後に `exec run --register` を 1 回流して動作を確かめる（PJR-JSEY）。
- CHANGELOG に新しい版の節がなければ `## [Unreleased]` の節を作って書く。公開済みの版の節は変えない。

## 3. 作業内容

| No  | 作業                                        | 担当 | 状態 | メモ                               |
| --- | ------------------------------------------- | ---- | ---- | ---------------------------------- |
| 1   | 別の project の登録簿へ起票できるようにする | DEV  | open | 実装・テスト・利用者向け文書を更新 |

## 4. 対応結果

- project ごとの `integration_branch` と既定の `project/<project-id>/develop` を解決し、別 project への `register add --commit` を対象ブランチの既存 worktree または一時 worktreeで実行するようにした。
- 対象登録簿の未 commit 変更、`--commit` の欠落、対象ブランチの欠落、別 project への状態遷移を、書き込み前に拒否するようにした。
- project 修飾した `--from` を参照先 project の統合ブランチの Git tree で検証するようにした。
- 単体テストと、既存／一時 worktree、元ブランチの不変、1 commit、未 commit 変更の拒否を扱う統合テストを追加した。
- [[specdojo:register-operation-guide]]、[[specdojo:command-reference]]、[[specdojo:specdojo-config-reference]]、CHANGELOG を更新した。
- 残課題: 統合後に [[prj-0001:pjr-jsey-exec-run-split-smoke|PJR-JSEY]] の手順で `exec run --register` を 1 回実行し、配布 CLI の実運用経路を確認する。

## 5. 関連ドキュメント

- [[specdojo:register-operation-guide]]
- [[specdojo:git-branching-standard]]
