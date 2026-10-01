---
specdojo:
  id: prj-0001:pjr-5822-multi-repo-item-design
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: high
  owner: ARC
  registered_at: "2026-10-01T03:53:24Z"
---

# PJR-5822 1 つの項目で複数リポジトリを変更する exec の方針を決める

## 1. 背景

既定の別リポジトリ構成では、プロジェクトリポジトリ（`app1-specdojo/`）とプロダクトリポジトリ（`app1/`）を分ける。現行の exec は、プロジェクトリポジトリ 1 つと worktree 1 組だけを扱う。このため、プロダクトの実装やプロダクト文書を変更する項目は exec run で扱えない（`docs-structure-guide` の「現行実装の境界」）。v0.3.0 で、1 つの項目が複数のリポジトリを変更する exec を実現する。N 個のリポジトリを扱える設計とし、まずプロジェクトリポジトリ 1 つとプロダクトリポジトリ 1 つで動かす。複数プロダクトの論点は [[prj-0001:pjr-p7hy-multi-repo-single-item]] にある。

### 1.1. 調査と案の作成

決定に必要な調査と選択肢の比較は、[[prj-0001:pjr-fzc4-multi-repo-design-investigation]] で exec run により行い、結果を本個票の「検討した選択肢」に書く。決定内容と承認は利用者が記入する。

## 2. 検討した選択肢

| 選択肢 | 内容   | 利点   | 懸念   |
| ------ | ------ | ------ | ------ |
| A      | _TODO_ | _TODO_ | _TODO_ |

## 3. 決定内容

_TODO_: 採択した内容を明確に記載する。

## 4. 採択理由

- _TODO_: 判断根拠を記載する。

## 5. 承認

| 項目     | 内容   |
| -------- | ------ |
| 決定者   | _TODO_ |
| 決定日   | _TODO_ |
| 承認方式 | _TODO_ |
| 証跡     | _TODO_ |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 6. 影響範囲とフォローアップ

| 項目       | 内容   |
| ---------- | ------ |
| 影響範囲   | _TODO_ |
| 必要な対応 | _TODO_ |
| 追跡先     | _TODO_ |

## 7. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
