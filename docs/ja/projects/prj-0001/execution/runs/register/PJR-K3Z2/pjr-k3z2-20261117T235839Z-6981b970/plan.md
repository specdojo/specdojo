---
specdojo:
  id: prj-0001:xep-pjr-k3z2-20261117t235839z-6981b970
  type: exec-plan
  rulebook: none
  task_id: PJR-K3Z2
  name: "概念クラス図（ccd）の向きを上から下にそろえる"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
  owner: BA
---

# Edit Plan: PJR-K3Z2 概念クラス図（ccd）の向きを上から下にそろえる

## 1. このタスクで行うこと

プロジェクト登録簿の項目 PJR-K3Z2「概念クラス図（ccd）の向きを上から下にそろえる」に対応する。

ccd の sample と ccd-project-planning が direction LR で描かれているため、継承の読み方と状態遷移図にそろえて上→下を既定にし、rulebook に向きの決まりを足す。

## 2. 対象項目

- `id`: PJR-K3Z2
- `type`: todo
- `priority`: medium
- `owner`: BA
- `due`: 2026-11-30
- `個票`: `docs/ja/projects/prj-0001/controls/project-register/pjr-k3z2-ccd-direction-tb.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/register/PJR-K3Z2/pjr-k3z2-20261117T235839Z-6981b970/result.md`

## 個票の入力（前提）

次の入力を作業の前提として参照する。完了条件は別節に従う。

- 利用者の指摘（2026-11-18）: 概念クラス図は左→右ではなく、ほかの図に合わせて上から下の配置にした方がよい
- orchestrator の調べ（2026-11-18）: ccd-sample と ccd-project-planning は direction LR。stsd（sample と本番 5 件）は指定なし（上→下）。データフロー図・C4・プロジェクト定義の図は flowchart LR。ccd-mermaid-rulebook に向きの決まりはない。ccd-project-planning はクラス 11 個
- 利用者の決定（2026-11-18）: 上→下を既定とし、関連の連なりが長く横に並べた方が読みやすい場合だけ LR とし、理由を本文に書く

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
