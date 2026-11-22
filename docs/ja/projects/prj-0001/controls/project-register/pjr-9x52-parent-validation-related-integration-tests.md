---
specdojo:
  id: prj-0001:pjr-9x52-parent-validation-related-integration-tests
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-22T13:34:24Z"
  due_on: "2026-11-30"
  completed_at: "2026-11-22T14:37:19Z"
  conclusion: "parent_validations の test-unit・test-integration に related: true を書くと、変更に依存するテストだけを流せるようにした。既定は全件で、選んだテストと理由を evidence に残す"
---

# PJR-9X52 親の検証の統合テストを、変更に関係するテストだけに絞れるようにする

## 1. 概要

src か tests を変えた run では、親の検証が毎回 42 ファイルの統合テストを全部流し、中央値 130 秒・最大 869 秒かかる。変更に関係するテストだけを流す方法を選べるようにし、全件は夜間とリリースの前に流す。

## 2. 入力

- 2026-11-22 の集計（run 73 件）: 親の検証の test-integration は中央値 130 秒・最大 869 秒、test-unit は中央値 41 秒。検証ごとの paths による選び方と、lint の一部の並列はもう入っている。
- 既定は今の全件のままにし、設定で選べる形にする。見逃しの危険があるため、使うかは測った結果を見て利用者が決める（indie の承認、2026-11-22）。担当 DEV、期限 2026-11-30。

## 3. 完了条件

- 親の検証の統合テストを、変更したファイルに関係するテストだけに絞る方法を、`exec-defaults.yaml` の parent_validations の設定で選べるようにする（例: `vitest related` に変更したファイルを渡す）。設定のキーと名前は executor が決め、schema を直す。
- 設定を書かないときは、今までどおり全件を流す（単体テストで確かめる）。
- 絞ったときに選ばれるテストを、変更したファイルの例ごとに確かめる（単体テスト）。関係するテストが見つからないとき、設定やテストの基盤（`vitest.*`・`tests/helpers/` など）を変えたときは全件に戻す。
- 絞ったときでも、選ばれたテストと絞った理由を evidence に残し、後から何を流さなかったかが分かるようにする。
- 夜間とリリースの前に全件を流す手順を、`exec-config-guide` と運用の記述に書く。
- 今日の run の変更の例（3〜5 件）で、全件と絞ったときの選ばれるテストの数と時間の見込みを個票の対応結果に書く。実際に使うかは利用者が決めるため、prj-0001 の設定は変えない。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`package.json` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。
- runner の動きを変えるため、統合の後にオーケストレーターが JSEY を流して確かめてから close する。

## 4. 作業内容

| No  | 作業                                                                                                      | 担当               | 状態 | メモ                                                      |
| --- | --------------------------------------------------------------------------------------------------------- | ------------------ | ---- | --------------------------------------------------------- |
| 1   | 関係するテストを選ぶ処理（`src/exec/related-tests.ts`）と、`parent_validations` の `related` の設定を作る | DEV                | done | 既定は全件のまま                                          |
| 2   | 選んだテストと理由を evidence の `test_selection` に残し、2 つの schema を直す                            | DEV                | done | `exec-defaults`・`exec-evidence`                          |
| 3   | 単体テストを足す（変更したファイルの例ごとの選び方・全件へ戻す条件・設定を書かないときの全件）            | DEV                | done | `tests/src/exec/related-tests.test.ts`                    |
| 4   | 夜間とリリースの前に全件を流す手順を `exec-config-guide`・`exec-operation-guide` に書く                   | DEV                | done | -                                                         |
| 5   | 今日の run の変更の例で、選ばれるテストの数と時間を見込む                                                 | DEV                | done | 対応結果に記載                                            |
| 6   | 統合の後に JSEY を流して runner の動きを確かめる                                                          | オーケストレーター | open | executor は流せない。close の前にオーケストレーターが行う |

## 5. 対応結果

### 5.1. 実施内容

