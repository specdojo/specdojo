---
specdojo:
  id: prj-0001:pjr-sef2-kata-wave-6-project-catalog-schedule
  type: project
  status: deprecated
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: rejected
  priority: medium
  difficulty: hard
  owner: BA
  registered_at: "2026-11-23T01:46:32Z"
  due_on: "2026-11-30"
  completed_at: "2026-11-23T03:24:52Z"
  conclusion: 第 4〜6 波の strategy は PJR-BHFG にまとめて作る（dct-kata.yaml を同時に書き換えてぶつかるため）
  derived_from:
    - PJR-G1M8
    - PJR-8X86
  depends_on:
    - PJR-52MP
  commit_type: chore
  commit_scope: schedule
---

# PJR-SEF2 第 6 波（プロジェクト）の kata ドメインと strategy・schedule を用意する

## 1. 概要

PJR-G1M8 の 8 種類の sample を dct-kata.yaml に足し、sch-strategy-kata-wave-6-project.yaml を作って track を生成する

## 2. 入力

- PJR-8X86 の観測（2026-11-23）: 2026-11-21 の型の grade のし直しで pass でなかった文書のうち 69 文書が手付かずで、第 4〜6 波には strategy と track がない。第 4 波 → 第 5 波 → 第 6 波の順に進める（利用者の依頼、2026-11-23）

## 3. 完了条件

- `dct-kata.yaml`（PJR-VCER で作った kata ドメイン）に、PJR-G1M8 の型（prj-charter・prj-issues-and-approach・prj-overview・prj-scope・prj-stakeholder-register・prj-success-criteria-and-acceptance-criteria・pm-communication-plan・pm-members）の sample を成果物として足す。`local_id` は `<name>-sample`、`rulebook` は対応の型とし、sample のない型は、作るか対象から外すかを個票の対応結果に書く。
- PJR-8X86 にある「どの epic の一覧にも名前がない手付かずの型」（cnd・dct・dmd・opd・otp・pm-change-request-log・pm-issue-log・pm-risk-register・stsd）のうち、この波の範囲に合うものを足すかを決め、理由を個票の対応結果に書く。
- 各成果物の `done_criteria` は、型に共通の条件（rulebook の章立てと必須の表に沿う、sample の作成標準と共通のサンプル文脈に沿う、rulebook の禁止事項に当たらない）を基本にし、型に固有の条件だけを足す。
- `docs/ja/projects/prj-0001/schedule/sch-strategy-kata-wave-6-project.yaml` を作り、`schedule build --track kata-wave-6-project` で `sch-track-kata-wave-6-project.yaml` を生成する。track は手で編集しない。
- 段は第 3 波（`sch-strategy-kata-wave-3.yaml`）にそろえる（rulebook を簡潔に → sample を厚く → condense → review → 人の確定）。recipe・template のある型は、rulebook に合わせて recipe・template を直す段を足す。型そのもの（rulebook と sample の組）を grade する段を review の前に足す。
- 段の説明に、PJR-76N9 の決まり（成果物と sample の本文に文書の役割の割り当てと承認の進み具合を書かない。RACI・体制など文書の中身として役割を扱う型は対象外）を最初から入れる（PJR-325Y で第 3 波に足した書き方にそろえる）。
- prj-charter は PJR-SV9G などで直し済みのため、直した内容を活かし、段を軽くするかを決める。
- 段ごとの agent は strategy の `phase_overrides[].agent` で決める。edit の段は `opus-executor`、review の段は `opus-review-executor`、reporter は `gemma26-reporter`、人の確定は利用者とする。
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
