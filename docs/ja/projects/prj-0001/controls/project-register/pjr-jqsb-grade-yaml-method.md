---
specdojo:
  id: prj-0001:pjr-jqsb-grade-yaml-method
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: medium
  registered_at: "2026-11-10T12:38:14Z"
  derived_from:
    - PJR-V05D
---

# PJR-JQSB YAML の成果物を grade で評価する方式を決める

## 1. 背景

review の段は grade の結果を前提にするため、YAML の成果物（業務データ辞書 bdd、外部 I/F の ifx-cmd など）の review が grade を流せずに止まる（PJR-V05D）。業務仕様の代表づくり（PJR-2GD6）と型の手入れ（PJR-T88P）で、bdd と ifx-cmd の review が 3 回止まった。grade が YAML を評価できる方式を決め、実装の todo につなげる。

## 2. 入力

- grade は src/grade/core.ts と src/shared/grade-result.ts で Markdown frontmatter を読み、YAML では Markdown frontmatter is required で止まる（2026-11-10 確認）。
- YAML のメタ情報は 2 通り: bdd などは最上位の id・type・status・rulebook、OpenAPI の形（ifx-api など）は x-spec-meta。validate:schema はどちらも読んでいる。
- 案: A（推奨）grade が YAML のメタ情報を validate:schema と同じ読み方で読み、YAML の本文をそのまま評価する。B yaml-pages の表示用 Markdown を評価する。C YAML は grade の対象外とし review は人が行う。indie は推奨（A）で起票するよう指示（2026-11-10）。

## 3. 検討した選択肢

| 選択肢    | 内容                                                                                                                                   | 利点                                                          | 懸念                                                                                                 |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| A（推奨） | grade が YAML のメタ情報を `validate:schema` と同じ読み方（最上位の項目か `x-spec-meta`）で読み、YAML の本文をそのまま評価の対象にする | 今の YAML の文書を変えずに済む。schema の検査と読み方がそろう | grade の実装に手が入る。結果のハッシュの取り方と、指摘の行番号の扱いを YAML に合わせる必要がある     |
| B         | yaml-pages が作る表示用の Markdown を評価する                                                                                          | grade の実装をあまり変えずに済む                              | 生成物を評価することになり、指摘の行番号が元の YAML と合わない。生成物を作り直すたびに結果が古くなる |
| C         | YAML の成果物は grade の対象から外し、review は人が行う決まりにする                                                                    | 実装が要らない                                                | review の段が毎回止まり、schedule を自動で流せない                                                   |

## 4. 決定内容

案 A を採る。

- grade は、YAML の成果物のメタ情報（`id`・`type`・`status`・`rulebook`）を、`validate:schema` と同じ読み方で読む。最上位の項目にあればそれを使い、OpenAPI の形では `x-spec-meta` を使う。
- 評価の対象は YAML の本文そのものとする。表示用に生成した Markdown は評価しない。
- 結果のハッシュは YAML のファイルの内容から取り、指摘の行番号は元の YAML の行を指す。
- Markdown の成果物の扱いは変えない。

## 5. 採択理由

- 今の YAML の文書を変えずに評価でき、schema の検査と読み方がそろう。
- 生成物を評価する案 B は、行番号の食い違いと結果の古さの問題が残る。
- 対象から外す案 C は、review の段が毎回止まり、schedule を自動で流せない。

## 6. 承認

| 項目     | 内容                                                                                     |
| -------- | ---------------------------------------------------------------------------------------- |
| 決定者   | indie                                                                                    |
| 決定日   | 2026-11-10                                                                               |
| 承認方式 | commit                                                                                   |
| 証跡     | この個票の close の commit（オーケストレーターとの対話で「A で決定してください」と回答） |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 7. 影響範囲とフォローアップ

| 項目       | 内容                                                                                                               |
| ---------- | ------------------------------------------------------------------------------------------------------------------ |
| 影響範囲   | grade の文書の読み込みと結果のサイドカー（`src/grade/`・`src/shared/grade-result.ts`）、review の段の grade の前提 |
| 必要な対応 | 実装の todo を起票する（難しさ hard）                                                                              |
| 追跡先     | 派生の todo、PJR-V05D                                                                                              |

## 8. 関連ドキュメント

- 由来: [[prj-0001:pjr-v05d-grade-yaml-deliverables]]
- 関係する epic: [[prj-0001:pjr-2gd6-business-specs-reps]]、[[prj-0001:pjr-t88p-business-specs-kata]]
