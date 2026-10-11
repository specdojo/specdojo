---
specdojo:
  id: prj-0002:pjr-cm5w-lp-initial-setup
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: todo
  item_status: waiting
  priority: high
  owner: DEV
  registered_at: "2026-10-11T10:25:32Z"
  block_reason: "integrate failed: specdojo-lp: pre-integration check failed (no repository was integrated in this attempt): specdojo-lp: uncommitted changes outside the commit scope: specdojo-lp:.gitignore, specdojo-…"
---

# PJR-CM5W specdojo-lp に Astro と Tailwind CSS の初期構成を作る

## 1. 概要

PJR-FV3W の決定に従い、specdojo-lp に静的出力の Astro と Tailwind CSS、Material 3 の指針を表すテーマ、仮のトップページを用意する

## 2. 完了条件

- プロダクトリポジトリ `specdojo-lp` に、静的出力の Astro プロジェクトと Tailwind CSS が導入されている。パッケージ管理は npm とする。
- Material 3 の色の役割（primary・surface など）、文字の大きさの段階、角丸、影の段階が Tailwind CSS のテーマとして定義されている。
- 仮のトップページが 1 枚あり、テーマの色と文字の段階を使っている。
- `specdojo-lp` で `npm run build` を実行すると、静的な HTML が出力される。
- `specdojo-lp` の README に、開発とビルドの手順が書かれている。
- Cloudflare への配置、本番の原稿（PJR-HEPK）、マスコット（PJR-FSMC）は本項目に含めない。

## 3. 作業内容

| No  | 作業                                                    | 担当 | 状態 | メモ                                                     |
| --- | ------------------------------------------------------- | ---- | ---- | -------------------------------------------------------- |
| 1   | Astro（静的出力）と Tailwind CSS を導入する             | DEV  | done | 構成ファイルを作成。`package-lock.json` は統合先から取込 |
| 2   | Material 3 の指針を Tailwind CSS のテーマとして定義する | DEV  | done | `src/styles/global.css` の `@theme` に定義               |
| 3   | 仮のトップページと README を用意し、ビルドを確認する    | DEV  | open | ページと README は作成済み。`npm run build` の確認が未了 |

## 4. 対応結果

### 4.1. 実施内容

プロダクトリポジトリ `specdojo-lp` に、Astro と Tailwind CSS の初期構成を作成した。版は 2026-10-11 時点の npm の最新版に合わせ、Astro 7.3.8、Tailwind CSS 4.3.3、`@tailwindcss/vite` 4.3.3 とした。パッケージ管理は npm とする。

| ファイル                                   | 内容                                                                                         |
| ------------------------------------------ | -------------------------------------------------------------------------------------------- |
| `specdojo-lp:package.json`                 | `dev`・`build`・`preview` の script と依存を定義。Node.js 22.12.0 以上を要求                 |
| `specdojo-lp:astro.config.mjs`             | `output: "static"` で静的出力に固定し、`@tailwindcss/vite` を Vite のプラグインとして登録    |
| `specdojo-lp:tsconfig.json`                | `astro/tsconfigs/strict` を継承                                                              |
| `specdojo-lp:.gitignore`                   | `dist/`・`.astro/`・`node_modules/`・`.env` などを除外                                       |
| `specdojo-lp:src/styles/global.css`        | Tailwind CSS の読み込みと、Material 3 の色の役割・文字の段階・角丸・影の段階の `@theme` 定義 |
| `specdojo-lp:src/layouts/BaseLayout.astro` | 共通の HTML の骨組み。`global.css` を読み込む                                                |
| `specdojo-lp:src/pages/index.astro`        | 仮のトップページ。テーマの色の役割と文字の段階、角丸、影の段階を使う                         |
| `specdojo-lp:README.md`                    | 必要な環境、開発とビルドの手順、構成、テーマの使い方                                         |

テーマの内容は次のとおり。

- 色の役割: primary・secondary・tertiary・error とその container・on 系、background、surface と surface-container の 5 段階、surface-variant、inverse、outline、scrim、shadow。値は Material 3 のベースライン配色（ライト）を仮に置いた。
- 文字の段階: display・headline・title・body・label の各 large・medium・small。大きさ・行の高さ・字間・太さを Material 3 の type scale に合わせた。
- 角丸: extra-small（4px）・small（8px）・medium（12px）・large（16px）・extra-large（28px）。full は Tailwind CSS 標準の `rounded-full` を使う。
- 影の段階: elevation level 1 から 5 を `shadow-elevation-1` から `shadow-elevation-5` として定義した。

### 4.2. 残課題

- `specdojo-lp:package.json` は保護対象の設定ファイルのため、agent ではなく人が適用する。再開時点では `package.json` と `package-lock.json`（lockfileVersion 3）が統合先からの取り込みで作業ツリーにあり、依存の内容は Astro 7.3.8、Tailwind CSS 4.3.3、`@tailwindcss/vite` 4.3.3 で一致している。
- 作業環境の sandbox では npm を実行できないため、`npm ci` と `npm run build` は未実行である。`specdojo-lp` で両方を実行し、`dist/index.html` が出力されることを人が確認する必要がある。
- 色はベースライン配色の仮の値である。ブランドの基調色が決まったら、Material Color Utilities で生成した値に差し替える。ダークテーマは未定義である。
- Cloudflare への配置、本番の原稿（PJR-HEPK）、マスコット（PJR-FSMC）は本項目に含めていない。

## 5. 関連ドキュメント

- [[prj-0002:pjr-fv3w-lp-tech-stack]]: 技術スタックの決定。
- [[prj-0002:pjr-g4qn-lp-tech-stack-evaluation]]: 比較評価と根拠。
