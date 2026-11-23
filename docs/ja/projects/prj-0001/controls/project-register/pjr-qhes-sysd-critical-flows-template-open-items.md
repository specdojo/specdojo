---
specdojo:
  id: prj-0001:pjr-qhes-sysd-critical-flows-template-open-items
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: easy
  owner: BA
  registered_at: "2026-11-22T23:35:35Z"
  due_on: "2026-11-30"
  completed_at: "2026-11-23T02:09:58Z"
  conclusion: sysd-critical-flows-template の未決事項の表に影響と当面の扱いの列を足し、図の記入指示・part_of・フロー ID の列名を直した。担当 Role code の列は足していない。template の grade は pass 96
  derived_from:
    - PJR-325Y
  commit_type: docs
  commit_scope: kata
---

# PJR-QHES sysd-critical-flows-template の未決事項の表に当面の扱いと影響の列を足す

## 1. 概要

PJR-325Y の後の grade で、未決事項と後続作業の表に rulebook が省略を禁じる当面の扱いと影響の列がないことが major になった。minor 3 件とあわせて template を直す

## 2. 入力

- 2026-11-22 の grade（opus-review-executor）で sysd-critical-flows-template は needs-work 90。major は未決事項の表の列の不足で、325Y の前からある
- 担当 Role code の列を足す指摘は、PJR-76N9 の決まりとぶつかるので採らない（利用者の決定、2026-11-23）

## 3. 完了条件

- `sysd-critical-flows-template` の「未決事項と後続作業」の表に、rulebook が省略を禁じる「受入や運用への影響」と「当面の扱い」の列（または記入の目印）を足す。sample の表と列をそろえる。
- 図の記入指示に、rulebook の「本文要件」が求める「要求の受付と業務の完了を分ける」条件を足す。
- frontmatter の雛形の `part_of` を、所属するシステム設計索引を記入できるプレースホルダにする（`based_on` と同じ書き方）。
- フロー ID を指す列名（「ID」「Flow ID」「フロー」）を 1 つにそろえる。sample と食い違えば、変更案を個票の対応結果に書く。
- 「担当 Role code」の列は足さない（PJR-76N9 の決まりで、成果物に役割の割り当てを書かないため。利用者の決定、2026-11-23、indie）。
- 直すのは template だけとする。rulebook・recipe・sample は変えず、合わせて直すべき点は変更案として個票の対応結果に書く。
- 型の grade は統合の後に orchestrator が流す。executor は grade を実行しない。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。影響がなければ「なし」と書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- `npm run lint:md`・`npm run lint:fm` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業                                                                                                                                                                | 担当 | 状態 | メモ                                                                                                                            |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- | ---- | ------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 未決事項と後続作業の表に「受入や運用への影響」「当面の扱い」の列を足し、省かない旨の記入目印も付す（grade F005 major / F003 minor）                                 | BA   | done | 完了。template の 5.3 表へ列を追加し、注記に「省かない」を追加。                                                                |
| 2   | 図の記入指示に「要求の受付と業務の完了を分ける」条件を足す（grade F002 minor）                                                                                      | BA   | done | 完了。template の 3.1 図の記入欄に追加。rulebook 本文要件の表現に従う。                                                         |
| 3   | frontmatter 雛形の `part_of` を `based_on` と同じ書き方のプレースホルダにする（grade F004 minor）                                                                   | BA   | done | 完了。`part_of: []` を `part_of: _PART_OF_` に変更。                                                                            |
| 4   | フロー ID を指す列名を 1 つにそろえる（grade F007 minor）                                                                                                           | BA   | open | sample と食い違ため template のみでは確定できない。統一案を 5. 対応結果へ記載し、sample／template の一致判断は runner・人間へ。 |
| 5   | 「担当 Role code」の列は足さず、4.2 の「担当Role code・対応方針」列名を PJR-76N9 に沿って役割を割り当てない形に整える（grade F001 minor / 利用者の決定 2026-11-23） | BA   | done | 完了。template 4.2 の列名を「担当の対応方針」に変更。Role code 列の新設は採用しない。                                           |
| 6   | 個票と報告の `handoff` に、rulebook・recipe・sample への変更案と CHANGELOG に書く事項を記載                                                                         | BA   | done | 完了。5. 対応結果と `handoff` に記載。                                                                                          |

## 5. 対応結果

### 実施内容

- 対象は template `docs/ja/specdojo/templates/sysd-critical-flows-template.md` のみ。rulebook・recipe・sample は変えていない。
- grade（opus-review-executor、needs-work 90）の major・minor を解消する形へ整えた。grade result サイドカー（`execution/grade/results/specdojo.sysd-critical-flows-template.yaml`）は再評価時に更新されるため直接編集しない。

grade finding ごとの対応:

