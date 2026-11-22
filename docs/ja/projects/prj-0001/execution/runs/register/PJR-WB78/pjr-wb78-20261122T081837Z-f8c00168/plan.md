---
specdojo:
  id: prj-0001:xep-pjr-wb78-20261122t081837z-f8c00168
  type: exec-plan
  rulebook: none
  task_id: PJR-WB78
  name: "reporter が書いた result を、書き込む前に lint していない"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
  owner: DEV
---

# Edit Plan: PJR-WB78 reporter が書いた result を、書き込む前に lint していない

## 1. このタスクで行うこと

プロジェクト登録簿の項目 PJR-WB78「reporter が書いた result を、書き込む前に lint していない」に対応する。

reporter の出力で lint に落ちる語（中国語の字など）が result に入り、親の検証や統合の commit で止まる。runner が result を書く前に lint し、落ちたら reporter をやり直すか直す。

## 2. 対象項目

- `id`: PJR-WB78
- `type`: todo
- `priority`: high
- `owner`: DEV
- `due`: _TODO_
- `個票`: `docs/ja/projects/prj-0001/controls/project-register/pjr-wb78-lint-reporter-result.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/register/PJR-WB78/pjr-wb78-20261122T081837Z-f8c00168/result.md`

## 個票の入力（前提）

次の入力を作業の前提として参照する。完了条件は別節に従う。

- 2026-11-22、QTZ7 の result に reporter（gemma）が中国語の簡体字（U+4E2A）を書き、lint-md で止まった。G3TT ではバッククォートのエスケープで止まった。
- 利用者の承認（2026-11-22、indie）で起票した。
- 2026-11-22、T-KATA-WAVE-3-utc-sample-090 の review result に reporter（gemma26-reporter）が、箇条書きの中の ### 見出し（文末の句点つき）と、1 行につながった ### と #### を書き、統合の前の lint で MD022・MD026 により止まった。review 自体は終わっていた。オーケストレーターが result の該当行を地の文に直し、exec resume --task で統合した。
- 2026-11-22、PJR-09HA の result に reporter が素の URL を書き、MD034 で止まった。T-KATA-WAVE-3-itc-index-sample-090 の review result では、見出しとコードブロックが 1 行につぶれ、MD038 で止まった。どちらもオーケストレーターが result を直して統合だけを流し直した。

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

## 変更範囲による実行待ち

- 2026-11-22T08:16:04.626Z: `PJR-WB78` は `PJR-MS7X` の統合を待った。重複: `project:exec-defaults.yaml <> project:exec-defaults.yaml`。

`共通規約 sha256:e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e` `docs/ja/projects/prj-0001/execution/conventions/e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e.txt`
