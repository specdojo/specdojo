---
specdojo:
  id: prj-0001:pjr-aegn-claude-five-hour-limit-detection
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-11-25T22:34:18Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-0BGE
---

# PJR-AEGN claude の 5 時間の利用枠の上限を検出できず、代わりの agent に切り替わらない

## 1. 課題内容

claude の 5 時間の利用枠の上限（You've hit your 5-hour limit）で止まったタスクが、上限ではなくふつうの失敗として block になり、--on-rate-limit fallback の代わりの agent に切り替わらない。見張りも分類できない。

## 2. 入力

- 2026-11-26 01:25〜01:33 JST、全件レビューで 10 件が数秒で止まった。evidence の `final_message` は「You've hit your 5-hour limit · resets 2:20am (Asia/Tokyo)」、`block_reason` は「agent exited with non-zero code」（1 件は reporter exited with failure）。
- exec-defaults の claude の `rate_limit_detection.stderr_patterns` は rate limit・429・overloaded・session limit だけで、5-hour limit を含まない。src/exec/limit.ts には 5-hour limit の分類がある。文言は stderr ではなく stdout に出ている。
- rtn-exec-watch-scan の 1 回の実行（2026-11-26）では、この 10 件が「分けられなかった」に分類された。
- exec-defaults.yaml は保護された設定のため、変更が要る場合は案を個票の対応結果に書き、反映は利用者の承認のもと feature ブランチで行う。

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
