---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-stc-index-040-20261118t095759z-00bfc3ba
  type: exec-result
  task_id: T-KATA-SLIM-2-stc-index-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-stc-index-040/T-KATA-SLIM-2-stc-index-040-20261118T095759Z-00bfc3ba/plan.md
  started_at: "2026-11-18T09:58:50.094Z"
  completed_at: "2026-11-18T10:27:59.597Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - stc-index
    - specdojo:stc-index-rulebook
---

# Edit Result

## 1. 実施内容

- `stc-index-rulebook` から、どの成果物にも共通する文書運用の記述を外し、共通の正本への参照に置き換えた。
- 全体方針に「共通の運用」を1項目だけ置いた。役割は適用先のメンバー定義、status・承認・改訂と廃止・未決事項の引き継ぎは `document-metadata-standard.md` を参照する。
- 空白を除いた文字数は7,450字から5,742字になった(77.07%)。目安の8割以下を満たす。
- 本文9章の名称・順序・必須/任意の区分は変えていない。
- finding の状況は次のとおり。F001、F002、F004 は解消した。F003 は sample が編集対象外のため未解消で、後続の sample-maintenance に引き継ぐ。
- 指定成果物 `docs/ja/product/080-test-specs/050-system-test-catalog/stc-index.md` は存在しない。成果物は新規作成していない。
- runner の検証では lint:fm、lint:md、lint:mermaid、lint:d2、validate:schema、test:unit、test:integration が通過した。lint:ts と typecheck は変更種別により対象外。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/stc-index-rulebook.md`: 共通運用の記述を整理して正本参照にした(90行追加、189行削除)。役割の表と段落、status・承認・改訂と廃止の手順、共通 Frontmatter 表、共通規約と重複する禁止事項を、全体方針の「共通の運用」1項目に置き換えた。メタ情報例は `specdojo` 名前空間と rulebook 指定に修正した。本本文構成の表は9行の単一表にして、崩れていた表(F004)を直した。F001 の対応として、recipe と template を not-needed とし、その理由を全体方針に記載した。型固有の分割順・分割目安、採用基準、分配表、環境固定・外部依存・データ管理、観測点・証跡・P0/P1/P2 判定、ケース表の列とID規則、禁止事項は維持した。トレース列は `stc-rulebook` の TR-xx 参照と整合させた。

## 3. 申し送り

- F003(sample の見出し構成が必須構成と乖離)は未解消。次のアクション: sample-maintenance で `stc-index-sample.md` を、必須8章と任意の「メモ / 将来課題」に沿う完成例へ改訂する。矛盾時は rulebook を正とし、sample に合わせて必須構成は緩めていない。
- 共通の正本に追記すべき記述はない。recipe・template・sample は commit の対象外のため変更していない。
- 変更ファイルは docs/ja/specdojo/rulebooks/stc-index-rulebook.md のみ。成果物本体・recipe・template・sample・grade サイドカー・result は変更していない。
- 空白（改行を含む）を除いた文字数は7,450字→5,742字、77.07%。sld 試行と同じく表の区切り行も除く場合は7,054字→5,444字、77.18%。全見出し、本文9章の名称・順序・必須／任意区分は変更していない。
- 判断根拠: sld-rulebook.md、pjr-8s4t-sld-kata-slim-pilot.md の展開一覧、rulebook-authoring-standard.md、document-metadata-standard.md、test-document-scope-standard.md、sample-authoring-standard.md、id-and-file-naming-standard.md、関連 frontmatter schema、ryu-guide.md、共通レビュー観点、対象 rulebook・sample・grade result、stc-rulebook.md の関連規定を照合した。
- 全体方針に「共通の運用」を1項目設け、役割は適用先のメンバー定義、status・承認・改訂と廃止・未決事項の引き継ぎはドキュメントメタ情報標準へ委譲した。共通 Frontmatter 表を参照に置き換え、メタ情報例を specdojo 名前空間・rulebook 指定に修正した。ファイル名の既定と表示名の配置も共通標準に合わせた。
- 型固有の分割順・分割目安、採用基準、分配表、環境固定・外部依存・データ管理、観測点・証跡・P0/P1/P2 判定、ケース表の列とID規則、禁止事項を維持した。トレース列は stc-rulebook の TR-xx 参照と整合させた。未決事項には論点と影響を求める。includes による記法 rulebook の取り込みはない。
- F001 は解消。章構成・列定義・分割／採用／分配の判断手順が本書で完結するため、recipe・template を not-needed と判断し理由を全体方針に記載した。F002 は現行 sample の type が既に test のため解消済みと確認した。F004 は本文構成表を9行の単一表に修正して解消した。
- F003 は未解消で、sample が編集対象外のため後続の sample-maintenance へ引き継ぐ。stc-index-sample.md を、rulebook の必須8章と任意の「メモ / 将来課題」に従う完成例へ改訂する。対象分割、除外理由と代替、観点・条件の採否と分配、境界／環境、ケース表の共通列を具体化し、入力情報や記述内容の説明だけの構成を置き換える。矛盾時は rulebook を正とし、sample に合わせて必須構成を緩めていない。
- 指定成果物 docs/ja/product/080-test-specs/050-system-test-catalog/stc-index.md は存在しない。対象 rulebook・finding・関連規範・sample で判断可能な範囲を改訂し、成果物は新規作成していない。共通正本への追記案はない。親 runner 指定の lint・schema・型検査・テストは実行を委任した。見出し・必須区分・参照先ID・変更範囲を照合済み。
- 適用外の検証: `npm run validate:schema:file`（変更対象は Markdown rulebook のみで、YAML ファイルの変更がない。）
- 適用外の検証: `npm run validate:history-links`（履歴蓄積ファイルおよび既存 plan・result を変更していない。）
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/specdojo/rulebooks/ 配下のみで、docs/ja/projects/ 配下の成果物変更がない。）

## 4. 進め方と実践の型の適用

rulebook-maintenance。sld の試行(`pjr-8s4t-sld-kata-slim-pilot`)と改訂済みの `sld-rulebook.md` を手本に、`rulebook-authoring-standard.md`、`document-metadata-standard.md`、`test-document-scope-standard.md`、`sample-authoring-standard.md` などと照合した。共通運用は正本参照に集約し、型固有の判断基準・区分・良い例悪い例・禁止事項は残した。includes で取り込む記法 rulebook はなく、章名と必須/任意の区分は変えていない。
