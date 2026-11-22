---
specdojo:
  id: prj-0001:pjr-hrw6-prj-charter-sample-quality-target
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-22T12:55:52Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-7M9J
---

# PJR-HRW6 prj-charter の sample の品質の確認の対象を、販売管理システムに合わせる

## 1. 概要

型の grade で prj-charter-sample が needs-work だった。販売管理システムの開始判断なのに、品質の確認の対象が rulebook・recipe・sample・template になっていて、題材と合っていない。

## 2. 入力

- 2026-11-22 の型の grade（opus-review-executor）: prj-charter-rulebook pass 91、prj-charter-sample needs-work 83（major 4 件）。
- major 4 件はどれも同じ内容: GO・Not GO の判断の材料と品質の確認の対象が型の 4 種類の文書になっており、販売管理システムの実装・操作手順・受入結果・公開物と、参照先の品質管理計画のゲートに結びついていない。
- PJR-7M9J は recipe だけを直したため、sample の問題はこの項目で扱う（indie の承認、2026-11-22）。

## 3. 完了条件

- `prj-charter-sample` の品質の確認の対象と、GO・Not GO の判断の材料を、販売管理システムの実装・操作手順・受入結果・公開物と、参照先の品質管理計画のゲートに結びつける。型の 4 種類の文書（rulebook・recipe・sample・template）を品質の確認の対象にしない。
- 結論（認めること・認めないこと、予算、判断の条件）とほかの章は変えない。変える場合は理由を個票の対応結果に書く。
- ほかの型の rulebook と sample は変えない。品質管理計画の sample を直す必要があれば、変更案を個票の対応結果に書く。
- 型の grade は統合の後に orchestrator が流す。executor は grade を実行しない。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。影響がなければ「なし」と書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- `npm run lint:md`・`npm run lint:fm` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業                                                                                                | 担当         | 状態 | メモ                                                             |
| --- | --------------------------------------------------------------------------------------------------- | ------------ | ---- | ---------------------------------------------------------------- |
| 1   | 憲章 sample の GO / Not GO 判断の品質行を販売管理システムの成果物と品質管理計画のゲートに結びつける | BA           | done | `docs/ja/specdojo/samples/prj-charter-sample.md` の 7 章のみ変更 |
| 2   | 型の grade の再実行                                                                                 | orchestrator | open | executor は grade を実行しない。統合後に orchestrator が流す     |

## 5. 対応結果

### 5.1. 実施内容

- `prj-charter-sample` の「本格実行開始の GO / Not GO 判断」の「品質」行を、確認内容「販売管理システムの実装・操作手順・受入結果・公開物」、合格条件「品質管理計画の「技術・公開」「初期受入」ゲートが合格し、是正・再判定が済んでいない重大な不適合がない」に変更した。記録先に `execution/reviews/release-1/result.md` を加えた。
- 「公開適性」行の確認内容を「公開する文書」から品質管理計画の対象名に合わせた「公開する画面・文書・記録」へ変えた。
- rulebook・recipe・sample・template を品質の確認の対象とする記述は残っていない。結論（認めること・認めないこと、予算、判断の条件）とほかの章は変えていない。
- 品質管理計画の sample の修正は不要。

### 5.2. CHANGELOG に書く事項

なし。`CHANGELOG.md` は変えない。

### 5.3. 残課題

- 型の grade の再実行は統合後に orchestrator が行う。

## 6. 関連ドキュメント

- [[specdojo:prj-charter-sample]]
- [[specdojo:pm-quality-management-plan-sample]]
