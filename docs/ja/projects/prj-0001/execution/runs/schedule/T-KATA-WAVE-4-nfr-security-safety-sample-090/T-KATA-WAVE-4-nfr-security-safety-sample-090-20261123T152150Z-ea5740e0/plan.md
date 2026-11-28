---
specdojo:
  id: prj-0001:xrp-t-kata-wave-4-nfr-security-safety-sample-090-20261123t152150z-ea5740e0
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-4-nfr-security-safety-sample-090
  name: "型の grade とレビュー"
  mode: review
  status: ready
  project_id: prj-0001
  owner: ARC
  approach: fully-guided
  targets:
    - specdojo:nfr-security-safety-sample
---

# Review Plan: T-KATA-WAVE-4-nfr-security-safety-sample-090

## 1. このフェーズで行うこと

review の前に、runner が rulebook と sample の組（rulebook が宣言する recipe・template を含む）を grade の --target kata で評価する。この評価結果と、対応する rulebook と sample を読み、章構成・判断基準・例の充実度・相互整合をレビューする。sample の done_criteria だけで完了としない。成果物・型は変更せず、指摘と根拠を review result に残す。
人の確定はこの track に入れず、sample がひととおりそろった後の横串の確認でまとめて行う。確定の前に確かめるべき点は review result に書く。

## 2. 対象成果物

- `name`: セキュリティ・安全性要件の完成例
- `depends_on`:  -
- `based_on`（対象成果物の frontmatter）: [[specdojo:prj-overview-sample]]、[[specdojo:prj-assumptions-constraints-dependencies-sample]]、[[specdojo:opd-access-control-sample]]
- 個票の `入力`: なし
- `overview`: 駄菓子屋の販売管理システムを題材に、セキュリティ・安全性要件の完成例を示す
- `path`: `docs/ja/specdojo/samples/nfr-security-safety-sample.md`
- `rulebook`: `docs/ja/specdojo/rulebooks/nfr-security-safety-rulebook.md`（`_MISSING_` は `undecided`、`not-needed`、または未整備）
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-4-nfr-security-safety-sample-090/T-KATA-WAVE-4-nfr-security-safety-sample-090-20261123T152150Z-ea5740e0/result.md`

### プロジェクトコンテキスト

以下は `depends_on` とは独立したプロジェクト共通の文脈であり、実行順序・成果物間の根拠関係を表さない。作業開始前に実際に読み、プロジェクトレベルの Why、用語、判断原則と成果物の内容を整合させる。

- [[prj-0001:prj-overview]]

プロジェクトレベルの Why は判断軸として参照し、全文を成果物へ再掲しない。対象成果物の責務に必要な結論・影響だけを反映する。

## 3. 評価結果

review は成果物を再評価しない。次の評価結果を事実として受け取り、共通規約の `review の判断手順` に従ってタスクの完了可否を判断する。

- 評価対象: `docs/ja/specdojo/samples/nfr-security-safety-sample.md`
- grade の対象種別（`--target`）: `kata`
- 評価結果サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/specdojo.nfr-security-safety-sample.yaml`（`_MISSING_` は評価対象が未作成、または評価対象の `id` を解決できないことを示す。この場合は評価結果が最新でないものとして扱う）

runner が review の前に確認した評価結果を次に示す。これは grade が確定済みの事実であり、review で観点を評価し直したり、同じ finding を改めて指摘したりしない。

- runner の grade 実行: 実行した（run id: `review-prj-0001-T-KATA-WAVE-4-nfr-security-safety-sample-090-d971741d9d-20261123T152041Z`）
- 鮮度: 最新（評価対象の `content_hash` が評価結果の `content_hash` と一致する）
- `verdict`: `pass`
- `score`: 93
- `graded_at`: 2026-11-23T15:21:13.554Z（`graded_by`: sonnet-review-executor）
- finding 件数: blocker 0 / major 0 / minor 5 / note 0

grade が判定した観点（全観点）:

