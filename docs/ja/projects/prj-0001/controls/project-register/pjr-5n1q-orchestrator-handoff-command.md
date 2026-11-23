---
specdojo:
  id: prj-0001:pjr-5n1q-orchestrator-handoff-command
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-23T01:52:55Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-5RY7
  depends_on:
    - PJR-2Q86
  commit_type: feat
  commit_scope: orchestrator
---

# PJR-5N1Q specdojo orchestrator handoff を作り、引き継ぎの手順を指示と playbook に足す

## 1. 概要

進行中と判断待ちを登録簿と exec の状態から組み立てて handoff を起票するコマンドを作り、始めと終わりの手順を足す

## 2. 入力

<!-- 対話で得た前提・制約・委任範囲を記録する。完了・回答の判定条件とは分ける。 -->

-

## 3. 完了条件

- `specdojo orchestrator handoff` を作る。開いている `handoff` の個票を起票し、「進行中」の章を、流している列（`exec queue`）・実行中の run・review と waiting の register 項目から組み立てて埋める。「判断待ち」の章には、開いている `question` と waiting の項目への参照を入れる。手で書く章（引き継ぎ元と先・有効な承認の範囲・注意点）は `_TODO_` で残す。
- `--dry-run` で書き込まずに中身を表示できる。開いている handoff がほかにあるときは、その旨を出す。
- 単体テストを足す（進行中と判断待ちの組み立て、開いている handoff があるときの扱い）。
- オーケストレーターの指示（SSOT の本文と、各環境の薄いラッパー）と playbook に、始めるときは開いている handoff を読んで受け取った主体を `--by` にして close し、終えるときはこのコマンドで起票する手順を足す案を書く。指示の本文と playbook は保護された設定のため、案を個票の対応結果と報告の `handoff` に書き、反映は利用者の承認のもとでオーケストレーターが行う。
- runner と CLI の動きを変えるため、統合の後に orchestrator が prj-0001 で `orchestrator handoff --dry-run` を流して確かめてから close する。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json`・`CLAUDE.md`・`AGENTS.md` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- 関連する設計・ガイド・CLI リファレンスを直す。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md`・`npm run validate:schema` を通し、親の検証を通す。
- 2 回目の実行（2026-11-23）: 1 回目の後に prj-0001 で `orchestrator handoff` を流すと、次の 2 点が見つかった。
  - 「進行中」の章の列（`exec queue`）に、2026-11-21・22 に止まった古い列まで 11 件が並び、今流している列が埋もれる。流している列（running・pending）と、前回の handoff より後（なければ直近 24 時間）に止まった列だけを出す。それより古い止まった列は、件数だけを 1 行で出す。
  - `--dry-run` のときだけ、表示される個票の ID（例: PJR-F9JS）と event のファイル名（例: `pjr-2gpa.yaml`）が食い違う。実際に起票したときはそろっていた。dry-run でも同じ ID を表示する。
  - どちらも単体テストで確かめる。

## 4. 作業内容

| No  | 作業                                                                              | 担当 | 状態 | メモ                                                                        |
| --- | --------------------------------------------------------------------------------- | ---- | ---- | --------------------------------------------------------------------------- |
| 1   | `specdojo orchestrator handoff` を作る（進行中と判断待ちの組み立て・`--dry-run`） | DEV  | done | `src/commands/orchestrator-handoff.ts`                                      |
| 2   | `register add` に `--section` / `--section-file` の繰り返し指定を足す             | DEV  | done | `src/register/create-commands.ts`・`section.ts`・`external-project.ts`      |
| 3   | 単体テストを足す                                                                  | DEV  | done | 組み立て・開いている handoff の扱い・`register add --section`               |
| 4   | CLI リファレンス・登録簿運用ガイド・`pjr-rulebook` を直す                         | DEV  | done | -                                                                           |
| 5   | オーケストレーターの指示と playbook の変更案を書く                                | DEV  | done | 保護された設定のため案だけ。対応結果の「保護された設定の変更案」に書いた    |
| 6   | 統合の後に prj-0001 で `orchestrator handoff --dry-run` を流して確かめる          | PM   | open | 統合の後に orchestrator が行う。executor の worktree での事前の確認は済んだ |
| 7   | 静的検査と単体テストを通す                                                        | DEV  | done | 関係する単体テストを実行。全件と lint・typecheck は親の検証で流す           |
| 8   | 2 回目: 止まった古い列を件数だけにし、dry-run の ID をそろえる                    | DEV  | done | 対応結果の「2 回目の実行」に書いた                                          |

## 5. 対応結果

### 5.1. 実施内容

