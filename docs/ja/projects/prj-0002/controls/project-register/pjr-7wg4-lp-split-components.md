---
specdojo:
  id: prj-0002:pjr-7wg4-lp-split-components
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: todo
  item_status: review
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

| No  | 作業                                                           | 担当         | 状態 | メモ                      |
| --- | -------------------------------------------------------------- | ------------ | ---- | ------------------------- |
| 1   | 節ごとのコンポーネントに分け、`index.astro` を並べるだけにする | DEV          | done | 10 部品と共通リンクへ分割 |
| 2   | ビルドし、分割前後の `dist/index.html` を比べる                | orchestrator | done | sandbox の外で確認した    |

## 4. 対応結果

### 4.1. 実施内容

- ヘッダーとフッターを `SiteHeader.astro`・`SiteFooter.astro` へ分けた。
- 7 つの節を `Hero.astro`・`Problems.astro`・`RegisterTypes.astro`・`ToolFit.astro`・`GetStarted.astro`・`NextSteps.astro`・`Roadmap.astro` へ分けた。各節のデータと型は、それを使う節の frontmatter へ移した。
- タブのマークアップとインライン script を `Tabs.astro` へ分けた。手順データと表示内容は `GetStarted.astro` に置き、named slot で Tabs に渡している。
- 複数の節で使うドキュメントサイトの URL を `lib/links.ts` に集約した。
- `pages/index.astro` は `BaseLayout` の中でヘッダー、7 つの節、フッターを並べる 29 行のファイルにした。

### 4.2. 成果物

| ファイル                                      | 内容                                 |
| --------------------------------------------- | ------------------------------------ |
| `specdojo-lp:src/pages/index.astro`           | ページを構成するコンポーネントの配置 |
| `specdojo-lp:src/components/SiteHeader.astro` | ヘッダー                             |
| `specdojo-lp:src/components/SiteFooter.astro` | フッター                             |
| `specdojo-lp:src/components/Tabs.astro`       | 始め方のタブとインライン script      |
| `specdojo-lp:src/components/sections/*.astro` | Hero から Roadmap までの 7 節        |
| `specdojo-lp:src/lib/links.ts`                | ドキュメントサイトの共通 URL         |

### 4.3. 検証と残課題

- `git diff --check` で差分に空白エラーがないことを確認した。
- `npm run build` と、099292f の `dist/index.html` との空白を除く比較は、個票の完了条件どおり orchestrator が sandbox の外で確認する。
- exec run は `waiting` に止まらず、runner が `specdojo-lp` の `main` へ統合した（6c6d001）。runner の親検証 7 種はすべて passed だった。
- orchestrator が sandbox の外で、分割前の `main`（099292f）と統合後の `main`（6c6d001）をそれぞれビルドして比べた（2026-10-12）。
  - どちらも `npm run build` が成功した。
  - `dist/index.html` は、空白の差を除いて一致した。そのため、文言・節の順・タブの `role` と `aria-selected` などの属性も変わっていない。
  - CSS はファイル名（`index.CE3mUiSH.css`）も中身も一致した。
  - `pages/index.astro` は 887 行から 29 行になった。

## 5. 関連ドキュメント

- [[prj-0002:pjr-hepk-lp-content]]: LP の構成と原稿。
- [[prj-0002:pjr-kh17-lp-tool-fit-guide]]: 使い分けの節。
- [[prj-0002:pjr-7t8x-lp-roadmap-pdca-matrix]]: 「これから」の節。
- [[prj-0002:pjr-2cqc-lp-dev-environment]]: 開発環境の整備。分割の後に整形をかける。
