---
specdojo:
  id: prj-0001:pjr-n9jc-docs-site-mermaid-error-tolerance
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-10-27T14:12:43Z"
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

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-evae-tsd-sample-maintenance]]
- [[prj-0001:pjr-9zn5-consolidate-docs-site-generated-dirs-under-vitepress]]
- `packages/docs-site/src/gen-mermaid-svg.ts`
