---
specdojo:
  id: prj-0001:xrp-t-kata-wave-3-itc-sample-090-20261122t043613z-49f41685
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-3-itc-sample-090
  name: "完成版レビュー"
  mode: review
  status: ready
  project_id: prj-0001
  owner: QE
  approach: fully-guided
  targets:
    - specdojo:itc-sample
---

# Review Plan: T-KATA-WAVE-3-itc-sample-090

## 1. このフェーズで行うこと

対応する rulebook と sample を読み、章構成・判断基準・例の充実度・相互整合をレビューする。sample の done_criteria だけで完了としない。成果物・型は変更せず、指摘と根拠を review result に残す。

## 2. 対象成果物

- `name`: 内部結合テスト（対象別）の完成例
- `depends_on`:
  - [[specdojo:itc-index-sample]]
- `based_on`（対象成果物の frontmatter）: [[specdojo:tsp-index-sample]]、[[specdojo:itc-index-sample]]、[[specdojo:bac-sample]]
- 個票の `入力`: なし
- `overview`: 駄菓子屋の販売管理システムの 1 対象を題材に、内部結合テストの対象別の完成例を示す
- `path`: `docs/ja/specdojo/samples/itc-sample.md`
- `rulebook`: `docs/ja/specdojo/rulebooks/itc-rulebook.md`（`_MISSING_` は `undecided`、`not-needed`、または未整備）
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-3-itc-sample-090/T-KATA-WAVE-3-itc-sample-090-20261122T043613Z-49f41685/result.md`

### プロジェクトコンテキスト

以下は `depends_on` とは独立したプロジェクト共通の文脈であり、実行順序・成果物間の根拠関係を表さない。作業開始前に実際に読み、プロジェクトレベルの Why、用語、判断原則と成果物の内容を整合させる。

- [[prj-0001:prj-overview]]

プロジェクトレベルの Why は判断軸として参照し、全文を成果物へ再掲しない。対象成果物の責務に必要な結論・影響だけを反映する。

## 3. 評価結果

review は成果物を再評価しない。次の評価結果を事実として受け取り、共通規約の `review の判断手順` に従ってタスクの完了可否を判断する。

- 評価対象: `docs/ja/specdojo/samples/itc-sample.md`
- grade の対象種別（`--target`）: `kata`
- 評価結果サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/specdojo.itc-sample.yaml`（`_MISSING_` は評価対象が未作成、または評価対象の `id` を解決できないことを示す。この場合は評価結果が最新でないものとして扱う）

runner が review の前に確認した評価結果を次に示す。これは grade が確定済みの事実であり、review で観点を評価し直したり、同じ finding を改めて指摘したりしない。

- runner の grade 実行: 省略した（評価対象の `content_hash` が評価結果と一致したため、既存の評価結果を使う）
- 鮮度: 最新（評価対象の `content_hash` が評価結果の `content_hash` と一致する）
- `verdict`: `needs-work`
- `score`: 89
- `graded_at`: 2026-11-22T02:19:20.934Z（`graded_by`: opus-review-executor）
- finding 件数: blocker 0 / major 2 / minor 4 / note 0

grade が判定した観点（全観点）:

| 観点 | level | score |
| --- | --- | --- |
| `vp-arc-conciseness` | 4 | 100 |
| `vp-arc-document-structure` | 4 | 100 |
| `vp-arc-single-responsibility` | 4 | 100 |
| `vp-arc-technical-constraints` | 4 | 100 |
| `vp-ba-business-value` | 4 | 100 |
| `vp-ba-requirements-completeness` | 3 | 75 |
| `vp-ba-stakeholder-clarity` | 4 | 100 |
| `vp-dev-change-impact` | 4 | 100 |
| `vp-dev-implementation-readiness` | 4 | 100 |
| `vp-dev-testability` | 4 | 100 |
| `vp-ops-agent-boundary` | 4 | 100 |
| `vp-ops-operability` | 4 | 100 |
| `vp-ops-release-readiness` | 2 | 50 |
| `vp-pm-control-reporting` | 4 | 100 |
| `vp-pm-dependency-risk` | 4 | 100 |
| `vp-pm-plan-feasibility` | 4 | 100 |
| `vp-po-decision-readiness` | 4 | 100 |
| `vp-po-publication-accountability` | 4 | 100 |
| `vp-po-purpose-alignment` | 4 | 100 |
| `vp-qe-kata-conformance` | 2 | 50 |
| `vp-qe-omissions-consistency` | 3 | 75 |
| `vp-qe-verifiability` | 3 | 75 |
| `vp-ux-language-consistency` | 4 | 100 |
| `vp-ux-readability` | 4 | 100 |

