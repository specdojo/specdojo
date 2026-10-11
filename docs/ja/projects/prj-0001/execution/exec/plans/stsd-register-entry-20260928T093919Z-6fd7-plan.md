---
specdojo:
  id: prj-0001:xrp-stsd-register-entry-20260928t093919z-6fd7
  type: exec-plan
  rulebook: none
  task_id: stsd-register-entry
  name: ステータス定義（登録項目個票）
  mode: review
  status: ready
  project_id: prj-0001
  targets:
    - stsd-register-entry
---

# Review Plan: stsd-register-entry

## 1. このフェーズで行うこと

ステータス定義（登録項目個票）

## 2. 対象成果物

- `name`: ステータス定義（登録項目個票）
- `depends_on`:
  - [[bdd-register-entry]]
- `overview`: 登録項目個票が取り得る状態（open / in-progress / waiting / review / done / decided / rejected / deferred 等）と状態遷移を一覧・図で定義する
- `path`: `docs/ja/product/010-business-specs/020-data-model/stsd-register-entry.md`
- `rulebook`: `docs/ja/specdojo/rulebooks/stsd-rulebook.md`
- 併せて適用する rulebook（記法など）: `docs/ja/specdojo/rulebooks/stsd-mermaid-rulebook.md`
- `result`: `docs/ja/projects/prj-0001/execution/exec/results/stsd-register-entry-20260928T093919Z-6fd7-result.md`

### プロジェクトコンテキスト

以下は `depends_on` とは独立したプロジェクト共通の文脈であり、実行順序・成果物間の根拠関係を表さない。作業開始前に実際に読み、プロジェクトレベルの Why、用語、判断原則と成果物の内容を整合させる。

- [[prj-0001:prj-overview]]

プロジェクトレベルの Why は判断軸として参照し、全文を成果物へ再掲しない。対象成果物の責務に必要な結論・影響だけを反映する。

## 3. 評価結果

review は成果物を再評価しない。次の評価結果を事実として受け取り、共通規約の `review の判断手順` に従ってタスクの完了可否を判断する。

