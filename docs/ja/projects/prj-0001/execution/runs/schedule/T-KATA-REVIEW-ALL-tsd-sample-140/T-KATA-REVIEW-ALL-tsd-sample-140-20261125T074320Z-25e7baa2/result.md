---
specdojo:
  id: prj-0001:xer-t-kata-review-all-tsd-sample-140-20261125t074320z-25e7baa2
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-tsd-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-tsd-sample-140/T-KATA-REVIEW-ALL-tsd-sample-140-20261125T074320Z-25e7baa2/plan.md
  started_at: "2026-11-25T07:43:30.022Z"
  completed_at: "2026-11-25T13:53:53.930Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:tsd-sample
    - specdojo:tsd-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として、`tsd-sample` に書かれた事実を正本と突き合わせた。誤りは動作確認 1 の期待結果の 1 件で、これを直した。
- Fly.io の `fly status` は STATE 列が `started`/`stopped` で、再起動回数は出力されない。確認方法を `docker compose ps postgres --format '{{.State}}'` と `fly status --app kinuya-db` に改め、期待結果を「開発端末は `running`、DB 環境は `STATE` 列が `started`」にした。
- `fly ssh console --app kinuya-app -C "nc -zv kinuya-db.internal 5432"` は、本番イメージに `nc` が入っているか確かめられなかったため、確かめられない主張として残した。
- 実行済みの検査は executor の `npx prettier --write` で、表の列幅を整形した。runner の検査では `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が通った。変更種別により対象外となった検査は `lint:ts`、`lint:md`、`lint:fm`、`test:integration`、`typecheck`、`test:unit` である。
- 確かめの表（主張、正本、確かめ方、結果）は、下の `findings` に 9 件で記載した。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R4 正しさ | `fly postgres config update` の `--max-connections`、`--shared-buffers`、`--log-min-duration-statement`（単位 ms）、`-a, --app` | 公式のフラグ一覧と一致した。 | - | `https://docs.fly.io/flyctl/postgres-config-update`。公式のフラグ一覧を読んで確認した。 | 一致 |
| 2 | R4 正しさ | 動作確認 1 の期待結果「状態が `running`、再起動回数が増えていない」 | `fly status` の STATE 列は `started`/`stopped` で、再起動回数は出力されない。 | 確認方法を `docker compose ps postgres --format '{{.State}}'` と `fly status --app kinuya-db` にし、期待結果を「開発端末は `running`、DB 環境は `STATE` 列が `started`」に直した。 | `https://www.fly.io/docs/hands-on/view-app/`。`fly status` の Machine 一覧の出力例を読んで確認した。 | 不一致（修正済み） |
| 3 | R4 正しさ | `SHOW log_min_duration_statement;` が `1s`、`shared_buffers` 256MB（RAM の 25%）、`max_connections` と `shared_buffers` は再起動が必要、`log_min_duration_statement` は再読み込みで反映 | PostgreSQL 16 の仕様と一致すると判断した。 | - | PostgreSQL 16 の仕様。知識で照合した（ドキュメントは読み直していない）。 | 一致（知識による照合） |
| 4 | R4 正しさ | PostgreSQL 16 の保守期限 2028 年 11 月 | PostgreSQL の版の方針と一致すると判断した。 | - | PostgreSQL の版の方針。知識で照合した。 | 一致（知識による照合） |
| 5 | R4 正しさ | Prisma の `connection_limit`、`migrate status` の出力 `Database schema is up to date!`、P1001/P3009、`migrate resolve --rolled-back/--applied`、`prisma -v` | Prisma 5 の仕様と一致すると判断した。 | - | Prisma 5 の仕様。知識で照合した。 | 一致（知識による照合） |
| 6 | R4 正しさ | `pg_read_all_data`（PostgreSQL 14 以降）、`pg_dump -F c`、`pg_restore --clean --if-exists --no-owner`、`fly ssh sftp get`、`fly scale count`、`fly machine restart` | PostgreSQL と flyctl の仕様と一致すると判断した。 | - | PostgreSQL と flyctl の仕様。知識で照合した。 | 一致（知識による照合） |
| 7 | R4 正しさ | cron `0 18 * * *`（UTC）が JST 03:00、6PN は WireGuard で暗号化、`.internal` の名前解決 | 時差の計算と Fly.io のネットワークの仕様に一致すると判断した。 | - | Fly.io のネットワークの仕様。時差の計算と知識で照合した。 | 一致（知識による照合） |
| 8 | R4 正しさ | `fly ssh console --app kinuya-app -C "nc -zv kinuya-db.internal 5432"` | `kinuya-app` のイメージに `nc` が入っているか確かめられなかった。 | - | `kinuya-app` のイメージ。本番イメージでの確認が必要。 | 確かめられない |
| 9 | R4 正しさ | `npm run test:unit -- tests/db/connection.test.ts` | 正本のない駄菓子屋プロジェクトの仮定のため、確かめの対象にしなかった。 | - | 共通サンプル文脈と食い違わない仮定。 | 対象外 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/tsd-sample.md`: 動作確認 1 の確認コマンドと期待結果を、`fly status` の実際の出力（STATE 列は `started`、再起動回数は出ない）に合わせて直した。あわせて prettier で表の列幅を整形した。差分は 9 行追加、9 行削除。

## 3. 申し送り

- F001（`vp-pm-dependency-risk`）は kata レビューの段で使わない観点のため、この段では扱っていない。F002（`vp-arc-conciseness`）は R3 の観点のため扱っていない。executor は F003〜F006 を前の段で解消済みとしている。
- `nc` の有無は本番イメージで確かめる必要がある。PostgreSQL 16、Prisma 5、Fly.io のネットワークに関する主張は、executor が知識で照合しただけで、ドキュメントは読み直していない。
- R4 確かめの表 No1: `fly postgres config update` の `--max-connections`/`--shared-buffers`/`--log-min-duration-statement`（ms）、`-a, --app` | 正本: `https://docs.fly.io/flyctl/postgres-config-update` | 確かめ方: 公式のフラグ一覧を読んだ | 結果: 一致
- R4 確かめの表 No2: 動作確認 1 の期待結果「状態が `running`、再起動回数が増えていない」 | 正本: `https://www.fly.io/docs/hands-on/view-app/` | 確かめ方: `fly status` の Machine 一覧の出力例を読んだ | 結果: 不一致。STATE 列は `started`/`stopped` で、再起動回数は出ない → 確認方法を `docker compose ps postgres --format '{{.State}}'` と `fly status --app kinuya-db` にし、期待結果を「開発端末は `running`、DB 環境は `STATE` 列が `started`」に直した
- R4 確かめの表 No3: `SHOW log_min_duration_statement;` が `1s`、`shared_buffers` 256MB（RAM の 25%）、`max_connections`/`shared_buffers` は再起動、`log_min_duration_statement` は再読み込み | 正本: PostgreSQL 16 の仕様 | 確かめ方: 知識で照合（ドキュメントは読み直していない） | 結果: 一致と判断
- R4 確かめの表 No4: PostgreSQL 16 の保守期限 2028 年 11 月 | 正本: PostgreSQL の版の方針 | 確かめ方: 知識で照合 | 結果: 一致と判断
- R4 確かめの表 No5: Prisma の `connection_limit`、`migrate status` の出力 `Database schema is up to date!`、P1001/P3009、`migrate resolve --rolled-back/--applied`、`prisma -v` | 正本: Prisma 5 の仕様 | 確かめ方: 知識で照合 | 結果: 一致と判断
- R4 確かめの表 No6: `pg_read_all_data`（PG14 以降）、`pg_dump -F c`、`pg_restore --clean --if-exists --no-owner`、`fly ssh sftp get`、`fly scale count`、`fly machine restart` | 正本: PostgreSQL と flyctl の仕様 | 確かめ方: 知識で照合 | 結果: 一致と判断
- R4 確かめの表 No7: cron `0 18 * * *`（UTC）= JST 03:00、6PN は WireGuard で暗号化、`.internal` の名前解決 | 正本: Fly.io のネットワークの仕様 | 確かめ方: 時差の計算と知識で照合 | 結果: 一致と判断
- R4 確かめの表 No8: `fly ssh console --app kinuya-app -C "nc -zv kinuya-db.internal 5432"` | 正本: `kinuya-app` のイメージ | 結果: 確かめられない。イメージに `nc` が入っているかは本番イメージで確かめる必要がある
- R4 確かめの表 No9: `npm run test:unit -- tests/db/connection.test.ts` | 結果: 対象外（正本のない駄菓子屋プロジェクトの仮定）
- grade の finding: F003〜F006 は前の段の修正で解消済み。F001（`vp-pm-dependency-risk`）は kata の段のレビューで使わない観点、F002（`vp-arc-conciseness`）は R3 の観点のため、この段では扱わない

## 4. 進め方と実践の型の適用

R4 では、sample の事実を公式ドキュメントと既知の仕様に照らして確認した。`fly postgres config update` のフラグと `fly status` の出力例は公式ドキュメントを読んで確かめた。PostgreSQL、Prisma、flyctl、Fly.io のネットワークの各主張は知識で照合した。不一致は 1 件で、これを修正した。確かめられなかった主張は 1 件で、表に残した。駄菓子屋プロジェクトの仮定は共通サンプル文脈と食い違わないため、確かめの対象にしていない。grade の finding のうち F003〜F006 は前の段で解消済み、F001・F002 は R4 の観点外である。
