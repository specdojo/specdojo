---
specdojo:
  id: prj-0001:pjr-2f3y-grade-unreviewed-content-hash
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: DEV
  registered_at: "2026-09-27T06:22:09Z"
  completed_at: "2026-09-27T07:11:41Z"
  conclusion: grade list --unreviewed を未評価または content_hash 不一致の文書に絞り、routine の unreviewed を有効に戻した。対象は kata 262→0 件、成果物 19→1 件
---

# PJR-2F3Y grade の unreviewed 契機を内容の変化がある文書に絞る

## 1. 概要

PJR-N03W で追加した `grade list --unreviewed`（`src/grade.ts`）は、schedule のタスクが割り当てられていない文書を選ぶ。ただし、評価結果の有無や `content_hash` の一致を見ないため、評価済みで内容が変わっていない文書も毎回すべて選ぶ。

2026-09-27 の時点で、kata は全 262 件、成果物は 41 件中 19 件が該当した。routine で有効にすると、`limit`（kata 15 件、成果物 10 件）の分だけ、変更のない文書が毎晩 codex で再評価される。PJR-2ZVS の 3.6 節の「対象文書の `content_hash` が既存 sidecar と一致する場合は再実行しない」に反する。

利用者の判断により、`rtn-grade-recheck.yaml` と `rtn-grade-deliverable-recheck.yaml` の `unreviewed` を `"false"` にして N03W を close し、本項目で修正する。

あわせて、`--dependency-changed` は依存先の `content_hash` ではなく評価日時（依存先の `graded_at` が自身より新しいか）で判定している。依存先を再評価しただけで、内容が変わっていなくても該当する。この扱いは PJR-Z47X（照合先の変化検出）で方針を決めるため、本項目では扱わない。

## 2. 完了条件

- `--unreviewed` は、schedule のタスクがない文書のうち、未評価の文書、または評価時の `content_hash` と現在の内容が一致しない文書だけを選ぶ。
- 評価済みで内容が変わっていない文書は選ばれない。これを確かめる単体テストがある。
- 変更後の対象件数（kata・成果物）を対応結果に記録する。
- `rtn-grade-recheck.yaml` と `rtn-grade-deliverable-recheck.yaml` の `unreviewed` を `"true"` に戻し、無効化の理由を書いたコメントを外す。
- `npm run check` が成功する。

## 3. 作業内容

| No  | 作業                                                                      | 担当 | 状態 | メモ |
| --- | ------------------------------------------------------------------------- | ---- | ---- | ---- |
| 1   | `--unreviewed` の選択に、未評価または `content_hash` 不一致の条件を加える | DEV  | done | -    |
| 2   | 単体テストを追加する                                                      | DEV  | done | -    |
| 3   | routine の `unreviewed` を有効に戻す                                      | DEV  | done | -    |

## 4. 対応結果

### 実施内容

- `grade list --unreviewed` の schedule タスク有無判定に、grade result サイドカーが存在しない、またはサイドカーの `content_hash` が現在の文書内容と一致しないという条件を追加した。
- kata と成果物の両方について、未評価文書を選ぶこと、評価済みで同一内容の文書を選ばないこと、評価後に内容を変更した文書を再び選ぶことを単体テストへ追加した。
- `rtn-grade-recheck` と `rtn-grade-deliverable-recheck` の `unreviewed` を `"true"` に戻し、暫定無効化のコメントを削除した。
- コマンドリファレンスへ `--unreviewed` の選択条件を追記した。

### 変更ファイル

- `src/grade.ts`
- `tests/src/grade-triggers.test.ts`
- `docs/ja/projects/prj-0001/routines/rtn-grade-recheck.yaml`
- `docs/ja/projects/prj-0001/routines/rtn-grade-deliverable-recheck.yaml`
- `docs/ja/specdojo/references/command-reference.md`
- `docs/ja/projects/prj-0001/controls/project-register/pjr-2f3y-grade-unreviewed-content-hash.md`

### 対象件数

2026-09-27 に `grade list --unreviewed --project prj-0001` で確認した。

| 対象   | 変更前 | 変更後 |
| ------ | -----: | -----: |
| kata   |    262 |      0 |
| 成果物 |     19 |      1 |

変更後に選ばれた成果物は `docs/ja/product/030-architecture/020-infrastructure/tsd-ollama.md` である。

### 検証

executor では対象ファイルの Prettier 整形と Markdown 検査、TypeScript lint、frontmatter lint、履歴リンク検証、カタログ検証、登録簿生成、索引生成を実施し、すべて成功した。`npm run typecheck`、`npm run test:unit`、`npm run test:integration`、`npm run validate:schema` は executor/reporter pipeline の親 runner が実行するため、executor 内では重複実行していない。

## 5. 関連ドキュメント

- PJR-N03W（`--unreviewed` を追加した項目）、PJR-2ZVS（3.4 節・3.6 節）、PJR-Z47X（`--dependency-changed` の判定方式）
- `src/grade.ts`、`docs/ja/projects/prj-0001/routines/rtn-grade-recheck.yaml`、`docs/ja/projects/prj-0001/routines/rtn-grade-deliverable-recheck.yaml`
