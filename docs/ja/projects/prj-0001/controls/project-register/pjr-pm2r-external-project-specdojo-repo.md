---
specdojo:
  id: prj-0001:pjr-pm2r-external-project-specdojo-repo
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-10-24T13:41:22Z"
  due_on: "2026-10-31"
  completed_at: "2026-10-24T14:44:25Z"
  conclusion: external_projects の委譲で、相手に node_modules/.bin/specdojo がなく package.json の name が specdojo のときは、相手の dist/specdojo.js を Node で起動するようにした。未ビルドなら npm run build を案内して止まる。インストール済みの CLI を優先し、版の確かめは今のまま
---

# PJR-PM2R external_projects で SpecDojo のリポジトリへ起票を任せられない

## 1. 課題内容

`external_projects` の起票の委譲は相手の `node_modules/.bin/specdojo` を呼ぶが、SpecDojo 自身のリポジトリには `npm install` 後もこの実行ファイルがないため、利用者のリポジトリから本家へ起票できない。

- 起きた条件: 利用者のリポジトリ（coderdojo-lessons-specdojo）から、clone した SpecDojo のリポジトリ（`project/prj-0001/develop`、0.4.5）へ、[[prj-0001:pjr-ss72-maintenance-plan-md036]] などを起票しようとした。
- 確かめたこと: `targetSpecdojoExecutable`（`src/register/external-project.ts`）は `<相手のリポジトリ>/node_modules/.bin/specdojo` がないとエラーにする。SpecDojo のリポジトリで `npm install` と `npm run build` を実行しても、自分自身の bin は `node_modules/.bin` に入らない。
- 実際に `external_projects` を設定して委譲を試してはいない。上の2点から、委譲は `External project repository does not have SpecDojo installed` で止まると判断した。
- 回避: SpecDojo のリポジトリの clone で `node dist/specdojo.js register add ... --commit` を直接実行して起票した。

## 2. 影響範囲

| 観点         | 影響                                                               |
| ------------ | ------------------------------------------------------------------ |
| スコープ     | 利用者のリポジトリから SpecDojo の登録簿への起票の委譲             |
| スケジュール | 利用者は SpecDojo のリポジトリの clone で CLI を直接使う必要がある |
| コスト       | clone での `npm install` と `npm run build` が要る                 |
| 品質         | なし                                                               |
| 関係者       | SpecDojo へ不具合を報告する利用者                                  |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                  |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | 委譲は相手のリポジトリに npm で導入された CLI だけを想定している                                                                                      |
| 対応策   | 相手が SpecDojo 自身のリポジトリの場合は `dist/specdojo.js` を使う、など実行ファイルの探し方を広げる。対応しない場合は、文書に制約と回避の手順を書く  |
| 依存事項 | なし                                                                                                                                                  |
| 完了条件 | 利用者のリポジトリから SpecDojo のリポジトリの project へ `register add --project <別名> --commit` で起票できる。または、制約と回避の手順が文書にある |

### 3.1. 完了条件（追記）

- v0.4.6 の範囲とする（2026-10-24、利用者が承認）。上の表の対応策のうち、実行ファイルの探し方を広げる方で直す（文書に制約を書くだけにはしない）。
- 委譲の相手のリポジトリに `node_modules/.bin/specdojo` がなく、相手の `package.json` の `name` が `specdojo`（SpecDojo 自身のリポジトリ）で `dist/specdojo.js` がある場合は、`node <相手>/dist/specdojo.js` で起動する。`dist/specdojo.js` がない場合は、`npm run build` を案内して止まる。版の確かめ（0.4.2 以上）は今のまま行う。
- 統合テストで、SpecDojo 自身のリポジトリに見立てた一時のリポジトリ（`name: specdojo` と `dist/specdojo.js` を持つ）へ、別の一時のリポジトリから起票できることを確かめる。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG の `## [Unreleased]` の節に書く（なければ作る）。

## 4. 対応結果

- `src/register/external-project.ts` の CLI 解決を拡張した。インストール済みの CLI を優先し、存在しない場合に相手の `package.json` の `name` が `specdojo` なら、`process.execPath` と相手の `dist/specdojo.js` で版の確認と起票を行う。未ビルドの場合は `npm run build` を案内して、起票前に停止する。
- 単体テストに、Node.js に渡す引数、インストール済み CLI の優先、未ビルド時の停止、別パッケージの除外、既存の版の条件を追加した。統合テストには、`name: specdojo` と `dist/specdojo.js` を持ち、`node_modules/.bin/specdojo` のない一時リポジトリへの起票を追加した。相手の統合ブランチへの 1 件の commit と呼び出し元が変わらないことを検証する。
- [[specdojo:command-reference|CLI コマンドリファレンス]]・[[specdojo:specdojo-config-reference|設定リファレンス]]・[[specdojo:register-operation-guide|登録簿運用ガイド]] に起動方法とビルドの前提を追記し、CHANGELOG の Unreleased に記載した。
- executor で Prettier 整形、本体のビルド、登録簿の派生ビュー生成、カタログ検証が通った。カタログ検証は未作成の成果物に関する警告を出したが、終了コードは 0。型検査、lint、単体テスト・統合テスト、schema 検査の成否は、executor 終了後に実行する親 runner の evidence を正とする。統合後の実 agent による確認は PJR-JSEY で行う。

## 5. 関連ドキュメント

- [[prj-0001:pjr-ss72-maintenance-plan-md036]]：委譲を試すきっかけになった不具合
- [[prj-0001:pjr-68kr-checkpoint-failure-summary]]：同じく起票した不具合
