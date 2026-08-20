---
specdojo:
  id: prj-0001:pjr-cmyx-exec-dist-parent-validations
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: ARC
  registered_at: "2026-08-20T12:28:52Z"
  due_on: "2026-08-31"
---

# PJR-CMYX exec 実行が古い dist ビルドを使い設定済み parent_validations が実行されない

## 1. 課題内容

specdojo の bin は dist/specdojo.js を指すため、npm run build を再実行しない限り古い挙動で exec run が動く。PJR-STRG の run（2026-08-18）では dist が 2026-08-15 12:33 のビルド（コミット be20ceb2 相当）で、parent_validations 機能を追加した 19eea172（2026-08-16）を含んでいなかった。その結果 exec-defaults.yaml の pipeline.parent_validations: [test-integration] が設定済みにもかかわらず npm run test:integration が実行されず、evidence にも記録が残らなかった。設定した検証が沈黙して省略されるため、dist の鮮度検証・実行時警告・tsx 直接実行への統一などの恒久対応を検討する。

## 2. 影響範囲

| 観点         | 影響                                                                                                                                                |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | `specdojo` の bin 経由で実行する exec 系コマンド全体。当該 dist のビルド時点以降に `src` へ入った7コミット（うち exec 系2件）が実行時に反映されない |
| スケジュール | 検証漏れの追試と実行の締め直しが発生する。PJR-STRG では reporter 段の手動処置と `npm run test:integration` の追加実行が必要になった                 |
| コスト       | 追加の外部コストは発生せず、影響は調査・再実行に要する作業時間に限られる                                                                            |
| 品質         | 設定済みの検証が沈黙して省略され、未実行のまま success となるため、evidence を根拠とした完了判断の信頼性が下がる                                    |
| 関係者       | ARC（実装・運用）。exec を実行する運用者、および evidence を根拠に完了を判断するレビュー者                                                          |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                             |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 原因     | `specdojo` の bin が `dist/specdojo.js` を指し、当該 dist が `parent_validations` 追加コミット以前のビルドだったため                                                                                                                             |
| 対応策   | `exec run` / `exec cycle` の開始時に dist のビルド時点と `src` の最終更新を比較し、古い場合は警告のうえ中断する。あわせて exec 系 routine の起動前に `npm run build` を実行する手順を組み込み、運用手順をコマンドリファレンスへ反映する          |
| 依存事項 | dist 配布を継続するか `tsx src/specdojo.ts` 実行へ統一するかの方針決定。再ビルドを lefthook と routine のどちらに差し込むかの確認                                                                                                                |
| 完了条件 | 古い dist のまま exec を実行した場合に検知され、警告または中断されること。設定済みの `parent_validations` が未実行のまま success にならないこと。再発防止手段が hook または routine に組み込まれ、手順がコマンドリファレンスに記載されていること |

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- 事象を検知した run: [[prj-0001:pjr-strg-deterministic-dct-strategy-generation|PJR-STRG DCTとsch-strategyの決定論的ジェネレーター実装]]
- 未実行を記録した result: [[prj-0001:xer-pjr-strg-20260818t230101z-0889|PJR-STRG Edit Result]]
- 設定の正本: `.specdojo/exec-defaults.yaml` の `pipeline.parent_validations`
- 実行方法の記載先: [[specdojo:command-reference|コマンドリファレンス]]
