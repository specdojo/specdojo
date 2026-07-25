---
specdojo:
  id: prj-0001:pjr-0126-pr-based-po-approval
  type: project
  status: draft
  rulebook: pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
---

# PJR-0126 PO承認をpull requestベースにする承認フロー整備

## 1. 概要

プロジェクト憲章の承認（[[prj-0001:pjr-0119-charter-approval|PJR-0119]]）は decision 個票の起票のみで行ったが、承認者が表のセル文字列で、作成者と承認者が分離されておらず自己承認になりうるため証跡が弱い。charter 等の PO 留保事項の承認を pull request レビューで行い、承認者・承認日時・承認対象差分を platform 側で担保する運用を整備する。decision 個票は決定内容の SSOT として残し、PR は承認イベントとして併用する。

## 2. 完了条件

- PR 承認を要する決定の範囲が定義されている（[[prj-0001:prj-charter|プロジェクト憲章]] の権限委譲章の PO 留保事項へマッピング）。
- PO を required reviewer とする branch 保護 / CODEOWNERS の方針が定義され、author≠approver（職務分離）が担保されている。
- 承認時に PR URL・承認者・merge SHA を decision 個票または憲章の承認章へ書き戻す手順が定義されている（GitHub 非依存の可搬な証跡を確保）。
- decision 個票（リポジトリ内の決定記録）と PR（承認イベント）の役割分担・相互リンク運用が guide / rulebook に反映されている。
- 既存 PJR-0119 の遡及要否が判断され、記録されている。

## 3. 作業内容

<!-- prettier-ignore -->
| No | 作業 | 担当 | 状態 | メモ |
| --- | --- | --- | --- | --- |
| 1 | PR 承認が必要な決定範囲を定義する（憲章の PO 留保事項へマッピング） | PM | open | 日常の agent コミットは対象外 |
| 2 | branch 保護・CODEOWNERS で PO を required reviewer 化する方針を策定する | PM | open | author≠approver を強制 |
| 3 | 承認証跡（PR URL・承認者・merge SHA）を decision 個票 / 憲章承認章へ書き戻す手順を定義する | PM | open | 可搬性のため |
| 4 | decision 個票と PR の役割分担・相互リンク運用を guide / rulebook へ反映する | PM | open | [[specdojo-register-operation-guide]] |
| 5 | 既存 PJR-0119 の遡及要否を判断し記録する | PO | open | grandfather 想定 |
| 6 | 署名タグ / 署名コミット等の高保証代替の要否を評価する | ARC | open | 任意・重運用のため要否のみ |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-0122-review-launch|launch trackの振り返り]] — 起票元（対策案「complete, commit, pushの関係」の PR 承認フロー）
- [[prj-0001:prj-charter|プロジェクト憲章]] — 承認章・権限委譲章（証跡の対象）
- [[prj-0001:pjr-0119-charter-approval|PJR-0119 プロジェクト憲章の承認]] — 現行方式（改善対象）
- [[specdojo-register-operation-guide]] — 承認運用の反映先
