---
specdojo:
  id: prj-0001:pjr-tvwr-prj-assumptions-constraints-dependencies-rework-grade-findings
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: medium
  owner: PM
  registered_at: "2026-11-15T12:32:32Z"
  commit_type: docs
  commit_scope: pm
  approach: fully-guided
  targets:
    - prj-0001:prj-assumptions-constraints-dependencies
---

# PJR-TVWR prj-assumptions-constraints-dependencies を grade の指摘で手直しする（project-kata の 140 の差し戻し）

## 1. 概要

prj-assumptions-constraints-dependencies を最新の grade の指摘で直す

## 2. 入力

- T-PROJECT-KATA-prj-assumptions-constraints-dependencies-140 で差し戻し（indie が 2026-11-15 に判断、PJR-TN43 の 1.4 の D）。2026-11-15 の grade で完了条件を満たしていない
- 最新の grade の未充足の完了条件と major の指摘を取り込む。本文は status: ready のまま差し戻したため、直す間の status の扱いも決める
- 2026-11-16 の再 grade は needs-work だった（結果は対応結果と `docs/ja/projects/prj-0001/execution/grade/results/prj-0001.prj-assumptions-constraints-dependencies.yaml`）。利用者は、close せず同じ項目に次の回の完了条件を足し、0.8.0 のリリースの後に流し直すことを選んだ（2026-11-16）

## 3. 完了条件

