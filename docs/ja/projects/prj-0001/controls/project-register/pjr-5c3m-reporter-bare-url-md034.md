---
specdojo:
  id: prj-0001:pjr-5c3m-reporter-bare-url-md034
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  registered_at: "2026-11-25T09:25:29Z"
  derived_from:
    - PJR-0BGE
---

# PJR-5C3M reporter の出力が bare URL・空白で始まるコードの書式で書式のやり直しを使い切って止まる

## 1. 課題内容

全件レビュー（PJR-0BGE）で、reporter の出力が書式のやり直し 3 回でも通らずに止まる項目が出ている。

- T-KATA-REVIEW-ALL-tsd-sample-140（2026-11-25 07:57）: sonnet-reporter が `確かめの表` の行へ `https://docs.fly.io/...` などの URL をそのまま書き、MD034（no-bare-urls）で 3 回とも落ちた。
- T-KATA-REVIEW-ALL-trc-requirements-to-tests-sample-130（2026-11-25 00:54）: executor が書いたコンマと空白だけのコードの書式（空白で始まる・終わるもの）を reporter が引き継ぎ、MD038（no-space-in-code）で 3 回とも落ちた。
- 履歴の Markdown の規則（`.github/instructions/markdown.instructions.md` の履歴蓄積ファイルのリンク記法）は外部 URL を「bare URL または autolink」で書くとしているが、markdownlint の MD034 は bare URL を違反とする。reporter への書式のやり直しの指示は「bare URLs を書かない」と言うだけで、代わりの書き方を示していない。

## 2. 入力

- 利用者の判断（2026-11-25）: 推奨どおり起票し、全件レビューの区切りの後に直す

## 3. 影響範囲

- review の段の reporter が、出典の URL を書く表で止まる。止まると人が reporter を代えて再開するまで、その項目が進まない。
- 外部の正本を確かめる段（R4 など）を持つ型の review すべてにかかわる。

## 4. 対応方針

- 規則と検査を一致させる。外部 URL は autolink（`<https://...>`）で書くと規則に明記するか、MD034 の扱いを変えるかを executor に決めさせ、理由を個票の対応結果に書かせる。
- reporter の書式のやり直しの指示に、bare URL と空白で始まるコードの書式の代わりの書き方を示す。
- 可能なら、reporter の出力を Markdown にするときに URL を autolink にそろえる。
- 止まった 2 件は、reporter を codex-reporter に代えて再開している。直した後に review の段を 1 件流して確かめてから close する。

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
