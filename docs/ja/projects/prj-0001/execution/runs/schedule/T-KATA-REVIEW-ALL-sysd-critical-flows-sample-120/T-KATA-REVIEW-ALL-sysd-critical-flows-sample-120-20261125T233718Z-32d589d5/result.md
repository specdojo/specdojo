---
specdojo:
  id: prj-0001:xer-t-kata-review-all-sysd-critical-flows-sample-120-20261125t233718z-32d589d5
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-sysd-critical-flows-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-sysd-critical-flows-sample-120/T-KATA-REVIEW-ALL-sysd-critical-flows-sample-120-20261125T233718Z-32d589d5/plan.md
  started_at: "2026-11-25T23:37:30.051Z"
  completed_at: "2026-11-25T23:44:10.584Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:sysd-critical-flows-sample
    - specdojo:sysd-critical-flows-sample
---

# Edit Result

## 1. 実施内容

- R2（構成）として `sysd-critical-flows-sample` を rulebook の本文構成と template に合わせて見直した。概要を template の 4 項目に配り直し、見出しの括弧書きと表の列名を template にそろえた。
- 両フローの詳細項目名を template の名前にそろえ、scf-002 の永続化点と整合性の項目を分割した。5.3 の未決事項は template の 6 列に分けた。
- F001 は R1 の直しで解消済みであることを確認した。F002 は R3 の観点なので、この段では直していない。
- runner の検査では `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が passed だった。変更種別により非適用の検査は `not_applicable` になっている。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R2-1 | R2 | 1. 概要 / 段落 | template の 4 項目（対象・対象外、最大5件の管理方針、設計索引・状態用語の定義先、公開範囲・除外情報）と粒度が合わない。公開範囲が設計索引より前にあり、順も rulebook と違う。 | 前提の `_ASSUMPTION_` を章の先頭に置き、残りの文を template の 4 項目に配り直した。文は変えていない。 | vp-arc-document-structure | - |
| R2-2 | R2 | 1. 概要・2. 重要フロー一覧・5. 関連ドキュメント導線 / 見出し | 見出しに template にない括弧書き（「（対象・運用方針）」「（最大5件）」「（SDI/テスト/運用/DEC）」）がある。 | 括弧書きを外し、template の章名にそろえた。ほかの文書から見出しへのアンカー参照がないことを grep で確かめた。 | vp-arc-document-structure | - |
| R2-3 | R2 | 2. 重要フロー一覧・4.2. 管理記録への引渡し / 表の列名 | 表の列名が template と違う（Flow ID・フロー名・利用者・運用者（Role code）・放置時の業務影響、担当Role code・対応方針）。 | 列名を template の ID・名称・対象者・業務影響と担当の対応方針にした。セルの内容は変えていない。 | vp-arc-document-structure | - |
| R2-4 | R2 | 3. フロー詳細 / 項目名 | 項目名が template と違う（永続化点、整合性・再実行、失敗・補償、受入 KA-01）。scf-002 は「永続化点・整合性・再実行」を 1 項目にまとめていて、scf-001 と粒度がそろわない。 | 両フローの項目名を template の名前（永続化点・成功の確定、整合性・冪等・再実行、失敗・保持・補償・再開、受入条件: `KA-0n`）にした。scf-002 は保存の順と印字完了の判定を「永続化点・成功の確定」に、試行識別子と結果不明の扱いを「整合性・冪等・再実行」に分けた。 | vp-arc-document-structure、vp-qe-omissions-consistency | - |
| R2-5 | R2 | 5.3. 未決事項と後続作業 | template の「受入や運用への影響」「当面の扱い」の列がなく、2 列目の文にまとめて書かれている（R1-5 が R2 に回した指摘）。対象の欄が「両フロー」で、フロー ID と結ばれていない。 | 6 列に分け、影響と当面の扱いを専用の列へ移した。対象の欄は scf-001・scf-002 にした。当面の扱いは新しい事実を足さず本文から書いた（SU-01 は 5.2 の未実施のケース、SU-02 は概要の前提「自動再送しない」、SU-03 は 4.1 の「常駐監視や無人復旧があるとは扱わない」）。選ばなかった案は、当面の扱いを「なし」とすることで、template の注記に反するため採らなかった。 | vp-arc-document-structure、vp-qe-omissions-consistency | 要判断: SU-01 の「実装に着手しない」は完了条件「実装着手前に正本を接続」から推した言い方である。 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/sysd-critical-flows-sample.md`: 概要を template の 4 項目（対象・対象外、管理方針、設計索引・状態用語の定義先、公開範囲・除外情報）に配り直した。見出しの括弧書きを外し、表の列名を template にそろえた。フロー詳細の項目名を template の名前にし、scf-002 の永続化点と整合性・冪等・再実行を分けた。5.3 を 6 列に分け、影響と当面の扱いを専用の列に移して、対象欄をフロー ID と結んだ。

