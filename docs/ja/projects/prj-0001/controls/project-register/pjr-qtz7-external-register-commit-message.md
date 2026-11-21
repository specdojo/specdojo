---
specdojo:
  id: prj-0001:pjr-qtz7-external-register-commit-message
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: medium
  difficulty: easy
  owner: DEV
  registered_at: "2026-11-21T09:06:40Z"
---

# PJR-QTZ7 外部プロジェクトへの register add --commit で、-m の段落がカンマで件名につながる

## 1. 課題内容

external_projects へ register add --commit -m を複数渡すと、各段落が改行ではなくカンマで連結され、本文と Co-Authored-By の行が件名の1行に入る。また相手のリポジトリの commit-msg hook で commit が失敗したとき、CLI は書き込んだファイルの一覧と「not committed」だけを示し、失敗の理由（hook の出力）を出さない。段落を git commit -m と同じに扱い、commit の失敗の理由を示す

## 2. 入力

- 発端は利用者のプロジェクト coderdojo-lessons-specdojo（SpecDojo 0.9.2、2026-11-21）。
- register add --project `<外部の別名>` --commit -m `<件名>` -m `<本文>` -m `<Co-Authored-By>` で起票したところ、相手のリポジトリの commit の件名が「`<件名>`,`<本文>`,`<Co-Authored-By>`」の1行（275 文字・414 文字）になった。この2件（PJR-FGKB・PJR-F6MC）の commit は orchestrator がメッセージだけを作り直した。
- 別の起票では、本文の1行が commitlint の body-max-line-length（100 文字）を超え、相手の commit-msg hook で commit が失敗した。CLI の出力は「The register changes were written but not committed:」とファイルの一覧だけで、理由は手で git commit を流して初めて分かった。個票とイベントは相手の作業ツリーに未 commit のまま残った（PJR-7KQT）。
- help の -m の説明は「each value becomes a paragraph, as in git commit -m」で、ローカルの project への起票ではそのとおりに動く。

## 3. 影響範囲

| 観点         | 影響                                                                                    |
| ------------ | --------------------------------------------------------------------------------------- |
| スコープ     | 外部プロジェクトへの `register add --commit`（`-m` の複数指定と commit の失敗の表示）   |
| スケジュール | なし（回避策: 相手のリポジトリで commit を作り直す）                                    |
| コスト       | 小さい（runner と CLI の一部の修正）                                                    |
| 品質         | 相手のリポジトリに件名が長すぎる commit が入る。hook で失敗した理由が分からない         |
| 関係者       | 利用者のプロジェクト（coderdojo-lessons-specdojo など）と prj-0001 のオーケストレーター |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | `src/register/external-project.ts` の `message` が `string` の型で、`-m` を複数渡すと配列のまま `addValue` へ渡され、`,` で連結した 1 つの `--message` になる。commit の失敗の表示は、`src/register/register.ts` が git のエラーを包むときに hook の出力（commitlint は stdout に出す）が含まれないためと見ている（実装で確かめる） |
| 対応策   | `-m` の値を 1 つずつ `--message` として相手へ渡す。commit が失敗したときは、hook の stdout と stderr をエラーに含める。ローカルの project への起票でも同じ表示にする                                                                                                                                                                |
| 依存事項 | なし                                                                                                                                                                                                                                                                                                                                |
| 完了条件 | 下の箇条書きのすべてを満たす                                                                                                                                                                                                                                                                                                        |

- 外部プロジェクトへ `-m` を 3 つ渡すと、相手の commit が件名・本文の段落に分かれる（テストで確かめる）。
- commit-msg の hook が stdout に理由を出して失敗したとき、CLI のエラーにその理由が含まれる（テストで確かめる）。
- 原因の見立て（hook の出力）が違った場合は、確かめた本当の原因を個票の対応結果に書く。
- `CHANGELOG.md` は変えない。個票の対応結果の `### 5.1. CHANGELOG に書く事項` に、区分（追加・変更・不具合修正など）と行の文案を書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。

## 5. 対応結果

### 原因

