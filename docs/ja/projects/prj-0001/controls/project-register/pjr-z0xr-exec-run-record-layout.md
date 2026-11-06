---
specdojo:
  id: prj-0001:pjr-z0xr-exec-run-record-layout
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
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

| No  | 作業                                   | 担当 | 状態 | メモ                                                      |
| --- | -------------------------------------- | ---- | ---- | --------------------------------------------------------- |
| 1   | 置き場所のモジュールを作る             | DEV  | done | `src/shared/run-records.ts`                               |
| 2   | 書き込みと読み取りをモジュールに通す   | DEV  | done | register・schedule・job・reporter・dashboard・commit 対象 |
| 3   | 古い配置の読み取りを残し、テストを足す | DEV  | done | 単体テストと既存の再開・統合テストを更新                  |

## 5. 対応結果

- `src/shared/run-records.ts` に新配置、旧配置の探索、run の特定、ログ、再開候補、commit 対象の接頭辞、dashboard のリンクを集約した。パスは `node:path` で組み立てる。exec 側の `src/exec/run-records.ts` は再エクスポートのみとし、job から exec への依存を作らない。frontmatter の共通処理も共有層へ移し、従来の公開口は維持した。
- plan 生成、register・schedule・job の実行、reporter、再開、worktree の commit・統合、dashboard、結果の探索を共通モジュールに接続した。`exec validate`・`exec refresh`・`exec status` の schedule・event 読み取りは従来のままであり、記録の配置の検査を追加する R3 は PJR-JT5J の範囲とした。
- 新規の記録は run ごとに分け、plan・result の文書 ID の生成規則を保持した。旧配置は読み取りを残し、既存記録を移動していない。job の定義、job の状態管理用 JSON、`grade/results` はこの変更の対象外である。
- 単体テストで 3 種類の出どころ、review の配置、長い ID、旧配置の読み取り、新規 plan・result の書き込み、worktree の state、再開時の退避、dashboard の行の区別を確認するケースを追加した。register・schedule の pipeline と再開の既存統合テストを新配置へ更新した。
- 判断: register・schedule の executor からの再開は同一 run として扱う。前回の state・evidence・ログは同じディレクトリに `*.attempt-N.*` として退避し、plan・result と再開後のログが別の run ディレクトリに分かれることを防ぐ。review は元の項目の下の別 run にする。run ID は長さによる切り詰めをせず、末尾の乱数が失われることを防いだ。schedule の新規 run にも既存のユニークな stem の生成を使い、既存の文書 ID の生成関数へ渡すことで、過去 run と ID が重なることを避けた。
- 再開時の修正: root の plan・result を統合前に解放した後も、commit 対象は worktree 内の記録から解決する。旧配置の長いタスク ID は旧版の 80 文字制限で探索する。dashboard と result・job review のテストを新配置に合わせ、worktree 内の探索と長い旧 ID の回帰テストを追加した。
- grep 確認: `src/` の TypeScript から `run-records.ts` を除き、`exec` と `plans`・`results`・`evidence` を並べる `join` / `resolve`、および旧パスを補間するテンプレート文字列を検索し、該当は 0 件だった。legacy の archive の配置も同モジュールへ集約した。
- 検証: ビルド、変更ファイルの Prettier、履歴リンク検査、カタログ検査、register の派生一覧の生成、ステージ上の実行記録の秘密情報スキャンを実行した。カタログ検査の既存参照に関する警告以外は問題なし。主要 lint・型検査・単体／統合テスト・schema の全件検査は親 runner が実行する。
- 保護設定の申し送り: `.prettierignore` の履歴保護へ `docs/ja/projects/**/execution/runs/**/plan.md` と `docs/ja/projects/**/execution/runs/**/result.md` を加える案とする。設定は変更していない。R3 の CI への追加と R4 のガイド照合、および既存記録とガイドの移行は後続項目で扱う。

## 6. 関連ドキュメント

- [[prj-0001:pjr-vh8d-execution-records-layout]]: 配置の決定
- [[specdojo:plan-result-lifecycle-guide]]: plan と result の扱い
