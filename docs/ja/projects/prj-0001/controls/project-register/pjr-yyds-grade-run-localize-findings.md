---
specdojo:
  id: prj-0001:pjr-yyds-grade-run-localize-findings
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-15T22:56:47Z"
  due_on: "2026-11-30"
  commit_type: fix
  commit_scope: grade
---

# PJR-YYDS grade の finding を最初から日本語で書かせる

## 1. 概要

英語で書かせてから翻訳する方式をやめ、判定根拠と finding を日本語で書かせて正本にする

## 2. 入力

- 2026-11-16、orchestrator が `grade run --target deliverable / kata` で再 grade した 20 件ほどの結果で、findings の `message_ja` が英語の正本のままだった。翻訳（`grade translation-plan` → `agent run --by gemma26-translator` → `grade localize`）は `tools/grade/run-per-document.sh` にだけ組み込まれており、`grade run` は行わない。個票に英語の指摘がそのまま書かれた。
- 利用者は、翻訳を足すのではなく、最初から日本語で記述するように変えることを選んだ（2026-11-16）。
- 英語を正本にした理由（PJR-27Y0、2026-10-04）は、当時の一次評価のローカルのモデル（Ornith）が英語の方が判定が厳しく、中国語の字体が混ざらなかったため。いまの grade の executor は `sol-review-executor` などで、この前提は当てはまらない。
- 前回の指摘の引き継ぎは正本の `message` の一致で行う（`src/grade/plan.ts` の手順 5、`src/grade/apply.ts`）。既存の結果には英語の正本が残っている。

## 3. 完了条件

- grade の plan の指示（`src/grade/plan.ts`）が、判定根拠と新しい finding の `message` を日本語で書くよう求める。固有名詞・識別子・引用は原文を保ってよい。
- 既存の英語の正本の finding が未解消のまま引き継がれる場合の扱いを決め、実装と文書に書く（例: 引き継ぎの照合は英語の原文で行い、再掲するときは日本語の `message_ja` を表示に使う、または日本語で書き直して新しい正本にする）。severity の引き継ぎが壊れないことを unit test で確かめる。
- 日本語の正本では翻訳の段を流さない（`tools/grade/run-per-document.sh` と `grade run` の両方）。英語の finding が混じった場合だけ、既存の翻訳の段で表示用の `message_ja` を作る扱いを残すかを決めて記録する。
- grade の文書（command-reference の grade、review-guide など）と PJR-27Y0 の方針の記述を新しい方針に合わせる。
- `npm run check` と親の検証が通る。

## 4. 作業内容

| No  | 作業                                               | 担当 | 状態 | メモ |
| --- | -------------------------------------------------- | ---- | ---- | ---- |
| 1   | grade の plan の言語の指示を日本語に変える         | DEV  | open | -    |
| 2   | 英語の既存の正本との引き継ぎの扱いを決めて実装する | DEV  | open | -    |
| 3   | 翻訳の段の扱いを整理し、文書を更新する             | DEV  | open | -    |

## 5. 対応結果

-

## 6. 関連ドキュメント

- [[prj-0001:pjr-27y0-grade-english-canonical-translation]]
