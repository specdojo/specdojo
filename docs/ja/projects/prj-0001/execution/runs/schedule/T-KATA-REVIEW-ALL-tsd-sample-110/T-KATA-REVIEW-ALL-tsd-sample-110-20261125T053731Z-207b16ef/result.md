---
specdojo:
  id: prj-0001:xer-t-kata-review-all-tsd-sample-110-20261125t053731z-207b16ef
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-tsd-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-tsd-sample-110/T-KATA-REVIEW-ALL-tsd-sample-110-20261125T053731Z-207b16ef/plan.md
  started_at: "2026-11-25T05:37:40.172Z"
  completed_at: "2026-11-25T05:51:00.185Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:tsd-sample
    - specdojo:tsd-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R1（目的の過不足）を `tsd-sample` に対して実施した。冒頭と目的は本番の DB 起動とダンプからの復元までを掲げているのに、導入の章が開発端末だけだった。このため本番環境の初期設定が欠けていると判断し、F003 に対応して足した。
- 対象範囲の表に Fly.io アプリとボリュームの作成を対象外として明示し、5 章に本番環境の初期設定手順を追加した。削る内容は見当たらなかった。
- F001 は R1 の観点に当たらないため扱わなかった。F002 は R3、F004 は R4、F005・F006 は R2 に任せる。
- 実行した検査は `npx prettier --check`（passed）と runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema`（いずれも passed）。ほかの runner 検査は変更種別により `not_applicable` だった。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/tsd-sample.md`: 1.2 の対象範囲の表に、対象外の行「Fly.io アプリとボリューム」を足した。委ねる先は `tsd-hosting.md` で、未作成の間は各アプリの `fly.toml` とした。5 章に「5.2. 本番環境の初期設定手順」を足した。作成済みのアプリとボリュームを開始条件に、設定値の反映、バックアップ用ロール（`pg_read_all_data`）の作成、`DATABASE_URL` の保存、`fly deploy --app kinuya-db-backup`、`npx prisma migrate deploy` の初回実行の 5 手順を既存の節への参照で書いた。旧 5.2 は 5.3 に繰り下げた。

## 3. 申し送り

