---
specdojo:
  id: prj-0001:xep-pjr-a61w-20261116t224356z-78d8a6a9
  type: exec-plan
  rulebook: none
  task_id: PJR-A61W
  name: "代わりの executor が振り分けと重なると start の後に止まり、終了コード 0 で終わる"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
---

# Edit Plan: PJR-A61W 代わりの executor が振り分けと重なると start の後に止まり、終了コード 0 で終わる

## 1. このタスクで行うこと

プロジェクト登録簿の項目 PJR-A61W「代わりの executor が振り分けと重なると start の後に止まり、終了コード 0 で終わる」に対応する。

exec run --register で --executor-by に振り分けの代わりと同じ agent を指定すると、start の記帳の後に止まり、記帳を commit しないまま終了コード 0 で終わる

## 2. 対象項目

- `id`: PJR-A61W
- `type`: issue
- `priority`: medium
- `owner`: _TODO_
- `due`: _TODO_
- `個票`: `docs/ja/projects/prj-0001/controls/project-register/pjr-a61w-fallback-same-as-pinned-aborts-after-start.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/register/PJR-A61W/pjr-a61w-20261116T224356Z-78d8a6a9/result.md`

## 個票の入力（前提）

次の入力を作業の前提として参照する。完了条件は別節に従う。

- prj-0002:PJR-7MB3 の実行で見つけた。prj-0001 の設定は prj-0002 を持たないため、由来は --from ではなくここに書く
- 2026-11-01、prj-0002 の作業ツリーで specdojo 0.6.0 の exec run --project prj-0002 --register PJR-7MB3 --worktree --executor-by sol-executor --reporter-by gemma-reporter を流した。PJR-7MB3 は difficulty medium で、routing.medium の `fallback_executor_by` は sol-executor
- 出力は worktree の setup の後に「Fallback executor must differ from the pinned agent: sol-executor」で止まり、executor は起動しなかった。終了コードは 0 だった
- 止まった後、PJR-7MB3 は start の記帳で in-progress になり、作業ツリーに start のイベント・個票の状態・plan と result の雛形が commit されずに残った。worktree（exec/prj-0002-PJR-7MB3）も残った
- その後 --force-restart で flash-executor を使って流し直すと review まで通ったが、新しい start は記帳されず、イベントの start の actor は実際には動かなかった sol-executor のまま残った（review の actor は flash-executor）。止まった run の plan は commit されずに残り、result は superseded として commit された
- 検査は src/exec/run/shared.ts の代わりの agent の解決（resolution.actor === primary.actor で throw）にある
- 直し方（検査を start の前に移す、振り分けの代わりが指定の agent と同じときは代わりなしとして扱う、など）は executor が決めて、理由を個票の対応結果に書いてよい

## 3. 進め方

1. 個票（存在する場合）を読み、目的・完了条件・制約を把握する。登録簿の一覧は大きいため読まない。
2. 個票に完了条件がある場合はそれを作業の基準にする。無い場合はタイトルと説明から完了条件の仮説を立て、記録する。pipeline では個票の対応結果と executor の報告の `handoff` に書き、result を直接書ける実行形式では result に明記する。
3. 関連する成果物・設計書・実装を確認し、対象ファイルを特定して変更する。
4. 個票が存在する場合は、個票の作業内容・対応結果セクションを実施内容で更新する。作業内容の表は、各行の状態とメモを実績に合わせる。終えた行は状態を `done` にし、`_TODO_` を残さない。executor が実行できない行（grade の起動など）は状態を `open` のまま残し、その理由をメモに書く。理由のない `done` 以外の行や `_TODO_` の残る行があると、post-review と `register close` は完了にしない。
5. 個票の完了条件が result への記載を求める場合、pipeline の executor は個票の対応結果と報告の `handoff` の両方に書く。reporter と runner が result の申し送りへ反映する。executor は result を直接編集しない。
6. 判断に迷う箇所は _TODO_ / _ASSUMPTION_ で残し、根拠と次のアクションを記録する。pipeline では個票の対応結果と報告の `handoff` に書き、result を直接書ける実行形式では result に書く。

### grade result から展開された finding

- なし

plan に展開された finding は、message と同じ viewpoint ID の判定根拠に照らして解消する。未解消、根拠不足、または判断不能の場合は、理由と次のアクションを記録する。pipeline では個票の対応結果と報告の `handoff` に書き、result を直接書ける実行形式では result に書く。grade result サイドカーは再評価時に更新されるため、本タスクでは直接編集しない。

## 4. 完了手順

1. 「進め方」に従って対応を完了する。
2. 共通規約に従って、必要な整形・静的検査を実行する。
3. result に実施内容・変更ファイル・申し送りを記入する。pipeline では executor は実施内容・変更ファイル・検証結果を報告し、申し送りを `handoff` に記載する。reporter と runner が result を記入する。これはタスク完了に必須であり、_TODO_ を残したまま終了しない（詳細は共通規約を参照）。
4. 登録簿（`pjr-index.md`）の行と個票のステータス項目は変更しない。状態遷移（review / close など）は runner と人間が行う。

## 5. 異常終了の条件

- 前提不足・対象ファイル不明・静的検査未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- agent 自身は登録簿の状態を変更せず、終了コードと標準エラー出力で runner に結果を返す。

`共通規約 sha256:e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e` `docs/ja/projects/prj-0001/execution/conventions/e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e.txt`
