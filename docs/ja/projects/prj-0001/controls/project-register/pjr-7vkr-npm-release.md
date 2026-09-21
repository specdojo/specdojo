---
specdojo:
  id: prj-0001:pjr-7vkr-npm-release
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: high
  owner: ARC
  registered_at: "2026-09-09T15:38:56Z"
  due_on: "2026-09-30"
  block_reason: "integrate failed: git ls-files failed: fatal: detected dubious ownership in repository at '/workspaces/specdojo-workspace/worktrees/prj-0001-PJR-7VKR' To add an exception for this directory, call:  \tg…"
---

# PJR-7VKR specdojo を npm へ公開する

## 1. 概要

`specdojo` 0.1.0 は 2026-04-05 に公開済みだが、別リポジトリの初期実装で現在とは実質別物である。
同梱範囲を確定して 0.2.0 を公開する。

競合分析は [[prj-0001:pjr-36qg-competitive-landscape-and-release]] が note として保持する。本項目は
公開作業を扱う。

## 2. 公開の現状と同梱範囲

### 2.1. 現状

`specdojo` は 2026-04-05 に公開済みである。名前空間は確保されている。

| 項目       | 公開版（0.1.0）                              | 現在                |
| ---------- | -------------------------------------------- | ------------------- |
| ファイル数 | 18                                           | 581                 |
| 展開サイズ | 97 KB                                        | 5.2 MB              |
| homepage   | `specdojo-handbook/tree/main/tools/specdojo` | `specdojo/specdojo` |

公開版は別リポジトリの初期実装で、現在とは実質別物である。

### 2.2. 同梱範囲

`package.json` の `files` は次を含む。

```text
dist / docs/ja/specdojo / docs/specdojo / templates / README.md / LICENSE
!docs/ja/specdojo/**/generated/** / !docs/specdojo/**/generated/**
```

#### 2.2.1. サイズは制約にならない

当初は 5.2 MB を過大と見て、除外や初回取得の仕組みを検討した。これは展開後の値で、実際の
配信量は 1.3 MB である。

```text
npm notice package size: 1.3 MB
npm notice unpacked size: 5.2 MB
npm notice total files: 583
```

同種の CLI と比べて小さい部類にあたる。

| パッケージ |  配信量 |
| ---------- | ------: |
| typescript |  ~11 MB |
| prettier   | ~3.5 MB |
| eslint     | ~2.5 MB |
| specdojo   |  1.3 MB |

サイズを理由に分離する必要はない。

#### 2.2.2. 初回取得方式を採らない理由

kata を後から取得する方式は、次の理由で採らない。

| 問題       | 内容                                                        |
| ---------- | ----------------------------------------------------------- |
| オフライン | `register add` にネットワークが必要になる。現在は不要       |
| 取得元     | GitHub raw は暗黙の依存。レート制限やリポジトリ移動で壊れる |
| 版のずれ   | CLI の版と kata の版が一致しない                            |
| 完全性     | checksum や署名を自前で用意することになる                   |

PJR-KK07 により kata を配置しない最小構成でも `register add` と `build` が動作する。オフラインで
完結する性質を、取得方式は損なう。

将来分離が必要になった場合は、取得方式ではなくパッケージ分割を採る。npm が版管理・完全性・
キャッシュを担うため、自前の取得機構が不要になる。

#### 2.2.3. 各対象の判断

| 対象                 | 判断     | 理由                                                                                                              |
| -------------------- | -------- | ----------------------------------------------------------------------------------------------------------------- |
| `dist`               | 同梱     | `bin` が参照する実行本体。`src` は不要                                                                            |
| `docs/specdojo`      | 同梱     | schema。検証に必要                                                                                                |
| `docs/ja/specdojo`   | 同梱     | kata・templates・exec-templates・defaults                                                                         |
| `docs/en/specdojo`   | **除外** | `.gitkeep` のみで実質空。整備後に追加する                                                                         |
| `templates`          | 同梱     | `exec scaffold --provider` が `packageRoot` から解決する                                                          |
| `tools/docs/src`     | **除外** | CLI から参照されず、依存も devDependencies のため同梱しても動かない。`@specdojo/docs-lint` へ分離する（PJR-DPVV） |
| `README` / `LICENSE` | 同梱     |                                                                                                                   |

実行時に必要な範囲は次のとおりである。`src` が参照するパスから確認した。

| 用途                             | ディレクトリ            | サイズ |
| -------------------------------- | ----------------------- | -----: |
| `register add` / `catalog build` | `templates`             |   560K |
| plan / result 生成               | `exec-templates`        |   216K |
| 各種検証                         | `docs/specdojo/schemas` |   244K |
| `grade` の観点                   | `defaults`              |    56K |

残る `rulebooks` / `recipes` / `samples` / `standards` / `guides` は agent と利用者が読む。CLI の
動作には不要だが、kata の網羅範囲が SpecDojo の中核であるため同梱する。

