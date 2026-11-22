---
specdojo:
  id: prj-0001:pjr-kzzm-unknown-actor-reserved-names
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: low
  owner: DEV
  registered_at: "2026-11-22T11:16:18Z"
  due_on: "2026-11-30"
---

# PJR-KZZM Unknown actor のエラーの文に、受け付ける予約名が並ばない

## 1. 課題内容

exec などの --by は予約名（SpecDojo・specdojo-orchestrator・night-orchestrator）も受け付けるのに、Unknown actor のエラーの文には名簿の nickname しか並ばず、予約名を使えることに気づけない。

## 2. 入力

- assertValidExecActor は `RESERVED_REGISTER_ACTORS` を受け付けてから assertValidActor を呼ぶが、エラーの文は名簿の nickname だけを並べる（src/shared/specdojo-config.ts）。
- 利用者の承認（2026-11-22、indie）で起票した。担当 DEV、期限 2026-11-30。

## 3. 影響範囲

| 観点         | 影響                                                                 |
| ------------ | -------------------------------------------------------------------- |
| スコープ     | `--by` を検査するエラーの文（exec と register の記帳）               |
| スケジュール | なし                                                                 |
| コスト       | 小さい（エラーの文とテストの修正）                                   |
| 品質         | 予約名を使えることに気づけず、名簿に予約名を足そうとするおそれがある |
| 関係者       | 利用者、オーケストレーター                                           |

## 4. 対応方針

| 項目     | 内容                                                                                               |
| -------- | -------------------------------------------------------------------------------------------------- |
| 原因     | 予約名を受け付ける検査も、エラーの文は名簿の nickname だけを並べる `assertValidActor` に任せている |
| 対応策   | 予約名を受け付ける `--by` のエラーの文に、予約名も並べる                                           |
| 依存事項 | なし                                                                                               |
| 完了条件 | 下の箇条書きのすべてを満たす                                                                       |

- 名簿にも予約名にもない名前を `--by` に渡したとき、エラーの文に名簿の nickname と予約名の両方が並ぶ。exec の記帳と register の記帳の両方で確かめる（単体テスト）。
- agent しか受け付けない `--by`（grade など）のエラーの文には、予約名を並べない（単体テスト）。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。影響がなければ「なし」と書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
