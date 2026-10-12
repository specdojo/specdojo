---
specdojo:
  id: prj-0002:pjr-7wg4-lp-split-components
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-10-12T07:21:38Z"
  due_on: "2026-10-31"
---

# PJR-7WG4 LP の index.astro を節ごとのコンポーネントに分ける

## 1. 概要

887 行の index.astro を、節ごとのコンポーネント（Hero・Problems・RegisterTypes・ToolFit・GetStarted・NextSteps・Roadmap）とヘッダー・フッター・Tabs に分け、index.astro は節を並べるだけにする。出力される HTML は変えない

## 2. 完了条件

- `specdojo-lp` の `src/` が次の構成になっている。
  - `components/SiteHeader.astro`、`components/SiteFooter.astro`
  - `components/sections/` に `Hero.astro`・`Problems.astro`・`RegisterTypes.astro`・`ToolFit.astro`・`GetStarted.astro`・`NextSteps.astro`・`Roadmap.astro`
  - `components/Tabs.astro`（「5 つの手順で始める」のタブの切り替えと、そのインラインの script）
  - `lib/links.ts`（複数の節で使うドキュメントサイトの URL）
- `pages/index.astro` は、`BaseLayout` の中でヘッダー・7 つの節・フッターを並べるだけになっている。
- 各節のデータ（困りごと、使い分けの表、register の種類、手順、マトリクスの文言など）は、その節のコンポーネントの frontmatter に置く。型（`type`）も、使う節のコンポーネントに置く。
- カードや表の共通部品は作らない。部品にするのは Tabs だけとする。
- 出力される HTML を変えない。分割前（`specdojo-lp` の 099292f）と分割後の `dist/index.html` が、空白の差を除いて一致する。orchestrator が sandbox の外でビルドして比べる。
- タブは、分割前と同じく `role="tablist"`・`role="tab"`・`role="tabpanel"` と `aria-selected` を持ち、左右キー（と Home / End）で切り替えられる。JavaScript が無効な環境では両方のパネルを表示する。
- 文言は変えない。
- `specdojo-lp` で `npm run build` が成功する。agent の sandbox では npm を実行できないため、executor は evidence の `validations` でこの検証を `requires_human` と記録し、ビルドは orchestrator が sandbox の外で確認する。
- prj-0002 は `catalog_path` を設定していないため、`specdojo catalog validate` は実行しない（evidence にも記録しない）。
- `specdojo-lp` には Prettier などの整形・lint の道具がないため、`specdojo-lp` のファイルに対して `prettier` などを実行しない（evidence にも記録しない）。

## 3. 作業内容

| No  | 作業                                                           | 担当         | 状態 | メモ                   |
| --- | -------------------------------------------------------------- | ------------ | ---- | ---------------------- |
| 1   | 節ごとのコンポーネントに分け、`index.astro` を並べるだけにする | DEV          | open | -                      |
| 2   | ビルドし、分割前後の `dist/index.html` を比べる                | orchestrator | open | sandbox の外で確認する |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0002:pjr-hepk-lp-content]]: LP の構成と原稿。
- [[prj-0002:pjr-kh17-lp-tool-fit-guide]]: 使い分けの節。
- [[prj-0002:pjr-7t8x-lp-roadmap-pdca-matrix]]: 「これから」の節。
- [[prj-0002:pjr-2cqc-lp-dev-environment]]: 開発環境の整備。分割の後に整形をかける。
