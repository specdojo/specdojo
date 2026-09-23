---
specdojo:
  id: prj-0001:pjr-r1n2-cli-version-from-package-json
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: DEV
  registered_at: "2026-09-23T12:22:03Z"
  due_on: "2026-09-30"
  completed_at: "2026-09-23T12:35:09Z"
  conclusion: CLI の version を package.json から読むようにし、直書きを廃止した。npm version の更新へ自動で追従する。
---

# PJR-R1N2 CLI の --version を package.json から読み、ハードコードをやめる

## 1. 概要

[[prj-0001:pjr-7vkr-npm-release]] の 0.2.0 公開後、npm 経由で導入した環境で確認したところ、CLI が報告する版とインストールされている版が食い違った。

```text
node_modules/specdojo/package.json  → 0.2.0
npx specdojo --version              → 0.4.0
```

原因は `src/specdojo.ts` での直書きである。

```typescript
program.name("specdojo").description("SpecDojo helper CLI").version("0.4.0");
```

`package.json` の version とは独立した文字列が置かれており、`npm version` で更新されない。`0.4.0` という値の由来は不明で、過去の想定版か書き間違いと考えられる。

利用者が `specdojo --version` で確認した値が実際の版と異なるため、不具合報告を受けても版を特定できない。動作そのものには影響しない。

## 2. 完了条件

- `specdojo --version` が `package.json` の `version` と一致する。
- version を直書きした文字列が `src` から無くなっている。
- `npm version` で version を上げた後、再ビルドすれば `--version` が追従する。
- 開発時（`src` 実行）と npm 導入時（`dist` 実行）の双方で正しい値を返す。
- version の取得元を検証する単体テストがある。
- `npm run check` が通過している。

## 3. 作業内容

| No  | 作業                                         | 担当 | 状態 | メモ                              |
| --- | -------------------------------------------- | ---- | ---- | --------------------------------- |
| 1   | `package.json` から version を読む経路を作る | DEV  | done | `specdojoPackageRootDir()` を使う |
| 2   | `src/specdojo.ts` の直書きを置き換える       | DEV  | done | `0.4.0` を削除                    |
| 3   | 取得元を検証する単体テストを追加する         | DEV  | done | 開発時と導入時の双方              |

## 4. 対応結果

- `src/package-paths.ts` へ `specdojoPackageVersion()` を追加し、実行中の CLI の `package.json` から version を読むようにした。`src/specdojo.ts` の `program.version("0.4.0")` を置き換え、直書きを廃止した。
- `SPECDOJO_PACKAGE_ROOT` は参照しない。この変数は kata の参照先を差し替えるためのもので、実行中の CLI 自身の版とは無関係である。同じ関数を使い回すと、kata を差し替えたときに報告する版まで変わってしまう。そのため module 位置から求める内部関数を分けた。
- 単体テストを 2 件追加した。`package.json` の値と一致すること、`SPECDOJO_PACKAGE_ROOT` を設定しても版が変わらず kata の解決先だけが変わることを検証する。
- `node dist/specdojo.js --version` が `0.2.0` を返し、`package.json` と一致することを確認した。
- `npm run typecheck`、`npm run lint:ts`、`npm run check`（120 files / 1657 tests）が通過した。
- ローカル feature ブランチ `feature/prj-0001/cli-version` で実装し、`--no-ff` merge で develop へ統合した。
- 本修正は公開済みの 0.2.0 には含まれない。次の公開で反映される。

## 5. 関連ドキュメント

- [[prj-0001:pjr-7vkr-npm-release]]
- `src/specdojo.ts`
- `src/package-paths.ts`
