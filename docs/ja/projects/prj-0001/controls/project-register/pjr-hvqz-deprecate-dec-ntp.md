---
specdojo:
  id: prj-0001:pjr-hvqz-deprecate-dec-ntp
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: easy
  owner: BA
  registered_at: "2026-11-18T11:04:45Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-3VJM
    - PJR-ANKZ
---

# PJR-HVQZ 決定記録（dec）と移行テスト計画（ntp）の型を非推奨にする

## 1. 概要

PJR-3VJM と PJR-ANKZ の決定に従い、dec の型を登録簿の decision へ、ntp の型を mtp-rulebook へ寄せて非推奨にし、参照元を後継へ向ける

## 2. 入力

- 利用者の決定（2026-11-18）: PJR-3VJM と PJR-ANKZ はどちらも推奨の A を採る
- orchestrator の調べ（2026-11-18）: dec と ntp の型のファイルは rulebook と sample だけ。ほかの参照元は pm-review-viewpoints.yaml・dss-sample（dec のみ）・yaml-pages のテストの snapshot（specdojo--pm-review-viewpoints.md.snap）

## 3. 完了条件

- PJR-3VJM と PJR-ANKZ の決定（どちらも案 A）に従い、`dec-rulebook.md`・`dec-sample.md` と `ntp-rulebook.md`・`ntp-sample.md` の frontmatter の `status` を `deprecated` にする。本文の先頭に、非推奨であることと後継（dec は登録簿の decision、ntp は `mtp-rulebook`）を 1 段落で書く。
- 型のファイルは消さない（消すのは次の版以降で、別の項目で扱う）。
- 入力に挙げた参照元（`pm-review-viewpoints.yaml`、`dss-sample` の dec の参照、yaml-pages のテストの snapshot）を後継へ向ける。ほかに参照元が見つかった場合も後継へ向け、個票の対応結果に一覧を書く。
- `npm run validate:schema` と `npm run lint:md`・`npm run lint:fm` が通る。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。
- 親の検証が通る。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
