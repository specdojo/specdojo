---
specdojo:
  id: prj-0001:pjr-7gak-docs-lint-dependency-vulnerabilities
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: DEV
  registered_at: "2026-09-30T12:06:40Z"
  completed_at: "2026-09-30T22:01:01Z"
  conclusion: markdownlint-cli を 0.49.1 に上げ、未使用の remark-lint-frontmatter-schema を外した。docs-lint の 9 件のうち 8 件が解消し、js-yaml の moderate 1 件は上流の対応待ち
---

# PJR-7GAK docs-lint の依存の脆弱性への対応

## 1. 概要

docs-lint に残る high 6 件・moderate 3 件（markdownlint-cli 0.48 経由の markdown-it・smol-toml・js-yaml、remark-lint-frontmatter-schema 経由の json-schema-ref-parser・ajv・minimatch・yaml）を、markdownlint-cli 0.49 への更新と上流の対応状況の確認で解消する（v0.3.0）

## 2. 完了条件

- docs-lint（`packages/docs-lint`）の `npm audit --omit=dev --package-lock-only` が報告する 9 件（high 6 件、moderate 3 件）について、脆弱な版を持ち込む依存の経路、修正版の有無、解消に必要な変更を 1 件ずつ調べ、対応結果に表で記録する。
- `markdownlint-cli` を 0.49 以降に上げると解消するものと、その場合に docs-lint の設定・コード・出力に変更が要るかを、変更履歴（CHANGELOG・リリースノート）から確かめて記録する。
- `remark-lint-frontmatter-schema` 経由のもの（`@apidevtools/json-schema-ref-parser`、`ajv`、`minimatch`、`yaml` など）について、新しい版や代替で解消できるか、上流の対応待ちかを記録する。
- `package.json` と `package-lock.json` は agent が変更できない設定のため変更しない。必要な依存の変更（パッケージ名・版の範囲・理由）は result の申し送りに書き、orchestrator が反映して検証する。
- 依存の更新に合わせてコードや設定の変更が必要な場合は、その変更を行い、既存の単体テストが通る。
- 上流の対応待ちで残るものは、`CHANGELOG.md` の v0.3.0 の「既知の問題」に追記されている。

## 3. 作業内容

| No  | 作業                                              | 担当         | 状態 | メモ                       |
| --- | ------------------------------------------------- | ------------ | ---- | -------------------------- |
| 1   | 9 件の経路・修正版・解消方法の調査と記録          | DEV          | done | 対応結果に記録             |
| 2   | 必要なコード・設定の変更と CHANGELOG の既知の問題 | DEV          | done | 変更不要（対応結果を参照） |
| 3   | `package.json`・lockfile の更新と検証             | orchestrator | done | `43dc9ef8` で反映した      |

## 4. 対応結果

### 4.1. 調査の前提

- 対象は `packages/docs-lint` で `npm audit --omit=dev --package-lock-only` を実行した結果の 9 件（high 6 件、moderate 3 件）である（2026-10-01 実行）。
- 直接依存は `markdownlint-cli`（0.48.0）と `remark-lint-frontmatter-schema`（3.15.4）の 2 つで、残る 7 件はいずれもこの 2 つの配下にある。
- ルートの `package.json` にも同じ 2 つの依存（`markdownlint-cli` `^0.48.0`、`remark-lint-frontmatter-schema` `^3.15.4`）がある。

### 4.2. 9 件の経路と解消方法

| パッケージ                            | 深刻度   | lockfile の版 | 経路                                                     | 修正版                | 解消に必要な変更                                             |
| ------------------------------------- | -------- | ------------- | -------------------------------------------------------- | --------------------- | ------------------------------------------------------------ |
| `markdownlint-cli`                    | high     | 0.48.0        | 直接依存                                                 | 0.49.1                | `markdownlint-cli` を `^0.49.1` に上げる                     |
| `js-yaml`                             | high     | 4.1.1         | `markdownlint-cli`（`~4.1.1` 固定）                      | 4.3.2 以上            | `markdownlint-cli` 0.49.1（`js-yaml` `~5.2.1`）へ更新        |
| `smol-toml`                           | high     | 1.6.1         | `markdownlint-cli`（`~1.6.0`）                           | 1.7.1 以上            | `markdownlint-cli` 0.49.1（`smol-toml` `~1.7.0`）へ更新      |
| `markdown-it`                         | moderate | 14.1.1        | `markdownlint-cli`（`~14.1.1`）                          | 14.2.0 以上           | `markdownlint-cli` 0.49.1（`markdown-it` `~14.3.0`）へ更新   |
| `remark-lint-frontmatter-schema`      | high     | 3.15.4        | 直接依存                                                 | なし（3.15.4 が最新） | 依存から削除する（未使用）                                   |
| `@apidevtools/json-schema-ref-parser` | high     | 11.1.0        | `remark-lint-frontmatter-schema`（11.1.0 固定）          | 11.1.0 より後         | `remark-lint-frontmatter-schema` の削除で消える              |
| `minimatch`                           | high     | 9.0.3         | `remark-lint-frontmatter-schema`（9.0.3 固定）           | 9.0.7 以上            | `remark-lint-frontmatter-schema` の削除で消える              |
| `ajv`                                 | moderate | 8.12.0        | `remark-lint-frontmatter-schema`（8.12.0 固定）          | 8.18.0 以上           | `remark-lint-frontmatter-schema` の削除で消える              |
| `yaml`                                | moderate | 2.3.3         | `remark-lint-frontmatter-schema`（2.3.3 固定）が版を決定 | 2.8.3 以上            | 削除後は `unified-engine`（`^2.0.0`）が最新の 2.x を解決する |

