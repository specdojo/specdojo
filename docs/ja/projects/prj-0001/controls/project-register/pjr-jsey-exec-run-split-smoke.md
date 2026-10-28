---
specdojo:
  id: prj-0001:pjr-jsey-exec-run-split-smoke
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: low
  owner: DEV
  registered_at: "2026-10-14T15:10:59Z"
  due_on: null
  completed_at: "2026-10-28T14:25:59Z"
  conclusion: PJR-EXH2 の統合後、exec run --register が start から review まで通り、event の actor に sonnet-executor が記録された
---

# PJR-JSEY runner 変更後の exec run 動作を確かめる

## 1. 概要

runner・register・exec のコード変更を統合した後に exec run --register を 1 件流し、executor・親の検証・reporter・統合まで終わることを確かめるための動作確認用の項目

## 2. 完了条件

- 本個票の「対応結果」の表に、実行した日時（JST）、確認対象の項目 ID、実行した agent の nickname を 1 行追記する。確認対象の項目 ID は、実行時点で `review` または `done` になっている runner・register・exec のコード変更の項目（PJR-3W2N・PJR-2JFM・PJR-GBPX・PJR-13M6・PJR-NA04・PJR-MHHP・PJR-XP0J・PJR-BZ9J・PJR-MX4F・PJR-DT3Q・PJR-GBWW・PJR-CY80・PJR-BHMH・PJR-H06F・PJR-YK1C・PJR-TSP6・PJR-E025・PJR-NJ6J・PJR-6EF8・PJR-T46Y・PJR-8WBN・PJR-6DHY・PJR-E412・PJR-NS8Y・PJR-283N・PJR-G90K・PJR-0EFN・PJR-DKD8・PJR-A6PV・PJR-5HYP・PJR-XRAB・PJR-HE9R・PJR-W93C・PJR-CNNT・PJR-Q4CD・PJR-5B42・PJR-CT6G・PJR-EKRW・PJR-C95G・PJR-ZV60・PJR-SS72・PJR-68KR・PJR-R1FB・PJR-84F7・PJR-JJBY・PJR-6HS2・PJR-XTE6・PJR-P14M・PJR-6WQY・PJR-K87Y・PJR-XSM8・PJR-H988・PJR-8NWR・PJR-6RVJ・PJR-B4Y4・PJR-WAGY・PJR-484B・PJR-0D0T・PJR-EXH2）のうち最も新しく統合されたものとする。
- 本個票以外のファイルは変更しない。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通り、統合まで終わる。

## 3. 作業内容

| No  | 作業                        | 担当 | 状態 | メモ                              |
| --- | --------------------------- | ---- | ---- | --------------------------------- |
| 1   | 対応結果の表に 1 行追記する | DEV  | done | PJR-EXH2 の統合後の実行を記録した |

## 4. 対応結果

