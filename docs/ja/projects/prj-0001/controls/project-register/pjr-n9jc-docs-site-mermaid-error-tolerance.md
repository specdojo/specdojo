---
specdojo:
  id: prj-0001:pjr-n9jc-docs-site-mermaid-error-tolerance
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-10-27T14:12:43Z"
  completed_at: "2026-10-27T15:43:44Z"
  conclusion: dev は構文エラーの図を警告して飛ばし、build はすべての図を処理してからまとめて失敗するようにした
  derived_from:
    - PJR-EVAE
---

# PJR-N9JC Mermaid の構文エラーで docs:dev と docs:build が止まる

## 1. 課題内容

@specdojo/docs-site の gen-mermaid-svg.ts は、ファイルがない場合以外の図の生成のエラーを投げ直すため、1 つの図の構文エラーで dev サーバーとビルドが止まる。エラーの図を警告して飛ばし、ほかのページを表示できるようにする。ビルドで失敗として扱うかは対応時に決める。

## 2. 影響範囲

| 観点         | 影響                                                                                                            |
| ------------ | --------------------------------------------------------------------------------------------------------------- |
| スコープ     | `packages/docs-site/src/gen-mermaid-svg.ts` の図の生成と、それを呼ぶ `packages/docs-site/.vitepress/config.mts` |
| スケジュール | 影響なし                                                                                                        |
| コスト       | エラー処理の修正とテストの追加                                                                                  |
| 品質         | 1 つの図の構文エラーで dev サーバーが起動しなくなり、サイト全体を閲覧できなくなる                               |
| 関係者       | `@specdojo/docs-site` で文書を閲覧・編集する利用者                                                              |

## 3. 対応方針

| 項目     | 内容              |
| -------- | ----------------- |
| 原因     | `原因` を参照     |
| 対応策   | `対応策` を参照   |
| 依存事項 | なし              |
| 完了条件 | `完了条件` を参照 |

### 3.1. 原因

- `gen-mermaid-svg.ts` の `generateMermaidSvgs` と `generateMermaidSvgsForFile` は、ファイルがない場合以外のエラーを投げ直す。mermaid-cli の構文エラーも投げ直されるため、起動時と、文書の変更を検知したときの再生成で、dev サーバーが止まる。
- PJR-EVAE で `tsd-sample` の図に構文エラーが入り、`npm run docs:dev` が起動しなくなった（図は `3d7770206` で修正済み）。

### 3.2. 対応策

オーケストレーターの判断（利用者が後で確認する）として、次の方針とする。

- dev（起動時と変更の検知時）: 構文エラーの図は、ファイル名とエラーの要点を警告に出して飛ばし、ほかの図とページの生成を続ける。エラーの図を直すと、次の変更の検知で生成される。
- build: 図の構文エラーを見逃して公開しないよう、失敗のままとする。ただし最初のエラーで止めず、すべての図を処理してから、エラーの図をまとめて表示して失敗する。
- エラーの図の SVG や manifest の記録を、成功として残さない。

### 3.3. 完了条件

1. 構文エラーの図を含む Markdown があっても、dev の起動時の生成と変更の検知時の再生成が例外で止まらず、警告を出してほかの図を生成することを単体テストで確かめる。
2. build の生成では、構文エラーの図が複数あるとき、すべてのエラーを集めて表示してから失敗することを単体テストで確かめる。
3. エラーの図について、SVG と manifest のエントリを成功として残さない。図を直した後の再生成で SVG が作られる。
4. ファイルがない場合の既存の扱い（警告して飛ばす）は変えない。
5. `npm --prefix packages/docs-site run typecheck`・`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` と、親の検証が通る。
6. `packages/docs-site/README.md` に、dev と build でのエラーの図の扱いを書く。
7. `CHANGELOG.md` の未公開の版の節に変更を書く。公開済みの版の節は変えない。
8. 方針と違う扱いが必要と判断した場合は実装を変えず、本個票の対応結果と pipeline の報告の `handoff` に理由を書く。

## 4. 対応結果

- 個票 3.2 の方針どおり、dev は図ごとの失敗を警告して継続し、build と Mermaid 単独生成は全ファイル・全ブロックを処理した後に集約エラーで失敗する実装にした。警告と集約エラーには文書パス・図の番号・ハッシュ・エラーの要点を含める。方針との差異、未解決の判断事項、保護設定の変更提案はない。
- `packages/docs-site/src/gen-mermaid-svg.ts` にエラー処理モードを追加した。失敗時の途中生成 SVG と一時ファイルを削除し、manifest のハッシュ一覧には成功した図だけを残す。一部失敗した文書には `hasErrors` を記録してファイル単位の cache を無効にし、正常な図の SVG は再利用しながら失敗した図を再試行する。全図失敗した文書の manifest エントリと、参照されなくなった古い SVG は除去する。Markdown が存在しない場合の警告・スキップは維持した。
- Vite の Mermaid 生成 plugin を `packages/docs-site/.vitepress/mermaid-auto-generate.ts` に切り出し、`config.mts` から参照する。`configResolved` の command で dev と build を判別し、起動時の全走査・watcher・HMR で適切なモードを指定する。切り出しにより、サイト全体を立ち上げずに実際の plugin フックを単体テストできるようにした。
- `tests/packages/docs-site/gen-mermaid-svg.test.ts` に、dev の起動・文書追加・HMR、同一文書内と別文書の正常な図の生成継続、複数ファイル・複数ブロックのエラー集約、途中生成 SVG の除去、部分失敗した文書の再試行、修正後の再生成、SSR の二重生成防止のテストを追加した。既存のファイル不在テストには警告の検証を追加した。テストの実行結果は親 runner の `test-unit` 検証で確定する。
- `packages/docs-site/README.md` に dev / build / Mermaid 単独生成の失敗時の扱い、cache と再生成の動作を記載し、`CHANGELOG.md` の未公開の版に修正を記録した。公開済みの版は変更していない。
- executor の検証: `npm --prefix packages/docs-site run typecheck`、変更ファイルの Prettier 整形、`node --import tsx tools/catalog-validate-if-configured.mjs`、`node --import tsx src/specdojo.ts register build`、`git diff --check` は成功した。カタログ検証には既存の未作成成果物への警告がある。`lint-ts`・`lint-fm`・`lint-md`・`test-integration`・`validate-schema`・`typecheck`・`test-unit` は指定された親 runner が実行する。result の記入と状態遷移は reporter / runner に委ねる。

## 5. 関連ドキュメント

- [[prj-0001:pjr-evae-tsd-sample-maintenance]]
- [[prj-0001:pjr-9zn5-consolidate-docs-site-generated-dirs-under-vitepress]]
- `packages/docs-site/src/gen-mermaid-svg.ts`
