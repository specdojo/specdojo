---
specdojo:
  id: prj-0001:xep-pjr-5rs9-20260926t235053z-6c82
  type: exec-plan
  rulebook: none
  task_id: PJR-5RS9
  name: "bps-task-review-finalize の `local_id` を中身に合わせ cdfd-overview の不整合を直す"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
  owner: DEV
---

# Edit Plan: PJR-5RS9 bps-task-review-finalize の `local_id` を中身に合わせ cdfd-overview の不整合を直す

## 1. このタスクで行うこと

プロジェクト登録簿の項目 PJR-5RS9「bps-task-review-finalize の `local_id` を中身に合わせ cdfd-overview の不整合を直す」に対応する。

夜間作業の評価で、次の 2 つの不整合を確認した。

## 2. 対象項目

- `id`: PJR-5RS9
- `type`: todo
- `priority`: medium
- `owner`: DEV
- `due`: _TODO_
- `登録簿`: `docs/ja/projects/prj-0001/controls/project-register/pjr-index.md`
- `個票`: `docs/ja/projects/prj-0001/controls/project-register/pjr-5rs9-bps-review-finalize-and-cdfd-overview.md`
- `result`: `docs/ja/projects/prj-0001/execution/exec/results/pjr-5rs9-20260926T235053Z-6c82-result.md`

## 3. 進め方

1. 登録簿の該当行と個票（存在する場合）を読み、目的・完了条件・制約を把握する。
2. 個票に完了条件がある場合はそれを作業の基準にする。無い場合はタイトルと説明から完了条件の仮説を立て、その仮説を result に明記する。
3. 関連する成果物・設計書・実装を確認し、対象ファイルを特定して変更する。
4. 個票が存在する場合は、個票の作業内容・対応結果セクションを実施内容で更新する。
5. 判断に迷う箇所は _TODO_ / _ASSUMPTION_ で残し、根拠と次のアクションを result に書く。

### grade result から展開された finding

