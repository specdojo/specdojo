---
specdojo:
  id: prj-0001:pjr-mwke-register-sync-relative-section-file
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: review
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-26T22:39:48Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-VM2S
---

# PJR-MWKE register_sync を有効にすると --section-file の相対パスが専用ブランチの作業場所から解決される

## 1. 課題内容

register_sync を有効にした project で register update/add の --section-file に相対パスを渡すと、呼び出し元ではなく専用ブランチの worktree から解決され、Cannot read section file で止まる。呼び出し元の cwd から解決されるようにする。

## 2. 入力

- 2026-11-26、PJR-4EJC の register update --section-file tmp/orchestrator/4ejc-memo.md --commit が Cannot read section file で止まった。絶対パスにすると通った
- 記帳は失われなかった（エラー時に専用ブランチの worktree を保持する案内が出た）
- 相対パスで使えないと困る（indie、2026-11-26）。担当 DEV・期限 2026-11-30 は indie の指示

## 3. 影響範囲

| 観点         | 影響                                                                  |
| ------------ | --------------------------------------------------------------------- |
| スコープ     | `register add` / `register update` の `--section-file` の読み込みだけ |
| スケジュール | 期限 2026-11-30 の前に対応した                                        |
| コスト       | 追加の費用なし                                                        |
| 品質         | 同期ありで相対パスの `--commit` が止まる不具合を解消する              |
| 関係者       | 登録簿を記帳する indie・オーケストレーター                            |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                                                                                      |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | `--commit` で同期が有効なとき、`runRegisterMutationInCurrentWorktree` が専用ブランチの worktree へ `process.chdir` してから記帳を呼ぶ。`validateSectionFile` が相対パスをそのまま読んでいたため、移った先から解決していた |
| 対応策   | 利用者が渡したファイルのパスは、記帳の場所に移る前に、呼び出し元の cwd から絶対パスへ解決する                                                                                                                             |
| 依存事項 | なし                                                                                                                                                                                                                      |
| 完了条件 | 下の一覧のとおり                                                                                                                                                                                                          |

完了条件:

- 登録簿の同期（`sync` と互換の `register_sync`）を有効にした project で、`register update --section-file` と `register add --section-file` に相対パスを渡すと、呼び出し元の cwd から解決して読める。
- 同じ扱いを、register のコマンドのうちファイルのパスを受け取るほかのオプションにも揃えている。対象のオプションの一覧を個票の対応結果に書いている。
- 同期を有効にしていない project の動きは変えていない。
- ファイルが見つからないときのエラーには、渡したパスと解決した絶対パスを含めている。
- 統合テストで、同期を有効にした project で相対パスの `--section-file` が `--commit` で記帳できることを確かめている。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 保護された設定（`.specdojo/`・`.github/`・`.agents/`・`.claude/`・`package.json` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- 作業を終える前に `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証の `test-integration` を通す。

## 5. 対応結果

解決内容:

- `validateSectionFile` に基点のディレクトリの引数を足し、相対パスをそこから絶対パスへ解決して読むようにした（`src/register/section.ts`）。
- `register add` と `register update` は、記帳の場所へ移る前（`runRegisterMutation` の前）に呼び出し元の cwd を取り、`--section-file` をその cwd から解決する（`src/register/create-commands.ts`）。別 project の worktree へ移る記帳（`inCrossProjectWorktree`）でも同じく呼び出し元から読む。
- ファイルが無い・読めないときのエラーは `Cannot read section file: <渡したパス> (resolved to <解決した絶対パス>)` とした。絶対パスを渡したときは従来どおりパスだけを出す。
- 同期を有効にしていない project は cwd を移さないため、解決結果は従来と同じ。

対象のオプションの一覧:

| コマンド                           | オプション                              | 扱い                                                                   |
| ---------------------------------- | --------------------------------------- | ---------------------------------------------------------------------- |
| `register add`                     | `--section-file`（繰り返し可）          | 呼び出し元の cwd から解決する                                          |
| `register update`                  | `--section-file`                        | 呼び出し元の cwd から解決する                                          |
| `register add` / `register update` | `--target-path`・`--target`・`--source` | 対象外。リポジトリ相対の成果物の参照で、呼び出し元のファイルを読まない |

register のほかのコマンド（遷移・maintenance）には、呼び出し元のファイルを読むオプションは無い。

確認結果:

- 単体テスト（`tests/src/register/section.test.ts`）に、基点からの相対パスの解決と、渡したパス・解決した絶対パスを含むエラーを足した。
- 統合テスト（`tests/src/register/register-branch.integration.test.ts`）に、同期を有効にした project で相対パスの `--section-file` を `register add` と `register update` に `--commit` で渡し、専用ブランチへ記帳されることを確かめるケースを足した。両ファイルを `vitest` で個別に流して通った。`npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run test:integration` は親の runner が流す。

再発防止策: 利用者が渡すファイルのパスを読む処理は、作業場所を移す前の cwd を基点として受け取る形にした。

### CHANGELOG に書く事項

- 区分: 修正
- 文案: 登録簿の同期（`register_sync`）を有効にした project で、`register add` / `register update` の `--section-file` に相対パスを渡して `--commit` すると `Cannot read section file` で止まっていた不具合を直しました。相対パスは呼び出し元の cwd から解決し、見つからないときは渡したパスと解決した絶対パスをエラーに出します（PJR-MWKE）。

## 6. 関連ドキュメント

- [[prj-0001:prj-0001:pjr-4ejc-register-sync-switch-check|PJR-4EJC]]: register_sync の切り替えの確かめで、この問題を見つけた記録。
- [[prj-0001:prj-0001:pjr-vm2s-register-branch-migration-trial|PJR-VM2S]]: register のブランチへ移る手順の試行。
