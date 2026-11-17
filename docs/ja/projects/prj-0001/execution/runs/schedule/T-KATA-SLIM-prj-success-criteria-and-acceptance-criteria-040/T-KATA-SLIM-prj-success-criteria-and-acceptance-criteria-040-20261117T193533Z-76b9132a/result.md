---
specdojo:
  id: prj-0001:xer-t-kata-slim-prj-success-criteria-and-acceptance-criteria-040-20261117t193533z-76b9132a
  type: exec-result
  task_id: T-KATA-SLIM-prj-success-criteria-and-acceptance-criteria-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-prj-success-criteria-and-acceptance-criteria-040/T-KATA-SLIM-prj-success-criteria-and-acceptance-criteria-040-20261117T193533Z-76b9132a/plan.md
  started_at: "2026-11-17T19:35:41.338Z"
  completed_at: "2026-11-17T20:03:09.711Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - prj-0001:prj-success-criteria-and-acceptance-criteria
    - specdojo:prj-success-criteria-and-acceptance-criteria-rulebook
---

# Edit Result

## 1. 実施内容

- 成功基準と受入条件の rulebook から、どの成果物にも共通する文書の運用の記述を外し、共通の正本への参照に置き換えた。
- grade の指摘 F001 と F002 を修正した。F001 は Frontmatter 節に入っていた本文ルールを記述ガイドへ統合した。F002 は番号付き章構成表を削除し、骨組みは宣言済みの template を正本とした。
- 空白と改行を除いた文字数は 4,590 字から 3,501 字（76.27%）になり、目安の 8 割以下を満たした。表の区切り行も除くと 4,128 字から 3,273 字（79.29%）である。
- runner の検証は `lint:fm`、`lint:md`、`lint:mermaid`、`lint:d2`、`test:integration`、`validate:schema`、`test:unit` が成功した。`lint:ts` と `typecheck` は変更種別により対象外である。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/prj-success-criteria-and-acceptance-criteria-rulebook.md`: 役割・status・承認・改訂と廃止・未決事項の台帳管理など共通運用の記述を外し、全体方針に「共通の運用」を 1 項目置いて `docs/ja/specdojo/standards/document-metadata-standard.md` などの正本を参照する形にした。文書品質の検査を業務の検証や受入条件に入れる記述も外した。F001 に対応し、4.2 節にあった表の分離・業務価値との対応付けを記述ガイドへ統合し、Frontmatter 節はメタ情報だけにした。F002 に対応し、番号付き章構成表を削除して骨組みを template に一元化し、各章の目的・必須／任意・受入条件を「本文要件」に残した。章名は「位置づけと用語定義」を「位置づけ」に、「本文構成（標準テンプレ）」を「本文要件」に変更した。成功基準 7 列・受入条件 8 列、時間区分、費用・作業負荷の測定、業務の判定手順、型固有の禁止事項は維持した。

## 3. 申し送り

- 章名を変更した 2 箇所は、用語表が本文要件や列の意味の言い直しだったことと、F002 および rulebook 記述標準に従ったことが理由である。成果物側の章名と、必須 4 章・任意 1 章の区分は維持した。
- 共通の正本への追記は不要と判断した。status・承認・改訂と廃止・未決事項の引き継ぎはメタ情報標準で、agent の最終判断禁止と非公開情報の禁止は人・組織定義標準で確認した。
- 成果物評価で指摘された合否基準や未確定事項の影響の不足は、rulebook ではなく成果物側で具体化すべきと判断した。rulebook には再現可能な判定条件と未決事項の影響の要件を維持・明確化した。
- 後続の変更案（今回は対象外で未編集）として、次の 3 点がある。recipe の「作成前に集める情報」「深掘り手順」から、lint を業務の測定方法とする記述を外す。recipe・template・sample の未決事項にある担当・決定時期・期限・責任者列や agent 承認禁止の再掲、template の人間の承認者指定は、共通運用へ寄せる。そのうえで、論点・判定への影響・当面の扱いを示す形にする。業務の確認者・承認者列と受入可否の判定手順は維持する。
- 変更ファイルは docs/ja/specdojo/rulebooks/prj-success-criteria-and-acceptance-criteria-rulebook.md のみ。成果物本体・recipe・template・sample・grade サイドカー・result は編集していません。result の記入は reporter に委ねます。
- 判断根拠: [[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]、[[specdojo:document-metadata-standard|ドキュメントメタ情報標準]]、[[prj-0001:pjr-8s4t-sld-kata-slim-pilot|sld 試行記録]]、[[specdojo:sld-rulebook|SLD 作成ルール]]、対象系統の recipe・template・sample、プロジェクトの成功基準・スコープ、execution/grade/results/ 配下の対応評価結果を確認しました。成功基準の時間区分、費用・作業負荷の測定、成功基準7列・受入条件8列、業務の判定手順と型固有の禁止事項を維持しました。
- F001（source=grade）: 評価サイドカーの行83・「推奨ルール」と照合し、表の分離・業務価値との対応を「記述ガイド」に統合しました。Frontmatter 節にはメタ情報だけを残しました。F002（source=grade）: 行90・「本文構成（標準テンプレ）」と照合し、番号付き章構成表を削除して、骨組みは宣言済み template を正本としました。各章の目的・必須／任意・受入条件は「本文要件」に残しました。両 finding は該当 viewpoint の判定根拠に照らして解消を確認しました。condense 由来の finding はありません。
- 章名変更の理由: 用語表が本文要件・列の意味の言い直しだったため「位置づけと用語定義」を「位置づけ」に変更。F002 と記述標準に従い「本文構成（標準テンプレ）」を「本文要件」に変更しました。配置・ID・ファイル名は同章内の箇条書きに集約し、Frontmatter と本文要件の不要な小見出しも整理しました。成果物側の章名と必須4章・任意1章の区分は維持しました。文字数は全文の空白・改行を除外して4,590→3,501字（76.27%）。表の区切り行も除外すると4,128→3,273字（79.29%）です。
- 共通の正本への追記は不要と判断しました。status・承認・改訂廃止・未決事項の引き継ぎはメタ情報標準で、削除した agent の最終判断禁止・非公開情報の禁止は人・組織定義標準の「Agent 委任方針」「整合性ルール」で確認しました。成果物評価で指摘された合否基準や未確定事項の影響の不足は、成果物側で具体化すべき事項と判断し、再現可能な判定条件と未決事項の影響の要件を維持・明確化しました。
- 後続変更案: recipe の「作成前に集める情報」「深掘り手順」から lint を業務の測定方法とする記述を外す。recipe の未決事項の担当・決定時期・agent 承認禁止の再掲、template の未決事項の期限・責任者列と人間の承認者指定、sample の未決事項の期限・責任者列を共通運用へ寄せ、論点・判定への影響・当面の扱いを示す形にする。業務の確認者・承認者列と受入可否の判定手順は維持する。今回これらは変更対象外のため未編集です。
- 適用外の検証: `npm run validate:schema:file`（変更は Markdown rulebook のみで、変更した YAML ファイルがありません。）
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/specdojo/rulebooks/ 配下のみで、docs/ja/projects/ 配下の成果物を変更していません。）
- 適用外の検証: `npm run validate:history-links`（登録簿の個票および既存 plan・result を変更していません。）

## 4. 進め方と実践の型の適用

根拠として確認した規範は、rulebook 記述標準、ドキュメントメタ情報標準、人・組織定義標準である。成果物・事例は、sld の試行記録と改訂済み sld rulebook、対象系統の recipe・template・sample、プロジェクトの成功基準・スコープ、grade の評価結果を確認した。F001（source=grade、行 83「推奨ルール」）は、表の分離・業務価値との対応を記述ガイドへ統合して解消した。F002（source=grade、行 90「本文構成（標準テンプレ）」）は、章構成表を削除して template を正本とし、章ごとの要件だけを残して解消した。どちらも該当 viewpoint の判定根拠に照らして解消を確認した。condense 由来の finding と、成果物から届いた Kata 原因の finding はない。未解消・根拠不足の finding はない。矛盾時は rulebook を正とし、recipe・template・sample は変更せず、合わせて直す点を変更案として handoff に残した。