- 評価対象: `docs/ja/product/010-business-specs/020-data-model/stsd-register-entry.md`
- grade の対象種別（`--target`）: `deliverable`
- 評価結果サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/stsd-register-entry.yaml`（`_MISSING_` は評価対象が未作成、または評価対象の `id` を解決できないことを示す。この場合は評価結果が最新でないものとして扱う）

runner が review の前に確認した評価結果を次に示す。これは grade が確定済みの事実であり、review で観点を評価し直したり、同じ finding を改めて指摘したりしない。

- 鮮度: 最新（評価対象の `content_hash` が評価結果の `content_hash` と一致する）
- `verdict`: `needs-work`
- `score`: 69
- `graded_at`: 2026-09-27T20:31:25.568Z（`graded_by`: codex-expert-executor）
- finding 件数: blocker 0 / major 13 / minor 7 / note 0

grade が判定した観点（全観点）:

| 観点 | level | score |
| --- | --- | --- |
| `vp-arc-conciseness` | 4 | 100 |
| `vp-arc-cross-document-consistency` | 1 | 25 |
| `vp-arc-document-structure` | 4 | 100 |
| `vp-arc-single-responsibility` | 4 | 100 |
| `vp-arc-technical-constraints` | 2 | 50 |
| `vp-ba-business-value` | 3 | 75 |
| `vp-ba-requirements-completeness` | 2 | 50 |
| `vp-ba-stakeholder-clarity` | 4 | 100 |
| `vp-dev-change-impact` | 3 | 75 |
| `vp-dev-implementation-readiness` | 2 | 50 |
| `vp-dev-testability` | 2 | 50 |
| `vp-ops-agent-boundary` | 4 | 100 |
| `vp-ops-operability` | 2 | 50 |
| `vp-ops-release-readiness` | 4 | 100 |
| `vp-pm-control-reporting` | 3 | 75 |
| `vp-pm-dependency-risk` | 3 | 75 |
| `vp-pm-plan-feasibility` | 3 | 75 |
| `vp-po-decision-readiness` | 3 | 75 |
| `vp-po-publication-accountability` | 4 | 100 |
| `vp-po-purpose-alignment` | 4 | 100 |
| `vp-qe-config-validity` | 2 | 50 |
| `vp-qe-done-criteria` | 2 | 50 |
| `vp-qe-omissions-consistency` | 2 | 50 |
| `vp-qe-verifiability` | 2 | 50 |
| `vp-ux-language-consistency` | 3 | 75 |
| `vp-ux-readability` | 4 | 100 |
| `vp-ux-user-flow` | 4 | 100 |

finding:

- `F001` [minor/`vp-po-decision-readiness`; line=124]: 二つの _ASSUMPTION_ について採用・不採用時の遷移仕様、CLI 改修要否、決定後の反映先を明記し、PO が選択結果まで判断できるようにする必要がある。
- `F002` [minor/`vp-pm-plan-feasibility`; line=127]: `bdd-register-entry` の作成と本書への `based_on` 追加を、追跡 ID、作業順序、完了条件を持つ Schedule または PJR 項目へ接続する必要がある。
- `F003` [minor/`vp-pm-dependency-risk`; line=125]: CLI 遷移差異と `bdd-register-entry` 未作成について、Schedule への影響、PJR 登録先、解消まで依存する後続作業を明記する必要がある。
- `F004` [minor/`vp-pm-control-reporting`; line=120]: 各検討項目を PJR の decision・issue・change-request 等へ転記する基準、追跡 ID、報告先を追加する必要がある。
- `F005` [minor/`vp-ba-business-value`; line=5]: 状態定義を共通正本にすることで誤終了、判断漏れ、引継ぎ不能を防ぐ価値と、プロジェクトの BV-03・AC-02 等との対応を補う必要がある。
- `F006` [major/`vp-ba-requirements-completeness`; line=46]: `open` から `done`・`decided` への直接終端、`in-progress`・`waiting` からの終端、終端から `in-progress`・`waiting`・`review` への直接再開を含め、現行運用で成立する全遷移を図と遷移表へ定義する必要がある。
- `F007` [major/`vp-arc-cross-document-consistency`; line=46]: `docs/ja/specdojo/rulebooks/pjr-rulebook.md` 5.3.3 は `open` からの直接終端を許可し、`src/register.ts` も任意の活動中状態から close を受け付けるが、本書は `done`・`decided` への遷移を `review` からしか定義していない。
- `F008` [major/`vp-arc-cross-document-consistency`; line=34]: `docs/ja/specdojo/guides/register-operation-guide.md` 2.1 は担当・期限が未定のままでも運用できるとしているが、本書は担当と期限の反映を `in-progress` の成立条件にしている。
- `F009` [major/`vp-arc-cross-document-consistency`; line=35]: `docs/ja/specdojo/guides/register-operation-guide.md` 2.1 は待機理由を `block_reason` に記録し `conclusion` を変更しないと定めているが、本書は結論欄または本文を記録先としている。
- `F010` [major/`vp-arc-cross-document-consistency`; line=127]: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-data-model-stsd.yaml` は `bdd-register-entry` を `depends_on` に宣言しているが、本書の `based_on` は空で、依存成果物も未作成のままである。
- `F011` [major/`vp-arc-technical-constraints`; line=29]: `item_status`、`block_reason`、`completed_at` と `src/register.ts` の活動中・終端ガードを明示的に対応付け、状態表と許可遷移を schema・CLI の現行制約へ整合させる必要がある。
- `F012` [major/`vp-dev-implementation-readiness`; line=97]: 実装可能な遷移行列として使えるよう、各 `register` コマンドの遷移元・遷移先、更新する Frontmatter キー、拒否条件を T-ID 単位で現行実装へ整合させる必要がある。
- `F013` [minor/`vp-dev-change-impact`; line=124]: 遷移方針を確定した際の影響先として `src/register.ts`、register item/event schema、関連テスト、`pjr-rulebook.md`、`register-operation-guide.md` を列挙する必要がある。
- `F014` [major/`vp-dev-testability`; line=97]: 全許可・禁止遷移、type 別終端、`note` の拒否、日時・理由フィールド更新について、検証対象と期待結果を定義し `register build` および関連テストへ接続する必要がある。
- `F015` [major/`vp-qe-done-criteria`; line=124]: 再開・却下・延期・`note` の未決事項と正本文書との差異を解消し、DC-001〜DC-005 を本文根拠から再判定できる状態にする必要がある。
- `F016` [major/`vp-qe-verifiability`; line=57]: `着手できる`、`対応結果と検証結果がそろった`、`新事実により再評価が必要` を、必須記録、承認者、確認結果による pass / fail 条件へ具体化する必要がある。
- `F017` [major/`vp-qe-omissions-consistency`; line=127]: カタログの `depends_on: bdd-register-entry` を解消して `based_on` へ反映し、recipe の完成条件に反する _TODO_ と未収載の直接終端遷移を残さないようにする必要がある。
- `F018` [minor/`vp-ux-language-consistency`; line=9]: 文書成熟度の `status` と処理状態の `item_status` を明確に区別し、追記型 event は個票内ではなく `events/pjr-XXXX.yaml` に保存されることを正確に記述する必要がある。
- `F019` [major/`vp-ops-operability`; line=35]: 待機理由は `block_reason`、再開条件は本文の所定箇所へ記録し、終端時の `conclusion` を待機操作で変更しない運用へ統一する必要がある。
- `F020` [major/`vp-qe-config-validity`; line=124]: 未解決の _TODO_ / _ASSUMPTION_ が残っています。

