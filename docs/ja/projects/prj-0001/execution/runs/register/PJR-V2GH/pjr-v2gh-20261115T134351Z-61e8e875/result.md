---
specdojo:
  id: prj-0001:xer-pjr-v2gh-20261115t134351z-61e8e875
  type: exec-result
  task_id: PJR-V2GH
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-V2GH/pjr-v2gh-20261115T134351Z-61e8e875/plan.md
  started_at: "2026-11-15T13:51:15.400Z"
  completed_at: "2026-11-15T14:22:49.727Z"
  agent: opus-executor
  block_reason: "parent validation failed: validate-schema"
---

# Edit Result

## 1. 実施内容

- `schedule strategy generate` が書き出す strategy ファイルの先頭に `yaml-language-server` の modeline (`# yaml-language-server: $schema=`) を必ず付与するように修正した。
- `--force` オプションを用いた書き出し時にも既存の modeline を消失させないよう、`writeStrategyFile` 内での処理を調整した。
- 回帰テストとして、modeline から辿った schema の存在確認および `validateStrategySchema` の検証を行う単体テストを追加した。

## 2. 変更ファイル

- `src/schedule/schedule.ts`: strategy 書き出しに関連するロジックの修正。
- `src/schedule/strategy-generate.ts`: strategy 生成および書き出し処理の修正。
- `tests/src/schedule/strategy-generate.test.ts`: modeline の保持と schema 有効性を検証する回帰テストの追加。

## 3. 申し送り

- 判断: modeline は `generateStrategy` ではなく `writeStrategyFile` で付けた。既存の modeline を保つには書き出し先の現在の内容が要り、modeline 無しで書かれる経路もここでなくせるため。`GenerateStrategyResult.content` は今までどおり本文だけを返す。
- 判断: 既存の modeline が別の schema を指していても書き換えずに保つ（完了条件「既存の modeline があれば保つ」に従った）。
- 確認: `schedule build` が書く track と `sch-milestones.yaml` は既に `withSchemaModeline` で modeline を付けており、`tests/src/schedule/command.test.ts` で確かめられているため変更していない。
- 判断: 回帰テストは `validate:schema:yaml` の CLI を子プロセスで起動せず、modeline から辿った schema が存在することと `validateStrategySchema` の結果が空であることで確かめた（単体テストで決定的に動かすため）。
- CHANGELOG に書く事項: 修正: `schedule strategy generate` で書き出す `sch-strategy-&lt;track&gt;.yaml` の先頭に `# yaml-language-server: $schema=` の modeline を必ず付ける。`--force` で書き直すと modeline が消えて `validate:schema` が失敗する問題を直した。既存の modeline は保つ。

## 4. 進め方

1. `src/schedule/schedule.ts` および `src/schedule/strategy-generate.ts` を修正し、戦略ファイルの書き出し時に `yaml-language-server` の modeline が必ず含まれ、かつ `--force` 指定時でも既存の modeline を維持するロジックを実装した。 2. `tests/src/schedule/strategy-generate.test.ts` に、生成されたファイルが正しい schema を参照しているか、および `validateStrategySchema` を通るかを検証するテストケースを追加した。 3. 修正内容の検証のため、`vitest` によるテスト実行および `prettier` による整形確認を実施した。
