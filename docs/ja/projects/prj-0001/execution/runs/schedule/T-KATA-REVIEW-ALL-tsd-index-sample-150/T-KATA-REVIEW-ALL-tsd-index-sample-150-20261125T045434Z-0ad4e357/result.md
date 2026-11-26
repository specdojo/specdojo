---
specdojo:
  id: prj-0001:xer-t-kata-review-all-tsd-index-sample-150-20261125t045434z-0ad4e357
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-tsd-index-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-tsd-index-sample-150/T-KATA-REVIEW-ALL-tsd-index-sample-150-20261125T045434Z-0ad4e357/plan.md
  started_at: "2026-11-25T04:54:43.719Z"
  completed_at: "2026-11-25T05:07:45.250Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:tsd-index-sample
    - specdojo:tsd-index-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R5（整合）として、`tsd-index-sample` を同じ接頭辞の `tsd-sample` と突き合わせ、食い違う 2 箇所を sample 側で直した。
- grade の F001（ホスティングと CI/CD の `_TODO_` の三重記述）は、現行版に該当する記述がなく、前の段で解消済みのため変更していない。
- 相手側の `cdr-sample` に直す点が 1 件あり、sample には手を入れず handoff に案を残した。
- executor が実行した `npx prettier --write` は表の列幅を整えただけで、内容は変えていない。runner の `lint:md:changed`・`lint:fm:changed`・`lint:mermaid`・`lint:d2`・`test:docs`・`validate:schema` はすべて passed。 | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | 1 | R5 | 技術スタック一覧 ホスティング（Fly.io）行の担当責務 | 「Web アプリケーションと DB コンテナの実行」では、`tsd-sample` の 3 アプリ構成（`kinuya-app`・`kinuya-db`・`kinuya-db-backup`）のうちバックアップ用アプリが抜けている。DB がコンテナかどうかも食い違って読める。 | 「店頭画面・API（`kinuya-app`）、DB（`kinuya-db`）、日次バックアップ（`kinuya-db-backup`）の東京リージョンでの実行」に直した（反映済み）。 | `[[specdojo:tsd-sample]]` の実行環境と責務分界の表、他文書との関係の `tsd-hosting.md` の項 | - | | 2 | R5 | 技術スタック一覧 DB（PostgreSQL）行の版・正本 | 適用範囲は本番と開発なのに、版の正本が開発端末の `docker-compose.yml` だけになっている。`tsd-sample` では本番 DB は Fly.io アプリ `kinuya-db` の Fly Postgres で、構成の正本は各アプリの `fly.toml` である。 | 「16.x / `docker-compose.yml`、`kinuya-db` の `fly.toml`」に直した（反映済み）。 | `[[specdojo:tsd-sample]]` の実行環境の表、`tsd-hosting.md` の項 | 要判断 | | 3 | R5 | grade F001（ホスティングと CI/CD の `_TODO_` の三重記述） | 指摘が引いた文と「未作成の詳細文書」の節は現行版にない。`_TODO_` は参照先の役割と適用条件の表の 1 か所だけで、一覧の備考はその表への参照になっている。 | 変更なし（前の段で解消済み）。 | `vp-arc-conciseness`、現行の `tsd-index-sample` | - | | 4 | R5 | 相手側 `cdr-sample` のエラー処理の項（Sentry への記録） | `cdr-sample` は API ルートの想定外の失敗を、共通のエラー応答処理で必ず Sentry へ記録するように読める。一方 `tsd-index-sample` では、Sentry は通知先を環境変数に設定した場合だけ使う任意の扱いである。 | 相手側を直す案: `cdr-sample` に「通知先が設定されている場合」の条件を足す。または `tsd-index-sample` の Sentry を本番必須に変える。どちらかに合わせる（今回は変更していない）。 | `[[specdojo:cdr-sample]]` のエラー処理の項、`[[specdojo:tsd-index-sample]]` のエラー監視の行 | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/tsd-index-sample.md`: 技術スタック一覧の 2 行を `tsd-sample` に合わせて直した。Fly.io 行の担当責務は 3 アプリ構成（`kinuya-app`・`kinuya-db`・`kinuya-db-backup`）の東京リージョンでの実行にした。PostgreSQL 行の版・正本には `kinuya-db` の `fly.toml` を足した。あわせて prettier で表の列幅を整えた。

## 3. 申し送り

- No.2 の判断事項: Fly Postgres の版を `fly.toml` のイメージ指定で決める、という前提は executor の推定である。人がこの前提を採るか、PostgreSQL 行を戻すかを確かめる。
- No.4 の判断事項: `cdr-sample` と `tsd-index-sample` の Sentry の扱いは、どちらを正にするかが未決である。相手側の `cdr-sample` を直すか、`tsd-index-sample` を本番必須に変えるかを人が決める。
- No.1: R5 / 技術スタック一覧 ホスティング（Fly.io）行の担当責務 / 「Web アプリケーションと DB コンテナの実行」だけでは、tsd-sample の実行環境の表にある 3 アプリ構成（`kinuya-app`・`kinuya-db`・`kinuya-db-backup`）のうちバックアップ用アプリが抜けており、DB がコンテナかどうかも食い違って読める / 「店頭画面・API（`kinuya-app`）、DB（`kinuya-db`）、日次バックアップ（`kinuya-db-backup`）の東京リージョンでの実行」に直した（反映済み） / [[specdojo:tsd-sample]] の実行環境と責務分界の表、他文書との関係の `tsd-hosting.md` の項 / -
- No.2: R5 / 技術スタック一覧 DB（PostgreSQL）行の版・正本 / 適用範囲は本番・開発なのに、版の正本が開発端末の `docker-compose.yml` だけになっている。tsd-sample では本番 DB は Fly.io アプリ `kinuya-db` の Fly Postgres で、構成の正本は各アプリの `fly.toml` / 「16.x / `docker-compose.yml`、`kinuya-db` の `fly.toml`」に直した（反映済み） / [[specdojo:tsd-sample]] の実行環境の表、`tsd-hosting.md` の項（作成までは各アプリの `fly.toml` を正本とする） / 要判断（Fly Postgres の版を `fly.toml` のイメージ指定で決めるという前提は推定。人が採るか戻すかを確かめる）
- No.3: R5 / grade F001（ホスティングと CI/CD の `_TODO_` の三重記述） / 今の版には指摘が引いた文（「ホスティングの詳細: `_TODO_:` ...」）も「未作成の詳細文書」の節もない。`_TODO_` は参照先の役割と適用条件の表の 1 か所だけで、一覧の備考は「参照先の役割と適用条件」への参照になっている / 変更なし（前の段で解消済み） / `vp-arc-conciseness`、現行の tsd-index-sample / -
- No.4: R5 / 相手側 cdr-sample のエラー処理の項（Sentry への記録） / cdr-sample は API ルートの想定外の失敗を共通のエラー応答処理で必ず Sentry へ記録するように読める。一方、tsd-index-sample では Sentry は「本番環境（任意: 通知先を環境変数に設定した場合のみ）」 / 相手側を直す案: cdr-sample に「通知先が設定されている場合」の条件を足すか、tsd-index-sample の Sentry を本番必須に変えるかを決め、どちらかに合わせる（今回は変更していない） / [[specdojo:cdr-sample]] のエラー処理の項、[[specdojo:tsd-index-sample]] のエラー監視の行 / 要判断
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/samples/ 配下の sample だけで、plan・result・個票を変更していないため）

## 4. 進め方と実践の型の適用

`sample-maintenance` の R5（整合）として、`tsd-index-sample` を `tsd-sample` と `cdr-sample` に突き合わせた。`tsd-sample` との食い違い 2 点は sample 側で直し、`cdr-sample` 側の食い違いは変更せず handoff に案を書いた。grade の F001（`vp-arc-conciseness`）は、現行版に該当する三重記述がなく、前の段で解消済みと確認して変更を見送った。判断に迷った No.2 と No.4 には「要判断」の印を付けた。