- `specdojo orchestrator handoff` を足した。登録簿・`exec queue` の列・exec run のロックから材料を集め、「進行中」（終わっていない列、ロックを持つ実行中の run、`in-progress`・`review`・`waiting` の項目）と「判断待ち」（開いている `question` と `waiting` の項目への参照）の章を組み立てる。起票は組み立てた章を一時ファイルに書き、`register add --type handoff --section ... --section-file ...` を自プロセスで起動して行う。引き継ぎ元と先・有効な承認の範囲・注意点の章は template の `_TODO_` のまま残る。
- `--dry-run` は `register add --dry-run` へ渡し、書き込まずに個票の中身を表示する。開いている handoff がほかにあるときは、その ID と題を標準エラー出力に示してから起票する。`--commit`・`-m`・`--by`・`--reason`・`--owner`・`--priority`・`--title`・`--topic` は `register add` へ渡す。
- `register add` に `--section` / `--section-file` を足した。繰り返し指定でき、指定順に組にして、template から作った個票の章を起票と同時に埋める。数が合わない場合・template にない章名・見出しを含むファイルは個票を作らずにエラーにする。外部 project への `register add` では使えない（エラーにする）。
- 単体テスト: `tests/src/commands/orchestrator-handoff.test.ts`（章の組み立て、開いている handoff の検出と通知、`register add` へ渡す引数、登録簿と列を置いた fixture での起動）と、`tests/src/register/section.test.ts` の `pairSectionOptions` と `register add --section`。
- CLI リファレンス（`orchestrator handoff` の節と `register add --section`）、登録簿運用ガイド（handoff の節に始めと終わりの手順）、`pjr-rulebook`（進行中の組み立てにコマンドを示す）を直した。
- この worktree で `npx tsx src/specdojo.ts orchestrator handoff --project prj-0001 --dry-run` を流し、列・review・waiting・開いている question が章に入り、手で書く章が `_TODO_` のまま残ることを確かめた。

### 5.2. 決めた点と理由

- 起票は register の内部処理を直接呼ばず、`register add` を自プロセスで起動して委ねた。理由: ID の採番・event・生成ビュー・`--commit` のロックと commit を二重に持たないため。章を起票と同時に埋めるために `register add` へ `--section` を足し、起票と章の差し替えで commit が 3 つに分かれないようにした。
- `--description` は渡さない。理由: 一覧の説明は第 1 章（引き継ぎ元と先）の最初の段落から読まれるため、説明を渡すと手で書く章が埋まってしまう。
- 開いている handoff があっても起票は止めず、知らせるだけにした。理由: 完了条件が「その旨を出す」であり、読まれていない handoff の扱いは次に読んだ主体が close で決めるため（PJR-2Q86 の決定）。
- 「進行中」には完了条件の列・run・review・waiting に加えて `in-progress` の項目も入れた。理由: `exec run --register` で流している項目は `in-progress` になり、run のロックの持ち主だけでは何を流しているか分からないため。`waiting` の項目は完了条件どおり「進行中」と「判断待ち」の両方に出す。
- 止まった（`stopped`）列も終わっていない列として出す。理由: `exec queue run` で再開できる状態であり、次のセッションが再開か cancel を決める必要があるため。
- 実行中の run は exec run のロック（主と `--join` の枠）の持ち主から読む。schedule の `doing` のタスクは、検証に失敗すると終了する `exec status` の読み込みを避けるため入れなかった。
- コマンドの実装は `orchestrator night` と同じく `src/commands/` に置いた。register は exec を import できないため、両方を読む組み立ては register の外に置く（PJR-5RY7）。

### 5.3. 保護された設定の変更案

利用者の承認のもとでオーケストレーターが反映する。

- 指示の本文 `.agents/specdojo-orchestrator.agent.md`（SSOT）と、各環境の薄いラッパー（`.claude/agents/specdojo-orchestrator.md`・`.github/agents/specdojo-orchestrator.md`・`.codex/agents/` と `.opencode/` のオーケストレーターの定義）に同じ本文を入れる。本文はバイト一致で保つ。
  - 「登録簿（register）の使い方」の type の表に `handoff` の行を足す: 用途「セッション・LLM の切り替えの引き継ぎ」、終端状態 `done`。
  - 「specdojo コマンド地図」に行を足す: 目的「セッションの引き継ぎ」、サブコマンド `orchestrator`、代表操作 `orchestrator handoff` / `register close`。
  - 「対話の進め方」の後に次の章「セッションの始めと終わり」を足す。
    - 始めるとき: `generated/pjr-handoffs.md` で開いている handoff を探して読む。読んだら、受け取った主体（自分なら `specdojo-orchestrator`）を `--by` にして `npx specdojo register close --id <PJR-XXXX> --by <actor> --commit` で close する。判断待ちの `question` は handoff と一緒に閉じない。
    - 終えるとき: `npx specdojo orchestrator handoff --project <project-id> --dry-run` で中身を示し、承認を得て `--by specdojo-orchestrator --commit` で起票する。起票の後、引き継ぎ元と先・有効な承認の範囲・注意点を `register update --section` で書く。利用者の返事を待っていることは、先に `question` として起票しておく。
    - `tmp/orchestrator/handoff-*.md` には書かない。
