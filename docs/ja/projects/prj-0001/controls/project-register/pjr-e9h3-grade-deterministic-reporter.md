---
specdojo:
  id: prj-0001:pjr-e9h3-grade-deterministic-reporter
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-10-04T00:28:36Z"
  due_on: null
  completed_at: "2026-10-04T04:46:44Z"
  block_reason: "agent exited with non-zero code: runner validation failed: `validate-schema` (exit 1), `typecheck` (error TS2532 in `tests/src/grade.test.ts`), and `test-unit` (4 tests failed in `tests/tools/grade-pe…"
  conclusion: grade の reporter の既定を executor の marker の機械変換（machine）にした。grade apply は --analysis-from だけで反映でき、拒否時は executor を1回再実行する。実際の grade 1 件で LLM の reporter を起動せずに記録できることを確認した
---

# PJR-E9H3 grade の reporter を LLM から executor の marker の機械変換に置き換える

## 1. 概要

grade の reporter は executor の [VIEWPOINT] / [DONE_CRITERIA] marker を GradeSubmission JSON へ一字一句写すだけだが、LLM が担うため書き写しの誤り（例: 三箇所→三箇会）、JSON の構文破損、根拠のない JSON の生成が起き、時間もかかる。grade apply は既に executor の分析を parse して忠実性を検証しているため、同じ parse から GradeSubmission を機械的に生成すれば、reporter 起因の失敗をなくし、executor の選択肢も広げられる

## 2. 完了条件

- executor の出力（`[VIEWPOINT]` / `[END VIEWPOINT]` / `LEVEL` / `FINDING`、成果物の場合は `[DONE_CRITERIA]`）から GradeSubmission を生成する処理を CLI に持ち、`grade apply` の忠実性検証と同じ parse 結果を使う。LLM の reporter を通さずに kata と成果物の grade を記録できる。
- marker の欠落・重複・level と severity の矛盾など、executor の出力が契約を満たさない場合は、現在の忠実性検証と同じ条件で拒否し、理由を記録する。拒否時の再試行は executor の再実行とする。
- 形式の軽微な揺れ（marker の太字囲み、`FINDING` が行頭にない等）を正規化して受理するかを判断し、採否と理由を記録する。受理する場合も、message の内容は変更しない。
- `tools/grade/run-per-document.sh`、job 定義、`exec-defaults.yaml` など reporter を前提にした経路を、機械変換を既定とする形へ更新する。LLM の reporter を残す場合は、その用途を明記する。
- grade の plan（reporter plan を含む）、運用ガイド、コマンドリファレンスを更新する。
- unit test で、正常な出力、marker 欠落、level と severity の矛盾、done_criteria を含む成果物の各ケースを検証する。
- `npm run check` が通る。

## 3. 作業内容

| No  | 作業                                                   | 担当 | 状態 | メモ                                                           |
| --- | ------------------------------------------------------ | ---- | ---- | -------------------------------------------------------------- |
| 1   | 機械変換の設計（parse の共有、拒否条件、正規化の範囲） | DEV  | done | 忠実性検証と機械変換が `parseGradeExecutorAnalysis` を共有する |
| 2   | CLI と grade pipeline への実装                         | DEV  | done | reporter の既定を機械変換（`machine`）へ移した                 |
| 3   | 文書とテストの更新                                     | DEV  | done | コマンドリファレンス、運用ガイド、plan 文言、unit test         |

## 4. 対応結果

前回の試行（runner の検証で block）の変更は commit されておらず、作業ツリーに残っていなかった。本節の旧記述はその試行の内容であり、実装と一致しないため次の内容に置き換えた。前回の試行が変更した schedule（`sch-*.yaml`）の reporter stage は exec pipeline 用で grade とは無関係なため、今回は変更していない。

