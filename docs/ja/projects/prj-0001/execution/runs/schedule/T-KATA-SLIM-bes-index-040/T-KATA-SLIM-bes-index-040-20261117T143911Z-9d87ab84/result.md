---
specdojo:
  id: prj-0001:xer-t-kata-slim-bes-index-040-20261117t143911z-9d87ab84
  type: exec-result
  task_id: T-KATA-SLIM-bes-index-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-bes-index-040/T-KATA-SLIM-bes-index-040-20261117T143911Z-9d87ab84/plan.md
  started_at: "2026-11-17T14:39:17.356Z"
  completed_at: "2026-11-17T14:52:59.745Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - bes-index
    - specdojo:bes-index-rulebook
---

# Edit Result

## 1. 実施内容

- `bes-index-rulebook` から、どの成果物にも共通する運用の記述を外し、共通の正本への参照に置き換えた。外したのは、役割の段落、status・承認・公開・改訂廃止の手順、未決事項の担当・時期・記録先の要求、業務の受入への静的検査の混入、本文要件を言い直しただけの用語表、共通規約と重複する禁止事項。
- 全体方針に「共通の運用」を1項目だけ置いた。役割は適用先のメンバー定義、status・承認・改訂と廃止・未決事項の引き継ぎはドキュメントメタ情報標準を参照する。
- grade の finding 3件（F001〜F003）に対応した。
- 空白を除いた文字数は、改行を含めて 7,897字から 6,204字になった（78.56%）。目安の8割以下に収まった。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/bes-index-rulebook.md`: 共通運用の記述を外し、全体方針の「共通の運用」1項目からの参照に置き換えた。F001 では Frontmatter 表の `rulebook` を推奨から必須へ直した。F002 では詳細化基準に発生条件・事実データを加え、全体方針、詳細化理由列、記述ガイドの間で `bes-rulebook` と揃えた。F003 ではイベント自体の廃止・置換と個別 BES だけの廃止を区別した。イベントの行の存廃は本 rulebook を正とし、廃止行の保持、ID 再利用禁止、網羅件数からの除外を維持した。出来事が存続する場合は、有効行を保持し、詳細化表の後継への付替え、対応の解除、必要なら未決事項化を定めた。第2章名は「位置づけと用語定義」から「位置づけ」に変えた。用語表を除き、隣接仕様との責務境界を短い段落にまとめたため。標準8列、詳細化表4列、良い例・悪い例各10件、章の必須・条件付き区分は維持した。

## 3. 申し送り

- `sample` に残る役割・承認・静的検査の運用文と、「検証と引き渡し」にある静的検査への参照は、今回の方針に合わせて `sample` を見直す際に直すこと。
- 共通の正本（メタ情報標準）への追加提案は不要と、executor は判断している。
- 変更ファイルは docs/ja/specdojo/rulebooks/bes-index-rulebook.md のみ。役割の段落、status・承認・公開・改訂廃止の共通手順、未決事項の担当・時期・記録先要求、業務受入への静的検査の混入、重複する用語表と共通禁止事項を除去した。全体方針の「共通の運用」1項目から適用先のメンバー定義とドキュメントメタ情報標準を参照する。成果物本体・sample・gradeサイドカー・result は変更していない。
- 判断根拠は docs/ja/specdojo/standards/rulebook-authoring-standard.md、document-metadata-standard.md、deliverable-frontmatter.schema.yaml、bes-rulebook.md、sld-rulebook.md、PJR-8S4T の「他の型へ広げるときの一覧」、共通レビュー観点の vp-arc-conciseness・vp-qe-omissions-consistency・vp-qe-kata-conformance。適用例として bes-index-sample.md、成果物 bes-index.md と上位 cdfd-overview.md、既存grade結果2件、T-KATA-WAVE-1-bes-index-090 の review result、PJR-X1RW の対応記録を確認した。
- source=grade の F001: メタ情報標準の必須項目と成果物schemaの required 宣言に合わせ、Frontmatter表の `rulebook` を推奨から必須へ修正した。F002: 詳細化基準に発生条件・事実データを追加し、全体方針と詳細化理由列を一致させ、記述ガイドから全体方針を参照した。condense由来の記録はなし。
- F003: イベント自体の廃止・置換と個別 BES だけの廃止を区別した。本一覧の行の存廃は bes-index-rulebook を正とし、bes-rulebook の行削除の選択肢を採らず、廃止イベントの行保持・ID再利用禁止・網羅件数からの除外を維持した。出来事が存続する場合は有効行を保持し、詳細化表の後継への付替え、対応の解除、詳細化が必要な場合の未決事項化を定めた。
- 章名の変更は rulebook 第2章「位置づけと用語定義」から「位置づけ」のみ。列定義や本文要件の言い直しだった用語表を除き、隣接仕様との責務境界を短い段落にまとめたため。成果物に求める章名と必須・条件付き区分、標準8列、詳細化表4列、全小節、良い例・悪い例各10件は維持した。業務の受入確認には出典との対応、欠落・空欄・ID違反・重複0件、発生・不成立の判定、詳細化の対応と照合結果を残した。
- 文字数は改行を含む空白除外で、修正前7,897字→修正後6,204字、78.56%。sld試行と同じく表の区切り行も除く場合は7,226字→5,655字、78.26%。いずれも8割以下。比較元は作業開始時のHEAD、比較先はPrettier整形後。
- 共通の正本への追加提案と保護設定の変更は不要と判断した。メタ情報標準の成果物必須項目、ライフサイクル変更管理、成果物の値制約で今回外した共通運用を参照できる。sample に残る役割・承認・静的検査の運用文と「検証と引き渡し」への静的検査参照は、sampleを見直す際に今回の方針へ合わせること。
- reporter は以上を result の実施内容・変更ファイル・進め方と実践の型の適用へ記録すること。親runner指定のlint・schema・型検査・テストはexecutor内で重複実行しておらず、親runnerの検証結果を使用する。
- 適用外の検証: `npm run validate:schema:file`（変更したのはMarkdown rulebookのみで、YAMLファイルの変更がない。）
- 適用外の検証: `npm run validate:catalog`（executorの変更は docs/ja/specdojo/rulebooks/ 配下のみで、docs/ja/projects/ 配下の成果物変更がない。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票や既存plan/resultなどの履歴ファイルを変更していない。）

## 4. 進め方と実践の型の適用

rulebook-maintenance の進め方に従った。根拠にしたのは次の資料。`rulebook-authoring-standard`、`document-metadata-standard`、`deliverable-frontmatter.schema.yaml`、`bes-rulebook`、改訂済みの `sld-rulebook`、PJR-8S4T の「他の型へ広げるときの一覧」。共通レビュー観点は `vp-arc-conciseness`、`vp-qe-omissions-consistency`、`vp-qe-kata-conformance` を使った。適用例として `bes-index-sample`、成果物 `bes-index`、上位の `cdfd-overview`、既存の grade 結果2件、T-KATA-WAVE-1-bes-index-090 の review result、PJR-X1RW の対応記録を確認した。F001 はメタ情報標準と schema の必須宣言に合わせて解消した。F002 は `bes-rulebook` の詳細化基準に合わせて解消した。F003 は、本一覧の行の存廃は `bes-index-rulebook` を正とし、`bes-rulebook` の行削除の選択肢は採らないと整理して解消した。`source=condense` の記録はなかった。未解消の finding と根拠不足による見送りはない。成果物本体、`sample`、grade サイドカーは変更していない。
