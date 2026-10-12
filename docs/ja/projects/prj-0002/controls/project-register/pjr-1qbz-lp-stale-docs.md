---
specdojo:
  id: prj-0002:pjr-1qbz-lp-stale-docs
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  owner: BA
  registered_at: "2026-10-12T08:53:07Z"
  due_on: "2026-10-31"
---

# PJR-1QBZ specdojo-lp の README と古くなった記述を現状に合わせる

## 1. 概要

PJR-7WG4 のコンポーネント分割などで、README の構成の表（index.astro を仮のトップページとする記述など）やソースのコメントが現状と合わなくなった。README を含めて古い記述を洗い出し、現状に合わせる。統合先は feature/lp-v1

### 1.1. 洗い出した候補（2026-10-12）

orchestrator が `feature/lp-v1`（518a45e）で確認した時点の候補。実施時に改めて洗い出す。

- `README.md` の `4. 構成` の表が、`src/pages/index.astro` を「仮のトップページ」としたままで、PJR-7WG4 で分けた `src/components/`（`SiteHeader.astro`・`SiteFooter.astro`・`Tabs.astro`・`sections/` の 7 つの節）と `src/lib/links.ts` が載っていない。
- `src/components/sections/Hero.astro` の冒頭のコメントが、構成と原稿を登録簿の項目 ID で説明している。コメントとして残すかは実施時に判断する。
- LP の文言が、prj-0001 で更新された文書（PJR-34F2 の用語の反映、PJR-EVAX の「Spec道（仕様道）」の表記など）と食い違っていないか。

## 2. 完了条件

- `specdojo-lp` の `README.md` が現状と一致している。とくに `4. 構成` の表に、`src/pages/index.astro`（節を並べるだけ）、`src/components/` の各コンポーネント、`src/lib/links.ts` が載っている。
- `src/` のソースのコメントに、現状と合わない記述がない。
- LP の画面の文言が、ドキュメントサイトの最新の用語（prj-0001 の PJR-34F2 で反映した体系の名前など）と矛盾しない。食い違いを見つけた場合は、LP 側を直すか、直さない理由を対応結果に書く。
- 画面に表示する文言を変えた場合を除き、出力される HTML を変えない。
- 変更は `feature/lp-v1` へ統合する（prj-0002 の `integration_branch`）。
- `specdojo-lp` で `npm run build` が成功する。agent の sandbox では npm を実行できないため、executor は evidence の `validations` でこの検証を `requires_human` と記録し、ビルドは orchestrator が sandbox の外で確認する。
- prj-0002 は `catalog_path` を設定していないため、`specdojo catalog validate` は実行しない（evidence にも記録しない）。
- `specdojo-lp` には Prettier などの整形・lint の道具がないため、`specdojo-lp` のファイルに対して `prettier` などを実行しない（evidence にも記録しない）。

## 3. 作業内容

| No  | 作業                                                | 担当         | 状態 | メモ                   |
| --- | --------------------------------------------------- | ------------ | ---- | ---------------------- |
| 1   | 古い記述を洗い出し、README とソースを現状に合わせる | BA           | done | README の構成表を更新  |
| 2   | ビルドを確認する                                    | orchestrator | done | sandbox の外で確認した |

## 4. 対応結果

### 4.1. 実施内容

- `specdojo-lp:README.md` の `4. 構成` を現行ソースと照合し、`src/pages/index.astro` を「仮のトップページ」から、ヘッダー・7 つの節・フッターを並べるトップページへ改めた。
- `SiteHeader.astro`・`SiteFooter.astro`・`Tabs.astro`、`sections/` の 7 コンポーネント、共通リンクの `src/lib/links.ts`、Hero の暫定マスコット画像を構成表へ追加した。
- `src/` のコメントをすべて確認した。タブのフォールバック、register の 7 種類、README に合わせた会話例、暫定マスコットの説明はいずれも現状と一致していたため、変更していない。
- LP の表示文言を、prj-0001 の PJR-34F2 と PJR-EVAX の内容に照らして確認した。標語「記して、形にして、磨き続ける。」、`app1-workspace/`、要求・要件・仕様の表現、「Spec道（仕様道）」の表記は最新の用語と一致している。旧称の「成果物体系」「実践体系」「遂行体系」は使っていないため、表示文言は変更していない。
- 製品コードや表示文言は変更しておらず、出力される HTML への変更はない。

### 4.2. 成果物

| ファイル                                    | 内容                           |
| ------------------------------------------- | ------------------------------ |
| `specdojo-lp:README.md`                     | 現行のソース構成に合わせて更新 |
| `prj-0002:pjr-1qbz-lp-stale-docs`（本個票） | 作業内容と対応結果を記録       |

### 4.3. 検証と残課題

- `git diff --check` で差分に空白エラーがないことを確認した。
- `specdojo-lp` の `npm run build` は、完了条件どおり orchestrator が sandbox の外で確認する。
- exec run は `waiting` に止まらず、runner が `specdojo-lp` の `feature/lp-v1` へ統合した（0126899）。runner の親検証 7 種はすべて passed だった。orchestrator が sandbox の外で 0126899 をビルドし、成功を確認した（2026-10-12）。差分は `README.md` だけで、`src/` に登録簿の項目 ID が残っていないことも確かめた。

### 4.4. レビュー（2026-10-12）

orchestrator が完了条件に照らして確かめた。

- `feature/lp-v1`（PJR-2CQC の取り込み後）で、README の `4. 構成` の表に載るパスがすべて実在し、`src/pages/index.astro`・`src/components/` の各コンポーネント・`src/lib/links.ts` が載っている。`tsconfig.json`・`.prettierignore`・`.vscode/extensions.json` は表に無いが、表は全ファイルの一覧ではないため問題としない。
- `src/` のコメントは現状と一致し、登録簿の項目 ID も残っていない。
- 本個票の完了条件にある「`specdojo-lp` で prettier を実行しない」の条件は、PJR-2CQC で整形の道具が入ったため、今後の項目では不要になった。

## 5. 関連ドキュメント

- [[prj-0002:pjr-7wg4-lp-split-components]]: コンポーネントへの分割。
- [[prj-0001:pjr-zdvq-product-repo-branch-strategy]]: `feature/lp-v1` へ統合する運用の根拠。
- [[prj-0001:pjr-evax-spec-do-notation]]: 「Spec道（仕様道）」の表記。
