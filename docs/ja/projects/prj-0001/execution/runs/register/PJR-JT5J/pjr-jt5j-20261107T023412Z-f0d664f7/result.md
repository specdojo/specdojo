---
specdojo:
  id: prj-0001:xer-pjr-jt5j-20261107t023412z-f0d664f7
  type: exec-result
  task_id: PJR-JT5J
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-JT5J/pjr-jt5j-20261107T023412Z-f0d664f7/plan.md
  started_at: "2026-11-07T02:34:13.547Z"
  completed_at: "2026-11-07T02:52:53.046Z"
  agent: sol-executor
  block_reason: "parent validation failed: test-integration"
---

# Edit Result

## 1. 実施内容

- 実行記録の配置・必須ファイル欠落・Git 除外設定を検査する処理を実装し、`--records-only` オプションを追加した。
- ガイドの構成図と実装の照合を行うための単体テストおよび、配置検査の回帰テストを追加した。
- 各種ガイド、リファレンス、および `CHANGELOG.md` を更新した。

## 2. 変更ファイル

- `CHANGELOG.md`: 変更履歴を更新した。
- `docs/ja/specdojo/guides/docs-structure-guide.md`: ドキュメントの構成に関する情報を更新した。
- `docs/ja/specdojo/guides/plan-result-lifecycle-guide.md`: プランと結果のライフサイクルに関する情報を更新した。
- `docs/ja/specdojo/references/command-reference.md`: コマンドのリファレンスを更新した。
- `src/exec/commands.ts`: 実行コマンドの定義を更新した。
- `src/shared/run-records.ts`: 実行記録の管理ロジックを更新した。
- `tests/src/exec/run-records.test.ts`: 実行記録に関する単体テストを更新した。
- `src/exec/validate-records.ts`: 実行記録の配置を検査する新しいモジュールを追加した。
- `tests/src/exec/validate-records.test.ts`: 配置検査に関するテストを追加した。

## 3. 申し送り

- 保護設定変更案: `.github/workflows/check-run-record-layout.yml` の全文を個票の対応結果に記載した。`push`・`pull_request`・`workflow_dispatch` で `checkout@v5`、`setup-node@v5`（Node 24）、`npm ci`、`node --import tsx src/specdojo.ts exec validate --project prj-0001 --records-only`、配置・ガイド照合の単体テストを実行する。利用者の承認後に反映する。
- 実データでは499ディレクトリに欠落645件（`plan` 141・`result` 138・`evidence` 366）を検出した。配置外ファイルと `lock` の違反は0件。既存履歴は変更していない。現状でCI案を導入すると失敗するため、反映前に欠落履歴の扱いを判断する必要がある。
- 判断: `agent run` は `plan`・`result`・`evidence` を必須とし、`execution: human` を明記した `result` は単独で正常とする。`checkpoint` とログは任意。独立形式の `grade`・`job` 状態・`exec event`・`trials`・規約・生成物・`routine` 失敗記録は除外し、欠落履歴の黙認リストは設けない。判断理由は個票に記載した。
- `routine lock` は PJR-PZBP で端末側へ移行済み。`assessments` は PDR-JFTC で機能・データとも廃止済みのため移動せず、現行の `schedule`/`generated` にガイドを合わせた。根拠は個票に記載した。
- `lock` の Git 確認は sandbox 内で `stdin` の応答が完了しなかったため、確認処理に10秒の制限を設けた。正常・異常な `lock` の回帰テストは親 runner の単体テストで確認する。
- 統合後は運用メモに従い、PJR-JSEY の対象へ PJR-JT5J を追加し、実 `agent` CLI で動作確認してから `close` する。
- 保護設定変更案: `.github/workflows/check-run-record-layout.yml` の全文を個票の対応結果に記載した。push・`pull_request`・`workflow_dispatch` で checkout@v5、setup-node@v5（Node 24）、npm ci、`node --import tsx src/specdojo.ts exec validate --project prj-0001 --records-only`、配置・ガイド照合の単体テストを実行する。利用者の承認後に反映する。
- 実データでは499ディレクトリに欠落645件（plan 141・result 138・evidence 366）を検出した。配置外ファイルと lock の違反は0件。既存履歴は変更していない。現状でCI案を導入すると失敗するため、反映前に欠落履歴の扱いを判断する必要がある。
- 判断: agent run は plan・result・evidence を必須とし、`execution: human` を明記した result は単独で正常とする。checkpoint とログは任意。独立形式の grade・job状態・exec event・trials・規約・生成物・routine失敗記録は除外し、欠落履歴の黙認リストは設けない。判断理由は個票に記載した。
- routine lock は PJR-PZBP で端末側へ移行済み。assessments は PJR-JFTC で機能・データとも廃止済みのため移動せず、現行の schedule/generated にガイドを合わせた。根拠を個票に記載した。
- lock の Git 確認は sandbox 内で stdin の応答が完了しなかったため、確認処理に10秒の制限を設けた。正常・異常な lock の回帰テストは親 runner の単体テストで確認する。
- 統合後は運用メモに従い、PJR-JSEY の対象へ PJR-JT5J を追加し、実 agent CLI で動作確認してから close する。
- 適用外の検証: `npm run validate:schema:file`（executor自身が変更したYAMLファイルはない。実行イベントの変更はrunner管理対象。）

## 4. 進め方

実行記録の配置基準をコードとして実装するために、`src/exec/validate-records.ts` を新規作成し、既存の `src/exec/commands.ts` に組み込んだ。また、設計図（ガイド）との整合性を担保するためのテストコードを `tests/src/exec/validate-records.test.ts` に用意した。さらに、実データにおける実行記録の欠落状況を確認し、既存のプロジェクトに対する影響を分析した。
