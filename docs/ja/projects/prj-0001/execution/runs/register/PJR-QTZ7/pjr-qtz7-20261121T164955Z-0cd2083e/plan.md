---
specdojo:
  id: prj-0001:xep-pjr-qtz7-20261121t164955z-0cd2083e
  type: exec-plan
  rulebook: none
  task_id: PJR-QTZ7
  name: "外部プロジェクトへの register add --commit で、-m の段落がカンマで件名につながる"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
  owner: DEV
---

# Edit Plan: PJR-QTZ7 外部プロジェクトへの register add --commit で、-m の段落がカンマで件名につながる

## 1. このタスクで行うこと

プロジェクト登録簿の項目 PJR-QTZ7「外部プロジェクトへの register add --commit で、-m の段落がカンマで件名につながる」に対応する。

`external\_projects` へ register add --commit -m を複数渡すと、各段落が改行ではなくカンマで連結され、本文と Co-Authored-By の行が件名の1行に入る。また相手のリポジトリの commit-msg hook で commit が失敗したとき、CLI は書き込んだファイルの一覧と「not committed」だけを示し、失敗の理由（hook の出力）を出さない。段落を git commit -m と同じに扱い、commit の失敗の理由を示す

## 2. 対象項目

- `id`: PJR-QTZ7
- `type`: issue
- `priority`: medium
- `owner`: DEV
- `due`: _TODO_
- `個票`: `docs/ja/projects/prj-0001/controls/project-register/pjr-qtz7-external-register-commit-message.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/register/PJR-QTZ7/pjr-qtz7-20261121T164955Z-0cd2083e/result.md`

## 個票の入力（前提）

次の入力を作業の前提として参照する。完了条件は別節に従う。

- 発端は利用者のプロジェクト coderdojo-lessons-specdojo（SpecDojo 0.9.2、2026-11-21）。
- register add --project `<外部の別名>` --commit -m `<件名>` -m `<本文>` -m `<Co-Authored-By>` で起票したところ、相手のリポジトリの commit の件名が「`<件名>`,`<本文>`,`<Co-Authored-By>`」の1行（275 文字・414 文字）になった。この2件（PJR-FGKB・PJR-F6MC）の commit は orchestrator がメッセージだけを作り直した。
- 別の起票では、本文の1行が commitlint の body-max-line-length（100 文字）を超え、相手の commit-msg hook で commit が失敗した。CLI の出力は「The register changes were written but not committed:」とファイルの一覧だけで、理由は手で git commit を流して初めて分かった。個票とイベントは相手の作業ツリーに未 commit のまま残った（PJR-7KQT）。
- help の -m の説明は「each value becomes a paragraph, as in git commit -m」で、ローカルの project への起票ではそのとおりに動く。

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
