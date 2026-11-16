---
specdojo:
  id: prj-0001:pjr-cpzh-prj-comparison-of-alternatives-rework-grade-findings
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
  registered_at: "2026-11-15T12:32:36Z"
  commit_type: docs
  commit_scope: pm
  approach: fully-guided
  targets:
    - prj-0001:prj-comparison-of-alternatives
---

# PJR-CPZH prj-comparison-of-alternatives を grade の指摘で手直しする（project-kata の 140 の差し戻し）

## 1. 概要

prj-comparison-of-alternatives を最新の grade の指摘で直す

## 2. 入力

- T-PROJECT-KATA-prj-comparison-of-alternatives-140 で差し戻し（indie が 2026-11-15 に判断、PJR-TN43 の 1.4 の D）。2026-11-15 の grade で完了条件を満たしていない
- 最新の grade の未充足の完了条件と major の指摘を取り込む。本文は status: ready のまま差し戻したため、直す間の status の扱いも決める
- 2026-11-16 の再 grade は needs-work だった（結果は対応結果と `docs/ja/projects/prj-0001/execution/grade/results/prj-0001.prj-comparison-of-alternatives.yaml`）。利用者は、close せず同じ項目に次の回の完了条件を足し、0.8.0 のリリースの後に流し直すことを選んだ（2026-11-16）

## 3. 完了条件

