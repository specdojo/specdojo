---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-imp-test-040-20261118t105807z-51870fc2
  type: exec-result
  task_id: T-KATA-SLIM-2-imp-test-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-imp-test-040/T-KATA-SLIM-2-imp-test-040-20261118T105807Z-51870fc2/plan.md
  started_at: "2026-11-18T10:58:50.046Z"
  completed_at: "2026-11-18T11:37:46.731Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - prj-0001:imp-test
    - specdojo:imp-test-rulebook
---

# Edit Result

## 1. 実施内容

- `imp-test-rulebook` から、どの成果物にも共通する運用の記述を外し、共通の正本への参照に置き換えた。あわせて、成功条件と影響度を再現可能に判定できる要件を補強した。
- 空白・改行を除く文字数は 2,630 字から 2,001 字（76.08%）になった。SLD 試行と同じく表の区切り行も除く数え方では 2,340 字から 1,850 字（79.06%）である。
- executor が実行した prettier の整形・検査と `git diff --check` は合格した。親 runner の `lint:fm`・`lint:md`・`lint:mermaid`・`lint:d2`・`validate:schema`・`test:unit`・`test:integration` も合格した。
- F001 と、F006 のうち rulebook 内の用語統一は対応した。F002〜F005 と F006 の sample 側は、sample が今回の編集対象外のため未解消である。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/imp-test-rulebook.md`: 未決事項の担当・期限管理、本文要件の言い直しにすぎない用語表と Frontmatter 表、共通規約と重複する禁止事項を削除した。全体方針に「共通の運用」を 1 項目置き、正本への参照に集約した。F001 への対応として、成功条件に指標・閾値または達成状態、確認対象と判定方法を求める記述を追加した。影響度は、評価観点ごとの境界条件と、判定が分かれた場合の集約規則および適用根拠を求める記述を追加した。受入確認には、成功条件の全達成を合格とし、未達時は影響対象と対応方針へ戻す手順を加えた。F006 への対応として、rulebook 内の「重要度」を「影響度」に統一した。第 2 章の見出しは「位置づけと用語定義（必要に応じて）」から「位置づけ」に変更した。6 章構成、必須・条件付きの区分、標準 6 列、Frontmatter は維持した。

## 3. 申し送り

- F002〜F005 と F006 の sample 側は、今回 sample が編集対象外のため未解消。次回の `imp-test-sample` 改訂で、次の点を直す必要がある。対象期間・判定可能な成功条件・影響度の尺度と集約規則を追記する。個人名と未定義ラベルを、Sample 記述標準の役割名・nickname・Role code に置き換える。対応方針表の「優先度」を「影響度」に統一する。未解決事項表を、論点・不足情報・影響・当面の扱いに整理する。sample の不備に合わせて rulebook の必須要件を緩めることはしていない。
- 参照元の `docs/ja/projects/prj-0001/050-impact-analysis/imp-test.md` は未作成である。カタログには既存テスト資産がない旨が明記されている。plan 4.1 に従い文書不在だけでは見送らず、確認できた規範・sample・評価記録に基づいて改訂した。
- recipe と template はともに undecided で、includes で取り込む記法の rulebook もない。このため追加編集は不要である。共通の正本への追記や保護された設定の変更も不要である。
- 判断の根拠は `進め方と実践の型の適用` に記録する。
- 変更ファイルは docs/ja/specdojo/rulebooks/imp-test-rulebook.md のみ。未決事項の担当・期限管理、重複する用語表・Frontmatter 表、共通の禁止事項を削除し、全体方針の「共通の運用」1項目へ参照を集約した。result は executor stage の指示どおり編集していない。
- result の「進め方と実践の型の適用」へ記録する根拠: rulebook-authoring-standard、document-metadata-standard、sample-authoring-standard、共通レビュー観点の vp-arc-conciseness・vp-qe-verifiability・vp-qe-kata-conformance・vp-ux-language-consistency、改訂済み sld-rulebook、PJR-8S4T の対応結果、imp-business-rulebook、imp-test-sample、対象 rulebook と sample の grade 記録、dct-impact-analysis。対象 rulebook の編集前ハッシュは grade 記録と一致した。
- F001 は成功条件の指標・閾値または達成状態、確認対象・判定方法、評価観点ごとの影響度の境界条件、判定が分かれた場合の集約規則と適用根拠を要求して対応した。成功条件の全達成を合格とし、未達時は影響対象と対応方針へ戻す受入確認も追加した。F006 の rulebook 内の「重要度」は「影響度」に統一した。
- F002〜F005 と F006 の sample 側は、今回 sample が編集対象外のため未解消。次回 imp-test-sample の改訂で対象期間・判定可能な成功条件・影響度の尺度と集約規則を追記し、個人名と未定義ラベルを Sample 記述標準の役割名・nickname・Role code に置き換える。対応方針表の「優先度」は「影響度」に統一する。未解決事項表は論点・不足情報・影響・当面の扱いへ整理する。必須要件は妥当であり、sample の不備に合わせて緩和しなかった。
- 成果物の6章構成・必須区分・標準6列と Frontmatter は維持した。rulebook の第2章だけ「位置づけと用語定義（必要に応じて）」から「位置づけ」に変更した。用語表が本文要件の言い直しであり、Rulebook 記述標準の重複回避に従うため。空白・改行を除く文字数は2,630→2,001字（76.08%）。SLD 試行と同じく表の区切り行も除く数え方では2,340→1,850字（79.06%）。
- 参照元の docs/ja/projects/prj-0001/050-impact-analysis/imp-test.md は未作成。カタログには既存テスト資産がない旨が明記されており、plan 4.1 に従い文書不在だけでは見送らず、確認できた規範・sample・評価記録に基づいて改訂した。recipe と template はともに undecided、includes の記法 rulebook はなく、追加編集は不要。共通の正本への追記・保護された設定の変更も不要。
- 構造確認では Frontmatter、成果物の章構成・必須区分が変更されていないこと、共通運用が1項目であること、旧「重要度」・未決事項の期限管理が残っていないことを確認した。親 runner 所管の lint・schema・テスト等は実行していない。
- 適用外の検証: `npm run validate:schema:file`（変更したファイルは Markdown のみで、YAML ファイルの変更がない。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は docs/ja/specdojo/rulebooks/ 配下のみで、docs/ja/projects/ 配下の成果物を変更していない。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票および既存の plan・result を変更していない。）

## 4. 進め方と実践の型の適用

rulebook-maintenance として、`imp-test-rulebook` を rulebook-authoring-standard に従って見直した。根拠にした資料は次のとおり。document-metadata-standard、sample-authoring-standard、共通レビュー観点（`vp-arc-conciseness`・`vp-qe-verifiability`・`vp-qe-kata-conformance`・`vp-ux-language-consistency`）、改訂済みの sld-rulebook、PJR-8S4T の対応結果、imp-business-rulebook、`imp-test-sample`、対象 rulebook と sample の grade 記録、dct-impact-analysis。対象 rulebook の編集前ハッシュは grade 記録と一致していた。F001 は成功条件と影響度の判定要件を rulebook に追加して解消した。F006 のうち rulebook 内の「重要度」は「影響度」に統一した。F002〜F005 と F006 の sample 側は、sample を編集対象外としたため未解消で、申し送りに記録した。この判断では rulebook を正とし、sample の不備に合わせて要件を緩めていない。型固有の判断基準、標準の列、章の受入条件、良い例・悪い例、業務の受入確認の手順は残した。
