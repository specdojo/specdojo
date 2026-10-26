---
specdojo:
  id: prj-0001:pjr-9zn5-consolidate-docs-site-generated-dirs-under-vitepress
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: hard
  owner: indie
  registered_at: "2026-10-26T12:48:16Z"
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

| No  | 作業                                    | 担当  | 状態 | メモ                                                                                                |
| --- | --------------------------------------- | ----- | ---- | --------------------------------------------------------------------------------------------------- |
| 1   | 生成先と VitePress の配信方法を設計する | indie | done | 閲覧用ツリーを `srcDir` にして走査対象を限定した                                                    |
| 2   | Mermaid と kata の生成・配信を変更する  | indie | done | SVG の専用配信、eject 優先、dev の文書同期を実装した                                                |
| 3   | `.gitignore` の生成内容と案内を更新する | indie | done | 生成ディレクトリだけを除外し、既存の設定と利用者の設定ファイルを保持する                            |
| 4   | テストと空の利用リポジトリで確認する    | indie | done | 配布物の build・dev の実 watcher・Git 除外を確認済み。実描画・通常導入・HTTP はホスト確認へ申し送る |

## 4. 対応結果

- Mermaid SVG と manifest の既定出力先を workspace の `.vitepress/mermaid/` に変更した。Vite plugin が SVG だけを build の `.vitepress/dist/mermaid/` に出力し、dev でも `/mermaid/<hash>.svg`（サイトの base 付き URL にも対応）で配信する。manifest・一時ファイルは専用配信の対象にしない。`publicDir` は利用者の `public/` を維持し、その内容を生成処理で変更・削除しない。
- 配信方法: `.vitepress/kata-staging/docs/` に利用側の `docs/` と package 同梱文書を重ね、`.vitepress/kata-staging/` 自体を VitePress の `srcDir` にした。workspace を `srcDir` にしたままの配置変更では `.vitepress/**` の走査除外とドットディレクトリの走査制約でページが欠けるため、この方法を採った。閲覧用ツリーには `docs/` だけを置き、dist・cache・設定ファイルを走査対象から外す。既存の `docs/ja/...` → `/ja/...` の rewrites を使えるため、同梱文書も `/ja/specdojo/...` で公開できる。symlink や VitePress 内部のページ一覧の書き換えは使わない。
- eject 済み文書は利用側を優先し、起動時に古いステージングを作り直す。dev では利用側文書の編集・追加・削除を同期し、eject 文書を削除した場合は同梱文書へ戻す。`@/src/...` などのコードスニペットも利用側の元ファイルを解決する。旧配置の `public/mermaid/` と `specdojo-kata-staging/` は自動削除しない。
- `config init` の `.gitignore` テンプレートに `/.vitepress/dist/`・`/.vitepress/cache/`・`/.vitepress/mermaid/`・`/.vitepress/kata-staging/` を追加した。既存内容の追記方式を維持し、利用者の `.vitepress/config.mts` や theme は除外しない。本リポジトリの `.gitignore`、`packages/docs-site/README.md`、[[specdojo:docs-editing-guide]] も新配置へ合わせた。
- 回帰テストを追加した。Mermaid の既定出力先と利用者の public ファイル保持、dev の SVG middleware、client build の SVG のみの出力と SSR build の重複出力防止、ステージングと eject 優先・同期・削除時の復元・再起動時の掃除、実 Git による生成物だけの除外を対象とする。unit / integration・本体型検査・lint・全体 schema 検査は指定された親 runner に委ねた。`npm run check` は親検証と重複するため executor では実行せず、それ以外の依存宣言・catalog・履歴リンク検査を個別に実行した。
- 親検証の失敗を受けた再開対応: `mermaid-assets.test.ts` のテストを非同期にし、Vite の各フック呼び出しを `await` するよう修正した。`specdojo-gitignore.test.ts` の Git 起動2箇所へ `gitEnvironment()` を渡し、親プロセスの Git 固有環境変数から fixture を隔離した。これにより、前回の Promise 未処理5件と Git 環境隔離違反2件の原因を修正した。lint と unit test の再判定は親 runner が行う。
- 検証済み: `npm --prefix packages/docs-site run typecheck`、変更ファイルの Prettier 整形、`npm run check:src-imports`、`node --import tsx tools/catalog-validate-if-configured.mjs`、`node --import tsx src/specdojo.ts register build`、register events のファイル単位 schema 検査。Markdown 検査は指定された親 runner に委ねた。catalog 検査は既存の未作成成果物の警告を伴って成功した。runner が引き継ぎ時に追記した event は検証のみ行い、executor は変更していない。
- 配布物の確認: 再開後に `npm pack --ignore-scripts` で docs-site の tarball を作り、新規の利用リポジトリへ展開した。外部依存は導入済みのものを共有し、同梱文書は最小の specdojo package fixture、Mermaid は既知の SVG を cache に投入して確認した。`mermaid` と `build` が通り、manifest の新配置、SVG の dist 同梱、同梱ページの公開 URL、wikilink、eject 優先、コードスニペット、public ファイル保持、Git の生成物除外と設定ファイルの追跡対象維持を確認した。HTTP 待受を使わない VitePress の実サーバでも、実 watcher による文書の編集・追加・削除、eject 削除時の同梱文書への復元、更新後の Markdown 変換を確認した。この確認は通常の npm install や実 SVG の描画・HTTP 取得を代替しない。
- 前回の blocker は解消済み: `pjr-e6qa-release-v0-4-7.md` の外部 URL 2件は再開時点で autolink に修正されており、再実行した `npm run validate:history-links` は成功した。本タスクでは当該ファイルを変更していない。
- ホスト環境への申し送り: `npm --prefix packages/docs-site run docs:build` は Chromium 起動時の `Operation not permitted`、配布物の `dev` は `listen EPERM` で sandbox 内の実行が止まった。ホストで `npm run docs:build` と、tarball を通常の npm install で導入した空の利用リポジトリの `build`・`dev`・`mermaid` を再確認し、実 SVG の描画、HTTP 取得と文書更新を確認する。
- 保護設定の変更案: ルート `package.json` の `scripts` にある `docs:rebuild:mermaid` は旧配置を削除するため、親 runner または人間が `rm -f .vitepress/mermaid/*.svg && npm run docs:build:mermaid` へ変更する。executor は保護設定を編集していない。
- 実装と sandbox 内の確認は完了した。ホスト制約の確認は `requires_human` として申し送る。result と登録簿の状態遷移は pipeline の reporter / runner が担当し、executor は個票のステータス項目を変更していない。

## 5. 関連ドキュメント

- [[specdojo:docs-editing-guide]]
- [[prj-0001:pjr-sj3x-docs-site-kata-staging]]
- [[prj-0001:pjr-ca0s-docs-site-output-in-node-modules]]
- `packages/docs-site/.vitepress/config.mts`
- `packages/docs-site/.vitepress/kata-staging.ts`
- `packages/docs-site/src/gen-mermaid-svg.ts`
- `src/shared/specdojo-gitignore.ts`