- 最新の grade の未充足の完了条件と major の指摘を取り込み、成果物カタログの完了条件をすべて満たす。直した後に `grade run --target deliverable` で grade し直し、結果を対応結果に書く。
- 本文はすでに `status: ready` のため、直す間に `draft` へ戻すか、`ready` のまま直すかを決め、理由を対応結果に書く（確定は人が 140 で行う）。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:catalog` と親の検証が通っている。
- 次の回（2026-11-16 の再 grade の指摘を取り込む回、0.8.0 の後）: `docs/ja/projects/prj-0001/execution/grade/results/prj-0001.prj-comparison-of-alternatives.yaml` の未解消の指摘（major を優先）と未達の完了条件を取り込んで直し、作業内容の表を実績に合わせる。再 grade（`grade run --target deliverable`）は orchestrator が流すため、executor は理由をメモに書いてその行を open のまま残す。
- 3 回目の実行（2026-11-17、2 回目の再 grade の指摘を取り込む回）: `docs/ja/projects/prj-0001/execution/grade/results/prj-0001.prj-comparison-of-alternatives.yaml` の major のうち、F003（各セルの根拠）を直す。未確認を Middle とする規則を改め、確認済みの中間評価と未判定を分け、各セルに根拠資料の該当箇所または観察結果と確認作業を記録し、未判定の採否への扱いを定める。作業内容の表を実績に合わせる。再 grade は orchestrator が流すため、executor はその行を open のまま残す。

## 4. 作業内容

| No  | 作業                                                   | 担当 | 状態 | メモ                                                           |
| --- | ------------------------------------------------------ | ---- | ---- | -------------------------------------------------------------- |
| 1   | 最新の grade の指摘を取り込んで直す                    | PM   | done | executor が実施（対応結果を参照）                              |
| 2   | grade し直して結果を書く                               | PM   | done | 2026-11-16 orchestrator が grade（needs-work 91 点）           |
| 3   | 2026-11-16 の再 grade の指摘を取り込んで直す（次の回） | PM   | done | executor が F001〜F006 を取り込んだ（対応結果を参照）          |
| 4   | 直した後に grade し直して結果を書く（次の回）          | PM   | done | 2026-11-17 の 2 回目の再 grade で needs-work                   |
| 5   | 2 回目の再 grade の指摘を取り込んで直す（3 回目）      | PM   | done | executor が F001〜F004 を取り込んだ（対応結果を参照）          |
| 6   | 直した後に grade し直して結果を書く（3 回目）          | PM   | open | 2026-11-17 の 3 回目の再 grade で needs-work。利用者の判断待ち |

## 5. 対応結果

- 実施内容: 2026-11-15 の grade の指摘 F001〜F010 を [[prj-0001:prj-comparison-of-alternatives|代替案比較]] に取り込んだ。
  - 評価軸と評価基準: 全軸の判定基準を High / Middle / Low の境界で書き直し、D-02・D-03 に「統合する最低観点」と「主に対応する課題・制約」の列を追加した（F005・F010）。「判定の根拠と集約規則」を新設し、机上評価であること、D-01 の重みによる総合評価の規則、D-02・D-03 の正本・試行・非採択の規則を定めた（F008）。
  - 比較結果と採択理由: D-02 に方式ごとの評価根拠と再評価条件の表を追加し、SDD-06 の非採択理由と再評価条件を記した（F001）。「技術的実現性と影響」に後続作業の担当と確認方法・期待結果を追加した（F003・F006）。「比較試行の計画と完了条件」を新設し、WP-01〜WP-05 と DP-01 の担当 Role・前提・完了条件と、継続利用・撤退の判定条件を定めた（F002・F009）。
  - リスクとトレードオフ・決定と見直し: 表の各行に決定・案 ID と担当・完了条件を付け、非採択案のトレードオフを追加した（F007）。管理事項を試行結果・リスク・課題・変更要求・未決事項に分け、記録先と担当を定めた（F004）。
- status の扱い: `ready` のまま直す。理由は、`ready` は人が付けた状態で、`draft` へ戻すと人の再昇格が必要になること、変更は本タスクの worktree に閉じ、統合前に 140 で人が確認することである。確定は人が 140 で行う。
- 迷った点と決めた内容:
  - 試行の作業時間の上限は根拠資料で未決のため数値を置かず、[[prj-0001:prj-issues-and-approach|プロジェクト課題と解決アプローチ]] の「費用・負荷の上限を決める」に従い、決まるまで試行を始めない条件にした。
  - 試行の実施担当は、成果物内で方式境界を担う `ARC`（AI Agent が支援）とした。
  - 記録先は実在を確認できる [[prj-0001:pjr-index|プロジェクト登録簿]] に一本化し、実在を確認できない「技術検証結果」は外した。
  - 既存の評価セルは変えず、判定境界と集約規則は既存の判定と整合するように定めた。
- 再 grade: executor では `grade run --target deliverable` を実行していない（agent CLI の起動を要するため）。runner または人が実行し、結果をここへ追記する。
- 残課題: 再 grade の実行と結果の記入、140 での status の確定。

再 grade の結果（2026-11-16、orchestrator が `grade run --target deliverable` で実行）:

- 判定は needs-work、91 点（前回は 86 点・指摘 10 件）。指摘は 6 件（major 1・minor 5）。
- 完了条件の判定は 4 件中 4 件を満たす（すべて満たす）。
- major の指摘:
  - F004（vp-qe-verifiability）: High・Middle・Lowの判定境界、各セルの根拠、D-01の重みを総合評価と採否へ反映する規則がなく比較結果を再現できないため、尺度・証拠・集約規則を明記してください。
- 結果の正本は `docs/ja/projects/prj-0001/execution/grade/results/prj-0001.prj-comparison-of-alternatives.yaml`。

次の回の対応（2026-11-16 の再 grade の指摘 F001〜F006 を取り込む回）:

- 実施内容: [[prj-0001:prj-comparison-of-alternatives|代替案比較]] を次のとおり直した。
  - F004（major）: 「判定の根拠と集約規則」に、High・Middle・Low を順序尺度とし判定基準の何番目の条件に当たるかで決める規則、根拠表に記すセルの範囲、D-01 の重み5・4・3 が総合評価と採否へ与える役割を定めた。D-01 に案ごとの High・Low の根拠表を比較表の直後に追加し、D-02 の根拠表に必須条件の軸の根拠の列を加え、D-03 の説明文を同じ形の根拠表に置き換えた。既存の評価セルと判定は変えていない。
  - F001: 廃止された ACD-C03 の参照 3 箇所を、ACD-A01 と憲章の「権限委譲」に置き換え、「前段文書から引き継ぐ条件」に憲章の「権限委譲」が承認事項の正本であることを記した。
  - F002: Spec Kit の「固定ワークフロー」を「既定プロセス」に改め、カスタマイズの可否は机上で判定せず、試行する版と構成を WP-01 で固定して評価を更新することにした。
  - F003: 検証手順の正本は前提・制約・依存関係の ACD-D04 で `ARC` が特定するとし、特定まで D-01・D-02 の「検証エラー 0 件」の確認と WP-02 を完了扱いにしないことにした。
  - F005: WP-03 を反映案の作成（正本は変更しない）に改め、`BA` の意図確認（WP-04）の後に正本への反映（WP-05）を置いた。検証と評価記録は WP-06 に繰り下げ、参照を追従させた。
  - F006: D-03 の確認に、Issue の受付開始前に `QE` が転記規則（議論の要点・判断根拠・ID 対応）を確認することと、GitHub を参照せず正本だけで経緯を確認できることを加えた。
- status の扱い: 前の回と同じく `ready` のまま直した。理由は前の回と同じで、確定は人が 140 で行う。
- 迷った点と決めた内容:
  - 検証コマンドは宣言された根拠資料で特定できないため具体的なコマンドを書かず、正本を特定する作業（ACD-D04 の `ARC`）への依存として示した。
  - Spec Kit の版と既定プロセスの詳細は外部資料の調査を要するため本タスクでは確認せず、WP-01 で固定する事項にした。
  - D-01 の重み4の軸のうち、採否の区分を変えるのはリスクの Low だけとした。既存の判定（STR-01 は適応性が Low でも一部採択）と整合させるためである。
- 再 grade: executor では実行していない（agent CLI の起動を要するため）。作業内容の No.4 は open のまま残し、orchestrator が `grade run --target deliverable` を流して結果を追記する。

2 回目の再 grade の結果（2026-11-17、orchestrator が `grade run --target deliverable --by sol-review-executor` で実行）: needs-work、93 点。指摘は 4 件（major 1・minor 3）。完了条件は 4 件中 4 件を満たす。major の F003 は、判定境界と集約規則は足されたが各セルの根拠が未解消で、未確認を Middle とする規則を改め、確認済みの中間評価と未判定を分けて根拠を記録するよう求める。結果の正本は `docs/ja/projects/prj-0001/execution/grade/results/prj-0001.prj-comparison-of-alternatives.yaml`。

3 回目の対応（2026-11-17、2 回目の再 grade の指摘 F001〜F004 を取り込む回）:

- 実施内容: [[prj-0001:prj-comparison-of-alternatives|代替案比較]] を次のとおり直した。
  - F003（major）: 「判定の根拠と集約規則」で、未確認を Middle とする規則をやめ、2番目の条件に当たると確認できたセルだけを Middle とし、確認できないセルと版・構成で当たる条件が変わるセルを「未判定」とした。根拠資料（D-01 は「比較対象案」と P-01〜P-03、D-02・D-03 は「比較対象案」の同じ方式 ID の行と同名の公式資料）と確認作業（根拠資料の記載と判定基準の照合）を定め、未判定の採否への扱い（確定しても判定が変わらない案は確認済みのセルで判定し、変わりうる案は確認作業まで判定を確定しない）を加えた。D-01・D-02・D-03 の根拠表を High・Middle・Low（D-02・D-03 は Low・未判定）の列に分け、全セルの判定理由を軸名付きで記し、未判定のセルに理由と確認作業を記した。
  - 未判定にしたセル: SDD-01〜SDD-05 と TSK-01 の成熟度、SDD-04 の可逆性、SDD-05 の中立性・人間の統制・導入・移行負荷・可逆性、TSK-04 の運用負荷、TSK-05 の外部協働。SDD-02・SDD-03 の成熟度は WP-01 で版を固定して判定することにし、WP-01 の作業と完了条件に加えた。
  - F002: SDD-04 は、中立性の Low を構成によらない製品一般の制約（Specs の実行が Kiro 製品を前提とする）とし、可逆性は版と構成で変わるため未判定とした。SDD-05 は、構成によらない制約を SpecDojo との責務の重複とし、使う機能群と版で変わる導入・移行負荷などを未判定とした。
  - F004: TSK-02 の運用負荷を、Issue ごとの正本への転記とクローズ後の照合を含めて Middle に改めた。採否（段階採用）は変わらない。
  - F001: 検証手順は ACD-D04 が正本とする品質管理計画の検証方針に従うと改め、手順の充足（定義が欠ける場合は `ARC` が課題として記録）と実行確認（`QE` が検証を実行して確認）を分けた。WP-02 の前提を「検証方針の定義の充足」に改めた。
- status の扱い: 前の回と同じく `ready` のまま直した。理由は前の回と同じで、確定は人が 140 で行う。
- 迷った点と決めた内容:
  - D-02・D-03 の採否規則に、正本以外の案は正本が High でない軸を High で補う場合に試行・段階採用すること、成熟度は補う軸に含めないこと、D-02 では優先試行案の比較対照を一つ比較試行にできることを加えた。SDD-05 の導入・移行負荷を未判定にすると、従来の規則では Low の軸がない案として試行対象になるためである。既存の判定（採択・試行・非採択・保留）はすべて変えていない。
  - TSK-03・TSK-04 の外部協働を High から Middle に改めた。外部参加者はサイト・ワークスペースへの招待を経て参加する方式で、判定基準の High（Issue / PR へ直接参加できる）の根拠を記せないためである。採否（非採択）は変わらない。
  - TSK-02 の依存表現の根拠（Issue 間の依存と Projects で blocker と順序を表せる）と、SDD-04・SDD-05 の製品の性質（Specs の利用環境、機能群の個別利用）は、宣言された根拠資料に詳細がなく、2 回目の再 grade の指摘と公式資料の一般的な説明に基づく。executor は外部資料を確認していないため、WP-01 または再評価の条件の発生時に公式資料で確かめる。
  - SpecDojo 自体（SDD-01・TSK-01）の成熟度は、互換性・更新方針の公開資料を確認していないため未判定とし、`ARC` の確認作業とした。正本の採否は必須条件の軸で決まるため変わらない。
- 再 grade: executor では実行していない（agent CLI の起動を要するため）。作業内容の No.6 は open のまま残し、orchestrator が `grade run --target deliverable` を流して結果を追記する。

3 回目の再 grade の結果（2026-11-17、orchestrator が `grade run --target deliverable --by sol-review-executor` で実行）: needs-work、95 点。指摘は 4 件（major 1・minor 3）。完了条件は 4 件中 4 件を満たす。major の F002 は 2 回目と同じ文面で、各セルの根拠が未解消とする。3 回目で未判定を分け、判定の根拠と集約規則の節と High の根拠の表を足したが、Middle・Low のセルの根拠を求めているとみられる。4 回目を流すか、カタログの完了条件を満たしたとして close するかを利用者が判断する。結果の正本は `docs/ja/projects/prj-0001/execution/grade/results/prj-0001.prj-comparison-of-alternatives.yaml`。

## 6. 関連ドキュメント

- [[prj-0001:pjr-tn43-user-decisions-pending]]