- `src/register/external-project.ts` の `ExternalRegisterAddOptions.message` が `string | undefined` で、caller が commander の `-m`（複数値 collector `collectRegisterCommitMessage`）から渡す配列（`string[]`）をそのまま `addValue(args, "--message", ...)` へ渡していた。複数渡しで受け取れる相手側の commander も同じ collector を持っていたため、3 つの `-m` をカンマ連結ではなく段落の列として受け取っていたが、外部経由の引数組み立ては「1 個の `--message` へ配列を 1 文字列へ落とした」挙動になり、相手側の `commitMessage` が「件名・本文・Co-Authored-By」の 1 行（275 文字 / 414 文字）として解釈されていた。
- 失敗の表示は `src/shared/git.ts` の `gitOutput` と `GitCommandError` が `stderr` のみに注目していること。commitlint は失敗理由を **stdout** へ出すため、`error.stderr` が空になり、`register.ts` の commit catch で「The register changes were written but not committed: ...」のみのエラーになっていた。個票の報告どおり。

### 対応

- `src/register/external-project.ts`:
  - `ExternalRegisterAddOptions.message` を `readonly string[]` に変更。
  - `buildExternalRegisterAddArgs` の末尾を `externalCommitMessageParagraphs(opts.message)` で展開し、各値を 1 つずつ `--message <paragraph>` として相手へ渡す（空値は除去、全て空なら `--message` を出さず相手側の既定 commit message を使う）。
  - `delegateExternalRegisterAdd` は `stdio` を `["ignore", "pipe", "pipe"]` に変え、実行結果の stdout / stderr を自分のストリームへ転送。`status !== 0` のとき `process.exitCode` を継承する。stderr が空の stdout 失敗（commitlint）もそのまま出力としてユーザーへ伝わる。
- `src/register/register.ts`:
  - 新增の `gitOutputCapturingFailure(repoRoot, args)` を追加。`gitResult` で commit を実行し、失敗時に stdout と stderr を併せて `formatGitCommandFailure`（内部で `summarizeGitStderr` 相当に要約）へ渡し、原因を含む `GitCommandError` を投げる。これにより commitlint が **stdout** へ出す理由もエラー message に残る。
  - 初回 commit は `gitOutput` の代わりに `gitOutputCapturingFailure(commitMessage の args)` を呼ぶ。amend 収束の段階は従来どおり `gitOutput` のまま。catch ブロックでは、`committed` 前（初回失敗）の error.message から原因がそのまま取れるため、状態だけを追記する既存挙動を維持。
- `tests/src/register/commit.integration.test.ts`:
  - 新ケース「commit-msg が stdout に理由を出しても失敗原因をエラーへ含める（PJR-QTZ7）」。stderr を空に、stdout へ `body-max-line-length: found 0` と出力する `commit-msg` hook を設置し、最終エラーメッセージの stderr 出力（`The register changes were written but not committed:` の前段）にその文字列が含まれることを検証。
- `tests/src/register/external-project.test.ts`:
  - `baseOptions.message` を配列 `["docs: add external item"]` に変更。既存の `forwards add options ...` ケースは新しい配列入力でも同じ `--message docs: add external item` を 1 つ出す。
  - 新ケース「forwards each -m value as a separate --message paragraph（PJR-QTZ7）」: 2 つの段落（件名 / 本文+Co-Authored-By）を渡し、相手 CLI あたりの引数が `--message A --message B` の形（カンマ連結ではない）になることを検証。
  - 新ケース「omits --message when every value is blank so the target uses its default」: 全て空値なら `--message` が渡されないことを確認。
- 個票の完了条件: 個別の完了条件をすべて満たす。

### 5.1 CHANGELOG に書く事項

- 不具合修正: 外部プロジェクトへの `register add --commit -m` で複数の段落をカンマ連結せず、各値を別々の `--message` として相手へ渡す。
- 不具合修正: commit-msg hook が stdout へ失敗理由を出した場合でも、`register add` / `register update` などのエラー出力（stderr）にその理由を含める。

## 6. 関連ドキュメント

- [[prj-0001:pjr-qtz7-external-register-commit-message|PJR-QTZ7 個票]]
- `src/register/external-project.ts`, `src/register/register.ts`: 変更対象ファイル。
- `tests/src/register/commit.integration.test.ts`, `tests/src/register/external-project.test.ts`: 追加・更新テスト。
