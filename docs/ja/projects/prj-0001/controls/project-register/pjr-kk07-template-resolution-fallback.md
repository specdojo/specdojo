---
specdojo:
  id: prj-0001:pjr-kk07-template-resolution-fallback
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: ARC
  registered_at: "2026-09-07T13:14:00Z"
  due_on: "2026-09-30"
  completed_at: "2026-09-08T12:37:11Z"
---

# PJR-KK07 テンプレートを同梱パッケージ側へフォールバックさせる

## 1. 概要

`specdojoRootDir()` は利用者リポジトリのルートを返すため、npm でインストールした利用者の
リポジトリに `docs/ja/specdojo/templates` が存在せず `Template not found` で失敗する。
利用者リポジトリに無い場合は同梱パッケージ側のテンプレートを解決する経路を設ける。

## 2. 観測した事実

register 単体構成を一時ディレクトリで検証した際に判明した。設定と `git init` だけの状態で
`register add` を実行すると、テンプレートの解決に失敗する。

```text
Template not found: /tmp/sdj-register-only-XXXX/docs/ja/specdojo/templates/pjr-todo-template.md
```

解決元はリポジトリのルートに固定されている。

```typescript
const templatePath = join(specdojoRootDir(), "docs/ja/specdojo/templates", templateFileName);
```

`specdojoRootDir()` は `.specdojo/specdojo.config.json` か `.git` を上位へ探索し、利用者の
リポジトリルートを返す。npm でインストールした利用者のリポジトリに kata は存在しない。

同じ失敗は `register build` でも起きる。`pm-*-template.md` を解決できず、登録簿のビューと
PM 系ログを生成できない。

```text
View template not found: .../docs/ja/specdojo/templates/pm-risk-register-template.md
```

テンプレートを手動で配置すると、`register add` / `start` / `close` / `build` はすべて動作した。
解決経路だけが障害である。

## 3. 完了条件

- 利用者リポジトリに `docs/ja/specdojo/templates` が存在しない場合、同梱パッケージ側の
  テンプレートを解決する。
- 利用者リポジトリにテンプレートが存在する場合は、そちらを優先する。利用者による上書きを
  妨げない。
- `project_register_path` だけを設定した最小構成で、`register add` / `build` が成功する。
- どちらのテンプレートを使ったかが、失敗時の調査に足る形でエラーメッセージへ現れる。
- 解決順序を検証する単体テストを追加する。

## 4. 作業内容

| No  | 作業                                       | メモ                                    |
| --- | ------------------------------------------ | --------------------------------------- |
| 1   | テンプレート解決を共通関数へ集約           | `register.ts` に 3 箇所の組み立てがある |
| 2   | 利用者リポジトリ優先、同梱へフォールバック | 探索順序を明示する                      |
| 3   | 同梱パッケージのルート解決方法を決める     | `import.meta.url` からの相対など        |
| 4   | 最小構成での動作確認                       | 一時ディレクトリで再現する              |
| 5   | 単体テストを追加                           |                                         |

## 5. 対応結果

- `import.meta.url` を基準に npm パッケージルートを解決する共通モジュールと、
  `docs/ja/specdojo/templates` 配下を探索するテンプレートリゾルバを追加した。
- テンプレートは利用者リポジトリ、同梱パッケージの順で解決する。両方に無い場合は、
  テンプレート名と探索した2つのパスをエラーメッセージに含める。
- `register add`、旧一覧からの個票移行、`register build` の派生ビュー生成を共通リゾルバへ
  移行した。利用者リポジトリ側に同名ファイルがある場合の上書き動作は維持している。
- 利用者側優先、同梱側へのフォールバック、両方欠落時のエラー内容を単体テストで固定した。
  あわせて、`project_register_path` だけを設定し、利用者側へテンプレートを配置しない構成で
  `register add` と `register build` が成功する回帰テストを追加した。
- 残課題はない。単体・統合テストと schema 検証は executor 後に parent runner が実行する。

## 6. 関連ドキュメント

- [[prj-0001:pjr-say1-template-finding-comments]]: 同じ調査で判明したテンプレート由来の混入。
- [[prj-0001:pjr-36qg-competitive-landscape-and-release]]: npm 公開の段取りと register 単体構成。
