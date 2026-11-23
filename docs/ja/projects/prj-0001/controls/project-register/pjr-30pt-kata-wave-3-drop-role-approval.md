---
specdojo:
  id: prj-0001:pjr-30pt-kata-wave-3-drop-role-approval
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: hard
  owner: BA
  registered_at: "2026-11-23T00:01:39Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-325Y
  commit_type: docs
  commit_scope: kata
---

# PJR-30PT 第 3 波の型の rulebook と sample から文書の役割と承認の記述を外す

## 1. 概要

第 3 波の 13 種類は PJR-76N9 の決まりを strategy に足す前に 040・050 を終えていた。rg で 12 種類に文書の役割・承認・未決事項の承認の記述が見つかったので外す

## 2. 入力

- 第 3 波の 13 種類の 040・050・080・090 は 2026-11-21〜22 の朝に done。325Y で strategy に決まりを足したのはその後（2026-11-22 夜）
- 直してから grade を 1 回だけ流し、その後に 140 の人の確定へ進む（利用者の決定、2026-11-23）
- 未決事項の当面の扱いの承認も外す対象に含める（利用者の決定、2026-11-23）

## 3. 完了条件

- 第 3 波の 13 種類の型（`tsp-index`・`utc-index`・`utc`・`stc-index`・`stc`・`itc-index`・`itc`・`etc-index`・`etc`・`atc-index`・`atc`・`imp-test`・`trc-requirements-to-tests`）の rulebook と sample から、PJR-76N9 の決まりに反する記述を外す（利用者の決定、2026-11-23、indie）。13 種類は 040・050 の段を決まりを足す前（2026-11-21〜22）に終えていたため、決まりが効いていない。
- 外す対象は次の 2 種類とする。
  - 文書そのものの役割と承認: 文書を作る・確かめる・承認する役割の割り当て、本書の改訂や分割の承認者、`ready` への昇格や確定の条件と承認、承認・保留・差し戻しの進み具合。
  - 未決事項の当面の扱いの承認: 「ARC が確認し PO が承認する」のような、未決事項を誰が承認するかの記述。決まりでは承認と留保は登録簿の個票で追うため、当面の扱いの中身だけを残す。
- 外さない（対象外の）ものは、テストの中身としての判定とする。出口条件の判定者・例外承認者、受入の判定記録に残す実施者・証跡確認者・判定者のように、テストの進め方そのものとして役割を扱う記述は残す。rulebook の「共通の運用は正本を参照する」1 行も残す。
- 2026-11-23 にオーケストレーターが `rg` で見つけた場所は次のとおり。これを出発点とし、ほかにもないかを 26 文書で読んで探す。
  - `tsp-index-rulebook`: TSP の改訂の「担当: QE、承認: PO」。
  - `imp-test-rulebook`: 対応方針の承認・保留・差し戻しを PO が判断する記述、「だれ（Role code）が承認する文書か」を示させる記述、担当・承認者の書き方。`imp-test-sample`: 「PO が承認するための文書」「本書は PO による影響判断の承認をもって確定扱いとする」など。
  - `itc-index-sample`・`utc-index-sample`: 役割の表（同行レビュー担当、本書の改訂や分割を承認する技術メンター）と、改訂・分割の承認の記述。`itc-index-sample` の `ready` の前の確認と PO の承認。
  - `utc-sample`・`itc-sample`: 「DEV がケースを追加し、QE がレビューする」の文書の役割の記述。
  - `etc-sample`: 冒頭の「確認者」の行と、値をそろえて PO が承認した時点の記述。`etc-index-sample`: 「主担当・運用責任・確認者」の列と、未決事項の「ARC が確認、PO が承認」。
  - `atc-index-sample`・`atc-sample`・`stc-sample`・`tsp-index-sample`・`trc-requirements-to-tests-sample`: 未決事項の当面の扱いの承認（「BA が案を作成、PO が承認」「ARC が NFR へ起票し PO が承認する」など）。
  - `trc-requirements-to-tests-rulebook`・`atc-rulebook`: `ready` への昇格の条件と、人が判断する旨。
  - `stc-rulebook`: 「確認と合意」の役割ごとの合意と確認の記述。
- 行ごとに「外した」か「対象外（理由）」を決め、個票の対応結果に表で残す。外したことで rulebook の求めと sample が食い違うときは、両方をそろえて直す。
- 外すほかに中身は変えない。直したほうがよい点を見つけたら、個票の対応結果に書く。
- 型の grade は統合の後に orchestrator が 1 回流す（13 種類のうち、直した型）。executor は grade を実行しない。その後に 140 の人の確定へ進む。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。影響がなければ「なし」と書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- `npm run lint:md`・`npm run lint:fm` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
