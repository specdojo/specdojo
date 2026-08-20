---
specdojo:
  id: prj-0001:pjr-cmyx-exec-dist-parent-validations
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  registered_at: "2026-08-20T12:28:52Z"
---

# PJR-CMYX exec 実行が古い dist ビルドを使い設定済み parent_validations が実行されない

## 1. 課題内容

specdojo の bin は dist/specdojo.js を指すため、npm run build を再実行しない限り古い挙動で exec run が動く。PJR-STRG の run（2026-08-18）では dist が 2026-08-15 12:33 のビルド（コミット be20ceb2 相当）で、parent_validations 機能を追加した 19eea172（2026-08-16）を含んでいなかった。その結果 exec-defaults.yaml の pipeline.parent_validations: [test-integration] が設定済みにもかかわらず npm run test:integration が実行されず、evidence にも記録が残らなかった。設定した検証が沈黙して省略されるため、dist の鮮度検証・実行時警告・tsx 直接実行への統一などの恒久対応を検討する。

## 2. 影響範囲

| 観点         | 影響   |
| ------------ | ------ |
| スコープ     | _TODO_ |
| スケジュール | _TODO_ |
| コスト       | _TODO_ |
| 品質         | _TODO_ |
| 関係者       | _TODO_ |

## 3. 対応方針

| 項目     | 内容                                                                                                                 |
| -------- | -------------------------------------------------------------------------------------------------------------------- |
| 原因     | `specdojo` の bin が `dist/specdojo.js` を指し、当該 dist が `parent_validations` 追加コミット以前のビルドだったため |
| 対応策   | _TODO_                                                                                                               |
| 依存事項 | _TODO_                                                                                                               |
| 完了条件 | _TODO_                                                                                                               |

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