- `pipeline.parent_validations` の要素に `related: true` を足した（`test-unit`・`test-integration` だけに書ける）。書かなければ今までどおり全件を流す。
- 親 runner は `tests/` 配下の各テストから相対 import と、テストが子プロセスで起動するファイル（`src/specdojo.ts` など、`dist/<name>.js` は `src/<name>.ts` とみなす）を辿り、変更したファイルに依存するテストだけを固定の npm script の `--` の後ろへ渡す。
- 次の場合は全件に戻す: 変更一覧が無い・切れた、関係するテストが無い、テストの基盤や設定（`vitest.*`・`tests/helpers/**`・`tests/setup/**`・`tests/fixtures/**`・`package.json`・`package-lock.json`・`tsconfig*.json`・`lefthook.yml`・`.specdojo/**`・`docs/specdojo/**`）を変えた、`src/` などの配下でコード以外のファイルを変えた。
- evidence の検証に `test_selection`（`mode`・`reason`・`selected_tests`・`omitted_tests`）を残し、`summary` の先頭にも `related tests only (...)` / `full run (...)` を付ける。
- prj-0001 の設定（`.specdojo/exec-defaults.yaml`）は変えていない。

### 5.2. 決めた点と理由

- 選び方は `vitest related` ではなく、runner が import を辿って自分で選ぶ形にした。流す前に選んだテストと流さないテストが分かり、evidence に残せること、単体テストで選び方を確かめられることが理由。
- テストが子プロセスで起動するファイルのパスも依存として辿る。統合テストの多くは `tsx src/specdojo.ts` で CLI を起動しており、import だけでは見逃すため。
- 変更したコードのうちどのテストにも依存されないファイルがあっても、関係するテストが 1 つでもあれば絞る。全件に戻すと単体テストだけを持つ src の変更のたびに全件になり、絞る意味が無くなるため。どのテストにも依存されないファイルは `reason` に挙げる。
- `docs/specdojo/**` の schema・template はテストが実行時に読むため、変えたら全件に戻す。
- 絞って `passed` になった検証も `commit_hook_skips` を満たす扱いのままにした。統合の commit で `npm test` の全件を流すと時間が減らないため。その分の見逃しは夜間とリリースの前の全件で拾う。ガイドにも書いた。

### 5.3. 今日の run での見込み

全件は 43 ファイル。時間は各 run の親の検証の実測（`parent-validation-metrics.jsonl`）に、選ばれる数の割合を掛けた見込み。重い e2e のテストは多くの変更で選ばれるため、実際の短縮はこれより小さい。

| run の変更の例                                                          | 全件の実測  | 選ばれる数       | 時間の見込み |
| ----------------------------------------------------------------------- | ----------- | ---------------- | ------------ |
| PJR-Z17T（`tests/src/exec/kata-review-stage.integration.test.ts` だけ） | 139 秒      | 1                | 数秒〜十数秒 |
| PJR-MS7X（`src/update/**`・`src/specdojo.ts`）                          | 127 秒      | 9                | 約 27 秒     |
| PJR-7C9X（`src/grade/plan.ts`）                                         | 130〜138 秒 | 10               | 約 31 秒     |
| PJR-VQK2（`src/exec/register.ts` など）                                 | 153 秒      | 20               | 約 71 秒     |
| PJR-KZZM（`src/shared/specdojo-config.ts`）                             | 145 秒      | 36               | 約 121 秒    |
| PJR-K8F1（`exec-defaults.schema.yaml` を含む）                          | 126 秒      | 43（全件に戻る） | 変わらない   |

src か tests を変えた今日の 19 run では、選ばれる数の中央値は 26（4 run は全件に戻る）で、中央値 130 秒が約 80 秒になる見込み。使うかは利用者が決める。使う場合の設定の案は次の「保護された設定の変更案」に書いた。

### 5.4. 保護された設定の変更案

`.specdojo/exec-defaults.yaml` の `test-integration` の要素に `related: true` を足す（今の `paths` はそのまま）。夜間に `npm run test:integration` を流す routine などを併せて用意してから入れる。

### 5.5. CHANGELOG に書く事項

- 区分: 追加
- 行の文案: 親の検証の `test-unit`・`test-integration` に `related: true` を書くと、変更したファイルに関係するテストだけを流せるようにした。既定は今までどおり全件。選んだテストと理由は evidence の `test_selection` に残る（PJR-9X52）。

### 5.6. 残課題

- 統合の後にオーケストレーターが JSEY を流して確かめてから close する。

## 6. 関連ドキュメント

- [[specdojo:exec-config-guide|exec設定ガイド]]: `related` の設定と全件を流す時機。
- [[specdojo:exec-operation-guide|exec運用ガイド]]: 夜間とリリースの前に全件を流す手順。
