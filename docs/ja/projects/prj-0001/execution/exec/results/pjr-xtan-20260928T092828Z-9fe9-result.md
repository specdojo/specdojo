---
specdojo:
  id: prj-0001:xer-pjr-xtan-20260928t092828z-9fe9
  type: exec-result
  task_id: PJR-XTAN
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-xtan-20260928T092828Z-9fe9-plan.md
  started_at: "2026-09-28T09:28:28.447Z"
  completed_at: "2026-09-28T09:36:45.374Z"
  agent: claude-expert-executor
---

# Edit Result

## 1. 実施内容

- PJR-XTAN の方針転換（`grade` と review は判定対象が異なるため、同じ対象を判定する語彙だけを統一する）に対応し、オプションBを採用した。
- review タスク完了判定の語彙を統一し、`verdict_definitions` とスキーマ enum を review の `verdict` と同じ6値にし、`src/review-types.ts` の `REVIEW_VERDICTS` を単一のソースとした。旧値 `revise` は `incomplete` にマップされる。
- grade ルーブリックの `review_verdict` マッピングは complete / complete-with-findings / incomplete へ retarget したが、grade 自体の語彙・rubric id・採点ロジックは変更していない。
- `review-guide.md` に review 入力ルールの節を追加し、viewpoints ローダーと reporter の両方で旧値使用時に置換先を明示するエラーを出すようにした。
- 未作成の `br-review-verdict` カタログエントリの概要を、確定した語彙統一方針に合わせて書き直した。
- 個票（`pjr-xtan-unify-verdict-vocabulary.md`）の作業内容・対応結果セクションを実施内容で更新し、単体テストを追加・調整した。

## 2. 変更ファイル

- `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-business-model-br.yaml`: 未作成の `br-review-verdict` カタログエントリの overview を、統一後の語彙方針に合わせて書き直した。
- `docs/ja/projects/prj-0001/controls/project-register/pjr-xtan-unify-verdict-vocabulary.md`: 個票の作業内容・対応結果セクションを、今回の対応内容（オプションB採用）で更新した。
- `docs/ja/specdojo/defaults/pm-review-viewpoints.yaml`: `verdict_definitions` を review の `verdict` と同じ6値に統一した。
- `docs/ja/specdojo/guides/review-guide.md`: review 入力ルールの節を追加した。
- `docs/specdojo/schemas/v1/pm-review-viewpoints.schema.yaml`: `verdict_definitions` の enum を統一後の6値に合わせて更新した。
- `src/exec-reporter.ts`: 旧語彙使用時に置換先を明示するエラーを出すよう変更した。
- `src/review-plan.ts`: 統一後の語彙・マッピングに対応するロジックを追加した。
- `src/review-types.ts`: `REVIEW_VERDICTS` を単一のソースとして追加し、review 判定語彙の正本にした。
- `tests/src/exec-reporter.test.ts`: 旧語彙エラーメッセージの変更に合わせてテストを更新した。
- `tests/src/grade.test.ts`: `review_verdict` マッピング変更に合わせてテストを更新した。
- `tests/src/review-plan.test.ts`: 統一後の語彙・マッピングを検証するテストを追加した。

## 3. 申し送り

- `br-review-verdict` カタログエントリ本体は未作成のままで、今回は overview の書き直しのみ行った。作成要否・スコープは次のアクションとして未確定。
- `grade` ルーブリックの `review_verdict` マッピングは retarget したが、`grade` 語彙・rubric id・採点ロジック自体は意図的に変更していない。影響範囲の再確認が必要な場合は個別に判断すること。
- 親 runner の `test-unit` / `test-integration` / `validate-schema` / `typecheck` はいずれも `passed` で完了している。

## 4. 進め方と実践の型の適用

`docs/ja/projects/prj-0001/controls/project-register/pjr-2zvs-grade-review-integration.md` の最終結論（`grade` と review は判定対象が異なる）に基づき、4語彙のうち review タスク完了判定に関わる `verdict_definitions` とスキーマ enum のみを review の `verdict`（6値）へ統一するオプションBを採用した。`grade` の語彙・rubric・採点は対象外として維持し、`grade` から review への橋渡しである `review_verdict` マッピングのみ新しい6値へ retarget した。単一のソースとして `src/review-types.ts` の `REVIEW_VERDICTS` を新設し、viewpoints ローダーと reporter の両方で旧値検出時に置換先を示すエラーを出すようにした。
