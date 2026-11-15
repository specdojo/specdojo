---
specdojo:
  id: prj-0001:pjr-yyds-grade-run-localize-findings
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
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

| No  | 作業                                               | 担当 | 状態 | メモ                                                                            |
| --- | -------------------------------------------------- | ---- | ---- | ------------------------------------------------------------------------------- |
| 1   | grade の plan の言語の指示を日本語に変える         | DEV  | done | `src/grade/plan.ts` の判定根拠・finding・完了条件の不足内容を日本語に変えた     |
| 2   | 英語の既存の正本との引き継ぎの扱いを決めて実装する | DEV  | done | 前回の指摘は `message_ja` で示し、照合は `message` と `message_ja` の両方で行う |
| 3   | 翻訳の段の扱いを整理し、文書を更新する             | DEV  | done | 英語 finding が無ければ script は翻訳の段を流さない。`grade run` は翻訳しない   |

## 5. 対応結果

- grade executor plan（`src/grade/plan.ts`）は、判定根拠と新しい finding の `message`、完了条件の `unsatisfied` の不足内容を日本語で書くよう求める。固有名詞・識別子・引用は原文を保ってよい。英語の既存 finding を互換用の正本として扱う旧指示は削った。
- 英語の正本の引き継ぎは「日本語で書き直して新しい正本にする」側を採った。grade plan の「前回の指摘」は `message_ja` があればそれを、なければ `message` を示し、未解消なら示した文を一字一句変えずに再掲するよう求める（英語で示された場合も訳さない）。`preserveStoredFindingSeverities`（`src/grade/core.ts`）は前回の `message` と `message_ja` の両方を照合キーにするため、日本語で再掲された指摘も severity を引き継ぎ、その日本語が新しい正本になる。英語の正本は再評価のたびに日本語へ移る。
- 翻訳の段: `tools/grade/run-per-document.sh` は `grade translation-plan` の入力が0件（すべて日本語）なら翻訳 agent と `grade localize` を流さない。英語 finding が混じった場合（日本語訳のない旧結果の英語の正本が原文のまま再掲された場合など）だけ、既存の翻訳の段で表示用の `message_ja` を作る扱いを残した。`grade run` には翻訳の段を足さず、必要なら `translation-plan` / `localize` を手動で使う。
- unit test: `tests/src/grade/result.test.ts` に英語の正本に対し日本語の `message_ja`・英語の `message` のどちらで再掲しても severity と level の上限が引き継がれること、別の日本語の指摘は引き上げないことを追加した。`tests/src/grade/grade.test.ts` の前回指摘の plan のテストを `message_ja` の表示と日本語の指示に、`tests/tools/grade-per-document.test.ts` を英語 finding が無いときに `grade localize` を呼ばないことに更新した。
- 文書: command-reference の grade、文書メタデータ標準の grade result、routine 運用ガイドの grade の単段評価、oMLX・opencode 設計書の `opencode-grade-executor` を新しい方針に合わせた。review-guide には英語の正本の記述が無く変更していない。PJR-27Y0 の個票は完了済みの履歴のため書き換えず、その方針を述べていた上記の文書を更新した。

## 6. 関連ドキュメント

- [[prj-0001:pjr-27y0-grade-english-canonical-translation]]
