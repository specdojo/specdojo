---
specdojo:
  id: prj-0001:pjr-j44d-slow-unit-tests-real-docs
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: waiting
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-10-24T22:18:14Z"
  block_reason: "agent exited with non-zero code: parent validation failed: test-unit"
  derived_from:
    - PJR-68KR
---

# PJR-J44D 本リポジトリの文書を丸ごと使う単体テストが時間切れで毎回落ちる

## 1. 課題内容

doc-index.test.ts の登録簿の参照の解決のテストが docs を丸ごと一時のディレクトリへコピーして索引を作るため、文書が増えて単独でも 24 秒かかり上限の 20 秒を超える。register-plan-escape.test.ts の成果物の approach のテストも 5〜15 秒かかり上限の 5 秒の前後にある。develop の test-unit が毎回失敗し、すべての run の親の検証が止まる

## 2. 影響範囲

| 観点         | 影響                                                                                                                                                                                                                                                                                        |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | `tests/src/docs/doc-index.test.ts` の「個票の part_of と pjr-index wikilink が生成された登録台帳へ解決する」、`tests/src/exec/register-plan-escape.test.ts` の「成果物 approach は schedule と同じテンプレートに DCT と個票の完了条件を載せる」、ほかに本リポジトリの文書を丸ごと使うテスト |
| スケジュール | 大。develop の `npm run test:unit` が毎回失敗し、すべての run の親の検証と統合が止まる                                                                                                                                                                                                      |
| コスト       | run の再開のやり直しと、原因の調査の手間                                                                                                                                                                                                                                                    |
| 品質         | テストの結果が文書の量に左右され、壊れていないのに失敗する                                                                                                                                                                                                                                  |
| 関係者       | 本リポジトリで exec run を流すすべての作業                                                                                                                                                                                                                                                  |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | `doc-index.test.ts` のテストが `cpSync(process.cwd()/docs)` で本リポジトリの `docs/` を丸ごと一時のディレクトリへコピーしてから索引を作る。実行の記録などで文書が増え、単独でも 24 秒かかって上限の 20 秒を超えた。`register-plan-escape.test.ts` の 1 件も 5〜15 秒かかり、上限の 5 秒の前後にある |
| 対応策   | テストに要る最小の文書の fixture に置き換えるか、重い準備をテストの間で共有する。時間の上限を広げるだけの対処は最後の手段とする                                                                                                                                                                     |
| 依存事項 | なし                                                                                                                                                                                                                                                                                                |
| 完了条件 | 下記の完了条件を満たす                                                                                                                                                                                                                                                                              |

### 3.1. 完了条件

- v0.4.6 の範囲とする（2026-10-25、利用者が承認）。ほかの run が止まっているため、最優先で行う。
- 上の 2 つのテストを、本リポジトリの `docs/` を丸ごと読まずに同じことを確かめる形に直す（必要な個票・一覧・設定だけの小さな fixture を作る、など）。テストが確かめている内容（登録簿の参照の解決、approach の plan に DCT と個票の完了条件が載ること）は弱めない。
- `tests/` の中で、`process.cwd()` の `docs/` を丸ごとコピーしたり全体を走査したりするテストがほかにないかを調べ、見つかったものは一覧を result に書く。時間がかかっているもの（目安: 単独で 3 秒以上）は同じく直す。
- 直したテストが、`npm run test:unit` の中で上限の半分以下の時間で終わることを確かめ、直す前と後の時間を result に書く。
- 時間の上限（`timeout`）を広げるだけの変更はしない。広げる場合は理由を result に書く。
- executor の検証で test-unit が通る（このテストを直す run そのものの親の検証も test-unit を含むため、直っていれば通る）。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- 利用者から見た動きは変わらないため、CHANGELOG には書かない。

## 4. 対応結果

### 4.1. 実施内容

