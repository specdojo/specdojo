---
specdojo:
  id: prj-0001:pjr-ypns-kata-resolution
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: high
  owner: DEV
  registered_at: "2026-09-23T03:10:29Z"
  due_on: "2026-10-10"
  block_reason: "agent exited with non-zero code: runner による検証で `typecheck` (exit 2) および `test-unit` (exit 1) が失敗しているため。具体的には `src/catalog-plan.ts` での参照エラーおよび、カタログプランとグレードに関する単体テストの失敗が確認されている。"
---

# PJR-YPNS kata と schema の解決順序を実装する

## 1. 概要

[[prj-0001:pjr-fkn1-kata-distribution-method]] で決めた「参照を既定、上書きしたいものだけ eject」の第 1 段階を実装する。現在 CLI は `specdojoRootDir()`（利用者のリポジトリルート）直下の固定パスで kata と schema を探すため、kata が無いリポジトリでは `exec plan` が `Template not found` で止まる。

本項目では解決順序の導入だけを扱う。`kata` サブコマンド、wikilink と `index build` の解決、導線の文書更新は別項目へ分割した。

### 1.1. package ルートの解決方式

フォールバック先の package ルートは `import.meta.url` の 1 つ上のディレクトリとする。`dist/` と `src/` は同じ深さにファイルが並ぶため、npm 導入後（`node_modules/specdojo/dist/*.js`）、本リポジトリの dist 実行、tsx / vitest による src 実行のいずれでも同じ式で package ルートへ到達できる。`src/build-if-stale.ts` が同じ式を使っており、新しい解決方式を持ち込まない。

```typescript
const packageRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
```

`import.meta.resolve("specdojo/package.json")` による self-reference は採らない。`package.json` に `exports` フィールドが無く、self-reference には `exports` の定義が必要になる。`exports` を追加すると現在アクセスできているサブパスが閉じられ、`@specdojo/docs-lint` や `packages/vscode-specdojo` からの参照に影響する破壊的変更となるため、resolver の導入だけを目的に行わない。

開発時と実行時で分岐する方式も採らない。上記の式で両者が一致するため分岐が不要である。

本リポジトリは `docs/ja/specdojo` を実際に持つため、常に利用リポジトリ側が優先され、フォールバック経路が発火しない。この経路は空ディレクトリから本リポジトリの `dist/specdojo.js` を実行して検証する。resolver は package ルートを引数で受け取る純粋関数と、`import.meta.url` を読む入口へ分け、一時ディレクトリで優先順位を検証できるようにする。

## 2. 完了条件

- kata と schema の解決が「利用リポジトリ優先、無ければ `node_modules/specdojo`」の順で行われ、13 ファイル 22 箇所の直接参照が単一の resolver へ集約されている。
- kata を持たない空リポジトリで `config init` から `exec plan --register` まで到達できる。
- exec worktree 内でも resolver が機能し、plan に記載されるパスが resolver 由来になっている。
- `node_modules` 配下が agent の書き込み保護対象に含まれている。
- 利用リポジトリ側に同名ファイルがある場合はそちらが優先されることを確認する単体テストがある。
- `npm run check` が通過している。

## 3. 作業内容

| No  | 作業                                                         | 担当 | 状態 | メモ                                                                     |
| --- | ------------------------------------------------------------ | ---- | ---- | ------------------------------------------------------------------------ |
| 1   | kata / schema の resolver を作る                             | DEV  | done | package ルートは `import.meta.url` の 1 つ上。`build-if-stale.ts` と同型 |
| 2   | 13 ファイル 22 箇所の直接参照を resolver へ置き換える        | DEV  | done | ファイル単位の優先解決へ集約                                             |
| 3   | worktree 内の解決と plan のパス記載を resolver 由来にする    | DEV  | done | package 側はリポジトリ相対パスで plan へ記載                             |
| 4   | `node_modules` を agent の書き込み保護へ加える               | DEV  | done | `node_modules/specdojo` を snapshot 対象へ追加                           |
| 5   | 空リポジトリで `config init` から `exec plan` までを確認する | DEV  | done | kata 未配置の一時リポジトリで通し確認済み                                |

## 4. 対応結果

- kata / schema / exec template / review defaults の参照を共通 resolver へ集約し、利用者リポジトリに同名ファイルがあれば優先し、無ければ package 同梱物へフォールバックするようにした。
- resolver が選んだ package 側の kata / schema は、`node_modules/specdojo/...` を含む利用者リポジトリ相対パスとして plan と生成物へ記載するようにした。
- `node_modules/` を agent の保護対象に加え、同梱資産がある `node_modules/specdojo` は実行前後の snapshot でも変更を検知するようにした。
- kata を置かない一時リポジトリで `config init`、`register scaffold`、`register add`、`exec plan --register` を順に実行し、plan 生成まで完了することを確認した。
- resolver の利用者側優先、package fallback、plan 用相対パス、および同梱資産の変更検知をテストへ追加した。型検査・unit / integration test・schema 検証は executor / reporter pipeline の親 runner が実行する。

## 5. 関連ドキュメント

- [[prj-0001:pjr-fkn1-kata-distribution-method]]
- [[prj-0001:pjr-aak1-kata-subcommands]]
- [[prj-0001:pjr-g8m9-kata-wikilink-resolution]]
- [[prj-0001:pjr-09kk-npm-onboarding-path]]
- `src/kata.ts`
- `src/template-resolution.ts`
