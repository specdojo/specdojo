---
specdojo:
  id: prj-0001:pjr-k513-vscode-extension-layout
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-09-06T00:09:45Z"
  due_on: "2026-09-30"
  completed_at: "2026-09-06T12:43:59Z"
  block_reason: "agent exited with non-zero code: agent exited with non-zero code: agent-config-write: protected configuration changes detected; paths=package.json; agent must record the required change in the result …"
  conclusion: 拡張を packages/ へ移し、ルートから install / build / package を実行できるようにした。vsix は tracking しない。
---

# PJR-K513 VS Code 拡張の配置とビルド成果物の扱いを整える

## 1. 概要

`tools/vscode-specdojo` に置かれていた拡張を `packages/vscode-specdojo` へ移し、ビルド成果物の
扱いとルートからの実行経路を整える。Marketplace へ公開する前に必要な作業であり、
[[prj-0001:pjr-gx9d-vscode-extension-consolidation]] の前提となる。

## 2. 変更前の状況

### 2.1. ビルド成果物が git 管理下にある

`vsix` が追跡対象に含まれる。

```text
tools/vscode-specdojo/package-lock.json
tools/vscode-specdojo/package.json
tools/vscode-specdojo/src/extension.ts
tools/vscode-specdojo/tsconfig.json
tools/vscode-specdojo/vscode-specdojo-0.1.0.vsix   ← ビルド成果物
```

同じディレクトリの他の成果物は除外されている。

| 対象                                  | `.gitignore` | 実際     |
| ------------------------------------- | ------------ | -------- |
| `tools/vscode-specdojo/node_modules/` | あり         | 除外     |
| `tools/vscode-specdojo/out/`          | あり         | 除外     |
| `*.tsbuildinfo`                       | あり         | 除外     |
| **`*.vsix`**                          | **なし**     | **追跡** |

ビルド成果物の扱いが一貫していない。vsix はバージョンごとにファイル名が変わるため、公開を
重ねるとリポジトリに古い成果物が積み上がる。バイナリのため差分も取れない。

### 2.2. ルートからビルドできない

`tools/vscode-specdojo` はルートの package.json に属さない独立 package である。`tools/` 配下で
独立 package を持つのはここだけで、他はルートの script から実行されるスクリプト群である。

| 経路                          | 状態                                      |
| ----------------------------- | ----------------------------------------- |
| `tsconfig.json` の references | 含まれる。`npm run typecheck` の対象      |
| npm workspaces                | 未設定。依存は個別に `npm install` が要る |
| ルートのビルド script         | なし                                      |

型検査だけがルートから届き、依存インストールとビルドは手作業になる。公開のたびに手順を
思い出す必要があり、再現性がない。

### 2.3. 配置そのものの妥当性

`tools/` は補助スクリプトの置き場であり、配布物の置き場ではない。拡張は Marketplace で配布する
独立した成果物であり、性質が異なる。ただし配置を変えると `tsconfig.json` の references や
`.gitignore` の記述も追従が要るため、移動の是非は費用と便益で判断する。

## 3. 完了条件

- `vsix` が git の追跡対象から外れている。既存の追跡ファイルも削除されている。
- `.gitignore` に `*.vsix` が追加され、他のビルド成果物と扱いが揃っている。
- ルートから拡張の依存インストールとビルドを実行できる。手順が npm script として存在する。
- vsix の生成もルートの script から実行できる。
- 配置とリポジトリ構成の判断が記録されている。現状維持の場合もその根拠を残す。
- `npm run typecheck` が引き続き通る。
- `.devcontainer/post-start.sh` の参照先が移動後のパスへ追従している。案内するコマンドが実在
  する。現在は存在しない `npm run package` を案内している。
- vsix を tracking しなくなったため、新しい環境では自動インストールが働かない。ビルドしてから
  インストールするか、案内だけに留めるかが決まっている。

## 4. 構成に関する決定

配置とビルド経路を整えるにあたり、リポジトリ構成そのものを検討した。結論は現状維持である。

### 4.1. 配布物の整理

リポジトリには配布物が2つある。VitePress は配布物ではない。

| 対象         | 実体                       | 配布先      | `package.json` |
| ------------ | -------------------------- | ----------- | -------------- |
| CLI          | ルート（`specdojo`）       | npm         | あり           |
| VS Code 拡張 | `packages/vscode-specdojo` | Marketplace | あり           |
| VitePress    | `.vitepress/` と `docs/`   | 配布しない  | なし           |