- `tests/src/docs/doc-index.test.ts`: 実リポジトリの `docs/` と索引設定のコピーを廃止し、個票・参照元文書・生成された登録台帳の 3 文書だけを一時ディレクトリに作る。個票の `part_of` と本文の wikilink が生成された登録台帳へ解決することを維持し、参照件数の固定値検証とリンク置換結果の検証を追加した。
- `tests/src/exec/register-plan-escape.test.ts`: 成果物 approach のテストに一時リポジトリの設定を用意し、作業ディレクトリと `SPECDOJO_PACKAGE_ROOT` をそこへ切り替える。共有する実テンプレート 2 ファイルと rulebook 1 ファイルだけを読み、DCT・個票の完了条件と plan の検証項目を維持した。既存の後処理で作業ディレクトリと環境変数を復元する。
- `tests/packages/docs-lint/remark-no-unescaped-angle-placeholder.test.ts`: 文書全体の走査を、frontmatter・表・HTML・リンク・コードブロックを組み合わせた固定入力へ置き換えた。文書全体に対する同じルールの検査は `.remarkrc.yaml` に設定済みの `lint:fm` が担う。
- 製品コードとタイムアウトの延長は変更に含めていない。文書量に比例する準備・走査を単体テストから取り除き、文書追加による再発を防ぐ。

### 4.2. 文書全体を使うテストの調査

`tests/` 内の `process.cwd()`、コピー処理、glob・ディレクトリ走査、文書索引 API の呼び出しと対象コードを確認した。文書全体への依存として、上記 3 ファイルを修正した。

| 対象                                                                                                                                                                                                                                                                                               | 調査結果                                                                                                        |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `tests/src/docs/doc-index.test.ts`                                                                                                                                                                                                                                                                 | 実 `docs/` の全コピーと、そのコピー全体の索引生成・参照走査。3 文書の fixture に変更した。                      |
| `tests/src/exec/register-plan-escape.test.ts`                                                                                                                                                                                                                                                      | 成果物 approach の対象検証が実リポジトリ全体の索引を収集する間接依存。一時リポジトリ内に限定した。              |
| `tests/packages/docs-lint/remark-no-unescaped-angle-placeholder.test.ts`                                                                                                                                                                                                                           | 追加で見つかった `docs/**/*.md` の全走査と全 Markdown の解析。固定入力に変更した。                              |
| `tests/src/catalog/plan-command.test.ts`、`tests/src/register/{commands,migration}.test.ts`、`tests/src/register/{commit,cross-project,external-project}.integration.test.ts`、`tests/src/exec/register-{resume,pipeline-e2e}.integration.test.ts`、`tests/src/schedule/strategy-generate.test.ts` | コピー対象は templates・exec-templates・schemas 等に限定され、実 `docs/` 全体はコピーしない。                   |
| その他の索引・YAML ページ・glob テスト                                                                                                                                                                                                                                                             | 一時 fixture の走査、または特定のテンプレート・schema ディレクトリの列挙であり、実 `docs/` 全体の走査ではない。 |

### 4.3. 検証と計測の引き継ぎ

- 変更前の時間は本個票の起票時の記録による。索引テストは単独で約 24 秒（上限 20 秒）、成果物 approach のテストは約 5〜15 秒（上限 5 秒）だった。executor では変更前のテストを再実行していない。
- pipeline の指示により、`typecheck`・`lint:ts`・`test:unit` 等の親検証は executor では実行しない。変更後の実測値と最終的な合否は、この run の親 runner による検証記録を reporter が result に記載する。索引テストは 10 秒以下、成果物 approach のテストは 2.5 秒以下であることを同記録で確認する。
- executor では変更ファイルの Prettier 整形、`node --import tsx tools/catalog-validate-if-configured.mjs`、`node --import tsx src/specdojo.ts register build --project prj-0001` が終了コード 0 で成功した。カタログ検証には未作成文書の `based_on` を検証できない警告がある。派生ビューだけを再生成し、CHANGELOG の追記と登録簿の状態遷移は行っていない。

## 5. 関連ドキュメント

- PJR-68KR・PJR-JSEY（時間切れで止まった run）
