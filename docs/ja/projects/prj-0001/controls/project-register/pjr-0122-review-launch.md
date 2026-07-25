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
- exec run --autoのcommitの履歴が長くなる
- review-viewpointsが細かくてこちらに引っ張られて文書が作成されいないか。

### 1.2. 対策の方針

1. 生産性：省略できる作業は省略する
2. 品質：横断レビューで重複削除、論点を明確にする章構成
3. 自動化：1 taskで複数成果物（品質にも寄与）、autoの改善とroutine化

### 1.3. 対策案

#### 1.3.1. complete, commit, pushの関係

- ３回も確定行為を行うのはやや面倒だが、各々意味合いが違う、commitはpre-commitが走って失敗する可能性もあることから3つを分ける。
- prj-charterの承認のような作業については、pull requestベースの承認フローを運用で整備する
  1. decisionを起票
  2. pull requestを実行
  3. POがpull requestを承認する

#### 1.3.2. executionがhuman時にplanをつくるか

人手で実行する場合は、planは読まずにresultだけで確認していたことから、planはhuman時には作らずにresultに統合。また、resultのチェックも最低限に限定。

#### 1.3.3. 品質の上げ方

改善ポイントは以下の３つ

1. 論点を明確に
   - recipeを改善する（why, what, howの順番に書く）
   - review viewpointsに追加する（whyは明確か）
   - prj-overviewの記述を磨いて、全てのドキュメント生成時に参照するようにする
2. 簡潔に記述する
   - recipeを改善する(箇条書きの行数や文章の長さのガイドを加える)
   - review viewpointsに追加する
3. 重複記述をなくす
   - bootstrap-passの後に、成果物間の重複を調整する、横断passを設ける

#### 1.3.４. 自動化の改善

#### 1.3.5. リファクタリング

`controls` / `execution` / `reporting` / `routines` / `schedule` をプロジェクト直下へ移動する。
これらは全ドメインの成果物を対象とするため、`030-project-management` 配下という配置が実態と合っていなかった。
`NNN-` を外す案は、配置のスコープ不整合が残るため採らない。

成果物カタログ上の分類は変更しない。分類の正本は `dct-<domain>.yaml` の `domain` であり配置とは独立なので、
`controls` / `schedule` / `reporting` は `dct-project-management.yaml` が引き続き管理する。
あわせて `docs-structure-guide` の番号付与規約を、実態と食い違っていた「番号なし = カタログ管理対象外」から
「番号あり = 改訂される計画文書ツリー / 番号なし = 全ドメイン横断の台帳・記録・実行状態」へ改めた。

## 2. 背景・文脈

launch trackが終了して、効率的にできた部分・できなかった部分があったため、workflowを見直す。

## 3. フォローアップ

- 対策案「executionがhuman時にplanをつくるか」の実装を [[prj-0001:pjr-0124-human-plan-integrate-result|PJR-0124]] として起票した。
- 対策案「complete, commit, pushの関係」のうち PR ベース承認フローの整備を [[prj-0001:pjr-0126-pr-based-po-approval|PJR-0126]] として起票した。
- 対策案「品質の上げ方」の各改善ポイントを [[prj-0001:pjr-0127-clarify-project-why|PJR-0127]] から [[prj-0001:pjr-0133-cross-deliverable-dedup-pass|PJR-0133]] として起票した。
- 対策案「リファクタリング」はコミット 39376776 で実装済み。別項目は起票しない。
- 対策案「自動化の改善」は対策未確定のため、後続の振り返りで扱う。

## 4. 関連ドキュメント

- [[prj-0001:pjr-0124-human-plan-integrate-result|human実行時のplan非生成とresultへの統合]]
