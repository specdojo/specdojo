---
specdojo:
  id: prj-0001:xer-t-kata-review-all-stc-sample-120-20261124t191254z-08cba5a9
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-stc-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-stc-sample-120/T-KATA-REVIEW-ALL-stc-sample-120-20261124T191254Z-08cba5a9/plan.md
  started_at: "2026-11-24T19:13:03.424Z"
  completed_at: "2026-11-24T21:33:29.998Z"
  agent: sol-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:stc-sample
    - specdojo:stc-sample
---

# Edit Result

## 1. 実施内容

- R2（構成）として `docs/ja/specdojo/samples/stc-sample.md` を見直した。章の順・粒度、および表と本文の配置は rulebook の本文要件に沿っており、章の移動・分割・統合は不要だった。
- plan に展開された finding のうち、この段の観点に当たる F003（対象外の重複）と F002（観点「販売確定成立」の意図が2つの合否命題を持つ）を修正した。
- F001（`vp-arc-conciseness`）と F005（`vp-ux-language-consistency`）は R3、F004（`vp-qe-kata-conformance`）は R5 で扱うため、この段では直していない。
- 差分は 2 行追加・2 行削除。executor の `prettier --check` と `markdownlint` は通過した。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も通過した。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/stc-sample.md`: 対象外の行「印刷コマンドの全終了コードと再試行の分類」を、stc-index の共通行を参照する例外行に置き換えた。例外行は、この term で再現するのは用紙切れと印字結果不明（30秒タイムアウト）の2種だけで、保存失敗は `stc-record-recovery` で扱う、という内容にした（F003）。観点「販売確定成立」の意図は、「販売記録と在庫減算は会計を確定した取引にだけ、同じ取引番号で1回分残る」という1つの合否命題に改めた（F002）。

## 3. 申し送り

- R2 の指摘は次の表にまとめた。 | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | R2-1 | R2 | 3. 対象外 | 「印刷コマンドの全終了コードと再試行の分類」が stc-index の共通の対象外と除外内容・代替で重なり、rulebook の「共通の対象外と重複させず対象固有の除外だけを示す」に反する（F003） | 対象外の行を消し、共通行を参照する例外行に置き換えた | `vp-qe-omissions-consistency`、stc-rulebook の記述ガイド「対象外」、stc-index-sample の「対象外・除外理由（共通）」 | - | | R2-2 | R2 | 6.1.1. 意図（観点: 販売確定成立） | 意図が「確定で記録が残る」と「確定前の取消で何も残らない」の2つの合否命題を持ち、stc-index の「各観点は1つの合否命題」と食い違う（F002） | 意図を1つの命題に改めた。取消ケース `st-cash-sale-flow-success-030` を別観点へ移す案は、`case_id` の変更を rulebook の禁止事項が禁じているので選ばなかった。 | `vp-qe-omissions-consistency`、stc-index-sample の「採用基準（共通）」 | 要判断 | | R2-3 | R2 | 文書全体の構成 | 章の順・名前（1〜6）と、観点・意図・条件ケース表の並びは rulebook の本文要件に合っている。章の移動・分割・統合は不要。 | 変更なし | `vp-arc-document-structure`、stc-rulebook の本文要件 | - |
- R2-2 は sample が draft のため、取消ケースを別観点（新しい `perspective_key`）へ移すかどうかは人が判断する。
- rulebook の `template` が `undecided` のため、template との照合はできていない。
- R2-1: R2 / 3. 対象外 / 「印刷コマンドの全終了コードと再試行の分類」が stc-index の共通の対象外「印刷コマンド・保管サービスの全障害パターン」と除外内容・代替で重なり、rulebook の「共通の対象外と重複させず対象固有の除外だけを示す」に反する（F003） / 対象外の行を消し、共通行を参照する例外行「用紙切れと印字結果不明（30秒タイムアウト）の2種だけをこの term で再現し、保存失敗は `stc-record-recovery` で扱う」に置き換えた / `vp-qe-omissions-consistency`、stc-rulebook の記述ガイド「対象外」、stc-index-sample の「対象外・除外理由（共通）」 / -
- R2-2: R2 / 6.1.1. 意図（観点: 販売確定成立） / 意図が「確定で記録が残る」と「確定前の取消で何も残らない」の2つの合否命題を持ち、stc-index の「各観点は1つの合否命題」と食い違う（F002） / 意図を「販売記録と在庫減算は会計を確定した取引にだけ、同じ取引番号で1回分残る」という1つの命題に改めた / `vp-qe-omissions-consistency`、stc-index-sample の「採用基準（共通）」。取消ケース `st-cash-sale-flow-success-030` を別の観点（新しい `perspective_key`）へ移す案は、`case_id` の変更を rulebook の禁止事項が禁じているので選ばなかった。sample は draft なので、移すかどうかは人が判断する / 要判断
- R2-3: R2 / 文書全体の構成 / 章の順・名前（1〜6）と、`### 6.n. 観点:`・`#### 6.n.1. 意図`・`#### 6.n.2. 条件・ケース表` の並びは rulebook の本文要件に合っていて、章の移動・分割・統合は要らない。rulebook の `template` が `undecided` なので、template との照合はできていない / - / `vp-arc-document-structure`、stc-rulebook の本文要件 / -
- 申し送り: F001（`vp-arc-conciseness`、「境界/環境/依存」の「実施」行と「外部依存」行が stc-index の共通方針の再掲）と F005（`vp-ux-language-consistency`、観点名「未確定停止」が意図と食い違う）は R3、F004（`vp-qe-kata-conformance`、stc-index-sample の記入例とトレースの値が食い違う）は R5 で扱う。この段では直していない。

## 4. 進め方と実践の型の適用

根拠にしたのは、stc-rulebook の本文要件と対象外の記述ガイド、stc-index-sample の「対象外・除外理由（共通）」と「採用基準（共通）」、`vp-qe-omissions-consistency`、`vp-arc-document-structure` である。維持したのは、章構成（1〜6章と観点・意図・条件ケース表の並び）と `case_id` で、いずれも rulebook に沿っている。改訂したのは、共通の対象外と重複していた除外記述と、複数の命題を持っていた観点の意図である。矛盾が出た箇所は rulebook を正とし、`case_id` の変更を禁じる規定に従って取消ケースの移動は見送った。未解消の finding は次のとおり。F001 と F005 は R3 へ、F004 は R5 へ回す。F002 は意図の修正で命題を1つに揃えたが、取消ケースを別観点へ分ける案は人の判断を待つ。
