---
specdojo:
  id: prj-0001:pjr-8wbn-conditional-not-applicable-rejected
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: high
  owner: DEV
  registered_at: "2026-10-18T14:51:17Z"
  completed_at: "2026-10-18T16:05:20Z"
  conclusion: 規約の検査の表のうち、変更したファイルの種類で当てはまるかが決まる検査（validate:schema:file・Prettier・markdownlint など）は、該当する変更がなければ not_applicable を受け付けるようにした。修正前の runner はこの修正そのものの run を退けたため、8WBN の worktree で作った dist で reporter と統合を流した（親検証 7 件は修正前の runner で通っていた）。統合後の runner で JSEY が --post-review で通った
  derived_from:
    - PJR-Z104
---

# PJR-8WBN 変更の種類で決まる検査の not_applicable を runner が script の有無だけで退ける

## 1. 課題内容

2026-10-18 23:50 に PJR-WSET を agy-expert-executor で流したところ、agy は npm run validate:schema:file を「YAML の成果物を変えていない」として not_applicable と報告した（規約の「YAML 成果物を編集した場合」に従った判断）。runner は script が package.json にあるため当てはまると判定して退け、親検証 7 件が通っていたのに executor validation failed or not run で waiting にした。規約の検査の多くは変更したファイルの種類で当てはまるかが決まるが、runner は script の有無しか見ていない

## 2. 影響範囲

| 観点         | 影響                                                                                    |
| ------------ | --------------------------------------------------------------------------------------- |
| スコープ     | `src/exec/reporter.ts`（`not_applicable` の主張を確かめる処理）、共通の規約の検査の表   |
| スケジュール | 高い。規約どおりに検査ごとの報告をする executor の run が、通っていても止まる           |
| コスト       | 通った run を人が確かめて再開する手間                                                   |
| 品質         | 規約どおりの判断が失敗と扱われ、executor が判断を避けて検査を報告しなくなるおそれがある |
| 関係者       | exec run の利用者、夜間の自動実行                                                       |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                               |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 原因     | runner は `npm run <script>` の `not_applicable` を、`package.json` に script があれば退ける。規約の検査の表では、多くの検査が変更したファイルの種類で当てはまるかが決まる（例: `validate:schema:file` は YAML の成果物を変えた場合）が、runner はそれを見ていない |
| 対応策   | runner は、検査が当てはまることを確かめられる場合だけ `not_applicable` を退ける。変更したファイルの種類で当てはまるかが決まる検査は、変更したファイルに該当するものがなければ受け付ける                                                                            |
| 依存事項 | PJR-7AW0（同じ処理を変えるため、その後に行う）                                                                                                                                                                                                                     |
| 完了条件 | 下記の完了条件を満たす                                                                                                                                                                                                                                             |

### 3.1. 完了条件

- 規約の検査の表のうち、変更したファイルの種類で当てはまるかが決まる検査（少なくとも `validate:schema:file`・Prettier・markdownlint）について、runner は evidence の変更したファイルに該当するものがない場合、`not_applicable` を受け付ける。該当するものがある場合は、今までどおり退ける。
- 検査と、当てはまる変更したファイルの対応は 1 か所に持ち、規約の表と食い違わないようにする（規約の表を正本にする、または対応を規約の表から作る、のどちらかを選び理由を result に書く）。
- 変更したファイルに関係なく当てはまる検査（`typecheck` など）と、6EF8・7AW0 の扱いは今のまま。
- 単体テストで、`validate:schema:file` を YAML を変えていない run で `not_applicable` と報告した場合に受け付けること、YAML を変えた run では退けることを確かめる。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- runner のコードを変えるため、統合の後に `exec run --register` を 1 回流して動作を確かめる（PJR-JSEY）。
- CHANGELOG は、未公開の版の節（なければ `## [0.4.1] - 未定` を作る）に書く。公開済みの版の節は変えない。

## 4. 対応結果

- `src/exec/reporter.ts` に、検査コマンドと変更ファイル種別の対応を一元管理する表を追加した。共通規約の検査表を正本とし、`validate:schema:file` は YAML、Prettier は規約記載の拡張子、markdownlint は Markdown の変更がある場合だけ、script または依存 package の存在によって `not_applicable` を退ける。
- 対象種別の変更がない場合は理由付きの `not_applicable` を受理し、対象種別の変更がある場合は従来どおり誤申告を拒否する単体テストを追加した。`typecheck` は変更ファイルに関係なく従来の script ベースの判定を保つテストも追加した。
- executor prompt と exec 設定ガイドに変更ファイル種別の適用条件を反映し、未公開版 `0.4.1` の CHANGELOG に修正内容を記録した。
- runner コードの統合後に実施する `exec run --register` の実動作確認は、後続項目 PJR-JSEY で行う。

## 5. 関連ドキュメント

- [[prj-0001:pjr-z104-plan-essentials-validation-rule]]（元の項目）
- [[prj-0001:pjr-7aw0-parent-validation-not-applicable-rejected]]（同じ処理の先行の修正）
- [[prj-0001:pjr-wset-src-feature-direction-rules]]（止まった実行）
