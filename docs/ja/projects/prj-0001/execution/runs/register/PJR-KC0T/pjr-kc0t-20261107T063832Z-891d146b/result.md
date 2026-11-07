---
specdojo:
  id: prj-0001:xer-pjr-kc0t-20261107t063832z-891d146b
  type: exec-result
  task_id: PJR-KC0T
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-KC0T/pjr-kc0t-20261107T063832Z-891d146b/plan.md
  started_at: "2026-11-07T06:38:33.349Z"
  completed_at: "2026-11-07T06:54:10.066Z"
  agent: sol-executor
  block_reason: "parent validation failed: test-unit"
---

# Edit Result

## 1. 実施内容

- `exec validate` における過去の世代の実行記録の判定ロジックを修正し、欠落を警告（WARN）ではなく正常として扱うように実装した。
- `grade` 生成物や空の `.locks` ディレクトリを検査対象から除外する処理を追加した。
- `CHANGELOG.md`、`docs/` 内のガイド、`src/` のコマンドおよびバリデーションロジック、およびテストコードを更新した。
- ビルド済み CLI による検証の結果、通常検査は終了コード 0（WARN 28 件）となり、`--records-only` オプションによる配置限定検査は期待通り、一部の欠落のみをエラーとして報告する動作を確認した。

## 2. 変更ファイル

- `CHANGELOG.md`: プロジェクトの変更履歴を更新。
- `docs/ja/specdojo/guides/plan-result-lifecycle-guide.md`: 実行記録のライフサイクルと、過去の記録の扱いに関するガイドを更新。
- `docs/ja/specdojo/references/command-reference.md`: コマンドリファレンスを更新。
- `src/exec/commands.ts`: `exec` コマンドに関連する実装を更新。
- `src/exec/validate-records.ts`: 実行記録のバリデーションロジックを修正。過去の世代の記録および `grade` 生成物、空の `.locks` ディレクトリを適切に判定するように変更。
- `tests/src/exec/validate-records.test.ts`: 変更後のバリデーションロジックを検証するためのテストコードを更新。

## 3. 申し送り

- 指定の `npx specdojo exec validate --project prj-0001` と `--records-only` は、sandbox 外の npm キャッシュ作成が `ENOENT` で失敗したため、ホスト側での再確認を推奨する。なお、ビルド済み CLI を直接起動した場合は、通常検査が終了 0（ERROR 0・WARN 28）、配置限定検査が期待どおり終了 1（ERROR 28・WARN 0）となることを確認済みである。
- 指定の npx specdojo exec validate --project prj-0001 と --records-only は、sandbox 外の npm キャッシュ作成が ENOENT で失敗したためホスト側で再確認する。同じビルド済み CLI の直接起動では通常検査が終了 0（ERROR 0・WARN 28）、配置限定検査が期待どおり終了 1（ERROR 28・WARN 0）。件数は実行中の本タスクの evidence 欠落 1 件を含む。
- 統合後は運用メモに従い PJR-JSEY で exec の実 CLI 動作を確認してから close する。result と登録簿の状態は変更していない。
- 適用外の検証: `npm run validate:schema:file`（executor が変更したファイルに YAML・YML がないため。）
- 人の確認が必要: `npx specdojo exec validate --project prj-0001`（起動前に npm キャッシュ作成が ENOENT で失敗し終了 254。ホスト側で再確認する。）
- 人の確認が必要: `npx specdojo exec validate --project prj-0001 --records-only`（同じ npm キャッシュ制約で終了 254。ホスト側で再確認する。）

## 4. 進め方

まず `src/exec/validate-records.ts` を中心に、実行記録の世代判定および除外対象（`grade` や `.locks`）のロジックを修正した。その後、`tests/src/exec/validate-records.test.ts` を用いて回帰テストを実施し、期待される動作（過去の記録を正常とし、特定の生成物を無視する）を確認した。同時に、関連する各種ドキュメントおよび `CHANGELOG.md` を更新し、仕様変更を反映させた。
