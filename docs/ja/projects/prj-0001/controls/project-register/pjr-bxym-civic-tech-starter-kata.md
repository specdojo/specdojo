---
specdojo:
  id: prj-0001:pjr-bxym-civic-tech-starter-kata
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: hard
  owner: BA
  registered_at: "2026-11-23T13:11:07Z"
  derived_from:
    - PJR-Y5RD
  commit_type: docs
  commit_scope: kata
---

# PJR-BXYM シビックテック向けの入門の型の組と導入ガイドを作る

## 1. 概要

小さなシビックテックのチームが最初に使う型の組を決め、理解の負債を減らすために何をどの順で残すかを示す導入ガイドを書く

## 2. 入力

- PJR-Y5RD の決定（2026-11-23）: kata による理解の負債の解消で、シビックテックを持続可能にすることを中核の位置づけにする

## 3. 完了条件

- シビックテックの小さなチーム（資金と専門人材が限られ、非エンジニアの当事者・市民・地域団体が加わる）が、最初に使う型の組（入門の型の組）を決める。候補は概要・課題と方針・業務仕様・機能一覧・判断の記録・登録簿など。選んだ型と、選ばなかった型を後で足す目安を表にする（PJR-Y5RD）。
- 入門の型の組で始める導入ガイドを、文書サイトのガイドとして書く。非エンジニアの参加者が読んで分かる言葉で、「理解の負債」を減らすために何をどの順で残すかを示す。既存のシステムから始める場合（復元）と、新しく作る場合の両方を扱う。
- 全部の型を求めないこと（Sustainable Participation）と、確認状態の目印（`_ASSUMPTION_`・`_UNDECIDED_`）の使い方をガイドに書く。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。影響がなければ「なし」と書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` など）は変えない。
- `npm run lint:md`・`npm run lint:fm` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
