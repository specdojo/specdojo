---
specdojo:
  id: prj-0001:pjr-cbv6-grade-yaml-support
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: hard
  registered_at: "2026-11-10T12:42:25Z"
  derived_from:
    - PJR-JQSB
    - PJR-V05D
  autopilot: approved
---

# PJR-CBV6 grade で YAML の成果物を評価できるようにする

## 1. 概要

PJR-JQSB の決定どおり、grade が YAML の成果物のメタ情報を validate:schema と同じ読み方（最上位か x-spec-meta）で読み、YAML の本文を評価し、結果をサイドカーに残せるようにする

## 2. 入力

- PJR-JQSB（indie が決定、2026-11-10）: 案 A。ハッシュは YAML のファイルの内容から取り、指摘の行番号は元の YAML の行を指す。Markdown の扱いは変えない。
- 対象の例: docs/ja/product/010-business-specs/020-data-model/bdd-register-entry.yaml（最上位の id など）、docs/ja/product/020-external-interface-specs/ifx-cmd-ai-provider-cli.yaml、YAML の kata の sample（bdd-sample.yaml・ifx-cmd-sample.yaml）。

## 3. 完了条件

- `specdojo grade list|plan|run|apply|result` が、YAML の成果物と YAML の kata（sample など）を対象にできる。メタ情報は `validate:schema` と同じ読み方で、最上位の `id`・`type`・`status`・`rulebook` か、OpenAPI の形の `x-spec-meta` から読む。読み方の処理は、`validate:schema` と同じものを使うか、共通の処理にまとめている。
- YAML の本文をそのまま評価の対象にし、結果のサイドカーに残す。結果のハッシュは YAML のファイルの内容から取る。指摘の行番号は元の YAML の行を指す。
- Markdown の成果物の読み方・ハッシュ・結果は変わらない。既存の Markdown のサイドカーが、そのまま使える。
- メタ情報がない YAML（`rulebook` がないものなど）は、理由を示すメッセージで対象から外し、`Markdown frontmatter is required` で止まらない。
- review の段（schedule の review の plan）が、YAML の成果物の grade を流し、結果を使える。
- 単体テストで、最上位のメタ情報の YAML、`x-spec-meta` の YAML、メタ情報のない YAML、今の Markdown の 4 つの場合を確かめている。
- 統合の後に、`bdd-register-entry.yaml` と `ifx-cmd-ai-provider-cli.yaml`、`bdd-sample.yaml`・`ifx-cmd-sample.yaml` に `grade run` を流して結果ができることを確かめ、個票の対応結果に書いている（流すのは orchestrator が行ってもよい）。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分と行の文案で書いている（PJR-EPQ3）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` が通り、親の検証 `test-integration` も通る。

## 4. 作業内容

| No  | 作業                                                             | 担当     | 状態 | メモ                                                         |
| --- | ---------------------------------------------------------------- | -------- | ---- | ------------------------------------------------------------ |
| 1   | grade の文書の読み込みと、validate:schema の YAML の読み方を読む | executor | done | PJR-JQSB とメタ情報標準を確認                                |
| 2   | YAML の読み込み・ハッシュ・行番号を足し、テストを足す            | executor | done | 共通読み取り・サイドカー・回帰テストを追加                   |
| 3   | 検査を流し、対応結果に書く                                       | executor | done | 再開時にテストの期待値とローダーを修正。親検証は runner 担当 |

## 5. 対応結果

### 5.1. 実施内容

- `src/shared/document-metadata.ts` と `docs/specdojo/lib/yaml-metadata.cjs` に YAML の読み取りを追加し、`validate:schema` のメタ情報照合と選択処理を共有した。grade の対象探索・plan・apply・result・比較資料・依存元ハッシュと pipeline 状態を `.yaml` / `.yml` に対応させた。
- YAML の本文はファイル全体を保持する。plan の埋め込み、指摘の `line` と `anchor`、サイドカーと pipeline 状態の `content_hash` は元ファイルを基準にする。評価時に YAML 自体を書き換えない。
- `tests/src/grade/yaml.test.ts` と `run.test.ts` に、最上位・`x-spec-meta`・不足メタ情報・従来の Markdown、元の行番号、ハッシュの鮮度、review からの起動と結果再利用の単体テストを追加した。`yaml.integration.test.ts` ではローカルの偽 agent を使って `list|plan|run|apply|result` とカタログからの選択を検証する。これらの実行は親 runner が担当する。
- [[specdojo:document-metadata-standard|ドキュメントメタ情報標準]] の対象形式と行番号の説明、CLI ヘルプ、pipeline 状態 schema の許可拡張子を更新した。

### 5.2. 実装時の判断

- `x-spec-meta` が mapping ならそれを優先し、そうでなければ最上位を使う。両方の値は混ぜず、既存の `validate:schema` の選択順序を維持した。共有関数は既存の配布対象 `docs/specdojo/` に置き、保護された package 設定を変更しない。docs-lint 単独導入・旧版 SpecDojo との併用では既存相当の読み方へフォールバックし、新しい依存関係を要求しない。
- 対象 YAML では `id`・`type`・`status`・`rulebook` に空でない文字列を要求し、不足時はキー名を含む理由を表示して探索から除外する。`rulebook: none` は明示値として受け付ける。Markdown の必須条件・読み取り・ハッシュには追加制約を課さない。
- YAML は Markdown の H1 を持たないため、機械判定の H1 検査を YAML に適用しない。コメントやメタ情報も評価対象に含め、行番号をずらす加工は行わない。

### 5.3. 検証結果と統合後の確認

- 2026-11-11 の再開では、親の失敗ログを確認し、`yaml.test.ts` の最上位 YAML の期待値に `fields: []` を含めた。`validate:schema` と共有する選択処理は最上位 mapping 全体を返すため、実装の動作に合わせて期待値を修正した。`x-spec-meta` の場合はその mapping だけを期待する検証を維持した。
- `yaml.integration.test.ts` は、一時ディレクトリからの `--import tsx` が `ERR_MODULE_NOT_FOUND` になっていた。テストモジュールで `import.meta.resolve("tsx")` によりローダーを解決し、子プロセスへ渡すよう修正した。子プロセスの起動エラーも明示的に検査する。追加したソース・テストに Git の起動箇所はなく、`gitEnvironment()` の適用漏れはない。
- 再開時の sandbox では `spawnSync` が `EPERM` となった。同一プロセスの実コマンド登録と偽 agent runtime を使い、最上位 YAML・`x-spec-meta`・YAML sample の `list|plan|run|apply|result`、カタログからの選択、サイドカーの内容ハッシュ、元ファイルの保持、`--changed-only`、不足メタ情報ごとのエラー、従来の Markdown 読み取りを確認し、すべて合格した。元の行番号と `anchor`、review の結果再利用、内容変更時の pipeline 状態失効も確認した。Prettier、schema のメタスキーマ検査、catalog、履歴リンク、実行時 import、`register build`、ステージ済み秘密情報検査も合格した。catalog は既存の参照先に関する警告を伴った。
- 再開指示の `npm run test:unit -- tests/src/grade/yaml.test.ts` と `npm run test:integration -- tests/src/grade/yaml.integration.test.ts` は、対象限定版も親検証と重複実行しない pipeline 段の指示に従い、runner へ引き継ぐ。今回修正した 2 件と、前回 5 秒で時間切れになった `git-environment-isolation.test.ts`・`history-links.test.ts` の再検証結果を親の記録で確認する。
- 前回の executor では、対象の成果物 2 件と sample 2 件について、実 CLI の `grade list` と `grade plan --embed-documents` が成功した。4 件とも `grade run --dry-run` でも選択・実行担当の解決に成功した。plan の出力先は一時ディレクトリとし、評価結果サイドカーは作成・編集していない。
- Prettier、変更 Markdown の検査、catalog・履歴リンク・実行時 import の検査に合格した。hook に対応する `register build` も成功し、ステージ済み実行記録の秘密情報検査は対象 0 件で合格した。catalog は tsx CLI の IPC が sandbox で拒否されたため、規約に従い `node --import tsx` で実行し、既存の警告を伴って終了コード 0 だった。型検査・lint・単体テスト・統合テスト・全体 schema 検査は指定された親 runner に委ね、executor では重複実行しない。実行結果は executor evidence と親の検証記録を正本とする。
- pipeline 状態 schema は Draft 2020-12 のメタスキーマで検証した。メタスキーマ自体を直接指定する方法では Ajv の既登録 ID と重複したため、同じメタスキーマを `$ref` で参照する一時 schema を用いた `validate:schema:file` で合格を確認した。
- 統合後の実 agent による `grade run` は使用量を消費するため、この executor では実行していない。orchestrator は `--project prj-0001` と一意な `--run-id` を付け、成果物は `--target deliverable` で `bdd-register-entry.yaml`・`ifx-cmd-ai-provider-cli.yaml`、sample は `--target kata --kind sample` で `bdd-sample.yaml`・`ifx-cmd-sample.yaml` を指定して実行する。`grade result --path <対象>` でサイドカーの生成を確認し、本節へ結果を追記する。これは人の確認事項として報告の `handoff` にも引き継ぐ。

### 5.4. CHANGELOG に書く事項

- 追加: `grade list|plan|run|apply|result` が YAML の成果物と sample に対応。最上位または `x-spec-meta` のメタ情報を読み、元の YAML の内容ハッシュと行番号で評価結果をサイドカーに保存し、review でも利用できるようにした。

## 6. 関連ドキュメント

- 決定: [[prj-0001:pjr-jqsb-grade-yaml-method]]
- 由来: [[prj-0001:pjr-v05d-grade-yaml-deliverables]]
