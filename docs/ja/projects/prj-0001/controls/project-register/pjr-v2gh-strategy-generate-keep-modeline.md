---
specdojo:
  id: prj-0001:pjr-v2gh-strategy-generate-keep-modeline
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: high
  difficulty: easy
  owner: DEV
  registered_at: "2026-11-15T10:47:27Z"
  block_reason: "parent validation failed: validate-schema"
  commit_type: fix
  commit_scope: schedule
---

# PJR-V2GH schedule strategy generate が schema の modeline を落とさないようにする

## 1. 概要

書き出す strategy の先頭に schema の modeline を必ず付ける

## 2. 入力

- 2026-11-15、kata-wave-2 の strategy を --force で書き出したとき、先頭の # yaml-language-server: $schema= の行が消え、develop の validate:schema が落ちて 005 の 3 件が止まった（PJR-TN43 の C）

## 3. 完了条件

- `schedule strategy generate` が新しく書くときも `--force` で書き直すときも、先頭に `# yaml-language-server: $schema=` の modeline を置く。既存の modeline があれば保つ。
- `schedule build` が書く track にも同じ扱いがあることを確かめ、無ければそろえる。
- 書き出した strategy が `npm run validate:schema` を通ることを、回帰テストで確かめている。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。保護された設定の変更は、変更案を書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節に書いている（PJR-EPQ3）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                    | 担当 | 状態 | メモ |
| --- | --------------------------------------- | ---- | ---- | ---- |
| 1   | strategy の書き出しに modeline を付ける | DEV  | done | -    |
| 2   | track の書き出しを確かめる              | DEV  | done | -    |
| 3   | 回帰テストを足す                        | DEV  | done | -    |

## 5. 対応結果

### 5.1. 実施内容

- `src/schedule/strategy-generate.ts` の `writeStrategyFile` が、書き出す内容に modeline が無いとき先頭へ `# yaml-language-server: $schema=` を付けるようにした。既存ファイルに modeline があればその行を保ち、無ければ書き出し先から `sch-strategy.schema.yaml` への相対参照を作る。新規作成・`--force`・`--dry-run` の diff・unchanged 判定は、すべて modeline を付けた後の内容で行う。
- `src/schedule/schedule.ts` の `schedule strategy generate` は、schema を解決する基点として `repoRoot` を渡す。
- `schedule build` が書く track（`sch-track-<track>.yaml`）と `sch-milestones.yaml` は、すでに `withSchemaModeline` で modeline を付けていて、`tests/src/schedule/command.test.ts` で確かめられている。track 側は変えていない。
- `tests/src/schedule/strategy-generate.test.ts` に回帰テストを足した。新規に書くときに modeline が付くこと、`--force` で既存の modeline が保たれること、CLI の `--force` で書いた strategy が modeline から解決した schema の検証を通ること、を確かめている。

### 5.2. 判断した点

- modeline は `generateStrategy` ではなく `writeStrategyFile` で付けた。理由: 既存の modeline を保つには書き出し先の現在の内容が要り、また modeline が無いまま書かれる経路をなくすため。`GenerateStrategyResult.content` は今までどおり modeline 無しの YAML 本文を返す。
- 既存の modeline が別の schema を指している場合も、書き換えずに保つ。完了条件の「既存の modeline があれば保つ」に従った。
- 回帰テストは `validate:schema:yaml` の CLI を子プロセスで起動せず、modeline から解決した schema が存在することと `validateStrategySchema` の結果が空であることを確かめる形にした。単体テストの範囲で決定的に動かすため。

### 5.3. CHANGELOG に書く事項

- 修正: `schedule strategy generate` で書き出す `sch-strategy-<track>.yaml` の先頭に、`# yaml-language-server: $schema=` の modeline を必ず付けるようにした。`--force` で書き直したとき modeline が消え、`validate:schema` が失敗する問題を直した。既存の modeline はそのまま保つ。

### 5.4. 残課題

- なし

## 6. 関連ドキュメント

- [[prj-0001:pjr-tn43-user-decisions-pending]]
