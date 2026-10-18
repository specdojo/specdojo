---
specdojo:
  id: prj-0001:pjr-s9qf-result-approach-section-for-register
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-10-17T12:18:01Z"
  due_on: null
---

# PJR-S9QF approach のない result の第 4 章を「進め方」に改める

## 1. 概要

approach のない実行（register の todo など）の result では、見出しを「4. 進め方」にし、記入の指示をどう進めたか・根拠にした文書や規約に変える。approach のある実行は今のまま

## 2. 完了条件

- approach のない実行（register の todo・issue など）の result の雛形で、見出しを「4. 進め方」にし、記入の指示を「どう進めたか」と「根拠にした文書や規約」に変える。
- approach のある実行（schedule のタスク、approach を持つ個票）の result は、今の「4. 進め方と実践の型の適用」のままにする。
- どちらの見出しになるかを、生成される result で単体テストで確かめる。
- reporter の指示や result の検証（見出しの検査など）が見出しの名前に依存している場合は、両方の見出しを受け付ける。
- 既存の result（履歴）は書き換えない。
- 本件は plan の生成を変えない。result の雛形と result の生成だけを変える。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG に記載する場合は、未公開の版の節（`## [0.4.0] - 未定`）に書く。公開済みの版の節は変えない。

## 3. 作業内容

| No  | 作業                                                      | 担当 | 状態 | メモ |
| --- | --------------------------------------------------------- | ---- | ---- | ---- |
| 1   | approach のない実行の result の見出しと記入の指示を改める | DEV  | done | -    |

## 4. 対応結果

- edit result テンプレート `docs/ja/specdojo/exec-templates/xer-template.md` の第4章を `_APPROACH_SECTION_` プレースホルダへ変更した。
- `src/exec/results.ts` の `scaffoldResult` において、`approach` のある実行では「4. 進め方と実践の型の適用」と実践の型適用に関する記入指示を展開し、`approach` のない実行では見出しを「4. 進め方」、記入指示を「_TODO_: どう進めたか、根拠にした文書や規約を記入する。」を展開するようにした（古いテンプレートへのフォールバック置換も保持）。
- `renderReporterResult` および `renderEditReporterBody` においても、`approach` の有無に応じて第4章の見出しを「## 4. 進め方と実践の型の適用」または「## 4. 進め方」へ切り替えるようにした。
- 単体テスト `tests/src/exec/results.test.ts` に、`scaffoldResult` と `renderReporterResult` それぞれで `approach` の有無に応じた見出しおよび指示内容の生成を検証するテストケースを追加した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-h06f-register-approach-plan-generation]]
