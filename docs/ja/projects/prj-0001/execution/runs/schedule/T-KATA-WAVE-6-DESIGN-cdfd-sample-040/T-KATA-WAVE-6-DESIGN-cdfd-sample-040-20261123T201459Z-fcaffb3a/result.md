---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-design-cdfd-sample-040-20261123t201459z-fcaffb3a
  type: exec-result
  task_id: T-KATA-WAVE-6-DESIGN-cdfd-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-DESIGN-cdfd-sample-040/T-KATA-WAVE-6-DESIGN-cdfd-sample-040-20261123T201459Z-fcaffb3a/plan.md
  started_at: "2026-11-23T20:15:07.555Z"
  completed_at: "2026-11-23T20:29:04.213Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - specdojo:cdfd-sample
    - specdojo:cdfd-rulebook
---

# Edit Result

## 1. 実施内容

- rulebook の簡潔化と、grade の指摘に基づく記述の更新を行いました。
- `docs/ja/specdojo/rulebooks/cdfd-rulebook.md` において、改訂時の追従対象（`BA` が更新、`ARC` が整合を確認）の表、Frontmatter と図の検証コマンド、および「未決事項」の記述ガイドを追加しました。また、PJR-76N9 に基づき、目的の記述を「役割の割り当て」から「利用場面と判断内容」へと変更しました。
- 取り込んでいる 2 つの記法 rulebook（Mermaid および D2）については、重複していた全体方針の削除と、検証コマンドの追記を行いました。
- F006 および F007 の指摘については、rulebook の規定ではなく sample 側の不備であると判断したため、今回は rulebook の変更は行わず、申し送り事項としました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/cdfd-d2-rulebook.md`: 重複していた全体方針の記述を削り、図の検証コマンドを追記しました。
- `docs/ja/specdojo/rulebooks/cdfd-mermaid-rulebook.md`: 重複していた全体方針の記述を削り、図の検証コマンドを追記しました。
- `docs/ja/specdojo/rulebooks/cdfd-rulebook.md`: 改訂時の追従対象の表（`BA` および `ARC` の役割）、Frontmatter と図の検証コマンド、および「未決事項」の記述ガイドを追加しました。また、目的の記述を利用場面に即したものに改訂しました。

## 3. 申し送り

- F001・F005・F008: 主 rulebook `specdojo:cdfd-rulebook` と、その template・sample は `ready` だが、取り込んでいる `specdojo:cdfd-mermaid-rulebook` と `specdojo:cdfd-d2-rulebook` は `draft` のまま。人が記法の rulebook を ready にするか、未確定の依存を許すリリース判断を登録簿の個票に残す必要がある。
- F006: template（`specdojo:cdfd-template`）と recipe（`specdojo:cdfd-recipe`）は、プロセス領域に主要入力・主要出力・データストアの箇条書きを置くことを禁じている。指摘のうち「template と recipe が求めている」という前提は事実と異なる。規定に合っていないのは sample（`docs/ja/specdojo/samples/cdfd-sample.md` の 3.1・3.2 の要約文と箇条書き）だけなので、次の sample の段で消す。
- F007: sample の目的（3 項目）、適用範囲（5 項目）、入荷検品の図の後の注記（6 文）が、rulebook と template の分量規定（目的 1〜2 文、対象・対象外を各 1 行、注記 1〜2 文）を超えている。規定は template と揃っているため変えず、次の sample の段で sample を規定に合わせる。目的は PJR-76N9 に沿って、役割ごとの利用ではなく利用場面と判断内容で書き直す。
- 「位置づけと用語定義」の追従対象の表に書いた Role code（更新する `BA`、整合を確かめる `ARC`）は、prj-0001 の成果物カタログ（dct）の `roles` の使い方から選んだもの。ほかの CDFD の型（`cdfd-overview-rulebook`・`cdfd-uc-rulebook`）にも追従対象の表を置くかは、それぞれの段で判断する。
- F001・F005・F008: 主 rulebook `specdojo:cdfd-rulebook` と、その template・sample は `ready` だが、取り込んでいる `specdojo:cdfd-mermaid-rulebook` と `specdojo:cdfd-d2-rulebook` は `draft` のまま。人が記法の rulebook を ready にするか、未確定の依存を許すリリース判断を登録簿の個票に残す必要がある。rulebook の本文には status の状態を書かず、記法を変えたときの影響範囲だけを「位置づけと用語定義」の追従対象の表に示した。
- F007: sample の目的（3 項目）、適用範囲（5 項目）、入荷検品の図の後の注記（6 文）が、rulebook と template の分量の規定（目的 1〜2 文、対象・対象外を各 1 行、注記 1〜2 文）を超えている。規定は template と揃っているため変えず、次の sample の段で sample を規定に合わせる。目的は PJR-76N9 に沿って、役割ごとの利用ではなく利用場面と判断内容で書き直す。
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/rulebooks/ 配下の rulebook だけで、plan・result・個票は変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したのは Markdown の rulebook だけで、`*.yaml` / `*.yml` を変更していない）

## 4. 進め方と実践の型の適用

対象の sample が従う rulebook を、grade の指摘と成果物の `done_criteria` に沿って簡潔に整える作業を行いました。rulebook の記述において、役割の割り当てから「利用場面での判断」への変更、および検証コマンドや「未決事項」の記述ガイドの追加など、指摘事項への対応を完了しています。
