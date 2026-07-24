---
specdojo:
  id: prj-0001:pjr-0122
  type: project
  status: draft
  rulebook: pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: note
---

# PJR-0122 launch trackの振り返り

## 1. メモ

### 1.1. 事実・コメント

- exec run --autoで実行した場合に、夜中に利用制限が来て止まってしまうケースがあった。
- exec run --autoがiterationのタイミングの一番時間のかかるagentに引っ張られて次が実行できない。
- bootstrap-finalizeでplanを作っているが結局planを参照しなかった。
- bootstrap-finalizeでresultに確認のチェックを入れたが、機械的なチェックになってしまった。
- prj-charterの承認でdecisionを起票したが、必要だったか？
- completeとcommit, pushと確定行為を3回もやる必要があるか？
- exec run --autoを作ったが、対話型で考えながら進めることが多かった。routineをworkflowに組み込む必要あり。
- agentが一文書単位で生成していったが、文書間で重複した記述、論点がずれた記述が多く生成された。
- exec run --autoで作った文書を最後のbootstrap-finalizeフェーズで論点をフォーカスし、重複した記述を削除する作業をagentに多数依頼した。
- レビューしても面白くない文章が多く生成された。ロジカルではあるが内容のない文章。
- 最後の段階で、ターゲットをCivicTechに絞ったら文章がよくなり始めた。
- 一方でターゲットをCivicTechに絞っても、当初は論点が矮小化されたため、プロジェクト概要の必要性を3点に明確化したら、以降はagentがいい文章を書くようになった。
- 文書間の整合性取りは人がやるより、agentに依頼したほうが早いし正確。たまに間違いや抜けがあるが人間よりは高品質。
- 1 成果物、1 taskの前提で構築したが、1 taskで複数成果物生成も必要そう。

## 2. 背景・文脈

launch trackが終了して、効率的にできた部分・できなかった部分があったため、workflowを見直す。

## 3. フォローアップ

_TODO_: 対応が必要な場合は内容を記載する。参照のみの場合は `-` とする。

## 4. 関連ドキュメント

- _TODO_
