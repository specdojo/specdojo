---
specdojo:
  id: prj-0001:xer-t-kata-review-all-imp-operations-sample-110-20261125t111755z-0c3ebc66
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-imp-operations-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-imp-operations-sample-110/T-KATA-REVIEW-ALL-imp-operations-sample-110-20261125T111755Z-0c3ebc66/plan.md
  started_at: "2026-11-25T11:18:06.888Z"
  completed_at: "2026-11-25T11:33:41.358Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:imp-operations-sample
    - specdojo:imp-operations-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R1（目的の過不足）を実施した。rulebook の禁止事項に当たる運用手順の細部 2 文を、sample の「対応方針」の再評価条件から削った。
- grade F002（「完了条件」列が rulebook の必須列にない）は列を残し、rulebook を直す案を「要判断」として申し送った。
- grade F001（成功条件 2 の上限時間が未決）は観点 `vp-qe-verifiability` が R4 の担当のため、R1 では直さず R4 へ回した。
- executor の検査（prettier、markdownlint）と runner の検査（`lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema`）は通った。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/imp-operations-sample.md`: 「5. 対応方針」の日次締め運用（代替）の再評価条件から 2 文を削った。1 文は、併用中に差分手順書で判断できない点を記録し、翌日の開店前に店主代表が確かめる手順である。もう 1 文は、店主代表が判断に迷う点を店舗運営アドバイザーへ相談する手順である。どちらも rulebook の禁止事項「実運用手順の詳細を書かない」に当たる。再評価条件と期限だけを残した（1 行追加、1 行削除）。

## 3. 申し送り

- 指摘一覧（No・段・箇所・指摘・直した案・根拠・印） | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | R1-1 | R1 | 5. 対応方針（見送り・代替の再評価条件） | 日次締め運用（代替）の再評価条件に、差分手順書で判断できない点の記録と確認の手順、店舗運営アドバイザーへの相談先が書かれていた。これは再評価条件と期限ではなく、実際の運用手順の細部である。 | 2 文を削り、再評価条件と期限だけを残した。 | `vp-arc-single-responsibility`、`vp-qe-kata-conformance`（rulebook の禁止事項と 6.5） | - | | R1-2 | R1 | 5. 対応方針（対応方針の表） | 「完了条件」列は rulebook の必須列にない。sample が rulebook より先に列を足している（grade F002）。 | sample は列を残した。rulebook 側の案は、必須列の表で対応方針の行に「完了条件」を足し、6.5 に「対応項目ごとに完了を判定する条件を書く」を足すこと。選ばなかった案は、sample の列と表の前の文を消して rulebook に揃えること。 | `vp-qe-kata-conformance` | 要判断 | | R1-3 | R1 | 2. 変更要求の概要（成功条件の表） | grade F001（成功条件 2 の上限時間が未決で判定できない）は判定可能性の指摘であり、R4 が受け持つ。R1 では直していない。 | R4 への申し送り: 3 章の境界値の暫定基準「その日の閉店までに把握する」を、成功条件 2 の判定方法の欄にも併記する案がある。 | kata-guide で `vp-qe-verifiability` は R4 に割り当てられている。 | - |
- R1-1: R1 / 5. 対応方針（見送り・代替の再評価条件） / 日次締め運用（代替）の再評価条件に、差分手順書で判断できない点の記録と確認の手順、店舗運営アドバイザーへの相談先が書かれていた。これは再評価条件と期限ではなく、実際の運用手順の細部である / 「併用中に差分手順書で判断できない点は…翌日の開店前に店主代表が確かめる。」と「店主代表が判断に迷う点は店舗運営アドバイザーに相談する。」の 2 文を削り、再評価条件と期限だけを残した / `vp-arc-single-responsibility`、`vp-qe-kata-conformance`（rulebook の禁止事項「実運用手順の詳細を書かない。委譲先の文書へ送る」、6.5「見送り・代替は、再評価条件と期限を必ず記載する」） / -
- R1-2: R1 / 5. 対応方針（対応方針の表） / 「完了条件」列は rulebook の必須列（影響度、対応項目、期限、担当、前提条件）になく、sample が rulebook より先に列を足している（grade F002） / - / `vp-qe-kata-conformance`。列は残した。運用テストと受入の判定（`done_criteria` の QE「運用テスト・受入への影響が確認できること」）に役立つためである。相手側の直す案: `docs/ja/specdojo/rulebooks/imp-operations-rulebook.md` の「本文要件」の必須列の表で、対応方針の行に「完了条件」を足す。あわせて 6.5 に「対応項目ごとに完了を判定する条件を書く」を足す。選ばなかった案は、sample から「完了条件」列と表の前の文の「完了を判定する条件」を消して rulebook に揃える案。どちらを採るかは人が決める / 要判断
- R1-3: R1 / 2. 変更要求の概要（成功条件の表） / grade F001（成功条件 2 の上限時間が決まっておらず判定できない）は判定ができるかどうかの指摘である。観点 `vp-qe-verifiability` は R4 が受け持つため、R1 では直さない / - / kata-guide の「kata の観点の組」で `vp-qe-verifiability` は R4 に割り当てられている。R4 への申し送り: 3 章の境界値に「決まるまでは『その日の閉店までに把握する』を下限として判定する」とある。これを成功条件 2 の判定方法の欄にも暫定の基準として書く案がある / -

## 4. 進め方と実践の型の適用

根拠は、`docs/ja/specdojo/samples/imp-operations-sample.md` と、frontmatter から辿れる `imp-operations-rulebook`（禁止事項と 6.5）である。plan に展開された grade の finding も根拠にした。判断の内容は次のとおり。(1) 再評価条件にある運用手順の細部 2 文は、rulebook の禁止事項に当たるため削った。(2) F002 の「完了条件」列は、運用テスト・受入の判定に役立つため残した。矛盾時は rulebook を正とする方針に従い、rulebook を直す案と選ばなかった案を「要判断」として人の判断に委ねた。rulebook は変更していない。(3) F001 は観点が R4 の担当のため見送り、R4 への申し送りを残した。再評価時に grade result サイドカーは更新される前提で、本タスクでは編集していない。
