---
specdojo:
  id: prj-0001:pjr-k8f1-provider-cli-timeout
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  difficulty: hard
  registered_at: "2026-11-22T12:24:42Z"
  derived_from:
    - PJR-39AB
---

# PJR-K8F1 agent の CLI の起動に時間の上限がなく、固まると run が枠を占め続ける

## 1. 課題内容

executeAgent は provider の CLI を起動したあと終了を待つだけで、時間の上限も打ち切りも子プロセスの停止もない。agent が固まると run と実行枠が無期限に占められる（sysd-cross-cutting-policy の TIM-001）。

## 2. 入力

- PJR-39AB の照合（2026-11-22）: src/exec/run/agent.ts の executeAgent は spawn のあと close を待つだけで、時間上限と打切りがない。shell: true で起動し、孫プロセスを止める処理もない。設定のキーもない。
- ほかの経路は上限がある: 親の検証は 10 分で SIGTERM、10 秒後に SIGKILL。command Job の step は `timeout_seconds` で、SIGTERM 後 1 秒で SIGKILL。
- 39AB の案: 上限と SIGTERM から SIGKILL へのプロセスグループの停止を入れ、設定キーは exec-defaults.yaml の provider 別に置く。上限の値は人が決める。
- 利用者の承認（2026-11-22、indie）で起票した。39AB の直す案 6 件のうち、この 1 件だけを起票する。担当と期限は未定。

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
