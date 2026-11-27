---
specdojo:
  id: prj-0001:pjr-ps0r-external-project-missing-path
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-27T10:39:51Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-VM2S
---

# PJR-PS0R 外部の project の置き場がないと、設定の読み込みでどのコマンドも止まる

## 1. 課題内容

external_projects の path が見つからないとき、設定の読み込みがエラーになり、外部の project を使わないコマンドも止まる。GitHub の検査（Check register branch push・Check execution record layout）が 11-26 から失敗し続けている

## 2. 入力

- d7d8cdf7e8（11-26）で `external_projects.prj-0002`（path: ../specdojo-prj-0002）を足してから、GitHub の Check register branch push と Check execution record layout が、置き場がないエラーで失敗し続けている。検査のサーバーは specdojo のリポジトリだけを checkout する
- エラーは src/shared/specdojo-config.ts の検証で出る: `external_projects.prj-0002.path` "../specdojo-prj-0002" does not exist
- 利用者（indie）は、置き場がないことは警告にとどめ、使うときだけエラーにする案 B を選んだ。マシンごとの設定（specdojo.local.config.json）へ置き場を移せるかは、この項目で確かめて記録する（2026-11-27）

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