- [[cdfd-overview]] (サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/cdfd-overview.yaml`):
  - [major/vp-arc-cross-document-consistency; line=35; anchor="<!-- prettier-ignore -->"]: 成果物カタログの `cdfd-onboarding` は repository からの導入、既存プロジェクトへの導入、Detached Unit を対象に含めるが、本書の P-01 は起点を「PO が新しいプロジェクトを立ち上げた」に限定しており、詳細化範囲と起動条件を統一する必要がある。
  - [major/vp-arc-cross-document-consistency; line=89; anchor="- **主要入力**: Orchestrator からの完了・改善要求、評価結果、進捗報告の判断事項、完了条件、参加者からの構成変更要求と承認結果、参加者からの非推奨化の判断"]: 本書は Action の主要入力を「参加者からの構成変更要求と承認結果」「参加者からの非推奨化の判断」とする一方、`cdfd-action` は承認結果と非推奨化判断を Action 内部で生成しており、人間の判断境界を統一する必要がある。
  - [major/vp-arc-cross-document-consistency; line=74; anchor="- **主要入力**: Orchestrator からの評価・報告要求、作成・更新された成果物、成果物カタログ、Schedule（track）、登録簿、実行記録・実行状態、Kata の rubric・評価観点"]: 本書は Check への要求を「評価・報告要求」に限定する一方、`docs/ja/product/010-business-specs/010-data-flow/cdfd-check.md` と `cdfd-orchestrator.md` は P-10 の起動入力として「生成要求」を含むため、主要入力と Orchestrator からのエッジを「評価・報告・生成要求」に統一する必要がある。
  - [major/vp-arc-cross-document-consistency; line=104; anchor="- **主要入力**: 稼働構成の agent 定義・実行既定値、参加者からの意図、成果物カタログの完了条件、スケジュール戦略の作業要件、実行計画（対象・手順・完了条件）、定期実行定義、実行状態"]: 本書は Orchestrator が受け取る応答を実行記録からの「実行状態」に集約し、Plan・Check・Action からの応答エッジを持たない一方、`docs/ja/product/010-business-specs/010-data-flow/cdfd-orchestrator.md` は Plan の計画応答、Check の評価・報告・生成結果、Action の完了・改善判断を直接入力としており、グループ間の応答フローを統一する必要がある。
  - [major/vp-qe-done-criteria; line=19; anchor="- 人間と AI Agent の責任分担は、承認、完了判断、構成変更の承認、非推奨化の判断を人間が担い、成果物の作成・評価・派生生成は人が担うほか AI Agent へ委譲できる、という原則に従う。本書の各領域はこの原則を前提とし、人間の判断を自動処理に置き換えない。"]: DC-002（PO による対象範囲と領域分割の承認）を満たす承認記録が特定できず、未充足である。
  - [minor/vp-qe-done-criteria; line=104; anchor="- **主要入力**: 稼働構成の agent 定義・実行既定値、参加者からの意図、成果物カタログの完了条件、スケジュール戦略の作業要件、実行計画（対象・手順・完了条件）、定期実行定義、実行状態"]: DC-003 が要求する主要入力と概念データフローの相互対応について、図 5.2 のエッジにある「rulebook 参照」が Orchestrator の「主要入力」から欠落している。
  - [minor/vp-qe-done-criteria; line=74; anchor="- **主要入力**: Orchestrator からの評価・報告要求、作成・更新された成果物、成果物カタログ、Schedule（track）、登録簿、実行記録・実行状態、Kata の rubric・評価観点"]: DC-003 が要求する起点イベントと概念データフローの対応について、P-10 の「派生成果物の生成が要求された」に対応する生成要求が Check の主要入力と Orchestrator からのエッジにない。
  - [major/vp-qe-omissions-consistency; line=19; anchor="- 人間と AI Agent の責任分担は、承認、完了判断、構成変更の承認、非推奨化の判断を人間が担い、成果物の作成・評価・派生生成は人が担うほか AI Agent へ委譲できる、という原則に従う。本書の各領域はこの原則を前提とし、人間の判断を自動処理に置き換えない。"]: 現行の 14 領域・六グループへの改訂を PO が承認した記録を特定できず、現在の境界に対する承認記録を追加する必要がある。
  - [minor/vp-qe-omissions-consistency; line=104; anchor="- **主要入力**: 稼働構成の agent 定義・実行既定値、参加者からの意図、成果物カタログの完了条件、スケジュール戦略の作業要件、実行計画（対象・手順・完了条件）、定期実行定義、実行状態"]: Orchestrator の図 5.2 には「完了条件・rulebook 参照」のエッジがあるが「主要入力」には rulebook 参照が記載されていないため、図のエッジに対応する入力を追加する必要がある。
  - [minor/vp-qe-omissions-consistency; line=281; anchor="| プロセスグループ | 含む領域 | phase / 判定との対応 | プロセスグループ別 CDFD |"]: プロセスグループ別 CDFD の表が「phase / 判定との対応」列を含む 4 列構成になっており, rulebook が規定する 3 列構成と矛盾するため、余分な列を削除する必要がある。
  - [minor/vp-qe-omissions-consistency; line=74; anchor="- **主要入力**: Orchestrator からの評価・報告要求、作成・更新された成果物、成果物カタログ、Schedule（track）、登録簿、実行記録・実行状態、Kata の rubric・評価観点"]: P-10 の起点イベントは派生成果物の生成要求であるが、Check の主要入力と図 5.1 の Orchestrator からのエッジが評価・報告要求だけになっているため、生成要求を追加する必要がある。
- [[cdfd-orchestrator]] (サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/cdfd-orchestrator.yaml`):
  - [minor/vp-qe-omissions-consistency; line=13; anchor="## 2. 適用範囲"]: rulebook 6.1 と recipe 4.2 は適用範囲への期間の明記を要求している一方、本節には対象期間または期間を限定しない旨がないため追記してください。
  - [minor/vp-qe-omissions-consistency; line=13; anchor="## 2. 適用範囲"]: rulebook と recipe が必須とする適用期間または期間を限定しない旨が適用範囲から欠落しているため追記してください。
  - [minor/vp-qe-omissions-consistency; line=35; anchor="| プロセス ID | プロセス      | 業務目的                                                                                       | 主な担当                                             | 起動条件                                                                                                     | 必須性 |"]: rulebook 6.2 が必須とする「完了条件」列がプロセス領域の表から欠落しているため、列を追加し各プロセスの完了条件を明記してください。
  - [minor/vp-qe-omissions-consistency; line=149; anchor="| `E-14-03` | `P-14-04`    | 要求先から失敗またはブロックの応答があり、要求で求めた出力または次の判断に必要な情報がそろわない。                             | 後続グループへの要求発行を止め、失敗・ブロック理由、判断依頼、再開位置を実行記録へ残して、人間の判断対象として提示する。                                                 | 失敗・ブロック原因が解消され、再実行、別要求、または中止のいずれかを人間が判断した後、再開する場合は `P-14-02` から要求を再判定する。 |"]: rulebook 6.7 と template が必須とする「停止範囲」列が例外表にないため、各例外で確定・起動してはならない後続プロセス、出力、委譲を独立した列として明示してください。