## 3. 申し送り

- F002（`vp-ux-language-consistency`）は R3 に渡す。R3 では、照合待ちの定義を「本部受付またはローカル販売実績の保存のどちらかが確認できない状態」に広げる案が出ている。
- R2-1: R2 / 1. 概要 / 段落の文章で、template の 4 項目（対象・対象外、最大5件の管理方針、設計索引・状態用語の定義先、公開範囲・除外情報）と粒度が合わない。順も rulebook と違い、公開範囲が設計索引より前にある / 前提の `_ASSUMPTION_` を章の先頭に置き、残りの文を template の 4 項目に配り直した。文は変えていない / vp-arc-document-structure / -
- R2-2: R2 / 1. 概要・2. 重要フロー一覧・5. 関連ドキュメント導線 / 見出しに template にない括弧書き（「（対象・運用方針）」「（最大5件）」「（SDI/テスト/運用/DEC）」）がある / 括弧書きを外し、template の章名にそろえた。ほかの文書から見出しへのアンカー参照がないことを grep で確かめた / vp-arc-document-structure / -
- R2-3: R2 / 2. 重要フロー一覧・4.2. 管理記録への引渡し / 表の列名が template と違う（Flow ID・フロー名・利用者・運用者（Role code）・放置時の業務影響、担当Role code・対応方針） / 列名を template の ID・名称・対象者・業務影響と担当の対応方針にした。セルの内容は変えていない / vp-arc-document-structure / -
- R2-4: R2 / 3. フロー詳細 / 項目名が template と違う（永続化点、整合性・再実行、失敗・補償、受入 KA-01）。scf-002 は「永続化点・整合性・再実行」を 1 項目にまとめていて、scf-001 と粒度がそろわない / 両フローの項目名を template の名前（永続化点・成功の確定、整合性・冪等・再実行、失敗・保持・補償・再開、受入条件: `KA-0n`）にした。scf-002 は保存の順と印字完了の判定を「永続化点・成功の確定」に、試行識別子と結果不明の扱いを「整合性・冪等・再実行」に分けた / vp-arc-document-structure、vp-qe-omissions-consistency / -
- R2-5: R2 / 5.3. 未決事項と後続作業 / template の「受入や運用への影響」「当面の扱い」の列がなく、2 列目の文にまとめて書かれている（R1-5 が R2 に回した指摘）。対象の欄が「両フロー」で、フロー ID と結ばれていない / 6 列に分け、影響と当面の扱いを専用の列へ移した。対象の欄は scf-001・scf-002 にした / vp-arc-document-structure、vp-qe-omissions-consistency / 要判断: 当面の扱いは、新しい事実を足さず本文から書いた（SU-01 は 5.2 の未実施のケース、SU-02 は概要の前提「自動再送しない」、SU-03 は 4.1 の「常駐監視や無人復旧があるとは扱わない」）。SU-01 の「実装に着手しない」は完了条件「実装着手前に正本を接続」から推した言い方。選ばなかった案は、当面の扱いを「なし」とすることで、template の注記に反するため採らなかった
- F001: R1 の直しで解消している。5.2 に「確認状況・不足の解消先」の列があり、全行が所在・網羅性・実行状況と SU への接続を持つことを確かめた
- F002 (vp-ux-language-consistency): R3 の観点なので、この段では直していない。R1-4 の案（照合待ちの定義を「本部受付またはローカル販売実績の保存のどちらかが確認できない状態」に広げる）を R3 に渡す

## 4. 進め方と実践の型の適用

sample-maintenance の進め方に従った。rulebook の本文構成と template を正として章の順・粒度・見出し・列名を照合し、sample だけを更新した。rulebook など sample 以外は変更していない。R1 が直した版を読み、R1 の指摘は繰り返していない。F001 は解消を確認し、F002 は R3 の観点として申し送った。5.3 の当面の扱いは新しい事実を足さず、本文の記述から書いた。
