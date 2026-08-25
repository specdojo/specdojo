---
specdojo:
  id: prj-0001:pjr-b1sj-angle-placeholder-escape-scope
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: ARC
  registered_at: "2026-08-23T13:03:06Z"
  due_on: "2026-08-31"
  completed_at: "2026-08-25T22:08:42Z"
  conclusion: 検知の仕組みは frontmatter にも対応済みだったが、報告が warning のため lint:fm では失敗せず、単体テストでのみ検出される状態だった。message.fatal を設定して error 化し、コミット前に失敗するようにした。既存文書に違反が残っていないことも確認した。混入経路3つ（register add の description、exec の失敗理由から frontmatter の conclusion、索引の conclusion セル）へ既存の inlineCodeAnglePlaceholders を適用し、未エスケープのまま書き込まれないようにした。実装は PJR-ZWMH の既存関数を再利用しており分散していない。
---

# PJR-B1SJ 山括弧プレースホルダのインラインコード化を個票本文とfrontmatterへ広げる

## 1. 概要

PJR-ZWMH は登録簿索引の山括弧プレースホルダをインラインコード化したが、`register add` の description は個票本文へそのまま書き込まれるため未エスケープのまま残る。PJR-QVGX で実際に混入し、`remark-no-unescaped-angle-placeholder` のテストが統合ブランチで失敗した。

起票後に調査したところ、検知の仕組み自体は frontmatter にも対応済みであった。問題は報告レベルにある。

| 経路                                                 | 検知   | 失敗させるか                                       |
| ---------------------------------------------------- | ------ | -------------------------------------------------- |
| `npm run lint:md`（markdownlint）                    | しない | —                                                  |
| `npm run lint:fm`（remark）                          | する   | **しない**（warning のため `--frail` でも exit 0） |
| `remark-no-unescaped-angle-placeholder` の単体テスト | する   | する                                               |

つまり、混入は単体テストでのみ失敗として現れる。実際に PJR-QVGX と PJR-KAQV のクローズ時、`conclusion` へ書いた文字列で2回とも取りこぼしている。混入経路は次の3つである。

- `register add --description` から個票本文へ
- exec の失敗理由から個票 frontmatter の `conclusion` へ
- 人やオーケストレーターが直接書く本文と frontmatter へ

## 2. 完了条件

- 未エスケープの山括弧プレースホルダが、コミット前に失敗として検知される。`lint:fm` が warning ではなく error として扱うか、他の経路で失敗させるかは判断してよい。判断した理由が記録されている。
- 検知対象が本文と frontmatter の双方を含む。現在の実装が frontmatter を検知できることを確認したうえで、報告レベルのみを変える場合はその旨を記録する。
- `register add --description` に山括弧を含む文字列を渡した場合、個票本文へ未エスケープのまま書き込まれない。インラインコード化するか、警告して拒否するかを判断する。
- exec の失敗理由が個票 frontmatter の `conclusion` へ書き込まれる経路でも、未エスケープの山括弧が残らない。なお `conclusion` に失敗理由が残ること自体は PJR-X2Q7 の範囲であり、本項目では文字列の扱いのみを対象とする。
- 既存文書に未エスケープの山括弧が残っていないことを確認する。検知を error へ変える場合、既存の違反が残っているとコミットできなくなる。
- 規約や検知の文言を変えた場合、既存テストの期待値が新しい仕様と整合していることを確認する。
- `npm run lint:md`、`npm run lint:fm`、`npm run test:unit`、`npm run test:integration` が成功する。

## 3. 作業内容

| No  | 作業                                                         | 担当 | 状態 | メモ                                       |
| --- | ------------------------------------------------------------ | ---- | ---- | ------------------------------------------ |
| 1   | 検知の報告レベルを見直し、コミット前に失敗する経路を用意する | ARC  | done | remark の検知メッセージを fatal error 化   |
| 2   | `register add --description` の書き込み経路を対処する        | ARC  | done | 共有処理でインラインコード化               |
| 3   | exec の失敗理由が frontmatter へ入る経路を対処する           | ARC  | done | sanitize と frontmatter 書き込み境界で変換 |
| 4   | 既存文書に違反が残っていないことを確認する                   | ARC  | done | `lint:fm` の全件検査で確認                 |

## 4. 対応結果

- `remark-no-unescaped-angle-placeholder` の本文・frontmatter 診断を fatal error に変更した。自動変換を通らない直接編集も `lint:fm` で失敗させる。既存規約で素の山括弧は禁止済みであり、warning のままではコミット前検知にならないため error 化を選んだ。
- `register add` / `register update` / 旧一覧移行が個票本文へ description を書く際、既存の `inlineCodeAnglePlaceholders` で連結範囲をインラインコード化するようにした。入力拒否ではなく変換を選び、既存 CLI の入力互換性を維持した。
- 状態遷移が個票 frontmatter へ conclusion を書く境界と、exec の失敗理由を一行化する `sanitizeRegisterConclusion` の双方へ同じ変換を適用した。再適用しても二重化しない。
- description、状態遷移、exec 失敗理由、fatal 診断の回帰テストを追加した。既存文書は `lint:fm` の全件検査で違反がないことを確認した。残課題はない。

## 5. 関連ドキュメント

- 索引側を対処した項目: [[prj-0001:pjr-zwmh-register-index-angle-placeholder-escape|PJR-ZWMH 登録簿索引の山括弧プレースホルダのエスケープ]]
- `conclusion` の保持を扱う項目: [[prj-0001:pjr-x2q7-register-conclusion-overwrite|PJR-X2Q7 失敗時のブロック理由が個票のconclusionを上書きする問題を解消する]]
- 検知の実装: `tools/docs/src/remark-no-unescaped-angle-placeholder.ts`
- 記法の指示: `.github/instructions/markdown.instructions.md`
