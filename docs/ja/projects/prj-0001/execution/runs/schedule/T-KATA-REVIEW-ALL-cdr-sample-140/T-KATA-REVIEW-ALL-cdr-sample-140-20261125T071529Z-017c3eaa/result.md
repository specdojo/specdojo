---
specdojo:
  id: prj-0001:xer-t-kata-review-all-cdr-sample-140-20261125t071529z-017c3eaa
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-cdr-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-cdr-sample-140/T-KATA-REVIEW-ALL-cdr-sample-140-20261125T071529Z-017c3eaa/plan.md
  started_at: "2026-11-25T07:15:38.941Z"
  completed_at: "2026-11-25T07:29:59.687Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:cdr-sample
    - specdojo:cdr-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として、`cdr-sample` の事実主張を `tsd-index-sample`・`dmd-sample`・`cpd-sample`・`cnd-sample`・`cdr-rulebook`・`src/catalog/catalog.ts`・`catalog validate --help` と突き合わせた。
- 誤りは 1 件だった。冒頭の `_ASSUMPTION_` が `cpd-sample` を「CLI 版の設計」としていたが、`cpd-sample` は現金販売のみの論理分割案で、CLI 構成は `clis-sample` だった。この 1 件を修正した。
- F001・F002（`server-only` の規則が禁止事項表と本章で重複）は、前の段で本章の文が「先頭で `server-only` を import する」だけに直されており解消済みだった。この段では変更していない。
- 確かめた主張は 8 件（一致 6、不一致から修正 1、確かめられない 1）。表は下の handoff に 1 件ずつ記載した。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/cdr-sample.md`: 冒頭の `_ASSUMPTION_` にある `cpd-sample` の説明を、誤りだった「CLI 版の設計」から、現金販売のみの論理分割案へ直した。あわせて CLI 構成を示す参照先を `clis-sample` に書き分けた。差分は 1 行の置換（1 insertion、1 deletion）。

## 3. 申し送り

- R4 の確かめ結果は次の表のとおり。 | No | 主張 | 正本 | 結果 | | --- | --- | --- | --- | | 1 | Next.js・Prisma・PostgreSQL・Vitest・ESLint・Prettier・Sentry・GitHub Actions を使う | `tsd-index-sample` の 19〜32 行の表 | 一致 | | 2 | 統合テストはプルリクエストの GitHub Actions で実行する | `tsd-index-sample` の 27 行（CI/CD） | 一致 | | 3 | つけ上限は `顧客台帳.つけ上限`、税込の円の整数、未設定は上限なし | `dmd-sample` の 37 行・47 行 | 一致 | | 4 | `specdojo catalog validate` で `based_on` の解決を確かめる | `--help` の実行結果、`src/catalog/catalog.ts` 363 行 `validateBasedOn` | 一致 | | 5 | `applyTo`・`specdojo.id`・`specdojo.rulebook` を照合し、トップレベルに `applyTo` を置く | `cdr-rulebook` の 41・45・91 行 | 一致 | | 6 | wikilink の ID と表示名（`tsd-index-sample`・`cpd-sample`・`dmd-sample`・`clis-sample`） | 各 sample の frontmatter の `id` と H1 | 一致 | | 7 | `cpd-sample` は「CLI 版の設計」 | `cpd-sample` の 22 行、`cnd-sample`、`clis-sample` | 不一致のため修正（`cpd-sample` は現金販売のみの論理分割案、CLI 構成は `clis-sample`） | | 8 | `kinuya-web-cpd`・`kinuya-web-sysd-cross-cutting-policy`、`eslint.config.mjs` の `no-restricted-imports`、`npm run lint` など架空アプリの script | 正本なし（本文で架空の文書と明示） | 確かめられない。共通サンプル文脈と食い違わない仮定のため対象外 |
- 検査結果は次のとおり。executor の `npx prettier --check` と、runner の `lint:md:changed`・`lint:fm:changed`・`lint:mermaid`・`lint:d2`・`test:docs`・`validate:schema` は通過した。変更種別により、`lint:ts`・`lint:md`・`lint:fm`・`test:integration`・`typecheck`・`test:unit` は対象外になった。
- R4 確かめ No1: 主張=Next.js・Prisma・PostgreSQL・Vitest・ESLint・Prettier・Sentry・GitHub Actions の利用（全体）／正本=docs/ja/specdojo/samples/tsd-index-sample.md／確かめ方=grep で技術名を検索／結果=一致／根拠=19〜32 行の表に各技術の行がある
- R4 確かめ No2: 主張=統合テストはプルリクエストの GitHub Actions で実行（テストと検証の表）／正本=tsd-index-sample.md／確かめ方=読み取り／結果=一致／根拠=27 行 CI/CD『プルリクエスト時の ESLint・Vitest の実行』
- R4 確かめ No3: 主張=つけ上限は `顧客台帳.つけ上限`、税込の円の整数、未設定は上限なし（テストと検証）／正本=docs/ja/specdojo/samples/dmd-sample.md／確かめ方=grep つけ上限／結果=一致／根拠=37 行・47 行
- R4 確かめ No4: 主張=`specdojo catalog validate` で `based_on` の解決を確かめる（テストと検証）／正本=npx specdojo catalog validate --help、src/catalog/catalog.ts／確かめ方=--help 実行と grep／結果=一致／根拠=catalog.ts 363 行 validateBasedOn
- R4 確かめ No5: 主張=`applyTo`・`specdojo.id`・`specdojo.rulebook` を照合、トップレベルに `applyTo`（frontmatter・テストと検証）／正本=docs/ja/specdojo/rulebooks/cdr-rulebook.md／確かめ方=grep／結果=一致／根拠=41・45・91 行
- R4 確かめ No6: 主張=wikilink の ID と表示名（tsd-index-sample・cpd-sample・dmd-sample・clis-sample）／正本=各 sample の frontmatter と H1／確かめ方=grep id と H1／結果=一致／根拠=各ファイル 3 行目の id と H1
- R4 確かめ No7: 主張=cpd-sample は『CLI 版の設計』（冒頭の `_ASSUMPTION_`）／正本=docs/ja/specdojo/samples/cpd-sample.md、cnd-sample.md／確かめ方=読み取り／結果=不一致→修正／根拠=cpd-sample 22 行『単一店舗・タブレット1台・店舗側サービス…の論理分割案』、CLI 構成は clis-sample。cpd-sample を現金販売のみの論理分割案、clis-sample を CLI 別構成と書き分けた
- R4 確かめ No8: 主張=`kinuya-web-cpd`・`kinuya-web-sysd-cross-cutting-policy`、`eslint.config.mjs` の `no-restricted-imports`、`npm run lint` 等の架空アプリの script／正本=なし（本文で架空の文書と明示）／結果=確かめられない（共通サンプル文脈と食い違わない仮定のため対象外）
- F001・F002（`server-only` の規則が禁止事項表と本章で重複）: 前の段で本章の文が『先頭で `server-only` を import する』だけに直されており解消済み。この段では変更しない
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/cdr-sample.md のみで、plan・result・個票を変更していない）
- 適用外の検証: `specdojo catalog validate`（変更は docs/ja/specdojo/samples/ 配下のみで docs/ja/projects/ に及ばない）

## 4. 進め方と実践の型の適用

sample-maintenance の R4（正しさ）として、sample の事実主張を schema、`src/`、他の sample、rulebook、`--help` の出力と突き合わせた。誤りだった 1 件だけを最小の差分で直し、正本のない駄菓子屋の業務上の仮定と架空アプリの記述は確かめの対象外とした。F001・F002 は前の段の修正で解消済みと確認し、再編集していない。
