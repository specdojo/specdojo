---
specdojo:
  id: prj-0001:xep-t-data-flow-cdfd-routine-075
  type: exec-plan
  rulebook: none
  task_id: T-DATA-FLOW-cdfd-routine-075
  name: 実装調査・草案再作成（Kata反映）
  mode: edit
  status: ready
  project_id: prj-0001
  owner: BA
  on_critical_path: true
  approach: retrofit
  targets:
    - prj-0001:cdfd-routine
---

# Edit Plan: T-DATA-FLOW-cdfd-routine-075

## 1. このフェーズで行うこと

整備済みの cdfd-rulebook / recipe / sample / template（Kata）に基づき、成果物を
再度 retrofit する。DCT の evidence_refs から現在動作を再調査し、既存成果物・
決定記録・プロジェクト文脈が示す意図された仕様、および成果物カタログの
done_criteria と、更新済み Kata の章構成・記述ガイドと照合する。1回目の
retrofit-pass・refine-pass の結果を土台に、Kata の変更点（個別プロセス主要
入出力の分離、必須・条件付きプロセスによる図分割など）を反映して成果物を
作り直す。

## 2. 対象成果物

- `name`: 概念データフロー図（定期実行）
- `depends_on`:
  - [[prj-0001:cdfd-register-operation]]
  - [[prj-0001:cdfd-task-execution]]
- `overview`: routine定義とdue判定に基づき、既存の登録項目・Scheduleタスク、順次実行cycle、またはJobから生成した実行単位を起動し結果を反映する流れを可視化し定義する
- `path`: `docs/ja/product/010-business-specs/010-data-flow/cdfd-routine.md`
- `rulebook`: `docs/ja/specdojo/rulebooks/cdfd-rulebook.md`
- `result`: `docs/ja/projects/prj-0001/execution/exec/results/T-DATA-FLOW-cdfd-routine-075-result.md`

### プロジェクトコンテキスト

以下は `depends_on` とは独立したプロジェクト共通の文脈であり、実行順序・成果物間の根拠関係を表さない。作業開始前に実際に読み、プロジェクトレベルの Why、用語、判断原則と成果物の内容を整合させる。

- [[prj-0001:prj-overview]]

プロジェクトレベルの Why は判断軸として参照し、全文を成果物へ再掲しない。対象成果物の責務に必要な結論・影響だけを反映する。

## 3. 実装エビデンス

次の参照は成果物カタログの `evidence_refs` から展開した読み取り専用の調査入力である。`targets`、変更許可範囲、commit 対象には含めない。

- `src/routine.ts`（implementation）: routineのdue判定・委譲・実行結果更新
- `src/exec-run.ts`（implementation）: resume・状態再計算・autoを単一ロック内で順次実行するcycle制御
- `src/job.ts`（implementation）: Job Definition検証・Job Run生成・checkpoint更新

## 4. 根拠の位置づけ

根拠は次の責務で使い分ける。実装だけを意図された仕様の正本とはみなさない。

| 根拠                                               | 位置づけ                | 主な確認内容                             |
| -------------------------------------------------- | ----------------------- | ---------------------------------------- |
| 実装エビデンス                                     | 現在動作（AS-IS）の根拠 | 入出力、処理、状態遷移、例外、制約       |
| 既存成果物・`depends_on`・プロジェクトコンテキスト | 意図された仕様の根拠    | 目的、業務判断、承認済みの変更、将来方針 |
| 成果物カタログの `done_criteria`                   | 成果物が満たすべき目的  | 記載範囲、完了判定、下流利用者の必要情報 |
| rulebook                                           | 文書構造と記法の基準    | 必須要素、禁止事項、表現規則             |

併せて適用する rulebook（記法など）: `docs/ja/specdojo/rulebooks/cdfd-mermaid-rulebook.md`

## 5. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。

- owner role: **BA（Business Analyst）**
- 責務: 仕様を書く人と読む人の利用者視点から、文書体系への要求、利用場面、受入条件を整理する。

このロールが重視するレビュー観点:

