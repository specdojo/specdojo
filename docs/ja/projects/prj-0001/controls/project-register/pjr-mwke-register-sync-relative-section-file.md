---
specdojo:
  id: prj-0001:pjr-mwke-register-sync-relative-section-file
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
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

| 観点         | 影響   |
| ------------ | ------ |
| スコープ     | _TODO_ |
| スケジュール | _TODO_ |
| コスト       | _TODO_ |
| 品質         | _TODO_ |
| 関係者       | _TODO_ |

## 4. 対応方針

| 項目     | 内容                                                                                                                                           |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | _TODO_: executor が調べて書く。同期を有効にした project では、記帳を専用ブランチの worktree で行うため、相対パスがそこから解決されるとみられる |
| 対応策   | 利用者が渡したファイルのパスは、記帳の場所に移る前に、呼び出し元の cwd から絶対パスへ解決する                                                  |
| 依存事項 | なし                                                                                                                                           |
| 完了条件 | 下の一覧のとおり                                                                                                                               |

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

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
