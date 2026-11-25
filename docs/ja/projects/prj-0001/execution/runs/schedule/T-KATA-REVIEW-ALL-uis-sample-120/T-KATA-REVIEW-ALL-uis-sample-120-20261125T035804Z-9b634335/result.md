---
specdojo:
  id: prj-0001:xer-t-kata-review-all-uis-sample-120-20261125t035804z-9b634335
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-uis-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-uis-sample-120/T-KATA-REVIEW-ALL-uis-sample-120-20261125T035804Z-9b634335/plan.md
  started_at: "2026-11-25T03:58:13.873Z"
  completed_at: "2026-11-25T04:11:03.861Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:uis-sample
    - specdojo:uis-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R2（構成）を実施した。章構成は rulebook の本文要件と同じ順で、章の移動・分割・統合は不要と確認した。template は rulebook で not-needed と宣言されており、照合対象はない。
- 直したのは 1 か所。会計確定時の違反では販売記録も在庫引落も確定しないという状態の扱いの文を、バリデーションの章からエラー表示と利用者の次の手の章の表の前へ移した。
- grade の F001（現在庫数の更新契機が曖昧）は、R1 が直した版で解消済みと確認した。この指摘は vp-qe-verifiability の観点で、R4 が扱う。
- 検証は、executor の prettier と markdownlint、runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が通った。他の検査は変更種別により `not_applicable` だった。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/uis-sample.md`: 「会計確定時の違反では販売記録も在庫引落も確定しない」という文を、バリデーションの章から削り、エラー表示と利用者の次の手の章の表の前へ「会計確定時に検出したエラーでは、販売記録も在庫引落も確定しない。」として移した。確定時の各エラー行すべてに効く位置になった。

## 3. 申し送り

- R2 の指摘は次の表のとおり。 | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | R2-1 | R2 | 6. バリデーション → 7. エラー表示と利用者の次の手 | 「会計確定時の違反では販売記録も在庫引落も確定しない」は状態の扱いの文だが、バリデーションの章の表の後に置かれていた。rulebook の記述ガイド（バリデーション）は、保持される状態をエラーの章に置くとしている。 | バリデーションの章から削り、エラー表示と利用者の次の手の章の表の前へ移した。在庫不足（既存明細）・販売価格変更・預かり金額不足の行は確定しないことを書いておらず、表の前の 1 文が確定時の行すべてに効く。 | vp-arc-document-structure | - | | R2-2 | R2 | 3.1. 入力・明細・集計（現在庫数の行） | grade の F001（更新契機が「在庫の判定時」と曖昧）は、R1 が直した版ですでに「商品追加・数量変更・会計確定の在庫確認の成功時に最新値へ更新。通信失敗時は前の値を保持」となっており、解消済み。 | 変更なし（R2 では解消の確認のみ） | vp-qe-verifiability（R4 の観点） | - | | R2-3 | R2 | 全体の章構成 | 8 章（概要、対象ユーザー/利用目的、表示項目、操作、遷移、バリデーション、エラー表示と利用者の次の手、メモ / 将来課題）は rulebook の本文要件と同じ順で、章の移動・分割・統合は要らない。template は rulebook で not-needed と宣言されていて照合する相手がない。操作の章の「状態と操作可否」を「操作ごとの前提と結果」より先に置く順は、前提から結論の順として維持した。 | 変更なし | vp-arc-document-structure、vp-qe-omissions-consistency | - |
- R2-1: R2 / 6. バリデーション → 7. エラー表示と利用者の次の手 / 「会計確定時の違反では販売記録も在庫引落も確定しない」は状態の扱いの文なのに、バリデーションの章の表の後に置かれていた。rulebook の記述ガイド（バリデーション）は、保持される状態をエラーの章に置くとしている / バリデーションの章から削り、エラー表示と利用者の次の手の章の表の前に「会計確定時に検出したエラーでは、販売記録も在庫引落も確定しない。」として移した。在庫不足（既存明細）・販売価格変更・預かり金額不足の行は確定しないことを書いておらず、表の前の 1 文が確定時の行すべてに効く / vp-arc-document-structure / -
- R2-2: R2 / 3.1. 入力・明細・集計（現在庫数の行） / grade の F001（更新契機が「在庫の判定時」と曖昧）は、R1 が直した版ですでに「商品追加・数量変更・会計確定の在庫確認の成功時に最新値へ更新。通信失敗時は前の値を保持」になっており、解消済み / - / vp-qe-verifiability（R4 の観点であり R2 では解消の確かめだけ行った） / -
- R2-3: R2 / 全体の章構成 / 8 章（概要、対象ユーザー/利用目的、表示項目、操作、遷移、バリデーション、エラー表示と利用者の次の手、メモ / 将来課題）は rulebook の本文要件と同じ順で、章の移動・分割・統合は要らない。template は rulebook で not-needed と宣言されていて照合する相手がない。操作の章の「状態と操作可否」を「操作ごとの前提と結果」より先に置く順は、前提から結論の順として維持した / - / vp-arc-document-structure、vp-qe-omissions-consistency / -

## 4. 進め方と実践の型の適用

根拠とした規範は rulebook の本文要件と記述ガイド（バリデーション、エラー表示）、kata-guide の R2 段の定義である。章の順は rulebook と一致していたため維持した。状態の扱いの文だけを、rulebook の記述ガイドに合わせて移動した。F001 は R1 の版で解消済みで、R4 の観点でもあるため R2 では追加の改訂をしていない。rulebook と矛盾する箇所はなかった。rulebook など sample 以外は変更していない。
