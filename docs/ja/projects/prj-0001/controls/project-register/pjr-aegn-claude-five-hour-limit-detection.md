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
  difficulty: medium
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

| 観点         | 影響                                                                             |
| ------------ | -------------------------------------------------------------------------------- |
| スコープ     | agent の利用枠の上限の検出（`src/exec/run/`・`src/exec/limit.ts`）と見張りの分類 |
| スケジュール | 夜間の一括実行が、claude の 5 時間の上限のたびに止まり、朝まで進まない           |
| コスト       | 止まったタスクの手での再開と、そのための確かめの手間                             |
| 品質         | 上限の止まりがふつうの失敗として記録され、見張りも分類できない                   |
| 関係者       | DEV（実装）、オーケストレーター（夜間の実行の運用）                              |

## 4. 対応方針

| 項目     | 内容                                                                                                                          |
| -------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 原因     | 上限の検出は stdout と stderr を合わせた出力を見るが、claude の検出の文言に `5-hour limit` がない。見張りの分類の規則にもない |
| 対応策   | 5 時間の上限の文言を session limit として検出し、代わりの agent へ切り替える。見張りの分類でも使用枠の上限に分ける            |
| 依存事項 | `exec-defaults.yaml` を変える場合は、利用者の承認のもとで反映する                                                             |
| 完了条件 | 「完了条件」の章のとおり                                                                                                      |

## 5. 完了条件

- claude が 0 以外で終わり、出力に「You've hit your 5-hour limit · resets …」が出たとき、session limit として検出する。
- 検出したとき、`--on-rate-limit fallback` なら代わりの agent に切り替える。executor の段と reporter の段で同じに扱う。
- 直し方（CLI の既定の検出に足す、`exec-defaults.yaml` の claude の `stderr_patterns` に足す、の片方か両方）は executor が決め、理由を個票の対応結果に書く。`exec-defaults.yaml` を変える場合は案として書く。
- 見張りの分類（`src/exec/watch-scan-classify.ts`）で、2026-11-26 01:25〜01:33 JST の 10 件と同じ形の止まりが使用枠の上限（`usage_limit`）に分かれる。
- 0 で終わった出力にこの文言が含まれていても、上限として検出しない。
- 単体テストで、上の検出・切り替え・分類・誤検出しないことを確かめる。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証を通す。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 保護された設定（`.specdojo/exec-defaults.yaml`・オーケストレーターの本文など）は変えない。変更が要る場合は、案を個票の対応結果と報告の `handoff` に書く。反映は利用者の承認のもとで行う。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 統合の後に、オーケストレーターが実際の run を流して動きを確かめてから close する（executor は行わない）。

## 6. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 7. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
