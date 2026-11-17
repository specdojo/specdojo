---
specdojo:
  id: prj-0001:xer-t-kata-slim-bps-init-required-040-20261117t145429z-31cc7734
  type: exec-result
  task_id: T-KATA-SLIM-bps-init-required-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-bps-init-required-040/T-KATA-SLIM-bps-init-required-040-20261117T145429Z-31cc7734/plan.md
  started_at: "2026-11-17T14:54:35.335Z"
  completed_at: "2026-11-17T15:20:34.830Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - bps-init-required
    - specdojo:bps-rulebook
---

# Edit Result

## 1. 実施内容

- BPS rulebook から共通の運用の記述を外し、全体方針に「共通の運用」を1項目置いて、役割は適用先のメンバー定義、status・承認・改訂と廃止・未決事項の引き継ぎはドキュメントメタ情報標準を参照する形にした。
- 空白・改行を除いた文字数は6,544字から5,107字（78.04%）になり、目安の8割以下を満たした。表の区切り行も除くと6,086字から4,845字（79.61%）である。
- rulebook に合わせて recipe と template の未決事項も簡素化した。成果物本体、sample、grade サイドカー、result は変更していない。
- 検証は、executor の `prettier --check` と `git diff --check` が通過した。runner の `lint:fm`、`lint:md`、`lint:mermaid`、`lint:d2`、`validate:schema`、`test:unit`、`test:integration` も通過した。`lint:ts` と `typecheck` は変更種別により対象外である。

## 2. 変更ファイル

- `docs/ja/specdojo/recipes/bps-recipe.md`: rulebook を正として、未決事項の区分・決定者・決定時期の記述を除き、論点・影響・当面の扱いに合わせた。
- `docs/ja/specdojo/rulebooks/bps-rulebook.md`: 役割、status の昇格条件、承認、改訂と廃止、未決事項の管理台帳の列、共通の Frontmatter 規定と禁止事項の再掲を除き、共通の運用への参照に置き換えた。ID 規則に `T-01`・`S-01`・`E-01` を集約した（F002）。導入文と受入例は「補充基準」「補充依頼」「依頼数量」に統一した（F003）。完成判定は業務フローの照合手順に整理した。第2章は「位置づけと用語定義」から「位置づけ」に変えた。用語表8語は他の章で定義できるため削除した。本文要件8群の名称と必須・条件付きの区分は維持した。
- `docs/ja/specdojo/templates/bps-template.md`: rulebook に合わせて、未決事項の列から区分・決定者・決定時期を除き、論点・影響・当面の扱いにした。

## 3. 申し送り

