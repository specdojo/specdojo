---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-itc-index-040-20261118t093637z-81c29147
  type: exec-result
  task_id: T-KATA-SLIM-2-itc-index-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-itc-index-040/T-KATA-SLIM-2-itc-index-040-20261118T093637Z-81c29147/plan.md
  started_at: "2026-11-18T09:36:47.392Z"
  completed_at: "2026-11-18T10:06:37.270Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - itc-index
    - specdojo:itc-index-rulebook
---

# Edit Result

## 1. 実施内容

- itc-index-rulebook から、どの成果物にも共通する文書運用の記述を外し、共通の正本への参照に置き換えた。共通の運用は全体方針の「共通の運用」1項目に集約した。役割は適用先のメンバー定義、status・承認・改訂と廃止・未決事項の引き継ぎは `document-metadata-standard` を参照する。
- 文書品質の検査（整形・lint）は業務の検証から分離した。章の番号・名称・順序と必須・条件付きの区分、ケース表の4必須列と6推奨（運用必須）列の順序、型固有の判断基準は維持した。
- 空白除外文字数は文書全体（Frontmatter・コード例込み）で10,084文字から7,603文字になった。変更前の75.40%で、目安の8割以下を満たす。
- F001（ID固定の指定が命名慣習と矛盾）は解消した。プロダクト文書は `itc-index`、プロジェクト文書は `&lt;project-id&gt;:itc-index` と命名標準に沿って明示した。共通スキーマと矛盾していた title メタ項目の指定は本文 H1 に直した。
- F002（参照サンプルが必須構成に従っていない）は未解消で、sample は本段の編集対象外のため申し送りとした。
- 整形と空白差分の検査、runner の lint・schema・unit・integration の検査は合格した。executor が適用外とした検査は理由付きで記録されている。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/itc-index-rulebook.md`: 共通の運用（役割の表と段落、status・承認・改訂と廃止、文書品質検査を業務検証に入れる記述、未決事項の管理台帳列、言い直しだけの用語表、共通規約と重複する禁止事項）を削除し、全体方針の1項目から共通正本を参照する形にした。ID の命名は命名標準に沿って整理し、title メタ項目の指定は H1 に修正した。必須の rulebook 指定と `specdojo` 名前空間を例示に反映した。内部小節は対象外判断の部分例へ集約した。全体で69行追加・199行削除（70 insertions, 199 deletions）。

## 3. 申し送り

- F002 は未解消。参照先の `docs/ja/specdojo/samples/itc-index-sample.md` は必須の9章と固定順序に従っていない。次の sample-maintenance で、必須9章と任意の「メモ / 将来課題」、分割・対象外・採用分配・依存境界・環境データ・共通列の具体例を揃えて再評価する。
- 指定された根拠成果物 `docs/ja/product/080-test-specs/030-internal-integration-test-catalog/itc-index.md` は worktree に存在しなかった。`dct-test-specs.yaml` の宣言、`itc-rulebook`、`itc-index-sample`、評価記録を照合して判断した。成果物本体と評価サイドカーは変更していない。
- 共通正本への追加提案はない。recipe・template は undecided の宣言を維持した。includes で取り込む記法の rulebook はなかった。
- 変更ファイルは docs/ja/specdojo/rulebooks/itc-index-rulebook.md のみ。共通の運用を全体方針の1項目に集約し、役割は適用先のメンバー定義、status・承認・改訂廃止・未決事項の引き継ぎはドキュメントメタ情報標準を参照する形にした。整形・lint は業務の検証から分離した。
- 空白除外文字数は文書全体（Frontmatter・コード例込み）で10,084文字→7,603文字。変更前の75.40%、24.60%削減。本文の10章の番号・名称・順序・必須区分、ケース表の4必須列と6推奨（運用必須）列の順序を維持した。
- 判断根拠として docs/ja/projects/prj-0001/controls/project-register/pjr-8s4t-sld-kata-slim-pilot.md の横展開一覧、sld-rulebook、rulebook-authoring-standard、document-metadata-standard、id-and-file-naming-standard、ryu-guide のメンテナンス手順、共通レビュー観点の vp-arc-conciseness・vp-qe-omissions-consistency・vp-qe-kata-conformance を確認した。
- 根拠成果物の指定パス docs/ja/product/080-test-specs/030-internal-integration-test-catalog/itc-index.md は worktree に存在しなかった。dct-test-specs.yaml の対象宣言、itc-rulebook、itc-index-sample、および specdojo.itc-index-rulebook.yaml・specdojo.itc-index-sample.yaml の評価記録を照合して改訂を判断した。成果物本体と評価サイドカーは変更していない。
- F001は解消。idを一律固定とせず、命名標準に従ってプロダクト文書は itc-index、プロジェクト文書は &lt;project-id&gt;:itc-index と明示した。共通スキーマと矛盾する title メタ項目の指定を本文H1へ直し、必須の rulebook 指定と specdojo 名前空間を例示にも反映した。
- F002は未解消として申し送る。参照先 docs/ja/specdojo/samples/itc-index-sample.md は必須の9章と固定順序に従っていない。sample は本段の編集対象外のため変更せず、rulebook を正として維持した。次の sample-maintenance で、必須9章・任意の「メモ / 将来課題」、分割・対象外・採用分配・依存境界・環境データ・共通列の具体例を揃え、再評価する。recipe/template は undecided の宣言を維持した。
- 成果物の章名・必須区分は変更していない。rulebook 内の「サンプル（最小）」章は残し、ガイドを繰り返す内部小節を対象外判断の部分例へ集約した。これは完成例の再掲を避け、自己完結した最小コード例とする執筆標準に従う変更。型固有の判断・例外・合格条件はガイドと例示に維持した。includes で取り込む記法 rulebook はない。
- 共通正本への追加提案と保護設定の変更は不要。result は executor 段階の指示に従い編集していないため、reporter は本報告の実施内容・変更ファイル・判断根拠・文字数・F002の次アクションを result に記録すること。lint・テストなど指定済みの親検証は runner に委ねた。
- 適用外の検証: `npm run validate:schema:file`（変更はMarkdown rulebookのみで、YAML/YMLファイルを変更していない。）
- 適用外の検証: `npm run validate:catalog`（executorの変更は docs/ja/specdojo/rulebooks/ 配下のみで、docs/ja/projects/ 配下の成果物変更がない。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票および既存のplan/resultを変更していない。）

## 4. 進め方と実践の型の適用

rulebook-maintenance。判断の根拠は次のとおり。 - sld の試行（`pjr-8s4t-sld-kata-slim-pilot` の横展開一覧）と改訂済み `sld-rulebook`。 - `rulebook-authoring-standard`、`document-metadata-standard`、`id-and-file-naming-standard`、`ryu-guide` のメンテナンス手順。 - 評価観点 `vp-arc-conciseness`・`vp-qe-omissions-consistency`・`vp-qe-kata-conformance`。 rulebook を正とし、共通運用は正本参照へ置き換えた。型固有の判断基準、良い例・悪い例、型固有の禁止事項、業務の受入確認は維持した。章名と必須区分は変えていない。F001 は解消、F002 は sample 側の不備のため未解消として次のアクションを残した。