VitePress は文書サイトを生成するビルド機構である。`vitepress` は `devDependencies` にあり、
`package.json` の `files` にも `.vitepress` は含まれない。生成した文書（`docs/ja/specdojo`）は
CLI パッケージへ同梱されるが、VitePress 自体が独立した配布単位になるわけではない。

### 4.2. モノレポ化しない

npm workspaces は導入しない。

| 判断材料       | 実態                                                         |
| -------------- | ------------------------------------------------------------ |
| 拡張の依存     | `@types/node`、`@types/vscode`、`@vscode/vsce`、`typescript` |
| ルートとの共通 | `@types/node` と `typescript` の2つ                          |
| 相互参照       | なし。拡張はルートのコードを使わない                         |

依存の重複が2つ、相互参照がゼロの規模で workspaces を導入しても、得られるのは依存インストール
の一元化だけである。一方、依存の巻き上げが vsix のバンドルへ影響しうるほか、`tsc -b` の
references と workspaces でビルド順序の管理が二重になる。

必要なのは workspaces ではなく、ルートからビルドを起動する npm script である。これで再現性は
確保でき、巻き上げも起きない。

### 4.3. 拡張を別リポジトリにしない

拡張はコード上リポジトリ内の何にも依存しないが、データ形式で CLI と結合している。

| 依存の種類 | 内容                                                                     |
| ---------- | ------------------------------------------------------------------------ |
| コード     | なし。`vscode`、`path`、`fs` のみを import する                          |
| データ形式 | `.specdojo/doc-index.json` の構造（`version` / `entries` / `localized`） |
| 記法       | `[[id]]` の文法                                                          |
| 規約       | frontmatter の `id:` 行の形式                                            |

拡張は CLI の `index build` が生成する成果物を読む。出力形式が変われば拡張は動かなくなる。

同一リポジトリであれば、形式を変える commit で拡張も同時に直せる。分離すると追従漏れに気づく
手段がなくなり、形式変更と拡張の追従が別 commit・別 PR になる。どの CLI 版とどの拡張版が
対応するかの管理も要る。

分離が正当化される条件（独立した開発サイクル、別チームでの保守、リポジトリの肥大化、CI の
肥大化）はいずれも該当しない。拡張は 274 行の1ファイルである。

### 4.4. 配置を `packages/` へ移す

`tools/` は誤った配置である。`packages/vscode-specdojo/` へ移す。

`tools/` 配下の他の7つは、いずれもこのリポジトリを開発するためのスクリプト群である。
`vscode-specdojo` だけが性質を異にする。

| 観点         | `tools/` 配下の他7件   | `vscode-specdojo`  |
| ------------ | ---------------------- | ------------------ |
| 性質         | 開発を助けるスクリプト | 配布する製品       |
| 実行者       | 開発者、CI、Git hook   | エンドユーザー     |
| package.json | なし。ルートに属する   | あり               |
| 配布         | しない                 | Marketplace        |
| 版管理       | リポジトリと一体       | 独立したバージョン |

`tools/vscode/open-worktree-workspace.sh`（開発者が worktree を開く補助）と
`tools/vscode-specdojo`（利用者が使う拡張）が同じ階層にあるのは、名前が似ているだけで中身が
別物である。

移動先は `packages/` とする。現在は1つだが「配布する package はここ」という区分が生まれ、
ルートの CLI を将来移す余地も残る。`extensions/` は拡張が増えない限り過剰であり、ルート直下は
階層が浅く意図を読み取りにくい。

移動に伴う追従は次のとおりで、計4ファイル・7行程度である。

| 対象                                          | 変更 |
| --------------------------------------------- | ---- |
| `tsconfig.json` の references                 | 1 行 |
| `tests/src/exec-worktree.integration.test.ts` | 2 行 |
| `.devcontainer/post-start.sh`                 | 2 行 |
| `.gitignore`                                  | 2 行 |

過去の evidence や trial は実行時点の記録であり変更しない。

当初は「独立 package が1つの現状で階層を増やす利点が小さい」として現状維持と判断したが、
配置が誤っている以上、移動コストが小さいなら直すべきである。積極的な理由の不在は現状維持の
根拠にならない。

### 4.5. 判断が変わる条件

次のいずれかが生じた場合は再検討する。

