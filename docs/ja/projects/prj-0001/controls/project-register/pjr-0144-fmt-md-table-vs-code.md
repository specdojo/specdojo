---
specdojo:
  id: prj-0001:pjr-0144-fmt-md-table-vs-code
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  due_on: "2026-10-31"
  completed_at: "2026-09-06T13:03:04Z"
  conclusion: 表整形を拡張コマンドへ移し、旧 CLI 実装を削除した。tasks.json は拡張コマンドへ委譲する形で残した。
---

# PJR-0144 fmt-md-table を VS Code 拡張へ統合

## 1. 概要

現在 `.vscode/tasks.json` のタスク `Format Markdown Table` として提供している `fmt-md-table` を、
`packages/vscode-specdojo` 拡張のコマンドとして提供する。

[[prj-0001:pjr-gx9d-vscode-extension-consolidation]] で定めた集約方針の1番目にあたる。拡張の
機能が確定しないと Marketplace へ公開できないため、公開より先に実施する。

## 2. 変更前の状況

| 要素       | 内容                                                             |
| ---------- | ---------------------------------------------------------------- |
| 実体       | `tools/docs/src/fmt-md-table.ts`（Node 標準のみに依存）          |
| 起動       | `npx tsx tools/docs/src/fmt-md-table.ts "${file}" ${lineNumber}` |
| 呼び出し元 | `.vscode/tasks.json` の `Format Markdown Table`                  |
| 引数       | 対象ファイルとカーソル行                                         |

実体が Node 標準ライブラリだけに依存するため、拡張への取り込みに技術的な障害はない。

## 3. 完了条件

- 拡張のコマンドとして表整形を実行でき、カーソル位置の表が整形される。
- コマンドは `specdojo.` 接頭辞を持ち、既存の `specdojo.openById` と命名が揃っている。
- 整形結果が `tasks.json` 経由の実行と一致する。同じ入力に対し同じ出力を返す。
- 整形処理の実装が拡張側へ移り、`tools/docs/src/fmt-md-table.ts` が残っていない。実装を二重に
  持たない。
- `.vscode/tasks.json` のタスクは当面残す。移行期間として維持し、撤去時期は別途判断する。
- 拡張の README または `package.json` の説明に、追加したコマンドが記載されている。
- 拡張のビルドが通り、vsix を生成できる。

## 4. 検討事項

- CLI 経路は残さない。呼び出し元が `tasks.json` だけで、npm script、hook、CI からの参照がなく、
  `export` も持たないためである。エディタ上のヘルパーであり CLI から使う実態がない。実装は
  拡張へ移し、`tools/docs/src/fmt-md-table.ts` は削除する。
- コマンドは `specdojo.formatMarkdownTable` とし、既定キーバインドは割り当てず、コマンド
  パレットから実行する。現在のタスクもキーバインドを持たないため、起動方法を増やさない。
- 整形対象はアクティブエディタのカーソル行を含む表とする。選択範囲や複数表への適用は行わず、
  現行と同じ振る舞いに揃える。

## 5. 作業内容

| No  | 作業                          | 担当 | 状態 | メモ                   |
| --- | ----------------------------- | ---- | ---- | ---------------------- |
| 1   | 整形処理の共有方法を決める    | ARC  | done | 拡張内の純粋関数へ移動 |
| 2   | 拡張へコマンドを追加する      | ARC  | done | `specdojo.` 接頭辞     |
| 3   | CLI 経路の動作を確認する      | ARC  | done | 単体テストで出力を確認 |
| 4   | 拡張の説明へ追記する          | ARC  | done | package.json へ記載    |
| 5   | vsix を生成して動作を確認する | ARC  | done | package script で確認  |

## 6. 対応結果

- `packages/vscode-specdojo` に `specdojo.formatMarkdownTable` コマンドを追加した。アクティブ
  エディタのカーソル行を含む表だけを整形し、変更は VS Code の編集操作として適用する。
- 整形ロジックを `packages/vscode-specdojo/src/markdown-table.ts` へ移し、旧 CLI の
  `tools/docs/src/fmt-md-table.ts` は削除した。出力互換性は単体テストで固定した。
- 拡張の `package.json` にコマンドと機能説明を追加した。既定キーバインドは追加していない。
- `.vscode/tasks.json` の `Format Markdown Table` は移行期間のため残し、command variable で同じ
  拡張コマンドへ委譲した。CLI 実装は保持していない。
- 編集ガイド、各 authoring standard、Markdown 編集指示の利用手順を新しいコマンド名へ追従させた。
- 拡張のコンパイルと vsix 生成を確認した。残課題はない。

受け入れ時に orchestrator が次を確認した。

| 検証                   | 結果                           |
| ---------------------- | ------------------------------ |
| `npm run typecheck`    | 通過                           |
| 単体テスト             | 1373 件通過（本項目で 5 件増） |
| `npm run vscode:build` | 通過                           |

- コマンド名が `specdojo.formatMarkdownTable` で、既存の `specdojo.openById` と接頭辞が揃っている。
- 旧実装との出力一致がテストで固定されている。`matches the legacy formatter's LF output for
changed CRLF input` と `preserves legacy CRLF input when the table needs no changes` が該当し、
  改行コードの扱いまで検証している。
- `tools/docs/src/fmt-md-table.ts` が削除され、実装を二重に持っていない。
- `.vscode/tasks.json` は `${command:specdojo.formatMarkdownTable}` へ書き換えられ、拡張コマンドへ
  委譲している。実体が削除されても既存利用者の手順が壊れない。移行期間としての維持と、実装を
  二重に持たないことが両立している。
- 保護機構は作動しなかった。`package.json` はルートではなく拡張側のもので、保護対象に含まれない。

## 7. 関連ドキュメント

- [[prj-0001:pjr-gx9d-vscode-extension-consolidation]]: 集約方針。本項目はその1番目。
- [[prj-0001:pjr-0143-vs-code-marketplace]]: 本項目の完了後に実施する。
- [[specdojo:docs-editing-guide]]: 現行のタスク利用手順の記載先。
