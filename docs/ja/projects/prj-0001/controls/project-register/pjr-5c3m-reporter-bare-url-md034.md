---
specdojo:
  id: prj-0001:pjr-5c3m-reporter-bare-url-md034
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
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

- 原因: reporter の出力の修復（`repairReporterOutput`）は reporter の JSON だけにかかり、result の申し送りへ合流する executor の `handoff` や検証の理由は修復を通らずに描かれていた。MD038 の 2 件目は、executor の `handoff` にあった、コンマと空白だけのコードの書式が直されずに残ったもの。URL は、描画の途中で山括弧を `&lt;` `&gt;` に変えていたため、reporter が autolink で書いても bare URL に戻っていた。
- 規則と検査の一致: MD034 は変えず、規則の側を autolink だけに改めた。履歴の文書は markdownlint を commit の前に通すため、bare URL を許すと検査と食い違い続ける。autolink は URL をそのまま読めるので、Markdown リンクを避ける目的（リネームへの追従を不要にする）も保てる。`.github/instructions/markdown.instructions.md` の履歴蓄積ファイルのリンク記法を「autolink で書く。bare URL は MD034 に当たるため書かない」に直した。
- 描画: result の自由記述を描く共通処理（`reporterFreeText`）で、素の URL を autolink にそろえ、コードの書式の前後の空白を除くようにした。reporter と executor のどちらが書いた文でも、描いた result が MD034・MD038 に当たらない。autolink の山括弧は残し、URL の中の `_` をコードの書式で囲まないようにした。URL の囲みは登録簿の表セルの処理と同じものを `src/shared/text.ts` へ移して共有した。
- 指示: reporter のプロンプトと書式のやり直しの指示に、URL は `<https://example.com/page>` の形で書くこと、コードの書式を空白で始めたり終えたりせず、区切りのコンマと空白は言葉で書くことを足した。
- 確認: `tests/src/shared/text.test.ts` と `tests/src/exec/result-markdownlint.test.ts` に、URL の autolink 化・コードの書式の空白の除去・executor の `handoff` に両方を含む result が lint を通ることの検査を足した。描画で直るようになったため、bare URL と空白入りのコードの書式を違反として期待していた検査を、通ることの検査へ改めた。
- 未実施: 直した後に review の段を 1 件流して確かめる作業は、agent の起動を伴うため executor では行っていない。統合の後に人かオーケストレーターが review の段を 1 件流し、止まらないことを確かめてから close する。

## 6. 関連ドキュメント

- 由来: PJR-0BGE（全件レビュー）
- 規則: `.github/instructions/markdown.instructions.md`（履歴蓄積ファイルのリンク記法）
- 実装: `src/exec/results.ts`、`src/shared/text.ts`、`src/exec/result-markdownlint.ts`、`src/exec/reporter.ts`
