---
specdojo:
  id: prj-0001:xer-t-kata-slim-sf-index-040-20261117t153617z-e9622aca
  type: exec-result
  task_id: T-KATA-SLIM-sf-index-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-sf-index-040/T-KATA-SLIM-sf-index-040-20261117T153617Z-e9622aca/plan.md
  started_at: "2026-11-17T15:36:22.775Z"
  completed_at: "2026-11-17T16:05:38.209Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - sf-index
    - specdojo:sf-index-rulebook
---

# Edit Result

## 1. 実施内容

- `sf-index-rulebook` から、どの成果物にも共通する運用の記述を外し、共通の正本への参照に置き換えた。
- 外した記述は、役割分担、status・承認・公開条件、改訂と廃止、未決事項の管理台帳への引き継ぎ、文書品質検査の再掲である。
- 型固有の判断基準、標準の列と章の受入条件、業務の受入確認の手順と合格条件、未決事項の論点と影響は残した。
- 大きさは、空白を除いた文字数で 6,934 字から 5,531 字になり、比率は 79.77%（削減 1,403 字）で目安の 8 割以下に収まった。
- 章名と必須・条件付きの区分は変更していない。Frontmatter、全見出し、標準 6 列の定義が変更前と一致することを executor が確認した。
- executor の `prettier --check` と `git diff --check` は成功した。runner の `lint:fm`、`lint:md`、`lint:mermaid`、`lint:d2`、`validate:schema`、`test:unit` も成功した。`test:integration` の evidence は出力が省略されているが、status は passed である。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/sf-index-rulebook.md`: 役割の表と段落、status・承認・公開条件、改訂と廃止、未決事項の管理台帳への引き継ぎ、文書品質検査の再掲を削除した。全体方針に「共通の運用」を 1 項目だけ置き、`docs/ja/specdojo/standards/document-metadata-standard.md` を参照する形にした。完成判定は、役割別の表から、業務の網羅と目的・機能境界・接点と詳細化・テスト対象の確認手順と合格条件へ整理した。位置づけの表と本文で重なる説明も統合した。機能 ID、業務領域の網羅、システムと人間の責務境界、接点のまたがり、個別仕様の要否、未照合箇所と影響先は型固有のため維持した。

## 3. 申し送り

- 共通正本への変更案（本タスクでは標準を変更していない）: `document-metadata-standard.md` は ready 昇格、改訂・廃止の承認、役割責務、未決事項の引き継ぎを定義している。一般の公開範囲・匿名化・公開承認条件は明記していない。公開相手と範囲、非公開情報の除外確認、未合意事項が公開に影響する場合の判断条件を共通運用として追記する案がある。
- sample・template の追従案（本タスクでは変更していない）: `sf-index-sample.md` の「読者・確認責任・公開範囲」、完成判定の役割・文書検査・承認、未決事項の担当・判断時点・追跡先、再照合と申し送りの管理手続きを整理する。業務の合格条件と論点・影響は残す。recipe と template は Frontmatter で not-needed である。`dct-system-functions-template.yaml` は sf-index 行の rulebook が `specdojo:sf-rulebook` のため、`specdojo:sf-index-rulebook` への修正候補である。
- result の実施内容・変更ファイル: 変更対象は docs/ja/specdojo/rulebooks/sf-index-rulebook.md のみ。役割分担、status・承認・公開条件、改訂廃止、管理台帳への引き継ぎ、文書品質検査の再掲を削除し、全体方針の「共通の運用」1項目へ集約した。完成判定は役割別の表から、業務の網羅と目的・機能境界・接点と詳細化・テスト対象の確認手順と合格条件へ整理した。result は executor stage の指示に従い編集していない。
- 判断根拠: docs/ja/specdojo/standards/rulebook-authoring-standard.md、docs/ja/specdojo/standards/document-metadata-standard.md、docs/ja/specdojo/defaults/pm-review-viewpoints.yaml の `vp-arc-conciseness`、docs/ja/specdojo/rulebooks/sld-rulebook.md、docs/ja/projects/prj-0001/controls/project-register/pjr-8s4t-sld-kata-slim-pilot.md の「他の型へ広げるときの一覧」を確認した。共通規範の再掲を参照化し、位置づけの表と本文で重なる説明を統合した。
- 成果物との整合根拠: docs/ja/product/010-business-specs/050-system-functions/sf-index.md、docs/ja/specdojo/samples/sf-index-sample.md、docs/ja/projects/prj-0001/010-deliverables-catalog/dct-system-functions.yaml を確認した。機能 ID、全業務領域の網羅、システムと人間の責務境界、接点のまたがり、個別仕様の要否、未照合箇所と影響先は型固有のため維持した。展開された finding はなし。
- 確認した実行記録: T-KATA-WAVE-1-sf-index-080-20261114T131808Z-db2355dc/result.md は機能構成表直後の重複説明を削った記録。T-KATA-WAVE-1-sf-index-090-20261114T143911Z-7bc17b67/result.md は実装照合記録不足による incomplete 判定。前者の簡潔化と整合させ、後者を実装との一致が確認済みという根拠には使っていない。両記録は docs/ja/projects/prj-0001/execution/runs/schedule/ 配下。
- 大きさ: ファイル全体から改行を含む空白を除いて計測し、変更前6,934字、変更後5,531字、比率79.77%、削減1,403字。sld 試行に合わせて表の区切り行も除いた場合は6,238字→4,845字、77.67%。Frontmatter、全見出し、本文要件の必須・条件付き区分、標準6列の定義が変更前と一致することを確認した。章名変更はない。
- 共通正本への変更案: document-metadata-standard.md は ready 昇格、改訂・廃止の承認、役割責務、未決事項の引き継ぎを定義しているが、一般の公開範囲・匿名化・公開承認条件は明記していない。公開相手と範囲、非公開情報の除外確認、未合意事項が公開に影響する場合の判断条件を共通運用として追記する案を申し送る。本タスクでは標準を変更していない。
- sample・template の追従案: sf-index-sample.md の「読者・確認責任・公開範囲」、完成判定の役割・文書検査・承認、未決事項の担当・判断時点・追跡先、再照合と申し送りの管理手続きを整理し、業務の合格条件と論点・影響を残す。recipe と template は Frontmatter で not-needed。別途確認した docs/ja/specdojo/templates/dct-system-functions-template.yaml は sf-index 行の rulebook が specdojo:sf-rulebook のため、specdojo:sf-index-rulebook への修正候補。本タスクでは sample・recipe・template・成果物本体を変更していない。
- 適用外の検証: `npm run validate:schema:file`（変更したファイルは Markdown rulebook のみで、YAML ファイルの変更がない。）
- 適用外の検証: `npm run validate:history-links`（executor は登録簿個票・plan・result などの履歴ファイルを変更していない。）
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/specdojo/rulebooks/ 配下のみで、docs/ja/projects/ 配下への変更がない。）

## 4. 進め方と実践の型の適用

根拠とした規範は、`rulebook-authoring-standard.md`、`document-metadata-standard.md`、`pm-review-viewpoints.yaml` の `vp-arc-conciseness`、改訂済みの `sld-rulebook.md`、pjr-8s4t の「他の型へ広げるときの一覧」である。成果物側は、`sf-index.md`、`sf-index-sample.md`、`dct-system-functions.yaml` を確認した。展開された finding と成果物から届いた Kata 原因の finding はなかった。共通規範の再掲は参照に置き換えた。型固有の判断基準、区分、標準の列と章の受入条件、業務の受入確認、未決事項の論点と影響は、成果物との整合を根拠に維持した。実行記録の `T-KATA-WAVE-1-sf-index-080` は機能構成表直後の重複説明を削った記録で、今回の簡潔化と整合する。`T-KATA-WAVE-1-sf-index-090` は実装照合記録不足による incomplete 判定で、実装との一致が確認済みという根拠には使っていない。根拠不足で見送った箇所はない。