- playbook [[prj-0001:pm-orchestrator-playbook|オーケストレーター運用メモ]] に「セッションの引き継ぎ」の章を足す（配布する本文の手順に加えた prj-0001 の事情だけ）。
  - 夜の間の承認の範囲（close してよい条件・使わない agent など）は handoff の「有効な承認の範囲」に書き、長く効くものはこの playbook の該当の章へ移す。
  - handoff の起票と close は register の記帳として `develop` へ `--commit` で直接 commit してよい。
  - 今の `tmp/orchestrator/handoff-*.md` は、最初の `orchestrator handoff` の起票で置き換え、以後は使わない。

### 5.4. CHANGELOG に書く事項

- 区分: Added
- 文案: `specdojo orchestrator handoff` を追加。登録簿と `exec queue`・exec run のロックから「進行中」と「判断待ち」の章を組み立てて `handoff` の個票を起票する。`--dry-run` で書き込まずに中身を表示し、開いている handoff がほかにあるときは知らせる。
- 区分: Added
- 文案: `register add` に `--section` / `--section-file`（繰り返し可）を追加。template から作った個票の章を起票と同時にファイルの本文で埋める。

### 5.5. 2 回目の実行

- 列の絞り込み: `running`・`pending` の列はいつ止まったかに関係なく出し、`stopped` の列は記録の `updated_at` が境目より後のものだけを出す。境目は、状態を問わずいちばん新しい handoff の `registered_at`、handoff がなければ実行時刻の 24 時間前とした。それより前に止まった列は「それより前に止まった列: N 件（`exec queue status` で見る）」の 1 行にまとめる（`selectHandoffQueues`・`stoppedQueueCutoff`）。
- dry-run の ID: コマンドがすでにある ID を避けて ID を 1 回だけ採番し、`register add` へ `--id` で渡すようにした。`orchestrator handoff --id` も足したので、dry-run で示した ID を本番の起票に使える。executor の worktree では食い違いを再現できなかった（1 回の dry-run の中では、個票と event のファイル名は同じ ID だった）。別々の dry-run の出力を見比べた、または dry-run と実際の起票を見比べたことが原因と推定する。`register add` の内部での採番に頼らず ID を 1 か所で決めることで、どちらの場合にも ID が 1 つに決まるようにした。
- 単体テスト: `stoppedQueueCutoff`（前回の handoff がある場合とない場合）、`selectHandoffQueues`、件数の 1 行、`--id` の受け渡し、fixture での起動（古い止まった列が件数になる、採番した ID を `--id` で渡す）、`register add --dry-run` で個票の見出し・個票のファイル名・event のファイル名が同じ ID になること。
- CLI リファレンスの `orchestrator handoff` の節に、列の絞り込みと `--id` を足した。
- この worktree で `orchestrator handoff --project prj-0001 --dry-run` を流し、列が 2 件と「それより前に止まった列: 9 件」になり、個票と event のファイル名の ID がそろうことを確かめた。残った 2 件は 2026-11-21 の `pending` の列と、runner が生きていない `running` の列で、完了条件どおり流している列として出る。
- CHANGELOG に書く事項の 1 件目の文案に「流している列と前回の handoff より後に止まった列を出す」を加える場合は、次の文案を使う: `specdojo orchestrator handoff` を追加。登録簿と `exec queue`（流している列と前回の handoff より後に止まった列）・exec run のロックから「進行中」と「判断待ち」の章を組み立てて `handoff` の個票を起票する。`--dry-run` で書き込まずに中身を表示し、`--id` で dry-run と同じ ID を使える。開いている handoff がほかにあるときは知らせる。

### 5.6. 残課題

- 統合の後に orchestrator が prj-0001 で `orchestrator handoff --dry-run` を流して確かめてから close する（作業内容の 6 行目）。
- 保護された設定の変更案（指示の本文・ラッパー・playbook）の反映は、利用者の承認のもとでオーケストレーターが行う。

## 6. 関連ドキュメント

- [[prj-0001:pjr-5ry7-register-handoff-type|PJR-5RY7 handoff の決定]]
- [[prj-0001:pjr-2q86-register-type-handoff|PJR-2Q86 register に種類 handoff を足す]]
- [[prj-0001:pm-orchestrator-playbook|オーケストレーター運用メモ]]
- [[specdojo:command-reference|CLIコマンドリファレンス]]
- [[specdojo:register-operation-guide|登録簿運用ガイド]]
- [[specdojo:pjr-rulebook|プロジェクト登録簿 作成ルール]]
