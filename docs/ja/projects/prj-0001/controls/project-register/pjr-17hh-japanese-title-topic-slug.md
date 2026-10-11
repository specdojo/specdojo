---
specdojo:
  id: prj-0001:pjr-17hh-japanese-title-topic-slug
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: low
  owner: DEV
  registered_at: "2026-10-08T12:38:12Z"
  due_on: null
  completed_at: "2026-10-09T12:57:36Z"
  conclusion: topic を作れないタイトルでは警告を出して --topic と register update --topic を案内するようにした。オーケストレーターの定義にも、日本語のタイトルでは英語の --topic を渡す手順を加えた（feature/prj-0001/orchestrator-topic-guidance、548a14a87）。
---

# PJR-17HH 日本語のタイトルから作る個票のファイル名の topic が意味を失う

## 1. 課題内容

register add で --topic を省き、タイトルが日本語の場合、topic が item や readme のように英字の部分だけから作られる（例: 「支払い方法をどこまで扱うか」→ pjr-55ww-item.md）。公開物での実地の確認（2026-10-08）で観測。日本語のタイトルでの既定の topic の作り方を見直す。

## 2. 影響範囲

| 観点         | 影響                                                                             |
| ------------ | -------------------------------------------------------------------------------- |
| スコープ     | `register add` の topic の既定の作り方と案内、オーケストレーター定義の起票の手順 |
| スケジュール | v0.3.0 の公開前に直すと、公開物の利用者の第一印象に効く                          |
| コスト       | 意味のないファイル名（`pjr-55ww-item.md`）を後から直す手間                       |
| 品質         | 個票のファイル名から内容が分からない                                             |
| 関係者       | 日本語でタイトルを書く利用者                                                     |

## 3. 対応方針

| 項目     | 内容                                                                                                                                |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | topic をタイトルの英数字の部分だけから作るため、日本語のタイトルでは `item` や、たまたま含まれる英単語（`readme` など）になる       |
| 対応策   | 意味のある topic を作れないときに利用者と agent へ知らせ、オーケストレーターは英語の topic を渡す。下記の「完了条件の詳細」のとおり |
| 依存事項 | なし                                                                                                                                |
| 完了条件 | 下記の「完了条件の詳細」を満たす                                                                                                    |

### 3.1. 完了条件の詳細

- `register add` で `--topic` を省き、タイトルから作った topic が意味を持たない場合（既定値 `item` になった場合、またはタイトルの大半が英数字以外で、英数字の部分が 1 語だけの場合）は、作った topic を使ったうえで、`--topic` の指定と `register update --topic` での変更を案内する警告を出す。英数字だけのタイトルの挙動は変えない。
- 同梱のオーケストレーター定義（SSOT と各ラッパー）の起票の手順に、タイトルが日本語の場合は内容を表す英語の `--topic`（小文字・ハイフン区切り）を渡すことを加える。ラッパーは `npm run orchestrator:sync` で生成する（`.claude/` などの保護対象を直接編集しない。保護対象で変更できない場合は申し送りへ書く）。
- register-operation-guide の起票の説明に同じ案内を加える。
- unit test で、日本語だけのタイトル、日本語に英単語が 1 語混じるタイトル、英語のタイトルのそれぞれで、topic と警告の有無を確かめる。
- CHANGELOG の v0.3.0 の該当する区分に追記する。
- `npm run check` が通る。

## 4. 対応結果

- `register add` が `--topic` を省略した場合に、既定値が `item` になるタイトルと、文字・数字の過半が非 ASCII で ASCII 語が 1 語だけのタイトルを検出し、作成を続けながら `--topic` と `register update --topic` を案内する警告を出すようにした。
- 日本語だけのタイトル、日本語に英単語が 1 語混じるタイトル、英語だけのタイトルについて、生成される topic と警告の有無を確認する unit test を追加した。
- 登録簿運用ガイドと CHANGELOG に、日本語タイトルでは内容を表す英語の topic を指定する案内と今回の修正内容を追記した。
- オーケストレーター SSOT の `.agents/specdojo-orchestrator.agent.md` は executor の書き込み保護対象だったため変更できなかった。SSOT とラッパーの同期は、書き込み可能な環境で SSOT に同じ案内を加え、`npm run orchestrator:sync` を実行する必要がある。

## 5. 関連ドキュメント

- [[prj-0001:pjr-p8tk-release-stabilization-criteria]]（公開の判定基準）
