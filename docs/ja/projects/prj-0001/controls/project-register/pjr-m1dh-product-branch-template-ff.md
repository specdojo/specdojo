---
specdojo:
  id: prj-0001:pjr-m1dh-product-branch-template-ff
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-10-31T02:43:00Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-BNMV
  depends_on:
    - PJR-TC62
    - PJR-Z7GX
---

# PJR-M1DH プロダクトのリポジトリの作業ブランチの名前を設定で選べるようにし、早送りの統合を足す

## 1. 概要

`repos[].branch_template` で作業ブランチの名前を選べるようにし、run と作業ブランチの対応を runner の記録で持ち、名前の重なりを run の開始時に検査し、統合の形に `ff` を足す。

## 2. 入力

- PJR-BNMV の決定: `repos[].branch_template`（既定は exec/{project}-{id}、例: git-flow は feature/{topic}、GitHub flow は {type}/{topic}）。{id} も {topic} も含まないテンプレートは設定エラー
- ブランチ名が別の項目のものとしてあれば run の開始時に止め、topic を変えるか --branch で名前を指定するよう案内する。自動の連番は付けない。同じ項目の再開では同じブランチを使い続ける
- runner は作業ブランチの名前が exec/ で始まることを前提に worktree の片付けや再開をしている（src/exec/worktree-ops-lifecycle.ts など）。run と作業ブランチの対応は、名前の接頭辞ではなく runner の記録で持つ
- 統合の形に ff（merge commit を作らず早送りで積む）を足す。既存の merge・branch-only は変えない

## 3. 完了条件

