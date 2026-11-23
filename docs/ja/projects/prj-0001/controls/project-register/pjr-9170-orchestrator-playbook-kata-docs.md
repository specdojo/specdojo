---
specdojo:
  id: prj-0001:pjr-9170-orchestrator-playbook-kata-docs
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: hard
  owner: BA
  registered_at: "2026-11-23T02:38:48Z"
  due_on: "2026-11-30"
  completed_at: "2026-11-23T04:14:38Z"
  conclusion: オーケストレーターの運用メモの型（pm-orchestrator-playbook の rulebook・template・sample）を作った。章立ては prj-0001 の運用メモを手本にし、知見の育て方と handoff・question との分け方を rulebook に書いた。grade は rulebook pass 89・sample pass 90・template pass 95
  derived_from:
    - PJR-2P7C
  depends_on:
    - PJR-2P7C
  commit_type: docs
  commit_scope: kata
---

# PJR-9170 オーケストレーターの運用メモの型（rulebook・template・sample）を作る

## 1. 概要

prj-0001 の運用メモを手本に、章立て・知見の育て方・handoff と question との分け方を定める型を作る

## 2. 入力

- 利用者の問い（2026-11-23）: オーケストレーターのプロジェクトごとの知見を playbook にまとめているが、正式な機能か。オーケストレーターの答えは、正式ではない（型・置き場所・見つけ方が決まっていない）

## 3. 完了条件

- PJR-2P7C の決定に従い、オーケストレーターの運用メモの型を作る。rulebook・template・sample をそろえ、frontmatter で対応を宣言する。
- 章立ては、prj-0001 の `pm-orchestrator-playbook` を手本にする（目的と適用範囲、agent の使い分けと止まり方、実行の運び方、close の判断、保護された設定、リリースの手順など）。プロジェクトに固有の章は任意にする。
- rulebook に、知見の育て方（本体 → 運用メモ → コマンドの順に残す。手作業の回避策が運用メモに 2 回以上出たら、コマンドにする項目を起票する）と、handoff（PJR-5RY7）・`question` との分け方を書く。
- sample は、prj-0001 の運用メモを共通のサンプル文脈（駄菓子屋きぬや）に直して作る。prj-0001 の固有の事実（項目の ID・日付・agent の名前）を持ち込まない。
- PJR-76N9 の決まり（文書の役割の割り当てと承認の進み具合を書かない）に従う。
- 型の grade は統合の後に orchestrator が流す。executor は grade を実行しない。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json`・`CLAUDE.md`・`AGENTS.md`・`templates/` の agent の定義など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業                                                                     | 担当         | 状態 | メモ                                                                         |
| --- | ------------------------------------------------------------------------ | ------------ | ---- | ---------------------------------------------------------------------------- |
| 1   | rulebook を作る（章立て・知見の育て方・handoff と question との分け方）  | BA           | done | `pm-orchestrator-playbook-rulebook`                                          |
| 2   | template を作る                                                          | BA           | done | `pm-orchestrator-playbook-template`                                          |
| 3   | sample を駄菓子屋きぬやの文脈で作る                                      | BA           | done | prj-0001 の項目 ID・日付・agent 名を持ち込まず、架空の `PJR-KN11` 系を使った |
| 4   | 観点の `document_kinds` に新しい rulebook を載せ、表示の snapshot を直す | BA           | done | rulebook の追加で判断漏れの検証が error になるため                           |
| 5   | 型の grade                                                               | orchestrator | open | 完了条件どおり統合の後に orchestrator が流す。executor は実行しない          |

## 5. 対応結果

- 型を作った。rulebook・template・sample の 3 つを `status: draft` で置き、rulebook の frontmatter の `template`・`sample` で対応を宣言した。
  - [[specdojo:pm-orchestrator-playbook-rulebook|オーケストレーター運用メモ 作成ルール]]
  - [[specdojo:pm-orchestrator-playbook-template|オーケストレーター運用メモ テンプレート]]
  - [[specdojo:pm-orchestrator-playbook-sample|オーケストレーター運用メモ サンプル]]
- 章立ては prj-0001 の運用メモを手本にした。必須は「目的と適用範囲」「agent の使い分けと癖」「実行の運び方」「止まったときの再開」「close の前の確かめ方」「保護された設定の扱い」の 6 章。「登録簿項目の完了条件の書き方」「落とし穴」とプロジェクトに固有の章は任意、「リリースの手順」は公開・配布するプロジェクトだけ必須にした。
- rulebook の「位置づけと用語定義」に、本体・運用メモ・回避策とコマンドの項目・`handoff`・`question`・個票・実行状態の置き場所の分け方を表で書いた。「記述ガイド」に、知見の育て方（本体 → 運用メモ → コマンド。手作業の回避策が 2 回以上出たらコマンドにする項目を起票する）と、`handoff`・`question` から運用メモへの移し方を書いた。
- PJR-76N9 に従い、文書の役割の割り当てと承認の進み具合を本文に求めない旨を禁止事項に入れた。sample にも書いていない。
- `docs/ja/specdojo/defaults/pm-review-viewpoints.yaml` の `document_kinds` に新しい rulebook を載せた。`vp-ba-business-value` は `exclude`、`vp-arc-single-responsibility` は `confirmed_default`。表示の snapshot（`tests/fixtures/yaml-pages/specdojo--pm-review-viewpoints.md.snap`）を作り直した。

### 5.1. 迷った点と決めたこと

- prefix は `pm-orchestrator-playbook` にした。prj-0001 の既存の文書の id（`prj-0001:pm-orchestrator-playbook`）と置き場所（`030-project-management/`）をそのまま型に合わせられ、既存の文書を移さずに済むため。
- `recipe` は `undecided` にした。完了条件が rulebook・template・sample の 3 つを求め、recipe の要否は決まっていないため。
- `vp-ba-business-value` は `exclude` にした。運用メモはオーケストレーターの作業の手順の文書で、業務課題・期待価値との対応を判定する対象ではないため（`pm-members`・`sch` と同じ扱い）。
- sample のリリースは「店頭のタブレットへの入れ替え」にした。駄菓子屋きぬやは配布するパッケージを持たないため、条件付き必須の章の例として閉店後の入れ替えを使った。
- prj-0001 の既存の運用メモ（`rulebook: none`）は変えていない。型への切り替え（`rulebook` の宣言と章の並べ替え）は、`where playbook` と雛形の作り方を扱う PJR-G6NT か別の項目で行うのがよい。
- `deliverables-reference` への行の追加と、プロジェクト管理の成果物カタログの雛形（`dct-project-management-template.yaml`）への追加はしていない。雛形の作り方は PJR-G6NT の範囲のため。

### 5.2. CHANGELOG に書く事項

- 区分: 追加
- 行の文案: オーケストレーターの運用メモ（playbook）の型（`pm-orchestrator-playbook` の rulebook・template・sample）を追加した。章立てと、知見を本体 → 運用メモ → コマンドの順に育てる決まり、`handoff`・`question` との分け方を定める。

## 6. 関連ドキュメント

- [[prj-0001:pjr-2p7c-orchestrator-playbook-kata|PJR-2P7C]]: 型にすることの決定
- [[prj-0001:pjr-5ry7-register-handoff-type|PJR-5RY7]]: `handoff` の種類の決定
- [[prj-0001:pjr-76n9-no-role-assignment-in-documents|PJR-76N9]]: 役割の割り当てと承認の進み具合を書かない決まり
- [[prj-0001:pm-orchestrator-playbook|prj-0001 のオーケストレーター運用メモ]]: 手本にした運用メモ
