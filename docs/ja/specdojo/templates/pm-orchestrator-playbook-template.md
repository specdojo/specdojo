---
specdojo:
  id: specdojo:pm-orchestrator-playbook-template
  type: template
  status: draft
  frontmatter_template:
    specdojo:
      id: _PROJECT_ID_:pm-orchestrator-playbook
      type: project
      status: draft
      rulebook: specdojo:pm-orchestrator-playbook-rulebook
      supersedes: []
---

# _PROJECT_NAME_ のオーケストレーター運用メモ

## 1. 目的と適用範囲

_TODO_: 対象プロジェクトと、配布するオーケストレーターの指示の本文（本体）に従う範囲・本書が加える範囲を書く。一般的な進め方は再掲しない。

- _TODO_: 記述の根拠にした運用の期間か版と、書き直す条件を書く。

## 2. agent の使い分けと癖

_TODO_: 難しさごとの既定の振り分けの正本（設定ファイル）を参照し、使わない agent とその理由を書く。値は再掲しない。

| agent            | 癖・制約 | 対応   |
| ---------------- | -------- | ------ |
| _AGENT_NICKNAME_ | _TODO_   | _TODO_ |

## 3. 実行の運び方

_TODO_: 列の組み方を書く。起動の例を 1 つ示す。

```bash
_TODO_
```

- _TODO_: 並べる本数の上限と根拠、直列にする作業（文書サイトのビルド、grade など）、列の予約の仕方を書く。回避策には直す側の項目 ID を添える。

## 4. 止まったときの再開

| 止まり方 | 原因の例 | 再開の仕方 |
| -------- | -------- | ---------- |
| _TODO_   | _TODO_   | _TODO_     |

## 5. close の前の確かめ方

_TODO_: 統合の後に自分で確かめることを、対象の項目の条件・流すもの・見る結果の組で書く。executor が `requires_human` と報告した検証の扱いを含める。

## 6. 保護された設定の扱い

_TODO_: agent が書けない設定の範囲（正本の設定を参照）と、変更が要るときの経路（変更案の置き場所、承認、反映の仕方）を書く。

## 7. 登録簿項目の完了条件の書き方

_TODO_: 任意。並べて流すときの衝突を避ける完了条件の書き方の決まりを書く。書くことがなければ章を消し、番号を詰める。

## 8. 落とし穴

- _TODO_: 任意。ほかの章に属さない、起きた事例と避け方を書く。書くことがなければ章を消し、番号を詰める。

## 9. リリースの手順

_TODO_: 成果物を公開・配布するプロジェクトでは必須。公開・配布しなければ章を消し、番号を詰める。

1. _TODO_: 各手順に、次へ進む条件を添える。

## 10. _PROJECT_SPECIFIC_CHAPTER_

_TODO_: 任意。別の project との分担、定期の検査など、プロジェクトに固有の章を置く。なければ章を消す。

- _UNDECIDED_: 未確定の決まりがあれば、決まるまでの扱いを添える。
