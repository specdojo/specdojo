---
specdojo:
  id: prj-0002:pjr-hepk-lp-content
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  owner: UX
  registered_at: "2026-10-11T06:37:19Z"
  block_reason: "agent exited with non-zero code: executor validation failed or not run: specdojo catalog validate, npm --prefix specdojo-lp run build"
---

# PJR-HEPK ランディングページの構成と原稿を作る

## 1. 概要

すぐに register を使い始められるよう、やさしく解説する構成と原稿を作り、詳細は VitePress のドキュメントへ案内する

読み手は SpecDojo を初めて知る開発者とし、プロジェクトを管理する立場の人は副次的な読み手とする。LP だけで「導入して最初の項目を起票し、一覧を作る」までを体験できるようにし、その先（decision から change-request までの流れ）は Quick Start（<https://specdojo.github.io/specdojo/ja/specdojo/guides/quick-start-guide.html>）へ案内する。

_ASSUMPTION_: LP の言語は、ドキュメントサイトに合わせて日本語のみとする。

## 2. 完了条件

- LP の構成（セクションの並びと各セクションの目的）が、本個票の対応結果に記載されている。
- 原稿が `specdojo-lp:src/pages/index.astro` に反映されている。原稿は少なくとも次を含む。
  - SpecDojo が何を解決するか。
  - register の考え方（issue / decision / todo を起票して記録を集める）。
  - 導入から `register build` までの手順と、詳しい文書への案内。
- 原稿に載せるコマンド（`npx specdojo config init` → `register scaffold` → `register add` → `register build`）の引数が、CLI の `--help` と command-reference に一致している。
- 詳しい文書へのリンクは、公開中のドキュメントサイト（<https://specdojo.github.io/specdojo/ja/>）の実在するページを指している。
- マスコット（PJR-FSMC）の配置場所は仮の枠のみとし、デザインは PJR-CM5W で定義したテーマの class を使う。
- `specdojo-lp` で `npm run build` が成功する。agent の sandbox では npm を実行できないため、executor は evidence の `validations` でこの検証を `requires_human` と記録し、ビルドは orchestrator が sandbox の外で確認する。
- prj-0002 は `catalog_path` を設定していないため、`specdojo catalog validate` は実行しない（evidence にも記録しない）。
- Cloudflare への配置とマスコットの絵は、本項目に含めない。

## 3. 作業内容

| No  | 作業                                           | 担当 | 状態 | メモ                                                                     |
| --- | ---------------------------------------------- | ---- | ---- | ------------------------------------------------------------------------ |
| 1   | LP の構成を決め、個票に記載する                | UX   | done | -                                                                        |
| 2   | 原稿を書き、コマンドとリンクが正しいか確認する | UX   | done | -                                                                        |
| 3   | `index.astro` に原稿を反映し、ビルドを確認する | DEV  | open | 反映済み。`npm run build` は agent の sandbox で実行が承認されず、未確認 |

## 4. 対応結果

### 4.1. LP の構成

LP は 1 ページで、上から次の順に並べる。

| No  | セクション                               | 目的                                                                                                                               |
| --- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 1   | ヘッダー                                 | サービス名と、ドキュメントサイトへの入口を常に見せる。                                                                             |
| 2   | ヒーロー（決めて、書いて、鍛え続ける。） | SpecDojo を一文で伝え、「5 つの手順で始める」と Quick Start への導線を置く。右側にマスコットの仮の枠を置く。                       |
| 3   | こんなことはありませんか                 | 判断が散らばる・「なぜ」をたどれない・AI に前提を渡せない、の 3 つの困りごとから、SpecDojo が何を解決するかを示す。                |
| 4   | register の考え方                        | issue / decision / todo を起票し、個票（Markdown）を正本として記録を集め、一覧は個票から生成されることを説明する。                 |
| 5   | 5 つの手順で始める                       | 導入から `config init`、`register scaffold`、`register add`、`register build` までを、コマンドつきで LP だけで体験させる。         |
| 6   | 次の一歩                                 | decision から change-request までの流れを Quick Start へ、詳細を登録簿運用ガイド・コマンドリファレンス・全体概要ガイドへ案内する。 |
| 7   | フッター                                 | 著作権表示とドキュメントサイトへのリンクを置く。                                                                                   |

### 4.2. 実施内容

- 上記の構成で原稿を書き、`specdojo-lp:src/pages/index.astro` の仮ページを差し替えた。
- 原稿のコマンドは次のとおりで、CLI の `--help` と [[specdojo:command-reference]] の `init / config / project` と `register` の表に一致することを確認した。
  - `npx specdojo config init`（引数なし。`prj-0001` の最小設定を作る）
  - `npx specdojo register scaffold --project prj-0001`
  - `npx specdojo register add --project prj-0001 --type issue --title "初期スコープが決まっていない"`
  - `npx specdojo register build --project prj-0001`
- 導入手順（`mkdir` から `npm install --save-dev specdojo` まで）と、登録簿・一覧の配置先は [[specdojo:quick-start-guide]] に合わせた。登録簿の配置先は `config init` の雛形（`project_register_path: controls/project-register`）とも一致する。
- 詳しい文書へのリンクは、公開中のドキュメントサイトで次の 5 ページが表示されることを確認した。
  - <https://specdojo.github.io/specdojo/ja/>
  - <https://specdojo.github.io/specdojo/ja/specdojo/guides/quick-start-guide.html>
  - <https://specdojo.github.io/specdojo/ja/specdojo/guides/register-operation-guide.html>
  - <https://specdojo.github.io/specdojo/ja/specdojo/references/command-reference.html>
  - <https://specdojo.github.io/specdojo/ja/specdojo/guides/specdojo-overview-guide.html>
- マスコットは、ヒーロー右側に `data-placeholder="mascot"` の点線の枠だけを置いた。色・文字・角丸・影は PJR-CM5W の `global.css` で定義したテーマの class（`bg-primary-container`、`text-headline-medium`、`rounded-extra-large`、`shadow-elevation-1` など）だけを使った。

### 4.3. 残課題

- `specdojo-lp` での `npm run build` の成功を確認する（agent の sandbox では実行が承認されなかった）。
- Cloudflare への配置とマスコットの絵は本項目に含めない（マスコットは PJR-FSMC）。

## 5. 関連ドキュメント

- [[prj-0002:pjr-fv3w-lp-tech-stack]]: 技術スタックの決定。
- [[prj-0002:pjr-cm5w-lp-initial-setup]]: LP の初期構成とテーマ。
- [[prj-0002:pjr-fsmc-lp-mascot]]: マスコット。配置場所の仮の枠を本項目で用意する。