`tools/docs/src` の扱いは [[prj-0001:pjr-9s8f-split-docs-site-package]] と
[[prj-0001:pjr-a12b-remove-dead-lefthook-docs-build]] で扱う。Mermaid 生成は Chromium を要する
ため分離し、呼び出し元のないスクリプトは削除する。

#### 2.2.4. generated を除外した

変更前の同梱物には `generated` 配下が 52 件含まれていたため、除外した。

| 場所                                   | 件数 |
| -------------------------------------- | ---: |
| `docs/ja/specdojo/templates/generated` |   38 |
| `docs/ja/specdojo/samples/generated`   |    9 |
| `docs/specdojo/schemas/v1/generated`   |    4 |
| `docs/ja/specdojo/defaults/generated`  |    1 |

除外する根拠は 3 点ある。

**git の追跡対象外である**。`.gitignore` の `docs/**/generated/*` に該当し、`git ls-files` は
0 件を返す。`files` が `docs/ja/specdojo` をディレクトリ単位で指定するため、作業ツリーに存在
するものがそのまま同梱される。publish 時の作業ツリーの状態に依存し、再現性がない。ビルドして
いない環境では含まれず、含まれる場合も内容が古い可能性がある。

**利用者側で生成される**。`yaml-pages build` が YAML から導出する閲覧用ページである。

```typescript
// YAML パス（repo ルート相対）から表示ページのパスを導出する。
// 例: docs/ja/foo/pm-roles.yaml → docs/ja/foo/generated/pm-roles.md
```

利用者が `specdojo build` を実行すれば生成されるため、同梱する必要がない。

**生成物は評価対象でも配布対象でもない**。[[prj-0001:pjr-mbvm-grade-exclude-generated]] で
`generated` を grade の対象から除外した。同じ論理で配布からも除外する。

`schemas/v1/generated` の 4 件も除外して差し支えない。いずれも `.md` の閲覧用ページで、`src` が
読む schema は `.yaml` のみである。これらも git の追跡対象外である。

```text
schemas/v1/generated/guide-content.schema.md
schemas/v1/generated/philosophy-content.schema.md
schemas/v1/generated/pjr-index-content.schema.md
schemas/v1/generated/reference-content.schema.md
```

除外は `files` へ否定パターンを加えて行った。除外後の tarball に `generated` 配下が含まれない
ことは、`同梱物の実地検証` で確認した。

#### 2.2.5. 同梱物の実地検証

`npm pack --dry-run --json` で全件を検査した。結果は 528 ファイル、package size 1,186,068 bytes、
unpacked size 4,812,525 bytes であった。`generated`、`tools/docs`、`docs/en/specdojo` は 0 件で、
`dist`、日本語 kata、schema、provider template、README、LICENSE が含まれることを確認した。

さらに tarball を一時ディレクトリへ展開し、展開物の CLI と同梱データだけを対象に次を確認した。

- `specdojo --help`
- `config init`
- `register add` と `register build`
- `catalog scaffold --size small --domain data-flow`
- `exec scaffold --provider codex`

`catalog scaffold` だけが利用者リポジトリ内のテンプレートを必須としていたため、`register add` と
同じく npm package の同梱テンプレートへフォールバックするよう修正した。ネットワーク制限により
依存 package の再取得は行わず、依存解決には作業ツリーの `node_modules` を使用した。CLI 本体、
テンプレート、schema、provider template はすべて展開した tarball 内のものを使用した。

### 2.3. 手順

publish は GitHub Actions が実行する。手元で行うのは version の更新と確認までである。詳細は
`publish の実行経路` に記す。

```sh
npm version minor          # 0.1.0 -> 0.2.0
npm run build
npm pack --dry-run         # 同梱範囲を確認する
git push                   # main への push で workflow が起動する
```

手元で `npm publish` を実行しない。実行する場合は `npm login` と、2FA を有効にしていれば
ワンタイムパスワードを求められる。CI 経由では OIDC を使うため、いずれも不要である。

### 2.4. 公開前に確認する事項

- `files` の同梱範囲が意図どおりか。`npm pack --dry-run` で確認する。
- `dist` が最新か。`npm run build` を実行してから publish する。
- `bin` の `specdojo` が動作するか。`npm pack` した tarball をローカルへインストールして確認
  できる。
- README が npm のページとして成立するか。GitHub 向けの記述が残っていないか。

## 3. VS Code Marketplace

詳細は [[prj-0001:pjr-0143-vs-code-marketplace]] に記載する。要点は次のとおりである。

- publisher ID は `specdojo` とする。Marketplace で未取得であることを確認済みである。
- 拡張の識別子 `publisher.name` は後から変更できない。
- Personal Access Token は Organization を All accessible organizations、Scopes を Marketplace の
  Manage で発行する。有効期限は既定 90 日である。
