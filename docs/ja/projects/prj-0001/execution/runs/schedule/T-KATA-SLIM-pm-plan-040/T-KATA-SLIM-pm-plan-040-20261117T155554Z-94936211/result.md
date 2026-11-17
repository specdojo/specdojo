---
specdojo:
  id: prj-0001:xer-t-kata-slim-pm-plan-040-20261117t155554z-94936211
  type: exec-result
  task_id: T-KATA-SLIM-pm-plan-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-pm-plan-040/T-KATA-SLIM-pm-plan-040-20261117T155554Z-94936211/plan.md
  started_at: "2026-11-17T15:56:00.364Z"
  completed_at: "2026-11-17T16:29:06.565Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - prj-0001:pm-plan
    - specdojo:pm-plan-rulebook
---

# Edit Result

## 1. 実施内容

- `docs/ja/specdojo/rulebooks/pm-plan-rulebook.md` から、どの成果物にも共通する運用の記述を外し、共通の正本への参照に置き換えた。
- 全体方針に「共通の運用」を1項目だけ置いた。役割の割当は適用先のメンバー定義、status・承認・改訂と廃止・未決事項の引き継ぎは `docs/ja/specdojo/standards/document-metadata-standard.md` を参照する。
- 章名、必須・条件付きの区分、Frontmatter は維持した。軽量・拡張プロファイル、標準7列、構成管理・技術依存、条件 ID の追跡、良い例・悪い例などの型固有の判断基準も残した。
- 大きさは、空白・改行を除いた全文の文字数で変更前 5,093 字から変更後 3,978 字になった。前比 78.11%（21.89% 削減）で、目安の8割以下に収まっている。sld 試行と同じく表の区切り行を除く場合は 4,828 字から 3,665 字（前比 75.91%）になる。
- 成果物本体、recipe、template、sample、grade サイドカー、result は変更していない。
- executor が実行した整形・差分・秘密情報の検査は成功した。runner の `lint:fm`、`lint:md`、`lint:mermaid`、`lint:d2`、`validate:schema`、`test:unit`、`test:integration` も成功した。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/pm-plan-rulebook.md`: 共通運用の記述を外し、共通の正本への参照にした。外したのは、役割の共通定義、Agent の最終判断禁止、改訂・廃止の手順、未決事項の判断時期・担当・台帳移管の手順、共通禁止事項の再掲。未決事項は論点・現状・当面の扱い・決定後の管理行とゲートへの影響に整理した。全見出しと必須・条件付きの区分は維持した。

## 3. 申し送り

- recipe・template・sample に追従案がある。recipe は全体手順6・未決事項・仕上げチェックから、判断時期・判断者の必須化と期限超過時の台帳移管手順を外す。template は未決事項表の「決定時期」「判断者」を外す。sample も同様に共通の権限説明、置き換え・廃止の運用段落、判断時期・判断者列を整理する。これらは本タスクでは編集していない。
- 共通標準への補足案がある。`document-metadata-standard.md` の承認の記述から `people-and-organization-definition-standard.md` の「Agent 委任方針」「整合性ルール」への参照を追加する。未決事項の引き継ぎ規定は、通常の計画作成中に期限超過した未決事項にも適用することを明示する。共通標準自体は変更していない。
- grade の再採点は実施していない。plan に展開された finding はなく、確認した rulebook の既存 grade の findings も空だった。
- result の実施内容・変更ファイルへ記録: 編集は docs/ja/specdojo/rulebooks/pm-plan-rulebook.md のみ。全体方針に「共通の運用」を1項目置き、役割割当は適用先のメンバー定義、status・承認・改訂と廃止・未決事項の引き継ぎはドキュメントメタ情報標準へ参照化した。役割の共通定義、Agent の最終判断禁止、改訂・廃止手順、未決事項の判断時期・担当・台帳移管手順、共通禁止事項の再掲を削除した。成果物本体・recipe・template・sample・grade サイドカー・result は変更していない。
- result の文字数記録: Frontmatter・表の区切り行を含む全文から空白・改行を除外すると、変更前5,093字、変更後3,978字、前比78.11%（21.89%削減）。sld 試行と同じく表の区切り行も除く場合は4,828字から3,665字、前比75.91%。全見出し、必須・条件付きの区分、Frontmatter は維持した。
- 進め方と実践の型の適用へ記録: 根拠規範は docs/ja/specdojo/standards/rulebook-authoring-standard.md、document-metadata-standard.md、people-and-organization-definition-standard.md、共通 exec 規約、defaults/pm-review-viewpoints.yaml の vp-arc-conciseness。改訂の手本は controls/project-register/pjr-8s4t-sld-kata-slim-pilot.md の「他の型へ広げるときの一覧」と sld-rulebook.md。
- 確認した実態・評価根拠: prj-0001 の pm-plan.md・pm-organization.md・pm-roles.yaml、宣言先の pm-plan-recipe.md・pm-plan-template.md・pm-plan-sample.md、T-PROJECT-KATA-pm-plan-050 の result、T-PROJECT-KATA-pm-plan-090 の review result、execution/grade/results/specdojo.pm-plan-rulebook.yaml。plan 展開 finding はなく、確認した rulebook の既存 grade も findings は空。過去 review は grade-stale のため現在の品質証明には使わず、構成管理・技術依存・RACI・条件 ID の追跡要件を維持する参考とした。再採点は実施していない。
- 維持した判断情報: 軽量・拡張プロファイル、標準7列と結合 ID による列統合条件、現金支出・作業時間・継続運用負荷の区別、構成管理・技術依存の検知と対応、条件 ID と証跡の照合、未達・材料不足時の保留と是正後の再確認、例外の範囲、追従タスク、各節の良い例・悪い例。未決事項は論点・現状・当面の扱い・決定後の管理行とゲートへの影響へ整理した。代表成果物の `based_on` は概要・スコープ・成功基準を直接宣言していないが、直接根拠の追跡に必要な rulebook 要件として維持し、成果物や依存関係は本タスクでは変更していない。
- 対象外ファイルの追従案: recipe の全体手順6・未決事項・仕上げチェックから判断時期・判断者の必須化と期限超過時の台帳移管手順を外し、論点・当面の扱い・影響先へ合わせる。役割・Agent・承認の共通規則も再掲しない。template は未決事項表の「決定時期」「判断者」を外し、影響先を記入できる形へ変更する。sample は共通の権限説明、置き換え・廃止の運用段落、未決事項表の判断時期・判断者列と期限超過時の移管段落を整理し、管理行・ゲートに固有の条件と責任は残す。これらは未編集で、構造・必須項目・禁止事項の判断では改訂 rulebook を正とした。
- 共通標準への補足案: document-metadata-standard.md の承認に関する記述から、people-and-organization-definition-standard.md の「Agent 委任方針」「整合性ルール」への参照を追加すると、公開可否や最終承認の共通規則を辿りやすい。また、現状の未決事項引き継ぎ規定は改訂・廃止の過程を対象としているため、通常の計画作成中に期限超過した未決事項にも適用することを明示する案がある。共通標準自体は変更していない。
- 適用外の検証: `npm run validate:schema:file`（変更は Markdown rulebook のみで、YAML の変更がないため。）
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/specdojo/rulebooks/ 配下のみで、docs/ja/projects/ 配下の成果物を変更していないため。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票および既存の plan・result を変更していないため。）

## 4. 進め方と実践の型の適用

根拠にした規範は次のとおり。`docs/ja/specdojo/standards/rulebook-authoring-standard.md`、`document-metadata-standard.md`、`people-and-organization-definition-standard.md`、共通 exec 規約、`defaults/pm-review-viewpoints.yaml` の `vp-arc-conciseness`。改訂の手本は `pjr-8s4t-sld-kata-slim-pilot.md` の「他の型へ広げるときの一覧」と `sld-rulebook.md` である。確認した実態は、prj-0001 の `pm-plan.md`・`pm-organization.md`・`pm-roles.yaml`、宣言先の recipe・template・sample、`T-PROJECT-KATA-pm-plan-050` の result、`T-PROJECT-KATA-pm-plan-090` の review result、`specdojo.pm-plan-rulebook.yaml` の grade result である。過去の review は grade-stale のため、現在の品質証明には使わなかった。構成管理・技術依存・RACI・条件 ID の追跡要件を維持する参考にした。代表成果物の `based_on` は概要・スコープ・成功基準を直接宣言していない。ただし直接根拠の追跡に必要な rulebook 要件として維持し、成果物や依存関係は変更していない。構造・必須項目・禁止事項で recipe・template・sample と食い違う点は、改訂した rulebook を正とした。
