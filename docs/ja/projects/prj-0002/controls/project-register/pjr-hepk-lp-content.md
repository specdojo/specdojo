---
specdojo:
  id: prj-0002:pjr-hepk-lp-content
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: UX
  registered_at: "2026-10-11T06:37:19Z"
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
- `specdojo-lp` で `npm run build` が成功する。
- Cloudflare への配置とマスコットの絵は、本項目に含めない。

## 3. 作業内容

| No  | 作業                                           | 担当 | 状態 | メモ |
| --- | ---------------------------------------------- | ---- | ---- | ---- |
| 1   | LP の構成を決め、個票に記載する                | UX   | open | -    |
| 2   | 原稿を書き、コマンドとリンクが正しいか確認する | UX   | open | -    |
| 3   | `index.astro` に原稿を反映し、ビルドを確認する | DEV  | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0002:pjr-fv3w-lp-tech-stack]]: 技術スタックの決定。
- [[prj-0002:pjr-cm5w-lp-initial-setup]]: LP の初期構成とテーマ。
- [[prj-0002:pjr-fsmc-lp-mascot]]: マスコット。配置場所の仮の枠を本項目で用意する。