- `specdojo.config.json` の `repos[]` に任意の `branch_template` を足し、schema と設定の検証を更新する。変数は PJR-Z7GX と同じ（`{branch}`・`{target}` を除く）。`{id}` も `{topic}` も含まないテンプレートと、git のブランチ名として不正になるテンプレートは設定エラーにする。既定は今と同じ `exec/{project}-{id}`。
- プロダクトのリポジトリの作業ブランチをテンプレートの名前で作る。SpecDojo の記録のリポジトリの作業ブランチ（`exec/...`）は変えない。
- run と作業ブランチの対応を、ブランチ名の接頭辞ではなく runner の記録（pipeline の状態や worktree の記録など、置き場所は executor が決める）で持つ。再開（`--resume`）、片付け（`exec worktree prune` など）、`branch-only` で残すブランチの扱いが、テンプレートの名前でも今と同じに動くようにする。
- run の開始時に、作ろうとするブランチ名が別の項目のものとしてあれば止め、topic を変えるか `exec run` の新しい `--branch <repo>=<name>` で名前を指定するよう案内する。自動の連番は付けない。同じ項目の再開では同じブランチを使い続ける。
- `repos[].integration_strategy` に `ff` を足す。統合先を作業ブランチの先へ早送りし、早送りできない場合は止めて理由を出す（rebase はしない）。既存の `merge`・`branch-only` は変えない。
- 統合テストを足す。対象は、テンプレートの名前での run・再開・片付け、別の項目と名前が重なったときの停止、`--branch` での指定、`ff` での統合と早送りできない場合の停止、設定がない場合の互換。
- runner の動きが変わるため、統合の後に PJR-JSEY を流して確かめる前提で、本個票の対応結果に確かめ方を書く。
- 設定リファレンスと command-reference に書き、git-flow（`feature/{topic}`）と GitHub flow（`{type}/{topic}`）の設定の例を載せる。
- `CHANGELOG.md` の `## [Unreleased]` 節に追記する。`0.5.0` と公開済みの版の節は変えない。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` と、変更した文書で `npm run lint:md`・`npm run lint:fm` を流して通し、親の検証も通る。
- 設計で決めることは executor が決め、理由を本個票の対応結果に書き、報告の `handoff` にも書く。
- 保護された設定（`.specdojo/`・`package.json` など）に触れる必要がある場合は、変更せずに案を本個票の対応結果と報告の `handoff` に書く。

## 4. 作業内容

| No  | 作業                                                                       | 担当     | 状態   | メモ                     |
| --- | -------------------------------------------------------------------------- | -------- | ------ | ------------------------ |
| 1   | `branch_template` の設定と、run と作業ブランチの対応を記録で持つ形に変える | executor | closed | 実装・テスト・文書へ反映 |
| 2   | 名前の重なりの検査、`--branch`、`ff` の統合を足す                          | executor | closed | 実装・テスト・文書へ反映 |
| 3   | 統合テストと文書を足す                                                     | executor | closed | 実装・テスト・文書へ反映 |

## 5. 対応結果

### 5.1. 実施内容・成果物

- `src/shared/specdojo-config.ts` と設定 schema に `repos[].branch_template` および `integration_strategy: ff` を追加しました。テンプレートは既定の `exec/{project}-{id}` と、`{project}`・`{id}`・`{topic}`・`{type}`・`{scope}`・`{title}` に対応します。識別用の `{id}`／`{topic}` がない値、未知の変数、`{branch}`／`{target}`、不正な Git ブランチ名は拒否します。展開後の名前も Git で検証します。
- `src/exec/product-branches.ts` で register の項目から名前を解決し、`exec run --branch <repo>=<name>` を追加しました。別項目や管理外の既存ブランチとの衝突は start 前に停止し、topic の変更か `--branch` を案内します。再開では保存した名前を使い、別名の指定を拒否します。
- `src/exec/product-branch-records.ts` で、項目の修飾 ID・ブランチ名・開始 commit を Git の共通管理ディレクトリに記録します。`task-repos.ts` と run／worktree の処理をこの記録へ接続し、任意の名前での作成、再開、撤去、孤立ブランチの prune、`branch-only` の保持に対応しました。SpecDojo の記帳用リポジトリの命名は従来どおりです。
- `repo-integration.ts` に `ff` を追加しました。全リポジトリの事前検査で祖先関係を確かめ、分岐時は統合せず停止します。統合直前にも再検査し、checkout 中なら `merge --ff-only`、それ以外は旧先端を指定した `update-ref` を使います。`ff` の再開では自動同期 merge を行いません。`repo-trace.ts` では早送り後の作業ブランチ先端を統合 snapshot として result に記録します。
- `tests/src/exec/task-repos.integration.test.ts` に、任意名の作成・設定変更後の再利用・片付け・別 project との衝突・管理外ブランチ・`--branch`・`branch-only`・checkout 有無の `ff`・分岐時の停止・再開時の同期抑止を追加しました。旧形式の名前でも、別項目の記録があれば片付けないことも検証します。
- `tests/src/exec/register-pipeline-e2e.integration.test.ts` に、実際の CLI のテンプレート名・明示名・`ff`・start 前の衝突停止を追加し、統合失敗位置 3 種の再開テストをテンプレート名へ拡張しました。既定設定の互換ケースも残しています。設定読み込みと schema の単体テストに有効・無効なテンプレートと `ff` を追加しました。
- 再開時に引き継いだ親検証の失敗 3 件を修正しました。孤立ブランチの prune は現在の checkout ではなく宣言済みの統合先への取り込みを削除直前に再確認します。`ff` の再開テストは、プロダクトの統合後にプロジェクトの統合を失敗させ、再開後も早送り済みの先端が変わらないことを確かめる条件へ修正しました。prune のテストも、現在の checkout と統合先が異なるリポジトリを含め、全プロダクトのブランチと対応記録の削除を確認します。
- 設定リファレンスに git-flow の `feature/{topic}` と GitHub flow の `{type}/{topic}` の例、command-reference に `--branch`、Unreleased に機能追加を記載しました。

### 5.2. 設計判断と理由

- 対応記録の置き場所は、各プロダクトの Git 共通管理ディレクトリの `specdojo/product-branches/<ブランチ名の SHA-256>.json` としました。worktree の撤去後も残り、同じプロダクトを使う別 project の衝突も検出でき、追跡対象の設定や pipeline schema を増やさずに済むためです。項目の修飾 ID を所有者とし、既存 run の pipeline／worktree 記録と結び付けます。
- 完成済みの一時記録を排他的な hard link で公開し、並行する run の同名予約と不完全な JSON の読み込みを防ぎます。register の start より前に全プロダクトの名前を予約します。失敗時の予約は同じ項目の新規実行で片付けて再利用でき、他項目へ自動で譲りません。
- 記録のない旧 run だけは、従来の項目別 `exec/` 名を探索します。その名前が別項目の記録にあれば、名前から所有者を推測して削除しません。新しい run の再開・片付けは記録を正とします。
- 開始 commit も記録し、`ff` の再開時に「変更なし」と「既に早送りで統合済み」を区別します。再開時に統合先を自動 merge すると線形の履歴にならないため、`ff` は同期対象から除外し、分岐の解消を利用者へ委ねます。自動 rebase は行いません。
- register 以外の task は、topic に task ID の小文字、title に task ID、type に `feat`、scope に空文字を使います。個票の情報がない実行でも同じ変数集合を解決できるようにするためです。
- 保護された設定の変更は不要でした。`.specdojo/`・`package.json`・hook 設定・Git 設定は変更していません。

### 5.3. 検証

- 変更した Markdown・TypeScript・schema を Prettier で整形しました。
- `npm run validate:schema:file -- --schema docs/specdojo/schemas/v1/specdojo-config.schema.yaml --data .specdojo/specdojo.config.json` は成功しました。
- `node --import tsx tools/catalog-validate-if-configured.mjs` は成功しました。既存カタログに、参照先の成果物が未作成という警告があります。
- `node --import tsx src/specdojo.ts register build --project prj-0001` と `git diff --check` は成功しました。登録簿の生成物以外の状態項目は変更していません。
- 型検査、TypeScript／Markdown／frontmatter lint、単体・統合テスト、schema 一括検査は pipeline 指示に従って親 runner の検証へ委ねます。executor では重複実行していません。親の結果は reporter／runner が result に追記します。

### 5.4. 統合後の確認・申し送り

- runner を変更したため、統合後に [[prj-0001:pm-orchestrator-playbook|オーケストレーター運用メモ]] の 5.1 に従い PJR-JSEY を実行してください。JSEY の対象一覧へ PJR-M1DH を加え、`register reopen --project prj-0001 --id PJR-JSEY --by specdojo-orchestrator --reason "PJR-M1DH の統合後の動作確認" --commit` で開き直し、`exec run --project prj-0001 --register PJR-JSEY --worktree --executor-by claude-executor --reporter-by gemma26-reporter --fallback-reporter-by claude-reporter` を流します。
- start から review まで通ること、event の actor が実体名であること、成功時の worktree／ブランチの撤去を確認してから JSEY と本項目を close してください。実 agent CLI の起動と利用枠を要するため、この executor では実行していません。
- 設計判断は 5.2 のとおりです。保護された設定の変更案や未解決の実装判断はありません。result は pipeline の reporter／runner が記入します。

## 6. 関連ドキュメント

- [[prj-0001:pjr-bnmv-product-repo-git-workflow]]
- [[specdojo:specdojo-config-reference]]
- [[specdojo:command-reference]]
- [[prj-0001:pjr-tc62-item-commit-type-scope]]
- [[prj-0001:pjr-z7gx-product-commit-message-template]]
