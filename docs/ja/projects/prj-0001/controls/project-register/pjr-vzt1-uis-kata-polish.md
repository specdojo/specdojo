---
specdojo:
  id: prj-0001:pjr-vzt1-uis-kata-polish
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: hard
  registered_at: "2026-11-10T12:44:22Z"
  derived_from:
    - PJR-T88P
  autopilot: approved
  approach: rulebook-maintenance
  targets:
    - specdojo:uis-rulebook
---

# PJR-VZT1 画面仕様（uis）の型を、標準の章立てと中身の厚さに磨き込む

## 1. 概要

uis-rulebook と uis-sample を、ほかの業務仕様の型と同じく標準の章立て、記述ガイドの判断の基準と良い例・悪い例、clis-sample 程度の厚さの sample に磨き込み、grade を通す

## 2. 入力

- uis の代表は今回作らなかった（SpecDojo に GUI がないため、PJR-RMMM）が、型は磨き込んでおく（indie の要望、2026-11-10）。夜間に流す。
- 保存済みの grade は uis-rulebook が needs-work 83（2026-10-10）、uis-sample が fail 54（2026-10-20）で、どちらも PJR-X3T8 で GUI だけにした後（2026-11-08）の評価ではない。

## 3. 完了条件

- [[specdojo:uis-rulebook]] を、[[specdojo:rulebook-authoring-standard]] の章立てに合わせている。rulebook にサンプルの章を置かず、`##` から `####` の見出しに連番を付けている。
- 記述ガイドに、章（概要・対象ユーザー/利用目的・表示項目・操作・遷移・バリデーション・エラー表示と利用者の次の手）ごとの判断の基準と、良い例・悪い例を書いている。
- `uis-sample` を、駄菓子屋の販売管理システムの GUI の画面の完成例として、[[specdojo:clis-sample]] 程度の厚さにしている。規則の必須の項目をすべて満たしている。
- GUI の画面仕様だけを対象とし、CLI は clis で書く、ワイヤーフレーム・レイアウトは含めない、という今の決まり（PJR-RMMM・PJR-PJYJ）を保っている。
- recipe と template の要否を決め、frontmatter に書いている。
- 磨き込みの後に `specdojo grade run --project prj-0001 --target kata --path docs/ja/specdojo/rulebooks/uis-rulebook.md --path docs/ja/specdojo/samples/uis-sample.md --run-id <任意>` を流し、rulebook と sample がどちらも pass になっている。pass にならない指摘は直すか、直さない理由を個票の対応結果に書いている（grade を流すのは orchestrator が行ってもよい）。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- uis 以外の型と、カタログを変えていない。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分と行の文案で書いている（PJR-EPQ3）。
- `npm run lint:md`・`npm run lint:fm`・`npm run test:unit` が通っている。

## 4. 作業内容

| No  | 作業                                         | 担当   | 状態 | メモ |
| --- | -------------------------------------------- | ------ | ---- | ---- |
| 1   | 今の uis の型と、標準・clis の型を読み比べる | _TODO_ | open | -    |
| 2   | rulebook と sample を磨き込む                | _TODO_ | open | -    |
| 3   | 検査と grade を流し、対応結果に書く          | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- 親: [[prj-0001:pjr-t88p-business-specs-kata]]
- 対象: [[specdojo:uis-rulebook]]
- 手本: [[specdojo:clis-rulebook]]
