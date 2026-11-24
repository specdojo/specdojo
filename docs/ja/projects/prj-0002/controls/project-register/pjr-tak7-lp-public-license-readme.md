---
specdojo:
  id: prj-0002:pjr-tak7-lp-public-license-readme
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  difficulty: easy
  owner: DEV
  registered_at: "2026-11-24T14:39:30Z"
  due_on: "2026-11-30"
  block_reason: "executor validation failed or not run: npm run format:check, npm run build"
---

# PJR-TAK7 specdojo-lp の公開に向けて LICENSE を加え、README に showcase の案内を書く

## 1. 概要

specdojo-lp を showcase として公開する前に MIT の LICENSE を置き、マスコット画像を対象外とする扱いと登録簿の項目への辿り方を README に書く

## 2. 入力

- specdojo-lp（GitHub の specdojo/specdojo-lp）は非公開で、LICENSE がない。showcase として公開する予定である。
- 公開前の調査で、全ブランチの履歴に秘密の情報や削除済みの機密ファイルはなく、公開を妨げるものはないことを確認した。
- ライセンスは PO の決定により、specdojo 本体と同じ MIT（Copyright (c) 2025 Tiny Shrine）とする。
- src/assets/mascot/dojo-otter.webp は ChatGPT で作った暫定の画像で、正式な画像は specdojo-assets で作る。PO の決定により、マスコット画像は MIT の対象外とし、転用・改変を許可しない。
- commit の Refs: prj-0002:PJR-XXXX は、公開中の specdojo/specdojo の project/prj-0002/develop ブランチで登録簿の項目へ辿れる。
- CHANGELOG は specdojo-lp の README の決まりに従い、Unreleased へ追記する。
- リポジトリを Public に切り替える操作は本項目に含めず、確認のあとで人が行う。
- PO の決定により、公開後は GitHub の設定で PR の作成を Collaborators only にし、外からの PR は受け付けない。設定の変更は人が行う。
- `package.json` は保護された設定のため、`"license": "MIT"` の追加はオーケストレーターが `feature/prj-0002/lp-package-license` で行い、LP の `develop` へ取り込み済みである（`1a9c2f3`）。

## 3. 完了条件

- `specdojo-lp/LICENSE` に MIT の本文があり、著作権の表記が `Copyright (c) 2025 Tiny Shrine` である。
- `specdojo-lp/README.md` に「ライセンス」の節がある。この節に次の 2 点が書いてある。
  - リポジトリは MIT で、`src/assets/mascot/dojo-otter.webp` は MIT の対象外とし、転用・改変を許可しないこと。
  - マスコット画像は暫定で、正式な画像に替える予定であること。
- `specdojo-lp/README.md` の冒頭に、showcase としての案内がある。案内には次の 2 点が書いてある。
  - このリポジトリは SpecDojo の登録簿と exec で運用していること。
  - commit の `Refs: prj-0002:PJR-XXXX` から、公開中の `specdojo/specdojo` の `project/prj-0002/develop` ブランチにある登録簿の項目へ辿れること。
- `specdojo-lp/README.md` に、外からの PR は受け付けていないことを 1 文で書く。置き場所は showcase の案内かライセンスの節のどちらかとし、どちらにしたかを対応結果に書く。
- README の既存の節の番号を、新しい節に合わせて振り直す。既存の節の内容は変えない。
- `specdojo-lp/CHANGELOG.md` の `Unreleased` へ、LP の README の決まりに従って、ライセンスを加えたこと（`LICENSE`・README の節・`package.json` の `license` の記載を含む）を追記する。公開済みの日付の節は変えない。
- 変更してよいのは、LP の `LICENSE`・`README.md`・`CHANGELOG.md` と、本個票の対応結果だけとする。`package.json` は変更済みのため変えない。画面・設定・画像も変えない。`main` への統合、`git push`、PR の作成、リポジトリの公開設定の変更は行わない。
- LP で `npm run lint:md`、`npm run format:check`、`npm run build` が成功する。runner に設定された親の検証を通す。
- 実施内容・変更ファイル・検証結果・残課題を、本個票の対応結果に残す。pipeline で申し送りがあれば、`handoff` にも書く。

## 4. 作業内容

| No  | 作業                                            | 担当 | 状態 | メモ |
| --- | ----------------------------------------------- | ---- | ---- | ---- |
| 1   | `LICENSE` を加える                              | DEV  | open | -    |
| 2   | README にライセンスの節と showcase の案内を書く | DEV  | open | -    |
| 3   | CHANGELOG の `Unreleased` へ追記する            | DEV  | open | -    |
| 4   | LP の検査と親の検証を通し、対応結果を記録する   | DEV  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0002:pjr-rwqv-lp-changelog]]: LP の変更履歴の更新ルール。
- `specdojo-lp:README.md`: 追記の対象。
