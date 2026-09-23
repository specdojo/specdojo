---
specdojo:
  id: prj-0001:pjr-ypns-kata-resolution
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-09-23T03:10:29Z"
  due_on: "2026-10-10"
---

# PJR-YPNS kata と schema の解決順序を実装する

## 1. 概要

[[prj-0001:pjr-fkn1-kata-distribution-method]] で決めた「参照を既定、上書きしたいものだけ eject」の第 1 段階を実装する。現在 CLI は `specdojoRootDir()`（利用者のリポジトリルート）直下の固定パスで kata と schema を探すため、kata が無いリポジトリでは `exec plan` が `Template not found` で止まる。

本項目では解決順序の導入だけを扱う。`kata` サブコマンド、wikilink と `index build` の解決、導線の文書更新は別項目へ分割した。

## 2. 完了条件

- kata と schema の解決が「利用リポジトリ優先、無ければ `node_modules/specdojo`」の順で行われ、13 ファイル 22 箇所の直接参照が単一の resolver へ集約されている。
- kata を持たない空リポジトリで `config init` から `exec plan --register` まで到達できる。
- exec worktree 内でも resolver が機能し、plan に記載されるパスが resolver 由来になっている。
- `node_modules` 配下が agent の書き込み保護対象に含まれている。
- 利用リポジトリ側に同名ファイルがある場合はそちらが優先されることを確認する単体テストがある。
- `npm run check` が通過している。

## 3. 作業内容

| No  | 作業                                                         | 担当 | 状態 | メモ                                           |
| --- | ------------------------------------------------------------ | ---- | ---- | ---------------------------------------------- |
| 1   | kata / schema の resolver を作る                             | DEV  | open | `kata.ts` と `template-resolution.ts` が受け皿 |
| 2   | 13 ファイル 22 箇所の直接参照を resolver へ置き換える        | DEV  | open | 固定パス文字列を残さない                       |
| 3   | worktree 内の解決と plan のパス記載を resolver 由来にする    | DEV  | open | worktree では `npm ci` が走る前提              |
| 4   | `node_modules` を agent の書き込み保護へ加える               | DEV  | open | PJR-T84C の生成物除外と衝突させない            |
| 5   | 空リポジトリで `config init` から `exec plan` までを確認する | DEV  | open | 一時ディレクトリで通し確認する                 |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-fkn1-kata-distribution-method]]
- [[prj-0001:pjr-aak1-kata-subcommands]]
- [[prj-0001:pjr-g8m9-kata-wikilink-resolution]]
- [[prj-0001:pjr-09kk-npm-onboarding-path]]
- `src/kata.ts`
- `src/template-resolution.ts`
