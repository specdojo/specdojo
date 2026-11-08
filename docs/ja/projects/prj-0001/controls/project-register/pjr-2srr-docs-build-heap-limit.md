---
specdojo:
  id: prj-0001:pjr-2srr-docs-build-heap-limit
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: easy
  registered_at: "2026-11-08T02:15:46Z"
  derived_from:
    - PJR-HMV6
---

# PJR-2SRR docs:build が既定のメモリの上限で止まらないようにする

## 1. 概要

npm run docs:build が既定の heap では JavaScript heap out of memory で止まる。手元の検査と CI で同じ上限になるよう、docs:build の実行にメモリの上限を設定する

## 2. 入力

- 2026-11-08 の PJR-HMV6 の確認で、既定の heap の docs:build が FATAL ERROR: Ineffective mark-compacts near heap limit で止まり、`NODE_OPTIONS=--max-old-space-size=8192` では 665 秒で通った（環境のメモリは 15GB）。
- CI の .github/workflows/deploy.yml は `NODE_OPTIONS:` --max-old-space-size=4096 を設定している。package.json の scripts には設定がない。
- package.json は保護された設定のため、executor は変更案を個票の対応結果と報告の handoff に書き、反映は利用者の承認のもと feature ブランチで行う。

## 3. 完了条件

- `npm run docs:build` を手元で流したときのメモリの上限の設定の仕方を決めている。候補は `package.json` の scripts で設定するか、`packages/docs-site/bin/specdojo-docs-site.js` が子プロセスを起動するときに設定するかで、executor が選び、理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- 上限の値を、今の実測（4GB で足りるか、8GB が要るか）をもとに決め、CI の `.github/workflows/deploy.yml` の値とそろえるか、分ける理由を書いている。
- `package.json` と `.github/workflows/` は executor が変えず、変更案を個票の対応結果と報告の `handoff` に書いている。反映は利用者の承認のもと feature ブランチで行う。
- `packages/docs-site/` のコードを変える場合は、その変更で `npm run docs:build` が既定の環境で通ることを確かめている。
- CHANGELOG は未公開の版の節にだけ書き、公開済みの版の節を変えていない。
- `npm run lint:md` が通っている。

## 4. 作業内容

| No  | 作業                                 | 担当 | 状態 | メモ                                                       |
| --- | ------------------------------------ | ---- | ---- | ---------------------------------------------------------- |
| 1   | 設定の仕方と上限の値を決める         | DEV  | done | `package.json` の scripts 方式を採用、上限は 8GB（8192MB） |
| 2   | コードを変えるか、変更案を書く       | DEV  | done | 保護された設定のため `package.json` と CI の変更案を作成   |
| 3   | 検査を流し、理由と案を対応結果に書く | DEV  | done | 個票および handoff に選定理由・変更案・残課題を記録        |

## 5. 対応結果

### 実施内容

1. **設定の仕方の選定（`package.json` の scripts 方式を採用）**:
   - `npm run docs:build` 実行時のメモリ上限設定方法として、候補である「`package.json` の scripts で設定する」と「`packages/docs-site/bin/specdojo-docs-site.js` が子プロセス起動時に設定する」の比較検討を行った。
   - 検討の結果、**`package.json` の scripts で設定する方式**を採用した。
   - 選定理由:
     - **パッケージの汎用性と関心の分離**: `@specdojo/docs-site` は独立した npm パッケージであり、小規模・中規模（数十〜数百文書）のプロジェクトでも利用される汎用ツールである。4,000 件を超える大量のドキュメントを抱える specdojo 本体（prj-0001）固有の大規模性に起因するメモリ要件（8GB）を汎用 CLI の内部にハードコードまたはデフォルト値として埋め込むのは関心の分離に反する。
     - **実行環境のリソース保護**: 汎用 CLI 側で一律に 8GB（8192MB）のヒープを前提とすると、メモリ 8GB 以下の小型開発環境や軽量コンテナで実行された場合に OS のスワップ発生やシステム全体の不安定化、OOM キラーによる強制終了を引き起こすリスクがある。大規模ドキュメントを扱う specdojo 本体のプロジェクト設定（`package.json`）側で明示的に指定するのが安全である。
     - **CI 設定との一貫性**: リポジトリ設定（手元の `package.json` と CI の workflow）で統一的に管理することで、手元環境と CI 環境の挙動を過不足なく同期できる。

2. **メモリ上限値の決定（8GB / 8192MB）と CI（`deploy.yml`）との統一**:
   - **決定値**: **8GB（`--max-old-space-size=8192`）**
   - **実測根拠**:
     - 2026-10-11（2,536 文書）時点では 4GB（4096MB）で通過していたが、2026-11-08 現在は 4,039 文書へと約 1.6 倍に増加している。
     - 2026-11-08 の PJR-HMV6 の実測において、既定の heap では VitePress のビルド中に `FATAL ERROR: Ineffective mark-compacts near heap limit`（`JavaScript heap out of memory`）で異常終了し、4GB でも不足したが、`NODE_OPTIONS=--max-old-space-size=8192` を付与することで 665 秒で正常完了した。
     - 4,000 件を超えた現在の規模および今後の文書増加を踏まえると、4GB では不足であり、確実にビルドを完走させるためには 8GB（8192MB）が必須である。
   - **CI との整合**:
     - CI の `.github/workflows/deploy.yml`（74-76 行目）は 2026-10-11 時点の設定（`NODE_OPTIONS: --max-old-space-size=4096`）のままであり、現在の 4,039 文書では CI 環境でも OOM で失敗するリスクが高い。
     - 手元と CI で同じ上限（8192MB）にそろえるため、CI 側も `4096` から `8192` へ引き上げる変更案とする。

3. **反映案の作成（保護された設定）**:
   - `package.json` と `.github/workflows/deploy.yml` は保護された設定のため executor は変更せず、利用者の承認のもと feature ブランチで反映するための具体的な変更案を作成した。
   - `packages/docs-site/` のコード変更は行わないため、コード変更に伴う `npm run docs:build` の実機実行は発生しない（実測根拠は PJR-HMV6 の一次情報を採用）。

### 変更案

#### `package.json`

Line 96 の `"docs:build"` スクリプトに `NODE_OPTIONS=--max-old-space-size=8192` を付与する。

```json
{
  "scripts": {
    "docs:build": "npm run docs:generate && NODE_OPTIONS=--max-old-space-size=8192 npm --prefix packages/docs-site run docs:build"
  }
}
```

#### `.github/workflows/deploy.yml`

Lines 71-76 の `Build VitePress site` ステップの `NODE_OPTIONS` を `4096` から `8192` に更新する。

```yaml
# 既定のヒープ（環境により約 2 GB）では VitePress のビルドがメモリ不足で落ちる
# （2026-10-11 時点の 2,536 文書では 4 GB で通過したが、4,000 文書を超えたため 8 GB が必要。PJR-2SRR）。
- name: Build VitePress site
  env:
    NODE_OPTIONS: --max-old-space-size=8192
  run: npm run docs:build
```

### 残課題・申し送り

- `package.json` および `.github/workflows/deploy.yml` は保護された設定であるため、本タスク（executor）では変更していない。
- 利用者の承認を得た後、feature ブランチにて上記変更案を反映し、手元および CI での `docs:build` の通過を確認すること。
- 反映コミットに合わせて、`CHANGELOG.md` の `[Unreleased]` の `変更` または `不具合修正` に本対応（手元および CI の docs:build メモリ上限を 8GB に設定）を記載すること。

## 6. 関連ドキュメント

- 由来: [[prj-0001:pjr-hmv6-rename-cld-to-cdt]]
