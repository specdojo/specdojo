---
specdojo:
  id: prj-0001:pjr-325y-kata-strategy-no-role-assignment
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-21T08:23:42Z"
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

| No  | 作業                                                                                       | 担当         | 状態 | メモ                                                                      |
| --- | ------------------------------------------------------------------------------------------ | ------------ | ---- | ------------------------------------------------------------------------- |
| 1   | sample と rulebook の作成標準に PJR-76N9 の決まりを足す                                    | DEV          | done | 記述ガイドと禁止事項に追記                                                |
| 2   | 第 3 波の strategy の `rulebook-maintenance` と `sample-maintenance` の段の説明に足す      | DEV          | done | schema の検査で `task_suffix` が文字列のままであることを確認              |
| 3   | 役割と承認の記述を求める template を直す                                                   | DEV          | done | cnd・cxd・cpd・sysd-index・sysd-critical-flows・sysd-cross-cutting-policy |
| 4   | カタログの `done_criteria` を調べる                                                        | DEV          | done | 直す行なし（理由は対応結果）                                              |
| 5   | grade の観点（共通レビュー観点）を直し、YAML の表示ページの fixture を新しい出力に合わせる | DEV          | done | `yaml-tables.test.ts` が通ることを確認                                    |
| 6   | 第 3 波の track を作り直す                                                                 | orchestrator | open | 完了条件により executor は track を直さない                               |
| 7   | 直した型を grade する                                                                      | orchestrator | open | 完了条件により統合の後に orchestrator が流す                              |

## 5. 対応結果

### 5.1. 実施内容

- `sample-authoring-standard` の記述ガイドと禁止事項に、本文へ文書の役割の割り当てと承認の進み具合を書かない決まりを足した。RACI・体制・利用者の接点・業務の担当など、文書の中身として役割を扱う場合は対象外とした。
- `rulebook-authoring-standard` の記述ガイドに、文書の位置づけを「どの利用場面で何を判断するための文書か」で書くことと、本文要件で役割の割り当てと承認の進み具合を求めないことを足し、禁止事項にも足した。
- `sch-strategy-kata-wave-3.yaml` の `rulebook-maintenance` と `sample-maintenance` の段の説明に、同じ決まりを 1 段落ずつ足した。

### 5.2. 直した template・観点の一覧

| 場所                                     | 直した内容                                                                                                                                                                                      |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cnd-template`                           | 概要の役割の記入欄を利用場面に変更。Person の「判断・確認の責務」列、4.2 の「主確認ロール」列、「検証・承認前の確認」の節、メモの「担当ロール」列を外した                                       |
| `cxd-template`                           | Person の「確認責務」を「境界上の接点」に変更。検証の「主確認ロール」列とメモの「担当ロール」列を外した                                                                                         |
| `cpd-template`                           | 概要の作成者・確認者・PO の記入欄を利用場面に変更。変更記録の担当と、メモの判断者・承認への影響の列を外した                                                                                     |
| `sysd-index-template`                    | 概要のロール表を外した。未決事項の「担当ロール」列を外し、公開前の確認条件をロールなしの条件に書き換えた                                                                                        |
| `sysd-critical-flows-template`           | 概要の「人間の最終承認責任」と、未決事項の担当 Role code の列と、「承認対象と公開前条件」の節を外した                                                                                           |
| `sysd-cross-cutting-policy-template`     | 「利用・確認・承認責務」の節、適合確認の「担当」列、判断待ちの「判断者・担当」列を外し、公開前の条件をロールなしに書き換えた                                                                    |
| `pm-review-viewpoints`（共通）           | 網羅種別 `stakeholder` と、`vp-po-decision-readiness`・`vp-po-publication-accountability`・`vp-ba-stakeholder-clarity`・`vp-ops-release-readiness` から確認者・判断者・承認者・承認責任を外した |
| `specdojo--pm-review-viewpoints.md.snap` | 直した観点の YAML の表示ページに合わせて作り直した                                                                                                                                              |

### 5.3. 迷って決めたこと

- 未決事項やメモの表の「担当ロール」「判断者」列は文書の作業の割り当てなので、登録簿で追うものとして外した。
- cnd-template の「検証・承認前の確認」と sysd-critical-flows-template の「承認対象と公開前条件」は、中身が承認と記録の参照だけだったため節ごと外した。sysd-index と sysd-cross-cutting-policy の公開前の条件は、検証の中身があるためロールを外して残した。
- 運用・障害時の一次対応、ルールの Owner、例外の判断者、SSOT の更新責任は、文書の中身（運用や方針そのもの）の役割なので残した。
- カタログの `done_criteria` は直さなかった。「〜を承認できること」は承認の記録を求めておらず、RACI・受入テストの承認者・登録簿の承認者は文書の中身として役割を扱うため対象外とした。
- 第 4〜6 波と kata-slim-3 の strategy は、まだ無いため扱っていない（完了条件どおり）。

### 5.4. 残課題

- track の作り直し: strategy の 2 段の説明を変えたため、orchestrator が `kata-wave-3` の track を作り直す。tsp-index で流している試しへの反映の要否も判断する。
- 型の grade: 統合の後に、直した 6 件の template と、sample・rulebook の作成標準を grade する。
- rulebook に残る役割の記述: cnd-rulebook の 6.1（「誰がどの利用場面で配置・結合の何を判断するかを示します」）と「検証・承認前の確認」、sysd-cross-cutting-policy-rulebook の概要の「誰がどの判断に使うか」、prj-issues-and-approach-rulebook の承認者は、第 3〜6 波と kata-slim-3 で直す。prj-issues-and-approach-template・stsd-template・cdfd-template の「誰が……判断するか」も、rulebook と合わせて直す。
- sample に残る役割の列（cnd-sample の Person の「判断・確認の責務」列など）は、型の波の sample の段で直す。
- 保護された設定の変更は無い。

### 5.5. CHANGELOG に書く事項

- 区分: Changed
- 文案: 「sample と rulebook の作成標準、C4 図と SYSD の template、共通レビュー観点で、文書の役割の割り当てと承認の進み具合を本文に求めないようにした（RACI・体制など役割を扱う文書は対象外）」

## 6. 関連ドキュメント

- [[prj-0001:pjr-76n9-no-role-assignment-in-documents|PJR-76N9]]
- [[specdojo:sample-authoring-standard|Sample 記述標準]]
- [[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]
- [[prj-0001:sch-strategy-kata-wave-3]]
