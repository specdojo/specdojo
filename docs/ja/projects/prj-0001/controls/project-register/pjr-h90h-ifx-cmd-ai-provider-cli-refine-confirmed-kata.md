---
specdojo:
  id: prj-0001:pjr-h90h-ifx-cmd-ai-provider-cli-refine-confirmed-kata
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: hard
  registered_at: "2026-11-10T13:14:30Z"
  completed_at: "2026-11-11T13:01:37Z"
  conclusion: 代表の ifx-cmd-ai-provider-cli を確定した型で磨き込み、evidence の JSON が壊れたときの扱いと認証の要否を直した（grade 96、残りは目印のみ）
  derived_from:
    - PJR-2GD6
    - PJR-T88P
  autopilot: approved
  approach: fully-guided
  targets:
    - prj-0001:ifx-cmd-ai-provider-cli
---

# PJR-H90H 代表の ifx-cmd-ai-provider-cli を、確定した型で磨き込む

## 1. 概要

business-specs-kata で確定した型（specdojo:ifx-cmd-rulebook と sample）に合わせて、代表の ifx-cmd-ai-provider-cli を磨き込み、冗長さを整理する。review は schedule の review の段で流す

## 2. 入力

- 型一式の確定（2026-11-10、indie が決定）の後に、代表を磨き込みから流し直す。schedule の磨き込み・condense の段はゲートで bes・br・clis の段まで巻き戻すことになるため、register の todo で行う（orchestrator の判断、indie に報告）。
- 夜間の register の routine で流す（indie が承認）。review は T-BUSINESS-SPECS-REPS-ifx-cmd-ai-provider-cli-090 を reopen 済みで、6:00 の exec cycle で流す。

## 3. 完了条件

