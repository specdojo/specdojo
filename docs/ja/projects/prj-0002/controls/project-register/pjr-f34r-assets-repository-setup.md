---
specdojo:
  id: prj-0002:pjr-f34r-assets-repository-setup
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-12T09:49:11Z"
  due_on: "2026-10-31"
---

# PJR-F34R specdojo-assets の骨組みと書き出しの仕組みを作る

## 1. 概要

specdojo-assets に README.md のディレクトリ体系どおりの骨組み（assets/・exports.yaml・BRAND.md・templates/）と、exports.yaml に従って原本を specdojo-lp の src/assets/ へそのまま書き出す scripts/export.ts を作り、暫定マスコットを見本に確かめる

## 2. 完了条件

最初の commit、prj-0002 の `repos` への追加、Node.js の環境の用意は達成済みである（作業内容 No 1・No 2）。本節には、残りの骨組みと書き出しの仕組みの条件だけを置く。書き出し先と書き出しの方法は、[[prj-0002:pjr-hktj-assets-repository]] の `追記（2026-10-16、書き出し先と書き出しの方法）` に従う。

- `specdojo-assets` に、`README.md` のディレクトリ体系どおりに次がある。
  - `assets/` と、種類のディレクトリ（`characters/`・`logos/`・`illustrations/`・`icons/`・`social/`）。空のディレクトリには `.gitkeep` を置く。
  - `templates/asset.yaml`: アセットごとのメタ情報（名前、原本ごとの作り方（AI での生成か手描きか）・作者・ライセンス）の雛形。
  - `exports.yaml`: 書き出し先のリポジトリ（`targets`）と、書き出すもの（`exports`）の定義。`targets` の `specdojo-lp` は `../specdojo-lp/src/assets` を指す。`exports` の各項目は `source`・`target`・`name` だけを持ち、形式と幅の項目を持たない。
  - `BRAND.md`: ブランド全体の規則（色・余白・使ってよい場面・ライセンスの方針）の枠。色は `specdojo-lp` の `src/styles/global.css` の Material 3 のテーマを参照してよい。決まっていない規則は `_TODO_` のまま残し、推測で埋めない。
- 書き出しのスクリプト `scripts/export.ts` がある。
  - `node scripts/export.ts` で実行でき、Node.js の標準の機能と `yaml` パッケージだけを使う。
  - `exports.yaml` を読み、各項目の原本を、形式も大きさも変えずに `<target のパス>/<name>.<原本の拡張子>` へコピーする。書き出し先のディレクトリがなければ作る。
  - 原本がない、`target` が `targets` にない、`name` が書き出し先の外を指す（`..` を含むなど）場合は、対象の項目と理由を示して失敗する。項目の処理の順は `exports.yaml` の順とする。
- 見本で書き出しを確かめている。
  - `specdojo-lp` の `src/assets/mascot/dojo-otter.webp`（暫定のマスコット）を、`assets/characters/dojo-otter/source/dojo-otter-temporary.webp` に原本として置く。
  - `assets/characters/dojo-otter/asset.yaml` を `templates/asset.yaml` から作る。暫定画像であることと、`specdojo-lp` の `src/assets/mascot/dojo-otter.webp`（PJR-XEJ4 で置いたもの）から取り込んだことを書く。作り方・作者・ライセンスのうち分からないものは `_TODO_` のまま残し、推測で埋めない。
  - `exports.yaml` に、この原本を `name: mascot/dojo-otter` で `specdojo-lp` へ書き出す項目を載せる。
  - `node scripts/export.ts` を実行し、`specdojo-lp` の `src/assets/mascot/dojo-otter.webp` が元のファイルとバイト単位で同じになり、`specdojo-lp` に差分が出ないことを確かめている。
- `README.md` の `書き出し` の説明と例が、`exports.yaml` と `scripts/export.ts` の実際の形と一致している（`public/assets`、`formats`、`widths`、`scripts/export.mjs` の記述が残っていない）。開発のコマンド（`npm ci`、`node scripts/export.ts`、`npm run format:check`・`lint:md`・`lint:ts`・`typecheck`）も案内している。
- `specdojo-assets` で `npm run format:check`・`npm run lint:md`・`npm run lint:ts`・`npm run typecheck` が通る。executor の作業環境で実行できない検査は、evidence の `validations` に理由を記録し、orchestrator が sandbox の外で確かめる。
- `package.json`・`package-lock.json`・`tsconfig.json`・`eslint.config.js`・`.markdownlint-cli2.jsonc` は変えない。変更が要る場合は、作業を止めて result に理由を書く。
- 変更は `specdojo-assets` の `develop` へ統合される（[[prj-0002:pjr-8v7t-product-repo-develop-branch]]）。`git push` は行わない。

## 3. 作業内容

| No  | 作業                                                   | 担当         | 状態 | メモ                                                                                                                 |
| --- | ------------------------------------------------------ | ------------ | ---- | -------------------------------------------------------------------------------------------------------------------- |
| 1   | 最初の commit を作り、`repos` に加える                 | orchestrator | done | df10f80（specdojo-assets）、56813ee21（repos）                                                                       |
| 2   | Node.js の環境（TypeScript・Markdown・YAML）を用意する | orchestrator | done | `66ad5b5`（`main` へ利用者が `8792813` で取り込み）。`package.json` は exec の保護対象のため orchestrator が用意した |
| 3   | 骨組みと書き出しのスクリプトを作り、見本で確かめる     | DEV          | open | exec で `develop` へ統合する                                                                                         |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0002:pjr-hktj-assets-repository]]: 派生元の決定。ディレクトリ体系の追記を含む。
- [[prj-0002:pjr-pevv-mascot-character-source]]: この骨組みに原本を置く項目。