| 日時（JST）      | 確認対象 | agent                  |
| ---------------- | -------- | ---------------------- |
| 2026-10-15 00:12 | PJR-3W2N | codex-expert-executor  |
| 2026-10-15 00:35 | PJR-2JFM | codex-expert-executor  |
| 2026-10-15 02:44 | PJR-GBPX | codex-expert-executor  |
| 2026-10-15 19:37 | PJR-13M6 | codex-expert-executor  |
| 2026-10-15 20:00 | PJR-NA04 | codex-expert-executor  |
| 2026-10-17 16:04 | PJR-MHHP | codex-expert-executor  |
| 2026-10-17 17:07 | PJR-XP0J | codex-expert-executor  |
| 2026-10-17 17:49 | PJR-BZ9J | codex-expert-executor  |
| 2026-10-17 18:58 | PJR-MX4F | codex-expert-executor  |
| 2026-10-17 19:47 | PJR-DT3Q | codex-expert-executor  |
| 2026-10-17 20:47 | PJR-GBWW | codex-expert-executor  |
| 2026-10-17 21:04 | PJR-CY80 | codex-expert-executor  |
| 2026-10-18 08:51 | PJR-BHMH | codex-expert-executor  |
| 2026-10-18 11:09 | PJR-H06F | agy-expert-executor    |
| 2026-10-18 17:12 | PJR-YK1C | claude-expert-executor |
| 2026-10-18 18:45 | PJR-TSP6 | claude-expert-executor |
| 2026-10-18 19:06 | PJR-E025 | claude-expert-executor |
| 2026-10-18 20:09 | PJR-NJ6J | claude-expert-executor |
| 2026-10-18 21:58 | PJR-6EF8 | claude-expert-executor |
| 2026-10-19 00:08 | PJR-T46Y | sonnet-executor        |
| 2026-10-19 00:20 | PJR-T46Y | sonnet-executor        |
| 2026-10-19 00:39 | PJR-8WBN | sonnet-executor        |
| 2026-10-19 02:44 | PJR-283N | sonnet-executor        |
| 2026-10-19 03:14 | PJR-G90K | sonnet-executor        |
| 2026-10-19 03:41 | PJR-0EFN | sonnet-executor        |
| 2026-10-20 07:03 | PJR-DKD8 | sonnet-executor        |
| 2026-10-20 07:23 | PJR-A6PV | sonnet-executor        |
| 2026-10-20 22:39 | PJR-5HYP | sonnet-executor        |
| 2026-10-21 06:50 | PJR-HE9R | sonnet-executor        |
| 2026-10-21 23:25 | PJR-W93C | sonnet-executor        |
| 2026-10-22 08:23 | PJR-CNNT | sonnet-executor        |
| 2026-10-22 21:45 | PJR-5B42 | sonnet-executor        |
| 2026-10-23 08:19 | PJR-CT6G | sonnet-executor        |
| 2026-10-23 23:56 | PJR-EKRW | sonnet-executor        |
| 2026-10-24 09:10 | PJR-C95G | sonnet-executor        |
| 2026-10-24 18:58 | PJR-ZV60 | sonnet-executor        |
| 2026-10-25 00:03 | PJR-68KR | sonnet-executor        |
| 2026-10-25 08:55 | PJR-84F7 | sonnet-executor        |
| 2026-10-25 10:57 | PJR-XTE6 | sonnet-executor        |
| 2026-10-26 06:21 | PJR-K87Y | sol-executor           |
| 2026-10-27 21:35 | PJR-XSM8 | sonnet-executor        |
| 2026-10-28 00:31 | PJR-8NWR | sonnet-executor        |
| 2026-10-28 08:36 | PJR-6RVJ | sonnet-executor        |
| 2026-10-28 09:18 | PJR-B4Y4 | sonnet-executor        |
| 2026-10-28 09:47 | PJR-WAGY | sonnet-executor        |
| 2026-10-28 20:02 | PJR-484B | sonnet-executor        |
| 2026-10-28 21:30 | PJR-0D0T | sonnet-executor        |
| 2026-10-28 23:15 | PJR-EXH2 | sonnet-executor        |

今回の確認対象は、対象一覧のうち最新の統合コミット `fff3641cf`（2026-10-28 23:13 JST）を持つ PJR-EXH2 とした。実行した agent は、sonnet-executor である（start の event の actor は後続段で確認する）。

申し送り: executor 段階では表への追記までを実施した。親 runner の 7 検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）、reporter の result 記入、統合、`review` 遷移の完了は後続段で確認する。

### 前回の統合後の確認（2026-10-26）

- `PJR-JSEY` の start と review の event は、どちらも実体 actor `sol-executor` を記録した。結果文書は `complete`、親の検証 7 件はすべて `passed` で、統合 commit `c1244c193` まで完了した。
- executor が変更した本文は本個票だけだった。runner が生成した plan・result・evidence と状態イベントを確認した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-3w2n-exec-run-split-shared]]
- [[prj-0001:pjr-2jfm-exec-run-split-modes]]
- [[prj-0001:pjr-gbpx-exec-run-split-register]]
