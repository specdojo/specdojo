---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-design-imp-operations-sample-040-20261123t123604z-cf73596c
  type: exec-result
  task_id: T-KATA-WAVE-6-DESIGN-imp-operations-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-DESIGN-imp-operations-sample-040/T-KATA-WAVE-6-DESIGN-imp-operations-sample-040-20261123T123604Z-cf73596c/plan.md
  started_at: "2026-11-23T12:36:13.696Z"
  completed_at: "2026-11-23T12:43:59.723Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - specdojo:imp-operations-sample
    - specdojo:imp-operations-rulebook
---

# Edit Result

## 1. 実施内容

- rulebook (`docs/ja/specdojo/rulebooks/imp-operations-rulebook.md`) を更新し、grade の指摘事項である `F001` から `F011` までに対応した記述基準を整備しました。
- 評価観点を 4 つ（運用品質・障害対応力・運用負荷・利用者影響）に整理し、高・中・低の判定条件を定義しました。
- 対応方針の記述について、担当を個人名ではなく `Role code` で記載することを明文化し、表記の揺れ（影響度への統一）を解消しました。
- 未解決事項の管理方法として、決定期限やプロジェクト登録簿（`PJR`）への転記条件を含めるよう修正しました。
- 禁止事項を 6 項目に拡充し、実運用手順の詳細を書かないことや、再評価条件の明示などを規定しました。
- `F001` に関する「判断者（Role code）の記載」については、PJR-76N9 に従い、成果物の本文に役割の割り当てを求めない方針を維持し、運用面の結論の推奨に留めています。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/imp-operations-rulebook.md`: rulebook の章構成を整え、評価観点の定義、対応方針での `Role code` 使用、未解決事項の転記ルール、および禁止事項の拡充を行いました。これにより、`F001`〜`F011` の指摘事項を解消しました。

## 3. 申し送り

- sample (`docs/ja/specdojo/samples/imp-operations-sample.md`) は今回の段の対象外なので変更していません。次の段で rulebook の新しい本文要件に揃える必要があります。(1) 影響分析サマリに 4 観点（運用品質・障害対応力・運用負荷・利用者影響）、高・中・低の条件、案件の境界値、運用面の結論を書く (F008・F009)。(2) 目的と適用範囲に対象外の領域と対象期間を、変更要求の概要に判定できる成功条件を書く (F010)。(3) 対応方針の列を「影響度・対応項目・期限・担当・前提条件」にし、担当を個人名から `Role code` に直す (F002・F011)。(4) 未解決事項に「運用判断への影響・当面の扱い・転記先の登録項目」の列を足す (F004・F010)。(5) `based_on` を変更要求の個票 ID (`PJR-XXXX`) にする。
- F001 のうち「判断者 (Role code) を書く」は、PJR-76N9 で成果物の本文に承認の役割を求めない決まりがあるため、入れていません。運用面の結論の推奨のみを追記しました。
- F005 の「担当 Role code」は、見直す対象を位置づけの「追従」に書き、役割の割り当ては「共通の運用」（メンバー定義・メタ情報標準）に任せました。
- 記述ガイドの例で出した `opd-monitoring` は、実在を確かめていない例示の ID なので、wikilink にせずバッククォートで記述しました。
- sample（`imp-operations-sample.md`）は今回の段の対象外なので変更していない。次の段で rulebook の新しい本文要件に揃える必要がある。(1) 影響分析サマリに 4 観点（運用品質・障害対応力・運用負荷・利用者影響）、高・中・低の条件、案件の境界値、運用面の結論を書く（F008・F009）。(2) 目的と適用範囲に対象外の領域と対象期間を、変更要求の概要に判定できる成功条件を書く（F010）。(3) 対応方針の列を「影響度・対応項目・期限・担当・前提条件」にし、担当を個人名から Role code に直す（F002・F011）。(4) 未解決事項に「運用判断への影響・当面の扱い・転記先の登録項目」の列を足す（F004・F010）。(5) `based_on` を変更要求の個票 ID（`PJR-XXXX`）にする。
- F001 のうち「判断者（Role code）を書く」は入れていない。PJR-76N9 で、成果物の本文に承認の役割を求めないと決まっているため。運用面の結論の推奨だけを足した。
- F005 の「担当 Role code」は、見直す対象を位置づけの「追従」に書き、役割の割り当ては「共通の運用」（メンバー定義・メタ情報標準）に任せた。
- 記述ガイドの例で出した `opd-monitoring` は、実在を確かめていない例示の ID なので、wikilink にせずバッククォートで書いた。

## 4. 進め方と実践の型の適用

rulebook-maintenance
