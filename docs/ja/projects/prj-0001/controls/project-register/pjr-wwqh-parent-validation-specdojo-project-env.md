---
specdojo:
  id: prj-0001:pjr-wwqh-parent-validation-specdojo-project-env
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: review
  priority: high
  owner: DEV
  registered_at: "2026-10-21T22:58:30Z"
  due_on: "2026-10-31"
---

# PJR-WWQH exec run の親の検証に `SPECDOJO_PROJECT` が漏れ、テストが失敗する

## 1. 課題内容

`SPECDOJO_PROJECT=prj-0002` のシェル（orchestrator launch の手順どおり）から exec run を流すと、親の検証の test-unit に環境変数が引き継がれ、テストが作る仮のリポジトリの設定に prj-0002 がないため Unknown project で 65 件が失敗する。runner の親の検証の環境またはテストの共通 setup で `SPECDOJO_PROJECT` を切り離す

## 2. 影響範囲

| 観点         | 影響                                                                                                         |
| ------------ | ------------------------------------------------------------------------------------------------------------ |
| スコープ     | _TODO_                                                                                                       |
| スケジュール | _TODO_                                                                                                       |
| コスト       | _TODO_                                                                                                       |
| 品質         | `SPECDOJO_PROJECT` を設定したシェルから流す run は、成果物と無関係に `test-unit` が失敗して `waiting` になる |
| 関係者       | _TODO_                                                                                                       |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                   |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | 親の検証の子プロセスへ `SPECDOJO_PROJECT` がそのまま渡り、テストの CLI が仮のリポジトリの設定にない project を解決しようとする（2026-10-21、prj-0002 の PJR-0WFV の run で観測）                                                                                       |
| 対応策   | runner の親の検証の環境から外すか、テストの共通 setup で `GIT_LOCAL_ENV_VARS` と同じく除去するか、executor が決めて理由を result に書く                                                                                                                                |
| 依存事項 | _TODO_                                                                                                                                                                                                                                                                 |
| 完了条件 | `SPECDOJO_PROJECT` に別の project を設定した環境でも `npm run test:unit` と `npm run test:integration` が通ることをテストで確かめる。`typecheck`・`lint:ts`・`test:unit` と親の検証が通る。runner を変えた場合は統合の後に `exec run --register` を 1 回流して確かめる |

## 4. 対応結果

### 作業内容・採用理由

- `tests/setup/git-environment.ts` で、test module を読み込む前に継承した `SPECDOJO_PROJECT` を削除する。unit・integration の両設定と、両者を使う `npm test` の共通入口を使い、親検証とシェルからの直接実行の双方を隔離する。
- runner の環境処理は変更しない。テスト fixture だけで不要な project 選択を入口で除去し、通常の CLI・orchestrator の project 解決と、テスト自身が明示的に設定する環境変数の動作を保つため、この方式を採用した。
- `tests/vitest-config.test.ts` に、両設定の共通 setup の指定と、未知の `prj-0002` を設定した後に setup が除去する単体回帰テストを追加した。
- `tests/test-environment.integration.test.ts` に、両設定の実際の setup を別プロセスで読み込み、その子プロセスの CLI 処理が `prj-0001` しかない一時リポジトリの catalog を解決できる統合回帰テストを追加した。setup 前には `SPECDOJO_PROJECT=prj-0002` を注入し、除去が欠ければ `Unknown project` で失敗する構成にした。
- [[specdojo:exec-config-guide|exec 設定ガイド]] に、テスト入口での project 環境隔離と、setup 後の明示設定は有効であることを追記した。

### 検証・申し送り

- 変更した TypeScript・Markdown 5 ファイルの `npx prettier --write` と `git diff --check` は成功した。
- `node --import tsx src/specdojo.ts register build --project prj-0001` は終了コード 0 で成功した。登録簿一覧と個票のステータスは変更していない。
- `node --import tsx src/specdojo.ts catalog validate --project prj-0001` は終了コード 0 で成功した。未作成成果物の `based_on` 検証に関する警告は出たが、本タスクの変更外である。
- `typecheck`・`lint-ts`・`lint-fm`・`lint-md`・`test-unit`・`test-integration`・`validate-schema` は pipeline の親 runner が実行する。executor では指示に従って重複実行せず、上記の回帰テストも親検証で実行する。
- 完了条件にある別 project 環境の確認は、両設定の setup に未知の project を明示的に渡す回帰テストで検証する。全 suite と静的検査の実行結果は親 runner の evidence を正とする。
- runner は変更していないため、「runner を変えた場合」の統合後 `exec run --register` 確認は非適用。

## 5. 関連ドキュメント

- [[prj-0002:pjr-0wfv-lp-why-register]]: 観測した run の項目。
- [[prj-0001:pjr-sazc-orch-scripts-via-launch]]: `SPECDOJO_PROJECT=prj-0002` で orchestrator を起動する手順を作った項目。
