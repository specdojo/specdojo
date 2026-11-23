---
specdojo:
  id: prj-0001:pjr-ja3m-tests-live-kata
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-23T22:24:54Z"
  due_on: "2026-11-30"
  commit_type: fix
  commit_scope: test
---

# PJR-JA3M テストが実物の kata の sample の中身に頼っており、型の手直しのたびに壊れる

## 1. 課題内容

- `tests/src/docs/yaml-tables.test.ts` が実物の sample から表示のページを作って fixture と比べるため、一括実行で sample が変わるたびに落ちた。`specdojo--dct-sample.md.snap` は 2026-11-24 に 2 回、`specdojo--pm-members-sample.md.snap`、`prj-0001--bdd-register-entry.md.snap`・`prj-0001--ifx-file-agent-evidence.md.snap` も作り直した。
- `tests/src/grade/grade.test.ts` の「resolves declared and reverse-linked Kata references」が `opr-batch-sample.md` の rulebook の宣言を前提にしており、executor が宣言を `opd-rulebook` から正しい `opr-rulebook` に直すと落ちた。
- 落ちたテストは commit の hook と親の検証の `test-docs` で、関係のないタスクの統合も止めた。

## 2. 入力

- v0.10.0 に入れる（利用者の指定、2026-11-24）
- 2026-11-23〜24 の kata の一括実行（第 4〜6 波）で詰まった所から起票した

## 3. 影響範囲

- 型を整える一括実行のたびに、テストの作り直しと、止まったタスクの再開が要る。

## 4. 対応方針

- 上の 2 つのテストを、`tests/fixtures/` に置いた固定の入力で検証する形に変える。実物の sample を読むテストがほかにあれば洗い出し、同じに直すか、残す理由を個票の対応結果に書く。
- `docs/ja/specdojo/samples/` の sample を変えても単体テストが落ちないことを、sample を 1 つ書き換えて確かめる。
- 実物の sample と生成の処理が合っていることを確かめたい場合は、fixture の比較ではなく、生成できること（例外が出ないこと）だけを確かめる。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証の `test-integration` を通す。

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- 関連: PJR-1RJP（rulebook の grade が YAML の sample の古い表示のページを読む）。
