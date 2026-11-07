---
specdojo:
  id: prj-0001:pjr-9by9-exec-run-record-migration
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-06T15:06:07Z"
  due_on: null
  block_reason: "executor reported incomplete: 移行CLI・旧配置探索の廃止・ガイド・テストを実装。一時リポジトリで全5,576件の移行を検証したが、本体はGit indexが読み取り専用のため実移動0件。詳細を個票へ記録した。"
  derived_from:
    - PJR-VH8D
  depends_on:
    - PJR-VH8D
    - PJR-Z0XR
    - PJR-BVS9
    - PJR-BRN4
---

# PJR-9BY9 既存の実行記録を run 単位のディレクトリへ移す

## 1. 概要

既存の plan・result・evidence・ログ約 3,000 件を git mv で execution/runs/ へ移すコマンドを作って実行し、記録の中のパスの欄を書き換え、古い配置の読み取りと plans/done/ をなくす

## 2. 入力

- PJR-VH8D の決定（2026-11-07 indie）: 実行記録は run 単位のディレクトリ execution/runs/`<出どころ>`/`<項目 ID>`/`<run ID>`/ に plan.md・result.md・evidence.json・ログを置く（R1）。出どころは register・schedule・job。置き場所を決める処理はコードの 1 つのモジュールにまとめる（R2）。exec validate と CI で置き場所を検査する（R3）。ガイドの構成図をモジュールと照らすテストを置く（R4）。grade/results と jobs/ の定義は外に残す。既存は git mv で移し、パスの欄だけ書き換える

## 3. 完了条件

- 既存の実行記録（`execution/exec/plans`・`results`・`evidence` と、job の plan・result・evidence）を、PJR-Z0XR のモジュールの規則で `execution/runs/` へ移すコマンドがある。`--dry-run` で移す先の一覧を出せる。何度流しても同じ結果になる。
- コマンドは `git mv` で移し、記録の中のパスの欄（`evidence.json` の `log_refs`、`pipeline-state.json` の参照、result の frontmatter のパスなど）だけを書き換える。ログの本文と plan・result の `id` は変えない。plan のない result、result のない plan も移し、どちらか欠けたものの一覧を個票の対応結果に書く。
- コマンドを prj-0001 に流して、移した件数と、移せなかったもの（とその理由）を個票の対応結果に書いている。`trials` の扱いは executor が決めて理由を書く。
- 古い配置の読み取りと `plans/done/` の処理がコードからなくなっている。古い配置にファイルが残っていない。
- plan-result-lifecycle-guide と docs-structure-guide の構成図と説明が、新しい配置になっている。
- `npx specdojo exec validate --project prj-0001`・`exec status`・`dashboard build` が通り、移した後も記録が読めている。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` が通り、親の検証（`test-integration` を含む）が通っている。
- CHANGELOG は未公開の版の節に書き、公開済みの版の節を変えていない。
- 保護された設定（`package.json`・`lefthook.yml`・`.github/workflows/`・`.specdojo/` の設定・agent の定義・`.gitignore` が保護されている場合はそれも）を変える必要があるときは、変えずに案を個票の対応結果に書き、pipeline では報告の `handoff` にも書いている。反映は利用者の承認のもと行う。
- 未決の点は executor が決め、決めた内容と理由を個票の対応結果に書き、pipeline では報告の `handoff` にも書いている。

## 4. 作業内容

| No  | 作業                   | 担当 | 状態 | メモ |
| --- | ---------------------- | ---- | ---- | ---- |
| 1   | 移すコマンドを作る     | DEV  | open | -    |
| 2   | prj-0001 の記録を移す  | DEV  | open | -    |
| 3   | 古い配置の処理をなくす | DEV  | open | -    |
| 4   | ガイドを直す           | DEV  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-vh8d-execution-records-layout]]: 配置の決定
- [[specdojo:plan-result-lifecycle-guide]]: plan と result の扱い
- [[specdojo:docs-structure-guide]]: 構成図の正本
