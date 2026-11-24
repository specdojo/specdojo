---
specdojo:
  id: prj-0001:xer-t-kata-review-all-opd-index-sample-140-20261124t143920z-d4c89dc4
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-opd-index-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-opd-index-sample-140/T-KATA-REVIEW-ALL-opd-index-sample-140-20261124T143920Z-d4c89dc4/plan.md
  started_at: "2026-11-24T14:39:31.770Z"
  completed_at: "2026-11-24T14:51:55.029Z"
  agent: sol-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opd-index-sample
    - specdojo:opd-index-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R4（正しさ）を実施し、`docs/ja/specdojo/samples/opd-index-sample.md` の事実の誤りを 3 件直した。直したのは欠品 KPI の測定・判定条件、バックアップ確認の対象日、価格変更のロールバック条件である。
- plan の finding のうち、F001 は 3章の追記で解消した。F002 は R2、F003 は R3 で解消済みのため、繰り返しの修正はしていない。plan に `source=condense` の記録はない。
- 12章構成、必須表、frontmatter（`status` は `draft` のまま）、最終判断者、前段の修正は維持した。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opd-index-sample.md`: 3章: 欠品 KPI の基準を、運用開始前 1 か月の手書きの日次記録とし、対象商品・除外条件を固定した。来店数・仕入れ条件・季節要因も記録する。基準値 0 回、記録不足、比較条件未決は判定不能として `PO` が見直す。月次は経過確認、6 か月目は SC-04 の成功判定と区別した。稼働目標が未決の間は達成・未達を判定しない方針を維持した。5章: 翌朝のバックアップ確認の対象を、当日分から前日の閉店後の成功記録へ直した。7章: 価格変更のロールバック条件を、変更前との差から、承認された変更記録と価格が違う商品が見つかった場合へ直した。Prettier で表を整形した。

## 3. 申し送り

- 確かめの結果: 24 件の主張のうち 23 件は正本と一致した。確かめられなかったのは No=22 の営業時間内の稼働率の具体的な目標値で、正本の `nfr-availability-sample` でも `_UNDECIDED_` のため、sample の未決という記載は整合している。確かめるには `PO` による目標値の決定が要る。
- 対象外の別 kata への申し送り: `docs/ja/specdojo/samples/opr-index-sample.md` 5章のアラート表（84行付近）は、バックアップ確認と誤検知の終了条件が当日の閉店後を要求している。同文書6章（94行）の前日の閉店後という完了条件と食い違う。対象外のため編集していない。当該 kata の保守で、前日の閉店後へ揃える。
- 方針の判断: 正本のない駄菓子屋の業務上の数値・環境仮定は、共通サンプル文脈に反しない限り、実環境での検証の対象にしていない。対象 sample に CLI コマンド・オプション・ソフトウェア既定値の主張はないため、CLI 実行による照合は不要と判断した。
- reporter 向け: 以下の R4 指摘を result の実施内容に指定列の表として 1 回だけ記載し、その後に主張ごとの確かめの表を置く。申し送りに表を重ねない。result は executor では編集していない。
- R4-1: R4 / 箇所: 3. SLO・SLA・KPI / 指摘: `source=grade` F001。欠品 KPI の導入前基準値の取得方法・期間と比較条件が不足していた。 / 直した案: 運用開始前 1 か月の手書きの日次記録を基準とし、対象商品・除外条件を固定する。来店数・仕入れ条件・季節要因も記録し、基準値 0 回・記録不足・季節要因の比較条件未決は判定不能として PO が見直す。月次の経過確認と SC-04 の 6 か月目の成功判定を区別した。稼働目標未決時に達成・未達を判定しない既存方針は維持した。 / 根拠: `vp-qe-verifiability`、opd-index-rulebook 1・6・7章、Sample 記述標準6・7章、prj-overview-sample 5章、prj-success-criteria-and-acceptance-criteria-sample の SC-04・4章・5章、nfr-availability-sample の nfr-avl-001。0 回の例外は削減率の分母が 0 になるための具体化である。 / 印: -
- R4-2: R4 / 箇所: 5. 監視・アラート方針 / 指摘: 翌朝に当日分のバックアップ成功記録を要求しており、8章の取得時点より未来の記録を確認する条件になっていた。 / 直した案: 翌朝の確認対象を前日の閉店後の成功記録へ修正した。 / 根拠: `vp-qe-verifiability`、opd-index-rulebook 6章、対象 sample 8章、opr-sample 5〜7章、opr-index-sample 6章。 / 印: -
- R4-3: R4 / 箇所: 7. 変更管理 / 指摘: 価格が変更前と違えばロールバックする条件では、意図どおりの価格変更も戻してしまう。 / 直した案: 承認された変更記録と価格が違う商品が見つかった場合を戻す条件にした。 / 根拠: `vp-dev-implementation-readiness`、`vp-qe-verifiability`、opd-index-rulebook 6章、opr-sample 8章、opr-index-sample 8章。 / 印: -
- R4-4: R4 / 箇所: 対象外の opr-index-sample 5章 / 指摘: アラート表のバックアップ確認が当日分を要求し、誤検知の終了条件も当日の閉店後の日時を要求している。同文書6章の前日の閉店後という完了条件と異なる。 / 直した案: - / 根拠: `vp-qe-verifiability`。`docs/ja/specdojo/samples/opr-index-sample.md` 84行の確認・終了条件を、94行および今回修正した運用方針と同じ前日の閉店後へ直す案。対象外の kata のため編集せず、当該 kata の保守へ引き継ぐ。 / 印: -
- 確かめ No=01 / 主張: frontmatter は `specdojo` 名前空間配下に置く（先頭） / 正本: `docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml`、`src/shared/frontmatter-namespace.ts` / 確かめ方: `cat` で schema と実装を読み取り / 結果: 一致 / 根拠: schema の required は specdojo、実装は parsed.specdojo を取り出す。sample 2行も同じ構造。
- 確かめ No=02 / 主張: 文書 ID は `specdojo:opd-index-sample`（先頭） / 正本: `docs/specdojo/schemas/v1/common-frontmatter.schema.yaml`、`docs/ja/specdojo/standards/sample-authoring-standard.md` / 確かめ方: `cat` で読み取り / 結果: 一致 / 根拠: ID の許可パターンに適合し、標準4章の sample の識別規則にも合う。
- 確かめ No=03 / 主張: `type` は operations（先頭） / 正本: `docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml`、`docs/ja/specdojo/rulebooks/opd-index-rulebook.md` / 確かめ方: `cat` で読み取り / 結果: 一致 / 根拠: schema 17行の列挙値、rulebook 45行の指定と一致。
- 確かめ No=04 / 主張: `status` は draft（先頭） / 正本: `docs/specdojo/schemas/v1/common-frontmatter.schema.yaml` / 確かめ方: `cat` で読み取り / 結果: 一致 / 根拠: 68行の列挙値に含まれる。変更していない。
- 確かめ No=05 / 主張: `rulebook` は specdojo:opd-index-rulebook（先頭） / 正本: `docs/ja/specdojo/rulebooks/opd-index-rulebook.md`、`docs/specdojo/schemas/v1/common-frontmatter.schema.yaml` / 確かめ方: `cat` で読み取り / 結果: 一致 / 根拠: rulebook 45行の指定および rulebookRef のパターンに一致する。参照ファイルも存在する。
- 確かめ No=06 / 主張: `based_on` は空配列を許容する（先頭） / 正本: `docs/specdojo/schemas/v1/common-frontmatter.schema.yaml` / 確かめ方: `cat` で読み取り / 結果: 一致 / 根拠: 72行から idRefArray を参照し、最小件数の制約はなく default も空配列。
- 確かめ No=07 / 主張: `supersedes` は空配列を許容する（先頭） / 正本: `docs/specdojo/schemas/v1/common-frontmatter.schema.yaml` / 確かめ方: `cat` で読み取り / 結果: 一致 / 根拠: 75行から idRefArray を参照し、default は空配列。
- 確かめ No=08 / 主張: 方針の具体化を opd 分冊、実行手順を opr 文書へ置く（1・12章） / 正本: `docs/ja/specdojo/rulebooks/opd-index-rulebook.md` / 確かめ方: `cat` で読み取り / 結果: 一致 / 根拠: 27行の責務分担と一致する。
- 確かめ No=09 / 主張: SLO は運用側の数値目標（3章） / 正本: `docs/ja/specdojo/rulebooks/opd-index-rulebook.md` / 確かめ方: `cat` で読み取り / 結果: 一致 / 根拠: 31行の定義と一致する。
- 確かめ No=10 / 主張: SLA は外部との約束（3章） / 正本: `docs/ja/specdojo/rulebooks/opd-index-rulebook.md` / 確かめ方: `cat` で読み取り / 結果: 一致 / 根拠: 32行の外部との合意という定義に合う。
- 確かめ No=11 / 主張: KPI は改善の管理指標（3章） / 正本: `docs/ja/specdojo/rulebooks/opd-index-rulebook.md` / 確かめ方: `cat` で読み取り / 結果: 一致 / 根拠: 33行の定義と一致する。
- 確かめ No=12 / 主張: RACI は実行・説明責任・相談・共有の分担（4章） / 正本: `docs/ja/specdojo/rulebooks/opd-index-rulebook.md` / 確かめ方: `cat` で読み取り / 結果: 一致 / 根拠: 34行の R・A・C・I の意味と一致する。
- 確かめ No=13 / 主張: RTO は目標復旧時間（1・8章） / 正本: `docs/ja/specdojo/rulebooks/opd-index-rulebook.md` / 確かめ方: `cat` で読み取り / 結果: 一致 / 根拠: 35行の復旧までの目標時間という定義に合う。
- 確かめ No=14 / 主張: RPO は目標復旧時点（1・8章） / 正本: `docs/ja/specdojo/rulebooks/opd-index-rulebook.md` / 確かめ方: `cat` で読み取り / 結果: 一致 / 根拠: 35行の許容するデータ損失の時点という定義に合う。
- 確かめ No=15 / 主張: PO は Project Owner（1章） / 正本: `docs/ja/specdojo/standards/people-and-organization-definition-standard.md` / 確かめ方: `nl -ba` と `sed` で標準ロール表を読み取り / 結果: 一致 / 根拠: 115行の正式名称に一致する。
- 確かめ No=16 / 主張: DEV は Developer（1章） / 正本: `docs/ja/specdojo/standards/people-and-organization-definition-standard.md` / 確かめ方: `nl -ba` と `sed` で標準ロール表を読み取り / 結果: 一致 / 根拠: 119行の正式名称に一致する。
- 確かめ No=17 / 主張: OPS は Operations / Release Manager（3章） / 正本: `docs/ja/specdojo/standards/people-and-organization-definition-standard.md` / 確かめ方: `nl -ba` と `sed` で標準ロール表を読み取り / 結果: 一致 / 根拠: 122行の正式名称に一致する。
- 確かめ No=18 / 主張: 欠品 KPI は導入前 1 か月の同じ対象商品・除外条件の日次記録を基準に比較する（3章） / 正本: `docs/ja/specdojo/samples/prj-overview-sample.md`、`docs/ja/specdojo/samples/prj-success-criteria-and-acceptance-criteria-sample.md` / 確かめ方: `sed` と `rg -n` で概要5章、成功基準 SC-04・4章・5章を読み取り / 結果: 一致 / 根拠: 概要59行は運用開始前1か月、成功基準65行は PO による手書きの日次記録、78行は対象と除外条件の事前固定を指定。修正前に不足していた条件を sample 55行へ追記した。
- 確かめ No=19 / 主張: 欠品の成功判定は運用開始後 6 か月目に行う（3章） / 正本: `docs/ja/specdojo/samples/prj-success-criteria-and-acceptance-criteria-sample.md` / 確かめ方: `rg -n` で SC-04 を読み取り / 結果: 一致 / 根拠: 37行の6か月目の暦月・ベースライン比50%以上削減という条件に従い、月次点検は経過確認と明示した。
- 確かめ No=20 / 主張: 基準記録不足や比較条件未決では削減率を判定しない（3章） / 正本: `docs/ja/specdojo/samples/prj-success-criteria-and-acceptance-criteria-sample.md` / 確かめ方: `sed -n '60,85p'` で読み取り / 結果: 一致 / 根拠: 65行は1か月そろわなければ判定不能として比較を見直す。80行は繁忙期の比較の扱いを未決としている。基準値0回も削減率を計算できない境界条件として明示した。
- 確かめ No=21 / 主張: 稼働率目標未決の間は停止時間の記録にとどめ達成・未達を判定しない（1・3章） / 正本: `docs/ja/specdojo/samples/nfr-availability-sample.md` / 確かめ方: `sed` と `rg -n` で nfr-avl-001 と未決事項表を読み取り / 結果: 一致 / 根拠: 49行・88行の方針と対象 sample 22行が一致しており維持した。F001 を理由に暫定の稼働率数値を創作していない。
- 確かめ No=22 / 主張: 営業時間内の稼働率の具体的な目標値（1・3章） / 正本: `docs/ja/specdojo/samples/nfr-availability-sample.md` / 確かめ方: `rg -n` で nfr-avl-001 と未決事項を読み取り / 結果: 確かめられない / 根拠: 正本でも `_UNDECIDED_`。確かめるには PO による目標値の決定と上位要件への反映が必要。sample の未決という記載は正本と整合する。
- 確かめ No=23 / 主張: 翌朝に確認するバックアップは前日の閉店後のもの（5章） / 正本: `docs/ja/specdojo/samples/opd-index-sample.md` 8章、`docs/ja/specdojo/samples/opr-sample.md` 5〜7章 / 確かめ方: `cat`、`sed -n '72,112p'` で読み取り / 結果: 一致 / 根拠: 取得は毎日の日次締め後。opr-sample 74・87・96行も前日の閉店後を指定する。修正前の当日分という閾値を90行で修正した。
- 確かめ No=24 / 主張: 価格変更は承認された変更記録との差でロールバックを判断する（7章） / 正本: `docs/ja/specdojo/rulebooks/opd-index-rulebook.md` 6章、`docs/ja/specdojo/samples/opr-sample.md` 8章 / 確かめ方: `cat`、`sed -n '72,112p'` で読み取り / 結果: 一致 / 根拠: rulebook は承認範囲と戻す条件を要求し、opr-sample 108行は変更記録と違う価格を戻す条件とする。修正前の変更前との差という条件を対象 sample 109行で修正した。
- 進め方と実践の型の適用へ記録: `kata-guide.md` 6.1・6.3・6.5、共通規約2文書、`sample-authoring-standard.md`、`opd-index-rulebook.md` 全文、`document-metadata-standard.md` のメタ情報規約、共通レビュー観点一覧の該当判定根拠、frontmatter schema2件、`src/shared/frontmatter-namespace.ts`・`src/shared/document-metadata.ts`、組織・人員定義標準、プロジェクト概要・成功基準・可用性要件・運用要件・運用手順の該当箇所、grade サイドカー、R1〜R3 の result を確認した。recipe・template は rulebook が `not-needed` と宣言するため追加参照なし。コマンドリファレンスの所在と関連箇所も検索したが、対象 sample に CLI コマンド・オプション・ソフトウェア既定値の主張はなく、追加の CLI 実行照合は不要と判断した。
- 判断根拠の補足: `source=grade` F001 は今回の追記と既存の稼働率未決時の扱いにより解消。F002 は R2、F003 は R3 で解消済みで、繰り返しの指摘・修正はしていない。plan に `source=condense` の記録はない。正本のない駄菓子屋の業務上の数値・環境仮定は、共通サンプル文脈に反しない限り実環境検証の対象にしていない。12章構成・必須表・frontmatter・最終判断者・前段の修正を維持したことを最終差分で再確認した。構成について rulebook と矛盾して優先判断を要した箇所はない。
- 変更ファイル: `docs/ja/specdojo/samples/opd-index-sample.md` のみ。3章の欠品 KPI と測定・判定条件、5章のバックアップ対象日、7章の価格ロールバック条件を修正し、Prettier で表を整形した。result・grade サイドカー・設定・Git の状態管理ファイルは編集していない。開始時から存在する未追跡の pipeline-state.json は runner 管理として触れていない。
- 作業環境の補足: 開始時の `npx specdojo where playbook --project prj-0001` は npm の一時ディレクトリ作成で ENOENT となったため、指示に明記された運用メモの既存パスを直接読んだ。sample の検証に必要なコマンドの失敗ではなく、追加インストールや設定変更は行っていない。指定済み親検証は runner に委ねている。
- 適用外の検証: `npm run validate:schema:file`（executor の変更は Markdown sample のみで、YAML ファイルを変更していない。）
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/specdojo/samples/ 内のみで、docs/ja/projects/ 配下へ及ばない。）
- 適用外の検証: `npm run validate:history-links`（executor は登録簿個票、既存 plan、result を変更していない。）
- 適用外の検証: `node tools/check-evidence-secrets.mjs --staged`（対象は運用方針 sample のみで、検査対象の実行記録を変更していない。Git のステージ操作は親 runner が担当する。）

## 4. 進め方と実践の型の適用

kata-guide の「kata を agent でレビューする」R4 に従い、sample の事実を正本と突き合わせた。突き合わせた正本は、frontmatter schema、`src/shared/frontmatter-namespace.ts`、`opd-index-rulebook`、組織・人員定義標準、プロジェクト概要・成功基準・可用性要件、`opr-sample`、`opr-index-sample` である。recipe・template は rulebook が `not-needed` と宣言するため参照していない。 指摘は次の表のとおり。 | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | | R4 | 3. SLO・SLA・KPI | `source=grade` F001。欠品 KPI の導入前基準値の取得方法・期間と比較条件が不足していた。 | 運用開始前 1 か月の手書きの日次記録を基準とし、対象商品・除外条件を固定した。基準値 0 回、記録不足、比較条件未決は判定不能とした。 | `vp-qe-verifiability`、opd-index-rulebook、prj-success-criteria-and-acceptance-criteria-sample の SC-04 | - | | R4 | 5. 監視・アラート方針 | 翌朝に当日分のバックアップ成功記録を要求しており、8章の取得時点より未来の記録を確認する条件になっていた。 | 確認対象を前日の閉店後の成功記録へ修正した。 | `vp-qe-verifiability`、opr-sample 5〜7章 | - | | R4 | 7. 変更管理 | 価格が変更前と違えばロールバックする条件では、意図どおりの価格変更も戻してしまう。 | 承認された変更記録と価格が違う商品が見つかった場合を戻す条件にした。 | `vp-dev-implementation-readiness`、`vp-qe-verifiability`、opr-sample 8章 | - | | R4 | 対象外: opr-index-sample 5章 | アラート表のバックアップ確認が当日分を要求し、同文書6章の前日の閉店後という完了条件と異なる。 | - | `vp-qe-verifiability`。対象外のため編集せず、当該 kata の保守へ引き継ぐ。 | - | 未解消の finding、根拠不足で見送った finding はない。構成について rulebook と矛盾し、優先判断を要した箇所もない。 主張ごとの確かめの表は次のとおり。 | No | 主張（箇所） | 正本 | 結果 | | --- | --- | --- | --- | | 01 | frontmatter は `specdojo` 名前空間配下に置く | deliverable-frontmatter schema、`src/shared/frontmatter-namespace.ts` | 一致 | | 02 | 文書 ID は `specdojo:opd-index-sample` | common-frontmatter schema、sample-authoring-standard | 一致 | | 03 | `type` は operations | deliverable-frontmatter schema、opd-index-rulebook | 一致 | | 04 | `status` は draft | common-frontmatter schema | 一致 | | 05 | `rulebook` は specdojo:opd-index-rulebook | opd-index-rulebook、common-frontmatter schema | 一致 | | 06 | `based_on` は空配列を許容する | common-frontmatter schema | 一致 | | 07 | `supersedes` は空配列を許容する | common-frontmatter schema | 一致 | | 08 | 方針の具体化を opd 分冊、実行手順を opr 文書へ置く（1・12章） | opd-index-rulebook | 一致 | | 09 | SLO は運用側の数値目標（3章） | opd-index-rulebook | 一致 | | 10 | SLA は外部との約束（3章） | opd-index-rulebook | 一致 | | 11 | KPI は改善の管理指標（3章） | opd-index-rulebook | 一致 | | 12 | RACI は実行・説明責任・相談・共有の分担（4章） | opd-index-rulebook | 一致 | | 13 | RTO は目標復旧時間（1・8章） | opd-index-rulebook | 一致 | | 14 | RPO は目標復旧時点（1・8章） | opd-index-rulebook | 一致 | | 15 | PO は Project Owner（1章） | people-and-organization-definition-standard | 一致 | | 16 | DEV は Developer（1章） | people-and-organization-definition-standard | 一致 | | 17 | OPS は Operations / Release Manager（3章） | people-and-organization-definition-standard | 一致 | | 18 | 欠品 KPI は導入前 1 か月の同じ対象商品・除外条件の日次記録を基準に比較する（3章） | prj-overview-sample、prj-success-criteria-and-acceptance-criteria-sample | 一致（不足条件を追記） | | 19 | 欠品の成功判定は運用開始後 6 か月目に行う（3章） | prj-success-criteria-and-acceptance-criteria-sample SC-04 | 一致 | | 20 | 基準記録不足や比較条件未決では削減率を判定しない（3章） | prj-success-criteria-and-acceptance-criteria-sample | 一致 | | 21 | 稼働率目標未決の間は停止時間の記録にとどめ、達成・未達を判定しない（1・3章） | nfr-availability-sample | 一致 | | 22 | 営業時間内の稼働率の具体的な目標値（1・3章） | nfr-availability-sample | 確かめられない（正本も `_UNDECIDED_`） | | 23 | 翌朝に確認するバックアップは前日の閉店後のもの（5章） | 対象 sample 8章、opr-sample 5〜7章 | 一致（修正前は当日分で誤り） | | 24 | 価格変更は承認された変更記録との差でロールバックを判断する（7章） | opd-index-rulebook 6章、opr-sample 8章 | 一致（修正前は変更前との差で誤り） |
