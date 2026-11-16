---
specdojo:
  id: prj-0001:pjr-1y1m-commit-scope-excluded-changes-silent
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  registered_at: "2026-11-13T21:50:32Z"
---

# PJR-1Y1M executor の変更が commit の対象外になっても、統合が黙って進む

## 1. 課題内容

executor が対象外のファイル（カタログ・schema・型のメニュー）を直しても、commit の対象から外れて統合に入らず、develop で検査が落ちてから気づく

## 2. 入力

- 2026-11-14 の kata-wave-1 で 3 回起きた。bes-index のカタログの依存、ifx-index の esil.schema.yaml、型のメニュー（sidebar-config.ts）の直しが統合に入らず、worktree は統合の後に片付けられて直しが消えた
- 型の文書を作るタスクでは、カタログ・schema・メニューも直す範囲に入る。commit の対象をそこまで広げるか、対象外の変更が残ったら統合を止めて知らせる必要がある。commit-scope の「unresolved target doc id」の警告とも合わせて確かめる

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