- `package.json` に `repository`、`license`、`icon` が未記載である。公開前に補う。

publisher の作成はブラウザ操作を要するため、人が行う。

## 4. 公開の判断

### 4.1. 急ぐ理由と急がない理由

急ぐ理由は、自分の他プロジェクトで使うためである。npm 経由でインストールできれば、リポジトリを
clone せずに利用できる。これは競合対策とは独立した動機である。

急がない理由は品質にある。kata の評価で全4種別の要修正が 137 件（58%）、うち sample は 69 件
（79%）である。

修正へ渡す経路は `maintenance` と `bootstrap` の exec テンプレートに存在する。ただし実際に
回した実績はなく、機能するかは未検証である。

### 4.2. 判断

kata の品質は公開の阻害要因にしない。`grade` の結果が frontmatter に記録されており、利用者は
品質を把握できる。評価済みで改善中という状態を示せる。

同梱範囲は `同梱範囲` で確定した。配信量は 1.3 MB で、サイズは阻害要因にならない。

導入後の導線は [[prj-0001:pjr-9m5n-npm-onboarding-path]] で整備済みであり、README から
`npm install specdojo`、`config init`、最初の register 作成へ進める。同梱物の実地検証も
`同梱物の実地検証` のとおり完了した。

publish の前に残るのは、npm 側の trusted publisher 設定と workflow 実績の確認、version 更新、
`main` への push、公開後の導入確認である。これらは人が行う。

文書サイト機能の分離（[[prj-0001:pjr-9s8f-split-docs-site-package]]）は publish の前提とはしない。
現状のまま公開しても動作する。ただし利用者が Mermaid 生成で Chromium の取得に直面するため、
早い段階で整理する価値はある。

## 4.1. publish の実行経路

publish は GitHub Actions が自動実行する。`.github/workflows/publish-specdojo.yml` が
Trusted Publishing（OIDC）で npm へ発行する。

```yaml
permissions:
  contents: read
  id-token: write
...
- name: Publish to npm via Trusted Publishing
  run: npm publish --access public
```

`NODE_AUTH_TOKEN` を使わず、GitHub が発行する OIDC token で認証する。token を GitHub Secrets へ
保存する必要がない。

起動条件は `main` への push（`src/**`、`docs/ja/specdojo/**`、`docs/specdojo/**`、
`package.json`、`package-lock.json`、workflow 自身のいずれかが変わった場合）と
`workflow_dispatch` である。`package.json` の version が npm 上の版と同じ場合は skip する。

### 4.1.1. 2FA との関係

Trusted Publishing は 2FA を置き換えない。補完する位置づけである。CI からの publish に人の
操作を要さない一方、npm 側の設定で「二要素認証を必須とし token を禁止する」を有効にできる。
公式文書は、trusted publisher を設定した後に token の権限を絞ることを推奨している。

したがって 2FA のワンタイムパスワードを CI 実行時に入力する必要はない。人が `npm publish` を
手で実行する場合にのみ求められる。

### 4.1.2. 確認が必要な事項

workflow の記述は要件を満たしているが、**npm 側の設定は未確認**である。Trusted Publishing は
両方が揃って初めて機能する。

| 要件                                | 状態                                               |
| ----------------------------------- | -------------------------------------------------- |
| npm CLI 11.5.1 以上                 | workflow は Node 24 を使う。CLI は同梱版に依存する |
| Node 22.14.0 以上                   | 満たす（Node 24）                                  |
| `id-token: write`                   | 満たす                                             |
| `contents: read`                    | 満たす                                             |
| **npm 側の trusted publisher 設定** | **未確認**                                         |

npm のパッケージ設定ページで次を登録する必要がある。

- Organization または username
- Repository 名
- **Workflow のファイル名**（`.yml` を含む。パスではなくファイル名のみ）
- 任意で GitHub environment 名と許可する actions

登録名は `publish-specdojo.yml` でなければならない。

### 4.1.3. 未検証の点

- **新規パッケージを作成できるか**。公式文書は既存パッケージの設定を前提としており、trusted
  publishing で新規に作成できるかを明示していない。`specdojo` は 0.1.0 が公開済みのため、本件
  では問題にならない。
- **workflow が一度も成功していない可能性**。0.1.0 の公開は 2026-04-05 で、別リポジトリの初期
  実装であった。現在の workflow が実際に動作した実績を確認する必要がある。
- version を上げずに `main` へ push した場合、skip されることは workflow の記述から読めるが、
  実地では未確認である。

## 5. 完了条件

- `files` の同梱範囲が `同梱範囲` の判断どおりに設定されている。`docs/en/specdojo` を含めず、
  `tools/docs/src` は検証系に限る。
