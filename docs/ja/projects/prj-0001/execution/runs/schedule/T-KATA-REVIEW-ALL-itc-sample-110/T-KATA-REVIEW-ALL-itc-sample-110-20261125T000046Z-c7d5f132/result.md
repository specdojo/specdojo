---
specdojo:
  id: prj-0001:xer-t-kata-review-all-itc-sample-110-20261125t000046z-c7d5f132
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-itc-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-itc-sample-110/T-KATA-REVIEW-ALL-itc-sample-110-20261125T000046Z-c7d5f132/plan.md
  started_at: "2026-11-25T00:00:57.690Z"
  completed_at: "2026-11-25T00:14:33.127Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:itc-sample
    - specdojo:itc-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R1（目的の過不足）を `docs/ja/specdojo/samples/itc-sample.md` に対して実施した。
- R1 に当たる F001 だけを直した。F002 は R5、F003 は R3 の担当なので、この段では直していない。
- 変更は 1 ファイルの 1 行で、追加 1 行・削除 1 行。
- executor の `npx prettier --check` は通過した。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も通過した。`lint:ts`、`lint:md`、`lint:fm`、`test:integration`、`typecheck`、`test:unit` は変更種別により対象外になった。
- 指摘は次の表のとおり。 | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | R1-1 | R1 | 6. テスト観点とケース（導入段落） | `itc-index-sample` は、該当しない観点の型に理由を 1 行残すよう求めている。本書は「補完後の確定への遷移は扱わない」とだけ書き、理由も代わりのケースもなかった（F001）。 | 「補完後の確定への遷移は独立した観点にしない（理由: 補完後の購入は通常の会計確定と同じ入力になる、代替: `it-sales-checkout-persistence-integrity-010`）」を書き足した。 | `vp-qe-kata-conformance`、grade F001 | 要判断 | | R1-2 | R1 | 6. テスト観点とケース（導入段落） | `itc-index-sample` は「依存障害時の挙動」を「DB 停止時に未保存を成功表示しない、応答欠落時の照合待ちの識別」としている。本書は DB 停止・接続断を不採用とし、更新拒否で代えている。応答欠落時の照合待ちの識別にも触れていない（F002）。 | 本書は変更していない。`itc-index-sample` の該当セルを「DB の更新拒否時に未保存を成功表示しない」に改める案を出す。照合待ちの識別は、本書の対象外にするか外部結合テストへ回すかを決める。 | `vp-qe-kata-conformance`（kata 相互。R5 の担当） | 要判断 | | R1-3 | R1 | 6. テスト観点とケース（導入段落） | 4 つの観点の型の扱いと、不採用の理由・代わりのケースが 1 段落に詰まっていて読みにくい（F003）。 | 本書は変更していない。R3 で「観点の型／本書での扱い／理由・代わり」の表か箇条書きに分ける案を検討する。 | `vp-ux-readability`（R3 の担当） | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/itc-sample.md`: 「6. テスト観点とケース」の導入段落に、状態遷移の型のうち扱わない部分の理由と代わりのケースを足した。理由は、補完後の購入は通常の会計確定と同じ入力になること。代わりのケースは `it-sales-checkout-persistence-integrity-010`。`itc-index-sample` が求める「該当しない型には理由を 1 行残す」に合わせた変更で、変更は 1 行。

## 3. 申し送り

- R1-1 は F001 の `vp-qe-omissions-consistency` が R2 の担当でもある。ただし executor は、`itc-index-sample` と rulebook が求める内容の欠落と判断し、R1 で直した。R2 に任せる案は選ばなかった。
- R1-2 で本書に DB 停止を扱わせる案は選んでいない。本書が書く再現性の理由（検証用コンテナ DB の停止は CI の他ケースを巻き込む）と食い違うため。
- R1-1: R1 / 6. テスト観点とケース（導入段落） / itc-index-sample の「観点の立て方（共通）」は該当しない型に理由を1行残すよう求め、`itc-sales-checkout` の状態遷移を「未確定から確定への遷移」としているが、本書は「補完後の確定への遷移は扱わない」とだけ書き、理由も代わりのケースもなかった（grade F001） / 「補完後の確定への遷移は独立した観点にしない（理由: 補完後の購入は通常の会計確定と同じ入力になる、代替: `it-sales-checkout-persistence-integrity-010`）」を書き足した / `vp-qe-kata-conformance`（種別の責務: rulebook の「観点」で itc-index の「観点の立て方（共通）」に従う）、grade F001 / 要判断（F001 の viewpoint は `vp-qe-omissions-consistency` で R2 の担当でもあるが、itc-index と rulebook が求める内容の欠落なので R1 で直した。R2 に任せる案は選ばなかった）
- R1-2: R1 / 6. テスト観点とケース（導入段落） / itc-index-sample の観点の型の表では `itc-sales-checkout` の「依存障害時の挙動」を「DB 停止時に未保存を成功表示しない、応答欠落時の照合待ちの識別」としている。本書は DB 停止・接続断を不採用とし、更新拒否で代えている。応答欠落時の照合待ちの識別にも触れていない（grade F002） / - / `vp-qe-kata-conformance`（kata 相互）で R5 の担当のため、本書は直さない。相手側を直す案: itc-index-sample の該当セルを「DB の更新拒否時に未保存を成功表示しない」に改める。照合待ちの識別は、本書の対象外か外部結合テスト（ET）へ回すかを決めてそろえる / 要判断（本書で DB 停止を扱う案は、本書が書く再現性の理由と食い違うため選ばなかった）
- R1-3: R1 / 6. テスト観点とケース（導入段落） / 4 つの観点の型の扱いと不採用の理由・代わりのケースが 1 段落に詰まっていて読みにくい（grade F003） / - / `vp-ux-readability` で R3 の担当のため、この段では直さない。R3 で「観点の型／本書での扱い／理由・代わり」の表か箇条書きに分ける案を検討する / -

## 4. 進め方と実践の型の適用

根拠にした資料は、plan に展開された grade の finding F001〜F003 と、evidence に残る executor の handoff。執筆標準、rulebook、`itc-index-sample` の本文は、reporter としては読んでいない。根拠は executor の handoff に記された内容に限る。R1（目的の過不足）に当たる F001 だけを直し、F002（kata 相互の整合、R5）と F003（読みやすさ、R3）は担当の段に回した。rulebook など sample 以外は変更していない。rulebook と sample が矛盾した箇所はなかった。F001 は修正後に問題が解消したと判断した。F002 と F003 は未解消で、次のアクションは handoff の R1-2 と R1-3 に書いたとおり。
