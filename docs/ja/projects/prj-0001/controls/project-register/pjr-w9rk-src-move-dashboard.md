---
specdojo:
  id: prj-0001:pjr-w9rk-src-move-dashboard
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-10-15T22:12:01Z"
  due_on: null
---

# PJR-W9RK dashboard と timeline を src/dashboard へ移す

## 1. 概要

最初の移動として、codemod で dashboard と timeline を src/dashboard/ へ移し、手順と検証を確かめる。 PJR-V23P の決定に基づく

## 2. 完了条件

[[prj-0001:pjr-v23p-src-subdirectory-layout]] の決定に基づく最初の移動。[[prj-0001:pjr-g5s2-src-move-codemod]] の codemod（`tools/src-move-codemod.mjs`）を使い、手順と検証を確かめる。

移す対応表（2026-10-16 に利用者が承認した名前の付け方による）:

| 移す前                             | 移した後                                     |
| ---------------------------------- | -------------------------------------------- |
| `src/dashboard.ts`                 | `src/dashboard/dashboard.ts`                 |
| `src/dashboard-exec-records.ts`    | `src/dashboard/exec-records.ts`              |
| `src/dashboard-routines.ts`        | `src/dashboard/routines.ts`                  |
| `src/dashboard-shared.ts`          | `src/dashboard/shared.ts`                    |
| `src/dashboard-timeline.ts`        | `src/dashboard/dashboard-timeline.ts`        |
| `src/timeline.ts`                  | `src/dashboard/timeline.ts`                  |
| `src/timeline-build.ts`            | `src/dashboard/timeline-build.ts`            |
| `tests/src/dashboard.test.ts`      | `tests/src/dashboard/dashboard.test.ts`      |
| `tests/src/timeline-build.test.ts` | `tests/src/dashboard/timeline-build.test.ts` |

名前の付け方: ディレクトリと重なる接頭辞を外す。ディレクトリと同じ名前のファイル（`dashboard.ts`）は名前をそのまま残す。接頭辞を外すと別のファイルと同じ名前になる場合（`dashboard-timeline.ts` と `timeline.ts`）は、接頭辞を外さない。後続の移動もこの付け方に揃える。

条件:

- codemod の検出の一覧から、書き換えない履歴のファイル（`docs/ja/projects/**/controls/project-register/**`・`docs/ja/projects/**/execution/**`・`logs/**`）を除くよう、`tools/src-move-codemod.mjs` を直す。単体テストを合わせて直す。
- codemod で上の対応表のとおりに移す。移動と import の書き換えは codemod に任せ、手で書き換えない。codemod が報告した残り（文字列のパスなど）だけを手で直し、直した箇所を result に書く。
- 移す前と後で、`dashboard`・`dashboard build`・`timeline`（あれば）の `--help` の出力が一致する。前後の出力を `tmp/` に保存して比べ、比べたコマンドと差分がないことを result に記録する。
- `npm run build` の後に、`dist/` に移す前の古い出力（`dist/dashboard.js` など）が残らない。残る場合は、build が `dist/` を作り直すよう直すか、手順を result に書く。
- 設計書とガイドにある移したファイルの `src/...` のパスを直す。履歴のファイルは直さない。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。

## 3. 作業内容

| No  | 作業                                                      | 担当 | 状態 | メモ             |
| --- | --------------------------------------------------------- | ---- | ---- | ---------------- |
| 1   | codemod の検出から履歴のファイルを除く                    | DEV  | done | テストも更新済み |
| 2   | codemod で対応表のとおりに移す                            | DEV  | done | 手作業の移動なし |
| 3   | `--help` を比べ、`dist/` の古い出力と文書のパスを確かめる | DEV  | done | 差分・残存なし   |

## 4. 対応結果

- `tools/src-move-codemod.mjs` の検出対象から、`docs/ja/projects/**/controls/project-register/**`、`docs/ja/projects/**/execution/**`、`logs/**` を除外し、統合テストへ各除外ケースを追加した。
- codemod に対応表を渡し、実装 7 ファイルを `src/dashboard/`、テスト 2 ファイルを `tests/src/dashboard/` へ移した。相対 import の書き換えも codemod が行い、検出後に手で修正した実装パスはない。
- 設計書 `docs/ja/product/040-system-design/sysd-index.md` とカタログ `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-data-flow.yaml` の実装パスを更新した。履歴ファイル内の旧パスは変更していない。
- 移動前後に `node --import tsx src/specdojo.ts dashboard --help`、`node --import tsx src/specdojo.ts dashboard build --help`、`node --import tsx src/specdojo.ts timeline --help` を実行して比較し、3 件とも差分がないことを確認した。
- `npm run build` が成功し、`dist/dashboard/` に新しい出力が生成された。移動前の `dist/dashboard.js`、`dist/dashboard-*.js`、`dist/timeline.js`、`dist/timeline-build.js` は残っていない。
- 残課題はない。親 runner が lint・typecheck・unit test・integration test・schema 検証を実行する。

## 5. 関連ドキュメント

- [[prj-0001:pjr-v23p-src-subdirectory-layout]]: 決定。
- [[prj-0001:pjr-g5s2-src-move-codemod]]: 使う codemod。
