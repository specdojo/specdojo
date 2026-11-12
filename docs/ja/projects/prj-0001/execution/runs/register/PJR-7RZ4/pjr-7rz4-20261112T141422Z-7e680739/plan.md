---
specdojo:
  id: prj-0001:xep-pjr-7rz4-20261112t141422z-7e680739
  type: exec-plan
  rulebook: none
  task_id: PJR-7RZ4
  name: "project を別リポジトリへ移す手順のガイドを書く"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
  owner: sol-executor
---

# Edit Plan: PJR-7RZ4 project を別リポジトリへ移す手順のガイドを書く

## 1. このタスクで行うこと

プロジェクト登録簿の項目 PJR-7RZ4「project を別リポジトリへ移す手順のガイドを書く」に対応する。

project を管理用の別リポジトリへ移す手順（履歴の切り出し、設定の写し、`external\_projects` の宣言、Kata の版の固定、文書サイトから外す）をガイドに書く

## 2. 対象項目

- `id`: PJR-7RZ4
- `type`: todo
- `priority`: medium
- `owner`: sol-executor
- `due`: 2026-12-31
- `個票`: `docs/ja/projects/prj-0001/controls/project-register/pjr-7rz4-project-move-guide.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/register/PJR-7RZ4/pjr-7rz4-20261112T141422Z-7e680739/result.md`

## 個票の入力（前提）

次の入力を作業の前提として参照する。完了条件は別節に従う。

- 利用者は、prj-0002（specdojo-lp の管理）を将来、管理用の別リポジトリ（例: specdojo-lp-specdojo）へ移す可能性を考え、安全に移すための機能を用意することを求めた。全自動の移行コマンドは後回しにし、読むだけの点検・手順のガイド・リポジトリをまたぐリンクの 3 件に分けると判断した（2026-11-03）
- 手順に含める項目: git subtree split などで `base_path` の履歴だけを新しいリポジトリへ切り出す（共有の履歴は書き換えない）、specdojo.config.json の project の項目と .specdojo の名簿・exec-defaults を写して元から外す、移した後も互いに起票できるよう `external_projects` に別名を宣言する、Kata を npm パッケージから参照して版を固定する、元のリポジトリの文書サイトのサイドメニューから外す、登録簿の ID と commit の Refs は project の ID を変えなければそのまま使える（2026-11-03）
- 読むだけの点検（同時に起票する todo）と、リポジトリをまたぐリンクの書き方（同時に起票する todo）を手順の中で使う（2026-11-03）

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
