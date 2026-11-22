---
specdojo:
  id: prj-0001:xrp-t-kata-wave-3-utc-sample-090-20261122t041137z-b641c58e
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-3-utc-sample-090
  name: "完成版レビュー"
  mode: review
  status: ready
  project_id: prj-0001
  owner: QE
  approach: fully-guided
  targets:
    - specdojo:utc-sample
---

# Review Plan: T-KATA-WAVE-3-utc-sample-090

## 1. このフェーズで行うこと

対応する rulebook と sample を読み、章構成・判断基準・例の充実度・相互整合をレビューする。sample の done_criteria だけで完了としない。成果物・型は変更せず、指摘と根拠を review result に残す。

## 2. 対象成果物

- `name`: 単体テスト（対象別）の完成例
- `depends_on`:
  - [[specdojo:utc-index-sample]]
- `based_on`（対象成果物の frontmatter）: [[specdojo:tsp-index-sample]]、[[specdojo:utc-index-sample]]、[[specdojo:bac-sample]]
- 個票の `入力`: なし
- `overview`: 駄菓子屋の販売管理システムの 1 対象を題材に、単体テストの対象別の完成例を示す
- `path`: `docs/ja/specdojo/samples/utc-sample.md`
- `rulebook`: `docs/ja/specdojo/rulebooks/utc-rulebook.md`（`_MISSING_` は `undecided`、`not-needed`、または未整備）
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-3-utc-sample-090/T-KATA-WAVE-3-utc-sample-090-20261122T041137Z-b641c58e/result.md`

### プロジェクトコンテキスト

以下は `depends_on` とは独立したプロジェクト共通の文脈であり、実行順序・成果物間の根拠関係を表さない。作業開始前に実際に読み、プロジェクトレベルの Why、用語、判断原則と成果物の内容を整合させる。

- [[prj-0001:prj-overview]]

プロジェクトレベルの Why は判断軸として参照し、全文を成果物へ再掲しない。対象成果物の責務に必要な結論・影響だけを反映する。

## 3. 評価結果

review は成果物を再評価しない。次の評価結果を事実として受け取り、共通規約の `review の判断手順` に従ってタスクの完了可否を判断する。

- 評価対象: `docs/ja/specdojo/samples/utc-sample.md`
- grade の対象種別（`--target`）: `kata`
- 評価結果サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/specdojo.utc-sample.yaml`（`_MISSING_` は評価対象が未作成、または評価対象の `id` を解決できないことを示す。この場合は評価結果が最新でないものとして扱う）

runner が review の前に確認した評価結果を次に示す。これは grade が確定済みの事実であり、review で観点を評価し直したり、同じ finding を改めて指摘したりしない。

- runner の grade 実行: 省略した（評価対象の `content_hash` が評価結果と一致したため、既存の評価結果を使う）
- 鮮度: 最新（評価対象の `content_hash` が評価結果の `content_hash` と一致する）
- `verdict`: `pass`
- `score`: 90
- `graded_at`: 2026-11-22T01:07:42.581Z（`graded_by`: opus-review-executor）
- finding 件数: blocker 0 / major 0 / minor 8 / note 0

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
| `vp-dev-implementation-readiness` | 3 | 75 |
| `vp-dev-testability` | 3 | 75 |
| `vp-ops-agent-boundary` | 4 | 100 |
| `vp-ops-operability` | 4 | 100 |
| `vp-ops-release-readiness` | 3 | 75 |
| `vp-pm-control-reporting` | 4 | 100 |
| `vp-pm-dependency-risk` | 3 | 75 |
| `vp-pm-plan-feasibility` | 4 | 100 |
| `vp-po-decision-readiness` | 3 | 75 |
| `vp-po-publication-accountability` | 4 | 100 |
| `vp-po-purpose-alignment` | 4 | 100 |
| `vp-qe-kata-conformance` | 3 | 75 |
| `vp-qe-omissions-consistency` | 3 | 75 |
| `vp-qe-verifiability` | 4 | 100 |
| `vp-ux-language-consistency` | 4 | 100 |
| `vp-ux-readability` | 4 | 100 |

