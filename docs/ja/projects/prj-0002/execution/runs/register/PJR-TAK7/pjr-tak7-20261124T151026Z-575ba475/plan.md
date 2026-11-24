---
specdojo:
  id: prj-0002:xep-pjr-tak7-20261124t151026z-575ba475
  type: exec-plan
  rulebook: none
  task_id: PJR-TAK7
  name: "specdojo-lp の公開に向けて LICENSE を加え、README に showcase の案内を書く"
  mode: edit
  status: ready
  project_id: prj-0002
  origin: register
  owner: DEV
---

# Edit Plan: PJR-TAK7 specdojo-lp の公開に向けて LICENSE を加え、README に showcase の案内を書く

## 1. このタスクで行うこと

プロジェクト登録簿の項目 PJR-TAK7「specdojo-lp の公開に向けて LICENSE を加え、README に showcase の案内を書く」に対応する。

specdojo-lp を showcase として公開する前に MIT の LICENSE を置き、マスコット画像を対象外とする扱いと登録簿の項目への辿り方を README に書く

## 2. 対象項目

- `id`: PJR-TAK7
- `type`: todo
- `priority`: medium
- `owner`: DEV
- `due`: 2026-11-30
- `個票`: `docs/ja/projects/prj-0002/controls/project-register/pjr-tak7-lp-public-license-readme.md`
- `result`: `docs/ja/projects/prj-0002/execution/runs/register/PJR-TAK7/pjr-tak7-20261124T151026Z-575ba475/result.md`

## 個票の入力（前提）

次の入力を作業の前提として参照する。完了条件は別節に従う。

- specdojo-lp（GitHub の specdojo/specdojo-lp）は非公開で、LICENSE がない。showcase として公開する予定である。
- 公開前の調査で、全ブランチの履歴に秘密の情報や削除済みの機密ファイルはなく、公開を妨げるものはないことを確認した。
- ライセンスは PO の決定により、specdojo 本体と同じ MIT（Copyright (c) 2025 Tiny Shrine）とする。
- src/assets/mascot/dojo-otter.webp は ChatGPT で作った暫定の画像で、正式な画像は specdojo-assets で作る。PO の決定により、マスコット画像は MIT の対象外とし、転用・改変を許可しない。
- commit の Refs: prj-0002:PJR-XXXX は、公開中の specdojo/specdojo の project/prj-0002/develop ブランチで登録簿の項目へ辿れる。
- CHANGELOG は specdojo-lp の README の決まりに従い、Unreleased へ追記する。
- リポジトリを Public に切り替える操作は本項目に含めず、確認のあとで人が行う。
- PO の決定により、公開後は GitHub の設定で PR の作成を Collaborators only にし、外からの PR は受け付けない。設定の変更は人が行う。
- `package.json` は保護された設定のため、`"license": "MIT"` の追加はオーケストレーターが `feature/prj-0002/lp-package-license` で行い、LP の `develop` へ取り込み済みである（`1a9c2f3`）。

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

## 再開の指示（2026-11-24T15:24:46.772Z）

利用者が再開の前に足した指示である。これまでの申し送りとあわせて、この指示に従って作業を続ける。

- LP の作業ツリーで npm run lint:md・npm run format:check・npm run build を流し、結果を検証として記録する。成果物はできているので、変更は検査で必要になった場合に限る。

`共通規約 sha256:e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e` `docs/ja/projects/prj-0002/execution/conventions/e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e.txt`