- 機械変換: `src/grade.ts` に `buildGradeSubmissionFromAnalysis` を追加した。`validateGradeReporterFidelity` と共通の内部関数で executor の出力を `parseGradeExecutorAnalysis` で解析し、GradeSubmission を組み立てて `validateGradeSubmission` にかける。忠実性検証と同じ parse と検証の結果を使う。
- CLI: `grade apply` の `--from` を任意にした。`--analysis-from` だけを指定すると機械変換で反映し、`--from` を併用すると従来どおり LLM reporter の JSON を忠実性照合する。生成した GradeSubmission は `--submission-out` で保存できる。どちらも指定しない場合は入力エラーにする。
- 拒否条件: marker の欠落・入れ子・重複、`LEVEL` の欠落・重複・書式不正、viewpoint の欠落・重複・非適用、severity による level 上限の超過、level 3 以下で finding なし、done_criteria の過不足・不足内容のない `unsatisfied` を、現在の忠実性検証と同じ条件で拒否する。理由は `$analysis` で始まるパスとともにエラーへ出す。拒否時の再試行は executor の再実行とする。
- 正規化の採否: 受理する。対象は行頭の空白、ブロッククオート `>`、リスト記号（`-` / `*` / `+` と空白）、marker・`LEVEL`・`FINDING`・`DC-NNN` の見出し部分を囲む `**` に限る。判定内容は同じで、拒否して executor を再実行する費用に見合わないためである。message と reason の本文は変更しない（`**` などの装飾もそのまま記録する）。文中に埋もれた `FINDING` は申告とみなさない。根拠の説明に現れた語を申告と誤認するためである。
- pipeline: `tools/grade/run-per-document.sh` の reporter の既定を全段で `machine` にした。`machine` の段は reporter agent を起動せず、`grade apply --analysis-from --submission-out` で反映する。拒否時は拒否された応答（`executor-output.rejected.txt`）と理由（`apply-rejection.log`）を残し、executor を1回だけ再実行して変換し直す。`--stage-<n>-reporter <nickname>` を指定した段だけ LLM reporter を起動する。LLM reporter は書き写しの精度を比較する用途に限る。Run state の構成の版を `pipeline-v5` に上げた。
- job 定義・`exec-defaults.yaml`: `job-grade-kata` と `job-grade-deliverable` は script の既定に従うため、起動コマンドは変更せず、analysis の失敗切り分けの記述だけを機械変換の拒否へ更新した。`exec-defaults.yaml` には grade の reporter の設定がないため、変更していない。job の `analysis.agent`（`gemma-reporter`）は Job の結果判断用であり、grade の reporter ではないため残した。
- plan: executor plan の説明と完了手順を、`grade apply` が marker を機械的に読み取る前提へ更新した。reporter plan には、既定の pipeline では使わず比較用に限ることを明記した。
- 文書: `docs/ja/specdojo/references/command-reference.md` と `docs/ja/specdojo/guides/routine-operation-guide.md` を更新した。
- テスト: `tests/src/grade.test.ts` に正常な出力、marker の装飾の正規化、文中の `FINDING` の非受理、viewpoint marker の欠落、`END VIEWPOINT` の欠落、level と severity の矛盾、done_criteria を含む成果物の変換と条件の欠落のケースを追加した。`tests/tools/grade-per-document.test.ts` に、機械変換の既定経路、拒否時の executor 再実行、LLM reporter の明示指定のケースを追加した。
- 未確認: `npm run check` の全体の結果は runner の検証で確認する。

確認（2026-10-04）: `tools/grade/run-per-document.sh --stages 1 --stage-1-executor agy-expert-executor` で `trc-requirements-to-tests-rulebook` を実際に評価した。reporter は既定の `machine` で、LLM の reporter は起動せず（reporter plan の書き出しだけ）、161 秒で `needs-work` 69（finding 15）が grade-rubric-v2 で記録された。

## 5. 関連ドキュメント

- [[prj-0001:pjr-vqb5-agent-grade-comparison]]: 2026-10-03〜04 の比較で、reporter の書き写しの誤り・JSON 構文破損・根拠のない JSON の生成を観測した。
- [[prj-0001:pjr-ankr-grade-executor-reporter]]: executor と reporter を分けた経緯。
- [[prj-0001:pjr-akj4-agent-json-response]]: agent の JSON 応答の抽出。
