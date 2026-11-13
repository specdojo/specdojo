---
specdojo:
  id: prj-0001:pjr-kbrm-project-kata-recipe-template-sync
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: hard
  owner: sol-executor
  registered_at: "2026-11-13T09:41:10Z"
  derived_from:
    - PJR-960C
  commit_type: docs
  commit_scope: kata
---

# PJR-KBRM プロジェクトの型 7 種類の recipe と template を、改訂した rulebook に合わせる

## 1. 概要

PJR-960C で改訂した rulebook に、recipe と template を合わせ、grade で出た sample の指摘も直す

## 2. 入力

- PJR-960C の schedule に recipe と template の手直しの段がなく（orchestrator の作りの誤り）、改訂後の grade（2026-11-13）で rulebook の指摘の多くが recipe・template との食い違いだった。indie が直すことを承認した

## 3. 完了条件

- 対象は 7 種類の型（pm-plan・pm-organization・pm-roles・pm-raci・pm-quality-management-plan・prj-assumptions-constraints-dependencies・prj-comparison-of-alternatives）の `docs/ja/specdojo/recipes/` と `docs/ja/specdojo/templates/` の recipe と template。
- recipe と template が、PJR-960C で改訂した rulebook（必須の章・項目・表の列名・禁止事項・判断の基準）と食い違わない。rulebook を正本とし、recipe は問いと作成の手順に、template は骨組みに責務を絞る。rulebook の規則を recipe や template で独自に再定義しない。
- 改訂後の grade（`execution/grade/results/specdojo.<型>-rulebook.yaml` と `-sample.yaml`、2026-11-13）の指摘を読み、直している。少なくとも次を含む。
  - pm-roles: recipe が schema で必須の `rulebook` のキーを禁じている点。
  - pm-raci: recipe と template が、改訂した担当の決まり（Schedule の owner の優先順など）と固定の Role 列の表記に合っていない点。
  - pm-quality-management-plan: rulebook で必須にした項目（対象期間・人と AI の境界・出口条件・証跡・記録先など）と列の分け方が、template と sample に合っていない点。
  - pm-plan: 前提の成果物の依存（カタログの雛形の `depends_on` との整合）と、recipe の確かめ方と表の欄の不一致。sample の成功基準 SC-04 の基準値の測り方を、運用の前に置く点。
  - pm-organization: recipe・template が必須のロールの一覧に追いついていない点。sample の名簿に BA・DEV・QE の担当がいない点。
  - prj-assumptions-constraints-dependencies・prj-comparison-of-alternatives: grade が上限で流れていないため、前回の grade の指摘と、rulebook との食い違いを確かめて直す。
