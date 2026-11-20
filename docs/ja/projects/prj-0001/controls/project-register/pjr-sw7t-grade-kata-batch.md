---
specdojo:
  id: prj-0001:pjr-sw7t-grade-kata-batch
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: low
  difficulty: medium
  registered_at: "2026-11-13T14:08:23Z"
  commit_type: feat
  commit_scope: grade
---

# PJR-SW7T 型の一覧をまとめて grade する指定を用意する

## 1. 概要

rulebook と sample の組を型の名前の一覧で指定し、1 回の grade run で順に評価できるようにする

## 2. 入力

- 2026-11-12〜13 の型の整備と夜間の実行で、orchestrator が手作業やシェルスクリプトで補った

## 3. 完了条件

- `grade run --target kata` で、型の名前（`pjr`・`sld` などの接頭辞）を複数指定し、その型の rulebook と sample の組を 1 回の実行で順に評価できる（例: `--kata <name>` を繰り返す。名前は executor が決める）。
- 1 つの型の失敗や rate limit で、残りの型を飛ばさない。終わったときに、型ごとの結果（完了・失敗・未実行）を一覧で表示する。
- 終了コードは今の `grade run` の決まりに合わせる（完了と失敗が混ざると 2、rate limit で 75）。
- 存在しない型の名前は、実行の前にまとめてエラーにする。
- 単体テストで、複数の型の選択、存在しない名前のエラー、失敗が混ざったときの終了コードを確かめる。
- コマンドリファレンスの `grade run` の節に、オプションと例を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。利用者に影響が無い場合はそう書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` が通り、親の検証が通る。

## 4. 作業内容

| No  | 作業                                             | 担当     | 状態 | メモ                                                                                                        |
| --- | ------------------------------------------------ | -------- | ---- | ----------------------------------------------------------------------------------------------------------- |
| 1   | 要件・設計と既存実装の確認                       | executor | done | 個票、`src/grade/`、`src/kata/`、コマンドリファレンスを確認                                                 |
| 2   | 型名から rulebook と sample を解決する機能の実装 | executor | done | `src/grade/targets.ts` に `resolveKataDocuments` と `resolveKataBatchTargets` を追加                        |
| 3   | CLI オプション `--kata` の追加と引数連携         | executor | done | `src/grade/command-shared.ts`、`src/grade/command-run.ts`、`src/grade/run.ts` に追加                        |
| 4   | 評価ループと型別集計・終了コード制御の実装       | executor | done | `rate_limit` で残りをスキップせず継続、ループ後に型ごとの結果（完了・失敗・未実行）を表示、終了コードを制御 |
| 5   | 単体テストの追加と検証                           | executor | done | `tests/src/grade/run.test.ts` に複数型指定、未知の型エラー、失敗混在、rate limit のテストを追加             |
| 6   | コマンドリファレンスの改訂                       | executor | done | `docs/ja/specdojo/references/command-reference.md` にオプション説明と使用例を追記                           |

## 5. 対応結果

### 5.1. 実施内容

- `grade run --target kata` で複数の型の名前（`pjr`・`sld` などの接頭辞）を指定し、その rulebook と sample の組を順に評価できる `--kata <name>`（repeatable）オプションを実装しました。
- 存在しない型の名前が指定された場合は、実行前にまとめて `Unknown kata: ...` エラーをスローするよう検証処理を実装しました。
- 1 つの型で失敗や rate limit が発生しても残りの型・文書を飛ばさず評価を継続し、終了時に `kata results:` として型ごとの結果（完了・失敗・未実行）を一覧表示するようにしました。
- 終了コードは既存の `grade run` 規則に合わせ、完了と失敗が混在した場合は 2、rate limit に遭遇した場合は 75、未完了・全失敗の場合は 1 となるよう制御しました。
- 単体テスト（`tests/src/grade/run.test.ts`）に複数型の順次評価、未知の型名エラー、失敗混在時の終了コード 2、rate limit 時の終了コード 75、ターゲット・引数バリデーションを追加し、すべて通過することを確認しました。
- コマンドリファレンス（`docs/ja/specdojo/references/command-reference.md`）の `grade run` の節に `--kata` オプションの説明と使用例を追記しました。

### 5.2. 設計・判断事項

- オプション名: 完了条件の例示に従い、直感的でわかりやすい `--kata <name>` を採用し、Commander の repeatable option として実装しました（カンマ区切りによる複数指定も受け付けます）。
- 型名の解決: 指定された型名（接頭辞）に対して、`docs/ja/specdojo/rulebooks/${name}-rulebook.md` および `docs/ja/specdojo/samples/${name}-sample.*`（または rulebook frontmatter で指定された sample）を探索します。`pjr` のように sample が元々宣言されていない型は rulebook のみを対象とし、両方ある型は両方を対象とします。rulebook も sample も1つも見つからない場合は存在しない型名として扱います。
- 型ごとの結果集計: 型ごとの結果として、全文書完了なら「完了 (complete)」、1つでも失敗があれば「失敗 (failed)」、失敗はなく未完了があれば「未実行 (pending)」と判定して一覧表示します。
- 終了コードの優先順位: rate limit が発生した場合は再開を可能にするため終了コード 75 を優先し、rate limit がなく失敗と完了が混在している場合は終了コード 2、すべて失敗の場合は終了コード 1 とします。

### 5.3. CHANGELOG に書く事項

- 区分: 追加
- 文案: `grade run --target kata` に、型名の一覧を指定して rulebook と sample の組を順に評価できる `--kata <name>` オプションを追加

## 6. 関連ドキュメント

- [[specdojo:command-reference|コマンドリファレンス]]
- [[prj-0001:pjr-index|プロジェクト登録簿]]
