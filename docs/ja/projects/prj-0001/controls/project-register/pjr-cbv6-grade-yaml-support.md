---
specdojo:
  id: prj-0001:pjr-cbv6-grade-yaml-support
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: hard
  registered_at: "2026-11-10T12:42:25Z"
  derived_from:
    - PJR-JQSB
    - PJR-V05D
  autopilot: approved
---

# PJR-CBV6 grade で YAML の成果物を評価できるようにする

## 1. 概要

PJR-JQSB の決定どおり、grade が YAML の成果物のメタ情報を validate:schema と同じ読み方（最上位か x-spec-meta）で読み、YAML の本文を評価し、結果をサイドカーに残せるようにする

## 2. 入力

- PJR-JQSB（indie が決定、2026-11-10）: 案 A。ハッシュは YAML のファイルの内容から取り、指摘の行番号は元の YAML の行を指す。Markdown の扱いは変えない。
- 対象の例: docs/ja/product/010-business-specs/020-data-model/bdd-register-entry.yaml（最上位の id など）、docs/ja/product/020-external-interface-specs/ifx-cmd-ai-provider-cli.yaml、YAML の kata の sample（bdd-sample.yaml・ifx-cmd-sample.yaml）。

## 3. 完了条件

- `specdojo grade list|plan|run|apply|result` が、YAML の成果物と YAML の kata（sample など）を対象にできる。メタ情報は `validate:schema` と同じ読み方で、最上位の `id`・`type`・`status`・`rulebook` か、OpenAPI の形の `x-spec-meta` から読む。読み方の処理は、`validate:schema` と同じものを使うか、共通の処理にまとめている。
- YAML の本文をそのまま評価の対象にし、結果のサイドカーに残す。結果のハッシュは YAML のファイルの内容から取る。指摘の行番号は元の YAML の行を指す。
- Markdown の成果物の読み方・ハッシュ・結果は変わらない。既存の Markdown のサイドカーが、そのまま使える。
- メタ情報がない YAML（`rulebook` がないものなど）は、理由を示すメッセージで対象から外し、`Markdown frontmatter is required` で止まらない。
- review の段（schedule の review の plan）が、YAML の成果物の grade を流し、結果を使える。
- 単体テストで、最上位のメタ情報の YAML、`x-spec-meta` の YAML、メタ情報のない YAML、今の Markdown の 4 つの場合を確かめている。
- 統合の後に、`bdd-register-entry.yaml` と `ifx-cmd-ai-provider-cli.yaml`、`bdd-sample.yaml`・`ifx-cmd-sample.yaml` に `grade run` を流して結果ができることを確かめ、個票の対応結果に書いている（流すのは orchestrator が行ってもよい）。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分と行の文案で書いている（PJR-EPQ3）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` が通り、親の検証 `test-integration` も通る。

## 4. 作業内容

| No  | 作業                                                             | 担当   | 状態 | メモ |
| --- | ---------------------------------------------------------------- | ------ | ---- | ---- |
| 1   | grade の文書の読み込みと、validate:schema の YAML の読み方を読む | _TODO_ | open | -    |
| 2   | YAML の読み込み・ハッシュ・行番号を足し、テストを足す            | _TODO_ | open | -    |
| 3   | 検査を流し、対応結果に書く                                       | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- 決定: [[prj-0001:pjr-jqsb-grade-yaml-method]]
- 由来: [[prj-0001:pjr-v05d-grade-yaml-deliverables]]
