---
specdojo:
  id: prj-0001:pjr-0126-pr-based-po-approval
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
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
| 1 | PR 承認が必要な決定範囲を定義する（憲章の PO 留保事項へマッピング） | PM | done | 対応結果「PR 承認が必要な決定範囲」に定義。日常の agent コミットは対象外 |
| 2 | branch 保護・CODEOWNERS で PO を required reviewer 化する方針を策定する | PM | done | 対応結果「branch 保護 / CODEOWNERS 方針」に定義。author≠approver を強制 |
| 3 | 承認証跡（PR URL・承認者・merge SHA）を decision 個票 / 憲章承認章へ書き戻す手順を定義する | PM | done | 対応結果「承認証跡の書き戻し手順」に定義。可搬性のため本文テキストで記録 |
| 4 | decision 個票と PR の役割分担・相互リンク運用を guide / rulebook へ反映する | PM | done | [[specdojo:register-operation-guide]] の「PO 留保事項の PR 承認運用」章へ反映 |
| 5 | 既存 PJR-0119 の遡及要否を判断し記録する | PO | review | PM 推奨（grandfather）を対応結果に記録。最終判断は PO が確定 |
| 6 | 署名タグ / 署名コミット等の高保証代替の要否を評価する | ARC | review | PM 一次評価（現段階は不要）を記録。要否確定は ARC |

## 4. 対応結果

PO 留保事項の承認を pull request レビューで担保する運用を次のとおり定義した。decision 個票は決定内容の SSOT として残し、PR は承認イベント（承認者・承認日時・承認対象差分）の担保に用いる併用方式とする。

### 4.1. PR 承認が必要な決定範囲

[[prj-0001:prj-charter|プロジェクト憲章]] の権限委譲章で PO の承認を要する事項（委譲範囲に含めない事項）を、PR 承認の対象範囲とする。

| 対象（憲章 PO 留保事項）                             | 承認対象の代表文書                           |
| ---------------------------------------------------- | -------------------------------------------- |
| プロジェクト目的の変更                               | プロジェクト概要、プロジェクト憲章           |
| 主要スコープの大幅な変更                             | プロジェクトスコープ、プロジェクト憲章       |
| 初期公開範囲・公開可否・公開日・ライセンス方針の確定 | 該当 decision 個票、公開・ライセンス関連文書 |
| 主要成果物群の追加・削除                             | 成果物カタログ                               |
| 予算枠の新設・増額・外部支出の承認                   | 該当 decision 個票                           |
| 各 GO / Not GO 判断                                  | 該当 decision 個票                           |
| プロジェクト中止・大幅な再計画の判断                 | 該当 decision 個票、プロジェクト管理計画     |
| 憲章そのものの承認・改訂                             | プロジェクト憲章（承認章）                   |

対象外（PR 承認を要しない）:

- schedule 上の計画済み edit / review タスクによる通常の成果物更新。
- 日常の agent コミット（exec による草案作成・整合確認など、委譲範囲内の作業）。
- 派生ビューの再生成など機械的な生成物の更新。

### 4.2. branch 保護 / CODEOWNERS 方針

author≠approver（職務分離）を platform 側で担保するため、次を方針とする。

- `main` の branch 保護: 直接 push を禁止し、変更は必ず PR 経由とする。マージ要件に「レビュー承認 1 件以上」「新規コミットで既存承認を無効化（dismiss stale approvals）」「未解決コメントの解消」を設定する。
- CODEOWNERS（`.github/CODEOWNERS`）: PR 承認が必要な決定範囲の代表文書パス（例: `docs/ja/projects/prj-0001/020-project-definition/`、承認対象の decision 個票）に PO を code owner として指定し、Require review from Code Owners を有効化する。これにより PO レビューを required reviewer 化する。
- author≠approver: GitHub は PR 作成者自身の approve を承認数にカウントしないため、PO が author の場合は別レビュアーの承認を要する運用とし、自己承認を排除する。

CODEOWNERS の具体パス確定と保護ルールの platform 反映は、GitHub 設定変更を伴うため後続の実装タスクで行う（本項では方針を定義）。

### 4.3. 承認証跡の書き戻し手順

GitHub 非依存の可搬な証跡を確保するため、承認確定（merge）後に次を decision 個票または憲章の承認章へ本文テキストで書き戻す。

1. PR を作成し、決定内容の SSOT となる decision 個票へリンクする（PR 説明に個票 `id` を記載）。
2. PO が PR をレビューし approve する。
3. merge 後、承認章の承認テーブルへ次を記録する。
   - 承認日
   - 承認者（`PO`）
   - 承認対象（PR タイトルまたは対象文書・差分範囲）
   - 証跡リンク（PR URL と merge SHA）

PR URL と merge SHA を本文へ転記することで、platform 依存の承認メタデータに頼らず、リポジトリ内だけで承認事実を追跡できる。

### 4.4. decision 個票と PR の役割分担・相互リンク

| 対象          | 役割                                                  | 保持場所                     |
| ------------- | ----------------------------------------------------- | ---------------------------- |
| decision 個票 | 決定内容の SSOT（背景・選択肢・決定・理由・影響範囲） | リポジトリ内に恒久保持       |
| pull request  | 承認イベントの担保（承認者・承認日時・承認対象差分）  | platform（証跡は本文へ転記） |

相互リンク運用: decision 個票の承認章に PR URL と merge SHA を記載し、PR 説明には対象 decision 個票の `id` を記載する。この役割分担と相互リンク運用は [[specdojo:register-operation-guide]] の「PO 留保事項の PR 承認運用」章へ反映した。

### 4.5. 既存 PJR-0119 の遡及要否

- 現状: [[prj-0001:pjr-0119-charter-approval|PJR-0119]] は decision 個票の起票のみで承認しており、PR による承認証跡（承認者・merge SHA）を持たない。
- PM 推奨（_ASSUMPTION_、最終判断は PO）: grandfather として遡及適用しない。憲章は承認済み（コミット `ce44286c` 時点の内容）で内容が確定しており、遡及 PR を起こしても承認済み内容の再現に留まり証跡価値が薄いため。新フローは次回の憲章改訂・新規 PO 留保事項の承認から適用する。
- 記録: 本判断は本個票に記録済み。作業内容 No.5 の状態を `review` とし、PO の確定を待つ。

### 4.6. 署名タグ / 署名コミット（高保証代替）の要否

- PM 一次評価（要否確定は ARC）: 現段階では不要。公開 OSS 文書プロジェクトであり、改ざん耐性より運用の軽量性を優先する。GitHub の PR レビュー証跡と merge SHA の転記で必要な追跡性は確保できる。
- 将来、外部公開後に第三者による改ざん検知や法的証跡が必要になった段階で再評価する。作業内容 No.6 の状態を `review` とし、ARC の確定を待つ。

## 5. 関連ドキュメント

- [[prj-0001:pjr-0122-review-launch|launch trackの振り返り]] — 起票元（対策案「complete, commit, pushの関係」の PR 承認フロー）
- [[prj-0001:prj-charter|プロジェクト憲章]] — 承認章・権限委譲章（証跡の対象）
- [[prj-0001:pjr-0119-charter-approval|PJR-0119 プロジェクト憲章の承認]] — 現行方式（改善対象）
- [[specdojo:register-operation-guide]] — 承認運用の反映先