finding:

- `F001` [minor/`vp-po-decision-readiness`; line=42]: TR-04 の `_ASSUMPTION_`（受領額不足の扱いを BAC-01 の前提から解釈）について、確認する人（BA・PO など）と、確定までの confirm-reject-020 の扱いが書かれていないため、判断者と扱いを備考へ足す必要がある。
- `F002` [minor/`vp-pm-dependency-risk`; line=42]: TR-04 は bac-sample の BAC-01 にない受領額不足の条件を仮定で補っているため、BAC への条件追加か PJR 登録候補として仕様の欠けを上流へ戻す扱いを書く必要がある。
- `F003` [minor/`vp-dev-implementation-readiness`; line=25]: 入口が「会計確定の操作」という抽象的な表現だけで、rulebook の「境界/依存」が求める公開API・関数・クラスの名前がないため、テストコードから呼ぶ入口（例: 会計確定サービスのメソッド名）を書く必要がある。
- `F004` [minor/`vp-dev-testability`; line=57]: 証跡の列が「暫定: ローカル実行結果」だけで、テストコードのパスもローカルでの実行コマンドもないため、暫定でも辿れるようにテストファイルの位置と実行手順を書く必要がある。
- `F005` [minor/`vp-qe-omissions-consistency`; line=57]: rulebook の「条件・ケース表」が証跡にテストコードのパスを書くよう定めているのに、全ケースの証跡の列にテストコードのパスがないため、暫定表記に加えてパスを書く必要がある。
- `F006` [minor/`vp-qe-kata-conformance`; line=58]: utc-index-sample.md の共通カラムの記入例（同じ case_id `ut-sales-checkout-stock-allocation-020`、条件に受領額がなく、トレースは「BAC-01 / C-02」の直接記載）と、本書の条件「受領額150円」・トレース「TR-02」が違うため、どちらかを揃える必要がある（rulebook のトレースの規則に合うのは本書の側）。
- `F007` [minor/`vp-qe-kata-conformance`; line=5]: utc-index-sample.md は utc-sales-checkout の責務を「請求額・釣銭の計算」とし観点「釣銭計算の正しさ」にも触れているが、本書の責務とケースには釣銭の計算がないため、責務とケースを足すか index 側の分配を本書に合わせる必要がある。
- `F008` [minor/`vp-ops-release-readiness`; line=42]: TR-04 の `_ASSUMPTION_` と全ケースの暫定の証跡が残っているのに、ready 化の前に何を解消するかが書かれていないため、ready 化前に解消する条件（仮定の確定と CI 証跡への差し替え）を明記する必要がある。

型の整備を含む schedule の追加完了条件: 以下の型すべてに最新の `--target kata` の `pass` が必要。`needs-work` / `fail` は `incomplete` とし、`complete-with-findings` でも完了扱いにしない。未評価・未解決・古い結果は `grade-stale`、読取不能は `grade-unavailable` とする。各対象の鮮度を判定前にも確認し、review 中の変更は `changed-during-review` とする。

