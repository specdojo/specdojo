---
specdojo:
  id: prj-0001:pjr-pp0d-exec-plan-todo-markdown
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
---

# PJR-PP0D exec plan生成時にアンダースコア識別子や*TODO*がMarkdown強調記号として誤解釈され破損する

## 1. 概要

[[prj-0001:pjr-0xxz-pjr-index]] のclose時に実際に発生した不具合。`src/exec-register.ts`の`_PJR_DESCRIPTION_`プレースホルダ置換（約291行目）が`item.description`（`pjr-index.md`の説明列の値）をエスケープせずそのままplan本文へ埋め込むため、説明文に`register_date_timezone`のようなアンダースコア入り識別子や`_TODO_`/`_ASSUMPTION_`が含まれると、生成されたplanのMarkdownとして誤って強調記号（`_..._`/`*...*`）に解釈され、一部が破損する（例: `register_date_timezone` が `register*date_timezone` のように壊れる）。破損したplanはmarkdownlintの`MD049`（強調スタイル不統一）でcommitがブロックされる。

## 2. 完了条件

- `_PJR_DESCRIPTION_`（および同様に登録簿の自由記述をplan/result本文へ埋め込む他のプレースホルダ）が、Markdownの強調記号・コードスパン等に誤解釈されない形でエスケープまたはコードスパン化されて埋め込まれる。
- アンダースコアを含む識別子（例: `register_date_timezone`）や`_TODO_`/`_ASSUMPTION_`を含む説明文からplanを生成した場合に、生成物がmarkdownlint（`MD049`含む）でエラーにならないことが自動テストで確認できる。
- 過去にこの問題で修正した実例（PJR-0XXZの手動修正内容）と同等のケースが再発しないことをテストで担保する。
- 修正が`_PJR_DESCRIPTION_`以外の類似プレースホルダ（`exec-plans.ts`・`exec-register.ts`の他テンプレート変数）にも同じリスクがないか確認され、必要な範囲に適用されている。

## 3. 作業内容

| No  | 作業                                                                        | 担当 | 状態 | メモ                                                   |
| --- | --------------------------------------------------------------------------- | ---- | ---- | ------------------------------------------------------ |
| 1   | `_PJR_DESCRIPTION_`置換箇所と`expandTemplate`の実装を確認する               | ARC  | open | `src/exec-register.ts`約291行目、`src/exec-shared.ts`  |
| 2   | Markdown特殊文字（`_`・`*`・`` ` ``・`\|`等）を安全に埋め込む方式を実装する | ARC  | open | エスケープ、またはコードスパン化のいずれかを選定       |
| 3   | 他のテンプレート変数への同種リスクを洗い出し、必要なら同様の対応を行う      | ARC  | open | -                                                      |
| 4   | 自動テストを追加する                                                        | ARC  | open | PJR-0XXZ実例相当の入力でmarkdownlintまで通ることを検証 |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-0xxz-pjr-index|pjr-indexへ登録日列を追加しタイムゾーン設定を導入する]]
- [[prj-0001:pjr-0163-register-add-id-fetch|register addのID採番方式見直しと統合ブランチ予約のfetch同期]]
