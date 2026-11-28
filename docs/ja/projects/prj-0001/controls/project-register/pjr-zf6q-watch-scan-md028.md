---
specdojo:
  id: prj-0001:pjr-zf6q-watch-scan-md028
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  registered_at: "2026-11-28T09:56:57Z"
  derived_from:
    - PJR-QCJ5
---

# PJR-ZF6Q 見回りの報告の診断の章が、引用の中に空行を入れて markdownlint の MD028 に当たる

## 1. 課題内容

watch-scan の報告で、診断の引用と次の引用の間に空行が入り、MD028（no-blanks-blockquote）に当たる。git の管理外の報告でも、in-place の run の lint-md-changed が拾って、関係のないタスクの親の検証を落とす

## 2. 入力

- 2026-11-28 の R5（T-KATA-REVIEW-CALIBRATION-opr-sample-150）の run が、親の検証 lint-md-changed で watch-scan-20261128.md:297 の MD028 により失敗した。診断の引用の直後に空行があり、次の行（「1 晩 3 回の診断上限。…」）も引用で始まっていた
- 回避として、報告の該当の空行を > に直した（git の管理外の生成物のため commit していない）
- indie が推奨どおりの起票を指示した（2026-11-28）。担当と期限は未定

## 3. 影響範囲

| 観点         | 影響   |
| ------------ | ------ |
| スコープ     | _TODO_ |
| スケジュール | _TODO_ |
| コスト       | _TODO_ |
| 品質         | _TODO_ |
| 関係者       | _TODO_ |

## 4. 対応方針

| 項目     | 内容   |
| -------- | ------ |
| 原因     | _TODO_ |
| 対応策   | _TODO_ |
| 依存事項 | _TODO_ |
| 完了条件 | _TODO_ |

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