型の評価対象（`rulebook`、`--target kata`）: `docs/ja/specdojo/rulebooks/utc-rulebook.md`
評価結果サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/specdojo.utc-rulebook.yaml`

runner が review の前に確認した評価結果を次に示す。これは grade が確定済みの事実であり、review で観点を評価し直したり、同じ finding を改めて指摘したりしない。

- 鮮度: 最新（評価対象の `content_hash` が評価結果の `content_hash` と一致する）
- `verdict`: `pass`
- `score`: 94
- `graded_at`: 2026-11-22T01:06:49.222Z（`graded_by`: opus-review-executor）
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
| `vp-pm-dependency-risk` | 3 | 75 |
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

- `F001` [minor/`vp-pm-dependency-risk`; line=15]: `recipe` の要否判断には `template`（PJR-WYTX）のような登録簿項目や判断のタイミングが示されておらず、ready 化の前提となる依存を追跡できないため、PJR への起票先か判断予定を明記すべきである。
- `F002` [minor/`vp-qe-omissions-consistency`; line=15]: `_UNDECIDED_` に「sample は本文要件の見出し構成へ未整合」と残っているが、現在の `specdojo:utc-sample` は本文要件の章構成・観点見出しに整合しており記述が事実と矛盾するため、sample に関する記述を削除して残る未決事項だけにすべきである。
- `F003` [minor/`vp-qe-omissions-consistency`; line=90]: 記述例の `OutOfStockError` は具体クラス名であり、rulebook-authoring-standard の禁止事項「具体クラス名を書かない」に抵触し、sample のエラー種別 `out-of-stock` とも表記が揃わないため、エラー種別など実装非依存の表現に置き換えるべきである（本文 134 行目の例も同様）。
- `F004` [minor/`vp-qe-kata-conformance`; line=117]: ケース表の `トレース` 列を `TR-xx` で記載するという本書の規定が、`utc-index-rulebook` の「ケース表の共通カラム」の `トレース` 列定義（req/spec/ac/issue 等のID）と食い違っており、共通方針の上書きにあたるため、`utc-index-rulebook` 側の列定義を `trace_key` 参照に揃えるか、本書に例外の根拠を示すべきである。
- `F005` [minor/`vp-ops-release-readiness`; line=1]: `specdojo:utc-sample` の整合は解消したが、`recipe`・`template` が `undecided` のままのため、ready 化前に `recipe`・`template` の要否判断（完全 ID・`not-needed` のいずれか）を済ませる必要がある。

型の評価対象（`sample: specdojo:utc-sample`、`--target kata`）: `docs/ja/specdojo/samples/utc-sample.md`
評価結果サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/specdojo.utc-sample.yaml`

runner が review の前に確認した評価結果を次に示す。これは grade が確定済みの事実であり、review で観点を評価し直したり、同じ finding を改めて指摘したりしない。

- 鮮度: 最新（評価対象の `content_hash` が評価結果の `content_hash` と一致する）
- `verdict`: `pass`
- `score`: 90
- `graded_at`: 2026-11-22T01:07:42.581Z（`graded_by`: opus-review-executor）
- finding 件数: blocker 0 / major 0 / minor 8 / note 0

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
| `vp-dev-implementation-readiness` | 3 | 75 |
| `vp-dev-testability` | 3 | 75 |
| `vp-ops-agent-boundary` | 4 | 100 |
| `vp-ops-operability` | 4 | 100 |
| `vp-ops-release-readiness` | 3 | 75 |
| `vp-pm-control-reporting` | 4 | 100 |
| `vp-pm-dependency-risk` | 3 | 75 |
| `vp-pm-plan-feasibility` | 4 | 100 |
| `vp-po-decision-readiness` | 3 | 75 |
| `vp-po-publication-accountability` | 4 | 100 |
| `vp-po-purpose-alignment` | 4 | 100 |
| `vp-qe-kata-conformance` | 3 | 75 |
| `vp-qe-omissions-consistency` | 3 | 75 |
| `vp-qe-verifiability` | 4 | 100 |
| `vp-ux-language-consistency` | 4 | 100 |
| `vp-ux-readability` | 4 | 100 |

finding:

