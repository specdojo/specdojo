---
specdojo:
  id: prj-0001:pjr-0122-review-launch
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: note
  item_status: done
  priority: medium
  owner: PO
  due_on: "2026-07-31"
  completed_at: "2026-07-26T12:00:00Z"
  conclusion: 改善点を一通り反映
  register_events:
    - v: 1
      id: reg_ce7b5d9876f2672e9cbd061ec75d197b
      ts: "2026-07-25T10:10:47Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "refactor(docs): 横断ディレクトリをプロジェクト直下へ移動"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: launch trackの振り返り
        - field: description
          from: ""
          to: _TODO_
        - field: type
          from: ""
          to: note
        - field: priority
          from: ""
          to: medium
        - field: owner
          from: ""
          to: _TODO_
        - field: registered
          from: ""
          to: _TODO_
        - field: due
          from: ""
          to: _TODO_
        - field: completed
          from: ""
          to: "-"
        - field: conclusion
          from: ""
          to: "-"
        - field: block_reason
          from: ""
          to: "-"
      legacy_commit: 393767768e66c987bff6cfac9914f208620e9166
    - v: 1
      id: reg_6b692b43509445c1764b14c504e0ee12
      ts: "2026-08-09T10:55:22Z"
      action: close
      actor: SpecDojo Test
      from_status: open
      to_status: done
      reason: "exec(register PJR-9P5Q): 既存登録項目を個票 frontmatter へ一括移行する"
      changes:
        - field: status
          from: open
          to: done
        - field: description
          from: _TODO_
          to: workflowの改善点を振り返りまとめる。
        - field: owner
          from: _TODO_
          to: PO
        - field: due
          from: _TODO_
          to: "2026-07-31"
        - field: conclusion
          from: "-"
          to: 改善点を一通り反映
      legacy_commit: dbac152079df02ec9bbad154a3253c043e10655a
      previous_event_id: reg_ce7b5d9876f2672e9cbd061ec75d197b
    - v: 1
      id: reg_29ba8ae22f13fea9aa27a11f922e69d0
      ts: "2026-08-09T14:39:40Z"
      action: update
      actor: SpecDojo Test
      from_status: done
      to_status: done
      reason: "exec(register PJR-EQAQ): 登録簿日時をregistered_at・completed_atへ移行する"
      changes:
        - field: completed
          from: "-"
          to: "2026-07-26"
      legacy_commit: 38201bef867f3cc1454db6b748fc979ed3f2fa8f
      previous_event_id: reg_6b692b43509445c1764b14c504e0ee12
---

# PJR-0122 launch trackの振り返り

## 1. メモ

workflowの改善点を振り返りまとめる。

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

1. exec run --autoのparallel時に時間がかかるagentに引っ張られないよう、agentのタスクが完了したら次のagentを起動できるようにする。
2. exec run --registerを別worktreeで実行できるようにして、並行実行できるようにする。
3. exec run --registerで複数のidを指定して順次実行できるようにする。commitはid毎に実行する/実行しないをオプションで指定できるようにする。
4. exec run --autoで実行してclaudeやcodexの利用制限で止まってしまうケースは、再開見込み時間を記録して、定時起動のroutineですくい上げて再実行する。

#### 1.3.5. リファクタリング

`controls` / `execution` / `reporting` / `routines` / `schedule` をプロジェクト直下へ移動する。
これらは全ドメインの成果物を対象とするため、`030-project-management` 配下という配置が実態と合っていなかった。
`NNN-` を外す案は、配置のスコープ不整合が残るため採らない。

成果物カタログ上の分類は変更しない。分類の正本は `dct-<domain>.yaml` の `domain` であり配置とは独立なので、
`controls` / `schedule` / `reporting` は `dct-project-management.yaml` が引き続き管理する。
あわせて `specdojo:docs-structure-guide` の番号付与規約を、実態と食い違っていた「番号なし = カタログ管理対象外」から
「番号あり = 改訂される計画文書ツリー / 番号なし = 全ドメイン横断の台帳・記録・実行状態」へ改めた。

## 2. 背景・文脈

launch trackが終了して、効率的にできた部分・できなかった部分があったため、workflowを見直す。

## 3. フォローアップ

- 対策案「executionがhuman時にplanをつくるか」の実装を [[prj-0001:pjr-0124-human-plan-integrate-result|PJR-0124]] として起票した。
- 対策案「complete, commit, pushの関係」のうち PR ベース承認フローの整備を [[prj-0001:pjr-0126-pr-based-po-approval|PJR-0126]] として起票した。
- 対策案「品質の上げ方」の各改善ポイントを [[prj-0001:pjr-0127-clarify-project-why|PJR-0127]] から [[prj-0001:pjr-0133-cross-deliverable-dedup-pass|PJR-0133]] として起票した。
- 対策案「リファクタリング」はコミット 39376776 で実装済み。別項目は起票しない。
- 対策案「自動化の改善」は未着手。本項目に残す対策のため、close はこれを検討・確定した後に行う。

## 4. 関連ドキュメント

- [[prj-0001:pjr-0124-human-plan-integrate-result|human実行時のplan非生成とresultへの統合]]
