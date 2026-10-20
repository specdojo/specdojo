---
specdojo:
  id: prj-0001:pjr-he9r-per-project-parent-validations
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-10-12T12:48:45Z"
  due_on: "2026-10-31"
---

# PJR-HE9R project ごとに parent_validations を足せるようにする

## 1. 概要

exec-defaults.yaml は project 間で共有され、プロダクトリポジトリ向けの { id, repo } を足すと、その repos を持たない project の run で検証が failed になる。exec-defaults を複製せずに、project ごとに親 runner の検証を足せるようにする（`projects.<id>.run` での追加や、exec-defaults の引き継ぎなど）

## 2. 完了条件

- `exec-defaults.yaml` を複製せずに、project ごとに親 runner の検証（`pipeline.parent_validations` の要素、`{ id, repo }` を含む）を足せる。
- 指定場所は `projects.<id>.run.parent_validations` とし、共有 `exec-defaults` の `pipeline.parent_validations` へ追記する。
- prj-0002 で `{ id: typecheck, repo: specdojo-lp }` と `{ id: lint-ts, repo: specdojo-lp }` を足しても、`repos` を持たない prj-0001 の run が影響を受けないことを、テストで確認している。
- 足した検証が、その project の run の evidence に `source: runner` と `repo` 付きで記録される。
- [[specdojo:exec-config-guide]] と [[specdojo:specdojo-config-reference]] に、指定の方法と、共有の `exec-defaults.yaml` との関係が書かれている。
- 前提（2026-10-12）: `exec_defaults` は `projects.<id>.run` で project ごとに指定できるが、ファイルを引き継ぐ仕組みはない。`specdojo-lp` には prj-0002 の PJR-2CQC で `typecheck`・`lint:ts` の script を用意した。
- 指定場所と形の決定内容・理由を result と個票の対応結果に書く。決めた内容は既存の動きを変えない（指定しない利用者の動きは今のまま）ものにする。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- runner のコードを変えるため、統合の後に `exec run --register` を 1 回流して動作を確かめる（PJR-JSEY）。
- CHANGELOG の `## [0.4.1] - 未定` の節に書く。公開済みの版の節は変えない（2026-10-20、利用者の承認で 0.4.1 の範囲に加えた）。

## 3. 作業内容

| No  | 作業                                   | 担当 | 状態 | メモ                                                                                      |
| --- | -------------------------------------- | ---- | ---- | ----------------------------------------------------------------------------------------- |
| 1   | 指定の場所と形を設計する               | DEV  | done | `projects.<id>.run.parent_validations` を共有 defaults への追記として採用                 |
| 2   | 実装し、テストと文書を更新する         | DEV  | done | loader・config schema・ガイド・リファレンス・CHANGELOG・テストを更新                      |
| 3   | prj-0002 に `specdojo-lp` の検証を足す | DEV  | done | `prj-0002` 相当の設定 fixture で `typecheck` と `lint-ts` の追加および project 分離を確認 |

## 4. 対応結果

- 指定場所は `.specdojo/specdojo.config.json` の `projects.<id>.run.parent_validations` とし、共有 `exec-defaults.yaml` の `pipeline.parent_validations` の後ろへ指定順に追加する方式に決めた。project 固有差分のために defaults 全体を複製せず、指定しない project の従来動作を維持できるためである。
- string の ID と `{ id, repo }` の両方を既存の固定許可リストへ合成し、未知 ID や同じ ID・実行先の重複は従来の検証で agent 起動前に拒否する。
- `prj-0001` と `prj-0002` が同じ defaults を使うテストを追加した。`prj-0002` だけへ `{ id: typecheck, repo: specdojo-lp }` と `{ id: lint-ts, repo: specdojo-lp }` を加え、`prj-0001` の有効な検証が変わらないこと、および `prj-0002` の evidence に `source: runner` と `repo: specdojo-lp` が残ることを確認する。
- [[specdojo:exec-config-guide]]、[[specdojo:specdojo-config-reference]]、`docs/specdojo/schemas/v1/specdojo-config.schema.yaml`、`CHANGELOG.md` を更新した。
- 現リポジトリの `.specdojo/specdojo.config.json` には `prj-0002` の宣言がないため、存在しない project や外部リポジトリの設定は追加していない。適用先ではガイドの例どおり `prj-0002` の `run.parent_validations` へ 2 件を追加できる。コード上の残課題はない。

## 5. 関連ドキュメント

- [[prj-0002:pjr-2cqc-lp-dev-environment]]: 本項目を必要とした項目。
- [[specdojo:exec-config-guide]]: `parent_validations` と `{ id, repo }`。
- [[prj-0001:pjr-ns8y-parent-validation-build-format-ids]]: 許可リストに `build`・`format` の ID がない問題。
