---
specdojo:
  id: prj-0001:pjr-y5ac-pm-quality-management-plan-rework-grade-findings
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
  registered_at: "2026-11-15T12:32:23Z"
  commit_type: docs
  commit_scope: pm
  approach: fully-guided
  targets:
    - prj-0001:pm-quality-management-plan
---

# PJR-Y5AC pm-quality-management-plan を grade の指摘で手直しする（project-kata の 140 の差し戻し）

## 1. 概要

pm-quality-management-plan を最新の grade の指摘で直す

## 2. 入力

- T-PROJECT-KATA-pm-quality-management-plan-140 で差し戻し（indie が 2026-11-15 に判断、PJR-TN43 の 1.4 の D）。2026-11-15 の grade で完了条件を満たしていない
- 最新の grade の未充足の完了条件と major の指摘を取り込む。本文は status: ready のまま差し戻したため、直す間の status の扱いも決める
- 2026-11-16 の再 grade は needs-work だった（結果は対応結果と `docs/ja/projects/prj-0001/execution/grade/results/prj-0001.pm-quality-management-plan.yaml`）。利用者は、close せず同じ項目に次の回の完了条件を足し、0.8.0 のリリースの後に流し直すことを選んだ（2026-11-16）

## 3. 完了条件

- 最新の grade の未充足の完了条件と major の指摘を取り込み、成果物カタログの完了条件をすべて満たす。直した後に `grade run --target deliverable` で grade し直し、結果を対応結果に書く。
- 本文はすでに `status: ready` のため、直す間に `draft` へ戻すか、`ready` のまま直すかを決め、理由を対応結果に書く（確定は人が 140 で行う）。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:catalog` と親の検証が通っている。
- 次の回（2026-11-16 の再 grade の指摘を取り込む回、0.8.0 の後）: `docs/ja/projects/prj-0001/execution/grade/results/prj-0001.pm-quality-management-plan.yaml` の未解消の指摘（major を優先）と未達の完了条件を取り込んで直し、作業内容の表を実績に合わせる。再 grade（`grade run --target deliverable`）は orchestrator が流すため、executor は理由をメモに書いてその行を open のまま残す。

## 4. 作業内容

| No  | 作業                                                   | 担当 | 状態 | メモ                                                             |
| --- | ------------------------------------------------------ | ---- | ---- | ---------------------------------------------------------------- |
| 1   | 最新の grade の指摘を取り込んで直す                    | PM   | done | executor が実施（対応結果を参照）                                |
| 2   | grade し直して結果を書く                               | PM   | done | 2026-11-16 orchestrator が grade（needs-work 93 点）             |
| 3   | 2026-11-16 の再 grade の指摘を取り込んで直す（次の回） | PM   | done | 2026-11-17 executor が F001〜F005 を取り込んだ（対応結果を参照） |
| 4   | 直した後に grade し直して結果を書く（次の回）          | PM   | open | 2026-11-17 の 2 回目の再 grade で needs-work                     |

## 5. 対応結果

- 実施内容: 2026-11-15 の grade の指摘 F001〜F019 を取り込み、[[prj-0001:pm-quality-management-plan|品質管理計画]] を直した。適用の開始と終了、人間と AI Agent の判断の境界、確認者と判断者の分担（RACI の `QE`=A/R と管理計画の `PO` の最終判断の整合）、検査表への参照、レビューの前提ゲート・出口条件・記録先、再判定の条件と責任の分離、重大性の境界、例外の承認条件、報告と登録の責任、`_UNDECIDED_:` の形式の未決表、見直しと追従の責任を加えた。
- status の扱い（executor の判断）: 直す間も `ready` のまま据え置いた。理由は、差し戻しの内容が章の中身の補強で、frontmatter と章構成を変えないためである。また `draft` へ戻すと、人が 140 で確定するまで `based_on` 側の管理計画から未確定の文書を参照する状態になるためである。確定は人が 140 で行う。
- 迷った点と決めた内容:
  - 期限付き例外: 管理計画の品質の行が「期限付き例外」を逸脱時対応に挙げている。そのため例外は残したが、必須の SC・AC と公開不適合は対象外とした。承認は人間の `PO` が行い、決定個票に記録する。
  - 検証手順の正本: lint などの検査は、`docs/ja/specdojo/exec-templates/xp-common-conventions-template.md` の検査表と `lefthook.yml`・`package.json` を正本として参照した。本書には転記していない。
  - メトリクス: 算出方法・閾値・計測頻度は成功条件を正とし、本書で再定義しなかった。正本に未定義の値は判定を保留する。成功条件の本文は宣言された参照範囲の外なので、定義済みかは確かめていない。
  - 試行記録の保存先: 未決表の「試行証跡の形式と保存先」で決めることにした。
- 残課題:
  - RACI の「成果物・品質ゲートの確認」が確認の責任だけを表し、ゲートの GO 判断は `PO` であることが RACI 側でも読めるかを確かめる。
  - 人が `grade run --target deliverable` で grade し直し、結果をここに追記する（executor の sandbox からは実行できないため未実施）。

再 grade の結果（2026-11-16、orchestrator が `grade run --target deliverable` で実行）:

- 判定は needs-work、93 点（前回は 75 点・指摘 19 件）。指摘は 5 件（major 4・minor 1）。
- 完了条件の判定は 3 件中 2 件を満たす（未達: DC-003）。
- major の指摘:
  - F002（vp-qe-done-criteria）: DC-003が満たされたと宣言する前に、承認されたトライアルエビデンスの形式およびリリース後の検証手順を完了させるか、参照してください。現在の表ではこれらの手順が未決定となっているため、必要な記録と実行をまだ検証できません。
  - F003（vp-qe-verifiability）: 具体的な試行証跡の形式と公開後価値の確認手順が未決であり、誰が何をどの順序で確認すればレビューを通過できるかを再現可能に判定できない。
  - F004（vp-qe-verifiability）: post-release valueゲートおよび該当する観察期間を使用して、不合格となったSC-04–SC-06の再評価条件を定義してください。現在の価値不適合の行はrepresentative-trialゲートを必要としていますが、これはSC-01–SC-03およびAC-01をチェックするものであるため、リリース後の失敗の回復を確立することができません。
  - F005（vp-ops-operability）: 是正エビデンスの準備、その記録場所、および影響を受けるSC-04–SC-06のチェックポイントにおけるQE/POの再評価を割り当てることで、運用上の是正ワークフローをリリース後の価値の失敗まで拡張してください。すべての価値の失敗をrepresentative-trialゲートに戻すと、計画の後半の運用期間において適用可能な回復ワークフローがなくなります。
- 結果の正本は `docs/ja/projects/prj-0001/execution/grade/results/prj-0001.pm-quality-management-plan.yaml`。

次の回の対応（2026-11-17、executor が実施）:

- 実施内容: 2026-11-16 の再 grade の指摘 F001〜F005 と未達の DC-003 を取り込んだ。
  - F002・F003: 「レビューと証跡」に、試行記録と公開後価値記録の様式（条件 ID ごとに 1 件、証跡項目に加えて測定方法の参照・測定値・合格・未達・保留の区分）と、確認の順序（`BA` が記録をそろえ、`QE` が照合し、`PM` が判定材料にまとめ、`PO` が判断する）を定めた。公開後価値の観測結果のレビュー行も加えた。未決表は形式と手順を外し、保存先だけを `_UNDECIDED_:` として残した。
  - F004・F005: 「不適合と是正」の価値不適合を初期公開前と公開後に分けた。公開後の行は、`BA` が是正の証跡を整え、`PM` が改善策を Schedule に置き、未達の SC-04〜SC-06 を成功条件の判定時期内の次の観測時点に同じ測定方法で再確認して公開後価値ゲートを満たすことを再判定条件とし、`QE` が照合、`PO` が継続を判断する。
  - F001: 決定時期を Schedule の節目に置くことと、未決の時点で表の保留列に当たるタスクとゲートを特定することを `PM` の責任として書いた。
- status の扱い: 前回と同じく `ready` のまま直した。章構成と frontmatter を変えない補強のためである。確定は人が 140 で行う。
- 迷った点と決めた内容:
  - 記録の様式と確認の順序は `PO` の決定を待たず本書で定めた。様式の項目は本書の既存の証跡項目と成功条件の測定方法の参照から組み、順序は管理計画の判断ゲート（`BA`・`PM` が起案、`PO` が最終判断）と RACI の品質確認（`QE`）に合わせたため、新しい事実を加えていない。`PO` は 140 の確定でこの様式と順序を承認する。
  - 保存先は根拠となる資料がないため、具体的なパスを書かず未決のまま残した。
  - SC-04〜SC-06 の観測時点・期間は成功条件の判定時期を正とし、本書で数値を定めなかった。

2 回目の再 grade の結果（2026-11-17、orchestrator が `grade run --target deliverable --by sol-review-executor` で実行）: needs-work、94 点。指摘は 3 件（すべて major）。完了条件は 3 件中 2 件（DC-003 QE が未達）。公開後 6・9・24 か月の判定時期に未達が確定したときの、再検証の時期・必要な観測期間・再合格条件と、期限後の是正の手順（PM・PO・BA・QE）が定まっていない。結果の正本は `docs/ja/projects/prj-0001/execution/grade/results/prj-0001.pm-quality-management-plan.yaml`。

## 6. 関連ドキュメント

- [[prj-0001:pjr-tn43-user-decisions-pending]]
