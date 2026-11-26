---
specdojo:
  id: prj-0001:pjr-v8nd-orchestrator-dry-run-id-in-refs
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-25T22:40:00Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-FNB7
---

# PJR-V8ND オーケストレーターが dry-run の仮の ID を commit メッセージの Refs に書く

## 1. 課題内容

register add の dry-run で出た ID は仮で、実際の起票では乱数で振り直される。オーケストレーターが仮の ID を commit メッセージの Refs に書き、実際の ID と食い違う。

## 2. 入力

- PJR-FNB7 の実 agent の試験（2026-11-26、sonnet、5 回）のうち 2 回で観測。dry-run の PJR-2W39 に対し実際は PJR-RBET、dry-run の PJR-9077 に対し実際は PJR-PB3T で、commit の Refs は仮の ID のままだった。
- 直し方（CLI が実際の ID を -m に差し込む、dry-run の出力で仮の ID だと示す、オーケストレーターの本文に注意を足す、など）は executor が選び、理由を個票の対応結果に書く。本文は保護された設定のため、変更案を対応結果に書く。

## 3. 影響範囲

| 観点         | 影響                                                               |
| ------------ | ------------------------------------------------------------------ |
| スコープ     | `register add` の dry-run の出力と、`--commit -m` の本文の扱い     |
| スケジュール | なし                                                               |
| コスト       | 食い違った `Refs:` を見つけて追う手間                              |
| 品質         | commit の `Refs:` が実在しない項目を指し、履歴から項目をたどれない |
| 関係者       | DEV（実装）、オーケストレーター（起票と commit）                   |

## 4. 対応方針

| 項目     | 内容                                                                                       |
| -------- | ------------------------------------------------------------------------------------------ |
| 原因     | dry-run の ID は仮で、実際の起票では乱数で振り直される。出力からは仮であることが分からない |
| 対応策   | 仮であることを出力で示し、本文の `Refs:` を実際の ID と食い違わせない手段を用意する        |
| 依存事項 | オーケストレーターの本文を変える場合は、利用者の承認のもとで反映する                       |
| 完了条件 | 「完了条件」の章のとおり                                                                   |

## 5. 完了条件

- `register add --dry-run` の出力で、ID が仮であり、実際の起票では振り直されることが分かる。
- `--commit -m` の本文の `Refs:` を、実際の ID と食い違わせない手段を用意する。手段（本文に実際の ID を差し込む記号、本文にある食い違う ID を検出して止める、など）は executor が選び、理由を個票の対応結果に書く。
- オーケストレーターの本文に注意を足す必要があれば、案を個票の対応結果に書く。
- 単体テストで、上の出力と手段を確かめる。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証を通す。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 保護された設定（`.specdojo/exec-defaults.yaml`・オーケストレーターの本文など）は変えない。変更が要る場合は、案を個票の対応結果と報告の `handoff` に書く。反映は利用者の承認のもとで行う。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 統合の後に、オーケストレーターが実際の run を流して動きを確かめてから close する（executor は行わない）。

## 6. 対応結果

### 6.1. 解決内容

- `register add --dry-run` の出力の末尾に、ID が仮であり実際の起票で振り直されること、`-m` には `{id}` を書くことを示す注記を足した。`--dry-run` のヘルプにも仮の ID と明記した。
- `--commit -m` の本文の `{id}` を、実際に起票・更新した項目の ID へ置き換える（`registerCommitMessageFromParagraphs` の第 2 引数）。`-m` の全段落が対象で、`{id}` を書かない従来の本文は変わらない。
- 手段に差し込み記号を選んだ理由は、本文の `Refs:` に他項目（`derived_from` 元など）を正当に書けるため、食い違う ID の検出では誤検知が避けられないことによる。仮の ID を書き写す余地そのものを、`{id}` が無くす。

### 6.2. 確認結果

- 単体テストで、`{id}` の置換（全段落、ID 未指定では不変）と dry-run の注記を確かめた。

### 6.3. オーケストレーター本文への変更案（保護された設定のため未反映）

- register add の commit メッセージの手順に「dry-run で出た ID は仮。`Refs:` には実際の ID を書くか、`{id}` と書く。起票後の出力の `Created: ... (added PJR-XXXX)` から ID を読む」を足す。反映は利用者の承認のもとで行う。

### 6.4. CHANGELOG に書く事項

- 区分: Fixed
- 文案: `register add --dry-run` の ID が仮であることを出力で示し、`--commit -m` の `{id}` を実際の項目 ID へ置き換えるようにした（PJR-V8ND）。

### 6.5. 残作業

- 統合の後に、オーケストレーターが実際の run を流して動きを確かめてから close する（executor は行わない）。

## 7. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
