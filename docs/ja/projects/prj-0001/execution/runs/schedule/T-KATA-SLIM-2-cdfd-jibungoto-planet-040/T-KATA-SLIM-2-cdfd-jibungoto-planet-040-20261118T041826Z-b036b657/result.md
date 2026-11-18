---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-cdfd-jibungoto-planet-040-20261118t041826z-b036b657
  type: exec-result
  task_id: T-KATA-SLIM-2-cdfd-jibungoto-planet-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-cdfd-jibungoto-planet-040/T-KATA-SLIM-2-cdfd-jibungoto-planet-040-20261118T041826Z-b036b657/plan.md
  started_at: "2026-11-18T04:18:32.751Z"
  completed_at: "2026-11-18T04:52:17.221Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - prj-0001:cdfd-jibungoto-planet
    - specdojo:cdfd-rulebook
---

# Edit Result

## 1. 実施内容

- cdfd-rulebook と、includes で取り込む `cdfd-mermaid-rulebook`・`cdfd-d2-rulebook` から、共通の運用の記述を外して簡潔にしました。各文書の全体方針に「共通の運用」を 1 項目だけ置きました。役割は適用先のメンバー定義、状態・承認・改訂・廃止・未決事項の引き継ぎは `document-metadata-standard` への参照にしています。
- 空白を除いた文字数は、cdfd-rulebook が 7,344 から 5,110（69.58%）、cdfd-mermaid-rulebook が 7,788 から 6,198（79.58%）、cdfd-d2-rulebook が 10,400 から 8,268（79.50%）です。三文書とも 8 割以下でした。見出しと Frontmatter は変更していません。
- F002・F004・F005・F006・F010 は、完成判定の単独チェックリストと状態昇格の説明を外す形で対応しました。代わりに、本文要件・記述ガイド・選択した記法・固有の禁止事項を併用する業務受入手順を置きました。条件ごとの pass / fail、非起動時の正常完了、入出力表への一度だけの掲載、図直後の注記、例外表・委譲表の全列を確認できます。再 grade は実施していません。
- 検証は Prettier の整形・check と `git diff --check` が成功しました。runner の lint・schema・unit・integration も成功しています。`lint:ts` と `typecheck` は変更種別により非適用です。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/cdfd-d2-rulebook.md`: cdfd-rulebook と同じ一覧に沿って、共通メタ情報の再掲と記法説明・例の反復を削減しました。全体方針に「共通の運用」を 1 項目置き、必須・条件付き・任意を示す構成表は維持しました。
- `docs/ja/specdojo/rulebooks/cdfd-mermaid-rulebook.md`: cdfd-rulebook と同じ一覧に沿って、共通メタ情報の再掲と記法説明・例の反復を削減しました。全体方針に「共通の運用」を 1 項目置き、必須・条件付き・任意を示す構成表は維持しました。
- `docs/ja/specdojo/rulebooks/cdfd-rulebook.md`: 役割の表と段落、status・承認・改訂・廃止の手順、文書品質検査の要求、未決事項の管理台帳列、本文の言い直しだけの用語表を外し、「共通の運用」への参照 1 項目に置き換えました。固有の判断基準、標準の列、良い例・悪い例、固有の禁止事項は残しました。完成判定のチェックリストは、条件ごとの pass / fail を確認する業務受入手順に改めました。

## 3. 申し送り

- F003・F007・F009 は範囲外の追従です。template は既にプロセス領域を表だけにする規定に沿っています。recipe と sample には領域の要約・主要入出力の箇条書きが残っています。 変更案として、recipe の使い方・全体手順・各章の問い・仕上げチェックから旧構成を除き、手順 5 に完了条件を、最終確認に対象期間・停止範囲・業務受入手順を反映します。sample は旧構成と目的・適用範囲の長さを現行規定へ合わせます。template は未決事項から決定者・決定時期の管理列を除きます。
- F001・F008・F011 は、人による依存状態の判断が残っています。cdfd 本体・template・sample は ready、Mermaid・D2 部品は draft のままです。影響先は cdfd・cdfd-overview・cdfd-uc の各系統です。 共通正本への追加案として、`document-metadata-standard` に、未確定の取り込み先を持つ場合の適用条件・影響先・確定までの扱いと判断記録を定めます。この運用手順は rulebook に再掲していません。
- `docs/ja/projects/prj-0001/040-current-state/cdfd-jibungoto-planet.md` は存在せず、成果物の実態との照合は未実施です。次のアクションは、カタログ上の現行パスまたは廃止状況を確認することです。
- reporter 向け実施内容・変更ファイル: docs/ja/specdojo/rulebooks/cdfd-rulebook.md、cdfd-mermaid-rulebook.md、cdfd-d2-rulebook.md のみを変更。各文書の全体方針に「共通の運用」を一項目置き、役割は適用先のメンバー定義、状態・承認・改訂・廃止・未決事項の引き継ぎはドキュメントメタ情報標準への参照にした。共通メタ情報の再掲、本文と重なる用語定義、記法説明と例の反復を削減した。成果物本体・recipe・template・sample・共通標準・grade サイドカー・result は変更していない。
- 文字数は各ファイル全体から空白文字を除いて計測。cdfd-rulebook.md: 7,344 → 5,110 字（69.58%）。cdfd-mermaid-rulebook.md: 7,788 → 6,198 字（79.58%）。cdfd-d2-rulebook.md: 10,400 → 8,268 字（79.50%）。全見出しと Frontmatter は変更前と一致し、記法二文書の必須・条件付き・任意を示す構成表も維持した。標準列・固有の判断基準・良い例と禁止例を維持した。
- 進め方と実践の型の適用の根拠: xp-common-conventions-template.md、xep-common-conventions-template.md、rulebook-authoring-standard.md、document-metadata-standard.md、sld-rulebook.md、PJR-8S4T の展開一覧、PJR-8TQJ、PJR-4NXR、対応する cdfd の recipe・template・sample、共通レビュー観点一覧を確認した。source=grade の記録は docs/ja/projects/prj-0001/execution/grade/results/specdojo.cdfd-rulebook.yaml。記録の `content_hash` は編集前の内容と一致し、F001〜F011 の全 anchor を編集前本文と照合した。計画に source=condense の記録はない。
- F002・F004・F005・F006・F010: 完成判定の単独チェックリストと状態昇格の説明を外し、本文要件・記述ガイド・選択した記法・固有の禁止事項を併用する業務受入手順へ変更。条件ごとの pass / fail、条件付き要件の非該当根拠、非起動時の正常完了、入出力表への一度だけの掲載、図直後の注記、例外表・委譲表の全列を確認するため、指摘された確認漏れを解消した。再 grade は実施していない。
- F003・F007・F009 は範囲外の追従として引き継ぐ。PJR-8TQJ の決定を根拠に、プロセス領域を表だけにする規定を維持した。template は既に同規定に沿うが、recipe と sample は領域の要約・主要入出力の箇条書きが残る。変更案: recipe の使い方・全体手順・各章の問い・仕上げチェックから旧構成を除き、手順5に完了条件、最終確認に対象期間・停止範囲と今回の業務受入手順を反映する。Frontmatter・状態・承認の確認は共通正本を参照する。sample の旧構成と目的・適用範囲の長さを現行規定へ合わせ、template の未決事項から決定者・決定時期の管理列を除く。
- F001・F008・F011 は人による依存状態の判断が残る。本体・template・sample は ready、Mermaid・D2 部品は draft のまま。共通部品の影響先は cdfd・cdfd-overview・cdfd-uc の各系統。状態の昇格や暫定適用の承認は行っていない。共通正本への追加案: document-metadata-standard.md に、未確定の取り込み先を持つ場合の適用条件・影響先・確定までの扱いと判断記録を定める。人が共通部品の確定または暫定適用条件を判断し、各系統との整合を確認する。運用手順を rulebook に再掲して埋めることは避けた。
- 計画に根拠として挙がる docs/ja/projects/prj-0001/040-current-state/cdfd-jibungoto-planet.md は存在しなかった。編集対象の三つの rulebook は存在するため、既存 sample・改訂決定・grade 記録から判断できる範囲を編集した。同成果物の実態との照合は未実施。次のアクションは、必要に応じてカタログ上の現行パスまたは廃止状況を確認すること。
- 検証: Prettier の整形・check と git diff --check が成功。見出し・Frontmatter・記法構成表の維持、共通運用が各文書一項目であること、三文書の文字数がそれぞれ80%以下であることも照合した。親 runner 指定の lint・schema・テストは重複実行していない。
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/specdojo/rulebooks/ のみで、docs/ja/projects/ 配下の成果物を変更していない。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票や既存の plan・result を変更していない。）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルは Markdown のみで、YAML ファイルの変更がない。）

## 4. 進め方と実践の型の適用

rulebook-maintenance として、grade 記録の F001〜F011 の全 anchor を編集前本文と照合しました。rulebook-authoring-standard、document-metadata-standard、改訂済みの sld-rulebook、PJR-8S4T の展開一覧、PJR-8TQJ、PJR-4NXR、cdfd の recipe・template・sample、共通レビュー観点一覧も根拠にしました。計画に source=condense の記録はありません。 F002・F004・F005・F006・F010 は、完成判定を業務受入手順へ改めて解消しました。F003・F007・F009 は recipe・sample・template が対象外のため変更案として引き継ぎました。F001・F008・F011 は人の判断が必要なため未解消です。 recipe・template・sample と矛盾する箇所は rulebook を正としました。章名と必須・条件付きの区分は維持しました。プロセス領域を表だけにする規定は、PJR-8TQJ の決定を根拠に維持しました。
