---
specdojo:
  id: prj-0001:xer-t-kata-review-all-cpd-sample-150-20261125t023855z-4f796fdb
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-cpd-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-cpd-sample-150/T-KATA-REVIEW-ALL-cpd-sample-150-20261125T023855Z-4f796fdb/plan.md
  started_at: "2026-11-25T02:39:04.382Z"
  completed_at: "2026-11-25T02:52:19.904Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:cpd-sample
    - specdojo:cpd-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として `cpd-sample` を上位図 `cnd-sample`、`prj-overview-sample`、`gl-sample`、用語集、共通サンプル文脈と照合した。
- 食い違い 3 件を sample 側で修正した。相手側を直す案はない。
- 指摘は次の表のとおり。 | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | 1 | R5 | `cpd-sample.md` 概要の第2段落 | 成功基準の正本が `prj-overview-sample` の「期待効果」と食い違っていた。同書は目標値を初期仮説とし、確定した成功判定は `prj-success-criteria-and-acceptance-criteria-sample` で管理するとしている。 | 「業務目的は『基本的な考え方』、目標値の初期仮説は『期待効果』を根拠とする」に直した。 | `prj-overview-sample` の「期待効果」冒頭段落 | なし | | 2 | R5 | `cpd-sample.md` 概要の本書固有の語（控え・発行状況） | 上位図 `cnd-sample` は「レシート控え」「印字状態」「印字結果」と呼んでおり、本図の語との対応が書かれていなかった。 | 定義に「上位図の『レシート控え』に当たる」「上位図の『印字状態』『印字結果』に当たる」を足した。 | `cnd-sample` の Data Store 表と Relationship 表（REL-03〜REL-05） | なし | | 3 | R5 | `cpd-sample.md` 技術前提・制約の箇条 5 | 応答欠落時に照合する人が上位図と食い違っていた。上位図は店番担当が照合し、結果不明や訂正の判断は店主代表へ引き継ぐとしている。 | 「店番中の利用者が残った記録と紙面を照合し、結果不明の取引は店主代表へ引き継ぐ」に分けた。判断の担い手は直後の箇条のままにした。 | `cnd-sample` の Person 表、External Software System 表、検証対象表の「印刷基盤の不在・結果不明」の行 | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/cpd-sample.md`: 上位図 `cnd-sample` や `prj-overview-sample` との食い違い 3 件を直した（4 行追加、4 行削除）。概要の根拠参照を「業務目的は基本的な考え方、目標値の初期仮説は期待効果」に改めた。「控え」「発行状況」が上位図の「レシート控え」「印字状態」「印字結果」に当たることを定義へ追記した。技術前提・制約の箇条 5 は、店番中の利用者による照合と店主代表への引き継ぎに分けた。

## 3. 申し送り

- No.3 は「店番中の利用者」が本書で未定義の言い方なので、人の判断が要る。上位図の「店番担当」を本書でも定義して使うかを決めてほしい。
- No: 1 / 段: R5 / 箇所: docs/ja/specdojo/samples/cpd-sample.md「概要」第2段落 / 指摘: 「業務目的と成功基準は同書の『基本的な考え方』『期待効果』を根拠とする」とあるが、prj-overview-sample の「期待効果」は目標値を初期仮説とし、確定した成功判定は prj-success-criteria-and-acceptance-criteria-sample で管理すると書いている。成功基準の正本が食い違っている / 直した案: 「業務目的は同書の『基本的な考え方』、目標値の初期仮説は同書の『期待効果』を根拠とする」に直した / 根拠: docs/ja/specdojo/samples/prj-overview-sample.md「期待効果」の冒頭段落 / 印: なし
- No: 2 / 段: R5 / 箇所: docs/ja/specdojo/samples/cpd-sample.md「概要」の本書固有の語（控え・発行状況） / 指摘: 上位図 cnd-sample は同じ対象を「レシート控え」「印字状態」「印字結果」と呼び、本図の「控え」「発行状況」との対応が書かれていない。上位図の関係と見比べるときに同じものか判断できない / 直した案: 定義に「上位図の『レシート控え』に当たる」「上位図の『印字状態』『印字結果』に当たる」を足した / 根拠: docs/ja/specdojo/samples/cnd-sample.md の Data Store 表と Relationship 表（REL-03〜REL-05） / 印: なし
- No: 3 / 段: R5 / 箇所: docs/ja/specdojo/samples/cpd-sample.md「技術前提・制約」の箇条 5 / 指摘: 「応答欠落時に…店主代表が残った記録・紙面を照合する」としているが、上位図は印字の結果不明では店番担当が控えと紙面を照合し、結果不明や訂正の判断は店主代表へ引き継ぐと分けている。照合する人が食い違っている / 直した案: 「店番中の利用者が残った記録と紙面を照合し、結果不明の取引は店主代表へ引き継ぐ」に分けて直した。判断の担い手は直後の箇条（店主代表が販売・保留・回復の判断を担う）のままにした / 根拠: docs/ja/specdojo/samples/cnd-sample.md の Person 表、External Software System 表、検証対象表の「印刷基盤の不在・結果不明」の行 / 印: 要判断（「店番中の利用者」は本書で未定義の言い方のため、上位図の「店番担当」を本書でも定義して使うかを人が決める）

## 4. 進め方と実践の型の適用

根拠にした資料は、上位図 `cnd-sample`、`prj-overview-sample`、`gl-sample`、用語集、共通サンプル文脈である。規範が食い違う箇所は rulebook と上位図を正とし、sample 側だけを直した。相手側の文書は変更していない。検証では `npx prettier --check` が通り、runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も通った。変更対象に該当しない検査は `not_applicable` だった。plan に展開された grade の finding と condense の finding はなく、未解消の finding もない。
