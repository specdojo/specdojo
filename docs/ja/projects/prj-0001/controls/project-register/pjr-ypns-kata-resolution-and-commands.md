---
specdojo:
  id: prj-0001:pjr-ypns-kata-resolution-and-commands
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
  due_on: "2026-10-17"
---

# PJR-YPNS kata の解決順序を実装し kata サブコマンドを追加する

## 1. 概要

[[prj-0001:pjr-fkn1-kata-distribution-method]] で決めた「参照を既定、上書きしたいものだけ eject」を実装する。現在 CLI は `specdojoRootDir()` 直下の固定パスで kata と schema を探すため、利用リポジトリに kata が無いと `exec plan` が `Template not found` で止まる。

## 2. 完了条件

- kata と schema の解決が「利用リポジトリ優先、無ければ `node_modules/specdojo`」の順で行われ、13 ファイル 22 箇所の直接参照が単一の resolver へ集約されている。
- kata を持たない空リポジトリで `config init` から `exec plan --register` まで到達できる。
- `kata list`（参照中と eject 済みの一覧）、`kata show <id>`、`kata status`、`kata eject --id <id>`、`kata install --all` が動作する。`eject` は `exec-templates` と `schemas` を対象外にする。
- wikilink と `index build` が、eject されていない kata の ID を解決できるか、解決できない場合の扱いが決まっている。
- exec worktree 内で resolver が機能し、plan に記載されるパスが resolver 由来になっている。
- `node_modules` 配下が agent の書き込み保護対象に含まれている。
- README と [[specdojo:quick-start-guide]] の導線が、npm 導入だけで exec まで到達できる手順になっている。
- `npm run check` が通過している。

## 3. 作業内容

| No  | 作業                                                                    | 担当 | 状態 | メモ                                           |
| --- | ----------------------------------------------------------------------- | ---- | ---- | ---------------------------------------------- |
| 1   | kata / schema の resolver を作り、22 箇所の直接参照を置き換える         | DEV  | open | `kata.ts` と `template-resolution.ts` が受け皿 |
| 2   | `kata` サブコマンド（list / show / status / eject / install）を追加する | DEV  | open | eject 対象外の種別を明示する                   |
| 3   | wikilink と `index build` の解決方針を決めて実装する                    | DEV  | open | 未解決時は公開サイトへ逃がす案がある           |
| 4   | worktree 内の解決と plan のパス記載を resolver 由来にする               | DEV  | open | worktree では `npm ci` が走る前提              |
| 5   | `node_modules` を書き込み保護へ加える                                   | DEV  | open | PJR-T84C の変更と衝突しないようにする          |
| 6   | README と quick-start-guide の導線を更新する                            | DEV  | open | Detached Unit の初期化手順を通しで書く         |
| 7   | 空リポジトリでの通し確認を行う                                          | DEV  | open | `config init` から `exec plan` まで            |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-fkn1-kata-distribution-method]]
- [[prj-0001:pjr-tbhh-detached-unit-default]]
- [[specdojo:quick-start-guide]]
- [[specdojo:practice-system-composition-guide]]
- `src/kata.ts`
- `src/template-resolution.ts`
