---
specdojo:
  id: prj-0001:xer-t-kata-review-all-sysd-cross-cutting-policy-sample-110-20261125t152748z-d0c4880e
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-sysd-cross-cutting-policy-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-sysd-cross-cutting-policy-sample-110/T-KATA-REVIEW-ALL-sysd-cross-cutting-policy-sample-110-20261125T152748Z-d0c4880e/plan.md
  started_at: "2026-11-25T15:27:58.692Z"
  completed_at: "2026-11-25T15:34:07.181Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:sysd-cross-cutting-policy-sample
    - specdojo:sysd-cross-cutting-policy-sample
---

# Edit Result

## 1. 実施内容

- R1（目的の過不足）のレビューを行い、`docs/ja/specdojo/samples/sysd-cross-cutting-policy-sample.md` から要らない内容を 3 箇所削る・書き換える修正を入れた。足りない内容はなかった。
- 修正箇所は、1.1 の役割分担の表、4.2 の改訂・廃止管理の文、6.2 の公開・昇格の判断条件である。
- grade の F001（5 章見出しの略語）は R3 の観点（`vp-ux-language-consistency`）に当たるため、この段では直していない。
- executor の検証では prettier と markdownlint が通った。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も成功している。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R1-1 | R1 | 1.1. 本書を使う判断（旧: 利用・確認・承認責務） | 本書を確認・承認する役割の割り当てと PM の作業追跡が入っていた。Sample 記述標準の記述ガイドが禁じる、文書を確かめる・承認する役割の割り当てに当たる。 | 見出しを「本書を使う判断」に改め、各役割が本書の規則を基準にする判断の表にした。表の前に 1 文を足し、PM の行は削った。 | `vp-po-purpose-alignment`、`vp-qe-kata-conformance`（Sample 記述標準の記述ガイド、rulebook 本文要件の概要「誰がどの判断に使うか」） | - |
| R1-2 | R1 | 4.2. 報告と追跡 | 改訂・廃止の管理と PO への提示を述べた文が、rulebook の全体方針でドキュメントメタ情報標準に任せている運用を言い直している。 | 2 文を削り、障害窓口の文だけを残した。 | `vp-qe-kata-conformance`（rulebook の全体方針「共通の運用」） | - |
| R1-3 | R1 | 6.2. 公開・昇格の判断条件 | 役割分担と、承認・期限付き留保・差し戻し・`ready` 昇格・`draft` の維持という進み具合を書いていて、Sample 記述標準と rulebook の全体方針に反する。rulebook の本文要件は、実装の根拠にする前に済ませる適合確認を求めている。 | 実装の根拠にする前に確かめる 4 条件に書き換えた。条件は、規則の照合、K1〜K3 の証跡、論点と実 ID の結び付き、公開記録に秘密を含めないことである。役割と承認の記述は削った。 | `vp-po-purpose-alignment`、`vp-qe-kata-conformance`（template の 6.2 の骨組み） | - |
| R1-4 | R1 | 5. 関連ドキュメント導線（SYSD/SYSD-CF/NFR/OPD/OPR/DEC） | grade の F001。見出しの略語が参照表の文書名と対応していない。 | - （R3 の観点に当たるため、この段では直さない。R3 で template どおり見出しを「関連ドキュメント導線」にする案） | F001、`vp-ux-language-consistency`、rulebook の記述ガイドの関連導線 | - |
| R1-5 | R1 | 6.1. 判断待ちと後続への影響 | 表の「判断者・担当」列は template にない。template は「判断者と承認の進み具合は登録簿の個票で追う」としている。 | - （列の中身が会計・運用の業務判断か文書承認かを決めきれなかったため残した。選ばなかった案は、列を削って template の 4 列にすること。R2 で確かめる） | `vp-qe-kata-conformance`、Sample 記述標準の記述ガイド | 要判断 |
| R1-6 | R1 | 1. 概要（適用範囲・優先順位） | template は対象外の領域を表（対象外の領域・構成上の理由・代替手段）で示すが、sample は文章で書いている。対象外の内容は欠けていない。 | - （構成の差のため R2 に回す） | `vp-arc-document-structure`（R2） | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/sysd-cross-cutting-policy-sample.md`: 1.1 の見出しを「本書を使う判断」に改め、文書の確認・承認の役割分担を、各役割が本書の規則を基準にする判断の表にした。PM の作業追跡の行は削った。4.2 では改訂・廃止の管理に当たる 2 文を削り、障害窓口の文だけを残した。6.2 は役割・承認・昇格の進み具合の記述をやめ、実装の根拠にする前に確かめる 4 条件に書き換えた。4 条件は、規則の照合、K1〜K3 の証跡、論点と実 ID の結び付き、公開記録に秘密を含めないことである。

## 3. 申し送り

- R1-5 は要判断である。6.1 の表の「判断者・担当」列は template にない。残したのは、会計・運用の業務判断か文書承認かを決めきれなかったためである。選ばなかった案は、列を削って template の 4 列にすることである。R2 で確かめる。
- R1-4（F001）と R1-6 は、それぞれ R3 と R2 の観点に当たるため、この段では直していない。R1-4 は 5 章の見出しを template どおり「関連ドキュメント導線」にする案、R1-6 は対象外の領域を表にするかどうかの確認である。
- R1-1: R1 / 1.1. 本書を使う判断（旧: 利用・確認・承認責務） / 本書を確認・承認する役割の割り当てと PM の作業追跡が入っていて、Sample 記述標準の記述ガイドが禁じる、文書を確かめる・承認する役割の割り当てに当たる / 見出しを「本書を使う判断」に改め、各役割が本書の規則を基準にする判断の表にした。表の前に 1 文を足し、PM の行は削った / `vp-po-purpose-alignment`、`vp-qe-kata-conformance`（Sample 記述標準の記述ガイド、rulebook 本文要件の概要「誰がどの判断に使うか」） / -
- R1-2: R1 / 4.2. 報告と追跡 / 「ARC は Rule ID を維持して改訂・廃止を管理し…PM が…人間の PO へ提示する」が、rulebook の全体方針でドキュメントメタ情報標準に任せる改訂・廃止の運用を言い直している / 2 文を削り、障害窓口の文だけを残した / `vp-qe-kata-conformance`（rulebook の全体方針「共通の運用」） / -
- R1-3: R1 / 6.2. 公開・昇格の判断条件 / 役割分担と、承認・期限付き留保・差し戻し・`ready` 昇格・`draft` の維持という進み具合を書いていて、Sample 記述標準と rulebook の全体方針に反する。rulebook の本文要件は「実装の根拠にする前に済ませる適合確認」を求めている / 実装の根拠にする前に確かめる 4 条件（規則の照合、K1〜K3 の証跡、論点と実 ID の結び付き、公開記録に秘密を含めないこと）に書き換え、役割と承認の記述を削った / `vp-po-purpose-alignment`、`vp-qe-kata-conformance`（template の 6.2 の骨組み） / -
- R1-4: R1 / 5. 関連ドキュメント導線（SYSD/SYSD-CF/NFR/OPD/OPR/DEC） / grade の F001。見出しの略語が参照表の文書名と対応していない / - （R3 の観点 `vp-ux-language-consistency` に当たるため、この段では直さない。R3 で template どおり見出しを「関連ドキュメント導線」にする案） / F001、`vp-ux-language-consistency`、rulebook の記述ガイドの関連導線 / -
- R1-5: R1 / 6.1. 判断待ちと後続への影響 / 表の「判断者・担当」列は template にない。template は「判断者と承認の進み具合は登録簿の個票で追う」としている / - （列の中身が会計・運用の業務判断なのか文書承認なのか決めきれなかったため残した。選ばなかった案は、列を削って template の 4 列にすること。R2 で確かめる） / `vp-qe-kata-conformance`、Sample 記述標準の記述ガイド / 要判断
- R1-6: R1 / 1. 概要（適用範囲・優先順位） / template は対象外の領域を表（対象外の領域・構成上の理由・代替手段）で示すが、sample は文章で書いている。対象外の内容は欠けていない / - （構成の差のため R2 に回す） / `vp-arc-document-structure`（R2） / -

## 4. 進め方と実践の型の適用

sample-maintenance の進め方で見直した。根拠にしたのは、Sample 記述標準の記述ガイド、rulebook の全体方針と本文要件、template の 6.2 の骨組みである。文書の確認・承認の役割分担、改訂・廃止の運用、承認の進み具合は、標準と rulebook が別の場所に任せている内容なので削った。F001 は R3 の観点のため未解消で、次のアクションは R3 で見出しを直すことである。rulebook など sample 以外は変更していない。