- 代表の [[prj-0001:ifx-cmd-ai-provider-cli]] を、確定した型 [[specdojo:ifx-cmd-rulebook]] と [[specdojo:ifx-cmd-sample]] に合わせて磨き込んでいる。型の本文要件の章立て・必須の項目・記述ガイドの判断の基準に沿い、型が禁止することを書いていない。
- 冗長さを整理している（判断に要る背景・制約・例外と意味は保ち、新しい内容を足さない）。
- 実装・schema・リファレンスと同じことを書かず、正本を参照する方針（PJR-2GD6）を保っている。
- 決められない点は `_UNDECIDED_` か `_ASSUMPTION_` のまま、理由（どの成果物がない、誰の判断が要る）を書いて残してよい。依存の成果物がないことを理由に未完了としない。
- これまでの review の指摘のうち、確定した型の範囲で直せるものを直し、直さないものは理由を個票の対応結果に書いている。
- 型と、ほかの成果物とカタログを変えていない。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分と行の文案で書いている（PJR-EPQ3）。影響がなければ「なし」と書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema`・`specdojo catalog validate --project prj-0001` が通っている。
- 2 回目の実行（2026-11-11 追加）: 1 回目の後の grade（run id `reps5-20261111`）は needs-work 73 だった。次を直し、grade で pass になっている（grade は統合の後に orchestrator が流す。grade を流せないことを理由に未完了としない）。
  - executor の報告の evidence タグの JSON が壊れているときの扱い（task を完了にしてよいか、編集を残すか、再試行するか、利用者が取る行動）が未定義という指摘。実装の振る舞いを確かめて書くか、正本を参照し、`_UNDECIDED_` のまま残さない。
  - すべての provider にログインのプロファイルと認証の状態が要る前提になっているという指摘。認証の要否を provider の設定で分け、ローカルの OpenCode / Ollama のように認証が要らない場合を含める。docs/ja/product の関連仕様と矛盾させない。
  - そのほかの grade の指摘のうち、確定した型の範囲で直せるもの。

## 4. 作業内容

| No  | 作業                               | 担当     | 状態 | メモ       |
| --- | ---------------------------------- | -------- | ---- | ---------- |
| 1   | 確定した型と代表の文書を読み比べる | executor | done | 5.2 を参照 |
| 2   | 磨き込みと冗長さの整理を行う       | executor | done | 5.1 を参照 |
| 3   | 検査を流し、対応結果に書く         | executor | done | 5.4 を参照 |

## 5. 対応結果

### 5.1. 実施内容・成果物

[[prj-0001:ifx-cmd-ai-provider-cli|AI provider CLI 非対話起動のコマンド連携仕様]] の既存の章構成と契約を基礎に、確定した型の必須要素と禁止事項に関わる箇所を整理した。

- `command.reference` に起動設定の正本とシェル起動の管理・検証先を集め、展開変数の一覧を削除した。member の `command` を「テンプレートを持たない構成専用」とする制限は、exec設定ガイドの特殊構成向け上書きと実装エビデンスに合わせて修正した。
- `streams.stdout` の報告フィールド一覧と `exit_codes` の検出パターン例、`authentication.log_policy` の秘匿対象一覧をガイド参照へ置き換えた。stderr の秘密値禁止は `log_policy` へ統合した。報告の抽出範囲、診断用途、保存前の秘匿処理は残した。
- exit 0 をプロセスの正常終了として表し、作業完了との境界を保持した。失敗コード 1 は非ゼロ終了の代表値と明記し、保護違反による停止、利用制限、接続失敗、汎用失敗の判定順を明示した。専用の識別信号を持たない `authentication_error` 行は `permanent_failure` に統合し、利用者の診断確認・再ログインは残した。
- `files.outputs` の「reporter が result を直接記入する」を、exec設定ガイド 6.3 に従う「reporter は報告を返し runner が result を書く」へ修正した。これは同ガイドを根拠とする責務境界の修正であり、実装だけから新しい動作を採用したものではない。
- タイムアウトの重複説明は `timeout_action` に集約した。設定依存の再試行上限 3 は固定値の再掲を避けて `_UNDECIDED_` と正本参照へ置き換え、初回パスを含む数え方、指名時との違い、既存変更を確認して引き継ぐ条件を補った。実効設定や再試行動作は変更していない。

変更ファイルは対象 YAML と本個票の対応結果・作業表。型、schema、実装、カタログ、保護設定、CHANGELOG、result は変更していない。

### 5.2. 進め方と実践の型の適用

- [[specdojo:ifx-cmd-rulebook|外部コマンド連携仕様作成ルール]] を構成・必須内容・禁止事項の基準、[[specdojo:ifx-cmd-recipe|外部コマンド連携仕様 作成レシピ]] を成功状態・分岐・回復条件を整理する手順として実際に読んだ。[[specdojo:ifx-cmd-sample|外部コマンド連携仕様サンプル]] はキー配置、コメント、同じ終了コードの条件分岐の形式だけに用い、業務内容・固有値は転記していない。型の欠落・基準としての不足や型間の矛盾はなかった。template は fully-guided の指定に従い読んでいない。
- 根拠は [[specdojo:exec-config-guide|exec設定ガイド]]、[[prj-0001:sysd-agent-settings|エージェント実行・共通設計]]、[[prj-0001:opr-agent-cli-update|外部エージェントCLI更新]]。プロジェクトコンテキストの [[prj-0001:prj-overview|プロジェクト概要]] から、判断と実行境界を共有する正本分担を維持し、Why の全文は転載していない。`based_on` は増やしていない。
- 読み取り専用エビデンス `src/exec/run/agent.ts` の起動・判定・再試行・環境分離と `src/exec/agent-config.ts` のコマンド・検出設定の解決箇所を参照し、ガイドと既存契約の事実を照合した。未宣言の実装、provider 別子設計、外部情報は探索していない。schema は型制約、共通規約 2 件と運用メモは実行・報告方法、`pm-review-viewpoints.yaml` の `vp-arc-conciseness` は冗長さの判断、package・設定・hook は検査の適用判定だけに用いた。
- 既存の 8 つの本文キーを維持した。削除・統合は 5.1 に示す正本の再掲、重複、型不適合に限定し、認証プロファイルの参照名、利用枠消費、保護違反の停止、非決定性、既存の未決定事項は保持した。型 6.5 に従い、識別できない認証失敗を独立した自動分類にしないと executor が判断した。
- owner ロールは plan で未指定のため補完していない。plan に展開された finding はない。過去 review の記録は宣言された参照範囲に含まれないため読まず、指摘の解消を推測で宣言しない。型から判断できる正本参照・分岐・責務境界は今回修正し、指摘との個別対応と多観点の検証は予定された後続 review に委ねる。

### 5.3. 未決定事項・申し送り

- `prj-0001:ifx-index` は未作成の前提として扱い、内容を推測せず参照しなかった。作成後、連携設計の承認者が連携目的・方向・`spec_ref` を照合する。これを理由に本磨き込みを未完了とはしない。
- `execution.timeout_seconds` は現在の上限なし・終了待ちを保持した。時間上限、子プロセス終了、不完全出力の採否は連携設計の承認者の判断待ち。`execution.max_parallel` と `error_handling.retry.max_attempts` は設定参照を整数欄で表せないため `_UNDECIDED_` とし、設定の意味は exec設定ガイドを参照する。架空の値や schema 変更で埋めず、表現方法は承認者へ申し送る。
- executor evidence タグの欠落時と `completion_status: incomplete` の既存動作は保持した。タグ内 JSON の解析失敗時の完了判定・変更保持・再開条件は宣言資料に個別契約がないため、型 6.8 に従い `_UNDECIDED_` と判断者を追記した。未宣言の parser 実装を読んで補完しない。reporter の形式不正はガイドに定められた同じ plan・evidence での再実行へ委ねる。
- 対象成果物に `_CONTEXT_:` はなく、draft への差し戻しは不要。result は pipeline の reporter / runner が記入する。本節と 5.1・5.2 の判断根拠を executor の `handoff` にも残す。

### 5.4. 検証

次の executor 検査はすべて終了コード 0。register の生成物は Git 差分に含まれない。

- `npx prettier --write docs/ja/product/020-external-interface-specs/ifx-cmd-ai-provider-cli.yaml docs/ja/projects/prj-0001/controls/project-register/pjr-h90h-ifx-cmd-ai-provider-cli-refine-confirmed-kata.md`
- `npm run validate:schema:file -- --schema docs/specdojo/schemas/v1/ifx-cmd.schema.yaml --data docs/ja/product/020-external-interface-specs/ifx-cmd-ai-provider-cli.yaml`
- `npm run validate:history-links`
- `node --import tsx src/specdojo.ts catalog validate --project prj-0001`
- `node --import tsx src/specdojo.ts register build --project prj-0001`
- `git diff --check`

カタログ検証には、対象外の未作成文書と `evidence_refs` の再エクスポート参照に関する警告がある。検証は成功しており、未宣言の文書・実装を追加で読まず、修正は夜間 orchestrator の判断に申し送る。

`lint:md`・`lint:fm`・`validate:schema` など指定済みの親検証は runner が実行し、その結果を evidence に追記する。executor では同じ検査・対象限定版を重ねて実行していない。

### 5.5. CHANGELOG に書く事項

なし（仕様文書の型適合と正本参照の整理であり、利用者向けの実行動作・設定・CLI 契約の追加変更はない）。

### 5.6. 2 回目の実施内容・変更ファイル（2026-11-11）

再開前の試行は未完了。追加完了条件の evidence タグ内 JSON 解析失敗時の契約確定に必要な根拠が、当時宣言された参照範囲になかった。5.6〜5.10 はその試行、5.1〜5.5 は 1 回目の記録として保持する。参照根拠が追加された再開後の結果は 5.11〜5.15 を参照する。

- 対象 YAML の `authentication` を provider 設定に応じた条件付きの記述へ修正した。認証を要する構成は `provider_login` / `cli_profile`、ローカル OpenCode / Ollama の認証不要構成は `none` とし、後者に認証情報の供給元・ログインプロファイルの永続化を要求しない。`method` と `mechanism` は schema が許容する文字列で条件を示し、schema や provider 設定は変えていない。
- `side_effects` の外部 API 利用枠消費を外部 API 利用時に限定し、`authentication_failure_action` で認証不要構成の接続先確認を区別した。認証要否の根拠は本 plan の追加完了条件、共通設計の子設計一覧、exec設定ガイドのローカル LLM 構成である。provider 固有の値や設定キーは新設していない。
- 共通設計・更新手順へのリンクを、実際に読んだ文書の ID `sysd-agent-settings` / `opr-agent-cli-update` に修正した。
- 時間上限の未決定に、無期限待機による worktree 保持・実行枠や適用対象 provider 枠の占有を追記した。判断・追跡先と昇格前に記録する条件を先頭コメントへ集約し、並列数・再試行上限のコメントから参照した。
- 検証参照は schema 検査コマンドと exec設定ガイド 6.3 の親検証、共通設計のテスト配置への導線に限定した。個別の起動・失敗分類・解析テストのファイル名は宣言資料で特定できず補完していない。

変更は対象 YAML と本個票の対応結果のみ。開始時から存在した register event と pipeline state は runner の管理記録として触れていない。result、型、schema、実装、カタログ、保護設定、CHANGELOG は変更していない。

### 5.7. 2 回目の進め方と実践の型の適用

- rulebook・recipe・sample を実際に読み、rulebook の 5 章と 6.7・6.8 を認証・未決事項の記述基準、recipe を分岐と回復条件を整理する手順、sample を既存構成で判断できない形式の確認だけに用いた。認証を条件付き文字列で表せることは対応 schema で確認した。sample の値・業務内容は転記していない。型の欠落・薄さ・矛盾はなく、既存の本文キーと正本参照方針を維持した。template は読んでいない。
- 根拠として対象 YAML の `based_on` である [[specdojo:exec-config-guide|exec設定ガイド]]、[[sysd-agent-settings|エージェント実行・共通設計]]、[[opr-agent-cli-update|外部エージェントCLI更新]]、プロジェクトコンテキストの [[prj-0001:prj-overview|プロジェクト概要]]、本 plan と個票を読んだ。Why の再掲や `based_on` の追加はしていない。
- 読み取り専用エビデンス `src/exec/run/agent.ts` と `src/exec/agent-config.ts` で、起動・待機・検出・親検証・再開プロンプト・provider 枠の事実を照合した。両ファイルに evidence タグ内 JSON の解析処理はなく、ガイド 6.3 はタグ欠落・不正な完了状態値・reporter 形式不正を規定する一方、executor タグ内 JSON 自体が解析不能な場合を規定していない。これら別ケースを同一視する根拠はないため、完了や停止の動作を推測していない。
- 未作成の `ifx-index`、未宣言の解析実装・呼び出し元・テスト、provider 別子設計、外部情報は参照していない。OpenCode / Ollama の認証不要という前提は本 plan 自身の確定した追加条件から採用した。schema は型制約、共通規約・運用メモは実行方法、`vp-arc-conciseness` は冗長さ判断、package・設定・hook は検査の適用判定にだけ用いた。
- F007・F008・F011 は条件付き認証で対応し、F015 は ID 修正で対応した。F001・F002・F003・F004・F006・F016 は、人間の ARC への技術判断依頼、PM への追跡・報告依頼、枠占有の影響、PJR-H90H という追跡先、昇格前の記録条件で補強した。ただし、実際の担当者・延期の承認は宣言資料で確認できず、責務割当と昇格条件は承認依頼の前提として先頭の `_ASSUMPTION_` にまとめた。CLI 再認証を行う利用者とは区別した。
- F005・F009・F012・F013・F014・F017 は未解消。解析失敗時の完了可否、親検証・reporter の順序と実行可否、変更保持、再試行、利用者の復旧操作・確認者・再開条件は根拠不足で確定できない。型 6.8 の良い例を製品の決定済み動作とみなすことも避けた。追加完了条件がこの分岐を未決定のまま残すことを禁じるため、今回は完了を申告しない。
- F010 は schema コマンドと既存文書の検証入口まで対応した。個別テストの特定・報告解析のテストオラクルは未解決の契約に依存し、未宣言のテスト探索はしていない。これらの対応状況は本 plan の指摘との照合であり、多観点の自己レビューや grade の再実行は行っていない。
- 加筆・修正は 5.6 の必要な認証分岐、失敗時の確認先、未決事項の追跡、リンク・検証導線に限定した。provider の一律列挙は選択設定からの解決へ統合し、認証不要構成への不当な要求を除いた。並列数と再試行上限で重複する判断者の説明は参照へ統合し、時間上限や回数を架空の固定値にしていない。対象に `_CONTEXT_:` はなく、成果物全体の下書きは不要。

### 5.8. 2 回目の未決定事項・申し送り

1. 人間の ARC に、executor evidence の解析処理と register / schedule pipeline の呼び出し元を読み取り専用根拠へ追加できるか確認する。PM は本個票で参照範囲の補足と後続実行を追跡する。許可後、正常 JSON、タグ欠落、解析不能 JSON、`completion_status: incomplete`、非ゼロ終了を分けて、保存状態・親検証・reporter・完了判定・復旧操作を照合し、契約と観測可能な期待結果を確定する。既存実装の採否に業務判断が要る場合は人間へ戻し、夜間 executor は decision を決定しない。
2. 時間上限、子プロセス終了・部分出力の処置、設定参照を表せない schema 欄は引き続き未決定。ARC の技術判断と PM の追跡・報告という分担は依頼案であり、人の担当任命ではない。ready 昇格前に、解決した方針、または時間・表現事項を延期する理由と運用条件（枠占有の許容、監視・停止判断の担当）を人間が記録する。JSON 解析失敗の契約確定は今回の追加完了条件により延期して完了とはできない。
3. `ifx-index` は未作成のため内容を推測しない。作成後の目的・方向・`spec_ref` の照合は ARC への申し送りとし、未作成依存だけを未完了理由とはしていない。grade は統合後に orchestrator、独立 review は指定済み schedule task に委ねる。今回は grade の pass や完了条件全体の充足を主張しない。
4. 本記録を executor evidence の `handoff` にも記載する。参照範囲の拡張や新しい失敗方針の決定を自分で行わず、未完了として既存変更を引き継ぐ。result の作成・更新と状態遷移は reporter / runner に委ねる。

### 5.9. 2 回目の検証

次の sandbox 内の検査・生成はすべて終了コード 0。

- `npx prettier --write docs/ja/product/020-external-interface-specs/ifx-cmd-ai-provider-cli.yaml docs/ja/projects/prj-0001/controls/project-register/pjr-h90h-ifx-cmd-ai-provider-cli-refine-confirmed-kata.md`
- `npm run validate:schema:file -- --schema docs/specdojo/schemas/v1/ifx-cmd.schema.yaml --data docs/ja/product/020-external-interface-specs/ifx-cmd-ai-provider-cli.yaml`
- `npm run validate:history-links`
- `node --import tsx src/specdojo.ts catalog validate --project prj-0001`
- `node --import tsx src/specdojo.ts register build --project prj-0001`
- `git diff --check`

カタログ検証では対象外の未作成文書と再エクスポートのみの `evidence_refs` に関する警告がある。検証は成功し、今回の範囲では修正していない。register の生成物は Git 差分に含まれない。

`lint:md`・`lint:fm`・`validate:schema` を含む指定済みの親検証は runner に委ね、同じ検査・対象限定版は実行していない。静的検査の成功と、JSON 解析失敗の契約確定という完了条件の未達は区別して報告する。

### 5.10. CHANGELOG に書く事項

- 区分: 不具合修正（仕様文書）。文案: 「AI provider CLI 連携仕様で認証要否を provider 設定に応じて区別し、ローカル OpenCode / Ollama の認証不要構成へのログイン要求を修正。」
- 実行コード・設定の変更はない。JSON 解析失敗時の契約確定は未完了のため、解消済みとして CHANGELOG に記載しない。

### 5.11. 2 回目・再開後の実施内容（2026-11-11）

再開前に残した evidence JSON 解析失敗の未決定を解消した。対象 YAML と本個票の対応結果を更新し、認証不要構成・リンク・未決事項の追跡に関する既存変更を引き継いだ。

- 再開指示で読み取り専用根拠に加わった `src/exec/evidence.ts` の `parseExecutorReport` を確認した。最後のタグの JSON 解析失敗時は、構造化報告を空として扱い、以前のタグへ戻らない。`completion_status`・`handoff`・`validations`・`target_coverage` は未受領、`final_message` はタグを除いた標準出力本文になる。
- `error_handling.malformed_output_action` に解析関数を正本として示し、タグ欠落時と共通の処置へ統合した。編集を保持し、解析失敗だけでは失敗・未完了や executor の自動再試行にしない。完了状態省略時は `complete` とし、プロセス結果と親側の検証で完了可否を判定する。プロセス成功後の親検証、reporter、result 確定の順序、別の停止条件、利用者の確認と executor resume の条件を記した。
- `streams.stdout` は解析失敗の処置への参照、exit 0 は完了状態の省略時の意味だけを補った。先頭の「JSON 解析失敗の契約確定待ち」を削除し、時間・schema 表現の未決事項の追跡先と昇格条件は維持した。

実装・schema・型・カタログ・保護設定・CHANGELOG と、開始時から存在した plan・event・evidence・pipeline state は変更していない。result の作成・更新と状態遷移は reporter / runner が担当する。

### 5.12. 再開後の進め方と実践の型の適用

- rulebook・recipe・sample を再読した。rulebook の本文要件と 6.3・6.5・6.8 を構造・完了判定・回復条件の基準、recipe を欠落・解析失敗・再開の分岐整理、sample をキー配置と記述粒度の確認に用いた。既存構成を維持し、sample の業務内容・値は転記していない。型の不足・矛盾はなく、template は fully-guided の指定に従い読んでいない。
- 対象 YAML、`based_on` の [[specdojo:exec-config-guide|exec設定ガイド]]・[[sysd-agent-settings|エージェント実行・共通設計]]・[[opr-agent-cli-update|外部エージェントCLI更新]]、[[prj-0001:prj-overview|プロジェクト概要]]、本 plan・個票を参照した。Why は判断の共有と人間の判断責任として参照し、全文や新しい `based_on` は加えていない。
- 実装根拠は宣言済みの `src/exec/run/agent.ts` と `src/exec/agent-config.ts`、追加された `src/exec/evidence.ts` の解析関数に限定した。解析結果は関数で、完了状態省略時の意味、親検証から reporter への順序と再開はガイド 6.3 で照合した。再開指示がこの現在動作を採用する根拠となるため、新たな失敗方針の decision は行っていない。
- schema は型制約、共通規約・運用メモは実行・報告方法、`vp-arc-conciseness` は重複整理、package・設定・hook は検査の適用判定に用いた。未作成の `ifx-index`、未宣言の実装・テスト・provider 子設計・外部情報は参照していない。OpenCode / Ollama の認証不要の前提は追加完了条件を根拠とし、共通設計とガイドのローカル構成への導線を維持した。
- 型 6.8 と追加完了条件に従い、根拠不足を説明していた解析失敗の段落を確定した契約へ置き換えた。欠落と解析失敗を一箇所へ統合し、不要になった解析契約の昇格ゲートだけを削除した。内部処理の転載はせず、正本の関数名と呼び出し元に必要な受領・状態・回復の意味を残すと executor が判断した。`_CONTEXT_:` はなく、draft への差し戻しは不要。
- F005・F009・F012・F013・F014・F017 は上記契約で対応した。観測可能な期待結果は「解析不能 JSON はタグ欠落と同じ報告未受領」「編集を保持」「解析失敗単独では自動再試行しない」「プロセスと親側の確認が成功すれば完了可能」である。有効な `incomplete` 報告や非ゼロ終了、再開時の対象報告確認など別の停止条件を無効化しない。
- F007・F008・F011 は認証要否による分岐、F015 は ID 修正を維持した。F001〜F004・F006・F016 は時間・表現事項の人間の ARC への判断依頼、PM への追跡・報告依頼、PJR-H90H の記録先、昇格前の確認条件で補強済み。ただし人の担当任命・延期承認は行わず、責務依頼案は `_ASSUMPTION_` のまま残した。
- F010 は schema 検査コマンド、親検証とテスト配置の既存導線、および解析の正本まで対応した。個別テストのファイル名・ケース名は宣言資料だけで特定できず、未宣言の探索による補完は見送った。後続 review で個別テスト参照の必要性を確認する。指摘との対応確認にとどめ、多観点の自己レビューや grade は実行していない。

### 5.13. 再開後の申し送り

1. 5.8 の参照範囲追加依頼は再開指示で充足し、解析失敗の契約未確定という停止理由は解消した。時間上限・子プロセス終了・部分出力、設定参照を表せない schema 欄は、再開指示に従い `_UNDECIDED_` を維持する。本磨き込みの未完了理由にはしない。ready 昇格前に、人間の ARC に方針または延期理由・運用条件の確認を依頼し、PM に本個票での追跡・報告を依頼する。担当任命は未確認の前提である。
2. `ifx-index` 作成後の連携目的・方向・`spec_ref` の照合を ARC へ申し送る。F010 の個別テスト参照は根拠不足として後続 review に残す。未作成依存の内容、時間上限や並列数の固定値を推測していない。
3. 親検証は runner、独立 review は `T-BUSINESS-SPECS-REPS-ifx-cmd-ai-provider-cli-090`、統合後の grade は orchestrator が担当する。grade の pass は本 executor では確認していない。カタログ検証の対象外警告も本タスクでは修正しない。
4. 変更根拠、指摘対応、残る未決事項、検証結果、5.15 の文案は executor evidence の `handoff` にも記録し、reporter / runner に result への転記を委ねる。

### 5.14. 再開後の検証

再開後も、次の executor 検査・生成はすべて終了コード 0。

- `npx prettier --write docs/ja/product/020-external-interface-specs/ifx-cmd-ai-provider-cli.yaml docs/ja/projects/prj-0001/controls/project-register/pjr-h90h-ifx-cmd-ai-provider-cli-refine-confirmed-kata.md`
- `npm run validate:schema:file -- --schema docs/specdojo/schemas/v1/ifx-cmd.schema.yaml --data docs/ja/product/020-external-interface-specs/ifx-cmd-ai-provider-cli.yaml`
- `npm run validate:history-links`
- `node --import tsx src/specdojo.ts catalog validate --project prj-0001`
- `node --import tsx src/specdojo.ts register build --project prj-0001`
- `git diff --check`

カタログ検証は、対象外の未作成文書と再エクスポートのみの `evidence_refs` に関する警告付きで成功した。register の派生ビューは Git 差分に含まれない。`lint:md`・`lint:fm`・`validate:schema` を含む指定された親検証は runner が実行し、executor では重複実行していない。

### 5.15. CHANGELOG に書く事項

5.5・5.10 の文案に対し、今回の最終文案は次のとおり。

- 区分: 不具合修正（仕様文書）。文案: 「AI provider CLI 連携仕様で、認証不要のローカル OpenCode / Ollama 構成と、evidence JSON 解析失敗時の完了判定・変更保持・再開条件を明記。」
- 実行コード・設定の変更はない。`CHANGELOG.md` は変更していない。

## 6. 関連ドキュメント

- 親: [[prj-0001:pjr-2gd6-business-specs-reps]]、[[prj-0001:pjr-t88p-business-specs-kata]]
- 対象: [[prj-0001:ifx-cmd-ai-provider-cli]]
- 型: [[specdojo:ifx-cmd-rulebook]]
