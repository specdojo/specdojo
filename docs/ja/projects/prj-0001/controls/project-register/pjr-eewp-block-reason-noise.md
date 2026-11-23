---
specdojo:
  id: prj-0001:pjr-eewp-block-reason-noise
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  difficulty: easy
  owner: DEV
  registered_at: "2026-11-23T22:26:08Z"
  due_on: "2026-11-30"
  commit_type: fix
  commit_scope: exec
---

# PJR-EEWP 止まった理由の要約の先頭に、テストの出力の関係ない行が出て原因を読み違えやすい

## 1. 課題内容

- template の段の 7 件の block の理由が「integration failed: project: git commit failed: test: error: unknown option '--reserve'; FAIL |unit| tests/src/docs/yaml-tables.test.ts ...」だった。
- `unknown option '--reserve'` は、CLI の引数の誤りを確かめるテストが出す通常の出力で、失敗の原因ではなかった。原因は後ろの FAIL の行（fixture の不一致）だった。

## 2. 入力

- v0.10.0 に入れる（利用者の指定、2026-11-24）
- 2026-11-23〜24 の kata の一括実行（第 4〜6 波）で詰まった所から起票した

## 3. 影響範囲

- 止まった理由を読み違え、原因の調べ直しに時間がかかる。

## 4. 対応方針

- hook やテストの失敗の要約では、FAIL の行と失敗したテストの名前を先に出す。
- 単体テストで、今回の出力から作った要約が FAIL の行から始まることを確かめる。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証の `test-integration` を通す。

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- 関連: PJR-DF5Z（同じ 7 件）、PJR-40EE。
