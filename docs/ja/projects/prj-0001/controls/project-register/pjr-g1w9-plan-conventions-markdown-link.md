---
specdojo:
  id: prj-0001:pjr-g1w9-plan-conventions-markdown-link
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-07T01:16:56Z"
  derived_from:
    - PJR-BVS9
---

# PJR-G1W9 新しい配置の plan が規約の版へ Markdown リンクで参照し、履歴リンクの規則に反する

## 1. 課題内容

BVS9 の後の plan.md が共通規約の版を相対パスの Markdown リンクで参照する。履歴蓄積ファイルでは Markdown リンクを書かない規則があり、validate:history-links は新しい配置を検査していない

## 2. 入力

- PJR-JSEY の run（execution/runs/register/PJR-JSEY/pjr-jsey-20261107T010718Z-d209433b/plan.md）の 61 行目に、`[共通規約 sha256:<hash>](../../../../conventions/<hash>.txt)` の形の相対リンクがある（2026-11-07 orchestrator の確認）
- 規則: .github/instructions/markdown.instructions.md の「履歴蓄積ファイルのリンク記法」は、plan・result・個票でリンク先のファイル名の変更に追従が要る Markdown リンクを書かないとする。対象の glob は exec/plans・exec/results で、新しい配置（`execution/runs/**/plan.md`・result.md）は入っていない。validate:history-links（packages/docs-lint/src/validate-history-links.ts）も古い配置だけを見ている（2026-11-07）
- 関連: PJR-JT5J（置き場所の検査）と PJR-9BY9（既存の記録の移動）。移動すると相対リンクの深さが変わる（2026-11-07）
- 決定（A 案）: plan の規約の版への参照は Markdown のリンクにせず、`共通規約 sha256:<hash>` とリポジトリのルートからのパスをインラインコードで書く。prompt へ規約を戻す処理は新旧の書き方を読む。`validate:history-links` の対象に新しい置き場所を足す。`.github/instructions/markdown.instructions.md` の対象の一覧は保護された設定のため、案を書き、反映は利用者の承認のもとで行う（2026-11-07 indie が決定）

## 3. 影響範囲

| 観点         | 影響                                                                                                       |
| ------------ | ---------------------------------------------------------------------------------------------------------- |
| スコープ     | plan の生成（共通規約の参照）、prompt へ規約を戻す処理、`validate:history-links` の対象                    |
| スケジュール | なし                                                                                                       |
| コスト       | 参照の書き方の変更と、新旧の書き方を読む処理、検査の対象の追加とテスト                                     |
| 品質         | 新しい置き場所の plan が履歴蓄積ファイルの規則に反し、検査もされない。記録を移すと相対リンクの深さがずれる |
| 関係者       | DEV、plan を読む agent と利用者                                                                            |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                         |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 原因     | BVS9 で規約の参照を相対パスの Markdown リンクにした。`validate:history-links` と規則の対象の glob が古い配置（`exec/plans`・`exec/results`）だけを指している |
| 対応策   | 参照をリンクにしない書き方に変え、検査の対象に新しい置き場所を足す（A 案、2026-11-07 indie が決定）                                                          |
| 依存事項 | なし                                                                                                                                                         |
| 完了条件 | 下記の条件をすべて満たすこと                                                                                                                                 |

完了条件の内訳。

- 新しく作る plan の規約の版への参照を、Markdown のリンクにせず、`共通規約 sha256:<hash>` とリポジトリのルートからのパス（`docs/ja/projects/<project-id>/execution/conventions/<hash>.txt` の形）をインラインコードで書く形にする（`src/shared/plan-conventions.ts`）。
- prompt へ規約の本文を戻す処理は、新しい書き方と、既にある plan の Markdown のリンクの書き方の両方を読む。既にある plan は書き換えない。
- 版の本文がないときや、本文の SHA-256 が合わないときは、どちらの書き方でも今と同じくエラーにする。
- `validate:history-links`（`packages/docs-lint/src/validate-history-links.ts`）の既定の対象に、`docs/ja/projects/**/execution/runs/**/plan.md` と `docs/ja/projects/**/execution/runs/**/result.md` を足す。既にある plan の規約へのリンクで検査が失敗する場合は、そのリンクの形だけを例外にする。どう扱ったかを個票の対応結果に書く。
- 単体テストで次を確かめる。新しい書き方で plan が作られる。新旧どちらの書き方からも規約が戻る。版の本文がないときと SHA-256 が合わないときのエラー。新しい置き場所の plan・result にある Markdown のリンクを検査が見つける。
- 作業後に `npm run validate:history-links` を流し、通ることを確かめて個票の対応結果に書く。
- `.github/instructions/markdown.instructions.md` の「履歴蓄積ファイルのリンク記法」の対象の一覧に新しい置き場所を足す案を、個票の対応結果に書き、報告の `handoff` にも書く。このファイルは保護された設定のため直接変えない。反映は利用者の承認のもとで行う。
- 動きの説明が変わる場合は、`plan-result-lifecycle-guide` を実際の動きに合わせる。CHANGELOG は未公開の版の節に書き、公開済みの版の節は変えない。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` が通り、親の検証（`test-integration`）が通る。

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
