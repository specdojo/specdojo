---
specdojo:
  id: prj-0001:pjr-r7bq-hide-internal-commands
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: low
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-16T11:00:22Z"
  due_on: null
  derived_from:
    - PJR-C5AF
  commit_type: refactor
  commit_scope: grade
---

# PJR-R7BQ grade と exec の内部用のコマンドを利用者の一覧から外す

## 1. 概要

grade と exec の内部用のコマンドを利用者の一覧から外す。runner・job・orchestrator の部品として使うもので、利用者が直接打つことがないため（PJR-C5AF）。

## 2. 入力

- PJR-C5AF の内部用の候補: grade の plan・apply・translation-plan・localize・state・result・validate、agent launch・run、exec trial・slots・scheduler
- grade の内部用は、定期の job（job-grade-kata・job-grade-deliverable）が使う tools/grade/run-per-document.sh を grade run に移してから外す。外したコマンドは help に出さないだけにし、runner・job・orchestrator からの呼び出しは保つ

## 3. 完了条件

- 定期の job が `tools/grade/run-per-document.sh` ではなく `grade run` で grade する。
- 対象の内部用のコマンドが help の一覧に出ない。runner・job・orchestrator からの呼び出しは変わらず動く。
- リファレンスで、内部用のコマンドを利用者向けの説明から分けて書く。
- 保護された設定（`lefthook.yml`・`.agents/`・`.claude/`・`.codex/`・`package.json`・`.specdojo/` など）は変えない。変更が要る場合は、変更案を個票の対応結果に書き、報告の `handoff` にも書く。反映は利用者の承認のもと feature ブランチで行う。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。影響がなければ「なし」と書く（PJR-EPQ3）。
- `npm run check` と親の検証が通る。

## 4. 作業内容

| No  | 作業                                    | 担当 | 状態 | メモ                                                                                   |
| --- | --------------------------------------- | ---- | ---- | -------------------------------------------------------------------------------------- |
| No  | 作業                                    | 担当 | 状態 | メモ                                                                                   |
| --- | --------------------------------------- | ---- | ---- | -------------------------------------------------------------------------------------- |
| 1   | 定期の job の grade を grade run に移す | DEV  | done | `grade run` に終了コード 2・75 と種別ごとの比較を足し、2 つの job を移した             |
| 2   | 内部用のコマンドを help から外す        | DEV  | done | 対象の 13 コマンドと `agent` を `hidden` にした。登録は残し、呼び出しは変わらない      |
| 3   | 文書を更新する                          | DEV  | done | コマンドリファレンス・routine 運用ガイド・Job 定義標準を更新した                       |

## 5. 対応結果

### 5.1. 実施内容

- `src/grade/run.ts`・`command-run.ts`: 定期の job が使っていたスクリプトの振る舞いのうち、job が頼るものを `grade run` に足した。
  - 完了した文書と失敗した文書が混在すると終了コード 2、完了がなければ 1 で終える（`GradeRunIncompleteError`）。
  - agent が rate limit を返したら、その文書を未完了（失敗回数に数えない）のまま残して終了コード 75 で止め、残りの文書を stderr に出す。同じ `--run-id` で再開する。
  - `--reference-per-kind`（kata のみ、`--reference` と併用不可）で、各文書を同じ種別の `prj-overview-<種別>` 文書と比較する。スクリプトの kata の既定（PJR-BBPC）と同じ。
  - `graded:` の行に verdict・score・finding 件数を足した（job の analysis が分布を見るため）。
