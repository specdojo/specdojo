---
specdojo:
  id: prj-0001:pjr-qtz7-external-register-commit-message
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
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

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
