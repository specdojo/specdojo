---
specdojo:
  id: prj-0002:pjr-cm5w-lp-initial-setup
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: DEV
  registered_at: "2026-10-11T10:25:32Z"
  completed_at: "2026-10-11T14:33:28Z"
  conclusion: specdojo-lp に Astro 7 と Tailwind CSS 4 の静的構成と Material 3 のテーマ、仮のトップページを用意し、ビルドと表示を確認した
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
| 3   | 仮のトップページと README を用意し、ビルドを確認する    | DEV  | done | ビルドは orchestrator が統合後の `main` で確認した       |

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

### 4.2. 統合と確認

executor の成果のうち、次の 2 つは runner が commit できないため、orchestrator が `specdojo-lp` の `main` へ適用した。いずれも executor が作った内容から変えていない。

- `package.json` は agent の保護対象のため、orchestrator が適用し、`npm install` で `package-lock.json` を生成した（`specdojo-lp` の c005e5f、merge 49af08d）。
- 最上位の新規ファイル `.gitignore`・`README.md`・`astro.config.mjs`・`tsconfig.json` は register 由来の commit 範囲の外にあるため、orchestrator が適用した（`specdojo-lp` の 137bf89、merge e4d9889）。

その後、統合を再開し、runner が残りの成果を統合した（`specdojo-lp` の 9d0f4f3）。統合前の親検証 7 種はすべて passed だった。

統合後の `specdojo-lp` の `main` で `npm ci` と `npm run build` を実行し、`dist/index.html` が出力されることを確認した。生成した CSS には Material 3 の色の変数（`--color-primary` など）が含まれ、ページは `bg-surface-container`・`text-title-large` などのテーマの class を使っている。仮のトップページは `npm run preview` で利用者が表示を確認した（2026-10-11）。

### 4.3. 残課題

- 色はベースライン配色の仮の値である。ブランドの基調色が決まったら、Material Color Utilities で生成した値に差し替える。ダークテーマは未定義である。
- Cloudflare への配置、本番の原稿（PJR-HEPK）、マスコット（PJR-FSMC）は本項目に含めていない。

## 5. 関連ドキュメント

- [[prj-0002:pjr-fv3w-lp-tech-stack]]: 技術スタックの決定。
- [[prj-0002:pjr-g4qn-lp-tech-stack-evaluation]]: 比較評価と根拠。
