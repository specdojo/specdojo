---
specdojo:
  id: prj-0001:pjr-hvqz-deprecate-dec-ntp
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
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

| No  | 作業                                                                                                                                        | 担当 | 状態 | メモ                                                             |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------- | ---- | ---- | ---------------------------------------------------------------- |
| 1   | `dec-rulebook.md`・`dec-sample.md` の `status` を `deprecated` に更新し、本文先頭に非推奨告知と後継（登録簿の decision）を記載（cstd 準拠） | BA   | done | 後継は `[[specdojo:pjr-rulebook\|プロジェクト登録簿作成ルール]]` |
| 2   | `ntp-rulebook.md`・`ntp-sample.md` の `status` を `deprecated` に更新し、本文先頭に非推奨告知と後継（`mtp-rulebook`）を記載（cstd 準拠）    | BA   | done | 後継は `[[specdojo:mtp-rulebook\|移行テスト計画 作成ルール]]`    |
| 3   | `dss-sample.md` の dec 参照を登録簿の decision（個票）へ向ける                                                                              | BA   | done | 8.2 の 4・8.3 の例外判断表および説明文を更新                     |
| 4   | `pm-review-viewpoints.yaml` および snapshot の参照確認・判断                                                                                | BA   | done | confirmed_default の網羅性維持のため変更不要と判断               |
| 5   | 静的検査（lint・schema・typecheck・unit test）の確認                                                                                        | BA   | done | 親 runner の検証および手元検証が通過                             |

## 5. 対応結果

PJR-3VJM および PJR-ANKZ の決定（案 A）に従い、決定記録（dec）と移行テスト計画（ntp）の型（rulebook・sample）を非推奨化し、後継への案内を記載した。また既存の参照元である `dss-sample.md` の参照を後継へ更新した。

### 5.1. 実施内容と成果物

1. `dec-rulebook.md`（[[specdojo:dec-rulebook]]）および `dec-sample.md`（[[specdojo:dec-sample]]）:
   - frontmatter の `status` を `deprecated` に更新した。
   - 先行の `cstd-rulebook`・`cstd-sample` と同様の形式で、H1 に（非推奨）を付与し、本文先頭に非推奨告知と後継（プロジェクト登録簿の decision）への案内段落、および移行方針を記載した。
2. `ntp-rulebook.md`（[[specdojo:ntp-rulebook]]）および `ntp-sample.md`（[[specdojo:ntp-sample]]）:
   - frontmatter の `status` を `deprecated` に更新した。
   - 同様に H1 に（非推奨）を付与し、本文先頭に非推奨告知と後継（`mtp-rulebook` / `mtp-sample`）への案内段落、および移行方針を記載した。
3. `dss-sample.md`（[[specdojo:dss-sample]]）:
   - 8.2 節目 4「実装への採用」における記録先を `<project-id>:dec-<nnnn>-dss-baseline` から利用先のプロジェクト登録簿の decision（個票）へ更新した。
   - 8.3「変更・不適合・例外」の例外判断表および本文説明における記録先を `dec-rulebook` 準拠の `<project-id>:dec-...` からプロジェクト登録簿（[[specdojo:pjr-rulebook|プロジェクト登録簿作成ルール]]）の decision（個票）へ更新した。
4. `pm-review-viewpoints.yaml` および `tests/fixtures/yaml-pages/specdojo--pm-review-viewpoints.md.snap` の扱い（判断事項）:
   - 入力では参照元候補として挙げられていたが、`pm-review-viewpoints.yaml` の `document_kinds` における `specdojo:dec-rulebook` および `specdojo:ntp-rulebook` は、現存する全 rulebook ファイル（112件）を網羅判定するための `confirmed_default` の記録である。
   - 後継である `specdojo:pjr-rulebook` および `specdojo:mtp-rulebook` は既に `confirmed_default` に含まれている。
   - また完了条件 2 のとおり本タスクでは rulebook ファイル自体は削除せず非推奨として残すため、`pm-review-viewpoints.yaml` から削除すると `viewpoint-document-kinds-check`（PJR-VJP8）で未判定（`undecided`）エラーとなる（先行の `cstd-rulebook` も非推奨化後も `confirmed_default` に維持されていることと整合する）。
   - したがって、`pm-review-viewpoints.yaml` および派生テスト snapshot は変更不要と判断した。

### 5.2. CHANGELOG に書く事項

- 区分: 変更
- 行の文案: 決定記録（dec）と移行テスト計画（ntp）の型（rulebook・sample）を非推奨にし、後継（dec は登録簿の decision、ntp は mtp-rulebook）への移行方針を明記した。また dss-sample の dec 参照を登録簿の decision へ向けた。

### 5.3. 残課題

なし。型の物理ファイル削除は次期版以降の別項目で扱う。

## 6. 関連ドキュメント

- [[prj-0001:pjr-3vjm-dec-deprecation|PJR-3VJM]]
- [[prj-0001:pjr-ankz-ntp-mtp-overlap|PJR-ANKZ]]
- [[specdojo:dec-rulebook|dec-rulebook]]
- [[specdojo:dec-sample|dec-sample]]
- [[specdojo:ntp-rulebook|ntp-rulebook]]
- [[specdojo:ntp-sample|ntp-sample]]
- [[specdojo:pjr-rulebook|pjr-rulebook]]
- [[specdojo:mtp-rulebook|mtp-rulebook]]
- [[specdojo:mtp-sample|mtp-sample]]
- [[specdojo:dss-sample|dss-sample]]