- 業務価値との対応: 業務価値を定義・展開する成果物で、主要な定義・判断がどの対象者のどの業務課題・期待価値に応えるかを説明でき、主要な成果・方針がその目的に対応しているか。構造・設定中心の成果物では、上位目的への参照と下流利用の整合を確認し、業務上の Why の詳細な再掲を要求しない。
- 要件・受入条件の充足: 要件、受入条件、対象範囲、対象外が利用者視点で確認できる粒度になっているか。
- 関係者・利用場面の明確性: 関係者、利用場面、確認者、合意対象が読み取れるか。

## 6. 進め方

1. 対象成果物が存在するかを確認し、存在する場合は既存記述を先に読む。`depends_on` とプロジェクトコンテキストも読み、意図された仕様を抽出する。
2. 「実装エビデンス」に列挙されたパスをすべて実際に読み、確認できた現在動作を、参照パスと対応付けて整理する。列挙外のコードを根拠に追加する必要がある場合は、変更せず未確認範囲として result に記録する。
3. 現在動作、意図された仕様、`done_criteria` を照合し、一致・乖離・実装から確認不能・未確認に分類する。実装から目的、業務判断、将来方針を推測しない。
4. 次の判断基準で、維持・部分反映・作り直し・新設を選ぶ。

| 判断     | 条件                                                                  | 対応                                                 |
| -------- | --------------------------------------------------------------------- | ---------------------------------------------------- |
| 維持     | 既存文書が現在動作と意図された仕様を満たす                            | 誤記や不足がなければ変更せず、照合結果だけを記録する |
| 部分反映 | 既存構造は有効だが、承認済みの現在動作が欠落または古い                | 該当箇所だけを更新し、既存の有効な記述を保持する     |
| 作り直し | 既存構造では `done_criteria` を満たせず、局所修正より再構成が明確     | 有効な決定・用語を保持しながら文書を再構成する       |
| 新設     | 対象成果物が存在せず、カタログに `path` と `done_criteria` が定義済み | rulebook とカタログに従って新規作成する              |

判断後は次の順で作業する。

1. 実装と意図された仕様が一致する箇所、または実装変更が承認済みで文書だけが古い箇所を成果物へ反映する。承認根拠が確認できない乖離は実装へ無条件に合わせず、成果物には意図された仕様を保持し、PJR または後続 review finding 候補として result に残す。
2. 実装エビデンスは編集しない。実装修正が必要な場合は、本タスクへ混在させず別タスクとして申し送る。

### 6.1. 判断根拠の記録

result には、少なくとも次を記録する。

- 実際に参照した実装エビデンスのパスと、そこから抽出した現在動作
- 選択した判断（維持・部分反映・作り直し・新設）と根拠
- 成果物へ反映した内容
- 未反映の乖離と、実装・文書のどちらを変更すべきかの候補
- 調査できなかったパス、分岐、外部依存などの未確認範囲

本タスクの実行に必要な retrofit の進め方は、このセクションで完結する。approach 全体の定義を確認したい場合のみ、参考として [[specdojo:ryu-guide]] を参照する。

## 7. 完了の狙い

owner として達成する狙い:

- routine定義の選択・due判定・register/schedule実行への委譲、resumeから状態再計算・autoへ進むexec-cycleに加え、Job Run生成を伴う反復作業との境界・実行結果更新の流れが表と図で確認できること

下流ロールの入力適合（最低ライン。各ロールの内容は作り込まず、入力として成立させる）:

- [ARC] rtn-\*.yamlのaction kind・filter・interval・limit、個票Frontmatterを正本とするregister対象選択、exec-cycleのstrategy・parallel・loop、Job連携時のcron・timezone・missed/overlap policyと、委譲先へ渡す入力および返却される結果が識別できること
- [QE] projectがbusyの場合、対象なし・利用制限・cycleのstep別失敗・再開時刻待ち・重複Job Run・取りこぼしの場合に、last_run・last_resultと次回判定がどのように記録されるか確認できること

## 8. 完了手順

