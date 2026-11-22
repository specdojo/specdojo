---
specdojo:
  id: prj-0001:pjr-kzzm-unknown-actor-reserved-names
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: low
  owner: DEV
  registered_at: "2026-11-22T11:16:18Z"
  due_on: "2026-11-30"
---

# PJR-KZZM Unknown actor のエラーの文に、受け付ける予約名が並ばない

## 1. 課題内容

exec などの --by は予約名（SpecDojo・specdojo-orchestrator・night-orchestrator）も受け付けるのに、Unknown actor のエラーの文には名簿の nickname しか並ばず、予約名を使えることに気づけない。

## 2. 入力

- assertValidExecActor は `RESERVED_REGISTER_ACTORS` を受け付けてから assertValidActor を呼ぶが、エラーの文は名簿の nickname だけを並べる（src/shared/specdojo-config.ts）。
- 利用者の承認（2026-11-22、indie）で起票した。担当 DEV、期限 2026-11-30。

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
