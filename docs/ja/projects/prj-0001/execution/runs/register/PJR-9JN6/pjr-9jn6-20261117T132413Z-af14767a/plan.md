---
specdojo:
  id: prj-0001:xep-pjr-9jn6-20261117t132413z-af14767a
  type: exec-plan
  rulebook: none
  task_id: PJR-9JN6
  name: "完了条件の保護された設定の一覧が変更範囲と読まれ、関係のない項目が順番待ちになる"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
  owner: DEV
---

# Edit Plan: PJR-9JN6 完了条件の保護された設定の一覧が変更範囲と読まれ、関係のない項目が順番待ちになる

## 1. このタスクで行うこと

プロジェクト登録簿の項目 PJR-9JN6「完了条件の保護された設定の一覧が変更範囲と読まれ、関係のない項目が順番待ちになる」に対応する。

保護された設定を「変えない」と書いた完了条件の文から .agents などが変更範囲として推定され、触る範囲の違う項目どうしが重なると判定される

## 2. 対象項目

- `id`: PJR-9JN6
- `type`: issue
- `priority`: medium
- `owner`: DEV
- `due`: 2026-11-30
- `個票`: `docs/ja/projects/prj-0001/controls/project-register/pjr-9jn6-change-scope-protected-list-overlap.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/register/PJR-9JN6/pjr-9jn6-20261117T132413Z-af14767a/result.md`

## 個票の入力（前提）

次の入力を作業の前提として参照する。完了条件は別節に従う。

- 2026-11-17 に PJR-8NB8 と PJR-C07H を並べて流すと、C07H が「[scope] waiting: PJR-C07H — PJR-8NB8: project:.agents <> project:.agents」で 8NB8 の統合まで待った。8NB8 は JSEY の手順のコマンド化、C07H は親の検証の計測で、どちらも .agents を変える予定はない
- どちらの完了条件にも「保護された設定（lefthook.yml・.agents/・.claude/・.codex/・package.json・.specdojo/ など）は変えない」という文があり、ほかの多くの項目の完了条件にも同じ文がある。PJR-MJ8V の 2 回目で plan の共通の手順は推定から外したが、項目ごとの完了条件の中の「変えない」と書いた一覧は推定に残っている
- 2026-11-17 の 2 回目では、PJR-9JN6 自身が「[scope] PJR-9JN6 blocked by unintegrated PJR-8NB8: project:CHANGELOG.md <> project:CHANGELOG.md」で止まった。どちらの完了条件にも「`CHANGELOG.md` は変えず、個票の対応結果に文案を書く」（PJR-EPQ3）という文がある。先行の項目の親の検証が失敗すると、誤って重なった後続の項目は待つのではなく止まる（8NB8 の失敗で C07H・8S4T・9JN6 の 3 件が止まった）
- 止まりはしないが、この文を持つ項目は並べても順番に流れ、並べる効果がなくなる

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
