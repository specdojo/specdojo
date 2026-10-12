---
specdojo:
  id: prj-0002:pjr-f34r-assets-repository-setup
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-12T09:49:11Z"
  due_on: "2026-10-31"
---

# PJR-F34R specdojo-assets の骨組みと書き出しの仕組みを作る

## 1. 概要

specdojo-assets に mascot/source/・mascot/prompts/・exports.yaml・BRAND.md の骨組み、Git LFS の設定、exports.yaml に従って書き出すスクリプトを用意し、prj-0002 の repos に specdojo-assets を加える

## 2. 完了条件

- `specdojo-assets` に、[[prj-0002:pjr-hktj-assets-repository]] の構成どおりに次がある。
  - `mascot/source/`（原本。Git LFS で管理する）と `mascot/prompts/`（生成のプロンプトと設定）
  - `exports.yaml`: 何を・どの形式とサイズ（WebP・AVIF・PNG、@1x・@2x など）で・どのリポジトリのどこへ書き出すかの定義。当面の書き出し先は `specdojo-lp` だけとする。
  - `BRAND.md`: 色・余白・使ってよい場面・ライセンスと、原本ごとの作り方（AI での生成か手描きか）を書く欄。
  - `README.md`: 原本を直して書き出し直す手順。書き出したファイルを使う側で直接直さないこと。
- `.gitattributes` で、`mascot/source/` の画像を Git LFS の対象にしている。
- `exports.yaml` に従って書き出すスクリプトがあり、見本の画像 1 つで `specdojo-lp` の書き出し先にファイルが作られることを確かめている。
- prj-0002 の `repos` に `specdojo-assets` を加えている。設定ファイルの変更は feature ブランチで行い、利用者の承認を得て取り込む。
- 前提（2026-10-12 の確認）:
  - `specdojo-assets` は `/workspaces/specdojo-workspace/specdojo-assets` に clone 済みで、commit がまだない。exec は統合先ブランチの先端から worktree を作るため、最初の commit（`README.md` など）は exec の前に orchestrator が作る。
  - この devcontainer には Git LFS が入っていない。導入の方法（devcontainer への追加など）を決めてから LFS を設定する。
- `git push` は行わない。push は利用者が行う。

## 3. 作業内容

| No  | 作業                                               | 担当         | 状態 | メモ                           |
| --- | -------------------------------------------------- | ------------ | ---- | ------------------------------ |
| 1   | 最初の commit を作り、`repos` に加える             | orchestrator | open | 設定の変更は利用者の承認を得る |
| 2   | Git LFS の導入方法を決めて設定する                 | DEV          | open | -                              |
| 3   | 骨組みと書き出しのスクリプトを作り、見本で確かめる | DEV          | open | -                              |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0002:pjr-hktj-assets-repository]]: 派生元の決定。構成の案（`mascot/source/`・`mascot/prompts/`・`exports.yaml`・`BRAND.md`）を含む。
- [[prj-0002:pjr-pevv-mascot-character-source]]: この骨組みに原本を置く項目。
