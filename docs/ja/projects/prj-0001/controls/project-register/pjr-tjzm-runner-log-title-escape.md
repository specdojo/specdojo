---
specdojo:
  id: prj-0001:pjr-tjzm-runner-log-title-escape
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: low
  owner: DEV
  registered_at: "2026-11-23T00:36:48Z"
  due_on: "2026-11-30"
  completed_at: "2026-11-23T04:20:20Z"
  conclusion: "Register item: の行と --dry-run の行で、エスケープする前のタイトルを出すようにし、下線を含むタイトルのテストを足した"
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
| スケジュール | 影響なし                                                        |
| コスト       | 小さい                                                          |
| 品質         | ログの表示だけで、記録と commit には影響しない                  |
| 関係者       | runner のログを読む利用者                                       |

## 4. 対応方針

| 項目     | 内容                                                                                                     |
| -------- | -------------------------------------------------------------------------------------------------------- |
| 原因     | 登録簿の表セルのエスケープ済みタイトル（`item.title`）を、ログにそのまま出していた（コードで確認済み）。 |
| 対応策   | ログには、エスケープする前のタイトルを出す                                                               |
| 依存事項 | なし                                                                                                     |
| 完了条件 | 下の箇条書きのすべてを満たす                                                                             |

- タイトルに `_`・`*` などを含む項目で、`Register item:` の行にエスケープしないタイトルが出る（テストで確かめる）。
- 一覧と個票の Markdown のエスケープは今のまま。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く（prj-0001 の運用。並べて流したときの統合の衝突を避けるため）。
- 2 回目の実行（2026-11-23）: 1 回目は `Register item:` の行（`register-worktree.ts`・`register-resume.ts` の 4 か所）を直したが、`--dry-run` の行（`src/exec/run/register-mode.ts` の `[dry-run] register item:`）は直っておらず、`external\_projects` のように出たままだった（prj-0001 の `exec run --register PJR-EKGQ --dry-run` で確かめた）。dry-run の行も、エスケープする前のタイトルを出す。ほかにも `item.title` をそのままログに出す箇所がないかを `rg` で探し、探した方法と結果を個票の対応結果に書く。dry-run の行のテストを足す。

## 5. 対応結果

- 原因は、登録簿の表から読んだエスケープ済みの `item.title` を `Register item:` の行へそのまま出していたこと。
- `src/shared/text.ts` に `unescapeMarkdownCell` を追加し、`src/exec/run/register-worktree.ts` と `src/exec/run/register-resume.ts` の `Register item:` の行（4 か所）で使うようにした。一覧と個票のエスケープは変えていない。
- `tests/src/shared/text.test.ts` に `_`・`*`・`|` の復元のテストを追加した。
- 2 回目の実行: `src/exec/run/register-mode.ts` の `[dry-run] register item:` の行と、`src/exec/run/register-core.ts` の `Register item:` の行（1 回目に漏れていた箇所）でも `unescapeMarkdownCell` を使うようにした。
- 探した方法と結果: `grep -rnE "(write|log|error|warn)\(.*\.title" src` で、`unescapeMarkdownCell` を通さずタイトルを出力する箇所を探した。上の 2 か所以外に該当はなかった。commit の題と plan の `name` は元のタイトルまたは別経路で、対象外とした。
- テスト: `tests/src/exec/register-pipeline-e2e.integration.test.ts` の dry-run のテストで、索引のタイトルを `pipeline\_test item` にして、`[dry-run] register item:` の行が `pipeline_test item` と出ることを確かめるようにした（統合テストは親 runner が実行する）。
- 検証は親 runner の `npm run test:unit` などに委ねる。

### 5.1. CHANGELOG に書く事項

- 区分: Fixed
- 文案: `exec run --register` と `--dry-run` の `Register item:` の行で、項目のタイトルの `_` などが `\_` とエスケープされて表示される問題を修正した。

## 6. 関連ドキュメント

- [[prj-0001:pjr-6sqh-register-index-escape-emphasis]]
