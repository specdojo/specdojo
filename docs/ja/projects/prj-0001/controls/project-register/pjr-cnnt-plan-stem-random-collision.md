---
specdojo:
  id: prj-0001:pjr-cnnt-plan-stem-random-collision
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-10-21T22:09:05Z"
  completed_at: "2026-10-21T23:27:38Z"
  conclusion: plan・in-place の stem・イベントの名前の末尾の乱数を 4 バイトにし、それでもぶつかったときは連番を付けるようにした。既存の 4 桁の名前と新しい名前の両方を読める。テストは乱数と時刻を差し替えて決定的に確かめる
  derived_from:
    - PJR-T30J
---

# PJR-CNNT plan の名前の末尾の乱数が短く、同じ秒に作ると名前がぶつかることがある

## 1. 課題内容

plan と in-place の stem、イベントの名前の末尾の乱数が 2 バイト（16 進 4 桁）しかなく、同じ slug で同じ秒に 2 回作ると 6 万 5 千分の 1 の確率でぶつかる。PJR-T30J の検証で単体テストが 1 回落ちた

## 2. 影響範囲

| 観点         | 影響                                                                                           |
| ------------ | ---------------------------------------------------------------------------------------------- |
| スコープ     | `src/exec/plans-core.ts`・`src/exec/plans-storage.ts`・`src/exec/events.ts` の名前の末尾の乱数 |
| スケジュール | 小。まれに単体テストが落ち、run の検証が止まる                                                 |
| コスト       | 止まった run の再開の手間                                                                      |
| 品質         | 同じ秒に同じ slug で作ると、plan やイベントの名前がぶつかって上書きや失敗が起こりうる          |
| 関係者       | exec run の利用者、夜間の自動実行                                                              |

## 3. 対応方針

| 項目     | 内容                                                                                                 |
| -------- | ---------------------------------------------------------------------------------------------------- |
| 原因     | 名前の末尾の乱数が 2 バイト（`randomHex(2)`、16 進 4 桁）しかない                                    |
| 対応策   | ぶつからないようにする（乱数を長くする、作る前に既存のファイルと照らす、など）。名前の形の互換を保つ |
| 依存事項 | なし                                                                                                 |
| 完了条件 | 下記の完了条件を満たす                                                                               |

### 3.1. 完了条件

- 0.4.2 の範囲とする（2026-10-22、利用者が承認）。
- `buildInPlaceStem`・plan の保存（`plans-storage.ts`）・イベントの名前（`events.ts`）で、同じ slug と同じ秒でも名前がぶつからないようにする。やり方（乱数を長くする、既存のファイルと照らして作り直す、など）と理由を result に書く。
- 既存の plan・result・イベントの名前を読む処理（`stemFromPlanPath` など、名前から stem や task を取り出す処理）が、新しい名前と既存の名前の両方で動く。名前の形を変える場合は、[[specdojo:plan-result-lifecycle-guide]] など名前の形を書いた文書も直す。
- `tests/src/exec/plans.test.ts` の「unique across calls」のテストが、偶然に頼らずに通る形にする（乱数を差し替えて衝突を起こしたときにも名前が分かれることを確かめる、など）。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- runner のコードを変えるため、統合の後に `exec run --register` を 1 回流して動作を確かめる（PJR-JSEY）。
- CHANGELOG の `## [Unreleased]` の節に書く。

## 4. 対応結果

- `buildInPlaceStem`、アーカイブ済み plan、event ファイル名の乱数を2バイトから4バイトへ拡張した。
- `buildInPlaceStem` は同一プロセス内で同じ slug・UTC秒・乱数が重複した場合、連番を加えて別の stem にする。アーカイブは既存ファイル名を確認して連番を加え、event は排他的な新規作成に失敗した場合に連番付きの名前で再試行する。単に乱数を延ばすだけでなく、再現した衝突でも既存ファイルを失わないため、この方式を採用した。
- 時刻と乱数を関数として注入する単体テストを追加し、同じ値を返す場合にも stem、アーカイブ済み plan、event がそれぞれ別名になることを決定的に確認できるようにした。Node.js の ESM で変更できない `crypto.randomBytes` 自体はモックしない。
- `stemFromPlanPath` は従来どおり stem 全体を取り出すため、従来の16進4桁の名前、新しい16進8桁の名前、連番付きの名前を読み取れる。ライフサイクルガイドと CHANGELOG に新しい命名を記載した。
- executor sandbox では変更ファイルを Prettier で整形した。型検査、lint、単体・統合テスト、schema 検査は pipeline の親 runner が実行する。
- 統合後の `exec run --register` による実動作確認は、[[prj-0001:pjr-jsey-exec-run-split-smoke|PJR-JSEY]] の手順で人または後続 runner が行う。

## 5. 関連ドキュメント

- [[specdojo:plan-result-lifecycle-guide|plan/resultライフサイクルガイド]]
- [[sysd-cross-cutting-policy|SpecDojo システム設計横断ルール]]（`scp-STA-001`）
- [[prj-0001:pjr-jsey-exec-run-split-smoke|PJR-JSEY exec-run.ts の分割後に runner の動作を確かめる]]
