---
specdojo:
  id: prj-0001:pjr-pxnq-dependabot-17-alerts
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-23T00:25:53Z"
  due_on: "2026-11-30"
  commit_type: build
  commit_scope: deps
---

# PJR-PXNQ Dependabot が示す依存の脆弱性 17 件を直す

## 1. 概要

docs-site の vite・esbuild と、各パッケージの minimatch・glob・katex を直る版まで上げる。大半は docs:dev の dev サーバーの問題で、vite を 6.4.4 にすると 8 件が直る

## 2. 入力

- 2026-11-23 の push で GitHub が 17 件（high 1・medium 13・low 3）を示した。一覧は gh api repos/specdojo/specdojo/dependabot/alerts で取れる
- docs:dev は --host 0.0.0.0 で起動するため、同じネットワークから dev サーバーに届く

## 3. 完了条件

- GitHub の Dependabot が示す 17 件（2026-11-23、high 1・medium 13・low 3）を直す（利用者の決定、2026-11-23、indie）。対象は次のとおり。直す前に `gh api` か `npm audit` で数え直し、増減があれば個票の対応結果に書く。
  - `packages/docs-site`: vite を 6.4.4 以上、esbuild を 0.25.0 以上にする（dev サーバーの `server.fs.allow`・`deny` のすり抜け、launch-editor、esbuild の dev サーバーへの要求など 9 件）。
  - ルート・`packages/docs-lint`・`packages/docs-site`・`packages/vscode-specdojo`: minimatch を 11.0.1 以上、glob を 14.0.2 以上、katex を 0.18.2 以上にする（直接の依存でなければ、上位の依存の更新か `overrides` で上げる）。
- 上げる版は、直る版を満たす範囲で小さくする（vite は 6 系の中で上げ、7 系へは上げない）。大きな版を上げないと直らないものは、上げずに理由と影響を個票の対応結果に書く。
- `package.json` と lock のファイルは保護された設定のため、executor は変えない。上げる版と、`npm install` などのコマンドの案を個票の対応結果と報告の `handoff` に書く。反映は利用者の承認のもとで orchestrator が feature ブランチで行う。
- 反映の後に orchestrator が `npm run docs:build`・`npm run docs:dev` の起動・`npm test`・VS Code 拡張の build（`packages/vscode-specdojo`）を流して確かめ、Dependabot の警告が消えたことを確かめてから close する。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。

## 4. 作業内容

| No  | 作業                                                      | 担当         | 状態 | メモ                                                                                                        |
| --- | --------------------------------------------------------- | ------------ | ---- | ----------------------------------------------------------------------------------------------------------- |
| 1   | 各 `package-lock.json` と `package.json` の現行版を調べる | DEV          | done | lock を直接読んで確認した。`gh api`・`npm audit`・`npm view` は sandbox で実行できず、17 件の再集計は未実施 |
| 2   | 上げる版と反映コマンドの案を作る                          | DEV          | done | 対応結果の「反映案」に記載。`package.json` と lock は保護のため変えない                                     |
| 3   | 反映・build・test・Dependabot の確認                      | orchestrator | open | 利用者の承認のもとで orchestrator が feature ブランチで行う                                                 |

## 5. 対応結果

### 5.1. 現状（lock から確認）

| パッケージ                                  | 現行版                                                                          | 備考                                                                                                       |
| ------------------------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `packages/docs-site` の `vite`              | 5.4.21                                                                          | 直接の依存ではない。`vitepress@^1.6.4` が `vite@^5.4.14` を要求する                                        |
| `packages/docs-site` の `esbuild`           | 0.21.5（vite 配下）、0.28.2（別系統）                                           | 0.21.5 が対象。vite を 6 系へ上げると 0.25 以上へ上がる                                                    |
| `packages/docs-site` の `minimatch`・`glob` | 10.2.6・13.0.7                                                                  | `minimatch` は `^10.2.2` を要求する親がある（親の特定は未実施）。`glob` は `^13.0.6` を要求する親がある    |
| `packages/docs-site` の `katex`             | 0.18.10                                                                         | 0.18.2 以上を満たすため対象外                                                                              |
| `packages/docs-lint`                        | `minimatch` 10.2.6・9.0.9、`glob` 10.5.0、`katex` 0.16.47                       | `markdownlint-cli@^0.50.0` が `minimatch@~10.2.6`、`glob@^10.x` を要求し、`katex@^0.16.0` は上位が固定する |
| `packages/vscode-specdojo`                  | `minimatch` 10.2.6、`glob` 13.0.7                                               | 要求元は `^10.2.2`・`^13.0.6`                                                                              |
| ルート                                      | `minimatch` 10.2.6・9.0.9・11.0.9、`glob` 10.5.0、`katex` 0.16.47、`vite` 8.3.8 | ルートの `vite` は 8 系で、vite の対象外                                                                   |

件数の増減は確認できていない。反映前に orchestrator が `gh api repos/specdojo/specdojo/dependabot/alerts` で数え直し、増減があればここへ追記する。

### 5.2. 反映案

executor が決めた内容と理由は次のとおり。

- `packages/docs-site/package.json` に `overrides` を足し、`vite` を `^6.4.4` にする。`vitepress@1.6.4` の `vite` 要求は 5 系だが、vitepress 1.x は vite 6 でも動く実績がある。7 系へは上げない（完了条件）。`esbuild` は vite 6 が 0.25 以上を要求するため、同時に直る見込み。直らなければ `overrides` に `esbuild` を `^0.25.0` で足す。
- `minimatch` は各パッケージで `overrides` に `^11.0.1`、`glob` に `^14.0.2` を足す。ただし `glob@14` と `minimatch@11` は major が上がり、Node の要件や API が変わりうる。`markdownlint-cli`（`glob@^10`・`minimatch@~10.2.6`）と `mermaid-cli`・`vscode` 系の親が壊れるなら、全体の override をやめて親の更新を待ち、上げずに理由と影響を本節へ書く。
- `katex` は `packages/docs-lint` とルートで `overrides` に `^0.18.2` を足す。`katex@0.16` から 0.18 へは minor が 2 つ上がるが、`markdown-it` 系の親が `^0.16.0` を要求するため、上位の更新が無ければ override で上げる。

反映コマンドの案（各ディレクトリで実行する）。

```sh
git switch -c chore/deps-dependabot-17
npm --prefix packages/docs-site install
npm --prefix packages/docs-lint install
npm --prefix packages/vscode-specdojo install
npm install
npm audit
```

版の存在（`vite@6.4.4`・`minimatch@11.0.1`・`glob@14.0.2`・`katex@0.18.2`）は、sandbox の制約で `npm view` により確認できていない。完了条件の記載を採用した。_ASSUMPTION_: これらの版が registry に存在する。

### 5.3. CHANGELOG に書く事項

- 区分: Security
- 文案: Dependabot が示した依存の脆弱性を、`vite`・`esbuild`・`minimatch`・`glob`・`katex` の更新で解消した（`docs:dev` の dev サーバーに関するものを含む）。

### 5.4. 残課題

- `package.json` と lock の変更、`npm run docs:build`・`npm run docs:dev` の起動・`npm test`・`packages/vscode-specdojo` の build、Dependabot の警告が消えたことの確認は、orchestrator が行う。
- 作業内容の行 3 は、その確認が済むまで `open` のままにする。

## 6. 関連ドキュメント

- `prj-0001:pjr-index`