- 拡張とルートの間に相互参照が生まれる。実装を共有する必要が出た場合である。
- 独立 package が3つ以上になる。階層を設ける利点が費用を上回りうる。
- 拡張が独立した製品として成長し、CLI の変更と無関係に更新されるようになる。
- `doc-index.json` の形式が安定し、外部仕様として公開できる状態になる。分離の前提が整う。

### 4.6. vsix の履歴からの削除

行わない。該当 commit は既に `origin/main` へ push 済みで、書き換えると全 commit の SHA が
変わる。個票や result が記録した commit hash が無効になり、worktree の再作成も要る。得られるのは
11.3 KB の削減だけで、費用が便益を上回る。vsix は公開前の成果物で機密情報も含まない。

## 5. 作業内容

| No  | 作業                                | 担当 | 状態 | メモ                                          |
| --- | ----------------------------------- | ---- | ---- | --------------------------------------------- |
| 1   | `.gitignore` へ `*.vsix` を追加する | ARC  | done | package 固有の生成物パスも移動先へ更新した    |
| 2   | 追跡中の vsix を削除する            | ARC  | done | 履歴は書き換えず、現在の追跡対象から削除した  |
| 3   | ルートからのビルド経路を用意する    | ARC  | done | install、build、package の3 script を追加した |
| 4   | 配置の是非を判断して記録する        | ARC  | done | `packages/vscode-specdojo` へ移動した         |
| 5   | typecheck とビルドを確認する        | ARC  | done | ルートの script と typecheck で検証した       |

## 6. 対応結果

- VS Code 拡張を `tools/vscode-specdojo` から `packages/vscode-specdojo` へ移動した。
- ルートに `vscode:install`、`vscode:build`、`vscode:package` の npm script を追加し、独立 package
  の依存インストール、コンパイル、vsix 生成をルートから実行できるようにした。
- 拡張には実行時 npm 依存がないため、vsix 生成では依存を同梱せず、`.vscodeignore` で TypeScript
  ソース、source map、開発用設定を除外する。
- `.gitignore` の package 固有パスを移動先へ更新した。`*.vsix` は引き続きリポジトリ全体で除外し、
  既存の vsix が追跡対象から削除済みであることを確認した。
- `tsconfig.json`、worktree の依存インストールに関する integration test、devcontainer の参照先を
  移動後のパスへ更新した。
- devcontainer は生成済み vsix がある場合だけ自動インストールする。新しい環境では起動時に
  自動ビルドせず、ルートで `npm run vscode:package` を実行するよう案内する。
- 関連する現行文書の拡張パスを移動先へ更新した。過去の event、evidence、trial は実行時点の記録
  として変更していない。
- 残課題はない。Marketplace 公開と機能集約は関連ドキュメントに記載した後続項目で扱う。

受け入れ時に orchestrator が次を確認した。

| 検証                     | 結果                            |
| ------------------------ | ------------------------------- |
| `npm run typecheck`      | 通過                            |
| `npm run vscode:install` | 依存を復旧できる                |
| `npm run vscode:build`   | 通過                            |
| `npm run vscode:package` | vsix を生成（5 files, 5.31 KB） |
| 単体テスト               | 1368 件通過                     |
| vsix の追跡              | 生成後も追跡されない            |

- 追従は4箇所すべて反映されている。`tsconfig.json` の references、統合テスト、
  `.devcontainer/post-start.sh`、`.gitignore` である。
- devcontainer が案内していた存在しない `npm run package` が `npm run vscode:package` へ修正されて
  いる。参照先も移動後のパスになっている。
- npm script は `--prefix` を使うため依存の巻き上げが起きない。モノレポ化しないという決定と
  整合する。
- 統合対象に `node_modules`、`out`、`vsix` の混入はない。ソースと設定の5ファイルのみである。
- `package.json` への script 登録は `agent-config-write` が block したため、orchestrator が差分
  （3行の追加）を確認して適用した。
- 統合後に orchestrator が旧ディレクトリの残骸を `git clean -fdx` で削除した際、移動先の
  `node_modules` も巻き込んで削除した。`npm run vscode:install` で復旧できることを確認しており、
  追加した script が意図どおり機能する裏付けにもなった。

## 7. 関連ドキュメント

- [[prj-0001:pjr-gx9d-vscode-extension-consolidation]]: 集約方針。本項目はその前提。
- [[prj-0001:pjr-0143-vs-code-marketplace]]: 公開前に本項目を済ませる。