- `npm pack` した tarball を別環境へ展開し、最小構成で `config init` / `register add` /
  `register build` / `exec scaffold --provider` が動作することを確認している。
- README から npm 経由の導入手順を辿れる。[[prj-0001:pjr-9m5n-npm-onboarding-path]] の完了が前提。
- `package.json` に `repository` / `license` が記載されている。
- npm 側の trusted publisher 設定が登録されており、workflow のファイル名が
  `publish-specdojo.yml` と一致している。
- GitHub Actions の publish workflow が成功し、人手の `npm publish` を要さない。
- 2FA のワンタイムパスワードを CI 実行時に求められない。
- version を上げずに `main` へ push した場合に publish が skip される。
- 0.2.0 が npm へ公開され、`npm install specdojo` で導入できる。
- 導入した環境で `specdojo --help` が動作する。

## 6. 作業内容

| No  | 作業                                      | メモ                                                                                                                                      |
| --- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `files` を確定する                        | `docs/en/specdojo` と `generated` に加え `tools/docs/src` / `tools/docs/tsconfig.json` を除外（PJR-DPVV で `@specdojo/docs-lint` へ分離） |
| 2   | 同梱ファイル一覧を確認する                | `npm pack --dry-run` の全件を見る                                                                                                         |
| 3   | 同梱物を別環境で実地検証する              | tarball を展開して最小構成で動かす                                                                                                        |
| 4   | `package.json` のメタ情報を補う           | `repository` / `license`                                                                                                                  |
| 5   | README の導線を確認する                   | PJR-9M5N は完了済み                                                                                                                       |
| 6   | npm 側の trusted publisher 設定を確認する | ファイル名は `publish-specdojo.yml`                                                                                                       |
| 7   | workflow の実行実績を確認する             | 過去に成功したことがあるか                                                                                                                |
| 8   | version を上げて `main` へ push する      | publish は Actions が実行する                                                                                                             |
| 9   | 導入して動作を確認する                    |                                                                                                                                           |

No 6 は npmjs.com のパッケージ設定ページでの操作となるため、人が行う。

### 6.1. 実行の区切り（2026-09-21）

作業 1〜4 を codex-expert-executor（worktree）で実施する。作業 5〜9（README 導線の最終確認、npm 側の trusted publisher、workflow 実績、version を上げた `main` への push、導入確認）は人の作業であり、本実行の範囲外とする。agent は `package.json` の `version` を変更せず、`git push` と `npm publish` を行わない。作業 3 の実地検証は `npm pack` の tarball を一時ディレクトリへ展開し、`npx specdojo config init` → `register add` → `catalog scaffold` が最小構成で動くことを確認して result に記録する。

## 7. 対応結果

- `package.json` の `files` から `tools/docs/src` と `tools/docs/tsconfig.json` を除外し、
  `docs/ja/specdojo` と `docs/specdojo` の `generated` 配下を否定パターンで除外した。
- `repository` と `license` は既に記載済みであることを確認した。指示どおり `version` は 0.1.0 の
  まま変更していない。
- `catalog scaffold` が利用側に kata をコピーしていない構成でも動くよう、同梱テンプレートへの
  フォールバックを追加し、探索順の回帰テストを追加した。
- `npm pack --dry-run --json` の全 528 ファイルを検査し、除外対象が 0 件、必須対象が欠落 0 件で
  あることを確認した。tarball の一時環境への展開後、`config init`、`register add`、
  `register build`、`catalog scaffold`、`exec scaffold --provider codex`、`--help` が成功した。
- npm 側の trusted publisher 設定、workflow 実績、version 更新、`main` への push、0.2.0 の公開と
  公開後の導入確認は、`実行の区切り` のとおり人の作業として残る。

### 7.1. 作業 1〜4 の実行記録（2026-09-21）

codex-expert-executor が worktree で実施し、保護設定（`package.json` の `files`）はオーケストレーターが develop へ適用して再開した。親検証 `test-unit` の失敗は、executor が tarball の実地検証を `/tmp` 直下で行い `/tmp/.specdojo/specdojo.config.json` を残したため、temp dir から上位探索するテストがルートを誤認したもの（削除後に通過）。統合段の `dubious ownership` は再現せず、統合段だけの再開（PJR-J3G0）で完了した。実地検証を指示する plan には「`mktemp -d` で作り終了時に削除する」と明記する必要がある。作業 5〜9 は人の作業として残る。

## 8. 関連ドキュメント

- [[prj-0001:pjr-36qg-competitive-landscape-and-release]]: 競合状況の観測。
- [[prj-0001:pjr-9m5n-npm-onboarding-path]]: 導入後の導線。公開の前提。
- [[prj-0001:pjr-9s8f-split-docs-site-package]]: 文書サイト機能の分離。公開の前提としない。
- [[prj-0001:pjr-0143-vs-code-marketplace]]: VS Code 拡張の公開。
