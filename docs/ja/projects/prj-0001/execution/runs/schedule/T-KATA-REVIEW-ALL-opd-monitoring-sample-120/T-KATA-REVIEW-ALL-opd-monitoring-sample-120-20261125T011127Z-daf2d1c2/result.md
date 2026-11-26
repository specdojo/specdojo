---
specdojo:
  id: prj-0001:xer-t-kata-review-all-opd-monitoring-sample-120-20261125t011127z-daf2d1c2
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-opd-monitoring-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-opd-monitoring-sample-120/T-KATA-REVIEW-ALL-opd-monitoring-sample-120-20261125T011127Z-daf2d1c2/plan.md
  started_at: "2026-11-25T01:11:36.035Z"
  completed_at: "2026-11-25T01:23:52.442Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opd-monitoring-sample
    - specdojo:opd-access-control-sample
---

# Edit Result

## 1. 実施内容

- kata レビュー R2（構成）として `opd-monitoring-sample` を確認した。章の順（概要、差分を持つ章、関連ドキュメント導線）と、差分の章の見出しが `opd-index-sample` と一致することは問題なかった。
- 直したのは 1 点で、営業時間外の死活の通知について初動を始めず 9:30 に確かめるという扱いを、「測定元と通知の手段」から「初動の時限と完了条件」へ移した。
- R2-3 は構成ではなく参照先との整合の問題なので、sample には反映していない。R5（整合）で扱う。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opd-monitoring-sample.md`: 営業時間外の死活の通知では初動を始めず 9:30 に確かめるという箇条書きを、2.2「測定元と通知の手段」から 2.3「初動の時限と完了条件」の末尾の段落へ移した。未決事項の表の該当行の「影響する節」には「初動の時限と完了条件」を足した。

## 3. 申し送り

- R2-2 は章の順、見出しの一致、各節の「表の前の 1 文→表→補足」の順を確認した結果で、直していない。template は rulebook で not-needed のため照合しなかった。
- R2-3 は `opd-index-sample` などをバッククォートで仮置きして備考を「予定」とする一方、`opd-access-control-sample` は wikilink と「作成済」で書いており、書き方が揃っていない。R5（整合）で `opd-incident-management-sample`・`opr-index-sample`・`opr-monitoring-sample` の有無を確かめ、wikilink と備考を揃える案を出す。根拠は `vp-qe-kata-conformance`。
- executor の申し送りのとおり、plan の「編集対象」は `opd-access-control-sample.md` に解決されていたが、タスク名と根拠の成果物は `opd-monitoring-sample` である。executor は `opd-monitoring-sample.md` を編集し、`opd-access-control-sample.md` は変えていない。sample が複数宣言された rulebook で先頭を取っている可能性があるため、plan 生成の解決処理を確認する必要がある。
- R2-1: R2 / 2.2. 測定元と通知の手段 → 2.3. 初動の時限と完了条件 / 営業時間外の死活の通知では初動を始めず 9:30 に確かめるという扱いが、測り方・判定の時刻・届け方を書く 2.2 の箇条書きに入っていた。内容は通知を受けた後の初動の扱いで、置き場所が違う / この箇条書きを 2.3 の末尾の段落へ移し、未決事項の表の該当行の「影響する節」に「初動の時限と完了条件」を足した / vp-arc-document-structure、vp-qe-omissions-consistency / -
- R2-2: R2 / 全体（概要〜関連ドキュメント導線） / 章の順（概要→差分を持つ章→関連ドキュメント導線）、差分の章の見出しが opd-index-sample の「監視・アラート方針（指標・閾値・通知先・初動）」と同じこと、各節で表の前の 1 文→表→補足の順になっていることを確かめた。2.1 守る業務→2.2 測定と通知→2.3 初動→2.4 見直しの順で、前提から結論の順に読める。template は rulebook で not-needed / - / vp-arc-document-structure / -
- R2-3: R2 / 3. 関連ドキュメント導線（`opr` 等） / 存在する opd-index-sample などをバッククォートで仮置きし、備考を「予定」としている。opd-access-control-sample は wikilink と「作成済」で書いており、書き方が揃っていない。構成ではなく参照先との整合の問題 / - / R5（整合）で、opd-incident-management-sample・opr-index-sample・opr-monitoring-sample があるかを確かめ、wikilink と備考を揃える案。vp-qe-kata-conformance / -
- 申し送り: plan の「編集対象」は rulebook の sample 宣言の先頭にある opd-access-control-sample.md に解決されていた。しかしタスク名と根拠の成果物（path）は opd-monitoring-sample なので、opd-monitoring-sample.md を編集し、opd-access-control-sample.md は変えていない。plan の生成で編集対象を解決する処理（sample が複数宣言された rulebook で先頭を取っている可能性）を確かめてほしい。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/ の sample だけで、plan・result・個票を変更していない）

## 4. 進め方と実践の型の適用

kata-guide の R2（構成）に従い、`opd-monitoring-sample` の章の順・粒度・表と本文の配置を rulebook の本文構成に照らして確認した。plan に展開された grade の finding と、成果物から届いた Kata が原因の finding はどちらもなかった。 指摘は R2-1 の 1 件で、`vp-arc-document-structure` と `vp-qe-omissions-consistency` の観点により、営業時間外の初動の扱いを置き場所の正しい 2.3 へ移した。章順は 2.1 守る業務→2.2 測定と通知→2.3 初動→2.4 見直しで、前提から結論の順に読めるため維持した。 R2-3 は参照先との整合の問題なので、R5 に回した。 検査では、executor の `prettier` と `markdownlint-cli2` が通った。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も通った。変更に当たらない検査は `not_applicable` で、`not_run` はない。
