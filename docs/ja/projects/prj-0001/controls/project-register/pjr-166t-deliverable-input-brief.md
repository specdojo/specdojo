---
specdojo:
  id: prj-0001:pjr-166t-deliverable-input-brief
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  registered_at: "2026-10-28T21:54:53Z"
---

# PJR-166T 成果物を作るときの前提（技術スタックなど）を agent に渡す場所がない

## 1. 課題内容

approach plan が読める範囲に作成の前提を書く欄がなく、個票は完了条件しか plan に入らない。fully-guided の雛形は磨き込み専用の書き方で草案作成と食い違い、人が先に書いて磨く手順も文書化されていない

## 2. 影響範囲

| 観点         | 影響                                                                                                                           |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| スコープ     | approach plan（register・schedule の両経路）、個票テンプレート、成果物カタログの schema、fully-guided の plan 雛形、関連ガイド |
| スケジュール | 技術スタックなど前提が要る成果物（tsd など）を agent で作ると、`_TODO_` / `_UNDECIDED_` だらけの草案になり手戻りが出る         |
| コスト       | 前提を渡す手段が無いため、人が先に下書きするか、個票の完了条件へ前提を混ぜて書く運用で補っている                               |
| 品質         | 前提と完了条件が混ざり、何が指示で何が判定基準かが plan 上で区別できない                                                       |
| 関係者       | 成果物を起票・計画する人（BA・DEV）と executor                                                                                 |

## 3. 対応方針

| 項目     | 内容                                                                                                                     |
| -------- | ------------------------------------------------------------------------------------------------------------------------ |
| 原因     | 下記「調査結果」のとおり、plan の参照範囲に作成の前提を渡す欄が無く、fully-guided の雛形が草案作成と磨き込みを兼ねている |
| 対応策   | 案 B（前提を渡す欄を設けて plan の参照範囲へ入れる）＋案 A（人が先に書いて磨く手順を文書化）を採る（利用者の判断）       |
| 依存事項 | schedule 起点での前提の置き場所と、agent に技術選定を委ねる指示の扱いは PJR-65DS で決めた                                |
| 完了条件 | PJR-65DS の決定から分けた todo がすべて終わること                                                                        |

### 3.1. 調査結果

- fully-guided / recipe-guided の plan は、rulebook・recipe・sample、カタログの `depends_on` 成果物、`project_context`（既定は `prj-overview`）、対象成果物の既存記述に参照を限定し、それ以外の文書を探索しない。
- 成果物ごとに前提を渡せるのは、実質的にカタログの `overview`（prj-0001 の `tsd-specdojo-cli` は技術名を列挙している）と既存記述だけである。カタログ schema に前提・指示のための項目は無い。
- register 経路の plan には、個票の `完了条件` の節と 1 行の説明だけが入る（`src/exec/register.ts` の `registerCompletionConditions`）。`概要` や `作業内容` は plan に入らない。
- `tsd-recipe` の「作成前に集める情報」は人が答える前提だが、集めた情報を agent へ渡す経路が無い。
- fully-guided の plan 雛形（`xep-fully-guided-template.md`）は「磨き込みでは template は読み込まない」とし、参照に template を含めない。一方 ryu-guide は fully-guided を「template があればそこから開始」と説明し、schedule の strategy は fully-guided を草案作成（guided-pass）と磨き込み（refine-pass）の両方で使う。
- 「根拠のない具体化の禁止」により、「主流の技術スタックで書く」のような選定を委ねる指示を渡しても、現行の雛形では agent が値を決められない。
- `deliverable scaffold` → 人が採用値を記入 → fully-guided で磨く、という流れは現行機能で可能だが、手順として文書化されていない。

## 4. 対応結果

PJR-65DS で、雛形 → 人による文脈の記入 → `draft` → `fully-guided`（磨き込み専用）→ `finalize` の流れと、文脈の置き場所（成果物の中の `_CONTEXT_`、個票の `入力`、カタログの `brief`）を決め、次の項目で解消した。

| 調査結果の問題                                      | 解消した項目                                                                                                                                                              |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| plan の参照範囲に作成の前提を渡す欄がない           | PJR-6DD7（個票の `入力` を plan に入れる）、PJR-YKMA（カタログの `brief`）、PJR-JRSY（`_CONTEXT_` の目印）、PJR-D0GB（ready 以外の文書の `_CONTEXT_` を情報として扱う）   |
| register の plan に完了条件しか入らない             | PJR-6DD7                                                                                                                                                                  |
| fully-guided の雛形が草案作成と磨き込みを兼ねている | PJR-3MY5（`draft` approach を追加し、fully-guided を磨き込み専用・宣言された参照に改めた）                                                                                |
| 選定を委ねる指示を渡しても agent が値を決められない | PJR-3MY5（`draft` が任された範囲を調べて選び、提案として記録する）                                                                                                        |
| recipe で集めた情報を渡す経路がない                 | PJR-6A2B（tsd-recipe に置き場所の対応を書いた）                                                                                                                           |
| 雛形 → 人が記入 → 磨く流れが文書化されていない      | PJR-6A2B（ガイド）、PJR-E45K（schedule の profile）、PJR-S23T・PJR-YKYK（成果物を 1 件だけ雛形にする `deliverable scaffold --target` と雛形の型）、PJR-73KT（案内の統一） |

あわせて、文書の lint の速度の問題を PJR-SC8T で直した。

## 5. 関連ドキュメント

- [[specdojo:ryu-guide]]
- [[specdojo:exec-operation-guide]]
- [[specdojo:tsd-recipe]]
