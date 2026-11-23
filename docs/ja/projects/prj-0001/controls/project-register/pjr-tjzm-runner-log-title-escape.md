---
specdojo:
  id: prj-0001:pjr-tjzm-runner-log-title-escape
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: low
  owner: DEV
  registered_at: "2026-11-23T00:36:48Z"
  due_on: null
---

# PJR-TJZM runner のログの Register item の行で、項目のタイトルの _ が \_ と表示される

## 1. 課題内容

`exec run --register` と `--dry-run` が出す `Register item:` の行で、項目のタイトルの `_` が `\_` と表示される。一覧や個票に書くために Markdown 向けにエスケープしたタイトルを、そのままログに出していると見ている（コードは確かめていない）。

```text
Register item: PJR-7WPD — テストの文書を frontend\_test\_note.md に改め、全体の状況と残りを書いた test\_note.md を置く  [todo]
```

以前は、プロダクトの commit のタイトルにも `\_` が入っていた。0.9.2 では commit のタイトルは元のタイトルのまま（`docs/test_note.md`）になっており、残っているのはログの表示だけである。ログからタイトルをコピーして使うと、`\_` がそのまま入る。

## 2. 入力

<!-- 対話で得た前提・制約・委任範囲を記録する。完了・回答の判定条件とは分ける。 -->

- 利用側（OpenFisca-Japan の作業の project。`repos` でプロダクトリポジトリを宣言している）で、specdojo 0.9.2 を使って見つけた。

## 3. 影響範囲

| 観点         | 影響                                                            |
| ------------ | --------------------------------------------------------------- |
| スコープ     | exec の runner のログの `Register item:` の行（dry-run を含む） |
| スケジュール | _TODO_                                                          |
| コスト       | 小さい                                                          |
| 品質         | ログの表示だけで、記録と commit には影響しない                  |
| 関係者       | runner のログを読む利用者                                       |

## 4. 対応方針

| 項目     | 内容                                                                                              |
| -------- | ------------------------------------------------------------------------------------------------- |
| 原因     | _TODO_: Markdown 向けにエスケープしたタイトルをログにも使っていると推定している。コードで確かめる |
| 対応策   | ログには、エスケープする前のタイトルを出す                                                        |
| 依存事項 | なし                                                                                              |
| 完了条件 | 下の箇条書きのすべてを満たす                                                                      |

- タイトルに `_`・`*` などを含む項目で、`Register item:` の行にエスケープしないタイトルが出る（テストで確かめる）。
- 一覧と個票の Markdown のエスケープは今のまま。
- `CHANGELOG.md` は未公開の版の節に書き、公開済みの版の節を変えない。

## 5. 対応結果

-

## 6. 関連ドキュメント

- [[prj-0001:pjr-6sqh-register-index-escape-emphasis]]