1. 「進め方」に従って成果物を更新または新設する。
2. 「完了の狙い」を満たし、実装との一致・乖離・未確認範囲を区別できることを確認する。
3. 共通規約に従って、必要な整形・静的検査を実行する。
4. result に実施内容・変更ファイル・判断根拠を記入する。プレースホルダを残したまま終了しない。

## 9. 異常終了の条件

- `evidence_refs` 欠落、実装エビデンス不存在、対象パス不明、lint/test 未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
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
- 成果物 frontmatter の `status` を `ready` に変更しない。`ready` への昇格は人間のみが行うため、`draft` のまま据え置く（exec のコミット時ガードでも昇格はブロックされる）。
- plan に「プロジェクトコンテキスト」章がある場合、そこに挙がる文書はプロジェクト共通の前提を読むための参照であり、成果物 frontmatter の `based_on` へ転記しない。参照して得た前提は本文の記述内容へ反映する。
- 成果物 frontmatter の `based_on` に書けるのは、その成果物の `depends_on` の推移閉包に含まれる先行成果物だけである。閉包外の ID を書くと `catalog validate` が「`based_on` が `depends_on` の推移閉包に含まれていません」としてエラーになり、コミットがブロックされる。`based_on` を増やす必要が生じた場合は、自分で転記せず、根拠不足として result に記録する。
- ファイルの読み取り・書き込み・編集は、作業ディレクトリ（カレントディレクトリ）からの相対パスで指定する。絶対パスを自分で組み立てたり、作業ディレクトリ名を推測して指定したりしない（作業ディレクトリ名の取り違えは外部パス扱いになり拒否される）。
- 編集・書き込みが作業ディレクトリ外（`external_directory`）として拒否された場合、原因はパス指定の誤り（誤った絶対パス・ディレクトリ名の取り違え）である。bash の heredoc などへ回避的に切り替えず、相対パスに直したうえで同じ編集ツールで再実行する。
- 整形・静的検査は、この plan の完了手順または本共通規約で明示されたコマンドを実行する。変更対象に必要な test、build、schema 検証は、plan に個別記載がなくても実行してよい。対象を限定できる場合は対象限定の手順を優先し、プロジェクト標準または変更内容から全体 test / build が必要な場合は実行してよい。実行したコマンド・対象・結果は result に記録する。
- Markdown 成果物を編集した後は、`npx prettier --write <対象ファイル>` で整形し、`npx markdownlint <対象ファイル>` で静的検査を実施する。検査でエラーが出た場合は修正してから完了とする。
- 終了する前に、コミット時に実行される検査（pre-commit 相当）を先回りで実行し、失敗をすべて修正してから完了する。コミット時に初めて失敗が判明すると commit がブロックされ、成果物の内容が完成していてもタスクは block になる。
- 実行対象は、変更したファイルの種別で判断する。下表のうち、変更したファイルが該当する行の検査をすべて実行する。該当行がない場合は追加の検査は不要である。
- 検査コマンドの正本はリポジトリの hook 設定（`lefthook.yml` など）である。下表と設定が食い違う場合は設定側に合わせ、実行したコマンドと結果を result に記録する。`specdojo` コマンドは、リポジトリで定められた起動方法（`npx tsx src/specdojo.ts <subcommand>` など）で実行する。

| 変更したファイル                                                   | 実行する検査                                                             |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| `*.md`                                                             | `npx prettier --write <対象ファイル>`、`npx markdownlint <対象ファイル>` |
| `*.ts` / `*.js` / `*.json` / `*.yaml` / `*.yml`                    | `npx prettier --write <対象ファイル>`                                    |
| `src/`、`tests/`、`scripts/`、`tools/`、`tsconfig*.json`           | `npm run typecheck`                                                      |
| `src/`、`tests/`、`docs/ja/specdojo/templates/`、`vitest.config.*` | `npm test`                                                               |
| `docs/ja/projects/` 配下                                           | `specdojo catalog validate`                                              |
| `dct-*.yaml`                                                       | `specdojo catalog build`                                                 |
| `pjr-index.md`                                                     | `specdojo register build`                                                |
| `sch-*.yaml`                                                       | `specdojo exec refresh`                                                  |
| `docs/` 配下                                                       | `specdojo index build`                                                   |
