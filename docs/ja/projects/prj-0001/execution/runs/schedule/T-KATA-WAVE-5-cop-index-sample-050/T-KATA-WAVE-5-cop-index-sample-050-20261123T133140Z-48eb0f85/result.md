---
specdojo:
  id: prj-0001:xer-t-kata-wave-5-cop-index-sample-050-20261123t133140z-48eb0f85
  type: exec-result
  task_id: T-KATA-WAVE-5-cop-index-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-5-cop-index-sample-050/T-KATA-WAVE-5-cop-index-sample-050-20261123T133140Z-48eb0f85/plan.md
  started_at: "2026-11-23T13:31:49.381Z"
  completed_at: "2026-11-23T13:52:39.421Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:cop-index-sample
    - specdojo:cop-index-sample
---

# Edit Result

## 1. 実施内容

- `docs/ja/specdojo/samples/cop-index-sample.md` を rulebook の 10 章構成に基づき、駄菓子屋きぬや の切替シナリオを用いた完成例へと書き換えました。
- 主な変更点として、「概要（index）」章を新設し、切替対象と対象外の範囲を明示しました。また、判定点（GO/NO-GO）の条件、作業タイムライン、ロールバックの方針、および周知に関する詳細を具体的な値（`_UNDECIDED_` や `_ASSUMPTION_` を含む）で構成しました。
- finding で指摘された「未解決事項」の表を削除し、代わりに本文中に `_UNDECIDED_` を用いた具体的な未決事項を組み込むことで、rulebook の禁止事項に適合させています。
- 文末には「関連ドキュメント」章を設け、`mip-index` や `dmd-index` などの分冊との依存関係を明示しました。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/cop-index-sample.md`: rulebook の 10 章構成に従い、駄菓子屋きぬや の切替シナリオを用いた完成例へ更新。概要、判定条件、タイムライン、ロールバック方針、周知、および関連ドキュメントの章を追加し、未決定事項を `_UNDECIDED_` 等で記述。

## 3. 申し送り

- F003・F007・F008（未解決事項の表）: sample の記述標準が rulebook にない章を禁じるため「未解決事項」の章を削除し、未定の値を本文の `_UNDECIDED_` / `_ASSUMPTION_` に置き換えた。判断者・期限・影響を持つ表として残すかは未決。
- 利用者が決める値: 切替日（`_UNDECIDED_`、店主代表が移行リハーサルの結果を見て決める）。作業の所要時間（T+0:10〜T+2:30）は `_ASSUMPTION_` で、`mtp-index` の結果で確かめる必要がある。営業時間（9 時開始・18 時閉店）、障害判断の 15 分、告知を 1 週間前から出すことも推測の値。
- rulebook の変更案: 全体方針は当日の判定結果と障害だけを登録簿への転記対象としている。切替日のような計画段階の未決事項の扱い（`_UNDECIDED_` で本文に残すか、登録簿へ転記するか）を記述ガイドに足す。
- 申し送り: 分冊の `cop-sample.md` は、今回直す前のこの sample と同じく中身のない状態で、同じ方針で直す必要がある。

## 4. 進め方と実践の型の適用

rulebook の 10 章構成を遵守し、`_UNDECIDED_` や `_ASSUMPTION_` を活用して、将来的に具体的な値が決まることを前提とした「完成例としての型」を構築することに重点を置きました。
