---
specdojo:
  id: prj-0001:pjr-50yh-markdownlint-cli2-overrides
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-25T01:36:26Z"
  due_on: "2026-10-31"
---

# PJR-50YH scaffold の markdownlint 設定のせいで、VS Code でファイルごとの規則を当てられない

## 1. 課題内容

`init --lefthook` が生成する `.markdownlint.jsonc` があると、VS Code の拡張（markdownlint-cli2）は `.markdownlint-cli2.yaml` の `overrides` を当てないため、Slidev のスライドなど一部のファイルにだけ別の規則を当てられない。

- 起きたこと: 利用者の project（coderdojo-lessons-specdojo の prj-0001）で、Slidev の kata（`docs/ja/specdojo/{samples,templates}/**/lsd-*.md`）にだけ Slidev 用の規則を当てようとした。VS Code では、Vue の部品・ページごとの H1 などで 114 件の警告が出ていた。
- 確かめたこと（markdownlint-cli2 0.24.0、VS Code の拡張 0.62.1 と同じ系統）:

| ルートの基本の設定                               | `.markdownlint-cli2.yaml` の `overrides`   |
| ------------------------------------------------ | ------------------------------------------ |
| なし                                             | 効く                                       |
| `.markdownlint.jsonc`（scaffold が生成する名前） | 効かない                                   |
| `.markdownlint.yaml`                             | 効かない（親のディレクトリにあっても同じ） |
| `.markdownlintrc`                                | 効く                                       |

- 利用者の project では、基本の設定を `.markdownlintrc` に移し、`.markdownlint-cli2.yaml` の `config` から `extends` で読み込んで解決した。markdownlint-cli（commit hook と、exec run の result の検査）は `.markdownlintrc` を読み、markdownlint-cli2 は読まないため、両者がぶつからない。

あわせて分かったこと（Slidev のスライドに専用の設定を当てるとき）:

- markdownlint-cli は、`.markdownlintrc` が `{` で始まるときだけ JSON として読む。先頭にコメントを書くと設定が読まれない。
- markdownlint-cli2 の `overrides` は、最初に一致した 1 つだけを使う。prettier の `overrides` は、後のものを優先する。Slidev 用の設定は、cli2 では先頭、prettier では末尾に置く必要がある。
- Slidev のスライドは中身ではなくパスで見分けるしかないため、利用者の project では名前の決まり（`lsd-` で始める）を作った。3 つの設定（`.markdownlint-cli2.yaml`・`.prettierrc`・`.markdownlintignore`）を同じ glob にそろえ、名前・glob・順番を commit の前に確かめる検査（`tools/check-slidev-files.mjs`）を加えた。

## 2. 影響範囲

| 観点         | 影響                                                                                                                       |
| ------------ | -------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | scaffold の markdownlint 設定を使い、VS Code でファイルごとに規則を変えたい利用者。Slidev の kata を作る利用者は必ず当たる |
| スケジュール | 原因の調査に時間がかかる（設定ファイルの名前が原因とは分かりにくい）                                                       |
| コスト       | 設定ファイルの名前の変更と、その理由の記録                                                                                 |
| 品質         | VS Code に大量の警告が出たままになるか、利用者が検査から外して誤りに気づけなくなる                                         |
| 関係者       | `init --lefthook` を使う利用者                                                                                             |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | scaffold が、markdownlint-cli2 の `overrides` を無効にする名前（`.markdownlint.jsonc`）で基本の設定を生成する                                                                                                                                                                                                                                                                                                                                                                 |
| 対応策   | 次のどちらかにする。<br>1. scaffold の基本の設定を `.markdownlintrc` で生成し、`.markdownlint-cli2.yaml`（`config` で `.markdownlintrc` を読み込む）も生成する。`.markdownlintrc` は `{` で始める。<br>2. commit hook と result の検査を markdownlint-cli2 に移し、設定を `.markdownlint-cli2.yaml` に一本化する。<br>どちらの場合も、既存の `.markdownlint.*` を持つ利用者への移行の案内を文書に書く。Slidev を選んで入れる scaffold（PJR-84F7）では、overrides の順番を守る |
| 依存事項 | [[prj-0001:pjr-84f7-scaffold-slidev]]（Slidev の設定を生成するときに、この対応策を前提にする）                                                                                                                                                                                                                                                                                                                                                                                |
| 完了条件 | scaffold の生成物のまま、`.markdownlint-cli2.yaml` の `overrides` で一部のファイルにだけ別の規則を当てられる。commit hook と exec run の result の検査で、基本の設定（`MD013: false` など）が効く。これらを確かめる test がある                                                                                                                                                                                                                                               |

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-84f7-scaffold-slidev]]：Slidev を選んで入れる scaffold
- 報告元: 利用者の project（coderdojo-lessons-specdojo の prj-0001）。設定は commit `12976eb`・`a2495b9`
