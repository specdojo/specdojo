---
specdojo:
  id: prj-0001:pjr-6wfa-register-plan-targets
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-09-26T09:01:00Z"
---

# PJR-6WFA register 由来の plan へ targets を持たせて対象網羅の検証を効かせる

## 1. 概要

[[prj-0001:pjr-1y9p-resume-executor-plan]] で resume 後の対象網羅の検証を実装したが、register 由来の plan には `targets` がないため検証が効かない。発端となった [[prj-0001:pjr-xzeq-cdfd-overview-cdfd-check-cdfd-action-grade-review]] も register 由来であり、**同じ事象が再発しても検出できない。**

## 2. 事実

| plan の種別                      | `targets` | 実測            |
| -------------------------------- | --------- | --------------- |
| `T-*-plan.md`（Schedule 由来）   | あり      | 3 件中 3 件     |
| `pjr-*-plan.md`（register 由来） | **なし**  | **4 件中 0 件** |

Schedule 由来の plan は成果物カタログの `local_id` から対象が定まるため `targets` を生成できる。register の個票は自由記述であり、対象文書が構造化されていない。

現在の実装は `targets` が空なら検証を skip して成功扱いとする。プロンプトでは `final_message` に検証済みと未検証を述べるよう指示しているが、**機械的な検証にはならない。**

## 3. 対象の導出方法

**これが本項目の中心の判断である。** 方式によって運用負荷と精度が変わる。

| 案  | 内容                                                      | 利点                           | 懸念                                   |
| --- | --------------------------------------------------------- | ------------------------------ | -------------------------------------- |
| 1   | 個票へ `targets` を人が宣言する                           | 正確。起票時に対象が明確になる | 起票の負荷が増える。書き漏れる         |
| 2   | 個票の関連ドキュメント欄から導出する                      | 既存の記述を使える             | 関連は参照であって変更対象とは限らない |
| 3   | 1 回目の実行で変更されたファイルを記録し、resume 時に使う | 人手が不要                     | 1 回目が不完全なら不完全な集合になる   |
| 4   | 個票の `作業内容` 表へ対象列を設ける                      | 作業単位で対象が分かる         | 表の形式変更が全個票へ波及する         |

**案 3 と案 1 の組み合わせを起点とする。** 案 3 は 1 回目の変更集合を下限として扱い、resume 時に「少なくともこれらは再確認せよ」と伝えられる。案 1 は上限を人が宣言する形で、重要な項目にだけ適用すればよい。

案 2 は関連ドキュメントに standard や rulebook が含まれ、それらは参照のみで変更しないことが多いため精度が低い。

## 4. 完了条件

- register 由来の plan に対して対象網羅の検証が機能する。
- 対象の導出方法が決まり、個票の起票者が何をすべきか分かる。
- `targets` を宣言しない個票でも起票できる。必須化しない。
- 宣言がない場合の挙動が決まっている。検証を skip するか、1 回目の変更集合を使うか。
- 1 回目の変更集合を使う場合、それが不完全でありうることが記録されている。
- [[prj-0001:pjr-xzeq-cdfd-overview-cdfd-check-cdfd-action-grade-review]] と同じ状況（3 文書のうち 1 文書だけ変更して resume）で検出できる。
- `pjr-rulebook.md` の個票の記述規約が追従している。`targets` を書く場合の記法が定まっている。
- `npm run test:unit` と `npm run test:integration` が通過している。

## 5. 作業内容

| No  | 作業                                       | 担当 | 状態 | メモ                           |
| --- | ------------------------------------------ | ---- | ---- | ------------------------------ |
| 1   | 対象の導出方法を決める                     | ARC  | open | 案 3 と案 1 の組み合わせを起点 |
| 2   | 個票の記述規約を決める                     | ARC  | open | `pjr-rulebook` への追加        |
| 3   | plan 生成へ `targets` を反映する           | DEV  | open |                                |
| 4   | 検証が効くことを PJR-XZEQ の状況で確かめる | QE   | open | 3 文書のうち 1 文書だけ変更    |
| 5   | テストを追加する                           | DEV  | open |                                |

## 6. 対応結果

-

## 7. 関連ドキュメント

- [[prj-0001:pjr-1y9p-resume-executor-plan]]
- [[prj-0001:pjr-xzeq-cdfd-overview-cdfd-check-cdfd-action-grade-review]]
- `src/exec-plans.ts`
- `docs/ja/specdojo/rulebooks/pjr-rulebook.md`
