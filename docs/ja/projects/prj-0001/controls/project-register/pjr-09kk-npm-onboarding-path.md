---
specdojo:
  id: prj-0001:pjr-09kk-npm-onboarding-path
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-09-23T03:50:08Z"
  due_on: "2026-10-31"
---

# PJR-09KK npm 導入から exec までの導線を README と quick-start へ反映する

## 1. 概要

[[prj-0001:pjr-fkn1-kata-distribution-method]] の第 4 段階。npm 公開後の利用者が、`npm install specdojo` から Detached Unit を立ち上げて exec まで到達できる導線を文書へ反映する。

現状の README は「CLI だけでなく文書体系一式を配置する場合は Use this template から新しいリポジトリを作成する」と案内しており、npm 導入と両立していない。空リポジトリでの実測では、register 系と `dashboard build` は動くが、`catalog scaffold` は `catalog_path not set`、`exec plan` は `Template not found` で止まった。

### 1.1. 観測済みの事実

オーケストレーターが一時ディレクトリで実測した結果である。executor は再実測せず、文書の記述がこの事実と合っているかを確認する。

`config init` が生成する雛形は register 最小構成である。

```json
{
  "base_path": "docs/ja/projects/prj-0001",
  "project_register_path": "controls/project-register",
  "project_context": ["prj-overview"],
  "run": { "worktree_base": "../app1-worktrees" }
}
```

kata を持たない空ディレクトリでの動作は次のとおり。

| コマンド                                | 結果                                               |
| --------------------------------------- | -------------------------------------------------- |
| `config init`                           | 成功                                               |
| `register scaffold` / `add` / `build`   | 成功                                               |
| `dashboard build`                       | 成功                                               |
| `exec plan --register`                  | 成功（[[prj-0001:pjr-ypns-kata-resolution]] 以降） |
| `kata list`                             | 312 件を `SOURCE=node_modules` で表示              |
| `kata eject --id specdojo:pjr-rulebook` | 成功。以後 `SOURCE=repository` へ変化              |
| `index build`（eject 前後）             | いずれも 312 entries、重複エラーなし               |
| `catalog scaffold`                      | 失敗（`catalog_path not set for project`）         |

`catalog scaffold` だけが設定不足で止まる。雛形に `catalog_path`、`schedule_path`、`execution_path`、`members_path`、`roles_path`、`viewpoints_path`、`routines_path`、`jobs_path` が無いためである。

### 1.2. 作業 2 の方針

`config init` の雛形へ全キーを追加しない。register だけを使う最小構成の利用者に未使用の設定が並び、どれを埋めるべきか判断できなくなる。

代わりに次を行う。

- `.specdojo/specdojo.config.json` のキー一覧を reference として新設する。各キーの役割、既定値の有無、どのコマンドが必要とするかを表で示す。
- `config init` が表示する Next steps へ、catalog や schedule へ進む場合は reference を参照してキーを追加する旨を加える。
- `catalog scaffold` が出す `catalog_path not set` のエラーメッセージから、参照先が分かるようにする。

利用者は「register だけなら設定不要」「catalog へ進むときに必要なキーを足す」という段階的な体験になる。

## 2. 完了条件

- 空リポジトリで `npm install specdojo` から `config init`、`register scaffold`、`catalog scaffold`、`exec plan --register` までを通しで実行し、手順どおりに完了することを確認している。
- README の導入手順が npm 経由で完結し、テンプレートリポジトリは選択肢として位置づけられている。
- [[specdojo:quick-start-guide]] の Detached Unit 手順が、kata の扱い（参照が既定、必要なら eject）を含めて実態に合っている。
- `.specdojo/specdojo.config.json` のキー一覧が reference として存在し、各キーの役割・既定値の有無・必要とするコマンドが分かる。`config init` の雛形へ全キーを追加していない。
- `config init` の Next steps と `catalog scaffold` のエラーメッセージから、キー一覧の reference へ辿れる。
- 文書 lint 設定（`.remarkrc.yaml` など）の導入手順が案内されている。
- `npm run check` と `npm run docs:build` が通過している。

## 3. 作業内容

| No  | 作業                                                              | 担当 | 状態 | メモ                                    |
| --- | ----------------------------------------------------------------- | ---- | ---- | --------------------------------------- |
| 1   | 記載内容が `1.1. 観測済みの事実` と一致しているかを確認する       | DEV  | open | 再実測は不要                            |
| 2   | 設定キー一覧の reference を新設し、案内から辿れるようにする       | DEV  | open | 雛形へ全キーを足さない（`1.2.` の方針） |
| 3   | README の導入手順を npm 経由で完結させる                          | DEV  | open | テンプレートは選択肢へ降格              |
| 4   | `quick-start-guide` の Detached Unit 手順へ kata の扱いを反映する | DEV  | open | eject の案内を含める                    |
| 5   | 文書 lint 設定の導入手順を案内する                                | DEV  | open | `docs-editing-guide` との重複を避ける   |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-fkn1-kata-distribution-method]]
- [[prj-0001:pjr-ypns-kata-resolution]]
- [[prj-0001:pjr-aak1-kata-subcommands]]
- [[prj-0001:pjr-tbhh-detached-unit-default]]
- [[specdojo:quick-start-guide]]
- `README.md`
