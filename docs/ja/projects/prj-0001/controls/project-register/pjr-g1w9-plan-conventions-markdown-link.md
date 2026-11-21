---
specdojo:
  id: prj-0001:pjr-g1w9-plan-conventions-markdown-link
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
  registered_at: "2026-11-07T01:16:56Z"
  completed_at: "2026-11-07T08:31:36Z"
  conclusion: plan の規約の版への参照をリンクにしないインラインコードの書き方に変え、末尾の参照だけを新旧の書き方で読むようにし、validate:history-links の対象に新しい置き場所を足した。.github/instructions の一覧の直しは承認待ちの案として個票に残した
  derived_from:
    - PJR-BVS9
---

# PJR-G1W9 新しい配置の plan が規約の版へ Markdown リンクで参照し、履歴リンクの規則に反する

## 1. 課題内容

BVS9 の後の plan.md が共通規約の版を相対パスの Markdown リンクで参照する。履歴蓄積ファイルでは Markdown リンクを書かない規則があり、validate:history-links は新しい配置を検査していない

## 2. 入力

- PJR-JSEY の run（execution/runs/register/PJR-JSEY/pjr-jsey-20261107T010718Z-d209433b/plan.md）の 61 行目に、共通規約の版を表示名「共通規約 sha256 と版の値」、リンク先を相対パス（../../../../conventions/ の下の版の値の .txt）とする Markdown のリンクがある（2026-11-07 orchestrator の確認）
- 規則: .github/instructions/markdown.instructions.md の「履歴蓄積ファイルのリンク記法」は、plan・result・個票でリンク先のファイル名の変更に追従が要る Markdown リンクを書かないとする。対象の glob は exec/plans・exec/results で、新しい配置（`execution/runs/**/plan.md`・result.md）は入っていない。validate:history-links（packages/docs-lint/src/validate-history-links.ts）も古い配置だけを見ている（2026-11-07）
- 関連: PJR-JT5J（置き場所の検査）と PJR-9BY9（既存の記録の移動）。移動すると相対リンクの深さが変わる（2026-11-07）
- 決定（A 案）: plan の規約の版への参照は Markdown のリンクにせず、「共通規約 sha256:」と版の値と、リポジトリのルートからのパスをインラインコードで書く。prompt へ規約を戻す処理は新旧の書き方を読む。validate:history-links の対象に新しい置き場所を足す。.github/instructions/markdown.instructions.md の対象の一覧は保護された設定のため、案を書き、反映は利用者の承認のもとで行う（2026-11-07 indie が決定）
- 最初の exec run --register は、plan の生成の後に「Invalid plan conventions reference: expected a SHA-256 hash and snapshot path」で止まった。個票の入力に参照の書き方の例（角括弧で始まる表示名と相対パスのリンク）をそのまま引いていたため、src/shared/plan-conventions.ts が plan の本文の引用を壊れた参照と判定した。例を言い換えて流し直した（2026-11-07 orchestrator の確認）

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
- 規約への参照として読むのは、plan の末尾にある runner が書いた参照だけにする。個票から写した本文の中に、新旧どちらの書き方の例（インラインコードやコードブロックの中を含む）があっても、plan の生成と prompt の組み立てを止めない。
- `validate:history-links`（`packages/docs-lint/src/validate-history-links.ts`）の既定の対象に、`docs/ja/projects/**/execution/runs/**/plan.md` と `docs/ja/projects/**/execution/runs/**/result.md` を足す。既にある plan の規約へのリンクで検査が失敗する場合は、そのリンクの形だけを例外にする。どう扱ったかを個票の対応結果に書く。
- 単体テストで次を確かめる。新しい書き方で plan が作られる。本文に新旧の書き方の例を含む plan でも生成と復元が止まらない。新旧どちらの書き方からも規約が戻る。版の本文がないときと SHA-256 が合わないときのエラー。新しい置き場所の plan・result にある Markdown のリンクを検査が見つける。
- 作業後に `npm run validate:history-links` を流し、通ることを確かめて個票の対応結果に書く。
- `.github/instructions/markdown.instructions.md` の「履歴蓄積ファイルのリンク記法」の対象の一覧に新しい置き場所を足す案を、個票の対応結果に書き、報告の `handoff` にも書く。このファイルは保護された設定のため直接変えない。反映は利用者の承認のもとで行う。
- 動きの説明が変わる場合は、`plan-result-lifecycle-guide` を実際の動きに合わせる。CHANGELOG は未公開の版の節に書き、公開済みの版の節は変えない。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` が通り、親の検証（`test-integration`）が通る。

## 5. 対応結果

- `src/shared/plan-conventions.ts` の新規出力を、ハッシュとリポジトリルート相対パスの2つのインラインコードに変更した。読込時は plan の末尾の独立した段落だけを対象とし、新形式と旧 Markdown リンクを復元する。本文やコードブロックの例は参照として解決しない。版の欠落・SHA-256 不一致の検査は両形式で維持した。
- 新形式は plan を移しても参照を変更しない。旧形式は従来どおり相対参照を更新する。新旧の生成・復元、本文の例、欠落・改ざん、別 checkout・配置への移動を対象にテストを追加・更新した。再開テストの追加指示も末尾の参照より前に置くようにした。既存の plan は変更していない。
- `validate:history-links` の既定対象に `docs/ja/projects/**/execution/runs/**/plan.md` と `docs/ja/projects/**/execution/runs/**/result.md` を追加した。互換例外は plan の最終段落に単独で置かれた旧形式の規約リンクだけとし、表示名が `共通規約 sha256:<64桁のハッシュ>`、参照先が同じハッシュの `conventions/<hash>.txt`（前置きは `../` の繰り返しのみ）の場合に限った。本文中のリンク、result、個票、異なるハッシュや任意のパスには適用しない。新配置での検出と例外の範囲を検証するテストを追加した。
- `npm run validate:history-links` は新配置を含む 3,311 ファイルで違反なし。カタログ検査（`node --import tsx tools/catalog-validate-if-configured.mjs`）は終了コード 0。既存の re-export 参照・移動済み文書に関する警告は残る。整形を実施し、型・lint・単体・統合テスト等の親検証は runner が実行する。
- [[specdojo:plan-result-lifecycle-guide]] に新旧形式の読込、末尾の参照だけを復元すること、追加指示の挿入位置、移動時の扱いを記載し、`CHANGELOG.md` の未公開節に変更を追記した。
- 保護設定の変更案（直接編集せず、利用者承認後に反映）: `.github/instructions/markdown.instructions.md` の「履歴蓄積ファイルのリンク記法」の対象一覧に `docs/ja/projects/**/execution/runs/**/plan.md` と `docs/ja/projects/**/execution/runs/**/result.md` を追加する。規約の版への参照はハッシュとルート相対パスをインラインコードで記載する旨と、上記の旧形式の末尾リンクだけを互換例外とする旨も追記する。承認後にオーケストレーターが反映する。
- 統合後の次の確認: runner・register・exec を変更した項目の運用手順に従い、PJR-JSEY の対象に PJR-G1W9 を加えて実 agent で1回実行し、新しい plan の参照と prompt の復元、start から review までの通過を確認する。

## 6. 関連ドキュメント

- [[specdojo:plan-result-lifecycle-guide]]
- [[prj-0001:pjr-bvs9-plan-conventions-by-reference]]
- [[prj-0001:pm-orchestrator-playbook]]
