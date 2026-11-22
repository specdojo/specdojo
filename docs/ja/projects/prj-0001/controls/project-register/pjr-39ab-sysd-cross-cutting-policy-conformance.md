---
specdojo:
  id: prj-0001:pjr-39ab-sysd-cross-cutting-policy-conformance
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-11-15T04:06:04Z"
---

# PJR-39AB 横断ルールの数値の境界と実装状況を照合する（sysd-cross-cutting-policy の Q1・Q2・Q4）

## 1. 課題内容

exec-defaults と実装を照合し、規則ごとに実装済み・未実装・不明を判定する

## 2. 入力

- sysd-cross-cutting-policy を確定するとき、本文の Q1・Q2・Q4 を期限付きの留保とした（indie が 2026-11-15 に承認）。Q3 は非機能要件・運用設計の整備に回す
- Q1: RET-002 の criticality・signal・attempt・backoff・上限到達時の処置。Q2: TIM-001 の経路別 timeout・終了猶予・子プロセス停止。Q4: CFG-003 の項目別の優先順と反映時点、全規則の実装状況

## 3. 影響範囲

| 観点         | 影響                                                                |
| ------------ | ------------------------------------------------------------------- |
| スコープ     | `sysd-cross-cutting-policy` の留保 Q1・Q2・Q4 と、exec の設定と実装 |
| スケジュール | 留保の期限までに照合の結果が要る                                    |
| コスト       | 中（設定と実装を読んで照らす。コードは変えない）                    |
| 品質         | 設計書の数値の境界が実装と食い違っていても気づけない                |
| 関係者       | オーケストレーター、利用者（留保の解消の判断）                      |

## 4. 対応方針

| 項目     | 内容                                                             |
| -------- | ---------------------------------------------------------------- |
| 原因     | 確定の時点で、規則ごとの実装状況と数値の境界を照らしていなかった |
| 対応策   | 設定と実装を照らして規則ごとに判定し、結果と直す案を個票に残す   |
| 依存事項 | なし                                                             |
| 完了条件 | 下の箇条書きのすべてを満たす                                     |

- Q1・Q2・Q4 の規則ごとに、`.specdojo/exec-defaults.yaml` と実装を照らして「実装済み・未実装・不明」に分け、根拠（ファイルと関数、設定のキー）を個票の対応結果の表に書く。
- 数値の境界（attempt・backoff・timeout・終了猶予）は、設計書の値と実装・設定の値を並べて書き、食い違いを示す。
- `sysd-cross-cutting-policy` は ready のため本文は変えず、直す案を個票の対応結果に書く。未実装で直すべきものは、起票の案を書く。
- コードと設定は変えない。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、「なし」と書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- `npm run lint:md` を通し、親の検証を通す。

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