- rulebook を直す必要が出た場合は最小限にし、理由を個票の対応結果に書く。代表の文書（prj-0001 の同名の文書）は変えない。sample は駄菓子屋の共通サンプル文脈を保つ。
- YAML の template・sample は schema に合っている（`npm run validate:schema:file`）。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分と行の文案で書いている（PJR-EPQ3）。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema` と親の検証が通っている。grade は統合の後に orchestrator が流す。grade を流せないことを理由に未完了としない。

## 4. 作業内容

| No  | 作業                               | 担当         | 状態 | メモ                                                                 |
| --- | ---------------------------------- | ------------ | ---- | -------------------------------------------------------------------- |
| 1   | recipe・template・sample を直す    | executor     | done | 7 系統の recipe・template を同期し、関連 sample とカタログ雛形も修正 |
| 2   | 統合の後に 7 種類の grade を流す   | orchestrator | open | -                                                                    |
| 3   | 確定の段（`T-PROJECT-KATA-*-140`） | indie        | open | -                                                                    |

## 5. 対応結果

### 5.1. 実施内容と成果物

- 7 系統の recipe は作成時の問い・手順・照合方法へ、template は章・表・記入欄へ責務を揃えた。欠けていた未決事項・見直しの作成手順も補った。
- 管理計画は、統合管理表に根拠と証跡・正本を追加し、`dct-project-management-template.yaml` の `pm-plan.depends_on` に概要・スコープ・成功基準・組織定義を追加した。管理計画の template にある直接根拠を依存から辿れるようにした。
- 組織定義は、各ロールの採用・未採用、判断理由・代替方針、使用可能な `owner` の集合を記入できるようにした。共通責務や名簿を組織定義に複製しない方針は保った。
- ロール定義は、recipe が必須の `rulebook` を禁止する矛盾を解消し、template に未採用ロールを除く案内を追加した。sample の OPS も初期の独立タスクを主導しないことを明示した。
- RACI は固定 Role 列を記入プレースホルダへ置き換え、WBS の明示担当を先に照合し、未指定の作成作業と承認・レビュー・外部待ちを区別する手順へ直した。sample の上位標準への根拠参照を揃え、共通の担当展開規則の再掲を削った。
- 品質管理計画は、適用期間・人と AI の境界、出口条件・証跡・記録先、再判定条件・責任、見直し・未決・保留の骨組みを揃えた。sample では重大性の境界とレビュー名を統一した。
- 前提・制約・依存は、端末の継続提供を依存とする分類へ統一し、項目 ID の保持・採番、受領条件の証跡・確認時期、変更記録の再確認時期と追従責任を補った。代替案比較は、業務適合の名称、軸の省略・統合理由、判定境界・集約方法、移行・撤退・後続作業の欄を揃えた。

### 5.2. grade 指摘の照合と判断

- 2026-11-13 の管理計画・組織定義・ロール定義・RACI・品質管理計画の rulebook / sample の全 finding を確認した。前提・制約・依存は rulebook の 2026-11-12、sample の 2026-10-17、代替案比較は rulebook の 2026-10-06、sample の 2026-10-17 の結果を確認した。
- SC-04 の運用前1か月の基準値は後続作業へ先送りできないため、管理計画 sample に対象確定→採取→照合→試用開始の依存と、`BA` の採取責任、`QE` の照合、`PM` のリスク管理を追加した。品質管理計画 sample の保留対象と引き継ぎも合わせた。SC-04 の運用後の合否を初期受入へ混ぜず、基準値採取を試用開始の準備条件とした。
- 名簿の不足は未決のまま残さず、[[specdojo:sample-authoring-standard|Sample 記述標準]] の共通文脈に従い、店主代表、開発担当、同行レビュー担当、技術メンター、家族利用者代表の架空の兼務を [[specdojo:pm-members-sample|メンバー定義 sample]] に記入した。BA・DEV・QE を含む採用済み8ロールを人間でカバーし、人物名を使わず役割ベースの nickname に揃えた。
- 前提・制約・依存の項目 ID・依存表の列名、代替案比較のリスク・技術実現性・業務適合は、PJR-960C 後の rulebook と sample で既に対応済みだったため保持した。旧 grade の指摘だけを理由に再構成しなかった。
- rulebook の変更は3件に限った。ロール定義は名称・重複説明と schema だけでは検出できない採用集合・コード重複の確認方法、RACI は表の骨組みの再掲削減・主担当基準の分割・用語統一、品質管理計画は重複削減・章への対応・重大性の判定責任・報告とリスク登録を補った。いずれも当該 grade の指摘を解消する最小限の変更である。
- prj-0001 の代表文書、grade サイドカー、result、登録簿一覧と個票のステータス項目は編集していない。

### 5.3. 検証と申し送り

Prettier、ロール定義 sample と展開後 template・メンバー定義 sample・カタログ雛形の schema、カタログ、履歴リンク、登録簿ビュー生成、差分検査が成功した。追加の整合確認で、採用集合と人間の担当・正式名称、small／medium／large の管理計画の根拠と依存閉包、品質管理の表の列、変更 Markdown の表の列数も確認した。カタログ検査は既存の再エクスポート参照・未作成文書の警告を出すが、終了コードは 0。実行記録の staged scan は対象0件・指摘0件だった。

実行コマンドと結果は executor evidence に記録し、親 runner の lint・schema・型検査・テストへ引き継ぐ。追加確認の一時ファイルは作業終了前に除去する。

統合後に orchestrator が7系統の rulebook / sample の grade を流し、指摘の解消を確認する。その後 indie が確定の段（`T-PROJECT-KATA-*-140`）を行う。保護された設定の変更案と未解消の判断事項はない。

### 5.4. CHANGELOG に書く事項

- 変更: プロジェクトの型7種類の recipe・template を改訂済み rulebook に同期し、管理計画の依存・根拠・証跡、ロール採用、RACI の担当展開、品質管理の判定・記録欄を整備。駄菓子屋 sample の人間の担当と運用前ベースラインの準備を修正。

## 6. 関連ドキュメント

- [[prj-0001:pjr-960c-project-kata]]
