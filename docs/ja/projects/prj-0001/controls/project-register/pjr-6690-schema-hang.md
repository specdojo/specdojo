---
specdojo:
  id: prj-0001:pjr-6690-schema-hang
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-23T22:24:22Z"
  due_on: "2026-11-30"
  completed_at: "2026-11-24T00:34:35Z"
  conclusion: 親の検証の出力を pipe でなく一時ファイルへ書かせ、event loop が止まっても子が固まらないようにした。時間切れのときは止まった段と経過時間を出す
  commit_type: fix
  commit_scope: validate
---

# PJR-6690 親の検証の validate-schema が、並べて流したときに固まり時間切れになる

## 1. 課題内容

- 2026-11-23〜24 の kata の一括実行（`exec run --auto --parallel 5 --loop`）で、`T-KATA-WAVE-5-otp-sample-040`・`T-KATA-WAVE-5-opr-sample-060`・`T-KATA-WAVE-6-DESIGN-mm-sample-040`・`T-KATA-WAVE-6-PROJECT-pm-risk-register-sample-060` が「parent validation failed: validate-schema」で止まった。
- 4 件とも、一括実行が終わって負荷が下がった後に `exec resume --task` で流し直すと通った（2026-11-24 01:42〜01:52）。成果物の誤りではなかった。

## 2. 入力

- v0.10.0 に入れる（利用者の指定、2026-11-24）
- 2026-11-23〜24 の kata の一括実行（第 4〜6 波）で詰まった所から起票した

## 3. 影響範囲

- 並べて流す一括実行のたびに、検証の失敗ではないのにタスクが止まり、人が再開する手間が要る。
- 原因が分からないまま、検証の失敗と見分けにくい。

## 4. 対応方針

- 5 本を同時に流したときの `npm run validate:schema` を測り、固まる箇所（どの段・どのファイル）と原因を特定して、個票の対応結果に書く。
- 原因を直し、同時に 5 本流しても時間内に終わることを、測った時間とともに個票の対応結果に書く。直せない場合は、並べる数の上限か待ち合わせで避け、その理由を書く。
- 時間切れのときは、止まった検査の段と経過時間を block の理由に出す。
- 再現のテスト（または計測のスクリプト）を残す。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証の `test-integration` を通す。

## 5. 対応結果

### 5.1. 原因

- 固まっていたのは検査の中身ではなく、runner へ出力を渡す pipe である。止まった段は 4 件で異なり、特定のファイルではない（失敗ログの npm の見出しで確認）。

| タスク                                              | 止まった段                       | 経過  | timer の遅れ |
| --------------------------------------------------- | -------------------------------- | ----- | ------------ |
| `T-KATA-WAVE-5-otp-sample-040`                      | `validate:schema:yaml`           | 780 s | 約 180 s     |
| `T-KATA-WAVE-6-PROJECT-pm-risk-register-sample-060` | `validate:schema:pipeline-state` | 869 s | 約 269 s     |
| `T-KATA-WAVE-5-opr-sample-060`                      | `validate:schema:glossary`       | 643 s | 約 43 s      |
| `T-KATA-WAVE-6-DESIGN-mm-sample-040`                | `validate:schema:glossary`       | 649 s | 約 49 s      |

- `exec run --parallel` は全タスクを 1 つのプロセスで流し、他のタスクの worktree 準備（`npm ci`・`specdojo build`）や統合を spawnSync で待つ間、event loop が止まる。10 分の timer が 43〜269 s 遅れて発火したことが、その間 event loop が止まっていた証拠である。
- event loop が止まると pipe が読まれない。`validate:schema` は約 450 KB（`: valid` の行）を出力し、pipe の buffer（64 KiB）がすぐ埋まるため、子は書き込みで止まり、runner が読むまで進まない。2026-11-23 の一括実行では、止まらなかった run でも `validate-schema` が通常の 3 s から 100〜590 s に延びていた（各 run の `parent-validation-metrics.jsonl` を集計）。
- 同時に 5 本流すこと自体は原因ではない。event loop を止めずに 5 本を同時に流すと、修正前でも 3.3 s で終わった。

### 5.2. 対応

