---
specdojo:
  id: prj-0001:pjr-22n9-grade-kata-kind-ignored
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: medium
  difficulty: medium
  registered_at: "2026-11-22T13:16:07Z"
  completed_at: "2026-11-22T13:56:34Z"
  conclusion: grade run の --kata で --kind が効くようにした。recipe・template・all を選べ、--kind を省くと今までどおり rulebook と sample を評価する
  derived_from:
    - PJR-7M9J
---

# PJR-22N9 grade run の --kata と --kind を一緒に指定すると、--kind が無視される

## 1. 課題内容

grade run --target kata --kata prj-charter --kind recipe は、recipe ではなく rulebook と sample を評価した。--kind で型の種類を選べず、recipe と template を --kata で評価できない。

## 2. 入力

- 2026-11-22 の grade（run id prj-charter-recipe-20261122、opus-review-executor）で、ログに rulebook（pass 90）と sample（needs-work 83）だけが出て、recipe の結果のファイルは更新されなかった。
- --kata のヘルプは「Grade rulebook and sample for this kata name」で、--kind は rulebook・recipe・sample・template・all を受け付ける。
- 利用者の承認（2026-11-22、indie）で起票した。担当と期限は未定。

## 3. 影響範囲

| 観点         | 影響                                                          |
| ------------ | ------------------------------------------------------------- |
| スコープ     | `grade run --target kata` の対象の選び方                      |
| スケジュール | recipe と template を `--kata` で評価できず、型の確定が遅れる |
| コスト       | 小さい〜中（選び方の修正とテスト）                            |
| 品質         | 評価したつもりで古い結果を読み、合否を取り違える              |
| 関係者       | オーケストレーター、型の整備の schedule                       |

## 4. 対応方針

| 項目     | 内容                                                               |
| -------- | ------------------------------------------------------------------ |
| 原因     | `--kata` を指定すると、`--kind` によらず rulebook と sample を選ぶ |
| 対応策   | `--kata` と `--kind` を一緒に指定したら、指定した種類だけを選ぶ    |
| 依存事項 | なし                                                               |
| 完了条件 | 下の箇条書きのすべてを満たす                                       |

- `--kata` と `--kind` を一緒に指定したら、その型の指定した種類（recipe・template・all など）だけを評価する（単体テストで確かめる）。
- `--kind` を省いたときは、今までどおり rulebook と sample を評価する（単体テストで確かめる）。
- 指定した種類がその型に無い（`not-needed` など）ときは、評価せずにその旨を出す（単体テストで確かめる）。
- `command-reference` の `grade run` の `--kata` と `--kind` の説明を直す。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。影響がなければ「なし」と書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。

## 5. 対応結果

### 5.1. 解決内容

- `resolveKataDocuments` と `resolveKataBatchTargets`（`src/grade/targets.ts`）に `kind` を足し、`grade run` が `--kind` を渡すようにした。`--kind` を省くと従来どおり rulebook と sample を評価する。
- recipe と template は rulebook の frontmatter 宣言（`recipe` / `template`）で解決し、宣言がなければ `<名前>-recipe` などのファイル名で探す。`all` は 4 種類すべてを評価する。
- 指定した種類が型に無い（`not-needed` など）ときは評価せず、標準エラーに `grade run: kata <名前>: no <kind> document to grade ...` を出す。型そのものが無い場合は従来どおり `Unknown kata` で失敗する。
- `--kata` のヘルプと `command-reference` の `grade run` の説明を直した。
- テスト 4 件を `tests/src/grade/kata-documents.test.ts` に追加した。

### 5.2. 確認結果

- `npx vitest run tests/src/grade/kata-documents.test.ts`、`npm run typecheck`、`npx eslint src/grade` は成功（警告のみ）。`lint:md` や `test:unit` などは親の検証が実行する。

### 5.3. 判断した点

- 宣言された recipe・template のファイルが無い場合は、sample と同様にエラーにした。宣言が `not-needed` / `none` / `undecided` のときは評価しない扱い。
- `--kind` 未指定と `--kind all` は別の扱い（未指定は rulebook と sample のみ）。`all` は 4 種類すべて。

### 5.4. CHANGELOG に書く事項

- 区分: Fixed
- 文案: `grade run --target kata` で `--kata` と `--kind` を併用すると `--kind` が無視され、常に rulebook と sample を評価していた問題を修正した。`--kind recipe` や `--kind template` を指定できる。

### 5.5. 作業内容

| 作業                          | 状態 | メモ                               |
| ----------------------------- | ---- | ---------------------------------- |
| 実装・テスト・説明の修正      | done | 上記のとおり                       |
| 実際の grade の起動での再確認 | open | agent の起動は executor が行えない |

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
