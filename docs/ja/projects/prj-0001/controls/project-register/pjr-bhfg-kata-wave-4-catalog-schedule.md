---
specdojo:
  id: prj-0001:pjr-bhfg-kata-wave-4-catalog-schedule
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: hard
  owner: BA
  registered_at: "2026-11-23T01:46:11Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-HJ3H
    - PJR-JZ2F
    - PJR-G1M8
    - PJR-SBGQ
    - PJR-PYS2
    - PJR-8X86
  commit_type: chore
  commit_scope: schedule
---

# PJR-BHFG 第 4〜6 波の kata ドメインと strategy・schedule をまとめて用意する

## 1. 概要

第 4〜6 波の型の sample を dct-kata.yaml に足し、波ごとの strategy と track を作る。型ごとの段の鎖を並べて流せるようにし、人の確定は横串の確認に回す

## 2. 入力

- PJR-8X86 の観測（2026-11-23）: 2026-11-21 の型の grade のし直しで pass でなかった文書のうち 69 文書が手付かずで、第 4〜6 波には strategy と track がない。第 4 波 → 第 5 波 → 第 6 波の順に進める（利用者の依頼、2026-11-23）

## 3. 完了条件

- 第 4〜6 波（PJR-HJ3H・PJR-JZ2F・PJR-G1M8・PJR-SBGQ・PJR-PYS2）の型の sample を、`dct-kata.yaml`（PJR-VCER で作った kata ドメイン）に成果物として足し、波ごとに strategy を作って track を生成する（`sch-strategy-kata-wave-4.yaml`・`-wave-5`・`-wave-6-project`・`-wave-6-design`・`-wave-6-notation`）。track は手で編集しない。5 件の todo をこの項目にまとめた（PJR-52MP・PJR-SEF2・PJR-AXNG・PJR-0TDG は取り下げ、利用者の決定、2026-11-23、indie）。
- 対象の型は各 epic の入力の一覧のとおり。sample のない型は、作るか対象から外すかを個票の対応結果に書く。PJR-8X86 にある「どの epic の一覧にも名前がない手付かずの型」（cnd・dct・dmd・opd・otp・pm-change-request-log・pm-issue-log・pm-risk-register・stsd）を、どの波に入れるか（または入れないか）を決め、理由を個票の対応結果に書く。
- 並べて流せる組み方にする（利用者の決定、2026-11-23）。第 3 波は `dct-kata.yaml` の `depends_on`（例: `utc-index-sample` → `tsp-index-sample`）で型が一列につながり、1 種類ずつ順に流れて遅かった。`depends_on` は sample が本文で実際に参照する関係だけにし、型ごとの段の鎖（rulebook を簡潔に → sample を厚く → condense → review）が互いに待たずに並べて流れるようにする。足した `depends_on` の一覧と理由を個票の対応結果に書く。
- 段は rulebook を簡潔に → sample を厚く → condense → 型の grade（rulebook と sample の組） → review とする。人の確定（finalize の段）は各波の track に入れない。人の確定は、sample がひととおりそろった後の横串の確認でまとめて行う（利用者の決定、2026-11-23）。recipe・template のある型は、rulebook に合わせて recipe・template を直す段を足す。
- 段の説明に、PJR-76N9 の決まり（成果物と sample の本文に文書の役割の割り当てと承認の進み具合を書かない。RACI・体制など文書の中身として役割を扱う型は対象外）を最初から入れる（PJR-325Y で第 3 波に足した書き方にそろえる）。
- 段ごとの agent は strategy の `phase_overrides[].agent` で決める。rulebook を簡潔にする段と sample を厚くする段は `opus-executor`、condense の段は `sonnet-executor`、review の段は `sonnet-review-executor`（2026-11-24 からは `sol-review-executor` も使える）、reporter は `gemma26-reporter` とする（利用者の決定、2026-11-23）。
- 代表は sample（駄菓子屋の共通の文脈）とする（PJR-6998）。性能や可用性の目標、移行の対象など、利用者が決める値は推測で埋めず `_UNDECIDED_` で残すよう段の説明に書く。決める必要のある値の一覧を個票の対応結果に書く。
- prj-charter（PJR-SV9G など）と ifx-api・ifx-msg（PJR-AEKE）は直し済みのため、段を軽くするか対象から外すかを決め、理由を個票の対応結果に書く。
- この項目では schedule のタスクを実行しない。
- `npm run validate:schema`（strategy と track の YAML の `task_suffix` などの文字列が数値に変わっていないことを含む）・`npx specdojo catalog validate`・`npx specdojo exec validate`・`npm run lint:md` を通し、親の検証を通す。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、影響がなければ「なし」と書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` など）は変えない。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