## 4. 完了条件

成果物カタログの `done_criteria` を、このタスクの完了条件として照合する。観点ごとに成果物を評価し直すための表ではない。

<!-- markdownlint-disable MD055 MD056 -->

<!-- prettier-ignore-start -->
| ID  | ロール | viewpoint_id | 完了条件 |
| --- | ------ | ------------ | -------- |
| DC-001 | BA | vp-ba-requirements-completeness | ステータス名・意味・成立条件と、遷移・イベント・条件が業務観点で正確に定義されていること |
| DC-002 | PO | vp-po-purpose-alignment | 状態遷移の業務的妥当性を承認できること |
| DC-003 | ARC | vp-arc-technical-constraints | 状態遷移実装の基礎として参照できること |
| DC-004 | QE | vp-qe-verifiability | 状態ベースのテスト設計に活用できること |
| DC-005 | DEV | vp-dev-implementation-readiness | 状態管理実装の参照として使えること |
<!-- prettier-ignore-end -->

<!-- markdownlint-enable MD055 MD056 -->

## 5. 進め方

- exec plan frontmatter の `approach` を確認し、このタスクが何を求めたかを把握する。実践の型（rulebook / recipe / sample / template）との整合は grade が評価済みであり、review で照合し直さない。
- `approach` が `rulebook-maintenance` / `recipe-maintenance` / `sample-maintenance` / `template-maintenance` の場合、評価対象は実践の型そのものである。見直しの動機となった finding が、最新の評価結果で解消しているかを確認する。
- `approach` が `retrofit` の場合は、成果物と実装の対応記録（一致・乖離・確認不能・未確認）と、乖離ごとの修正対象候補が実行記録に残っているかを確認する。
- それ以外の場合は、フェーズ説明と完了条件が求めた作成・更新が行われたかを確認する。
- 確認に用いてよい文書は、この plan に記載されたものに限る。具体的には、評価結果、対象成果物、`depends_on` 成果物、プロジェクトコンテキスト、実行記録である。plan に列挙されていない他のプロジェクト文書を独自に探索・参照しない。

詳細は [[specdojo:ryu-guide]] を参照する。

## 6. 完了手順

1. 共通規約の `review の判断手順` に従い、評価結果の鮮度を確認してから完了可否を判断する。
2. result の各セクションを埋める。`評価結果の確認` には鮮度確認のコマンドと出力、grade の `verdict` / `score` / finding 件数を書く。`判断根拠` には照合した内容を、`未充足事項・改善指示` には未充足事項と改善指示を書く。`approach に応じた確認` には前章で確認した内容を、`decision` には `verdict` を書く。review result の記入はタスク完了に必須であり、未記入のまま終了しない（詳細は共通規約を参照）。
3. 文書の参照は `[[id]]` 形式（Obsidian wikilink）で記載する。行番号アンカー（`#L12-L18` など）や絶対パスは使わない。位置の補足が必要な場合は本文で述べる。
4. verdict が `complete` 以外でも、review result を記録できた場合は正常終了する（終了コード 0）。