| 観点 | level | score |
| --- | --- | --- |
| `vp-arc-conciseness` | 4 | 100 |
| `vp-arc-document-structure` | 4 | 100 |
| `vp-arc-single-responsibility` | 4 | 100 |
| `vp-arc-technical-constraints` | 4 | 100 |
| `vp-ba-business-value` | 4 | 100 |
| `vp-ba-requirements-completeness` | 4 | 100 |
| `vp-ba-stakeholder-clarity` | 4 | 100 |
| `vp-dev-change-impact` | 4 | 100 |
| `vp-dev-implementation-readiness` | 4 | 100 |
| `vp-dev-testability` | 4 | 100 |
| `vp-ops-agent-boundary` | 4 | 100 |
| `vp-ops-operability` | 4 | 100 |
| `vp-ops-release-readiness` | 3 | 75 |
| `vp-pm-control-reporting` | 4 | 100 |
| `vp-pm-dependency-risk` | 4 | 100 |
| `vp-pm-plan-feasibility` | 4 | 100 |
| `vp-po-decision-readiness` | 3 | 75 |
| `vp-po-publication-accountability` | 4 | 100 |
| `vp-po-purpose-alignment` | 4 | 100 |
| `vp-qe-kata-conformance` | 4 | 100 |
| `vp-qe-omissions-consistency` | 3 | 75 |
| `vp-qe-verifiability` | 3 | 75 |
| `vp-ux-language-consistency` | 4 | 100 |
| `vp-ux-readability` | 4 | 100 |

finding:

- `F001` [minor/`vp-po-decision-readiness`; line=47]: `nfr-sec-012` の基準が `_UNDECIDED_: ○○ 日以内` のままで、決定者と決定期限が書かれていない。確定の担当（Role code）と判断時期を備考に追記すること。
- `F002` [minor/`vp-qe-verifiability`; line=76]: `nfr-sec-ex-001` の期限が「初期リリースの 30 日後」と相対表現で、期限切れを表から判別できない。リリース日が決まった時点で具体的な日付に置き換えるか、起算日を明記すること。
- `F003` [minor/`vp-qe-omissions-consistency`; line=57]: `nfr-sec-003` の母数は主体の表の「許可しない操作」すべてだが、測定方法の対象に店番・運用・保守しかなく、管理（監査ログの削除）と本部連携（顧客情報の受け渡し）が漏れている。
- `F004` [minor/`vp-qe-omissions-consistency`; line=82]: rulebook は `stc-*` への導線を求めているが、導線の表に `stc-*` の行も、`stc-*` を置かない旨の記述もない。
- `F005` [minor/`vp-ops-release-readiness`; line=47]: ready 化前に解消すべき未決（`nfr-sec-012` の `○○` 日数）の解消条件が書かれていない。暫定運用を終える条件を明記すること。

型の整備を含む schedule の追加完了条件: 以下の型すべてに最新の `--target kata` の `pass` が必要。`needs-work` / `fail` は `incomplete` とし、`complete-with-findings` でも完了扱いにしない。未評価・未解決・古い結果は `grade-stale`、読取不能は `grade-unavailable` とする。各対象の鮮度を判定前にも確認し、review 中の変更は `changed-during-review` とする。

型の評価対象（`rulebook`、`--target kata`）: `docs/ja/specdojo/rulebooks/nfr-security-safety-rulebook.md`
評価結果サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/specdojo.nfr-security-safety-rulebook.yaml`

runner が review の前に確認した評価結果を次に示す。これは grade が確定済みの事実であり、review で観点を評価し直したり、同じ finding を改めて指摘したりしない。

- 鮮度: 最新（評価対象の `content_hash` が評価結果の `content_hash` と一致する）
- `verdict`: `pass`
- `score`: 94
- `graded_at`: 2026-11-23T15:21:50.868Z（`graded_by`: sonnet-review-executor）
- finding 件数: blocker 0 / major 0 / minor 3 / note 0

grade が判定した観点（全観点）:

| 観点 | level | score |
| --- | --- | --- |
| `vp-arc-conciseness` | 4 | 100 |
| `vp-arc-document-structure` | 4 | 100 |
| `vp-arc-single-responsibility` | 4 | 100 |
| `vp-arc-technical-constraints` | 4 | 100 |
| `vp-ba-business-value` | 4 | 100 |
| `vp-ba-requirements-completeness` | 4 | 100 |
| `vp-ba-stakeholder-clarity` | 4 | 100 |
| `vp-dev-change-impact` | 4 | 100 |
| `vp-dev-implementation-readiness` | 4 | 100 |
| `vp-dev-testability` | 4 | 100 |
| `vp-ops-agent-boundary` | 4 | 100 |
| `vp-ops-operability` | 4 | 100 |
| `vp-ops-release-readiness` | 3 | 75 |
| `vp-pm-control-reporting` | 4 | 100 |
| `vp-pm-dependency-risk` | 4 | 100 |
| `vp-pm-plan-feasibility` | 4 | 100 |
| `vp-po-decision-readiness` | 4 | 100 |
| `vp-po-publication-accountability` | 4 | 100 |
| `vp-po-purpose-alignment` | 4 | 100 |
| `vp-qe-kata-conformance` | 3 | 75 |
| `vp-qe-omissions-consistency` | 3 | 75 |
| `vp-qe-verifiability` | 4 | 100 |
| `vp-ux-language-consistency` | 4 | 100 |
| `vp-ux-readability` | 4 | 100 |

finding:

- `F001` [minor/`vp-qe-omissions-consistency`; line=92]: 検証先に `opr-*` を挙げているが、位置づけでは `opr-*` を監視・インシデント対応の正本としている。検証先として使う場合の役割（例: 月次点検の手順・棚卸し記録）を揃えて明記すること。
- `F002` [minor/`vp-qe-kata-conformance`; line=1]: `recipe` と `template` が `undecided` のままで、Kata の対応が揃っていない。ready 化の前に、対応する recipe と template を決めること。
- `F003` [minor/`vp-ops-release-readiness`; line=1]: ready 化の条件である recipe と template の決定が未了であることが、本文で示されていない。ready 判断の前に確認できるようにすること。

型の評価対象（`sample: specdojo:nfr-security-safety-sample`、`--target kata`）: `docs/ja/specdojo/samples/nfr-security-safety-sample.md`
評価結果サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/specdojo.nfr-security-safety-sample.yaml`

