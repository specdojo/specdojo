---
specdojo:
  id: prj-0001:pjr-q5yp-comprehension-debt-measurement
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  difficulty: hard
  owner: BA
  registered_at: "2026-11-23T13:11:12Z"
  due_on: "2026-11-30"
  completed_at: "2026-11-25T22:38:15Z"
  conclusion: 理解の負債の測り方（引き継ぎのテスト）と、OpenFisca-Japan で 1 回試す計画を pm-comprehension-debt-trial-plan に書いた。
  derived_from:
    - PJR-Y5RD
  commit_type: docs
  commit_scope: project
---

# PJR-Q5YP 理解の負債の測り方を定め、OpenFisca-Japan で試す計画を作る

## 1. 概要

新しい参加者や agent が文書だけで主要な問いに答え、変更を始められるかを測る引き継ぎのテストを決め、既存のコードからの復元を含めて OpenFisca-Japan で試す計画を書く

## 2. 入力

- PJR-Y5RD の決定（2026-11-23）: kata による理解の負債の解消で、シビックテックを持続可能にすることを中核の位置づけにする

## 3. 完了条件

- 理解の負債の測り方（引き継ぎのテスト）を決める。少なくとも、新しい参加者（人または agent）が文書だけで、(1) 主要な問い（何のためのシステムか、なぜこの設計か、何が未決か）に答えられるか、(2) 意味のある変更を始めるまでの時間、(3) 答えの誤り・推測の数を測る。prj-overview の BV-03 の判定とどうつながるかを書く（PJR-Y5RD）。
- OpenFisca-Japan で 1 回試す計画を書く。既存のコードから仕様と要件を kata で復元する（retrofit）流れを含め、復元した内容の確認状態と、当事者や経験者による確定の手順を決める。OpenFisca-Japan の側で行う作業は、利用側の登録簿に起票する案として書く（この項目では OpenFisca-Japan のリポジトリを変えない）。
- 試した結果を記録する置き場所と書式を決める。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。影響がなければ「なし」と書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` など）は変えない。
- `npm run lint:md`・`npm run lint:fm` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業                           | 担当 | 状態 | メモ                                                                                        |
| --- | ------------------------------ | ---- | ---- | ------------------------------------------------------------------------------------------- |
| 1   | 前提・成功条件と測定方法の整理 | BA   | done | PJR-Y5RD、BV-03、SC-03 を確認。文書テストの問い・採点・着手時間・誤りと推測・比較条件を定義 |
| 2   | OpenFisca-Japan の試行計画     | BA   | done | retrofit、確認状態、人による確定、改善完了の確認と利用側への3件の起票案を記載               |
| 3   | 記録先・書式と申し送りの整理   | BA   | done | 原票・比較表・負荷・判定・是正の記録を定義。実施は利用側の後続作業                          |

## 5. 対応結果

### 5.1. 実施内容と成果物

[[prj-0001:pm-comprehension-debt-trial-plan|理解の負債の測定と OpenFisca-Japan 試行計画]]を作成した。文書だけで答える6問、変更開始票、回答の充足・誤り・推測・着手時間、復元前後の比較方法を定めた。SC-03 の判断には改善の完了と参加者別負荷の証拠も必要とし、文書テストと区別した。

利用側の作業は準備と A 測定、kata による復元と人の確認、B 測定と価値判定の3件の起票案にまとめた。原票・復元根拠・費用と負荷・比較判定の保存先と書式を計画内に定めた。OpenFisca-Japan のリポジトリは調査・変更しておらず、試行は未実施である。

### 5.2. 判断した内容と理由

- 初回は同じ設定の独立した新規 agent セッションで A/B を測る最小構成とした。同一参加者の学習による見かけの改善を避け、人による実施にも同じ条件を適用するため。
- 文書段階は30分、回答は6問計12点を運用目安とし、改善段階は別に90分の実作業上限案を置いた。着手と改善完了を混同せず、少人数の試行を限定した負担で行うため。利用側 `PO`・`PM` が参加者別時間・費用上限を開始前に承認する。
- 確認状態は本文の主張別表で記録する。PJR-DZMV の共通方式を先取りせず、推測・根拠で確認・当事者が確定・未確認を区別して試せるため。
- 計画は prj-0001 の管理文書に置き、試行記録の原本は利用側に置く。将来の実測と今回の計画完了を分け、根拠と作業の所在を一致させるため。

### 5.3. 残課題と後続作業

利用側 `BA`・`PM` は計画の起票案をもとに、対象範囲・実装パス・協力者・参加者・正解票・保存先・時間と費用上限を確定してから試行する。対象や協力者は本項目で承諾済みとは扱わない。試行結果は利用側の記録を正本とし、prj-0001 の後続報告項目から参照する。PJR-BXYM・PJR-DZMV の採択後は適用する型と確認状態の方式を見直す。

検証は executor の整形・履歴リンク・カタログ検証と、親 runner の Markdown・frontmatter 等の検証に分担する。実施コマンドと成否は executor evidence へ記録し、reporter が result に反映する。

### 5.4. CHANGELOG に書く事項

なし。プロジェクト内の測定・試行計画の追加であり、配布機能・標準仕様の変更はない。

## 6. 関連ドキュメント

- [[prj-0001:pm-comprehension-debt-trial-plan|理解の負債の測定と OpenFisca-Japan 試行計画]]: 本項目の成果物。
- [[prj-0001:pjr-y5rd-civic-tech-comprehension-debt|PJR-Y5RD]]: 中核の位置づけと最初の実証の場の決定。
- [[prj-0001:prj-overview|プロジェクト概要]]、[[prj-0001:prj-success-criteria-and-acceptance-criteria|成功基準と受入条件]]: BV-03 と SC-03 の判定の正本。
- [[prj-0001:pjr-bxym-civic-tech-starter-kata|PJR-BXYM]]、[[prj-0001:pjr-dzmv-restored-content-confirmation-status|PJR-DZMV]]: 型と確認状態の後続検討。
