---
specdojo:
  id: prj-0002:pjr-hdtz-lp-v0-5-0-update
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: BA
  registered_at: "2026-10-29T10:37:31Z"
  due_on: "2026-10-31"
---

# PJR-HDTZ specdojo-lp に v0.5.0 までの変更を反映する

## 1. 概要

register の epic を含む 8 種類と depends_on、init の markdownlint 設定生成など、v0.5.0 までの利用者に見える変更を LP の文言・コマンド例に反映する

## 2. 完了条件

- LP の画面の文言とコマンド例を、prj-0001 の `CHANGELOG.md` の `0.5.0` までの利用者に見える変更と照合し、食い違いは LP 側を直すか、直さない理由を対応結果に書く。少なくとも次を確認する。
  - register の種類を、`epic` を含む 8 つにする（`src/components/sections/RegisterTypes.astro`・`NextSteps.astro` の「7 つ」の記述）。`epic` は track ごとの仕事をまとめ、それ自体は実行しないことが分かる説明にする。
  - 順番のある todo を `depends_on` でつなげることを載せるかを判断し、判断と理由を対応結果に書く。
  - 導入手順（`init` が `.markdownlint.yaml` を生成すること、docs-lint・docs-site を任意で入れる手順）が、現行のガイドと矛盾しない。
- 画面に表示する文言を変えた場合を除き、出力される HTML を変えない。
- 変更は `specdojo-lp` の `develop` へ統合する（prj-0002 の `integration_branch`）。
- `specdojo-lp` で `npm run build` が成功する。agent の sandbox では npm を実行できないため、executor は evidence の `validations` でこの検証を `requires_human` と記録し、ビルドは orchestrator が sandbox の外で確認する。
- prj-0002 は `catalog_path` を設定していないため、`specdojo catalog validate` は実行しない（evidence にも記録しない）。
- `specdojo-lp` には Prettier などの整形・lint の道具がないため、`specdojo-lp` のファイルに対して `prettier` などを実行しない（evidence にも記録しない）。

## 3. 作業内容

| No  | 作業                          | 担当         | 状態 | メモ |
| --- | ----------------------------- | ------------ | ---- | ---- |
| 1   | 食い違いを洗い出し、LP を直す | BA           | open | -    |
| 2   | ビルドを確認する              | orchestrator | open | -    |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0002:pjr-1qbz-lp-stale-docs]]
