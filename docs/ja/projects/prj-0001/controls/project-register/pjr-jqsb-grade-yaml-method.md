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

grade は Markdown の frontmatter を前提とし、YAML の成果物（bdd・ifx-cmd など）を評価できない。YAML のメタ情報の読み方と、評価の対象・結果のハッシュの扱いを決める

## 2. 入力

- grade は src/grade/core.ts と src/shared/grade-result.ts で Markdown frontmatter を読み、YAML では Markdown frontmatter is required で止まる（2026-11-10 確認）。
- YAML のメタ情報は 2 通り: bdd などは最上位の id・type・status・rulebook、OpenAPI の形（ifx-api など）は x-spec-meta。validate:schema はどちらも読んでいる。
- 案: A（推奨）grade が YAML のメタ情報を validate:schema と同じ読み方で読み、YAML の本文をそのまま評価する。B yaml-pages の表示用 Markdown を評価する。C YAML は grade の対象外とし review は人が行う。indie は推奨（A）で起票するよう指示（2026-11-10）。

## 3. 検討した選択肢

| 選択肢 | 内容   | 利点   | 懸念   |
| ------ | ------ | ------ | ------ |
| A      | _TODO_ | _TODO_ | _TODO_ |

## 4. 決定内容

_TODO_: 採択した内容を明確に記載する。

## 5. 採択理由

- _TODO_: 判断根拠を記載する。

## 6. 承認

| 項目     | 内容   |
| -------- | ------ |
| 決定者   | _TODO_ |
| 決定日   | _TODO_ |
| 承認方式 | _TODO_ |
| 証跡     | _TODO_ |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 7. 影響範囲とフォローアップ

| 項目       | 内容   |
| ---------- | ------ |
| 影響範囲   | _TODO_ |
| 必要な対応 | _TODO_ |
| 追跡先     | _TODO_ |

## 8. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
