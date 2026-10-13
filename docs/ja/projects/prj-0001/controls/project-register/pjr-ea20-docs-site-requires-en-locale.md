---
specdojo:
  id: prj-0001:pjr-ea20-docs-site-requires-en-locale
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-13T14:33:20Z"
  due_on: null
---

# PJR-EA20 docs-site のビルドが docs/en のないリポジトリで失敗する

## 1. 課題内容

公開済みの @specdojo/docs-site 0.2.0 は、docs/en がないと sidebar の走査で The path to scan does not exist になり build と dev が止まる。config init は docs/ja だけを作るため、README の手順どおりに導入した利用者が最初のビルドで失敗する

## 2. 影響範囲

| 観点         | 影響                                                                                                                                                       |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | `packages/docs-site/.vitepress/config.mts` の sidebar の生成（`makeSidebar("en")`）                                                                        |
| スケジュール | v0.3.0 の公開前に直す（2026-10-13、利用者の判断）。修正は `@specdojo/docs-site` 0.2.1 として公開する                                                       |
| コスト       | `config init` から始めた利用者は、`npx specdojo-docs-site build .` と `dev .` が必ず失敗する。回避には空の `docs/en` を作る必要があり、README に記載がない |
| 品質         | 本リポジトリは `docs/en` を持つため、開発時の確認では表に出ない                                                                                            |
| 関係者       | docs-site を導入する利用者                                                                                                                                 |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                         |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | `config.mts` が `ja` と `en` の両方について `vitepress-sidebar` の `generateSidebar` を無条件に呼ぶ。`scanStartPath` の `docs/en` が存在しないと `generateSidebar` が例外を投げ、設定の読み込みごと失敗する                  |
| 対応策   | locale のフォルダー（`docs/<locale>`）が workspace に存在しない場合は、その locale の sidebar の走査を行わず空として扱う。`docs/ja` がない場合も同じ扱いとし、どちらかの locale だけを持つリポジトリでビルドできるようにする |
| 依存事項 | なし。[[prj-0001:pjr-ca0s-docs-site-output-in-node-modules]] と同じ `config.mts` を変えるため、続けて実行する                                                                                                                |
| 完了条件 | 下記の完了条件を満たす                                                                                                                                                                                                       |

### 3.1. 完了条件

- `docs/en` のない workspace で `specdojo-docs-site build` と `dev` の設定の読み込みが失敗しない。`docs/ja` のない workspace でも同じである。
- `docs/en` を持つ本リポジトリでは、`en` の sidebar がこれまでどおり生成される。
- locale のフォルダーがない場合に走査を飛ばすことを確かめる unit test を `tests/packages/docs-site/` に追加している。設定ファイル全体の読み込みが重い場合は、判定を関数に切り出してその関数を検証してよい。
- 本リポジトリで `npm run docs:build` が通る。
- `packages/docs-site/package.json` の版は変えない（0.2.1 への版上げは公開の準備でまとめて行う）。

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-cbqv-docs-site-npm-publish]]: docs-site の npm への公開。導入の確認で本件が見つかった。
- `packages/docs-site/.vitepress/config.mts`、`packages/docs-site/README.md`
