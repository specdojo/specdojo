---
specdojo:
  id: prj-0001:pjr-a9nc-register-title-placeholder-check
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-01T04:30:47Z"
---

# PJR-A9NC register add のタイトルに素の山括弧プレースホルダを入れられる

## 1. 課題内容

register add / update の --title と --description に、インラインコードで囲まない山括弧プレースホルダを入れると、個票の H1 が lint:fm に反し docs:build も失敗する。入力時に検出してエラーにするか、自動でインラインコードへ囲む

## 2. 影響範囲

| 観点         | 影響                                                    |
| ------------ | ------------------------------------------------------- |
| スコープ     | `register add` / `update` の `--title`・`--description` |
| スケジュール | 個票の H1 が lint:fm に反し、exec run の親検証が止まる  |
| コスト       | 入力の検査の追加とテスト                                |
| 品質         | docs:build が失敗する                                   |
| 関係者       | 登録簿を使う利用者と orchestrator                       |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                        |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | `--title` と `--description` の値をそのまま個票の H1 と本文へ書き、インラインコードで囲まない山括弧プレースホルダ（例: `<project-id>`）を検査していない                                                     |
| 対応策   | `register add` と `update` で、インラインコードの外にある山括弧プレースホルダを検出したら、対象の値と位置を示してエラーにする。lint:fm の検出規則（`remark-no-unescaped-placeholder` 相当）と同じ判定を使う |
| 依存事項 | なし                                                                                                                                                                                                        |
| 完了条件 | 素の山括弧プレースホルダを含む `--title` と `--description` が拒否され、インラインコードで囲んだものは受け付けられることを確かめる単体テストがある。親検証がすべて通る                                      |

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-1sxk-refs-trailer-project-qualified-id]]