## 7. 異常終了の条件

- 対象ファイル不明・依存未解決・result 更新不能など、review 自体を完了できない場合は異常終了する（終了コード 1）。評価結果が最新でない・評価不能であることは異常終了の理由にせず、verdict として記録する。
- 標準エラー出力に理由を出力する（例: `review-blocked: <reason>; ref=<path>`）。
- agent 自身は claim / complete / reopen / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。

## 共通: 記法・成果物規約

この規約は、生成される全 exec plan に共通で適用される。result の完了条件、他文書を参照する際のリンク記法、成果物の状態（status）の扱いを統一する。

- result（review plan の場合は review result）への記入は、タスク完了に必須の作業である。成果物の編集とは別に、最後に必ず実施する。
- 終了コード 0 で完了する前に、result の必須セクションをすべて実際の内容で埋め、プレースホルダ（_TODO_ など）や未記入のセクションを残さない。
- 成果物に変更が不要と判断した場合でも、result の記入は省略しない。変更不要と判断した理由と根拠を result に記入してから完了する。
- result が未記入・プレースホルダのまま終了コード 0 で終了すると、runner は成果物未完了（block）として扱い、タスクはやり直しになる。完了前に result の記入漏れがないことを必ず確認する。
- result の frontmatter は scaffold 済みの構造を正本とする。`id` / `task_id` / `mode` / `project_id` / `plan_ref` / `agent` / `execution` / `approach` / `targets` はキーの追加・削除・改名をせず、scaffold された値のまま維持する。見出し構成（`# Edit Result` などの H1、`## 1.` 以降の章立て）も独自の構成に置き換えない。埋めるのは本文セクションの `_TODO_` プレースホルダの中身だけである。`status` と `completed_at` は完了処理（runner 側）が更新するため、自分で書き換えない。
- 文書へのリンクは、対象文書が既に存在する場合は `[[id|title]]` 形式で記載する（`id` は project 修飾 doc id）。
- リンクを表（テーブル）のセル内に置く場合は、区切りの `|` を `[[id\|title]]` のようにエスケープする。エスケープしないと列がずれて表が壊れ、prettier 整形でセルが分割されて固定化される。
- まだ存在しない文書を参照する場合は、`[[...]]` ではなく `` `id` `` または `` `filename` `` のようにバッククォートで仮置きする。
- Markdown の自由記述では、`_` を含む識別子・フィールド名（例: `depends_on`）を必ずインラインコードで囲む。result に描画される executor evidence や reporter の自由記述も同じ記法にする。
- 成果物 frontmatter の `status` を `ready` に変更しない。`ready` への昇格は人間のみが行うため、`draft` のまま据え置く（exec のコミット時ガードでも昇格はブロックされる）。
- plan に「プロジェクトコンテキスト」章がある場合、そこに挙がる文書はプロジェクト共通の前提を読むための参照であり、成果物 frontmatter の `based_on` へ転記しない。参照して得た前提は本文の記述内容へ反映する。
- 成果物 frontmatter の `based_on` に書けるのは、その成果物の `depends_on` の推移閉包に含まれる先行成果物だけである。閉包外の ID を書くと `catalog validate` が「`based_on` が `depends_on` の推移閉包に含まれていません」としてエラーになり、コミットがブロックされる。`based_on` を増やす必要が生じた場合は、自分で転記せず、根拠不足として result に記録する。
- ファイルの読み取り・書き込み・編集は、作業ディレクトリ（カレントディレクトリ）からの相対パスで指定する。絶対パスを自分で組み立てたり、作業ディレクトリ名を推測して指定したりしない（作業ディレクトリ名の取り違えは外部パス扱いになり拒否される）。
- 編集・書き込みが作業ディレクトリ外（`external_directory`）として拒否された場合、原因はパス指定の誤り（誤った絶対パス・ディレクトリ名の取り違え）である。bash の heredoc などへ回避的に切り替えず、相対パスに直したうえで同じ編集ツールで再実行する。
- 作業用のファイル（編集用スクリプト、検証用の一時データなど）はリポジトリの外（一時ディレクトリ）に置き、終了前に削除する。リポジトリ内、とくにリポジトリ直下に作業用のファイルを作らない。成果物ではない新規ファイルは commit されず、`commit-scope:` の警告として記録される。
- 整形・静的検査は、この plan の完了手順または本共通規約で明示されたコマンドを実行する。変更対象に必要な test、build、schema 検証は、plan に個別記載がなくても実行してよい。同じ test script では対象限定と全件を同一 executor run 内で連続実行せず、どちらか一方に絞る。下表、plan、またはプロジェクト標準が全件 test を求める場合は、全件を1回だけ実行して対象限定の実行を省く。この制約は executor が sandbox 内で実行する test script の回数に対するものであり、親検証に設定された ID のコマンドは対象外である（親 runner が別途実行する）。実行したコマンド・対象・結果は result に記録する。
- executor / reporter pipeline で親 runner の検証が設定されている場合、executor は設定済み ID に対応するコマンドを sandbox 内で実行せず、executor 終了後に親 runner が固定許可リストから実行して evidence へ追記する。`validate-schema` は `npm run validate:schema`、`test-unit` は `npm run test:unit`、`test-integration` は `npm run test:integration` に対応する。executor は親検証と同じコマンドの対象限定版も追加せず、二重実行しない。
- Markdown 成果物を編集した後は、`npx prettier --write <対象ファイル>` で整形し、`npx markdownlint <対象ファイル>` で静的検査を実施する。検査でエラーが出た場合は修正してから完了とする。
- 終了する前に、コミット時に実行される検査（pre-commit 相当）を先回りで実行し、失敗をすべて修正してから完了する。コミット時に初めて失敗が判明すると commit がブロックされ、成果物の内容が完成していてもタスクは block になる。
- 実行対象は、変更したファイルの種別で判断する。下表のうち、変更したファイルが該当する行の検査をすべて実行する。該当行がない場合は追加の検査は不要である。ただし親検証に設定された ID のコマンドは下表よりも優先し、executor は実行しない。下表に同じコマンドが挙がっていても、親 runner の実行に委ねる。
- 検査コマンドの正本はリポジトリの hook 設定（`lefthook.yml` など）である。下表と設定が食い違う場合は設定側に合わせ、実行したコマンドと結果を result に記録する。`specdojo` コマンドは、リポジトリで定められた起動方法（`npx tsx src/specdojo.ts <subcommand>` など）で実行する。

