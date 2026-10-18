---
specdojo:
  id: prj-0001:pjr-fxph-register-build-pipe-escape
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-18T00:43:51Z"
  due_on: null
---

# PJR-FXPH register build が表のセルの | をエスケープせず一覧の表が壊れる

## 1. 課題内容

個票のタイトル・説明・結論に | があると、register build が生成する一覧（pjr-index.md と派生ビュー）の表の列がずれ、lint-md の MD056 で失敗する。2026-10-18 に PJR-BHMH の結論の stop|wait|fallback で起き、並行して動いていた 2 件の run の親の検証が落ちた

## 2. 影響範囲

| 観点         | 影響   |
| ------------ | ------ |
| スコープ     | _TODO_ |
| スケジュール | _TODO_ |
| コスト       | _TODO_ |
| 品質         | _TODO_ |
| 関係者       | _TODO_ |

## 3. 対応方針

| 項目     | 内容   |
| -------- | ------ |
| 原因     | _TODO_ |
| 対応策   | _TODO_ |
| 依存事項 | _TODO_ |
| 完了条件 | _TODO_ |

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
