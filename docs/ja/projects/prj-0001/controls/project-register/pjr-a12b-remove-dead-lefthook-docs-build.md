---
specdojo:
  id: prj-0001:pjr-a12b-remove-dead-lefthook-docs-build
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: low
  owner: ARC
  registered_at: "2026-09-09T15:18:58Z"
  due_on: "2026-09-30"
  completed_at: "2026-09-10T11:45:02Z"
---

# PJR-A12B 呼び出し元のない lefthook-docs-build.ts を削除する

## 1. 概要

`tools/docs/src/lefthook-docs-build.ts` はリポジトリ内のどこからも呼ばれていない。

## 2. 調査結果

| 参照元                   | 結果     |
| ------------------------ | -------- |
| `lefthook.yml`           | なし     |
| `.github/workflows/`     | なし     |
| `package.json` の script | なし     |
| リポジトリ全体           | 自身のみ |

唯一の一致はファイル自身が持つ環境変数名である。

```text
tools/docs/src/lefthook-docs-build.ts:29:  process.env.LEFTHOOK_DOCS_BUILD_LOG ?? ...
```

GitHub Actions は npm script を直接呼んでおり、当該スクリプトを経由しない。

```yaml
# .github/workflows/deploy.yml:40
run: npm run docs:build
```

```json
"docs:build": "npm run docs:generate && vitepress build ."
```

`lefthook.yml` にはメモリ消費を理由とするコメントのみが残る。

```yaml
# docs-build（vitepress build）は rendering pages 時にメモリを大量消費し、
```

hook から外された際にスクリプトが残置されたと推測される。

## 3. 影響

`package.json` の `files` が `tools/docs/src` を含むため、利用者へ不要なファイルを配布して
いる。

## 4. 完了条件

- `tools/docs/src/lefthook-docs-build.ts` が削除されている。
- 削除前に git 履歴を確認し、意図的に残されたものでないことを確かめている。復活の予定がある
  場合は、その理由と再導入の条件が記録されている。
- `npm run docs:build` と `lint:md` が従来どおり動作する。
- `npm pack --dry-run` の同梱物から当該ファイルが消えている。

## 5. 作業内容

| No  | 作業                         | 対応結果                                                                                         |
| --- | ---------------------------- | ------------------------------------------------------------------------------------------------ |
| 1   | git 履歴で残置の経緯を確認   | 追加と hook からの削除経緯を確認し、復活予定を示す変更や参照がないことを確認した                 |
| 2   | 削除する                     | `tools/docs/src/lefthook-docs-build.ts` を削除した                                               |
| 3   | 参照が残っていないことを確認 | lefthook、CI、npm script を含むリポジトリ全体を検索し、実行時参照が残っていないことを確認した    |
| 4   | 同梱物から消えたことを確認   | `npm pack --dry-run` の出力に `tools/docs/src/lefthook-docs-build.ts` が含まれないことを確認した |

## 6. 対応結果

- 2025-12-14 のコミット `af77c10c` で、VitePress build の終了を取得できない問題への回避策として
  当該ファイルが追加されていた。
- 2026-06-23 のコミット `7e14097a` で、VitePress build のメモリ消費により commit がブロック
  されるため docs-build hook が削除された一方、当該ファイルだけが残置されていた。
- 現在の `lefthook.yml`、`.github/workflows/`、`package.json` から当該ファイルへの参照はなく、
  復活予定を示す記述もないため、`tools/docs/src/lefthook-docs-build.ts` を削除した。
- `npm run lint:md` と、書き込み可能な一時 cache を指定した `npm pack --dry-run` は成功し、
  npm パッケージに削除ファイルが含まれないことを確認した。
- `npm run docs:build` は sandbox が `tsx` の IPC ソケット作成を拒否するため開始できなかった。
  コンパイル済み CLI による文書生成は全工程成功し、VitePress build は開始したが、sandbox が
  Mermaid 用 Chromium の起動を拒否したため完走確認はできなかった。
- 残課題: sandbox 外の親検証または CI で `npm run docs:build` の完走を確認する。

## 7. 関連ドキュメント

- [[prj-0001:pjr-9s8f-split-docs-site-package]]: 同じ調査で判明した文書サイト機能の分離。