runner が review の前に確認した評価結果を次に示す。これは grade が確定済みの事実であり、review で観点を評価し直したり、同じ finding を改めて指摘したりしない。

- 鮮度: 最新（評価対象の `content_hash` が評価結果の `content_hash` と一致する）
- `verdict`: `pass`
- `score`: 93
- `graded_at`: 2026-11-23T15:21:13.554Z（`graded_by`: sonnet-review-executor）
- finding 件数: blocker 0 / major 0 / minor 5 / note 0

grade が判定した観点（全観点）:

| 観点 | level | score |
| --- | --- | --- |
| `vp-arc-conciseness` | 4 | 100 |
| `vp-arc-document-structure` | 4 | 100 |
| `vp-arc-single-responsibility` | 4 | 100 |
| `vp-arc-technical-constraints` | 4 | 100 |
| `vp-ba-business-value` | 4 | 100 |
| `vp-ba-requirements-completeness` | 4 | 100 |
| `vp-ba-stakeholder-clarity` | 4 | 100 |
| `vp-dev-change-impact` | 4 | 100 |
| `vp-dev-implementation-readiness` | 4 | 100 |
| `vp-dev-testability` | 4 | 100 |
| `vp-ops-agent-boundary` | 4 | 100 |
| `vp-ops-operability` | 4 | 100 |
| `vp-ops-release-readiness` | 3 | 75 |
| `vp-pm-control-reporting` | 4 | 100 |
| `vp-pm-dependency-risk` | 4 | 100 |
| `vp-pm-plan-feasibility` | 4 | 100 |
| `vp-po-decision-readiness` | 3 | 75 |
| `vp-po-publication-accountability` | 4 | 100 |
| `vp-po-purpose-alignment` | 4 | 100 |
| `vp-qe-kata-conformance` | 4 | 100 |
| `vp-qe-omissions-consistency` | 3 | 75 |
| `vp-qe-verifiability` | 3 | 75 |
| `vp-ux-language-consistency` | 4 | 100 |
| `vp-ux-readability` | 4 | 100 |

finding:

- `F001` [minor/`vp-po-decision-readiness`; line=47]: `nfr-sec-012` の基準が `_UNDECIDED_: ○○ 日以内` のままで、決定者と決定期限が書かれていない。確定の担当（Role code）と判断時期を備考に追記すること。
- `F002` [minor/`vp-qe-verifiability`; line=76]: `nfr-sec-ex-001` の期限が「初期リリースの 30 日後」と相対表現で、期限切れを表から判別できない。リリース日が決まった時点で具体的な日付に置き換えるか、起算日を明記すること。
- `F003` [minor/`vp-qe-omissions-consistency`; line=57]: `nfr-sec-003` の母数は主体の表の「許可しない操作」すべてだが、測定方法の対象に店番・運用・保守しかなく、管理（監査ログの削除）と本部連携（顧客情報の受け渡し）が漏れている。
- `F004` [minor/`vp-qe-omissions-consistency`; line=82]: rulebook は `stc-*` への導線を求めているが、導線の表に `stc-*` の行も、`stc-*` を置かない旨の記述もない。
- `F005` [minor/`vp-ops-release-readiness`; line=47]: ready 化前に解消すべき未決（`nfr-sec-012` の `○○` 日数）の解消条件が書かれていない。暫定運用を終える条件を明記すること。

## 4. 完了条件

成果物カタログの `done_criteria` を、このタスクの完了条件として照合する。観点ごとに成果物を評価し直すための表ではない。

