---
specdojo:
  id: prj-0001:pjr-b0b8-agy-session-permissions-multi-repo
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: hard
  owner: ARC
  registered_at: "2026-11-02T12:57:11Z"
  due_on: "2026-11-30"
---

# PJR-B0B8 agy のセッション別権限設定に対応し、マルチリポジトリの編集境界を見直す

## 1. 概要

agy のセッション別設定を使い、役割ごとの権限を分離する。宣言済みプロダクトリポジトリとその worktree の編集を可能にし、秘密情報・保護設定への制限と両立させる。

## 2. 入力

- 利用者が agy 1.4.12 のセッション別設定を用いた allow/deny 制御と、マルチリポジトリのプロダクトリポジトリ編集境界の見直しを依頼した。担当 ARC、期限 2026-11-30。
- 利用者共有の agy --version は 1.4.12。ローカルの agy --help で --settings が settings.json のキーを JSON またはファイルパスで受け取り、セッション内だけに適用して保存しないことを確認した。
- 現在の配布設定はグローバル設定へのルール追加が中心。宣言済みプロダクトリポジトリの --add-dir 注入は既存実装にある。本リポジトリの exec-defaults には --dangerously-skip-permissions が残る。
- Claude と同等の制御が可能かは未検証であり、設定マージ・優先順位・実際の許可と拒否を確認する。起票までが今回の承認範囲であり、exec の実行は別途承認する。

## 3. 完了条件

- [ ] agy 1.4.12 の `--settings` を使い、edit・review・report・orchestrator の役割別の権限を分離する。既存のグローバル・プロジェクト設定とのマージ方法と優先順位を確認し、Claude と同等に制御できる範囲と差異を記録する。
- [ ] 起動処理・配布テンプレート・scaffold がセッション別設定に対応し、`--dangerously-skip-permissions` に依存せず実行できる。既定の導入でユーザーのグローバル設定を書き換えず、既存利用者の移行方法を示す。
- [ ] 宣言済みプロダクトリポジトリとその task worktree の成果物を edit executor が読み書きできる。対話型 orchestrator の起動経路も確認し、未宣言の外部リポジトリへの許可は追加しない。
- [ ] プロジェクト・プロダクト両方のリポジトリで秘密情報・保護設定への制限を維持する。review・report の役割外の編集を拒否し、既存の provider 非依存ガードと両立する。
- [ ] 変更箇所の単体・統合テストを追加し、型検査・lint・単体テストと親の固定検証を通す。空のリポジトリで scaffold した設定を確認し、実際の agy による役割別の許可・拒否とプロダクト worktree の編集を、秘密情報を使わない検証用ファイルで確認する。
- [ ] runner・CLI の変更を統合した後に、実際の `npx specdojo exec run --register` を通して動作を確認する。prj-0001 では運用プレイブックに従い PJR-JSEY を使用し、証跡を個票の対応結果と result に残す。
- [ ] 関連する設計・ガイド・配布 README を更新する。CHANGELOG は未公開版の節へ記載し、公開済み版の節は変更しない。
- [ ] 保護設定の変更案は個票の対応結果に記載し、pipeline の報告の `handoff` にも残す。反映は利用者の承認を得て feature ブランチで行う。

## 4. 作業内容

| No  | 作業                                                                 | 担当 | 状態    | メモ                                                                         |
| --- | -------------------------------------------------------------------- | ---- | ------- | ---------------------------------------------------------------------------- |
| 1   | 役割別のセッション設定と既存設定のマージ仕様を整理する               | ARC  | partial | 1.4.12 の help と公式仕様を確認。既存設定との配列マージは実機確認へ申し送る  |
| 2   | 起動処理・配布テンプレート・scaffold を対応させる                    | ARC  | done    | 単一 JSON 生成と初期名簿の reporter の `mode: report` を対応。保護設定は下記 |
| 3   | 宣言済みプロダクトリポジトリと worktree の権限を見直す               | ARC  | done    | 宣言済みルートだけを追加し、各ルートへ固定保護・秘密情報の deny を生成       |
| 4   | 単体・統合・親検証、空リポジトリへの生成、実機の許可・拒否を確認する | ARC  | partial | 前回の名簿解決エラーを修正。親再検証は runner、実 agy と PJR-JSEY は実機確認 |
| 5   | 設計・ガイド・配布 README・未公開版の CHANGELOG を更新する           | ARC  | done    | 移行手順、制御範囲と差異、実機で記録する項目を追記                           |