- F001（完成判定に検査コマンドを示すこと）は未解消である。今回の方針と sld の試行に従い、業務の完成判定にはコマンドを加えず、共通の運用でリポジトリの検証に委ねた。次のアクションは、再評価でこの責務分担が受け入れられるかを確認することである。
- 対象の `bps-init-required.md` は確認できなかったため、成果物は作成していない。確認できた資料の範囲で rulebook を改訂した。共通の正本に追記すべき内容はないと判断した。
- result の実施内容・変更ファイルへ記録: docs/ja/specdojo/rulebooks/bps-rulebook.md は、全体方針に「共通の運用」を1項目設け、役割は適用先のメンバー定義、status・承認・改訂と廃止・未決事項の引き継ぎはドキュメントメタ情報標準へ委ねた。status の昇格条件、管理台帳の列、共通 Frontmatter 規定・禁止事項の再掲を除去し、完成判定を業務フローの照合手順へ整理した。docs/ja/specdojo/recipes/bps-recipe.md と docs/ja/specdojo/templates/bps-template.md は、rulebook を正として未決事項の区分・決定者・決定時期を除き、論点・影響・当面の扱いへ追従させた。成果物本体・sample・grade サイドカー・result は変更していない。
- result の進め方と実践の型の適用へ記録: 規範は rulebook-authoring-standard、document-metadata-standard、recipe-authoring-standard、template-authoring-standard、成果物 Frontmatter schema、共通実行規約、pm-review-viewpoints の vp-arc-conciseness・vp-dev-testability・vp-qe-omissions-consistency・vp-ux-language-consistency。sld-rulebook と pjr-8s4t-sld-kata-slim-pilot の対応結果を手本とし、bps の recipe・sample・template、既存成果物 bps-task-completion・bps-deliverable-evaluation、grade 結果 specdojo.bps-rulebook.yaml・bps-task-completion.yaml を確認した。指定された bps-init-required.md は存在しないため、利用可能な資料で判断できる範囲を改訂し、成果物は新規作成していない。
- finding の判断: source=grade の F002 は命名・ID規則に T-01・S-01・E-01 を集約して解消。F003 は rulebook の導入文・受入例を sample と同じ補充基準・補充依頼・依頼数量へ統一して解消。F001 の完成判定への検査コマンド明示要求は未解消として記録する。今回の明示方針と sld の試行に従い、業務の完成判定へコマンドを追加せず、共通の運用でリポジトリの検証へ委ねた。検査コマンドの正本は package.json・lefthook.yml と共通実行規約。次のアクションは再評価時にこの責務分担を照合すること。condense 由来の finding は提示なし。
- 章と文字数: 本文要件8群の名称・必須／条件付き区分と、成果物の章名・順序を維持した。rulebook 第2章だけ「位置づけと用語定義」から「位置づけ」へ変更。用語表8語は全体方針・本文要件・記述ガイドで定義でき、記述標準の重複省略に従ったため。空白・改行を除いた全文文字数は6,544→5,107字（78.04%）。sld 試行と同様に表の区切り行も除くと6,086→4,845字（79.61%）。UTF-8 は18,012→13,907バイト。
- 維持判断: 標準列、CDFD との境界、業務上の担当と完了責任、正常系・条件付き・主要例外、入力欠落時の扱い、例外の停止・再開条件、判定可能な受入条件は維持した。bps-task-completion の grade が指摘する複数責任主体や入力欠落対応は成果物側の不備と判断し、rulebook の基準を緩めなかった。共通の正本への追記案や保護設定の変更は不要。親 runner の lint・schema・typecheck・test は executor 内で重複実行していない。
- 適用外の検証: `npm run validate:schema:file`（変更したファイルはMarkdownのみで、YAML変更がない。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は docs/ja/specdojo/ 配下のみで、docs/ja/projects/ 配下の成果物変更がない。）
- 適用外の検証: `npm run validate:history-links`（登録簿・既存plan・resultなどの履歴ファイルを変更していない。）

<!-- specdojo:agent-protection-handoff -->

**保護機構による自動記録**: `agent-commit-scope` が agent の変更を止めた。適用するかどうかは人または対話型 orchestrator が agent 実行外で判断する。

- commit 対象外のパス: `docs/ja/specdojo/recipes/bps-recipe.md`, `docs/ja/specdojo/templates/bps-template.md`
- 変更理由: この節の上に agent が記入した申し送りを参照する。
- 変更後に必要な検証: この節の上に agent が記入した申し送りを参照する。
- block メッセージ: `commit-scope: integration blocked; 2 non-target changes (worktree kept):   docs/ja/specdojo/recipes/bps-recipe.md   docs/ja/specdojo/templates/bps-template.md`

次のアクション:

```text
worktree を保持して統合を停止した。対象外の変更を確認し、必要な変更は targets の見直しまたは別タスクで取り込む。型のカタログ・schema・メニューなどの対象外ファイルは、変更理由と提案差分を報告してから executor を再開する。
```

## 4. 進め方と実践の型の適用

rulebook-maintenance として、rulebook-authoring-standard、document-metadata-standard、recipe-authoring-standard、template-authoring-standard、成果物 Frontmatter schema、共通実行規約、`pm-review-viewpoints` の `vp-arc-conciseness`・`vp-dev-testability`・`vp-qe-omissions-consistency`・`vp-ux-language-consistency` を根拠にした。手本は sld-rulebook と pjr-8s4t-sld-kata-slim-pilot の対応結果である。bps の recipe・sample・template、既存成果物 bps-task-completion・bps-deliverable-evaluation、grade 結果を確認し、F002 と F003 は修正で解消した。bps-task-completion の grade が指摘する複数責任主体や入力欠落対応は成果物側の不備と判断し、rulebook の基準は緩めていない。標準列、CDFD との境界、担当と完了責任、正常系・条件付き・主要例外、入力欠落時の扱い、例外の停止・再開条件、判定可能な受入条件は維持した。
