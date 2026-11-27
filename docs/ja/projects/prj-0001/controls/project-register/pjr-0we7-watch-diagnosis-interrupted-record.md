---
specdojo:
  id: prj-0001:pjr-0we7-watch-diagnosis-interrupted-record
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-11-27T23:23:51Z"
  due_on: "2026-12-31"
  derived_from:
    - PJR-YNQG
---

# PJR-0WE7 途中で落ちた見張りの診断が「診断中」のまま残り、その止まりが二度と診断されない

## 1. 課題内容

診断の agent の実行中にプロセスが落ちると、診断の記録が running のまま残り、同じ止まりは以後診断されない。朝報告の診断の節も失われる

## 2. 入力

- 2026-11-28 08:12 JST の見張り（orchestrator watch-scan）で PJR-VEHX の診断を起動した後、コンテナの再起動でプロセスが落ちた
- 診断の記録（execution/watch/diagnoses/ の JSON）は status: running のまま残った。起動前に予約して同じ止まりを二度起こさない作りのため、PJR-VEHX は以後診断されない
- 朝報告 watch-scan-20261128.md は描き直された後、第 7 節「agent の診断案」を書く前に落ちたため、節が消えた。--no-diagnosis で流し直して復旧した
- 診断の lock（.launch-lock）は心拍が 30 秒途絶えれば次の起動が外すため、手当ては要らなかった
- 直し方（持ち主のプロセスが動いていない running を interrupted として扱い 1 回だけ起こし直す、先に診断の節を書いておく、など）は executor が決め、理由を個票の対応結果に書く（担当 DEV・期限 2026-12-31 は indie の指示、2026-11-28）

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
