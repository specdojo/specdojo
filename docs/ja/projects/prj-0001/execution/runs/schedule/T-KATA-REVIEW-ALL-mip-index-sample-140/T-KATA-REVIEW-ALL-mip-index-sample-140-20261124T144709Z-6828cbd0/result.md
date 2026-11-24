---
specdojo:
  id: prj-0001:xer-t-kata-review-all-mip-index-sample-140-20261124t144709z-6828cbd0
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-mip-index-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-mip-index-sample-140/T-KATA-REVIEW-ALL-mip-index-sample-140-20261124T144709Z-6828cbd0/plan.md
  started_at: "2026-11-24T14:47:19.039Z"
  completed_at: "2026-11-24T15:00:49.541Z"
  agent: sol-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:mip-index-sample
    - specdojo:mip-index-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）の照合を行った。対象 sample の13主張はすべて正本（schema、rulebook、standards、src、コマンドリファレンス）と一致した。修正が必要な誤りはなく、指摘は0件で、sample への変更もない。 | No | 主張（本文の箇所） | 正本 | 確かめ方 | 結果 | 根拠 | | --- | --- | --- | --- | --- | --- | | C1 | frontmatter を `specdojo:` 配下に置く（2行） | `docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml`、`src/shared/frontmatter-namespace.ts` | ファイル読み取り | 一致 | schema は `specdojo` オブジェクトを必須とし、実装の `readSpecdojoNamespace` も同じ名前空間を読む。 | | C2 | sample の ID は `specdojo:mip-index-sample`（3行） | `docs/specdojo/schemas/v1/common-frontmatter.schema.yaml`、`docs/ja/specdojo/standards/document-metadata-standard.md`、`src/register/approach.ts`、`docs/ja/specdojo/references/command-reference.md` | ファイル読み取り | 一致 | ID の文字制約、core authority、末尾 `-sample` を満たす。実装とリファレンスも sample を ID 末尾で識別する。 | | C3 | `type: project`（4行） | `docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml`、`docs/ja/specdojo/rulebooks/mip-index-rulebook.md`、`src/catalog/generate.ts` | ファイル読み取り | 一致 | `project` は成果物 type の列挙値に含まれ、rulebook の `deliverable_type` と本文の指定に一致する。 | | C4 | `status: draft`（5行） | `docs/specdojo/schemas/v1/common-frontmatter.schema.yaml` | ファイル読み取り | 一致 | 許可値 `draft`・`ready`・`deprecated` のうち `draft` を使っている。 | | C5 | `rulebook: specdojo:mip-index-rulebook`（6行） | `docs/specdojo/schemas/v1/common-frontmatter.schema.yaml`、`docs/ja/specdojo/rulebooks/mip-index-rulebook.md` | ファイル読み取り | 一致 | 文字制約を満たし、rulebook の ID・sample 宣言・本文の指定が相互に一致する。 | | C6 | `based_on: []`（7行） | `docs/specdojo/schemas/v1/common-frontmatter.schema.yaml`、`src/catalog/build-references.ts` | ファイル読み取り | 一致 | 重複のない ID 配列で空配列が許可され、既定値も空配列。 | | C7 | `supersedes: []`（8行） | `docs/specdojo/schemas/v1/common-frontmatter.schema.yaml` | ファイル読み取り | 一致 | ID 配列として空配列が許可され、既定値も空配列。 | | C8 | `dmd-index` に転記・取り込み・照合の方法を委ねる（4章・9章） | `docs/ja/specdojo/rulebooks/mip-index-rulebook.md`、`docs/ja/specdojo/rulebooks/dmd-index-rulebook.md` | ファイル読み取り | 一致 | DMD は移行対象を受けて変換・照合を設計し、件数・重要値の照合方針も扱う。 | | C9 | `mtp-index` は作業時間の測定と照合の合否を扱う移行リハーサル計画（9章） | `docs/ja/specdojo/rulebooks/mip-index-rulebook.md`、`docs/ja/specdojo/rulebooks/mtp-rulebook.md` | ファイル読み取り | 一致 | MTP はリハーサルの予定・完了条件と、件数照合・差分・業務シナリオの合否を扱う。 | | C10 | 当日の詳細手順と判定点を `cop-index` に置く（8.1・9章） | `docs/ja/specdojo/rulebooks/mip-index-rulebook.md`、`docs/ja/specdojo/rulebooks/cop-index-rulebook.md` | ファイル読み取り | 一致 | MIP はカットオーバーの骨格を示し、COP が本番切替の手順・判定点を具体化する。 | | C11 | `otp-index` は並行記録の運用と正本切替後の問い合わせ窓口を扱う（9章） | `docs/ja/specdojo/rulebooks/mip-index-rulebook.md`、`docs/ja/specdojo/rulebooks/otp-index-rulebook.md` | ファイル読み取り | 一致 | OTP は切替後の安定運用までの監視・窓口・当番・SLA を定める。 | | C12 | 午前休業の仮定を `_ASSUMPTION_:` で示す（2章） | `docs/ja/specdojo/standards/sample-authoring-standard.md`、`docs/ja/specdojo/standards/document-metadata-standard.md` | ファイル読み取り | 一致 | 仮定を示す共通の目印として許可されている。仮定した時間帯そのものの実証は対象外。 | | C13 | 未定の切替日を `_UNDECIDED_:` で示す（2章） | `docs/ja/specdojo/standards/sample-authoring-standard.md`、`docs/ja/specdojo/standards/document-metadata-standard.md` | ファイル読み取り | 一致 | 未確定事項を示す共通の目印として許可されている。 | 確かめられなかった主張はない。

