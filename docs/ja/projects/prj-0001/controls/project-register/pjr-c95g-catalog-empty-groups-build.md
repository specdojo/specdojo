---
specdojo:
  id: prj-0001:pjr-c95g-catalog-empty-groups-build
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
  registered_at: "2026-10-23T23:43:14Z"
  derived_from:
    - PJR-EKRW
---

# PJR-C95G init の小さいカタログの空の groups で catalog build が止まり worktree の実行ができない

## 1. 課題内容

init --catalog small が作るカタログのうち 15 個が成果物のない groups: [] になり、catalog build が空の groups をエラーにするため specdojo build が失敗する。worktree の準備が止まり、カタログを作ったリポジトリで exec run --register --worktree が実行できない。0.4.0 から公開中の 0.4.3 まで同じ

## 2. 影響範囲

| 観点         | 影響                                                                                                                             |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | カタログの検査（`catalog build`・`catalog validate`・`specdojo build` の catalog build の段）と、`init --catalog` が作るカタログ |
| スケジュール | 大。カタログを作ったリポジトリで、worktree で流す register の実行がすべて止まる                                                  |
| コスト       | 利用者が原因を調べて、カタログを手で直す手間                                                                                     |
| 品質         | `init` が作ったものを、同じ CLI の検査が誤りとして扱う                                                                           |
| 関係者       | `init --catalog` を使った利用者。coderdojo-lessons の kata の作成                                                                |

## 3. 対応方針

| 項目     | 内容                                                                                                                          |
| -------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 原因     | `init --catalog small` は成果物がまだない領域のカタログを `groups: []` で作るが、カタログの検査は空の `groups` をエラーにする |
| 対応策   | 成果物のない領域（`groups: []`）を、エラーではなく正しいものとして受け付ける                                                  |
| 依存事項 | なし                                                                                                                          |
| 完了条件 | 下記の完了条件を満たす                                                                                                        |

### 3.1. 完了条件

- v0.4.4 の範囲とする（2026-10-24、利用者が承認）。
- `groups: []` のカタログ（成果物がまだない領域）を、`catalog build`・`catalog validate`・`specdojo build` が正しいものとして受け付ける。エラーにせず、必要なら「成果物がまだない領域」という案内に留める。生成物（カタログの派生ビューなど）は、空の領域を含めても壊れない。
- `groups` そのものがない、`groups` が配列でない、など本当に形が誤っている場合のエラーは今のまま残す。
- `init --catalog` が作るカタログの形は変えない。既存の利用者のリポジトリも、CLI を上げるだけで直る。
- schema（`docs/specdojo/schemas/v1/dct.schema.yaml` など）が空の `groups` を拒んでいる場合は、同じく受け付けるように直す。
- 単体テストで、空の `groups` のカタログが検査を通ること、形の誤りは今までどおりエラーになることを確かめる。統合テストで、一時のリポジトリで `init --yes --provider claude --exec --catalog small` の直後に `specdojo build` が通ることを確かめる。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- worktree の準備（`specdojo build`）を通す修正のため、統合の後に `exec run --register` を 1 回流して動作を確かめる（PJR-JSEY）。
- CHANGELOG の `## [Unreleased]` の節に書く（なければ作る）。

## 4. 対応結果

- `type: project` の成果物カタログでは空の `groups` を受理し、未指定または配列以外の `groups` は引き続きエラーにするよう検査を修正した。
- 空の領域も `catalog build` で見出しを持つ派生ビューを生成できることを単体テストに追加した。
- 一時リポジトリで `init --yes --provider claude --exec --catalog small` を実行し、その直後の `specdojo build` が通る統合テストを追加した。
- schema は `type: project` の空の `groups` をすでに許可し、`type: template` には `minItems: 1` を要求しているため変更していない。
- 再発防止として、空配列、キーの未指定、非配列をそれぞれ独立した回帰テストで固定した。

## 5. 関連ドキュメント

- PJR-EKRW（0.4.4 の確認で見つかった）
