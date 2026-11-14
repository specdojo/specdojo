---
specdojo:
  id: prj-0001:xep-pjr-t01p-20261114t212456z-363c8196
  type: exec-plan
  rulebook: none
  task_id: PJR-T01P
  name: "agent の 1 段を速くする（親の検証の選び方・統合の commit・reporter・worktree の準備）"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
  owner: sol-executor
---

# Edit Plan: PJR-T01P agent の 1 段を速くする（親の検証の選び方・統合の commit・reporter・worktree の準備）

## 1. このタスクで行うこと

プロジェクト登録簿の項目 PJR-T01P「agent の 1 段を速くする（親の検証の選び方・統合の commit・reporter・worktree の準備）」に対応する。

1 段に 20〜30 分かかっている内訳を減らし、10〜12 分程度にする

## 2. 対象項目

- `id`: PJR-T01P
- `type`: todo
- `priority`: high
- `owner`: sol-executor
- `due`: _TODO_
- `個票`: `docs/ja/projects/prj-0001/controls/project-register/pjr-t01p-exec-stage-speedup.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/register/PJR-T01P/pjr-t01p-20261114T212456Z-363c8196/result.md`

## 個票の入力（前提）

次の入力を作業の前提として参照する。完了条件は別節に従う。

- 2026-11-14 の kata-wave-1 の実績（cpd-specdojo-cli-050）: worktree の準備 1.7 分、executor 6.8 分、親の検証 5.2 分、reporter（ローカルの gemma）3.7 分、統合 0.25 分。統合の commit のときに lefthook がテスト全体を流し直すと 7.8 分かかり、負荷で時間切れになって統合が止まることもあった（sysd-cross-cutting-policy-005）
- 親の検証の順番待ちは、`parent_validation_concurrency` を 2 にして先に解消した（2026-11-14）

## 3. 進め方

1. 個票（存在する場合）を読み、目的・完了条件・制約を把握する。登録簿の一覧は大きいため読まない。
2. 個票に完了条件がある場合はそれを作業の基準にする。無い場合はタイトルと説明から完了条件の仮説を立て、記録する。pipeline では個票の対応結果と executor の報告の `handoff` に書き、result を直接書ける実行形式では result に明記する。
3. 関連する成果物・設計書・実装を確認し、対象ファイルを特定して変更する。
4. 個票が存在する場合は、個票の作業内容・対応結果セクションを実施内容で更新する。
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

`共通規約 sha256:7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b` `docs/ja/projects/prj-0001/execution/conventions/7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b.txt`
