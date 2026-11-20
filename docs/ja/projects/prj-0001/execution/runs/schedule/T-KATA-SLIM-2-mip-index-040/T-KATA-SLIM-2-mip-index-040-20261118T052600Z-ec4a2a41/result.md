---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-mip-index-040-20261118t052600z-ec4a2a41
  type: exec-result
  task_id: T-KATA-SLIM-2-mip-index-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-mip-index-040/T-KATA-SLIM-2-mip-index-040-20261118T052600Z-ec4a2a41/plan.md
  started_at: "2026-11-18T05:26:08.402Z"
  completed_at: "2026-11-18T05:55:05.557Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - prj-0001:mip-index
    - specdojo:mip-index-rulebook
---

# Edit Result

## 1. 実施内容

- `mip-index-rulebook` から、どの成果物にも共通する運用の記述を外し、共通の正本への参照に置き換えた。
- 必須9章と移行固有の判断条件は維持した。空白を除いた文字数は6,894字から5,492字（79.66%）になり、目安の8割以下を満たす。
- F001・F002 は、Frontmatter の記述を `specdojo:` 名前空間と必須の `rulebook` に合わせ、`title` の必須指定を外して解消した。F003 は、現行 sample が必須9章の名称・順序と一致することを確認した。
- 変更したのは rulebook だけである。成果物本体、recipe、template、sample、grade サイドカー、result は変更していない。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/mip-index-rulebook.md`: 役割、status・承認・改訂と廃止、文書品質検査、未決事項の管理台帳など、共通運用の記述を削除した。全体方針に「共通の運用」を1項目置き、`docs/ja/specdojo/standards/document-metadata-standard.md` への参照にした。共通 Frontmatter 表は正本参照に置換し、`specdojo:` 名前空間と必須の `rulebook` を本文と埋め込み例に明示した。`title` の必須指定も外し、文書名は H1 に移した。カットオーバーの推奨表には、既存の本文要件と sample にある失敗時の扱いの列を追加した。「サンプル（最小）」章は残し、内部の8.1〜8.9節を自己完結した Markdown コードブロックにまとめた。章名と必須・条件付きの区分、移行固有の判断基準と禁止事項は維持した。

## 3. 申し送り

- F003 の sample 旧 grade は、現行ファイルとハッシュが一致しない。runner 側の再評価で確認が必要である。
- `prj-0001:mip-index` の成果物本体が存在しなかったため、カタログと現行 sample を根拠に改訂した。
- 共通の正本への追記、recipe・template・sample の追加修正は不要と判断した。
- 変更ファイルは docs/ja/specdojo/rulebooks/mip-index-rulebook.md のみ。result・成果物本体・recipe・template・sample・gradeサイドカーは変更していない。includes の宣言はない。
- 判断根拠: rulebook-authoring-standard、document-metadata-standard、deliverable-frontmatter.schema.yaml、docs-structure-guide、pm-review-viewpoints の指定4観点、sld-rulebook、PJR-8S4Tの展開一覧、dct-migration-planning、現行mip-index-sample、rulebookとsampleのgrade結果を確認した。指定された prj-0001:mip-index の本体は存在しなかったため、カタログと現行sampleを根拠に改訂した。
- F001・F002: 共通Frontmatter表を正本参照に置換し、`specdojo:` 名前空間と必須の `rulebook` を本文・埋め込み例で明示した。`title` の必須指定を外し、文書名をH1へ移した。F003: 現行sampleは必須9章の名称・順序に一致する。sample用ID・ファイル名は成果物と区別する共通標準に従うことを明記した。sampleの旧gradeは現行ファイルとハッシュ不一致のため、runner側の再評価で確認する。
- 成果物の章名・必須区分は変更していない。移行実行・照合・GO判断の体制は型固有のため維持した。rulebookの「サンプル（最小）」章は維持し、内部の8.1〜8.9節を自己完結したMarkdownコードブロックへまとめた。生成する9章との対応を明示し、完成例の重複を減らすため。カットオーバーの推奨表に、既存の本文要件・sampleにある失敗時の扱い列を追加した。
- 文字数は空白・改行を除いて6,894→5,492字（79.66%）。表区切り行も除く試行と同じ計測では5,876→4,677字（79.59%）。共通正本への追記、recipe・template・sampleの追加修正、保護設定の変更は不要と判断した。親runner指定の検査は実行せず委ねた。
- 適用外の検証: `npm run validate:schema:file`（変更したファイルはMarkdownのみで、YAMLファイルの変更がない。）
- 適用外の検証: `npm run validate:catalog`（executorの変更は docs/ja/specdojo/rulebooks/ 配下のみで、docs/ja/projects/ 配下に変更がない。）
- 適用外の検証: `npm run validate:history-links`（executorによる履歴ファイルの変更がない。）

## 4. 進め方と実践の型の適用

rulebook-maintenance として、`rulebook-authoring-standard`、`document-metadata-standard`、`deliverable-frontmatter.schema.yaml`、`sld-rulebook`、PJR-8S4T の展開一覧、現行 sample、grade 結果を根拠に見直した。共通運用の記述は正本参照に置き換え、移行固有の判断基準、標準の列と章の受入条件、禁止事項は残した。F001・F002 は Frontmatter の記述を修正して解消した。F003 は現行 sample が必須9章の名称・順序に一致しており、rulebook 側の追加変更を要しなかった。`includes` の宣言はなく、同じ段で直す記法の rulebook はない。