| 変更したファイル                                                                                       | 実行する検査                                                                                                                          |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `*.md`                                                                                                 | `npx prettier --write <対象ファイル>`、`npx markdownlint <対象ファイル>`                                                              |
| `*.ts` / `*.js` / `*.json` / `*.yaml` / `*.yml`                                                        | `npx prettier --write <対象ファイル>`                                                                                                 |
| `src/`、`tests/`、`scripts/`、`tools/`、`tsconfig*.json`                                               | `npm run typecheck`                                                                                                                   |
| `src/`、`tests/`、`docs/ja/specdojo/templates/`、`docs/ja/specdojo/exec-templates/`、`vitest.config.*` | pipeline executor は `npm run test:unit`、それ以外は `npm test`（`test-unit` が親検証に設定されている場合は executor では実行しない） |
| `docs/ja/projects/` 配下                                                                               | `specdojo catalog validate`                                                                                                           |
| `dct-*.yaml`                                                                                           | `specdojo catalog build`                                                                                                              |
| `pjr-index.md`                                                                                         | `specdojo register build`                                                                                                             |
| `sch-*.yaml`                                                                                           | `specdojo exec refresh`                                                                                                               |
| `docs/` 配下                                                                                           | `specdojo index build`                                                                                                                |

### review の判断手順

review plan に共通で適用する。review はタスクの成果を判定し、成果物の品質は判定しない。成果物の品質は grade が一度だけ評価する。review はその評価結果（grade・finding）を事実として受け取り、このタスクを完了してよいかを判断する（[[bps-task-completion]]）。

