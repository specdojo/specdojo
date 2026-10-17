---
specdojo:
  id: prj-0001:pjr-jsey-exec-run-split-smoke
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: low
  owner: DEV
  registered_at: "2026-10-14T15:10:59Z"
  due_on: null
  conclusion: runner のコードの分割 5 件と、runner に関わる移動 2 件（PJR-MHHP・PJR-XP0J）の統合ごとに、分割後の runner で executor・親の検証・reporter・統合まで通ることを確かめた
---

# PJR-JSEY exec-run.ts の分割後に runner の動作を確かめる

## 1. 概要

exec-run.ts の分割（PJR-3W2N・PJR-2JFM・PJR-GBPX）の統合ごとに、分割後の runner で exec run --register を 1 件流し、executor・親の検証・reporter・統合まで終わることを確かめるための動作確認用の項目

## 2. 完了条件

- 本個票の「対応結果」の表に、実行した日時（JST）、対象の分割の項目 ID、実行した agent の nickname を 1 行追記する。対象の分割の項目 ID は、実行時点で `review` または `done` になっている runner のコードの分割と移動の項目（PJR-3W2N・PJR-2JFM・PJR-GBPX・PJR-13M6・PJR-NA04・PJR-MHHP・PJR-XP0J・PJR-BZ9J・PJR-MX4F・PJR-DT3Q・PJR-GBWW・PJR-CY80）のうち最も新しく統合されたものとする。
- 本個票以外のファイルは変更しない。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通り、統合まで終わる。

## 3. 作業内容

| No  | 作業                        | 担当 | 状態 | メモ                       |
| --- | --------------------------- | ---- | ---- | -------------------------- |
| 1   | 対応結果の表に 1 行追記する | DEV  | open | 分割の統合ごとに再実行する |

## 4. 対応結果

| 日時（JST）      | 対象の分割 | agent                 |
| ---------------- | ---------- | --------------------- |
| 2026-10-15 00:12 | PJR-3W2N   | codex-expert-executor |
| 2026-10-15 00:35 | PJR-2JFM   | codex-expert-executor |
| 2026-10-15 02:44 | PJR-GBPX   | codex-expert-executor |
| 2026-10-15 19:37 | PJR-13M6   | codex-expert-executor |
| 2026-10-15 20:00 | PJR-NA04   | codex-expert-executor |
| 2026-10-17 16:04 | PJR-MHHP   | codex-expert-executor |
| 2026-10-17 17:07 | PJR-XP0J   | codex-expert-executor |
| 2026-10-17 17:49 | PJR-BZ9J   | codex-expert-executor |
| 2026-10-17 18:58 | PJR-MX4F   | codex-expert-executor |
| 2026-10-17 19:47 | PJR-DT3Q   | codex-expert-executor |
| 2026-10-17 20:47 | PJR-GBWW   | codex-expert-executor |

## 5. 関連ドキュメント

- [[prj-0001:pjr-3w2n-exec-run-split-shared]]
- [[prj-0001:pjr-2jfm-exec-run-split-modes]]
- [[prj-0001:pjr-gbpx-exec-run-split-register]]
