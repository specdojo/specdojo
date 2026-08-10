---
specdojo:
  id: prj-0001:pjr-rg7c-reporter-result-generation
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-08-10T06:28:44Z"
  due_on: "2026-08-31"
---

# PJR-RG7C reporterステージとresult生成を実装する

## 1. 概要

reporterへplanとevidenceを引き渡し、厳格な構造化出力を検証してからrunnerがfrontmatterとresult Markdownを決定的に生成する。

## 2. 完了条件

- reporter に plan、evidence、必要最小限の差分情報を入力し、成果物の再編集なしで結果を要約できる。
- reporter 出力を厳格な JSON スキーマで検証し、不正な出力を result へ反映しない。
- runner が管理する frontmatter と reporter の構造化出力から result Markdown を決定的に生成できる。
- reporter の形式エラーは reporter だけを再試行し、executor の成果と evidence を再利用できる。
- 生成した result が frontmatter 検証と Markdown lint を通過する。

## 3. 作業内容

| No  | 作業                                        | 担当 | 状態 | メモ                             |
| --- | ------------------------------------------- | ---- | ---- | -------------------------------- |
| 1   | reporter の入力契約と出力 JSON を定義する   | ARC  | open | 生ログ全体は渡さない             |
| 2   | reporter 起動と構造検証を実装する           | ARC  | open | 形式エラーを明示する             |
| 3   | result の決定的レンダラーを実装する         | ARC  | open | frontmatter は runner が所有する |
| 4   | reporter 単独リトライと検証テストを追加する | ARC  | open | executor は再実行しない          |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-jxv7-executor-evidence-collection]]
- [[specdojo:plan-result-lifecycle-guide]]
- [[specdojo:exec-operation-guide]]