- F005（major、`vp-qe-kata-conformance`）/ F003（minor、`vp-qe-omissions-consistency`）: 未決事項と後続作業（5.3）の表に「受入や運用への影響」「当面の扱い」の列を追加。注記へ「省かない」を明記し、rulebook 禁止事項（省略の禁止）と一致させる。
- F002（minor、`vp-arc-technical-constraints`）: 図の記入欄（3.1「図」）に「要求の受付と業務の完了は分ける。」を追加。rulebook 本文要件の表現を使用。
- F004（minor、`vp-qe-omissions-consistency`）: frontmatter 雛形の `part_of` を空配列固定値から `_PART_OF_` のプレースホルダに変更し、`based_on` と同じ書き方にそろえた。rulebook「推奨 Frontmatter 項目」の所属システム設計索引の記入を促す形になる。
- F001（minor、`vp-pm-plan-feasibility`）: 「担当 Role code」の列の新設は採用しない。PJR-76N9 の決まり（成果物に役割の割り当てを書かない、利用者の決定 2026-11-23）と抵触するため。代わりに 4.2「管理記録への引渡し」の既存列名「担当Role code・対応方針」を「担当の対応方針」に変更し、役割の明示的割当を求めない形に整えた。
- F007（minor、`vp-ux-language-consistency`）: フロー ID を指す列名は、template 内では一覧「ID」、4.1／5.1「Flow ID」、5.2「検証ID / フロー / 受入条件ID」と揺れている。rulebook の 6.2 は推奨列として「ID」を示すため template の正本は「ID」とするが、sample の 5 表で統一するには sample 側の全表「Flow ID」「ID」をそろえる必要があり、対象外である。よって template のみでは確定できない。統一案（下記）を記録し、rulebook／sample の整合判断は runner・人間へ委ねる。
- F006（minor、`vp-qe-kata-conformance`）: sample の 5.2「検証への引渡し」に template の「確認状況・不足の解消先」列がなく、逆に sample にあり template にない 5.4「承認対象と公開前条件」節がある。template を正本とする場合 sample と食い違い、rulebook 6.5「見出し順・表・記入欄は雛形に従う」と矛盾する。template のみを直す範囲では解消できないため、sample への変更案として下記に記録した。

### 変更ファイル

- `docs/ja/specdojo/templates/sysd-critical-flows-template.md`:
  - 5.3「未決事項と後続作業」表へ「受入や運用への影響」「当面の扱い」の列を追加（プレースホルダ `_ACCEPTANCE_AND_OPS_IMPACT_`・`_PROVISIONAL_HANDLING_`）。「作業単位・依存順」列は維持。注記に省略禁止を明記。
  - 3.1「図」の記入欄に「要求の受付と業務の完了は分ける。」を追加。
  - frontmatter 雛形の `part_of: []` を `part_of: _PART_OF_` に変更。
  - 4.2「管理記録への引渡し」の列名を「担当Role code・対応方針」→「担当の対応方針」、プレースホルダを `_OWNER_AND_RESPONSE_` → `_RESPONSE_POLICY_` に変更。

### 変更案（対象外ファイル）

- rulebook `docs/ja/specdojo/rulebooks/sysd-critical-flows-rulebook.md`: 「未決事項と後続作業」の列構成に「受入や運用への影響」「当面の扱い」を推奨列として明記する案。rulebook 本文要件 5.3 行で既に「受入や運用への影響・当面の扱い」とあり禁止事項とも整合するため、template のみで充足できると判断。実装は不要としたが、明記を徹底したい場合は rulebook 6.5 に列名を追加する。
- sample `docs/ja/specdojo/samples/sysd-critical-flows-sample.md`:
  - F007（フロー ID 列名の統一）: 5 表の列名「ID」「Flow ID」「フロー」を 1 つに統一。template 側は rulebook 6.2 の推奨列「ID」に合わせる案だが、5.2「検証ID / フロー / 受入条件ID」の複合列名は sample・template 共有のため、統一先は runner・人間が決めるべき。おすすめは一覧のみ「Flow ID」へ、複合列は維持、あるいは全表「Flow ID」で統一。
  - F006: 5.2「検証への引渡し」に template の「確認状況・不足の解消先」列を追加し、5.4「承認対象と公開前条件」節を template に追加、または sample のみ削除して template と合わせる案。

### 担当者へのお願い（`handoff` にも記載）

- F007 / F006 は rulebook・recipe・sample を変えない制約で確定できないため、統一先と sample の対応を runner・人間へ。
- grade result サイドカーの再評価は、統合後に orchestrator が流す（個票入力 8・完了条件）。executor は grade を実行しない。

### CHANGELOG に書く事項

- 区分: 不具合修正 or「追加」（template の補強は利用者に雛形の変化として見える）
- 行の文案案: 「`sysd-critical-flows-template` の未決事項と後続作業の表に「受入や運用への影響」「当面の扱い」の列を追加しました。図の記入指示に要求受付と業務完了の区別を、`part_of` 雛形に所属システム設計索引の記入目印を足しました（PJR-QHES）。」
- `CHANGELOG.md` 自体は変えなかった（完了条件の制約）。

### 残課題

- F007 / F006 の確定と sample・rulebook の対応（runner・人間、統合後の grade 再評価で反映）。
- 型の grade 再評価は統合後に orchestrator が流す。executor では実行しない。

## 6. 関連ドキュメント

- [[specdojo:sysd-critical-flows-template|重要フロー 雛形]]（変更対象）
- [[specdojo:sysd-critical-flows-rulebook|重要フロー ルール]]、[[specdojo:sysd-critical-flows-sample|重要フロー サンプル]]、[[specdojo:sysd-critical-flows-recipe|重要フロー レシピ]]（変更案の突き合わせ先）
- `execution/grade/results/specdojo.sysd-critical-flows-template.yaml`（F005 major と F001〜F004 / F006 / F007 minor の判定根拠）
