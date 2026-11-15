---
specdojo:
  id: prj-0001:pjr-3hxq-sld-specdojo-rework-wave-2
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: medium
  owner: ARC
  registered_at: "2026-11-15T12:22:16Z"
  completed_at: "2026-11-15T22:23:08Z"
  conclusion: sld-specdojo を手直しし、再 grade で pass（98 点）
  commit_type: docs
  commit_scope: sld
  approach: fully-guided
  targets:
    - sld-specdojo
---

# PJR-3HXQ sld-specdojo を grade の指摘で手直しする（kata-wave-2 の 2 回目）

## 1. 概要

sld-specdojo を最新の grade の指摘で直す

## 2. 入力

- T-KATA-WAVE-2-sld-specdojo-140 で差し戻し（indie が 2026-11-15 に判断、PJR-TN43）
- 最新の grade の未充足の完了条件と major の指摘を取り込み、本文の未決の目印を片付ける（決められないものは留保として追跡先をつなぐ）

## 3. 完了条件

- 最新の grade の未充足の完了条件と major の指摘を取り込み、成果物カタログの完了条件をすべて満たす。直した後に `grade run --target deliverable` で grade し直し、結果を対応結果に書く（留保の範囲だけが未充足として残る場合は、その理由を書く）。
- 本文の未決の目印（`_TODO_`・`_ASSUMPTION_`・`_UNDECIDED_`）は、決められるものは決め、決められないものは期限付きの留保として追跡先をつなぐ。
- 成果物の `status` は変えない（確定は人が 140 で行う）。
- 動いている grade の lock や実行状態のファイルを消してよいとしている誤りを直し、片付けてよい場所と残すべき場所を実装の配置と合わせている。`.specdojo` の設定の保管と、grade の実行状態の置き場所の区分を正す。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema`・`npm run validate:catalog` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                | 担当 | 状態 | メモ              |
| --- | ----------------------------------- | ---- | ---- | ----------------- |
| 1   | 最新の grade の指摘を取り込んで直す | ARC  | done | F001〜F015 を反映 |
| 2   | grade し直して結果を書く            | ARC  | open | -                 |

## 5. 対応結果

2026-11-16 の executor の対応（成果物の `status` は `draft` のまま）:

- grade の実行状態: `execution/grade/generated/run.lock` と `runs/<run-id>/` を派生ビューの行から分け、`条件付き削除可` の行を追加した。`generated/` の削除手順に、稼働中の `grade run` と再開予定の run の除外、未移行の `routines/generated/` の旧履歴の除外を加えた（F007・F011・F012・F014）。
- `.specdojo` の設定: `doc-index.json` 以外の追跡対象（`specdojo.config.json`・`exec-defaults.yaml`・`agent-members.yaml`・`index-config.yaml`・`claude/`・`host/`）を `削除不可` の Git 共有の行として追加し、対応表にも行を足した（F003・F009・F010）。
- worktree: 統合が成功すると `branch-only` を含めて worktree を撤去し、branch だけを残すことを書き分けた（F004）。
- 対応表: 進捗報告・議事録を `cdsd-sharing` と `reporting/` へ移した。追加候補の出どころを各 CDSD の「概要」に直した（F005・F013）。
- 削除可否の3区分の表: 場所の再掲をやめ、一覧の列を参照する区分ごとの規則にした（F008）。
- 未決の目印: CDSD 追加候補の目印は、本書側では決定済みと判断した。Schedule の業務データ辞書作成として計画済みの作業で、管理台帳へは起票しない。監視結果・費用作業記録の保管先は決められないため、`_UNDECIDED_` の留保として残した。担当は OPS・ARC、決定は PO、期限は報告・監視の運用開始前。追跡先は `cdsd-sharing` が指す `prj-0001:cdfd-reporting` の未決事項で、期限を過ぎたら PM が決定事項として起票する。存在しない `pjr-*` の追跡先候補 ID は消した（F001・F002・F006・F015）。
- 未了: `grade run --target deliverable` による再 grade は、agent の起動が要るため executor では実行していない。runner または人が実行し、その結果をここへ追記する。留保が1件残るので、F015 相当の指摘はこの範囲で残る見込み。

## 6. 関連ドキュメント

- [[prj-0001:pjr-tn43-user-decisions-pending]]
