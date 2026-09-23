---
specdojo:
  id: prj-0001:pjr-sj3x-docs-site-kata-staging
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-09-23T06:37:03Z"
  due_on: "2026-11-21"
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

| No  | 作業                                                | 担当 | 状態 | メモ                             |
| --- | --------------------------------------------------- | ---- | ---- | -------------------------------- |
| 1   | ビルド前ステージングの複製処理を追加する            | DEV  | open | 解決順序は `kata` コマンドと同じ |
| 2   | ステージング位置と `rewrites` の整合を取る          | DEV  | open | 公開 URL を変えない              |
| 3   | ステージング先を gitignore へ加える                 | DEV  | open | 利用者リポジトリを汚さない       |
| 4   | kata を持たない一時リポジトリでサイト生成を確認する | DEV  | open | rulebook ページの生成を確認      |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-fkn1-kata-distribution-method]]
- [[prj-0001:pjr-g8m9-kata-wikilink-resolution]]
- [[prj-0001:pjr-aak1-kata-subcommands]]
- `packages/docs-site/.vitepress/config.mts`
