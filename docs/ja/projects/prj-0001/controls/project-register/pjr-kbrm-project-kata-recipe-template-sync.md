---
specdojo:
  id: prj-0001:pjr-kbrm-project-kata-recipe-template-sync
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: hard
  owner: sol-executor
  registered_at: "2026-11-13T09:41:10Z"
  derived_from:
    - PJR-960C
  commit_type: docs
  commit_scope: kata
---

# PJR-KBRM プロジェクトの型 7 種類の recipe と template を、改訂した rulebook に合わせる

## 1. 概要

PJR-960C で改訂した rulebook に、recipe と template を合わせ、grade で出た sample の指摘も直す

## 2. 入力

- PJR-960C の schedule に recipe と template の手直しの段がなく（orchestrator の作りの誤り）、改訂後の grade（2026-11-13）で rulebook の指摘の多くが recipe・template との食い違いだった。indie が直すことを承認した

## 3. 完了条件

- 対象は 7 種類の型（pm-plan・pm-organization・pm-roles・pm-raci・pm-quality-management-plan・prj-assumptions-constraints-dependencies・prj-comparison-of-alternatives）の `docs/ja/specdojo/recipes/` と `docs/ja/specdojo/templates/` の recipe と template。
- recipe と template が、PJR-960C で改訂した rulebook（必須の章・項目・表の列名・禁止事項・判断の基準）と食い違わない。rulebook を正本とし、recipe は問いと作成の手順に、template は骨組みに責務を絞る。rulebook の規則を recipe や template で独自に再定義しない。
- 改訂後の grade（`execution/grade/results/specdojo.<型>-rulebook.yaml` と `-sample.yaml`、2026-11-13）の指摘を読み、直している。少なくとも次を含む。
  - pm-roles: recipe が schema で必須の `rulebook` のキーを禁じている点。
  - pm-raci: recipe と template が、改訂した担当の決まり（Schedule の owner の優先順など）と固定の Role 列の表記に合っていない点。
  - pm-quality-management-plan: rulebook で必須にした項目（対象期間・人と AI の境界・出口条件・証跡・記録先など）と列の分け方が、template と sample に合っていない点。
  - pm-plan: 前提の成果物の依存（カタログの雛形の `depends_on` との整合）と、recipe の確かめ方と表の欄の不一致。sample の成功基準 SC-04 の基準値の測り方を、運用の前に置く点。
  - pm-organization: recipe・template が必須のロールの一覧に追いついていない点。sample の名簿に BA・DEV・QE の担当がいない点。
  - prj-assumptions-constraints-dependencies・prj-comparison-of-alternatives: grade が上限で流れていないため、前回の grade の指摘と、rulebook との食い違いを確かめて直す。
- rulebook を直す必要が出た場合は最小限にし、理由を個票の対応結果に書く。代表の文書（prj-0001 の同名の文書）は変えない。sample は駄菓子屋の共通サンプル文脈を保つ。
- YAML の template・sample は schema に合っている（`npm run validate:schema:file`）。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分と行の文案で書いている（PJR-EPQ3）。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema` と親の検証が通っている。grade は統合の後に orchestrator が流す。grade を流せないことを理由に未完了としない。

## 4. 作業内容

| No  | 作業                               | 担当         | 状態 | メモ |
| --- | ---------------------------------- | ------------ | ---- | ---- |
| 1   | recipe・template・sample を直す    | executor     | open | -    |
| 2   | 統合の後に 7 種類の grade を流す   | orchestrator | open | -    |
| 3   | 確定の段（`T-PROJECT-KATA-*-140`） | indie        | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-960c-project-kata]]
