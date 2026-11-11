---
specdojo:
  id: prj-0001:pjr-h90h-ifx-cmd-ai-provider-cli-refine-confirmed-kata
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  difficulty: hard
  registered_at: "2026-11-10T13:14:30Z"
  block_reason: "executor reported incomplete: 認証不要構成への対応、リンク修正、未決事項の追跡先を反映し、実行した静的検査は成功。evidence JSON 解析失敗時の契約は宣言資料だけでは確定できず、未完了として個票に記録した。"
  conclusion: 代表の ifx-cmd-ai-provider-cli を、確定した型で磨き込み、冗長さを整理した
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

## 6. 関連ドキュメント

- 親: [[prj-0001:pjr-2gd6-business-specs-reps]]、[[prj-0001:pjr-t88p-business-specs-kata]]
- 対象: [[prj-0001:ifx-cmd-ai-provider-cli]]
- 型: [[specdojo:ifx-cmd-rulebook]]
