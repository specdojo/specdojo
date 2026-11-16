---
specdojo:
  id: prj-0001:pjr-dh8e-rate-limit-on-non-critical-unused
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: low
  registered_at: "2026-11-12T13:24:54Z"
---

# PJR-DH8E exec-defaults の rate_limit_policy.on_non_critical が、今の振る舞いに使われていない

## 1. 課題内容

schema は on_non_critical.action: skip を必須にしているが、runWithRetry はクリティカルパスの内外にかかわらず次の候補へ切り替えて再試行し、この項目を読まない

## 2. 入力

- 2026-11-12 の用語集 gl-setup の review（grade needs-work 87）で、利用枠制限時の方針の説明が exec 設定ガイドと実装に食い違うと指摘された。調べると schema の `on_non_critical` が実装（src/exec/run/agent.ts の runWithRetry、src/exec/agent-config.ts の型）から読まれていなかった
- 用語集は今の振る舞いに合わせて直した。schema の項目を消すか意味を書き直すかは、既存の設定ファイルへの影響があるため 0.8.0 では扱わず、次の版の候補とする（indie が 2026-11-12 に承認）

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
