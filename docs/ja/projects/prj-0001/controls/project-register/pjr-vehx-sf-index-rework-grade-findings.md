---
specdojo:
  id: prj-0001:pjr-vehx-sf-index-rework-grade-findings
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: medium
  owner: ARC
  registered_at: "2026-11-15T11:12:09Z"
  commit_type: docs
  commit_scope: sf
  approach: fully-guided
  targets:
    - sf-index
---

# PJR-VEHX sf-index を grade の指摘で手直しする（P-06 の境界のずれとテスト対象との照合）

## 1. 概要

最新の grade の指摘を取り込み、機能の境界とテスト対象との対応を直す

## 2. 入力

- kata-wave-1 の確定（T-KATA-WAVE-1-sf-index-140）で差し戻した（indie が 2026-11-15 に判断、PJR-TN43）。grade は needs-work 75 点で完了条件 0/5
- 主な指摘: SF-ROUT-02 が実行の行だが、対応する P-06 はジョブの定義の領域で境界がずれている。全機能 ID と業務領域をテスト対象と照らした記録がない。Q-01・Q-03 の留保（PJR-AK5V）は残す

## 3. 完了条件

- `SF-ROUT-02` と P-06（ジョブの定義）の対応を正し、機能の境界と、業務プロセスの領域ごとの対応がずれていない。必要なら行を分けるか、定義と実行の機能を別の ID にする。
- 全機能 ID と業務領域を、テスト対象（どの検証で確かめるか）と照らした対応表がある。
- Q-02 の方針（領域ごとに代表の BPS だけを依存にする）と、一覧の各行の参照先が食い違っていない。
- 本文に書いた人間の PO の判断と、期限付きの留保（追跡先の PJR）を消さずに保っている。
- 成果物の `status` は `draft` のまま変えない（確定は人が T-KATA-WAVE-1 の 140 で行う）。
- 直した後に `grade run --target deliverable` で grade し直し、成果物カタログの完了条件をすべて満たす（留保の範囲だけが未充足として残る場合は、その理由を対応結果に書く）。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:catalog` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                             | 担当 | 状態 | メモ |
| --- | ------------------------------------------------ | ---- | ---- | ---- |
| 1   | 最新の grade の指摘を取り込み、P-06 の境界を直す | ARC  | open | -    |
| 2   | テスト対象との対応表を足す                       | ARC  | open | -    |
| 3   | grade し直して結果を書く                         | ARC  | open | -    |

## 5. 対応結果

実施内容（2026-11-16、ARC / executor）:

- `SF-ROUT-02`（ジョブ実行）は意味を変えずに残し、`P-06`（ジョブ定義）に当たる定義の検証・表示を `SF-ROUT-03`（ジョブ定義管理、CLI `job`）として新たに採番した。判断: 機能 ID の意味を変えない規則（[[specdojo:sf-index-rulebook]]）を守るため、行を分けて新 ID にした。実行の入口は CLI コマンドリファレンスの `job` 節に従い `exec run --job` とし、`SF-ROUT-02` の CLI を `exec` に直した。ジョブの実行だけを扱う業務プロセス領域はないため、起動元の `P-05` へ対応付け、_ASSUMPTION_ として `Q-01` の照合に含めた。
- 全機能 ID を業務プロセス領域・代表の BPS・テスト対象・検証手段（単体／統合）と照らす表（「業務領域・テスト対象との照合」）を足した。検証手段はテスト仕様を作るときの起点の区分で、既存テストの有無は示さない。
- `Q-02` の「領域ごと」は機能領域ごとと解釈した（PO の決定文が、各行の BPS がすべて依存にあるとは限らないとしているため）。この解釈で照らすと、機能領域 `ORCH`（`P-14`）だけ代表の BPS が `depends_on` にない。成果物カタログの変更は本タスクの対象外のため、照合表で不一致と示し、`Q-02` に完了条件と判断時点（確定の前）を足した。
- `SF-EXEC-01` に `P-11` の [[prj-0001:bps-task-completion]] を、`SF-DEPR-01` に保管の `bps-deprecation-storage` を参照先として足した（カタログの領域・概要と一致させるため）。
- 読者に加えて保守担当（ARC）、確認の記録先、公開範囲、PO の承認前の確認を目的と対象範囲に足した。未決事項に影響する機能・判断時点・完了条件・追跡先の列を足した。PO の判断（2026-11-15）と留保の追跡先 PJR-AK5V は消さずに残した。`status` は `draft` のまま。

残課題:

- `ORCH` の代表の BPS をカタログの `depends_on` に加えるか対象外とするかを PO が決める（PJR は未起票。PM が起票する）。
- 再 grade（`grade run --target deliverable`）は runner または人が実行する。BPS 本文との照合（`Q-01`・`Q-03`）は PJR-AK5V の留保として残る。

## 6. 関連ドキュメント

- [[prj-0001:pjr-tn43-user-decisions-pending]]
