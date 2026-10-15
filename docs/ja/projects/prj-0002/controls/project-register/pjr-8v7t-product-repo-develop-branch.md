---
specdojo:
  id: prj-0002:pjr-8v7t-product-repo-develop-branch
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: decision
  item_status: open
  priority: medium
  owner: BA
  registered_at: "2026-10-15T22:15:57Z"
---

# PJR-8V7T プロダクトリポジトリを develop と main で運用する

## 1. 背景

specdojo-lp と specdojo-assets に develop を置き、exec と orchestrator の統合先を develop、develop から main への取り込みを人が行う運用にする

### 1.1. 経緯（2026-10-16）

- `specdojo-lp` は GitHub flow で運用し、統合先（`integration_branch`）を `feature/lp-v1` にしていた。`specdojo-assets` の統合先は `main` だった。
- exec の runner は、人が確かめる前（`review` に移す時点）に成果を統合先へ merge する。統合先が `main` だと、確認待ちの成果がそのまま `main` に入る。`specdojo-lp` では、`main` への push が Cloudflare Workers の本番への配置になる（[[prj-0002:pjr-ym7m-lp-cloudflare-deploy]]）。
- orchestrator は `main` に commit しない方針のため、統合先が `main` だと、feature の取り込みがすべて利用者の作業になる。PJR-F34R の準備でも、`specdojo-assets` の `main` への取り込みを利用者が行った。
- PJR-F34R から先は、agent が `specdojo-assets` にも書き込む。`specdojo-assets` から書き出すファイルは LP の中身になる。
- [[prj-0001:pjr-zdvq-product-repo-branch-strategy]] は、SpecDojo がプロダクトリポジトリにブランチ戦略を求めず、プロダクト側で決めた統合先を受け取ると決めている。git flow の `develop` は今の仕組みのまま合うとし、GitHub flow ではトピックごとに `integration_branch` を書き換える手間があることを懸念に挙げている。

## 2. 検討した選択肢

| 選択肢 | 内容                                                                                                      | 利点                                                                                                                                                       | 懸念                                                                                                                                              |
| ------ | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| A      | `develop` を置き、exec と orchestrator の統合先を `develop`、`develop` から `main` への取り込みを人が行う | `main` は人が確かめたものだけになる。LP のリリースの時期を人が選べる。`develop` を固定のプレビューで確かめられる。orchestrator が `develop` まで統合できる | `develop` から `main` へ取り込む手順が増える。差が開きすぎないよう、こまめに取り込む必要がある                                                    |
| B      | `develop` を置かず、feature を直接 `main` へ取り込む（GitHub flow）                                       | ブランチが 1 本少なく単純                                                                                                                                  | 統合先を `main` にすると確認待ちの成果が `main` に入る。避けるにはトピックごとに統合先と設定を変える必要がある。`main` の履歴に exec の統合が並ぶ |

## 3. 決定内容

選択肢 A を採る。

- `specdojo-lp` と `specdojo-assets` に `develop` を置き、`main` の先端から作る。ブランチ名に project ID を入れない。
- `.specdojo/specdojo.config.json` の両リポジトリの `integration_branch` を `develop` にする。exec の統合と、orchestrator の `feature/prj-0002/<topic>` の merge は `develop` に入れる。
- `develop` から `main` への取り込み（リリース）と push は、利用者が行う。`specdojo-lp` では、`main` への push が本番への配置になる。`develop` は Workers Builds のプレビューとして配置され、リリースの前に確かめられる。
- `feature/lp-v1` は役目を終えたため、移行の後に削除する。リモートのブランチの削除は利用者が行う。
- agent を使わず、人だけが小さな変更を入れるリポジトリを今後 `repos` に加える場合は、[[prj-0001:pjr-zdvq-product-repo-branch-strategy]] のとおり、リポジトリごとに GitHub flow を選んでよい。

## 4. 採択理由

- exec の runner は確認の前に統合する。この順番は変えられないため、統合先を、人が確かめる前のものが入ってよい場所にしておく必要がある。
- `develop` には `review` または `done` の成果があり、`main` には人が確かめて取り込んだものだけが入る、と登録簿の状態に対応づけて説明できる。
- `specdojo-assets` は配置を持たないが、agent が書き込み、書き出したファイルが LP の中身になるため、`specdojo-lp` と同じ形にして agent への指示と運用をそろえる。
- [[prj-0001:pjr-zdvq-product-repo-branch-strategy]] の決定の範囲内で、プロダクト側の運用として選べる。

## 5. 承認

| 項目     | 内容                                                                  |
| -------- | --------------------------------------------------------------------- |
| 決定者   | BA                                                                    |
| 決定日   | 2026-10-16                                                            |
| 承認方式 | commit                                                                |
| 証跡     | register event `close`（`events/pjr-8v7t.yaml`）と本個票の遷移 commit |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 6. 影響範囲とフォローアップ

| 項目       | 内容                                                                                                                                                        |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 影響範囲   | `specdojo-lp` と `specdojo-assets` のブランチ、`.specdojo/specdojo.config.json` の `repos`、`specdojo-lp` の README と `tsd-index` のソースコード管理の記述 |
| 必要な対応 | 両リポジトリでの `develop` の作成と push、`integration_branch` の変更、README と `tsd-index` の修正、`feature/lp-v1` の削除                                 |
| 追跡先     | orchestrator が本決定に続けて対応し、本個票の対応記録に残す。PJR-F34R の exec は、移行の後に `specdojo-assets` の `develop` へ統合する                      |

## 7. 関連ドキュメント

- [[prj-0001:pjr-zdvq-product-repo-branch-strategy]]: プロダクトリポジトリのブランチ戦略を SpecDojo は求めないとした決定。
- [[prj-0002:pjr-ym7m-lp-cloudflare-deploy]]: `main` への push で本番に配置する設定。
- [[prj-0002:pjr-f34r-assets-repository-setup]]: agent が `specdojo-assets` に書き込む最初の項目。
