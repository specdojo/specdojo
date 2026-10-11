---
specdojo:
  id: prj-0001:pjr-a9nc-register-title-placeholder-check
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-10-01T04:30:47Z"
  completed_at: "2026-10-02T07:23:25Z"
  conclusion: register add / update のタイトルと説明で、コードスパン外の山括弧プレースホルダを自動でインラインコードに囲む
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

- `register add` の個票生成時と `register update` のタイトル更新時に、既存の共通処理でコードスパン外の山括弧プレースホルダをインラインコード化するようにした。
- 説明に対する既存の変換と同じ規則を使うため、連結したファイル名を一つのコードスパンに保ち、既にインラインコードで囲まれた値は二重化しない。
- CLI 回帰テストで `add` / `update` のタイトルと説明を確認し、タイトル更新の単体テストで既存コードスパンの保持も確認した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-1sxk-refs-trailer-project-qualified-id]]
