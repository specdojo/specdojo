---
specdojo:
  id: prj-0001:xep-pjr-ftrc-20261108t152439z-3b62d76a
  type: exec-plan
  rulebook: none
  task_id: PJR-FTRC
  name: "lint:fm が git の管理外の生成物まで検査して親の検証を落とさないようにする"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
---

# Edit Plan: PJR-FTRC lint:fm が git の管理外の生成物まで検査して親の検証を落とさないようにする

## 1. このタスクで行うこと

プロジェクト登録簿の項目 PJR-FTRC「lint:fm が git の管理外の生成物まで検査して親の検証を落とさないようにする」に対応する。

lint:fm（remark の frontmatter 検査）が `docs/\*\*/\*.md` をすべて読み、.gitignore で管理外にした生成物（grade の一時ファイルなど）の schema の警告で --frail により失敗する。git の管理外の生成物を検査の対象から外す

## 2. 対象項目

- `id`: PJR-FTRC
- `type`: todo
- `priority`: medium
- `owner`: _TODO_
- `due`: _TODO_
- `個票`: `docs/ja/projects/prj-0001/controls/project-register/pjr-ftrc-lint-fm-skip-gitignored-generated.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/register/PJR-FTRC/pjr-ftrc-20261108T152439Z-3b62d76a/result.md`

## 個票の入力（前提）

次の入力を作業の前提として参照する。完了条件は別節に従う。

- 2026-11-08、PJR-STM9 の executor が worktree で grade を流し、docs/ja/projects/prj-0001/execution/grade/generated/runs/ に一時ファイル（.gitignore の `docs/**/generated/*` で管理外）が残り、親の検証 lint-fm がその frontmatter の警告で失敗した。orchestrator が一時ファイルを消して --resume した（indie が承認）。
- .remarkignore は空で、lint:fm は node packages/docs-lint/bin/specdojo-docs-lint.js remark `"docs/**/*.{md,mdx}"` --quiet --frail で動く。
- 直し方（.remarkignore に足す、.gitignore を読む、docs-lint 側で除外する、など）は executor が決め、理由を個票の対応結果に書く。

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