- 指摘一覧（R1）。No: R1-1。段: R1。箇所: 5. 導入と初期設定。指摘: 目的は本番での DB 起動とダンプからの復元までを掲げるが、導入の章は開発端末だけで、本番の DB 環境とバックアップ環境の初期設定が欠けていた。確認表の「作成後に確認する」の前提を再現できない（F003）。直した案: 「5.2. 本番環境の初期設定手順」を足した。根拠: `vp-po-purpose-alignment`、`vp-qe-kata-conformance`。印: 要判断（アプリとボリュームの作成まで本書に書く案は、1.3 で `tsd-hosting` が 3 アプリの構成を持つとしているため採らなかった。コマンドとキーワードの正しさは R4 で確かめる）。
- 指摘一覧（R1）。No: R1-2。段: R1。箇所: 1.2. 対象範囲と責務境界。指摘: Fly.io の 3 アプリとボリュームの作成を本書と `tsd-hosting` のどちらが持つかが表から読めず、本番の構築手順の欠落が範囲外なのか抜けなのか判断できなかった。直した案: 対象外の行を足し、委ねる先を `tsd-hosting.md`（未作成の間は各アプリの `fly.toml`）とした。根拠: `vp-arc-single-responsibility`。印: なし。
- 指摘一覧（R1）。No: R1-3。段: R1。箇所: 1.3. 他文書との関係。指摘: `tsd-hosting.md` と `tsd-ci.md` の作成担当と時期が無い（F001）。直した案: 変更なし。根拠: 観点 `vp-pm-dependency-risk` は kata-guide の「kata の観点の組」で kata の段のレビューには使わない観点である。sample 本文に担当の割り当てを書くことも Sample 記述標準が禁止している。印: なし。
- 指摘一覧（R1）。No: R1-4。段: R1。箇所: 3 章、6.1 動作確認一覧、7.2、7.3。指摘: F002（`vp-arc-conciseness`）、F004（`vp-qe-verifiability`）、F005 と F006（`vp-qe-omissions-consistency`）は R1 の観点に当たらない。直した案: 変更なし。F002 は R3、F004 は R4、F005 と F006 は R2 に任せる。根拠: 各段の観点の割り当て。印: なし。
- R1-1: R1 / 5. 導入と初期設定 / 目的（本番で DB が起動し、ダンプから復元できる）に対し、導入の章が開発端末だけで本番の DB 環境とバックアップ環境の初期設定が欠けていた。動作確認の「作成後に確認する」の前提を再現できない（F003） / 「5.2. 本番環境の初期設定手順」を足し、作成済みのアプリとボリュームを開始条件として、設定値の反映、バックアップ用ロールの作成（`pg_read_all_data`）、`DATABASE_URL` の保存、`fly deploy --app kinuya-db-backup`、`npx prisma migrate deploy` の初回実行の 5 手順を既存の節への参照で書いた。旧 5.2 は 5.3 にした / vp-po-purpose-alignment、vp-qe-kata-conformance（rulebook の本文要件「導入・初期設定」） / 要判断（アプリとボリュームの作成まで本書に書く案は、1.3 で tsd-hosting が 3 アプリの構成を持つとしているため採らず、作成後の DB 固有の設定だけを書いた。コマンドとキーワードの正しさは R4 で確かめる）
- R1-2: R1 / 1.2. 対象範囲と責務境界 / Fly.io の 3 アプリとボリュームの作成を本書と tsd-hosting のどちらが持つかが対象範囲の表から読めず、本番の構築手順の欠落が範囲外なのか抜けなのか判断できなかった / 対象外の行「Fly.io アプリとボリューム」を足し、委ねる先を `tsd-hosting.md`（未作成の間は各アプリの `fly.toml`）とした / vp-arc-single-responsibility / -
- R1-3: R1 / 1.3. 他文書との関係 / `tsd-hosting.md`・`tsd-ci.md` の作成担当と時期が無い（F001） / - / 使う観点 vp-pm-dependency-risk は、kata-guide の「kata の観点の組」で kata の段のレビューでは使わない観点のため扱わない。sample 本文に担当の割り当てを書くことも Sample 記述標準が禁止している / -
- R1-4: R1 / 3. 全体構成と接続経路・6.1 動作確認一覧・7.2・7.3 / F002（図をなぞる文、vp-arc-conciseness）、F004（動作確認 7 の閾値、vp-qe-verifiability）、F005（ダンプの日付の基準、vp-qe-omissions-consistency）、F006（7.3 の切り戻し用ダンプとアプリ停止の順序、vp-qe-omissions-consistency）はこの段の観点に当たらない / - / F002 は R3、F004 は R4、F005・F006 は R2 に任せる / -

## 4. 進め方と実践の型の適用

根拠にしたのは、`tsd-sample` の frontmatter から辿れる rulebook（`tsd-rulebook`）の本文要件「導入・初期設定」、Sample 記述標準、kata-guide の R1 の定義である。冒頭と目的が本番の DB 起動とダンプからの復元までを掲げるのに、導入の章が開発端末だけという過不足を F003 から確認し、補った。補う範囲は DB 固有の設定に限った。Fly.io アプリとボリュームの作成は 1.3 で `tsd-hosting` が持つとされているため、対象範囲の表で対象外と明示した。既存の記述のうち目的に沿うものは維持し、削る内容はなかった。F001 は R1 の観点外、F002 は R3、F004 は R4、F005・F006 は R2 の観点であり、この段では扱っていない。5.2 のコマンドとキーワードの正しさは未確認のため、R4 で確かめる。rulebook など sample 以外は変更していない。成果物 frontmatter の `status` は `draft` のまま据え置いた。
