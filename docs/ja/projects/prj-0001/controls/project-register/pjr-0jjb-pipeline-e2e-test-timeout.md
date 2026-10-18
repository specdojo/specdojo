---
specdojo:
  id: prj-0001:pjr-0jjb-pipeline-e2e-test-timeout
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: review
  priority: high
  owner: DEV
  registered_at: "2026-10-18T02:21:23Z"
  due_on: null
---

# PJR-0JJB pipeline-e2e の統合テストが負荷で 20 秒の上限を超えて親の検証を落とす

## 1. 課題内容

tests/src/exec/pipeline-e2e.integration.test.ts の再開のテストは 1 件あたり約 2 秒で、単独なら 16 件が 36 秒で通るが、テストの中で 20 秒の上限を指定しているため、並行の run やローカル LLM と重なると上限を超える。2026-10-18 に BHMH・FXPH・H06F・JSEY の親の検証や統合の hook がこれで落ちた。W2EB の統合テスト全体の 30 秒の上限も、テストの中の指定で上書きされている

## 2. 影響範囲

| 観点         | 影響                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------------ |
| スコープ     | `tests/src/exec/pipeline-e2e.integration.test.ts`、`tests/src/exec/register-plan-escape.test.ts` |
| スケジュール | 高い。並行の run の親の検証が時間切れで落ち、やり直しが続く                                      |
| コスト       | 落ちた run の再開と、負荷を避けるための直列化の待ち                                              |
| 品質         | 実装の誤りではない失敗が親の検証に混ざり、本当の失敗が見分けにくい                               |
| 関係者       | exec run の利用者と orchestrator                                                                 |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                            |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | テストの中で 20 秒の上限を指定し、統合テスト全体の上限（30 秒、PJR-W2EB）を上書きしている。`register-plan-escape.test.ts` の kata の approach のテストは単独で 1.4 秒だが、負荷のあるときに 10 秒を超えて落ちた |
| 対応策   | テストの中の上限を外して全体の上限に従わせる。時間のかかるテストは原因を調べ、一時ディレクトリの中で完結させる                                                                                                  |
| 依存事項 | なし                                                                                                                                                                                                            |
| 完了条件 | 下記の完了条件を満たす                                                                                                                                                                                          |

### 3.1. 完了条件

- `tests/src/exec/pipeline-e2e.integration.test.ts` で、テストの中で指定している 20 秒の上限を外し、統合テスト全体の上限に従わせる。全体の上限を変える必要があれば理由を result に書く。
- `tests/src/exec/register-plan-escape.test.ts` の kata の approach のテストが、本物のリポジトリの kata を解決していないかを確かめる。解決している場合は一時ディレクトリの中で完結させ、単体テストの上限内に安定して収まるようにする。
- 2 つのファイルとも、単独で流したときの時間が今より長くならない。前後の時間を result に書く。
- ほかの統合テストで、テストの中で全体より短い上限を指定しているものを一覧にして result に書く。直すのは本件の 2 ファイルだけにする。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG には記載しない（内部の変更のため）。

## 4. 対応結果

- `tests/src/exec/pipeline-e2e.integration.test.ts` の再開系 4 テストから個別の 20 秒上限を外し、`vitest.integration.config.ts` の全体上限 30 秒に従うようにした。
- `tests/src/exec/register-plan-escape.test.ts` の kata maintenance approach は、実リポジトリの `specdojo:pjr-rulebook` を解決していた。一時ディレクトリに rulebook と必要な plan template を配置し、`SPECDOJO_PACKAGE_ROOT` と作業ディレクトリを fixture へ固定することで、解決と生成を一時ディレクトリ内で完結させた。
- 他の統合テストを棚卸した結果、全体上限 30 秒より短い個別上限は、本件で削除した `pipeline-e2e.integration.test.ts` の 4 件以外にはなかった。
- 変更前の実測は pipeline-e2e 16 件が約 36 秒、kata maintenance approach が約 1.4 秒だった。変更後の実測と lint・型検査・test の最終結果は、executor と重複実行しないため親 runner の evidence で確定する。

## 5. 関連ドキュメント

- [[prj-0001:pjr-w2eb-npm-test-load-timeout]]
