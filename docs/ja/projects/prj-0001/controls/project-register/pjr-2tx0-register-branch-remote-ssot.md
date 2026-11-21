---
specdojo:
  id: prj-0001:pjr-2tx0-register-branch-remote-ssot
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: medium
  owner: PO
  registered_at: "2026-11-21T09:27:48Z"
  derived_from:
    - PJR-11EX
---

# PJR-2TX0 複数人で開発するときに、register だけを専用のブランチで同期するか（PJR-11EX の見直し）

## 1. 背景

register を project/prj-0001/register のような専用のブランチに置いてリモートを正本とし、ほかの変更は GitHub Flow や git flow の PR で扱う方式（D）を、11EX の C（GitHub App が develop へ merge）と比べて決める

## 2. 入力

- 利用者の提案（2026-11-21）: 複数人で開発するときに同期したいのは register だけで、ほかは通常の GitHub Flow や git flow で対応できる。project/prj-0001/register のようなブランチを作り、register はリモートを正本とする運用でよいのではないか
- PJR-11EX の決定（2026-11-15、C）: 統合専用の actor を GitHub Actions 上の GitHub App とし、runner は exec と記帳のブランチを push するだけにする。後続の作業（runner の push 方式、Actions の workflow、App の権限、claim の競合の検出）は単独の運用の間は起票しないとした
- 2026-11-21 の例: coderdojo-lessons から `external_projects` で起票した 4 件（PJR-7KQT・FGKB・F6MC・QTZ7）が develop へ直接 push され、こちらでは run の統合とぶつからないよう specdojo git の merge で取り込んだ（index の書き込みで一度止まった）
- 決める点（orchestrator の整理）: 1) register に何を含めるか（個票とイベントだけか、schedule の claim・complete のイベント、run の記録、grade の結果まで含めるか） 2) runner が個票の状態の遷移と対応結果を書く先（今は exec のブランチで書いて develop に統合している） 3) develop から register をどう見るか（register のブランチを develop へ一方向に merge し続けるか、CLI が register のブランチから読むか。製品の文書の wikilink、文書サイトの build、exec plan が個票を読む） 4) register のブランチへの push の競合（ID は乱数でファイルは項目ごとのため衝突はほぼ無い。register ... --commit に pull --rebase と push のやり直しを組み込むか）と CI での形の検査

## 3. 検討した選択肢

| 選択肢 | 内容   | 利点   | 懸念   |
| ------ | ------ | ------ | ------ |
| A      | _TODO_ | _TODO_ | _TODO_ |

## 4. 決定内容

_TODO_: 採択した内容を明確に記載する。

## 5. 採択理由

- _TODO_: 判断根拠を記載する。

## 6. 承認

| 項目     | 内容   |
| -------- | ------ |
| 決定者   | _TODO_ |
| 決定日   | _TODO_ |
| 承認方式 | _TODO_ |
| 証跡     | _TODO_ |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 7. 影響範囲とフォローアップ

| 項目       | 内容   |
| ---------- | ------ |
| 影響範囲   | _TODO_ |
| 必要な対応 | _TODO_ |
| 追跡先     | _TODO_ |

## 8. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
