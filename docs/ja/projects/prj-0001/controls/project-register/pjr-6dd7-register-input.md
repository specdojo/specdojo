---
specdojo:
  id: prj-0001:pjr-6dd7-register-input
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  registered_at: "2026-10-28T22:22:22Z"
  derived_from:
    - PJR-65DS
  depends_on:
    - PJR-3MY5
---

# PJR-6DD7 個票の入力節と register の --input を設ける

## 1. 概要

対話で得た前提を個票の入力節へ記録する --input を add/update に追加し、register 経由の plan の参照範囲に入れる

## 2. 完了条件

- 個票テンプレート（`todo` など approach を持てる type）に節 `入力` を設ける。既存の個票に節が無くても読み書きできる。
- `register add` / `update` に `--input <text>` を追加する。繰り返し指定でき、節 `入力` に箇条書きで記録する。update での置き換え・追記・削除の扱いは executor が決める。変更は event に記録する。
- register 経由の plan（approach つきの成果物の plan と、approach の無い register plan の両方）に、個票の `入力` を完了条件とは別の「前提」として載せる。`入力` が無い場合は載せない。3MY5 で設けた差し込み口を使う。
- 配布するオーケストレーターの指示（`.agents/specdojo-orchestrator.agent.md` を正本とし、`npm run orchestrator:sync` で各環境へ反映）に、対話で得た前提を `--input` で起票に記録することを書き足す。
- pjr-rulebook・register-operation-guide・command-reference に `入力` と `--input` を書く。
- 単体テストで、`--input` の記録と event の往復、plan への反映、節の無い既存の個票の扱いを確かめる。
- `CHANGELOG.md` の `## [Unreleased]` 節（無ければ `## [0.5.0]` の上に作る）に追記する。`0.5.0` と公開済みの版の節は変えない。
- 作業の中で `npm run typecheck`・`npm run lint:ts`・`npm run lint:md`・`npm run test:unit` が通り、親の検証 7 件が通る。
- 設計で決めることは executor が決め、理由を本個票の対応結果に書き、報告の `handoff` にも書く。保護された設定に触れる必要がある場合は、変更せずに案を本個票の対応結果と `handoff` に書く。

## 3. 作業内容

| No  | 作業                                                     | 担当     | 状態 | メモ                                                                    |
| --- | -------------------------------------------------------- | -------- | ---- | ----------------------------------------------------------------------- |
| 1   | 個票テンプレートと register の読み書きに `入力` を加える | executor | done | 実行対象5 type の雛形、既存個票への節追加、複数行・コード例の扱いを実装 |
| 2   | `--input` と event を実装する                            | executor | done | 反復指定・一覧置換・全削除、event と schema、外部起票の引き継ぎを実装   |
| 3   | plan への反映・オーケストレーターの指示・文書を更新する  | executor | done | plan・文書・回帰テストを更新。保護された指示の正本は以下へ変更案を記録  |

## 4. 対応結果

- `register add` / `update` に反復指定できる `--input <text>` を追加した。個票本文の `入力` 節を正本とし、`todo`・`issue`・`change-request`・`question`・`risk` のテンプレートに空の節を設けた。節のない既存個票も読め、初回更新時は他の節を変更せず末尾へ追加する。番号付き・番号なしの見出しに対応し、コード例や引用中の見出しは節とみなさない。
- 設計判断: update は指定した入力一覧で置換し、未指定は保持、`--input -` 単独は全削除とした。追記する場合は既存分も含めて指定する。既存の `--target` / `--source` と同じ操作にそろえ、再実行で入力が重複しないようにした。空文字、add での削除、削除と他の入力の混在は拒否する。複数行は一つの箇条書きの継続行にし、指定順を保持する。
- 設計判断: event の `input` は既存の複数値フィールドに合わせ、変更前後を JSON 配列の文字列（未入力は `-`）として保持する。Frontmatter への重複保存や一覧への追加は行わない。入力だけの更新でも event を生成し、同じ値への更新は生成しない。topic と入力の同時更新、dry-run、外部 project への起票にも対応した。
- register 経由の plan では approach 付きの成果物・kata の plan と、approach なしの edit / investigate plan の両方に「個票の入力（前提）」を追加した。入力は完了条件とは別節にし、未入力なら節も参照行も載せない。既存の `_REGISTER_INPUT_` 差し込み口を使い、`draft` / `fully-guided` の参照一覧から前提節へ案内する。入力は plan 生成時に個票から読み直す。
- pjr-rulebook・register-operation-guide・command-reference と `CHANGELOG.md` の Unreleased を更新した。公開済みの版の節は変更していない。
- 回帰テストを追加した。CLI の反復指定・保持・一覧置換・削除・冪等性・dry-run・topic 同時変更・既存個票への節追加、event の往復、複数行とコード例、外部起票、approach 有無と入力有無による plan の展開を対象とする。
- 再開時の修正: 前回の親単体テストで失敗した `fully-guided` の未入力判定を修正した。テンプレートの一般的な参照方針にも「個票の入力」が登場するため、文字列全体の不在ではなく、未入力時の参照行と前提節の不在を確認する。`draft` / `fully-guided` の両方で未入力時の省略を検証し、入力がある場合は参照行から前提節への案内も確認する。単体テストの再実行は親 runner に委ねる。
- 保護された設定の変更案: `.agents/specdojo-orchestrator.agent.md` の「起票では `--title` と `--description` を具体的に書く。」段落の後ろへ、次の文を追加する。「対話で得た前提・制約・調査や選定を任せる範囲は、起票時に `--input <text>` を繰り返して個票の `入力` へ記録する。完了条件とは分け、会話で確認できた事実と明示的な委任範囲だけを書く。更新時の `--input` は一覧置換なので、追記では既存分も含めて渡し、全削除は `--input -` とする。」運用メモが保護対象と定め、完了条件も案の記録を指定しているため、正本と各環境のラッパーは変更していない。次の作業は、権限のある環境で正本へ反映し `npm run orchestrator:sync` と `npm run lint:orchestrator-sync` を実行すること。
- 検証（再開後）: 変更ファイルの Prettier 整形、変更した event schema による本個票の event ログ検証、catalog 検証、register build、`git diff --check` が成功した。catalog は未作成成果物に関する警告のみでエラーはない。型検査、TypeScript / Frontmatter / Markdown lint、schema、単体 / 統合テストの7件は pipeline 指示に従い親 runner が実行して evidence へ追記する。
- 統合後の確認: register / exec の変更を含むため、運用メモに従い PJR-JSEY で実 CLI の start から review までを確認する。

## 5. 関連ドキュメント

- [[prj-0001:pjr-65ds-deliverable-context-draft-approach]]
- [[specdojo:ryu-guide]]
