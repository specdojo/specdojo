---
specdojo:
  id: prj-0001:xer-t-kata-slim-br-task-selection-strategy-040-20261117t185630z-8b362bda
  type: exec-result
  task_id: T-KATA-SLIM-br-task-selection-strategy-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-br-task-selection-strategy-040/T-KATA-SLIM-br-task-selection-strategy-040-20261117T185630Z-8b362bda/plan.md
  started_at: "2026-11-17T18:56:38.183Z"
  completed_at: "2026-11-17T19:24:01.988Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - br-task-selection-strategy
    - specdojo:br-rulebook
---

# Edit Result

## 1. 実施内容

- `br-rulebook.md` から、どの成果物にも共通する文書運用の記述（役割の段落、status・承認・改訂と廃止の手順、未決事項の登録手順、共通規約と重複する禁止事項）を外し、全体方針に「共通の運用」を 1 項目だけ置いて正本への参照に置き換えた。
- 空白と改行を除いた文字数は、frontmatter と表の区切り行を含めて 5,096 字から 3,347 字（65.68%）になり、目安の 8 割以下を満たした。表の区切り行を除く sld 試行と同じ数え方では 4,954 字から 3,215 字（64.90%）である。
- 章名、必須・条件付きの区分、frontmatter は変更していない。型固有の判断基準、標準の列、良い例・悪い例、BR 固有の禁止事項は維持した。
- 成果物本体、recipe、template、sample、result は変更していない。
- executor が実行した整形（prettier）と `git diff --check` は成功した。runner の `lint:fm`、`lint:md`、`lint:mermaid`、`lint:d2`、`validate:schema`、`test:unit`、`test:integration` も成功した。`lint:ts` と `typecheck` は対象外の変更種別のため `not_applicable` である。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/br-rulebook.md`: 役割の段落、status の維持と昇格・承認・改訂と廃止の手順、未決事項の台帳登録の段落、共通規約と重複する禁止事項を削除した。全体方針に「共通の運用」を 1 項目追加し、役割は適用先のメンバー定義、その他の運用は `document-metadata-standard.md` を参照する形にした。未決事項は、論点・下流への影響・当面の扱い・確定に必要な根拠と、決定後に反映する入力・規則・判定例を求める形に変更した。判定順・境界値・項目ごとの欠損・同順位・例外競合・期待結果の要件、標準列、良い例・悪い例、BR 固有の禁止事項は維持した。

## 3. 申し送り

- 後続の変更案（recipe・template・sample は今回の commit 対象外のため未変更）: `br-template.md` の「メモ / 将来課題」から判断依頼先・判断時点の列と承認条件の記入指示を外し、論点・影響・当面の扱い・必要な根拠に合わせる。
- 後続の変更案: `br-recipe.md` で判断依頼先・判断時点を本文に求める箇所も同じ方針に合わせる。
- 後続の変更案: `br-sample.md` 末尾の業務承認依頼の運用文を外す。その際は、予約控除・等号・予約超過・入力不備の業務確認観点を保持する。矛盾時は改訂した rulebook を正とする。
- 関連標準の変更案: `rulebook-authoring-standard.md` の「各 rulebook は具体的な追従対象と役割分担を定義する」という要求を、共通運用の参照で足りる旨へ整合させる。今回は明示された編集方針を優先し、標準は変更していない。共通運用は `document-metadata-standard.md` の既存記述で賄えるため、追記は不要と判断した。
- 変更ファイルは docs/ja/specdojo/rulebooks/br-rulebook.md のみ。役割の段落、status・承認・改訂廃止の手順、未決事項の登録手順、共通規約と重複する禁止事項を外し、全体方針の「共通の運用」1 項目に集約した。役割は適用先のメンバー定義、その他の運用はドキュメントメタ情報標準を参照する。成果物本体・recipe・template・sample・result は変更していない。
- 文字数は frontmatter と表の区切り行を含め、空白・改行を除いて編集前 5,096 字、編集後 3,347 字、比率 65.68%。sld 試行と同じく表の区切り行も除く場合は 4,954 字から 3,215 字、比率 64.90%。章名と全内容必須の区分、frontmatter は変更していない。
- 判断根拠は rulebook-authoring-standard.md、document-metadata-standard.md、pm-review-viewpoints.yaml の `vp-arc-conciseness`、PJR-8S4T の対応結果、sld-rulebook.md、br-task-selection-strategy.md、br-recipe.md、br-template.md、br-sample.md、成果物カタログおよび BR と rulebook の grade result。両 grade result の内容ハッシュは編集前の文書と一致した。rulebook の finding はなし。判定順・境界値・項目ごとの欠損・同順位・例外競合・期待結果の要件、標準列、良い例・悪い例、BR 固有の禁止事項を維持した。
- 未決事項は論点・下流への影響・当面の扱い・確定に必要な根拠と、決定後に反映する入力・規則・判定例を求める形に変更した。成果物の grade finding F001 の登録先・担当の追跡は共通標準へ委譲し、他の業務上の未決事項は判断基準を削らず維持した。先行 BPS は未作成だが、本タスクは rulebook の運用記述の整理であり、業務上の未決事項を推測で確定する必要はない。
- 後続変更案: br-template.md の「メモ / 将来課題」から判断依頼先・判断時点の列と承認条件の記入指示を外し、論点・影響・当面の扱い・必要な根拠へ合わせる。br-recipe.md で判断依頼先・判断時点を本文に求める箇所も同方針に合わせる。br-sample.md 末尾の業務承認依頼の運用文を外す際は、予約控除・等号・予約超過・入力不備の業務確認観点を保持する。矛盾時は改訂した rulebook を正とする。
- 共通運用はドキュメントメタ情報標準の「文書の改訂・廃止とライフサイクル変更管理」「成果物の値制約」で賄え、追記は不要と判断した。関連標準の変更案として、rulebook-authoring-standard.md の「各 rulebook は具体的な追従対象と役割分担を定義する」という要求を、共通運用の参照で足りる旨へ整合させることを提案する。今回は明示された編集方針を優先し、標準は変更していない。
- 適用外の検証: `npm run validate:schema:file`（変更ファイルは Markdown の rulebook のみで、YAML ファイルの変更がない。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は docs/ja/specdojo/rulebooks/ 配下のみで、docs/ja/projects/ 配下に及ばない。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票、plan、result などの履歴ファイルを変更していない。）

## 4. 進め方と実践の型の適用

rulebook-maintenance として、`br-rulebook.md` の運用記述を整理した。根拠は `rulebook-authoring-standard.md`、`document-metadata-standard.md`、`pm-review-viewpoints.yaml` の `vp-arc-conciseness`、PJR-8S4T の対応結果、改訂済みの `sld-rulebook.md`、`br-task-selection-strategy.md`、`br-recipe.md`、`br-template.md`、`br-sample.md`、成果物カタログ、および BR と rulebook の grade result である。両 grade result の内容ハッシュは編集前の文書と一致しており、rulebook への finding はなかった。先行の BPS は未作成だが、本タスクは運用記述の整理であり、業務上の未決事項を推測で確定する必要はないと判断した。成果物の grade finding F001 の登録先・担当の追跡は共通標準へ委譲し、他の業務上の未決事項は判断基準を削らず維持した。