## 5. 対応結果

### 5.1. 実装と境界

- `src/exec/antigravity-session.ts` で edit / review / report / orchestrator のプロファイルと cwd・宣言済みルートを組み合わせ、単一の `--settings` JSON を生成する。既存のローカルプロファイルを読み、未配置なら配布原本を使う。ユーザーのグローバル設定は読み書きしない。
- 非対話起動は `specdojo agent launch --provider antigravity --role {mode}` を追加し、配布する provider template をこの入口へ変更した。既存 runner の `--add-dir` と `SPECDOJO_REPO_*` を引き継ぎ、未宣言ディレクトリ、別 settings、bypass、既存会話・別 project・agent の指定を拒否する。対話型は既存 `orchestrator launch` が宣言を解決し、専用プロファイルを渡す。
- edit は両 repository の通常成果物を編集し、保護パスは provider 非依存ガードの固定定義から各ルートの絶対パスへ展開する。review / report は全ファイル・command・MCP・ブラウザ操作の書き込み経路を拒否し、検証は親 runner に委ねる。orchestrator は承認された保護設定編集を可能にし、秘密情報・Git metadata・push 等の制限を維持する。
- 配布 JSON 4 件は既存 scaffold の配置規則で `.specdojo/antigravity/` へ生成される。旧 `settings.global.json` と明示的な `--global` は互換用途として維持する。既存ファイル・npm script は自動上書きしない。
- 初期名簿 `templates/init-agent-members.yaml` の `flash-reporter` に `mode: report` を指定し、`init --exec` が生成する reporter も `{mode}` を解決できるようにした。空リポジトリの名簿統合テストでは、agy の各別名が対応する role の `agent launch` コマンドへ解決され、reporter が report 権限を選ぶことを検査する。
- 単体テストに役割分離・全保護定義の照合・不正設定と権限上書き・symlink ルート・未宣言ディレクトリの拒否を追加した。統合テストは空 repository への scaffold と偽 agy による実 CLI の起動引数を検査し、認証・使用枠を使わない。
- [[sysd-antigravity-agent-settings|Antigravity CLI エージェント設定]]、[[specdojo:exec-config-guide|exec 設定ガイド]]、[[specdojo:command-reference|CLI コマンドリファレンス]]、配布 README、CHANGELOG の Unreleased を更新した。

### 5.2. 確認範囲と実機確認

- 2026-11-02 のローカル `agy --version` は 1.4.12。`agy --help` は `--settings` が JSON / ファイルパスを受け取り、その session だけに適用し保存しないことを示した。認証情報・実ユーザー設定は読み取っていない。
- 公式 CLI 権限仕様（<https://antigravity.google/docs/permissions/?tab=cli>） の `deny > ask > allow` と、Claude と異なる `write_file` / `command` の構文を確認した。公開仕様は既存グローバル・project 設定と `--settings` の配列マージを明示しない。_ASSUMPTION_: 一つの JSON に必須制限を含める実装とし、複数 settings のマージを前提にしない。既存ルールの結合／置換と実際の許可・拒否は未検証であり、Claude と同等の隔離を実証済みとはしない。
- sandbox 内の確認は生成・起動引数まで。実 agy は認証・使用枠を伴うため `requires_human` とし、設計書 7.1 の手順で、使い捨て project / product / task worktree の無害な通常ファイル、`.env`、`secrets/probe.txt`、保護設定を使う。edit の成果物編集、review / report の全書き込み拒否、orchestrator の承認後の設定編集、shell 経由の制限、未宣言ルートを記録する。
- 統合後は [[prj-0001:pm-orchestrator-playbook|運用プレイブック]] に従って PJR-JSEY の対象へ PJR-B0B8 を加え、実際の `npx specdojo exec run --register` で executor・親検証・reporter・統合を確認する。実行証跡を本節と result の申し送りへ追記してから close を判断する。この executor では実 agy・JSEY を実行していない。
- 任意の名前の秘密ファイル、入れ子配置、許可された検証 script 自身の任意処理を設定 JSON だけで保証しない。固定保護・Git 状態の事後検査を維持し、実機で sandbox の shell 制限も確認する。

### 5.3. sandbox での検証結果

