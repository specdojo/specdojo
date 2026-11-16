---
specdojo:
  id: prj-0001:xep-pjr-cbv6-20261110t224636z-f122261e
  type: exec-plan
  rulebook: none
  task_id: PJR-CBV6
  name: "grade で YAML の成果物を評価できるようにする"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
---

# Edit Plan: PJR-CBV6 grade で YAML の成果物を評価できるようにする

## 1. このタスクで行うこと

プロジェクト登録簿の項目 PJR-CBV6「grade で YAML の成果物を評価できるようにする」に対応する。

PJR-JQSB の決定どおり、grade が YAML の成果物のメタ情報を validate:schema と同じ読み方（最上位か x-spec-meta）で読み、YAML の本文を評価し、結果をサイドカーに残せるようにする

## 2. 対象項目

- `id`: PJR-CBV6
- `type`: todo
- `priority`: medium
- `owner`: _TODO_
- `due`: _TODO_
- `個票`: `docs/ja/projects/prj-0001/controls/project-register/pjr-cbv6-grade-yaml-support.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/register/PJR-CBV6/pjr-cbv6-20261110T224636Z-f122261e/result.md`

## 個票の入力（前提）

次の入力を作業の前提として参照する。完了条件は別節に従う。

- PJR-JQSB（indie が決定、2026-11-10）: 案 A。ハッシュは YAML のファイルの内容から取り、指摘の行番号は元の YAML の行を指す。Markdown の扱いは変えない。
- 対象の例: docs/ja/product/010-business-specs/020-data-model/bdd-register-entry.yaml（最上位の id など）、docs/ja/product/020-external-interface-specs/ifx-cmd-ai-provider-cli.yaml、YAML の kata の sample（bdd-sample.yaml・ifx-cmd-sample.yaml）。

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

### 夜間 autopilot の制約

この個票は人が記載済みの完了条件だけを承認した。次の操作は行わない。必要になった場合は、理由を result の申し送りへ記録して異常終了する。

- decision の決定、保護された設定の変更、公開・tag・push。
- 公開済み CHANGELOG 節の変更、未承認項目の実行、完了条件や変更範囲の拡張。
- 別の登録項目を自分で実行すること。見つけた別問題は夜間 orchestrator が承認待ちとして起票する。

## 4. 完了手順

1. 「進め方」に従って対応を完了する。
2. 共通規約に従って、必要な整形・静的検査を実行する。
3. result に実施内容・変更ファイル・申し送りを記入する。pipeline では executor は実施内容・変更ファイル・検証結果を報告し、申し送りを `handoff` に記載する。reporter と runner が result を記入する。これはタスク完了に必須であり、_TODO_ を残したまま終了しない（詳細は共通規約を参照）。
4. 登録簿（`pjr-index.md`）の行と個票のステータス項目は変更しない。状態遷移（review / close など）は runner と人間が行う。

## 5. 異常終了の条件

- 前提不足・対象ファイル不明・静的検査未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- agent 自身は登録簿の状態を変更せず、終了コードと標準エラー出力で runner に結果を返す。

## 再開時の追加の指示（orchestrator、2026-11-11）

- 親の検証で、足したテストのうち `tests/src/grade/yaml.test.ts` の「reads metadata and preserves every source line for top-level.yaml」（読んだメタ情報に期待にない項目が 1 つ多い）と、`tests/src/grade/yaml.integration.test.ts` の「lists, plans, runs, applies and reads YAML deliverables and samples」が落ちた。実装とテストのどちらが正しいかを確かめて直す。
- `tests/src/shared/git-environment-isolation.test.ts` と `tests/packages/docs-lint/history-links.test.ts` は 5 秒の時間切れで、負荷によるものとみられる。足したコードで git を起動する箇所があれば `gitEnvironment()` を使っていることを確かめる。
- 直した後に `npm run test:unit -- tests/src/grade/yaml.test.ts` と `npm run test:integration -- tests/src/grade/yaml.integration.test.ts` を流して通ることを確かめ、経緯を報告の `handoff` に書く。

`共通規約 sha256:7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b` `docs/ja/projects/prj-0001/execution/conventions/7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b.txt`
