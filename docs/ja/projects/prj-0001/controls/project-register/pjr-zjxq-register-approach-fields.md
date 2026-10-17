---
specdojo:
  id: prj-0001:pjr-zjxq-register-approach-fields
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-10-17T12:17:03Z"
  due_on: null
---

# PJR-ZJXQ 個票に approach と対象を書けるようにする

## 1. 概要

個票の frontmatter と schema に approach と targets（成果物の local_id か kata の id）を加え、register add --approach --target で指定でき、組み合わせの誤りを起票の時点で止める。PJR-H72A の決定に基づく

## 2. 完了条件

[[prj-0001:pjr-h72a-register-approach-execution]] の決定の 2・7 に基づく 1 件目。個票で approach と対象を指定できるようにし、組み合わせの誤りを起票の時点で止める。plan の生成への反映は [[prj-0001:pjr-h06f-register-approach-plan-generation]] で行う。

2026-10-17 時点で、個票の frontmatter の schema（`docs/specdojo/schemas/v1/register-item-frontmatter.schema.yaml`）には、対象の文書の doc id の一覧 `targets` が既にある。対象は既存の `targets` に doc id で書き、新しく加えるのは `approach` だけとする（決定の「成果物の local_id か kata の id」は、doc id で表す）。

条件:

- 個票の frontmatter の schema に `approach` を加える。値は `src/shared/agent-types.ts` の `Approach` と同じ集合とし、schema と型の値の一致をテストで確かめる。
- `register add --approach <approach> --target <doc-id>`（`--target` は複数を指定できる）で、個票に `approach` と `targets` を書ける。`register update` でも変更できる。
- `approach` を書いた個票では、`targets` を 1 件だけ必須とする（schedule のタスクと同じく、1 件の成果物か 1 件の kata を扱う）。
- 組み合わせを、起票と更新の時点で確かめ、誤りなら理由を出して止める。
  - 成果物を作る・直す approach（`fully-guided`・`recipe-guided`・`freeform`・`bootstrap`・`retrofit`・`cross-deliverable-dedup`・`finalize`・`bootstrap-finalize`）は、成果物カタログ（DCT）にある成果物の doc id を対象にする。
  - kata を直す approach（`rulebook-maintenance`・`recipe-maintenance`・`sample-maintenance`・`template-maintenance`）は、それぞれ rulebook・recipe・sample・template の doc id を対象にする（例: `rulebook-maintenance` は `specdojo:pjr-rulebook`）。
  - 対象の doc id が文書の索引で解決できない場合も止める。
- `register build` の一覧（`pjr-index.md`）は変えない（approach を列に加えない）。
- `exec run --register` は、本件では `approach` を読まない（後続の PJR-H06F で扱う）。`approach` を書いた個票を実行しても、従来の register の plan で動くことを確かめる。
- register の個票の規則（`docs/ja/specdojo/rulebooks/pjr-rulebook.md`）と、`docs/ja/specdojo/references/command-reference.md` の `register add`・`register update` に、`approach` と `--target` を書く。
- CHANGELOG に記載する場合は、未公開の版の節（`## [0.4.0] - 未定`）に書く。公開済みの版の節は変えない。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。

## 3. 作業内容

| No  | 作業                                                          | 担当 | 状態 | メモ             |
| --- | ------------------------------------------------------------- | ---- | ---- | ---------------- |
| 1   | schema に `approach` を加える                                 | DEV  | open | 型と値を揃える   |
| 2   | `register add`・`update` に `--approach`・`--target` を加える | DEV  | open | -                |
| 3   | 組み合わせの検証を入れる                                      | DEV  | open | 起票と更新の時点 |
| 4   | 規則とコマンドリファレンスを更新する                          | DEV  | open | -                |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-h72a-register-approach-execution]]: 決定。
- [[prj-0001:pjr-h06f-register-approach-plan-generation]]: plan の生成への反映。
