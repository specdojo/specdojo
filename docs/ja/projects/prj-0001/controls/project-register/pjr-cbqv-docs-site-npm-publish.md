---
specdojo:
  id: prj-0001:pjr-cbqv-docs-site-npm-publish
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: DEV
  registered_at: "2026-09-29T21:34:43Z"
  completed_at: "2026-10-13T21:08:12Z"
  conclusion: "@specdojo/docs-site 0.2.1 を trusted publishing で公開し（provenance 付き、latest）、空のリポジトリで README の手順どおりに導入とビルドができることを確かめた"
---

# PJR-CBQV @specdojo/docs-site を npm へ公開する

## 1. 概要

docs-site は npm に未公開で、docs-editing-guide・移行ガイド・docs-site の README の npm install の手順が失敗する。publish-docs-site.yml を追加した。npm 側の trusted publisher の設定と、staged publishing の承認による初回公開、導入の確認が残る

## 2. 完了条件

- `@specdojo/docs-site` が npm に公開され、`latest` が v0.3.0 と同時に出す版を指している。
- npm の trusted publisher に `specdojo/specdojo` の `publish-docs-site.yml` が登録され、タグの push から Actions 経由で公開（staged publishing の承認を含む）できている。公開した版に provenance が付いている。
- 空のリポジトリで README の手順（`npm install --save-dev @specdojo/docs-site` と `npx specdojo-docs-site build .`）を行い、ビルドが通る。

## 3. 作業内容

| No  | 作業                                                                              | 担当         | 状態 | メモ                                            |
| --- | --------------------------------------------------------------------------------- | ------------ | ---- | ----------------------------------------------- |
| 1   | 初回の公開（0.2.0）                                                               | 人           | done | 2026-10-12、手元から公開。provenance なし       |
| 2   | 空のリポジトリでの導入の確認                                                      | orchestrator | done | 0.2.0 で不具合 2 件を発見（PJR-EA20・PJR-CA0S） |
| 3   | 不具合の修正と 0.2.1 への版上げ、main への昇格                                    | orchestrator | done | #13（33a833838）                                |
| 4   | trusted publisher の登録、`docs-site-v0.2.1` のタグの push、staged publish の承認 | 人           | done | 2026-10-14                                      |
| 5   | 公開された 0.2.1 の導入の確認                                                     | orchestrator | done | 2026-10-14                                      |

## 4. 対応結果

- 0.2.0 は 2026-10-12 に利用者が手元から公開した（`_npmUser` は naoji3x、provenance なし）。staged publishing の仮置きの版 `0.0.0-stage` も残るが、`latest` ではないため導入には使われない。
- 2026-10-13 に、`config init` と `register scaffold` だけを行った空のリポジトリへ 0.2.0 を README の手順で導入したところ、`docs/en` がないためビルドが止まった（PJR-EA20）。あわせて、ビルド結果が package の中（`node_modules/@specdojo/docs-site/.vitepress/dist`）へ出力されることが分かった（PJR-CA0S）。利用者の判断で v0.3.0 の公開前に直した。
- 修正を 0.2.1 とし、#13 で main へ昇格した。利用者が trusted publisher を登録し、`docs-site-v0.2.1` のタグの push から Actions が staged publish を登録して、利用者が承認した。
- 2026-10-14 に確認した結果は次のとおりである。

| 確認                                                                  | 結果                                                                        |
| --------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `dist-tags.latest`                                                    | 0.2.1（公開 2026-10-13T21:05:10Z）                                          |
| 公開者と provenance                                                   | `GitHub Actions`、`https://slsa.dev/provenance/v1`、`gitHead` は 33a833838  |
| 空のリポジトリ（`docs/ja` のみ）での `npx specdojo-docs-site build .` | 通過。出力は利用リポジトリの `.vitepress/dist` で、package の中に出力しない |

## 5. 関連ドキュメント

- [[prj-0001:pjr-ea20-docs-site-requires-en-locale]]
- [[prj-0001:pjr-ca0s-docs-site-output-in-node-modules]]
- `.github/workflows/publish-docs-site.yml`、`packages/docs-site/README.md`
