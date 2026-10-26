---
specdojo:
  id: prj-0001:pjr-9zn5-consolidate-docs-site-generated-dirs-under-vitepress
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  difficulty: hard
  owner: indie
  registered_at: "2026-10-26T12:48:16Z"
  block_reason: "executor reported incomplete: 生成物の .vitepress 配下への集約、配信処理、Git 除外テンプレート、文書、回帰テスト、個票を更新した。既存の履歴リンク検査違反が未解消のため未完了。"
---

# PJR-9ZN5 @specdojo/docs-siteが生成するpublic/mermaid等を.vitepress配下に集約する

## 1. 概要

現在 @specdojo/docs-site (packages/docs-site) の build / dev / mermaid 実行時に、Mermaid SVG の出力先（public/mermaid）や kata ステージング（specdojo-kata-staging）が利用リポジトリのワークスペース直下に生成されるため、利用側のルートディレクトリが散らかり .gitignore にも複数のエントリ追加が必要になっている。これらの一時・生成ディレクトリを .vitepress/ 配下（例: .vitepress/mermaid や .vitepress/kata-staging 等）に集約し、VitePress 側の静的配信設定および README / config init の .gitignore テンプレートを整理する。

現在の VitePress 設定は `.vitepress/**` をページ走査から除外する。kata の配置だけを移すと `/ja/specdojo/...` のページが欠けるため、配信方法も合わせて設計する。

## 2. 完了条件

- `@specdojo/docs-site` の `build`・`dev`・`mermaid` が生成する Mermaid SVG と manifest、および `build`・`dev` が作る kata ステージングが、閲覧対象 workspace の `.vitepress/` 配下に置かれる。新しい利用リポジトリのルートに `public/mermaid/` と `specdojo-kata-staging/` を作らない。
- Mermaid 図の公開 URL `/mermaid/<hash>.svg` を維持し、`build` の `.vitepress/dist` に SVG が含まれ、`dev` でも同じ URL から取得できる。既存の利用者が置いた `public/` のファイルを変更・削除しない。
- package 同梱文書を `/ja/specdojo/...` で配信し、成果物からの wikilink が解決する。eject 済みの文書は利用リポジトリ側を優先する。`.vitepress/**` がページ走査から除外される条件で採った配信方法と理由を、個票の対応結果と pipeline の `handoff` に記録する。
- `packages/docs-site/README.md`、`[[specdojo:docs-editing-guide]]`、`config init` の `.gitignore` 生成内容を新しい配置へ合わせる。既存の `.gitignore` を保持し、利用者が作成した `.vitepress` の設定ファイルを除外しない。
- Mermaid 生成と kata ステージングのテスト、`npm --prefix packages/docs-site run typecheck`、`npm run check`、`npm run docs:build` が通る。`@specdojo/docs-site` の配布物を空の利用リポジトリへ導入し、`build`・`dev`・`mermaid` の生成先、公開 URL、Git の追跡対象を確かめる。

## 3. 作業内容

| No  | 作業                                    | 担当  | 状態 | メモ                                 |
| --- | --------------------------------------- | ----- | ---- | ------------------------------------ |
| 1   | 生成先と VitePress の配信方法を設計する | indie | open | `.vitepress/**` の走査除外を考慮する |
| 2   | Mermaid と kata の生成・配信を変更する  | indie | open | 既存の公開 URL と eject 優先を保つ   |
| 3   | `.gitignore` の生成内容と案内を更新する | indie | open | 利用者の設定ファイルは除外しない     |
| 4   | テストと空の利用リポジトリで確認する    | indie | open | `build`・`dev`・`mermaid` を確かめる |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[specdojo:docs-editing-guide]]
- [[prj-0001:pjr-sj3x-docs-site-kata-staging]]
- [[prj-0001:pjr-ca0s-docs-site-output-in-node-modules]]
- `packages/docs-site/.vitepress/config.mts`
- `packages/docs-site/.vitepress/kata-staging.ts`
- `packages/docs-site/src/gen-mermaid-svg.ts`
- `src/shared/specdojo-gitignore.ts`
