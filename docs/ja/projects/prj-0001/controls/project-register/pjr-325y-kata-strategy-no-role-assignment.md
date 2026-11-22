---
specdojo:
  id: prj-0001:pjr-325y-kata-strategy-no-role-assignment
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-21T08:23:42Z"
  block_reason: "integrate failed: project: git commit failed: test: error: unknown option '--reserve'; FAIL  /unit/ tests/src/docs/yaml-tables.test.ts > typed YAML display pages > renders tables and the entire folded…"
  derived_from:
    - PJR-76N9
---

# PJR-325Y 型の整備の strategy に、文書に役割の割り当てを書かない決まりを足す

## 1. 概要

第 3〜6 波と kata-slim-3 の strategy の段の説明に PJR-76N9 の決まりを足し、track を作り直す。sample と rulebook の作成標準にも足す

## 2. 入力

- PJR-76N9 の決定（2026-11-21、indie）: 成果物と sample の本文に、文書の役割の割り当てと承認の進み具合を書かない。rulebook の「誰がどの利用場面で何を判断するか」は「どの利用場面で何を判断するための文書か」に直す。文書の中身として役割が要る型（RACI・体制など）は対象外
- 第 3 波（kata-wave-3）は 2026-11-21 から tsp-index で試しを流している。ほかの波の strategy はまだ無い
- 2026-11-21、直した cnd-specdojo を grade すると pass 93 だったが、minor の指摘 7 件の多くが、概要に作成担当・確認者・最終判断者の役割を書く、Person の表に「判断・確認の責務」の列を足す、ready の前の確認と PO の承認記録を書く、を求めた。型の template（cnd-template の列と「検証・承認前の確認」の節）とカタログの `done_criteria` が役割と承認の記述を求めているため。この todo の範囲に、template・`done_criteria`・grade の観点を含める

## 3. 完了条件

- 範囲は、第 3 波の strategy（`sch-strategy-kata-wave-3.yaml`）と、sample と rulebook の作成標準と、型の template・カタログの `done_criteria`・grade の観点とする。第 4〜6 波の strategy はまだ無いため扱わない（利用者の決定、2026-11-22、indie）。
- `sample-authoring-standard` と `rulebook-authoring-standard` に、PJR-76N9 の決まりを足す。成果物と sample の本文に文書の役割の割り当てと承認の進み具合を書かない。rulebook の「誰がどの利用場面で何を判断するか」は「どの利用場面で何を判断するための文書か」とする。文書の中身として役割が要る型（RACI・体制など）は対象外とする。
- 第 3 波の strategy の段の説明に、同じ決まりを足す。track の作り直しはオーケストレーターが行うため、executor は track を直接直さず、作り直しが要ることを個票の対応結果に書く。
- 役割と承認の記述を求めている型の template とカタログの `done_criteria` と grade の観点を探して直す。cnd-template の列と「検証・承認前の確認」の節を含める。直した場所の一覧を個票の対応結果に書く。
- YAML を書き直したら、`task_suffix` などの文字列が数値に変わっていないかを schema の検査で確かめる。
- 型の grade は統合の後に orchestrator が流す。executor は grade を実行しない。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。影響がなければ「なし」と書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema` を通し、親の検証を通す。
- 2 回目の実行（2026-11-22）: 1 回目は完了条件どおりの変更を作ったが、統合の commit の hook で `tests/src/docs/yaml-tables.test.ts` が落ちた。`pm-review-viewpoints.yaml` を直したため、YAML の表示ページの fixture（`specdojo--pm-review-viewpoints.md.snap`）が古い出力のままだった。統合の段からは executor へ戻せないため、最初から流し直す。1 回目と同じ変更に加え、直した YAML の表示ページの fixture を新しい出力に合わせて直し、`npm run test:unit` で確かめる。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