- 再開前の親 `test-integration` は `init-agent-roster.integration.test.ts` で失敗した。原因は初期名簿の `flash-reporter` に `mode` がなく、provider template の `{mode}` が未解決だったこと。初期名簿と回帰テストを修正済みで、親の単体・統合テストの再実行は runner に委ねる。前回の失敗を成功扱いにはしていない。
- `npm run build`: 成功。本体の TypeScript コンパイルを確認した。
- `npm run validate:schema:file -- --schema docs/specdojo/schemas/v1/exec-defaults.schema.yaml --data 'templates/{init-exec-defaults.yaml,antigravity/exec-defaults-snippet.yaml}'`: 2 ファイルとも valid。
- `npm run validate:schema:file -- --schema docs/specdojo/schemas/v1/agent-members.schema.yaml --data 'templates/{init-agent-members.yaml,antigravity/agent-members-snippet.yaml}'`: 初期名簿と配布スニペットの 2 ファイルとも valid。
- `node --import tsx tools/catalog-validate-if-configured.mjs`: 終了コード 0。変更外の product 文書を参照するカタログに文書不在の WARN があるが、検証エラーはない。
- `node --import tsx src/specdojo.ts register build --project prj-0001 --dry-run`: 成功。個票の検査と派生表示の生成を確認し、登録簿の一覧は書き換えていない。
- `node --input-type=module` の一時 repository 検証: 配布済み scaffold 実装で役割プロファイル 4 件が生成され、既存 npm script が保持され、注入した隔離 home にユーザー設定が作られないことを確認した。CLI の子プロセスを捕捉する試行は sandbox の `spawnSync EPERM` で実行できなかったため、同じ scaffold 実装をプロセス内で検証した。実 CLI と偽 agy の起動確認は追加した親の統合テストへ委ねる。
- `node --import tsx src/specdojo.ts agent launch --help`: 新しい入口と role 引数の登録を確認した。
- 変更ファイルを Prettier で整形し、`git diff --check` が成功した。型検査、lint、単体・統合テスト、全体 schema 検証は plan の固定親検証として runner が実施するため、この executor では重複実行していない。
- 実 agy のマージ・許可／拒否と PJR-JSEY は `requires_human`。成果物の完了条件は実機証跡の追記と親検証の結果を踏まえて判断する。

### 5.4. 保護設定の変更案と次のアクション

本リポジトリ自身の `.specdojo/`・`package.json` 等は変更していない。利用者承認後、feature ブランチで次を反映する。

1. `.specdojo/exec-defaults.yaml` の `providers.antigravity.command_template` を次へ置換し、bypass が必須とする旧コメントを削除する。

   ```yaml
   command_template: 'specdojo agent launch --provider antigravity --role {mode} -- --sandbox --model {model} -p "$(cat)"'
   ```

2. `config scaffold --provider antigravity --dry-run` の差分を確認してから、配布原本 4 件の `settings.edit.json` / `settings.review.json` / `settings.report.json` / `settings.orchestrator.json` を `.specdojo/antigravity/` へ追加する。同じ版の `specdojo` を PATH に置く。既存の `orch:flash` / `orch:flash:work` は既に `orchestrator launch` 経由であり、新しい起動処理が適用される。別の直接 agy 起動 script がある場合は同じ入口へ移す。
3. agy member の `mode` を edit / review / report に合わせ、個別 command が provider template を迂回していないか確認する。旧グローバル deny が orchestrator を制限する場合は、自身のルールを保持しながら各役割へ手動で移行する。自動削除は行わない。
4. 既存設定とのマージ・役割別許可／拒否の実機確認と、統合後 PJR-JSEY を実施し、本個票と result へ証跡を残す。親固定検証はこの executor 終了後に runner が実施する。

## 6. 関連ドキュメント

- [[sysd-agent-settings|エージェント実行・共通設計]]
- [[sysd-antigravity-agent-settings|Antigravity CLI エージェント設定]]
- [[sysd-claude-agent-settings|Claude Code エージェント設定]]
- [[specdojo:exec-config-guide|exec 設定ガイド]]
- [[specdojo:command-reference|CLI コマンドリファレンス]]
- [[prj-0001:pm-orchestrator-playbook|prj-0001 オーケストレーター運用メモ]]
- [[prj-0001:pjr-0fk2-config-scaffold-agent|PJR-0FK2 パーミッション設定の生成・マージ]]
- Antigravity CLI の権限仕様（<https://antigravity.google/docs/permissions/>）
- 主な確認対象: `src/commands/orchestrator.ts`、`src/exec/task-repos.ts`、provider の起動処理、`templates/antigravity/`、`templates/init-exec-defaults.yaml`。
