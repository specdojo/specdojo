---
specdojo:
  id: prj-0001:pjr-pp0d-exec-plan-todo-markdown
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_on: "2026-08-08"
  due_on: "2026-08-31"
  completed_on: "2026-08-08"
  conclusion: exec-shared.tsにescapeMarkdownInlineを追加し、register add/updateの自由記述列(title/description)由来のアンダースコア/アスタリスクを含むASCIIトークンをcode span化してplan生成時のMD049誤解釈を防止。再実行(--worktree)で正常完了を確認。
---

# PJR-PP0D exec plan生成時にアンダースコア識別子や`_TODO_`がMarkdown強調記号として誤解釈され破損する

## 1. 概要

登録簿の説明文などに含まれる`register_date_timezone`のようなアンダースコア入り識別子や`_TODO_`/`_ASSUMPTION_`プレースホルダが、exec plan生成パイプラインを通る際にバッククォートでエスケープされず、Markdownの強調記号として誤って解釈され一部が破損する（例: `register_date_timezone` が `register*date_timezone` のように壊れる）。結果としてmarkdownlintのMD049エラーでcommitがブロックされる（PJR-0XXZのclose時に実際に発生し手動修正した）。plan生成時に識別子・プレースホルダ相当の文字列を適切にエスケープ（バッククォート化）する。

[[prj-0001:pjr-0xxz-pjr-index]] のclose時に実際に発生した不具合。`src/exec-register.ts`の`_PJR_DESCRIPTION_`プレースホルダ置換（約291行目）が`item.description`（`pjr-index.md`の説明列の値）をエスケープせずそのままplan本文へ埋め込むため、説明文に`register_date_timezone`のようなアンダースコア入り識別子や`_TODO_`/`_ASSUMPTION_`が含まれると、生成されたplanのMarkdownとして誤って強調記号（`_..._`/`*...*`）に解釈され、一部が破損する（例: `register_date_timezone` が `register*date_timezone` のように壊れる）。破損したplanはmarkdownlintの`MD049`（強調スタイル不統一）でcommitがブロックされる。

## 2. 完了条件

- `_PJR_DESCRIPTION_`（および同様に登録簿の自由記述をplan/result本文へ埋め込む他のプレースホルダ）が、Markdownの強調記号・コードスパン等に誤解釈されない形でエスケープまたはコードスパン化されて埋め込まれる。
- アンダースコアを含む識別子（例: `register_date_timezone`）や`_TODO_`/`_ASSUMPTION_`を含む説明文からplanを生成した場合に、生成物がmarkdownlint（`MD049`含む）でエラーにならないことが自動テストで確認できる。
- 過去にこの問題で修正した実例（PJR-0XXZの手動修正内容）と同等のケースが再発しないことをテストで担保する。
- 修正が`_PJR_DESCRIPTION_`以外の類似プレースホルダ（`exec-plans.ts`・`exec-register.ts`の他テンプレート変数）にも同じリスクがないか確認され、必要な範囲に適用されている。

## 3. 作業内容

| No  | 作業                                                                        | 担当 | 状態 | メモ                                                                |
| --- | --------------------------------------------------------------------------- | ---- | ---- | ------------------------------------------------------------------- |
| 1   | `_PJR_DESCRIPTION_`置換箇所と`expandTemplate`の実装を確認する               | ARC  | done | `src/exec-register.ts`の`generateRegisterPlan`、`exec-shared.ts`    |
| 2   | Markdown特殊文字（`_`・`*`・`` ` ``・`\|`等）を安全に埋め込む方式を実装する | ARC  | done | code span 化を選定（prettier がバックスラッシュ抑制を除去するため） |
| 3   | 他のテンプレート変数への同種リスクを洗い出し、必要なら同様の対応を行う      | ARC  | done | title/description のみ自由記述。enum/日付/ID列は制約付きで対象外    |
| 4   | 自動テストを追加する                                                        | ARC  | done | 生成 plan を markdownlint にかけ MD049/MD050 が出ないことを検証     |

## 4. 対応結果

- `src/exec-shared.ts`に`escapeMarkdownInline`を追加。`_`/`*`を含む ASCII トークン（`register_date_timezone`・`_TODO_`等）をバッククォートの code span で包み、Markdown 強調記号としての誤解釈を防ぐ。既存の code span は温存し、日本語などマルチバイト文字はトークン境界となり巻き込まない。
- バックスラッシュエスケープ（`\_`）は不採用。生成パイプライン末尾の`formatMarkdownFile`（prettier）が「不要」と判定した抑制を除去して生のアンダースコアへ戻すため、code span 化のみが prettier を通しても安定する。
- `src/exec-register.ts`の`generateRegisterPlan`で、自由記述列由来の`_PJR_TITLE_`・`_PJR_DESCRIPTION_`に`escapeMarkdownInline`を適用。frontmatter の`name`は YAML 値（本文レンダリング対象外）のため`item.title`のまま据え置く。
- 自由記述はこの2列のみで、`_PJR_TYPE_`（enum）・`_PJR_PRIORITY_`（enum）・`_PJR_OWNER_`（role/nickname）・`_PJR_DUE_`（日付）・`_PJR_ID_`（`PJR-XXXX`）は制約付きの値のため対象外とした。
- テスト`tests/src/exec-register-plan-escape.test.ts`を追加。`escapeMarkdownInline`の単体検証に加え、PJR-0XXZ 実例相当（`register_date_timezone`・`_TODO_`・`_ASSUMPTION_`を含む説明）から`generateRegisterPlan`で生成した plan を markdownlint にかけ MD049/MD050 違反が出ないこと、エスケープ前の生の説明文は違反することを対照で確認する。

## 5. 関連ドキュメント

- [[prj-0001:pjr-0xxz-pjr-index|pjr-indexへ登録日列を追加しタイムゾーン設定を導入する]]
- [[prj-0001:pjr-0163-register-add-id-fetch|register addのID採番方式見直しと統合ブランチ予約のfetch同期]]
