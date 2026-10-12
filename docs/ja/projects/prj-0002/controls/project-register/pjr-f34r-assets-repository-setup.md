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

specdojo-assets に README.md のディレクトリ体系どおりの骨組み（assets/・exports.yaml・BRAND.md・templates/・scripts/）、exports.yaml に従って書き出すスクリプトを用意し、prj-0002 の repos に specdojo-assets を加える

## 2. 完了条件

- `specdojo-assets` に、`README.md`（df10f80）のディレクトリ体系どおりに次がある（[[prj-0002:pjr-hktj-assets-repository]] の `追記（2026-10-12、ディレクトリ体系）`）。
  - `assets/` と、種類のディレクトリ（`characters/`・`logos/`・`illustrations/`・`icons/`・`social/`）。
  - `templates/asset.yaml`: アセットごとのメタ情報（名前、原本ごとの作り方（AI での生成か手描きか）・作者・ライセンス）の雛形。
  - `exports.yaml`: 書き出し先のリポジトリ（`targets`）と、書き出すもの（`exports`、形式と幅）の定義。当面の書き出し先は `specdojo-lp`（`public/assets/` の下）だけとする。
  - `BRAND.md`: ブランド全体の規則（色・余白・使ってよい場面・ライセンスの方針）。
  - `README.md` の書き出しの説明と例が、`exports.yaml` とスクリプトの実際の形と一致している。
- 原本の大きさの目安（Git LFS を使わず、10 MB を超えたら検討する。PSD は原本として置かない）が `README.md` に書かれている（df10f80 で記載済み）。
- `exports.yaml` に従って書き出すスクリプト（`scripts/export.mjs`）があり、見本の画像 1 つで `specdojo-lp` の書き出し先にファイルが作られることを確かめている。
- prj-0002 の `repos` に `specdojo-assets` を加えている。設定ファイルの変更は feature ブランチで行い、利用者の承認を得て取り込む。統合先は `main` とする（利用者の承認、56813ee21 で取り込み済み）。
- 前提（2026-10-12 の確認）:
  - `specdojo-assets` は `/workspaces/specdojo-workspace/specdojo-assets` に clone 済み。最初の commit（`README.md` のみ、df10f80）は orchestrator が `main` に作った。
- `git push` は行わない。push は利用者が行う。

## 3. 作業内容

| No  | 作業                                               | 担当         | 状態 | メモ                                           |
| --- | -------------------------------------------------- | ------------ | ---- | ---------------------------------------------- |
| 1   | 最初の commit を作り、`repos` に加える             | orchestrator | done | df10f80（specdojo-assets）、56813ee21（repos） |
| 2   | 骨組みと書き出しのスクリプトを作り、見本で確かめる | DEV          | open | -                                              |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0002:pjr-hktj-assets-repository]]: 派生元の決定。ディレクトリ体系の追記を含む。
- [[prj-0002:pjr-pevv-mascot-character-source]]: この骨組みに原本を置く項目。
