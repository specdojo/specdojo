---
specdojo:
  id: prj-0001:xer-pjr-jtjf-20261024t095459z-8bfbe3d9
  type: exec-result
  task_id: PJR-JTJF
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-jtjf-20261024T095459Z-8bfbe3d9-plan.md
  started_at: "2026-10-24T09:54:59.311Z"
  completed_at: "2026-10-24T10:08:39.394Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- src 内の実行時 import がすべて `dependencies` または `peerDependencies` に含まれていることを検証するツールを実装しました。
- 作成した検証ツールに対する単体テストを追加しました。
- 開発工程における貢献ルールを更新しました。
- 個票を更新し、対応内容を記録しました。

## 2. 変更ファイル

- `CONTRIBUTING.md`: 開発プロセスにおける重要なチェック事項として、`src` 内の import が適切に `dependencies` に含まれていることを確認するための手段を追加しました。
- `tests/tools/check-src-imports-in-dependencies.test.ts`: 新しく作成した `check-src-imports-in-dependencies.mjs` の動作を検証するためのテストケースを追加しました。
- `tools/check-src-imports-in-dependencies.d.mts`: インポート検査ツールの型定義ファイルを作成しました。
- `tools/check-src-imports-in-dependencies.mjs`: `src` ディレクトリ内のファイルを走査し、実行時の `import` が `package.json` の `dependencies` または `peerDependencies` に含まれているかをチェックするスクリプトを実装しました。

## 3. 申し送り

- `npm run check` を実行するための設定（`check:src-imports` スクリプトの追加など）を `package.json` に対して行う必要があります。これは `scp-SEC-002` による保護設定のため、対話型オーケストレーターによる作業が必要です。
- 人の確認が必要: `npm run check`（scp-SEC-002 により executor は package.json を変更できない。対話型オーケストレーターが check:src-imports script と check からの呼び出しを追加した後に実行する。）

## 4. 進め方

まず、`src` 内のパッケージ参照が `dependencies` に漏れていないかを自動検知するスクリプト `tools/check-src-imports-in-dependencies.mjs` を作成しました。次に、このツールの信頼性を確保するために単体テストを実装しました。最後に、開発者がこのチェックを意識できるように `CONTRIBUTING.md` を更新し、プロジェクトの個票 `docs/ja/projects/prj-0001/controls/project-register/pjr-jtjf-src-imports-in-dependencies.md` に作業結果を記録しました。検証の結果、現在の `src` は正しく依存関係が定義されていることが確認されています。