- [[cdfd-check]] (サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/cdfd-check.yaml`):
  - [minor/vp-arc-cross-document-consistency; line=19; anchor="- **期間・組織境界**: SpecDojo を利用するプロジェクトの実行期間を対象とし、QE、PM、ARC を含む参加者と、支援を委譲された AI Agent または runner の協働を扱う。主担当のロールコードと member・agent・runner の責任分担は [[prj-0001:pm-roles|ロール一覧]] を正本とし、本書では各プロセスの最終判断者と委譲可能な支援だけを示す。"]: 「member・agent・runner の責任分担」の正本を pm-roles としているが、同ファイルは Role code と責務だけを定義し, 兼務・実行主体は pm-members.yaml, 人間と AI Agent の責任分担原則は cdfd-overview に委譲しているため, 参照先を責務ごとに分けてください。
  - [major/vp-qe-verifiability; line=52; anchor="| プロセス ID | プロセス           | 業務目的                                                                                        | 主な担当 | 起動条件                                                                     | 必須性 |"]: P-08〜P-10 の全プロセス表に rulebook が必須とする「完了条件」列がなく, 各プロセスの業務目的を達成したかを yes / no で判定できないため, 主要出力または正本の確定と対応する完了条件を各行へ追加してください。
  - [major/vp-qe-omissions-consistency; line=52; anchor="| プロセス ID | プロセス           | 業務目的                                                                                        | 主な担当 | 起動条件                                                                     | 必須性 |"]: cdfd-rulebook の本文要件と完成判定, および cdfd-template・cdfd-sample が必須とする「完了条件」列が P-08〜P-10 の全プロセス表から欠落しているため, 各プロセスへ判定可能な完了条件を追加してください。
  - [minor/vp-qe-omissions-consistency; line=304; anchor="| 例外 ID   | 対象プロセス         | 検出条件                                                                                                                           | 本グループでの扱い                                                                                                                      | 継続・再開条件                                                                                           |"]: 主要例外表に cdfd-rulebook が必須とする「停止範囲」列がなく, 扱い欄に停止内容が混在しているため, 確定または起動してはならない後続プロセス・出力・委譲を例外ごとに独立して示してください。
  - [minor/vp-qe-omissions-consistency; line=19; anchor="- **期間・組織境界**: SpecDojo を利用するプロジェクトの実行期間を対象とし、QE、PM、ARC を含む参加者と、支援を委譲された AI Agent または runner の協働を扱う。主担当のロールコードと member・agent・runner の責任分担は [[prj-0001:pm-roles|ロール一覧]] を正本とし、本書では各プロセスの最終判断者と委譲可能な支援だけを示す。"]: rulebook が求める人間と AI Agent の責任分担の対応文書として pm-roles だけを示しているが, 同文書は実行主体の割当を pm-members.yaml へ委譲しているため, pm-members と cdfd-overview への参照を補ってください。
  - [minor/vp-ux-readability; line=52; anchor="| プロセス ID | プロセス           | 業務目的                                                                                        | 主な担当 | 起動条件                                                                     | 必須性 |"]: P-08〜P-10 のプロセス表に完了条件がないため, 読者が「業務目的」と「完了したと判断できる事実」を区別できず, 各プロセスの終了点を個別入出力表から推測する必要があるため, 完了条件列を追加してください。
  - [minor/vp-ux-readability; line=19; anchor="- **期間・組織境界**: SpecDojo を利用するプロジェクトの実行期間を対象とし、QE、PM、ARC を含む参加者と、支援を委譲された AI Agent または runner の協働を扱う。主担当のロールコードと member・agent・runner の責任分担は [[prj-0001:pm-roles|ロール一覧]] を正本とし、本書では各プロセスの最終判断者と委譲可能な支援だけを示す。"]: 適用範囲で Role code の語彙と member・agent・runner の責任分担を一つの pm-roles 正本へまとめて表現しており, 初見の読者がロール定義と実行主体割当の違いを読み分けにくいため, 正本を分けて記述してください。
  - [minor/vp-ux-user-flow; line=19; anchor="- **期間・組織境界**: SpecDojo を利用するプロジェクトの実行期間を対象とし、QE、PM、ARC を含む参加者と、支援を委譲された AI Agent または runner の協働を扱う。主担当のロールコードと member・agent・runner の責任分担は [[prj-0001:pm-roles|ロール一覧]] を正本とし、本書では各プロセスの最終判断者と委譲可能な支援だけを示す。"]: member・agent・runner の責任分担を確認する導線が Role code の一覧である pm-roles に止まり, 実行主体の正本 pm-members と人間／AI の原則を示す cdfd-overview へ直接到達できないため, 参照を分けてください。

plan に展開された finding は、message と同じ viewpoint ID の判定根拠に照らして解消する。未解消、根拠不足、または判断不能の場合は、理由と次のアクションを result に記録する。grade result サイドカーは再評価時に更新されるため、本タスクでは直接編集しない。

## 4. 完了手順

1. 「進め方」に従って対応を完了する。
2. 共通規約に従って、必要な整形・静的検査を実行する。
3. result に実施内容・変更ファイル・申し送りを記入する。これはタスク完了に必須であり、_TODO_ を残したまま終了しない（詳細は共通規約を参照）。
4. 登録簿（`pjr-index.md`）の行と個票のステータス項目は変更しない。状態遷移（review / close など）は runner と人間が行う。

## 5. 異常終了の条件

- 前提不足・対象ファイル不明・静的検査未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- agent 自身は登録簿の状態を変更せず、終了コードと標準エラー出力で runner に結果を返す。

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
