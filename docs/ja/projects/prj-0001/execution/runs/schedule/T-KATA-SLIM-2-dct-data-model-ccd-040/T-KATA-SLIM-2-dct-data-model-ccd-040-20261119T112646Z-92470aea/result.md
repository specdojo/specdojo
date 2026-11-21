---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-dct-data-model-ccd-040-20261119t112646z-92470aea
  type: exec-result
  task_id: T-KATA-SLIM-2-dct-data-model-ccd-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-dct-data-model-ccd-040/T-KATA-SLIM-2-dct-data-model-ccd-040-20261119T112646Z-92470aea/plan.md
  started_at: "2026-11-19T11:26:52.229Z"
  completed_at: "2026-11-19T11:39:54.739Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - prj-0001:dct-data-model-ccd
    - specdojo:dct-rulebook
---

# Edit Result

## 1. 実施内容

- 共通の運用記述を `docs/ja/specdojo/standards/document-metadata-standard.md` への参照に置き換え、`docs/ja/specdojo/rulebooks/dct-rulebook.md` を簡略化した。
- 用語の表、`schema` や本文と重複する禁止事項、言い直しを削除し、空白を除く文字数を約 78%（13929 → 10840 文字）に削減した。
- `rulebook-authoring-standard` に従い、用語定義を置かないため章名を「位置づけと用語定義」から「位置づけ」に変更した。
- finding F001, F003, F007, F008 を rulebook 内で解消し、F002, F004, F005, F006 については規則の明記とレビューでの確認方針を記述した。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/dct-rulebook.md`: 共通の運用記述を正本への参照に置き換え、重複・冗長な記述を削除して簡略化した。また、`rulebook-authoring-standard` に基づき章名を「位置づけ」に変更し、指摘されていた整合性問題を解消する規定を追加した。

## 3. 申し送り

- F002: `dct.schema.yaml` の Section が `anyOf: [required deliverables, required groups]` のため、両方を持つグループも検証に合格する。親グループと葉グループの境界を機械検証するには `oneOf`（または `not: {required: [groups, deliverables]}`）へ変える案がある。rulebook には「両方を同時に持たない。レビューで確認する」と書き、禁止事項にも加えた。
- F004: `dct.schema.yaml` は `type: project` の group と deliverable でも `min_size` を受理する。project 側の StrictSection と deliverable の定義から `min_size` を外す案がある。rulebook には template だけに書く規則と「schema は受理するためレビューで確認する」を書いた。
- F005: `docs/ja/specdojo/templates/dct-project-management-template.yaml` の `sch-track-launch`（`kind: generated`）が `depends_on: []` になっている。`[sch-strategy-launch]` へ直す変更案がある（template は本段の commit 対象外）。rulebook の規則は維持し、「テンプレートでも同じとする」と明記した。
- F006: rulebook frontmatter の `template` は schema（`rulebook-frontmatter.schema.yaml`）上 ID を 1 つしか持てず、ドメインごとにある `dct-&lt;domain&gt;-template.yaml` 群を宣言できない。sample と同じく ID 配列を許すか、dct 用に directory 単位の宣言を設ける schema 変更案がある。それまでの扱いとして、全体方針の「実践の型の構成」に template の選ばれ方（`catalog scaffold` が `domain` から選ぶ）を書き、frontmatter は変えなかった。
- 章名の変更: 「位置づけと用語定義」を「位置づけ」に変えた。用語の表が本文要件の言い直しだけだったため外し、`rulebook-authoring-standard` の標準章構成（用語定義が不要な場合は章を `位置づけ` とする）に従った。ほかの章名と必須・条件付きの区分は変えていない。
- 文字数（空白・改行を除く）: 変更前 13929、変更後 10840（約 77.8%）。
- 共通の正本（`document-metadata-standard`）へ足す記述はなかった。sample（`dct-sample`）は今回の変更で記述が矛盾する箇所を確認していない。合わせて直す点の有無は reporter・review で確認されたい。
- 章名の変更: 「位置づけと用語定義」を「位置づけ」に変えた。用語の表が本文要件の言い直しだけだったため外し、rulebook-authoring-standard の標準章構成（用語定義が不要な場合は章を `位置づけ` とする）に従った。ほかの章名と必須・条件付きの区分は変えていない。
- 共通の正本（document-metadata-standard）へ足す記述はなかった。sample（dct-sample）は今回の変更で記述が矛盾する箇所を確認していない。合わせて直す点の有無は reporter・review で確認されたい。
- 適用外の検証: `npm run validate:schema:file`（変更ファイルは Markdown の rulebook だけで、`*.yaml` / `*.yml` の変更がない）
- 適用外の検証: `npm run validate:history-links`（plan・result・個票を変更していない）
- rate limit後に sol-executor から opus-executor へ切り替え、2026-11-19T11:28:22.858Z に再開

## 4. 進め方と実践の型の適用

rulebook-maintenance
