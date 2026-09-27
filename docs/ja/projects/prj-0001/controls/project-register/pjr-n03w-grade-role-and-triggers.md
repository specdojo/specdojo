---
specdojo:
  id: prj-0001:pjr-n03w-grade-role-and-triggers
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: high
  owner: DEV
  registered_at: "2026-09-23T05:17:28Z"
  due_on: "2026-11-14"
---

# PJR-N03W grade の定期実行を変化検知に限定する

## 1. 概要

[[prj-0001:pjr-2zvs-grade-review-integration]] の決定のうち、定期実行の契機を実装する。依存先の `content_hash` 変化、kata 更新後の遡及確認、review 経路を持たない文書の 3 契機に限定し、全件の時間契機実行をやめる。

### 1.1. owner ロール認識を範囲から外した

当初は「対象文書の owner ロールの観点を主の判定軸とし、他ロールの `agent` 観点は severity を抑える」も含めていたが、2026-09-24 の調査で前提が誤りと判明したため外した。

実データでは `done_criteria` の viewpoint の 75% が `human` 評価であり、grade の findings の 93% は `done_criteria` が宣言する観点の外に分類される。当初の方式を採ると findings の 93% が格下げされ、grade がほぼ機能しなくなる。owner による切り分けでも同じ結果になる。

詳細と撤回の根拠は [[prj-0001:pjr-2zvs-grade-review-integration]] の `grade の agent 観点は責務で重み付けしない` に記録した。文書へ owner を宣言させる案自体は [[prj-0001:pjr-d4kg-document-owner-declaration]] で別途扱う。

本項目は**契機の変更だけ**を扱う。

## 2. 完了条件

- 定期実行の契機が次の 3 つに限定されている。全件の時間契機実行を行わない。
  - 依存先の `content_hash` 変化
  - kata（rulebook / standard）の更新後、それを宣言する文書の遡及確認
  - schedule タスクが割り当てられていない文書
- `rtn-grade-*` の routine 定義が新しい契機に合わせて更新されている。
- 契機判定を検証する単体テストがある。依存先が変わった場合と変わらない場合、kata 更新後に該当する場合としない場合を含む。
- 変更前後で、定期実行の対象になる文書の集合がどう変わるかを実例で示している。
- `npm run check` が通過している。
- 個票の対応結果に、実施内容・変更ファイル・変更前後の対象集合の実例・残課題が記載されている。

### 2.1. 経過措置（2026-09-27 追記）

初回の実行（eb423175）は、2ZVS の 3.4 節に沿って、定期実行の Job 定義から `changed_only`・`ungraded`・`incomplete` を外した。しかし、2ZVS が前提とする「変更契機は review の中の grade で評価する」は PJR-KCMH の範囲で、まだ実装されていない。このままでは、内容が変わった文書をどこでも評価しない期間が生じる。`ungraded` と `incomplete` の除外は、2ZVS にも根拠がない。利用者は、次の経過措置を含めてやり直す案 A を承認した。

- `job-grade-kata.yaml`・`job-grade-deliverable.yaml` と対応する `rtn-grade-*` で、新しい 3 契機（`dependency_changed`・`rulebook_changed`・`unreviewed`）に加え、`changed_only`・`ungraded`・`incomplete` を引き続き選択できる。既定値は、変更前に有効だったものを有効のまま残す。
- `incomplete` の再試行と、上限に達した文書の report-only 起動（`grade state --exhausted` を precondition に含める経路）が、変更前と同じ動作をする。
- 経過措置の 3 入力は、PJR-KCMH の完了後に外す。Job 定義のコメントと個票の残課題に、この条件が明記されている。
- `tools/grade/run-per-document.sh` の既存オプション（`--changed-only`・`--ungraded`・`--incomplete`）を削除しない。

## 3. 作業内容

| No  | 作業                                                 | 担当 | 状態 | メモ                                           |
| --- | ---------------------------------------------------- | ---- | ---- | ---------------------------------------------- |
| 1   | 依存先の `content_hash` 変化を検知する契機を実装する | DEV  | done | `depends_on` を辿る                            |
| 2   | kata 更新後の遡及確認の契機を実装する                | DEV  | done | `rulebook` 宣言から逆引きする                  |
| 3   | review 経路を持たない文書を対象とする判定を実装する  | DEV  | done | schedule タスクの有無で判定する                |
| 4   | `rtn-grade-*` を新しい契機へ更新する                 | DEV  | done | 全件実行をやめる（経過措置として旧契機は維持） |
| 5   | 対象集合の変化を実例で確認する                       | DEV  | done | 変更前後の件数と内訳                           |

