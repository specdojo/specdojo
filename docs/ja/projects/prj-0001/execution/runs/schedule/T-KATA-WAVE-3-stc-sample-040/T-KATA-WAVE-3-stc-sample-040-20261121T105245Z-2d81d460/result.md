---
specdojo:
  id: prj-0001:xer-t-kata-wave-3-stc-sample-040-20261121t105245z-2d81d460
  type: exec-result
  task_id: T-KATA-WAVE-3-stc-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-3-stc-sample-040/T-KATA-WAVE-3-stc-sample-040-20261121T105245Z-2d81d460/plan.md
  started_at: "2026-11-21T10:52:51.614Z"
  completed_at: "2026-11-21T10:59:55.559Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - specdojo:stc-sample
    - specdojo:stc-rulebook
---

# Edit Result

## 1. 実施内容

- stc-rulebook を grade の指摘 F001〜F013 に沿って簡潔に更新しました。
- H5 見出しの使用を解消し、見出し階層を適正化しました。
- 「本文構成（標準テンプレ）」の章を、執筆標準に合わせ「本文要件」へと名称変更し、記述ガイドとの重複を解消しました。
- サンプル章（`specdojo:stc-sample`）を削除し、rulebook を簡潔な定義書として整えました。
- ID の `project-id` による修飾、ファイル命名規則、作成後の検証（`lint:md` 等）の手順、および `perspective_key` 変更時の追従方針を明記しました。
- 未決事項（`recipe` / `template` の要否判断）について、`_UNDECIDED_` としてルール内に定義しました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/stc-rulebook.md`: grade の指摘に基づき、完成例としてのサンプル章を削除。見出し階層（H5）の解消、ID 形式の project 修飾（`＜project-id＞:stc-＜term＞`）、ファイル命名規則、作成後の検証手順、および `perspective_key` 変更時の追従方針を追記。また、「本文構成（標準テンプレ）」を「本文要件」へ改称し、記述内容を整理した。

## 3. 申し送り

- F010（sample が本文要件の見出し構成に従っていない）については、今回のフェーズでは `stc-sample` を変更しない方針であるため、未解消としています。後続の `sample-maintenance` において、`stc-sample` を本文要件（概要・目的・対象外・境界/環境/依存・トレース・テスト観点とケース）に適合させる必要があります。
- `recipe` および `template` の要否については `undecided` のままとしています。`template` は `PJR-WYTX` で扱う方針ですが、`recipe` については `ready` 化の判断時に QE が決定すべき事項として `_UNDECIDED_` に記載しました。
- 確認者の割り当て（目的・対象外は PO/BA、期待値・観測点・証跡は QE、テストコードとの対応は DEV）は、隣接する `utc-rulebook` の慣行に基づき、暫定的な定義として記述しています。これは確定事項ではないため、人の確認が必要です。
- F010（sample が本文要件の見出し構成に従っていない）はこの段では sample を変えない方針のため未解消。後続の sample-maintenance で stc-sample を本文要件（概要・目的・対象外・境界/環境/依存・トレース・テスト観点とケース）にそろえる。
- recipe / template の要否は `undecided` のまま。template は PJR-WYTX で扱う。recipe は ready 化の判断時に QE が決める、と rulebook の `_UNDECIDED_` に記載したが、これは executor の想定であり、担当の確認が要る。
- 確認者の割り当て（目的・対象外は PO・BA と合意、期待値・観測点・証跡は QE、テストコードとの対応は DEV）は、隣の utc-rulebook にならって executor が置いた想定であり、根拠となる決定はない。人の確認が要る。
- 「本文構成（標準テンプレ）」の章名を、rulebook-authoring-standard に合わせて「本文要件」に変えた。
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/rulebooks/stc-rulebook.md だけで、plan・result・個票を変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルに `*.yaml` / `*.yml` がない）
- 適用外の検証: `specdojo catalog validate`（変更が docs/ja/specdojo/ 配下だけで、docs/ja/projects/ に届いていない）

## 4. 進め方と実践の型の適用

target の `stc-rulebook` を、grade の指摘事項に基づき整理・簡潔化しました。完成例（sample）を rulebook から分離し、記述ガイドや定義の整合性を高めることで、型としての責務を明確にしました。
