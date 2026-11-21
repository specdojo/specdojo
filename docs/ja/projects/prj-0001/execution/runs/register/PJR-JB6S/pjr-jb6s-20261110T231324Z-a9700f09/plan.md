---
specdojo:
  id: prj-0001:xep-pjr-jb6s-20261110t231324z-a9700f09
  type: exec-plan
  rulebook: none
  task_id: PJR-JB6S
  name: "GUI のデザインのルール（デザインシステム）の型を新しく作る"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
---

# Edit Plan: PJR-JB6S GUI のデザインのルール（デザインシステム）の型を新しく作る

## 1. このタスクで行うこと

プロジェクト登録簿の項目 PJR-JB6S「GUI のデザインのルール（デザインシステム）の型を新しく作る」に対応する。

uis はワイヤーフレームとレイアウトを含めないため、画面をまたいで見た目を揃えるデザインのルール（色・文字・余白などの基本の値、部品、レイアウトの型、アクセシビリティ）を、設計の新しい種類として定める rulebook と sample を作る

## 2. 対象項目

- `id`: PJR-JB6S
- `type`: todo
- `priority`: medium
- `owner`: _TODO_
- `due`: _TODO_
- `個票`: `docs/ja/projects/prj-0001/controls/project-register/pjr-jb6s-design-system-kata.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/register/PJR-JB6S/pjr-jb6s-20261110T231324Z-a9700f09/result.md`

## 個票の入力（前提）

次の入力を作業の前提として参照する。完了条件は別節に従う。

- indie の要望（2026-11-10）: uis はワイヤーフレームを含めないので、デザインシステムを別途設計として定める型を作る。
- orchestrator の案（PJR-MXQB の入力、2026-11-08）: デザインのルールは設計の範疇で、実装の共通ルールを扱う sysd-cross-cutting-policy とは分けた新しい型にする。ワイヤーフレームは文書として保守せず、uis とデザインのルールから agent に試作を作らせ、プロダクトのリポジトリに置く。nfr-usability は測れる目標を決める要求で、デザインのルールはそれを満たす設計の決まりにあたる。
- 略号・ID・置き場所（設計の文書の階層）は executor が既存の命名の標準と設計の型を読んで決め、理由を個票の対応結果に書く。

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

`共通規約 sha256:7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b` `docs/ja/projects/prj-0001/execution/conventions/7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b.txt`
