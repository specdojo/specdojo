---
specdojo:
  id: prj-0001:pjr-z0xr-exec-run-record-layout
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-06T15:04:14Z"
  due_on: null
  derived_from:
    - PJR-VH8D
---

# PJR-Z0XR 実行記録の置き場所を run 単位のディレクトリにし、決め方を 1 つのモジュールにまとめる

## 1. 概要

新しい run の plan・result・evidence・ログを execution/runs/`<出どころ>`/`<項目 ID>`/`<run ID>`/ に書き、読み書きを 1 つのモジュールに通す（R1・R2）。移行が終わるまでは古い配置も読む

## 2. 入力

- PJR-VH8D の決定（2026-11-07 indie）: 実行記録は run 単位のディレクトリ execution/runs/`<出どころ>`/`<項目 ID>`/`<run ID>`/ に plan.md・result.md・evidence.json・ログを置く（R1）。出どころは register・schedule・job。置き場所を決める処理はコードの 1 つのモジュールにまとめる（R2）。exec validate と CI で置き場所を検査する（R3）。ガイドの構成図をモジュールと照らすテストを置く（R4）。grade/results と jobs/ の定義は外に残す。既存は git mv で移し、パスの欄だけ書き換える

## 3. 完了条件

- 実行記録（plan・result・evidence・executor や reporter のログ・親の検証と統合のログ・`pipeline-state.json`）の置き場所を決める処理が、`src/` の 1 つのモジュールにまとまっている。パスの組み立ては `node:path` で行い、出どころ（`register`・`schedule`・`job`）・項目 ID・run ID からパスを返す。
- 新しい run は、`execution/runs/<出どころ>/<項目 ID>/<run ID>/` に `plan.md`・`result.md`・`evidence.json`・ログを書く。register は項目 ID（例: `PJR-XXXX`）、schedule はタスク ID（例: `T-...`）、job は job の実行 ID を使う。review の run も元の項目のディレクトリの下に置く。plan・result の frontmatter の `id` の付け方は変えない。
- 書き込みと読み取りの両方（plan の生成、`exec run` の register・schedule・job、`--resume`、reporter、`exec validate`・`exec refresh`・`exec status`、dashboard の実行記録、commit の許可リスト、worktree からの統合）が、このモジュールを通っている。モジュールの外にパスの組み立てが残っていない（grep で確かめた結果を個票の対応結果に書く）。
- 移行（PJR-9BY9）が終わるまでは、古い配置（`exec/plans`・`exec/results`・`exec/evidence`）の記録も読める。古い配置への新しい書き込みはない。
- 単体テストで、出どころごとのパスの組み立て、古い配置の読み取り、モジュールを通した書き込み先を確かめている。統合テストで、register の run が新しい配置に記録を書き、`--resume` がそれを読めることを確かめている。
- 既存の実行記録は動かしていない（移すのは PJR-9BY9）。ガイドの構成図の更新は PJR-9BY9 で行うため、この項目では CHANGELOG と、必要ならコードのコメントだけを書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` が通り、親の検証（`test-integration` を含む）が通っている。
- CHANGELOG は未公開の版の節に書き、公開済みの版の節を変えていない。
- 保護された設定（`package.json`・`lefthook.yml`・`.github/workflows/`・`.specdojo/` の設定・agent の定義・`.gitignore` が保護されている場合はそれも）を変える必要があるときは、変えずに案を個票の対応結果に書き、pipeline では報告の `handoff` にも書いている。反映は利用者の承認のもと行う。
- 未決の点は executor が決め、決めた内容と理由を個票の対応結果に書き、pipeline では報告の `handoff` にも書いている。

## 4. 作業内容

| No  | 作業                                   | 担当 | 状態 | メモ |
| --- | -------------------------------------- | ---- | ---- | ---- |
| 1   | 置き場所のモジュールを作る             | DEV  | open | -    |
| 2   | 書き込みと読み取りをモジュールに通す   | DEV  | open | -    |
| 3   | 古い配置の読み取りを残し、テストを足す | DEV  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-vh8d-execution-records-layout]]: 配置の決定
- [[specdojo:plan-result-lifecycle-guide]]: plan と result の扱い