finding:

- `F001` [minor/`vp-ba-requirements-completeness`; line=16]: bac-sample の BAC-03 は C-03（商品未特定）と C-04（数量不明）の2条件を持つが、本書の責務・トレース・保留観点のケースは C-03 だけを扱い、C-04 の採否と理由がない。C-04 のケースを追加するか、扱わない理由を書く必要がある。
- `F002` [minor/`vp-qe-verifiability`; line=68]: 観測点に「応答のエラー種別」を挙げているが、識別子があるのは `out-of-stock` だけで、重複・確定失敗・保留の応答の値が書かれていない。`out-of-stock` と同じように識別子を期待値に書き、アサーションの一致対象を特定する必要がある。
- `F003` [minor/`vp-qe-omissions-consistency`; line=52]: itc-index-sample の「観点の立て方（共通）」は、採用しない観点の型の理由を `itc-＜term＞` に1行で残すよう求めているが、本書は「結合 I/F の契約」「依存障害時の挙動（DB 停止・接続断）」「セキュリティ境界」の扱いを書いていない。各型について、採用する観点か、理由つきの不採用かを示す必要がある。
- `F004` [minor/`vp-qe-omissions-consistency`; line=50]: TR-05 の仕様ID が根拠仕様ではなく itc-index-sample（分配方針）になっている。rulebook の「トレース」は仕様ID を `br-*`・`bac-*`・`spec-*` 等の根拠仕様としているため、根拠仕様を示すか、分配方針への参照は備考へ移す必要がある。
- `F005` [major/`vp-qe-kata-conformance`; line=67]: itc-index-sample の「ケース表の共通カラム」は `it-sales-checkout-persistence-integrity-020` を「同じ取引番号の再送」のケースとして示しているが、本書は同じ `case_id` を「在庫と同数の購入（在庫5→0）」に使い、再送を `-030` にしている。同じ ID が別のケースを指すため、どちらかの sample に合わせて採番を揃える必要がある。
- `F006` [major/`vp-ops-release-readiness`; line=40]: 未解決の _TODO_ / _ASSUMPTION_ が残っています。

型の整備を含む schedule の追加完了条件: 以下の型すべてに最新の `--target kata` の `pass` が必要。`needs-work` / `fail` は `incomplete` とし、`complete-with-findings` でも完了扱いにしない。未評価・未解決・古い結果は `grade-stale`、読取不能は `grade-unavailable` とする。各対象の鮮度を判定前にも確認し、review 中の変更は `changed-during-review` とする。

