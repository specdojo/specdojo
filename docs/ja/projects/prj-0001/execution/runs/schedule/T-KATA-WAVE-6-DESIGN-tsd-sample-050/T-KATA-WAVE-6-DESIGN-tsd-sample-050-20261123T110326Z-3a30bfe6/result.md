---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-design-tsd-sample-050-20261123t110326z-3a30bfe6
  type: exec-result
  task_id: T-KATA-WAVE-6-DESIGN-tsd-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-DESIGN-tsd-sample-050/T-KATA-WAVE-6-DESIGN-tsd-sample-050-20261123T110326Z-3a30bfe6/plan.md
  started_at: "2026-11-23T11:03:33.308Z"
  completed_at: "2026-11-23T16:18:59.618Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:tsd-sample
    - specdojo:tsd-sample
---

# Edit Result

## 1. 実施内容

- `docs/ja/specdojo/samples/tsd-sample.md` を grade の F001〜F018 に対応させて更新しました。rulebook と result は変更していません。
- 上位文書への参照、`_TODO_`/`_UNDECIDED_`/`_ASSUMPTION_` の付与、PostgreSQL の採用理由、設定の反映先、バックアップ実行場所、リストアの影響明示、検証可能な基準、動作確認の記録欄、表記統一などを直しました。
- PJR-76N9 に従い、文書の役割の割り当てと承認に関する記述は足していません。F002 の作成担当の明記は見送り、`_TODO_`、本書が依存する内容、作成までの暫定の正本を記載しました。
- `prettier` と `markdownlint` は通過しました。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も通過しました。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/tsd-sample.md`: 技術スタック詳細定義の sample を grade の指摘（F001〜F018）に沿って改訂しました。目的を上位文書の参照に改めました。`tsd-hosting.md` と `tsd-ci.md` の仮置きに `_TODO_` と依存内容を追記しました。繁忙期の未決事項は ISSUE-03 への参照に一本化しました。PostgreSQL 16.x の採用理由を改めました。容量の根拠には `_ASSUMPTION_` を付けました。1.4 の役割定義と 7.2 のバックアップ保管方針は、参照に置き換えるか技術操作だけに絞りました。サーバー設定には反映先と再起動の要否を加えました。バックアップの実行場所を明示しました。マイグレーションロックの手順は `migrate resolve` の引数付きに直しました。ISSUE-03 の基準は p95 などの測定条件に改めました。6.1 には確認環境・確認日・未確認条件の記録欄を設けました。`pg_restore` には事前バックアップ・停止・失われるデータ範囲・切り戻しを加えました。オフライン対応と外部転送は ISSUE-01/02 との関係を示し、未採択として扱いました。`kinuyo-db` は店名に合わせて表記を統一しました。リカバリ後の確認とバックアップ失敗の検知を追記しました。

## 3. 申し送り

- 利用者の決定が必要な値: ISSUE-02 の月額費用上限、ISSUE-03 の繁忙期の 1 時間あたり会計件数と p95 の閾値は `_UNDECIDED_` のままです。
- rulebook の変更案: 6.4 に、確認状況（環境・日付・未確認の条件）を記録する表の例を加えると、sample と書き方をそろえやすくなります。
- grade の指摘のうち、作成担当の明記を求める F002 は PJR-76N9 に従い反映しませんでした。合わせて直すべき点として記録します。
- 利用者が決める値として `_UNDECIDED_` のまま残した: ISSUE-02 の月額費用の上限、ISSUE-03 の繁忙期の 1 時間あたり会計件数と p95 の閾値（何秒以内か）、バックアップの保管期間（opd-index-sample の側で未決）。
- F002 は作成担当の明記を求めているが、PJR-76N9（文書の役割の割り当てを書かない）に従い書かなかった。代わりに `_TODO_`、本書が頼っている内容、作成までの暫定の正本を書いた。
- 9 章の表の「担当 Role」列は課題を解く担当（文書の中身）として残した。
- 事実確認済み: `fly postgres config update` に `--max-connections` / `--shared-buffers` / `--log-min-duration-statement` があることは公式ドキュメント（docs.fly.io/flyctl/postgres-config-update）で確認した。Prisma の `P3009` と `migrate resolve --rolled-back` / `--applied` による解消はコミュニティの回答・解説記事で確認した。Prisma 公式の該当ページ（pris.ly/d/migrate-resolve）は検索結果に出ず、確認していない。
- 事実確認が残る点: `--shared-buffers` の値の書式（公式ドキュメントに例がない）、Fly Postgres のデータのマウント先 `/data`、Prisma の `P3009` の公式ドキュメント上の表記。
- 動作確認の表の「開発端末で 2026-11-20 に成功（PostgreSQL 16.4、Prisma 5.22）」は、完成例として置いた架空の記録である。
- rulebook の変更案: 6.4 に、確認状況（環境・日付・未確認の条件）を記録する表の例を加えると、sample と書き方をそろえやすい。
- 適用外の検証: `npm run validate:history-links`（履歴蓄積ファイル（plan / result / 個票）を executor は変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更した YAML ファイルがない）

## 4. 進め方と実践の型の適用

grade の指摘 F001〜F018 を、rulebook・recipe・`sample-authoring-standard` に照らして修正しました。矛盾する点は rulebook を正としました。公式ドキュメントで確認できたのは `fly postgres config update` のオプション（`--max-connections`、`--shared-buffers`、`--log-min-duration-statement`）です。Prisma の `P3009` と `migrate resolve` はコミュニティの情報で確認しました。Prisma 公式ページは確認していません。確認が残る点は次の 3 つです。`--shared-buffers` の値の書式、Fly Postgres のデータのマウント先 `/data`、`P3009` の公式表記です。6.1 の動作確認の記録は完成例として置いた架空の値です。