## 2. 変更ファイル

- なし

## 3. 申し送り

- reporter 向け（実施内容）: R4 の指摘は 0 件。以下の C1〜C13 を、実施内容に列「No」「主張（本文の箇所）」「正本」「確かめ方」「結果」「根拠」の Markdown 表として 1 回だけ記載する。申し送りに表を重ねない。全件一致で、確かめられない主張はない。
- C1: 主張=frontmatter を `specdojo:` 配下に置く（2行） / 正本=`docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml`:20〜28、`src/shared/frontmatter-namespace.ts` / 確かめ方=ファイル読み取り / 結果=一致 / 根拠=schema は `specdojo` オブジェクトを必須とし、実装の `readSpecdojoNamespace` も同じ名前空間を読み取る。
- C2: 主張=sample の ID は `specdojo:mip-index-sample`（3行） / 正本=`docs/specdojo/schemas/v1/common-frontmatter.schema.yaml`:10〜13、`docs/ja/specdojo/standards/document-metadata-standard.md`:36〜37・62〜63、`src/register/approach.ts`:190〜199、`docs/ja/specdojo/references/command-reference.md`:575 / 確かめ方=ファイル読み取り / 結果=一致 / 根拠=ID の文字制約、core authority、sample の末尾 `-sample` を満たし、実装とリファレンスも sample を ID 末尾で識別する。
- C3: 主張=`type: project`（4行） / 正本=`docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml`:4〜17、`docs/ja/specdojo/rulebooks/mip-index-rulebook.md`:5・48、`src/catalog/generate.ts`:132〜146 / 確かめ方=ファイル読み取り / 結果=一致 / 根拠=`project` は成果物 type の列挙値に含まれ、主 rulebook の `deliverable_type` と本文の指定に一致する。生成実装も rulebook の宣言値を読む。
- C4: 主張=`status: draft`（5行） / 正本=`docs/specdojo/schemas/v1/common-frontmatter.schema.yaml`:63〜68 / 確かめ方=ファイル読み取り / 結果=一致 / 根拠=許可値 `draft`・`ready`・`deprecated` のうち `draft` を使用している。
- C5: 主張=`rulebook: specdojo:mip-index-rulebook`（6行） / 正本=`docs/specdojo/schemas/v1/common-frontmatter.schema.yaml`:19〜25、`docs/ja/specdojo/rulebooks/mip-index-rulebook.md`:3・8・48 / 確かめ方=ファイル読み取り / 結果=一致 / 根拠=rulebook 参照の文字制約を満たし、実在する rulebook の ID、sample 宣言、本文の指定が相互に一致する。
- C6: 主張=`based_on: []`（7行） / 正本=`docs/specdojo/schemas/v1/common-frontmatter.schema.yaml`:14〜18・72〜74、`src/catalog/build-references.ts`:129〜139 / 確かめ方=ファイル読み取り / 結果=一致 / 根拠=重複のない ID 配列で空配列が許可され、schema の既定値も空配列。実装は同じ名前空間の配列を参照する。未宣言の業務成果物を根拠として追加していない。
- C7: 主張=`supersedes: []`（8行） / 正本=`docs/specdojo/schemas/v1/common-frontmatter.schema.yaml`:14〜18・75〜77 / 確かめ方=ファイル読み取り / 結果=一致 / 根拠=ID 配列として空配列が許可され、schema の既定値も空配列である。
- C8: 主張=`dmd-index` に転記・取り込み・照合の方法を委ねる（4章・9章） / 正本=`docs/ja/specdojo/rulebooks/mip-index-rulebook.md`:30・60、`docs/ja/specdojo/rulebooks/dmd-index-rulebook.md`:27・49 / 確かめ方=ファイル読み取り / 結果=一致 / 根拠=DMD は移行対象を受け、変換・照合を設計する。件数・重要値の照合方針も同 rulebook が扱う。
- C9: 主張=`mtp-index` は作業時間の測定と照合の合否を扱う移行リハーサル計画（9章） / 正本=`docs/ja/specdojo/rulebooks/mip-index-rulebook.md`:31、`docs/ja/specdojo/rulebooks/mtp-rulebook.md`:16・20・57〜60 / 確かめ方=ファイル読み取り / 結果=一致 / 根拠=MTP はリハーサルの予定・完了条件と、件数照合・差分・業務シナリオの合否を扱う。
- C10: 主張=当日の詳細手順と判定点を `cop-index` に置く（8.1・9章） / 正本=`docs/ja/specdojo/rulebooks/mip-index-rulebook.md`:21・32・64、`docs/ja/specdojo/rulebooks/cop-index-rulebook.md` / 確かめ方=ファイル読み取り / 結果=一致 / 根拠=MIP はカットオーバーの骨格を示し、COP が本番切替の手順・判定点を具体化する。
- C11: 主張=`otp-index` は並行記録の運用と正本切替後の問い合わせ窓口を扱う（9章） / 正本=`docs/ja/specdojo/rulebooks/mip-index-rulebook.md`:33・65、`docs/ja/specdojo/rulebooks/otp-index-rulebook.md`:20 / 確かめ方=ファイル読み取り / 結果=一致 / 根拠=OTP は切替後の安定運用までの監視・窓口・当番・SLA を定める。
- C12: 主張=午前休業の仮定を `_ASSUMPTION_:` で示す（2章） / 正本=`docs/ja/specdojo/standards/sample-authoring-standard.md`:78、`docs/ja/specdojo/standards/document-metadata-standard.md`:146 / 確かめ方=ファイル読み取り / 結果=一致 / 根拠=仮定を示す共通の目印として許可されている。仮定した時間帯そのものの実証は対象外。
- C13: 主張=未定の切替日を `_UNDECIDED_:` で示す（2章） / 正本=`docs/ja/specdojo/standards/sample-authoring-standard.md`:78、`docs/ja/specdojo/standards/document-metadata-standard.md`:146 / 確かめ方=ファイル読み取り / 結果=一致 / 根拠=未確定事項を示す共通の目印として許可されている。
- reporter 向け（進め方と実践の型の適用）: 共通規約2文書、[[specdojo:kata-guide|実践の型活用ガイド]] 第6章、[[specdojo:sample-authoring-standard|Sample 記述標準]]、[[specdojo:document-metadata-standard|ドキュメントメタ情報標準]]、[[specdojo:mip-index-rulebook|移行計画 作成ルール]]、共通レビュー観点のR4対象と全段共通の委任境界、対応schema・実装・コマンドリファレンスを確認した。先行R1〜R3のresultを読み、既存の修正を維持した。rulebook の `recipe` と `template` は `undecided` で、宣言された参照先はない。plan に展開された finding はない。既存gradeは指摘なしだが前段修正前の記録であり、今回の正しさの判断根拠には代用していない。
- reporter 向け（維持判断・変更ファイル）: 変更ファイルなし。13主張は正本と一致するため維持した。コマンド・オプション・ファイルパスの実行例は対象sampleにない。停止時間、並行記録期間、画面操作、取り込み・出力、許容差、支援期間などは架空業務の計画上の条件であり、共通サンプル文脈に反しない仮定として実証対象から除外した。根拠不足による改訂見送りや未解決事項はない。result、gradeサイドカー、保護された設定は編集していない。親runner指定の検査は重複実行していない。
- 適用外の検証: `npx prettier --write docs/ja/specdojo/samples/mip-index-sample.md`（照合結果が一致したため、Markdownを含む成果物を変更していない。）
- 適用外の検証: `npm run validate:schema:file`（executorはファイルを変更しておらず、適用条件となるYAML変更がない。）
- 適用外の検証: `npm run validate:catalog`（executorによる docs/ja/projects/ 配下の変更がない。）
- 適用外の検証: `npm run validate:history-links`（executorは登録簿個票、plan、resultを変更していない。）

## 4. 進め方と実践の型の適用

根拠として共通規約2文書、kata-guide の第6章、sample-authoring-standard、document-metadata-standard、mip-index-rulebook、共通レビュー観点の R4 対象と全段共通の委任境界、対応する schema・実装・コマンドリファレンスを確認した。先行 R1〜R3 の result も読み、既存の修正を維持した。rulebook の `recipe` と `template` は `undecided` で、宣言された参照先はない。plan に展開された finding はない。既存 grade は指摘なしだが前段修正前の記録なので、今回の正しさの判断根拠には使っていない。13主張は正本と一致したため sample を維持した。コマンド・オプション・パスの実行例は sample になく、停止時間、並行記録期間、許容差、支援期間などは架空業務の計画上の条件にあたる。共通サンプル文脈に反しない仮定なので、実証対象から除外した。根拠不足による改訂見送りや未解決事項はない。
