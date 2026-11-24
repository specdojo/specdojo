---
specdojo:
  id: prj-0001:xer-t-kata-review-all-dmd-index-sample-110-20261124t175436z-4bb81858
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-dmd-index-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-dmd-index-sample-110/T-KATA-REVIEW-ALL-dmd-index-sample-110-20261124T175436Z-4bb81858/plan.md
  started_at: "2026-11-24T17:54:44.644Z"
  completed_at: "2026-11-24T17:59:09.983Z"
  agent: sol-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:dmd-index-sample
    - specdojo:dmd-index-sample
---

# Edit Result

## 1. 実施内容

- R1（目的の過不足）のレビューを実施し、`docs/ja/specdojo/samples/dmd-index-sample.md` の共通方針を 1 箇所修正した（1 行追加・1 行削除）。
- 指摘 R1-1 は、取り消し線のある顧客を一律に除外するとつけ残高を取りこぼす点である。除外条件を「取り消し線があり、つけ残高が 0 円」に限定し、残高がある顧客は移す旨とその理由を追記した。
- 根拠は rulebook 第5章の除外原則、`mip-index-sample` の残高を取りこぼさない目的と全顧客の残高一致、`dmd-sample` 第5章の除外条件である。
- F001（`vp-ba-stakeholder-clarity`、判定者の Role code 併記）は R1 では修正しなかった。kata-guide 第6.3節は同観点を独立評価から外しており、rulebook も Role code の併記を必須としていない。
- executor の検査では prettier 整形と `git diff --check` が成功した。runner の検査では `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が成功した。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/dmd-index-sample.md`: 「2. 共通方針（抽出/変換/除外/冪等性/ログ）」の顧客の除外条件を、取り消し線があり、かつつけ残高が 0 円の顧客に限定した。残高がある顧客は移行対象とし、残高を取りこぼさない理由を追記した。共通方針、`run_id` 規約、検証基準と証跡、対象一覧、個別設計への導線は維持した。

## 3. 申し送り

- 指摘一覧（実施内容の表は reporter が 1 回だけ書く）: No=R1-1 / 段=R1 / 箇所=2. 共通方針（抽出/変換/除外/冪等性/ログ） / 指摘=取り消し線のある顧客を一律に除外すると、残るつけ残高を取りこぼす / 直した案=除外条件を「取り消し線があり、つけ残高が 0 円」に限定し、残高がある顧客は移す旨と理由を追記 / 根拠=`vp-po-purpose-alignment`、`vp-qe-kata-conformance`、rulebook 第5章、`mip-index-sample` 第1章と第5章、`dmd-sample` 第5章 / 印=なし。
- F001 は R1 の観点に当たらず未修正である。R5 で、判定者の参照先 `mip-index` との整合と、Role code 併記の必要性を確認する。この判断は要判断の印を付けて人が確認する。
- R1-1: R1 / 2. 共通方針（抽出/変換/除外/冪等性/ログ） / 取り消し線のある顧客を一律に除外すると、残るつけ残高を取りこぼす / 顧客の除外条件を「取り消し線があり、つけ残高が 0 円」に限定し、残高がある顧客は移す旨と理由を追記 / `vp-po-purpose-alignment`、`vp-qe-kata-conformance`。rulebook 第5章の除外原則と根拠、mip-index-sample 第1章の残高を取りこぼさない目的と第5章の全顧客の残高一致、dmd-sample 第5章の除外条件に基づく / -
- 進め方と実践の型の適用への記録: [[specdojo:kata-guide|実践の型ガイド]] 第6章、[[specdojo:sample-authoring-standard|Sample 記述標準]]、[[specdojo:dmd-index-rulebook|データ移行設計 作成ルール]]、成果物カタログ dct-kata.yaml の対象項目の `done_criteria`、[[specdojo:mip-index-sample|移行計画の完成例]]、[[specdojo:dmd-sample|データ移行設計の完成例]]、対象の grade 結果および直前の edit・review result を確認。recipe と template は rulebook で undecided のため、本文要件を構成の正とした。
- F001（source=grade）の扱い: 判定根拠 `vp-ba-stakeholder-clarity` と対象箇所を確認した。kata-guide 第6.3節では同観点を独立評価から外しており、rulebook は判定者の Role code 併記を必須としていない。既存の `mip-index` 参照を維持し、R1 では修正しない。R5 で判定者の参照先との整合と併記の必要性を確認する。plan に source=condense の finding はない。
- 変更ファイルは docs/ja/specdojo/samples/dmd-index-sample.md のみ。共通方針・`run_id` 規約・検証基準と証跡・対象一覧・個別設計への導線は維持した。文書の承認役割や実装詳細は追加していない。result、rulebook、grade サイドカー、Git 設定は変更していない。親 runner の指定検査は runner に委ねる。
- 適用外の検証: `npm run validate:schema:file`（変更は Markdown のみで、YAML ファイルを変更していない。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は docs/ja/specdojo/samples/ 配下のみで、docs/ja/projects/ 配下を変更していない。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票、既存の plan、result を変更していない。）

## 4. 進め方と実践の型の適用

根拠として kata-guide 第6章、Sample 記述標準、`dmd-index-rulebook`、`mip-index-sample`、`dmd-sample`、対象の grade 結果、直前の edit・review result を確認した。recipe と template は rulebook で undecided のため、本文要件を構成の正とした。rulebook と sample の矛盾はなく、rulebook は変更していない。改訂したのは除外条件のみで、共通方針・`run_id` 規約・検証基準と証跡・対象一覧・個別設計への導線は整合しているため維持した。F001（source=grade）は、判定根拠 `vp-ba-stakeholder-clarity` を確認したうえで R1 では扱わず、R5 に回した。plan に source=condense の finding はない。