- `job-grade-kata.yaml`・`job-grade-deliverable.yaml`: `tools/grade/run-per-document.sh` をやめ、`grade run --by agy-expert-executor` を呼ぶ。選択条件ごとの `grade list` の和集合（条件なしは全件）を、kind と limit で絞って `logs/grade/jobs/<job_run_id>/selection.txt` に固定し、同じ Run の再試行は保存した選択で再開する。上限到達の文書（`incomplete` のときの `grade state --exhausted`）は `grade run` へ渡さず `retry exhausted:` として報告する。analysis の説明を `grade run` の出力に合わせ、command を変えたため idempotency key の版を上げた（kata `command-v10`、deliverable `command-v9`）。
- 内部用のコマンドを help から外した（commander の `hidden`）: `grade` の `plan`・`apply`・`translation-plan`・`localize`・`state`・`result`・`validate`、`agent` とその `launch`・`run`、`exec` の `trial`・`slots`・`scheduler`。登録は残すため、runner・job・orchestrator・exec-defaults の command template からの呼び出しは変わらない。
- 文書: [[specdojo:command-reference|コマンドリファレンス]] の grade・exec・agent で、内部用のコマンドを利用者向けの表から別の表・段落に分けた。`grade run` の終了コードと `--reference-per-kind` を書いた。routine 運用ガイドと Job 定義標準の記述例を `grade run` に合わせた。
- テスト: `tests/src/grade/run.test.ts` に終了コード 2・1・75（再開を含む）と `--reference-per-kind` のテスト、`tests/src/cli-verb-taxonomy.test.ts` に内部用のコマンドが登録されたまま help に出ないことのテストを足した。

### 5.2. 決めたこと

- `grade run` の既定の比較（リファレンスなし）は変えず、種別ごとの比較は `--reference-per-kind` で明示する形にした。review 前の grade（`ensureReviewGrade`）など、既存の `grade run` の呼び出しの評価条件を変えないため。
- 上限到達の文書は、`grade run` では失敗（`stage failure limit reached`）として扱う既存の挙動を保ち、job の側で `grade run` へ渡さず報告だけにした。スクリプトと同じく、上限到達の文書だけの Run を失敗にしないため。
- 複数の選択条件は和集合とした。`grade list` に複数の条件を渡すと積集合になるため、job で条件ごとに `grade list` を呼んで合わせる（スクリプトと precondition と同じ）。
- `agent` の 2 つのサブコマンドがどちらも内部用のため、`agent` そのものも top-level の一覧から外した。
- `grade run` は英語 finding の翻訳の段を持たない（PJR-YYDS で決定済み）。finding は日本語の正本で書かれるため、定期の job で翻訳が流れなくなる影響は、旧結果の英語の正本が再掲される場合に限られる。
- `tools/grade/run-per-document.sh` とそのテストは削除しない。本体の開発者向けの手動実行（全件再評価、3 段構成の比較）に残る。削除するかは別の項目で決める。
- 保護された設定の変更は不要だった。

### 5.3. 検証

- `npx vitest run tests/src/grade/run.test.ts`（23 件）、`tests/src/cli-verb-taxonomy.test.ts`・`tests/src/exec/scheduler-command.test.ts`・`tests/src/grade` が通った。
- 2 つの job の command を `renderJobTemplate` で展開し、stub の CLI で実行した。条件の和集合、kind の絞り込み、limit、上限到達の除外と報告、同じ Run の再試行で同じ選択を渡すこと、終了コード 2 の受け渡しを確かめた（空の `exhausted.txt` で `awk` の `NR == FNR` が誤判定する不具合を見つけ、`FILENAME == ARGV[1]` に直した）。
- `grade run --reference-per-kind --dry-run` が実リポジトリの rulebook 1 件で動き、`grade --help`・`exec --help`・top-level の help に内部用のコマンドが出ず、`grade state --exhausted` は従来どおり動くことを確かめた。
- 実 agent による定期の job の通し実行は sandbox で行えないため、次の定期実行の結果で確かめる。

### 5.4. CHANGELOG に書く事項

- Changed: `grade` の `plan`・`apply`・`translation-plan`・`localize`・`state`・`result`・`validate`、`agent launch`・`agent run`、`exec trial`・`exec slots`・`exec scheduler` を内部用として help の一覧から外した。コマンドは従来どおり実行できる（PJR-R7BQ）。
- Added: `grade run` は、完了と失敗の文書が混在すると終了コード 2、rate limit で 75 を返し、`--reference-per-kind` で kata の各文書を同じ種別の `prj-overview` 文書と比較できる（PJR-R7BQ）。
- Changed: 定期の job（`job-grade-kata`・`job-grade-deliverable`）は `tools/grade/run-per-document.sh` ではなく `grade run` で評価する（PJR-R7BQ）。

## 6. 関連ドキュメント

- [[prj-0001:pjr-c5af-command-inventory]]
