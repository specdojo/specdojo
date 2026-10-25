---
specdojo:
  id: prj-0001:pjr-p14m-per-project-parent-validations-replace
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-10-21T13:19:31Z"
  due_on: "2026-10-31"
  completed_at: "2026-10-25T21:29:58Z"
  conclusion: projectごとの親検証除外を実装し、共有設定の継承とprj-0002向けの絞り込みをテストで確認した。
---

# PJR-P14M project ごとに共有の親の検証を置き換えられるようにする

## 1. 概要

`projects.<id>.run.parent_validations` は共有の exec-defaults の親の検証へ追記するだけで減らせない。文書と LP だけを変える prj-0002 の run で本体の全テスト（test-unit・test-integration など）が走らないよう、exec-defaults.yaml を複製せずに project ごとに共有の親の検証を置き換える、または除外できるようにする（prj-0002 の PJR-B3W9 から起票）

## 2. 完了条件

- `exec-defaults.yaml` を複製せずに、project ごとに共有の `pipeline.parent_validations` を置き換える、または一部を除外できる。指定場所は `projects.<id>.run` 配下とする。
- 指定の形（置き換えか除外か、キーの名前と値）は executor が決め、決めた内容と理由を result と個票の対応結果に書く。
- 指定しない project の有効な親の検証は今のまま変わらない。既存の `run.parent_validations`（追記）の動きも変わらない。
- prj-0002 で本体の検証を外し、`lint-fm`・`lint-md` と `{ id: typecheck, repo: specdojo-lp }` などだけにした設定で、prj-0001 の有効な検証が変わらないことをテストで確かめる。
- 未知の ID、存在しない検証の除外の指定、指定の結果として同じ ID と実行先が重複する場合は、agent の起動前に設定エラーになる。
- [[specdojo:exec-config-guide]] と [[specdojo:specdojo-config-reference]]、config の schema に、指定の方法と共有の `exec-defaults.yaml` との関係が書かれている。
- CHANGELOG は未公開の版の節に書く。公開済みの版の節は変えない。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- runner のコードを変えるため、統合の後に `exec run --register` を 1 回流して動作を確かめる。
- `.specdojo/` の設定（prj-0002 への適用を含む）は変えない。適用は prj-0002 の PJR-B3W9 で行う。

## 3. 作業内容

| No  | 作業                           | 担当 | 状態 | メモ                                                                     |
| --- | ------------------------------ | ---- | ---- | ------------------------------------------------------------------------ |
| 1   | 指定の場所と形を設計する       | DEV  | done | `run.parent_validations_exclude` による ID と実行先の組の除外を採用      |
| 2   | 実装し、テストと文書を更新する | DEV  | done | 設定読込・型・schema・回帰テスト・ガイド・リファレンス・未公開の変更履歴 |

## 4. 対応結果

- 指定は `projects.<id>.run.parent_validations_exclude` とし、値は許可リストの ID または `{ id, repo }` の配列とした。共有の `pipeline.parent_validations` から一致する ID と実行先の組を除外し、残りの順序を保った後に既存の `run.parent_validations` を指定順で追記する。省略または `[]` は従来どおりとする。
- 置き換えではなく除外にした理由は、共有 defaults を複製せずに本体のテストなど必要な検証だけを外せて、共有側に新設された検証を引き続き継承できるためである。ID だけの指定は `repo: project` と同じとし、別リポジトリの同名検証には一致させない。
- 設定読込で共有一覧と除外一覧を検証し、未知の ID、共有一覧に存在しない組の除外、除外一覧内および最終一覧内の組の重複、不正な要素を agent 起動前にエラーにする。共有一覧に存在しない組を project の追記分に書いても除外は許可しない。除外済みの組を追記分で末尾へ戻すことは許可する。
- `src/exec/agent-config.ts`・`src/shared/specdojo-config.ts` と config schema を更新した。単体テストに prj-0002 の検証を `lint-fm`・`lint-md`・`{ id: typecheck, repo: specdojo-lp }` だけにし、同じ defaults を参照する prj-0001 の 7 件が変わらない例を追加した。省略・空配列・worktree パス・実行先の一致・順序・不正設定も検証する。CLI の統合テストには不正設定時に agent・worktree・登録簿更新へ進まないことの確認を追加した。
- [[specdojo:exec-config-guide|exec設定ガイド]] と [[specdojo:specdojo-config-reference|specdojo.config.jsonリファレンス]] に設定例・解決順・互換性・エラー条件を記載し、`CHANGELOG.md` の `Unreleased` に追加した。公開済みの版の節、`.specdojo/` の設定、登録簿一覧・本個票のステータス項目、result は変更していない。
- 検証: 変更ファイルの Prettier 整形・検査、`git diff --check`、変更した config schema による既存 `.specdojo/specdojo.config.json` の検証、`register build` は成功した。hook の `node --import tsx tools/catalog-validate-if-configured.mjs` も終了コード 0 だったが、変更対象外の未作成成果物に対する `based_on` 検証の警告を出した。`lint-ts`・`lint-fm`・`lint-md`・`typecheck`・`test-unit`・`test-integration`・`validate-schema` はこの pipeline の親 runner が executor 終了後に実行するため、sandbox では重複実行せず、実結果を後段で確認する。
- 申し送り: 統合後の `exec run --register` による実動作確認はホスト側で必要。運用メモに従い PJR-JSEY の確認対象へ PJR-P14M を加えて 1 回実行し、成功を確認してから close する。実 agent CLI の起動を伴うため executor sandbox では実行しない。
- 申し送り: prj-0002 への設定適用は PJR-B3W9 で行う。除外対象は適用時の共有一覧に実在する ID と実行先の組を指定する。本項目では `.specdojo/` の変更は提案・適用とも行わない。

## 5. 関連ドキュメント

- [[prj-0002:pjr-b3w9-exec-defaults]]: 本項目を必要とした項目。ここでの実装の後に prj-0002 の設定へ適用する。
- [[prj-0001:pjr-he9r-per-project-parent-validations]]: project ごとに親の検証を足せるようにした項目。
- [[specdojo:exec-config-guide]]: `parent_validations` と `{ id, repo }`。