- `smol-toml` の `~1.7.0` は脆弱な 1.7.0 も許容するため、lockfile では 1.7.1 以上（現時点の 1.7.x 最新は 1.7.2）に解決されていることを確認する必要がある。
- `markdown-it` の脆弱性は `typographer` 有効時の smartquotes に限られ、markdownlint は `typographer` を使わないため実害は小さいが、更新で解消する。

### 4.3. `markdownlint-cli` 0.49 の変更点と docs-lint への影響

- 変更履歴（<https://github.com/igorshubovych/markdownlint-cli/releases>）によると、0.49.0 は `markdownlint` 0.41.0 への更新（MD022 / MD028 / MD035 / MD042 / MD051 / MD060 の改善、インラインのディレクティブ記法の扱いの削除）と Node 20 の対応終了、0.49.1 は `markdownlint` 0.41.1 への更新（MD029 の改善）と依存の更新である。0.49.1 の `engines` は `node >=22`。
- docs-lint は `engines` が `node >=22.13` のため、Node の要件は影響しない。
- docs-lint は `markdownlint-cli` を `bin/specdojo-docs-lint.js` から CLI として起動するだけで API を使っていないため、コードの変更は不要である。
- 設定（`.markdownlint.yaml`）の書式に破壊的変更はないため、設定の変更も不要である。ただし MD022 などの判定が変わるため、既存文書に新たな指摘が出る可能性がある。更新後に `npm run lint:md` で確認する。

### 4.4. `remark-lint-frontmatter-schema` 経由のものの扱い

- `remark-lint-frontmatter-schema` の最新は 3.15.4（2023-10-15 公開）で、それ以降のリリースがない。依存を完全一致の版で固定しているため、上流の新しい版では解消できない。`npm audit` が示す修正候補の 3.15.3 は古い版への変更で、同じく脆弱な版を固定している。
- docs-lint とリポジトリでは、frontmatter の検証を自前の `packages/docs-lint/src/remark-frontmatter-ajv2020.cjs`（`ajv` 8.20.0 と `ajv-formats` を直接使用）で行っている。`.remarkrc.yaml` の plugins とソースのどこからも `remark-lint-frontmatter-schema` は参照されていない。
- このため代替への置き換えは済んでおり、依存から削除すれば 4 件（`remark-lint-frontmatter-schema` を含めて 5 件）が解消する。上流の対応待ちで残るものはない。

### 4.5. 実施内容と残課題

- コード・設定の変更は不要と判断した。依存の更新で 9 件すべてが解消する見込みのため、`CHANGELOG.md` の v0.3.0 の「既知の問題」への追記は行っていない。
- `package.json` と `package-lock.json` は agent が変更できないため、次の変更を orchestrator が反映して検証する（作業内容の No 3）。
  - `packages/docs-lint/package.json`: `markdownlint-cli` を `^0.49.1` に上げ、`remark-lint-frontmatter-schema` を削除する。
  - ルートの `package.json`: 同じく `markdownlint-cli` を `^0.49.1` に上げ、`remark-lint-frontmatter-schema` を削除する。
  - 両方の lockfile を更新し、`smol-toml` が 1.7.1 以上、`yaml` が 2.8.3 以上に解決されていることと、`npm audit --omit=dev --package-lock-only` が 0 件であることを確認する。
  - `npm run lint:md` と `npm run lint:fm` を実行し、`markdownlint` 0.41 の判定変更で新たな指摘が出た場合は対応する。
- 反映後に脆弱性が残った場合は、`CHANGELOG.md` の v0.3.0 の「既知の問題」へ追記する。

### 4.6. orchestrator による反映と検証（2026-10-01）

- `remark-lint-frontmatter-schema` が `package.json` 以外から参照されていないことを grep で確かめた。
- ルートと `packages/docs-lint` の `package.json` で `markdownlint-cli` を `^0.49.1` に上げ、`remark-lint-frontmatter-schema` を削除した。lockfile は `npm update yaml js-yaml smol-toml` で範囲内の最新にそろえた（`43dc9ef8`）。`smol-toml` は 1.7.2 に解決された。
- ルートの `npm audit --omit=dev` は 0 件になった。docs-lint の `npm audit --omit=dev --package-lock-only` は、9 件のうち 8 件が解消した。
- 調査の見込みと異なり、`markdownlint-cli` 0.49.1 が `js-yaml` を `~5.2.1` に固定するため、`js-yaml` 5.2 系の moderate 1 件（修正版は 5.4.1）が残った。`markdownlint-cli` の最新は 0.49.1 のため上流の対応待ちとし、`CHANGELOG.md` の「既知の問題」に追記した。
- markdownlint 0.41 の判定の変更による新たな指摘はなく、`npm run lint:md`・`npm run lint:fm`・`npm run check`（1865 件）が通過した。
- ルートの開発用の依存に残る 4 件（`ajv-cli` 経由の `fast-json-patch` など）は配布物に入らないため、[[prj-0001:pjr-q3f0-dev-dependencies-major-update]] で扱う。

## 5. 関連ドキュメント

- [[prj-0001:pjr-6tka-deps-in-range-update-dotenv18]]
- [[prj-0001:pjr-xmma-docs-site-puppeteer25-mermaid12]]
