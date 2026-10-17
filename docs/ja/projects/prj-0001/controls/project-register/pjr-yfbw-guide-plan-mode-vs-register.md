---
specdojo:
  id: prj-0001:pjr-yfbw-guide-plan-mode-vs-register
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: low
  owner: DEV
  registered_at: "2026-10-17T14:39:31Z"
  due_on: null
---

# PJR-YFBW オーケストレーターの運用ガイドに plan モードと register の使い分けを書く

## 1. 概要

Claude Code などの plan モードの plan（会話の中の下書き、既定で約 30 日で消える）と、register（ID・種類・状態の遷移・exec の plan と result への接続・decision の承認の記録）の違いと使い分けを、オーケストレーターの運用ガイドに書く。plan モードは下書きとし、残す判断は decision、作業の範囲は todo の完了条件へ書き写す流れを示す

## 2. 完了条件

利用者との議論（2026-10-17）で、Claude Code などの plan モードの plan より register の運用の方が体系的であることを確かめた。その使い分けを、オーケストレーターの運用ガイド（`docs/ja/specdojo/guides/orchestrator-operation-guide.md`）に書く。

- 「対話の進め方」の章の中か、その後に、plan モードと register の使い分けを書く節を加える。
- plan モードの plan の性質を書く。会話の中で考えをまとめる下書きであること、既定では `~/.claude/plans/` にランダムな名前で保存され、古いものは削除されうること、`plansDirectory` で保存先を変えられること。他の AI のツールの plan の機能にも同じ考え方が当てはまることを一言添える。
- register の性質を、次の観点で対比して書く（表にしてよい）: 識別（`PJR-XXXX` の ID と `Refs:`）、種類（decision・todo・issue・question・risk・note など）、状態の遷移とイベント、exec の plan・result・統合の commit とのつながり、decision の決定者・決定日・承認方式の記録、リポジトリの履歴として残ること、一覧での見渡し。
- 運用の流れを書く: plan モードの plan は下書きとして使い捨てにし、残す判断は decision の個票、作業の範囲は todo の完了条件へ書き写す。手元に残したい場合は `plansDirectory` を `tmp/plans` などの commit しない場所にする。
- 他の文書への wikilink は `[[specdojo:<id>]]` の形にする。外部の URL を書く場合は Markdown のリンクにしてよい（ガイドは履歴のファイルではないため）。
- 変えるのはガイドだけとし、CLI の動作は変えない。
- 作業を終える前に、`npm run lint:md` と `npm run lint:fm` を実行して通す（コードを変える場合は `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` も通す）。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。

## 3. 作業内容

| No  | 作業                                                       | 担当 | 状態 | メモ                 |
| --- | ---------------------------------------------------------- | ---- | ---- | -------------------- |
| 1   | 運用ガイドに plan モードと register の使い分けの節を加える | DEV  | open | 対比の表と運用の流れ |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[specdojo:orchestrator-operation-guide]]: 書き足すガイド。
- prj-0002 の PJR-0WFV: LP で同じ内容を伝える項目。
