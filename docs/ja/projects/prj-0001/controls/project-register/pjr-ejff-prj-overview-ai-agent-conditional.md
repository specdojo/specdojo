---
specdojo:
  id: prj-0001:pjr-ejff-prj-overview-ai-agent-conditional
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-27T10:15:38Z"
  due_on: "2026-11-30"
---

# PJR-EJFF prj-overview の AI Agent の役割を、業務に使う場合だけ書く条件付きにする

## 1. 概要

prj-overview-rulebook の前提条件の節が AI Agent の役割を常に求めるため、AI を業務に使わない駄菓子屋の sample にも成果物作成の補助の記述が入った。rulebook と template を条件付きに変え、sample から外す

## 2. 入力

- prj-overview-sample の 111 行目以降の AI Agent の記述は、2026-11-23 の T-KATA-WAVE-6-PROJECT-prj-overview-sample-050（3d569e81d2）で入った
- 元は prj-overview-rulebook の前提条件の節（2026-06-06、586769eb25）の「人間の判断責任、AI Agent の役割、…を明示します」と、prj-overview-template の 92 行目の導入文
- 利用者（indie）は、sample の文脈（駄菓子屋の販売管理）では成果物作成の AI Agent の話は関係ないと判断し、案 B（rulebook を AI Agent を業務に使う場合は役割を書く条件付きに変え、sample からは外す）を選んだ（2026-11-27）
- 条件付きの書き方の前例: prj-charter-template の「AI Agent を利用する場合は、支援対象の活動と委譲範囲を記述する。」
- 判断責任・公開方針・取捨選択方針の記述は残す

## 3. 完了条件

- `prj-overview-rulebook` の前提条件の節で、AI Agent の役割を常に求める書き方を、「AI Agent を業務の中で使う場合は、その役割と人の判断との境界を明示します」という条件付きの書き方に変えている。判断責任・適用範囲・公開方針・取捨選択方針を明示する要求は残している。
- `prj-overview-template` の導入文「判断責任、AI Agent の役割、公開方針、取捨選択方針は次のとおりとする。」と、その下の枠を、上の rulebook に合わせている。条件付きの書き方は `prj-charter-template` の前例（「AI Agent を利用する場合は、支援対象の活動と委譲範囲を記述する。」）にそろえている。
- `prj-overview-sample` から AI Agent の記述（導入文の「AI Agent の役割」と、AI Agent の使い方の箇条書き）を外している。判断責任・公開方針・取捨選択方針の記述は残している。
- ほかの sample・rulebook・template の AI Agent の記述（`pm-organization`・`pm-raci`・`pm-communication-plan`・`prj-stakeholder-register` など）は変えていない。管理の文書で開発に AI Agent を使う前提は文脈に合うと利用者が判断した（2026-11-27）。
- `npm run -s lint:md` が通っている。
- CHANGELOG の書き方は運用メモの決まりに従い、公開済みの版の節は変えていない。

- 2 回目の実行（2026-11-27）で、次の 3 点を直している。
  - `prj-overview-template` に入れた「AI Agent を業務の中で使う場合は、その役割と人の判断との境界も記述する。」を、template から作る文書の本文に残らない書き方にしている。`prj-charter-template` の前例にそろえ、`_TODO_:` を付けた段落にする。
  - 1 回目で `CHANGELOG.md` の `## [0.10.0] - 未公開` の節に足した PJR-EJFF の行を外し、個票の対応結果の「CHANGELOG に書く事項」の小節へ、区分と行の文案として移している。PJR-EPQ3 の決まりどおり、項目では `CHANGELOG.md` を変えない。
  - `prj-overview-recipe` で AI Agent の役割を常に書くよう求める記述（52・239・246・248・294 行目付近）を、rulebook の条件付きの書き方に合わせている。判断責任は人が担い、AI Agent は支援に限るという趣旨は、AI Agent を業務に使う場合の記述として残す。

## 4. 作業内容

| No  | 作業                                | 担当 | 状態 | メモ                                                       |
| --- | ----------------------------------- | ---- | ---- | ---------------------------------------------------------- |
| 1   | rulebook の前提条件を条件付きにする | BA   | done | AI Agent の要求を別の箇条書きに分け条件付きにした          |
| 2   | template の導入文と枠を合わせる     | BA   | done | `_AI_AGENT_ROLE_` の枠を外し導入文に条件付きの一文を足した |
| 3   | sample から AI Agent の記述を外す   | BA   | done | 導入文と箇条書き 1 件を削除                                |
| 4   | CHANGELOG に追記する                | BA   | done | 0.10.0 の型と文書に追記（公開済みの版は不変）              |

## 5. 対応結果

- 実施内容: `prj-overview-rulebook` の前提条件で AI Agent の役割を「業務の中で使う場合は役割と人の判断との境界を明示する」条件付きにした。`prj-overview-template` の導入文を `prj-charter-template` の前例にそろえ、`_AI_AGENT_ROLE_` の枠を外した。`prj-overview-sample` から AI Agent の記述を外した。
- 他の rulebook・sample・template は変更していない。
- 残課題: `prj-overview-recipe` に AI Agent の役割を求める記述（52・239・246・248・294 行目）が残る。完了条件の対象外のため変更していない。

## 6. 関連ドキュメント

- `prj-overview-rulebook`、`prj-overview-template`、`prj-overview-sample`（変更対象）
