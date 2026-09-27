---
specdojo:
  id: prj-0001:pjr-sj3x-docs-site-kata-staging
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-09-23T06:37:03Z"
  due_on: "2026-11-21"
  completed_at: "2026-09-27T06:20:21Z"
  conclusion: docs-site の設定読み込み時に package 同梱の docs/ja/specdojo を specdojo-kata-staging/ へ複製し、eject 済みを優先して /ja/specdojo/ で配信する。kata を持たない一時 workspace でビルドと wikilink 解決を確認した
---

# PJR-SJ3X docs-site のビルド前に package の kata をステージングしてサイトへ含める

## 1. 概要

[[prj-0001:pjr-fkn1-kata-distribution-method]] で kata を package 参照既定としたため、eject していない kata は利用リポジトリの `docs/` 配下に存在しない。`@specdojo/docs-site` は `srcDir` を呼び出し元 workspace に固定しているため、参照中の kata はサイトに含まれず、成果物から辿る `[[specdojo:xxx-rulebook]]` のリンクが 404 になる。

当初は利用者へ `kata install --all` を案内する案だったが、サイト生成は `@specdojo/docs-site` が持つ責務であり、利用者のリポジトリを kata で汚す必要はない。ビルド時に package 側を読み込む方式へ改める。

### 1.1. 方式

VitePress の `srcDir` は 1 つしか指定できないため、複数ルートを直接は扱えない。ビルド前に package ルート配下の kata を gitignore 済みのステージングへ複製し、`srcDir` から見える位置へ置く。`kata install --all` と同じ機構だが、複製先が利用リポジトリではなくビルド成果物になる。

`docs/ja/specdojo` を package へ向ける symlink 方式は採らない。Vite の `preserveSymlinks`、Windows での symlink 権限、eject 済みファイルとの混在で破綻しやすい。

現行の設定は次のとおりで、`rewrites` が物理パスを公開 URL へ写像している。ステージングの配置はこの写像と整合させる。

```typescript
srcDir: WORKSPACE_ROOT,
srcExclude: ["*.md", "local/**", "workspaces/**", "templates/**", "logs/**", "packages/**"],
rewrites: { "docs/index.md": "index.md", "docs/ja/:rest*": "ja/:rest*", "docs/en/:rest*": "en/:rest*" },
```

## 2. 完了条件

- `@specdojo/docs-site` の `docs:build` と `docs:dev` が、ビルド前に package ルート配下の kata をステージングへ複製する。
- eject 済みのファイルがある場合は利用リポジトリ側が採用され、package 側で上書きされない。
- ステージング先が gitignore 済みで、利用リポジトリの Git 管理対象を増やさない。
- 参照中の kata が公開 URL（`/ja/specdojo/...`）で配信され、成果物からの wikilink が 404 にならない。
- 利用者に `kata install --all` の実行を求めない。`kata install --all` はオフライン運用や kata を自分の Git で管理する場合の選択肢として残す。
- kata を持たない一時リポジトリで docs サイトをビルドし、rulebook のページが生成されることを確認する。
- `npm run check` と `npm run docs:build` が通過する。

## 3. 作業内容

| No  | 作業                                                | 担当 | 状態 | メモ                                                               |
| --- | --------------------------------------------------- | ---- | ---- | ------------------------------------------------------------------ |
| 1   | ビルド前ステージングの複製処理を追加する            | DEV  | done | `SPECDOJO_PACKAGE_ROOT` → `node_modules/specdojo` の順に解決する   |
| 2   | ステージング位置と `rewrites` の整合を取る          | DEV  | done | `specdojo-kata-staging/docs/ja/:rest*` を `ja/:rest*` へ写像する   |
| 3   | ステージング先を gitignore へ加える                 | DEV  | done | ステージング内の `.gitignore`（`*`）で利用者リポジトリを汚さない   |
| 4   | kata を持たない一時リポジトリでサイト生成を確認する | DEV  | done | 一時リポジトリで rulebook ページの生成と wikilink の解決を確認した |

