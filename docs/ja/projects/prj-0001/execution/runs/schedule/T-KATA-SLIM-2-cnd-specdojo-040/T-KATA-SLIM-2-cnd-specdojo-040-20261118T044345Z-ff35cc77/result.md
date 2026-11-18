---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-cnd-specdojo-040-20261118t044345z-ff35cc77
  type: exec-result
  task_id: T-KATA-SLIM-2-cnd-specdojo-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-cnd-specdojo-040/T-KATA-SLIM-2-cnd-specdojo-040-20261118T044345Z-ff35cc77/plan.md
  started_at: "2026-11-18T04:43:52.922Z"
  completed_at: "2026-11-18T05:13:33.762Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - cnd-specdojo
    - specdojo:cnd-rulebook
---

# Edit Result

## 1. 実施内容

- `cnd-rulebook` と、frontmatter の includes で取り込む記法の rulebook `cnd-mermaid-rulebook` から、文書共通の運用の記述を外し、全体方針の「共通の運用」1項目から共通正本を参照する形にした。
- 外した記述は、役割の表と段落、status・承認・公開・改訂廃止の手順、文書検査コマンドの業務検証への混入、台帳登録の段落、重複する用語表です。
- 残した記述は、関係表の標準5列、実行・配備単位の判断、正本と生成物、正常・異常時の結合確認、良い例・悪い例、型固有の禁止事項です。
- 大きさは、空白を除いた文字数で `cnd-rulebook` が6,168→4,873字（79.00%）、`cnd-mermaid-rulebook` が5,395→4,262字（79.00%）でした。目安の8割以下を満たします。
- executor 側の整形・差分検査と、runner 側の lint・schema・テストはすべて passed でした。typecheck と lint:ts は変更種別により `not_applicable` でした。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/cnd-mermaid-rulebook.md`: 重複する説明とスタイル指定を整理し、運用記述を共通参照へ置き換えた。「標準の色分け」とその配下見出しは、章名を保ったまま階層と番号末尾を記述標準に合わせた。形状・色・方向・ラベル・最小例・凡例は維持した。
- `docs/ja/specdojo/rulebooks/cnd-rulebook.md`: 役割・承認・status・公開条件・改訂廃止・台帳登録・文書検査の運用記述を外し、全体方針の「共通の運用」から `document-metadata-standard` などの正本を参照する形にした。役割専用の「作成・合意・保守の責任」は共通参照へ置換して削除した。用語表の重複を省いた。成果物に求める章名と必須・条件付きの区分は維持した。

## 3. 申し送り

- recipe・template・sample は commit の対象外のため変更していません。同じ方針で整理する変更案は、executor の handoff に記載されています。
- `cnd-mermaid-rulebook` の2026-10-29の grade には、現物と一致しない古い指摘があります。統合後の再評価で残存指摘を確認してください。
- 変更ファイル: docs/ja/specdojo/rulebooks/cnd-rulebook.md、docs/ja/specdojo/rulebooks/cnd-mermaid-rulebook.md の2件。成果物本体・recipe・template・sample・設定・grade result は変更していない。
- 判断根拠: xp/xep-common-conventions-template、rulebook-authoring-standard、document-metadata-standard、pm-review-viewpoints の vp-arc-conciseness、PJR-8S4T の「他の型へ広げるときの一覧」、改訂済み sld-rulebook を確認。cnd-specdojo、上位 cxd-specdojo、CND の recipe/template/sample、既存 grade result と照合した。
- 実施内容: 役割・承認・status・公開条件・改訂廃止・台帳登録の手順と文書検査コマンドを外し、全体方針の「共通の運用」へ集約した。用語表の重複を省き、Docker とコンテナ、物理配置と責務境界の違いは維持。関係表の標準5列、実行・配備単位の判断、正本と生成物、正常・異常時の結合確認、良い例・悪い例、型固有の禁止事項を残した。
- 章構成: 成果物に求める章名と必須・条件付きの区分は維持した。役割専用の「作成・合意・保守の責任」は共通参照へ置換するため削除。Mermaid の「標準の色分け」と配下見出しは、章名を保ちつつ階層と番号末尾を記述標準に合わせた。Mermaid の形状・色・方向・ラベル・最小例・凡例は維持し、重複する説明とスタイル指定を整理した。
- 大きさ: Frontmatter・表の区切り行を含み、改行を含む全空白を除外して計測。cnd-rulebook は6,168→4,873字（79.00%）、cnd-mermaid-rulebook は5,395→4,262字（79.00%）。sld 試行と同じく表の区切り行も除く場合は、それぞれ5,731→4,491字（78.36%）、5,162→4,093字（79.29%）。Frontmatter、章名、必須区分、共通参照、文字数を Python で照合した。
- 後続の変更案: recipe の役割別確認・PJR転送・承認公開手順、template の概要の Role code 指示・「検証・承認前の確認」の運用欄・未決事項の担当と追跡欄、sample の役割段落・文書検査・台帳管理・承認公開と改訂手順を同じ方針で整理する。構造・必須項目・禁止事項で不一致がある場合は今回の rulebook を正とする。
- 共通正本の変更案: document-metadata-standard では PO の承認責務が主に廃止・置き換え、未決事項の引き継ぎが改訂・廃止の過程について記載されている。初版・通常改訂の内容承認と公開判断、承認対象と公開対象の一致、公開範囲の未決事項、初版からの課題引き継ぎも共通規則として明記する案を申し送る。rulebook-authoring-standard の各系統で役割分担を定義する指示も、今回の参照方針との整合を検討する。本段では正本を変更していない。
- 既存評価: CND 本体の2026-11-15の grade は finding なし。Mermaid の2026-10-29の grade には古い sample 欠落等、現物と一致しない指摘がある。今回の運用記述削減を優先し、役割・検査手順の追加や recipe/template の undecided 解消は行っていない。統合後の再評価で残存指摘を確認する。
- 適用外の検証: `npm run validate:schema:file`（変更対象は Markdown の rulebook のみで、YAML ファイルの変更がない。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は docs/ja/specdojo/rulebooks/ のみで、docs/ja/projects/ 配下の成果物に及ばない。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票、既存 plan/result などの履歴蓄積ファイルを変更していない。）

## 4. 進め方と実践の型の適用

rulebook-maintenance として、sld の試行の「他の型へ広げるときの一覧」と改訂済みの `sld-rulebook` を手本にしました。共通の運用は正本参照へ寄せ、型固有の判断基準・標準の列・良い例と悪い例・禁止事項は残しました。成果物本体と共通正本は変更していません。