- 最新の grade の未充足の完了条件と major の指摘を取り込み、成果物カタログの完了条件をすべて満たす。直した後に `grade run --target deliverable` で grade し直し、結果を対応結果に書く。
- 本文はすでに `status: ready` のため、直す間に `draft` へ戻すか、`ready` のまま直すかを決め、理由を対応結果に書く（確定は人が 140 で行う）。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:catalog` と親の検証が通っている。
- 次の回（2026-11-16 の再 grade の指摘を取り込む回、0.8.0 の後）: `docs/ja/projects/prj-0001/execution/grade/results/prj-0001.prj-assumptions-constraints-dependencies.yaml` の未解消の指摘（major を優先）と未達の完了条件を取り込んで直し、作業内容の表を実績に合わせる。再 grade（`grade run --target deliverable`）は orchestrator が流すため、executor は理由をメモに書いてその行を open のまま残す。

## 4. 作業内容

| No  | 作業                                                   | 担当 | 状態 | メモ                                                 |
| --- | ------------------------------------------------------ | ---- | ---- | ---------------------------------------------------- |
| 1   | 最新の grade の指摘を取り込んで直す                    | PM   | done | executor が実施（対応結果を参照）                    |
| 2   | grade し直して結果を書く                               | PM   | done | 2026-11-16 orchestrator が grade（needs-work 88 点） |
| 3   | 2026-11-16 の再 grade の指摘を取り込んで直す（次の回） | PM   | done | 2026-11-17 executor が実施（対応結果を参照）         |
| 4   | 直した後に grade し直して結果を書く（次の回）          | PM   | open | agent の sandbox では実行できず orchestrator が流す  |

## 5. 対応結果

- 2026-11-16 の executor が、2026-11-15 の grade の指摘 F001〜F024 を [[prj-0001:prj-assumptions-constraints-dependencies|前提・制約・依存関係]] に取り込んだ。
  - 公開情報の制約: 憲章の「主要前提・制約」はこの制約をスコープへ委譲しているが、スコープ側に定義がないため、ACD-C04（検知、公開保留、非公開化・削除・匿名化、再レビュー、`PO` 判断）として追加した（F003・F008・F015・F017・F022・F024）。
  - 公開範囲: ACD-D02 を「ライセンス MIT は決定済み、初期公開範囲は未成立」の一部成立に改め、未決の影響と次アクションを書いた。ACD-D03 は公開先と受付方法に絞って成立済みとし、「貢献導線」と「変更提案の受付方法」は同じものとして ACD-D03 を正とした（F001・F002・F005・F009・F010・F021・F023）。
  - ACD-C03 は憲章の「権限委譲」「本格実行開始の GO / Not GO 判断」と同じ内容のため廃止し、`PM` が承認証跡を確認する責任は章の冒頭に残した。ID は再利用しない（F011）。
  - ACD-D01 に成果物カタログ、成功基準と受入条件、品質管理計画への参照と判定時期を足した（F004・F016・F020）。ACD-A02 にはプロジェクト管理計画の代表試行の開始条件と、それまで保留する作業を足した（F006）。
  - 監視・変更管理に、課題・リスク・変更要求・決定記録の分け方と報告先（F007）、`ARC` と `QE` の確認責任（F018・F019）を足した。
- 迷った点と決めた内容:
  - status: 本文は `draft` に戻した。major の指摘が 15 件あり、決定状態の誤り（公開範囲を決定済みと書いていた）も直すため、再 grade で確かめるまでは承認済みとして参照させない方がよいと判断した。`ready` へ戻すかは人が 140 で判断する。
  - ACD-D04 の検証コマンドの正本（F012〜F014）: 宣言された資料からは正本を特定できないため、具体値は書かずに _TODO_ を残した。`ARC` が正本を特定する（品質管理計画の検証方針を候補とする）。
  - 初期公開範囲の決定を追跡する登録簿項目: `PJR-0120` で続けるか新しく登録するかが決まっていないため、_TODO_ として `PM` に申し送った。
  - 個票本文（`PJR-0120`・`PJR-0121`）は宣言された参照範囲の外なので読んでいない。決定内容は grade の指摘と既存の記述に従った。
- 残課題: `grade run --target deliverable` での grade のやり直しは agent の sandbox では実行できない（agent CLI と利用枠を使う）ため、まだ実行していない。人またはオーケストレーターが実行し、結果をここに書く。

再 grade の結果（2026-11-16、orchestrator が `grade run --target deliverable` で実行）:

- 判定は needs-work、88 点（前回は 70 点・指摘 24 件）。指摘は 9 件（major 1・minor 8）。
- 完了条件の判定は 4 件中 4 件を満たす（すべて満たす）。
- major の指摘:
  - F009（vp-qe-config-validity）: 未解決の _TODO_ / _ASSUMPTION_ が残っています。
- 結果の正本は `docs/ja/projects/prj-0001/execution/grade/results/prj-0001.prj-assumptions-constraints-dependencies.yaml`。

次の回（2026-11-17、executor が 2026-11-16 の再 grade の指摘 F001〜F009 を取り込んだ）:

- ACD-D02（F002・F003・F009）: ライセンス MIT の決定と初期公開範囲の未決を分けた。憲章の「ハイレベルスコープ」「未決事項」に残るライセンス方針の未決記載は `PJR-0120` の決定で置き換わったものとして扱い、憲章の追従更新は `PM` が登録簿で追跡すると書いた。_TODO_ は消した。
- ACD-D04（F001・F004〜F009）: 検証コマンド・対象・期待結果・失敗時の確認先・再確認範囲の正本を品質管理計画の検証方針とした。成立の確認時期（作業環境の変更後に検証の実行を伴う作業を再開する前と、ACD-D01 の受入判定の前）、確認者（`ARC`）、証跡の記録先（レビュー記録）、定義が欠ける場合の扱い（課題として登録簿に記録し、影響する作業を保留する）を書いた。_TODO_ は消した。
- 迷った点と決めた内容:
  - 初期公開範囲を追跡する登録簿項目: `PJR-0120` で続けず、新しい項目を起票すると決めた。`PJR-0120` は決定済みで、未決の論点を同じ項目に混ぜると決定状態を追えなくなるため。起票の時期は、成果物カタログと成功基準の詳細化が終わり `PO` に判断を求める前とした。起票と項目 ID の追記は `PM` が行う。
  - 検証の正本: 憲章の「本格実行開始の GO / Not GO 判断」が品質（検証方針）の記録先を品質管理計画としていることを根拠に、正本を品質管理計画とした。品質管理計画は宣言された参照範囲の外のため、本文は読んでいない。同計画に必要な定義がなければ、ACD-D04 のとおり `ARC` が課題として記録する。
  - 憲章の追従更新: 憲章は本タスクの対象外のため直していない。ライセンス方針を決定済みに改める更新は `PM` が別の項目で起票する。
  - status: 本文の `draft` はそのまま据え置いた。major の指摘を直したばかりで、再 grade で確かめる前に `ready` にしない方がよいため。`ready` に戻すかは人が 140 で判断する。
- 再 grade（`grade run --target deliverable`）は agent の sandbox では実行できない（agent CLI と利用枠を使う）ため、作業内容の No 4 は open のまま orchestrator に申し送る。

## 6. 関連ドキュメント

- [[prj-0001:pjr-tn43-user-decisions-pending]]