- 成果物を再評価しない。観点ごとの pass / fail を付け直したり、評価結果の判定を自分の判断で置き換えたりしない。評価結果の内容に疑義がある場合は、疑義の内容と再評価が必要な理由を改善指示に記録する。
- 評価結果の鮮度を最初に確認する（`E-01`）。plan の「評価結果」章に示す評価対象と `--target` を使い、`specdojo grade list --target <対象種別> --path <評価対象> --changed-only` を実行する。`--target deliverable` の場合は `--dependency-changed` でも同様に実行する。いずれかが評価対象のパスを出力した場合、または評価結果サイドカーが存在しない場合は、評価結果が最新でない。成果物を自分で評価して補わず、verdict を `grade-stale` とする。
- 評価結果を確定できない場合（`E-02`）は、verdict を `grade-unavailable` とする。サイドカーを読み取れない場合と、`specdojo grade list --target <対象種別> --path <評価対象> --incomplete` が評価対象のパスを出力する場合（評価パイプラインが未完了）が該当する。
- 評価結果が最新であれば、サイドカーの `verdict` / `score` / `finding_counts` / `findings`、および `done_criteria`（存在する場合）を読み取る。
- 変更内容・この plan・実行記録・完了条件・最新の finding を照合し、このタスクの範囲と完了条件を満たすかを判断する（`S-02`）。完了条件の充足は、評価結果に判定がある場合はそれを事実として用いる。評価結果が扱わない事項を review で確かめる。対象は、フェーズ説明が求めた変更が行われたか、対象外の変更が混入していないか、実行記録の検証結果が成功しているかである。実行記録（先行する edit タスクの result）を特定できない場合は、確認できなかったことを判断根拠に記録する。
- finding が残っていても、このタスクの範囲と完了条件を満たしていれば完了できる。その場合は finding を消去・再評価せず、完了を妨げない理由と必要な改善指示を記録する。
- 判断の根拠は、評価結果・成果物・plan・実行記録を実際に読んで得た具体的な事実に限る。executor の最終メッセージや result の自己申告を、そのまま、または言い換えて根拠にしない。
- verdict を記録する直前に鮮度の確認を再実行する。最初の確認の後に成果物が変更されて評価結果が最新でなくなった場合は、verdict を `changed-during-review` とする（review 中の成果物変更）。

verdict は次の 6 値から 1 つを選ぶ。各値は [[bps-task-completion]] の検証・受入観点と一対一に対応する。

| verdict                  | 受入観点                | 選ぶ条件                                                                          | 記録すること                                               |
| ------------------------ | ----------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `complete`               | 完了可能                | 評価結果が最新で、plan と完了条件を満たし、完了を妨げる未充足事項がない           | 照合した根拠                                               |
| `complete-with-findings` | 品質 finding を伴う完了 | 評価結果に finding があるが、このタスクの範囲と完了条件は満たしている             | finding が完了を妨げない理由と改善指示                     |
| `incomplete`             | 品質良好だが未完了      | plan または完了条件に未充足事項がある（grade の良否は問わない）                   | 未充足事項と、再計画に使う改善指示                         |
| `grade-stale`            | 評価結果が最新でない    | 評価結果がない、`content_hash` が一致しない、または評価コンテキストの変化が未反映 | 鮮度確認のコマンドと出力。完了可否は判断しない             |
| `grade-unavailable`      | 評価不能                | 評価結果を読み取れない、または評価パイプラインが未完了で grade・finding が未確定  | 評価不能の理由と不足情報。完了は保留する                   |
| `changed-during-review`  | review 中の成果物変更   | 最初の鮮度確認の後に成果物が変更され、評価結果が最新でなくなった                  | 変更を検知した確認の出力。verdict を確定せず再評価を求める |

- verdict が `complete` 以外でも、review result を記録できた場合は正常終了する（終了コード 0）。runner は verdict に応じて再評価または再計画へ進む。
- review result の章立ては `評価結果の確認`、`判断根拠`、`未充足事項・改善指示`、`approach に応じた確認`、`decision` である。`decision` の `verdict` は必ず上表の値で埋める。