<!-- markdownlint-disable MD055 MD056 -->

<!-- prettier-ignore-start -->
| ID | ロール | `viewpoint_id` | 完了条件 |
| --- | --- | --- | --- |
| DC-001 | QE | vp-qe-omissions-consistency | rulebook の章立てと必須の表に沿っていること |
| DC-002 | QE | vp-qe-kata-conformance | Sample 記述標準と共通サンプル文脈（駄菓子屋のプロジェクト）に沿っていること |
| DC-003 | QE | vp-qe-kata-conformance | rulebook の禁止事項に当たらないこと |
| DC-004 | PO | vp-po-purpose-alignment | 守る情報と操作（つけ残高・販売記録・在庫）を概要で具体的に示し、目的と対応付けていること |
| DC-005 | QE | vp-qe-verifiability | 要件ごとに、対策が満たされたかを判定できる条件を示していること |
<!-- prettier-ignore-end -->

<!-- markdownlint-enable MD055 MD056 -->

## 5. 進め方

fully-guided のタスクは、宣言された文書だけを参照し、rulebook / recipe / sample に沿って既存成果物を磨き込むことを求めた。下書きや調査による新しい値の選定は draft の役割である。磨き込みでは template を読み込まない。rulebook の必須要素・禁止事項、recipe の問い、sample の形式との整合は grade が評価済みである。review はこれらを照合し直さず、評価結果の finding として扱う。

参照ファイル（rulebook frontmatter から解決。`_MISSING_` の項目は未宣言・未整備）:

- rulebook: `docs/ja/specdojo/rulebooks/nfr-security-safety-rulebook.md`
- recipe: `_MISSING_`
- sample: `docs/ja/specdojo/samples/nfr-security-safety-sample.md`
- 併せて適用する rulebook（記法など）: _MISSING_

1. フェーズ説明と完了条件が求めた磨き込みが、対象成果物に行われたかを確認する。
2. 実践の型の欠落（`_MISSING_`）や内容の薄さがある場合は、実行記録にその扱いが残っているかを確認する。実践の型そのものの整備が必要な場合は、改善指示に残す。
3. finding が残っている場合は、このタスクの完了を妨げるかを判断する。rulebook の必須要素の欠落や禁止事項への抵触など、完了条件に直結する finding は完了を妨げる。

確認に用いてよい文書は、宣言された文書だけに限る。具体的には、評価結果、対象成果物、本セクションの参照ファイル、`depends_on` 成果物、対象成果物の frontmatter の `based_on`、プロジェクトコンテキスト（`project_context`）、個票の `入力`、カタログの `brief`、実行記録である。`入力` と `brief` は値が無いときは載せない。これらに宣言されていない他のプロジェクト文書や外部の情報を独自に探索・参照しない。

本タスクの実行に必要な fully-guided の確認方針は、このセクションで完結する。approach 全体の定義（他 approach との対比や edit への適用）を確認したい場合のみ、参考として [[specdojo:ryu-guide]] を参照する。

## 6. 完了手順

1. 共通規約の `review の判断手順` に従い、評価結果の鮮度を確認してから完了可否を判断する。
2. result の各セクションを埋める。`評価結果の確認` には鮮度確認のコマンドと出力、grade の `verdict` / `score` / finding 件数を書く。`判断根拠` には照合した内容を、`未充足事項・改善指示` には未充足事項と改善指示を書く。`approach に応じた確認` には前章で確認した内容を、`decision` には `verdict` を書く。review result の記入はタスク完了に必須であり、未記入のまま終了しない（詳細は共通規約を参照）。
3. 文書の参照は `[[id]]` 形式（Obsidian wikilink）で記載する。行番号アンカー（`#L12-L18` など）や絶対パスは使わない。位置の補足が必要な場合は本文で述べる。
4. verdict が `complete` 以外でも、review result を記録できた場合は正常終了する（終了コード 0）。

## 7. 異常終了の条件

- 対象ファイル不明・依存未解決・result 更新不能など、review 自体を完了できない場合は異常終了する（終了コード 1）。評価結果が最新でない・評価不能であることは異常終了の理由にせず、verdict として記録する。
- 標準エラー出力に理由を出力する（例: `review-blocked: <reason>; ref=<path>`）。
- agent 自身は claim / complete / reopen / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。

`共通規約 sha256:0a9a60c0cf290acdf66e250274fb2db883829723ca3d3b292356b3276021b7f2` `docs/ja/projects/prj-0001/execution/conventions/0a9a60c0cf290acdf66e250274fb2db883829723ca3d3b292356b3276021b7f2.txt`
