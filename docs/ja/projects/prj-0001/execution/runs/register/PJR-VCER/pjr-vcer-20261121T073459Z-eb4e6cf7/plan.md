---
specdojo:
  id: prj-0001:xep-pjr-vcer-20261121t073459z-eb4e6cf7
  type: exec-plan
  rulebook: none
  task_id: PJR-VCER
  name: "第 3 波の kata ドメインと strategy・schedule を用意する（試験の型 13 種類）"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
  owner: DEV
---

# Edit Plan: PJR-VCER 第 3 波の kata ドメインと strategy・schedule を用意する（試験の型 13 種類）

## 1. このタスクで行うこと

プロジェクト登録簿の項目 PJR-VCER「第 3 波の kata ドメインと strategy・schedule を用意する（試験の型 13 種類）」に対応する。

dct-kata.yaml を作って試験の型 13 種類の sample を成果物として載せ、kata-wave-3 の strategy と schedule を作る

## 2. 対象項目

- `id`: PJR-VCER
- `type`: todo
- `priority`: medium
- `owner`: DEV
- `due`: _TODO_
- `個票`: `docs/ja/projects/prj-0001/controls/project-register/pjr-vcer-kata-wave-3-catalog-schedule.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/register/PJR-VCER/pjr-vcer-20261121T073459Z-eb4e6cf7/result.md`

## 個票の入力（前提）

次の入力を作業の前提として参照する。完了条件は別節に従う。

- PJR-6998 の決定（2026-11-21、indie）: kata ドメイン（dct-kata.yaml、`base_path` /docs/ja/specdojo、グループ samples）に sample を kind: work の成果物として載せ、`local_id` は `<name>-sample`、rulebook は対応の型。代表は sample そのもの（駄菓子屋の共通の文脈）
- 2026-11-21 の試し（trial/prj-0001/kata-sample-catalog、commit せず捨てた）: dct-kata.yaml に tsp-index-sample と utc-sample を載せ、dct-index.yaml に domain kata を足すと、catalog validate・catalog build・index build・exec plan --deliverable utc-sample が通った。plan の targets は sample の frontmatter の ID（specdojo:utc-sample）になった
- PJR-ABY4 の範囲: 段は rulebook を簡潔に → sample を厚く → 簡潔さの確認（condense） → review → 人の確定。template は PJR-WYTX で扱う
- 2026-11-21 から opus で型の grade をし直している（run id regrade-kata-2026-11-21）。結果は docs/ja/projects/prj-0001/execution/grade/results/`specdojo.<name>-rulebook.yaml` と `specdojo.<name>-sample.yaml`
- agy（Antigravity）は使わない（PJR-5V0T）

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

## 再開の指示（2026-11-21T08:00:23.697Z）

利用者が再開の前に足した指示である。これまでの申し送りとあわせて、この指示に従って作業を続ける。

- 親の検証の test-unit で tests/src/docs/yaml-tables.test.ts のスナップショット（tests/fixtures/yaml-pages/prj-0001--sch-milestones.md.snap）が落ちた。schedule build が sch-milestones.yaml に第 3 波のマイルストーンを足したためで、変更は正しい。スナップショットを作り直し（npx vitest run --config vitest.unit.config.ts tests/src/docs/yaml-tables.test.ts -u）、そのテストが通ることを確かめる。
- 完了条件にない src/catalog/build-references.ts と tests/src/catalog/based-on.test.ts を変えている。kata ドメインのために要った理由と、変えなかった場合に何が起きるかを個票の対応結果と handoff に書く。要らない変更なら戻す。

`共通規約 sha256:e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e` `docs/ja/projects/prj-0001/execution/conventions/e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e.txt`
