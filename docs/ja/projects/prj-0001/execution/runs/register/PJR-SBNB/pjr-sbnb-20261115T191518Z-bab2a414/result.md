---
specdojo:
  id: prj-0001:xer-pjr-sbnb-20261115t191518z-bab2a414
  type: exec-result
  task_id: PJR-SBNB
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-SBNB/pjr-sbnb-20261115T191518Z-bab2a414/plan.md
  started_at: "2026-11-15T19:15:19.342Z"
  completed_at: "2026-11-15T21:09:14.520Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- ifx-index の schema を ifx-index.schema.yaml に改名し、modeline・rulebook・recipe の参照をそろえた。古い esil.schema.yaml は $ref だけの非推奨の別名として残した。残る .vscode/settings.json の cSpell 語 esil は保護ファイルのため編集が拒否された。完了条件どおり、変更案を個票と handoff に書いた。

## 2. 変更ファイル

- `docs/ja/product/020-external-interface-specs/ifx-index.yaml`: 変更、+1 / -1 行
- `docs/ja/specdojo/recipes/ifx-index-recipe.md`: 変更、+1 / -1 行
- `docs/ja/specdojo/rulebooks/ifx-index-rulebook.md`: 変更、+13 / -13 行
- `docs/ja/specdojo/samples/ifx-index-sample.yaml`: 変更、+1 / -1 行
- `docs/ja/specdojo/templates/ifx-index-template.yaml`: 変更、+1 / -1 行
- `docs/specdojo/schemas/v1/esil.schema.yaml`: 変更、+7 / -141 行
- `docs/specdojo/schemas/v1/ifx-index.schema.yaml`: 追加、+143 / -0 行

## 3. 申し送り

- 保護ファイルへの変更案: `.vscode/settings.json` の `cSpell.words` から `"esil",` の行を削除する。今回の再開でも Edit が sensitive file として拒否された。削除するまで、履歴を除く `grep -rn esil` はこの 1 件に一致する。
- 決定: 古い `docs/specdojo/schemas/v1/esil.schema.yaml` は削除しない。`$ref: "ifx-index.schema.yaml"` と `deprecated: true` だけの非推奨の別名にした。ほかのプロジェクトの modeline を壊さず、内容の複製もない。移行期間が過ぎたら削除する。
- 決定: 改名で rulebook と schema がファイル名の stem で組になり、`validate:schema:rulebook-enums` の対象に入った。そのため ready の rulebook `specdojo:ifx-index-rulebook` に `status`・`direction`・`kind`・`format` の値と選び方を追記した。ready の文書の本文変更なので確認してほしい。
- 決定: `id` の pattern から古い略号の接頭辞の形式を除いた（リポジトリ内で未使用）。ほかのプロジェクトで使っていれば `ifx-index` 系へ改める必要がある。CHANGELOG に書く事項は個票の「CHANGELOG に書く事項」の節にある。
- 残課題: `ifx-api`・`ifx-msg`・`ifx-cmd`・`ifx-file` の rulebook・recipe と `dct-external-interface-specs.yaml` に大文字の略号 ESIL が残る。schema 名の範囲外なので、必要なら別の項目で扱う。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
