---
specdojo:
  id: prj-0001:pjr-27y0-grade-english-canonical-translation
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  owner: DEV
  registered_at: "2026-10-04T13:13:47Z"
  due_on: null
  block_reason: "agent exited with non-zero code: agent exited with non-zero code: agent-config-write: protected configuration changes detected; paths=.opencode/agents/gemma26-reporter.md; agent must record the requir…"
---

# PJR-27Y0 grade の英語の判定を正本として保存し、gemma26 で日本語へ翻訳する

## 1. 概要

Ornith の grade の判定を英語で出力させると、日本語より判定が厳しくなり、中国語の字体が混ざらず、検証通過が 5/6 になった（2026-10-04）。grade の記録は日本語の文書で読まれるため、英語の判定を正本として保存し、finding の文だけを gemma26（日本語がきれいで速い）で日本語に翻訳して表示に使う流れを設計する。前回の指摘の引き継ぎは英語の文の一致で行う

## 2. 完了条件

- grade の result サイドカーに、finding の英語の文（正本）と日本語の文（表示用）を分けて保存できる。既存の日本語だけの記録との互換を保ち、読み込みで壊れない。
- 前回の指摘の引き継ぎ（同じ文なら severity を維持する仕組み）を、英語の正本の文の一致で行う。日本語だけの既存の記録との照合の扱いを決めて記録する。
- executor の出力から機械変換した後、finding の文だけを `gemma26-reporter` 相当の agent で日本語に翻訳する。翻訳の入出力は文の配列とし、件数と順序が一致しない場合は翻訳を捨てて英語のまま記録する。判定（観点、level、severity、line）は翻訳の影響を受けない。
- executor が日本語で書いた finding（英語の指示が守られなかった場合）は、翻訳せずにそのまま日本語の表示用に使い、正本の扱いを決めて記録する。
- [[prj-0001:pjr-e9h3-grade-deterministic-reporter]] の機械変換に、severity の上限を超えた level を上限まで下げる補正を加える（下げる方向だけ）。補正した観点を記録する。2026-10-04 の英語の計測では、この補正で検証通過が 3/6 から 5/6 になった。
- `tools/grade/run-per-document.sh` と grade の文書を更新し、unit test で、翻訳の件数の不一致、日本語の finding、level の補正、英語での引き継ぎを検証する。
- `npm run check` が通る。

## 3. 作業内容

| No  | 作業                                                     | 担当 | 状態 | メモ                        |
| --- | -------------------------------------------------------- | ---- | ---- | --------------------------- |
| 1   | サイドカーの保存形式と、英語での引き継ぎの設計           | DEV  | open | 既存の記録との互換を保つ    |
| 2   | 翻訳の段階の実装（件数と順序の検証、失敗時は英語のまま） | DEV  | open | gemma26 を使う              |
| 3   | level の上限の自動補正                                   | DEV  | open | PJR-E9H3 の機械変換に加える |
| 4   | 実際の grade で、Ornith（英語）＋翻訳の一次評価を試す    | DEV  | open | 結果を PJR-VQB5 に記録する  |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-vqb5-agent-grade-comparison]]: 「ornith の英語での判定（2026-10-04）」の計測。
- [[prj-0001:pjr-e9h3-grade-deterministic-reporter]]: marker の機械変換。
- [[prj-0001:pjr-wjpx-gemma4-26b-moe-evaluation]]: gemma4 26B（翻訳に使う）の評価。
- [[prj-0001:pjr-z8t1-grade-finding-severity]]: 前回の指摘の severity を維持する仕組み。
