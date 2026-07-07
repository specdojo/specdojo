---
specdojo:
  id: prj-0001:xer-t-launch-pm-quality-management-plan-120
  type: exec-result
  task_id: T-LAUNCH-pm-quality-management-plan-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: exec/plans/T-LAUNCH-pm-quality-management-plan-120-plan.md
  started_at: "2026-06-29T18:23:14.577Z"
  completed_at: "2026-07-01T14:56:51.106Z"
  agent: claude-edit-agent
  approach: sample-maintenance
  targets:
    - prj-0001:pm-quality-management-plan
    - pm-quality-management-plan-sample
---

# Edit Result

## 1. 実施内容

`docs/ja/specdojo/samples/pm-quality-management-plan-sample.md` を、実成果物・rulebook・sample-authoring-standard を根拠に最終調整した。主な変更点は以下のとおり。

- **品質目標（§2）**: `計画化可能性`（PM が計画管理に使える粒度の確認）と `生成物整合`（generated 成果物が正本と矛盾しない）の 2 行を追加し、rulebook が推奨する 7 項目をカバーした。
- **レビュー種別（§3.1）**: `AI 利用レビュー`（rulebook / recipe / sample / template の参考資料更新時に実施する種別）を追加し、5 種別に拡充した。
- **品質メトリクス（§4）**: rulebook が推奨する 8 指標のうち不足していた `YAML schema 検証`、`docs build 検証`、`文書間矛盾` の 3 行を追加した。
- **検査基準（§5.1）**: 「成果物を完了または公開候補として扱うには、次の条件を満たすこと。」の導入文を追加した。
- **品質上の役割分担（§6）**: pm-plan-sample と整合させ、`DEV`（技術的変更の実現可能性確認）と `UX`（利用者導線・読みやすさ確認）の 2 行を追加し、8 Role code に統一した。
- **関連ドキュメント（§7）**: `区分` 列（上位計画・委譲先・正本・管理台帳・生成ビュー）を追加し、実成果物の構造を踏まえた形に再構成した。サンプル corpus に存在するファイルへは wikilink を使用し、PJR のみバッククォートで仮置きした。
- **見直し条件（§8）**: `rulebook / recipe / sample を追加・変更した` トリガーを追加し、AI 利用レビュー観点との接続を示した。
- **未決事項（§9）**: `docs build の実行タイミング`（主要成果物更新ごと vs 公開前集約）を追加した。

prettier 整形および markdownlint による静的検査を実施し、エラーなしを確認した。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/pm-quality-management-plan-sample.md`

## 3. 申し送り

- `pm-decision-log-sample.md` はサンプル corpus に存在しないため、`§7 関連ドキュメント` の生成ビュー例として含めなかった。必要であれば作成後に追記する。
- pm-communication-plan-sample.md の存在は `ls` 結果で確認済みだが、wikilink ターゲットの id が `pm-communication-plan-sample` であることは未検証。リンク切れが発生した場合はバッククォートへ切り替えること。

## 4. 参考資料の活用

### 根拠とした成果物・標準

| 文書                                                                                                 | 用途                                                                                                                        |
| ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `docs/ja/projects/prj-0001/030-project-management/010-management-plan/pm-quality-management-plan.md` | 実成果物。追加すべき品質目標・レビュー種別・メトリクス・役割・見直し条件の根拠とした                                        |
| `docs/ja/specdojo/rulebooks/pm-quality-management-plan-rulebook.md`                                  | 必須項目・禁止事項・推奨指標の正本。不足していた項目の追加基準とした                                                        |
| `docs/ja/specdojo/standards/sample-authoring-standard.md`                                            | sample の構成原則・記述ガイドの正本。「最小完成例」の原則を維持しながら必須項目を充足させた                                 |
| `docs/ja/projects/prj-0001/030-project-management/010-management-plan/pm-plan.md`                    | depends_on 成果物。計画化可能性の品質目標定義と役割分担（DEV・UX 含む 8 Role code）の根拠とした                             |
| `docs/ja/specdojo/samples/pm-plan-sample.md`                                                         | based_on サンプル。役割分担の行順序（PO → PM → BA → ARC → DEV → QE → UX → OPS）と関連ドキュメントの wikilink 記法を参照した |

### 改訂した記述と根拠

- **計画化可能性の追加**: rulebook §6.2 が「扱う観点に計画化可能性を含める」と推奨（実成果物でも採用）。PM ロールの重視観点（exec plan §3）とも整合。
- **生成物整合の追加**: rulebook §6.2 推奨かつ実成果物で採用。生成物管理（§5.3）との対応を示す最小例として必要と判断。
- **AI 利用レビューの追加**: 実成果物に存在し、rulebook が AI 利用可能性を品質目標として要求。参考資料（rulebook / sample）の更新が頻繁に発生する本プロジェクトでは欠かせないレビュー種別と判断。
- **YAML schema 検証・docs build 検証・文書間矛盾の追加**: rulebook §6.4 が推奨する 8 指標のうち不足分。実成果物でも採用済み。
- **DEV・UX の追加**: pm-plan-sample が 8 Role code（DEV・UX 含む）を採用しており、品質管理計画サンプルの役割分担もこれと整合させる必要があると判断。
- **区分列の追加（関連ドキュメント）**: 実成果物の構造（上位計画・委譲先・正本・管理台帳・生成ビュー）を踏まえた参照方針を示す完成例として必要と判断。
- **rulebook / recipe / sample トリガーの追加**: 参考資料のメンテナンスサイクルを見直し条件に含めることは rulebook §6.8 の推奨に該当し、実成果物でも採用済み。

### 維持した記述

- 既存の品質目標 5 行（文書構造適合・文書間整合・AI 利用可能性・公開適性・レビュー指摘残）は根拠と整合しており変更なし。
- レビュー手順（§3.2）・是正プロセス（§5.2）・生成物の扱い（§5.3）の本文は実成果物・rulebook と整合しており維持した。
- 未決事項の既存 2 行（公開前チェックリスト・リンクチェック自動化）は実成果物でも継続する論点であり維持した。

### 矛盾時の判断

- 役割分担の Role code スタイル（plain text vs バッククォート）について、pm-plan-sample は plain text を採用しており、本サンプルも plain text に統一した（実成果物はバッククォートを使用）。サンプル corpus 内の一貫性を優先し、rulebook に明示ルールがないため維持とした。
