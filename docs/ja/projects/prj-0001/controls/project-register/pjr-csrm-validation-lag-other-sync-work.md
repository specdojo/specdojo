---
specdojo:
  id: prj-0001:pjr-csrm-validation-lag-other-sync-work
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: waiting
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-25T21:59:34Z"
  due_on: "2026-11-30"
  block_reason: "parent validation failed: lint-ts, typecheck"
  derived_from:
    - PJR-P8SX
---

# PJR-CSRM 親の検証の終わりに気づくまでの遅れが、統合の commit 以外の同期の処理で残る

## 1. 課題内容

P8SX で統合の commit を非同期にした後も、親の検証の終わりに気づくまでの遅れが平均約 30 秒、最大約 140 秒残る。npm ci・specdojo build・root への merge など、event loop を止める別の同期の処理を特定して除く。

## 2. 入力

- 2026-11-25 22:30〜2026-11-26 06:00 の全件レビュー（--parallel 4 と 3）で、validation-exit-timing は 246 件。`duration_ms` は平均 33.2 秒・最大 142.1 秒、`detection_lag_ms` は平均 29.8 秒・最大 139.9 秒、`event_loop_delay_max_ms` は平均 31.8 秒・最大 139.8 秒。
- P8SX の個票では、npm ci・specdojo build・root への merge を、計測で目立たないため同期のまま残したと記録している。

## 3. 影響範囲

| 観点         | 影響                                                                    |
| ------------ | ----------------------------------------------------------------------- |
| スコープ     | `--parallel` の runner の、統合の commit 以外の同期の処理               |
| スケジュール | 親の検証が終わってから次へ進むまでに、平均約 30 秒、最大約 140 秒かかる |
| コスト       | 一括実行の全体の時間が延びる                                            |
| 品質         | 計測の値（`duration_ms`）が実際の検証の時間より長く出る                 |
| 関係者       | DEV（実装）、オーケストレーター（一括実行の運用）                       |

## 4. 対応方針

| 項目     | 内容                                                                                       |
| -------- | ------------------------------------------------------------------------------------------ |
| 原因     | 未特定。PJR-P8SX で同期のまま残した `npm ci`・`specdojo build`・root への merge などが候補 |
| 対応策   | 計測で処理を特定し、処理の動きを長く止めるものを非同期にするか子のプロセスへ移す           |
| 依存事項 | なし                                                                                       |
| 完了条件 | 「完了条件」の章のとおり                                                                   |

## 5. 完了条件

- 遅れの原因の処理を計測で特定し、処理ごとの平均と最大の時間を個票の対応結果に表で書く。
- 処理の動きを長く止めるものを、非同期にするか子のプロセスへ移す。統合の順序と lock の扱いは変えない。
- 目標は、`--parallel 3` の実行で `detection_lag_ms` の平均 5 秒以下、最大 30 秒以下とする（2026-11-26 indie の決定）。
- 単体テストで、移した処理の順序と lock の扱いが変わらないことを確かめる。
- 統合の後に、オーケストレーターが `--parallel 3` で数件流し、計測の値を確かめる。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証を通す。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 保護された設定（`.specdojo/exec-defaults.yaml`・オーケストレーターの本文など）は変えない。変更が要る場合は、案を個票の対応結果と報告の `handoff` に書く。反映は利用者の承認のもとで行う。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 統合の後に、オーケストレーターが実際の run を流して動きを確かめてから close する（executor は行わない）。

## 6. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 7. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
