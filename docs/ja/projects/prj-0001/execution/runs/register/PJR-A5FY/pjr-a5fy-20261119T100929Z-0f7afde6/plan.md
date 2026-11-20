---
specdojo:
  id: prj-0001:xep-pjr-a5fy-20261119t100929z-0f7afde6
  type: exec-plan
  rulebook: none
  task_id: PJR-A5FY
  name: "docs-lint の配る依存の npm audit を解消する"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
  owner: ARC
---

# Edit Plan: PJR-A5FY docs-lint の配る依存の npm audit を解消する

## 1. このタスクで行うこと

プロジェクト登録簿の項目 PJR-A5FY「docs-lint の配る依存の npm audit を解消する」に対応する。

別に publish する @specdojo/docs-lint の配る依存に残る npm audit の high 1 件と moderate・low を、上げる・overrides・上流待ちのどれで直すか決めて反映する

## 2. 対象項目

- `id`: PJR-A5FY
- `type`: todo
- `priority`: medium
- `owner`: ARC
- `due`: 2026-11-30
- `個票`: `docs/ja/projects/prj-0001/controls/project-register/pjr-a5fy-docs-lint-npm-audit.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/register/PJR-A5FY/pjr-a5fy-20261119T100929Z-0f7afde6/result.md`

## 個票の入力（前提）

次の入力を作業の前提として参照する。完了条件は別節に従う。

- 2026-11-19 に packages/docs-lint で npm audit --omit=dev を実行すると 16 件（low 3・moderate 12・high 1）。high は markdownlint-cli@0.49.1 が引く markdown-it@14.3.2（<=14.3.2、GHSA-vfgh-jcmw-g37q）。moderate には fast-uri・glob・js-yaml・katex・minimatch・smol-toml がある。
- ルートの npm audit は packages/docs-lint の依存を見ないため、PJR-5CTM の完了条件の確認では検出されなかった。PJR-5CTM の executor は、ルートと同じく docs-lint の markdownlint-cli を ^0.50.0 へ上げることを勧めている。
- 利用者は 2026-11-19 に、5CTM の範囲を広げず別の todo として担当 ARC・期限 11 月末で起票することを承認した。

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