- 親の検証の標準出力・標準エラーを pipe ではなく一時ファイルへ書かせ、runner は終了時（と時間切れの時点）にファイルから読むようにした（`src/exec/parent-validation-output.ts`、`src/exec/parent-validation.ts`）。event loop が止まっても子は止まらない。出力の上限（1 MiB の head と tail）と Vitest のファイル通知の読み取りは従来どおり。
- 時間切れのとき、止まった npm script の段と経過時間を evidence の summary と block の理由に出す。例: `parent validation failed: validate-schema (timed out after 649s (stage: validate:schema:glossary))`。失敗ログには `elapsed`・`stage` の行を、`validation-timeout` の記録には `stage`・`timer_lag_ms` を足した。
- 出力がファイルになったため、group の外へ出た子孫が出力を握ったまま残っても close を待たなくなった（PJR-V277 の `pipes_closed: false` の経路は、直下の子が SIGKILL の後も close しない場合だけに残る）。`tests/src/exec/parent-validation-timeout.integration.test.ts` の期待をこの挙動に合わせた。
- 1 回目の親の検証の `test-unit` で、`tests/src/exec/validation-metrics.test.ts` の時間切れのテストが失敗した（`validation-timeout` の `active_test_files` が空）。原因は今回の変更で、テストの偽の子が `child.stdout`（pipe）へ Vitest の通知を書いていたが、runner は pipe ではなく渡したファイルから読むようになったためである。期待（`["tests/hanging.test.ts"]`）は変えず、偽の子が `spawn` に渡された標準出力のファイル記述子へ書くように直した。実際の子と同じ経路で通知を読むことを確かめるテストのままである。
- 運用ガイド（`docs/ja/specdojo/guides/exec-operation-guide.md`）の計測の記録の表と説明を更新した。

### 5.3. 計測

`npx tsx tools/e2e/parent-validation-load.ts` で、`npm run validate:schema` を `invokeParentValidation` から 5 本同時に流し、spawnSync の `sleep` で event loop を止めて測った（2026-11-24、この worktree）。

| 条件                                    | 修正前 | 修正後 |
| --------------------------------------- | ------ | ------ |
| 止めない                                | 3.3 s  | 3.1 s  |
| 2 s 止めて 0.2 s 空ける（を繰り返す）   | 6.6 s  | 4.4 s  |
| 20 s 止めて 0.05 s 空ける（を繰り返す） | 60.2 s | 20.1 s |

- 修正前は、止まる時間が長いほど子の完了が遅れる（20 s の場合に 3 回分）。修正後は子が止まっている間に終わり、runner は最初に event loop が空いた時点で結果を受け取る（20.1 s は 1 回分の停止）。5 本とも時間内に終わった。並べる数の上限や待ち合わせは足していない。
- 再現のテスト: `tests/src/exec/parent-validation-output.integration.test.ts`。event loop を 3 s 止めている間に、出力の多い子（約 1 MB）が終わることと、時間切れの block の理由に段と経過時間が出ることを確かめる。

### 5.4. 確認結果

- 対象を絞って実行した: 修正した integration テスト 2 ファイル（5 件 passed）、`tests/src/exec/parent-validation.test.ts`・`tests/src/exec/validation-metrics.test.ts` などの unit テスト（passed）、変更したファイルへの ESLint・Prettier（エラーなし）、`src` と `tools/e2e` の `tsc --noEmit`（エラーなし）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`test-integration` は親の runner の検証で確認する。

### 5.5. CHANGELOG に書く事項

- 区分: Fixed
- 文案: `exec run --parallel` で、他のタスクの準備や統合の間に親の検証（とくに出力の多い `validate-schema`）が出力の書き込みで止まり、時間切れになる不具合を直した。親の検証の出力は一時ファイルへ書く。時間切れの block 理由に、止まった npm script の段と経過時間を出す（PJR-6690）。

### 5.6. 再発防止策

- runner の event loop を止める spawnSync（`npm ci`・`specdojo build`・merge 後の build）は残っている。親の検証以外にも、子の出力を pipe で読む処理があれば同じ影響を受けうる。必要になれば、準備と統合の spawnSync を非同期にすることを別の項目で検討する。

## 6. 関連ドキュメント

- 関連: PJR-40EE（止まった理由の分類）。今回の一括実行の記録は PJR-8X86。
