---
specdojo:
  id: prj-0001:xer-t-kata-review-all-nfr-integrity-sample-120-20261125t214243z-4ca48936
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-nfr-integrity-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-nfr-integrity-sample-120/T-KATA-REVIEW-ALL-nfr-integrity-sample-120-20261125T214243Z-4ca48936/plan.md
  started_at: "2026-11-25T21:42:53.081Z"
  completed_at: "2026-11-25T21:50:27.329Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:nfr-integrity-sample
    - specdojo:nfr-integrity-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R2（構成）を実施した。sample の 5 章は rulebook の本文構成と順序・見出しが一致し、前提から結論の順に読めるため、章の移動・分割・統合は行わなかった。
- F001 に対応し、保持期間の根拠について「関連ドキュメント導線」の `dec-*` へ記録する導線と、規程文書の作成後に `based_on` へ設定する旨を `_ASSUMPTION_` に追記した。
- F002 は rulebook 側の修正が必要なため sample では直さず、案を指摘として残した。F003 は kata-guide が kata の段のレビューから外している観点のため R2 では扱わなかった。
- executor の Prettier 検査と、runner の `lint:md:changed`・`lint:fm:changed`・`lint:mermaid`・`lint:d2`・`test:docs`・`validate:schema` は成功した。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R2-1 | R2 | 2. 適用範囲・前提条件の `_ASSUMPTION_`（保持期間 7 年の根拠） | `based_on` が空で、根拠の判断を記録する先への導線が本文になく、rulebook「適用範囲・前提条件」の保持期間とその根拠を満たし切っていなかった（F001）。 | `based_on` を空にしている理由に続けて、根拠の判断を「関連ドキュメント導線」の `dec-*` に記録し、規程文書を作ったら `based_on` に設定すると書き足した。 | vp-qe-omissions-consistency。rulebook「記述ガイド」の「適用範囲・前提条件」と、禁止事項の「監査証跡の保持期間と根拠を省略する」。 | 要判断（存在しない規程文書の ID を `based_on` に入れる案は、参照解決が壊れるため採らなかった。根拠となる規程の sample を作って `based_on` に設定するかは R5 または人が決める） |
| R2-2 | R2 | rulebook「全体方針」の `_UNDECIDED_`（`docs/ja/specdojo/rulebooks/nfr-integrity-rulebook.md`） | rulebook は「sample は本文構成の 5 章に揃っていない」と書いているが、現在の sample は 5 章に揃っており、記述が古い（F002）。 | rulebook の `_UNDECIDED_` から「sample が 5 章に揃っていない」という前提を削る。「同じ構成を NFR 分冊で共通の template にできるか、recipe が要るかの判断を、本書を `ready` にする前提条件とする」だけを残す。rulebook は sample 以外のため、この task では変更していない。 | vp-qe-kata-conformance。template は現在ないため、構成の照合は rulebook の本文構成だけで行った。 | - |
| R2-3 | R2 | 3. 完全性要件一覧の `nfr-int-006` と 4. 測定・検証方法の冒頭 | 用語「整合性チェック」が `nfr-int-006` で先に使われ、定義は次の章の冒頭にある。 | -（rulebook の記述ガイドが、この用語を「測定・検証方法」の中で統一するよう求めているため、定義は動かしていない） | vp-arc-document-structure | 要判断（定義を「適用範囲・前提条件」へ移せば前から順に読めるが、rulebook が用語を置く章と食い違うため採らなかった） |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/nfr-integrity-sample.md`: 「適用範囲・前提条件」の保持期間の `_ASSUMPTION_` に、根拠の判断を「関連ドキュメント導線」の `dec-*` に記録することと、規程文書を作成したら `based_on` に設定することを 1 行分書き足した（1 行の差し替え）。

## 3. 申し送り

- R2-3 の用語「整合性チェック」の定義位置は、rulebook の記述ガイドが「測定・検証方法」での統一を求めているため動かしていない。変えるなら rulebook の改訂とセットで判断が必要である。
- R2-1: R2 / 2. 適用範囲・前提条件（`_ASSUMPTION_`） / 保持期間 7 年の根拠が `based_on` で空になっている。根拠の判断を記録する先への導線が本文になく、rulebook「適用範囲・前提条件」の『保持期間とその根拠』を満たし切っていなかった（F001） / `based_on` を空にしている理由に続けて、根拠の判断を「関連ドキュメント導線」の `dec-*` に記録し、規程文書を作ったら `based_on` に設定すると書き足した / vp-qe-omissions-consistency、rulebook「記述ガイド」の「適用範囲・前提条件」と禁止事項『監査証跡の保持期間と根拠を省略する』 / 要判断（rulebook の良い例は `based_on` に帳簿保存の規程を置く形である。存在しない規程文書の ID を `based_on` に入れる案は、参照解決が壊れるため採らなかった。根拠となる規程の sample を作って `based_on` に設定するかどうかは R5 または人が決める）
- R2-2: R2 / rulebook「全体方針」の `_UNDECIDED_` / rulebook は『sample は「本文構成（標準テンプレ）」の 5 章に揃っていない』と書いているが、現在の sample は 5 章に揃っており、記述が古くなっている（F002） / - / vp-qe-kata-conformance。直す相手は `docs/ja/specdojo/rulebooks/nfr-integrity-rulebook.md` で、案は次のとおり。`_UNDECIDED_` から『sample が 5 章に揃っていない』の前提を削り、『同じ構成を NFR 分冊で共通の template にできるか、recipe が要るかの判断を、本書を `ready` にする前提条件とする』だけを残す。template は現在ないため、構成の照合は rulebook の本文構成だけで行った / -
- R2-3: R2 / 3. 完全性要件一覧・4. 測定・検証方法 / 用語『整合性チェック』は「完全性要件一覧」の `nfr-int-006` で先に使われ、定義は次の章「測定・検証方法」の冒頭にある / -（rulebook の「記述ガイド」が、この用語を「測定・検証方法」の中で統一するよう求めているため、定義は動かさなかった） / vp-arc-document-structure / 要判断（定義を「適用範囲・前提条件」へ移せば前から順に読めるが、rulebook が用語を置く章と食い違うため採らなかった）
- F003（vp-ops-release-readiness: ready 化の条件の明示）は、kata-guide の「kata の観点の組」がこの観点を kata の段のレビューから外しているため、R2 では扱わなかった。kata の ready 化は登録簿で追う。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/ 配下の sample だけで、plan・result・個票を変更していないため）

## 4. 進め方と実践の型の適用

参照の向きを成果物から sample に切り替え、sample を rulebook の本文構成と照合した。構成は一致していたため、章の再編は行わなかった。F001 は rulebook の「適用範囲・前提条件」と禁止事項に沿って最小限の追記で対応した。存在しない規程文書の ID を `based_on` に入れる案は、参照解決が壊れるため採らなかった。F002 は sample 以外の変更になるため rulebook 側の修正案を指摘に残し、F003 は R2 の対象外とした。