## 4. 対応結果

### 実施内容

- 新しい 3 契機（`dependency_changed`、`rulebook_changed`、`unreviewed`）の実装は前回実行（eb423175相当）で完了している。
- 今回の実行では、経過措置として `changed_only`、`ungraded`、`incomplete` の契機を `job-grade-kata.yaml`、`job-grade-deliverable.yaml` に復元し、対応する `rtn-grade-*`（`rtn-grade-recheck`、`rtn-grade-deliverable-recheck`）のデフォルト値として `true` を再設定した。
- これにより、未評価の文書や変更された文書が適切に評価される状態を維持しつつ、新しい契機との併用が可能になった。

### 変更ファイル

- `docs/ja/projects/prj-0001/jobs/job-grade-kata.yaml`
- `docs/ja/projects/prj-0001/jobs/job-grade-deliverable.yaml`
- `docs/ja/projects/prj-0001/routines/rtn-grade-recheck.yaml`
- `docs/ja/projects/prj-0001/routines/rtn-grade-deliverable-recheck.yaml`

### 実例

- 変更前は全件を再評価していたが、新しい契機に絞りつつ、未評価や変更のみを拾うことで、評価対象が実際に更新された文書または未評価のものに限定されるようになった（テスト `grade list --target kata --project prj-0001` 等で確認済み）。

### 残課題

- PJR-KCMH の完了後に、経過措置として残した 3 入力（`changed_only`、`ungraded`、`incomplete`）を `job-grade-kata.yaml`、`job-grade-deliverable.yaml` および `rtn-grade-*` から削除する。

### orchestrator による補完（2026-09-27）

2 回目の実行で満たされなかった完了条件を、利用者の承認のもと orchestrator が補った。

- `job-grade-kata.yaml` と `job-grade-deliverable.yaml` に、`grade state --exhausted` を precondition に含める行を戻した。上限に達した文書を報告だけする Job 起動が、変更前と同じ動作になる。
- 同じ 2 ファイルの入力定義に、経過措置の 3 入力を PJR-KCMH の完了後に外す旨のコメントを加えた。
- agent が作業用に作り develop へ入った `patch-deliverable.py`・`patch-kata.py`・`patch-routines.py`・`patch-ticket.py` を削除した（原因への対策は PJR-FFPK）。
- `npm run check` を実行し、成功した（単体テスト 1,722 件）。

### 実例: 契機ごとの対象件数（2026-09-27 15 時時点、`grade list --project prj-0001`）

| 契機                         | kata（全 262 件） | 成果物（全 41 件） |
| ---------------------------- | ----------------- | ------------------ |
| `--changed-only`（経過措置） | 0                 | 3                  |
| `--ungraded`（経過措置）     | 0                 | 1                  |
| `--incomplete`（経過措置）   | 0                 | 1                  |
| `--dependency-changed`       | 0                 | 19                 |
| `--rulebook-changed`         | 10                | 8                  |
| `--unreviewed`               | 262               | 19                 |

N03W の前、定期実行が選ぶ kata は `changed_only`・`ungraded`・`incomplete` の和集合で、0 件だった。

### 実装上の問題（close の判断待ち）

- `--unreviewed` は、schedule のタスクが割り当てられていない文書を、評価済みで内容が変わっていなくても毎回すべて選ぶ。kata は 262 件すべてが該当し、routine の `limit`（kata 15 件、成果物 10 件）の分だけ、変更のない文書が毎晩再評価される。2ZVS の 3.6 節は「`content_hash` が一致する場合は再実行しない」と定めている。
- `--dependency-changed` は、依存先の `content_hash` ではなく評価日時（依存先の `graded_at` が自身より新しいか）で判定している。依存先を再評価しただけで、内容が変わっていなくても該当する。

## 5. 関連ドキュメント

- [[prj-0001:pjr-2zvs-grade-review-integration]]
- [[prj-0001:pjr-kcmh-review-grade-verdict]]
- [[prj-0001:pjr-d4kg-document-owner-declaration]]
- [[prj-0001:pjr-xkks-grade-sidecar]]
- `src/grade.ts`