型の評価対象（`rulebook`、`--target kata`）: `docs/ja/specdojo/rulebooks/itc-rulebook.md`
評価結果サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/specdojo.itc-rulebook.yaml`

runner が review の前に確認した評価結果を次に示す。これは grade が確定済みの事実であり、review で観点を評価し直したり、同じ finding を改めて指摘したりしない。

- 鮮度: 最新（評価対象の `content_hash` が評価結果の `content_hash` と一致する）
- `verdict`: `pass`
- `score`: 93
- `graded_at`: 2026-11-22T02:18:09.988Z（`graded_by`: opus-review-executor）
- finding 件数: blocker 0 / major 0 / minor 6 / note 0

grade が判定した観点（全観点）:

| 観点 | level | score |
| --- | --- | --- |
| `vp-arc-conciseness` | 3 | 75 |
| `vp-arc-document-structure` | 4 | 100 |
| `vp-arc-single-responsibility` | 4 | 100 |
| `vp-arc-technical-constraints` | 4 | 100 |
| `vp-ba-business-value` | 4 | 100 |
| `vp-ba-requirements-completeness` | 4 | 100 |
| `vp-ba-stakeholder-clarity` | 4 | 100 |
| `vp-dev-change-impact` | 3 | 75 |
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
| `vp-qe-kata-conformance` | 3 | 75 |
| `vp-qe-omissions-consistency` | 4 | 100 |
| `vp-qe-verifiability` | 4 | 100 |
| `vp-ux-language-consistency` | 3 | 75 |
| `vp-ux-readability` | 4 | 100 |

finding:

- `F001` [minor/`vp-po-decision-readiness`; line=13]: _UNDECIDED_ で template は PJR-WYTX に引き継いだが、recipe の要否には判断者も登録簿の引き継ぎ先もない。さらに、すでに本文要件に揃った sample を「未整合」と書いたままで、ready 化の判断材料が実態と食い違っている。recipe の引き継ぎ先を示し、sample の記述を現状に合わせて削除または更新すること。
- `F002` [minor/`vp-arc-conciseness`; line=132]: 「表の1行は1テスト」が全体方針（本文11行目）と条件・ケース表の節で、「共通方針は `itc-index` を正本とする」が本文9行目と76行目で重複している。どちらか一方に寄せると、判断情報を失わずに簡潔になる。
- `F003` [minor/`vp-dev-change-impact`; line=117]: トレース表は根拠を追加するときの手順しか定めていない。根拠仕様（`br-*`・`spec-*` 等）が改訂・廃止されたときに、トレース表の行と対応ケースをどう追従・記録するか（行を残すか、備考に何を書くか）が書かれておらず、rulebook-authoring-standard の求める自系統の追従対象の定義が欠けている。
- `F004` [minor/`vp-qe-kata-conformance`; line=13]: sample（`specdojo:itc-sample`）は本文要件の見出し構成・`perspective_key` 宣言・`trace_key`・条件・ケース表の書式に揃っているのに、本文では「sample は未整合であり、後続の見直しで揃える」と書いたままで、rulebook と sample の関係の記述が実態と食い違っている。記述を削除するか、残る差分を具体的に示すこと。
- `F005` [minor/`vp-ux-language-consistency`; line=10]: 依存の扱いを本文10行目では「Mock」、本文101行目では「スタブ/モック」と表記しており、表記がそろっていない。また UT・IT・ET の略語（本文10・143・145行目）が定義なしで使われている。カタカナ表記に統一し、略語は初出で正式名を添えること。
- `F006` [minor/`vp-ops-release-readiness`; line=13]: ready 化前に解消すべき事項として挙げた「sample の未整合」がすでに解消しているのに記述が残り、recipe の要否には判断の引き継ぎ先がない。このため公開判断の前提が実態と合っていない。残る未解決事項だけに更新し、各事項の引き継ぎ先を示すこと。

型の評価対象（`sample: specdojo:itc-sample`、`--target kata`）: `docs/ja/specdojo/samples/itc-sample.md`
評価結果サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/specdojo.itc-sample.yaml`

runner が review の前に確認した評価結果を次に示す。これは grade が確定済みの事実であり、review で観点を評価し直したり、同じ finding を改めて指摘したりしない。

- 鮮度: 最新（評価対象の `content_hash` が評価結果の `content_hash` と一致する）
- `verdict`: `needs-work`
- `score`: 89
- `graded_at`: 2026-11-22T02:19:20.934Z（`graded_by`: opus-review-executor）
- finding 件数: blocker 0 / major 2 / minor 4 / note 0

grade が判定した観点（全観点）:

| 観点 | level | score |
| --- | --- | --- |
| `vp-arc-conciseness` | 4 | 100 |
| `vp-arc-document-structure` | 4 | 100 |
| `vp-arc-single-responsibility` | 4 | 100 |
| `vp-arc-technical-constraints` | 4 | 100 |
| `vp-ba-business-value` | 4 | 100 |
| `vp-ba-requirements-completeness` | 3 | 75 |
| `vp-ba-stakeholder-clarity` | 4 | 100 |
| `vp-dev-change-impact` | 4 | 100 |
| `vp-dev-implementation-readiness` | 4 | 100 |
| `vp-dev-testability` | 4 | 100 |
| `vp-ops-agent-boundary` | 4 | 100 |
| `vp-ops-operability` | 4 | 100 |
| `vp-ops-release-readiness` | 2 | 50 |
| `vp-pm-control-reporting` | 4 | 100 |
| `vp-pm-dependency-risk` | 4 | 100 |
| `vp-pm-plan-feasibility` | 4 | 100 |
| `vp-po-decision-readiness` | 4 | 100 |
| `vp-po-publication-accountability` | 4 | 100 |
| `vp-po-purpose-alignment` | 4 | 100 |
| `vp-qe-kata-conformance` | 2 | 50 |
| `vp-qe-omissions-consistency` | 3 | 75 |
| `vp-qe-verifiability` | 3 | 75 |
| `vp-ux-language-consistency` | 4 | 100 |
| `vp-ux-readability` | 4 | 100 |

