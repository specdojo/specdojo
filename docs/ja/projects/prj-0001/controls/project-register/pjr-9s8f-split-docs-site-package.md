---
specdojo:
  id: prj-0001:pjr-9s8f-split-docs-site-package
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-09-09T15:19:06Z"
  due_on: "2026-09-30"
  completed_at: "2026-09-12T06:00:02Z"
  block_reason: "agent exited with non-zero code: agent exited with non-zero code: agent-config-write: protected configuration changes detected; paths=.github/workflows/deploy.yml, package.json; agent must record the …"
  conclusion: VitePress と Mermaid 生成器を packages/docs-site（@specdojo/docs-site）へ分離し、CLI 本体の package.json から vitepress / vitepress-sidebar / @mermaid-js/mermaid-cli を除去した。docs:dev / docs:build は分離パッケージへ委譲し、deploy.yml と post-create.sh を追随させた。保護対象の設定は orchestrator が申し送りを確認して develop へ適用し、実機で npm run docs:build の全量ビルドが成功することを確認した。
---

# PJR-9S8F 文書サイト機能を別パッケージへ分離する

## 1. 概要

Mermaid 図の生成が Chromium を必要とする。CLI 本体には不要な依存であり、同梱すると利用者が
Mermaid 生成時に Chromium の取得へ直面する。文書サイト構築に必要な一式を分離する。

## 2. 依存の実態

従来の `tools/docs/src` の内訳は用途で二分される。分離後、Mermaid 生成器だけを
`packages/docs-site/src` へ移した。

| ファイル                                    | 呼び出し元               | 外部依存     | 判断 |
| ------------------------------------------- | ------------------------ | ------------ | ---- |
| `remark-frontmatter-ajv2020.cjs`            | remark 設定              | ajv          | 同梱 |
| `remark-md-content.cjs`                     | remark 設定              | Node 標準    | 同梱 |
| `history-links.ts`                          | `validate-history-links` | Node 標準    | 同梱 |
| `packages/docs-site/src/gen-mermaid-svg.ts` | `docs:build:mermaid`     | **Chromium** | 分離 |

Mermaid の生成は外部プロセスへ委ねている。

```typescript
const PUPPETEER_CONFIG = path.join(PACKAGE_ROOT, "puppeteer-config.json");
execFileSync(process.execPath, [MERMAID_CLI, "-p", PUPPETEER_CONFIG, "-c", MERMAID_CONFIG]);
```

この環境では、Debian の Chromium ビルド退行により生成できなくなった経緯がある。CLI 本体の
`register` や `exec` には一切不要な依存である。

## 3. `.vitepress` を分離パッケージへ含める根拠

`packages/docs-site/.vitepress/config.mts` が `gen-mermaid-svg` を直接 import している。両者は
不可分であり、同じパッケージへ入れる。

```typescript
import { generateMermaidSvgs, generateMermaidSvgsForFile } from "../src/gen-mermaid-svg";
```

`config.mts` は `vitepress` と `vitepress-sidebar` にも依存する。文書サイトの構築に必要な設定
一式であり、CLI 利用者が閲覧サイトを立てない限り不要である。

## 4. 同梱を維持する範囲とその理由

検証系は kata と密結合する。`remark-frontmatter-ajv2020.cjs` は `docs/specdojo/schemas` を
読み、`remark-md-content.cjs` は Markdown 規約を実装する。規約と検証器を別パッケージにすると
版がずれ、規約の更新に検証が追随しない状態が生じる。依存も ajv と Node 標準のみで軽い。

## 5. 完了条件

- 文書サイト構築に必要な一式が別パッケージへ分離されている。`gen-mermaid-svg.ts`、
  `.vitepress/config.mts`、`.vitepress/sidebar-config.ts`、Mermaid と puppeteer の設定を含む。
- `specdojo` 本体の同梱物に Chromium を要する依存が含まれない。
- 検証系（remark 系と `history-links.ts`）は `specdojo` 本体へ残っている。
- 文書サイトを構築しない利用者が、分離パッケージを入れずに `register` / `exec` / `catalog` /
  `grade` を実行できる。
- 本リポジトリの `docs:build` と `docs:dev` が従来どおり動作する。
- 分離パッケージの参照方法が決まっている。`optionalDependencies` とするか、利用者が明示的に
  導入するか。
- 分離パッケージが無い場合の挙動が定義されている。機能を無効化するのか、エラーとするのか。

## 6. 作業内容

| No  | 作業                                             | メモ                                                        |
| --- | ------------------------------------------------ | ----------------------------------------------------------- |
| 1   | 分離対象の範囲を確定する                         | VitePress一式、Mermaid生成器、Mermaid / Puppeteer設定       |
| 2   | パッケージ構成を決める                           | `@specdojo/docs-site`、独立lockfile、利用者による明示導入   |
| 3   | 分離を実施する                                   | `packages/docs-site` へ移動し専用CLIを追加                  |
| 4   | 本体の `files` から文書サイト関連を外す          | `tools/docs/src` には検証系だけが残る                       |
| 5   | 分離パッケージ無しでの動作を確認する             | 本体lockfileとpack内容からChromium依存が無いことを確認      |
| 6   | 本リポジトリの `docs:build` が動くことを確認する | ルートnpm scriptとdeploy workflowを分離パッケージ経由へ変更 |

## 7. 採用した構成

- パッケージ名は責務を表す `@specdojo/docs-site` とする。
- `specdojo` の `optionalDependencies` には含めない。サイトを使う環境だけが明示導入し、未導入時は
  `specdojo-docs-site` コマンドが存在しないことで即時に失敗させる。
- 本リポジトリでは独立 `package-lock.json` を使い、CI は本体の `npm ci` と分けて導入する。ルートの
  `docs:build` / `docs:dev` は互換入口として分離パッケージの npm scriptへ委譲する。

## 8. 対応結果

文書サイト一式を `packages/docs-site` へ分離し、実行入口 `specdojo-docs-site` を追加した。本体の
`package.json` / `package-lock.json` から VitePress、Mermaid CLI、Chromium / Puppeteerの依存を
除去した。remark系、履歴リンク検証、schema検証は従来どおり `tools/docs/src` に残した。

本リポジトリのルートnpm script、devcontainer初期化、GitHub Pages workflowは、分離パッケージを
明示的に導入して呼び出す。ビルド出力は `packages/docs-site/.vitepress/dist` とする。分離パッケージ
のCLIは対象workspaceを引数で受けるため、インストール先でも
`npx specdojo-docs-site build .` として使える。
日本語・英語の最小文書fixtureを対象に、移動後の設定・theme・Mermaidプラグインを通るVitePress
buildが成功することも確認した。残課題はない。

## 9. 関連ドキュメント

- [[prj-0001:pjr-a12b-remove-dead-lefthook-docs-build]]: 同じ調査で判明した死んだコード。
- [[prj-0001:pjr-36qg-competitive-landscape-and-release]]: npm 公開の段取りと同梱範囲。
