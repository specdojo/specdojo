---
specdojo:
  id: prj-0001:pjr-8ts6-reporter-changed-files-missing-description
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: low
  owner: DEV
  registered_at: "2026-10-17T08:22:08Z"
  due_on: null
---

# PJR-8TS6 result の変更ファイルの説明が「reporter の説明がないため」で埋まる

## 1. 課題内容

reporter が変更ファイルごとの説明を返さないと、runner が result の変更ファイルの欄を「reporter の説明がないため、変更差分を参照」で埋める。PJR-XP0J の result では多くの行がこの文で、何を変えたかが result から読めない

## 2. 影響範囲

| 観点         | 影響                                                                                                                                          |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | `src/exec/results.ts`（`MISSING_CHANGED_FILE_SUMMARY`）、reporter の plan の指示（変更ファイルごとの説明の返し方）、reporter の出力の取り込み |
| スケジュール | 急がない                                                                                                                                      |
| コスト       | result の「変更ファイル」の欄の多くが定型の文になり、何を変えたかが result から読めない（PJR-XP0J の result など）                            |
| 品質         | 履歴としての result の価値が下がる                                                                                                            |
| 関係者       | result を読む利用者と orchestrator                                                                                                            |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                               |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | reporter が変更ファイルごとの説明を返さない場合、runner が `src/exec/results.ts` の `MISSING_CHANGED_FILE_SUMMARY`（`reporter の説明がないため、変更差分を参照。`）で欄を埋める。変更ファイルが多いと、reporter が説明を省きやすい |
| 対応策   | reporter が説明を返さなかったファイルについても、runner が機械的に分かる情報（追加・変更・削除・名前の変更と、変更の行数）を説明として書く。あわせて、reporter の plan の指示で、変更ファイルの説明を求める箇所を明確にする        |
| 依存事項 | なし                                                                                                                                                                                                                               |
| 完了条件 | 下記の完了条件を満たす                                                                                                                                                                                                             |

### 3.1. 完了条件

- reporter が説明を返さなかった変更ファイルの欄に、定型の文ではなく、runner が git から分かる情報（例: `名前の変更（src/exec-run.ts から）、+12 / -3 行`）が書かれる。
- reporter が説明を返したファイルは、従来どおり reporter の説明を使う。
- 変更ファイルが多い場合（例: 50 件を超える場合）に、result が読めなくならないよう、まとめ方（ディレクトリごとの件数にまとめる、など）を決めて実装し、result に書く。
- reporter の plan の、変更ファイルの説明を求める指示を見直し、説明を返すべきファイルの範囲（成果物・ソース・テストなど）を明確にする。
- 単体テストで、説明のないファイルの書き方と、多い場合のまとめ方を確かめる。
- 本件は plan の生成（`src/exec/plans*.ts`・`src/exec/register.ts`）を変えない（並行して動く PJR-H06F と重ならないようにするため）。reporter の plan の指示を変える必要がある場合は、雛形（`templates/` か `docs/ja/specdojo/templates/`）だけを変える。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG に記載する場合は、未公開の版の節（`## [0.4.0] - 未定`）に書く。公開済みの版の節は変えない。

## 4. 対応結果

- 解決内容:
  - `src/exec/results.ts` において、reporter が説明を返さなかった変更ファイルに対する固定の定型文（`reporter の説明がないため、変更差分を参照。`）を廃止し、Git の変更種別（追加・変更・削除・名前の変更）および変更行数差分（`+X / -Y 行`）から機械的にフォールバック説明（例: `名前の変更（src/exec-run.ts から）、+12 / -3 行`、`追加、+2 / -0 行`）を生成する処理を実装した。
  - 変更ファイル数が 50 件（`MAX_INDIVIDUAL_CHANGED_FILES`）を超える場合、reporter の説明があるファイルは個別に記載を維持しつつ、説明のないファイルをディレクトリ単位（件数・内訳・行数差分・`ほか X 件`）に集約して表示し、大量の変更があっても result の可読性が損なわれないようにした。
  - `src/exec/reporter.ts`、`templates/claude/agents/claude-reporter.md`、`templates/opencode/agents/opencode-reporter.md`、および `docs/ja/specdojo/exec-templates/xep-common-conventions-template.md` を更新し、reporter が成果物（`docs/`）、ソースコード（`src/`）、テストコード（`tests/`）にわたる変更ファイルの説明を `changed_files` で具体的に返すようプロンプト・エージェント定義・共通規約を明確化した。
  - ガイド `docs/ja/specdojo/guides/exec-config-guide.md` および `CHANGELOG.md`（`[0.4.0] - 未定`）に本機能の仕様と挙動を追記した。
  - 並行して動く PJR-H06F との競合を回避するため、plan 生成コード（`src/exec/plans*.ts`・`src/exec/register.ts`）は変更せず、雛形（`templates/` および `docs/ja/specdojo/exec-templates/`）と runner / reporter の処理のみで対応した。
- 確認結果:
  - `tests/src/exec/results.test.ts` に、Git 情報を用いたフォールバック表示（行数差分あり・なし）、50 件超のディレクトリ集約、閾値境界（50 件・51 件）の単体テストを追加し、`tests/src/exec/reporter.test.ts` のプロンプト文言検証および `tests/src/shared/git-environment-isolation.test.ts` の環境変数隔離ルールへの準拠を含めて確認した。
  - `tests/src/exec/pipeline-e2e.integration.test.ts` の期待値を更新し、結合テスト 16 件全件が成功することを確認した。
  - `npm run typecheck`、`npm run lint:ts`、`npm run test:unit` を実行し、すべて正常に通過することを確認した。
- 再発防止策:
  - reporter プロンプトおよび agent テンプレートに、edit モードで成果物・ソース・テストの全変更ファイルに対して具体的な説明を返すことを標準指示として組み込み、説明漏れを抑止する。
  - reporter が説明を返さなかった場合でも、Git メタデータによるフォールバックと 50 件超のディレクトリ集約により、result の可読性と変更履歴のトレーサビリティを恒常的に保護する。

## 5. 関連ドキュメント

- [[prj-0001:pjr-xp0j-src-move-exec]]: 事象が目立った result。