finding:

- `F001` [minor/`vp-ba-requirements-completeness`; line=16]: bac-sample の BAC-03 は C-03（商品未特定）と C-04（数量不明）の2条件を持つが、本書の責務・トレース・保留観点のケースは C-03 だけを扱い、C-04 の採否と理由がない。C-04 のケースを追加するか、扱わない理由を書く必要がある。
- `F002` [minor/`vp-qe-verifiability`; line=68]: 観測点に「応答のエラー種別」を挙げているが、識別子があるのは `out-of-stock` だけで、重複・確定失敗・保留の応答の値が書かれていない。`out-of-stock` と同じように識別子を期待値に書き、アサーションの一致対象を特定する必要がある。
- `F003` [minor/`vp-qe-omissions-consistency`; line=52]: itc-index-sample の「観点の立て方（共通）」は、採用しない観点の型の理由を `itc-＜term＞` に1行で残すよう求めているが、本書は「結合 I/F の契約」「依存障害時の挙動（DB 停止・接続断）」「セキュリティ境界」の扱いを書いていない。各型について、採用する観点か、理由つきの不採用かを示す必要がある。
- `F004` [minor/`vp-qe-omissions-consistency`; line=50]: TR-05 の仕様ID が根拠仕様ではなく itc-index-sample（分配方針）になっている。rulebook の「トレース」は仕様ID を `br-*`・`bac-*`・`spec-*` 等の根拠仕様としているため、根拠仕様を示すか、分配方針への参照は備考へ移す必要がある。
- `F005` [major/`vp-qe-kata-conformance`; line=67]: itc-index-sample の「ケース表の共通カラム」は `it-sales-checkout-persistence-integrity-020` を「同じ取引番号の再送」のケースとして示しているが、本書は同じ `case_id` を「在庫と同数の購入（在庫5→0）」に使い、再送を `-030` にしている。同じ ID が別のケースを指すため、どちらかの sample に合わせて採番を揃える必要がある。
- `F006` [major/`vp-ops-release-readiness`; line=40]: 未解決の _TODO_ / _ASSUMPTION_ が残っています。

## 4. 完了条件

成果物カタログの `done_criteria` を、このタスクの完了条件として照合する。観点ごとに成果物を評価し直すための表ではない。

<!-- markdownlint-disable MD055 MD056 -->

<!-- prettier-ignore-start -->
| ID | ロール | `viewpoint_id` | 完了条件 |
| --- | --- | --- | --- |
| DC-001 | QE | vp-qe-omissions-consistency | rulebook の章立てと必須の表に沿っていること |
| DC-002 | QE | vp-qe-kata-conformance | Sample 記述標準と共通サンプル文脈（駄菓子屋のプロジェクト）に沿っていること |
| DC-003 | QE | vp-qe-kata-conformance | rulebook の禁止事項に当たらないこと |
| DC-004 | QE | vp-qe-omissions-consistency | rulebook が H5 以下の見出しを使わず、見出しを H4 までに収めていること |
| DC-005 | QE | vp-qe-kata-conformance | H1 が rulebook の定めるタイトル形式で、Frontmatter の `based_on` に tsp-index と itc-index を持つこと |
| DC-006 | QE | vp-qe-verifiability | 期待値を応答・DB の状態・イベントなどの観測点で書き、pass / fail を判定できること |
<!-- prettier-ignore-end -->

<!-- markdownlint-enable MD055 MD056 -->

## 5. 進め方

fully-guided のタスクは、宣言された文書だけを参照し、rulebook / recipe / sample に沿って既存成果物を磨き込むことを求めた。下書きや調査による新しい値の選定は draft の役割である。磨き込みでは template を読み込まない。rulebook の必須要素・禁止事項、recipe の問い、sample の形式との整合は grade が評価済みである。review はこれらを照合し直さず、評価結果の finding として扱う。

参照ファイル（rulebook frontmatter から解決。`_MISSING_` の項目は未宣言・未整備）:

- rulebook: `docs/ja/specdojo/rulebooks/itc-rulebook.md`
- recipe: `_MISSING_`
- sample: `docs/ja/specdojo/samples/itc-sample.md`
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