## 4. 対応結果

- `packages/docs-site/.vitepress/kata-staging.ts` を追加した。VitePress の設定読み込み時（ページ走査より前）に、package が同梱する `docs/ja/specdojo` 配下を workspace 直下の `specdojo-kata-staging/` へ複製する。設定読み込みで実行するため `docs:build` と `docs:dev` の両方に効く。
- package ルートは `SPECDOJO_PACKAGE_ROOT`、未指定なら workspace から親方向へ辿った `node_modules/specdojo` の順で解決する。workspace 自身が `specdojo` package の場合（SpecDojo 開発リポジトリ）は複製しない。
- 利用リポジトリ側に同じ相対パスがある（eject 済みの）ファイルは複製せず、利用リポジトリ側を採用する。ステージングは毎回作り直し、package 更新や eject で不要になったファイルを残さない。
- ステージングはドット始まりにしない。VitePress のページ走査はドット始まりのディレクトリを辿らないため、`.specdojo/` 配下ではページにならない。
- ステージング内に `*` の `.gitignore` を置き、利用リポジトリの `.gitignore` を書き換えずに Git 管理対象から外す。
- `rewrites` に `specdojo-kata-staging/docs/ja/:rest*` → `ja/:rest*` を加え、公開 URL を `/ja/specdojo/...` に揃えた。
- doc-index の package 側エントリ（`node_modules/specdojo/docs/...` や絶対パス）を `docs/...` へ付け替え、wikilink と frontmatter のリンクを公開 URL へ解決する。symlink 配置でも一致するよう実体パスで比較する。
- Mermaid SVG 生成（`generateMermaidSvgs`）に `additionalRootDirs` を加え、ステージングした文書の図も同じ manifest で生成する。
- `packages/docs-site/README.md` に挙動を追記した。`kata install --all` は引き続きオフライン運用や kata を自分の Git で管理する場合の選択肢として残る。
- _ASSUMPTION_: 複製範囲は eject 可能な kata（rulebook / standard / recipe / sample / template）だけでなく `docs/ja/specdojo` 全体とした。standard などが相対 Markdown リンクで guides / references を参照しており、kata だけでは VitePress の dead link 検査でビルドが失敗したためである。サイドバーの specdojo 節も guides などを前提にしている。
- _ASSUMPTION_: package 同梱の guides には SpecDojo 開発リポジトリ固有の設計書（`docs/ja/product/...`）への相対リンクがあり、利用リポジトリでは必ず dead link になる。ステージングを行った場合に限り、`../product/` 形式の URL だけを `ignoreDeadLinks` で許容した。VitePress の `ignoreDeadLinks` は URL しか受け取らないため、参照元ページでは絞れない。
- 確認結果: kata を持たない一時 workspace（`package.json`・`docs/` のみ、`node_modules/specdojo` は本リポジトリへの symlink、rulebook を 1 件 eject）で `index build` と docs サイトのビルドが成功した。`ja/specdojo/rulebooks/pjr-rulebook.html` などが生成され、eject した rulebook は利用リポジトリ側の内容で出力された。成果物の `[[specdojo:pjr-rulebook]]` は `../../specdojo/rulebooks/pjr-rulebook.html` へ解決された。本リポジトリの `npm run docs:build` ではステージングが作られず、従来どおり成功した。
- 申し送り: `@specdojo/docs-site` は `docs/en` が無い workspace で `vitepress-sidebar` が失敗する（本項目の変更前からの挙動）。一時 workspace の確認では `docs/en/index.md` を置いて回避した。必要なら別項目で扱う。

## 5. 関連ドキュメント

- [[prj-0001:pjr-fkn1-kata-distribution-method]]
- [[prj-0001:pjr-g8m9-kata-wikilink-resolution]]
- [[prj-0001:pjr-aak1-kata-subcommands]]
- `packages/docs-site/.vitepress/config.mts`
