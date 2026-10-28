---
specdojo:
  id: prj-0001:pjr-6dd7-register-input
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
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

| No  | 作業                                                     | 担当     | 状態 | メモ |
| --- | -------------------------------------------------------- | -------- | ---- | ---- |
| 1   | 個票テンプレートと register の読み書きに `入力` を加える | executor | open | -    |
| 2   | `--input` と event を実装する                            | executor | open | -    |
| 3   | plan への反映・オーケストレーターの指示・文書を更新する  | executor | open | -    |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-65ds-deliverable-context-draft-approach]]
- [[specdojo:ryu-guide]]