- `F001` [minor/`vp-po-decision-readiness`; line=42]: TR-04 の `_ASSUMPTION_`（受領額不足の扱いを BAC-01 の前提から解釈）について、確認する人（BA・PO など）と、確定までの confirm-reject-020 の扱いが書かれていないため、判断者と扱いを備考へ足す必要がある。
- `F002` [minor/`vp-pm-dependency-risk`; line=42]: TR-04 は bac-sample の BAC-01 にない受領額不足の条件を仮定で補っているため、BAC への条件追加か PJR 登録候補として仕様の欠けを上流へ戻す扱いを書く必要がある。
- `F003` [minor/`vp-dev-implementation-readiness`; line=25]: 入口が「会計確定の操作」という抽象的な表現だけで、rulebook の「境界/依存」が求める公開API・関数・クラスの名前がないため、テストコードから呼ぶ入口（例: 会計確定サービスのメソッド名）を書く必要がある。
- `F004` [minor/`vp-dev-testability`; line=57]: 証跡の列が「暫定: ローカル実行結果」だけで、テストコードのパスもローカルでの実行コマンドもないため、暫定でも辿れるようにテストファイルの位置と実行手順を書く必要がある。
- `F005` [minor/`vp-qe-omissions-consistency`; line=57]: rulebook の「条件・ケース表」が証跡にテストコードのパスを書くよう定めているのに、全ケースの証跡の列にテストコードのパスがないため、暫定表記に加えてパスを書く必要がある。
- `F006` [minor/`vp-qe-kata-conformance`; line=58]: utc-index-sample.md の共通カラムの記入例（同じ case_id `ut-sales-checkout-stock-allocation-020`、条件に受領額がなく、トレースは「BAC-01 / C-02」の直接記載）と、本書の条件「受領額150円」・トレース「TR-02」が違うため、どちらかを揃える必要がある（rulebook のトレースの規則に合うのは本書の側）。
- `F007` [minor/`vp-qe-kata-conformance`; line=5]: utc-index-sample.md は utc-sales-checkout の責務を「請求額・釣銭の計算」とし観点「釣銭計算の正しさ」にも触れているが、本書の責務とケースには釣銭の計算がないため、責務とケースを足すか index 側の分配を本書に合わせる必要がある。
- `F008` [minor/`vp-ops-release-readiness`; line=42]: TR-04 の `_ASSUMPTION_` と全ケースの暫定の証跡が残っているのに、ready 化の前に何を解消するかが書かれていないため、ready 化前に解消する条件（仮定の確定と CI 証跡への差し替え）を明記する必要がある。

## 4. 完了条件

成果物カタログの `done_criteria` を、このタスクの完了条件として照合する。観点ごとに成果物を評価し直すための表ではない。

<!-- markdownlint-disable MD055 MD056 -->

<!-- prettier-ignore-start -->
| ID | ロール | `viewpoint_id` | 完了条件 |
| --- | --- | --- | --- |
| DC-001 | QE | vp-qe-omissions-consistency | rulebook の章立てと必須の表に沿っていること |
| DC-002 | QE | vp-qe-kata-conformance | Sample 記述標準と共通サンプル文脈（駄菓子屋のプロジェクト）に沿っていること |
| DC-003 | QE | vp-qe-kata-conformance | rulebook の禁止事項に当たらないこと |
| DC-004 | QE | vp-qe-kata-conformance | H1 が rulebook の定めるタイトル形式で、Frontmatter の `based_on` に tsp-index と utc-index を持つこと |
| DC-005 | QE | vp-ux-language-consistency | rulebook にない独自の必須観点を置かず、観点とケース表の列が rulebook の用語に一致していること |
| DC-006 | DEV | vp-dev-testability | ケースごとに前提・入力・判定できる期待値があり、テストコードを書く手掛かりになること |
<!-- prettier-ignore-end -->

<!-- markdownlint-enable MD055 MD056 -->

## 5. 進め方

fully-guided のタスクは、宣言された文書だけを参照し、rulebook / recipe / sample に沿って既存成果物を磨き込むことを求めた。下書きや調査による新しい値の選定は draft の役割である。磨き込みでは template を読み込まない。rulebook の必須要素・禁止事項、recipe の問い、sample の形式との整合は grade が評価済みである。review はこれらを照合し直さず、評価結果の finding として扱う。

参照ファイル（rulebook frontmatter から解決。`_MISSING_` の項目は未宣言・未整備）:

- rulebook: `docs/ja/specdojo/rulebooks/utc-rulebook.md`
- recipe: `_MISSING_`
- sample: `docs/ja/specdojo/samples/utc-sample.md`
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
